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
      image.src = 'textures/uv_128_128.png';
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
      image.src = 'textures/bald_man.png';
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