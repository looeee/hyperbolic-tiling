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
    this.z = 0;
  }

  //compare two points taking rounding errors into account


  Point.prototype.compare = function compare(otherPoint) {
    if (typeof otherPoint === 'undefined') {
      console.warn('Compare Points: point not defined.');
      return false;
    }
    var a = toFixed(this.x) === toFixed(otherPoint.x);
    var b = toFixed(this.y) === toFixed(otherPoint.y);
    if (a && b) return true;
    return false;
  };

  //move the point to hyperboloid (Weierstrass) space, apply the transform,
  //then move back


  Point.prototype.transform = function transform(_transform) {
    var mat = _transform.matrix;
    var p = this.poincareToHyperboloid();
    var x = p.x * mat[0][0] + p.y * mat[0][1] + p.z * mat[0][2];
    var y = p.x * mat[1][0] + p.y * mat[1][1] + p.z * mat[1][2];
    var z = p.x * mat[2][0] + p.y * mat[2][1] + p.z * mat[2][2];
    var q = new Point(x, y);
    q.z = z;
    return q.hyperboloidToPoincare();
  };

  Point.prototype.poincareToHyperboloid = function poincareToHyperboloid() {
    var factor = 1 / (1 - this.x * this.x - this.y * this.y);
    var x = 2 * factor * this.x;
    var y = 2 * factor * this.y;
    var z = factor * (1 + this.x * this.x + this.y * this.y);
    var p = new Point(x, y);
    p.z = z;
    return p;
  };

  Point.prototype.hyperboloidToPoincare = function hyperboloidToPoincare() {
    var factor = 1 / (1 + this.z);
    var x = factor * this.x;
    var y = factor * this.y;
    return new Point(x, y);
  };

  Point.prototype.clone = function clone() {
    return new Point(this.x, this.y);
  };

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
      this.straightLine = true;
      this.arcLength = distance(startPoint, endPoint);
      this.curvature = 0;
    } else {
      this.calculateArc();
      this.arcLength = arcLength(this.circle, this.startAngle, this.endAngle);
      this.curvature = this.arcLength / this.circle.radius;
    }
  }

  //Calculate the arc using Dunham's method


  Arc.prototype.calculateArc = function calculateArc() {
    //calculate centre of arcCircle relative to unit disk
    var hp = this.hyperboloidCrossProduct(this.startPoint.poincareToHyperboloid(), this.endPoint.poincareToHyperboloid());

    var arcCentre = new Point(hp.x / hp.z, hp.y / hp.z);
    var arcRadius = Math.sqrt(Math.pow(this.startPoint.x - arcCentre.x, 2) + Math.pow(this.startPoint.y - arcCentre.y, 2));

    //translate points to origin and calculate arctan
    this.startAngle = Math.atan2(this.startPoint.y - arcCentre.y, this.startPoint.x - arcCentre.x);
    this.endAngle = Math.atan2(this.endPoint.y - arcCentre.y, this.endPoint.x - arcCentre.x);

    //angles are in (-pi, pi), transform to (0,2pi)
    this.startAngle = this.startAngle < 0 ? 2 * Math.PI + this.startAngle : this.startAngle;
    this.endAngle = this.endAngle < 0 ? 2 * Math.PI + this.endAngle : this.endAngle;

    this.circle = new Circle(arcCentre.x, arcCentre.y, arcRadius);
  };

  Arc.prototype.hyperboloidCrossProduct = function hyperboloidCrossProduct(point3D1, point3D2) {
    return {
      x: point3D1.y * point3D2.z - point3D1.z * point3D2.y,
      y: point3D1.z * point3D2.x - point3D1.x * point3D2.z,
      z: -point3D1.x * point3D2.y + point3D1.y * point3D2.x
    };
  };

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

  //calculate the spacing for subdividing the edge into an even number of pieces.
  //For the first ( longest ) edge this will be calculated based on spacing
  //then for the rest of the edges it will be calculated based on the number of
  //subdivisions of the first edge ( so that all edges are divided into an equal
  // number of pieces)


  Edge.prototype.calculateSpacing = function calculateSpacing(numDivisions) {
    //subdivision spacing for edges
    this.spacing = this.arc.arcLength > 0.03 ? this.arc.arcLength / 5 //approx maximum that hides all gaps
    : 0.02;

    //calculate the number of subdivisions required break the arc into an
    //even number of pieces (or 1 in case of tiny polygons)
    var subdivisions = this.arc.arcLength > 0.01 ? 2 * Math.ceil(this.arc.arcLength / this.spacing / 2) : 1;

    this.numDivisions = numDivisions || subdivisions;

    //recalculate spacing based on number of points
    this.spacing = this.arc.arcLength / this.numDivisions;
  };

  //calculate the spacing for subdividing the edge into an even number of pieces.
  //For the first ( longest ) edge this will be calculated based on spacing
  //then for the rest of the edges it will be calculated based on the number of
  //subdivisions of the first edge ( so that all edges are divided into an equal
  // number of pieces)


  Edge.prototype.calculateExpandedSpacing = function calculateExpandedSpacing(numDivisions) {
    //subdivision spacing for edges
    this.expandedSpacing = this.arc.arcLength > 0.03 * radius ? this.arc.arcLength / 5 //approx maximum that hides all gaps
    : 0.02 * radius;

    //calculate the number of subdivisions required break the arc into an
    //even number of pieces (or 1 in case of tiny polygons)
    var subdivisions = this.arc.arcLength > 0.01 * radius ? 2 * Math.ceil(this.arc.arcLength / this.expandedSpacing / 2) : 1;

    this.numDivisions = numDivisions || subdivisions;

    //recalculate spacing based on number of points
    this.expandedSpacing = this.arc.arcLength / this.numDivisions;
  };

  Edge.prototype.subdivideExpandedEdge = function subdivideExpandedEdge(numDivisions) {
    this.calculateExpandedSpacing(numDivisions);
    this.points = [this.arc.startPoint];

    //tiny pgons near the edges of the disk don't need to be subdivided
    if (this.arc.arcLength > this.expandedSpacing) {
      var p = !this.arc.straightLine ? directedSpacedPointOnArc(this.arc.circle, this.arc.startPoint, this.arc.endPoint, this.expandedSpacing) : directedSpacedPointOnLine(this.arc.startPoint, this.arc.endPoint, this.expandedSpacing);
      this.points.push(p);

      for (var i = 0; i < this.numDivisions - 2; i++) {
        p = !this.arc.straightLine ? directedSpacedPointOnArc(this.arc.circle, p, this.arc.endPoint, this.expandedSpacing) : directedSpacedPointOnLine(p, this.arc.endPoint, this.expandedSpacing);
        this.points.push(p);
      }
    }
    //push the final vertex
    this.points.push(this.arc.endPoint);
  };

  Edge.prototype.subdivideEdge = function subdivideEdge(numDivisions) {
    this.calculateSpacing(numDivisions);
    this.points = [this.arc.startPoint];

    //tiny pgons near the edges of the disk don't need to be subdivided
    if (this.arc.arcLength > this.spacing) {
      var p = !this.arc.straightLine ? directedSpacedPointOnArc(this.arc.circle, this.arc.startPoint, this.arc.endPoint, this.spacing) : directedSpacedPointOnLine(this.arc.startPoint, this.arc.endPoint, this.spacing);
      this.points.push(p);

      for (var i = 0; i < this.numDivisions - 2; i++) {
        p = !this.arc.straightLine ? directedSpacedPointOnArc(this.arc.circle, p, this.arc.endPoint, this.spacing) : directedSpacedPointOnLine(p, this.arc.endPoint, this.spacing);
        this.points.push(p);
      }
    }
    //push the final vertex
    this.points.push(this.arc.endPoint);
  };

  return Edge;
}();

