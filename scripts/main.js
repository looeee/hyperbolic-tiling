var babelHelpers = {};

babelHelpers.classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

babelHelpers;

// * ***********************************************************************
// *
// *   EUCLIDEAN FUNCTIONS
// *   a place to stash all the functions that are euclidean geometrical
// *   operations
// *   All functions are 2D unless otherwise specified!
// *
// *************************************************************************

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

  if (toFixed(test) == 0) return true;else return false;
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

//find the point at a distance from point1 along line defined by point1, point2,
//in the direction of point2
var directedSpacedPointOnLine = function (point1, point2, spacing) {
  var dv = normalVector(point1, point2);
  return new Point(point1.x + spacing * dv.x, point1.y + spacing * dv.y);
};

//.toFixed returns a string for some no doubt very good reason.
//apply to fixed with default value of 10 and return as a float
var toFixed = function (number) {
  var places = arguments.length <= 1 || arguments[1] === undefined ? 10 : arguments[1];
  return parseFloat(number.toFixed(places));
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

//calculate the normal vector given 2 points
var normalVector = function (p1, p2) {
  var d = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  return new Point((p2.x - p1.x) / d, (p2.y - p1.y) / d);
};

/* OLD/UNUSED FUNCTIONS
//find the two points a distance from a point on the circumference of a circle
export const spacedPointOnArc = (circle, point, spacing) => {
  const cosTheta = -((spacing * spacing) / (2 * circle.radius * circle.radius) - 1);
  const sinThetaPos = Math.sqrt(1 - Math.pow(cosTheta, 2));
  const sinThetaNeg = -sinThetaPos;

  const xPos = circle.centre.x + cosTheta * (point.x - circle.centre.x) - sinThetaPos * (point.y - circle.centre.y);
  const xNeg = circle.centre.x + cosTheta * (point.x - circle.centre.x) - sinThetaNeg * (point.y - circle.centre.y);
  const yPos = circle.centre.y + sinThetaPos * (point.x - circle.centre.x) + cosTheta * (point.y - circle.centre.y);
  const yNeg = circle.centre.y + sinThetaNeg * (point.x - circle.centre.x) + cosTheta * (point.y - circle.centre.y);

  return {
    p1: new Point(xPos, yPos),
    p2: new Point(xNeg, yNeg)
  }
}

//find the two points at a spacing from point1 along line defined by point1, point2
export const spacedPointOnLine = (point1, point2, spacing) => {
  const circle = new Circle(point1.x, point1.y, spacing);
  return points = circleLineIntersect(circle, point1, point2);
}


//slope of line through p1, p2
export const slope = (p1, p2) => (p2.x - p1.x) / (p2.y - p1.y);

//intersection of two circles with equations:
//(x-a)^2 +(y-a)^2 = r0^2
//(x-b)^2 +(y-c)^2 = r1^2
//NOTE assumes the two circles DO intersect!
export const circleIntersect = (circle0, circle1) => {
  const a = circle0.centre.x;
  const b = circle0.centre.y;
  const c = circle1.centre.x;
  const d = circle1.centre.y;
  const r0 = circle0.radius;
  const r1 = circle1.radius;

  const dist = Math.sqrt((c - a) * (c - a) + (d - b) * (d - b));

  const del = Math.sqrt((dist + r0 + r1) * (dist + r0 - r1) * (dist - r0 + r1) * (-dist + r0 + r1)) / 4;

  const xPartial = (a + c) / 2 + ((c - a) * (r0 * r0 - r1 * r1)) / (2 * dist * dist);
  const x1 = xPartial - 2 * del * (b - d) / (dist * dist);
  const x2 = xPartial + 2 * del * (b - d) / (dist * dist);

  const yPartial = (b + d) / 2 + ((d - b) * (r0 * r0 - r1 * r1)) / (2 * dist * dist);
  const y1 = yPartial + 2 * del * (a - c) / (dist * dist);
  const y2 = yPartial - 2 * del * (a - c) / (dist * dist);

  const p1 = new Point(x1, y1);

  const p2 = new Point(x2, y2);

  return {
    p1: p1,
    p2: p2
  };
}

//reflect p3 across the line defined by p1,p2
export const lineReflection = (p1, p2, p3) => {
  const m = slope(p1, p2);
  //reflection in y axis
  if (m > 999999 || m < -999999) {
    return new Point( p3.x, -p3.y);
  }
  //reflection in x axis
  else if ( toFixed(m) == 0) {
    return new Point( -p3.x, p3.y);
  }
  //reflection in arbitrary line
  else {
    const c = p1.y - m * p1.x;
    const d = (p3.x + (p3.y - c) * m) / (1 + m * m);
    const x = 2 * d - p3.x;
    const y = 2 * d * m - p3.y + 2 * c;
    return new Point(x,y);
  }
}

//intersection point of two lines defined by p1,m1 and q1,m2
export const intersection = (p1, m1, p2, m2) => {
  let c1, c2, x, y;
  if ( toFixed(p1.y) == 0) {
    x = p1.x;
    y = (m2) * (p1.x - p2.x) + p2.y;
  }
  else if ( toFixed(p2.y) == 0) {
    x = p2.x;
    y = (m1 * (p2.x - p1.x)) + p1.y;
  } else {
    //y intercept of first line
    c1 = p1.y - m1 * p1.x;
    //y intercept of second line
    c2 = p2.y - m2 * p2.x;

    x = (c2 - c1) / (m1 - m2);
    y = m1 * x + c1;
  }

  return new Point(x, y);
}

//get the circle inverse of a point p with respect a circle radius r centre c
export const inverse = (point, circle) => {
  const c = circle.centre;
  const r = circle.radius;
  const alpha = (r * r) / (Math.pow(point.x - c.x, 2) + Math.pow(point.y - c.y, 2));
  return new Point(alpha * (point.x - c.x) + c.x, alpha * (point.y - c.y) + c.y);
}

//angle in radians between two points on circle of radius r
export const centralAngle = (p1, p2, r) => {
  //round off error can result in this being very slightly greater than 1
  let temp = (0.5 * distance(p1, p2) / r);
  temp = toFixed(temp);
  let res = 2 * Math.asin(temp);
  if(isNaN(res)) res = 0;
  return res;
}

export const radians = (degrees) =>  (Math.PI / 180) * degrees;

//NOTE: now using Dunhams method to calculate arcs
//calculate the radius and centre of the circle required to draw a line between
//two points in the hyperbolic plane defined by the disk (r, c)
export const greatCircle = (p1, p2, circle) => {
  const p1Inverse = inverse(p1, circle);
  const p2Inverse = inverse(p2, circle);

  const m = midpoint(p1, p1Inverse);
  const n = midpoint(p2, p2Inverse);

  const m1 = perpendicularSlope(m, p1Inverse);
  const m2 = perpendicularSlope(n, p2Inverse);


  //centre is the centrepoint of the circle out of which the arc is made
  const centre = intersection(m, m1, n, m2);
  const radius = distance(centre, p1);

  return new Circle(centre.x, centre.y, radius);
}

//slope of line perpendicular to a line defined by p1,p2
export const perpendicularSlope = (p1, p2) => {
  return -1 / (Math.pow(slope(p1, p2), -1));
}
*/

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
    if (a && b) return true;else return false;
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

  Arc.prototype.hyperboloidCrossProduct = function hyperboloidCrossProduct(point3D_1, point3D_2) {
    return {
      x: point3D_1.y * point3D_2.z - point3D_1.z * point3D_2.y,
      y: point3D_1.z * point3D_2.x - point3D_1.x * point3D_2.z,
      z: -point3D_1.x * point3D_2.y + point3D_1.y * point3D_2.x
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
    /*
    this.addExpandedVertices( radius );
    this.addExpandedEdges();
    this.findExpandedSubdivisionEdge();
    this.subdivideExpandedMesh();
    */
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
// *  THREE JS CLASS
// *
// *  All operations involved in drawing to the screen occur here.
// *  All objects are assumed to be on the unit Disk when passed here and
// *  are converted to screen space (which involves multiplying
// *  by the radius ~ half screen resolution)
// *************************************************************************
//TODO refactor create materials based on passed in textures array

var ThreeJS = function () {
  function ThreeJS() {
    babelHelpers.classCallCheck(this, ThreeJS);

    this.init();
  }

  ThreeJS.prototype.init = function init() {
    this.radius = window.innerWidth < window.innerHeight ? window.innerWidth / 2 - 5 : window.innerHeight / 2 - 5;
    this.radiusSetByWidth = window.innerWidth < window.innerHeight ? true : false;
    if (this.scene === undefined) this.scene = new THREE.Scene();
    this.initCamera();
    this.initRenderer();
  };

  ThreeJS.prototype.reset = function reset() {
    cancelAnimationFrame(this.id);
    this.clearScene();
    this.projector = null;
    this.camera = null;
    this.init();
  };

  //TODO: sometimes messes up ratio

  ThreeJS.prototype.resize = function resize() {
    var w = window.innerWidth / 2 - 5;
    var h = window.innerHeight / 2 - 5;
    if (this.radiusSetByWidth && w < h) {
      this.radius = w;
    } else if (!w < h) {
      this.radius = h;
    }

    /*
    this.camera.aspect = this.radius * -1,
                    this.radius ,
                    this.radius ,
                    this.radius * -1,
                    -2,
                    1;
    */
    //this.camera.updateProjectionMatrix();
    this.renderer.setSize((this.radius + 5) * 2, (this.radius + 5) * 2);
  };

  ThreeJS.prototype.clearScene = function clearScene() {
    for (var i = this.scene.children.length - 1; i >= 0; i--) {
      this.scene.remove(this.scene.children[i]);
    }
  };

  ThreeJS.prototype.initCamera = function initCamera() {
    this.camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -2, 1);
    this.camera.frustumCulled = false;
    this.scene.add(this.camera);
  };

  ThreeJS.prototype.initRenderer = function initRenderer() {
    if (this.renderer === undefined) {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        preserveDrawingBuffer: true
      });
      this.renderer.setClearColor(0xffffff, 1.0);
      //document.body.appendChild(this.renderer.domElement);
    }
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  };

  ThreeJS.prototype.disk = function disk(centre, radius, color) {
    if (color === undefined) color = 0xffffff;
    var geometry = new THREE.CircleGeometry(radius * this.radius, 100, 0, 2 * Math.PI);
    var material = new THREE.MeshBasicMaterial({ color: color });

    var circle = new THREE.Mesh(geometry, material);
    circle.position.x = centre.x * this.radius;
    circle.position.y = centre.y * this.radius;

    this.scene.add(circle);
  };

  ThreeJS.prototype.polygonArray = function polygonArray(array, textureArray, color, wireframe) {
    color = color || 0xffffff;
    wireframe = wireframe || false;

    for (var i = 0; i < array.length; i++) {
      this.polygon(array[i], color, textureArray, wireframe);
    }
  };

  //Note: polygons assumed to be triangular!

  ThreeJS.prototype.polygon = function polygon(_polygon, color, texture, wireframe) {
    var p = 1 / _polygon.numDivisions;
    var divisions = _polygon.numDivisions;
    var geometry = new THREE.Geometry();
    geometry.faceVertexUvs[0] = [];

    for (var i = 0; i < _polygon.mesh.length; i++) {
      geometry.vertices.push(new Point(_polygon.mesh[i].x * radius, _polygon.mesh[i].y * this.radius));
    }

    //const radius = this.radius;
    //geometry.vertices = polygon.expandedMesh;
    //console.log(geometry.vertices, polygon.expandedMesh);
    //geometry.vertices = polygon.expandedSubdivisionMesh();

    var edgeStartingVertex = 0;
    //loop over each interior edge of the polygon's subdivion mesh
    for (var i = 0; i < divisions; i++) {
      //edge divisions reduce by one for each interior edge
      var m = divisions - i + 1;
      geometry.faces.push(new THREE.Face3(edgeStartingVertex, edgeStartingVertex + m, edgeStartingVertex + 1));

      geometry.faceVertexUvs[0].push([new Point(i * p, 0), new Point((i + 1) * p, 0), new Point((i + 1) * p, p)]);

      //range m-2 because we are ignoring the edges first vertex which was used in the previous faces.push
      for (var j = 0; j < m - 2; j++) {
        geometry.faces.push(new THREE.Face3(edgeStartingVertex + j + 1, edgeStartingVertex + m + j, edgeStartingVertex + m + 1 + j));
        geometry.faceVertexUvs[0].push([new Point((i + 1 + j) * p, (1 + j) * p), new Point((i + 1 + j) * p, j * p), new Point((i + j + 2) * p, (j + 1) * p)]);
        geometry.faces.push(new THREE.Face3(edgeStartingVertex + j + 1, edgeStartingVertex + m + 1 + j, edgeStartingVertex + j + 2));
        geometry.faceVertexUvs[0].push([new Point((i + 1 + j) * p, (1 + j) * p), new Point((i + 2 + j) * p, (j + 1) * p), new Point((i + j + 2) * p, (j + 2) * p)]);
      }
      edgeStartingVertex += m;
    }

    var mesh = this.createMesh(geometry, color, texture, _polygon.materialIndex, wireframe);
    this.scene.add(mesh);
  };

  //NOTE: some polygons are inverted due to vertex order,
  //solved this by making material doubles sided but this might cause problems with textures

  ThreeJS.prototype.createMesh = function createMesh(geometry, color, textures, materialIndex, wireframe) {
    if (wireframe === undefined) wireframe = false;
    if (color === undefined) color = 0xffffff;

    if (!this.pattern) {
      this.createPattern(color, textures, wireframe);
    }
    return new THREE.Mesh(geometry, this.pattern.materials[materialIndex]);
  };

  ThreeJS.prototype.createPattern = function createPattern(color, textures, wireframe) {
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

  ThreeJS.prototype.render = function render() {
    this.renderer.render(this.scene, this.camera);
    this.appendImageToDom();
    this.clearScene();
  };

  //TODO doesn't update when calling generate a second time

  ThreeJS.prototype.appendImageToDom = function appendImageToDom() {
    var imageElem = document.querySelector('#tiling-image');
    imageElem.style.height = window.innerHeight + 'px';
    imageElem.style.width = window.innerWidth + 'px';
    imageElem.setAttribute('src', this.renderer.domElement.toDataURL());
  };

  //Download the canvas as a png image

  ThreeJS.prototype.downloadImage = function downloadImage() {
    var link = document.querySelector('#download-image');
    link.href = this.renderer.domElement.toDataURL();
    link.download = 'hyperbolic-tiling.png';
  };

  //convert the canvas to a base64URL and send to saveImage.php

  ThreeJS.prototype.saveImage = function saveImage() {
    var data = this.renderer.domElement.toDataURL();
    var xhttp = new XMLHttpRequest();
    xhttp.open('POST', 'saveImage.php', true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send('img=' + data);
  };

  return ThreeJS;
}();

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
  };

  Parameters.prototype.pSkip = function pSkip(exposure) {
    if (exposure === this.minExposure) {
      if (this.q !== 3) return 1;else return 3;
    } else if (exposure === this.maxExposure) {
      if (this.p === 3) return 1;else if (this.q === 3) return 2;else return 0;
    } else {
      console.error('pSkip: wrong exposure value!');
      return false;
    }
  };

  Parameters.prototype.qSkip = function qSkip(exposure, vertexNum) {
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
  };

  Parameters.prototype.verticesToDo = function verticesToDo(exposure) {
    if (this.p === 3) return 1;else if (exposure === this.minExposure) {
      if (this.q === 3) return this.p - 5;else return this.p - 3;
    } else if (exposure === this.maxExposure) {
      if (this.q === 3) return this.p - 4;else return this.p - 2;
    } else {
      console.error('verticesToDo: wrong exposure value!');
      return false;
    }
  };

  Parameters.prototype.pgonsToDo = function pgonsToDo(exposure, vertexNum) {
    if (this.q === 3) return 1;else if (vertexNum === 0) return this.q - 3;else if (exposure === this.minExposure) {
      if (this.p === 3) return this.q - 4;else return this.q - 2;
    } else if (exposure === this.maxExposure) {
      if (this.p === 3) return this.q - 3;else return this.q - 2;
    } else {
      console.error('pgonsToDo: wrong exposure value!');
      return false;
    }
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
// *      minPolygonSize: stop at polygons below this size
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

    //this.disk = new Disk();
    this.params = new Parameters(this.p, this.q);
    this.transforms = new Transformations(this.p, this.q);

    if (this.checkParams()) {
      return false;
    }
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
    var tiling = this.buildCentralPattern();

    for (var i = 0; i < this.p; i++) {
      var qTransform = this.transforms.edgeTransforms[i];
      for (var j = 0; j < this.q - 2; j++) {
        if (this.p === 3 && this.q - 3 === j) {
          this.addTransformedPattern(tiling, qTransform);
        } else {
          this.layerRecursion(this.params.exposure(0, i, j), 1, qTransform, tiling);
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
    this.addTransformedPattern(tiling, transform);
    //stop if the current pattern has reached the minimum size
    //TODO two step method for ending recursion using warning flag
    if (tiling[tiling.length - 1].edges[0].arc.arcLength < this.minPolygonSize) {
      return;
    }

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

  RegularTesselation.prototype.drawTiling = function drawTiling(tiling) {
    this.disk.draw.polygonArray(tiling, this.textures);
    //for (let i = 0; i < tiling.length; i++) {
    //  this.disk.drawPolygon(tiling[i], 0xffffff, this.textures, this.wireframe);
    //}
  };

  //The tesselation requires that (p-2)(q-2) > 4 to work (otherwise it is
  //either an elliptical or euclidean tesselation);

  RegularTesselation.prototype.checkParams = function checkParams() {
    if ((this.p - 2) * (this.q - 2) <= 4) {
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
  };

  return RegularTesselation;
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
    this.setupControls();
    this.draw = new ThreeJS();
    this.regularHyperbolicTiling();
  }

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
    this.imageElem = document.querySelector('#tiling-image');
    this.radiusSlider = document.querySelector('#tiling-radius');
    this.radiusValue = document.querySelector('#selected-radius');
  };

  Controller.prototype.setupControls = function setupControls() {
    this.saveImageButtons();
    this.hideControls();
    this.setupRadiusSlider();
  };

  Controller.prototype.setupRadiusSlider = function setupRadiusSlider() {
    var _this = this;

    var maxRadius = window.innerWidth < window.innerHeight ? window.innerWidth / 2 - 5 : window.innerHeight / 2 - 5;
    this.radiusSlider.setAttribute('max', maxRadius);
    this.radiusValue.innerHTML = this.radiusSlider.value;
    this.radiusSlider.oninput = function () {
      _this.radiusValue.innerHTML = _this.radiusSlider.value;
    };
  };

  Controller.prototype.regularHyperbolicTiling = function regularHyperbolicTiling() {
    var _this2 = this;

    this.generateTilingBtn.onclick = function () {
      var spec = _this2.tilingSpec();
      var regularTesselation = new RegularTesselation(spec);

      var t0 = performance.now();
      var tiling = regularTesselation.generateTiling();
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
      5 //edge_0 adjacency (range p - 1)
      ], [1, 4], //edge_1 orientation, adjacency
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

//Global radius
window.radius = window.innerWidth < window.innerHeight ? window.innerWidth / 2 - 5 : window.innerHeight / 2 - 5;

var controller = new Controller();

//window.onload = () => {}

//window.onresize = () => {}