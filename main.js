const LS_SETTINGS_KEY = "hyper-n-back";

/**
 * TODO:
 * 1. Have defaults for settings somewhere and make a procedure to reset them;
 * 2. Save N into settings and add control for that in the left panel too
 * 3. Fix level-up and down
 * 4. Create a modal class and use it for end-of-game summary
 * 5. Save N values and place statistics somewhere
 */

// DOM elements
let sceneWrapper = document.querySelector(".scene-wrapper");
let scene = document.querySelector(".scene");

let floors = [...document.querySelectorAll(".floor")];
let wallColors = [...document.querySelectorAll('[class^="wall"][class$="color"]')];
let wallWords = [...document.querySelectorAll('[class^="wall"][class$="word"]')];

let cube = document.querySelector(".cube");
let faceEls = [...document.querySelectorAll(".cube > .face")];

let innerCube = document.querySelector(".inner-cube");
let innerFaceEls = [...document.querySelectorAll(".inner-cube > .face")];
let shape = document.querySelector(".shape");

let checkWallsBtn = document.querySelector(".check-walls");
let checkCameraBtn = document.querySelector(".check-camera");
let checkFaceBtn = document.querySelector(".check-face");
let checkPositionBtn = document.querySelector(".check-position");

let checkWordBtn = document.querySelector(".check-word");
let checkShapeBtn = document.querySelector(".check-shape");
let checkCornerBtn = document.querySelector(".check-corner");
let checkSoundBtn = document.querySelector(".check-sound");
let checkColorBtn = document.querySelector(".check-color");

let nBackInput = document.querySelector("#n-back");

let sceneDimmerInput = document.querySelector("#scene-dimmer");
let zoomInput = document.querySelector("#zoom");
let perspectiveInput = document.querySelector("#perspective");

let targetStimuliInput = document.querySelector("#targetStimuli");

let baseDelayInput = document.querySelector("#baseDelay");
let minDelayInput = document.querySelector("#minDelay");
let maxDelayInput = document.querySelector("#maxDelay");

let previousLevelThresholdInput = document.querySelector("#previousLevelThreshold");
let nextLevelThresholdInput = document.querySelector("#nextLevelThreshold");

let [
  wallsEnableTrig,
  cameraEnableTrig,
  faceEnableTrig,
  positionEnableTrig,
  wordEnableTrig,
  shapeEnableTrig,
  cornerEnableTrig,
  soundEnableTrig,
  colorEnableTrig
] = [...document.querySelectorAll(".toggle-trigger")];

// Game settings
let wallColorsList = [
  "#00b894",
  "#0984e3",
  "#6c5ce7",
  "#fecb22",
  "#d63031",
  "#a92276"
];
let points = [
  "-60&0", "-60&-45", "-60&-90",
  "-20&0", "-20&-45", "-20&-90"
];
let numbers = "123456";
let initialCubePosition = "-.5em, -3em, .5em";
let moves = [
  "-3.5em, 0, -2.5em", "-.5em, 0, -2.5em", "2.5em, 0, -2.5em",
  "-3.5em, 0, .5em", "-.5em, 0, .5em", "2.5em, 0, .5em",
  "-3.5em, 0, 3.5em", "-.5em, 0, 3.5em", "2.5em, 0, 3.5em",
  
  "-3.5em, -3em, -2.5em", "-.5em, -3em, -2.5em", "2.5em, -3em, -2.5em",
  "-3.5em, -3em, .5em", "2.5em, -3em, .5em",
  "-3.5em, -3em, 3.5em", "-.5em, -3em, 3.5em", "2.5em, -3em, 3.5em",
  
  "-3.5em, -6em, -2.5em", "-.5em, -6em, -2.5em", "2.5em, -6em, -2.5em",
  "-3.5em, -6em, .5em", "-.5em, -6em, .5em", "2.5em, -6em, .5em",
  "-3.5em, -6em, 3.5em", "-.5em, -6em, 3.5em", "2.5em, -6em, 3.5em"
];

let wordsList = [
  "forest",
  "desert",
  "island",
  "jungle",
  "road",
  "city",
  "river",
  "park",
  "sea",
  "fog",
  "rain",
  "snow"
];
let shapeClasses = ["triangle", "square", "circle"];
let initialInnerCubePosition = ".5em, .5em, 0";
let cornersList = [
  "2px, 2px, calc(.5em - 2px)",
  "2px, 2px, calc(-.5em + 2px)",
  "calc(1em - 2px), 2px, calc(-.5em + 2px)",
  "calc(1em - 2px), 2px, calc(.5em - 2px)",
  
  "0, calc(1em - 2px), calc(.5em - 2px)",
  "0, calc(1em - 2px), calc(-.5em + 2px)",
  "calc(1em - 2px), calc(1em - 2px), calc(-.5em + 2px)",
  "calc(1em - 2px), calc(1em - 2px), calc(.5em - 2px)"
];
let letters = "abflqy";
let colorClasses = [
  "col-a", "col-b", "col-c", "col-d", "col-e", "col-f"
];

