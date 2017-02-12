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
    }

    // get the counter from the already created counter file:
    request.open('GET', '/counter', true);
    request.send(null);
    return true;
};

 function displayComments () {
// var submitBtn = document.getElementById('btnSubmit');

// submitBtn.onclick = function () {

    var nameinput = document.getElementById('txtName');
    txtname = nameinput.value;
    var commentinput = document.getElementById('txtComment');
    txtcomment = commentinput.value;

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
            var comments = JSON.parse(request.responseText);

            var list = '';
            for (var i=comments.length; i>0; i--) {
                list += '<li class="list-group-item">' + comments[i] + '</li>';
            }

            var count1 = request.responseText;

            var ulList = document.getElementById('listNames');
            ulList.innerHTML = list;
          }
         }
    }
    // get the counter from the already created counter file:
    request.open('GET', '/comment?comment=' + txtcomment + '&name=' + txtname, true);
    request.send(null);
    return true;
};