// * ***********************************************************************
// *
// *  (TRIANGULAR) POLYGON CLASS
// *
// *************************************************************************
//NOTE: sometimes polygons will be backwards facing. Solved with DoubleSide material
//but may cause problems
//@param vertices: array of Points
//@param materialIndex: which material from THREE.Multimaterial to use
//TODO: the subdivion mesh is calculated in the unit disk then mapped to screen coords
//by ThreeJS class. This is very inefficient. Better to do the multiplication as the mesh is
//being generated


var Polygon = function () {
  function Polygon(vertices) {
    var materialIndex = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
    babelHelpers.classCallCheck(this, Polygon);

    this.materialIndex = materialIndex;
    this.vertices = vertices;
    this.addEdges();
    this.findSubdivisionEdge();
    this.subdivideMesh();
  }

  Polygon.prototype.addEdges = function addEdges() {
    this.edges = [];
    for (var i = 0; i < this.vertices.length; i++) {
      this.edges.push(new Edge(this.vertices[i], this.vertices[(i + 1) % this.vertices.length]));
    }
  };

  //The longest edge with radius > 0 should be used to calculate how the finely
  //the polygon gets subdivided


  Polygon.prototype.findSubdivisionEdge = function findSubdivisionEdge() {
    var a = this.edges[0].arc.curvature === 0 ? 0 : this.edges[0].arc.arcLength;
    var b = this.edges[1].arc.curvature === 0 ? 0 : this.edges[1].arc.arcLength;
    var c = this.edges[2].arc.curvature === 0 ? 0 : this.edges[2].arc.arcLength;
    if (a > b && a > c) this.subdivisionEdge = 0;else if (b > c) this.subdivisionEdge = 1;else this.subdivisionEdge = 2;
  };

  //subdivide the subdivision edge, then subdivide the other two edges with the
  //same number of points as the subdivision


  Polygon.prototype.subdivideEdges = function subdivideEdges() {
    this.edges[this.subdivisionEdge].subdivideEdge();
    this.numDivisions = this.edges[this.subdivisionEdge].points.length - 1;

    this.edges[(this.subdivisionEdge + 1) % 3].subdivideEdge(this.numDivisions);
    this.edges[(this.subdivisionEdge + 2) % 3].subdivideEdge(this.numDivisions);
  };

  Polygon.prototype.subdivideMesh = function subdivideMesh() {
    this.subdivideEdges();
    this.mesh = [].concat(this.edges[0].points);

    for (var i = 1; i < this.numDivisions; i++) {
      var startPoint = this.edges[2].points[this.numDivisions - i];
      var endPoint = this.edges[1].points[i];
      this.subdivideInteriorArc(startPoint, endPoint, i);
    }

    //push the final vertex
    this.mesh.push(this.edges[2].points[0]);
  };

  //find the points along the arc between opposite subdivions of the second two
  //edges of the polygon


  Polygon.prototype.subdivideInteriorArc = function subdivideInteriorArc(startPoint, endPoint, arcIndex) {
    var circle = new Arc(startPoint, endPoint).circle;
    this.mesh.push(startPoint);

    //for each arc, the number of divisions will be reduced by one
    var divisions = this.numDivisions - arcIndex;

    //if the line get divided add points along line to mesh
    if (divisions > 1) {
      var spacing = distance(startPoint, endPoint) / divisions;
      var nextPoint = directedSpacedPointOnArc(circle, startPoint, endPoint, spacing);
      for (var j = 0; j < divisions - 1; j++) {
        this.mesh.push(nextPoint);
        nextPoint = directedSpacedPointOnArc(circle, nextPoint, endPoint, spacing);
      }
    }

    this.mesh.push(endPoint);
  };

  //Apply a Transform to the polygon


  Polygon.prototype.transform = function transform(_transform2) {
    var materialIndex = arguments.length <= 1 || arguments[1] === undefined ? this.materialIndex : arguments[1];

    var newVertices = [];
    for (var i = 0; i < this.vertices.length; i++) {
      newVertices.push(this.vertices[i].transform(_transform2));
    }
    return new Polygon(newVertices, materialIndex);
  };

  return Polygon;
}();