// Editable settings
let wallsEnabled = true;
let cameraEnabled = true;
let faceEnabled = true;
let positionEnabled = true;
let wordEnabled = true;
let shapeEnabled = true;
let cornerEnabled = true;
let soundEnabled = true;
let colorEnabled = true;
let tileAHexColor = "#111";
let tileBHexColor = "#888";
let sceneDimmer = 0.5;
let zoom = 0.7;
let perspective = 15;
let targetNumOfStimuli = 5;
let gameStartDelay = 3000;
let baseDelay = 5000;
let minDelay = 2000;
let maxDelay = 10000;
let prevLevelThreshold = 0.5;
let nextLevelThreshold = 0.9;

// Game states
let matchingStimuli = 0;
let stimuliCount = 0;
let intervals = [];

let isRunning = false;

let enableWallsCheck = true;
let enableCameraCheck = true;
let enableFaceCheck = true;
let enablePositionCheck = true;

let enableWordCheck = true;
let enableShapeCheck = true;
let enableCornerCheck = true;
let enableSoundCheck = true;
let enableColorCheck = true;

let currWalls;
let currCamera;
let currFace;
let currPosition;

let currWord;
let currShape;
let currCorner;
let currSound;
let currColor;

let rightWalls = 0;
let rightCamera = 0;
let rightFace = 0;
let rightPosition = 0;

let rightWord = 0;
let rightShape = 0;
let rightCorner = 0;
let rightSound = 0;
let rightColor = 0;

let wrongWalls = 0;
let wrongCamera = 0;
let wrongFace = 0;
let wrongPosition = 0;

let wrongWord = 0;
let wrongShape = 0;
let wrongCorner = 0;
let wrongSound = 0;
let wrongColor = 0;

// Events
wallsEnableTrigHandler(null, wallsEnabled);
wallsEnableTrig.addEventListener("input", wallsEnableTrigHandler);

cameraEnableTrigHandler(null, cameraEnabled);
cameraEnableTrig.addEventListener("input", cameraEnableTrigHandler);

faceEnableTrigHandler(null, faceEnabled);
faceEnableTrig.addEventListener("input", faceEnableTrigHandler);

positionEnableTrigHandler(null, positionEnabled);
positionEnableTrig.addEventListener("input", positionEnableTrigHandler);

wordEnableTrigHandler(null, wordEnabled);
wordEnableTrig.addEventListener("input", wordEnableTrigHandler);

shapeEnableTrigHandler(null, shapeEnabled);
shapeEnableTrig.addEventListener("input", shapeEnableTrigHandler);

cornerEnableTrigHandler(null, cornerEnabled);
cornerEnableTrig.addEventListener("input", cornerEnableTrigHandler);

soundEnableTrigHandler(null, faceEnabled);
soundEnableTrig.addEventListener("input", soundEnableTrigHandler);

colorEnableTrigHandler(null, colorEnabled);
colorEnableTrig.addEventListener("input", colorEnableTrigHandler);

sceneDimmerInputHandler(null, sceneDimmer);
sceneDimmerInput.addEventListener("input", sceneDimmerInputHandler);

zoomInputHandler(null, zoom);
zoomInput.addEventListener("input", zoomInputHandler);

perspectiveInputHandler(null, perspective);
perspectiveInput.addEventListener("input", perspectiveInputHandler);

targetStimuliInputHandler(null, targetNumOfStimuli);
targetStimuliInput.addEventListener("input", targetStimuliInputHandler);

baseDelayInputHandler(null, baseDelay);
baseDelayInput.addEventListener("input", baseDelayInputHandler);

minDelayInputHandler(null, minDelay);
minDelayInput.addEventListener("input", minDelayInputHandler);

maxDelayInputHandler(null, maxDelay);
maxDelayInput.addEventListener("input", maxDelayInputHandler);

previousLevelThresholdInputHandler(null, prevLevelThreshold * 100);
previousLevelThresholdInput.addEventListener("input", previousLevelThresholdInputHandler);

nextLevelThresholdInputHandler(null, nextLevelThreshold * 100);
nextLevelThresholdInput.addEventListener("input", nextLevelThresholdInputHandler);

loadSettings();

