function initTextures(n) {
    var texture = gl.createTexture();   // Create a texture object
    if (!texture) {
      console.log('Failed to create the texture object');
      return false;
    }
    var image = new Image();  // Create the image object
    if (!image) {
      console.log('Failed to create the image object');
      return false;
    }
    if(n == 0) {
      // Get the storage location of u_Sampler
      var u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
      if (!u_Sampler0) {
        console.log('Failed to get the storage location of u_Sampler0');
        return false;
      }

      // Register the event handler to be called on loading an image
      image.onload = function(){
        console.log('image0 loaded'); 
        loadTexture(n, texture, u_Sampler0, image); 
      };
      // Tell the browser to load an image
      //image.src = 'textures/bald_man.png';
      image.src = 'textures/yellowflower.jpg';
    } else if(n == 1) {
      // Get the storage location of u_Sampler
      var u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
      if (!u_Sampler1) {
        console.log('Failed to get the storage location of u_Sampler1');
        return false;
      }

      // Register the event handler to be called on loading an image
      image.onload = function(){ 
        console.log('image1 loaded');
        loadTexture(n, texture, u_Sampler1, image); 
      };
      // Tell the browser to load an image
      image.src = 'textures/dirt.png';
    } else if(n == 2) {
      // Get the storage location of u_Sampler
      var u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
      if (!u_Sampler2) {
        console.log('Failed to get the storage location of u_Sampler2');
        return false;
      }

      // Register the event handler to be called on loading an image
      image.onload = function(){ 
        console.log('image2 loaded');
        loadTexture(n, texture, u_Sampler2, image); 
      };
      // Tell the browser to load an image
      image.src = 'textures/sky_cloud.jpg';
    } else if(n == 3) {
      // Get the storage location of u_Sampler
      var u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
      if (!u_Sampler3) {
        console.log('Failed to get the storage location of u_Sampler3');
        return false;
      }

      // Register the event handler to be called on loading an image
      image.onload = function(){ 
        console.log('image3 loaded');
        loadTexture(n, texture, u_Sampler3, image); 
      };
      // Tell the browser to load an image
      image.src = 'textures/wood.png';
    }

    return true;
}

function loadTexture(n, texture, u_Sampler, image) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    // Enable texture unit0
    if(n == 0) {
      gl.activeTexture(gl.TEXTURE0);
    } else if(n == 1) {
      gl.activeTexture(gl.TEXTURE1);
    } else if(n == 2) {
      gl.activeTexture(gl.TEXTURE2);
    } else if(n == 3) {
      gl.activeTexture(gl.TEXTURE3);
    }
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

    // Set the texture unit n to the sampler
    gl.uniform1i(u_Sampler, n);

    // Clear <canvas>
    //gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw the rectangle
    //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}

function processImage(image) {
  var img = new Image();
  img.onload = function() {
    console.log("Maze loaded!");
    var canvas2 = document.getElementById('second');
    if(canvas2 == null) {
      console.log("Failed to create the canvas");
      return;
    }
    var ctx = canvas2.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var tempArr = ctx.getImageData(0, 0, 32, 32).data;
    //mapArray = []; // 2D array
    for(var i = 3; i < tempArr.length; i += 4) {
      var x = parseInt((i / 4) / 32);
      var y = parseInt(i / 4 % 32);
      //debugger;
      if(tempArr[i] == 255) {
        mapArray[x][y] = Math.floor(Math.random() * 3) + 1;
      } else {
        mapArray[x][y] = 0;
      }
    }
  }
  img.src = image;
}
