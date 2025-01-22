// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform float u_Size;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = u_Size;\n' +
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

  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
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

function addActionsForHtmlUI() {
  // Button Events
  /*
  document.getElementById('green').onclick = function() { 
    g_selectedColor = [0.0,1.0,0.0,1.0]; 
  };
  document.getElementById('red').onclick = function() { g_selectedColor = [1.0,0.0,0.0,1.0]; };
  */
  document.getElementById('clearButton').onclick = function() { 
    g_shapesList = [];
    renderAllShapes();
  };
  document.getElementById('undo').onclick = function() {

    if(g_shapesList.length > 0) {
      g_shapesList = g_shapesList.slice(0, g_shapesList.length - 1);
      renderAllShapes();
    }
  };
  document.getElementById('drawing').onclick = function() {
    g_shapesList = [];
    addDrawing();
    renderAllShapes();
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
  document.getElementById('blueSlide').addEventListener('mouseup', function() {
    g_selectedColor[2] = this.value/100;
  });

  // Size Slider Events
  document.getElementById('sizeSlide').addEventListener('mouseup', function() {
    g_selectedSize = this.value;
  });

  // Segment Slider Events
  document.getElementById('segSlide').addEventListener('mouseup', function() {
    g_selectedSegments = this.value;
  });

  // A little something extra. A slider for rotations to work on the triangle and the circle.
  /*
  document.getElementById('rotSlide').addEventListener('mouseup', function() {
    const modifier = 1 / (2*Math.PI);
    g_selectedRot = [ [Math.cos(this.value * modifier), -Math.sin(this.value * modifier)],
                      [Math.sin(this.value * modifier), Math.cos(this.value * modifier)]];
  });
  */
}

// MAIN
function main() {
  
  setUpWebGL();
  connectVariablesToGLSL();

  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if(ev.buttons == 1) click(ev); };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
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

  renderAllShapes();
}

function handleClicks(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return ([x, y]);
}

function renderAllShapes() {
  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;
  for(var i = 0; i < len; i++) {
    if(g_shapesList[i].draw) {
      g_shapesList[i].renderControl();
    } else { 
      g_shapesList[i].render();
    }
  }
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