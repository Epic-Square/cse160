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
        /**
         * Creating all reference points.
         */
        this.origin = new Matrix4();
        this.frlegParent = new Matrix4(this.origin);
        this.frlegParent
        var time = speed * g_seconds;

        /**
         * Set up of the body parts.
         * Included are some of the parents of the body parts.
         * The parents keep track of the limbs and the body.
         */
        this.body.color = bodyColor;
        this.body.matrix = new Matrix4(this.origin);

        
    }
}