// Functions
function wallsEnableTrigHandler(evt, defVal) {
  if (defVal != null) {
    wallsEnableTrig.checked = defVal;
  } else {
    wallsEnabled = !wallsEnabled;
    saveSettings();
  }

  if (!wallsEnabled) {
    checkWallsBtn.style.display = "none";
  } else {
    checkWallsBtn.style.display = "inline-block";
  }

  checkWallsBtn.style.animationDelay = "0s";
}

function cameraEnableTrigHandler(evt, defVal) {
  if (defVal != null) {
    cameraEnableTrig.checked = defVal;
  } else {
    cameraEnabled = !cameraEnabled;
    saveSettings();
  }

  if (!cameraEnabled) {
    checkCameraBtn.style.display = "none";
  } else {
    checkCameraBtn.style.display = "inline-block";
  }

  checkCameraBtn.style.animationDelay = "0s";
}

function faceEnableTrigHandler(evt, defVal) {
  if (defVal != null) {
    faceEnableTrig.checked = defVal;
  } else {
    faceEnabled = !faceEnabled;
    saveSettings();
  }

  if (!faceEnabled) {
    checkFaceBtn.style.display = "none";
  } else {
    checkFaceBtn.style.display = "inline-block";
  }

  checkFaceBtn.style.animationDelay = "0s";
}

function positionEnableTrigHandler(evt, defVal) {
  if (defVal != null) {
    positionEnableTrig.checked = defVal;
  } else {
    positionEnabled = !positionEnabled;
    saveSettings();
  }

  if (!positionEnabled) {
    checkPositionBtn.style.display = "none";
  } else {
    checkPositionBtn.style.display = "inline-block";
  }

  checkPositionBtn.style.animationDelay = "0s";
}

function wordEnableTrigHandler(evt, defVal) {
  if (defVal != null) {
    wordEnableTrig.checked = defVal;
  } else {
    wordEnabled = !wordEnabled;
    saveSettings();
  }

  if (!wordEnabled) {
    checkWordBtn.style.display = "none";
  } else {
    checkWordBtn.style.display = "inline-block";
  }
  
  checkWordBtn.style.animationDelay = "0s";
}

function shapeEnableTrigHandler(evt, defVal) {
  if (defVal != null) {
    shapeEnableTrig.checked = defVal;
  } else {
    shapeEnabled = !shapeEnabled;
    saveSettings();
  }

  if (!shapeEnabled) {
    checkShapeBtn.style.display = "none";
  } else {
    checkShapeBtn.style.display = "inline-block";
  }

  checkShapeBtn.style.animationDelay = "0s";
}

function cornerEnableTrigHandler(evt, defVal) {
  if (defVal != null) {
    cornerEnableTrig.checked = defVal;
  } else {
    cornerEnabled = !cornerEnabled;
    saveSettings();
  }
  
  if (!cornerEnabled) {
    shapeEnableTrig.removeEventListener("input", shapeEnableTrigHandler);
    
    shapeEnabled = false;
    if (shapeEnableTrig.checked) {
      shapeEnableTrig.click();
    }
    shapeEnableTrig.disabled = true;
    
    innerCube.style.display = "none";
    checkCornerBtn.style.display = "none";
    checkShapeBtn.style.display = "none";
  } else {
    shapeEnableTrig.addEventListener("input", shapeEnableTrigHandler);
    shapeEnableTrig.disabled = false;
    
    innerCube.style.display = "block";
    checkCornerBtn.style.display = "inline-block";
  }
  
  innerFaceEls.forEach(face => face.style.animationDelay = "0s"),
  checkCornerBtn.style.animationDelay = "0s";
}

function soundEnableTrigHandler(evt, defVal) {
  if (defVal != null) {
    soundEnableTrig.checked = defVal;
  } else {
    soundEnabled = !soundEnabled;
    saveSettings();
  }

  if (!soundEnabled) {
    checkSoundBtn.style.display = "none";
  } else {
    checkSoundBtn.style.display = "inline-block";
  }

  checkSoundBtn.style.animationDelay = "0s";
}

function colorEnableTrigHandler(evt, defVal) {
  if (defVal != null) {
    colorEnableTrig.checked = defVal;
  } else {
    colorEnabled = !colorEnabled;
    saveSettings();
  }

  if (!colorEnabled) {
    checkColorBtn.style.display = "none";
  } else {
    checkColorBtn.style.display = "inline-block";
  }

  checkColorBtn.style.animationDelay = "0s"
}

function sceneDimmerInputHandler(evt, defVal) {
  if (defVal) {
    sceneDimmerInput.value = defVal;
  } else {
    sceneDimmer = +sceneDimmerInput.value;
    saveSettings();
  }

  floors.forEach(floor =>
    setFloorBackground(
      floor,
      sceneDimmer,
      tileAHexColor,
      tileBHexColor
    )
  );
}

