//import {Matrix4} from `math.gl`;

// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'precision mediump float;\n' +
  'attribute vec4 a_Position;\n' +
  'attribute vec2 a_UV;\n' +
  'varying vec2 v_UV;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_GlobalRotateMatrix;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ProjectionMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_ProjectionMatrix * u_ViewMatrix \n' +
  '              * u_GlobalRotateMatrix * u_ModelMatrix \n' + 
  '              * a_Position;\n' +
  '  gl_Position = u_GlobalRotateMatrix * u_ModelMatrix \n' + 
  '              * a_Position;\n' +
  '  v_UV = a_UV;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'varying vec2 v_UV;\n' +
  'uniform vec4 u_FragColor;\n' +
  'uniform sampler2D u_Sampler0;\n' +
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '  //gl_FragColor = vec4(v_UV, 0.0, 1.0);\n' +
  '  gl_FragColor = texture2D(u_Sampler0, v_UV);\n' +
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
  // Get the storage location of a_UV
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }
  // Get the storage location of u_ViewMatrix
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }
  // Get the storage location of u_Sampler0
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return;
  }

  // Get the storage location of u_ProjectionMatrix
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
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
let g_globalAnimate = false;
let g_globalAngle = 0;

function addActionsForHtmlUI() {
  document.getElementById('animate').onclick = function() {
    g_globalAnimate = !g_globalAnimate;
  }

  // Angle Slider Events
  document.getElementById('angleSlide').addEventListener('mousemove', function() {
    g_globalAngle = this.value;
    //renderScene();
  });
}

// MAIN
function main() {
  
  setUpWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();

  // Initialize the texture.
  initTextures(0);

  canvas.onmousedown = click;

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  requestAnimationFrame(tick);
}

var g_startTime = performance.now()/1000.0;
var g_seconds   = performance.now()/1000.0 - g_startTime;

function tick() {

  g_seconds = performance.now()/1000.0 - g_startTime;
  //console.log(g_seconds);

  renderScene();

  requestAnimationFrame(tick);
}

let isPoked = false;
let pokeStartTime;
let isDown = false;
function click(ev) {
  if(ev.shiftKey) {
    pokeStartTime = g_seconds;
    isDown = false;
    isPoked = true;
  }
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

  //var morb = new Morb();
  //morb.render();
  var cube = new Cube();
  cube.color = [1.0, 0.0, 0.0, 1.0];
  cube.matrix.rotate(45, 0, 0, 1);
  cube.matrix.scale(.85, .85, .85);
  cube.matrix.translate(-.5, -.5, -.5);
  cube.render();


  var duration = performance.now() - startTime;
  sendTextToHTML(" ms: " + Math.floor(duration) + "  fps: " + Math.floor(10000/duration), "performance");
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