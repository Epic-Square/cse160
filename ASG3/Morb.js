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
         * Other variables.
         */
        this.speed = 10;
        this.animate = false;
        var time = speed * g_seconds;
        /**
         * Creating all reference points.
         */
        this.origin = new Matrix4();

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

        /**
         * Set up of the body parts.
         * Included are some of the parents of the body parts.
         * The parents keep track of the limbs and the body.
         */
        this.body.color = bodyColor;
        this.body.matrix = new Matrix4(this.origin);

        
    }
}