// * ***********************************************************************
// *
// *   EUCLIDEAN FUNCTIONS
// *   a place to stash all the functions that are euclidean geometrical
// *   operations
// *   All functions are 2D unless otherwise specified!
// *
// *************************************************************************

//.toFixed returns a string for some no doubt very good reason.
//apply to fixed with default value of 10 and return as a float
var toFixed = function (number) {
  var places = arguments.length <= 1 || arguments[1] === undefined ? 10 : arguments[1];
  return parseFloat(number.toFixed(places));
};

var distance = function (point1, point2) {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
};

//does the line connecting p1, p2 go through the point (0,0)?
var throughOrigin = function (point1, point2) {
  //vertical line through centre
  if (toFixed(point1.x) == 0 && toFixed(point2.x) === 0) {
    return true;
  }
  var test = (-point1.x * point2.y + point1.x * point1.y) / (point2.x - point1.x) + point1.y;

  if (toFixed(test) == 0) return true;
  return false;
};

//Find the length of the smaller arc between two angles on a given circle
var arcLength = function (circle, startAngle, endAngle) {
  return Math.abs(startAngle - endAngle) > Math.PI ? circle.radius * (2 * Math.PI - Math.abs(startAngle - endAngle)) : circle.radius * Math.abs(startAngle - endAngle);
};