function zoomInputHandler(evt, defVal) {
  if (defVal) {
    zoomInput.value = defVal;
  } else {
    zoom = +zoomInput.value;
    saveSettings();
  }
  sceneWrapper.style.transform = `scale(${zoom})`;
}

function perspectiveInputHandler(evt, defVal) {
  if (defVal) {
    perspectiveInput.value = defVal;
  } else {
    perspective = +perspectiveInput.value;
    saveSettings();
  }
  sceneWrapper.style.perspective = `${perspective}em`;
}

function targetStimuliInputHandler(evt, defVal) {
  if (defVal) {
    targetStimuliInput.value = defVal;
  } else {
    targetNumOfStimuli = +targetStimuliInput.value;
    saveSettings();  
  }
}

function baseDelayInputHandler(evt, defVal) {
  if (defVal != null) {
    baseDelayInput.value = defVal;
  } else {
    baseDelay = Math.min(Math.max(+baseDelayInput.value, minDelay), maxDelay);
    saveSettings();
  }

  if (+baseDelayInput.value < minDelay || +baseDelayInput.value > maxDelay) {
    baseDelayInput.style.borderColor = "#f00";
  } else {
    baseDelayInput.style.borderColor = "#fff";
  }
}

function minDelayInputHandler(evt, defVal) {
  if (defVal != null) {
    minDelayInput.value = defVal;
  } else {
    minDelay = Math.min(+minDelayInput.value, baseDelay);
    saveSettings();
  }

  if (+minDelayInput.value > baseDelay) {
    minDelayInput.style.borderColor = "#f00";
  } else {
    minDelayInput.style.borderColor = "#fff";
  }
}

function maxDelayInputHandler(evt, defVal) {
  if (defVal != null) {
    maxDelayInput.value = defVal;
  } else {
    maxDelay = Math.max(+maxDelayInput.value, baseDelay);
    saveSettings();
  }

  if (+maxDelayInput.value < baseDelay) {
    maxDelayInput.style.borderColor = "#f00";
  } else {
    maxDelayInput.style.borderColor = "#fff";
  }
}

function previousLevelThresholdInputHandler(evt, defVal) {
  if (defVal != null) {
    previousLevelThresholdInput.value = defVal * 100;
  } else {
    prevLevelThreshold = +previousLevelThresholdInput.value / 100;
    saveSettings();
  }
}

function nextLevelThresholdInputHandler(evt, defVal) {
  if (defVal != null) {
    nextLevelThresholdInput.value = defVal * 100;
  } else {
    nextLevelThreshold = +nextLevelThresholdInput.value / 100;  
    saveSettings();
  }
}

function setFloorBackground(floor, dimPercent, tileAHexColor, tileBHexColor) {
  if (dimPercent > 1) {
    dimPercent = 1;
  }
  let hexSymbols = "0123456789abcdef";
  let hexBrightness = hexSymbols[
    Math.floor(dimPercent * (hexSymbols.length - 1))
  ];
  if (floor.classList.contains("floor-bottom")) {
    floor.style.backgroundImage = `linear-gradient(
  #000${hexBrightness},
  #000${hexBrightness}
),
radial-gradient(
  at 0px 0px,
  #0000,
  #0000 15%,
  20%,
  #000
),
repeating-conic-gradient(
  ${tileAHexColor} 0deg,
  ${tileAHexColor} 90deg,
  ${tileBHexColor} 90deg,
  ${tileBHexColor} 180deg
)`;
  } else if (floor.classList.contains("floor-left")) {
    floor.style.backgroundImage = `linear-gradient(
  #000${hexBrightness},
  #000${hexBrightness}
),
radial-gradient(
  at 54em 53.5em,
  #0000,
  #0000 15%,
  20%,
  #000
),
repeating-conic-gradient(
  ${tileAHexColor} 0deg,
  ${tileAHexColor} 90deg,
  ${tileBHexColor} 90deg,
  ${tileBHexColor} 180deg
)`;
  } else {
    floor.style.backgroundImage = `linear-gradient(
  #000${hexBrightness},
  #000${hexBrightness}
),
radial-gradient(
  at 0 53.5em,
  #0000,
  #0000 15%,
  20%,
  #000
),
repeating-conic-gradient(
  ${tileBHexColor} 0deg,
  ${tileBHexColor} 90deg,
  ${tileAHexColor} 90deg,
  ${tileAHexColor} 180deg
)`;
  }
}

