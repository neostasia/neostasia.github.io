var textArray = new Array(
    "Together a better internet."
);
var printDelay = 100; // time delay of print out
var startIdx = 0; // start printing array at this posision
var arrayLength = textArray[0].length;
var scrollAt = 20; // start scrolling up at this many lines
    
var textPos = 0; 
var initialContents = ''; 
var currRow;

function typewriter() {

    initialContents =  ' ';
    currRow = Math.max(0, startIdx-scrollAt);
    var destination = document.getElementById("typedtext");
     
    while (currRow < startIdx) {
        initialContents += textArray[currRow++] + '<br />';
    }
    destination.innerHTML = initialContents + textArray[startIdx].substring(0, textPos) + "_";
    if ( textPos++ == arrayLength ) {
        textPos = 0;
        startIdx++;
        if ( startIdx != textArray.length ) {
            arrayLength = textArray[startIdx].length;
            setTimeout("typewriter()", 500);
        }
    } else {
      setTimeout("typewriter()", printDelay);
    }
}
    
window.onload = function () {
    typewriter();
};