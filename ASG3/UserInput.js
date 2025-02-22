var isKeyDown = false;
var keys     = {}; // dictionary of keys
var numKeysDown = 0;
function keyDown(ev) {
  keys[ev.key] = true;
  numKeysDown++;
  if(numKeysDown > 0)
    isKeyDown = true;

  //console.log(ev.keyDown, g_eye[0]);
  //console.log("key down!");
}

function keyUp(ev) {
  keys[ev.key] = false;
  numKeysDown--;
  if(numKeysDown <= 0)
    isKeyDown = false;

  //console.log("key up!");
}

function handleKey() {
  var delta = 1.0 / duration / 10.0;
  var speed = 2;
  var fwdVec            = new Vector3([ g_at[0] - g_eye[0], 
                                        g_at[1] - g_eye[1], 
                                        g_at[2] - g_eye[2]]);
  fwdVec.normalize();
  var [x,y,z]           = fwdVec.elements;
  var position          = new Vector3([g_eye[0], g_eye[1], g_eye[2]]);

  var finalVec          = new Vector3(position.elements);
  if(keys['w']) {
    var tempVec = new Vector3([x, 0, z]);
    tempVec.normalize();
    finalVec.add(tempVec.mul(delta * speed));
    //
  }
  if(keys['s']) {
    var tempVec = new Vector3([x, 0, z]);
    tempVec.normalize();
    finalVec.sub(tempVec.mul(delta * speed));
    //g_at  = position.add(fwdVec).elements; 
  }
  if(keys['a']) {
    var rotfwdVec = new Vector3([-z, 0, x]);
    rotfwdVec.normalize();
    finalVec.add(rotfwdVec.mul(delta * speed));
  }
  if(keys['d']) {
    var rotfwdVec = new Vector3([z, 0, -x]);
    rotfwdVec.normalize();
    finalVec.add(rotfwdVec.mul(delta * speed));
  }
  if(keys['q']) {
    yaw -= 200 * delta * cameraSpeed;
    updateCamera(yaw, pitch);
  }
  if(keys['e']) {
    yaw += 200 * delta * cameraSpeed;
    updateCamera(yaw, pitch);
  }


  var directionVec      = new Vector3([ g_at[0] - g_eye[0], 
                                        g_at[1] - g_eye[1], 
                                        g_at[2] - g_eye[2]]);
  directionVec.normalize();
  [x,y,z] = finalVec.elements;0
  const MAX = 15.85;
  if(x >= MAX)
    x = MAX;
  if(x <= -MAX)
    x = -MAX;
  if(z >= MAX)
    z = MAX;
  if(z <= -MAX)
    z = -MAX;
  finalVec = new Vector3([x, y, z]);
  g_eye = finalVec.elements;
  g_at = directionVec.add(finalVec).elements;

  //var readOnlyVec = new Vector3(directionVec.elements);
  //console.log(readOnlyVec.sub(finalVec).magnitude());
}

function handleClicks(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return ([x, y]);
}

let lastX, lastY;
let cameraSpeed = 0.006;
let yaw = 0, pitch = 0;
function handleMouseMove(ev) {
    if(lastX == undefined || lastY == undefined) {
        lastX = ev.clientX;
        lastY = ev.clientY;
        return;
    }

    var deltaX = ev.clientX - lastX;
    var deltaY = ev.clientY - lastY;
    lastX = ev.clientX;
    lastY = ev.clientY;

    // 0 to 360
    yaw += deltaX * cameraSpeed;
    // -180 to +180
    /*var halfPI = Math.PI/2;
    if(-halfPI <= yaw && yaw <= halfPI)
        pitch -= deltaY * cameraSpeed;
    else
        pitch += deltaY * cameraSpeed;*/

    pitch -= deltaY * cameraSpeed;

    //console.log(yaw);

    /*const MAX_PITCH = 70.0 / (2.0*Math.PI);
    if(pitch > MAX_PITCH)
        pitch = MAX_PITCH;
    if(pitch < -MAX_PITCH)
        pitch = -MAX_PITCH;*/

    pitch = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, pitch));

    updateCamera(yaw, pitch);
}

function updateCamera(yaw, pitch) {
    let dirX = Math.cos(pitch) * Math.sin(yaw);
    let dirY = Math.sin(pitch);
    let dirZ = Math.cos(pitch) * Math.cos(yaw);

    var norm = new Vector3([dirX, dirY, dirZ]);
    var position = new Vector3([g_eye[0], g_eye[1], g_eye[2]]);
    norm.normalize();
    g_at = norm.add(position).elements;
}