function saveSettings() {
  const stringifiedSettings = JSON.stringify({
    wallsEnabled,
    cameraEnabled,
    faceEnabled,
    positionEnabled,
    wordEnabled,
    shapeEnabled,
    cornerEnabled,
    soundEnabled,
    colorEnabled,
    //
    sceneDimmer,
    zoom,
    perspective,
    targetNumOfStimuli,
    baseDelay,
    minDelay,
    maxDelay,
    prevLevelThreshold,
    nextLevelThreshold
  });
  localStorage.setItem(LS_SETTINGS_KEY, stringifiedSettings);
}

function loadSettings() {
  const settings = JSON.parse(localStorage.getItem(LS_SETTINGS_KEY));
  if (settings) {
    wallsEnabled = settings.wallsEnabled;
    wallsEnableTrigHandler(null, wallsEnabled);
    cameraEnabled = settings.cameraEnabled;
    cameraEnableTrigHandler(null, cameraEnabled);
    faceEnabled = settings.faceEnabled;
    faceEnableTrigHandler(null, faceEnabled);
    positionEnabled = settings.positionEnabled;
    positionEnableTrigHandler(null, positionEnabled);
    wordEnabled = settings.wordEnabled;
    wordEnableTrigHandler(null, wordEnabled);
    shapeEnabled = settings.shapeEnabled;
    shapeEnableTrigHandler(null, shapeEnabled);
    cornerEnabled = settings.cornerEnabled;
    cornerEnableTrigHandler(null, cornerEnabled);
    soundEnabled = settings.soundEnabled;
    soundEnableTrigHandler(null, soundEnabled);
    colorEnabled = settings.colorEnabled;
    colorEnableTrigHandler(null, colorEnabled);
    //
    sceneDimmer = settings.sceneDimmer;
    sceneDimmerInputHandler(null, sceneDimmer);
    zoom = settings.zoom;
    zoomInputHandler(null, zoom);
    perspective = settings.perspective;
    perspectiveInputHandler(null, perspective);
    targetNumOfStimuli = settings.targetNumOfStimuli;
    targetStimuliInputHandler(null, targetNumOfStimuli);
    baseDelay = settings.baseDelay;
    baseDelayInputHandler(null, baseDelay);
    minDelay = settings.minDelay;
    minDelayInputHandler(null, minDelay);
    maxDelay = settings.maxDelay;
    maxDelayInputHandler(null, maxDelay);
    prevLevelThreshold = settings.prevLevelThreshold;
    previousLevelThresholdInputHandler(null, prevLevelThreshold);
    nextLevelThreshold = settings.nextLevelThreshold;
    nextLevelThresholdInputHandler(null, nextLevelThreshold);
  }
}

function random(iterable) {
  return iterable[
    Math.floor(
      Math.random() * iterable.length
    )
  ];
}

// Create the blocks
function createBlocks(symbols, n) {
  
  // I don't know how many matching stimuli will be generated in the end
  // But I'm sure they are more than stimuli
  let blocks = Array(
    targetNumOfStimuli * (n + 2) + targetNumOfStimuli
  ).fill(null);
  // Place stimuli
  for (let i = 0; i < targetNumOfStimuli; i++) {
    // Pick a letter
    let symbol = random(symbols);
    // Pick a spot
    let rnd = Math.floor(Math.random() * (blocks.length - n));
    while (blocks[rnd] || blocks[rnd - n] || blocks[rnd + n]) {
      rnd = Math.floor(Math.random() * (blocks.length - n - 1));
    }
    // Put the signal
    blocks[rnd] = {
      isMatching: undefined, // I'll have to figure out if it's matching
      symbol: symbol
    };
    blocks[rnd + n] = {
      isMatching: true,
      symbol: symbol
    };
    matchingStimuli++;
  }
  // Place noise
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i] && blocks[i].isMatching) {
      continue;
    }
    let prev = blocks[i - n];
    let next = blocks[i + n];
    if (blocks[i] && blocks[i].isMatching === undefined) {
      if (prev && prev.symbol === blocks[i].symbol) {
        blocks[i].isMatching = true;
        matchingStimuli++;
      } else {
        blocks[i].isMatching = false;
      }
      continue;
    }
    // Pick noise
    let noise = random(symbols);
    // Place noise
    if (prev && prev.symbol === noise) {
      blocks[i] = {
        isMatching: true,
        symbol: noise
      };
      matchingStimuli++;
    } else {
      blocks[i] = {
        isMatching: false,
        symbol: noise
      };
    }
    if (next && next.symbol === noise) {
      next.isMatching = true;
      matchingStimuli++;
    }
  }
  console.log("Matching stimuli", matchingStimuli);
  return blocks;
}

