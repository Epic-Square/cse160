class Cube {
    constructor() {
      this.type='cube';
      //this.position = [0.0, 0.0, 0.0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.matrix = new Matrix4();
      this.buffer = null;
      this.uvBuffer = null;
      this.vertices = 
      [ 0,0,0, 1,1,0, 1,0,0, // Front face
        0,0,0, 0,1,0, 1,1,0,

        0,1,0, 1,1,1, 1,1,0, // Top face
        0,1,0, 0,1,1, 1,1,1,

        0,0,1, 0,1,0, 0,0,0, // Left face
        0,0,1, 0,1,1, 0,1,0,

        1,0,0, 1,1,1, 1,0,1, // Right face
        1,0,0, 1,1,0, 1,1,1,

        1,0,1, 0,1,1, 0,0,1, // Back face
        1,0,1, 1,1,1, 0,1,1,

        0,0,1, 1,0,0, 1,0,1, // Bottom face
        0,0,1, 0,0,0, 1,0,0
      ];
      this.uv = 
      [ 0,0, 1,1, 1,0,
        0,0, 0,1, 1,1,

        0,0, 1,1, 1,0,
        0,0, 0,1, 1,1,
        
        0,0, 1,1, 1,0,
        0,0, 0,1, 1,1,
        
        0,0, 1,1, 1,0,
        0,0, 0,1, 1,1,
        
        0,0, 1,1, 1,0,
        0,0, 0,1, 1,1,
        
        0,0, 1,1, 1,0,
        0,0, 0,1, 1,1
      ];
      this.textureChoice = 0.0;
    }

    render() {
        //var xy = this.position;
        var rgba = this.color;
        //var size = this.size;

        if(this.buffer == null) {
          this.buffer = gl.createBuffer();
          if(!this.buffer) {
            console.log('Failed to create buffer object');
            return;
          }
        }

        if(this.uvBuffer == null) {
          this.uvBuffer = gl.createBuffer();
          if(!this.uvBuffer) {
            console.log('Failed to create buffer object');
            return;
          }
        }

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniform1f(u_text, this.textureChoice);

        // Pass the Matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        //debugger;
        //console.log(this.vertices.length/3);
        this.drawTriangle3DUV(this.vertices, this.uv);
    }

    drawTriangle3DUV(vertices, uv) {
      var n = 3;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
  
      gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  
      // Enable the assignment to a_Position variable
      gl.enableVertexAttribArray(a_Position);
  
      gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.DYNAMIC_DRAW);
  
      gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
  
      // Enable the assignment to a_Position variable
      gl.enableVertexAttribArray(a_UV);
      
      //console.log(this.vertices.length/3);
      gl.drawArrays(gl.TRIANGLES, 0, vertices.length/3);
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