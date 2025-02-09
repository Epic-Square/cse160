//import {Matrix4} from `math.gl`;

// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_GlobalRotateMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

function setUpWebGL() {
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer:true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
  //gl.depthFunc(gl.LEQUAL);
}

function connectVariablesToGLSL() {
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_FragColor
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if(!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
  }
  
  // Get the storage location of u_GlobalRotateMatrix
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if(!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
  }
}

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// UI Elements
let g_selectedColor = [1.0,0.0,0.0,1.0];
let g_selectedSize = 10.0;
let g_selectedType = POINT;
let g_selectedSegments = 10;
let g_selectedRot = [ [1.0, 0.0],
                      [0.0, 1.0]];
// feet - front
let g_globalflRot   = 0;
let g_globalfrRot   = 0;
let g_globalflfRot  = 0;
let g_globalfrfRot  = 0;

// feet - back
let g_globalblRot   = 0;
let g_globalbrRot   = 0;
let g_globalblfRot  = 0;
let g_globalbrfRot  = 0;

let g_globalAngle = 0;

function addActionsForHtmlUI() {
  document.getElementById('clearButton').onclick = function() { 
    g_shapesList = [];
    renderScene
();
  };
  document.getElementById('undo').onclick = function() {

    if(g_shapesList.length > 0) {
      g_shapesList = g_shapesList.slice(0, g_shapesList.length - 1);
      renderScene
  ();
    }
  };
  document.getElementById('drawing').onclick = function() {
    g_shapesList = [];
    addDrawing();
    renderScene
();
  };
  // Shape Type
  document.getElementById('pointButton').onclick = function() {
    g_selectedType = POINT;
  };
  document.getElementById('triButton').onclick = function() {
    g_selectedType = TRIANGLE;
  }
  document.getElementById('circleButton').onclick = function() {
    g_selectedType = CIRCLE;
  }


  // Slider Events
  document.getElementById('redSlide').addEventListener('mouseup', function() {
    g_selectedColor[0] = this.value/100;
  });
  document.getElementById('greenSlide').addEventListener('mouseup', function() {
    g_selectedColor[1] = this.value/100;
  });

  // Feet 
  // front legs
  document.getElementById('flSlider').addEventListener('mousemove', function() {
    g_globalflRot = this.value;
    renderScene();
  });
  document.getElementById('frSlider').addEventListener('mousemove', function() {
    g_globalfrRot = this.value;
    renderScene();
  });

  // front feet
  document.getElementById('flfSlider').addEventListener('mousemove', function() {
    g_globalflfRot = this.value;
    renderScene();
  });
  document.getElementById('frfSlider').addEventListener('mousemove', function() {
    g_globalfrfRot = this.value;
    renderScene();
  });

  // back legs
  document.getElementById('blSlider').addEventListener('mousemove', function() {
    g_globalblRot = this.value;
    renderScene();
  });
  document.getElementById('brSlider').addEventListener('mousemove', function() {
    g_globalbrRot = this.value;
    renderScene();
  });

  // back feet
  document.getElementById('blfSlider').addEventListener('mousemove', function() {
    g_globalblfRot = this.value;
    renderScene();
  });
  document.getElementById('brfSlider').addEventListener('mousemove', function() {
    g_globalbrfRot = this.value;
    renderScene();
  });

  // Angle Slider Events
  document.getElementById('angleSlide').addEventListener('mousemove', function() {
    g_globalAngle = this.value;
    renderScene();
  });
}

// MAIN
function main() {
  
  setUpWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  //canvas.onmousedown = click;
  //canvas.onmousemove = function(ev) { if(ev.buttons == 1) click(ev); };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  renderScene();
}

//var g_points  = [];  // The array for the position of a mouse press
//var g_colors  = [];  // The array to store the color of a point
//var g_size    = [];

