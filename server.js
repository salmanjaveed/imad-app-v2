var express = require('express');
var morgan = require('morgan');

var path = require('path');

var Pool = require('pg').Pool;

var crypto = require('crypto');

var bodyParser = require('body-parser');
var session = require('express-session');


var config = {
    user: "salmanjaveed",
    host: "db.imad.hasura-app.io",
    database: "salmanjaveed",
    port: "5432",
    password: process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));

app.use(bodyParser.json());

var pool = new Pool(config);

app.use(session({ secret: 'someRandomSecretValuet', cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 }, resave: true, saveUninitialized: true }));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});


var g_loggedinUserName = ''; // Keep the user loggedin
var g_isUserloggedIn = false; // set flag to check if user is logged in
var g_loggedinUserId = 0;
app.get('/auth/check-login', function (req, res) {
   
   if (req.session && req.session.auth && req.session.auth.userId) {
       console.log(req.session, req.session.auth, req.session.auth.userId);
       //Load the user object
       pool.query('SELECT * FROM "user" WHERE id= $1', [req.session.auth.userId], function (err, result) {
          if (err) { 
              res.status(500).send(err.toString());
          }  else {
              g_isUserloggedIn = true;
              g_loggedinUserName = result.rows[0].username;
              g_loggedinUserId = result.rows[0].id;
              res.send(result.rows[0].username);
          }
       });
   } else {
       res.status(400).send('You are not Logged In!');
       
   }
    
});


app.get('/logout', function (req, res) {
   delete req.session.auth;
   g_loggedinUserName = ''; // Keep the user loggedin
   g_isUserloggedIn = false; // set flag to check if user is logged in
   g_loggedinUserId = 0;
   //res.send('<html><body>Logged out!<br/><br/><a href="/">Back to home</a></body></html>');
 //  console.log(path.basename(__filename));
   res.sendFile(path.join(__dirname, '/', 'index.html'));
});



var fs = require('fs'),
    filePath = './ui/page.html';

// this for async way
/*fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) throw err;
    console.log(data);
});*/

//this is sync way
var pagefile = fs.readFileSync(filePath, 'utf8');


function createTemplate(data) {
    
    var title = data.title;
    var heading = data.heading;
    var content = data.content;
    var date = data.date;
    var username = data.username;

    var htmlTemplate = eval('`' +  pagefile + '`');
 
    return htmlTemplate;
}


function hash(input, salt) {
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');

  return ['pbkdf2Sync', "10000", salt,  (hashed.toString('hex'))].join('$');
}

app.get('/hash/:input', function(req, res) {
    var hashedString = hash(req.params.input, "Salmans-App-is-working-with-hash");
    res.send(hashedString);
});

app.get('/get-articles', function (req, res) {
   // make a select request
   // return a response with the results - select all articles along with the username
   pool.query('SELECT article.*, "user".username FROM article, "user" WHERE article.user_id = "user".id ORDER BY date DESC', function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          console.log(JSON.stringify(result.rows));
          res.send(JSON.stringify(result.rows));
      }
   });
});

app.get('/get-comments/:articleName', function (req, res) {
   // make a select request
   // return a response with the results
   pool.query('SELECT comment.*, "user".username FROM article, comment, "user" WHERE article.title = $1 AND article.id = comment.article_id AND comment.user_id = "user".id ORDER BY comment.timestamp DESC', [req.params.articleName], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(result.rows));
      }
   });
});

app.get('/articles/:articleName', function (req, res) {
  // SELECT * FROM article WHERE title = '\'; DELETE WHERE a = \'asdf'
  pool.query("SELECT * FROM article WHERE title = $1", [req.params.articleName], function (err, result) {
    if (err) {
        res.status(500).send(err.toString());
    } else {
        if (result.rows.length === 0) {
            res.status(404).send('Article not found');
        } else {
            var articleData = result.rows[0];
            res.send(createTemplate(articleData));
           
        }
    }
  });
});


//Create user function 
app.post('/create-user', function (req, res) {
   // username, password
   // {"username": "Salman", "password": "password"}
   // JSON
   var username = req.body.username;
   var password = req.body.password;
   var salt = crypto.randomBytes(128).toString('hex');
   var dbString = hash(password, salt);
   pool.query('INSERT INTO "user" (username, password) VALUES ($1, $2)', [username, dbString], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
            g_loggedinUserName = username; // Keep the user loggedin
            g_isUserloggedIn = true; // set flag to check if user is logged in
      /*     //get the created users id in to the variable
            pool.query('SELECT id FROM article ORDER BY id DESC LIMIT 1', function (err, result) {
                if (err) {
                    res.status(500).send(err.toString() + 'Cannot get create user Id!');
                } else {
                    g_loggedinUserId = result.rows[0].id;
                }
                }
            } */
          res.send('User successfully created: ' + username);
      }
   });
});

