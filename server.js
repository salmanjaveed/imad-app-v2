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


/*
app.use(session({
    'secret': 'someRandomSecretValue',
    'cookie': { maxAge: 1000 * 60 * 60 * 24 * 30}
}));
*/

app.use(session({ secret: 'someRandomSecretValuet', cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 }, resave: true, saveUninitialized: true }));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});



app.get('/auth/check-login', function (req, res) {
   
   if (req.session && req.session.auth && req.session.auth.userId) {
       console.log(req.session, req.session.auth, req.session.auth.userId);
       //Load the user object
       pool.query('SELECT * FROM "user" WHERE id= $1', [req.session.auth.userId], function (err, result) {
          if (err) { 
              res.status(500).send(err.toString());
          }  else {
              res.send(result.rows[0].username);
          }
       });
   } else {
       res.status(400).send('You are not Logged In!');
       
   }
    
});



function createTemplate(data) {
    
    var title = data.title;
    var heading = data.heading;
    var content = data.content;
        
    var htmlTemplate = `
    <html>
    <head>
            <meta name=viewport content="width=device-width, initial-scale=1.0">
            <link href="/ui/style.css" rel="stylesheet" />
            <title>
                ${title}
            </title>
    </head>    
    <body>
        <div class="container">
            <div class="linker-div">
                <a href="/" class="linker">Home</a>
               
            </div>
        
            <div class="container2">
                    <h1>${heading}</h1>
                    ${content}
            </div>
        </div>      
       
    </body>    
    </html>`;
    
    return htmlTemplate;
}

/*

var counter = 0;
app.get('/counter', function (req, res) {
    counter = counter +  1;
    res.send(counter.toString()); 
});

var names = [];
var comments = [];
app.get('/comment', function (req, res) {
    
    var name = req.query.name;
    var comment = req.query.comment;
    comment = '<strong>' +  name + '</strong>' + ' says :' + comment;
    names.push(name);
    comments.push(comment);
    res.send(JSON.stringify(comments)); 
 //   res.send({'comment': JSON.stringify(comments), 'name': JSON.stringify(names)});
});

var pool = new Pool(config);
app.get('/articles/:articlename', function (req, res) {
 pool.query( "SELECT * FROM article WHERE title = '" + req.params.articlename +"'", function( err, result) {
     if (err) {
         res.status(500).send(err.toString());
     }
     else {
         if (result.rows.length === 0)
         {
             res.status(404).send('Article Not Found!!!');
         }
         else {
             
             res.send(createTemplate(result.rows[0]));
         }
     }
 });
});
*/

/*
app.get('/:articleName', function (req, res) {
 var articleName = req.params.articleName;
 res.send(createTemplate(articles[articleName]));
});
*/

function hash(input, salt) {
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
 /*   var returnString = `
    <table width="150" border="0" align="center" cellpadding="5" cellspacing="0" style="border-collapse:collapse;border:1px dotted #8c0400;font-family:arial,helvetica,sans-serif;">
        <tbody>
            <tr>
                <td style="background-color:#ffe8ee;">
            
                    Function
                            
                </td>
                <td>
                        
                     pbdkf2Sync
                            
                </td>
            </tr>
            <tr>
                <td style="background-color:#ffe8ee;">
                            
                     Salt Used
                            
                </td><td>
                            
                      ${salt}
                            
                </td></tr><tr><td style="background-color:#ffe8ee;">
                    
                      Iterations
                            
                </td><td>
                            
                     10000
                            
                </td>
            </tr>
            <tr>
                <td style="background-color:#ffe8ee;">
                            
                     Hash String
                            
                </td>
                <td> 
                    <div style="word-wrap: break-word;">` + 
                            
                                hashed.toString("hex") + `</div>
                            
                </td>
            </tr>
        </tbody>
    </table> `;
    */
    
 //   return (returnString);
  return ['pbkdf2Sync', "10000", salt,  (hashed.toString('hex'))].join('$');
}

app.get('/hash/:input', function(req, res) {
    var hashedString = hash(req.params.input, "Salmans-App-is-working-with-hash");
    res.send(hashedString);
});

app.get('/logout', function (req, res) {
   delete req.session.auth;
   res.send('<html><body>Logged out!<br/><br/><a href="/">Back to home</a></body></html>');
});

app.get('/get-articles', function (req, res) {
   // make a select request
   // return a response with the results
   pool.query('SELECT * FROM article ORDER BY date DESC', function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
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
 
 /*
var articles = {
    'article-one': { title: 'This is the first title 1/3 in a series',
                heading: 'This is the first heading 1/3 in a series',
                content: `
            <p>First paragraph</p>
            <p>
                This is the content of the paragraph which will be displayed on the page of the website that we are creating. Although, this seems to be the first of many files, that we are going use, we have to be very careful in doing so.
            </p>
            <p>
                While still at it, why not have another paragraph to go with the first one. We Just want to see if the files that we are uploading on github works well with the git and the imad host.
                
            </p>
`
    },
    'article2': { title: 'This is the second title 2/3 in a series',
                heading: 'This is the first heading 2/3 in a series',
                content: `
            <p>Second paragraph</p>
            <p>
                This is the content of the paragraph which will be displayed on the page of the website that we are creating. Although, this seems to be the first of many files, that we are going use, we have to be very careful in doing so.
            </p>
            <p>
                While still at it, why not have another paragraph to go with the first one. We Just want to see if the files that we are uploading on github works well with the git and the imad host.
                
            </p>
`
    },
    'article-3': { title: 'This is the third title 3/3 in a series',
                heading: 'This is the first heading 3/3 in a series',
                content: `
            <p>Third paragraph</p>
            <p>
                This is the content of the paragraph which will be displayed on the page of the website that we are creating. Although, this seems to be the first of many files, that we are going use, we have to be very careful in doing so.
            </p>
            <p>
                While still at it, why not have another paragraph to go with the first one. We Just want to see if the files that we are uploading on github works well with the git and the imad host.
                
            </p>
`
    }
};
*/

/*
app.get('/aa', function (req, res) {
  res.send(req.baseUrl+" <br> "+req.body+" <br> "+req.cookies+" <br> "+req.fresh+" <br> "+req.hostname+" <br> "+req.ip+" <br> "+req.ips+" <br> "+req.originalUrl+" <br> "+req.params+" <br> "+req.path+" <br> "+req.protocol+" <br> "+req.query+" <br> "+req.route+" <br> "+req.secure+" <br> "+req.signedCookies+" <br> "+req.stale+" <br> "+req.subdomains+" <br> "+req.xhr+" <br> ");
});
*/


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

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(process.env.PORT || 8080, function () {
  console.log(`IMAD course app listening on port ${port} || 8080}!`);
});
