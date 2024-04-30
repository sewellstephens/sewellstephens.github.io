/* global $, sessionStorage */

$(document).ready(runProgram); // wait for the HTML / CSS elements of the page to fully load, then execute runProgram()
  
function runProgram(){
  ////////////////////////////////////////////////////////////////////////////////
  //////////////////////////// SETUP /////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  // Constant Variables
  var FRAME_RATE = 60;
  var FRAMES_PER_SECOND_INTERVAL = 1000 / FRAME_RATE;
  var KEY = {
    LEFT: 37,
    RIGHT: 39,
    UP: 38,
    DOWN: 40
  };
  var WALKER = {
    LEFT: 0,
    TOP: 0,
    BOTTOM: 50,
    RIGHT: 50,
    SPEED_X: 0,
    SPEED_Y: 0
  }

  var WALKER2 = {
    LEFT: 0,
    TOP: 0,
    BOTTOM: 50,
    RIGHT: 50,
    SPEED_X: 0,
    SPEED_Y: 0
  }


  // Game Item Objects


  // one-time setup
  var interval = setInterval(newFrame, FRAMES_PER_SECOND_INTERVAL);   // execute newFrame every 0.0166 seconds (60 Frames per second)
  $(document).on('keydown', handleKeyDown);      
  $(document).on('keyup', handleKeyUp);                        // change 'eventType' to the type of event you want to handle

  ////////////////////////////////////////////////////////////////////////////////
  ///////////////////////// CORE LOGIC ///////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  /* 
  On each "tick" of the timer, a new frame is dynamically drawn using JavaScript
  by calling this function and executing the code inside.
  */
  function newFrame() {
   repositionGameItem()
   wallCollision()
   redrawGameItem()
  }
  
  /* 
  Called in response to events.
  */
  function handleKeyDown(event) {
     if (event.which === KEY.LEFT) {
      WALKER.SPEED_X = -5;
      WALKER2.SPEED_X = -10;
     }
     else if (event.which === KEY.RIGHT) {
      WALKER.SPEED_X = 5;
      WALKER2.SPEED_X = 10;
     }
     else if (event.which === KEY.UP) {
      WALKER.SPEED_Y = -5;
      WALKER2.SPEED_Y = -10;
     }
     else if (event.which === KEY.DOWN) {
      WALKER.SPEED_Y = 5;
      WALKER2.SPEED_Y = 10;
     }
  }

  function handleKeyUp(event) {
    if (event.which === KEY.LEFT) {
      WALKER.SPEED_X = 0;
      WALKER2.SPEED_X = 0;

     }
     else if (event.which === KEY.RIGHT) {
      WALKER.SPEED_X = 0;
      WALKER2.SPEED_X = 0;
     }
     else if (event.which === KEY.UP) {
      WALKER.SPEED_Y = 0;
      WALKER2.SPEED_X = 0;
     }
     else if (event.which === KEY.DOWN) {
      WALKER.SPEED_Y = 0;
      WALKER2.SPEED_X = 0;
     }
  }

  ////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// HELPER FUNCTIONS ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////

  function repositionGameItem() {
    WALKER.LEFT += WALKER.SPEED_X;
    WALKER.TOP += WALKER.SPEED_Y;
    WALKER2.LEFT += WALKER2.SPEED_X;
    WALKER2.TOP += WALKER2.SPEED_Y;
    WALKER.RIGHT = WALKER.LEFT + 50;
    WALKER.BOTTOM = WALKER.TOP + 50;
    WALKER2.RIGHT = WALKER2.LEFT + 50;
    WALKER2.BOTTOM = WALKER2.TOP + 50;
  }

  function wallCollision() {
    if ($("#board").width() < WALKER.LEFT) {
      WALKER.LEFT = $("#board").width();
    }
    else if ($("#board").height() < WALKER.TOP) {
      WALKER.TOP = $("#board").height()
    }
    else if (WALKER.LEFT < 0) {
      WALKER.LEFT = 0;
    }
    else if (WALKER.TOP < 0) {
      WALKER.TOP = 0;
    }

    if ($("#board").width() < WALKER2.LEFT) {
      WALKER2.LEFT = $("#board").width();
    }
    else if ($("#board").height() < WALKER2.TOP) {
      WALKER2.TOP = $("#board").height();
    }
    else if (WALKER2.LEFT < 0) {
      WALKER2.LEFT = 0;
    }
    else if (WALKER2.TOP < 0) {
      WALKER2.TOP = 0;
    }

    console.log(WALKER.LEFT, WALKER.TOP)
  }

  function redrawGameItem() {
    $("#gameItem").css("top", WALKER.TOP);
    $("#gameItem").css("left", WALKER.LEFT);
    $("#gameItem2").css("top", WALKER2.TOP);
    $("#gameItem2").css("left", WALKER2.LEFT);
    console.log($("#gameItem").css("background-color"));
    if (WALKER.LEFT < WALKER2.RIGHT && WALKER.RIGHT > WALKER2.LEFT && WALKER.TOP < WALKER2.BOTTOM && WALKER.BOTTOM > WALKER2.TOP) {
      if ($("#gameItem").css("background-color") === "blue") {
        $("#gameItem").css("background-color", "red");
        $("#gameItem2").css("background-color", "blue");
        console.log("red");
      }
      else {
        $("#gameItem").css("background-color", "blue");
        $("#gameItem2").css("background-color", "red");
        console.log("blue");
      }
    }
  }
  
  function endGame() {
    // stop the interval timer
    clearInterval(interval);

    // turn off event handlers
    $(document).off();
  }
  
}
