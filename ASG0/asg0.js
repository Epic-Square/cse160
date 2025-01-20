// DrawTriangle.js (c) 2012 matsuda

const WIDTH = 400;
const HEIGHT = 400;

const ADD = "add";
const SUB = "sub";
const MUL = "mul";
const DIV = "div";
const ANG = "ang";
const ARE = "area";
const MAG = "mag";
const NOR = "norm";

function main() {  
  // Retrieve <canvas> element
  canvas = document.getElementById('cnv1');  
  if (!canvas) { 
    console.log('Failed to retrieve the <canvas> element');
    return false; 
  } 

  // Get the rendering context for 2DCG
  ctx = canvas.getContext('2d');

  clearCanvas();


  // Draw red vector
}

function drawVector(v, color) {
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo( WIDTH/2, 
              HEIGHT/2,);
  // scale everything so it's a -10 to 10 in both directions plane.
  ctx.lineTo( parseInt(WIDTH/2 + v.elements[0] * 20), 
              parseInt(HEIGHT/2 - v.elements[1] * 20));
  ctx.stroke();
}

function handleDrawEvent() {
  var vecs = getVecInfo();

  //console.log(vecs);

  var v1 = new Vector3([vecs[0], vecs[1], 0]);
  var v2 = new Vector3([vecs[2], vecs[3], 0]);

  clearCanvas();
  drawVector(v1, 'red');
  drawVector(v2, 'blue');
}

function handleDrawOperationEvent() {
  var op = document.getElementById("operation").value;
  var scal = document.getElementById("scalar").value;

  var vecs = getVecInfo();
  
  var v1 = new Vector3([vecs[0], vecs[1], 0]);
  var v2 = new Vector3([vecs[2], vecs[3], 0]);
  var v3 = new Vector3([vecs[0], vecs[1], 0]);
  var v4 = new Vector3([vecs[2], vecs[3], 0]);

  switch(op)
  {
    case ADD:
      v3.add(v2);
      break;
    case SUB:
      v3.sub(v2);
      break;
    case MUL:
      v3.mul(scal);
      v4.mul(scal);
      break;
    case DIV:
      v3.div(scal);
      v4.div(scal);
      break;
    case ANG:
      console.log("Angle:", 
                  (180 / Math.PI) 
                  * Math.acos(  Vector3.dot(v1, v2) 
                                / (v1.magnitude() * v2.magnitude()) ));
      break;
    case ARE:
      console.log("Area of the Triangle:", 
                  0.5 * Vector3.cross(v1, v2).magnitude());
      return;
    case MAG:
      console.log("Magnitude v1:", v1.magnitude());
      console.log("Magnitude v2:", v2.magnitude());
      return;
    case NOR:
      v3.normalize();
      v4.normalize();
      break;
  }

  handleDrawEvent();
  drawVector(v3, 'green');
  if(op == MUL || op == DIV)
    drawVector(v4, 'green');
}

function getVecInfo() {
  var v1x = document.getElementById("v1x").value;
  var v1y = document.getElementById("v1y").value;

  var v2x = document.getElementById("v2x").value;
  var v2y = document.getElementById("v2y").value;

  return [v1x, v1y, v2x, v2y];
}

function clearCanvas() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
}