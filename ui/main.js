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


/**************************************************************************
*
* Making login / register user forms and displaying and authenticating 
* forked from coco98
*
**************************************************************************/
function loadLoginForm () {
    var loginHtml = '<h3>Login/Register to unlock awesome features</h3>  <input type="text" id="username" placeholder="username" />        <input type="password" id="password" />        <br/><br/>        <input type="submit" id="login_btn" value="Login" />        <input type="submit" id="register_btn" value="Register" />     ';
    document.getElementById('login_area').innerHTML = loginHtml;
    
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
                  alert('Something went wrong on the server');
                  submit.value = 'Login';
              } else {
                  alert('Something went wrong on the server');
                  submit.value = 'Login';
              }
              loadLogin();
          }  
          // Not done yet
        };
        
        // Make the request
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        console.log(username);
        console.log(password);
        request.open('POST', '/login', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, password: password}));  
        submit.value = 'Logging in...';
        
    };
    
    var register = document.getElementById('register_btn');
    register.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();
        
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                  alert('User created successfully');
                  register.value = 'Registered!';
              } else {
                  alert('Could not register the user');
                  register.value = 'Register';
              }
          }
        };
        
        // Make the request
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        console.log(username);
        console.log(password);
        request.open('POST', '/create-user', true);
        request.setRequestHeader('Content-Type', 'application/json');
                request.send(JSON.stringify({username: username, password: password}));  
        register.value = 'Registering...';
    
    };
}

function loadLoggedInUser (username) {
    var loginArea = document.getElementById('login_area');
    loginArea.innerHTML = '        <h3> Hi <i>${username}</i></h3>        <a href="/logout">Logout</a>    ';
}

function loadLogin () {
    // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                loadLoggedInUser(this.responseText);
            } else {
                loadLoginForm();
            }
        }
    };
    
    request.open('GET', '/check-login', true);
    request.send(null);
    return true;
}

function loadArticles () {
        // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            var articles = document.getElementById('articles');
            if (request.status === 200) {
                var content = '<ul>';
                var articleData = JSON.parse(this.responseText);
                for (var i=0; i< articleData.length; i++) {
                    content += '<li>  <a href="/articles/${articleData[i].title}">    ${articleData[i].heading}</a> (${articleData[i].date.split("T")[0]})</li>';
                }
                content += "</ul>";
                articles.innerHTML = content;
            } else {
                articles.innerHTML('Oops! Could not load all articles!');
            }
        }
    };
    
    request.open('GET', '/get-articles', true);
    request.send(null);
}


// The first thing to do is to check if the user is logged in!
loadLogin();

// Now this is something that we could have directly done on the server-side using templating too!
loadArticles();