function resetPoints() {
  matchingStimuli = 0;
  
  rightWalls = 0;
  rightCamera = 0;
  rightFace = 0;
  rightPosition = 0;
  
  rightWord = 0;
  rightShape = 0;
  rightCorner = 0;
  rightSound = 0;
  rightColor = 0;
  
  wrongWalls = 0;
  wrongCamera = 0;
  wrongFace = 0;
  wrongPosition = 0;
  
  wrongWord = 0;
  wrongShape = 0;
  wrongCorner = 0;
  wrongSound = 0;
  wrongColor = 0;
  
  move(cube, initialCubePosition);
  move(innerCube, initialInnerCubePosition);
  rotateCamera(-40, -45);
  floors.forEach(floor =>
    setFloorBackground(
      floor,
      sceneDimmer,
      tileAHexColor,
      tileBHexColor
    )
  );
}

function resetBlock() {
  enableWallsCheck = true;
  enableCameraCheck = true;
  enableFaceCheck = true;
  enablePositionCheck = true;
  
  enableWordCheck = true;
  enableShapeCheck = true;
  enableCornerCheck = true;
  enableSoundCheck = true;
  enableColorCheck = true;
  
  currWalls = null;
  currCamera = null;
  currFace = null;
  currPosition = null;
  
  currWord = null;
  currShape = null;
  currCorner = null;
  currSound = null;
  currColor = null;
  
  checkWallsBtn.classList.remove("right", "wrong");
  checkCameraBtn.classList.remove("right", "wrong");
  checkFaceBtn.classList.remove("right", "wrong");
  checkPositionBtn.classList.remove("right", "wrong");
  
  checkWordBtn.classList.remove("right", "wrong");
  checkShapeBtn.classList.remove("right", "wrong");
  checkCornerBtn.classList.remove("right", "wrong");
  checkSoundBtn.classList.remove("right", "wrong");
  checkColorBtn.classList.remove("right", "wrong");
}

function resetIntervals() {
  intervals.forEach(interval => 
    clearInterval(interval)
  );
}

function rotateCamera(cx, cy) {
  scene.style.transform = `rotateX(${cx}deg) rotateY(${cy}deg)`;
  shape.style.transform = `translate(-50%, -50%) rotateY(${-cy}deg) rotateX(${-cx}deg)`;
}

function move(el, currPosString) {
  el.style.transform = `translate3d(${currPosString})`;
}

function wow(htmlElement, cssClass, delay) {
  htmlElement.classList.add(cssClass);
  setTimeout(() => 
    htmlElement.classList.remove(cssClass)
  , delay);
}

function speak(text) {
  let utter = new SpeechSynthesisUtterance();
  utter.lang = 'en-US';
  utter.text = text;
  speechSynthesis.speak(utter);
  return utter;
}

function writeWord(word) {
  wallWords.forEach(wall => {
    wall.innerText = word;
    wow(wall, "text-white", baseDelay - 300);
  });
}

