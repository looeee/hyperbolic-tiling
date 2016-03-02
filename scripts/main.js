var babelHelpers = {};

babelHelpers.classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

babelHelpers.createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

babelHelpers;

// * ***********************************************************************
// *
// *  THREE JS CLASS
// *
// *  All operations involved in drawing to the screen occur here.
// *  All objects are assumed to be on the unit Disk when passed here and
// *  are converted to screen space (which will generally invole multiplying
// *  by the radius ~ half screen resolution)
// *************************************************************************

var ThreeJS = function () {
  function ThreeJS() {
    babelHelpers.classCallCheck(this, ThreeJS);

    this.init();
  }

  babelHelpers.createClass(ThreeJS, [{
    key: 'init',
    value: function init() {
      this.radius = window.innerWidth < window.innerHeight ? window.innerWidth / 2 - 5 : window.innerHeight / 2 - 5;
      if (this.scene === undefined) this.scene = new THREE.Scene();
      this.initCamera();
      this.initRenderer();
      this.render();
    }
  }, {
    key: 'reset',
    value: function reset() {
      cancelAnimationFrame(this.id);
      this.clearScene();
      this.projector = null;
      this.camera = null;
      this.init();
    }
  }, {
    key: 'clearScene',
    value: function clearScene() {
      for (var i = this.scene.children.length - 1; i >= 0; i--) {
        this.scene.remove(this.scene.children[i]);
      }
    }
  }, {
    key: 'initCamera',
    value: function initCamera() {
      this.camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -2, 1);
      this.scene.add(this.camera);
    }
  }, {
    key: 'initRenderer',
    value: function initRenderer() {
      if (this.renderer === undefined) {
        this.renderer = new THREE.WebGLRenderer({
          antialias: true
        });
        this.renderer.setClearColor(0xffffff, 1.0);
        document.body.appendChild(this.renderer.domElement);
      }
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }, {
    key: 'disk',
    value: function disk(centre, radius, color) {
      if (color === undefined) color = 0xffffff;
      var geometry = new THREE.CircleGeometry(radius * this.radius, 100, 0, 2 * Math.PI);
      var material = new THREE.MeshBasicMaterial({ color: color });

      var circle = new THREE.Mesh(geometry, material);
      circle.position.x = centre.x * this.radius;
      circle.position.y = centre.y * this.radius;

      this.scene.add(circle);
    }

    //Note: polygons assumed to be triangular!

  }, {
    key: 'polygon',
    value: function polygon(_polygon, color, texture, wireframe) {
      if (color === undefined) color = 0xffffff;
      var geometry = new THREE.Geometry();

      //assign polygon barycentre to vertex 0
      geometry.vertices.push(new THREE.Vector3(_polygon.centre.x * this.radius, _polygon.centre.y * this.radius, 0));

      var edges = _polygon.edges;
      //push first vertex of polygon to vertices array
      //This means that when the next vertex is pushed in the loop
      //we can also create the first face triangle
      geometry.vertices.push(new THREE.Vector3(edges[0].points[0].x * this.radius, edges[0].points[0].y * this.radius, 0));

      //vertices pushed so far counting from 0
      var count = 1;

      for (var i = 0; i < edges.length; i++) {
        var points = edges[i].points;
        for (var j = 1; j < points.length; j++) {
          geometry.vertices.push(new THREE.Vector3(points[j].x * this.radius, points[j].y * this.radius, 0));
          geometry.faces.push(new THREE.Face3(0, count, count + 1));
          count++;
        }
      }
      this.setUvs(geometry, edges);

      var mesh = this.createMesh(geometry, color, texture, _polygon.materialIndex, wireframe);
      this.scene.add(mesh);
    }

    //The texture is assumed to be a square power of transparent png with the image
    //in the lower right triange triangle (0,0), (1,0), (1,1)

  }, {
    key: 'setUvs',
    value: function setUvs(geometry, edges) {
      //the incentre of the triangle is mapped to the polygon barycentre
      var incentre = new THREE.Vector2(1 / Math.sqrt(2), 1 - 1 / Math.sqrt(2));

      geometry.faceVertexUvs[0] = [];

      //EDGE 0
      var e = edges[0].points.length - 1;
      for (var i = 0; i < e; i++) {
        geometry.faceVertexUvs[0].push([new THREE.Vector2(incentre.x, incentre.y), new THREE.Vector2(i * (1 / e), i * (1 / e)), new THREE.Vector2((i + 1) * (1 / e), (i + 1) * (1 / e))]);
      }
      //EDGE 1
      e = edges[1].points.length - 1;
      for (var i = 0; i < e; i++) {
        geometry.faceVertexUvs[0].push([new THREE.Vector2(incentre.x, incentre.y), new THREE.Vector2(1, 1 - i * (1 / e)), new THREE.Vector2(1, 1 - (i + 1) * (1 / e))]);
      }
      //EDGE 2
      e = edges[2].points.length - 1;
      for (var i = 0; i < e; i++) {
        geometry.faceVertexUvs[0].push([new THREE.Vector2(incentre.x, incentre.y), new THREE.Vector2(1 - i * (1 / e), 0), new THREE.Vector2(1 - (i + 1) * (1 / e), 0)]);
      }

      geometry.uvsNeedUpdate = true;
    }

    //NOTE: some polygons are inverted due to vertex order,
    //solved this by making material doubles sided but this might cause problems with textures

  }, {
    key: 'createMesh',
    value: function createMesh(geometry, color, textures, materialIndex, wireframe) {
      if (wireframe === undefined) wireframe = false;
      if (color === undefined) color = 0xffffff;

      if (!this.pattern) {
        this.createPattern(color, textures, wireframe);
      }

      return new THREE.Mesh(geometry, this.pattern.materials[materialIndex]);
    }
  }, {
    key: 'createPattern',
    value: function createPattern(color, textures, wireframe) {
      this.pattern = new THREE.MultiMaterial();

      for (var i = 0; i < textures.length; i++) {
        var material = new THREE.MeshBasicMaterial({
          color: color,
          wireframe: wireframe,
          side: THREE.DoubleSide
        });

        var texture = new THREE.TextureLoader().load(textures[i]);

        material.map = texture;
        this.pattern.materials.push(material);
      }
    }

    //Only call render once by default.
    //TODO: currently calling once per texture in this.pattern

  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      var sceneGetsUpdate = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      //if(sceneGetsUpdate){
      requestAnimationFrame(function () {
        _this.render();
      });
      //}
      this.renderer.render(this.scene, this.camera);
    }

    //convert the canvas to a base64URL and send to saveImage.php
    //TODO: make work!

  }, {
    key: 'saveImage',
    value: function saveImage() {
      var data = this.renderer.domElement.toDataURL('image/png');
      //console.log(data);
      var xhttp = new XMLHttpRequest();
      xhttp.open('POST', 'saveImage.php', true);
      xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhttp.send('img=' + data);
    }
  }]);
  return ThreeJS;
}();

