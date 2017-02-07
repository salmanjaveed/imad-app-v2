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

var counter = 0;
var button = document.getElementById('counter');
button.onclick = function () {
   
   counter += 1;
   var spanTxt = document.getElementById('count');
   spanTxt.innerHTML = counter.toString();


}