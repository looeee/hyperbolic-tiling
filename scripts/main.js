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
  var d2 = distance(p, circle.centre, circle.isOnUnitDisk);

  //line intersects circle at 2 points
  if (d2 < r) {
    var dt = Math.sqrt(r * r - d2 * d2);
    //point 1
    var q1 = new Point((t - dt) * dx + p1.x, (t - dt) * dy + p1.y, circle.isOnUnitDisk);
    //point 2
    var q2 = new Point((t + dt) * dx + p1.x, (t + dt) * dy + p1.y, circle.isOnUnitDisk);

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
    p1: new Point(xPos, yPos, point.isOnUnitDisk),
    p2: new Point(xNeg, yNeg, point.isOnUnitDisk)
  };
};

//find the two points at a distance from point1 along line defined by point1, point2
var spacedPointOnLine = function spacedPointOnLine(point1, point2, distance) {
  var circle = new Circle(point1.x, point1.y, distance, point1.isOnUnitDisk);
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
  return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2, p1.isOnUnitDisk);
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

  const p1 = new Point(x1, y1, circle0.isOnUnitDisk);

  const p2 = new Point(x2, y2, circle0.isOnUnitDisk);

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
    return new Point( p3.x, -p3.y, p1.isOnUnitDisk);
  }
  //reflection in x axis
  else if ( toFixed(m) == 0) {
    return new Point( -p3.x, p3.y, p1.isOnUnitDisk);
  }
  //reflection in arbitrary line
  else {
    const c = p1.y - m * p1.x;
    const d = (p3.x + (p3.y - c) * m) / (1 + m * m);
    const x = 2 * d - p3.x;
    const y = 2 * d * m - p3.y + 2 * c;
    return new Point(x,y, p1.isOnUnitDisk);
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

  return new Point(x, y, p1.isOnUnitDisk);
}

//get the circle inverse of a point p with respect a circle radius r centre c
export const inverse = (point, circle) => {
  const c = circle.centre;
  const r = circle.radius;
  const alpha = (r * r) / (Math.pow(point.x - c.x, 2) + Math.pow(point.y - c.y, 2));
  return new Point(alpha * (point.x - c.x) + c.x, alpha * (point.y - c.y) + c.y, circle.isOnUnitDisk);
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
  return new Point((p2.x - p1.x) / d,(p2.y - p1.y) / d, p1.isOnUnitDisk);
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

  return new Circle(centre.x, centre.y, radius, p1.isOnUnitDisk);
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
    var isOnUnitDisk = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
    babelHelpers.classCallCheck(this, Point);

    this.isOnUnitDisk = isOnUnitDisk;
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
      var q = new Point(x, y, this.isOnUnitDisk);
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
      var p = new Point(x, y, this.isOnUnitDisk);
      p.z = z;
      return p;
    }
  }, {
    key: 'weierstrassToPoincare',
    value: function weierstrassToPoincare() {
      var factor = 1 / (1 + this.z);
      var x = factor * this.x;
      var y = factor * this.y;
      return new Point(x, y, this.isOnUnitDisk);
    }

    //map from disk of window.radius to unit disk

  }, {
    key: 'toUnitDisk',
    value: function toUnitDisk() {
      if (this.isOnUnitDisk === true) {
        console.warn('Point ' + this.x + ', ' + this.y + ' already on unit disk!');
        return this;
      }
      return new Point(this.x / window.radius, this.y / window.radius, true);
    }

    //map from unit disk to disk of window.radius

  }, {
    key: 'fromUnitDisk',
    value: function fromUnitDisk() {
      if (this.isOnUnitDisk === false) {
        console.warn('Point ' + this.x + ', ' + this.y + ' not on unit disk!');
        return this;
      }

      return new Point(this.x * window.radius, this.y * window.radius, false);
    }
  }]);
  return Point;
}();

