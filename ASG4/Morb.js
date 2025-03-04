/**
 * This is my boy, Morb. He needs his own file so he can be better implemented and be more optimized.
 */

/**
 * Constants.
 */
const bodyColor     = [0.1,     0.6,    0.4,    1.0];
const footColor     = [0.05,    0.4,    0.25,   1.0];
const eyeColor      = [0.85,    0.85,   0.5,    1.0];
const eyeballColor  = [0.1,     0.1,    0.1,    1.0];

class Morb {
    constructor() {
        /**
         * Extra information
         */
        this.type           = 'morb';
        /**
         * Body Parts of Morb.
         */
        this.body           = new Cube();
        this.eye            = new Cube();
        this.eyeball        = new Cube();
        this.frleg          = new Cube();
        this.frfoot         = new Cube();
        this.flleg          = new Cube();
        this.flfoot         = new Cube();
        this.brleg          = new Cube();
        this.brfoot         = new Cube();
        this.blleg          = new Cube();
        this.blfoot         = new Cube();

        /**
         * Matrices for the body parts.
         */
        this.eyeParent      = null;
        this.eyeballParent  = null;
        this.frlParent      = null;
        this.frfParent      = null;
        this.fllParent      = null;
        this.flfParent      = null;
        this.brlParent      = null;
        this.brfParent      = null;
        this.bllParent      = null;
        this.blfParent      = null;

        /**
        * Other variables.
        */
        this.speed = 10;
        this.animate = false;
        var time = this.speed * g_seconds;
        /**
         * Creating all reference points.
         */
        this.origin = new Matrix4();

        /**
         * Set up of the body parts.
         * Included are some of the parents of the body parts.
         * The parents keep track of the limbs and the body.
         */
        this.body.color = bodyColor;
        this.body.matrix.set(this.origin);

        /**
         * Eye and Eyeball
         */
        this.eyeParent = new Matrix4(this.origin);
        this.eyeParent.translate(0, 0, -0.05);
        this.eyeballParent = new Matrix4(this.eyeParent);
        //this.eyeballParent.translate()

        /**
         * Front Right Appendage
         */
        this.frlParent = new Matrix4(this.origin);
        this.frlParent.translate(-0.25, -0.2,-0.2);
        this.frffParent = new Matrix4(this.frlParent);
        this.frffParent.translate(-0.05, -0.1, -0.25);

        /**
         * Front Lefft Appendage
         */
        this.fllParent = new Matrix4(this.origin);
        this.fllParent.translate(0.25, -0.2, -0.2);
        this.flfParent = new Matrix4(this.fllParent);
        this.flfParent.translate(0.05, -0.1, -0.025);

        /**
         * Back Right Appendage
         */
        this.brlParent = new Matrix4(this.origin);
        this.brlParent.translate(-0.25, -0.2, 0.2);
        this.brfParent = new Matrix4(this.brlParent);
        this.brfParent.translate(-0.05, -0.1, 0.025);

        /**
         * Back Left Appendage
         */
        this.bllParent = new Matrix4(this.origin);
        this.bllParent.translate(0.25, -0.2, 0.2);
        this.blfParent = new Matrix4(this.bllParent);
        this.blfParent.translate(0.05, -0.1, 0.025);
    }

    render() {

        this.body.matrix.set(this.origin);
        this.eye.matrix.set(this.eyeParent);
        this.eyeball.matrix.set(this.eyeballParent);

        this.body.render();
        this.eye.render();
        this.eyeball.render();
        this.frleg.render();
        this.frfoot.render();
        this.flleg.render();
        this.flfoot.render();
        this.brleg.render();
        this.brfoot.render();
        this.blleg.render();
        this.blfoot.render();
    }
}