// * ***********************************************************************
// *
// *   EUCLIDEAN FUNCTIONS
// *   a place to stash all the functions that are euclidean geometrical
// *   operations
// *   All functions are 2D unless otherwise specified!
// *
// *************************************************************************

var distance = function distance(point1, point2) {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
};

//does the line connecting p1, p2 go through the point (0,0)?
var throughOrigin = function throughOrigin(point1, point2) {
  //vertical line through centre
  if (toFixed(point1.x) == 0 && toFixed(point2.x) === 0) {
    return true;
  }
  var test = (-point1.x * point2.y + point1.x * point1.y) / (point2.x - point1.x) + point1.y;

  if (toFixed(test) == 0) return true;else return false;
};

var circleLineIntersect = function circleLineIntersect(circle, point1, point2) {
  var cx = circle.centre.x;
  var cy = circle.centre.y;
  var r = circle.radius;

  var d = distance(point1, point2);
  //unit vector p1 p2
  var dx = (point2.x - point1.x) / d;
  var dy = (point2.y - point1.y) / d;

  //point on line closest to circle centre
  var t = dx * (cx - point1.x) + dy * (cy - point1.y);
  var p = new Point(t * dx + point1.x, t * dy + point1.y);

  //distance from this point to centre
  var d2 = distance(p, circle.centre);

  //line intersects circle at 2 points
  if (d2 < r) {
    var dt = Math.sqrt(r * r - d2 * d2);
    //point 1
    var q1 = new Point((t - dt) * dx + point1.x, (t - dt) * dy + point1.y);
    //point 2
    var q2 = new Point((t + dt) * dx + point1.x, (t + dt) * dy + point1.y);

    return {
      p1: q1,
      p2: q2
    };
  } else if (d2 === r) {
    //line is tangent to circle
    return p;
  } else {
    console.warn('Warning: line does not intersect circle!');
    return false;
  }
};

//Find the length of the smaller arc between two angles on a given circle
var arcLength = function arcLength(circle, startAngle, endAngle) {
  return Math.abs(startAngle - endAngle) > Math.PI ? circle.radius * (2 * Math.PI - Math.abs(startAngle - endAngle)) : circle.radius * Math.abs(startAngle - endAngle);
};

//find the two points a distance from a point on the circumference of a circle
//in the direction of point2
var directedSpacedPointOnArc = function directedSpacedPointOnArc(circle, point1, point2, spacing) {
  var cosTheta = -(spacing * spacing / (2 * circle.radius * circle.radius) - 1);
  var sinThetaPos = Math.sqrt(1 - Math.pow(cosTheta, 2));
  var sinThetaNeg = -sinThetaPos;

  var xPos = circle.centre.x + cosTheta * (point1.x - circle.centre.x) - sinThetaPos * (point1.y - circle.centre.y);
  var xNeg = circle.centre.x + cosTheta * (point1.x - circle.centre.x) - sinThetaNeg * (point1.y - circle.centre.y);
  var yPos = circle.centre.y + sinThetaPos * (point1.x - circle.centre.x) + cosTheta * (point1.y - circle.centre.y);
  var yNeg = circle.centre.y + sinThetaNeg * (point1.x - circle.centre.x) + cosTheta * (point1.y - circle.centre.y);

  var p1 = new Point(xPos, yPos);
  var p2 = new Point(xNeg, yNeg);

  var a = distance(p1, point2);
  var b = distance(p2, point2);
  return a < b ? p1 : p2;
};

//find the point at a distance from point1 along line defined by point1, point2,
//in the direction of point2
var directedSpacedPointOnLine = function directedSpacedPointOnLine(point1, point2, spacing) {
  var circle = new Circle(point1.x, point1.y, spacing);
  var points = circleLineIntersect(circle, point1, point2);
  var a = distance(points.p1, point2);
  var b = distance(points.p2, point2);
  return a < b ? points.p1 : points.p2;
};

var randomInt = function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

//.toFixed returns a string for some no doubt very good reason.
//apply to fixed with default value of 10 and return as a float
var toFixed = function toFixed(number) {
  var places = arguments.length <= 1 || arguments[1] === undefined ? 10 : arguments[1];
  return parseFloat(number.toFixed(places));
};

//are the angles alpha, beta in clockwise order on unit disk?
var clockwise = function clockwise(alpha, beta) {
  //let cw = true;
  var a = beta > 3 * Math.PI / 2 && alpha < Math.PI / 2;
  var b = beta - alpha > Math.PI;
  var c = alpha > beta && !(alpha - beta > Math.PI);
  //if (a || b || c) {
  //cw = false;
  //}
  return a || b || c ? false : true;
};