var g_shapesList = [];
function click(ev) {
  
  // Extract the event click and return it in WebGL coordinates
  [x,y] = handleClicks(ev);

  // Store the coordinates to g_points array
  let point;
  switch(g_selectedType) {
    case POINT:
      point = new Point();
      break;
    case TRIANGLE:
      point = new Triangle();
      break;
    case CIRCLE:
      point = new Circle();
      point.segments = g_selectedSegments;
      break;
  }
  point.position  = [x, y, 0];
  point.color     = g_selectedColor.slice();
  point.size      = g_selectedSize;
  point.draw      = false;

  g_shapesList.push(point);
  /*
  // Store the coordinates to g_points array
  if (x >= 0.0 && y >= 0.0) {      // First quadrant
    g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
  } else if (x < 0.0 && y < 0.0) { // Third quadrant
    g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
  } else {                         // Others
    g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
  }
  */

  renderScene();
}

function handleClicks(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return ([x, y]);
}

function renderScene() {
  // Clear <canvas>
  var startTime = performance.now();

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var globalRotMat = new Matrix4().rotate(-g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  var bodyColor                 = [.1,0.6,0.4,1.0];
  var footColor                 = [.05,0.4,0.25,1.0];
  var eyeColor                  = [.85,.85,.5,1.0];
  var eyeBallColor              = [0.1,0.1,0.1,1];

  var body = new Cube();
  body.color = bodyColor;
  //body.matrix.translate(0,0,0);
  //body.matrix.rotate(-5,1,0,0); 
  posMid(body); 
  body.render();

  var eye = new Cube();
  eye.color = eyeColor;
  eye.matrix.translate(0,0,-.05);
  var eyeParent = new Matrix4(eye.matrix);
  eye.matrix.scale(.7,.7,.9);
  posMid(eye);
  eye.render();

  var eyeBall = new Cube();
  eyeBall.color = eyeBallColor;
  eyeBall.matrix = eyeParent
  eyeBall.matrix.translate(0,0,-.02); // Displacement
  eyeBall.matrix.scale(.2,.5,.9);
  posMid(eyeBall);
  eyeBall.render();

  var frontRightLeg = new Cube();
  frontRightLeg.color = bodyColor;
  frontRightLeg.matrix.translate(-.25,-.2,-.2); // Displacement
  var frParent = new Matrix4(frontRightLeg.matrix); // Parent
  frontRightLeg.matrix.rotate(g_globalflRot, 0, 0, 1); // animation
  frontRightLeg.matrix.rotate(10, 1, 0, 0);
  frontRightLeg.matrix.rotate(-25, 0, 0, 1);
  frontRightLeg.matrix.scale(.25, .3, .25);
  posTop(frontRightLeg);
  frontRightLeg.render();

  var frontRightFoot = new Cube();
  frontRightFoot.color = footColor;
  frontRightFoot.matrix = frParent; // Child
  frontRightFoot.matrix.rotate(g_globalflRot, 0, 0, 1); // animation leg
  frontRightFoot.matrix.translate(-.05,-.1, -.025); // Displacement: Remembers parent
  frontRightFoot.matrix.rotate(-g_globalflfRot, 0, 0, 1); // animation foot
  frontRightFoot.matrix.scale(.3, .2, .3);
  posTop(frontRightFoot);
  frontRightFoot.render();

  var frontLeftLeg = new Cube();
  frontLeftLeg.color = bodyColor;
  frontLeftLeg.matrix.translate(.25,-.2,-.2); // Displacement
  var flParent = new Matrix4(frontLeftLeg.matrix); // Parent
  frontLeftLeg.matrix.rotate(-g_globalfrRot, 0, 0, 1); // animation leg
  frontLeftLeg.matrix.rotate(10, 1, 0, 0);
  frontLeftLeg.matrix.rotate(25, 0, 0, 1);
  frontLeftLeg.matrix.scale(.25, .3, .25);
  posTop(frontLeftLeg);
  frontLeftLeg.render();

  var frontLeftFoot = new Cube();
  frontLeftFoot.color = footColor;
  frontLeftFoot.matrix = flParent; // Child
  frontLeftFoot.matrix.rotate(-g_globalfrRot, 0, 0, 1); // animation leg
  frontLeftFoot.matrix.translate(.05,-.1, -.025); // Displacement: Remembers parent
  frontLeftFoot.matrix.rotate(-g_globalfrfRot, 0, 0, 1); // animation foot
  frontLeftFoot.matrix.scale(.3, .2, .3);
  posTop(frontLeftFoot);
  frontLeftFoot.render();

  var backRightLeg = new Cube();
  backRightLeg.color = bodyColor;
  backRightLeg.matrix.translate(-.25,-.2,.2); // Displacement
  var brParent = new Matrix4(backRightLeg.matrix); // Parent
  backRightLeg.matrix.rotate(-g_globalbrRot, 0, 0, 1); // animation leg
  backRightLeg.matrix.rotate(-10, 1, 0, 0);
  backRightLeg.matrix.rotate(-25, 0, 0, 1);
  backRightLeg.matrix.scale(.25, .3, .25);
  posTop(backRightLeg);
  backRightLeg.render();

  var backRightFoot = new Cube();
  backRightFoot.color = footColor;
  backRightFoot.matrix = brParent; // Child
  backRightFoot.matrix.rotate(-g_globalbrRot, 0, 0, 1); // animation leg
  backRightFoot.matrix.translate(-.05,-.1, .025); // Displacement: Remembers parent
  backRightFoot.matrix.rotate(-g_globalbrfRot, 0, 0, 1); // animation foot
  backRightFoot.matrix.rotate(0, 0, 0, 1);
  backRightFoot.matrix.scale(.3, .2, .3);
  posTop(backRightFoot);
  backRightFoot.render();

  var backLeftLeg = new Cube();
  backLeftLeg.color = bodyColor;
  backLeftLeg.matrix.translate(.25,-.2,.2); // Displacement
  var blParent = new Matrix4(backLeftLeg.matrix); // Parent
  backLeftLeg.matrix.rotate(-g_globalblRot, 0, 0, 1); // animation leg
  backLeftLeg.matrix.rotate(-10, 1, 0, 0);
  backLeftLeg.matrix.rotate(25, 0, 0, 1);
  backLeftLeg.matrix.scale(.25, .3, .25);
  posTop(backLeftLeg);
  backLeftLeg.render();

  var backLeftFoot = new Cube();
  backLeftFoot.color = footColor;
  backLeftFoot.matrix = blParent; // Child
  backLeftFoot.matrix.rotate(-g_globalblRot, 0, 0, 1); // animation leg
  backLeftFoot.matrix.translate(.05,-.1, .025); // Displacement: Remembers parent
  backLeftFoot.matrix.rotate(-g_globalblfRot, 0, 0, 1); // animation foot
  backLeftFoot.matrix.rotate(0, 0, 0, 1);
  backLeftFoot.matrix.scale(.3, .2, .3);
  posTop(backLeftFoot);
  backLeftFoot.render();
  

  /*
  // Draw-a-left-arm
  var leftArm = new Cube();
  leftArm.color = [1,1,0,1]; 
  leftArm.matrix.setTranslate(0,-.5, 0.0); 
  leftArm.matrix.rotate(-5,1,0,0);
  leftArm.matrix.rotate(0,0,0,1); 
  leftArm.matrix.rotate(-g_globalYellowRot, 0, 0, 1);
  leftArm.matrix.scale(0.25, .7, .5); 
  leftArm.matrix.translate(-.5,0,0);
  leftArm.render();

  // Test box
  var box = new Cube(); 
  box.color = [1,0,1,1];
  box.matrix.translate(-.1,.1,.0,0);
  box.matrix.rotate(-30,1,0,0);
  box.matrix.scale(.2,.4,.2);
  box.render();
  */

  var duration = performance.now() - startTime;
  sendTextToHTML(" ms: " + Math.floor(duration) + "  fps: " + Math.floor(10000/duration), "performance");
}

// Final positioning for center.
function posMid(cube) {
  cube.matrix.translate(-.25,-.25,-.25);
  cube.matrix.scale(.5, .5, .5);
}

// Final positioning for top
function posTop(cube) {
  cube.matrix.translate(-.25,-.5,-.25);
  cube.matrix.scale(.5, .5, .5);
}

function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if(!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}

let ps = [];
function addDrawing() {
  let s = 1.0/6.0; // scale
  ps = []; // points

  // Red Box
  addDrawPoint(0, [.75, 0.0, 0.0, 1.0], [ -5*s, -5*s, 
                                          5*s, -5*s,
                                          -5*s, 5*s]);
  addDrawPoint(1, [0.75, 0.0, 0.0, 1.0], [  5*s, 5*s, 
                                          -5*s, 5*s,
                                          5*s, -5*s]);

  // BL
  addDrawPoint(2, [0.0, 0.0, 0.0, 1.0], [ -4*s, -3.5*s, 
                                          -3*s, -4*s,
                                          -3.5*s, -1*s]);
  addDrawPoint(3, [0.0, 0, 0, 1.0], [ -3*s, -4*s,
                                      -1*s, -3.5*s,
                                      -3.5*s, -1*s]);
  
  // River
  addDrawPoint(4, [0.0, 0, 0, 1.0], [ -4*s, 3.5*s,
                                      2*s, -4*s,
                                      -3*s, 4*s]);
  addDrawPoint(5, [0.0, 0, 0, 1.0], [ 2*s, -4*s,
                                      4.5*s, -2*s,
                                      -3*s, 4*s]);
  addDrawPoint(6, [0.0, 0, 0, 1.0], [ 2*s, -4*s,
                                      4*s, -4*s,
                                      4.5*s, -2*s]);
  
  // TR
  addDrawPoint(7, [0.0, 0, 0, 1.0], [ 1*s, 3.5*s,
                                      3.5*s, 2*s,
                                      3*s, 4*s]);
  addDrawPoint(8, [0.0, 0, 0, 1.0], [ 3*s, 4*s,
                                      3.5*s, 2*s,
                                      4*s, 3.5*s]);

  // LWD: Left Wall Dinks
  addDrawPoint(9, [0.0, 0, 0, 1.0], [ -5*s, -3*s,
                                      -4.75*s, -2.25*s,
                                      -5*s, -2*s]);
  addDrawPoint(10, [0.0, 0, 0, 1.0], [ -5*s, -1*s,
                                        -4.75*s, -.55*s,
                                        -5*s, 0*s]);

  // UWD
  addDrawPoint(11, [0.0, 0, 0, 1.0], [ -3*s, 5*s,
                                        -2*s, 4.75*s,
                                        -1*s, 5*s]);
  addDrawPoint(12, [0.0, 0, 0, 1.0], [  1*s, 5*s,
                                        1.25*s, 4.75*s,
                                        2*s, 5*s]);
  addDrawPoint(13, [0.0, 0, 0, 1.0], [  1.25*s, 4.75*s,
                                        2*s, 4.75*s,
                                        2*s, 5*s]);

  // RWD
  addDrawPoint(14, [0.0, 0, 0, 1.0], [  5*s, 2*s,
                                        4.75*s, 1.5*s,
                                        5*s, 1*s]);
  addDrawPoint(15, [0.0, 0, 0, 1.0], [  5*s, 1*s,
                                        4.75*s, -1*s,
                                        5*s, -1*s]);

  // BWD
  addDrawPoint(16, [0.0, 0, 0, 1.0], [  4*s, -4.75*s,
                                        4*s, -5*s,
                                        5*s, -5*s]);
  addDrawPoint(17, [.75, 0, 0, 1.0], [  -1*s, -5*s,
                                        -.75*s, -5.25*s,
                                        0*s, -5*s]);
  addDrawPoint(18, [.75, 0, 0, 1.0], [  0*s, -5*s,
                                        1.25*s, -5.25*s,
                                        2*s, -5*s]);

  // Last detail
  addDrawPoint(19, [.75, 0, 0, 1.0], [  -.9*s, 4.9*s,
                                        0.8*s, 4.9*s,
                                        0.8*s, 5.2*s]);


  
  for(var i = 0; i < ps.length; i++) {
    g_shapesList.push(ps[i]);
  }
}

function addDrawPoint(i, color, pnts) {
  ps[i] = new Triangle();
  ps[i].size = 10.0;
  ps[i].draw = true;
  ps[i].color = color;
  ps[i].points = pnts;
}