app.post('/login', function (req, res) {
   var username = req.body.username;
   var password = req.body.password;
   
   pool.query('SELECT * FROM "user" WHERE username = $1', [username], function (err, result) {
      if (err) {
         // alert(res.send(err.toString()));
          res.status(500).send(err.toString());
      } else {
          if (result.rows.length === 0) {
              res.status(403).send('username/password is invalid');
          } else {
              // Match the password
              var dbString = result.rows[0].password;
              var salt = dbString.split('$')[2];
              var hashedPassword = hash(password, salt); // Creating a hash based on the password submitted and the original salt
              if (hashedPassword === dbString) {
                
                // Set the session
                req.session.auth = {userId: result.rows[0].id};
                // set cookie with a session id
                // internally, on the server side, it maps the session id to an object
                // { auth: {userId }}
                 g_loggedinUserName = username; // Keep the user loggedin
                 g_isUserloggedIn = true; // set flag to check if user is logged in
                res.send('credentials correct!');
                
              } else {
                res.status(403).send('username/password is invalid');
              }
          }
      }
   });
});


app.post(`/submit-comment/:articleName`, function (req, res) {
   // Check if the user is logged in
    if (req.session && req.session.auth && req.session.auth.userId) {
        // First check if the article exists and get the article-id
        pool.query('SELECT * from article where title = $1', [req.params.articleName], function (err, result) {
            if (err) {
                res.status(500).send(err.toString());
            } else {
                if (result.rows.length === 0) {
                    res.status(400).send('Article not found');
                } else {
                    var articleId = result.rows[0].id;
                    // Now insert the right comment for this article
                    pool.query(
                        "INSERT INTO comment (comment, article_id, user_id) VALUES ($1, $2, $3)",
                        [req.body.comment, articleId, req.session.auth.userId],
                        function (err, result) {
                            if (err) {
                                res.status(500).send(err.toString());
                            } else {
                                res.status(200).send('Comment inserted!');
                            }
                        });
                }
            }
       });     
    } else {
        res.status(403).send('Only logged in users can comment');
    }
});
 
app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/prof-pic.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'prof-pic.jpg'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/favicon.ico', function (req, res) {
  res.sendFile(path.join(__dirname, '/', 'favicon.ico'));
});

app.get('/articles/css/default.css', function (req, res) {
   res.sendFile(path.join(__dirname,'css','default.css')); 
});

app.get('/articles/css/media-queries.css', function (req, res) {
   res.sendFile(path.join(__dirname,'css','media-queries.css')); 
});

app.get('/articles/js/modernizr.js', function (req, res) {
   res.sendFile(path.join(__dirname,'js','modernizr.js')); 
}); 

app.get('/articles/css/layout.css', function (req, res) {
   res.sendFile(path.join(__dirname,'css','layout.css')); 
});

app.get('/articles/images/thumb.jpg', function (req, res) {
   res.sendFile(path.join(__dirname,'images','thumb.jpg')); 
});

app.get('/articles/js/jquery-migrate-1.2.1.min.js', function (req, res) {
   res.sendFile(path.join(__dirname,'js','jquery-migrate-1.2.1.min.js')); 
});

app.get('/articles/js/main.js', function (req, res) {
   res.sendFile(path.join(__dirname,'js','main.js')); 
});

app.get('/articles/css/fonts.css', function (req, res) {
   res.sendFile(path.join(__dirname,'css','fonts.css')); 
});

app.get('/articles/css/font-awesome/css/font-awesome.min.css', function (req, res) {
   res.sendFile(path.join(__dirname,'css/font-awesome/css','font-awesome.min.css')); 
});

app.get('/articles/css/img/header-content-bg.png', function (req, res) {
   res.sendFile(path.join(__dirname,'css/img','header-content-bg.png')); 
});

app.get('/articles/css/fonts/merriweather/merriweather-regular-webfont.woff', function (req, res) {
   res.sendFile(path.join(__dirname,'css/fonts/merriweather','/merriweather-regular-webfont.woff')); 
});

app.get('/articles/css/fonts/opensans/OpenSans-Regular-webfont.woff', function (req, res) {
   res.sendFile(path.join(__dirname,'css/fonts/opensans','OpenSans-Regular-webfont.woff')); 
});

app.get('/articles/css/fonts/opensans/OpenSans-Light-webfont.woff', function (req, res) {
   res.sendFile(path.join(__dirname,'/css/fonts/opensans','OpenSans-Light-webfont.woff')); 
});

app.get('/articles/css/font-awesome/fonts/fontawesome-webfont.woff', function (req, res) {
   res.sendFile(path.join(__dirname,'css/font-awesome/fonts','fontawesome-webfont.woff')); 
});

app.get('/articles/css/font-awesome/fonts/fontawesome-webfont.ttf', function (req, res) {
   res.sendFile(path.join(__dirname,'css/font-awesome/fonts','fontawesome-webfont.ttf')); 
});


app.get('/articles/css/fonts/opensans/OpenSans-Bold-webfont.woff', function (req, res) {
   res.sendFile(path.join(__dirname,'/css/fonts/opensans','OpenSans-Bold-webfont.woff')); 
});

