<!DOCTYPE html>
<html>

<head>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="content-type" content="text/html; charset=utf-8" />

  <title>Hyperbolic Tiling</title>

  <link rel="stylesheet" type="text/css" href="styles/main.css" />

  <script src="scripts/vendor/jquery.min.js"></script>
  <script src="scripts/vendor/sylvester.js"></script>
  <script src="scripts/vendor/glUtils.js"></script>

</head>

<body>

  <canvas id="canvas" width="1000" height="600">
    Your browser doesn't appear to support the
    <code>&lt;canvas&gt;</code> element.
  </canvas>

  <script id="shader-fs" type="x-shader/x-fragment">
    void main(void) {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
  </script>

  <script id="shader-vs" type="x-shader/x-vertex">
    attribute vec3 aVertexPosition;
    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;
    void main(void) {
      gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    }
  </script>

  <script src="scripts/main.js"></script>
</body>

</html>
