/**
 * Created by nikolasdalton on 11/10/16.
 */

var canvasWidth = 0;
var word = '';
var pixelSize = { value: 1 };
var endPixelSize = 15;
var rx = { value: endPixelSize/4 };

(function () {

    var body = document.getElementsByTagName('body');
    var container = document.getElementsByClassName('container');
    var canvas = document.getElementById('canvas');
    canvas.setAttribute('width', '1300');
    canvas.setAttribute('height', '350');

    var input = document.querySelector('#word-input');

    input.addEventListener('keydown', function(e) {
        if (e && e.keyCode == 13) {
            word = input.value;
            letterCreator(word.toUpperCase());

        }
    });

    var inputContainer = document.getElementById('input-container');
    inputContainer.setAttribute('width', '500');
    inputContainer.setAttribute('height', '50');

})();


function renderRects() {
    var rects = document.getElementsByTagName('rect');

    for (var i = 0; i < rects.length; i++) {
        rects[i].setAttribute('width', pixelSize.value.toString());
        rects[i].setAttribute('height', pixelSize.value.toString());
        rects[i].setAttribute('rx', rx.value.toString());
    }

}

function removeLetters() {
    var canvas = document.getElementById('canvas');

    for (var i = canvas.childNodes.length; i > 0; i--) {
        var lastLetter = canvas.childNodes[i-1];
        canvas.removeChild(lastLetter);
    }

}

function letterCreator(word) {

    pixelSize = { value: 5 };

    var gx = 0;
    var canvas = document.getElementById('canvas');

    if(pixelSize.value < 12 && pixelSize.value > 7) {
        canvas.style["-webkit-filter"] = "drop-shadow(50px 30px 4px #000)";
        canvas.style["filter"] = "drop-shadow(50px 30px 4px rgba(0, 0, 0, 0.63))";
    }
    if(pixelSize.value <= 7 && pixelSize.value > 4) {
        canvas.style["-webkit-filter"] = "drop-shadow(50px 30px 3px #000)";
        canvas.style["filter"] = "drop-shadow(50px 30px 3px rgba(0, 0, 0, 0.63))";
    }
    if(pixelSize.value <= 4) {
        canvas.style["-webkit-filter"] = "drop-shadow(50px 30px 2px #000)";
        canvas.style["filter"] = "drop-shadow(50px 30px 2px rgba(0, 0, 0, 0.63))";
    }

    // Check if there are any words appended to the svg element
    if (canvas.childNodes.length > 1) {
        removeLetters()
    }

    for (var i = 0; i < word.length; i++) {
        //a letter is created for every g component
        var g = createGComponent(word[i]);
        if (i > 0) {
            // Every letter needs to know the width of previous letter
            if (/^\s+$/.test(word[i-1])) {
                var c = document.getElementsByClassName('space');
            } else {
                var c = document.getElementsByClassName(word[i - 1]);
            }
            var rec = c[0].getBoundingClientRect();
            gx = gx + rec.width + endPixelSize + rx.value;
            canvasWidth = gx + 100;
            // set the g components x coordinate relative to the letters before itself
            g.setAttribute('transform', 'translate(' + gx + ',' + 0 + ')');
        }
        canvas.appendChild(g);
    }

    //animate(animationStart, animationEnd, duration, tweenType, easeType, renderMethod)
    animate(pixelSize, endPixelSize, 3, 'to', Elastic.easeOut, renderRects);


}

//Create a group component for each letter in the word
function createGComponent(letter) {

    var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    if (/^\s+$/.test(letter)) {
        g.setAttribute('class', 'space');
    } else {
        g.setAttribute('class', letter);
    }
    //Returns an array of rects
    var pixels = findLetter(letter);

    //Append the rects to the group element to form a letter
    for (var i = 0; i < pixels.length; i++) {
        g.appendChild(pixels[i]);
    }
    return g;
}

//Finds the letter specified and sets the size
function findLetter(letter) {


    // x postion of the first letter in a word
    var px = 100;
    // y postion of the first letter in a word
    var py = 200;
    var pSpace = 2;
    var nextPix = 0;
    // The array that will eventually hold of the letter
    var pixels = [];

    if (/^\s+$/.test(letter)) {
        var l = 'space';
    } else {
        //Create a string to match the name of the funtion
        //that returns a letter in the alphabit
        var l = 'letter' + letter;
    }
    //Get the pattern for setting up the letter
    var pattern = window[l]().pattern;
    //Get the with of the letter
    var pWidth = window[l]().width;
    //The height of a letter is always 6 rects
    var pHeight = 6;

    //Below the letters of in given word are drawn
    // for every block in height ->
    for (var j = 0; j < pHeight; j++) {
        // is a row of blocks
        for (var i = 0; i < pWidth; i++) {

            // create new rect element
            var rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', px.toString());
            rect.setAttribute('y', py.toString());
            rect.setAttribute('width', pixelSize.value.toString());
            rect.setAttribute('height', pixelSize.value.toString());
            rect.setAttribute('rx', rx.value.toString());
            rect.setAttribute('ry', '5');
            // Reads the pattern of the letters
            if (pattern[nextPix] == 0) {
                rect.setAttribute('fill', 'white');
                rect.setAttribute('fill-opacity', '0.0');
            } else {
                rect.setAttribute('fill', 'black');
            }
            // the next x coordinate is set with a little space in between rects
            px = px + endPixelSize + rx.value;
            console.log(px);
            pixels.push(rect);
            nextPix++;
        }
        // the y coordinate is set for every row of rects
        py = py + endPixelSize + rx.value;
        py.toString();
        // the x coordinate is reset for every row
        px = 100;
    }
    return pixels;
}

function onInputFocus(input) {
    input.value = '';
}