app.get('/articles/css/fonts/opensans/OpenSans-Semibold-webfont.woff', function (req, res) {
   res.sendFile(path.join(__dirname,'css/fonts/opensans','OpenSans-Semibold-webfont.woff')); 
});

app.get('/articles/css/fonts/merriweather/merriweather-regular-webfont.ttf', function (req, res) {
   res.sendFile(path.join(__dirname,'css/fonts/merriweather','merriweather-regular-webfont.ttf')); 
});


app.get('/articles/css/fonts/opensans/OpenSans-Light-webfont.ttf', function (req, res) {
   res.sendFile(path.join(__dirname,'css/fonts/opensans','OpenSans-Light-webfont.ttf')); 
});

app.get('/articles/css/fonts/opensans/OpenSans-Regular-webfont.ttf', function (req, res) {
   res.sendFile(path.join(__dirname,'css/fonts/opensans','OpenSans-Regular-webfont.ttf')); 
});

app.get('/articles/ui/main.js', function (req, res) {
   res.sendFile(path.join(__dirname,'ui','main.js')); 
});

app.get('/css/default.css', function (req, res) {
   res.sendFile(path.join(__dirname,'css','default.css')); 
});

app.get('/css/media-queries.css', function (req, res) {
   res.sendFile(path.join(__dirname,'css','media-queries.css')); 
});

app.get('/js/modernizr.js', function (req, res) {
   res.sendFile(path.join(__dirname,'js','modernizr.js')); 
}); 

app.get('/css/layout.css', function (req, res) {
   res.sendFile(path.join(__dirname,'css','layout.css')); 
});

app.get('/images/thumb.jpg', function (req, res) {
   res.sendFile(path.join(__dirname,'images','thumb.jpg')); 
});

app.get('/js/jquery-migrate-1.2.1.min.js', function (req, res) {
   res.sendFile(path.join(__dirname,'js','jquery-migrate-1.2.1.min.js')); 
});

app.get('/js/main.js', function (req, res) {
   res.sendFile(path.join(__dirname,'js','main.js')); 
});

app.get('/css/fonts.css', function (req, res) {
   res.sendFile(path.join(__dirname,'css','fonts.css')); 
});

app.get('/css/font-awesome/css/font-awesome.min.css', function (req, res) {
   res.sendFile(path.join(__dirname,'css/font-awesome/css','font-awesome.min.css')); 
});

app.get('/css/img/header-content-bg.png', function (req, res) {
   res.sendFile(path.join(__dirname,'css/img','header-content-bg.png')); 
});

app.get('/css/fonts/merriweather/merriweather-regular-webfont.woff', function (req, res) {
   res.sendFile(path.join(__dirname,'css/fonts/merriweather','/merriweather-regular-webfont.woff')); 
});

app.get('/css/fonts/opensans/OpenSans-Regular-webfont.woff', function (req, res) {
   res.sendFile(path.join(__dirname,'css/fonts/opensans','OpenSans-Regular-webfont.woff')); 
});

app.get('/css/fonts/opensans/OpenSans-Light-webfont.woff', function (req, res) {
   res.sendFile(path.join(__dirname,'/css/fonts/opensans','OpenSans-Light-webfont.woff')); 
});

app.get('/css/font-awesome/fonts/fontawesome-webfont.woff', function (req, res) {
   res.sendFile(path.join(__dirname,'css/font-awesome/fonts','fontawesome-webfont.woff')); 
});

app.get('/css/font-awesome/fonts/fontawesome-webfont.ttf', function (req, res) {
   res.sendFile(path.join(__dirname,'css/font-awesome/fonts','fontawesome-webfont.ttf')); 
});


app.get('/css/fonts/opensans/OpenSans-Bold-webfont.woff', function (req, res) {
   res.sendFile(path.join(__dirname,'/css/fonts/opensans','OpenSans-Bold-webfont.woff')); 
});

app.get('/css/fonts/opensans/OpenSans-Semibold-webfont.woff', function (req, res) {
   res.sendFile(path.join(__dirname,'css/fonts/opensans','OpenSans-Semibold-webfont.woff')); 
});

app.get('/css/fonts/merriweather/merriweather-regular-webfont.ttf', function (req, res) {
   res.sendFile(path.join(__dirname,'css/fonts/merriweather','merriweather-regular-webfont.ttf')); 
});


app.get('/css/fonts/opensans/OpenSans-Light-webfont.ttf', function (req, res) {
   res.sendFile(path.join(__dirname,'css/fonts/opensans','OpenSans-Light-webfont.ttf')); 
});

app.get('/css/fonts/opensans/OpenSans-Regular-webfont.ttf', function (req, res) {
   res.sendFile(path.join(__dirname,'css/fonts/opensans','OpenSans-Regular-webfont.ttf')); 
});

app.get('/articles/images/user-01.png', function (req, res) {
   res.sendFile(path.join(__dirname,'images','user-01.png')); 
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(process.env.PORT || 8080, function () {
  console.log(`IMAD course app listening on port ${port} || 8080}!`);
});
