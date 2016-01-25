// * ***********************************************************************
// *
// *  CANVAS CLASS
// *
// *************************************************************************
export class WebGL {
  constructor() {
    this.canvas = document.querySelector('canvas');

    //fullscreen
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.gl = this.initWebGL(canvas);

    if (this.gl) {
      this.start();
      this.initShaders();
      this.initBuffers();
      this.drawScene();
    }
  }

  start() {
    // Set clear color to black, fully opaque
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Enable depth testing
    this.gl.enable(this.gl.DEPTH_TEST);
    // Near things obscure far things
    this.gl.depthFunc(this.gl.LEQUAL);
    // Clear the color as well as the depth buffer.
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  initWebGL(canvas) {
    this.gl = null;
    try {
      // Try to grab the standard context. If it fails, fallback to experimental.
      this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    } catch (e) {}

    if (!this.gl) {
      alert('Unable to initialize WebGL. Your browser may not support it.');
      this.gl = null;
    }
    return this.gl;
  }

  initShaders() {
    const fragmentShader = this.getShader(this.gl, 'shader-fs');
    const vertexShader = this.getShader(this.gl, 'shader-vs');

    // Create the shader program

    this.shaderProgram = this.gl.createProgram();
    this.gl.attachShader(this.shaderProgram, vertexShader);
    this.gl.attachShader(this.shaderProgram, fragmentShader);
    this.gl.linkProgram(this.shaderProgram);

    // If creating the shader program failed, alert

    if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
      alert('Unable to initialize the shader program.');
    }

    this.gl.useProgram(this.shaderProgram);

    this.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, 'aVertexPosition');
    this.gl.enableVertexAttribArray(this.vertexPositionAttribute);
  }

  getShader(gl, id) {
    let shaderScript, theSource, currentChild, shader;

    shaderScript = document.getElementById(id);

    if (!shaderScript) {
      return null;
    }

    theSource = '';
    currentChild = shaderScript.firstChild;

    while (currentChild) {
      if (currentChild.nodeType == currentChild.TEXT_NODE) {
        theSource += currentChild.textContent;
      }

      currentChild = currentChild.nextSibling;
    }

    if (shaderScript.type == 'x-shader/x-fragment') {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == 'x-shader/x-vertex') {
      shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
      // Unknown shader type
      return null;
    }
    gl.shaderSource(shader, theSource);

    // Compile the shader program
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
      return null;
    }

    return shader;
  }

  initBuffers() {
    const horizAspect = window.innerHeight / window.innerWidth;
    this.squareVerticesBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.squareVerticesBuffer);

    const vertices = [
      1.0, 1.0, 0.0, -1.0, 1.0, 0.0,
      1.0, -1.0, 0.0, -1.0, -1.0, 0.0
    ];

    this.gl.bufferData(this.gl.ARRAY_BUFFER,
      new Float32Array(vertices),
      this.gl.STATIC_DRAW);
  }

  drawScene() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.perspectiveMatrix = makePerspective(45, window.innerWidth / window.innerHeight, 0.1, 100.0);

    loadIdentity();
    mvTranslate([-0.0, 0.0, -6.0]);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.squareVerticesBuffer);
    this.gl.vertexAttribPointer(this.vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);
    this.setMatrixUniforms();
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
  }

  setMatrixUniforms() {
    let pUniform = this.gl.getUniformLocation(this.shaderProgram, 'uPMatrix');
    this.gl.uniformMatrix4fv(pUniform, false, new Float32Array(this.perspectiveMatrix.flatten()));

    let mvUniform = this.gl.getUniformLocation(this.shaderProgram, 'uMVMatrix');
    this.gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
  }

}
