class Plane {
    constructor() {
      this.type='plane';
      //this.position = [0.0, 0.0, 0.0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.matrix = new Matrix4();
      //this.buffer = null;
    }

    render() {
        var rgba = this.color;

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Pass the Matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Front of cube
        drawTriangle3DUV(
          [0,0,0, 1,1,0, 1,0,0], 
          [0,0, 1,1, 1,0]);
        drawTriangle3DUV(
          [0,0,0, 0,1,0, 1,1,0],
          [0,0, 0,1, 1,1]);
    }
}