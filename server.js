var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');


var config = {
    user: "salmanjaveed",
    host: "db.imad.hasura-app.io",
    database: "salmanjaveed",
    port: "5432",
    password: process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
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
app.get('/aa', function (req, res) {
  res.send(req.baseUrl+" <br> "+req.body+" <br> "+req.cookies+" <br> "+req.fresh+" <br> "+req.hostname+" <br> "+req.ip+" <br> "+req.ips+" <br> "+req.originalUrl+" <br> "+req.params+" <br> "+req.path+" <br> "+req.protocol+" <br> "+req.query+" <br> "+req.route+" <br> "+req.secure+" <br> "+req.signedCookies+" <br> "+req.stale+" <br> "+req.subdomains+" <br> "+req.xhr+" <br> ");
});
*/

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

/*
app.get('/:articleName', function (req, res) {
 var articleName = req.params.articleName;
 res.send(createTemplate(articles[articleName]));
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

function hash(input, salt) {
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    var returnString = `
    <table width="150" border="0" align="center" cellpadding="5" cellspacing="0" style="border-collapse:collapse;border:1px dotted #8c0400;font-family:arial,helvetica,sans-serif;"><tbody><tr><td style="background-color:#ffe8ee;">

Function

</td><td>

pbdkf2Sync

</td></tr><tr><td style="background-color:#ffe8ee;">

Salt Used

</td><td>

${salt}

</td></tr><tr><td style="background-color:#ffe8ee;">

Iterations

</td><td>

10000

</td></tr><tr><td style="background-color:#ffe8ee;">

Hash String

</td><td> <div style="word-wrap: break-word;">` + 

hashed.toString("hex") + `</div>

</td></tr></tbody></table> `;
    
    return (returnString);
  //return ['pbkdf2Sync', salt, "10000", (hashed.toString('hex'))].join('&');
}

app.get('/hash/:input', function(req, res) {
    var hashedString = hash(req.params.input, "Salmans-App-is-working-with-hash");
    res.send(hashedString);
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(process.env.PORT || 8080, function () {
  console.log(`IMAD course app listening on port ${port} || 8080}!`);
});
