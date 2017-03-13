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


var fs = require('fs'),
    filePath = './ui/page.html';

// this for async way
/*fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) throw err;
    console.log(data);
});*/

//this is sync way
var pagefile = fs.readFileSync(filePath, 'utf8');
//console.log(pagefile);


function createTemplate(data) {
    
    var title = data.title;
    var heading = data.heading;
    var content = data.content;
    var date = data.date;
    var username = data.username;
/*
 var htmlTemplate = ` ${pagefile} `;
 console.log(htmlTemplate);
 */
    var htmlTemplate = `
<!DOCTYPE html>
<!--[if lt IE 8 ]><html class="no-js ie ie7" lang="en"> <![endif]-->
<!--[if IE 8 ]><html class="no-js ie ie8" lang="en"> <![endif]-->
<!--[if IE 9 ]><html class="no-js ie ie9" lang="en"> <![endif]-->
<!--[if (gte IE 8)|!(IE)]><!--><html class="no-js" lang="en"> <!--<![endif]-->
<head>

   <!--- Basic Page Needs
   ================================================== -->
   <meta charset="utf-8">
	<title>${title}</title>
	<meta name="description" content="">  
	<meta name="author" content="">

	<!-- mobile specific metas
   ================================================== -->
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

    <!-- CSS
    ================================================== -->
   <link rel="stylesheet" href="css/default.css">
	<link rel="stylesheet" href="css/layout.css">  
	<link rel="stylesheet" href="css/media-queries.css">   

   <!-- Script
   ================================================== -->
	<script src="js/modernizr.js"></script>

   <!-- Favicons
	================================================== -->
	<link rel="shortcut icon" href="favicon.png" >

</head>

<body class="page">

   <!-- Header
   ================================================== -->
   <header id="top">

   	<div class="row">

   		<div class="header-content twelve columns">

		      <h1 id="logo-text"><a href="index.html" title="">IMAD 2017.</a></h1>
				<p id="intro">A Simple Blog Project by Salman Javeed</p>

			</div>			

	   </div>

	   <nav id="nav-wrap"> 

	   	<a class="mobile-btn" href="#nav-wrap" title="Show navigation">Show Menu</a>
		   <a class="mobile-btn" href="#" title="Hide navigation">Hide Menu</a>

	   	<div class="row">    		            

			   	<ul id="nav" class="nav">
			      	<li><a href="index.html">Home</a></li>
			      	<li><a href="#" id="sign-in" onClick="loadLogin()">Sign in/up</a></li>
                    		
			   	</ul> <!-- end #nav -->			   	 

	   	</div> 

	   </nav> <!-- end #nav-wrap --> 	     

   </header> <!-- Header End -->

   <!-- Content
   ================================================== -->
   <div id="content-wrap">

   	<div class="row">

   		<div id="main" class="eight columns">

   			<section class="page">					

					<h2 class="entry-title" id="article-title">
							${heading}
					</h2>
					<h3 id="article-details">
                    	Posted on ${date} • by ${username}
                    </h3>
					<p class="lead" id="article-content">${content}</p>

					<div class="row"> 

      			</div>

			      <div class="row"> 
			      </div>					

				</section> <!-- End page -->

   		</div> <!-- End main -->


   		<div id="sidebar" class="four columns">

   			<div class="widget widget_search">
                  <h3>Search</h3> 
                  <form action="#">
					<input type ="text" id="username" placeholder="Your Username" class="text-search">
					<input type="password" id="password" placeholder="Your Password" class="text-search">
                    <!-- <input type="text" value="Search here..." onblur="if(this.value == '') { this.value = 'Search here...'; }" onfocus="if (this.value == 'Search here...') { this.value = ''; }" class="text-search">
                     <input type="submit" value="" class="submit-search" disabled>-->
					 <input type="BUTTON" id="login_btn" class="button" value="Login">
					 <input type="BUTTON" id="register_btn" class="button" value="Register">
					 

                  </form>
               </div>

   			<div class="widget widget_categories group">
   				<h3>Articles</h3> 
   				<ul>
                <li><a href="#" title="article 1">Article 1</a></li>
<!--
						<li><a href="#" title="">Wordpress</a> (2)</li>
						<li><a href="#" title="">Ghost</a> (14)</li>
						<li><a href="#" title="">Joomla</a> (5)</li>
						<li><a href="#" title="">Drupal</a> 3</li>
						<li><a href="#" title="">Magento</a> (2)</li>
						<li><a href="#" title="">Uncategorized</a> (9)</li>						
-->
					</ul>
				</div>

   
   <!--- 
   *
   * We will show some stats 
   *
   ***** -->
     <h3>Stats</h3>

            <ul class="stats-tabs" id="stat-tab">
<!--			      <li><a href="#">1,234 <em>Sasuke</em></a></li> -->
                        <li><a href="#">0 <em>Visitors</em></a></li>
                        <li><a href="#">0 <em>Articles</em></a></li>
                        <li><a href="#">0 <em>Comments</em></a></li>
                        <li><a href="#">0 <em>Registered Users</em></a></li>
		      </ul>
   
   		</div> <!-- end sidebar -->

   	</div> <!-- end row -->

   </div> <!-- end content-wrap -->


   <!-- Footer
   ================================================== -->
   <footer>

      <div class="row"> 

      	<div class="twelve columns">	
				<ul class="social-links">
               <li><a href="#"><i class="fa fa-facebook"></i></a></li>
               <li><a href="#"><i class="fa fa-twitter"></i></a></li>
               <li><a href="#"><i class="fa fa-google-plus"></i></a></li>               
               <li><a href="#"><i class="fa fa-github-square"></i></a></li>
               <li><a href="#"><i class="fa fa-instagram"></i></a></li>
               <li><a href="#"><i class="fa fa-flickr"></i></a></li>               
               <li><a href="#"><i class="fa fa-skype"></i></a></li>
            </ul>			
      	</div>
      	
         <div class="six columns info">

            <h3> About Salman</h3> 

            <p align="justify">I graduated in Computer Science and have an advanced systems management diploma from NIIT. But, i am an entrepreneur in a totally different field. Computers and coding have always been my love, and i have made a few websites, and i am quite proficient in xBases.
            </p>
			<blockquote>
            <p>Someday, i hope to make a mobile app, all by myself. Difficult but not impossible</p>
			<cite>
            Salman Javeed </cite> </blockquote>
         </div>

         <div class="four columns">

            <h3>Photostream</h3>
            
            <ul class="photostream group">
               <li><a href="#"><img alt="thumbnail" src="images/thumb.jpg"></a></li>
               <li><a href="#"><img alt="thumbnail" src="images/thumb.jpg"></a></li>
               <li><a href="#"><img alt="thumbnail" src="images/thumb.jpg"></a></li>
               <li><a href="#"><img alt="thumbnail" src="images/thumb.jpg"></a></li>
               <li><a href="#"><img alt="thumbnail" src="images/thumb.jpg"></a></li>
               <li><a href="#"><img alt="thumbnail" src="images/thumb.jpg"></a></li>
               <li><a href="#"><img alt="thumbnail" src="images/thumb.jpg"></a></li>
               <li><a href="#"><img alt="thumbnail" src="images/thumb.jpg"></a></li>
            </ul>           

         </div>

         <div class="two columns">
            <h3 class="social">Navigate</h3>

            <ul class="navigate group">
               <li><a href="#">Home</a></li>
               <li><a href="#">Blog</a></li>
               <li><a href="#">Demo</a></li>
               <li><a href="#">Archives</a></li>
               <li><a href="#">About</a></li>
            </ul>
         </div>

         <p class="copyright">&copy; Copyright 2014 Keep It Simple. &nbsp; Design by <a title="Styleshout" href="http://www.styleshout.com/">Styleshout</a>.</p>
        
      </div> <!-- End row -->

      <div id="go-top"><a class="smoothscroll" title="Back to Top" href="#top"><i class="fa fa-chevron-up"></i></a></div>

   </footer> <!-- End Footer-->


   <!-- Java Script
   ================================================== -->
   <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
   <script>window.jQuery || document.write('<script src="js/jquery-1.10.2.min.js"><\/script>')</script>
   <script type="text/javascript" src="js/jquery-migrate-1.2.1.min.js"></script>  
   <script src="js/main.js"></script>

</body>

</html>
`;
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
