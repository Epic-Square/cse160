class Sphere {
    constructor() {
      this.type='sphere';
      //this.position = [0.0, 0.0, 0.0];
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.matrix = new Matrix4();
      this.verticesBuffer = null;
      this.uvBuffer = null;
      this.normalBuffer = null;
      this.vertices = null;
      this.uv = null;
      this.normals = null;
      this.textureChoice = 0.0;
      this.detail = 20;
    }

    render() {
        if(this.verticesBuffer == null) {
          this.verticesBuffer = gl.createBuffer();
          if(!this.verticesBuffer) {
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

        if(this.normalBuffer == null) {
          this.normalBuffer = gl.createBuffer();
          if(!this.normalBuffer) {
            console.log('Failed to create buffer object');
            return;
          }
        }

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, this.color[0], this.color[1], this.color[2], this.color[3]);

        gl.uniform1f(u_text, this.textureChoice);

        // Pass the Matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        //debugger;
        //console.log(this.vertices.length/3);

        if(this.vertices == null || this.uv == null || this.normals == null) {
            var d = Math.PI/this.detail;
            var dd = Math.PI/this.detail;
            this.vertices = [];
            this.uv = [];
            this.normals = [];

            for(var t = 0; t < Math.PI; t += d) {
                for(var r = 0; r < 2*Math.PI; r += dd) {
                    var p1 = [Math.sin(t)*Math.cos(r), Math.sin(t)*Math.sin(r), Math.cos(t)];
                    var p2 = [Math.sin(t+dd)*Math.cos(r), Math.sin(t+dd)*Math.sin(r), Math.cos(t + dd)];
                    var p3 = [Math.sin(t)*Math.cos(r + dd), Math.sin(t)*Math.sin(r + dd), Math.cos(t)];
                    var p4 = [Math.sin(t+dd)*Math.cos(r+dd), Math.sin(t+dd)*Math.sin(r+dd), Math.cos(t+dd)];

                    this.vertices = this.vertices.concat(p1); this.uv = this.uv.concat([0,0]);
                    this.vertices = this.vertices.concat(p2); this.uv = this.uv.concat([0,0]);
                    this.vertices = this.vertices.concat(p4); this.uv = this.uv.concat([0,0]);

                    this.vertices = this.vertices.concat(p1); this.uv = this.uv.concat([0,0]);
                    this.vertices = this.vertices.concat(p4); this.uv = this.uv.concat([0,0]);
                    this.vertices = this.vertices.concat(p3); this.uv = this.uv.concat([0,0]);

                    this.normals = this.normals.concat(p1);
                    this.normals = this.normals.concat(p2);
                    this.normals = this.normals.concat(p4);

                    this.normals = this.normals.concat(p1);
                    this.normals = this.normals.concat(p4);
                    this.normals = this.normals.concat(p3);
                }
            }
            //this.normals = new Float32Array(this.vertices);
        }

        this.drawTriangle3DUV();
    }

    drawTriangle3DUV() {
      var n = 3;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.DYNAMIC_DRAW);
  
      gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  
      // Enable the assignment to a_Position variable
      gl.enableVertexAttribArray(a_Position);
  
      gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uv), gl.DYNAMIC_DRAW);
  
      gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
  
      // Enable the assignment to a_Position variable
      gl.enableVertexAttribArray(a_UV);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.DYNAMIC_DRAW);

      gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);

      gl.enableVertexAttribArray(a_Normal);
      
      //console.log(this.vertices.length/3);
      gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length/3);
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