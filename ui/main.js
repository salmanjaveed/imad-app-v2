/*
// var element = document.getElementById('main-text');
// 
// element.innerHTML = 'This is a new text which is changed';
// 
// var img = document.getElementById('madi');
// img.onclick = function () { 
//     if (img.style.marginLeft === "100px" )
//     {
//         img.style.marginLeft = "0";
//     }
// else
//     {
//         img.style.marginLeft = "100px";
//     }
// }
//  
// var mLeft = 0;
// img.ondblclick = function () {
//     // img.style.marginLeft = "0";
//     var Interval = setInterval(moveRight, 1000);
// 
// 
//     for ( var i = 0; i > 300; i++) {
//         console.log (i);
//         ml = i + "px";
//         img.style.marginLeft = ml;
//    }
// 
// }
// function moveRight () {
//     mLeft = mLeft + 5;
//     img.style.marginLeft = mLeft + "px";
// }
// 
/*
 function displayCounter () {

// var button = document.getElementById('counter');

// button.onclick = function () {

    // Get a Response ready for XML

    var request = new XMLHttpRequest();

    // get the response in a variable
    request.onreadystatechange = function () {

        // Take some action
        if (request.readyState === XMLHttpRequest.DONE) {

        }

        if (request.status === 200) {

            var count1 = request.responseText;

            var spanTxt = document.getElementById('count');
            spanTxt.innerHTML = count1.toString();
        }
    };

    // get the counter from the already created counter file:
    request.open('GET', '/counter', true);
    request.send(null);
    return true;
}
*/
/*

 function displayComments () {
// var submitBtn = document.getElementById('btnSubmit');

// submitBtn.onclick = function () {

    var nameinput = document.getElementById('txtName');
    txtname = nameinput.value;
    var commentinput = document.getElementById('txtComment');
    txtcomment = commentinput.value;

    if (txtname === '' ) {
        return true;
    }
    else if(txtcomment === '') {
        return true;
    }

    displayCounter();

    // Get a Response ready for XML

    var request = new XMLHttpRequest();

    // get the response in a variable
    request.onreadystatechange = function () {

        // Take some action
        if (request.readyState === XMLHttpRequest.DONE) {

        if (request.status === 200) {

      /*     var returnvalue = request.responseText;
            var comments = JSON.parse(returnvalue['comment']);
     */ 
     /*
            var comments = JSON.parse(request.responseText);

            var list = '';
            for (var i=comments.length-1; i>-1; i--) {
                list += '<li class="list-group-item">' + comments[i] + '</li>';
            }

            var count1 = request.responseText;

            var ulList = document.getElementById('listNames');
            ulList.innerHTML = list;
          }
         }
    };
    // get the counter from the already created counter file:
    request.open('GET', '/comment?comment=' + txtcomment + '&name=' + txtname, true);
    request.send(null);
    return true;
}
*/

/**************************************************************************
*
* Making login / register user forms and displaying and authenticating 
* forked from coco98
*
**************************************************************************/
function loadLoginForm () {
    var loginHtml = `<h3> Login / register </h3>
                      <form action="#">
					<input type ="text" id="username" placeholder="Your Username" class="text-search">
					<input type="password" id="password" placeholder="Your Password" class="text-search">
                    <!-- <input type="text" value="Search here..." onblur="if(this.value == '') { this.value = 'Search here...'; }" onfocus="if (this.value == 'Search here...') { this.value = ''; }" class="text-search">
                     <input type="submit" value="" class="submit-search" disabled>-->
					 <input type="BUTTON" id="login_btn" class="button" value="Login">
					 <input type="BUTTON" id="register_btn" class="button" value="Register">
					 

                  </form>
                  `;

    document.getElementById('login-area').innerHTML = loginHtml;
    
    // Submit username/password to login
    var submit = document.getElementById('login_btn');
    submit.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();
        
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                  submit.value = 'Success!';
              } else if (request.status === 403) {
                  submit.value = 'Invalid credentials. Try again?';
              } else if (request.status === 500) {
                  alert('Something went wrong on the server' + request.status.toString());
                  submit.value = 'Login';
              } else {
                  alert('Something went wrong on the server' + request.status.toString());
                  submit.value = 'Login';
              }
              loadLogin();
          }  
          // Not done yet
        };
        
        // Make the request
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        //console.log(username);
        //console.log(password);
        request.open('POST', '/login', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, password: password}));  
        submit.value = 'Logging in...';
        
    };
    
    var register = document.getElementById('register_btn');
    register.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();
         var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;     
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                 // alert('User created successfully');
                  register.value = 'Registered!';
                 loginRegisteredUser( username, password );
                 loadLogin();
                  
              } else {
                 //alert('Could not register the user');
                  register.value = 'Register';
              }
          }
        };
        
        // Make the request
       
        //console.log(username);
        //console.log(password);
        request.open('POST', '/create-user', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, password: password}));  
        register.value = 'Registering...';
        
    
    };
}

