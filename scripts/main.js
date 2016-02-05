(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Circle = undefined;

var _euclid = require('./euclid');

var E = _interopRequireWildcard(_euclid);

var _point = require('./point');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// * ***********************************************************************
// *
// *   CIRCLE CLASS
// *
// *************************************************************************

var Circle = exports.Circle = function Circle(centreX, centreY, radius) {
  _classCallCheck(this, Circle);

  if (E.toFixed(radius) == 0) {
    radius = 0;
  }
  this.centre = new _point.Point(centreX, centreY);
  this.radius = radius;
};

},{"./euclid":3,"./point":6}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Disk = undefined;

var _euclid = require('./euclid');

var E = _interopRequireWildcard(_euclid);

var _hyperbolic = require('./hyperbolic');

var H = _interopRequireWildcard(_hyperbolic);

var _point = require('./point');

var _threejs = require('./threejs');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// * ***********************************************************************
// *
// *   DISK CLASS
// *   Poincare Disk representation of the hyperbolic plane
// *   Contains any functions used to draw to the disk
// *   (Currently using three js as drawing class)
// *************************************************************************

var Disk = exports.Disk = function () {
  function Disk() {
    var _this = this;

    _classCallCheck(this, Disk);

    this.draw = new _threejs.ThreeJS();

    window.addEventListener('load', function (event) {
      //window.removeEventListener('load');
      _this.init();
    }, false);

    window.addEventListener('resize', function () {
      _this.init();
    }, false);
  }

  _createClass(Disk, [{
    key: 'init',
    value: function init() {
      this.centre = new _point.Point(0, 0);

      //draw largest circle possible given window dims
      this.radius = window.innerWidth < window.innerHeight ? window.innerWidth / 2 - 5 : window.innerHeight / 2 - 5;

      this.circle = {
        centre: this.centre,
        radius: this.radius
      };

      //smaller circle for testing
      //this.radius = this.radius / 2;

      this.drawDisk();

      //this.testing();
    }
  }, {
    key: 'testing',
    value: function testing() {}

    //draw the disk background

  }, {
    key: 'drawDisk',
    value: function drawDisk() {
      this.draw.disk(this.centre, this.radius, 0x000000);
    }
  }, {
    key: 'point',
    value: function point(centre, radius, color) {
      this.draw.disk(centre, radius, color, false);
    }

    //draw a hyperbolic line between two points on the boundary circle
    //TODO: fix!

  }, {
    key: 'line',
    value: function line(p1, p2, color) {
      //const c = E.greatCircle(p1, p2, this.radius, this.centre);
      //const points = E.circleIntersect(this.centre, c.centre, this.radius, c.radius);

      this.drawArc(points.p1, points.p2, color);
    }

    //Draw an arc (hyperbolic line segment) between two points on the disk

  }, {
    key: 'drawArc',
    value: function drawArc(p1, p2, colour) {
      //check that the points are in the disk
      if (this.checkPoints(p1, p2)) {
        return false;
      }
      var col = colour || 0xffffff;
      var arc = H.arc(p1, p2, this.circle);

      if (arc.straightLine) {
        this.draw.line(p1, p2, col);
      } else {
        this.draw.segment(arc.circle, arc.startAngle, arc.endAngle, colour);
      }
    }
  }, {
    key: 'polygonOutline',
    value: function polygonOutline(vertices, colour) {
      var l = vertices.length;
      for (var i = 0; i < l; i++) {
        this.drawArc(vertices[i], vertices[(i + 1) % l], colour);
      }
    }

    //create an array of points spaced equally around the arcs defining a hyperbolic
    //polygon and pass these to ThreeJS.polygon()
    //TODO make spacing a function of final resolution
    //TODO check whether vertices are in the right order

  }, {
    key: 'polygon',
    value: function polygon(vertices, color, texture, wireframe) {
      var points = [];
      var spacing = 5;
      var l = vertices.length;
      for (var i = 0; i < l; i++) {
        var p = undefined;
        var arc = H.arc(vertices[i], vertices[(i + 1) % l], this.circle);

        //line not through the origin (hyperbolic arc)
        if (!arc.straightLine) {

          if (arc.clockwise) {
            p = E.spacedPointOnArc(arc.circle, vertices[i], spacing).p2;
          } else {
            p = E.spacedPointOnArc(arc.circle, vertices[i], spacing).p1;
          }
          points.push(p);

          while (E.distance(p, vertices[(i + 1) % l]) > spacing) {

            if (arc.clockwise) {
              p = E.spacedPointOnArc(arc.circle, p, spacing).p2;
            } else {
              p = E.spacedPointOnArc(arc.circle, p, spacing).p1;
            }

            points.push(p);
          }
          points.push(vertices[(i + 1) % l]);
        }

        //line through origin (straight line)
        else {
            points.push(vertices[(i + 1) % l]);
          }
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = points[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          //this.point(point,2,0x10ded8);

          var point = _step.value;
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

      this.draw.polygon(points, color, texture, wireframe);
    }

    //return true if any of the points is not in the disk

  }, {
    key: 'checkPoints',
    value: function checkPoints() {
      var r = this.radius;
      var test = false;

      for (var _len = arguments.length, points = Array(_len), _key = 0; _key < _len; _key++) {
        points[_key] = arguments[_key];
      }

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = points[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var point = _step2.value;

          if (E.distance(point, this.centre) > r) {
            console.error('Error! Point (' + point.x + ', ' + point.y + ') lies outside the plane!');
            test = true;
          }
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

      if (test) return true;else return false;
    }
  }]);

  return Disk;
}();

},{"./euclid":3,"./hyperbolic":4,"./point":6,"./threejs":8}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toFixed = exports.randomInt = exports.randomFloat = exports.spacedPointOnArc = exports.centroidOfPolygon = exports.throughOrigin = exports.normalVector = exports.centralAngle = exports.circleLineIntersect = exports.circleIntersect = exports.greatCircle = exports.lineReflection = exports.inverse = exports.radians = exports.intersection = exports.perpendicularSlope = exports.slope = exports.midpoint = exports.distance = undefined;

var _point = require('./point');

var _circle = require('./circle');

// * ***********************************************************************
// *
// *   EUCLIDEAN FUNCTIONS
// *   a place to stash all the functions that are euclidean geometrical
// *   operations
// *   All functions are 2D unless otherwise specified!
// *
// *************************************************************************

//distance between two points
var distance = exports.distance = function distance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

//midpoint of the line segment connecting two points
var midpoint = exports.midpoint = function midpoint(p1, p2) {
  return new _point.Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
};

//slope of line through p1, p2
var slope = exports.slope = function slope(p1, p2) {
  return (p2.x - p1.x) / (p2.y - p1.y);
};

//slope of line perpendicular to a line defined by p1,p2
var perpendicularSlope = exports.perpendicularSlope = function perpendicularSlope(p1, p2) {
  return -1 / Math.pow(slope(p1, p2), -1);
};

//intersection point of two lines defined by p1,m1 and q1,m2
var intersection = exports.intersection = function intersection(p1, m1, p2, m2) {
  var c1 = undefined,
      c2 = undefined,
      x = undefined,
      y = undefined;
  if (toFixed(p1.y, 10) == 0) {
    x = p1.x;
    y = m2 * (p1.x - p2.x) + p2.y;
  } else if (toFixed(p2.y, 10) == 0) {
    x = p2.x;
    y = m1 * (p2.x - p1.x) + p1.y;
  } else {
    //y intercept of first line
    c1 = p1.y - m1 * p1.x;
    //y intercept of second line
    c2 = p2.y - m2 * p2.x;

    x = (c2 - c1) / (m1 - m2);
    y = m1 * x + c1;
  }

  return new _point.Point(x, y);
};

var radians = exports.radians = function radians(degrees) {
  return Math.PI / 180 * degrees;
};

//get the circle inverse of a point p with respect a circle radius r centre c
var inverse = exports.inverse = function inverse(point, circle) {
  var c = circle.centre;
  var r = circle.radius;
  var alpha = r * r / (Math.pow(point.x - c.x, 2) + Math.pow(point.y - c.y, 2));
  return new _point.Point(alpha * (point.x - c.x) + c.x, alpha * (point.y - c.y) + c.y);
};

//reflect p3 across the line defined by p1,p2
var lineReflection = exports.lineReflection = function lineReflection(p1, p2, p3) {
  var m = slope(p1, p2);
  //reflection in y axis
  if (m > 999999 || m < -999999) {
    return new _point.Point(p3.x, -p3.y);
  }
  //reflection in x axis
  else if (toFixed(m, 10) == 0) {
      return new _point.Point(-p3.x, p3.y);
    }
    //reflection in arbitrary line
    else {
        var c = p1.y - m * p1.x;
        var d = (p3.x + (p3.y - c) * m) / (1 + m * m);
        var x = 2 * d - p3.x;
        var y = 2 * d * m - p3.y + 2 * c;
        return new _point.Point(x, y);
      }
};

//calculate the radius and centre of the circle required to draw a line between
//two points in the hyperbolic plane defined by the disk (r, c)
var greatCircle = exports.greatCircle = function greatCircle(p1, p2, circle) {
  var p1Inverse = inverse(p1, circle);
  var p2Inverse = inverse(p2, circle);

  var m = midpoint(p1, p1Inverse);
  var n = midpoint(p2, p2Inverse);

  var m1 = perpendicularSlope(m, p1Inverse);
  var m2 = perpendicularSlope(n, p2Inverse);

  //centre is the centrepoint of the circle out of which the arc is made
  var centre = intersection(m, m1, n, m2);
  var radius = distance(centre, p1);

  return new _circle.Circle(centre.x, centre.y, radius);
};

//intersection of two circles with equations:
//(x-a)^2 +(y-a)^2 = r0^2
//(x-b)^2 +(y-c)^2 = r1^2
//NOTE assumes the two circles DO intersect!
var circleIntersect = exports.circleIntersect = function circleIntersect(circle0, circle1) {
  var a = circle0.centre.x;
  var b = circle0.centre.y;
  var c = circle1.centre.x;
  var d = circle1.centre.y;
  var r0 = circle0.radius;
  var r1 = circle1.radius;

  var dist = Math.sqrt((c - a) * (c - a) + (d - b) * (d - b));

  var del = Math.sqrt((dist + r0 + r1) * (dist + r0 - r1) * (dist - r0 + r1) * (-dist + r0 + r1)) / 4;

  var xPartial = (a + c) / 2 + (c - a) * (r0 * r0 - r1 * r1) / (2 * dist * dist);
  var x1 = xPartial - 2 * del * (b - d) / (dist * dist);
  var x2 = xPartial + 2 * del * (b - d) / (dist * dist);

  var yPartial = (b + d) / 2 + (d - b) * (r0 * r0 - r1 * r1) / (2 * dist * dist);
  var y1 = yPartial + 2 * del * (a - c) / (dist * dist);
  var y2 = yPartial - 2 * del * (a - c) / (dist * dist);

  var p1 = new _point.Point(x1, y1);

  var p2 = new _point.Point(x2, y2);

  return {
    p1: p1,
    p2: p2
  };
};

var circleLineIntersect = exports.circleLineIntersect = function circleLineIntersect(circle, p1, p2) {
  var cx = circle.centre.x;
  var cy = circle.centre.y;
  var r = circle.radius;

  var d = distance(p1, p2);
  //unit vector p1 p2
  var dx = (p2.x - p1.x) / d;
  var dy = (p2.y - p1.y) / d;

  //point on line closest to circle centre
  var t = dx * (cx - p1.x) + dy * (cy - p1.y);
  var p = new _point.Point(t * dx + p1.x, t * dy + p1.y);

  //distance from this point to centre
  var d2 = distance(p, circle.centre);

  //line intersects circle
  if (d2 < r) {
    var dt = Math.sqrt(r * r - d2 * d2);
    //point 1
    var q1 = new _point.Point((t - dt) * dx + p1.x, (t - dt) * dy + p1.y);
    //point 2
    var q2 = new _point.Point((t + dt) * dx + p1.x, (t + dt) * dy + p1.y);

    return {
      p1: q1,
      p2: q2
    };
  } else if (d2 === r) {
    return p;
  } else {
    console.error('Error: line does not intersect circle!');
  }
};

//angle in radians between two points on circle of radius r
var centralAngle = exports.centralAngle = function centralAngle(p1, p2, r) {
  //round off error can result in this being very slightly greater than 1
  var temp = 0.5 * distance(p1, p2) / r;
  temp = toFixed(temp, 10);
  var res = 2 * Math.asin(temp);
  if (isNaN(res)) res = 0;
  return res;
};

//calculate the normal vector given 2 points
var normalVector = exports.normalVector = function normalVector(p1, p2) {
  var d = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  return new _point.Point((p2.x - p1.x) / d, (p2.y - p1.y) / d);
};

//does the line connecting p1, p2 go through the point (0,0)?
//needs to take into account roundoff errors so returns true if
//test is close to 0
var throughOrigin = exports.throughOrigin = function throughOrigin(p1, p2) {
  if (p1.x === 0 && p2.x === 0) {
    //vertical line through centre
    return true;
  }
  var test = (-p1.x * p2.y + p1.x * p1.y) / (p2.x - p1.x) + p1.y;

  if (toFixed(test, 10) == 0) return true;else return false;
};

//find the centroid of a non-self-intersecting polygon
var centroidOfPolygon = exports.centroidOfPolygon = function centroidOfPolygon(points) {
  var first = points[0],
      last = points[points.length - 1];
  if (first.x != last.x || first.y != last.y) points.push(first);
  var twicearea = 0,
      x = 0,
      y = 0,
      nPts = points.length,
      p1 = undefined,
      p2 = undefined,
      f = undefined;
  for (var i = 0, j = nPts - 1; i < nPts; j = i++) {
    p1 = points[i];
    p2 = points[j];
    f = p1.x * p2.y - p2.x * p1.y;
    twicearea += f;
    x += (p1.x + p2.x) * f;
    y += (p1.y + p2.y) * f;
  }
  f = twicearea * 3;
  return new _point.Point(x / f, y / f);
};

//find a point at a distance d along the circumference of
//a circle of radius r, centre c from a point also
//on the circumference
var spacedPointOnArc = exports.spacedPointOnArc = function spacedPointOnArc(circle, point, spacing) {
  var cosTheta = -(spacing * spacing / (2 * circle.radius * circle.radius) - 1);
  var sinThetaPos = Math.sqrt(1 - Math.pow(cosTheta, 2));
  var sinThetaNeg = -sinThetaPos;

  var xPos = circle.centre.x + cosTheta * (point.x - circle.centre.x) - sinThetaPos * (point.y - circle.centre.y);
  var xNeg = circle.centre.x + cosTheta * (point.x - circle.centre.x) - sinThetaNeg * (point.y - circle.centre.y);
  var yPos = circle.centre.y + sinThetaPos * (point.x - circle.centre.x) + cosTheta * (point.y - circle.centre.y);
  var yNeg = circle.centre.y + sinThetaNeg * (point.x - circle.centre.x) + cosTheta * (point.y - circle.centre.y);

  return {
    p1: new _point.Point(xPos, yPos),
    p2: new _point.Point(xNeg, yNeg)
  };
};

var randomFloat = exports.randomFloat = function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
};

var randomInt = exports.randomInt = function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

//.toFixed returns a string for some no doubt very good reason.
//Change it back to a float
var toFixed = exports.toFixed = function toFixed(number, places) {
  return parseFloat(number.toFixed(places));
};

},{"./circle":1,"./point":6}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inverseTranslatePoincare = exports.translatePoincare = exports.rotatePgonAboutOrigin = exports.rotateAboutOrigin = exports.rotateAboutOriginWeierstrass = exports.weierstrassToPoincare = exports.poincareToWeierstrass = exports.reflect = exports.rotation = exports.translateX = exports.arc = undefined;

var _euclid = require('./euclid');

var E = _interopRequireWildcard(_euclid);

var _point = require('./point');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// * ***********************************************************************
// *
// *   HYPERBOLIC FUNCTIONS
// *   a place to stash all the functions that are hyperbolic gemeometrical
// *   operations
// *
// *************************************************************************