// (transate, scale)
function createMorb(tX, tY, tZ, sX, sY, sZ) {

  var speed = 10;
  var time = speed * g_seconds;

  var body = new Cube();
  body.color = bodyColor;
  body.matrix.translate(tX, tY, tZ);
  body.matrix.scale(sX, sY, sZ);
  if(g_globalAnimate) {
    body.matrix.translate(0, .01 * Math.sin(time), 0);
  }
  var bodyParent = new Matrix4(body.matrix);
  posMid(body); 
  body.render();

  var eye = new Cube();
  eye.color = eyeColor;
  eye.matrix = bodyParent;
  if(g_globalAnimate) {
    eye.matrix.translate(0, .01 * Math.sin(time), 0);
  }
  eye.matrix.translate(0,0,-.05);
  var eyeParent = new Matrix4(eye.matrix);
  var eyeLidParent = new Matrix4(eyeParent);
  eye.matrix.scale(.7,.7,.9);
  posMid(eye);
  eye.render();

  var eyeBall = new Cube();
  eyeBall.color = eyeballColor;
  eyeBall.matrix = eyeParent
  eyeBall.matrix.translate(0,0,-.02); // Displacement
  eyeBall.matrix.scale(.2,.5,.9);
  posMid(eyeBall);
  eyeBall.render();

  var frontRightLeg = new Cube();
  frontRightLeg.color = bodyColor;
  frontRightLeg.matrix.translate(tX, tY, tZ);
  frontRightLeg.matrix.scale(sX, sY, sZ);
  frontRightLeg.matrix.translate(-.25,-.2,-.2); // Displacement
  if(g_globalAnimate) {
    frontRightLeg.matrix.rotate(45*Math.cos(time), 0, 0, 1);
  }
  var frParent = new Matrix4(frontRightLeg.matrix); // Parent
  frontRightLeg.matrix.rotate(10, 1, 0, 0);
  frontRightLeg.matrix.rotate(-25, 0, 0, 1);
  frontRightLeg.matrix.scale(.25, .3, .25);
  posTop(frontRightLeg);
  frontRightLeg.render();

  var frontRightFoot = new Cube();
  frontRightFoot.color = footColor;
  frontRightFoot.matrix = frParent; // Child
  frontRightFoot.matrix.translate(-.05,-.1, -.025); // Displacement: Remembers parent
  if(g_globalAnimate) {
    frontRightFoot.matrix.rotate(-45*Math.cos(time), 0, 0, 1);
  }
  frontRightFoot.matrix.scale(.3, .2, .3);
  posTop(frontRightFoot);
  frontRightFoot.render();

  var frontLeftLeg = new Cube();
  frontLeftLeg.color = bodyColor;
  frontLeftLeg.matrix.translate(tX, tY, tZ);
  frontLeftLeg.matrix.scale(sX, sY, sZ);
  frontLeftLeg.matrix.translate(.25,-.2,-.2); // Displacement
  if(g_globalAnimate) {
    frontLeftLeg.matrix.rotate(45*Math.sin(time), 0, 0, 1);
  }
  var flParent = new Matrix4(frontLeftLeg.matrix); // Parent
  frontLeftLeg.matrix.rotate(10, 1, 0, 0);
  frontLeftLeg.matrix.rotate(25, 0, 0, 1);
  frontLeftLeg.matrix.scale(.25, .3, .25);
  posTop(frontLeftLeg);
  frontLeftLeg.render();

  var frontLeftFoot = new Cube();
  frontLeftFoot.color = footColor;
  frontLeftFoot.matrix = flParent; // Child
  frontLeftFoot.matrix.translate(.05,-.1, -.025); // Displacement: Remembers parent
  if(g_globalAnimate) {
    frontLeftFoot.matrix.rotate(-45*Math.sin(time), 0, 0, 1);
  }
  frontLeftFoot.matrix.scale(.3, .2, .3);
  posTop(frontLeftFoot);
  frontLeftFoot.render();

  var backRightLeg = new Cube();
  backRightLeg.color = bodyColor;
  backRightLeg.matrix.translate(tX, tY, tZ);
  backRightLeg.matrix.scale(sX, sY, sZ);
  backRightLeg.matrix.translate(-.25,-.2,.2); // Displacement
  if(g_globalAnimate) {
    backRightLeg.matrix.rotate(45*Math.sin(time), 0, 0, 1);
  }
  var brParent = new Matrix4(backRightLeg.matrix); // Parent
  backRightLeg.matrix.rotate(-10, 1, 0, 0);
  backRightLeg.matrix.rotate(-25, 0, 0, 1);
  backRightLeg.matrix.scale(.25, .3, .25);
  posTop(backRightLeg);
  backRightLeg.render();

  var backRightFoot = new Cube();
  backRightFoot.color = footColor;
  backRightFoot.matrix = brParent; // Child
  backRightFoot.matrix.translate(-.05,-.1, .025); // Displacement: Remembers parent
  if(g_globalAnimate) {
    backRightFoot.matrix.rotate(-45*Math.sin(time), 0, 0, 1);
  }
  backRightFoot.matrix.rotate(0, 0, 0, 1);
  backRightFoot.matrix.scale(.3, .2, .3);
  posTop(backRightFoot);
  backRightFoot.render();

  var backLeftLeg = new Cube();
  backLeftLeg.color = bodyColor;
  backLeftLeg.matrix.translate(tX, tY, tZ);
  backLeftLeg.matrix.scale(sX, sY, sZ);
  backLeftLeg.matrix.translate(.25,-.2,.2); // Displacement
  if(g_globalAnimate) {
    backLeftLeg.matrix.rotate(45*Math.cos(time), 0, 0, 1);
  }
  var blParent = new Matrix4(backLeftLeg.matrix); // Parent
  backLeftLeg.matrix.rotate(-10, 1, 0, 0);
  backLeftLeg.matrix.rotate(25, 0, 0, 1);
  backLeftLeg.matrix.scale(.25, .3, .25);
  posTop(backLeftLeg);
  backLeftLeg.render();

  var backLeftFoot = new Cube();
  backLeftFoot.color = footColor;
  backLeftFoot.matrix = blParent; // Child
  backLeftFoot.matrix.translate(.05,-.1, .025); // Displacement: Remembers parent
  if(g_globalAnimate) {
    backLeftFoot.matrix.rotate(-45*Math.cos(time), 0, 0, 1);
  }
  backLeftFoot.matrix.rotate(0, 0, 0, 1);
  backLeftFoot.matrix.scale(.3, .2, .3);
  posTop(backLeftFoot);
  backLeftFoot.render();
}