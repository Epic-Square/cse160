class Cube {
    constructor() {
      this.type='cube';
      //this.position = [0.0, 0.0, 0.0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.matrix = new Matrix4();
      //this.buffer = null;
      this.textureChoice = 0.0;
    }

    render() {
        //var xy = this.position;
        var rgba = this.color;
        //var size = this.size;

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniform1f(u_text, this.textureChoice);

        // Pass the Matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Front of cube
        drawTriangle3DUV(
          [0,0,0, 1,1,0, 1,0,0], 
          [0,0, 1,1, 1,0]);
        drawTriangle3DUV(
          [0,0,0, 0,1,0, 1,1,0],
          [0,0, 0,1, 1,1]);

        // psuedo-lighting
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Top of cube
        drawTriangle3DUV(
          [0,1,0, 1,1,1, 1,1,0],
          [0,0, 1,1, 1,0]);
        drawTriangle3DUV(
          [0,1,0, 0,1,1, 1,1,1],
          [0,0, 0,1, 1,1]);
        
        // pseudo-lighting
        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);

        // Left of Cube
        drawTriangle3DUV(
          [0,0,1, 0,1,0, 0,0,0],
          [0,0, 1,1, 1,0]);
        drawTriangle3DUV(
          [0,0,1, 0,1,1, 0,1,0],
          [0,0, 0,1, 1,1]);

        // Right of Cube
        drawTriangle3DUV(
          [1,0,0, 1,1,1, 1,0,1],
          [0,0, 1,1, 1,0]);
        drawTriangle3DUV(
          [1,0,0, 1,1,0, 1,1,1],
          [0,0, 0,1, 1,1]);

        // psuedo-lighting: Darker lighting.
        gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);

        // Back of Cube
        drawTriangle3DUV(
          [1,0,1, 0,1,1, 0,0,1],
          [0,0, 1,1, 1,0]);
        drawTriangle3DUV(
          [1,0,1, 1,1,1, 0,1,1],
          [0,0, 0,1, 1,1]);

        // psuedo-lighting: Darkest lighting.
        gl.uniform4f(u_FragColor, rgba[0]*.6, rgba[1]*.6, rgba[2]*.6, rgba[3]);

        // Bottom of Cube
        drawTriangle3DUV(
          [0,0,1, 1,0,0, 1,0,1],
          [0,0, 1,1, 1,0]);
        drawTriangle3DUV(
          [0,0,1, 0,0,0, 1,0,0],
          [0,0, 0,1, 1,1]);
    }
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