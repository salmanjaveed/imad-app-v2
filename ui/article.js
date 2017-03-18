// Eg: coco98.imad.hasura-app.io/articles/article-one will result in article-one
var currentArticleTitle = window.location.pathname.split('/')[2];

function loadCommentForm () {
    var commentFormHtml = `
                <h3>Leave a Comment</h3>

                  <!-- form -->
                  <form name="contactForm" id="contactForm" method="post" action="">
  					   <fieldset>

                     <div class="message group">
                        <label  for="cMessage">Message <span class="required">*</span></label>
                        <textarea name="cMessage"  id="cMessage" rows="10" cols="50" ></textarea>
                     </div>

                     <button type="submit" class="submit" id="submit_comment">Submit</button>

  					   </fieldset>
  				      </form> <!-- Form End -->

        `;
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
                        <img width="50" height="50" class="avatar" src="images/user-01.png" alt="">
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
            } else {
                comments.innerHTML('Oops! Could not load comments!');
            }
        }
    };
    
    request.open('GET', '/get-comments/' + currentArticleTitle, true);
    request.send(null);
}


// The first thing to do is to check if the user is logged in!
loadLoginforComment();
loadComments();


/*
// Eg: coco98.imad.hasura-app.io/articles/article-one will result in article-one
var currentArticleTitle = window.location.pathname.split('/')[2];

function loadCommentForm () {
  /*  var commentFormHtml = `
        <h5>Submit a comment</h5>
        <textarea id="comment_text" rows="5" cols="100" placeholder="Enter your comment here..."></textarea>
        <br/>
        <input type="submit" id="submit" value="Submit" />
        <br/>
        `; 
    document.getElementById('comment_form').innerHTML = commentFormHtml;
    */
    // Submit username/password to login
//    var submit = document.getElementById('submit_comment');
   // document.getElementById('submit_comment').disabled = false;
 /*   submit.onclick = function () {
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
            else {
               // document.getElementbyId('submit_btn').disabled = true;
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
                        <img width="50" height="50" class="avatar" src="images/user-01.png" alt="">
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
                //get the number of comments on this article
               // getNumComments();
            } else {
                comments.innerHTML = 'Oops! Could not load comments!';
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

// The first thing to do is to check if the user is logged in!
loadLoginforComment();
loadComments();
*/