//calculate greatCircle, startAngle and endAngle for hyperbolic arc
//TODO deal with case of staight lines through centre
var arc = exports.arc = function arc(p1, p2, circle) {
  if (E.throughOrigin(p1, p2)) {
    return {
      circle: circle,
      startAngle: 0,
      endAngle: 0,
      clockwise: false,
      straightLine: true
    };
  }
  var clockwise = false;
  var alpha1 = undefined,
      alpha2 = undefined,
      startAngle = undefined,
      endAngle = undefined;
  var c = E.greatCircle(p1, p2, circle);
  var oy = c.centre.y;
  var ox = c.centre.x;

  //point at 0 radians on c
  var p3 = new _point.Point(ox + c.radius, oy);

  //calculate the position of each point in the circle
  alpha1 = E.centralAngle(p3, p1, c.radius);
  alpha2 = E.centralAngle(p3, p2, c.radius);

  alpha1 = p1.y < oy ? 2 * Math.PI - alpha1 : alpha1;
  alpha2 = p2.y < oy ? 2 * Math.PI - alpha2 : alpha2;

  //case where p1 above and p2 below or on the line c.centre -> p3
  if (p1.x >= ox && p2.x >= ox && p1.y <= oy && p2.y >= oy) {
    startAngle = alpha1;
    endAngle = alpha2;
  }
  //case where p2 above and p1 below or on the line c.centre -> p3
  else if (p1.x >= ox && p2.x >= ox && p1.y >= oy && p2.y <= oy) {
      startAngle = alpha2;
      endAngle = alpha1;
      clockwise = true;
    }
    //points in clockwise order
    else if (alpha1 > alpha2) {
        startAngle = alpha2;
        endAngle = alpha1;
        clockwise = true;
      }
      //points in anticlockwise order
      else {
          startAngle = alpha1;
          endAngle = alpha2;
        }
  //console.log(startAngle, endAngle);
  return {
    circle: c,
    startAngle: startAngle,
    endAngle: endAngle,
    clockwise: clockwise,
    straightLine: false
  };
};

//translate a set of points along the x axis
var translateX = exports.translateX = function translateX(pointsArray, distance) {
  var l = pointsArray.length;
  var newPoints = [];
  var e = Math.pow(Math.E, distance);
  var pos = e + 1;
  var neg = e - 1;
  for (var i = 0; i < l; i++) {
    var x = pos * pointsArray[i].x + neg * pointsArray[i].y;
    var y = neg * pointsArray[i].x + pos * pointsArray[i].y;
    newPoints.push(new _point.Point(x, y));
  }
  return newPoints;
};

//rotate a set of points about a point by a given angle
//clockwise defaults to false
var rotation = exports.rotation = function rotation(pointsArray, point, angle, clockwise) {};

//reflect a set of points across a hyperbolic arc
//TODO add case where reflection is across straight line
var reflect = exports.reflect = function reflect(pointsArray, p1, p2, circle) {
  var l = pointsArray.length;
  var a = arc(p1, p2, circle);
  var newPoints = [];

  if (!a.straightLine) {
    for (var i = 0; i < l; i++) {
      newPoints.push(E.inverse(pointsArray[i], a.circle));
    }
  } else {
    for (var i = 0; i < l; i++) {
      newPoints.push(E.lineReflection(p1, p2, pointsArray[i]));
    }
  }
  return newPoints;
};

var poincareToWeierstrass = exports.poincareToWeierstrass = function poincareToWeierstrass(point2D) {
  var factor = 1 / (1 - point2D.x * point2D.x - point2D.y * point2D.y);
  return {
    x: 2 * factor * point2D.x,
    y: 2 * factor * point2D.y,
    z: factor * (1 + point2D.x * point2D.x + point2D.y * point2D.y)
  };
};

var weierstrassToPoincare = exports.weierstrassToPoincare = function weierstrassToPoincare(point3D) {
  var factor = 1 / (1 + point3D.z);
  return new _point.Point(factor * point3D.x, factor * point3D.y);
};

var rotateAboutOriginWeierstrass = exports.rotateAboutOriginWeierstrass = function rotateAboutOriginWeierstrass(point3D, angle) {
  return {
    x: Math.cos(angle) * point3D.x - Math.sin(angle) * point3D.y,
    y: Math.sin(angle) * point3D.x + Math.cos(angle) * point3D.y,
    z: point3D.z
  };
};

var rotateAboutOrigin = exports.rotateAboutOrigin = function rotateAboutOrigin(point2D, angle) {
  return new _point.Point(Math.cos(angle) * point2D.x - Math.sin(angle) * point2D.y, Math.sin(angle) * point2D.x + Math.cos(angle) * point2D.y);
};

var rotatePgonAboutOrigin = exports.rotatePgonAboutOrigin = function rotatePgonAboutOrigin(points2DArray, angle) {
  var l = points2DArray.length;
  var rotatedPoints2DArray = [];
  for (var i = 0; i < l; i++) {
    var point = rotateAboutOrigin(points2DArray[i], angle);
    rotatedPoints2DArray.push(point);
  }
  return rotatedPoints2DArray;
};

//when the point p1 is translated to the origin, the point p2
//is translated according to this formula
//https://en.wikipedia.org/wiki/Poincar%C3%A9_disk_model#Isometric_Transformations
var translatePoincare = exports.translatePoincare = function translatePoincare(p1, p2) {
  var dot = p1.x * p2.x + p1.y * p2.y;
  var normSquaredP1 = Math.pow(Math.sqrt(p1.x * p1.x + p1.y * p1.y), 2);
  var normSquaredP2 = Math.pow(Math.sqrt(p2.x * p2.x + p2.y * p2.y), 2);
  var denominator = 1 + 2 * dot + normSquaredP1 * normSquaredP2;

  var p1Factor = (1 + 2 * dot + normSquaredP2) / denominator;
  var p2Factor = (1 - normSquaredP1) / denominator;

  var x = p1Factor * p1.x + p2Factor * p2.x;
  var y = p1Factor * p1.y + p2Factor * p2.y;

  return new _point.Point(x, y);
};

var inverseTranslatePoincare = exports.inverseTranslatePoincare = function inverseTranslatePoincare(p1, p2) {};

},{"./euclid":3,"./point":6}],5:[function(require,module,exports){
'use strict';

var _euclid = require('./euclid');

var E = _interopRequireWildcard(_euclid);

var _regularTesselation = require('./regularTesselation');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// * ***********************************************************************
// *
// *   SETUP
// *
// *************************************************************************

var tesselation = new _regularTesselation.RegularTesselation(E.randomInt(4, 12), E.randomInt(4, 12));
//const tesselation = new RegularTesselation(6, 12);

//TODO create circle class and refactor
//TODO window.removeEventListener('load'); not working in firefox
//TODO apparently .toFixed() returns a string

},{"./euclid":3,"./regularTesselation":7}],6:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Point = undefined;

var _euclid = require('./euclid');

var E = _interopRequireWildcard(_euclid);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// * ***********************************************************************
// *
// *   POINT CLASS
// *   2d point class
// *************************************************************************

var Point = exports.Point = function () {
  function Point(x, y) {
    _classCallCheck(this, Point);

    if (E.toFixed(x, 10) == 0) {
      x = 0;
    }
    if (E.toFixed(y, 10) == 0) {
      y = 0;
    }
    this.x = x;
    this.y = y;
  }

  _createClass(Point, [{
    key: 'toFixed',
    value: function toFixed(places) {
      this.x = E.toFixed(this.x, places);
      this.y = E.toFixed(this.y, places);
    }

    //compare two points taking rounding errors into account

  }, {
    key: 'compare',
    value: function compare(p2) {
      if (typeof p2 === 'undefined') {
        console.warn('Warning: point not defined.');
        return false;
      }
      var t1 = this.toFixed(10);
      var t2 = p2.toFixed(10);

      if (p1.x === p2.x && p1.y === p2.y) return true;else return false;
    }
  }]);

  return Point;
}();

},{"./euclid":3}],7:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RegularTesselation = undefined;

var _euclid = require('./euclid');

var E = _interopRequireWildcard(_euclid);

var _hyperbolic = require('./hyperbolic');

var H = _interopRequireWildcard(_hyperbolic);

var _point = require('./point');

var _disk = require('./disk');

var _circle = require('./circle');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// * ***********************************************************************
// *    TESSELATION CLASS
// *    Creates a regular Tesselation of the Poincare Disk
// *    q: number of p-gons meeting at each vertex
// *    p: number of sides of p-gon
// *    using the techniques created by Coxeter and Dunham
// *
// *************************************************************************

var RegularTesselation = exports.RegularTesselation = function () {
  function RegularTesselation(p, q, rotation, colour, maxLayers) {
    var _this = this;

    _classCallCheck(this, RegularTesselation);

    this.disk = new _disk.Disk();

    this.p = p;
    this.q = q;
    this.colour = colour || 'black';
    this.rotation = rotation || 0;
    this.maxLayers = maxLayers || 5;

    if (this.checkParams()) {
      return false;
    }

    window.addEventListener('load', function (event) {
      //window.removeEventListener('load');
      _this.init();
    }, false);

    window.addEventListener('resize', function () {
      _this.init();
    }, false);
  }

  _createClass(RegularTesselation, [{
    key: 'init',
    value: function init() {
      this.fr = this.fundamentalRegion();
      this.testing();
    }
  }, {
    key: 'testing',
    value: function testing() {
      var wireframe = false;
      wireframe = true;

      var p1 = new _point.Point(-239.55051764498, 239.55051764498035);
      var p2 = new _point.Point(-270.1439571978872, 217.15456551396463);

      //this.disk.drawArc(p1,p2, 45348774);

      //this.disk.polygon(this.fr, E.randomInt(10000, 14777215), '', wireframe);
      var poly2 = H.reflect(this.fr, this.fr[1], this.fr[2], this.disk.circle);
      //this.disk.polygon(poly2, E.randomInt(10000, 14777215));

      var poly3 = H.reflect(poly2, poly2[0], poly2[1], this.disk.circle);
      //this.disk.polygon(poly3, E.randomInt(10000, 14777215), '', wireframe);

      var poly4 = H.reflect(poly3, poly3[2], poly3[0], this.disk.circle);
      //this.disk.polygon(poly4, E.randomInt(10000, 14777215), '', wireframe);

      var poly5 = H.reflect(poly4, poly4[1], poly4[0], this.disk.circle);
      //this.disk.polygon(poly5, E.randomInt(10000, 14777215), '', wireframe);

      var poly6 = H.reflect(poly3, poly3[2], poly3[1], this.disk.circle);
      //this.disk.polygon(poly6, E.randomInt(10000, 14777215), '', wireframe);

      var poly7 = H.reflect(poly6, poly6[0], poly6[2], this.disk.circle);
      //this.disk.polygon(poly7, E.randomInt(10000, 14777215), '', wireframe);

      var poly8 = H.reflect(poly6, poly6[0], poly6[1], this.disk.circle);
      //this.disk.polygon(poly8, E.randomInt(10000, 14777215), '', wireframe);

      var poly9 = H.reflect(poly7, poly7[0], poly7[1], this.disk.circle);
      //this.disk.polygon(poly9, E.randomInt(10000, 14777215), '', wireframe);

      var num = this.p * 2;
      for (var i = 0; i < num; i++) {
        var poly = H.rotatePgonAboutOrigin(this.fr, 2 * Math.PI / num * (i + 1));
        this.disk.polygon(poly, E.randomInt(10000, 14777215), '', wireframe);
        poly = H.rotatePgonAboutOrigin(poly2, 2 * Math.PI / num * (i + 1));
        this.disk.polygon(poly, E.randomInt(10000, 14777215), '', wireframe);
        poly = H.rotatePgonAboutOrigin(poly3, 2 * Math.PI / num * (i + 1));
        this.disk.polygon(poly, E.randomInt(10000, 14777215), '', wireframe);
        poly = H.rotatePgonAboutOrigin(poly4, 2 * Math.PI / num * (i + 1));
        this.disk.polygon(poly, E.randomInt(10000, 14777215), '', wireframe);
        poly = H.rotatePgonAboutOrigin(poly5, 2 * Math.PI / num * (i + 1));
        this.disk.polygon(poly, E.randomInt(10000, 14777215), '', wireframe);
        poly = H.rotatePgonAboutOrigin(poly6, 2 * Math.PI / num * (i + 1));
        this.disk.polygon(poly, E.randomInt(10000, 14777215), '', wireframe);
        poly = H.rotatePgonAboutOrigin(poly7, 2 * Math.PI / num * (i + 1));
        this.disk.polygon(poly, E.randomInt(10000, 14777215), '', wireframe);
        poly = H.rotatePgonAboutOrigin(poly8, 2 * Math.PI / num * (i + 1));
        this.disk.polygon(poly, E.randomInt(10000, 14777215), '', wireframe);
        poly = H.rotatePgonAboutOrigin(poly9, 2 * Math.PI / num * (i + 1));
        this.disk.polygon(poly, E.randomInt(10000, 14777215), '', wireframe);
      }
    }

    //calculate first point of fundamental polygon using Coxeter's method

  }, {
    key: 'fundamentalRegion',
    value: function fundamentalRegion() {
      var radius = this.disk.circle.radius;
      var s = Math.sin(Math.PI / this.p);
      var t = Math.cos(Math.PI / this.q);
      //multiply these by the disks radius (Coxeter used unit disk);
      var r = 1 / Math.sqrt(t * t / (s * s) - 1) * radius;
      var d = 1 / Math.sqrt(1 - s * s / (t * t)) * radius;
      var b = new _point.Point(radius * Math.cos(Math.PI / this.p), -radius * Math.sin(Math.PI / this.p));

      var circle = new _circle.Circle(d, 0, r);

      //there will be two points of intersection, of which we want the first
      var p1 = E.circleLineIntersect(circle, this.disk.centre, b).p1;

      var p2 = new _point.Point(d - r, 0);

      var points = [this.disk.centre, p1, p2];

      return points;
    }

    //The tesselation requires that (p-2)(q-2) > 4 to work (otherwise it is
    // either an elliptical or euclidean tesselation);
    //For now also require p,q > 3, as these are special cases

  }, {
    key: 'checkParams',
    value: function checkParams() {
      if (this.maxLayers < 0 || isNaN(this.maxLayers)) {
        console.error('maxLayers must be greater than 0');
        return true;
      } else if ((this.p - 2) * (this.q - 2) <= 4) {
        console.error('Hyperbolic tesselations require that (p-1)(q-2) < 4!');
        return true;
      }
      //TODO implement special cases for q = 3 or p = 3
      else if (this.q <= 3 || isNaN(this.q)) {
          console.error('Tesselation error: at least 3 p-gons must meet \
                    at each vertex!');
          return true;
        } else if (this.p <= 3 || isNaN(this.p)) {
          console.error('Tesselation error: polygon needs at least 3 sides!');
          return true;
        } else {
          return false;
        }
    }
  }]);

  return RegularTesselation;
}();

},{"./circle":1,"./disk":2,"./euclid":3,"./hyperbolic":4,"./point":6}],8:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//NOTE will give a warning:  Too many active WebGL contexts
//after resizing 16 times. This is a bug in threejs and can be safely ignored.
// * ***********************************************************************
// *
// *  THREE JS CLASS
// *
// *************************************************************************

