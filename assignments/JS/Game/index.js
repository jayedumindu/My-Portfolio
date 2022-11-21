let urlPrefix = "./sprites/";
let runningImgURLs = [
  "run_01.png",
  "run_02.png",
  "run_03.png",
  "run_04.png",
  "run_05.png",
  "run_07.png",
  "run_08.png",
  "run_09.png",
  "run_10.png",
];

// jquey extension
jQuery.fn.onPositionChanged = function (trigger, millis) {
  if (millis == null) millis = 100;
  var o = $(this[0]); // our jquery object
  if (o.length < 1) return o;

  var lastPos = null;
  var lastOff = null;
  setInterval(function () {
    if (o == null || o.length < 1) return o; // abort if element is non existend eny more
    if (lastPos == null) lastPos = o.position();
    if (lastOff == null) lastOff = o.offset();
    var newPos = o.position();
    var newOff = o.offset();
    if (lastPos.top != newPos.top || lastPos.left != newPos.left) {
      $(this).trigger("onPositionChanged", {
        lastPos: lastPos,
        newPos: newPos,
      });
      if (typeof trigger == "function") trigger(lastPos, newPos);
      lastPos = o.position();
    }
    if (lastOff.top != newOff.top || lastOff.left != newOff.left) {
      $(this).trigger("onOffsetChanged", { lastOff: lastOff, newOff: newOff });
      if (typeof trigger == "function") trigger(lastOff, newOff);
      lastOff = o.offset();
    }
  }, millis);

  return o;
};

let deadURLs = [
  "hurt_01.png",
  "die_01.png",
  "die_02.png",
  "die_03.png",
  "die_04.png",
  "die_05.png",
  "die_06.png",
  "die_07.png",
  "dead_01.png",
];

let runningFrames = [];

function makeSpriteRun() {
  // run infinitely
  let startTime = 500;
  runningImgURLs.forEach((url) => {
    let id = setInterval(function () {
      if (terminateAll) {
      }
      $(".character").attr("src", urlPrefix + url);
      // console.log("character changed!")
    }, startTime);
    runningFrames.push(id);
    startTime += 150;
  });
}

function makeSpriteJump() {
  setTimeout(function () {
    $(".character").css({
      top: "35%",
    });
    // update selection
    rectSelection = selection.getBoundingClientRect();
  }, 0);
  setTimeout(() => {
    $(".character").css({
      top: "50",
    });
    rectSelection = selection.getBoundingClientRect();
  }, 250);
  setTimeout(() => {
    $(".character").css({
      top: "62%",
    });
    rectSelection = selection.getBoundingClientRect();
  }, 700);
}

document.body.onkeyup = function (e) {
  if ((e.key == " " || e.code == "Space" || e.keyCode == 32) & !terminateAll) {
    // make sprite jump
    makeSpriteJump();
  }
};

let slimeId = 1000;

// getter for elements
var getElements = function (selector) {
  return $(selector);
};

// generate slimes randomly
function createSlimesRepeatedly() {
  if (terminateAll) {
    return;
  }
  //  random num between 500 - 1000
  let randomSeq = Math.floor(Math.random() * 500) + 2000;
  setTimeout(() => {
    // first append the slime
    let img = $("<img>", {
      class: "slime",
      id: slimeId,
      src: "./sprites/bat.gif",
    });
    $(".main-inner").append(img);
    //  then animate
    let intervalId = setInterval(function () {
      let prevPos = $(elem).css("left").match(/(\d+)/)[0];
      let next = parseInt(prevPos) + 2;
      $(elem).css("left", next + "px");
    }, 10);
    let elem = document.getElementById(slimeId);
    $(elem).onPositionChanged(function () {
      checkForTheCollision(elem, intervalId);
    });
    //  set the stopper
    setTimeout(function () {
      clearInterval(intervalId);
      $(elem).remove();
    }, 5000);
    // set the next slime
    setTimeout(() => {
      slimeId++;
      createSlimesRepeatedly();
    }, 100);
  }, randomSeq);
}

let treeId = 0;

// used for pausing the whole behaviour
let terminateAll = false;

function putCharacterToDeadMode() {
  // stop running intervals
  runningFrames.forEach((id) => {
    clearInterval(id);
  });
  // set timeout for each image
  let startTime = 0;
  deadURLs.forEach((url) => {
    setTimeout(function () {
      $(".character").attr("src", urlPrefix + url);
    }, startTime);
    startTime += 200;
  });
}

// function createBackgroundAnimation() {
//   let randomSeq = Math.floor(Math.random() * 2000) + 500;
//   setTimeout(() => {
//     // first append the slime
//     let img = $("<img>", {
//       class: "background1",
//       id: treeId,
//       src: "./backgrounds/tree1.png",
//     });
//     $(".main-inner").append(img);
//     //  then animate
//     let elem = document.getElementById(treeId);
//     let intervalId = setInterval(function () {
//       let prevPos = $(elem).css("left").match(/(\d+)/)[0];
//       let next = parseInt(prevPos) + 2;
//       $(elem).css("left", next + "px");
//     }, 10);
//     //  set the stopper
//     setTimeout(function () {
//       clearInterval(intervalId);
//       $(elem).remove();
//     }, 1000);
//     // set the next slime
//     setTimeout(() => {
//       slimeId--;
//       createBackgroundAnimation();
//     }, 100);
//   }, randomSeq);
// }

// createBackgroundAnimation();

// $(function () {
//   $(".slime").draggable();
//   $(".character").droppable({
//     drop: function (event, ui) {
//       console.log("oh i hit something!");
//     },
//   });
// });

// collision checker
var selection = document.querySelector(".character");
var rectSelection = selection.getBoundingClientRect();
function checkForTheCollision(elem, id) {
  let rect = elem.getBoundingClientRect();
  if (
    rect.bottom > rectSelection.top &&
    rect.right > rectSelection.left &&
    rect.top < rectSelection.bottom &&
    rect.left < rectSelection.right
  ) {
    terminateAll = true;
    console.log("aww i hit something!");
    putCharacterToDeadMode();
    clearInterval(id);
  } else {
    // if global atttr is set pause the game
    if (terminateAll) clearInterval(id);
  }
}

// start button behaviour
$("#startBtn").click(function (event) {
  $(this).fadeOut();
  // start the process
  makeSpriteRun();
  createSlimesRepeatedly();
});
