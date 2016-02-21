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
// *   EUCLIDEAN FUNCTIONS
// *   a place to stash all the functions that are euclidean geometrical
// *   operations
// *   All functions are 2D unless otherwise specified!
// *
// *************************************************************************

//distance between two points
var distance = function distance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

//does the line connecting p1, p2 go through the point (0,0)?
//needs to take into account roundoff errors so returns true if
//test is close to 0
var throughOrigin = function throughOrigin(p1, p2) {
  if (toFixed(p1.x) == 0 && toFixed(p2.x) === 0) {
    //vertical line through centre
    return true;
  }
  var test = (-p1.x * p2.y + p1.x * p1.y) / (p2.x - p1.x) + p1.y;

  if (toFixed(test) == 0) return true;else return false;
};

var circleLineIntersect = function circleLineIntersect(circle, p1, p2) {
  var cx = circle.centre.x;
  var cy = circle.centre.y;
  var r = circle.radius;

  var d = distance(p1, p2);
  //unit vector p1 p2
  var dx = (p2.x - p1.x) / d;
  var dy = (p2.y - p1.y) / d;

  //point on line closest to circle centre
  var t = dx * (cx - p1.x) + dy * (cy - p1.y);
  var p = new Point(t * dx + p1.x, t * dy + p1.y);

  //distance from this point to centre
  var d2 = distance(p, circle.centre);

  //line intersects circle at 2 points
  if (d2 < r) {
    var dt = Math.sqrt(r * r - d2 * d2);
    //point 1
    var q1 = new Point((t - dt) * dx + p1.x, (t - dt) * dy + p1.y);
    //point 2
    var q2 = new Point((t + dt) * dx + p1.x, (t + dt) * dy + p1.y);

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

//find the two points a distance from a point on the circumference of a circle
var spacedPointOnArc = function spacedPointOnArc(circle, point, distance) {
  var cosTheta = -(distance * distance / (2 * circle.radius * circle.radius) - 1);
  var sinThetaPos = Math.sqrt(1 - Math.pow(cosTheta, 2));
  var sinThetaNeg = -sinThetaPos;

  var xPos = circle.centre.x + cosTheta * (point.x - circle.centre.x) - sinThetaPos * (point.y - circle.centre.y);
  var xNeg = circle.centre.x + cosTheta * (point.x - circle.centre.x) - sinThetaNeg * (point.y - circle.centre.y);
  var yPos = circle.centre.y + sinThetaPos * (point.x - circle.centre.x) + cosTheta * (point.y - circle.centre.y);
  var yNeg = circle.centre.y + sinThetaNeg * (point.x - circle.centre.x) + cosTheta * (point.y - circle.centre.y);

  return {
    p1: new Point(xPos, yPos),
    p2: new Point(xNeg, yNeg)
  };
};

//find the two points at a distance from point1 along line defined by point1, point2
var spacedPointOnLine = function spacedPointOnLine(point1, point2, distance) {
  var circle = new Circle(point1.x, point1.y, distance);
  return points = circleLineIntersect(circle, point1, point2);
};

var randomInt = function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

//.toFixed returns a string for some no doubt very good reason.
//Change it back to a float
var toFixed = function toFixed(number, places) {
  //default to twelve as this seems to be the point after which fp errors arise
  places = places || 10;
  return parseFloat(number.toFixed(places));
};

//are the angles alpha, beta in clockwise order on unit disk?
var clockwise = function clockwise(alpha, beta) {
  var cw = true;
  var a = beta > 3 * Math.PI / 2 && alpha < Math.PI / 2;
  var b = beta - alpha > Math.PI;
  var c = alpha > beta && !(alpha - beta > Math.PI);
  if (a || b || c) {
    cw = false;
  }
  return cw;
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

/*
//slope of line through p1, p2
export const slope = (p1, p2) => {
  return (p2.x - p1.x) / (p2.y - p1.y);
}

//midpoint of the line segment connecting two points
export const midpoint = (p1, p2) => {
  return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
}

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

//calculate the normal vector given 2 points
export const normalVector = (p1, p2) => {
  let d = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  return new Point((p2.x - p1.x) / d,(p2.y - p1.y) / d);
}

export const radians = (degrees) => {
  return (Math.PI / 180) * degrees;
}

//NOTE: rotations are now done using transforms
export const rotatePointAboutOrigin = (point2D, angle) => {
  return new Point(Math.cos(angle) * point2D.x - Math.sin(angle) * point2D.y,
    Math.sin(angle) * point2D.x + Math.cos(angle) * point2D.y);
}

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
// *   2D point class
// *
// *************************************************************************

var Point = function () {
  function Point(x, y) {
    babelHelpers.classCallCheck(this, Point);

    if (toFixed(x) == 0) {
      x = 0;
    }
    if (toFixed(y) == 0) {
      y = 0;
    }
    this.x = x;
    this.y = y;

    //start with z = 0; this will used to transform to/from Weierstrass form
    this.z = 0;
  }

  babelHelpers.createClass(Point, [{
    key: 'toFixed',
    value: function toFixed$$(places) {
      this.x = toFixed(this.x, places);
      this.y = toFixed(this.y, places);
    }

    //compare two points taking rounding errors into account

  }, {
    key: 'compare',
    value: function compare(p2) {
      if (typeof p2 === 'undefined') {
        console.warn('Warning: point not defined.');
        return false;
      }
      var t1 = this.toFixed(12);
      var t2 = p2.toFixed(12);

      if (this.p1.x === p2.x && this.p1.y === p2.y) return true;else return false;
    }
  }, {
    key: 'transform',
    value: function transform(_transform) {
      var mat = _transform.matrix;
      var p = this.poincareToWeierstrass();

      var x = p.x * mat[0][0] + p.y * mat[0][1] + p.z * mat[0][2];
      var y = p.x * mat[1][0] + p.y * mat[1][1] + p.z * mat[1][2];
      var z = p.x * mat[2][0] + p.y * mat[2][1] + p.z * mat[2][2];
      var q = new Point(x, y);
      q.z = z;
      return q.weierstrassToPoincare();
    }
  }, {
    key: 'poincareToWeierstrass',
    value: function poincareToWeierstrass() {
      var factor = 1 / (1 - this.x * this.x - this.y * this.y);
      var x = 2 * factor * this.x;
      var y = 2 * factor * this.y;
      var z = factor * (1 + this.x * this.x + this.y * this.y);
      var p = new Point(x, y);
      p.z = z;
      return p;
    }
  }, {
    key: 'weierstrassToPoincare',
    value: function weierstrassToPoincare() {
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
  }]);
  return Point;
}();

var Circle = function Circle(centreX, centreY, radius) {
  babelHelpers.classCallCheck(this, Circle);

  if (toFixed(radius) == 0) {
    radius = 0;
  }
  this.centre = new Point(centreX, centreY);
  this.radius = radius;
};

// * ***********************************************************************
// *
// *   ARC CLASS
// *
// *************************************************************************

var Arc = function () {
  function Arc(p1, p2) {
    babelHelpers.classCallCheck(this, Arc);

    this.p1 = p1;
    this.p2 = p2;

    if (throughOrigin(p1, p2)) {
      this.circle = new Circle(0, 0, 1);
      this.startAngle = 0;
      this.endAngle = 0;
      this.clockwise = false;
      this.straightLine = true;
    } else {
      this.hyperbolicMethod();
    }
  }

  //Calculate the arc using Dunham's method

  babelHelpers.createClass(Arc, [{
    key: 'hyperbolicMethod',
    value: function hyperbolicMethod() {
      //calculate centre of arcCircle relative to unit disk
      var wq1 = this.p1.poincareToWeierstrass();
      var wq2 = this.p2.poincareToWeierstrass();
      var wcp = this.weierstrassCrossProduct(wq1, wq2);
      var arcCentre = new Point(wcp.x / wcp.z, wcp.y / wcp.z, true);

      var r = Math.sqrt(Math.pow(this.p1.x - arcCentre.x, 2) + Math.pow(this.p1.y - arcCentre.y, 2));

      var arcCircle = new Circle(arcCentre.x, arcCentre.y, r, true);

      //translate points to origin and calculate arctan
      var alpha = Math.atan2(this.p1.y - arcCentre.y, this.p1.x - arcCentre.x);
      var beta = Math.atan2(this.p2.y - arcCentre.y, this.p2.x - arcCentre.x);

      //angles are in (-pi, pi), transform to (0,2pi)
      alpha = alpha < 0 ? 2 * Math.PI + alpha : alpha;
      beta = beta < 0 ? 2 * Math.PI + beta : beta;

      //check whether points are in clockwise order and assign angles accordingly
      var cw = clockwise(alpha, beta);
      if (cw) {
        this.startAngle = alpha;
        this.endAngle = beta;
      } else {
        this.startAngle = beta;
        this.endAngle = alpha;
      }

      this.circle = arcCircle;
      this.clockwise = cw;
      this.straightLine = false;
    }
  }, {
    key: 'weierstrassCrossProduct',
    value: function weierstrassCrossProduct(point3D_1, point3D_2) {
      var r = {
        x: point3D_1.y * point3D_2.z - point3D_1.z * point3D_2.y,
        y: point3D_1.z * point3D_2.x - point3D_1.x * point3D_2.z,
        z: -point3D_1.x * point3D_2.y + point3D_1.y * point3D_2.x
      };
      return r;
    }
  }]);
  return Arc;
}();

// * ***********************************************************************
// *
// *   EDGE CLASS
// *   Represents a polygon edge
// *
// *************************************************************************
//TODO: startpoint and endpoint duplicate arc.p1, arc.p2

var Edge = function () {
  function Edge(v1, v2) {
    babelHelpers.classCallCheck(this, Edge);

    this.arc = new Arc(v1, v2);
    this.startPoint = v1;
    this.endPoint = v2;

    this.points = [];
    this.spacedPoints();
  }

  babelHelpers.createClass(Edge, [{
    key: 'spacedPoints',
    value: function spacedPoints() {
      var spacing = .05;

      //push the first vertex
      this.points.push(this.startPoint);

      //tiny pgons near the edges of the disk don't need to be subdivided
      if (distance(this.startPoint, this.endPoint) > spacing) {
        var p = undefined;
        //line not through the origin (hyperbolic arc)
        if (!this.arc.straightLine) {
          if (this.arc.clockwise) p = spacedPointOnArc(this.arc.circle, this.startPoint, spacing).p1;else p = spacedPointOnArc(this.arc.circle, this.startPoint, spacing).p2;

          this.points.push(p);

          while (distance(p, this.endPoint) > spacing) {
            if (this.arc.clockwise) p = spacedPointOnArc(this.arc.circle, p, spacing).p1;else p = spacedPointOnArc(this.arc.circle, p, spacing).p2;
            this.points.push(p);
          }
        }

        //line through origin (straight line)
        else {
            p = spacedPointOnLine(this.startPoint, this.endPoint, spacing).p2;
            this.points.push(p);
            while (distance(p, this.endPoint) > spacing) {
              p = spacedPointOnLine(p, this.startPoint, spacing).p1;
              this.points.push(p);
            }
          }
      }
      this.points.push(this.endPoint);

      return this.points;
    }
  }]);
  return Edge;
}();

// * ***********************************************************************
// *
// *   POLYGON CLASS
// *
// *************************************************************************
//NOTE: sometimes polygons will be backwards facing. Currently I have solved this by
//making material DoubleSide but if this causes problems I'll have to add some
//way of making sure the vertices are in the right winding order
//@param vertices: array of Points
//@param circle: Circle representing current Poincare Disk dimensions

var Polygon = function () {
  function Polygon(vertices) {
    babelHelpers.classCallCheck(this, Polygon);

    this.vertices = vertices;
    this.centre = this.barycentre();
    this.edges = [];
    this.addEdges();
  }

  babelHelpers.createClass(Polygon, [{
    key: 'addEdges',
    value: function addEdges() {
      for (var i = 0; i < this.vertices.length; i++) {
        this.edges.push(new Edge(this.vertices[i], this.vertices[(i + 1) % this.vertices.length]));
      }
    }

    //Apply a Transform to the polygon

  }, {
    key: 'transform',
    value: function transform(_transform2) {
      var newVertices = [];
      for (var i = 0; i < this.vertices.length; i++) {
        newVertices.push(this.vertices[i].transform(_transform2));
      }
      return new Polygon(newVertices);
    }

    //find the barycentre of a non-self-intersecting polygon

  }, {
    key: 'barycentre',
    value: function barycentre() {
      var l = this.vertices.length;
      var first = this.vertices[0];
      var last = this.vertices[l - 1];

      var twicearea = 0,
          x = 0,
          y = 0,
          p1 = undefined,
          p2 = undefined,
          f = undefined;
      for (var i = 0, j = l - 1; i < l; j = i++) {
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
  }]);
  return Polygon;
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
// *  orientation: reflection = -1 OR rotation = 1
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

  babelHelpers.createClass(Transformations, [{
    key: 'initHypotenuseReflection',
    value: function initHypotenuseReflection() {
      this.hypReflection = new Transform(identityMatrix(3), -1);
      this.hypReflection.matrix[0][0] = Math.cos(2 * Math.PI / this.p);
      this.hypReflection.matrix[0][1] = Math.sin(2 * Math.PI / this.p);
      this.hypReflection.matrix[1][0] = Math.sin(2 * Math.PI / this.p);
      this.hypReflection.matrix[1][1] = -Math.cos(2 * Math.PI / this.p);
    }
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
  }, {
    key: 'initEdgeTransforms',
    value: function initEdgeTransforms() {
      this.edgeTransforms = [];

      for (var i = 0; i < this.p; i++) {
        var adj = this.edges[i].adjacentEdge;
        //Case 1: reflection
        if (this.edges[i].orientation === -1) {
          var mat = multiplyMatrices(this.rotatePolygonCW[i], this.edgeReflection);
          mat = multiplyMatrices(mat, this.rotatePolygonCCW[adj]);
          this.edgeTransforms[i] = new Transform(mat);
        }
        //Case 2: rotation
        else if (this.edges[i].orientation === 1) {
            var mat = multiplyMatrices(this.rotatePolygonCW[i].matrix, this.rot2);
            mat = multiplyMatrices(mat, this.rotatePolygonCCW[adj].matrix);
            this.edgeTransforms[i] = new Transform(mat);
          } else {
            console.error('Error: invalid orientation value');
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
      if (exposure === this.minExposure) {
        if (this.p === 3) return 1;else if (this.q === 3) return this.p - 5;else return this.p - 3;
      } else if (exposure === this.maxExposure) {
        if (this.p === 3) return 1;else if (this.q === 3) return this.p - 4;else return this.p - 2;
      } else {
        console.error('verticesToDo: wrong exposure value!');
        return false;
      }
    }
  }, {
    key: 'pgonsToDo',
    value: function pgonsToDo(exposure, vertexNum) {
      if (exposure === this.minExposure) {
        if (vertexNum === 0) {
          if (this.p === 3) return this.q - 4;else if (this.q === 3) return 1;else return this.q - 3;
        } else {
          if (this.p === 3) return this.q - 4;else if (this.q === 3) return 1;else return this.q - 2;
        }
      } else if (exposure === this.maxExposure) {
        if (vertexNum === 0) {
          if (this.p === 3) return this.q - 3;else if (this.q === 3) return 1;else return this.q - 3;
        } else {
          if (this.p === 3) return this.q - 3;else if (this.q === 3) return 1;else return this.q - 2;
        }
      } else {
        console.error('pgonsToDo: wrong exposure value!');
        return false;
      }
    }
  }]);
  return Parameters;
}();

// * ***********************************************************************
// *
// *  THREE JS CLASS
// *
// *  All operations involved in drawing to the screen occur here.
// *  All objects are assumed to be on the unit Disk when passed here and
// *  are converted to screen space (which will generally invole multiplying
// *  by the radius ~ half screen resolution)
// *************************************************************************
//TODO: after resizing a few times the scene stops drawing - possible memory
//not being freed in clearScene?
//TODO add functions to save image to disk/screen for download

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

      this.initLighting();

      this.initRenderer();
    }
  }, {
    key: 'reset',
    value: function reset() {
      cancelAnimationFrame(this.id); // Stop the animation
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
    key: 'initLighting',
    value: function initLighting() {
      var ambientLight = new THREE.AmbientLight(0xffffff);
      this.scene.add(ambientLight);
    }
  }, {
    key: 'initRenderer',
    value: function initRenderer() {
      if (this.renderer === undefined) {
        this.renderer = new THREE.WebGLRenderer({
          antialias: true,
          preserveDrawingBuffer: true
        });
        this.renderer.setClearColor(0xffffff, 1.0);
        document.body.appendChild(this.renderer.domElement);
      }

      this.renderer.setSize(window.innerWidth, window.innerHeight);

      this.render();
    }
  }, {
    key: 'disk',
    value: function disk(centre, radius, color) {
      if (color === undefined) color = 0xffffff;

      var geometry = new THREE.CircleGeometry(radius * this.radius, 100, 0, 2 * Math.PI);
      var circle = this.createMesh(geometry, color);
      circle.position.x = centre.x * this.radius;
      circle.position.y = centre.y * this.radius;

      this.scene.add(circle);
    }

    //Note: polygons assumed to be triangular!

  }, {
    key: 'polygon',
    value: function polygon(_polygon, color, texture, wireframe) {
      if (color === undefined) color = 0xffffff;
      //the incentre of the triangle (0,0), (1,0), (1,1) used for uvs
      var incentre = new THREE.Vector2(1 / Math.sqrt(2), 1 - 1 / Math.sqrt(2));

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

      var mesh = this.createMesh(geometry, color, texture, wireframe);
      this.scene.add(mesh);
    }
  }, {
    key: 'setUvs',
    value: function setUvs(geometry, edges) {
      //the incentre of the triangle (0,0), (1,0), (1,1)
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
    //TODO should only be creating materials/textures
    //once and then cloning if possible

  }, {
    key: 'createMesh',
    value: function createMesh(geometry, color, imageURL, wireframe) {
      if (wireframe === undefined) wireframe = false;
      if (color === undefined) color = 0xffffff;

      var material = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: wireframe,
        side: THREE.DoubleSide
      });

      //transparent: true,
      if (imageURL) {
        var texture = new THREE.TextureLoader().load(imageURL);
        texture.wrapS = 1000;
        texture.wrapT = 1000;
        material.map = texture;
        material.needsUpdate = true;
      }

      return new THREE.Mesh(geometry, material);
    }
  }, {
    key: 'addBoundingBoxHelper',
    value: function addBoundingBoxHelper(mesh) {
      var box = new THREE.BoxHelper(mesh);
      //box.update();
      this.scene.add(box);
    }

    //TODO as this is a static image requestAnimationFrame is redundant
    //however render() needs to be called after all the shapes
    //are calculated

  }, {
    key: 'render',
    value: function render() {
      var _this = this;

      requestAnimationFrame(function () {
        _this.render();
      });
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
  }, {
    key: 'segment',
    value: function segment(circle, startAngle, endAngle, color) {
      if (color === undefined) color = 0xffffff;

      var curve = new THREE.EllipseCurve(circle.centre.x * this.radius, circle.centre.y * this.radius, circle.radius * this.radius, circle.radius * this.radius, // xRadius, yRadius
      startAngle, endAngle, false // aClockwise
      );

      var points = curve.getSpacedPoints(100);

      var path = new THREE.Path();
      var geometry = path.createGeometry(points);

      var material = new THREE.LineBasicMaterial({
        color: color
      });
      var s = new THREE.Line(geometry, material);

      this.scene.add(s);
    }
  }, {
    key: 'line',
    value: function line(start, end, color) {
      if (color === undefined) color = 0xffffff;

      var geometry = new THREE.Geometry();

      geometry.vertices.push(new THREE.Vector3(start.x * this.radius, start.y * this.radius, 0), new THREE.Vector3(end.x * this.radius, end.y * this.radius, 0));
      var material = new THREE.LineBasicMaterial({
        color: color
      });
      var l = new THREE.Line(geometry, material);
      this.scene.add(l);
    }
  }]);
  return ThreeJS;
}();

// * ***********************************************************************
// *
// *  DISK CLASS
// *  Poincare Disk representation of the hyperbolic plane (as the unit disk).
// *  Contains any functions used to draw to the disk which check the element
// *  to be drawn lie on the disk then passes them to Three.js for drawing
// *
// *************************************************************************
var Disk = function () {
  function Disk() {
    babelHelpers.classCallCheck(this, Disk);

    this.draw = new ThreeJS();

    this.init();
  }

  babelHelpers.createClass(Disk, [{
    key: 'init',
    value: function init() {
      this.centre = new Point(0, 0);
      this.drawDisk();
    }

    //draw the disk background

  }, {
    key: 'drawDisk',
    value: function drawDisk() {
      this.draw.disk(this.centre, 1, 0x000000);
    }
  }, {
    key: 'drawPoint',
    value: function drawPoint(point, radius, color) {
      if (this.checkPoints(point)) {
        return false;
      }
      this.draw.disk(point, radius, color, false);
    }

    //Draw an arc (hyperbolic line segment) between two points on the disk

  }, {
    key: 'drawArc',
    value: function drawArc(arc, color) {
      if (this.checkPoints(arc.p1, arc.p2)) {
        return false;
      }
      if (arc.straightLine) {
        this.draw.line(arc.p1, arc.p2, color);
      } else {
        this.draw.segment(arc.circle, arc.startAngle, arc.endAngle, color);
      }
    }
  }, {
    key: 'drawPolygonOutline',
    value: function drawPolygonOutline(polygon, color) {
      if (this.checkPoints(polygon.vertices)) {
        return false;
      }
      var l = polygon.vertices.length;
      for (var i = 0; i < l; i++) {
        var arc = new Arc(polygon.vertices[i], polygon.vertices[(i + 1) % l]);
        this.drawArc(arc, color);
      }
    }
  }, {
    key: 'drawPolygon',
    value: function drawPolygon(polygon, color, texture, wireframe) {
      if (this.checkPoints(polygon.vertices)) {
        return false;
      }
      //const points = polygon.spacedPointsOnEdges();
      //const centre = polygon.barycentre();
      //this.draw.polygon(points, centre, color, texture, wireframe);
      this.draw.polygon(polygon, color, texture, wireframe);
    }

    //return true if any of the points is not in the disk

  }, {
    key: 'checkPoints',
    value: function checkPoints() {
      for (var _len = arguments.length, points = Array(_len), _key = 0; _key < _len; _key++) {
        points[_key] = arguments[_key];
      }

      //pass in either a list of points or an array
      if (points[0] instanceof Array) points = points[0];

      var test = false;
      for (var i = 0; i < points.length; i++) {
        if (distance(points[i], this.centre) > 1) {
          console.error('Error! Point (' + points[i].x + ', ' + points[i].y + ') lies outside the plane!');
          test = true;
        }
      }
      if (test) return true;else return false;
    }
  }]);
  return Disk;
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
    console.log(p, q);
    this.texture = './images/textures/pattern1.png';
    this.texture = '';

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
      this.fr = this.fundamentalRegion();
      this.buildCentralPattern();
      this.buildCentralPolygon();

      if (this.maxLayers > 1) {
        var t0 = performance.now();
        this.generateLayers();
        var t1 = performance.now();
        console.log('GenerateLayers took ' + (t1 - t0) + ' milliseconds.');
      }
      //this.drawLayers();
      this.testing();
    }
  }, {
    key: 'testing',
    value: function testing() {
      var texture = './images/textures/pattern1.png';
      //texture = '';
      //this.disk.drawPolygon(this.fr, 0xffffff, texture, false);

      /*
      let p = new Point(-.600, -.600);
      let q = new Point(-.400, .600);
      let w = new Point(.6, 0.2);
      let pgon = new Polygon([p, q, w]);
       this.disk.drawPolygon(pgon, 0xffffff, texture, false);
      */

      var newPattern = this.transformPattern(this.centralPattern, this.transforms.edgeReflection);
      console.log(newPattern);
      this.drawPattern(newPattern);
    }

    //fundamentalRegion calculation using Dunham's method

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
      var vertices = [this.disk.centre, p1, p2];

      return new Polygon(vertices, true);
    }

    //calculate the central polygon which is made up of transformed copies
    //of the fundamental region

  }, {
    key: 'buildCentralPattern',
    value: function buildCentralPattern() {
      this.frCopy = this.fr.transform(this.transforms.hypReflection);
      this.layers[0] = [this.fr, this.frCopy];

      for (var i = 1; i < this.p; i++) {
        this.layers[0].push(this.layers[0][0].transform(this.transforms.rotatePolygonCW[i]));
        this.layers[0].push(this.layers[0][1].transform(this.transforms.rotatePolygonCW[i]));
      }
      this.centralPattern = this.layers[0];
    }
  }, {
    key: 'buildCentralPolygon',
    value: function buildCentralPolygon() {
      var vertices = [];
      for (var i = 0; i < this.p; i++) {
        var p = this.fr.vertices[1];
        vertices.push(p.transform(this.transforms.rotatePolygonCW[i]));
      }
      this.centralPolygon = new Polygon(vertices, true);
    }
  }, {
    key: 'generateLayers',
    value: function generateLayers() {
      for (var i = 0; i < this.p; i++) {
        var qTransform = this.transforms.edgeTransforms[i];
        for (var j = 0; j < this.q - 2; j++) {
          if (this.p === 3 && this.q - 3 === j) {
            this.layers[i].push(this.centralPolygon.transform(qTransform));
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

  }, {
    key: 'layerRecursion',
    value: function layerRecursion(exposure, layer, transform) {
      this.layers[layer].push(this.centralPolygon.transform(transform));

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
            this.layers[layer].push(this.centralPolygon.transform(qTransform));
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
          var poly = _step.value;

          newPattern.push(poly.transform(transform));
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
    value: function drawPattern(pgonArray) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = pgonArray[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var pgon = _step2.value;

          this.disk.drawPolygon(pgon, randomInt(1000, 14777215), '', this.wireframe);
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
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.layers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var layer = _step3.value;
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = layer[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var pgon = _step4.value;

              //this.disk.drawPolygon(pgon, E.randomInt(1000, 14777215), '', this.wireframe);
              this.disk.drawPolygon(pgon, 0xffffff, this.texture, this.wireframe);
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
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
        console.error('Hyperbolic tesselations require that (p-1)(q-2) > 4!');
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
var p = randomInt(4, 7);
var q = randomInt(4, 7);

if (p === 4 && q === 4) q = 5;

//Run after load to get window width and height
window.onload = function () {
  tesselation = new RegularTesselation(4, 5, 3);
  //tesselation = new RegularTesselation(p, q, 3);
};

window.onresize = function () {
  tesselation.disk.draw.reset();
  tesselation.disk.init();
  tesselation.init();
};