var multiplyMatrices = function multiplyMatrices(m1, m2) {
  var result = [];
  for (var i = 0; i < m1.length; i++) {
    result[i] = [];
    for (var j = 0; j < m2[0].length; j++) {
      var sum = 0;
      for (var k = 0; k < m1[0].length; k++) {
        sum += m1[i][k] * m2[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
};

//create nxn identityMatrix
var identityMatrix = function identityMatrix(n) {
  return Array.apply(null, new Array(n)).map(function (x, i, a) {
    return a.map(function (y, k) {
      return i === k ? 1 : 0;
    });
  });
};

// * ***********************************************************************
// * ***********************************************************************
// * ***********************************************************************
// *
// *   HYPERBOLIC ELEMENT CLASSES
// *
// *************************************************************************
// * ***********************************************************************
// * ***********************************************************************

// * ***********************************************************************
// *
// *   POINT CLASS
// *   Represents a point either in the Poincare Disk (2D)
// *   or Hyperboloid (Weierstrass) Space (3D)
// *   Default is in Poincare form with z = 0;
// *   NOTE: cannot be consrtucted in Hyperbolid form, only transformed using
// *   built in function
// *************************************************************************

var Point = function () {
  function Point(x, y) {
    babelHelpers.classCallCheck(this, Point);

    this.x = x;
    this.y = y;

    this.checkPoint();

    this.z = 0;
  }

  //compare two points taking rounding errors into account

  babelHelpers.createClass(Point, [{
    key: 'compare',
    value: function compare(otherPoint) {
      if (typeof otherPoint === 'undefined') {
        console.warn('Warning: point not defined.');
        return false;
      }
      var t1 = this.toFixed(12);
      var t2 = otherPoint.toFixed(12);

      if (this.p1.x === otherPoint.x && this.p1.y === otherPoint.y) return true;else return false;
    }

    //move the point to hyperboloid (Weierstrass) space, apply the transform,
    //then move back

  }, {
    key: 'transform',
    value: function transform(_transform) {
      var mat = _transform.matrix;
      var p = this.poincareToHyperboloid();
      var x = p.x * mat[0][0] + p.y * mat[0][1] + p.z * mat[0][2];
      var y = p.x * mat[1][0] + p.y * mat[1][1] + p.z * mat[1][2];
      var z = p.x * mat[2][0] + p.y * mat[2][1] + p.z * mat[2][2];
      var q = new Point(x, y);
      q.z = z;
      return q.hyperboloidToPoincare();
    }
  }, {
    key: 'poincareToHyperboloid',
    value: function poincareToHyperboloid() {
      var factor = 1 / (1 - this.x * this.x - this.y * this.y);
      var x = 2 * factor * this.x;
      var y = 2 * factor * this.y;
      var z = factor * (1 + this.x * this.x + this.y * this.y);
      var p = new Point(x, y);
      p.z = z;
      return p;
    }
  }, {
    key: 'hyperboloidToPoincare',
    value: function hyperboloidToPoincare() {
      var factor = 1 / (1 + this.z);
      var x = factor * this.x;
      var y = factor * this.y;
      return new Point(x, y);
    }
  }, {
    key: 'clone',
    value: function clone() {
      return new Point(this.x, this.y);
    }

    //check that the point lies in the unit disk and warn otherwise
    //(don't check points that are in hyperboloid form with z !==0)

  }, {
    key: 'checkPoint',
    value: function checkPoint() {
      if (this.z == 0 && distance(this, { x: 0, y: 0 }) > 1) {
        console.warn('Error! Point (' + this.x + ', ' + this.y + ') lies outside the unit disk!');
      }
    }
  }]);
  return Point;
}();

var Circle = function Circle(centreX, centreY, radius) {
  babelHelpers.classCallCheck(this, Circle);

  this.centre = new Point(centreX, centreY);
  this.radius = radius;
};

// * ***********************************************************************
// *
// *  ARC CLASS
// *  Represents a hyperbolic arc on the Poincare disk, which is a
// *  Euclidean straight line if it goes through the origin
// *
// *************************************************************************

var Arc = function () {
  function Arc(startPoint, endPoint) {
    babelHelpers.classCallCheck(this, Arc);

    this.startPoint = startPoint;
    this.endPoint = endPoint;

    if (throughOrigin(startPoint, endPoint)) {
      this.circle = new Circle(0, 0, 1);
      this.startAngle = 0;
      this.endAngle = 0;
      this.clockwise = false;
      this.straightLine = true;
      this.arcLength = distance(startPoint, endPoint);
    } else {
      this.calculateArc();
      this.arcLength = arcLength(this.circle, this.startAngle, this.endAngle);
    }
  }

  //Calculate the arc using Dunham's method

  babelHelpers.createClass(Arc, [{
    key: 'calculateArc',
    value: function calculateArc() {
      //calculate centre of arcCircle relative to unit disk
      var wq1 = this.startPoint.poincareToHyperboloid();
      var wq2 = this.endPoint.poincareToHyperboloid();
      var wcp = this.hyperboloidCrossProduct(wq1, wq2);

      var arcCentre = new Point(wcp.x / wcp.z, wcp.y / wcp.z, true);
      var arcRadius = Math.sqrt(Math.pow(this.startPoint.x - arcCentre.x, 2) + Math.pow(this.startPoint.y - arcCentre.y, 2));
      var arcCircle = new Circle(arcCentre.x, arcCentre.y, arcRadius, true);

      //translate points to origin and calculate arctan
      var alpha = Math.atan2(this.startPoint.y - arcCentre.y, this.startPoint.x - arcCentre.x);
      var beta = Math.atan2(this.endPoint.y - arcCentre.y, this.endPoint.x - arcCentre.x);

      //angles are in (-pi, pi), transform to (0,2pi)
      alpha = alpha < 0 ? 2 * Math.PI + alpha : alpha;
      beta = beta < 0 ? 2 * Math.PI + beta : beta;

      //check whether points are in clockwise order and assign angles accordingly
      var cw = clockwise(alpha, beta);

      //TODO test if angles need to be set by cw here
      //if (cw) {
      this.startAngle = alpha;
      this.endAngle = beta;
      //} else {
      //  this.startAngle = beta;
      //  this.endAngle = alpha;
      //}

      this.circle = arcCircle;
      this.clockwise = cw;
      this.straightLine = false;
    }
  }, {
    key: 'hyperboloidCrossProduct',
    value: function hyperboloidCrossProduct(point3D_1, point3D_2) {
      var h = {
        x: point3D_1.y * point3D_2.z - point3D_1.z * point3D_2.y,
        y: point3D_1.z * point3D_2.x - point3D_1.x * point3D_2.z,
        z: -point3D_1.x * point3D_2.y + point3D_1.y * point3D_2.x
      };
      return h;
    }
  }]);
  return Arc;
}();

// * ***********************************************************************
// *
// *   EDGE CLASS
// *   Represents a hyperbolic polygon edge
// *
// *************************************************************************

var Edge = function () {
  function Edge(startPoint, endPoint) {
    babelHelpers.classCallCheck(this, Edge);

    this.arc = new Arc(startPoint, endPoint);
  }

  //calculate the spacing for subdividing the edge into even number of pieces.
  //For the first ( longest ) edge this will be calculated based on spacing
  //then for the rest of the edges it will be calculated based on the number of
  //subdivisions of the first edge ( so that all edges are divided into equal
  // number of pieces)

  babelHelpers.createClass(Edge, [{
    key: 'calculateSpacing',
    value: function calculateSpacing(numDivisions) {
      this.spacing = 0.1;
      //calculate the number of subdivisions required break the arc into an
      //even number of pieces with each <= this.spacing
      numDivisions = numDivisions || 2 * Math.ceil(this.arc.arcLength / this.spacing / 2);

      //recalculate spacing based on number of points
      this.spacing = this.arc.arcLength / numDivisions;
    }
  }, {
    key: 'spacedPoints',
    value: function spacedPoints(numDivisions) {
      this.calculateSpacing(numDivisions);

      this.points = [];
      //push the first vertex
      this.points.push(this.arc.startPoint);

      //tiny pgons near the edges of the disk don't need to be subdivided
      if (distance(this.arc.startPoint, this.arc.endPoint) > this.spacing) {
        if (!this.arc.straightLine) {
          this.pointsOnArc();
        } else {
          this.pointsOnStraightLine();
        }
      }

      //push the final vertex
      this.points.push(this.arc.endPoint);
    }
  }, {
    key: 'pointsOnStraightLine',
    value: function pointsOnStraightLine() {
      var p = directedSpacedPointOnLine(this.arc.startPoint, this.arc.endPoint, this.spacing);
      this.points.push(p);
      while (distance(p, this.arc.endPoint) > this.spacing) {
        p = directedSpacedPointOnLine(p, this.arc.endPoint, this.spacing);
        this.points.push(p);
      }
    }
  }, {
    key: 'pointsOnArc',
    value: function pointsOnArc() {
      var p = directedSpacedPointOnArc(this.arc.circle, this.arc.startPoint, this.arc.endPoint, this.spacing);
      this.points.push(p);
      while (distance(p, this.arc.endPoint) > this.spacing) {
        p = directedSpacedPointOnArc(this.arc.circle, p, this.arc.endPoint, this.spacing);
        this.points.push(p);
      }
    }
  }]);
  return Edge;
}();

// * ***********************************************************************
// *
// *  POLYGON CLASS
// *
// *  NOTE: all polygons are assumed to be triangular
// *************************************************************************
//NOTE: sometimes polygons will be backwards facing. Solved with DoubleSide material
//but may cause problems
//@param vertices: array of Points
//@param materialIndex: which material from THREE.Multimaterial to use

var Polygon = function () {
  function Polygon(vertices) {
    var materialIndex = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
    babelHelpers.classCallCheck(this, Polygon);

    this.materialIndex = materialIndex;
    this.vertices = vertices;

    this.findCentre();
    this.addEdges();

    //this.subdivideEdges();
    //this.subdivideMesh();
  }

  babelHelpers.createClass(Polygon, [{
    key: 'addEdges',
    value: function addEdges() {
      this.edges = [];
      for (var i = 0; i < this.vertices.length; i++) {
        this.edges.push(new Edge(this.vertices[i], this.vertices[(i + 1) % this.vertices.length]));
      }
    }
  }, {
    key: 'findLongestEdge',
    value: function findLongestEdge() {
      var a = this.edges[0].arc.arcLength;
      var b = this.edges[1].arc.arcLength;
      var c = this.edges[2].arc.arcLength;

      if (a > b && a > c) this.longestEdge = 0;else if (b > c) this.longestEdge = 1;else this.longestEdge = 2;
    }

    //subdivide the longest edge, then subdivide the other two edges with the
    //same number of points as the longest

  }, {
    key: 'subdivideEdges',
    value: function subdivideEdges() {
      this.findLongestEdge();
      this.edges[this.longestEdge].spacedPoints();

      var numDivisions = this.edges[this.longestEdge].points.length - 1;

      this.edges[(this.longestEdge + 1) % 3].spacedPoints(numDivisions);
      this.edges[(this.longestEdge + 2) % 3].spacedPoints(numDivisions);
    }
  }, {
    key: 'subdivideMesh',
    value: function subdivideMesh() {
      this.mesh = [];
      this.mesh[0] = this.edges[this.longestEdge].points;

      var numPoints = this.edges[this.longestEdge].points.length - 1;

      var edge2 = this.edges[(this.longestEdge + 1) % 3];
      var edge3 = this.edges[(this.longestEdge + 2) % 3];

      for (var i = 1; i <= numPoints; i++) {
        this.mesh[i] = [];
        var p1 = edge2.points[i];
        var p2 = edge3.points[numPoints - i];
        console.log(p1, p2);
        this.mesh[i].push(p1);

        //subdivide line between points on opposite edges and add points to mesh
        var d = distance(p1, p2);
        var spacing = d / (numPoints - i);

        var nextPoint = directedSpacedPointOnLine(p1, p2, spacing);
        for (var j = 0; j < numPoints - i; j++) {

          this.mesh[i].push(nextPoint);
          nextPoint = directedSpacedPointOnLine(p2, nextPoint, spacing);
        }

        //push final point of line
        //NOTE: the very final loop is a single vertex with p1 = p2 so this
        //overwrites this.mesh[i].push(p1) above
        this.mesh[i].push(p2);
      }
    }

    //Apply a Transform to the polygon

  }, {
    key: 'transform',
    value: function transform(_transform2) {
      var materialIndex = arguments.length <= 1 || arguments[1] === undefined ? this.materialIndex : arguments[1];

      var newVertices = [];
      for (var i = 0; i < this.vertices.length; i++) {
        newVertices.push(this.vertices[i].transform(_transform2));
      }
      return new Polygon(newVertices, materialIndex);
    }

    //Incentre of triangular polygon

  }, {
    key: 'findCentre',
    value: function findCentre() {
      var a = distance(this.vertices[0], this.vertices[1]);
      var b = distance(this.vertices[1], this.vertices[2]);
      var c = distance(this.vertices[0], this.vertices[2]);
      var x = (a * this.vertices[2].x + b * this.vertices[0].x + c * this.vertices[1].x) / (a + b + c);
      var y = (a * this.vertices[2].y + b * this.vertices[0].y + c * this.vertices[1].y) / (a + b + c);
      this.centre = new Point(x, y);
    }
  }]);
  return Polygon;
}();

var Disk = function () {
  function Disk() {
    babelHelpers.classCallCheck(this, Disk);

    this.draw = new ThreeJS();
    this.centre = new Point(0, 0);
    this.drawDisk();
  }

  //draw the disk background

  babelHelpers.createClass(Disk, [{
    key: 'drawDisk',
    value: function drawDisk() {
      this.draw.disk(this.centre, 1, 0x00baff);
    }
  }, {
    key: 'drawPoint',
    value: function drawPoint(point, radius, color) {
      this.draw.disk(point, radius, color, false);
    }

    //Draw an arc (hyperbolic line segment) between two points on the disk

  }, {
    key: 'drawArc',
    value: function drawArc(arc, color) {
      if (arc.straightLine) {
        this.draw.line(arc.p1, arc.p2, color);
      } else {
        this.draw.segment(arc.circle, arc.startAngle, arc.endAngle, color);
      }
    }
  }, {
    key: 'drawPolygonOutline',
    value: function drawPolygonOutline(polygon, color) {
      var l = polygon.vertices.length;
      for (var i = 0; i < l; i++) {
        var arc = new Arc(polygon.vertices[i], polygon.vertices[(i + 1) % l]);
        this.drawArc(arc, color);
      }
    }
  }, {
    key: 'drawPolygon',
    value: function drawPolygon(polygon, color, texture, wireframe) {
      this.draw.polygon(polygon, color, texture, wireframe);
    }
  }]);
  return Disk;
}();

/*
barycentre() {
  const l = this.vertices.length;
  const first = this.vertices[0];
  const last = this.vertices[l - 1];

  let twicearea = 0,
    x = 0,
    y = 0,
    p1, p2, f;
  for (let i = 0, j = l - 1; i < l; j = i++) {
    p1 = this.vertices[i];
    p2 = this.vertices[j];
    f = p1.x * p2.y - p2.x * p1.y;
    twicearea += f;
    x += (p1.x + p2.x) * f;
    y += (p1.y + p2.y) * f;
  }
  f = twicearea * 3;
  return new Point(x / f, y / f);
}
*/

//TODO Document these classes
// * ***********************************************************************
// *
// *  TRANSFORM CLASS
// *
// *************************************************************************
var Transform = function () {
  function Transform(matrix, orientation, position) {
    babelHelpers.classCallCheck(this, Transform);

    this.matrix = matrix || identityMatrix(3);
    this.orientation = orientation;
    this.position = position || false; //position not always required
  }

  babelHelpers.createClass(Transform, [{
    key: 'multiply',
    value: function multiply(transform) {
      if (!transform instanceof Transform) {
        console.error('Error: ' + transform + 'is not a Transform');
        return false;
      }
      var mat = multiplyMatrices(transform.matrix, this.matrix);
      var position = transform.position;
      var orientation = 1; //rotation
      if (transform.orientation * this.orientation < 0) {
        orientation = -1;
      }
      return new Transform(mat, orientation, position);
    }
  }]);
  return Transform;
}();

// * ***********************************************************************
// *
// *  TRANSFORMATIONS CLASS
// *
// *
// *************************************************************************

var Transformations = function () {
  function Transformations(p, q) {
    babelHelpers.classCallCheck(this, Transformations);

    this.p = p;
    this.q = q;

    this.initHypotenuseReflection();
    this.initEdgeReflection();
    this.initEdgeBisectorReflection();

    this.rot2 = multiplyMatrices(this.edgeReflection.matrix, this.edgeBisectorReflection.matrix);

    this.initPgonRotations();
    this.initEdges();
    this.initEdgeTransforms();

    this.identity = new Transform(identityMatrix(3));
  }

  //reflect across the hypotenuse of the fundamental region of a tesselation

  babelHelpers.createClass(Transformations, [{
    key: 'initHypotenuseReflection',
    value: function initHypotenuseReflection() {
      this.hypReflection = new Transform(identityMatrix(3), -1);
      this.hypReflection.matrix[0][0] = Math.cos(2 * Math.PI / this.p);
      this.hypReflection.matrix[0][1] = Math.sin(2 * Math.PI / this.p);
      this.hypReflection.matrix[1][0] = Math.sin(2 * Math.PI / this.p);
      this.hypReflection.matrix[1][1] = -Math.cos(2 * Math.PI / this.p);
    }

    //reflect across the first edge of the polygon (which crosses the radius
    // (0,0) -> (0,1) on unit disk). Combined with rotations we can reflect
    //across any edge

  }, {
    key: 'initEdgeReflection',
    value: function initEdgeReflection() {
      var cosp = Math.cos(Math.PI / this.p);
      var sinp = Math.sin(Math.PI / this.p);
      var cos2p = Math.cos(2 * Math.PI / this.p);
      var sin2p = Math.sin(2 * Math.PI / this.p);

      var coshq = Math.cos(Math.PI / this.q) / sinp; //Math.cosh(Math.PI / this.q);
      var sinhq = Math.sqrt(coshq * coshq - 1); //Math.sinh(Math.PI / this.q);

      var cosh2q = 2 * coshq * coshq - 1;
      var sinh2q = 2 * sinhq * coshq;
      var num = 2;
      var den = 6;
      this.edgeReflection = new Transform(identityMatrix(3), -1);
      this.edgeReflection.matrix[0][0] = -cosh2q; //Math.cosh(num * Math.PI / (den));
      this.edgeReflection.matrix[0][2] = sinh2q; //Math.sinh(num * Math.PI / (den));
      this.edgeReflection.matrix[2][0] = -sinh2q; //Math.sinh(num * Math.PI / (den));
      this.edgeReflection.matrix[2][2] = cosh2q; //Math.cosh(num * Math.PI / (den));
    }
  }, {
    key: 'initEdgeBisectorReflection',
    value: function initEdgeBisectorReflection() {
      this.edgeBisectorReflection = new Transform(identityMatrix(3), -1);
      this.edgeBisectorReflection.matrix[1][1] = -1;
    }

    //set up clockwise and anticlockwise rotations which will rotate by
    // PI/(number of sides of central polygon)

  }, {
    key: 'initPgonRotations',
    value: function initPgonRotations() {
      this.rotatePolygonCW = [];
      this.rotatePolygonCCW = [];
      for (var i = 0; i < this.p; i++) {
        this.rotatePolygonCW[i] = new Transform(identityMatrix(3), 1);
        this.rotatePolygonCW[i].matrix[0][0] = Math.cos(2 * i * Math.PI / this.p);
        this.rotatePolygonCW[i].matrix[0][1] = -Math.sin(2 * i * Math.PI / this.p);
        this.rotatePolygonCW[i].matrix[1][0] = Math.sin(2 * i * Math.PI / this.p);
        this.rotatePolygonCW[i].matrix[1][1] = Math.cos(2 * i * Math.PI / this.p);

        this.rotatePolygonCCW[i] = new Transform(identityMatrix(3), 1);
        this.rotatePolygonCCW[i].matrix[0][0] = Math.cos(2 * i * Math.PI / this.p);
        this.rotatePolygonCCW[i].matrix[0][1] = Math.sin(2 * i * Math.PI / this.p);
        this.rotatePolygonCCW[i].matrix[1][0] = -Math.sin(2 * i * Math.PI / this.p);
        this.rotatePolygonCCW[i].matrix[1][1] = Math.cos(2 * i * Math.PI / this.p);
      }
    }

    //orientation: either reflection = -1 OR rotation = 1

  }, {
    key: 'initEdges',
    value: function initEdges() {
      this.edges = [];
      for (var i = 0; i < this.p; i++) {
        this.edges.push({
          orientation: 1,
          adjacentEdge: i
        });
      }
    }

    /*
    //TESTING: manually setting edges for {4, q} tilings
    initEdges() {
      this.edges = [];
      this.edges.push({
        orientation: 1,
        adjacentEdge: 3,
      });
      this.edges.push({
        orientation: 1,
        adjacentEdge: 2,
      });
      this.edges.push({
        orientation: 1,
        adjacentEdge: 1,
      });
      this.edges.push({
        orientation: 1,
        adjacentEdge: 0,
      });
    }
    */

  }, {
    key: 'initEdgeTransforms',
    value: function initEdgeTransforms() {
      this.edgeTransforms = [];

      for (var i = 0; i < this.p; i++) {
        var adj = this.edges[i].adjacentEdge;
        //Case 1: reflection
        if (this.edges[i].orientation === -1) {
          var mat = multiplyMatrices(this.rotatePolygonCW[i].matrix, this.edgeReflection.matrix);
          mat = multiplyMatrices(mat, this.rotatePolygonCCW[adj].matrix);
          this.edgeTransforms[i] = new Transform(mat);
        }
        //Case 2: rotation
        else if (this.edges[i].orientation === 1) {
            var mat = multiplyMatrices(this.rotatePolygonCW[i].matrix, this.rot2);
            mat = multiplyMatrices(mat, this.rotatePolygonCCW[adj].matrix);
            this.edgeTransforms[i] = new Transform(mat);
          } else {
            console.error('initEdgeTransforms(): invalid orientation value');
            console.error(this.edges[i]);
          }
        this.edgeTransforms[i].orientation = this.edges[adj].orientation;
        this.edgeTransforms[i].position = adj;
      }
    }
  }, {
    key: 'shiftTrans',
    value: function shiftTrans(transform, shift) {
      var newEdge = (transform.position + transform.orientation * shift + 2 * this.p) % this.p;
      if (newEdge < 0 || newEdge > this.p - 1) {
        console.error('Error: shiftTran newEdge out of range.');
      }
      return transform.multiply(this.edgeTransforms[newEdge]);
    }
  }]);
  return Transformations;
}();

// * ***********************************************************************
// *
// *  PARAMETERS CLASS
// *
// *************************************************************************

var Parameters = function () {
  function Parameters(p, q) {
    babelHelpers.classCallCheck(this, Parameters);

    this.p = p;
    this.q = q;

    this.minExposure = q - 2;
    this.maxExposure = q - 1;
  }

  babelHelpers.createClass(Parameters, [{
    key: 'exposure',
    value: function exposure(layer, vertexNum, pgonNum) {
      if (layer === 0) {
        if (pgonNum === 0) {
          //layer 0, pgon 0
          if (this.q === 3) return this.maxExposure;else return this.minExposure;
        } else return this.maxExposure; //layer 0, pgon != 0
      } else {
          //layer != 0
          if (vertexNum === 0 && pgonNum === 0) {
            return this.minExposure;
          } else if (vertexNum === 0) {
            if (this.q !== 3) return this.maxExposure;else return this.minExposure;
          } else if (pgonNum === 0) {
            if (this.q !== 3) return this.minExposure;else return this.maxExposure;
          } else return this.maxExposure;
        }
    }
  }, {
    key: 'pSkip',
    value: function pSkip(exposure) {
      if (exposure === this.minExposure) {
        if (this.q !== 3) return 1;else return 3;
      } else if (exposure === this.maxExposure) {
        if (this.p === 3) return 1;else if (this.q === 3) return 2;else return 0;
      } else {
        console.error('pSkip: wrong exposure value!');
        return false;
      }
    }
  }, {
    key: 'qSkip',
    value: function qSkip(exposure, vertexNum) {
      if (exposure === this.minExposure) {
        if (vertexNum === 0) {
          if (this.q !== 3) return -1;else return 0;
        } else {
          if (this.p === 3) return -1;else return 0;
        }
      } else if (exposure === this.maxExposure) {
        if (vertexNum === 0) {
          if (this.p === 3 || this.q === 3) return 0;else return -1;
        } else return 0;
      } else {
        console.error('qSkip: wrong exposure value!');
        return false;
      }
    }
  }, {
    key: 'verticesToDo',
    value: function verticesToDo(exposure) {
      if (this.p === 3) return 1;else if (exposure === this.minExposure) {
        if (this.q === 3) return this.p - 5;else return this.p - 3;
      } else if (exposure === this.maxExposure) {
        if (this.q === 3) return this.p - 4;else return this.p - 2;
      } else {
        console.error('verticesToDo: wrong exposure value!');
        return false;
      }
    }
  }, {
    key: 'pgonsToDo',
    value: function pgonsToDo(exposure, vertexNum) {
      if (this.q === 3) return 1;else if (vertexNum === 0) return this.q - 3;else if (exposure === this.minExposure) {
        if (this.p === 3) return this.q - 4;else return this.q - 2;
      } else if (exposure === this.maxExposure) {
        if (this.p === 3) return this.q - 3;else return this.q - 2;
      } else {
        console.error('pgonsToDo: wrong exposure value!');
        return false;
      }
    }
  }]);
  return Parameters;
}();

// * ***********************************************************************
// *    TESSELATION CLASS
// *    Creates a regular Tesselation of the Poincare Disk
// *    q: number of p-gons meeting at each vertex
// *    p: number of sides of p-gon
// *    using the techniques created by Coxeter and Dunham
// *
// *************************************************************************
var RegularTesselation = function () {
  function RegularTesselation(p, q, maxLayers) {
    babelHelpers.classCallCheck(this, RegularTesselation);

    //TESTING
    this.wireframe = false;
    this.wireframe = true;
    console.log(p, q, maxLayers);
    //this.textures = ['./images/textures/fish-black1.png', './images/textures/fish-white1-flipped.png'];
    this.textures = ['./images/textures/black.png', './images/textures/white.png'];

    this.p = p;
    this.q = q;
    this.maxLayers = maxLayers || 5;

    this.disk = new Disk();
    this.params = new Parameters(p, q);
    this.transforms = new Transformations(p, q);

    this.layers = [];
    for (var i = 0; i <= maxLayers; i++) {
      this.layers[i] = [];
    }

    if (this.checkParams()) {
      return false;
    }

    this.init();
  }

  babelHelpers.createClass(RegularTesselation, [{
    key: 'init',
    value: function init(p, q, maxLayers) {
      this.buildCentralPattern();

      if (this.maxLayers > 1) {
        var _t = performance.now();
        this.generateLayers();
        var _t2 = performance.now();
        console.log('GenerateLayers took ' + (_t2 - _t) + ' milliseconds.');
      }
      var t0 = performance.now();
      //this.drawLayers();
      var t1 = performance.now();
      console.log('DrawLayers took ' + (t1 - t0) + ' milliseconds.');
    }

    //fundamentalRegion calculation using Dunham's method
    //this is a right angle triangle above the radius on the line (0,0) -> (0,1)
    //of the central polygon

  }, {
    key: 'fundamentalRegion',
    value: function fundamentalRegion() {
      var cosh2 = Math.cot(Math.PI / this.p) * Math.cot(Math.PI / this.q);

      var sinh2 = Math.sqrt(cosh2 * cosh2 - 1);

      var coshq = Math.cos(Math.PI / this.q) / Math.sin(Math.PI / this.p);
      var sinhq = Math.sqrt(coshq * coshq - 1);

      var rad2 = sinh2 / (cosh2 + 1); //radius of circle containing layer 0
      var x2pt = sinhq / (coshq + 1); //x coordinate of third vertex of triangle

      //point at end of hypotenuse of fundamental region
      var xqpt = Math.cos(Math.PI / this.p) * rad2;
      var yqpt = Math.sin(Math.PI / this.p) * rad2;

      //create points and move them from the unit disk to our radius
      var p1 = new Point(xqpt, yqpt);
      var p2 = new Point(x2pt, 0);
      var p3 = p1.transform(this.transforms.edgeBisectorReflection);
      var vertices = [this.disk.centre, p1, p2];

      return new Polygon(vertices, 0);
    }

    //this is a kite shaped region consisting of two copies of the fundamental
    //region with different textures applied to create the basic pattern
    //NOTE: for the time being just using edge bisector reflection to recreate Circle
    //Limit I, other patterns will require different options

  }, {
    key: 'fundamentalPattern',
    value: function fundamentalPattern() {
      var upper = this.fundamentalRegion();

      //TESTING
      upper.subdivideEdges();
      this.disk.drawPolygon(upper, 0xffffff, this.textures, this.wireframe);
      /*
       upper.subdivideMesh();
       for(let line of upper.mesh){
        for(let point of line){
          this.disk.drawPoint(point, 0.007, 0xff0000);
        }
      }
      */

      var lower = upper.transform(this.transforms.edgeBisectorReflection, 1);
      //console.log(upper, upper.vertices, upper.mesh);
      return [upper, lower];
    }

    //The pattern in the central polygon is made up of transformed copies
    //of the fundamental pattern

  }, {
    key: 'buildCentralPattern',
    value: function buildCentralPattern() {
      //add the first two polygons to the central pattern
      this.centralPattern = this.fundamentalPattern();

      //NOTE: could do this more concisely using array indices and multiplying transforms
      //but naming the regions for clarity
      var upper = this.centralPattern[0];
      var lower = this.centralPattern[1];

      //created reflected versions of the two pattern pieces
      var upperReflected = this.centralPattern[0].transform(this.transforms.edgeBisectorReflection);
      var lowerReflected = this.centralPattern[1].transform(this.transforms.edgeBisectorReflection);

      for (var i = 1; i < this.p; i++) {
        if (i % 2 === 1) {
          this.centralPattern.push(upperReflected.transform(this.transforms.rotatePolygonCW[i]));
          this.centralPattern.push(lowerReflected.transform(this.transforms.rotatePolygonCW[i]));
        } else {
          this.centralPattern.push(upper.transform(this.transforms.rotatePolygonCW[i]));
          this.centralPattern.push(lower.transform(this.transforms.rotatePolygonCW[i]));
        }
      }

      this.layers[0][0] = this.centralPattern;
    }

    //TODO document this function

  }, {
    key: 'generateLayers',
    value: function generateLayers() {
      for (var i = 0; i < this.p; i++) {
        var qTransform = this.transforms.edgeTransforms[i];
        for (var j = 0; j < this.q - 2; j++) {
          if (this.p === 3 && this.q - 3 === j) {
            this.layers[i].push(this.transformPattern(this.centralPattern, qTransform));
          } else {
            this.layerRecursion(this.params.exposure(0, i, j), 1, qTransform);
          }
          if (-1 % this.p !== 0) {
            qTransform = this.transforms.shiftTrans(qTransform, -1); // -1 means clockwise
          }
        }
      }
    }

    //calculate the polygons in each layer and add them to this.layers[layer] array
    //but don't draw them yet
    //TODO document this function

  }, {
    key: 'layerRecursion',
    value: function layerRecursion(exposure, layer, transform) {
      this.layers[layer].push(this.transformPattern(this.centralPattern, transform));

      if (layer >= this.maxLayers) return;

      var pSkip = this.params.pSkip(exposure);
      var verticesToDo = this.params.verticesToDo(exposure);

      for (var i = 0; i < verticesToDo; i++) {
        var pTransform = this.transforms.shiftTrans(transform, pSkip);
        var qTransform = undefined;

        var qSkip = this.params.qSkip(exposure, i);
        if (qSkip % this.p !== 0) {
          qTransform = this.transforms.shiftTrans(pTransform, qSkip);
        } else {
          qTransform = pTransform;
        }

        var pgonsToDo = this.params.pgonsToDo(exposure, i);

        for (var j = 0; j < pgonsToDo; j++) {
          if (this.p === 3 && j === pgonsToDo - 1) {
            this.layers[layer].push(this.transformPattern(this.centralPattern, qTransform));
          } else {
            this.layerRecursion(this.params.exposure(layer, i, j), layer + 1, qTransform);
          }
          if (-1 % this.p !== 0) {
            qTransform = this.transforms.shiftTrans(qTransform, -1); // -1 means clockwise
          }
        }
        pSkip = (pSkip + 1) % this.p;
      }
    }
  }, {
    key: 'transformPattern',
    value: function transformPattern(pattern, transform) {
      var newPattern = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = pattern[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var polygon = _step.value;

          newPattern.push(polygon.transform(transform));
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return newPattern;
    }
  }, {
    key: 'drawPattern',
    value: function drawPattern(pattern) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = pattern[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var polygon = _step2.value;

          this.disk.drawPolygon(polygon, 0xffffff, this.textures, this.wireframe);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: 'drawLayers',
    value: function drawLayers() {
      for (var i = 0; i < this.layers.length; i++) {
        var layer = this.layers[i];
        for (var j = 0; j < layer.length; j++) {
          this.drawPattern(layer[j]);
        }
      }
    }

    //The tesselation requires that (p-2)(q-2) > 4 to work (otherwise it is
    //either an elliptical or euclidean tesselation);

  }, {
    key: 'checkParams',
    value: function checkParams() {
      if (this.maxLayers < 0 || isNaN(this.maxLayers)) {
        console.error('maxLayers must be greater than 0');
        return true;
      } else if ((this.p - 2) * (this.q - 2) <= 4) {
        console.error('Hyperbolic tesselations require that (p-2)(q-2) > 4!');
        return true;
      } else if (this.q < 3 || isNaN(this.q)) {
        console.error('Tesselation error: at least 3 p-gons must meet \
                    at each vertex!');
        return true;
      } else if (this.p < 3 || isNaN(this.p)) {
        console.error('Tesselation error: polygon needs at least 3 sides!');
        return true;
      } else {
        return false;
      }
    }
  }]);
  return RegularTesselation;
}();

/*
buildCentralPolygon() {
  const vertices = [];
  for (let i = 0; i < this.p; i++) {
    const p = this.fr.vertices[1];
    vertices.push(p.transform(this.transforms.rotatePolygonCW[i]))
  }
  this.centralPolygon = new Polygon(vertices, true);
}
*/

/*
//calculate the fundamental region (triangle out of which Layer 0 is built)
//using Coxeter's method
fundamentalRegion() {
  const s = Math.sin(Math.PI / this.p);
  const t = Math.cos(Math.PI / this.q);
  //multiply these by the disks radius (Coxeter used unit disk);
  const r = 1 / Math.sqrt((t * t) / (s * s) - 1) * window.radius;
  const d = 1 / Math.sqrt(1 - (s * s) / (t * t)) * window.radius;
  const b = new Point(window.radius * Math.cos(Math.PI / this.p), window.radius * Math.sin(Math.PI / this.p));

  const circle = new Circle(d, 0, r);

  //there will be two points of intersection, of which we want the first
  const p1 = E.circleLineIntersect(circle, this.disk.centre, b).p1;

  const p2 = new Point(d - r, 0);

  const vertices = [this.disk.centre, p1, p2];

  return new Polygon(vertices);
}
*/

// * ***********************************************************************
// *
// *   POLYFILLS
// *
// *************************************************************************

Math.sinh = Math.sinh || function (x) {
  var y = Math.exp(x);
  return (y - 1 / y) / 2;
};

Math.cosh = Math.cosh || function (x) {
  var y = Math.exp(x);
  return (y + 1 / y) / 2;
};

Math.cot = Math.cot || function (x) {
  return 1 / Math.tan(x);
};

// * ***********************************************************************
// *
// *   SETUP
// *
// *************************************************************************
var tesselation = undefined;
var p = randomInt(3, 7);
var q = randomInt(3, 7);
if ((p - 2) * (q - 2) < 5) {
  q = 5;
  p = 4;
}

//Run after load to get window width and height
window.onload = function () {
  tesselation = new RegularTesselation(6, 6, 1);
  //tesselation = new RegularTesselation(p, q, maxLayers);
};

//TODO: resize is not working well, fix it!
window.onresize = function () {
  tesselation.disk.draw.reset();
  tesselation.disk.drawDisk();
  tesselation.init();
};