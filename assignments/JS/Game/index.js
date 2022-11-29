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
let idleFrameIds = [];

function makeSpriteRun() {
  // run infinitely
  let startTime = 500;
  runningImgURLs.forEach((url) => {
    let id = setInterval(function () {
      if (terminateAll | jumping) {
        return;
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
      top: "62%",
    });
    rectSelection = selection.getBoundingClientRect();
  }, 700);
}

document.body.onkeyup = function (e) {
  if ((e.key == " " || e.code == "Space" || e.keyCode == 32) & !terminateAll) {
    e.preventDefault();
    jumping = true;
    // play audio
    new Audio("./audio/character-jumping.wav").play();
    // make sprite jump
    makeSpriteJump();
    setTimeout(() => {
      jumping = false;
    }, 500);
  }
};

let slimeId = 1000;

// getter for elements
var getElements = function (selector) {
  return $(selector);
};

// randomGenerator
let generator = {
  prefix: 500,
  postfix: 2000,
  generate: function () {
    return Math.floor(Math.random() * this.prefix) + this.postfix;
  },
};

var pixelDepth = 2;
// generate slimes randomly
function createSlimesRepeatedly() {
  if (terminateAll) {
    return;
  }
  //  random num between 500 - 1000
  let randomSeq = generator.generate();
  setTimeout(() => {
    // first append the slime
    let img = $("<img>", {
      class: "slime",
      id: slimeId,
      src: "./sprites/bat.gif",
    });
    $(".main-inner").append(img);
    // score ++
    changeScore();
    //  then animate
    let intervalId = setInterval(function () {
      let prevPos = $(elem).css("left").match(/(\d+)/)[0];
      let next = parseInt(prevPos) + pixelDepth;
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
    setTimeout(() => {
      slimeId++;
      createSlimesRepeatedly();
    }, 100);
  }, randomSeq);
}

let treeId = 0;

// used for pausing the whole behaviour
let terminateAll = false;
let jumping = false;
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

let idleFrames = [
  // "sneak_01.png",
  "idle_01.png",
  "still_01.png",
  "idle_02.png",
  // "sneak_02.png",
];
function animateCharacterForIdleMode() {
  let startTime = 200;
  idleFrames.forEach((url) => {
    id = setInterval(function () {
      $(".character").attr("src", urlPrefix + url);
    }, startTime);
    idleFrameIds.push(id);
    startTime += 1000;
  });
}

// to-do in presentation
animateCharacterForIdleMode();
playAudio();

var backgroundAudio;

function playAudio() {
  backgroundAudio = new Audio("./audio/character-running.wav");
  backgroundAudio.loop = true;
  backgroundAudio.play();
}

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
    started = false;
    stopTimer();
    resetScore();
    console.log("aww i hit something!");
    // stops background audio
    backgroundAudio.pause();
    // play audio
    new Audio("./audio/character-dead.wav").play();
    putCharacterToDeadMode();
    clearInterval(id);
    // make start button appear
    $("#startBtn").fadeIn();
    $("#closeBtn").fadeOut();
  } else {
    // if global atttr is set pause the game
    if (terminateAll) clearInterval(id);
  }
}

let reviveFrames;
var started = false;
// start button behaviour
$("#startBtn").click(function (event) {
  started = true;
  resetScore();
  $(this).fadeOut();
  resetAllRunningSettings();
  if (backgroundAudio.paused) backgroundAudio.play();
  // start the process
  //  change background
  moveBackgroundAnimationId = setInterval(moveBackground, 100);
  terminateAll = false;
  $("#closeBtn").fadeIn();
  // stop idling
  idleFrameIds.forEach((id) => {
    clearInterval(id);
  });
  startTimer();
  makeBannerVisible($("#lvl1Banner"));
  makeSpriteRun();
  createSlimesRepeatedly();
});

// close btn - haults the current process
$("#closeBtn").fadeOut();
$("#closeBtn").click(function () {
  started = false;
  stopTimer();
  resetScore();
  terminateAll = true;
  $(this).fadeOut();
  $("#startBtn").fadeIn();
});

//  countdown for switching levels
let timer = 0;
let timerId;

function startTimer() {
  timerId = setInterval(changerTimer, 1000);
}

function stopTimer() {
  if (timerId != null) clearInterval(timerId);
  timer = 0;
}

function resetAllRunningSettings() {
  pixelDepth = 2;
  generator.postfix = 2000;
}

function changerTimer() {
  timer++;
  if (timer == 20) {
    // level 2
    makeBannerVisible($("#lvl2Banner"));
    // change the speed
    pixelDepth = 3;
    generator.postfix = 1000;
  } else if (timer == 40) {
    // level 3
    makeBannerVisible($("#lvl3Banner"));
    //  change pixel-depth
    pixelDepth = 4;
    generator.postfix = 700;
  } else if (timer == 60) {
    // level 4
    makeBannerVisible($("lvl4Banner"));
    pixelDepth = 4.5;
  } else if (timer == 80) {
    console.log("game over!");
    terminateAll = true;
    $("#closeBtn").fadeOut();
    $(".congrats").css("visibility", "visible");
    // $(".congrats").fadeIn();
    setTimeout(() => {
      $(".congrats").fadeOut();
      $("#startBtn").fadeIn();
    }, 5000);
  }
}

//  banners for levels
function makeBannerVisible(banner) {
  banner.css("visibility", "visible");
  banner.fadeIn();
  setTimeout(() => {
    banner.fadeOut();
  }, 1000);
}

var backgroundImagePositionX = 0;
var moveBackgroundAnimationId;

//background move Animation function starter
function moveBackground() {
  if (!terminateAll) {
    backgroundImagePositionX = backgroundImagePositionX + 15;
    $(".main-inner").css(
      "backgroundPositionX",
      backgroundImagePositionX + "px"
    );
    console.log(backgroundImagePositionX + "px");
  }
}

// score
var score = 0;
$("#score").html(score);
function changeScore() {
  score++;
  $("#score").html(score);
}

function resetScore() {
  score = 0;
  $("#score").html(score);
}
