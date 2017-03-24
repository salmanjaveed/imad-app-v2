// Eg: coco98.imad.hasura-app.io/articles/article-one will result in article-one
var currentArticleTitle = window.location.pathname.split('/')[2];

function loadCommentForm () {
    var commentFormHtml = `
                <h3>Leave a Comment</h3>
                    <div class="message group">
                        <label  for="cMessage">Message <span class="required">*</span></label>
                        <textarea name="cMessage"  id="cMessage" rows="10" cols="50" ></textarea>
                     </div>

                     <button type="submit" class="submit" id="submit_comment">Submit</button>  `;
    document.getElementById('comment-area').innerHTML = commentFormHtml;
    
    // Submit username/password to login
    var submit = document.getElementById('submit_comment');
    submit.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();
        
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
                // Take some action
                if (request.status === 200) {
                    // clear the form & reload all the comments
                    document.getElementById('cMessage').value = '';
                    loadComments();   
                    loadStats();
                    footerComments();
                } else {
                    alert('Error! Could not submit comment');
                }
                submit.value = 'Submit';
          }
        };
        
        // Make the request
        var comment = document.getElementById('cMessage').value;
        request.open('POST', '/submit-comment/' + currentArticleTitle, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({comment: comment}));  
        submit.value = 'Submitting...';
        
    };
}

function loadLoginforComment () {
    // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                loadCommentForm(this.responseText);
            }
        }
    };
    
    request.open('GET', '/auth/check-login', true);
    request.send(null);
}

function escapeHTML (text)
{
    var $text = document.createTextNode(text);
    var $div = document.createElement('div');
    $div.appendChild($text);
    return $div.innerHTML;
}

function loadComments () {
        // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            var comments = document.getElementById('commentslist');
            if (request.status === 200) {
                var content = '';
                var commentsData = JSON.parse(this.responseText);
                for (var i=0; i< commentsData.length; i++) {
                    var time = new Date(commentsData[i].timestamp);
                    content += `
                    <li class="depth-1">

                     <div class="avatar">
                        <img width="50" height="50" class="avatar" src="/images/user-01.png" alt="">
                     </div>

                     <div class="comment-content">

	                     <div class="comment-info">
	                        <cite>${commentsData[i].username}</cite>

	                        <div class="comment-meta">
	                           <time class="comment-time">${time.toLocaleTimeString()} on ${time.toLocaleDateString()}</time>
	                           <span class="sep">/</span><a class="reply" href="#">Reply</a>
	                        </div>
	                     </div>

	                     <div class="comment-text">
	                        <p>${escapeHTML(commentsData[i].comment)}</p>
	                     </div>

	                  </div>

                  </li>`;
                }
                comments.innerHTML = content;
                getNumComments ();
            } else {
                comments.innerHTML('Oops! Could not load comments!');
            }
        }
    };
    
    request.open('GET', '/get-comments/' + currentArticleTitle, true);
    request.send(null);
}


function getNumComments () {
        // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
      request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                var commentsCount = JSON.parse(this.responseText);
                document.getElementById('Numcomments').innerHTML = commentsCount.count +  " Comments" ;
                }
        }
        };
    };
    
    request.open('GET', '/get-num-comments/' + currentArticleTitle, true);
    request.send(null);
}

/*
function loadArticleComposeForm () {
    var ArticleComposeFormHtml = `
                <h3>Post a New Article</h3>
                    <div class="message group">
                        <input id="cTitle" placeholder="Enter Title"> <span class="required"></span>
                        <label  for="cArticle">Article <span class="required">*</span></label>
                        <textarea name="cArticle"  id="cArticle" rows="10" cols="50" ></textarea>
                     </div>

                     <button type="submit" class="submit" id="submit_article">Submit</button>  `;
    document.getElementById('articles-list').innerHTML = ArticleComposeFormHtml;
    
    // Submit username/password to login
    var submit = document.getElementById('submit_article');
    submit.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();
        
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
                // Take some action
                if (request.status === 200) {
                    // clear the form & reload all the comments
                    submit.value = "Done!";
                    document.getElementById('cArticle').value = '';
                    document.getElementById('cTitle').value = '';
                } else {
                    alert('Error! Could not submit New Article');
                }
                submit.value = 'Submit';
          }
        };
        
        // Make the request
        submit.value = 'Sending...';
        var article = document.getElementById('cArticle').value;
        var heading = document.getElementById('cTitle').value;
        var title = document.getElementById('cTitle').value;
        title = title.replace(/\W+/g,'-').toLowerCase().trim()
        request.open('POST', '/submit-article', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({title: title, article: article, heading: heading}));  
        

    };
}
*/


// The first thing to do is to check if the user is logged in!
loadLoginforComment();
loadComments();