function getGameCycle(n) {
  
  let walls;
  if (wallsEnabled) {
    walls = createBlocks(wallColorsList, n);
  }
  let cameras;
  if (cameraEnabled) {
    cameras = createBlocks(points, n);
  }
  let faces;
  if (faceEnabled) {
    faces = createBlocks(numbers, n);
  }
  let positions;
  if (positionEnabled) {
    positions = createBlocks(moves, n);
  }
  
  let words;
  if (wordEnabled) {
    words = createBlocks(wordsList, n);
  }
  let shapes;
  if (shapeEnabled) {
    shapes = createBlocks(shapeClasses, n);
  }
  let corners;
  if (cornerEnabled) {
    corners = createBlocks(cornersList, n);
  }
  let sounds;
  if (soundEnabled) {
    sounds = createBlocks(letters, n);
  }
  let colors;
  if (colorEnabled) {
    colors = createBlocks(colorClasses, n);
  }
  
  console.log(
    walls, cameras, faces, positions, words, shapes, corners, sounds, colors
  );
  
  let i = 0;
  return function() {
    
    resetBlock();
    
    if (!isRunning) {
      return;
    }
    
    let length = targetNumOfStimuli * (n + 2) + targetNumOfStimuli;
    
    // End game
    if (i > length - 1) {
      
      let correctStimuli = 0;
      if (wallsEnabled) {
        correctStimuli += rightWalls;
      }
      if (cameraEnabled) {
        correctStimuli += rightCamera;
      }
      if (faceEnabled) {
        correctStimuli += rightFace;
      }
      if (positionEnabled) {
        correctStimuli += rightPosition;
      }
      
      if (wordEnabled) {
        correctStimuli += rightWord;
      }
      if (cornerEnabled) {
        correctStimuli += rightCorner;
        if (shapeEnabled) {
          correctStimuli += rightShape;
        }
      }
      if (soundEnabled) {
        correctStimuli += rightSound;
      }
      if (colorEnabled) {
        correctStimuli += rightColor;
      }
      let percentage = correctStimuli / matchingStimuli;
      
      let mistakes = 0;
      if (wallsEnabled) {
        mistakes += wrongWalls;
      }
      if (cameraEnabled) {
        mistakes += wrongCamera;
      }
      if (faceEnabled) {
        mistakes += wrongFace;
      }
      if (positionEnabled) {
        mistakes += wrongPosition;
      }
      
      if (wordEnabled) {
        mistakes += wrongWord;
      }
      if (cornerEnabled) {
        mistakes += wrongCorner;
        if (shapeEnabled) {
          mistakes += wrongShape;
        }
      }
      if (soundEnabled) {
        mistakes += wrongSound;
      }
      if (colorEnabled) {
        mistakes += wrongColor;
      };
      let errorThresholdUpper = 1; // old one: matchingStimuli * 0.4;
      let errorThresholdLower = 3;
      
      // Delay calculation, adapting to the user skill level
      let missed = matchingStimuli - correctStimuli;
      let deltaDelay = missed * 200 + mistakes * 200 - correctStimuli * 100;
      let newBaseDelay = Math.min(Math.max(baseDelay + deltaDelay, minDelay), maxDelay);
      let hasDelayChanged = newBaseDelay !== +baseDelay; // I don't remember if baseDelay is a number or a string so I cast with +
      baseDelay = newBaseDelay;
      baseDelayInput.value = newBaseDelay;
      
      console.log("Matching", matchingStimuli);
      console.log("Correct", correctStimuli);
      console.log("Missed", missed);
      console.log("Mistaken", mistakes);
      
      stop(); // This resets stuff (matchingStimuli etc...)
      
      speak(`You've got ${Math.floor(percentage * 100)} percent of correct stimuli. With ${mistakes} mistake${(mistakes > 1) ? "s" : ""}.`)
        .onend = function () {
          if (
            percentage >= nextLevelThreshold
            && mistakes <= errorThresholdUpper
            && +nBackInput.value < 9
          ) {
            speak("Congratulations! Advancing to the next level.");
            nBackInput.value = +nBackInput.value + 1;
          } else if (
            (percentage <= prevLevelThreshold || mistakes > errorThresholdLower)
            && +nBackInput.value > 1
          ) {
            speak("Going back to the previous level.");
            nBackInput.value = +nBackInput.value - 1;
          } else {
            speak("Level remains the same.");
          }
        
          // Delay changes
          if (!hasDelayChanged) {
            speak("Delay between stimuli, stays the same."); 
          } else if (deltaDelay > 0) {
            speak(`Delay between stimuli, increased to ${baseDelay / 1000} seconds`);
          } else {
            speak(`Delay between stimuli, decreased to ${baseDelay / 1000} seconds`); 
          }
        };
      
      return;
    }
    
    // Count stimulus
    stimuliCount++;
    
    // Animating stimuli
    if (wallsEnabled) {
      currWalls = walls[i];
      floors.forEach(floor =>
        setFloorBackground(
          floor,
          sceneDimmer,
          tileAHexColor,
          currWalls.symbol
        )
      );
    }
    if (cameraEnabled) {
      currCamera = cameras[i];
      let [cx, cy] = currCamera.symbol.split("&");
      rotateCamera(cx, cy);
    }
    if (faceEnabled) {
      currFace = faces[i];
      if (colorEnabled) {
        currColor = colors[i];
        wow(faceEls[currFace.symbol - 1], currColor.symbol, baseDelay - 500);
      } else {
        wow(faceEls[currFace.symbol - 1], "col-a", baseDelay - 500);
      }
    } else if (colorEnabled) {
      currColor = colors[i];
      wow(faceEls[0], currColor.symbol, baseDelay - 500);
    }
    if (positionEnabled) {
      currPosition = positions[i];
      move(cube, currPosition.symbol);
    }
    
    if (wordEnabled) {
      currWord = words[i];
      writeWord(currWord.symbol);
    }
    if (cornerEnabled) {
      currCorner = corners[i];
      move(innerCube, currCorner.symbol);
      
      if (shapeEnabled) {
        currShape = shapes[i];
        wow(shape, currShape.symbol, baseDelay - 700);
      }
    }
    if (soundEnabled) {
      currSound = sounds[i];
      speak(currSound.symbol);
    }
    
    // Increase block index
    i++;
    
  }
}

function play() {
  if (isRunning) {
    return;
  }
  
  isRunning = true;
  
  speak("Start.");
  document.querySelector(".stop").classList.remove("active");
  document.querySelector(".play").classList.add("active");
  
  let n = +nBackInput.value;
  let gameCycle = getGameCycle(n);
  setTimeout(gameCycle, gameStartDelay);
  intervals.push(
    setInterval(
      gameCycle,
      gameStartDelay + baseDelay
    )
  );
}