function loginRegisteredUser ( username, password ){
    

      var request = new XMLHttpRequest();
        
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                  submit.value = 'Success!';
              } else if (request.status === 403) {
                  submit.value = 'Invalid credentials. Try again?';
              } else if (request.status === 500) {
                  alert('Something went wrong on the server' + request.status.toString());
                  submit.value = 'Login';
              } else {
                  alert('Something went wrong on the server' + request.status.toString());
                  submit.value = 'Login';
              }
              loadLogin();
          }  
          // Not done yet
        };
        
        // Make the request
      //  var username = document.getElementById('username').value;
    //    var password = document.getElementById('password').value;
        //console.log(username);
        //console.log(password);
        request.open('POST', '/login', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, password: password}));  
        submit.value = 'Logging in...';
        
    }
    

function loadLoggedInUser (username) {
    var loginArea = document.getElementById( 'login-area');
    loginArea.innerHTML = `<h4> Welcome ${username} !</h4>
        <a href="/logout">Logout</a>`;
}

function loadLogin () {
    //Check if the user is already logged in 
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
               // alert(this.responseText);
                loadLoggedInUser(this.responseText);
            }
            else {
                loadLoginForm();
            }
        }
    };

    request.open('GET', '/auth/check-login',true);
    request.send(null);
    
}

function loadArticles () {
        // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            var articles = document.getElementById('articles-list');
            var articletitles = document.getElementById('article-titles');
           // console.log(articletitles);
            //console.log("articles", articles);
            if (request.status === 200) {
                var content = ' ';
                var titles = ' ';
                var articleData = JSON.parse(this.responseText);
                
                for (var i=0; i< articleData.length; i++) {
                    content +=`
                    <header class="entry-header">
						<h2 class="entry-title">
							<a href="/articles/${articleData[i].title}" title="${articleData[i].heading}"> ${articleData[i].heading}</a>
						</h2> 				 
					
						<div class="entry-meta">
							<ul>
								<li>(${articleData[i].date.split("T")[0]})</li>
								<span class="meta-sep">&bull;</span>								
								<!--<li><a href="#" title="" rel="category tag">Ghost</a></li>
								<span class="meta-sep">&bull;</span>-->
								<li>${articleData[i].username}</li>
							</ul>
						</div>
					</header>
						<div class="entry-content" align="justify">
						<p class="drop-cap">${articleData[i].content.substring(0,300)}</p>
						<p align="right"><a href="/articles/${articleData[i].title}">Read More...</a></p>
					</div> 
                    `;
                    
                    titles += `
                    <li>
                        <a href="/articles/${articleData[i].title}" title="${articleData[i].heading}"> ${articleData[i].heading}</a>
                    </li>`;
                    
                }
                if ( articletitles ) {
                    articletitles.innerHTML = titles;   
                }
                 
                 if ( articles ) {
                    articles.innerHTML = content; 
                 }
            } else {
                alert(request.err.toString() + request.status.toString());
                articles.innerHTML = 'Oops! Could not load all articles!';
            }
        }
    };
    
    request.open('GET', '/get-articles', true);
    request.send(null);
}

function loadStats () {
        // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            var statsTab = document.getElementById('stat-tab');
            if (request.status === 200) {
                var stats = JSON.parse(this.responseText);
                var content = ' ';
                
                for (var i=0; i< stats.length; i++) {
                    content +=`
                    <li><a href="#">123 <em>Visitors</em></a></li>
                        <li><a href="#">${stats[i].articlecount} <em>Articles</em></a></li>
                        <li><a href="#">${stats[i].commentcount} <em>Comments</em></a></li>
                        <li><a href="#">${stats[i].usercount} <em>Registered Users</em></a></li>
                    `;

                }
                
                 statsTab.innerHTML = content;
            } else {
                alert(request.err + request.status);
                statsTab.innerHTML = 'Oops! Could not load all articles!';
            }
        }
    };
    
    request.open('GET', '/get-stats', true);
    request.send(null);
}
/*
// Submit Comments

function submitComment () {
 
    // Submit username/password to login
     // Create a request object
        var request = new XMLHttpRequest();
        var submit = document.getElementById('submit_comment');
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                  submit.value = 'Submit'; // Success
                  document.getElementById('cMessage').value = ''; // reset the message
              } else if (request.status === 403) {
                  submit.value = 'Invalid credentials. Try again?';
              } else if (request.status === 500) {
                  alert('Something went wrong on the server' + request.status.toString());
                  submit.value = 'Submit';
              } else {
                  alert('Something went wrong on the server' + request.status.toString());
                  submit.value = 'Submit';
              }
              loadLogin();
          }  
          // Not done yet
        };
        
        // Make the request
        var comment = document.getElementById('comment').value;
        //console.log(username);
        //console.log(password);
        request.open('POST', '/submit-comment', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({comment: comment}));  
        submit.value = 'Submitting...';
        
  }
*/

// The first thing to do is to check if the user is logged in!
loadLogin();

// Now this is something that we could have directly done on the server-side using templating too!
loadArticles();

//Load site stats 
loadStats();