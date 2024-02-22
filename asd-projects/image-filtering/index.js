// This is a small program. There are only two sections. This first section is what runs
// as soon as the page loads.
$(document).ready(function () {
  render($("#display"), image);
  $("#apply").on("click", applyAndRender);
  $("#reset").on("click", resetAndRender);
});

/////////////////////////////////////////////////////////
//////// event handler functions are below here /////////
/////////////////////////////////////////////////////////

// this function resets the image to its original value; do not change this function
function resetAndRender() {
  reset();
  render($("#display"), image);
}

// this function applies the filters to the image and is where you should call
// all of your apply functions
function applyAndRender() {
  // Multiple TODOs: Call your apply function(s) here

  applyFilter(reddify);
  applyFilterNoBackground(decreaseBlue);
  applyFilterNoBackground(increaseGreenByBlue);

  

  // do not change the below line of code
  render($("#display"), image);
}

/////////////////////////////////////////////////////////
// "apply" and "filter" functions should go below here //
/////////////////////////////////////////////////////////

// TODO 1, 2 & 4: Create the applyFilter function here


console.log(bgPixel)

function applySmudge() {
  var length = 1;
  for (var k = 1; k <= image.length; k += length) {
  for (i = 0; i < image.length; i++) {
    for (j = 0; j < image[i].length; j++) {
     var rgbFirst = image[i][j];
     var rgbNumbers = rgbStringToArray(rgbString);
     filterFunction(rgbNumbers);
     rgbString = rgbArrayToString(rgbNumbers);
     image[i][j] = rgbString;
    }
 }
}
  
}

function applyFilter(filterFunction) {

  

  for (i = 0; i < image.length; i++) {
     for (j = 0; j < image[i].length; j++) {
      var rgbString = image[i][j];
      var rgbNumbers = rgbStringToArray(rgbString);
      filterFunction(rgbNumbers);
      rgbString = rgbArrayToString(rgbNumbers);
      image[i][j] = rgbString;
     }
  }

}


// TODO 7: Create the applyFilterNoBackground function

function applyFilterNoBackground(filterFunction) {

  for (i = 0; i < image.length; i++) {
     for (j = 0; j < image[i].length; j++) {
      if (image[i][j] !== image[0][0]) {
        var rgbString = image[i][j];
        var rgbNumbers = rgbStringToArray(rgbString);
        filterFunction(rgbNumbers);
        rgbString = rgbArrayToString(rgbNumbers);
        image[i][j] = rgbString;
      }
     }
  }

}


// TODO 5: Create the keepInBounds function

function keepInBounds(param1) {

  return param1 < 0 ? 0 : param1 > 255 ? 255 : param1;
   
}
/*

Tests:

console.log(keepInBounds(-30)); // should print 0
console.log(keepInBounds(300)); // should print 255
console.log(keepInBounds(127)); // should print 127

*/

// TODO 3: Create reddify function

function reddify(param1) {
  param1[RED] = 200;
}


// TODO 6: Create more filter functions

function decreaseBlue(param1) {
 param1[BLUE] = keepInBounds(param1[BLUE] - 50);
}

function increaseGreenByBlue(param1) {
  param1[GREEN] = keepInBounds(param1[BLUE] + param1[GREEN]);
 }


// CHALLENGE code goes below here