//find the two points a distance from a point on the circumference of a circle
//in the direction of point2
var directedSpacedPointOnArc = function (circle, point1, point2, spacing) {
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

//calculate the normal vector given 2 points
var normalVector = function (p1, p2) {
  var d = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  return new Point((p2.x - p1.x) / d, (p2.y - p1.y) / d);
};

//find the point at a distance from point1 along line defined by point1, point2,
//in the direction of point2
var directedSpacedPointOnLine = function (point1, point2, spacing) {
  var dv = normalVector(point1, point2);
  return new Point(point1.x + spacing * dv.x, point1.y + spacing * dv.y);
};

var multiplyMatrices = function (m1, m2) {
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
var identityMatrix = function (n) {
  return Array.apply(null, new Array(n)).map(function (x, i, a) {
    return a.map(function (y, k) {
      return i === k ? 1 : 0;
    });
  });
};

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

  Transform.prototype.multiply = function multiply(transform) {
    if (!transform instanceof Transform) {
      console.error('Error: ' + transform + ' is not a Transform');
      return false;
    }
    var mat = multiplyMatrices(transform.matrix, this.matrix);
    var position = transform.position;
    var orientation = 1; //rotation
    if (transform.orientation * this.orientation < 0) {
      orientation = -1;
    }
    return new Transform(mat, orientation, position);
  };

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


  Transformations.prototype.initHypotenuseReflection = function initHypotenuseReflection() {
    this.hypReflection = new Transform(identityMatrix(3), -1);
    this.hypReflection.matrix[0][0] = Math.cos(2 * Math.PI / this.p);
    this.hypReflection.matrix[0][1] = Math.sin(2 * Math.PI / this.p);
    this.hypReflection.matrix[1][0] = Math.sin(2 * Math.PI / this.p);
    this.hypReflection.matrix[1][1] = -Math.cos(2 * Math.PI / this.p);
  };

  //reflect across the first edge of the polygon (which crosses the radius
  // (0,0) -> (0,1) on unit disk). Combined with rotations we can reflect
  //across any edge


  Transformations.prototype.initEdgeReflection = function initEdgeReflection() {
    var cosp = Math.cos(Math.PI / this.p);
    var sinp = Math.sin(Math.PI / this.p);
    var cos2p = Math.cos(2 * Math.PI / this.p);
    var sin2p = Math.sin(2 * Math.PI / this.p);

    var coshq = Math.cos(Math.PI / this.q) / sinp;
    var sinhq = Math.sqrt(coshq * coshq - 1);

    var cosh2q = 2 * coshq * coshq - 1;
    var sinh2q = 2 * sinhq * coshq;
    var num = 2;
    var den = 6;
    this.edgeReflection = new Transform(identityMatrix(3), -1);
    this.edgeReflection.matrix[0][0] = -cosh2q;
    this.edgeReflection.matrix[0][2] = sinh2q;
    this.edgeReflection.matrix[2][0] = -sinh2q;
    this.edgeReflection.matrix[2][2] = cosh2q;
  };

  Transformations.prototype.initEdgeBisectorReflection = function initEdgeBisectorReflection() {
    this.edgeBisectorReflection = new Transform(identityMatrix(3), -1);
    this.edgeBisectorReflection.matrix[1][1] = -1;
  };

  //set up clockwise and anticlockwise rotations which will rotate by
  // PI/(number of sides of central polygon)


  Transformations.prototype.initPgonRotations = function initPgonRotations() {
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
  };

  //orientation: either reflection = -1 OR rotation = 1


  Transformations.prototype.initEdges = function initEdges() {
    this.edges = [];
    for (var i = 0; i < this.p; i++) {
      this.edges.push({
        orientation: 1,
        adjacentEdge: i
      });
    }
  };

  Transformations.prototype.initEdgeTransforms = function initEdgeTransforms() {
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
          var _mat = multiplyMatrices(this.rotatePolygonCW[i].matrix, this.rot2);
          _mat = multiplyMatrices(_mat, this.rotatePolygonCCW[adj].matrix);
          this.edgeTransforms[i] = new Transform(_mat);
        } else {
          console.error('initEdgeTransforms(): invalid orientation value');
          console.error(this.edges[i]);
        }
      this.edgeTransforms[i].orientation = this.edges[adj].orientation;
      this.edgeTransforms[i].position = adj;
    }
  };

  Transformations.prototype.shiftTrans = function shiftTrans(transform, shift) {
    var newEdge = (transform.position + transform.orientation * shift + 2 * this.p) % this.p;
    if (newEdge < 0 || newEdge > this.p - 1) {
      console.error('Error: shiftTran newEdge out of range.');
    }
    return transform.multiply(this.edgeTransforms[newEdge]);
  };

  return Transformations;
}();

// * ***********************************************************************
// *
// *  PARAMETERS CLASS
// *
// *  These are largely taken from the table on pg 19 of Ajit Dajar's thesis
// *************************************************************************

var Parameters = function () {
  function Parameters(p, q) {
    babelHelpers.classCallCheck(this, Parameters);

    this.p = p;
    this.q = q;

    this.minExposure = q - 2;
    this.maxExposure = q - 1;
  }

  Parameters.prototype.exposure = function exposure(layer, vertexNum, pgonNum) {
    if (layer === 0) {
      if (pgonNum === 0) {
        //layer 0, pgon 0
        if (this.q === 3) return this.maxExposure;
        return this.minExposure;
      }
      return this.maxExposure; //layer 0, pgon != 0
    }
    if (vertexNum === 0 && pgonNum === 0) {
      return this.minExposure;
    } else if (vertexNum === 0) {
      if (this.q !== 3) return this.maxExposure;
      return this.minExposure;
    } else if (pgonNum === 0) {
      if (this.q !== 3) return this.minExposure;
      return this.maxExposure;
    }
    return this.maxExposure;
  };

  Parameters.prototype.pSkip = function pSkip(exposure) {
    if (exposure === this.minExposure) {
      if (this.q !== 3) return 1;
      return 3;
    } else if (exposure === this.maxExposure) {
      if (this.p === 3) return 1;else if (this.q === 3) return 2;
      return 0;
    }
    console.error('pSkip: wrong exposure value!');
    return false;
  };

  Parameters.prototype.qSkip = function qSkip(exposure, vertexNum) {
    if (exposure === this.minExposure) {
      if (vertexNum === 0) {
        if (this.q !== 3) return -1;
        return 0;
      }
      if (this.p === 3) return -1;
      return 0;
    } else if (exposure === this.maxExposure) {
      if (vertexNum === 0) {
        if (this.p === 3 || this.q === 3) return 0;
        return -1;
      }
      return 0;
    }
    console.error('qSkip: wrong exposure value!');
    return false;
  };

  Parameters.prototype.verticesToDo = function verticesToDo(exposure) {
    if (this.p === 3) return 1;else if (exposure === this.minExposure) {
      if (this.q === 3) return this.p - 5;
      return this.p - 3;
    } else if (exposure === this.maxExposure) {
      if (this.q === 3) return this.p - 4;
      return this.p - 2;
    }
    console.error('verticesToDo: wrong exposure value!');
    return false;
  };

  Parameters.prototype.pgonsToDo = function pgonsToDo(exposure, vertexNum) {
    if (this.q === 3) return 1;else if (vertexNum === 0) return this.q - 3;else if (exposure === this.minExposure) {
      if (this.p === 3) return this.q - 4;
      return this.q - 2;
    } else if (exposure === this.maxExposure) {
      if (this.p === 3) return this.q - 3;
      return this.q - 2;
    }
    console.error('pgonsToDo: wrong exposure value!');
    return false;
  };

  return Parameters;
}();