function stop() {
  if (!isRunning) {
    return;
  }
  
  resetPoints();
  resetBlock();
  resetIntervals();
  
  isRunning = false;
  
  speak("Stop.");
  document.querySelector(".stop").classList.add("active");
  document.querySelector(".play").classList.remove("active");
}

function checkHandler(sense) {
  let curr;
  let button;
  let enable;
  
  // This part is garbage but hey I've used single vars xD
  if (sense === "walls") {
    curr = currWalls;
    button = checkWallsBtn;
    enable = enableWallsCheck;
  } else if (sense === "camera") {
    curr = currCamera;
    button = checkCameraBtn;
    enable = enableCameraCheck;
  } else if (sense === "face") {
    curr = currFace;
    button = checkFaceBtn;
    enable = enableFaceCheck;
  } else if (sense === "position") {
    curr = currPosition;
    button = checkPositionBtn;
    enable = enablePositionCheck;
  } else if (sense === "word") {
    curr = currWord;
    button = checkWordBtn;
    enable = enableWordCheck;
  } else if (sense === "shape") {
    curr = currShape;
    button = checkShapeBtn;
    enable = enableShapeCheck;
  } else if (sense === "corner") {
    curr = currCorner;
    button = checkCornerBtn;
    enable = enableCornerCheck;
  } else if (sense === "sound") {
    curr = currSound;
    button = checkSoundBtn;
    enable = enableSoundCheck;
  } else if (sense === "color") {
    curr = currColor;
    button = checkColorBtn;
    enable = enableColorCheck;
  }
  
  if (!curr || !enable) {
    return;
  }
  
  if (sense === "walls") {
    enableWallsCheck = false;
  } else if (sense === "camera") {
    enableCameraCheck = false;
  } else if (sense === "face") {
    enableFaceCheck = false;
  } else if (sense === "position") {
    enablePositionCheck = false;
  } else if (sense === "word") {
    enableWordCheck = false;
  } else if (sense === "shape") {
    enableShapeCheck = false;
  } else if (sense === "corner") {
    enableCornerCheck = false;
  } else if (sense === "sound") {
    enableSoundCheck = false;
  } else if (sense === "color") {
    enableColorCheck = false;
  }
  
  console.log(sense, curr, button, enable);
  
  if (curr.isMatching) {
    
    if (sense === "walls") {
      rightWalls++;
    } else if (sense === "camera") {
      rightCamera++;
    } else if (sense === "face") {
      rightFace++;
    } else if (sense === "position") {
      rightPosition++;
    } else if (sense === "word") {
      rightWord++;
    } else if (sense === "shape") {
      rightShape++;
    } else if (sense === "corner") {
      rightCorner++;
    } else if (sense === "sound") {
      rightSound++;
    } else if (sense === "color") {
      rightColor++;
    }
    
    button.classList.add("right");
  } else {
    
    if (sense === "walls") {
      wrongWalls++;
    } else if (sense === "camera") {
      wrongCamera++;
    } else if (sense === "face") {
      wrongFace++;
    } else if (sense === "position") {
      wrongPosition++;
    } else if (sense === "word") {
      wrongWord++;
    } if (sense === "shape") {
      wrongShape++;
    } else if (sense === "corner") {
      wrongCorner++;
    } else if (sense === "sound") {
      wrongSound++;
    } else if (sense === "color") {
      wrongColor++;
    }
    
    button.classList.add("wrong");
  }
}

["walls", "camera", "face", "position", "word", "shape", "corner", "sound", "color"]
  .forEach(sense => {
    document.querySelector(".check-" + sense)
      .addEventListener(
        "click",
        () => checkHandler(sense)
      );
    document.querySelector(".check-" + sense)
      .addEventListener(
        "touchstart",
        () => checkHandler(sense)
      );
  });

document.addEventListener(
  "keypress",
  evt => {
    if (evt.code === "KeyA") {
      checkHandler("walls");
    } else if (evt.code === "KeyS") {
      checkHandler("camera");
    } else if (evt.code === "KeyD") {
      checkHandler("face");
    } else if (evt.code === "KeyF") {
      checkHandler("position");
    } else if (evt.code === "KeyG") {
      checkHandler("word");
    } else if (evt.code === "KeyH") {
      checkHandler("shape");
    } else if (evt.code === "KeyJ") {
      checkHandler("corner");
    } else if (evt.code === "KeyK") {
      checkHandler("sound");
    } else if (evt.code === "KeyL") {
      checkHandler("color");
    } else if (evt.code === "KeyQ") {
      play();
    } else if (evt.code === "KeyP") {
      stop();
    }
  }
);
