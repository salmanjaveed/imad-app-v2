var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

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
    'article-two': { title: 'This is the second title 2/3 in a series',
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
    'article-three': { title: 'This is the third title 3/3 in a series',
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

function createTemplate(data) {
    
    var title=data.title;
    var heading=data.heading;
    var content=data.content;
        
    var htmlTemplate = `
    <html>
    <head>
            <meta name=viewport width=device-width init=1>
            <title>${title}</title>
    </head>    
    <body>
        <div class=container>
            
            <div>
                <h1>${heading}</h1>
                ${content}
            </div>
            
        </div>
    </body>    
    </html>`;
    
    return htmlTemplate;
}

app.get('/:articleName', function (req, res) {
 var articleName = req.params.articleName;
 res.send(createTemplate(articles[articleName]));
//  res.send(articles['article-one']);
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