var ThreeJS = exports.ThreeJS = function () {
  function ThreeJS() {
    var _this = this;

    _classCallCheck(this, ThreeJS);

    window.addEventListener('load', function (event) {
      //window.removeEventListener('load');
      _this.init();
    }, false);

    window.addEventListener('resize', function () {
      _this.reset();
    }, false);
  }

  _createClass(ThreeJS, [{
    key: 'init',
    value: function init() {
      this.scene = new THREE.Scene();
      this.initCamera();

      this.initLighting();

      this.axes();

      this.initRenderer();
    }
  }, {
    key: 'reset',
    value: function reset() {
      cancelAnimationFrame(this.id); // Stop the animation
      this.scene = null;
      this.projector = null;
      this.camera = null;
      this.controls = null;

      var element = document.getElementsByTagName('canvas');
      for (var index = element.length - 1; index >= 0; index--) {
        element[index].parentNode.removeChild(element[index]);
      }
      this.init();
    }
  }, {
    key: 'initCamera',
    value: function initCamera() {
      this.camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -2, 1);
      this.scene.add(this.camera);
      this.camera.position.x = 0;
      this.camera.position.y = 0;

      this.camera.position.z = 1;
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
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      });
      this.renderer.setClearColor(0xffffff, 1.0);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement);

      this.render();
    }
  }, {
    key: 'disk',
    value: function disk(centre, radius, color) {
      if (color === undefined) color = 0xffffff;

      var geometry = new THREE.CircleGeometry(radius, 100, 0, 2 * Math.PI);
      var circle = this.createMesh(geometry, color);
      circle.position.x = centre.x;
      circle.position.y = centre.y;

      this.scene.add(circle);
    }
  }, {
    key: 'segment',
    value: function segment(circle, alpha, offset, color) {
      if (color === undefined) color = 0xffffff;

      var curve = new THREE.EllipseCurve(circle.centre.x, circle.centre.y, // ax, aY
      circle.radius, circle.radius, // xRadius, yRadius
      alpha, offset, // aStartAngle, aEndAngle
      false // aClockwise
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

      geometry.vertices.push(new THREE.Vector3(start.x, start.y, 0), new THREE.Vector3(end.x, end.y, 0));
      var material = new THREE.LineBasicMaterial({
        color: color
      });
      var l = new THREE.Line(geometry, material);
      this.scene.add(l);
    }
  }, {
    key: 'polygon',
    value: function polygon(vertices, color, texture, wireframe) {
      if (color === undefined) color = 0xffffff;

      var poly = new THREE.Shape();
      poly.moveTo(vertices[0].x, vertices[0].y);

      for (var i = 1; i < vertices.length; i++) {
        poly.lineTo(vertices[i].x, vertices[i].y);
      }

      poly.lineTo(vertices[0].x, vertices[0].y);

      var geometry = new THREE.ShapeGeometry(poly);

      this.scene.add(this.createMesh(geometry, color, texture, wireframe));
    }
  }, {
    key: 'createMesh',
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
        texture.repeat.set(0.05, 0.05);
        material.map = texture;
        material.map.wrapT = THREE.RepeatWrapping;
        material.map.wrapS = THREE.RepeatWrapping;
      }

      return new THREE.Mesh(geometry, material);
    }
  }, {
    key: 'axes',
    value: function axes() {
      var xyz = new THREE.AxisHelper(20);
      this.scene.add(xyz);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      requestAnimationFrame(function () {
        _this2.render();
      });

      this.renderer.render(this.scene, this.camera);
    }
  }]);

  return ThreeJS;
}();

},{}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJlczIwMTUvY2lyY2xlLmpzIiwiZXMyMDE1L2Rpc2suanMiLCJlczIwMTUvZXVjbGlkLmpzIiwiZXMyMDE1L2h5cGVyYm9saWMuanMiLCJlczIwMTUvbWFpbi5qcyIsImVzMjAxNS9wb2ludC5qcyIsImVzMjAxNS9yZWd1bGFyVGVzc2VsYXRpb24uanMiLCJlczIwMTUvdGhyZWVqcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7OztJQ0FZLENBQUM7Ozs7Ozs7Ozs7Ozs7O0lBUUEsTUFBTSxXQUFOLE1BQU0sR0FDakIsU0FEVyxNQUFNLENBQ0wsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUM7d0JBRDFCLE1BQU07O0FBRWYsTUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBQztBQUN6QixVQUFNLEdBQUcsQ0FBQyxDQUFDO0dBQ1o7QUFDRCxNQUFJLENBQUMsTUFBTSxHQUFHLFdBWlQsS0FBSyxDQVljLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUMxQyxNQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztDQUN0Qjs7Ozs7Ozs7Ozs7Ozs7SUNmUyxDQUFDOzs7O0lBQ0QsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBV0EsSUFBSSxXQUFKLElBQUk7QUFDZixXQURXLElBQUksR0FDRDs7OzBCQURILElBQUk7O0FBRWIsUUFBSSxDQUFDLElBQUksR0FBRyxhQVhQLE9BQU8sRUFXYSxDQUFDOztBQUUxQixVQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLFVBQUMsS0FBSyxFQUFLOztBQUV6QyxZQUFLLElBQUksRUFBRSxDQUFDO0tBQ2IsRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFVixVQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFlBQU07QUFDdEMsWUFBSyxJQUFJLEVBQUUsQ0FBQztLQUNiLEVB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QUFFLENBQUEsQUFBQyxJQUFJLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFBLEFBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFBLEFBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFdEcsTUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksQ0FBQyxHQUFHLEFBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLElBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFBLEFBQUMsSUFBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7QUFDbkYsTUFBTSxFQUFFLEdBQUcsUUFBUSxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7QUFDeEQsTUFBTSxFQUFFLEdBQUcsUUFBUSxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7O0FBRXhELE1BQU0sUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxHQUFJLENBQUMsR0FBRyxBQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxJQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQSxBQUFDLElBQUssQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUEsQUFBQyxDQUFDO0FBQ25GLE1BQU0sRUFBRSxHQUFHLFFBQVEsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUEsQUFBQyxDQUFDO0FBQ3hELE1BQU0sRUFBRSxHQUFHLFFBQVEsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUEsQUFB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LENBQUMsTUFBTSxDQUFDOzs7QUFBQyxBQUdyRSxVQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDOzs7QUFBQyxBQUdyRSxVQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDOzs7QUFBQyxBQUdyRSxVQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDOzs7QUFBQyxBQUdyRSxVQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDOzs7QUFBQyxBQUdyRSxVQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQztBQUNuQixXQUFJLElBQUksQ0FBQyxHQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFDO0FBQ3pCLFlBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEFBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxFQUFFLEdBQUMsR0FBRyxJQUFHLENBQUMsR0FBQyxDQUFDLENBQUEsQUFBQyxDQUFDLENBQUM7QUFDbkUsWUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNyRSxZQUFJLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLEtBQUssRUFBRSxBQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsRUFBRSxHQUFDLEdBQUcsSUFBRyxDQUFDLEdBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBQyxDQUFDO0FBQzdELFlBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDckUsWUFBSSxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsQUFBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLEVBQUUsR0FBQyxHQUFHLElBQUcsQ0FBQyxHQUFDLENBQUMsQ0FBQSxBQUFDLENBQUMsQ0FBQztBQUM3RCxZQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3JFLFlBQUksR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsS0FBSyxFQUFFLEFBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxFQUFFLEdBQUMsR0FBRyxJQUFHLENBQUMsR0FBQyxDQUFDLENBQUEsQUFBQyxDQUFDLENBQUM7QUFDN0QsWUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNyRSxZQUFJLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLEtBQUssRUFBRSxBQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsRUFBRSxHQUFDLEdBQUcsSUFBRyxDQUFDLEdBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBQyxDQUFDO0FBQzdELFlBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDckUsWUFBSSxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsQUFBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLEVBQUUsR0FBQyxHQUFHLElBQUcsQ0FBQyxHQUFDLENBQUMsQ0FBQSxBQUFDLENBQUMsQ0FBQztBQUM3RCxZQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3JFLFlBQUksR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsS0FBSyxFQUFFLEFBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxFQUFFLEdBQUMsR0FBRyxJQUFHLENBQUMsR0FBQyxDQUFDLENBQUEsQUFBQyxDQUFDLENBQUM7QUFDN0QsWUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNyRSxZQUFJLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLEtBQUssRUFBRSxBQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsRUFBRSxHQUFDLEdBQUcsSUFBRyxDQUFDLEdBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBQyxDQUFDO0FBQzdELFlBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDckUsWUFBSSxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsQUFBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLEVBQUUsR0FBQyxHQUFHLElBQUcsQ0FBQyxHQUFDLENBQUMsQ0FBQSxBQUFDLENBQUMsQ0FBQztBQUM3RCxZQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO09BQ3RFO0tBRUY7Ozs7Ozt3Q0FHbUI7QUFDbEIsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ3ZDLFVBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckMsVUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7O0FBQUMsQUFFckMsVUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQUFBQyxDQUFDLEdBQUcsQ0FBQyxJQUFLLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztBQUN4RCxVQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQUFBQyxDQUFDLEdBQUcsQ0FBQyxJQUFLLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO0FBQ3hELFVBQU0sQ0FBQyxHQUFHLFdBdkhMLEtBQUssQ0F1SFUsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQ3ZELENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFdEMsVUFBTSxNQUFNLEdBQUcsWUFuSGpCLE1BQU0sQ0FtSHNCLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDOzs7QUFBQyxBQUduQyxVQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsbUJBQW1CLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQzs7QUFFakUsVUFBTSxFQUFFLEdBQUcsV0EvSE4sS0FBSyxDQStIVyxDQUFDLEdBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDOztBQUU1QixVQUFNLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQzs7QUFFMUMsYUFBTyxNQUFNLENBQUM7S0FDZjs7Ozs7Ozs7a0NBS2E7QUFDWixVQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUU7QUFDL0MsZUFBTyxDQUFDLEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO0FBQ2xELGVBQU8sSUFBSSxDQUFDO09BQ2IsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsSUFBSyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLElBQUksQ0FBQyxFQUFFO0FBQzNDLGVBQU8sQ0FBQyxLQUFLLENBQUMsc0RBQXNELENBQUMsQ0FBQztBQUN0RSxlQUFPLElBQUksQ0FBQzs7O0FBQ2IsV0FFSSxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDckMsaUJBQU8sQ0FBQyxLQUFLLENBQUM7b0NBQ2dCLENBQUMsQ0FBQztBQUNoQyxpQkFBTyxJQUFJLENBQUM7U0FDYixNQUFNLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUN2QyxpQkFBTyxDQUFDLEtBQUssQ0FBQyxvREFBb0QsQ0FBQyxDQUFDO0FBQ3BFLGlCQUFPLElBQUksQ0FBQztTQUNiLE1BQU07QUFDTCxpQkFBTyxLQUFLLENBQUM7U0FDZDtLQUNGOzs7U0F4SVUsa0JBQWtCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDZmxCLE9BQU8sV0FBUCxPQUFPO0FBQ2xCLFdBRFcsT0FBTyxHQUNKOzs7MEJBREgsT0FBTzs7QUFHaEIsVUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxVQUFDLEtBQUssRUFBSzs7QUFFekMsWUFBSyxJQUFJLEVBQUUsQ0FBQztLQUNiLEVBQUUsS0FBSyxDQUFDLENBQUM7O0FBRVYsVUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxZQUFNO0FBQ3RDLFlBQUssS0FBSyxFQUFFLENBQUM7S0FDZCxFQUFFLEtBQUssQ0FBQyxDQUFDO0dBRVg7O2VBWlUsT0FBTzs7MkJBY1g7QUFDTCxVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQy9CLFVBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQzs7QUFFbEIsVUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDOztBQUVwQixVQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRVosVUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0tBQ3JCOzs7NEJBRU87QUFDTiwwQkFBb0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO0FBQUMsQUFDOUIsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDbEIsVUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7QUFDdEIsVUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDbkIsVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7O0FBRXJCLFVBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN4RCxXQUFLLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUU7QUFDeEQsZUFBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7T0FDdkQ7QUFDRCxVQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDYjs7O2lDQUVZO0FBQ1gsVUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxFQUMvRCxNQUFNLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsV0FBVyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2pGLFVBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM1QixVQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzNCLFVBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRTNCLFVBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDNUI7OzttQ0FFYztBQUNiLFVBQU0sWUFBWSxHQUFHLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN0RCxVQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztLQUM5Qjs7O21DQUVjO0FBQ2IsVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLEtBQUssQ0FBQyxhQUFhLENBQUM7QUFDdEMsaUJBQVMsRUFBRSxJQUFJO09BQ2hCLENBQUMsQ0FBQztBQUNILFVBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUMzQyxVQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUM3RCxjQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDOztBQUVwRCxVQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7S0FDZjs7O3lCQUVJLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO0FBQzFCLFVBQUksS0FBSyxLQUFLLFNBQVMsRUFBRSxLQUFLLEdBQUcsUUFBUSxDQUFDOztBQUUxQyxVQUFNLFFBQVEsR0FBRyxJQUFJLEtBQUssQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN2RSxVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNoRCxZQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQzdCLFlBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7O0FBRTdCLFVBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ3hCOzs7NEJBRU8sTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO0FBQ3BDLFVBQUksS0FBSyxLQUFLLFNBQVMsRUFBRSxLQUFLLEdBQUcsUUFBUSxDQUFDOztBQUUxQyxVQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQ2xDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNoQyxZQUFNLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNO0FBQzVCLFdBQUssRUFBRSxNQUFNO0FBQ2I7QUFBSyxPQUNOLENBQUM7O0FBRUYsVUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFMUMsVUFBTSxJQUFJLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDOUIsVUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFN0MsVUFBTSxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUM7QUFDM0MsYUFBSyxFQUFFLEtBQUs7T0FDYixDQUFDLENBQUM7QUFDSCxVQUFNLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDOztBQUU3QyxVQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNuQjs7O3lCQUVJLEtBQUssRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFO0FBQ3RCLFVBQUksS0FBSyxLQUFLLFNBQVMsRUFBRSxLQUFLLEdBQUcsUUFBUSxDQUFDOztBQUUxQyxVQUFNLFFBQVEsR0FBRyxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQzs7QUFFdEMsY0FBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQ3BCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQ3RDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQ25DLENBQUM7QUFDRixVQUFNLFFBQVEsR0FBRyxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQztBQUMzQyxhQUFLLEVBQUUsS0FBSztPQUNiLENBQUMsQ0FBQztBQUNILFVBQU0sQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDN0MsVUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbkI7Ozs0QkFFTyxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUU7QUFDM0MsVUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFLEtBQUssR0FBRyxRQUFRLENBQUM7O0FBRTFDLFVBQU0sSUFBSSxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQy9CLFVBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRTFDLFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3hDLFlBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7T0FDMUM7O0FBRUQsVUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFMUMsVUFBTSxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUUvQyxVQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7S0FDdEU7OzsrQkFFVSxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUU7QUFDL0MsVUFBRyxTQUFTLEtBQUssU0FBUyxFQUFFLFNBQVMsR0FBRyxLQUFLLENBQUM7QUFDOUMsVUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFLEtBQUssR0FBRyxRQUFRLENBQUM7O0FBRTFDLFVBQU0sUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDO0FBQzNDLGFBQUssRUFBRSxLQUFLO0FBQ1osaUJBQVMsRUFBRSxTQUFTO09BQ3JCLENBQUMsQ0FBQzs7QUFFSCxVQUFJLFFBQVEsRUFBRTtBQUNaLFlBQU0sYUFBYSxHQUFHLElBQUksS0FBSyxDQUFDLGFBQWEsRUFBRTs7O0FBQUMsQUFHaEQsWUFBTSxPQUFPLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsVUFBQyxHQUFHLEVBQUssRUFBRSxDQUFDLENBQUM7QUFDMUQsZUFBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQy9CLGdCQUFRLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQztBQUN2QixnQkFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQztBQUMxQyxnQkFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQztPQUMzQzs7QUFFRCxhQUFPLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDM0M7OzsyQkFFTTtBQUNMLFVBQU0sR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNyQyxVQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNyQjs7OzZCQUVROzs7QUFDUCwyQkFBcUIsQ0FBQyxZQUFNO0FBQzFCLGVBQUssTUFBTSxFQUFFLENBQUE7T0FDZCxDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDL0M7OztTQXRLVSxPQUFPIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCAqIGFzIEUgZnJvbSAnLi9ldWNsaWQnO1xuaW1wb3J0IHsgUG9pbnQgfSBmcm9tICcuL3BvaW50Jztcbi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICpcbi8vICogICBDSVJDTEUgQ0xBU1Ncbi8vICpcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuZXhwb3J0IGNsYXNzIENpcmNsZXtcbiAgY29uc3RydWN0b3IoY2VudHJlWCwgY2VudHJlWSwgcmFkaXVzKXtcbiAgICBpZiggRS50b0ZpeGVkKHJhZGl1cykgPT0gMCl7XG4gICAgICByYWRpdXMgPSAwO1xuICAgIH1cbiAgICB0aGlzLmNlbnRyZSA9IG5ldyBQb2ludChjZW50cmVYLCBjZW50cmVZKTtcbiAgICB0aGlzLnJhZGl1cyA9IHJhZGl1cztcbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgRSBmcm9tICcuL2V1Y2xpZCc7XG5pbXBvcnQgKiBhcyBIIGZyb20gJy4vaHlwZXJib2xpYyc7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gJy4vcG9pbnQnO1xuaW1wb3J0IHsgVGhyZWVKUyB9IGZyb20gJy4vdGhyZWVqcyc7XG5cbi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICpcbi8vICogICBESVNLIENMQVNTXG4vLyAqICAgUG9pbmNhcmUgRGlzayByZXByZXNlbnRhdGlvbiBvZiB0aGUgaHlwZXJib2xpYyBwbGFuZVxuLy8gKiAgIENvbnRhaW5zIGFueSBmdW5jdGlvbnMgdXNlZCB0byBkcmF3IHRvIHRoZSBkaXNrXG4vLyAqICAgKEN1cnJlbnRseSB1c2luZyB0aHJlZSBqcyBhcyBkcmF3aW5nIGNsYXNzKVxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuZXhwb3J0IGNsYXNzIERpc2sge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmRyYXcgPSBuZXcgVGhyZWVKUygpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZXZlbnQpID0+IHtcbiAgICAgIC8vd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnKTtcbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH0sIGZhbHNlKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XG4gICAgICB0aGlzLmluaXQoKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy5jZW50cmUgPSBuZXcgUG9pbnQoMCwwKTtcblxuICAgIC8vZHJhdyBsYXJnZXN0IGNpcmNsZSBwb3NzaWJsZSBnaXZlbiB3aW5kb3cgZGltc1xuICAgIHRoaXMucmFkaXVzID0gKHdpbmRvdy5pbm5lcldpZHRoIDwgd2luZG93LmlubmVySGVpZ2h0KSA/ICh3aW5kb3cuaW5uZXJXaWR0aCAvIDIpIC0gNSA6ICh3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKSAtIDU7XG5cbiAgICB0aGlzLmNpcmNsZSA9IHtcbiAgICAgIGNlbnRyZTogdGhpcy5jZW50cmUsXG4gICAgICByYWRpdXM6IHRoaXMucmFkaXVzXG4gICAgfVxuXG4gICAgLy9zbWFsbGVyIGNpcmNsZSBmb3IgdGVzdGluZ1xuICAgIC8vdGhpcy5yYWRpdXMgPSB0aGlzLnJhZGl1cyAvIDI7XG5cbiAgICB0aGlzLmRyYXdEaXNrKCk7XG5cbiAgICAvL3RoaXMudGVzdGluZygpO1xuICB9XG5cbiAgdGVzdGluZygpIHtcblxuICB9XG5cbiAgLy9kcmF3IHRoZSBkaXNrIGJhY2tncm91bmRcbiAgZHJhd0Rpc2soKSB7XG4gICAgdGhpcy5kcmF3LmRpc2sodGhpcy5jZW50cmUsIHRoaXMucmFkaXVzLCAweDAwMDAwMCk7XG4gIH1cblxuICBwb2ludChjZW50cmUsIHJhZGl1cywgY29sb3IpIHtcbiAgICB0aGlzLmRyYXcuZGlzayhjZW50cmUsIHJhZGl1cywgY29sb3IsIGZhbHNlKTtcbiAgfVxuXG4gIC8vZHJhdyBhIGh5cGVyYm9saWMgbGluZSBiZXR3ZWVuIHR3byBwb2ludHMgb24gdGhlIGJvdW5kYXJ5IGNpcmNsZVxuICAvL1RPRE86IGZpeCFcbiAgbGluZShwMSwgcDIsIGNvbG9yKSB7XG4gICAgLy9jb25zdCBjID0gRS5ncmVhdENpcmNsZShwMSwgcDIsIHRoaXMucmFkaXVzLCB0aGlzLmNlbnRyZSk7XG4gICAgLy9jb25zdCBwb2ludHMgPSBFLmNpcmNsZUludGVyc2VjdCh0aGlzLmNlbnRyZSwgYy5jZW50cmUsIHRoaXMucmFkaXVzLCBjLnJhZGl1cyk7XG5cbiAgICB0aGlzLmRyYXdBcmMocG9pbnRzLnAxLCBwb2ludHMucDIsIGNvbG9yKVxuICB9XG5cbiAgLy9EcmF3IGFuIGFyYyAoaHlwZXJib2xpYyBsaW5lIHNlZ21lbnQpIGJldHdlZW4gdHdvIHBvaW50cyBvbiB0aGUgZGlza1xuICBkcmF3QXJjKHAxLCBwMiwgY29sb3VyKSB7XG4gICAgLy9jaGVjayB0aGF0IHRoZSBwb2ludHMgYXJlIGluIHRoZSBkaXNrXG4gICAgaWYgKHRoaXMuY2hlY2tQb2ludHMocDEsIHAyKSkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIGNvbnN0IGNvbCA9IGNvbG91ciB8fCAweGZmZmZmZjtcbiAgICBjb25zdCBhcmMgPSBILmFyYyhwMSwgcDIsIHRoaXMuY2lyY2xlKTtcblxuICAgIGlmIChhcmMuc3RyYWlnaHRMaW5lKSB7XG4gICAgICB0aGlzLmRyYXcubGluZShwMSwgcDIsIGNvbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZHJhdy5zZWdtZW50KGFyYy5jaXJjbGUsIGFyYy5zdGFydEFuZ2xlLCBhcmMuZW5kQW5nbGUsIGNvbG91cik7XG4gICAgfVxuICB9XG5cbiAgcG9seWdvbk91dGxpbmUodmVydGljZXMsIGNvbG91cikge1xuICAgIGNvbnN0IGwgPSB2ZXJ0aWNlcy5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgIHRoaXMuZHJhd0FyYyh2ZXJ0aWNlc1tpXSwgdmVydGljZXNbKGkgKyAxKSAlIGxdLCBjb2xvdXIpO1xuICAgIH1cbiAgfVxuXG4gIC8vY3JlYXRlIGFuIGFycmF5IG9mIHBvaW50cyBzcGFjZWQgZXF1YWxseSBhcm91bmQgdGhlIGFyY3MgZGVmaW5pbmcgYSBoeXBlcmJvbGljXG4gIC8vcG9seWdvbiBhbmQgcGFzcyB0aGVzZSB0byBUaHJlZUpTLnBvbHlnb24oKVxuICAvL1RPRE8gbWFrZSBzcGFjaW5nIGEgZnVuY3Rpb24gb2YgZmluYWwgcmVzb2x1dGlvblxuICAvL1RPRE8gY2hlY2sgd2hldGhlciB2ZXJ0aWNlcyBhcmUgaW4gdGhlIHJpZ2h0IG9yZGVyXG4gIHBvbHlnb24odmVydGljZXMsIGNvbG9yLCB0ZXh0dXJlLCB3aXJlZnJhbWUpIHtcbiAgICBjb25zdCBwb2ludHMgPSBbXTtcbiAgICBjb25zdCBzcGFjaW5nID0gNTtcbiAgICBjb25zdCBsID0gdmVydGljZXMubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICBsZXQgcDtcbiAgICAgIGNvbnN0IGFyYyA9IEguYXJjKHZlcnRpY2VzW2ldLCB2ZXJ0aWNlc1soaSArIDEpICUgbF0sIHRoaXMuY2lyY2xlKTtcblxuICAgICAgLy9saW5lIG5vdCB0aHJvdWdoIHRoZSBvcmlnaW4gKGh5cGVyYm9saWMgYXJjKVxuICAgICAgaWYgKCFhcmMuc3RyYWlnaHRMaW5lKSB7XG5cbiAgICAgICAgaWYgKGFyYy5jbG9ja3dpc2UpIHtcbiAgICAgICAgICBwID0gRS5zcGFjZWRQb2ludE9uQXJjKGFyYy5jaXJjbGUsIHZlcnRpY2VzW2ldLCBzcGFjaW5nKS5wMjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwID0gRS5zcGFjZWRQb2ludE9uQXJjKGFyYy5jaXJjbGUsIHZlcnRpY2VzW2ldLCBzcGFjaW5nKS5wMTtcbiAgICAgICAgfVxuICAgICAgICBwb2ludHMucHVzaChwKTtcblxuICAgICAgICB3aGlsZSAoRS5kaXN0YW5jZShwLCB2ZXJ0aWNlc1soaSArIDEpICUgbF0pID4gc3BhY2luZykge1xuXG4gICAgICAgICAgaWYgKGFyYy5jbG9ja3dpc2UpIHtcbiAgICAgICAgICAgIHAgPSBFLnNwYWNlZFBvaW50T25BcmMoYXJjLmNpcmNsZSwgcCwgc3BhY2luZykucDI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHAgPSBFLnNwYWNlZFBvaW50T25BcmMoYXJjLmNpcmNsZSwgcCwgc3BhY2luZykucDE7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcG9pbnRzLnB1c2gocCk7XG4gICAgICAgIH1cbiAgICAgICAgcG9pbnRzLnB1c2godmVydGljZXNbKGkgKyAxKSAlIGxdKTtcbiAgICAgIH1cblxuICAgICAgLy9saW5lIHRocm91Z2ggb3JpZ2luIChzdHJhaWdodCBsaW5lKVxuICAgICAgZWxzZXtcbiAgICAgICAgcG9pbnRzLnB1c2godmVydGljZXNbKGkgKyAxKSAlIGxdKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IobGV0IHBvaW50IG9mIHBvaW50cyl7XG4gICAgICAvL3RoaXMucG9pbnQocG9pbnQsMiwweDEwZGVkOCk7XG4gICAgfVxuXG4gICAgdGhpcy5kcmF3LnBvbHlnb24ocG9pbnRzLCBjb2xvciwgdGV4dHVyZSwgd2lyZWZyYW1lKTtcbiAgfVxuXG4gIC8vcmV0dXJuIHRydWUgaWYgYW55IG9mIHRoZSBwb2ludHMgaXMgbm90IGluIHRoZSBkaXNrXG4gIGNoZWNrUG9pbnRzKC4uLnBvaW50cykge1xuICAgIGNvbnN0IHIgPSB0aGlzLnJhZGl1cztcbiAgICBsZXQgdGVzdCA9IGZhbHNlO1xuICAgIGZvciAobGV0IHBvaW50IG9mIHBvaW50cykge1xuICAgICAgaWYgKEUuZGlzdGFuY2UocG9pbnQsIHRoaXMuY2VudHJlKSA+IHIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IhIFBvaW50ICgnICsgcG9pbnQueCArICcsICcgKyBwb2ludC55ICsgJykgbGllcyBvdXRzaWRlIHRoZSBwbGFuZSEnKTtcbiAgICAgICAgdGVzdCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0ZXN0KSByZXR1cm4gdHJ1ZVxuICAgIGVsc2UgcmV0dXJuIGZhbHNlXG4gIH1cbn1cbiIsImltcG9ydCB7XG4gIFBvaW50XG59XG5mcm9tICcuL3BvaW50JztcblxuaW1wb3J0IHtcbiAgQ2lyY2xlXG59XG5mcm9tICcuL2NpcmNsZSc7XG4vLyAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyAqXG4vLyAqICAgRVVDTElERUFOIEZVTkNUSU9OU1xuLy8gKiAgIGEgcGxhY2UgdG8gc3Rhc2ggYWxsIHRoZSBmdW5jdGlvbnMgdGhhdCBhcmUgZXVjbGlkZWFuIGdlb21ldHJpY2FsXG4vLyAqICAgb3BlcmF0aW9uc1xuLy8gKiAgIEFsbCBmdW5jdGlvbnMgYXJlIDJEIHVubGVzcyBvdGhlcndpc2Ugc3BlY2lmaWVkIVxuLy8gKlxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4vL2Rpc3RhbmNlIGJldHdlZW4gdHdvIHBvaW50c1xuZXhwb3J0IGNvbnN0IGRpc3RhbmNlID0gKHAxLCBwMikgPT4ge1xuICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KChwMi54IC0gcDEueCksIDIpICsgTWF0aC5wb3coKHAyLnkgLSBwMS55KSwgMikpO1xufVxuXG4vL21pZHBvaW50IG9mIHRoZSBsaW5lIHNlZ21lbnQgY29ubmVjdGluZyB0d28gcG9pbnRzXG5leHBvcnQgY29uc3QgbWlkcG9pbnQgPSAocDEsIHAyKSA9PiB7XG4gIHJldHVybiBuZXcgUG9pbnQoKHAxLnggKyBwMi54KSAvIDIsIChwMS55ICsgcDIueSkgLyAyKTtcbn1cblxuLy9zbG9wZSBvZiBsaW5lIHRocm91Z2ggcDEsIHAyXG5leHBvcnQgY29uc3Qgc2xvcGUgPSAocDEsIHAyKSA9PiB7XG4gIHJldHVybiAocDIueCAtIHAxLngpIC8gKHAyLnkgLSBwMS55KTtcbn1cblxuLy9zbG9wZSBvZiBsaW5lIHBlcnBlbmRpY3VsYXIgdG8gYSBsaW5lIGRlZmluZWQgYnkgcDEscDJcbmV4cG9ydCBjb25zdCBwZXJwZW5kaWN1bGFyU2xvcGUgPSAocDEsIHAyKSA9PiB7XG4gIHJldHVybiAtMSAvIChNYXRoLnBvdyhzbG9wZShwMSwgcDIpLCAtMSkpO1xufVxuXG4vL2ludGVyc2VjdGlvbiBwb2ludCBvZiB0d28gbGluZXMgZGVmaW5lZCBieSBwMSxtMSBhbmQgcTEsbTJcbmV4cG9ydCBjb25zdCBpbnRlcnNlY3Rpb24gPSAocDEsIG0xLCBwMiwgbTIpID0+IHtcbiAgbGV0IGMxLCBjMiwgeCwgeTtcbiAgaWYgKCB0b0ZpeGVkKHAxLnksIDEwKSA9PSAwKSB7XG4gICAgeCA9IHAxLng7XG4gICAgeSA9IChtMikgKiAocDEueCAtIHAyLngpICsgcDIueTtcbiAgfVxuICBlbHNlIGlmICggdG9GaXhlZChwMi55LCAxMCkgPT0gMCkge1xuICAgIHggPSBwMi54O1xuICAgIHkgPSAobTEgKiAocDIueCAtIHAxLngpKSArIHAxLnk7XG4gIH0gZWxzZSB7XG4gICAgLy95IGludGVyY2VwdCBvZiBmaXJzdCBsaW5lXG4gICAgYzEgPSBwMS55IC0gbTEgKiBwMS54O1xuICAgIC8veSBpbnRlcmNlcHQgb2Ygc2Vjb25kIGxpbmVcbiAgICBjMiA9IHAyLnkgLSBtMiAqIHAyLng7XG5cbiAgICB4ID0gKGMyIC0gYzEpIC8gKG0xIC0gbTIpO1xuICAgIHkgPSBtMSAqIHggKyBjMTtcbiAgfVxuXG4gIHJldHVybiBuZXcgUG9pbnQoeCwgeSk7XG59XG5cbmV4cG9ydCBjb25zdCByYWRpYW5zID0gKGRlZ3JlZXMpID0+IHtcbiAgcmV0dXJuIChNYXRoLlBJIC8gMTgwKSAqIGRlZ3JlZXM7XG59XG5cbi8vZ2V0IHRoZSBjaXJjbGUgaW52ZXJzZSBvZiBhIHBvaW50IHAgd2l0aCByZXNwZWN0IGEgY2lyY2xlIHJhZGl1cyByIGNlbnRyZSBjXG5leHBvcnQgY29uc3QgaW52ZXJzZSA9IChwb2ludCwgY2lyY2xlKSA9PiB7XG4gIGNvbnN0IGMgPSBjaXJjbGUuY2VudHJlO1xuICBjb25zdCByID0gY2lyY2xlLnJhZGl1cztcbiAgY29uc3QgYWxwaGEgPSAociAqIHIpIC8gKE1hdGgucG93KHBvaW50LnggLSBjLngsIDIpICsgTWF0aC5wb3cocG9pbnQueSAtIGMueSwgMikpO1xuICByZXR1cm4gbmV3IFBvaW50KGFscGhhICogKHBvaW50LnggLSBjLngpICsgYy54LCBhbHBoYSAqIChwb2ludC55IC0gYy55KSArIGMueSk7XG59XG5cbi8vcmVmbGVjdCBwMyBhY3Jvc3MgdGhlIGxpbmUgZGVmaW5lZCBieSBwMSxwMlxuZXhwb3J0IGNvbnN0IGxpbmVSZWZsZWN0aW9uID0gKHAxLCBwMiwgcDMpID0+IHtcbiAgY29uc3QgbSA9IHNsb3BlKHAxLCBwMik7XG4gIC8vcmVmbGVjdGlvbiBpbiB5IGF4aXNcbiAgaWYgKG0gPiA5OTk5OTkgfHwgbSA8IC05OTk5OTkpIHtcbiAgICByZXR1cm4gbmV3IFBvaW50KCBwMy54LCAtcDMueSk7XG4gIH1cbiAgLy9yZWZsZWN0aW9uIGluIHggYXhpc1xuICBlbHNlIGlmICggdG9GaXhlZChtLCAxMCkgPT0gMCkge1xuICAgIHJldHVybiBuZXcgUG9pbnQoIC1wMy54LCBwMy55KTtcbiAgfVxuICAvL3JlZmxlY3Rpb24gaW4gYXJiaXRyYXJ5IGxpbmVcbiAgZWxzZSB7XG4gICAgY29uc3QgYyA9IHAxLnkgLSBtICogcDEueDtcbiAgICBjb25zdCBkID0gKHAzLnggKyAocDMueSAtIGMpICogbSkgLyAoMSArIG0gKiBtKTtcbiAgICBjb25zdCB4ID0gMiAqIGQgLSBwMy54O1xuICAgIGNvbnN0IHkgPSAyICogZCAqIG0gLSBwMy55ICsgMiAqIGM7XG4gICAgcmV0dXJuIG5ldyBQb2ludCh4LHkpO1xuICB9XG59XG5cbi8vY2FsY3VsYXRlIHRoZSByYWRpdXMgYW5kIGNlbnRyZSBvZiB0aGUgY2lyY2xlIHJlcXVpcmVkIHRvIGRyYXcgYSBsaW5lIGJldHdlZW5cbi8vdHdvIHBvaW50cyBpbiB0aGUgaHlwZXJib2xpYyBwbGFuZSBkZWZpbmVkIGJ5IHRoZSBkaXNrIChyLCBjKVxuZXhwb3J0IGNvbnN0IGdyZWF0Q2lyY2xlID0gKHAxLCBwMiwgY2lyY2xlKSA9PiB7XG4gIGNvbnN0IHAxSW52ZXJzZSA9IGludmVyc2UocDEsIGNpcmNsZSk7XG4gIGNvbnN0IHAySW52ZXJzZSA9IGludmVyc2UocDIsIGNpcmNsZSk7XG5cbiAgY29uc3QgbSA9IG1pZHBvaW50KHAxLCBwMUludmVyc2UpO1xuICBjb25zdCBuID0gbWlkcG9pbnQocDIsIHAySW52ZXJzZSk7XG5cbiAgY29uc3QgbTEgPSBwZXJwZW5kaWN1bGFyU2xvcGUobSwgcDFJbnZlcnNlKTtcbiAgY29uc3QgbTIgPSBwZXJwZW5kaWN1bGFyU2xvcGUobiwgcDJJbnZlcnNlKTtcblxuXG4gIC8vY2VudHJlIGlzIHRoZSBjZW50cmVwb2ludCBvZiB0aGUgY2lyY2xlIG91dCBvZiB3aGljaCB0aGUgYXJjIGlzIG1hZGVcbiAgY29uc3QgY2VudHJlID0gaW50ZXJzZWN0aW9uKG0sIG0xLCBuLCBtMik7XG4gIGNvbnN0IHJhZGl1cyA9IGRpc3RhbmNlKGNlbnRyZSwgcDEpO1xuXG4gIHJldHVybiBuZXcgQ2lyY2xlKGNlbnRyZS54LCBjZW50cmUueSwgcmFkaXVzKTtcbn1cblxuLy9pbnRlcnNlY3Rpb24gb2YgdHdvIGNpcmNsZXMgd2l0aCBlcXVhdGlvbnM6XG4vLyh4LWEpXjIgKyh5LWEpXjIgPSByMF4yXG4vLyh4LWIpXjIgKyh5LWMpXjIgPSByMV4yXG4vL05PVEUgYXNzdW1lcyB0aGUgdHdvIGNpcmNsZXMgRE8gaW50ZXJzZWN0IVxuZXhwb3J0IGNvbnN0IGNpcmNsZUludGVyc2VjdCA9IChjaXJjbGUwLCBjaXJjbGUxKSA9PiB7XG4gIGNvbnN0IGEgPSBjaXJjbGUwLmNlbnRyZS54O1xuICBjb25zdCBiID0gY2lyY2xlMC5jZW50cmUueTtcbiAgY29uc3QgYyA9IGNpcmNsZTEuY2VudHJlLng7XG4gIGNvbnN0IGQgPSBjaXJjbGUxLmNlbnRyZS55O1xuICBjb25zdCByMCA9IGNpcmNsZTAucmFkaXVzO1xuICBjb25zdCByMSA9IGNpcmNsZTEucmFkaXVzO1xuXG4gIGNvbnN0IGRpc3QgPSBNYXRoLnNxcnQoKGMgLSBhKSAqIChjIC0gYSkgKyAoZCAtIGIpICogKGQgLSBiKSk7XG5cbiAgY29uc3QgZGVsID0gTWF0aC5zcXJ0KChkaXN0ICsgcjAgKyByMSkgKiAoZGlzdCArIHIwIC0gcjEpICogKGRpc3QgLSByMCArIHIxKSAqICgtZGlzdCArIHIwICsgcjEpKSAvIDQ7XG5cbiAgY29uc3QgeFBhcnRpYWwgPSAoYSArIGMpIC8gMiArICgoYyAtIGEpICogKHIwICogcjAgLSByMSAqIHIxKSkgLyAoMiAqIGRpc3QgKiBkaXN0KTtcbiAgY29uc3QgeDEgPSB4UGFydGlhbCAtIDIgKiBkZWwgKiAoYiAtIGQpIC8gKGRpc3QgKiBkaXN0KTtcbiAgY29uc3QgeDIgPSB4UGFydGlhbCArIDIgKiBkZWwgKiAoYiAtIGQpIC8gKGRpc3QgKiBkaXN0KTtcblxuICBjb25zdCB5UGFydGlhbCA9IChiICsgZCkgLyAyICsgKChkIC0gYikgKiAocjAgKiByMCAtIHIxICogcjEpKSAvICgyICogZGlzdCAqIGRpc3QpO1xuICBjb25zdCB5MSA9IHlQYXJ0aWFsICsgMiAqIGRlbCAqIChhIC0gYykgLyAoZGlzdCAqIGRpc3QpO1xuICBjb25zdCB5MiA9IHlQYXJ0aWFsIC0gMiAqIGRlbCAqIChhIC0gYykgLyAoZGlzdCAqIGRpc3QpO1xuXG4gIGNvbnN0IHAxID0gbmV3IFBvaW50KHgxLHkxKTtcblxuICBjb25zdCBwMiA9IG5ldyBQb2ludCh4Mix5Mik7XG5cbiAgcmV0dXJuIHtcbiAgICBwMTogcDEsXG4gICAgcDI6IHAyXG4gIH07XG59XG5cbmV4cG9ydCBjb25zdCBjaXJjbGVMaW5lSW50ZXJzZWN0ID0gKGNpcmNsZSwgcDEsIHAyKSA9PiB7XG4gIGNvbnN0IGN4ID0gY2lyY2xlLmNlbnRyZS54O1xuICBjb25zdCBjeSA9IGNpcmNsZS5jZW50cmUueTtcbiAgY29uc3QgciA9IGNpcmNsZS5yYWRpdXM7XG5cbiAgY29uc3QgZCA9IGRpc3RhbmNlKHAxLCBwMik7XG4gIC8vdW5pdCB2ZWN0b3IgcDEgcDJcbiAgY29uc3QgZHggPSAocDIueCAtIHAxLngpIC8gZDtcbiAgY29uc3QgZHkgPSAocDIueSAtIHAxLnkpIC8gZDtcblxuICAvL3BvaW50IG9uIGxpbmUgY2xvc2VzdCB0byBjaXJjbGUgY2VudHJlXG4gIGNvbnN0IHQgPSBkeCAqIChjeCAtIHAxLngpICsgZHkgKiAoY3kgLSBwMS55KTtcbiAgY29uc3QgcCA9IG5ldyBQb2ludCh0ICogZHggKyBwMS54LCB0ICogZHkgKyBwMS55KTtcblxuICAvL2Rpc3RhbmNlIGZyb20gdGhpcyBwb2ludCB0byBjZW50cmVcbiAgY29uc3QgZDIgPSBkaXN0YW5jZShwLCBjaXJjbGUuY2VudHJlKTtcblxuICAvL2xpbmUgaW50ZXJzZWN0cyBjaXJjbGVcbiAgaWYgKGQyIDwgcikge1xuICAgIGNvbnN0IGR0ID0gTWF0aC5zcXJ0KHIgKiByIC0gZDIgKiBkMik7XG4gICAgLy9wb2ludCAxXG4gICAgY29uc3QgcTEgPSBuZXcgUG9pbnQoKHQgLSBkdCkgKiBkeCArIHAxLngsICh0IC0gZHQpICogZHkgKyBwMS55KTtcbiAgICAvL3BvaW50IDJcbiAgICBjb25zdCBxMiA9IG5ldyBQb2ludCgodCArIGR0KSAqIGR4ICsgcDEueCwodCArIGR0KSAqIGR5ICsgcDEueSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgcDE6IHExLFxuICAgICAgcDI6IHEyXG4gICAgfTtcbiAgfSBlbHNlIGlmIChkMiA9PT0gcikge1xuICAgIHJldHVybiBwO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yOiBsaW5lIGRvZXMgbm90IGludGVyc2VjdCBjaXJjbGUhJyk7XG4gIH1cbn1cblxuLy9hbmdsZSBpbiByYWRpYW5zIGJldHdlZW4gdHdvIHBvaW50cyBvbiBjaXJjbGUgb2YgcmFkaXVzIHJcbmV4cG9ydCBjb25zdCBjZW50cmFsQW5nbGUgPSAocDEsIHAyLCByKSA9PiB7XG4gIC8vcm91bmQgb2ZmIGVycm9yIGNhbiByZXN1bHQgaW4gdGhpcyBiZWluZyB2ZXJ5IHNsaWdodGx5IGdyZWF0ZXIgdGhhbiAxXG4gIGxldCB0ZW1wID0gKDAuNSAqIGRpc3RhbmNlKHAxLCBwMikgLyByKTtcbiAgdGVtcCA9IHRvRml4ZWQodGVtcCwxMCk7XG4gIGxldCByZXMgPSAyICogTWF0aC5hc2luKHRlbXApO1xuICBpZihpc05hTihyZXMpKSByZXMgPSAwO1xuICByZXR1cm4gcmVzO1xufVxuXG4vL2NhbGN1bGF0ZSB0aGUgbm9ybWFsIHZlY3RvciBnaXZlbiAyIHBvaW50c1xuZXhwb3J0IGNvbnN0IG5vcm1hbFZlY3RvciA9IChwMSwgcDIpID0+IHtcbiAgbGV0IGQgPSBNYXRoLnNxcnQoTWF0aC5wb3cocDIueCAtIHAxLngsIDIpICsgTWF0aC5wb3cocDIueSAtIHAxLnksIDIpKTtcbiAgcmV0dXJuIG5ldyBQb2ludCgocDIueCAtIHAxLngpIC8gZCwocDIueSAtIHAxLnkpIC8gZCk7XG59XG5cbi8vZG9lcyB0aGUgbGluZSBjb25uZWN0aW5nIHAxLCBwMiBnbyB0aHJvdWdoIHRoZSBwb2ludCAoMCwwKT9cbi8vbmVlZHMgdG8gdGFrZSBpbnRvIGFjY291bnQgcm91bmRvZmYgZXJyb3JzIHNvIHJldHVybnMgdHJ1ZSBpZlxuLy90ZXN0IGlzIGNsb3NlIHRvIDBcbmV4cG9ydCBjb25zdCB0aHJvdWdoT3JpZ2luID0gKHAxLCBwMikgPT4ge1xuICBpZiAocDEueCA9PT0gMCAmJiBwMi54ID09PSAwKSB7XG4gICAgLy92ZXJ0aWNhbCBsaW5lIHRocm91Z2ggY2VudHJlXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgY29uc3QgdGVzdCA9ICgtcDEueCAqIHAyLnkgKyBwMS54ICogcDEueSkgLyAocDIueCAtIHAxLngpICsgcDEueTtcblxuICBpZiAoIHRvRml4ZWQodGVzdCwgMTApID09IDApIHJldHVybiB0cnVlO1xuICBlbHNlIHJldHVybiBmYWxzZTtcbn1cblxuLy9maW5kIHRoZSBjZW50cm9pZCBvZiBhIG5vbi1zZWxmLWludGVyc2VjdGluZyBwb2x5Z29uXG5leHBvcnQgY29uc3QgY2VudHJvaWRPZlBvbHlnb24gPSAocG9pbnRzKSA9PiB7XG4gIGxldCBmaXJzdCA9IHBvaW50c1swXSxcbiAgICBsYXN0ID0gcG9pbnRzW3BvaW50cy5sZW5ndGggLSAxXTtcbiAgaWYgKGZpcnN0LnggIT0gbGFzdC54IHx8IGZpcnN0LnkgIT0gbGFzdC55KSBwb2ludHMucHVzaChmaXJzdCk7XG4gIGxldCB0d2ljZWFyZWEgPSAwLFxuICAgIHggPSAwLFxuICAgIHkgPSAwLFxuICAgIG5QdHMgPSBwb2ludHMubGVuZ3RoLFxuICAgIHAxLCBwMiwgZjtcbiAgZm9yICh2YXIgaSA9IDAsIGogPSBuUHRzIC0gMTsgaSA8IG5QdHM7IGogPSBpKyspIHtcbiAgICBwMSA9IHBvaW50c1tpXTtcbiAgICBwMiA9IHBvaW50c1tqXTtcbiAgICBmID0gcDEueCAqIHAyLnkgLSBwMi54ICogcDEueTtcbiAgICB0d2ljZWFyZWEgKz0gZjtcbiAgICB4ICs9IChwMS54ICsgcDIueCkgKiBmO1xuICAgIHkgKz0gKHAxLnkgKyBwMi55KSAqIGY7XG4gIH1cbiAgZiA9IHR3aWNlYXJlYSAqIDM7XG4gIHJldHVybiBuZXcgUG9pbnQoIHggLyBmLCB5IC8gZik7XG59XG5cbi8vZmluZCBhIHBvaW50IGF0IGEgZGlzdGFuY2UgZCBhbG9uZyB0aGUgY2lyY3VtZmVyZW5jZSBvZlxuLy9hIGNpcmNsZSBvZiByYWRpdXMgciwgY2VudHJlIGMgZnJvbSBhIHBvaW50IGFsc29cbi8vb24gdGhlIGNpcmN1bWZlcmVuY2VcbmV4cG9ydCBjb25zdCBzcGFjZWRQb2ludE9uQXJjID0gKGNpcmNsZSwgcG9pbnQsIHNwYWNpbmcpID0+IHtcbiAgY29uc3QgY29zVGhldGEgPSAtKChzcGFjaW5nICogc3BhY2luZykgLyAoMiAqIGNpcmNsZS5yYWRpdXMgKiBjaXJjbGUucmFkaXVzKSAtIDEpO1xuICBjb25zdCBzaW5UaGV0YVBvcyA9IE1hdGguc3FydCgxIC0gTWF0aC5wb3coY29zVGhldGEsIDIpKTtcbiAgY29uc3Qgc2luVGhldGFOZWcgPSAtc2luVGhldGFQb3M7XG5cbiAgY29uc3QgeFBvcyA9IGNpcmNsZS5jZW50cmUueCArIGNvc1RoZXRhICogKHBvaW50LnggLSBjaXJjbGUuY2VudHJlLngpIC0gc2luVGhldGFQb3MgKiAocG9pbnQueSAtIGNpcmNsZS5jZW50cmUueSk7XG4gIGNvbnN0IHhOZWcgPSBjaXJjbGUuY2VudHJlLnggKyBjb3NUaGV0YSAqIChwb2ludC54IC0gY2lyY2xlLmNlbnRyZS54KSAtIHNpblRoZXRhTmVnICogKHBvaW50LnkgLSBjaXJjbGUuY2VudHJlLnkpO1xuICBjb25zdCB5UG9zID0gY2lyY2xlLmNlbnRyZS55ICsgc2luVGhldGFQb3MgKiAocG9pbnQueCAtIGNpcmNsZS5jZW50cmUueCkgKyBjb3NUaGV0YSAqIChwb2ludC55IC0gY2lyY2xlLmNlbnRyZS55KTtcbiAgY29uc3QgeU5lZyA9IGNpcmNsZS5jZW50cmUueSArIHNpblRoZXRhTmVnICogKHBvaW50LnggLSBjaXJjbGUuY2VudHJlLngpICsgY29zVGhldGEgKiAocG9pbnQueSAtIGNpcmNsZS5jZW50cmUueSk7XG5cbiAgcmV0dXJuIHtcbiAgICBwMTogbmV3IFBvaW50KHhQb3MsIHlQb3MpLFxuICAgIHAyOiBuZXcgUG9pbnQoeE5lZyx5TmVnKVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCByYW5kb21GbG9hdCA9IChtaW4sIG1heCkgPT4ge1xuICByZXR1cm4gTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluO1xufVxuXG5leHBvcnQgY29uc3QgcmFuZG9tSW50ID0gKG1pbiwgbWF4KSA9PiB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkgKyBtaW4pO1xufVxuXG4vLy50b0ZpeGVkIHJldHVybnMgYSBzdHJpbmcgZm9yIHNvbWUgbm8gZG91YnQgdmVyeSBnb29kIHJlYXNvbi5cbi8vQ2hhbmdlIGl0IGJhY2sgdG8gYSBmbG9hdFxuZXhwb3J0IGNvbnN0IHRvRml4ZWQgPSAobnVtYmVyLCBwbGFjZXMpID0+IHtcbiAgcmV0dXJuIHBhcnNlRmxvYXQobnVtYmVyLnRvRml4ZWQocGxhY2VzKSk7XG59XG4iLCJpbXBvcnQgKiBhcyBFIGZyb20gJy4vZXVjbGlkJztcbmltcG9ydCB7IFBvaW50IH0gZnJvbSAnLi9wb2ludCc7XG4vLyAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyAqXG4vLyAqICAgSFlQRVJCT0xJQyBGVU5DVElPTlNcbi8vICogICBhIHBsYWNlIHRvIHN0YXNoIGFsbCB0aGUgZnVuY3Rpb25zIHRoYXQgYXJlIGh5cGVyYm9saWMgZ2VtZW9tZXRyaWNhbFxuLy8gKiAgIG9wZXJhdGlvbnNcbi8vICpcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuLy9jYWxjdWxhdGUgZ3JlYXRDaXJjbGUsIHN0YXJ0QW5nbGUgYW5kIGVuZEFuZ2xlIGZvciBoeXBlcmJvbGljIGFyY1xuLy9UT0RPIGRlYWwgd2l0aCBjYXNlIG9mIHN0YWlnaHQgbGluZXMgdGhyb3VnaCBjZW50cmVcbmV4cG9ydCBjb25zdCBhcmMgPSAocDEsIHAyLCBjaXJjbGUpID0+IHtcbiAgaWYgKEUudGhyb3VnaE9yaWdpbihwMSwgcDIpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNpcmNsZTogY2lyY2xlLFxuICAgICAgc3RhcnRBbmdsZTogMCxcbiAgICAgIGVuZEFuZ2xlOiAwLFxuICAgICAgY2xvY2t3aXNlOiBmYWxzZSxcbiAgICAgIHN0cmFpZ2h0TGluZTogdHJ1ZSxcbiAgICB9XG4gIH1cbiAgbGV0IGNsb2Nrd2lzZSA9IGZhbHNlO1xuICBsZXQgYWxwaGExLCBhbHBoYTIsIHN0YXJ0QW5nbGUsIGVuZEFuZ2xlO1xuICBjb25zdCBjID0gRS5ncmVhdENpcmNsZShwMSwgcDIsIGNpcmNsZSk7XG4gIGNvbnN0IG95ID0gYy5jZW50cmUueTtcbiAgY29uc3Qgb3ggPSBjLmNlbnRyZS54O1xuXG4gIC8vcG9pbnQgYXQgMCByYWRpYW5zIG9uIGNcbiAgY29uc3QgcDMgPSBuZXcgUG9pbnQoIG94ICsgYy5yYWRpdXMsIG95KTtcblxuICAvL2NhbGN1bGF0ZSB0aGUgcG9zaXRpb24gb2YgZWFjaCBwb2ludCBpbiB0aGUgY2lyY2xlXG4gIGFscGhhMSA9IEUuY2VudHJhbEFuZ2xlKHAzLCBwMSwgYy5yYWRpdXMpO1xuICBhbHBoYTIgPSBFLmNlbnRyYWxBbmdsZShwMywgcDIsIGMucmFkaXVzKTtcblxuICBhbHBoYTEgPSAocDEueSA8IG95KSA/IDIgKiBNYXRoLlBJIC0gYWxwaGExIDogYWxwaGExO1xuICBhbHBoYTIgPSAocDIueSA8IG95KSA/IDIgKiBNYXRoLlBJIC0gYWxwaGEyIDogYWxwaGEyO1xuXG4gIC8vY2FzZSB3aGVyZSBwMSBhYm92ZSBhbmQgcDIgYmVsb3cgb3Igb24gdGhlIGxpbmUgYy5jZW50cmUgLT4gcDNcbiAgaWYgKChwMS54ID49IG94ICYmIHAyLnggPj0gb3gpICYmIChwMS55IDw9IG95ICYmIHAyLnkgPj0gb3kpKSB7XG4gICAgc3RhcnRBbmdsZSA9IGFscGhhMTtcbiAgICBlbmRBbmdsZSA9IGFscGhhMjtcbiAgfVxuICAvL2Nhc2Ugd2hlcmUgcDIgYWJvdmUgYW5kIHAxIGJlbG93IG9yIG9uIHRoZSBsaW5lIGMuY2VudHJlIC0+IHAzXG4gIGVsc2UgaWYgKChwMS54ID49IG94ICYmIHAyLnggPj0gb3gpICYmIChwMS55ID49IG95ICYmIHAyLnkgPD0gb3kpKSB7XG4gICAgc3RhcnRBbmdsZSA9IGFscGhhMjtcbiAgICBlbmRBbmdsZSA9IGFscGhhMTtcbiAgICBjbG9ja3dpc2UgPSB0cnVlO1xuICB9XG4gIC8vcG9pbnRzIGluIGNsb2Nrd2lzZSBvcmRlclxuICBlbHNlIGlmIChhbHBoYTEgPiBhbHBoYTIpIHtcbiAgICBzdGFydEFuZ2xlID0gYWxwaGEyO1xuICAgIGVuZEFuZ2xlID0gYWxwaGExO1xuICAgIGNsb2Nrd2lzZSA9IHRydWU7XG4gIH1cbiAgLy9wb2ludHMgaW4gYW50aWNsb2Nrd2lzZSBvcmRlclxuICBlbHNlIHtcbiAgICBzdGFydEFuZ2xlID0gYWxwaGExO1xuICAgIGVuZEFuZ2xlID0gYWxwaGEyO1xuICB9XG4gIC8vY29uc29sZS5sb2coc3RhcnRBbmdsZSwgZW5kQW5nbGUpO1xuICByZXR1cm4ge1xuICAgIGNpcmNsZTogYyxcbiAgICBzdGFydEFuZ2xlOiBzdGFydEFuZ2xlLFxuICAgIGVuZEFuZ2xlOiBlbmRBbmdsZSxcbiAgICBjbG9ja3dpc2U6IGNsb2Nrd2lzZSxcbiAgICBzdHJhaWdodExpbmU6IGZhbHNlLFxuICB9XG59XG5cbi8vdHJhbnNsYXRlIGEgc2V0IG9mIHBvaW50cyBhbG9uZyB0aGUgeCBheGlzXG5leHBvcnQgY29uc3QgdHJhbnNsYXRlWCA9IChwb2ludHNBcnJheSwgZGlzdGFuY2UpID0+IHtcbiAgY29uc3QgbCA9IHBvaW50c0FycmF5Lmxlbmd0aDtcbiAgY29uc3QgbmV3UG9pbnRzID0gW107XG4gIGNvbnN0IGUgPSBNYXRoLnBvdyhNYXRoLkUsIGRpc3RhbmNlKTtcbiAgY29uc3QgcG9zID0gZSArIDE7XG4gIGNvbnN0IG5lZyA9IGUgLSAxO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgIGNvbnN0IHggPSBwb3MgKiBwb2ludHNBcnJheVtpXS54ICsgbmVnICogcG9pbnRzQXJyYXlbaV0ueTtcbiAgICBjb25zdCB5ID0gbmVnICogcG9pbnRzQXJyYXlbaV0ueCArIHBvcyAqIHBvaW50c0FycmF5W2ldLnk7XG4gICAgbmV3UG9pbnRzLnB1c2goIG5ldyBQb2ludCh4LHkpKTtcbiAgfVxuICByZXR1cm4gbmV3UG9pbnRzO1xufVxuXG4vL3JvdGF0ZSBhIHNldCBvZiBwb2ludHMgYWJvdXQgYSBwb2ludCBieSBhIGdpdmVuIGFuZ2xlXG4vL2Nsb2Nrd2lzZSBkZWZhdWx0cyB0byBmYWxzZVxuZXhwb3J0IGNvbnN0IHJvdGF0aW9uID0gKHBvaW50c0FycmF5LCBwb2ludCwgYW5nbGUsIGNsb2Nrd2lzZSkgPT4ge1xuXG59XG5cbi8vcmVmbGVjdCBhIHNldCBvZiBwb2ludHMgYWNyb3NzIGEgaHlwZXJib2xpYyBhcmNcbi8vVE9ETyBhZGQgY2FzZSB3aGVyZSByZWZsZWN0aW9uIGlzIGFjcm9zcyBzdHJhaWdodCBsaW5lXG5leHBvcnQgY29uc3QgcmVmbGVjdCA9IChwb2ludHNBcnJheSwgcDEsIHAyLCBjaXJjbGUpID0+IHtcbiAgY29uc3QgbCA9IHBvaW50c0FycmF5Lmxlbmd0aDtcbiAgY29uc3QgYSA9IGFyYyhwMSwgcDIsIGNpcmNsZSk7XG4gIGNvbnN0IG5ld1BvaW50cyA9IFtdO1xuXG4gIGlmICghYS5zdHJhaWdodExpbmUpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgbmV3UG9pbnRzLnB1c2goRS5pbnZlcnNlKHBvaW50c0FycmF5W2ldLCBhLmNpcmNsZSkpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgbmV3UG9pbnRzLnB1c2goRS5saW5lUmVmbGVjdGlvbihwMSxwMixwb2ludHNBcnJheVtpXSkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbmV3UG9pbnRzO1xufVxuXG5leHBvcnQgY29uc3QgcG9pbmNhcmVUb1dlaWVyc3RyYXNzID0gKHBvaW50MkQpID0+IHtcbiAgY29uc3QgZmFjdG9yID0gMSAvICgxIC0gcG9pbnQyRC54ICogcG9pbnQyRC54IC0gcG9pbnQyRC55ICogcG9pbnQyRC55KTtcbiAgcmV0dXJuIHtcbiAgICB4OiAyICogZmFjdG9yICogcG9pbnQyRC54LFxuICAgIHk6IDIgKiBmYWN0b3IgKiBwb2ludDJELnksXG4gICAgejogZmFjdG9yICogKDEgKyBwb2ludDJELnggKiBwb2ludDJELnggKyBwb2ludDJELnkgKiBwb2ludDJELnkpXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHdlaWVyc3RyYXNzVG9Qb2luY2FyZSA9IChwb2ludDNEKSA9PiB7XG4gIGNvbnN0IGZhY3RvciA9IDEgLyAoMSArIHBvaW50M0Queik7XG4gIHJldHVybiBuZXcgUG9pbnQoZmFjdG9yICogcG9pbnQzRC54LGZhY3RvciAqIHBvaW50M0QueSk7XG59XG5cbmV4cG9ydCBjb25zdCByb3RhdGVBYm91dE9yaWdpbldlaWVyc3RyYXNzID0gKHBvaW50M0QsIGFuZ2xlKSA9PiB7XG4gIHJldHVybiB7XG4gICAgeDogTWF0aC5jb3MoYW5nbGUpICogcG9pbnQzRC54IC0gTWF0aC5zaW4oYW5nbGUpICogcG9pbnQzRC55LFxuICAgIHk6IE1hdGguc2luKGFuZ2xlKSAqIHBvaW50M0QueCArIE1hdGguY29zKGFuZ2xlKSAqIHBvaW50M0QueSxcbiAgICB6OiBwb2ludDNELnpcbiAgfVxufVxuXG5leHBvcnQgY29uc3Qgcm90YXRlQWJvdXRPcmlnaW4gPSAocG9pbnQyRCwgYW5nbGUpID0+IHtcbiAgcmV0dXJuIG5ldyBQb2ludChNYXRoLmNvcyhhbmdsZSkgKiBwb2ludDJELnggLSBNYXRoLnNpbihhbmdsZSkgKiBwb2ludDJELnksXG4gICAgIE1hdGguc2luKGFuZ2xlKSAqIHBvaW50MkQueCArIE1hdGguY29zKGFuZ2xlKSAqIHBvaW50MkQueSk7XG59XG5cbmV4cG9ydCBjb25zdCByb3RhdGVQZ29uQWJvdXRPcmlnaW4gPSAocG9pbnRzMkRBcnJheSwgYW5nbGUpID0+IHtcbiAgY29uc3QgbCA9IHBvaW50czJEQXJyYXkubGVuZ3RoO1xuICBjb25zdCByb3RhdGVkUG9pbnRzMkRBcnJheSA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgIGxldCBwb2ludCA9IHJvdGF0ZUFib3V0T3JpZ2luKHBvaW50czJEQXJyYXlbaV0sIGFuZ2xlKTtcbiAgICByb3RhdGVkUG9pbnRzMkRBcnJheS5wdXNoKHBvaW50KTtcbiAgfVxuICByZXR1cm4gcm90YXRlZFBvaW50czJEQXJyYXk7XG59XG5cbi8vd2hlbiB0aGUgcG9pbnQgcDEgaXMgdHJhbnNsYXRlZCB0byB0aGUgb3JpZ2luLCB0aGUgcG9pbnQgcDJcbi8vaXMgdHJhbnNsYXRlZCBhY2NvcmRpbmcgdG8gdGhpcyBmb3JtdWxhXG4vL2h0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL1BvaW5jYXIlQzMlQTlfZGlza19tb2RlbCNJc29tZXRyaWNfVHJhbnNmb3JtYXRpb25zXG5leHBvcnQgY29uc3QgdHJhbnNsYXRlUG9pbmNhcmUgPSAocDEsIHAyKSA9PiB7XG4gIGNvbnN0IGRvdCA9IHAxLnggKiBwMi54ICsgcDEueSAqIHAyLnk7XG4gIGNvbnN0IG5vcm1TcXVhcmVkUDEgPSBNYXRoLnBvdyhNYXRoLnNxcnQocDEueCAqIHAxLnggKyBwMS55ICogcDEueSksIDIpO1xuICBjb25zdCBub3JtU3F1YXJlZFAyID0gTWF0aC5wb3coTWF0aC5zcXJ0KHAyLnggKiBwMi54ICsgcDIueSAqIHAyLnkpLCAyKTtcbiAgY29uc3QgZGVub21pbmF0b3IgPSAxICsgMiAqIGRvdCArIG5vcm1TcXVhcmVkUDEgKiBub3JtU3F1YXJlZFAyO1xuXG4gIGNvbnN0IHAxRmFjdG9yID0gKDEgKyAyICogZG90ICsgbm9ybVNxdWFyZWRQMikgLyBkZW5vbWluYXRvcjtcbiAgY29uc3QgcDJGYWN0b3IgPSAoMSAtIG5vcm1TcXVhcmVkUDEpIC8gZGVub21pbmF0b3I7XG5cbiAgY29uc3QgeCA9IHAxRmFjdG9yICogcDEueCArIHAyRmFjdG9yICogcDIueDtcbiAgY29uc3QgeSA9IHAxRmFjdG9yICogcDEueSArIHAyRmFjdG9yICogcDIueTtcblxuICByZXR1cm4gbmV3IFBvaW50KHgseSk7XG59XG5cbmV4cG9ydCBjb25zdCBpbnZlcnNlVHJhbnNsYXRlUG9pbmNhcmUgPSAocDEsIHAyKSA9PiB7XG5cbn1cbiIsImltcG9ydCAqIGFzIEUgZnJvbSAnLi9ldWNsaWQnO1xuLy9UT0RPIGNyZWF0ZSBjaXJjbGUgY2xhc3MgYW5kIHJlZmFjdG9yXG4vL1RPRE8gd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnKTsgbm90IHdvcmtpbmcgaW4gZmlyZWZveFxuLy9UT0RPIGFwcGFyZW50bHkgLnRvRml4ZWQoKSByZXR1cm5zIGEgc3RyaW5nXG5cbmltcG9ydCB7IFJlZ3VsYXJUZXNzZWxhdGlvbiB9IGZyb20gJy4vcmVndWxhclRlc3NlbGF0aW9uJztcblxuLy8gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gKlxuLy8gKiAgIFNFVFVQXG4vLyAqXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbmNvbnN0IHRlc3NlbGF0aW9uID0gbmV3IFJlZ3VsYXJUZXNzZWxhdGlvbihFLnJhbmRvbUludCg0LDEyKSwgRS5yYW5kb21JbnQoNCwxMikpO1xuLy9jb25zdCB0ZXNzZWxhdGlvbiA9IG5ldyBSZWd1bGFyVGVzc2VsYXRpb24oNiwgMTIpO1xuIiwiaW1wb3J0ICogYXMgRSBmcm9tICcuL2V1Y2xpZCc7XG4vLyAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyAqXG4vLyAqICAgUE9JTlQgQ0xBU1Ncbi8vICogICAyZCBwb2ludCBjbGFzc1xuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG5leHBvcnQgY2xhc3MgUG9pbnR7XG4gIGNvbnN0cnVjdG9yKHgsIHkpe1xuICAgIGlmKEUudG9GaXhlZCh4ICwgMTApID09IDApe1xuICAgICAgeCA9IDA7XG4gICAgfVxuICAgIGlmKEUudG9GaXhlZCh5ICwgMTApID09IDApe1xuICAgICAgeSA9IDA7XG4gICAgfVxuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgfVxuXG4gIHRvRml4ZWQocGxhY2VzKXtcbiAgICB0aGlzLnggPSBFLnRvRml4ZWQodGhpcy54LCBwbGFjZXMpO1xuICAgIHRoaXMueSA9IEUudG9GaXhlZCh0aGlzLnksIHBsYWNlcyk7XG4gIH1cblxuICAvL2NvbXBhcmUgdHdvIHBvaW50cyB0YWtpbmcgcm91bmRpbmcgZXJyb3JzIGludG8gYWNjb3VudFxuICBjb21wYXJlKHAyKXtcbiAgICBpZiAodHlwZW9mIHAyID09PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc29sZS53YXJuKCdXYXJuaW5nOiBwb2ludCBub3QgZGVmaW5lZC4nKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCB0MSA9IHRoaXMudG9GaXhlZCgxMCk7XG4gICAgY29uc3QgdDIgPSBwMi50b0ZpeGVkKDEwKTtcblxuICAgIGlmIChwMS54ID09PSBwMi54ICYmIHAxLnkgPT09IHAyLnkpIHJldHVybiB0cnVlO1xuICAgIGVsc2UgcmV0dXJuIGZhbHNlO1xuICB9XG5cbn1cbiIsImltcG9ydCAqIGFzIEUgZnJvbSAnLi9ldWNsaWQnO1xuaW1wb3J0ICogYXMgSCBmcm9tICcuL2h5cGVyYm9saWMnO1xuaW1wb3J0IHsgUG9pbnQgfSBmcm9tICcuL3BvaW50JztcbmltcG9ydCB7XG4gIERpc2tcbn1cbmZyb20gJy4vZGlzayc7XG5cbmltcG9ydCB7XG4gIENpcmNsZVxufVxuZnJvbSAnLi9jaXJjbGUnO1xuXG5cbi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICogICAgVEVTU0VMQVRJT04gQ0xBU1Ncbi8vICogICAgQ3JlYXRlcyBhIHJlZ3VsYXIgVGVzc2VsYXRpb24gb2YgdGhlIFBvaW5jYXJlIERpc2tcbi8vICogICAgcTogbnVtYmVyIG9mIHAtZ29ucyBtZWV0aW5nIGF0IGVhY2ggdmVydGV4XG4vLyAqICAgIHA6IG51bWJlciBvZiBzaWRlcyBvZiBwLWdvblxuLy8gKiAgICB1c2luZyB0aGUgdGVjaG5pcXVlcyBjcmVhdGVkIGJ5IENveGV0ZXIgYW5kIER1bmhhbVxuLy8gKlxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuZXhwb3J0IGNsYXNzIFJlZ3VsYXJUZXNzZWxhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHAsIHEsIHJvdGF0aW9uLCBjb2xvdXIsIG1heExheWVycykge1xuICAgIHRoaXMuZGlzayA9IG5ldyBEaXNrKCk7XG5cbiAgICB0aGlzLnAgPSBwO1xuICAgIHRoaXMucSA9IHE7XG4gICAgdGhpcy5jb2xvdXIgPSBjb2xvdXIgfHwgJ2JsYWNrJztcbiAgICB0aGlzLnJvdGF0aW9uID0gcm90YXRpb24gfHwgMDtcbiAgICB0aGlzLm1heExheWVycyA9IG1heExheWVycyB8fCA1O1xuXG4gICAgaWYgKHRoaXMuY2hlY2tQYXJhbXMoKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGV2ZW50KSA9PiB7XG4gICAgICAvL3dpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJyk7XG4gICAgICB0aGlzLmluaXQoKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgdGhpcy5pbml0KCk7XG4gICAgfSwgZmFsc2UpO1xuXG5cblxuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLmZyID0gdGhpcy5mdW5kYW1lbnRhbFJlZ2lvbigpO1xuICAgIHRoaXMudGVzdGluZygpO1xuICB9XG5cbiAgdGVzdGluZygpIHtcbiAgICBsZXQgd2lyZWZyYW1lID0gZmFsc2U7XG4gICAgd2lyZWZyYW1lID0gdHJ1ZTtcblxuICAgIGxldCBwMSA9IG5ldyBQb2ludCgtMjM5LjU1MDUxNzY0NDk4LCAyMzkuNTUwNTE3NjQ0OTgwMzUpO1xuICAgIGxldCBwMiA9IG5ldyBQb2ludCgtMjcwLjE0Mzk1NzE5Nzg4NzIsIDIxNy4xNTQ1NjU1MTM5NjQ2Myk7XG5cbiAgICAvL3RoaXMuZGlzay5kcmF3QXJjKHAxLHAyLCA0NTM0ODc3NCk7XG5cblxuICAgIC8vdGhpcy5kaXNrLnBvbHlnb24odGhpcy5mciwgRS5yYW5kb21JbnQoMTAwMDAsIDE0Nzc3MjE1KSwgJycsIHdpcmVmcmFtZSk7XG4gICAgY29uc3QgcG9seTIgPSBILnJlZmxlY3QodGhpcy5mciwgdGhpcy5mclsxXSwgdGhpcy5mclsyXSwgdGhpcy5kaXNrLmNpcmNsZSk7XG4gICAgLy90aGlzLmRpc2sucG9seWdvbihwb2x5MiwgRS5yYW5kb21JbnQoMTAwMDAsIDE0Nzc3MjE1KSk7XG5cbiAgICBjb25zdCBwb2x5MyA9IEgucmVmbGVjdChwb2x5MiwgcG9seTJbMF0sIHBvbHkyWzFdLCB0aGlzLmRpc2suY2lyY2xlKTtcbiAgICAvL3RoaXMuZGlzay5wb2x5Z29uKHBvbHkzLCBFLnJhbmRvbUludCgxMDAwMCwgMTQ3NzcyMTUpLCAnJywgd2lyZWZyYW1lKTtcblxuICAgIGNvbnN0IHBvbHk0ID0gSC5yZWZsZWN0KHBvbHkzLCBwb2x5M1syXSwgcG9seTNbMF0sIHRoaXMuZGlzay5jaXJjbGUpO1xuICAgIC8vdGhpcy5kaXNrLnBvbHlnb24ocG9seTQsIEUucmFuZG9tSW50KDEwMDAwLCAxNDc3NzIxNSksICcnLCB3aXJlZnJhbWUpO1xuXG4gICAgY29uc3QgcG9seTUgPSBILnJlZmxlY3QocG9seTQsIHBvbHk0WzFdLCBwb2x5NFswXSwgdGhpcy5kaXNrLmNpcmNsZSk7XG4gICAgLy90aGlzLmRpc2sucG9seWdvbihwb2x5NSwgRS5yYW5kb21JbnQoMTAwMDAsIDE0Nzc3MjE1KSwgJycsIHdpcmVmcmFtZSk7XG5cbiAgICBjb25zdCBwb2x5NiA9IEgucmVmbGVjdChwb2x5MywgcG9seTNbMl0sIHBvbHkzWzFdLCB0aGlzLmRpc2suY2lyY2xlKTtcbiAgICAvL3RoaXMuZGlzay5wb2x5Z29uKHBvbHk2LCBFLnJhbmRvbUludCgxMDAwMCwgMTQ3NzcyMTUpLCAnJywgd2lyZWZyYW1lKTtcblxuICAgIGNvbnN0IHBvbHk3ID0gSC5yZWZsZWN0KHBvbHk2LCBwb2x5NlswXSwgcG9seTZbMl0sIHRoaXMuZGlzay5jaXJjbGUpO1xuICAgIC8vdGhpcy5kaXNrLnBvbHlnb24ocG9seTcsIEUucmFuZG9tSW50KDEwMDAwLCAxNDc3NzIxNSksICcnLCB3aXJlZnJhbWUpO1xuXG4gICAgY29uc3QgcG9seTggPSBILnJlZmxlY3QocG9seTYsIHBvbHk2WzBdLCBwb2x5NlsxXSwgdGhpcy5kaXNrLmNpcmNsZSk7XG4gICAgLy90aGlzLmRpc2sucG9seWdvbihwb2x5OCwgRS5yYW5kb21JbnQoMTAwMDAsIDE0Nzc3MjE1KSwgJycsIHdpcmVmcmFtZSk7XG5cbiAgICBjb25zdCBwb2x5OSA9IEgucmVmbGVjdChwb2x5NywgcG9seTdbMF0sIHBvbHk3WzFdLCB0aGlzLmRpc2suY2lyY2xlKTtcbiAgICAvL3RoaXMuZGlzay5wb2x5Z29uKHBvbHk5LCBFLnJhbmRvbUludCgxMDAwMCwgMTQ3NzcyMTUpLCAnJywgd2lyZWZyYW1lKTtcblxuICAgIGxldCBudW0gPSB0aGlzLnAqMjtcbiAgICBmb3IobGV0IGkgPTA7IGkgPCBudW07IGkrKyl7XG4gICAgICBsZXQgcG9seSA9IEgucm90YXRlUGdvbkFib3V0T3JpZ2luKHRoaXMuZnIsICgyKk1hdGguUEkvbnVtKSooaSsxKSk7XG4gICAgICB0aGlzLmRpc2sucG9seWdvbihwb2x5LCBFLnJhbmRvbUludCgxMDAwMCwgMTQ3NzcyMTUpLCAnJywgd2lyZWZyYW1lKTtcbiAgICAgIHBvbHkgPSBILnJvdGF0ZVBnb25BYm91dE9yaWdpbihwb2x5MiwgKDIqTWF0aC5QSS9udW0pKihpKzEpKTtcbiAgICAgIHRoaXMuZGlzay5wb2x5Z29uKHBvbHksIEUucmFuZG9tSW50KDEwMDAwLCAxNDc3NzIxNSksICcnLCB3aXJlZnJhbWUpO1xuICAgICAgcG9seSA9IEgucm90YXRlUGdvbkFib3V0T3JpZ2luKHBvbHkzLCAoMipNYXRoLlBJL251bSkqKGkrMSkpO1xuICAgICAgdGhpcy5kaXNrLnBvbHlnb24ocG9seSwgRS5yYW5kb21JbnQoMTAwMDAsIDE0Nzc3MjE1KSwgJycsIHdpcmVmcmFtZSk7XG4gICAgICBwb2x5ID0gSC5yb3RhdGVQZ29uQWJvdXRPcmlnaW4ocG9seTQsICgyKk1hdGguUEkvbnVtKSooaSsxKSk7XG4gICAgICB0aGlzLmRpc2sucG9seWdvbihwb2x5LCBFLnJhbmRvbUludCgxMDAwMCwgMTQ3NzcyMTUpLCAnJywgd2lyZWZyYW1lKTtcbiAgICAgIHBvbHkgPSBILnJvdGF0ZVBnb25BYm91dE9yaWdpbihwb2x5NSwgKDIqTWF0aC5QSS9udW0pKihpKzEpKTtcbiAgICAgIHRoaXMuZGlzay5wb2x5Z29uKHBvbHksIEUucmFuZG9tSW50KDEwMDAwLCAxNDc3NzIxNSksICcnLCB3aXJlZnJhbWUpO1xuICAgICAgcG9seSA9IEgucm90YXRlUGdvbkFib3V0T3JpZ2luKHBvbHk2LCAoMipNYXRoLlBJL251bSkqKGkrMSkpO1xuICAgICAgdGhpcy5kaXNrLnBvbHlnb24ocG9seSwgRS5yYW5kb21JbnQoMTAwMDAsIDE0Nzc3MjE1KSwgJycsIHdpcmVmcmFtZSk7XG4gICAgICBwb2x5ID0gSC5yb3RhdGVQZ29uQWJvdXRPcmlnaW4ocG9seTcsICgyKk1hdGguUEkvbnVtKSooaSsxKSk7XG4gICAgICB0aGlzLmRpc2sucG9seWdvbihwb2x5LCBFLnJhbmRvbUludCgxMDAwMCwgMTQ3NzcyMTUpLCAnJywgd2lyZWZyYW1lKTtcbiAgICAgIHBvbHkgPSBILnJvdGF0ZVBnb25BYm91dE9yaWdpbihwb2x5OCwgKDIqTWF0aC5QSS9udW0pKihpKzEpKTtcbiAgICAgIHRoaXMuZGlzay5wb2x5Z29uKHBvbHksIEUucmFuZG9tSW50KDEwMDAwLCAxNDc3NzIxNSksICcnLCB3aXJlZnJhbWUpO1xuICAgICAgcG9seSA9IEgucm90YXRlUGdvbkFib3V0T3JpZ2luKHBvbHk5LCAoMipNYXRoLlBJL251bSkqKGkrMSkpO1xuICAgICAgdGhpcy5kaXNrLnBvbHlnb24ocG9seSwgRS5yYW5kb21JbnQoMTAwMDAsIDE0Nzc3MjE1KSwgJycsIHdpcmVmcmFtZSk7XG4gICAgfVxuXG4gIH1cblxuICAvL2NhbGN1bGF0ZSBmaXJzdCBwb2ludCBvZiBmdW5kYW1lbnRhbCBwb2x5Z29uIHVzaW5nIENveGV0ZXIncyBtZXRob2RcbiAgZnVuZGFtZW50YWxSZWdpb24oKSB7XG4gICAgY29uc3QgcmFkaXVzID0gdGhpcy5kaXNrLmNpcmNsZS5yYWRpdXM7XG4gICAgY29uc3QgcyA9IE1hdGguc2luKE1hdGguUEkgLyB0aGlzLnApO1xuICAgIGNvbnN0IHQgPSBNYXRoLmNvcyhNYXRoLlBJIC8gdGhpcy5xKTtcbiAgICAvL211bHRpcGx5IHRoZXNlIGJ5IHRoZSBkaXNrcyByYWRpdXMgKENveGV0ZXIgdXNlZCB1bml0IGRpc2spO1xuICAgIGNvbnN0IHIgPSAxIC8gTWF0aC5zcXJ0KCh0ICogdCkgLyAocyAqIHMpIC0gMSkgKiByYWRpdXM7XG4gICAgY29uc3QgZCA9IDEgLyBNYXRoLnNxcnQoMSAtIChzICogcykgLyAodCAqIHQpKSAqIHJhZGl1cztcbiAgICBjb25zdCBiID0gbmV3IFBvaW50KHJhZGl1cyAqIE1hdGguY29zKE1hdGguUEkgLyB0aGlzLnApLFxuICAgIC1yYWRpdXMgKiBNYXRoLnNpbihNYXRoLlBJIC8gdGhpcy5wKSk7XG5cbiAgICBjb25zdCBjaXJjbGUgPSBuZXcgQ2lyY2xlKGQsIDAsIHIpO1xuXG4gICAgLy90aGVyZSB3aWxsIGJlIHR3byBwb2ludHMgb2YgaW50ZXJzZWN0aW9uLCBvZiB3aGljaCB3ZSB3YW50IHRoZSBmaXJzdFxuICAgIGNvbnN0IHAxID0gRS5jaXJjbGVMaW5lSW50ZXJzZWN0KGNpcmNsZSwgdGhpcy5kaXNrLmNlbnRyZSwgYikucDE7XG5cbiAgICBjb25zdCBwMiA9IG5ldyBQb2ludChkLXIsMCk7XG5cbiAgICBjb25zdCBwb2ludHMgPSBbdGhpcy5kaXNrLmNlbnRyZSwgcDEsIHAyXTtcblxuICAgIHJldHVybiBwb2ludHM7XG4gIH1cblxuICAvL1RoZSB0ZXNzZWxhdGlvbiByZXF1aXJlcyB0aGF0IChwLTIpKHEtMikgPiA0IHRvIHdvcmsgKG90aGVyd2lzZSBpdCBpc1xuICAvLyBlaXRoZXIgYW4gZWxsaXB0aWNhbCBvciBldWNsaWRlYW4gdGVzc2VsYXRpb24pO1xuICAvL0ZvciBub3cgYWxzbyByZXF1aXJlIHAscSA+IDMsIGFzIHRoZXNlIGFyZSBzcGVjaWFsIGNhc2VzXG4gIGNoZWNrUGFyYW1zKCkge1xuICAgIGlmICh0aGlzLm1heExheWVycyA8IDAgfHwgaXNOYU4odGhpcy5tYXhMYXllcnMpKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdtYXhMYXllcnMgbXVzdCBiZSBncmVhdGVyIHRoYW4gMCcpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIGlmICgodGhpcy5wIC0gMikgKiAodGhpcy5xIC0gMikgPD0gNCkge1xuICAgICAgY29uc29sZS5lcnJvcignSHlwZXJib2xpYyB0ZXNzZWxhdGlvbnMgcmVxdWlyZSB0aGF0IChwLTEpKHEtMikgPCA0IScpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8vVE9ETyBpbXBsZW1lbnQgc3BlY2lhbCBjYXNlcyBmb3IgcSA9IDMgb3IgcCA9IDNcbiAgICBlbHNlIGlmICh0aGlzLnEgPD0gMyB8fCBpc05hTih0aGlzLnEpKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdUZXNzZWxhdGlvbiBlcnJvcjogYXQgbGVhc3QgMyBwLWdvbnMgbXVzdCBtZWV0IFxcXG4gICAgICAgICAgICAgICAgICAgIGF0IGVhY2ggdmVydGV4IScpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIGlmICh0aGlzLnAgPD0gMyB8fCBpc05hTih0aGlzLnApKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdUZXNzZWxhdGlvbiBlcnJvcjogcG9seWdvbiBuZWVkcyBhdCBsZWFzdCAzIHNpZGVzIScpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbn1cbiIsIi8vTk9URSB3aWxsIGdpdmUgYSB3YXJuaW5nOiAgVG9vIG1hbnkgYWN0aXZlIFdlYkdMIGNvbnRleHRzXG4vL2FmdGVyIHJlc2l6aW5nIDE2IHRpbWVzLiBUaGlzIGlzIGEgYnVnIGluIHRocmVlanMgYW5kIGNhbiBiZSBzYWZlbHkgaWdub3JlZC5cbi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICpcbi8vICogIFRIUkVFIEpTIENMQVNTXG4vLyAqXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5leHBvcnQgY2xhc3MgVGhyZWVKUyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZXZlbnQpID0+IHtcbiAgICAgIC8vd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnKTtcbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH0sIGZhbHNlKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XG4gICAgICB0aGlzLnJlc2V0KCk7XG4gICAgfSwgZmFsc2UpO1xuXG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcbiAgICB0aGlzLmluaXRDYW1lcmEoKTtcblxuICAgIHRoaXMuaW5pdExpZ2h0aW5nKCk7XG5cbiAgICB0aGlzLmF4ZXMoKTtcblxuICAgIHRoaXMuaW5pdFJlbmRlcmVyKCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLmlkKTsgLy8gU3RvcCB0aGUgYW5pbWF0aW9uXG4gICAgdGhpcy5zY2VuZSA9IG51bGw7XG4gICAgdGhpcy5wcm9qZWN0b3IgPSBudWxsO1xuICAgIHRoaXMuY2FtZXJhID0gbnVsbDtcbiAgICB0aGlzLmNvbnRyb2xzID0gbnVsbDtcblxuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnY2FudmFzJyk7XG4gICAgZm9yIChsZXQgaW5kZXggPSBlbGVtZW50Lmxlbmd0aCAtIDE7IGluZGV4ID49IDA7IGluZGV4LS0pIHtcbiAgICAgIGVsZW1lbnRbaW5kZXhdLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbWVudFtpbmRleF0pO1xuICAgIH1cbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIGluaXRDYW1lcmEoKSB7XG4gICAgdGhpcy5jYW1lcmEgPSBuZXcgVEhSRUUuT3J0aG9ncmFwaGljQ2FtZXJhKHdpbmRvdy5pbm5lcldpZHRoIC8gLTIsXG4gICAgICB3aW5kb3cuaW5uZXJXaWR0aCAvIDIsIHdpbmRvdy5pbm5lckhlaWdodCAvIDIsIHdpbmRvdy5pbm5lckhlaWdodCAvIC0yLCAtMiwgMSk7XG4gICAgdGhpcy5zY2VuZS5hZGQodGhpcy5jYW1lcmEpO1xuICAgIHRoaXMuY2FtZXJhLnBvc2l0aW9uLnggPSAwO1xuICAgIHRoaXMuY2FtZXJhLnBvc2l0aW9uLnkgPSAwO1xuXG4gICAgdGhpcy5jYW1lcmEucG9zaXRpb24ueiA9IDE7XG4gIH1cblxuICBpbml0TGlnaHRpbmcoKSB7XG4gICAgY29uc3QgYW1iaWVudExpZ2h0ID0gbmV3IFRIUkVFLkFtYmllbnRMaWdodCgweGZmZmZmZik7XG4gICAgdGhpcy5zY2VuZS5hZGQoYW1iaWVudExpZ2h0KTtcbiAgfVxuXG4gIGluaXRSZW5kZXJlcigpIHtcbiAgICB0aGlzLnJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoe1xuICAgICAgYW50aWFsaWFzOiB0cnVlLFxuICAgIH0pO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0Q2xlYXJDb2xvcigweGZmZmZmZiwgMS4wKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGRpc2soY2VudHJlLCByYWRpdXMsIGNvbG9yKSB7XG4gICAgaWYgKGNvbG9yID09PSB1bmRlZmluZWQpIGNvbG9yID0gMHhmZmZmZmY7XG5cbiAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5DaXJjbGVHZW9tZXRyeShyYWRpdXMsIDEwMCwgMCwgMiAqIE1hdGguUEkpO1xuICAgIGNvbnN0IGNpcmNsZSA9IHRoaXMuY3JlYXRlTWVzaChnZW9tZXRyeSwgY29sb3IpO1xuICAgIGNpcmNsZS5wb3NpdGlvbi54ID0gY2VudHJlLng7XG4gICAgY2lyY2xlLnBvc2l0aW9uLnkgPSBjZW50cmUueTtcblxuICAgIHRoaXMuc2NlbmUuYWRkKGNpcmNsZSk7XG4gIH1cblxuICBzZWdtZW50KGNpcmNsZSwgYWxwaGEsIG9mZnNldCwgY29sb3IpIHtcbiAgICBpZiAoY29sb3IgPT09IHVuZGVmaW5lZCkgY29sb3IgPSAweGZmZmZmZjtcblxuICAgIGNvbnN0IGN1cnZlID0gbmV3IFRIUkVFLkVsbGlwc2VDdXJ2ZShcbiAgICAgIGNpcmNsZS5jZW50cmUueCwgY2lyY2xlLmNlbnRyZS55LCAvLyBheCwgYVlcbiAgICAgIGNpcmNsZS5yYWRpdXMsIGNpcmNsZS5yYWRpdXMsIC8vIHhSYWRpdXMsIHlSYWRpdXNcbiAgICAgIGFscGhhLCBvZmZzZXQsIC8vIGFTdGFydEFuZ2xlLCBhRW5kQW5nbGVcbiAgICAgIGZhbHNlIC8vIGFDbG9ja3dpc2VcbiAgICApO1xuXG4gICAgY29uc3QgcG9pbnRzID0gY3VydmUuZ2V0U3BhY2VkUG9pbnRzKDEwMCk7XG5cbiAgICBjb25zdCBwYXRoID0gbmV3IFRIUkVFLlBhdGgoKTtcbiAgICBjb25zdCBnZW9tZXRyeSA9IHBhdGguY3JlYXRlR2VvbWV0cnkocG9pbnRzKTtcblxuICAgIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKHtcbiAgICAgIGNvbG9yOiBjb2xvclxuICAgIH0pO1xuICAgIGNvbnN0IHMgPSBuZXcgVEhSRUUuTGluZShnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXG4gICAgdGhpcy5zY2VuZS5hZGQocyk7XG4gIH1cblxuICBsaW5lKHN0YXJ0LCBlbmQsIGNvbG9yKSB7XG4gICAgaWYgKGNvbG9yID09PSB1bmRlZmluZWQpIGNvbG9yID0gMHhmZmZmZmY7XG5cbiAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5HZW9tZXRyeSgpO1xuXG4gICAgZ2VvbWV0cnkudmVydGljZXMucHVzaChcbiAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKHN0YXJ0LngsIHN0YXJ0LnksIDApLFxuICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoZW5kLngsIGVuZC55LCAwKVxuICAgICk7XG4gICAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoe1xuICAgICAgY29sb3I6IGNvbG9yXG4gICAgfSk7XG4gICAgY29uc3QgbCA9IG5ldyBUSFJFRS5MaW5lKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgdGhpcy5zY2VuZS5hZGQobCk7XG4gIH1cblxuICBwb2x5Z29uKHZlcnRpY2VzLCBjb2xvciwgdGV4dHVyZSwgd2lyZWZyYW1lKSB7XG4gICAgaWYgKGNvbG9yID09PSB1bmRlZmluZWQpIGNvbG9yID0gMHhmZmZmZmY7XG5cbiAgICBjb25zdCBwb2x5ID0gbmV3IFRIUkVFLlNoYXBlKCk7XG4gICAgcG9seS5tb3ZlVG8odmVydGljZXNbMF0ueCwgdmVydGljZXNbMF0ueSk7XG5cbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IHZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBwb2x5LmxpbmVUbyh2ZXJ0aWNlc1tpXS54LCB2ZXJ0aWNlc1tpXS55KVxuICAgIH1cblxuICAgIHBvbHkubGluZVRvKHZlcnRpY2VzWzBdLngsIHZlcnRpY2VzWzBdLnkpO1xuXG4gICAgY29uc3QgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuU2hhcGVHZW9tZXRyeShwb2x5KTtcblxuICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMuY3JlYXRlTWVzaChnZW9tZXRyeSwgY29sb3IsIHRleHR1cmUsIHdpcmVmcmFtZSkpO1xuICB9XG5cbiAgY3JlYXRlTWVzaChnZW9tZXRyeSwgY29sb3IsIGltYWdlVVJMLCB3aXJlZnJhbWUpIHtcbiAgICBpZih3aXJlZnJhbWUgPT09IHVuZGVmaW5lZCkgd2lyZWZyYW1lID0gZmFsc2U7XG4gICAgaWYgKGNvbG9yID09PSB1bmRlZmluZWQpIGNvbG9yID0gMHhmZmZmZmY7XG5cbiAgICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XG4gICAgICBjb2xvcjogY29sb3IsXG4gICAgICB3aXJlZnJhbWU6IHdpcmVmcmFtZVxuICAgIH0pO1xuXG4gICAgaWYgKGltYWdlVVJMKSB7XG4gICAgICBjb25zdCB0ZXh0dXJlTG9hZGVyID0gbmV3IFRIUkVFLlRleHR1cmVMb2FkZXIoKTtcblxuICAgICAgLy9sb2FkIHRleHR1cmUgYW5kIGFwcGx5IHRvIG1hdGVyaWFsIGluIGNhbGxiYWNrXG4gICAgICBjb25zdCB0ZXh0dXJlID0gdGV4dHVyZUxvYWRlci5sb2FkKGltYWdlVVJMLCAodGV4KSA9PiB7fSk7XG4gICAgICB0ZXh0dXJlLnJlcGVhdC5zZXQoMC4wNSwgMC4wNSk7XG4gICAgICBtYXRlcmlhbC5tYXAgPSB0ZXh0dXJlO1xuICAgICAgbWF0ZXJpYWwubWFwLndyYXBUID0gVEhSRUUuUmVwZWF0V3JhcHBpbmc7XG4gICAgICBtYXRlcmlhbC5tYXAud3JhcFMgPSBUSFJFRS5SZXBlYXRXcmFwcGluZztcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgfVxuXG4gIGF4ZXMoKSB7XG4gICAgY29uc3QgeHl6ID0gbmV3IFRIUkVFLkF4aXNIZWxwZXIoMjApO1xuICAgIHRoaXMuc2NlbmUuYWRkKHh5eik7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHRoaXMucmVuZGVyKClcbiAgICB9KTtcblxuICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUsIHRoaXMuY2FtZXJhKTtcbiAgfVxuXG59XG4iXX0=