var Circle = function () {
  function Circle(centreX, centreY, radius) {
    var isOnUnitDisk = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];
    babelHelpers.classCallCheck(this, Circle);

    this.isOnUnitDisk = isOnUnitDisk;
    if (toFixed(radius) == 0) {
      radius = 0;
    }
    this.centre = new Point(centreX, centreY, this.isOnUnitDisk);
    this.radius = radius;
  }

  //map from disk of window.radius to unit disk

  babelHelpers.createClass(Circle, [{
    key: 'toUnitDisk',
    value: function toUnitDisk() {
      if (this.isOnUnitDisk === true) {
        console.warn('Circle ' + this + 'already on unit disk!');
        return this;
      }
      return new Circle(this.centre.x / window.radius, this.centre.y / window.radius, this.radius / window.radius);
    }

    //map from unit disk to disk of window.radius

  }, {
    key: 'fromUnitDisk',
    value: function fromUnitDisk() {
      if (this.isOnUnitDisk === false) {
        console.warn('Circle ' + this + 'not on unit disk!');
        return this;
      }
      return new Circle(this.centre.x * window.radius, this.centre.y * window.radius, this.radius * window.radius);
    }
  }]);
  return Circle;
}();

// * ***********************************************************************
// *
// *   ARC CLASS
// *
// *************************************************************************