// * ***********************************************************************
// *    TESSELATION CLASS
// *    Creates a regular Tesselation of the Poincare Disk using the techniques
// *    created by Coxeter and Dunham
// *
// *    spec = {
// *      wireframe: true/false
// *      p: number of sides of p-gon
// *      q: number of p-gons meeting at each vertex
// *      textures: array
// *      edgeAdjacency: [ (multiDim array)
// *                      [
// *                        edge_0 orientation (-1 = reflection, 1 = rotation)],
// *                        edge_0 adjacency (range p - 1)],
// *                      ],
// *                    ...
// *                      [edge_p orientation, edge_p adjacency]
// *                    ],
// *      minPolygonSize: stop at polygons below this size,
// *    }
// *
// *
// *
// *************************************************************************

var RegularTesselation = function () {
  function RegularTesselation(spec) {
    babelHelpers.classCallCheck(this, RegularTesselation);

    this.wireframe = spec.wireframe || false;
    this.textures = spec.textures;
    this.p = spec.p || 4;
    this.q = spec.q || 6;

    //a value of about 0.02 seems to be the minimum that webgl can handle easily.
    //TODO test different tilings and work out value needed for each if different
    this.minPolygonSize = spec.minPolygonSize || 0.1;

    console.log('{', this.p, ', ', this.q, '} tiling.');

    this.params = new Parameters(this.p, this.q);
    this.transforms = new Transformations(this.p, this.q);

    if (this.checkParams()) {
      return false;
    }
    return this;
  }

  //fundamentalRegion calculation using Dunham's method
  //this is a right angle triangle above the radius on the line (0,0) -> (0,1)
  //of the central polygon


  RegularTesselation.prototype.fundamentalRegion = function fundamentalRegion() {
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
    var vertices = [new Point(0, 0), p1, p2];

    return new Polygon(vertices, 0);
  };

  //this is a kite shaped region consisting of two copies of the fundamental
  //region with different textures applied to create the basic pattern
  //NOTE: for the time being just using edge bisector reflection to recreate Circle
  //Limit I, other patterns will require different options


  RegularTesselation.prototype.fundamentalPattern = function fundamentalPattern() {
    var upper = this.fundamentalRegion();
    var lower = upper.transform(this.transforms.edgeBisectorReflection, 1);
    return [upper, lower];
  };

  //The pattern in the central polygon is made up of transformed copies
  //of the fundamental pattern


  RegularTesselation.prototype.buildCentralPattern = function buildCentralPattern() {
    //add the first two polygons to the central pattern
    var centralPattern = this.fundamentalPattern();

    //created reflected versions of the two pattern pieces
    var upperReflected = centralPattern[0].transform(this.transforms.edgeBisectorReflection);
    var lowerReflected = centralPattern[1].transform(this.transforms.edgeBisectorReflection);

    //add the rest of the pattern pieces to the central pattern
    for (var i = 1; i < this.p; i++) {
      if (i % 2 === 1) {
        centralPattern.push(upperReflected.transform(this.transforms.rotatePolygonCW[i]));
        centralPattern.push(lowerReflected.transform(this.transforms.rotatePolygonCW[i]));
      } else {
        centralPattern.push(centralPattern[0].transform(this.transforms.rotatePolygonCW[i]));
        centralPattern.push(centralPattern[1].transform(this.transforms.rotatePolygonCW[i]));
      }
    }

    return centralPattern;
  };

  //TODO document this function


  RegularTesselation.prototype.generateTiling = function generateTiling() {
    var designMode = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

    var tiling = this.buildCentralPattern();

    var pRange = designMode ? 1 : this.p; //if we are in design mode only do one loop
    for (var i = 0; i < pRange; i++) {
      var qTransform = this.transforms.edgeTransforms[i];

      var qRange = designMode ? 1 : this.q - 2; //if we are in design mode only do one loop
      for (var j = 0; j < qRange; j++) {
        if (this.p === 3 && this.q - 3 === j) {
          this.addTransformedPattern(tiling, qTransform);
        } else {
          this.layerRecursion(this.params.exposure(0, i, j), 1, qTransform, tiling, designMode);
        }
        if (-1 % this.p !== 0) {
          qTransform = this.transforms.shiftTrans(qTransform, -1); // -1 means clockwise
        }
      }
    }

    return tiling;
  };

  //calculate the polygons in each layer and add them to this.tiling[]
  //TODO document this function


  RegularTesselation.prototype.layerRecursion = function layerRecursion(exposure, layer, transform, tiling) {
    var designMode = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];

    this.addTransformedPattern(tiling, transform);
    //stop if the current pattern has reached the minimum size
    //TODO better method as this leaves holes at the edges
    if (tiling[tiling.length - 1].edges[0].arc.arcLength < this.minPolygonSize) {
      return;
    }

    var pSkip = this.params.pSkip(exposure);
    var verticesToDo = this.params.verticesToDo(exposure);

    var verticesRange = designMode ? 1 : verticesToDo; //if we are in design mode only do one loop
    for (var i = 0; i < verticesRange; i++) {
      var pTransform = this.transforms.shiftTrans(transform, pSkip);
      var qTransform = void 0;

      var qSkip = this.params.qSkip(exposure, i);
      if (qSkip % this.p !== 0) {
        qTransform = this.transforms.shiftTrans(pTransform, qSkip);
      } else {
        qTransform = pTransform;
      }

      var pgonsToDo = this.params.pgonsToDo(exposure, i);

      var pgonsRange = designMode ? 1 : pgonsToDo; //if we are in design mode only do one loop
      for (var j = 0; j < pgonsRange; j++) {
        if (this.p === 3 && j === pgonsToDo - 1) {
          this.addTransformedPattern(tiling, qTransform);
        } else {
          this.layerRecursion(this.params.exposure(layer, i, j), layer + 1, qTransform, tiling);
        }
        if (-1 % this.p !== 0) {
          qTransform = this.transforms.shiftTrans(qTransform, -1); // -1 means clockwise
        }
      }
      pSkip = (pSkip + 1) % this.p;
    }
  };

  //The first p*2 elements of the tiling hold the central pattern
  //The transform will be applied to these


  RegularTesselation.prototype.addTransformedPattern = function addTransformedPattern(tiling, transform) {
    for (var i = 0; i < this.p * 2; i++) {
      tiling.push(tiling[i].transform(transform));
    }
  };

  //pass the generated array of polygons (which lie on the unit disk)
  //to the drawing class for expansion, texturing and rendering


  RegularTesselation.prototype.drawTiling = function drawTiling(tiling) {
    this.disk.draw.polygonArray(tiling, this.textures);
  };

  //The tesselation requires that (p-2)(q-2) > 4 to work (otherwise it is
  //either an elliptical or euclidean tesselation);


  RegularTesselation.prototype.checkParams = function checkParams() {
    if ((this.p - 2) * (this.q - 2) <= 4) {
      console.error('Hyperbolic tesselations require that (p-2)(q-2) > 4!');
      return true;
    } else if (this.q < 3 || isNaN(this.q)) {
      console.error('Tesselation error: at least 3 p-gons must meet at each vertex!');
      return true;
    } else if (this.p < 3 || isNaN(this.p)) {
      console.error('Tesselation error: polygon needs at least 3 sides!');
      return true;
    }
    return false;
  };

  return RegularTesselation;
}();

