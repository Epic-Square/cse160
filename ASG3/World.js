//import {Matrix4} from `math.gl`;

// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'precision mediump float;\n' +
  'attribute vec4 a_Position;\n' +
  'attribute vec2 a_UV;\n' +
  'attribute vec3 a_Normal;\n' +
  'varying vec2 v_UV;\n' +
  'varying vec3 v_Normal;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_GlobalRotateMatrix;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ProjectionMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_ProjectionMatrix * u_ViewMatrix \n' +
  '              * u_GlobalRotateMatrix * u_ModelMatrix \n' + 
  '              * a_Position;\n' +
  //'  gl_Position = u_GlobalRotateMatrix * u_ModelMatrix \n' + 
  //'              * a_Position;' +
  '  v_UV = a_UV;\n' +
  '  v_Normal = a_Normal;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'varying vec2 v_UV;\n' +
  'varying vec3 v_Normal;\n' +
  'uniform vec4 u_FragColor;\n' +
  'uniform sampler2D u_Sampler0;\n' +
  'uniform sampler2D u_Sampler1;\n' +
  'uniform sampler2D u_Sampler2;\n' +
  'uniform sampler2D u_Sampler3;\n' +
  'uniform float u_text;\n' +
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);\n' + // Default color in case of error
  '  if(u_text == 0.0) {\n' +
  '     gl_FragColor = u_FragColor;\n' +
  '  } else if(u_text == 1.0) {\n' +
  '     gl_FragColor = texture2D(u_Sampler0, v_UV);\n' +
  '  } else if(u_text == 2.0) {\n' +
  '     gl_FragColor = texture2D(u_Sampler1, v_UV);\n' +
  '  } else if(u_text == 3.0) {\n' +
  '     gl_FragColor = texture2D(u_Sampler2, v_UV);\n' +
  '  } else if(u_text == 4.0) {\n' +
  '     gl_FragColor = texture2D(u_Sampler3, v_UV);\n' +
  '  }\n' +
  '}\n';

let canvas;
let gl;
//let a_Position;
//let u_FragColor;
//let u_Size;

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

  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
    return;
  }

  // Get the storage location of u_ViewMatrix
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
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

  u_text = gl.getUniformLocation(gl.program, 'u_text');
  if(!u_text) {
    console.log('Failed to get the storage location of u_text');
  }
}

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// UI Elements
let g_globalAnimate = true;
let g_globalAngle = 0;

function addActionsForHtmlUI() {
  //document.getElementById('animate').onclick = function() {
  //  g_globalAnimate = !g_globalAnimate;
  //}

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

  var test = new Matrix4();

  test.setLookAt( 0, 0, 10,
                  0, 0, 0,
                  0, 1, 0
  );

  console.log(test);

  // Initialize the texture.
  initTextures(0);
  initTextures(1);
  initTextures(2);
  initTextures(3);

  var randNum = Math.floor(Math.random() * 2) + 1;
  switch(randNum) {
    case 1:
      processImage("textures/maze1.png");
      break;
    case 2:
      processImage("textures/maze2.png");
      break;
  }

  canvas.onmousedown = click;
  console.log(document);
  document.onkeyup = keyUp;
  document.onkeydown = keyDown;
  document.onmousemove = handleMouseMove
  //document.addEventListener('keydown', keyDown);
  //document.addEventListener('keyup', keyUp);

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.3, 1.0);
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

// Define the plane
var g_plane = new Cube();
g_plane.textureChoice = 2.0;
g_plane.matrix.scale(32, 32, 32);
g_plane.matrix.translate(-.5, -1, -.5);

var g_skybox = new Cube();
g_skybox.textureChoice = 3.0;
g_skybox.matrix.scale(128, 128, 128);
g_skybox.matrix.translate(-.5, -.5, -.5);

var g_wall_w = new Cube();
g_wall_w.textureChoice = 4.0;
g_wall_w.matrix.translate(-17, 0, -16);
g_wall_w.matrix.scale(1, 5, 32);

var g_wall_s = new Cube();
g_wall_s.textureChoice = 4.0;
g_wall_s.matrix.translate(-16, 0, -17);
g_wall_s.matrix.scale(32, 5, 1);

var g_wall_e = new Cube();
g_wall_e.textureChoice = 4.0;
g_wall_e.matrix.translate(16, 0, -16);
g_wall_e.matrix.scale(1, 5, 32);

var g_wall_n = new Cube();
g_wall_n.textureChoice = 4.0;
g_wall_n.matrix.translate(-16, 0, 16);
g_wall_n.matrix.scale(32, 5, 1);

const MAP_SIZE = 32;
let mapArray = [
  [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, -1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
];
//let mapArray = null;
var cubeArray = [];
for (let i = 0; i < MAP_SIZE; i++) {
  cubeArray[i] = [];
  for (let j = 0; j < MAP_SIZE; j++) {
    cubeArray[i][j] = null;
  }
}

for (let i = 0; i < MAP_SIZE; i++) {
  for (let j = 0; j < MAP_SIZE; j++) {
    if (mapArray[i][j] == 1) {
      mapArray[i][j] = Math.floor(Math.random() * 3) + 1;
    }
  }
}


var g_eye = [-15.5, 1.5, 15.5];
var g_at  = [-15, 1.5, 15];
var g_up  = [0, 1, 0];
var duration;
function renderScene() {
  // Clear <canvas>
  var startTime = performance.now();

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Set the matrix to be used for to set the camera view
  if(isKeyDown)
    handleKey();
  var projMat = new Matrix4();
  projMat.setPerspective(60, -canvas.width/canvas.height, 0.1, 1000000);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  // Set the matrix to be used for to set the view matrix
  var viewMat = new Matrix4();
  viewMat.setLookAt(g_eye[0], g_eye[1], g_eye[2],
                    g_at[0], g_at[1], g_at[2],
                    g_up[0], g_up[1], g_up[2]
  ); // (eye, at, up)
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  var globalRotMat = new Matrix4().rotate(-g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  if(mapArray[0][0] != -1) {
    for(var i = 0; i < 32; i++) {
      for(var j = 0; j < 32; j++) {
        //debugger;
        for(var k = 0; k < mapArray[i][j]; k++) {
          if(cubeArray[i][j] == null) {
            cubeArray[i][j] = [];
          }
          cubeArray[i][j][k] = new Cube();
          cubeArray[i][j][k].textureChoice = 1.0;
          cubeArray[i][j][k].matrix.translate(i - 16, k, j - 16);
          cubeArray[i][j][k].render();
        }
      }
    }
  }
  //var morb = new Morb();
  //morb.render();
  /*var cube = new Cube();
  cube.color = [1.0, 0.0, 0.0, 1.0];
  cube.textureChoice = 1.0;
  //cube.matrix.rotate(45, 0, 0, 1);
  //cube.matrix.scale(1, 1, 1);
  cube.matrix.translate(-.5, 0, -.5);
  cube.render();*/

  createMorb(.5, 1, .5, 2, 2, 2);

  g_plane.render();
  g_skybox.render();
  g_wall_w.render();
  g_wall_s.render();
  g_wall_e.render();
  g_wall_n.render();

  duration = performance.now() - startTime;
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