var Arc = function () {
  function Arc(p1, p2) {
    var isOnUnitDisk = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
    babelHelpers.classCallCheck(this, Arc);

    this.isOnUnitDisk = isOnUnitDisk;
    this.p1 = p1;
    this.p2 = p2;

    if (throughOrigin(p1, p2)) {
      this.circle = new Circle(0, 0, 1, true);
      this.startAngle = 0;
      this.endAngle = 0;
      this.clockwise = false;
      this.straightLine = true;
    } else {
      this.hyperbolicMethod();
    }
  }

  babelHelpers.createClass(Arc, [{
    key: 'hyperbolicMethod',
    value: function hyperbolicMethod() {
      var q1 = undefined,
          q2 = undefined;
      if (this.isOnUnitDisk) {
        q1 = this.p1;
        q2 = this.p2;
      } else {
        q1 = this.p1.toUnitDisk();
        q2 = this.p2.toUnitDisk();
      }
      var wq1 = q1.poincareToWeierstrass();
      var wq2 = q2.poincareToWeierstrass();

      var wcp = this.weierstrassCrossProduct(wq1, wq2);

      //calculate centre of arcCircle relative to unit disk
      var arcCentre = new Point(wcp.x / wcp.z, wcp.y / wcp.z, true);

      //translate points to origin before calculating arctan
      q1.x = q1.x - arcCentre.x;
      q1.y = q1.y - arcCentre.y;
      q2.x = q2.x - arcCentre.x;
      q2.y = q2.y - arcCentre.y;

      var r = Math.sqrt(q1.x * q1.x + q1.y * q1.y);

      var arcCircle = undefined;
      if (this.isOnUnitDisk) {
        arcCircle = new Circle(arcCentre.x, arcCentre.y, r, true);
      } else {
        arcCircle = new Circle(arcCentre.x * window.radius, arcCentre.y * window.radius, r * window.radius, false);
      }

      var alpha = Math.atan2(q1.y, q1.x);

      var beta = Math.atan2(q2.y, q2.x);

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

    //map from disk of window.radius to unit disk

  }, {
    key: 'toUnitDisk',
    value: function toUnitDisk() {
      if (this.isOnUnitDisk === true) {
        console.warn('Arc ' + this + 'already on unit disk!');
        return this;
      } else {
        var p1 = this.p1.toUnitDisk();
        var p2 = this.p2.toUnitDisk();
        return new Arc(p1, p2, true);
      }
    }

    //map from unit disk to disk of window.radius

  }, {
    key: 'fromUnitDisk',
    value: function fromUnitDisk() {
      if (this.isOnUnitDisk === false) {
        console.warn('Arc ' + this + 'not on unit disk!');
        return this;
      } else {
        var p1 = this.p1.fromUnitDisk();
        var p2 = this.p2.fromUnitDisk();
        return new Arc(p1, p2, false);
      }
    }
  }]);
  return Arc;
}();

// * ***********************************************************************
// *
// *   POLYGON CLASS
// *
// *************************************************************************

//@param vertices: array of Points
//@param circle: Circle representing current Poincare Disk dimensions

var Polygon = function () {
  function Polygon(vertices) {
    var isOnUnitDisk = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
    babelHelpers.classCallCheck(this, Polygon);

    this.isOnUnitDisk = isOnUnitDisk;
    this.vertices = vertices;
  }

  babelHelpers.createClass(Polygon, [{
    key: 'spacedPointsOnEdges',
    value: function spacedPointsOnEdges() {
      var spacing = 5; //Math.ceil((2000 / window.radius));
      //if(spacing < 5) spacing = 5;
      var l = this.vertices.length;
      var points = [];

      //push the first vertex
      points.push(this.vertices[0]);

      //loop over the edges
      for (var i = 0; i < l; i++) {
        //tiny pgons near the edges of the disk don't need to be subdivided
        if (distance(this.vertices[i], this.vertices[(i + 1) % l]) > spacing) {
          var p = undefined;
          var arc = new Arc(this.vertices[i], this.vertices[(i + 1) % l], this.isOnUnitDisk);
          //line not through the origin (hyperbolic arc)
          if (!arc.straightLine) {
            if (arc.clockwise) p = spacedPointOnArc(arc.circle, this.vertices[i], spacing).p1;else p = spacedPointOnArc(arc.circle, this.vertices[i], spacing).p2;

            points.push(p);

            while (distance(p, this.vertices[(i + 1) % l]) > spacing) {
              if (arc.clockwise) p = spacedPointOnArc(arc.circle, p, spacing).p1;else p = spacedPointOnArc(arc.circle, p, spacing).p2;
              points.push(p);
            }
          }

          //line through origin (straight line)
          else {
              p = spacedPointOnLine(this.vertices[i], this.vertices[(i + 1) % l], spacing).p2;
              points.push(p);
              while (distance(p, this.vertices[(i + 1) % l]) > spacing) {
                p = spacedPointOnLine(p, this.vertices[i], spacing).p1;
                points.push(p);
              }
            }
        }

        //push the last vertex on each edge (but don't push first vertex again)
        if ((i + 1) % l !== 0) {
          points.push(this.vertices[(i + 1) % l]);
        }
      }
      return points;
    }

    //Apply a Transform to the polygon

  }, {
    key: 'transform',
    value: function transform(_transform2) {
      var newVertices = [];
      for (var i = 0; i < this.vertices.length; i++) {
        newVertices.push(this.vertices[i].transform(_transform2));
      }

      return new Polygon(newVertices, this.isOnUnitDisk);
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
      return new Point(x / f, y / f, this.isOnUnitDisk);
    }

    //map from disk of window.radius to unit disk

  }, {
    key: 'toUnitDisk',
    value: function toUnitDisk() {
      if (this.isOnUnitDisk === true) {
        console.warn('Polygon ' + this + 'already on unit disk!');
        return this;
      } else {
        var newVertices = [];
        for (var i = 0; i < this.vertices.length; i++) {
          newVertices.push(this.vertices[i].toUnitDisk());
        }
        return new Polygon(newVertices, true);
      }
    }

    //map from unit disk to disk of window.radius

  }, {
    key: 'fromUnitDisk',
    value: function fromUnitDisk() {
      if (this.isOnUnitDisk === false) {
        console.warn('Polygon ' + this + 'not on unit disk!');
        return this;
      } else {
        var newVertices = [];
        for (var i = 0; i < this.vertices.length; i++) {
          newVertices.push(this.vertices[i].fromUnitDisk());
        }
        return new Polygon(newVertices, false);
      }
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
// *************************************************************************

//orientation: reflection = -1 OR rotation = 1
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

  //TESTED: working

  babelHelpers.createClass(Transformations, [{
    key: 'initHypotenuseReflection',
    value: function initHypotenuseReflection() {
      this.hypReflection = new Transform(identityMatrix(3), -1);
      this.hypReflection.matrix[0][0] = Math.cos(2 * Math.PI / this.p);
      this.hypReflection.matrix[0][1] = Math.sin(2 * Math.PI / this.p);
      this.hypReflection.matrix[1][0] = Math.sin(2 * Math.PI / this.p);
      this.hypReflection.matrix[1][1] = -Math.cos(2 * Math.PI / this.p);
    }

    //TESTED: working but putting gaps between objects

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

    //TESTED: working

  }, {
    key: 'initEdgeBisectorReflection',
    value: function initEdgeBisectorReflection() {
      this.edgeBisectorReflection = new Transform(identityMatrix(3), -1);
      this.edgeBisectorReflection.matrix[1][1] = -1;
    }

    //TESTED: working

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

    //orientation: 0 -> reflection, 1 -> rotation

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

    //TESTED: not working!

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
// *************************************************************************
//TODO: after resizing a few times the scene stops drawing - possible memory
//not being freed in clearScene?
var ThreeJS = function () {
  function ThreeJS() {
    babelHelpers.classCallCheck(this, ThreeJS);

    this.init();
  }

  babelHelpers.createClass(ThreeJS, [{
    key: "init",
    value: function init() {
      if (this.scene === undefined) this.scene = new THREE.Scene();
      this.initCamera();

      this.initLighting();

      this.initRenderer();
    }
  }, {
    key: "reset",
    value: function reset() {
      cancelAnimationFrame(this.id); // Stop the animation
      this.clearScene();
      this.projector = null;
      this.camera = null;
      this.init();
    }
  }, {
    key: "clearScene",
    value: function clearScene() {
      for (var i = this.scene.children.length - 1; i >= 0; i--) {
        //this.scene.children[i].material.map.dispose();
        //this.scene.children[i].material.dispose();
        //this.scene.children[i].geometry.dispose();
        //this.scene.children[i] = null;
        this.scene.remove(this.scene.children[i]);
      }
    }
  }, {
    key: "initCamera",
    value: function initCamera() {
      this.camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -2, 1);
      this.scene.add(this.camera);
    }
  }, {
    key: "initLighting",
    value: function initLighting() {
      var ambientLight = new THREE.AmbientLight(0xffffff);
      this.scene.add(ambientLight);
    }
  }, {
    key: "initRenderer",
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
    key: "disk",
    value: function disk(centre, radius, color) {
      if (color === undefined) color = 0xffffff;

      var geometry = new THREE.CircleGeometry(radius, 100, 0, 2 * Math.PI);
      var circle = this.createMesh(geometry, color);
      circle.position.x = centre.x;
      circle.position.y = centre.y;

      this.scene.add(circle);
    }
  }, {
    key: "segment",
    value: function segment(circle, startAngle, endAngle, color) {
      if (color === undefined) color = 0xffffff;

      var curve = new THREE.EllipseCurve(circle.centre.x, circle.centre.y, // ax, aY
      circle.radius, circle.radius, // xRadius, yRadius
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
    key: "line",
    value: function line(start, end, color) {
      if (color === undefined) color = 0xffffff;

      var geometry = new THREE.Geometry();

      geometry.vertices.push(new THREE.Vector3(start.x, start.y, 0), new THREE.Vector3(end.x, end.y, 0));
      var material = new THREE.LineBasicMaterial({
        color: color
      });
      var l = new THREE.Line(geometry, material);
      this.scene.add(l);
    }
  }, {
    key: "polygon",
    value: function polygon(vertices, centre, color, texture, wireframe) {
      if (color === undefined) color = 0xffffff;
      var l = vertices.length;
      /*
      const poly = new THREE.Shape();
       poly.moveTo(vertices[0].x, vertices[0].y);
      for(let i = 0; i < l; i++) {
        //poly.moveTo(vertices[i].x, vertices[i].y);
        //poly.lineTo(centre.x, centre.y);
        //poly.moveTo(vertices[i].x, vertices[i].y);
        poly.lineTo(vertices[(i + 1) % l].x, vertices[(i + 1) % l].y);
      }
      //console.log(poly);
      let geometry = new THREE.ShapeGeometry(poly);
      */
      var geometry = new THREE.Geometry();

      //vertex 0 = polygon barycentre
      geometry.vertices.push(new THREE.Vector3(centre.x, centre.y, 0));
      //push first vertex to vertices array
      //This means that when the next vertex is pushed in the loop
      //we can also create the first face triangle
      geometry.vertices.push(new THREE.Vector3(vertices[0].x, vertices[0].y, 0));

      for (var i = 1; i < l; i++) {
        geometry.vertices.push(new THREE.Vector3(vertices[i].x, vertices[i].y, 0));
        geometry.faces.push(new THREE.Face3(0, i, i + 1));
      }

      //push the final faces
      geometry.faces.push(new THREE.Face3(0, l, 1));

      this.scene.add(this.createMesh(geometry, color, texture, wireframe));
    }

    //TODO learn how UVs work then write this function

  }, {
    key: "setUvs",
    value: function setUvs(geometry) {
      var uvs = geometry.faceVertexUvs[0];
      for (var i = 0; i < uvs.length; i++) {
        var uv = uvs[i];
        for (var j = 0; j < 3; j++) {
          console.log(uv[j]);
        }
      }
    }
  }, {
    key: "createMesh",
    value: function createMesh(geometry, color, imageURL, wireframe) {
      if (wireframe === undefined) wireframe = false;
      if (color === undefined) color = 0xffffff;

      var material = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: wireframe
      });

      if (imageURL) {
        var textureLoader = new THREE.TextureLoader();

        //load texture and apply to material in callback
        var texture = textureLoader.load(imageURL, function (tex) {});
        texture.repeat.set(0.005, 0.005);
        material.map = texture;
        material.map.wrapT = THREE.RepeatWrapping;
        material.map.wrapS = THREE.RepeatWrapping;
      }

      return new THREE.Mesh(geometry, material);
    }
  }, {
    key: "axes",
    value: function axes() {
      var xyz = new THREE.AxisHelper(20);
      this.scene.add(xyz);
    }
  }, {
    key: "render",
    value: function render() {
      var _this = this;

      requestAnimationFrame(function () {
        _this.render();
      });

      this.renderer.render(this.scene, this.camera);
    }
  }]);
  return ThreeJS;
}();

// * ***********************************************************************
// *
// *  DISK CLASS
// *  Poincare Disk representation of the hyperbolic plane. Contains any
// *  functions used to draw to the disk which are then passed to Three.js
// *  Also responsible for checking whether elements are on the unit Disk
// *  and resizing them if they are
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
      this.centre = new Point(0, 0, true);
      this.drawDisk();
    }

    //draw the disk background

  }, {
    key: 'drawDisk',
    value: function drawDisk() {
      this.draw.disk(this.centre, window.radius, 0x000000);
    }
  }, {
    key: 'drawPoint',
    value: function drawPoint(point, radius, color) {
      var p = undefined;
      if (point.isOnUnitDisk) {
        p = point.fromUnitDisk();
        this.draw.disk(p, radius, color, false);
      } else {
        p = point;
      }

      if (this.checkPoints(p)) {
        return false;
      }

      this.draw.disk(point, radius, color, false);
    }

    //Draw an arc (hyperbolic line segment) between two points on the disk

  }, {
    key: 'drawArc',
    value: function drawArc(arc, color) {
      //resize if arc is on unit disk
      var a = undefined;
      if (arc.isOnUnitDisk) a = arc.fromUnitDisk();else a = arc;

      if (this.checkPoints(a.p1, a.p2)) {
        return false;
      }

      if (a.straightLine) {
        this.draw.line(a.p1, a.p2, color);
      } else {
        this.draw.segment(a.circle, a.startAngle, a.endAngle, color);
      }
    }
  }, {
    key: 'drawPolygonOutline',
    value: function drawPolygonOutline(polygon, color) {
      //resize if polygon is on unit disk
      var p = undefined;
      if (polygon.isOnUnitDisk) p = polygon.fromUnitDisk();else p = polygon;

      if (this.checkPoints(p.vertices)) {
        return false;
      }

      var l = p.vertices.length;
      for (var i = 0; i < l; i++) {
        var arc = new Arc(p.vertices[i], p.vertices[(i + 1) % l]);
        this.drawArc(arc, color);
      }
    }
  }, {
    key: 'drawPolygon',
    value: function drawPolygon(polygon, color, texture, wireframe) {
      //resize if polygon is on unit disk
      var p = undefined;
      if (polygon.isOnUnitDisk) p = polygon.fromUnitDisk();else p = polygon;

      if (this.checkPoints(p.vertices)) {
        return false;
      }

      var points = p.spacedPointsOnEdges();
      var centre = p.barycentre();
      this.draw.polygon(points, centre, color, texture, wireframe);
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
        if (distance(points[i], this.centre) > window.radius) {
          console.error('Error! Point (' + points[i].x + ', ' + point[i].y + ') lies outside the plane!');
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

    this.layers = [];
    for (var i = 0; i <= maxLayers; i++) {
      this.layers[i] = [];
    }
    this.wireframe = false;
    this.wireframe = true;
    console.log(p, q);
    this.disk = new Disk();

    this.p = p;
    this.q = q;
    this.maxLayers = maxLayers || 5;
    this.params = new Parameters(p, q);

    this.transforms = new Transformations(p, q);

    if (this.checkParams()) {
      return false;
    }

    this.init();
  }

  babelHelpers.createClass(RegularTesselation, [{
    key: 'init',
    value: function init() {
      this.fr = this.fundamentalRegion();
      this.buildCentralPattern();
      this.buildCentralPolygon();

      if (this.maxLayers > 1) {
        //debugger;
        var t0 = performance.now();
        this.generateLayers();
        var t1 = performance.now();
        //console.log('GenerateLayers took ' + (t1 - t0) + ' milliseconds.')
      }
      this.drawLayers();

      //this.testing();
    }
  }, {
    key: 'testing',
    value: function testing() {
      var pattern = './images/textures/pattern1.png';
      pattern = '';
      //this.disk.drawPolygon(this.fr, 0xffffff, pattern, this.wireframe);

      //let poly = this.centralPolygon.transform(this.transforms.edgeReflection);
      //this.disk.drawPolygon(poly, 0x5c30e0, pattern, this.wireframe);

      //poly = poly.transform(this.transforms.edgeReflection);
      //this.disk.drawPolygon(poly, 0xec3ee0, pattern, this.wireframe);
    }
  }, {
    key: 'drawLayers',
    value: function drawLayers() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.layers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var layer = _step.value;
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = layer[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
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
      var p1 = new Point(xqpt, yqpt, true);
      var p2 = new Point(x2pt, 0, true);
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

      for (var i = 0; i < this.p; i++) {
        this.layers[0].push(this.layers[0][0].transform(this.transforms.rotatePolygonCW[i]));
        this.layers[0].push(this.layers[0][1].transform(this.transforms.rotatePolygonCW[i]));
      }
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
    key: 'drawPattern',
    value: function drawPattern(pgonArray) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = pgonArray[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var pgon = _step3.value;

          this.disk.drawPolygon(pgon, randomInt(1000, 14777215), '', this.wireframe);
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
  }, {
    key: 'transformPattern',
    value: function transformPattern(pattern, transform) {
      var newPattern = [];
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = pattern[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var poly = _step4.value;

          newPattern.push(poly.transform(transform));
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

      return newPattern;
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

    //The tesselation requires that (p-2)(q-2) > 4 to work (otherwise it is
    //either an elliptical or euclidean tesselation);
    //For now also require p,q > 3, as these are special cases

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
//window.isOnUnitDisk = new Circle(0,0,1);
var tesselation = undefined;
var p = randomInt(4, 7);
var q = randomInt(4, 7);

if (p === 4 && q === 4) p = 5;

//Run after load to get window width and height
window.onload = function () {
  //global variable to hold the radius as this must be calculated on load and is
  //used across all classes
  window.radius = window.innerWidth < window.innerHeight ? window.innerWidth / 2 - 5 : window.innerHeight / 2 - 5;
  window.radius = Math.floor(window.radius);
  //tesselation = new RegularTesselation(4, 5, 4);
  tesselation = new RegularTesselation(4, 5, 4);
  //tesselation = new RegularTesselation(p, q, 2);
};

window.onresize = function () {
  window.radius = window.innerWidth < window.innerHeight ? window.innerWidth / 2 - 5 : window.innerHeight / 2 - 5;
  window.radius = Math.floor(window.radius);
  console.log(window.radius);
  tesselation.disk.draw.reset();
  tesselation.disk.init();
  tesselation.init();
};