// * ***********************************************************************
// *
// *  DRAWING CLASS
// *
// *  All operations involved in drawing to the screen occur here.
// *  All objects are assumed to be on the unit Disk when passed here and
// *  are converted to screen space (which involves multiplying
// *  by the radius ~ half screen resolution)
// *************************************************************************
//TODO refactor create materials based on passed in textures array

var Drawing = function () {
  function Drawing(radius) {
    babelHelpers.classCallCheck(this, Drawing);

    this._radius = radius || 100;
    this.init();
  }

  Drawing.prototype.init = function init() {
    this.scene = new THREE.Scene();
    this.initCamera();
    this.initRenderer();
  };

  Drawing.prototype.reset = function reset() {
    this.clearScene();
    this.pattern = null; //reset materials;
    this.setCamera();
    this.setRenderer();
  };

  Drawing.prototype.onresize = function onresize() {};

  Drawing.prototype.clearScene = function clearScene() {
    for (var i = this.scene.children.length - 1; i >= 0; i--) {
      var object = this.scene.children[i];
      if (object.type === 'Mesh') {
        object.geometry.dispose();
        object.material.dispose();
        this.scene.remove(object);
      }
    }
  };

  Drawing.prototype.initCamera = function initCamera() {
    this.camera = new THREE.OrthographicCamera();
    this.setCamera();
    this.scene.add(this.camera);
  };

  Drawing.prototype.setCamera = function setCamera() {
    this.camera.left = -window.innerWidth / 2;
    this.camera.right = window.innerWidth / 2;
    this.camera.top = window.innerHeight / 2;
    this.camera.bottom = -window.innerHeight / 2;
    this.camera.near = -2;
    this.camera.far = 1;
    this.camera.frustumCulled = false;
    this.camera.updateProjectionMatrix();
  };

  Drawing.prototype.initRenderer = function initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true
    });
    this.setRenderer();
  };

  Drawing.prototype.setRenderer = function setRenderer() {
    this.renderer.setClearColor(0xffffff, 1.0);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  Drawing.prototype.disk = function disk(centre, radius, color) {
    if (color === undefined) color = 0xffffff;
    var geometry = new THREE.CircleGeometry(radius * this.radius, 100, 0, 2 * Math.PI);
    var material = new THREE.MeshBasicMaterial({ color: color });

    var circle = new THREE.Mesh(geometry, material);
    circle.position.x = centre.x * this.radius;
    circle.position.y = centre.y * this.radius;

    this.scene.add(circle);
  };

  Drawing.prototype.polygonArray = function polygonArray(array, textureArray, color, wireframe) {
    color = color || 0xffffff;
    wireframe = wireframe || false;
    for (var i = 0; i < array.length; i++) {
      this.polygon(array[i], color, textureArray, wireframe);
    }
  };

  //Note: polygons assumed to be triangular!


  Drawing.prototype.polygon = function polygon(_polygon, color, textures, wireframe) {
    var p = 1 / _polygon.numDivisions;
    var divisions = _polygon.numDivisions;
    var geometry = new THREE.Geometry();
    geometry.faceVertexUvs[0] = [];

    for (var i = 0; i < _polygon.mesh.length; i++) {
      geometry.vertices.push(new Point(_polygon.mesh[i].x * this.radius, _polygon.mesh[i].y * this.radius));
    }

    var edgeStartingVertex = 0;
    //loop over each interior edge of the polygon's subdivion mesh
    for (var _i = 0; _i < divisions; _i++) {
      //edge divisions reduce by one for each interior edge
      var m = divisions - _i + 1;
      geometry.faces.push(new THREE.Face3(edgeStartingVertex, edgeStartingVertex + m, edgeStartingVertex + 1));

      geometry.faceVertexUvs[0].push([new Point(_i * p, 0), new Point((_i + 1) * p, 0), new Point((_i + 1) * p, p)]);

      //range m-2 because we are ignoring the edges first vertex which was
      //used in the previous faces.push
      for (var j = 0; j < m - 2; j++) {
        geometry.faces.push(new THREE.Face3(edgeStartingVertex + j + 1, edgeStartingVertex + m + j, edgeStartingVertex + m + 1 + j));
        geometry.faceVertexUvs[0].push([new Point((_i + 1 + j) * p, (1 + j) * p), new Point((_i + 1 + j) * p, j * p), new Point((_i + j + 2) * p, (j + 1) * p)]);
        geometry.faces.push(new THREE.Face3(edgeStartingVertex + j + 1, edgeStartingVertex + m + 1 + j, edgeStartingVertex + j + 2));
        geometry.faceVertexUvs[0].push([new Point((_i + 1 + j) * p, (1 + j) * p), new Point((_i + 2 + j) * p, (j + 1) * p), new Point((_i + j + 2) * p, (j + 2) * p)]);
      }
      edgeStartingVertex += m;
    }

    var mesh = this.createMesh(geometry, color, textures, _polygon.materialIndex, wireframe);
    this.scene.add(mesh);
  };

  //NOTE: some polygons are inverted due to vertex order,
  //solved this by making material doubles sided but this might cause problems with textures


  Drawing.prototype.createMesh = function createMesh(geometry, color, textures, materialIndex, wireframe) {
    if (wireframe === undefined) wireframe = false;
    if (color === undefined) color = 0xffffff;

    if (!this.pattern) {
      this.createPattern(color, textures, wireframe);
    }
    return new THREE.Mesh(geometry, this.pattern.materials[materialIndex]);
  };

  Drawing.prototype.createPattern = function createPattern(color, textures, wireframe) {
    var _this = this;

    this.pattern = new THREE.MultiMaterial();
    var texturesLoaded = [];

    var _loop = function (i) {
      var material = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: wireframe,
        side: THREE.DoubleSide
      });

      var texture = new THREE.TextureLoader().load(textures[i], function () {
        texturesLoaded.push(i);
        //call render when all textures are loaded
        if (texturesLoaded.length === textures.length) {
          _this.render();
        }
      });

      material.map = texture;
      _this.pattern.materials.push(material);
    };

    for (var i = 0; i < textures.length; i++) {
      _loop(i);
    }
  };

  Drawing.prototype.render = function render() {
    this.renderer.render(this.scene, this.camera);
    this.appendImageToDom();
    this.clearScene();
  };

  //TODO doesn't update when calling generate a second time


  Drawing.prototype.appendImageToDom = function appendImageToDom() {
    var tilingImage = document.querySelector('#tiling-image');
    tilingImage.setAttribute('src', this.renderer.domElement.toDataURL());
  };

  //Download the canvas as a png image


  Drawing.prototype.downloadImage = function downloadImage() {
    var link = document.querySelector('#download-image');
    link.href = this.renderer.domElement.toDataURL();
    link.download = 'hyperbolic-tiling.png';
  };

  //convert the canvas to a base64URL and send to saveImage.php


  Drawing.prototype.saveImage = function saveImage() {
    var data = this.renderer.domElement.toDataURL();
    var xhttp = new XMLHttpRequest();
    xhttp.open('POST', 'saveImage.php', true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send('img=' + data);
  };

  babelHelpers.createClass(Drawing, [{
    key: 'radius',
    set: function (newRadius) {
      this._radius = newRadius;
    },
    get: function () {
      return this._radius;
    }
  }]);
  return Drawing;
}();

// * ***********************************************************************
// *
// *  CONTROLLER CLASS
// *
// *************************************************************************
var Controller = function () {
  function Controller() {
    babelHelpers.classCallCheck(this, Controller);

    this.getElements();
    this.draw = new Drawing();
    this.setupControls();
    this.setupLayout();
    this.regularHyperbolicTiling();
  }

  Controller.prototype.onResize = function onResize() {
    this.setRadius();
    this.radiusSlider.setAttribute('max', this.maxRadius);
    if (this.draw.radius > this.maxRadius) this.draw.radius = this.maxRadius;
    this.centreTilingImage();
  };

  //any calls to document.querySelector() go here


  Controller.prototype.getElements = function getElements() {
    this.leftControlsDiv = document.querySelector('#left-controls');
    this.rightControlsDiv = document.querySelector('#right-controls');
    this.imageControlsDiv = document.querySelector('#image-controls');
    this.saveImageBtn = document.querySelector('#save-image');
    this.downloadImageBtn = document.querySelector('#download-image');
    this.pValueDropdown = document.querySelector('#p');
    this.qValueDropdown = document.querySelector('#q');
    this.generateTilingBtn = document.querySelector('#generate-tiling');
    this.showControlsCheckbox = document.querySelector('#show-controls');
    this.designModeCheckbox = document.querySelector('#design-mode');
    this.tilingImage = document.querySelector('#tiling-image');
    this.radiusSlider = document.querySelector('#tiling-radius');
    this.radiusValue = document.querySelector('#selected-radius');
  };

  Controller.prototype.setupControls = function setupControls() {
    this.saveImageButtons();
    this.hideControls();
    this.setupRadiusSlider();
  };

  Controller.prototype.setupLayout = function setupLayout() {};

  Controller.prototype.setTilingImageSize = function setTilingImageSize() {
    this.tilingImage.style.height = window.innerHeight + 'px';
    this.tilingImage.style.width = window.innerWidth + 'px';
  };

  Controller.prototype.tilingImagePosition = function tilingImagePosition() {
    var top = (window.innerHeight - this.tilingImage.height) / 2;
    var left = (window.innerWidth - this.tilingImage.width) / 2;
    this.tilingImage.style.top = top + 'px';
    this.tilingImage.style.left = left + 'px';
  };

  Controller.prototype.setupRadiusSlider = function setupRadiusSlider() {
    var _this = this;

    this.setRadius();
    this.radiusSlider.setAttribute('max', this.maxRadius);
    this.radiusSlider.value = this.maxRadius;
    this.radiusValue.innerHTML = this.radiusSlider.value;
    this.draw.radius = this.radiusSlider.value;
    this.radiusSlider.oninput = function () {
      _this.radiusValue.innerHTML = _this.radiusSlider.value;
      _this.draw.radius = _this.radiusSlider.value;
    };
  };

  Controller.prototype.setRadius = function setRadius() {
    this.maxRadius = window.innerWidth < window.innerHeight ? window.innerWidth / 2 - 5 : window.innerHeight / 2 - 5;
  };

  Controller.prototype.regularHyperbolicTiling = function regularHyperbolicTiling() {
    var _this2 = this;

    this.generateTilingBtn.onclick = function () {
      _this2.setTilingImageSize();
      _this2.draw.reset();
      var spec = _this2.tilingSpec();
      var regularTesselation = new RegularTesselation(spec);
      var t0 = performance.now();
      var tiling = regularTesselation.generateTiling(_this2.designModeCheckbox.checked);
      var t1 = performance.now();
      console.log('generateTiling took ' + (t1 - t0) + ' milliseconds.');
      t0 = performance.now();
      _this2.draw.polygonArray(tiling, spec.textures);
      t1 = performance.now();
      console.log('DrawTiling took ' + (t1 - t0) + ' milliseconds.');
      _this2.imageControlsDiv.classList.remove('hide');
    };
  };

  Controller.prototype.tilingSpec = function tilingSpec() {
    var spec = {
      wireframe: false,
      p: this.pValueDropdown.value,
      q: this.qValueDropdown.value,
      textures: ['./images/textures/fish-black1.png', './images/textures/fish-white1-flipped.png'],
      edgeAdjacency: [//array of length p
      [1, //edge_0 orientation (-1 = reflection, 1 = rotation)
      5], //edge_0 adjacency (range p - 1)
      [1, 4], //edge_1 orientation, adjacency
      [1, 3], [1, 2], [1, 1], [1, 0]],
      minPolygonSize: 0.05
    };
    return spec;
  };

  Controller.prototype.saveImageButtons = function saveImageButtons() {
    var _this3 = this;

    this.saveImageBtn.onclick = function () {
      return _this3.draw.saveImage();
    };
    this.downloadImageBtn.onclick = function () {
      return _this3.draw.downloadImage();
    };
  };

  Controller.prototype.hideControls = function hideControls() {
    var _this4 = this;

    this.showControlsCheckbox.onclick = function () {
      _this4.leftControlsDiv.classList.toggle('hide');
    };
  };

  return Controller;
}();

// * ***********************************************************************
// *
// *   POLYFILLS
// *
// *************************************************************************

Math.sinh = Math.sinh || function sinh(x) {
  var y = Math.exp(x);
  return (y - 1 / y) / 2;
};

Math.cosh = Math.cosh || function cosh(x) {
  var y = Math.exp(x);
  return (y + 1 / y) / 2;
};

Math.cot = Math.cot || function cot(x) {
  return 1 / Math.tan(x);
};

// * ***********************************************************************
// *
// *   SETUP
// *
// *************************************************************************

var controller = new Controller();

window.onload = function () {
  //console.log('obj');
};

window.onresize = function () {
  controller.onResize();
};