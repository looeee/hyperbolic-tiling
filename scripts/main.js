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
  if (toFixed(p1.x, 10) == 0 && toFixed(p2.x, 10) === 0) {
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
  if (first.x !== last.x || first.y !== last.y) points.push(first);
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
  var oy = E.toFixed(c.centre.y, 10);
  var ox = E.toFixed(c.centre.x, 10);

  //point at 0 radians on c
  var p3 = new _point.Point(ox + c.radius, oy);

  //calculate the position of each point in the circle
  alpha1 = E.centralAngle(p3, p1, c.radius);
  alpha2 = E.centralAngle(p3, p2, c.radius);

  //for comparison to avoid round off errors
  var p1X = E.toFixed(p1.x, 10);
  var p1Y = E.toFixed(p1.y, 10);
  var p2X = E.toFixed(p2.x, 10);
  var p2Y = E.toFixed(p2.y, 10);

  //console.log('p2x: ', p2X,'ox: ', ox);
  //console.log('p1y: ', p1Y, 'p2y: ', p2Y,'ox: ', ox);

  alpha1 = p1Y < oy ? 2 * Math.PI - alpha1 : alpha1;
  alpha2 = p2Y < oy ? 2 * Math.PI - alpha2 : alpha2;

  //console.log(alpha1, alpha2);

  //case where p1 above and p2 below or on the line c.centre -> p3
  if (!(p1X <= ox && p2X <= ox) && p1Y <= oy && p2Y >= oy) {
    startAngle = alpha1;
    endAngle = alpha2;
  }
  //case where p2 above and p1 below or on the line c.centre -> p3
  else if (p1X >= ox && p2X >= ox && p1Y >= oy && p2Y <= oy) {
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
  //console.log(startAngle, endAngle, clockwise);
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
//const tesselation = new RegularTesselation(11, 12);

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

    console.log(p, q);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJlczIwMTUvY2lyY2xlLmpzIiwiZXMyMDE1L2Rpc2suanMiLCJlczIwMTUvZXVjbGlkLmpzIiwiZXMyMDE1L2h5cGVyYm9saWMuanMiLCJlczIwMTUvbWFpbi5qcyIsImVzMjAxNS9wb2ludC5qcyIsImVzMjAxNS9yZWd1bGFyVGVzc2VsYXRpb24uanMiLCJlczIwMTUvdGhyZWVqcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7OztJQ0FZLENBQUM7Ozs7Ozs7Ozs7Ozs7O0lBUUEsTUFBTSxXQUFOLE1BQU0sR0FDakIsU0FEVyxNQUFNLENBQ0wsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUM7d0JBRDFCLE1BQU07O0FBRWYsTUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBQztBQUN6QixVQUFNLEdBQUcsQ0FBQyxDQUFDO0dBQ1o7QUFDRCxNQUFJLENBQUMsTUFBTSxHQUFHLFdBWlQsS0FBSyxDQVljLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUMxQyxNQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztDQUN0Qjs7Ozs7Ozs7Ozs7Ozs7SUNmUyxDQUFDOzs7O0lBQ0QsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBV0EsSUFBSSxXQUFKLElBQUk7QUFDZixXQURXLElBQUksR0FDRDs7OzBCQURILElBQUk7O0FBRWIsUUFBSSxDQUFDLElBQUksR0FBRyxhQVhQLE9BQU8sRUFXYSxDQUFDOztBQUUxQixVQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLFVBQUMsS0FBSyxFQUFLOztBQUV6QyxZQUFLLElBQUksRUFBRSxDQUFDO0tBQ2IsRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFVixVQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFlBQU07QUFDdEMsWUFBSyxJQUFJLEVBQUUsQ0FBQztLQUNiLEVB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QUFFLENBQUEsQUFBQyxJQUFJLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFBLEFBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFBLEFBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFdEcsTUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksQ0FBQyxHQUFHLEFBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLElBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFBLEFBQUMsSUFBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7QUFDbkYsTUFBTSxFQUFFLEdBQUcsUUFBUSxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7QUFDeEQsTUFBTSxFQUFFLEdBQUcsUUFBUSxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7O0FBRXhELE1BQU0sUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxHQUFJLENBQUMsR0FBRyxBQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxJQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQSxBQUFDLElBQUssQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUEsQUFBQyxDQUFDO0FBQ25GLE1BQU0sRUFBRSxHQUFHLFFBQVEsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUEsQUFBQyxDQUFDO0FBQ3hELE1BQU0sRUFBRSxHQUFHLFFBQVEsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUEsQUFBQyxDQUFDOztBQUV4RCxNQUFNLEVBQUUsR0FBRyxXQXpJWCxLQUFLLENBeUlnQixFQUFFLEVBQUMsRUFBRSxDQUFDLENBQUM7O0FBRTVCLE1BQU0sRUFBRSxHQUFHLFdBM0lYLEtBQUssQ0EySWdCLEVBQUUsRUFBQyxFQUFFLENBQUMsQ0FBQzs7QUFFNUIsU0FBTztBQUNMLE1BQUUsRUFBRSxFQUFFO0FBQ04sTUFBRSxFQUFFLEVBQUU7R0FDUCxDQUFDO0NBQ0gsQ0FBQTs7QUFFTSxJQUFNLG1CQUFtQixXQUFuQixtQkFBbUIsR0FBRyxTQUF0QixtQkFBbUIsQ0FBSSxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBSztBQUNyRCxNQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUMzQixNQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUMzQixNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDOztBQUV4QixNQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQzs7QUFBQyxBQUUzQixNQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQSxHQUFJLENBQUMsQ0FBQztBQUM3QixNQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQSxHQUFJLENBQUM7OztBQUFDLEFBRzdCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQSxBQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBQztBQUM5QyxNQUFNLENBQUMsR0FBRyxXQS9KVixLQUFLLENBK0plLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7OztBQUFDLEFBR2xELE1BQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQzs7O0FBQUMsQUFHdEMsTUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFO0FBQ1YsUUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7O0FBQUMsQUFFdEMsUUFBTSxFQUFFLEdBQUcsV0F4S2IsS0FBSyxDQXdLa0IsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFBLEdBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFBLEdBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBQUMsQUFFakUsUUFBTSxFQUFFLEdBQUcsV0ExS2IsS0FBSyxDQTBLa0IsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFBLEdBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFBLEdBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFaEUsV0FBTztBQUNMLFFBQUUsRUFBRSxFQUFFO0FBQ04sUUFBRSxFQUFFLEVBQUU7S0FDUCxDQUFDO0dBQ0gsTUFBTSxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUU7QUFDbkIsV0FBTyxDQUFDLENBQUM7R0FDVixNQUFNO0FBQ0wsV0FBTyxDQUFDLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO0dBQ3pEO0NBQ0Y7OztBQUFBLEFBR00sSUFBTSxZQUFZLFdBQVosWUFBWSxHQUFHLFNBQWYsWUFBWSxDQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFLOztBQUV6QyxNQUFJLElBQUksR0FBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLEFBQUMsQ0FBQztBQUN4QyxNQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksRUFBQyxFQUFFLENBQUMsQ0FBQztBQUN4QixNQUFJLEdBQUcsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM5QixNQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZCLFNBQU8sR0FBRyxDQUFDO0NBQ1o7OztBQUFBLEFBR00sSUFBTSxZQUFZLFdBQVosWUFBWSxHQUFHLFNBQWYsWUFBWSxDQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUs7QUFDdEMsTUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZFLFNBQU8sV0FwTVAsS0FBSyxDQW9NWSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQSxHQUFJLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQSxHQUFJLENBQUMsQ0FBQyxDQUFDO0NBQ3ZEOzs7OztBQUFBLEFBS00sSUFBTSxhQUFhLFdBQWIsYUFBYSxHQUFHLFNBQWhCLGFBQWEsQ0FBSSxFQUFFLEVBQUUsRUFBRSxFQUFLO0FBQ3ZDLE1BQUssT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRTs7QUFFdEQsV0FBTyxJQUFJLENBQUM7R0FDYjtBQUNELE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFBLElBQUssRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFBLEFBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUVqRSxNQUFLLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sSUFBSSxDQUFDLEtBQ3BDLE9BQU8sS0FBSyxDQUFDO0NBQ25COzs7QUFBQSxBQUdNLElBQU0saUJBQWlCLFdBQWpCLGlCQUFpQixHQUFHLFNBQXBCLGlCQUFpQixDQUFJLE1BQU0sRUFBSztBQUMzQyxNQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO01BQ25CLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNuQyxNQUFJLEtBQUssQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNqRSxNQUFJLFNBQVMsR0FBRyxDQUFDO01BQ2YsQ0FBQyxHQUFHLENBQUM7TUFDTCxDQUFDLEdBQUcsQ0FBQztNQUNMLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTTtNQUNwQixFQUFFLFlBQUE7TUFBRSxFQUFFLFlBQUE7TUFBRSxDQUFDLFlBQUEsQ0FBQztBQUNaLE9BQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFO0FBQy9DLE1BQUUsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZixNQUFFLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2YsS0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDOUIsYUFBUyxJQUFJLENBQUMsQ0FBQztBQUNmLEtBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQSxHQUFJLENBQUMsQ0FBQztBQUN2QixLQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUEsR0FBSSxDQUFDLENBQUM7R0FDeEI7QUFDRCxHQUFDLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQztBQUNsQixTQUFPLFdBeE9QLEtBQUssQ0F3T2EsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Q0FDakM7Ozs7O0FBQUEsQUFLTSxJQUFNLGdCQUFnQixXQUFoQixnQkFBZ0IsR0FBRyxTQUFuQixnQkFBZ0IsQ0FBSSxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBSztBQUMxRCxNQUFNLFFBQVEsR0FBRyxFQUFFLEFBQUMsT0FBTyxHQUFHLE9BQU8sSUFBSyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFBLEFBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxDQUFDO0FBQ2xGLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekQsTUFBTSxXQUFXLEdBQUcsQ0FBQyxXQUFXLENBQUM7O0FBRWpDLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLFFBQVEsSUFBSSxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBLEFBQUMsR0FBRyxXQUFXLElBQUksS0FBSyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQSxBQUFDLENBQUM7QUFDbEgsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsUUFBUSxJQUFJLEtBQUssQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUEsQUFBQyxHQUFHLFdBQVcsSUFBSSxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBQztBQUNsSCxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxXQUFXLElBQUksS0FBSyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQSxBQUFDLEdBQUcsUUFBUSxJQUFJLEtBQUssQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUEsQUFBQyxDQUFDO0FBQ2xILE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLFdBQVcsSUFBSSxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBLEFBQUMsR0FBRyxRQUFRLElBQUksS0FBSyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQSxBQUFDLENBQUM7O0FBRWxILFNBQU87QUFDTCxNQUFFLEVBQUUsV0F6UE4sS0FBSyxDQXlQVyxJQUFJLEVBQUUsSUFBSSxDQUFDO0FBQ3pCLE1BQUUsRUFBRSxXQTFQTixLQUFLLENBMFBXLElBQUksRUFBQyxJQUFJLENBQUM7R0FDekIsQ0FBQTtDQUNGLENBQUE7O0FBRU0sSUFBTSxXQUFXLFdBQVgsV0FBVyxHQUFHLFNBQWQsV0FBVyxDQUFJLEdBQUcsRUFBRSxHQUFHLEVBQUs7QUFDdkMsU0FBTyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQSxBQUFDLEdBQUcsR0FBRyxDQUFDO0NBQzFDLENBQUE7O0FBRU0sSUFBTSxTQUFTLFdBQVQsU0FBUyxHQUFHLFNBQVosU0FBUyxDQUFJLEdBQUcsRUFBRSxHQUFHLEVBQUs7QUFDckMsU0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQSxBQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7Q0FDMUQ7Ozs7QUFBQSxBQUlNLElBQU0sT0FBTyxXQUFQLE9BQU8sR0FBRyxTQUFWLE9BQU8sQ0FBSSxNQUFNLEVBQUUsTUFBTSxFQUFLO0FBQ3pDLFNBQU8sVUFBVSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztDQUMzQyxDQUFBOzs7Ozs7Ozs7Ozs7SUMzUVcsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztBQVlOLElBQU0sR0FBRyxXQUFILEdBQUcsR0FBRyxTQUFOLEdBQUcsQ0FBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBSztBQUNyQyxNQUFJLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFO0FBQzNCLFdBQU87QUFDTCxZQUFNLEVBQUUsTUFBTTtBQUNkLGdCQUFVLEVBQUUsQ0FBQztBQUNiLGNBQVEsRUFBRSxDQUFDO0FBQ1gsZUFBUyxFQUFFLEtBQUs7QUFDaEIsa0JBQVksRUFBRSxJQUFJO0tBQ25CLENBQUE7R0FDRjtBQUNELE1BQUksU0FBUyxHQUFHLEtBQUssQ0FBQztBQUN0QixNQUFJLE1BQU0sWUFBQTtNQUFFLE1BQU0sWUFBQTtNQUFFLFVBQVUsWUFBQTtNQUFFLFFBQVEsWUFBQSxDQUFDO0FBQ3pDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN4QyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3JDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDOzs7QUFBQyxBQUdyQyxNQUFNLEVBQUUsR0FBRyxXQTVCSixLQUFLLENBNEJVLEVBQUUsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQzs7O0FBQUMsQUFHekMsUUFBTSxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDMUMsUUFBTSxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDOzs7QUFBQyxBQUcxQyxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDaEMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ2hDLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNoQyxNQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDOzs7OztBQUFDLEFBS2hDLFFBQU0sR0FBRyxBQUFDLEdBQUcsR0FBRyxFQUFFLEdBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNwRCxRQUFNLEdBQUcsQUFBQyxHQUFHLEdBQUcsRUFBRSxHQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLE1BQU0sR0FBRyxNQUFNOzs7OztBQUFDLEFBS3BELE1BQUksRUFBRSxHQUFHLElBQUksRUFBRSxJQUFJLEdBQUcsSUFBSSxFQUFFLENBQUEsQUFBQyxJQUFLLEdBQUcsSUFBSSxFQUFFLElBQUksR0FBRyxJQUFJLEVBQUUsQUFBQyxFQUFFO0FBQ3pELGNBQVUsR0FBRyxNQUFNLENBQUM7QUFDcEIsWUFBUSxHQUFHLE1BQU0sQ0FBQzs7O0FBQ25CLE9BRUksSUFBSSxBQUFDLEdBQUcsSUFBSSxFQUFFLElBQUksR0FBRyxJQUFJLEVBQUUsSUFBTSxHQUFHLElBQUksRUFBRSxJQUFJLEdBQUcsSUFBSSxFQUFFLEFBQUMsRUFBRTtBQUM3RCxnQkFBVSxHQUFHLE1BQU0sQ0FBQztBQUNwQixjQUFRLEdBQUcsTUFBTSxDQUFDO0FBQ2xCLGVBQVMsR0FBRyxJQUFJLENBQUM7OztBQUNsQixTQUVJLElBQUksTUFBTSxHQUFHLE1BQU0sRUFBRTtBQUN4QixrQkFBVSxHQUFHLE1BQU0sQ0FBQztBQUNwQixnQkFBUSxHQUFHLE1BQU0sQ0FBQztBQUNsQixpQkFBUyxHQUFHLElBQUksQ0FBQzs7O0FBQ2xCLFdBRUk7QUFDSCxvQkFBVSxHQUFHLE1BQU0sQ0FBQztBQUNwQixrQkFBUSxHQUFHLE1BQU0sQ0FBQztTQUNuQjs7QUFBQSxBQUVELFNBQU87QUFDTCxVQUFNLEVBQUUsQ0FBQztBQUNULGNBQVUsRUFBRSxVQUFVO0FBQ3RCLFlBQVEsRUFBRSxRQUFRO0FBQ2xCLGFBQVMsRUFBRSxTQUFTO0FBQ3BCLGdCQUFZLEVBQUUsS0FBSztHQUNwQixDQUFBO0NBQ0Y7OztBQUFBLEFBR00sSUFBTSxVQUFVLFdBQVYsVUFBVSxHQUFHLFNBQWIsVUFBVSxDQUFJLFdBQVcsRUFBRSxRQUFRLEVBQUs7QUFDbkQsTUFBTSxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQztBQUM3QixNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFDckIsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ3JDLE1BQU0sR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbEIsTUFBTSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsQixPQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzFCLFFBQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFELFFBQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFELGFBQVMsQ0FBQyxJQUFJLENBQUUsV0ExRlgsS0FBSyxDQTBGZ0IsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDakM7QUFDRCxTQUFPLFNBQVMsQ0FBQztDQUNsQjs7OztBQUFBLEFBSU0sSUFBTSxRQUFRLFdBQVIsUUFBUSxHQUFHLFNBQVgsUUFBUSxDQUFJLFdBQVcsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBSyxFQUVqRTs7OztBQUFBLEFBSU0sSUFBTSxPQUFPLFdBQVAsT0FBTyxHQUFHLFNBQVYsT0FBTyxDQUFJLFdBQVcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBSztBQUN0RCxNQUFNLENBQUMsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO0FBQzdCLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzlCLE1BQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQzs7QUFFckIsTUFBSSxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUU7QUFDbkIsU0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUMxQixlQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0tBQ3JEO0dBQ0YsTUFBTTtBQUNMLFNBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDMUIsZUFBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN4RDtHQUNGO0FBQ0QsU0FBTyxTQUFTLENBQUM7Q0FDbEIsQ0FBQTs7QUFFTSxJQUFNLHFCQUFxQixXQUFyQixxQkFBcUIsR0FBRyxTQUF4QixxQkFBcUIsQ0FBSSxPQUFPLEVBQUs7QUFDaEQsTUFBTSxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBQztBQUN2RSxTQUFPO0FBQ0wsS0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUM7QUFDekIsS0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUM7QUFDekIsS0FBQyxFQUFFLE1BQU0sSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQSxBQUFDO0dBQ2hFLENBQUE7Q0FDRixDQUFBOztBQUVNLElBQU0scUJBQXFCLFdBQXJCLHFCQUFxQixHQUFHLFNBQXhCLHFCQUFxQixDQUFJLE9BQU8sRUFBSztBQUNoRCxNQUFNLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUEsQUFBQyxDQUFDO0FBQ25DLFNBQU8sV0FuSUEsS0FBSyxDQW1JSyxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUMsRUFBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQ3pELENBQUE7O0FBRU0sSUFBTSw0QkFBNEIsV0FBNUIsNEJBQTRCLEdBQUcsU0FBL0IsNEJBQTRCLENBQUksT0FBTyxFQUFFLEtBQUssRUFBSztBQUM5RCxTQUFPO0FBQ0wsS0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDO0FBQzVELEtBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQztBQUM1RCxLQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7R0FDYixDQUFBO0NBQ0YsQ0FBQTs7QUFFTSxJQUFNLGlCQUFpQixXQUFqQixpQkFBaUIsR0FBRyxTQUFwQixpQkFBaUIsQ0FBSSxPQUFPLEVBQUUsS0FBSyxFQUFLO0FBQ25ELFNBQU8sV0EvSUEsS0FBSyxDQStJSyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxFQUN2RSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDL0QsQ0FBQTs7QUFFTSxJQUFNLHFCQUFxQixXQUFyQixxQkFBcUIsR0FBRyxTQUF4QixxQkFBcUIsQ0FBSSxhQUFhLEVBQUUsS0FBSyxFQUFLO0FBQzdELE1BQU0sQ0FBQyxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUM7QUFDL0IsTUFBTSxvQkFBb0IsR0FBRyxFQUFFLENBQUM7QUFDaEMsT0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUMxQixRQUFJLEtBQUssR0FBRyxpQkFBaUIsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDdkQsd0JBQW9CLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0dBQ2xDO0FBQ0QsU0FBTyxvQkFBb0IsQ0FBQztDQUM3Qjs7Ozs7QUFBQSxBQUtNLElBQU0saUJBQWlCLFdBQWpCLGlCQUFpQixHQUFHLFNBQXBCLGlCQUFpQixDQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUs7QUFDM0MsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN0QyxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3hFLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDeEUsTUFBTSxXQUFXLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsYUFBYSxHQUFHLGFBQWEsQ0FBQzs7QUFFaEUsTUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxhQUFhLENBQUEsR0FBSSxXQUFXLENBQUM7QUFDN0QsTUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsYUFBYSxDQUFBLEdBQUksV0FBVyxDQUFDOztBQUVuRCxNQUFNLENBQUMsR0FBRyxRQUFRLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxRQUFRLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM1QyxNQUFNLENBQUMsR0FBRyxRQUFRLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxRQUFRLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFNUMsU0FBTyxXQTVLQSxLQUFLLENBNEtLLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztDQUN2QixDQUFBOztBQUVNLElBQU0sd0JBQXdCLFdBQXhCLHdCQUF3QixHQUFHLFNBQTNCLHdCQUF3QixDQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUssRUFFbkQsQ0FBQTs7Ozs7OztJQ2xMVyxDQUFDOzs7Ozs7Ozs7Ozs7QUFhYixJQUFNLFdBQVcsR0FBRyx3QkFSWCxrQkFBa0IsQ0FRZ0IsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUMsRUFBRSxDQUFDLENBQUM7Ozs7Ozs7QUFBQzs7Ozs7Ozs7Ozs7O0lDYnJFLENBQUM7Ozs7Ozs7Ozs7OztJQU9BLEtBQUssV0FBTCxLQUFLO0FBQ2hCLFdBRFcsS0FBSyxDQUNKLENBQUMsRUFBRSxDQUFDLEVBQUM7MEJBRE4sS0FBSzs7QUFFZCxRQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBQztBQUN4QixPQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ1A7QUFDRCxRQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBQztBQUN4QixPQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ1A7QUFDRCxRQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNYLFFBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0dBQ1o7O2VBVlUsS0FBSzs7NEJBWVIsTUFBTSxFQUFDO0FBQ2IsVUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDbkMsVUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDcEM7Ozs7Ozs0QkFHTyxFQUFFLEVBQUM7QUFDVCxVQUFJLE9BQU8sRUFBRSxLQUFLLFdBQVcsRUFBRTtBQUM3QixlQUFPLENBQUMsSUFBSSxDQUFDLDZCQUE2QixDQUFDLENBQUE7QUFDM0MsZUFBTyxLQUFLLENBQUM7T0FDZDtBQUNELFVBQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDNUIsVUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQzs7QUFFMUIsVUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLE9BQU8sSUFBSSxDQUFDLEtBQzNDLE9BQU8sS0FBSyxDQUFDO0tBQ25COzs7U0E1QlUsS0FBSzs7Ozs7Ozs7Ozs7Ozs7O0lDUE4sQ0FBQzs7OztJQUNELENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXFCQSxrQkFBa0IsV0FBbEIsa0JBQWtCO0FBQzdCLFdBRFcsa0JBQWtCLENBQ2pCLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUU7OzswQkFEcEMsa0JBQWtCOztBQUUzQixXQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztBQUNqQixRQUFJLENBQUMsSUFBSSxHQUFHLFVBckJkLElBQUksRUFxQm9CLENBQUM7O0FBRXZCLFFBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ1gsUUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDWCxRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sSUFBSSxPQUFPLENBQUM7QUFDaEMsUUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLElBQUksQ0FBQyxDQUFDO0FBQzlCLFFBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxJQUFJLENBQUMsQ0FBQzs7QUFFaEMsUUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUU7QUFDdEIsYUFBTyxLQUFLLENBQUM7S0FDZDs7QUFFRCxVQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLFVBQUMsS0FBSyxFQUFLOztBQUV6QyxZQUFLLElBQUksRUFBRSxDQUFDO0tBQ2IsRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFVixVQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFlBQU07QUFDdEMsWUFBSyxJQUFJLEVBQUUsQ0FBQztLQUNiLEVBQUUsS0FBSyxDQUFDLENBQUM7R0FJWDs7ZUExQlUsa0JBQWtCOzsyQkE0QnRCO0FBQ0wsVUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztBQUNuQyxVQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDaEI7Ozs4QkFFUztBQUNSLFVBQUksU0FBUyxHQUFHLEtBQUssQ0FBQztBQUN0QixlQUFTLEdBQUcsSUFBSTs7O0FBQUMsQUFHakIsVUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7O0FBQUMsQUFHM0UsVUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7O0FBQUMsQUFHckUsVUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7O0FBQUMsQUFHckUsVUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7O0FBQUMsQUFHckUsVUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7O0FBQUMsQUFHckUsVUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7O0FBQUMsQUFHckUsVUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7O0FBQUMsQUFHckUsVUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7O0FBQUMsQUFHckUsVUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUM7QUFDbkIsV0FBSSxJQUFJLENBQUMsR0FBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBQztBQUN6QixZQUFJLElBQUksR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxBQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsRUFBRSxHQUFDLEdBQUcsSUFBRyxDQUFDLEdBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBQyxDQUFDO0FBQ25FLFlBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDckUsWUFBSSxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsQUFBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLEVBQUUsR0FBQyxHQUFHLElBQUcsQ0FBQyxHQUFDLENBQUMsQ0FBQSxBQUFDLENBQUMsQ0FBQztBQUM3RCxZQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3JFLFlBQUksR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsS0FBSyxFQUFFLEFBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxFQUFFLEdBQUMsR0FBRyxJQUFHLENBQUMsR0FBQyxDQUFDLENBQUEsQUFBQyxDQUFDLENBQUM7QUFDN0QsWUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNyRSxZQUFJLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLEtBQUssRUFBRSxBQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsRUFBRSxHQUFDLEdBQUcsSUFBRyxDQUFDLEdBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBQyxDQUFDO0FBQzdELFlBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDckUsWUFBSSxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsQUFBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLEVBQUUsR0FBQyxHQUFHLElBQUcsQ0FBQyxHQUFDLENBQUMsQ0FBQSxBQUFDLENBQUMsQ0FBQztBQUM3RCxZQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3JFLFlBQUksR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsS0FBSyxFQUFFLEFBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxFQUFFLEdBQUMsR0FBRyxJQUFHLENBQUMsR0FBQyxDQUFDLENBQUEsQUFBQyxDQUFDLENBQUM7QUFDN0QsWUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNyRSxZQUFJLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLEtBQUssRUFBRSxBQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsRUFBRSxHQUFDLEdBQUcsSUFBRyxDQUFDLEdBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBQyxDQUFDO0FBQzdELFlBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDckUsWUFBSSxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsQUFBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLEVBQUUsR0FBQyxHQUFHLElBQUcsQ0FBQyxHQUFDLENBQUMsQ0FBQSxBQUFDLENBQUMsQ0FBQztBQUM3RCxZQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3JFLFlBQUksR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsS0FBSyxFQUFFLEFBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxFQUFFLEdBQUMsR0FBRyxJQUFHLENBQUMsR0FBQyxDQUFDLENBQUEsQUFBQyxDQUFDLENBQUM7QUFDN0QsWUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztPQUN0RTtLQUdGOzs7Ozs7d0NBR21CO0FBQ2xCLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUN2QyxVQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JDLFVBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDOztBQUFDLEFBRXJDLFVBQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEFBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7QUFDeEQsVUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEFBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQztBQUN4RCxVQUFNLENBQUMsR0FBRyxXQW5ITCxLQUFLLENBbUhVLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUN2RCxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRXRDLFVBQU0sTUFBTSxHQUFHLFlBL0dqQixNQUFNLENBK0dzQixDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQzs7O0FBQUMsQUFHbkMsVUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7O0FBRWpFLFVBQU0sRUFBRSxHQUFHLFdBM0hOLEtBQUssQ0EySFcsQ0FBQyxHQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQzs7QUFFNUIsVUFBTSxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7O0FBRTFDLGFBQU8sTUFBTSxDQUFDO0tBQ2Y7Ozs7Ozs7O2tDQUthO0FBQ1osVUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFO0FBQy9DLGVBQU8sQ0FBQyxLQUFLLENBQUMsa0NBQWtDLENBQUMsQ0FBQztBQUNsRCxlQUFPLElBQUksQ0FBQztPQUNiLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLElBQUssSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxJQUFJLENBQUMsRUFBRTtBQUMzQyxlQUFPLENBQUMsS0FBSyxDQUFDLHNEQUFzRCxDQUFDLENBQUM7QUFDdEUsZUFBTyxJQUFJLENBQUM7OztBQUNiLFdBRUksSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ3JDLGlCQUFPLENBQUMsS0FBSyxDQUFDO29DQUNnQixDQUFDLENBQUM7QUFDaEMsaUJBQU8sSUFBSSxDQUFDO1NBQ2IsTUFBTSxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDdkMsaUJBQU8sQ0FBQyxLQUFLLENBQUMsb0RBQW9ELENBQUMsQ0FBQztBQUNwRSxpQkFBTyxJQUFJLENBQUM7U0FDYixNQUFNO0FBQ0wsaUJBQU8sS0FBSyxDQUFDO1NBQ2Q7S0FDRjs7O1NBcElVLGtCQUFrQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQ2ZsQixPQUFPLFdBQVAsT0FBTztBQUNsQixXQURXLE9BQU8sR0FDSjs7OzBCQURILE9BQU87O0FBR2hCLFVBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsVUFBQyxLQUFLLEVBQUs7O0FBRXpDLFlBQUssSUFBSSxFQUFFLENBQUM7S0FDYixFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUVWLFVBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsWUFBTTtBQUN0QyxZQUFLLEtBQUssRUFBRSxDQUFDO0tBQ2QsRUFBRSxLQUFLLENBQUMsQ0FBQztHQUVYOztlQVpVLE9BQU87OzJCQWNYO0FBQ0wsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUMvQixVQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7O0FBRWxCLFVBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQzs7QUFFcEIsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDOztBQUVaLFVBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztLQUNyQjs7OzRCQUVPO0FBQ04sMEJBQW9CLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztBQUFDLEFBQzlCLFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLFVBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0FBQ3RCLFVBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ25CLFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDOztBQUVyQixVQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsb0JBQW9CLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDeEQsV0FBSyxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxLQUFLLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFO0FBQ3hELGVBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO09BQ3ZEO0FBQ0QsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2I7OztpQ0FFWTtBQUNYLFVBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsRUFDL0QsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLFdBQVcsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNqRixVQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDNUIsVUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMzQixVQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUUzQixVQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQzVCOzs7bUNBRWM7QUFDYixVQUFNLFlBQVksR0FBRyxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDdEQsVUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDOUI7OzttQ0FFYztBQUNiLFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDO0FBQ3RDLGlCQUFTLEVBQUUsSUFBSTtPQUNoQixDQUFDLENBQUM7QUFDSCxVQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDM0MsVUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDN0QsY0FBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQzs7QUFFcEQsVUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQ2Y7Ozt5QkFFSSxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtBQUMxQixVQUFJLEtBQUssS0FBSyxTQUFTLEVBQUUsS0FBSyxHQUFHLFFBQVEsQ0FBQzs7QUFFMUMsVUFBTSxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDdkUsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDaEQsWUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUM3QixZQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDOztBQUU3QixVQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUN4Qjs7OzRCQUVPLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtBQUNwQyxVQUFJLEtBQUssS0FBSyxTQUFTLEVBQUUsS0FBSyxHQUFHLFFBQVEsQ0FBQzs7QUFFMUMsVUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsWUFBWSxDQUNsQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDaEMsWUFBTSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTTtBQUM1QixXQUFLLEVBQUUsTUFBTTtBQUNiO0FBQUssT0FDTixDQUFDOztBQUVGLFVBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRTFDLFVBQU0sSUFBSSxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzlCLFVBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRTdDLFVBQU0sUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDO0FBQzNDLGFBQUssRUFBRSxLQUFLO09BQ2IsQ0FBQyxDQUFDO0FBQ0gsVUFBTSxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQzs7QUFFN0MsVUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbkI7Ozt5QkFFSSxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRTtBQUN0QixVQUFJLEtBQUssS0FBSyxTQUFTLEVBQUUsS0FBSyxHQUFHLFFBQVEsQ0FBQzs7QUFFMUMsVUFBTSxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7O0FBRXRDLGNBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUNwQixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUN0QyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUNuQyxDQUFDO0FBQ0YsVUFBTSxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUM7QUFDM0MsYUFBSyxFQUFFLEtBQUs7T0FDYixDQUFDLENBQUM7QUFDSCxVQUFNLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQzdDLFVBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ25COzs7NEJBRU8sUUFBUSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFO0FBQzNDLFVBQUksS0FBSyxLQUFLLFNBQVMsRUFBRSxLQUFLLEdBQUcsUUFBUSxDQUFDOztBQUUxQyxVQUFNLElBQUksR0FBRyxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUMvQixVQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUUxQyxXQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN4QyxZQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO09BQzFDOztBQUVELFVBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRTFDLFVBQU0sUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFL0MsVUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO0tBQ3RFOzs7K0JBRVUsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFO0FBQy9DLFVBQUcsU0FBUyxLQUFLLFNBQVMsRUFBRSxTQUFTLEdBQUcsS0FBSyxDQUFDO0FBQzlDLFVBQUksS0FBSyxLQUFLLFNBQVMsRUFBRSxLQUFLLEdBQUcsUUFBUSxDQUFDOztBQUUxQyxVQUFNLFFBQVEsR0FBRyxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQztBQUMzQyxhQUFLLEVBQUUsS0FBSztBQUNaLGlCQUFTLEVBQUUsU0FBUztPQUNyQixDQUFDLENBQUM7O0FBRUgsVUFBSSxRQUFRLEVBQUU7QUFDWixZQUFNLGFBQWEsR0FBRyxJQUFJLEtBQUssQ0FBQyxhQUFhLEVBQUU7OztBQUFDLEFBR2hELFlBQU0sT0FBTyxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFVBQUMsR0FBRyxFQUFLLEVBQUUsQ0FBQyxDQUFDO0FBQzFELGVBQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMvQixnQkFBUSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUM7QUFDdkIsZ0JBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUM7QUFDMUMsZ0JBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUM7T0FDM0M7O0FBRUQsYUFBTyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQzNDOzs7MkJBRU07QUFDTCxVQUFNLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDckMsVUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDckI7Ozs2QkFFUTs7O0FBQ1AsMkJBQXFCLENBQUMsWUFBTTtBQUMxQixlQUFLLE1BQU0sRUFBRSxDQUFBO09BQ2QsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQy9DOzs7U0F0S1UsT0FBTyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgKiBhcyBFIGZyb20gJy4vZXVjbGlkJztcbmltcG9ydCB7IFBvaW50IH0gZnJvbSAnLi9wb2ludCc7XG4vLyAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyAqXG4vLyAqICAgQ0lSQ0xFIENMQVNTXG4vLyAqXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbmV4cG9ydCBjbGFzcyBDaXJjbGV7XG4gIGNvbnN0cnVjdG9yKGNlbnRyZVgsIGNlbnRyZVksIHJhZGl1cyl7XG4gICAgaWYoIEUudG9GaXhlZChyYWRpdXMpID09IDApe1xuICAgICAgcmFkaXVzID0gMDtcbiAgICB9XG4gICAgdGhpcy5jZW50cmUgPSBuZXcgUG9pbnQoY2VudHJlWCwgY2VudHJlWSk7XG4gICAgdGhpcy5yYWRpdXMgPSByYWRpdXM7XG4gIH1cbn1cbiIsImltcG9ydCAqIGFzIEUgZnJvbSAnLi9ldWNsaWQnO1xuaW1wb3J0ICogYXMgSCBmcm9tICcuL2h5cGVyYm9saWMnO1xuaW1wb3J0IHsgUG9pbnQgfSBmcm9tICcuL3BvaW50JztcbmltcG9ydCB7IFRocmVlSlMgfSBmcm9tICcuL3RocmVlanMnO1xuXG4vLyAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyAqXG4vLyAqICAgRElTSyBDTEFTU1xuLy8gKiAgIFBvaW5jYXJlIERpc2sgcmVwcmVzZW50YXRpb24gb2YgdGhlIGh5cGVyYm9saWMgcGxhbmVcbi8vICogICBDb250YWlucyBhbnkgZnVuY3Rpb25zIHVzZWQgdG8gZHJhdyB0byB0aGUgZGlza1xuLy8gKiAgIChDdXJyZW50bHkgdXNpbmcgdGhyZWUganMgYXMgZHJhd2luZyBjbGFzcylcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbmV4cG9ydCBjbGFzcyBEaXNrIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5kcmF3ID0gbmV3IFRocmVlSlMoKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGV2ZW50KSA9PiB7XG4gICAgICAvL3dpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJyk7XG4gICAgICB0aGlzLmluaXQoKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgdGhpcy5pbml0KCk7XG4gICAgfSwgZmFsc2UpO1xuXG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMuY2VudHJlID0gbmV3IFBvaW50KDAsMCk7XG5cbiAgICAvL2RyYXcgbGFyZ2VzdCBjaXJjbGUgcG9zc2libGUgZ2l2ZW4gd2luZG93IGRpbXNcbiAgICB0aGlzLnJhZGl1cyA9ICh3aW5kb3cuaW5uZXJXaWR0aCA8IHdpbmRvdy5pbm5lckhlaWdodCkgPyAod2luZG93LmlubmVyV2lkdGggLyAyKSAtIDUgOiAod2luZG93LmlubmVySGVpZ2h0IC8gMikgLSA1O1xuXG4gICAgdGhpcy5jaXJjbGUgPSB7XG4gICAgICBjZW50cmU6IHRoaXMuY2VudHJlLFxuICAgICAgcmFkaXVzOiB0aGlzLnJhZGl1c1xuICAgIH1cblxuICAgIC8vc21hbGxlciBjaXJjbGUgZm9yIHRlc3RpbmdcbiAgICAvL3RoaXMucmFkaXVzID0gdGhpcy5yYWRpdXMgLyAyO1xuXG4gICAgdGhpcy5kcmF3RGlzaygpO1xuXG4gICAgLy90aGlzLnRlc3RpbmcoKTtcbiAgfVxuXG4gIHRlc3RpbmcoKSB7XG5cbiAgfVxuXG4gIC8vZHJhdyB0aGUgZGlzayBiYWNrZ3JvdW5kXG4gIGRyYXdEaXNrKCkge1xuICAgIHRoaXMuZHJhdy5kaXNrKHRoaXMuY2VudHJlLCB0aGlzLnJhZGl1cywgMHgwMDAwMDApO1xuICB9XG5cbiAgcG9pbnQoY2VudHJlLCByYWRpdXMsIGNvbG9yKSB7XG4gICAgdGhpcy5kcmF3LmRpc2soY2VudHJlLCByYWRpdXMsIGNvbG9yLCBmYWxzZSk7XG4gIH1cblxuICAvL2RyYXcgYSBoeXBlcmJvbGljIGxpbmUgYmV0d2VlbiB0d28gcG9pbnRzIG9uIHRoZSBib3VuZGFyeSBjaXJjbGVcbiAgLy9UT0RPOiBmaXghXG4gIGxpbmUocDEsIHAyLCBjb2xvcikge1xuICAgIC8vY29uc3QgYyA9IEUuZ3JlYXRDaXJjbGUocDEsIHAyLCB0aGlzLnJhZGl1cywgdGhpcy5jZW50cmUpO1xuICAgIC8vY29uc3QgcG9pbnRzID0gRS5jaXJjbGVJbnRlcnNlY3QodGhpcy5jZW50cmUsIGMuY2VudHJlLCB0aGlzLnJhZGl1cywgYy5yYWRpdXMpO1xuXG4gICAgdGhpcy5kcmF3QXJjKHBvaW50cy5wMSwgcG9pbnRzLnAyLCBjb2xvcilcbiAgfVxuXG4gIC8vRHJhdyBhbiBhcmMgKGh5cGVyYm9saWMgbGluZSBzZWdtZW50KSBiZXR3ZWVuIHR3byBwb2ludHMgb24gdGhlIGRpc2tcbiAgZHJhd0FyYyhwMSwgcDIsIGNvbG91cikge1xuICAgIC8vY2hlY2sgdGhhdCB0aGUgcG9pbnRzIGFyZSBpbiB0aGUgZGlza1xuICAgIGlmICh0aGlzLmNoZWNrUG9pbnRzKHAxLCBwMikpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICBjb25zdCBjb2wgPSBjb2xvdXIgfHwgMHhmZmZmZmY7XG4gICAgY29uc3QgYXJjID0gSC5hcmMocDEsIHAyLCB0aGlzLmNpcmNsZSk7XG5cbiAgICBpZiAoYXJjLnN0cmFpZ2h0TGluZSkge1xuICAgICAgdGhpcy5kcmF3LmxpbmUocDEsIHAyLCBjb2wpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRyYXcuc2VnbWVudChhcmMuY2lyY2xlLCBhcmMuc3RhcnRBbmdsZSwgYXJjLmVuZEFuZ2xlLCBjb2xvdXIpO1xuICAgIH1cbiAgfVxuXG4gIHBvbHlnb25PdXRsaW5lKHZlcnRpY2VzLCBjb2xvdXIpIHtcbiAgICBjb25zdCBsID0gdmVydGljZXMubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICB0aGlzLmRyYXdBcmModmVydGljZXNbaV0sIHZlcnRpY2VzWyhpICsgMSkgJSBsXSwgY29sb3VyKTtcbiAgICB9XG4gIH1cblxuICAvL2NyZWF0ZSBhbiBhcnJheSBvZiBwb2ludHMgc3BhY2VkIGVxdWFsbHkgYXJvdW5kIHRoZSBhcmNzIGRlZmluaW5nIGEgaHlwZXJib2xpY1xuICAvL3BvbHlnb24gYW5kIHBhc3MgdGhlc2UgdG8gVGhyZWVKUy5wb2x5Z29uKClcbiAgLy9UT0RPIG1ha2Ugc3BhY2luZyBhIGZ1bmN0aW9uIG9mIGZpbmFsIHJlc29sdXRpb25cbiAgLy9UT0RPIGNoZWNrIHdoZXRoZXIgdmVydGljZXMgYXJlIGluIHRoZSByaWdodCBvcmRlclxuICBwb2x5Z29uKHZlcnRpY2VzLCBjb2xvciwgdGV4dHVyZSwgd2lyZWZyYW1lKSB7XG4gICAgY29uc3QgcG9pbnRzID0gW107XG4gICAgY29uc3Qgc3BhY2luZyA9IDU7XG4gICAgY29uc3QgbCA9IHZlcnRpY2VzLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgbGV0IHA7XG4gICAgICBjb25zdCBhcmMgPSBILmFyYyh2ZXJ0aWNlc1tpXSwgdmVydGljZXNbKGkgKyAxKSAlIGxdLCB0aGlzLmNpcmNsZSk7XG5cbiAgICAgIC8vbGluZSBub3QgdGhyb3VnaCB0aGUgb3JpZ2luIChoeXBlcmJvbGljIGFyYylcbiAgICAgIGlmICghYXJjLnN0cmFpZ2h0TGluZSkge1xuXG4gICAgICAgIGlmIChhcmMuY2xvY2t3aXNlKSB7XG4gICAgICAgICAgcCA9IEUuc3BhY2VkUG9pbnRPbkFyYyhhcmMuY2lyY2xlLCB2ZXJ0aWNlc1tpXSwgc3BhY2luZykucDI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcCA9IEUuc3BhY2VkUG9pbnRPbkFyYyhhcmMuY2lyY2xlLCB2ZXJ0aWNlc1tpXSwgc3BhY2luZykucDE7XG4gICAgICAgIH1cbiAgICAgICAgcG9pbnRzLnB1c2gocCk7XG5cbiAgICAgICAgd2hpbGUgKEUuZGlzdGFuY2UocCwgdmVydGljZXNbKGkgKyAxKSAlIGxdKSA+IHNwYWNpbmcpIHtcblxuICAgICAgICAgIGlmIChhcmMuY2xvY2t3aXNlKSB7XG4gICAgICAgICAgICBwID0gRS5zcGFjZWRQb2ludE9uQXJjKGFyYy5jaXJjbGUsIHAsIHNwYWNpbmcpLnAyO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwID0gRS5zcGFjZWRQb2ludE9uQXJjKGFyYy5jaXJjbGUsIHAsIHNwYWNpbmcpLnAxO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHBvaW50cy5wdXNoKHApO1xuICAgICAgICB9XG4gICAgICAgIHBvaW50cy5wdXNoKHZlcnRpY2VzWyhpICsgMSkgJSBsXSk7XG4gICAgICB9XG5cbiAgICAgIC8vbGluZSB0aHJvdWdoIG9yaWdpbiAoc3RyYWlnaHQgbGluZSlcbiAgICAgIGVsc2V7XG4gICAgICAgIHBvaW50cy5wdXNoKHZlcnRpY2VzWyhpICsgMSkgJSBsXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yKGxldCBwb2ludCBvZiBwb2ludHMpe1xuICAgICAgLy90aGlzLnBvaW50KHBvaW50LDIsMHgxMGRlZDgpO1xuICAgIH1cblxuICAgIHRoaXMuZHJhdy5wb2x5Z29uKHBvaW50cywgY29sb3IsIHRleHR1cmUsIHdpcmVmcmFtZSk7XG4gIH1cblxuICAvL3JldHVybiB0cnVlIGlmIGFueSBvZiB0aGUgcG9pbnRzIGlzIG5vdCBpbiB0aGUgZGlza1xuICBjaGVja1BvaW50cyguLi5wb2ludHMpIHtcbiAgICBjb25zdCByID0gdGhpcy5yYWRpdXM7XG4gICAgbGV0IHRlc3QgPSBmYWxzZTtcbiAgICBmb3IgKGxldCBwb2ludCBvZiBwb2ludHMpIHtcbiAgICAgIGlmIChFLmRpc3RhbmNlKHBvaW50LCB0aGlzLmNlbnRyZSkgPiByKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yISBQb2ludCAoJyArIHBvaW50LnggKyAnLCAnICsgcG9pbnQueSArICcpIGxpZXMgb3V0c2lkZSB0aGUgcGxhbmUhJyk7XG4gICAgICAgIHRlc3QgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGVzdCkgcmV0dXJuIHRydWVcbiAgICBlbHNlIHJldHVybiBmYWxzZVxuICB9XG59XG4iLCJpbXBvcnQge1xuICBQb2ludFxufVxuZnJvbSAnLi9wb2ludCc7XG5cbmltcG9ydCB7XG4gIENpcmNsZVxufVxuZnJvbSAnLi9jaXJjbGUnO1xuLy8gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gKlxuLy8gKiAgIEVVQ0xJREVBTiBGVU5DVElPTlNcbi8vICogICBhIHBsYWNlIHRvIHN0YXNoIGFsbCB0aGUgZnVuY3Rpb25zIHRoYXQgYXJlIGV1Y2xpZGVhbiBnZW9tZXRyaWNhbFxuLy8gKiAgIG9wZXJhdGlvbnNcbi8vICogICBBbGwgZnVuY3Rpb25zIGFyZSAyRCB1bmxlc3Mgb3RoZXJ3aXNlIHNwZWNpZmllZCFcbi8vICpcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuLy9kaXN0YW5jZSBiZXR3ZWVuIHR3byBwb2ludHNcbmV4cG9ydCBjb25zdCBkaXN0YW5jZSA9IChwMSwgcDIpID0+IHtcbiAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdygocDIueCAtIHAxLngpLCAyKSArIE1hdGgucG93KChwMi55IC0gcDEueSksIDIpKTtcbn1cblxuLy9taWRwb2ludCBvZiB0aGUgbGluZSBzZWdtZW50IGNvbm5lY3RpbmcgdHdvIHBvaW50c1xuZXhwb3J0IGNvbnN0IG1pZHBvaW50ID0gKHAxLCBwMikgPT4ge1xuICByZXR1cm4gbmV3IFBvaW50KChwMS54ICsgcDIueCkgLyAyLCAocDEueSArIHAyLnkpIC8gMik7XG59XG5cbi8vc2xvcGUgb2YgbGluZSB0aHJvdWdoIHAxLCBwMlxuZXhwb3J0IGNvbnN0IHNsb3BlID0gKHAxLCBwMikgPT4ge1xuICByZXR1cm4gKHAyLnggLSBwMS54KSAvIChwMi55IC0gcDEueSk7XG59XG5cbi8vc2xvcGUgb2YgbGluZSBwZXJwZW5kaWN1bGFyIHRvIGEgbGluZSBkZWZpbmVkIGJ5IHAxLHAyXG5leHBvcnQgY29uc3QgcGVycGVuZGljdWxhclNsb3BlID0gKHAxLCBwMikgPT4ge1xuICByZXR1cm4gLTEgLyAoTWF0aC5wb3coc2xvcGUocDEsIHAyKSwgLTEpKTtcbn1cblxuLy9pbnRlcnNlY3Rpb24gcG9pbnQgb2YgdHdvIGxpbmVzIGRlZmluZWQgYnkgcDEsbTEgYW5kIHExLG0yXG5leHBvcnQgY29uc3QgaW50ZXJzZWN0aW9uID0gKHAxLCBtMSwgcDIsIG0yKSA9PiB7XG4gIGxldCBjMSwgYzIsIHgsIHk7XG4gIGlmICggdG9GaXhlZChwMS55LCAxMCkgPT0gMCkge1xuICAgIHggPSBwMS54O1xuICAgIHkgPSAobTIpICogKHAxLnggLSBwMi54KSArIHAyLnk7XG4gIH1cbiAgZWxzZSBpZiAoIHRvRml4ZWQocDIueSwgMTApID09IDApIHtcbiAgICB4ID0gcDIueDtcbiAgICB5ID0gKG0xICogKHAyLnggLSBwMS54KSkgKyBwMS55O1xuICB9IGVsc2Uge1xuICAgIC8veSBpbnRlcmNlcHQgb2YgZmlyc3QgbGluZVxuICAgIGMxID0gcDEueSAtIG0xICogcDEueDtcbiAgICAvL3kgaW50ZXJjZXB0IG9mIHNlY29uZCBsaW5lXG4gICAgYzIgPSBwMi55IC0gbTIgKiBwMi54O1xuXG4gICAgeCA9IChjMiAtIGMxKSAvIChtMSAtIG0yKTtcbiAgICB5ID0gbTEgKiB4ICsgYzE7XG4gIH1cblxuICByZXR1cm4gbmV3IFBvaW50KHgsIHkpO1xufVxuXG5leHBvcnQgY29uc3QgcmFkaWFucyA9IChkZWdyZWVzKSA9PiB7XG4gIHJldHVybiAoTWF0aC5QSSAvIDE4MCkgKiBkZWdyZWVzO1xufVxuXG4vL2dldCB0aGUgY2lyY2xlIGludmVyc2Ugb2YgYSBwb2ludCBwIHdpdGggcmVzcGVjdCBhIGNpcmNsZSByYWRpdXMgciBjZW50cmUgY1xuZXhwb3J0IGNvbnN0IGludmVyc2UgPSAocG9pbnQsIGNpcmNsZSkgPT4ge1xuICBjb25zdCBjID0gY2lyY2xlLmNlbnRyZTtcbiAgY29uc3QgciA9IGNpcmNsZS5yYWRpdXM7XG4gIGNvbnN0IGFscGhhID0gKHIgKiByKSAvIChNYXRoLnBvdyhwb2ludC54IC0gYy54LCAyKSArIE1hdGgucG93KHBvaW50LnkgLSBjLnksIDIpKTtcbiAgcmV0dXJuIG5ldyBQb2ludChhbHBoYSAqIChwb2ludC54IC0gYy54KSArIGMueCwgYWxwaGEgKiAocG9pbnQueSAtIGMueSkgKyBjLnkpO1xufVxuXG4vL3JlZmxlY3QgcDMgYWNyb3NzIHRoZSBsaW5lIGRlZmluZWQgYnkgcDEscDJcbmV4cG9ydCBjb25zdCBsaW5lUmVmbGVjdGlvbiA9IChwMSwgcDIsIHAzKSA9PiB7XG4gIGNvbnN0IG0gPSBzbG9wZShwMSwgcDIpO1xuICAvL3JlZmxlY3Rpb24gaW4geSBheGlzXG4gIGlmIChtID4gOTk5OTk5IHx8IG0gPCAtOTk5OTk5KSB7XG4gICAgcmV0dXJuIG5ldyBQb2ludCggcDMueCwgLXAzLnkpO1xuICB9XG4gIC8vcmVmbGVjdGlvbiBpbiB4IGF4aXNcbiAgZWxzZSBpZiAoIHRvRml4ZWQobSwgMTApID09IDApIHtcbiAgICByZXR1cm4gbmV3IFBvaW50KCAtcDMueCwgcDMueSk7XG4gIH1cbiAgLy9yZWZsZWN0aW9uIGluIGFyYml0cmFyeSBsaW5lXG4gIGVsc2Uge1xuICAgIGNvbnN0IGMgPSBwMS55IC0gbSAqIHAxLng7XG4gICAgY29uc3QgZCA9IChwMy54ICsgKHAzLnkgLSBjKSAqIG0pIC8gKDEgKyBtICogbSk7XG4gICAgY29uc3QgeCA9IDIgKiBkIC0gcDMueDtcbiAgICBjb25zdCB5ID0gMiAqIGQgKiBtIC0gcDMueSArIDIgKiBjO1xuICAgIHJldHVybiBuZXcgUG9pbnQoeCx5KTtcbiAgfVxufVxuXG4vL2NhbGN1bGF0ZSB0aGUgcmFkaXVzIGFuZCBjZW50cmUgb2YgdGhlIGNpcmNsZSByZXF1aXJlZCB0byBkcmF3IGEgbGluZSBiZXR3ZWVuXG4vL3R3byBwb2ludHMgaW4gdGhlIGh5cGVyYm9saWMgcGxhbmUgZGVmaW5lZCBieSB0aGUgZGlzayAociwgYylcbmV4cG9ydCBjb25zdCBncmVhdENpcmNsZSA9IChwMSwgcDIsIGNpcmNsZSkgPT4ge1xuICBjb25zdCBwMUludmVyc2UgPSBpbnZlcnNlKHAxLCBjaXJjbGUpO1xuICBjb25zdCBwMkludmVyc2UgPSBpbnZlcnNlKHAyLCBjaXJjbGUpO1xuXG4gIGNvbnN0IG0gPSBtaWRwb2ludChwMSwgcDFJbnZlcnNlKTtcbiAgY29uc3QgbiA9IG1pZHBvaW50KHAyLCBwMkludmVyc2UpO1xuXG4gIGNvbnN0IG0xID0gcGVycGVuZGljdWxhclNsb3BlKG0sIHAxSW52ZXJzZSk7XG4gIGNvbnN0IG0yID0gcGVycGVuZGljdWxhclNsb3BlKG4sIHAySW52ZXJzZSk7XG5cblxuICAvL2NlbnRyZSBpcyB0aGUgY2VudHJlcG9pbnQgb2YgdGhlIGNpcmNsZSBvdXQgb2Ygd2hpY2ggdGhlIGFyYyBpcyBtYWRlXG4gIGNvbnN0IGNlbnRyZSA9IGludGVyc2VjdGlvbihtLCBtMSwgbiwgbTIpO1xuICBjb25zdCByYWRpdXMgPSBkaXN0YW5jZShjZW50cmUsIHAxKTtcblxuICByZXR1cm4gbmV3IENpcmNsZShjZW50cmUueCwgY2VudHJlLnksIHJhZGl1cyk7XG59XG5cbi8vaW50ZXJzZWN0aW9uIG9mIHR3byBjaXJjbGVzIHdpdGggZXF1YXRpb25zOlxuLy8oeC1hKV4yICsoeS1hKV4yID0gcjBeMlxuLy8oeC1iKV4yICsoeS1jKV4yID0gcjFeMlxuLy9OT1RFIGFzc3VtZXMgdGhlIHR3byBjaXJjbGVzIERPIGludGVyc2VjdCFcbmV4cG9ydCBjb25zdCBjaXJjbGVJbnRlcnNlY3QgPSAoY2lyY2xlMCwgY2lyY2xlMSkgPT4ge1xuICBjb25zdCBhID0gY2lyY2xlMC5jZW50cmUueDtcbiAgY29uc3QgYiA9IGNpcmNsZTAuY2VudHJlLnk7XG4gIGNvbnN0IGMgPSBjaXJjbGUxLmNlbnRyZS54O1xuICBjb25zdCBkID0gY2lyY2xlMS5jZW50cmUueTtcbiAgY29uc3QgcjAgPSBjaXJjbGUwLnJhZGl1cztcbiAgY29uc3QgcjEgPSBjaXJjbGUxLnJhZGl1cztcblxuICBjb25zdCBkaXN0ID0gTWF0aC5zcXJ0KChjIC0gYSkgKiAoYyAtIGEpICsgKGQgLSBiKSAqIChkIC0gYikpO1xuXG4gIGNvbnN0IGRlbCA9IE1hdGguc3FydCgoZGlzdCArIHIwICsgcjEpICogKGRpc3QgKyByMCAtIHIxKSAqIChkaXN0IC0gcjAgKyByMSkgKiAoLWRpc3QgKyByMCArIHIxKSkgLyA0O1xuXG4gIGNvbnN0IHhQYXJ0aWFsID0gKGEgKyBjKSAvIDIgKyAoKGMgLSBhKSAqIChyMCAqIHIwIC0gcjEgKiByMSkpIC8gKDIgKiBkaXN0ICogZGlzdCk7XG4gIGNvbnN0IHgxID0geFBhcnRpYWwgLSAyICogZGVsICogKGIgLSBkKSAvIChkaXN0ICogZGlzdCk7XG4gIGNvbnN0IHgyID0geFBhcnRpYWwgKyAyICogZGVsICogKGIgLSBkKSAvIChkaXN0ICogZGlzdCk7XG5cbiAgY29uc3QgeVBhcnRpYWwgPSAoYiArIGQpIC8gMiArICgoZCAtIGIpICogKHIwICogcjAgLSByMSAqIHIxKSkgLyAoMiAqIGRpc3QgKiBkaXN0KTtcbiAgY29uc3QgeTEgPSB5UGFydGlhbCArIDIgKiBkZWwgKiAoYSAtIGMpIC8gKGRpc3QgKiBkaXN0KTtcbiAgY29uc3QgeTIgPSB5UGFydGlhbCAtIDIgKiBkZWwgKiAoYSAtIGMpIC8gKGRpc3QgKiBkaXN0KTtcblxuICBjb25zdCBwMSA9IG5ldyBQb2ludCh4MSx5MSk7XG5cbiAgY29uc3QgcDIgPSBuZXcgUG9pbnQoeDIseTIpO1xuXG4gIHJldHVybiB7XG4gICAgcDE6IHAxLFxuICAgIHAyOiBwMlxuICB9O1xufVxuXG5leHBvcnQgY29uc3QgY2lyY2xlTGluZUludGVyc2VjdCA9IChjaXJjbGUsIHAxLCBwMikgPT4ge1xuICBjb25zdCBjeCA9IGNpcmNsZS5jZW50cmUueDtcbiAgY29uc3QgY3kgPSBjaXJjbGUuY2VudHJlLnk7XG4gIGNvbnN0IHIgPSBjaXJjbGUucmFkaXVzO1xuXG4gIGNvbnN0IGQgPSBkaXN0YW5jZShwMSwgcDIpO1xuICAvL3VuaXQgdmVjdG9yIHAxIHAyXG4gIGNvbnN0IGR4ID0gKHAyLnggLSBwMS54KSAvIGQ7XG4gIGNvbnN0IGR5ID0gKHAyLnkgLSBwMS55KSAvIGQ7XG5cbiAgLy9wb2ludCBvbiBsaW5lIGNsb3Nlc3QgdG8gY2lyY2xlIGNlbnRyZVxuICBjb25zdCB0ID0gZHggKiAoY3ggLSBwMS54KSArIGR5ICogKGN5IC0gcDEueSk7XG4gIGNvbnN0IHAgPSBuZXcgUG9pbnQodCAqIGR4ICsgcDEueCwgdCAqIGR5ICsgcDEueSk7XG5cbiAgLy9kaXN0YW5jZSBmcm9tIHRoaXMgcG9pbnQgdG8gY2VudHJlXG4gIGNvbnN0IGQyID0gZGlzdGFuY2UocCwgY2lyY2xlLmNlbnRyZSk7XG5cbiAgLy9saW5lIGludGVyc2VjdHMgY2lyY2xlXG4gIGlmIChkMiA8IHIpIHtcbiAgICBjb25zdCBkdCA9IE1hdGguc3FydChyICogciAtIGQyICogZDIpO1xuICAgIC8vcG9pbnQgMVxuICAgIGNvbnN0IHExID0gbmV3IFBvaW50KCh0IC0gZHQpICogZHggKyBwMS54LCAodCAtIGR0KSAqIGR5ICsgcDEueSk7XG4gICAgLy9wb2ludCAyXG4gICAgY29uc3QgcTIgPSBuZXcgUG9pbnQoKHQgKyBkdCkgKiBkeCArIHAxLngsKHQgKyBkdCkgKiBkeSArIHAxLnkpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHAxOiBxMSxcbiAgICAgIHAyOiBxMlxuICAgIH07XG4gIH0gZWxzZSBpZiAoZDIgPT09IHIpIHtcbiAgICByZXR1cm4gcDtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvcjogbGluZSBkb2VzIG5vdCBpbnRlcnNlY3QgY2lyY2xlIScpO1xuICB9XG59XG5cbi8vYW5nbGUgaW4gcmFkaWFucyBiZXR3ZWVuIHR3byBwb2ludHMgb24gY2lyY2xlIG9mIHJhZGl1cyByXG5leHBvcnQgY29uc3QgY2VudHJhbEFuZ2xlID0gKHAxLCBwMiwgcikgPT4ge1xuICAvL3JvdW5kIG9mZiBlcnJvciBjYW4gcmVzdWx0IGluIHRoaXMgYmVpbmcgdmVyeSBzbGlnaHRseSBncmVhdGVyIHRoYW4gMVxuICBsZXQgdGVtcCA9ICgwLjUgKiBkaXN0YW5jZShwMSwgcDIpIC8gcik7XG4gIHRlbXAgPSB0b0ZpeGVkKHRlbXAsMTApO1xuICBsZXQgcmVzID0gMiAqIE1hdGguYXNpbih0ZW1wKTtcbiAgaWYoaXNOYU4ocmVzKSkgcmVzID0gMDtcbiAgcmV0dXJuIHJlcztcbn1cblxuLy9jYWxjdWxhdGUgdGhlIG5vcm1hbCB2ZWN0b3IgZ2l2ZW4gMiBwb2ludHNcbmV4cG9ydCBjb25zdCBub3JtYWxWZWN0b3IgPSAocDEsIHAyKSA9PiB7XG4gIGxldCBkID0gTWF0aC5zcXJ0KE1hdGgucG93KHAyLnggLSBwMS54LCAyKSArIE1hdGgucG93KHAyLnkgLSBwMS55LCAyKSk7XG4gIHJldHVybiBuZXcgUG9pbnQoKHAyLnggLSBwMS54KSAvIGQsKHAyLnkgLSBwMS55KSAvIGQpO1xufVxuXG4vL2RvZXMgdGhlIGxpbmUgY29ubmVjdGluZyBwMSwgcDIgZ28gdGhyb3VnaCB0aGUgcG9pbnQgKDAsMCk/XG4vL25lZWRzIHRvIHRha2UgaW50byBhY2NvdW50IHJvdW5kb2ZmIGVycm9ycyBzbyByZXR1cm5zIHRydWUgaWZcbi8vdGVzdCBpcyBjbG9zZSB0byAwXG5leHBvcnQgY29uc3QgdGhyb3VnaE9yaWdpbiA9IChwMSwgcDIpID0+IHtcbiAgaWYgKCB0b0ZpeGVkKHAxLngsIDEwKSA9PSAwICYmIHRvRml4ZWQocDIueCwgMTApID09PSAwKSB7XG4gICAgLy92ZXJ0aWNhbCBsaW5lIHRocm91Z2ggY2VudHJlXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgY29uc3QgdGVzdCA9ICgtcDEueCAqIHAyLnkgKyBwMS54ICogcDEueSkgLyAocDIueCAtIHAxLngpICsgcDEueTtcblxuICBpZiAoIHRvRml4ZWQodGVzdCwgMTApID09IDApIHJldHVybiB0cnVlO1xuICBlbHNlIHJldHVybiBmYWxzZTtcbn1cblxuLy9maW5kIHRoZSBjZW50cm9pZCBvZiBhIG5vbi1zZWxmLWludGVyc2VjdGluZyBwb2x5Z29uXG5leHBvcnQgY29uc3QgY2VudHJvaWRPZlBvbHlnb24gPSAocG9pbnRzKSA9PiB7XG4gIGxldCBmaXJzdCA9IHBvaW50c1swXSxcbiAgICBsYXN0ID0gcG9pbnRzW3BvaW50cy5sZW5ndGggLSAxXTtcbiAgaWYgKGZpcnN0LnggIT09IGxhc3QueCB8fCBmaXJzdC55ICE9PSBsYXN0LnkpIHBvaW50cy5wdXNoKGZpcnN0KTtcbiAgbGV0IHR3aWNlYXJlYSA9IDAsXG4gICAgeCA9IDAsXG4gICAgeSA9IDAsXG4gICAgblB0cyA9IHBvaW50cy5sZW5ndGgsXG4gICAgcDEsIHAyLCBmO1xuICBmb3IgKHZhciBpID0gMCwgaiA9IG5QdHMgLSAxOyBpIDwgblB0czsgaiA9IGkrKykge1xuICAgIHAxID0gcG9pbnRzW2ldO1xuICAgIHAyID0gcG9pbnRzW2pdO1xuICAgIGYgPSBwMS54ICogcDIueSAtIHAyLnggKiBwMS55O1xuICAgIHR3aWNlYXJlYSArPSBmO1xuICAgIHggKz0gKHAxLnggKyBwMi54KSAqIGY7XG4gICAgeSArPSAocDEueSArIHAyLnkpICogZjtcbiAgfVxuICBmID0gdHdpY2VhcmVhICogMztcbiAgcmV0dXJuIG5ldyBQb2ludCggeCAvIGYsIHkgLyBmKTtcbn1cblxuLy9maW5kIGEgcG9pbnQgYXQgYSBkaXN0YW5jZSBkIGFsb25nIHRoZSBjaXJjdW1mZXJlbmNlIG9mXG4vL2EgY2lyY2xlIG9mIHJhZGl1cyByLCBjZW50cmUgYyBmcm9tIGEgcG9pbnQgYWxzb1xuLy9vbiB0aGUgY2lyY3VtZmVyZW5jZVxuZXhwb3J0IGNvbnN0IHNwYWNlZFBvaW50T25BcmMgPSAoY2lyY2xlLCBwb2ludCwgc3BhY2luZykgPT4ge1xuICBjb25zdCBjb3NUaGV0YSA9IC0oKHNwYWNpbmcgKiBzcGFjaW5nKSAvICgyICogY2lyY2xlLnJhZGl1cyAqIGNpcmNsZS5yYWRpdXMpIC0gMSk7XG4gIGNvbnN0IHNpblRoZXRhUG9zID0gTWF0aC5zcXJ0KDEgLSBNYXRoLnBvdyhjb3NUaGV0YSwgMikpO1xuICBjb25zdCBzaW5UaGV0YU5lZyA9IC1zaW5UaGV0YVBvcztcblxuICBjb25zdCB4UG9zID0gY2lyY2xlLmNlbnRyZS54ICsgY29zVGhldGEgKiAocG9pbnQueCAtIGNpcmNsZS5jZW50cmUueCkgLSBzaW5UaGV0YVBvcyAqIChwb2ludC55IC0gY2lyY2xlLmNlbnRyZS55KTtcbiAgY29uc3QgeE5lZyA9IGNpcmNsZS5jZW50cmUueCArIGNvc1RoZXRhICogKHBvaW50LnggLSBjaXJjbGUuY2VudHJlLngpIC0gc2luVGhldGFOZWcgKiAocG9pbnQueSAtIGNpcmNsZS5jZW50cmUueSk7XG4gIGNvbnN0IHlQb3MgPSBjaXJjbGUuY2VudHJlLnkgKyBzaW5UaGV0YVBvcyAqIChwb2ludC54IC0gY2lyY2xlLmNlbnRyZS54KSArIGNvc1RoZXRhICogKHBvaW50LnkgLSBjaXJjbGUuY2VudHJlLnkpO1xuICBjb25zdCB5TmVnID0gY2lyY2xlLmNlbnRyZS55ICsgc2luVGhldGFOZWcgKiAocG9pbnQueCAtIGNpcmNsZS5jZW50cmUueCkgKyBjb3NUaGV0YSAqIChwb2ludC55IC0gY2lyY2xlLmNlbnRyZS55KTtcblxuICByZXR1cm4ge1xuICAgIHAxOiBuZXcgUG9pbnQoeFBvcywgeVBvcyksXG4gICAgcDI6IG5ldyBQb2ludCh4TmVnLHlOZWcpXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHJhbmRvbUZsb2F0ID0gKG1pbiwgbWF4KSA9PiB7XG4gIHJldHVybiBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW47XG59XG5cbmV4cG9ydCBjb25zdCByYW5kb21JbnQgPSAobWluLCBtYXgpID0+IHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSArIG1pbik7XG59XG5cbi8vLnRvRml4ZWQgcmV0dXJucyBhIHN0cmluZyBmb3Igc29tZSBubyBkb3VidCB2ZXJ5IGdvb2QgcmVhc29uLlxuLy9DaGFuZ2UgaXQgYmFjayB0byBhIGZsb2F0XG5leHBvcnQgY29uc3QgdG9GaXhlZCA9IChudW1iZXIsIHBsYWNlcykgPT4ge1xuICByZXR1cm4gcGFyc2VGbG9hdChudW1iZXIudG9GaXhlZChwbGFjZXMpKTtcbn1cbiIsImltcG9ydCAqIGFzIEUgZnJvbSAnLi9ldWNsaWQnO1xuaW1wb3J0IHsgUG9pbnQgfSBmcm9tICcuL3BvaW50Jztcbi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICpcbi8vICogICBIWVBFUkJPTElDIEZVTkNUSU9OU1xuLy8gKiAgIGEgcGxhY2UgdG8gc3Rhc2ggYWxsIHRoZSBmdW5jdGlvbnMgdGhhdCBhcmUgaHlwZXJib2xpYyBnZW1lb21ldHJpY2FsXG4vLyAqICAgb3BlcmF0aW9uc1xuLy8gKlxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4vL2NhbGN1bGF0ZSBncmVhdENpcmNsZSwgc3RhcnRBbmdsZSBhbmQgZW5kQW5nbGUgZm9yIGh5cGVyYm9saWMgYXJjXG4vL1RPRE8gZGVhbCB3aXRoIGNhc2Ugb2Ygc3RhaWdodCBsaW5lcyB0aHJvdWdoIGNlbnRyZVxuZXhwb3J0IGNvbnN0IGFyYyA9IChwMSwgcDIsIGNpcmNsZSkgPT4ge1xuICBpZiAoRS50aHJvdWdoT3JpZ2luKHAxLCBwMikpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY2lyY2xlOiBjaXJjbGUsXG4gICAgICBzdGFydEFuZ2xlOiAwLFxuICAgICAgZW5kQW5nbGU6IDAsXG4gICAgICBjbG9ja3dpc2U6IGZhbHNlLFxuICAgICAgc3RyYWlnaHRMaW5lOiB0cnVlLFxuICAgIH1cbiAgfVxuICBsZXQgY2xvY2t3aXNlID0gZmFsc2U7XG4gIGxldCBhbHBoYTEsIGFscGhhMiwgc3RhcnRBbmdsZSwgZW5kQW5nbGU7XG4gIGNvbnN0IGMgPSBFLmdyZWF0Q2lyY2xlKHAxLCBwMiwgY2lyY2xlKTtcbiAgY29uc3Qgb3kgPSBFLnRvRml4ZWQoYy5jZW50cmUueSwgMTApO1xuICBjb25zdCBveCA9IEUudG9GaXhlZChjLmNlbnRyZS54LCAxMCk7XG5cbiAgLy9wb2ludCBhdCAwIHJhZGlhbnMgb24gY1xuICBjb25zdCBwMyA9IG5ldyBQb2ludCggb3ggKyBjLnJhZGl1cywgb3kpO1xuXG4gIC8vY2FsY3VsYXRlIHRoZSBwb3NpdGlvbiBvZiBlYWNoIHBvaW50IGluIHRoZSBjaXJjbGVcbiAgYWxwaGExID0gRS5jZW50cmFsQW5nbGUocDMsIHAxLCBjLnJhZGl1cyk7XG4gIGFscGhhMiA9IEUuY2VudHJhbEFuZ2xlKHAzLCBwMiwgYy5yYWRpdXMpO1xuXG4gIC8vZm9yIGNvbXBhcmlzb24gdG8gYXZvaWQgcm91bmQgb2ZmIGVycm9yc1xuICBjb25zdCBwMVggPSBFLnRvRml4ZWQocDEueCwgMTApO1xuICBjb25zdCBwMVkgPSBFLnRvRml4ZWQocDEueSwgMTApO1xuICBjb25zdCBwMlggPSBFLnRvRml4ZWQocDIueCwgMTApO1xuICBjb25zdCBwMlkgPSBFLnRvRml4ZWQocDIueSwgMTApO1xuXG4gIC8vY29uc29sZS5sb2coJ3AyeDogJywgcDJYLCdveDogJywgb3gpO1xuICAvL2NvbnNvbGUubG9nKCdwMXk6ICcsIHAxWSwgJ3AyeTogJywgcDJZLCdveDogJywgb3gpO1xuXG4gIGFscGhhMSA9IChwMVkgPCBveSkgPyAyICogTWF0aC5QSSAtIGFscGhhMSA6IGFscGhhMTtcbiAgYWxwaGEyID0gKHAyWSA8IG95KSA/IDIgKiBNYXRoLlBJIC0gYWxwaGEyIDogYWxwaGEyO1xuXG4gIC8vY29uc29sZS5sb2coYWxwaGExLCBhbHBoYTIpO1xuXG4gIC8vY2FzZSB3aGVyZSBwMSBhYm92ZSBhbmQgcDIgYmVsb3cgb3Igb24gdGhlIGxpbmUgYy5jZW50cmUgLT4gcDNcbiAgaWYgKCEocDFYIDw9IG94ICYmIHAyWCA8PSBveCkgJiYgKHAxWSA8PSBveSAmJiBwMlkgPj0gb3kpKSB7XG4gICAgc3RhcnRBbmdsZSA9IGFscGhhMTtcbiAgICBlbmRBbmdsZSA9IGFscGhhMjtcbiAgfVxuICAvL2Nhc2Ugd2hlcmUgcDIgYWJvdmUgYW5kIHAxIGJlbG93IG9yIG9uIHRoZSBsaW5lIGMuY2VudHJlIC0+IHAzXG4gIGVsc2UgaWYgKChwMVggPj0gb3ggJiYgcDJYID49IG94KSAmJiAocDFZID49IG95ICYmIHAyWSA8PSBveSkpIHtcbiAgICBzdGFydEFuZ2xlID0gYWxwaGEyO1xuICAgIGVuZEFuZ2xlID0gYWxwaGExO1xuICAgIGNsb2Nrd2lzZSA9IHRydWU7XG4gIH1cbiAgLy9wb2ludHMgaW4gY2xvY2t3aXNlIG9yZGVyXG4gIGVsc2UgaWYgKGFscGhhMSA+IGFscGhhMikge1xuICAgIHN0YXJ0QW5nbGUgPSBhbHBoYTI7XG4gICAgZW5kQW5nbGUgPSBhbHBoYTE7XG4gICAgY2xvY2t3aXNlID0gdHJ1ZTtcbiAgfVxuICAvL3BvaW50cyBpbiBhbnRpY2xvY2t3aXNlIG9yZGVyXG4gIGVsc2Uge1xuICAgIHN0YXJ0QW5nbGUgPSBhbHBoYTE7XG4gICAgZW5kQW5nbGUgPSBhbHBoYTI7XG4gIH1cbiAgLy9jb25zb2xlLmxvZyhzdGFydEFuZ2xlLCBlbmRBbmdsZSwgY2xvY2t3aXNlKTtcbiAgcmV0dXJuIHtcbiAgICBjaXJjbGU6IGMsXG4gICAgc3RhcnRBbmdsZTogc3RhcnRBbmdsZSxcbiAgICBlbmRBbmdsZTogZW5kQW5nbGUsXG4gICAgY2xvY2t3aXNlOiBjbG9ja3dpc2UsXG4gICAgc3RyYWlnaHRMaW5lOiBmYWxzZSxcbiAgfVxufVxuXG4vL3RyYW5zbGF0ZSBhIHNldCBvZiBwb2ludHMgYWxvbmcgdGhlIHggYXhpc1xuZXhwb3J0IGNvbnN0IHRyYW5zbGF0ZVggPSAocG9pbnRzQXJyYXksIGRpc3RhbmNlKSA9PiB7XG4gIGNvbnN0IGwgPSBwb2ludHNBcnJheS5sZW5ndGg7XG4gIGNvbnN0IG5ld1BvaW50cyA9IFtdO1xuICBjb25zdCBlID0gTWF0aC5wb3coTWF0aC5FLCBkaXN0YW5jZSk7XG4gIGNvbnN0IHBvcyA9IGUgKyAxO1xuICBjb25zdCBuZWcgPSBlIC0gMTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICBjb25zdCB4ID0gcG9zICogcG9pbnRzQXJyYXlbaV0ueCArIG5lZyAqIHBvaW50c0FycmF5W2ldLnk7XG4gICAgY29uc3QgeSA9IG5lZyAqIHBvaW50c0FycmF5W2ldLnggKyBwb3MgKiBwb2ludHNBcnJheVtpXS55O1xuICAgIG5ld1BvaW50cy5wdXNoKCBuZXcgUG9pbnQoeCx5KSk7XG4gIH1cbiAgcmV0dXJuIG5ld1BvaW50cztcbn1cblxuLy9yb3RhdGUgYSBzZXQgb2YgcG9pbnRzIGFib3V0IGEgcG9pbnQgYnkgYSBnaXZlbiBhbmdsZVxuLy9jbG9ja3dpc2UgZGVmYXVsdHMgdG8gZmFsc2VcbmV4cG9ydCBjb25zdCByb3RhdGlvbiA9IChwb2ludHNBcnJheSwgcG9pbnQsIGFuZ2xlLCBjbG9ja3dpc2UpID0+IHtcblxufVxuXG4vL3JlZmxlY3QgYSBzZXQgb2YgcG9pbnRzIGFjcm9zcyBhIGh5cGVyYm9saWMgYXJjXG4vL1RPRE8gYWRkIGNhc2Ugd2hlcmUgcmVmbGVjdGlvbiBpcyBhY3Jvc3Mgc3RyYWlnaHQgbGluZVxuZXhwb3J0IGNvbnN0IHJlZmxlY3QgPSAocG9pbnRzQXJyYXksIHAxLCBwMiwgY2lyY2xlKSA9PiB7XG4gIGNvbnN0IGwgPSBwb2ludHNBcnJheS5sZW5ndGg7XG4gIGNvbnN0IGEgPSBhcmMocDEsIHAyLCBjaXJjbGUpO1xuICBjb25zdCBuZXdQb2ludHMgPSBbXTtcblxuICBpZiAoIWEuc3RyYWlnaHRMaW5lKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgIG5ld1BvaW50cy5wdXNoKEUuaW52ZXJzZShwb2ludHNBcnJheVtpXSwgYS5jaXJjbGUpKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgIG5ld1BvaW50cy5wdXNoKEUubGluZVJlZmxlY3Rpb24ocDEscDIscG9pbnRzQXJyYXlbaV0pKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG5ld1BvaW50cztcbn1cblxuZXhwb3J0IGNvbnN0IHBvaW5jYXJlVG9XZWllcnN0cmFzcyA9IChwb2ludDJEKSA9PiB7XG4gIGNvbnN0IGZhY3RvciA9IDEgLyAoMSAtIHBvaW50MkQueCAqIHBvaW50MkQueCAtIHBvaW50MkQueSAqIHBvaW50MkQueSk7XG4gIHJldHVybiB7XG4gICAgeDogMiAqIGZhY3RvciAqIHBvaW50MkQueCxcbiAgICB5OiAyICogZmFjdG9yICogcG9pbnQyRC55LFxuICAgIHo6IGZhY3RvciAqICgxICsgcG9pbnQyRC54ICogcG9pbnQyRC54ICsgcG9pbnQyRC55ICogcG9pbnQyRC55KVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCB3ZWllcnN0cmFzc1RvUG9pbmNhcmUgPSAocG9pbnQzRCkgPT4ge1xuICBjb25zdCBmYWN0b3IgPSAxIC8gKDEgKyBwb2ludDNELnopO1xuICByZXR1cm4gbmV3IFBvaW50KGZhY3RvciAqIHBvaW50M0QueCxmYWN0b3IgKiBwb2ludDNELnkpO1xufVxuXG5leHBvcnQgY29uc3Qgcm90YXRlQWJvdXRPcmlnaW5XZWllcnN0cmFzcyA9IChwb2ludDNELCBhbmdsZSkgPT4ge1xuICByZXR1cm4ge1xuICAgIHg6IE1hdGguY29zKGFuZ2xlKSAqIHBvaW50M0QueCAtIE1hdGguc2luKGFuZ2xlKSAqIHBvaW50M0QueSxcbiAgICB5OiBNYXRoLnNpbihhbmdsZSkgKiBwb2ludDNELnggKyBNYXRoLmNvcyhhbmdsZSkgKiBwb2ludDNELnksXG4gICAgejogcG9pbnQzRC56XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHJvdGF0ZUFib3V0T3JpZ2luID0gKHBvaW50MkQsIGFuZ2xlKSA9PiB7XG4gIHJldHVybiBuZXcgUG9pbnQoTWF0aC5jb3MoYW5nbGUpICogcG9pbnQyRC54IC0gTWF0aC5zaW4oYW5nbGUpICogcG9pbnQyRC55LFxuICAgICBNYXRoLnNpbihhbmdsZSkgKiBwb2ludDJELnggKyBNYXRoLmNvcyhhbmdsZSkgKiBwb2ludDJELnkpO1xufVxuXG5leHBvcnQgY29uc3Qgcm90YXRlUGdvbkFib3V0T3JpZ2luID0gKHBvaW50czJEQXJyYXksIGFuZ2xlKSA9PiB7XG4gIGNvbnN0IGwgPSBwb2ludHMyREFycmF5Lmxlbmd0aDtcbiAgY29uc3Qgcm90YXRlZFBvaW50czJEQXJyYXkgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICBsZXQgcG9pbnQgPSByb3RhdGVBYm91dE9yaWdpbihwb2ludHMyREFycmF5W2ldLCBhbmdsZSk7XG4gICAgcm90YXRlZFBvaW50czJEQXJyYXkucHVzaChwb2ludCk7XG4gIH1cbiAgcmV0dXJuIHJvdGF0ZWRQb2ludHMyREFycmF5O1xufVxuXG4vL3doZW4gdGhlIHBvaW50IHAxIGlzIHRyYW5zbGF0ZWQgdG8gdGhlIG9yaWdpbiwgdGhlIHBvaW50IHAyXG4vL2lzIHRyYW5zbGF0ZWQgYWNjb3JkaW5nIHRvIHRoaXMgZm9ybXVsYVxuLy9odHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Qb2luY2FyJUMzJUE5X2Rpc2tfbW9kZWwjSXNvbWV0cmljX1RyYW5zZm9ybWF0aW9uc1xuZXhwb3J0IGNvbnN0IHRyYW5zbGF0ZVBvaW5jYXJlID0gKHAxLCBwMikgPT4ge1xuICBjb25zdCBkb3QgPSBwMS54ICogcDIueCArIHAxLnkgKiBwMi55O1xuICBjb25zdCBub3JtU3F1YXJlZFAxID0gTWF0aC5wb3coTWF0aC5zcXJ0KHAxLnggKiBwMS54ICsgcDEueSAqIHAxLnkpLCAyKTtcbiAgY29uc3Qgbm9ybVNxdWFyZWRQMiA9IE1hdGgucG93KE1hdGguc3FydChwMi54ICogcDIueCArIHAyLnkgKiBwMi55KSwgMik7XG4gIGNvbnN0IGRlbm9taW5hdG9yID0gMSArIDIgKiBkb3QgKyBub3JtU3F1YXJlZFAxICogbm9ybVNxdWFyZWRQMjtcblxuICBjb25zdCBwMUZhY3RvciA9ICgxICsgMiAqIGRvdCArIG5vcm1TcXVhcmVkUDIpIC8gZGVub21pbmF0b3I7XG4gIGNvbnN0IHAyRmFjdG9yID0gKDEgLSBub3JtU3F1YXJlZFAxKSAvIGRlbm9taW5hdG9yO1xuXG4gIGNvbnN0IHggPSBwMUZhY3RvciAqIHAxLnggKyBwMkZhY3RvciAqIHAyLng7XG4gIGNvbnN0IHkgPSBwMUZhY3RvciAqIHAxLnkgKyBwMkZhY3RvciAqIHAyLnk7XG5cbiAgcmV0dXJuIG5ldyBQb2ludCh4LHkpO1xufVxuXG5leHBvcnQgY29uc3QgaW52ZXJzZVRyYW5zbGF0ZVBvaW5jYXJlID0gKHAxLCBwMikgPT4ge1xuXG59XG4iLCJpbXBvcnQgKiBhcyBFIGZyb20gJy4vZXVjbGlkJztcbi8vVE9ETyBjcmVhdGUgY2lyY2xlIGNsYXNzIGFuZCByZWZhY3RvclxuLy9UT0RPIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJyk7IG5vdCB3b3JraW5nIGluIGZpcmVmb3hcbi8vVE9ETyBhcHBhcmVudGx5IC50b0ZpeGVkKCkgcmV0dXJucyBhIHN0cmluZ1xuXG5pbXBvcnQgeyBSZWd1bGFyVGVzc2VsYXRpb24gfSBmcm9tICcuL3JlZ3VsYXJUZXNzZWxhdGlvbic7XG5cbi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICpcbi8vICogICBTRVRVUFxuLy8gKlxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG5jb25zdCB0ZXNzZWxhdGlvbiA9IG5ldyBSZWd1bGFyVGVzc2VsYXRpb24oRS5yYW5kb21JbnQoNCwxMiksIEUucmFuZG9tSW50KDQsMTIpKTtcbi8vY29uc3QgdGVzc2VsYXRpb24gPSBuZXcgUmVndWxhclRlc3NlbGF0aW9uKDExLCAxMik7XG4iLCJpbXBvcnQgKiBhcyBFIGZyb20gJy4vZXVjbGlkJztcbi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICpcbi8vICogICBQT0lOVCBDTEFTU1xuLy8gKiAgIDJkIHBvaW50IGNsYXNzXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbmV4cG9ydCBjbGFzcyBQb2ludHtcbiAgY29uc3RydWN0b3IoeCwgeSl7XG4gICAgaWYoRS50b0ZpeGVkKHggLCAxMCkgPT0gMCl7XG4gICAgICB4ID0gMDtcbiAgICB9XG4gICAgaWYoRS50b0ZpeGVkKHkgLCAxMCkgPT0gMCl7XG4gICAgICB5ID0gMDtcbiAgICB9XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICB9XG5cbiAgdG9GaXhlZChwbGFjZXMpe1xuICAgIHRoaXMueCA9IEUudG9GaXhlZCh0aGlzLngsIHBsYWNlcyk7XG4gICAgdGhpcy55ID0gRS50b0ZpeGVkKHRoaXMueSwgcGxhY2VzKTtcbiAgfVxuXG4gIC8vY29tcGFyZSB0d28gcG9pbnRzIHRha2luZyByb3VuZGluZyBlcnJvcnMgaW50byBhY2NvdW50XG4gIGNvbXBhcmUocDIpe1xuICAgIGlmICh0eXBlb2YgcDIgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1dhcm5pbmc6IHBvaW50IG5vdCBkZWZpbmVkLicpXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IHQxID0gdGhpcy50b0ZpeGVkKDEwKTtcbiAgICBjb25zdCB0MiA9IHAyLnRvRml4ZWQoMTApO1xuXG4gICAgaWYgKHAxLnggPT09IHAyLnggJiYgcDEueSA9PT0gcDIueSkgcmV0dXJuIHRydWU7XG4gICAgZWxzZSByZXR1cm4gZmFsc2U7XG4gIH1cblxufVxuIiwiaW1wb3J0ICogYXMgRSBmcm9tICcuL2V1Y2xpZCc7XG5pbXBvcnQgKiBhcyBIIGZyb20gJy4vaHlwZXJib2xpYyc7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gJy4vcG9pbnQnO1xuaW1wb3J0IHtcbiAgRGlza1xufVxuZnJvbSAnLi9kaXNrJztcblxuaW1wb3J0IHtcbiAgQ2lyY2xlXG59XG5mcm9tICcuL2NpcmNsZSc7XG5cblxuLy8gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gKiAgICBURVNTRUxBVElPTiBDTEFTU1xuLy8gKiAgICBDcmVhdGVzIGEgcmVndWxhciBUZXNzZWxhdGlvbiBvZiB0aGUgUG9pbmNhcmUgRGlza1xuLy8gKiAgICBxOiBudW1iZXIgb2YgcC1nb25zIG1lZXRpbmcgYXQgZWFjaCB2ZXJ0ZXhcbi8vICogICAgcDogbnVtYmVyIG9mIHNpZGVzIG9mIHAtZ29uXG4vLyAqICAgIHVzaW5nIHRoZSB0ZWNobmlxdWVzIGNyZWF0ZWQgYnkgQ294ZXRlciBhbmQgRHVuaGFtXG4vLyAqXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5leHBvcnQgY2xhc3MgUmVndWxhclRlc3NlbGF0aW9uIHtcbiAgY29uc3RydWN0b3IocCwgcSwgcm90YXRpb24sIGNvbG91ciwgbWF4TGF5ZXJzKSB7XG4gICAgY29uc29sZS5sb2cocCxxKTtcbiAgICB0aGlzLmRpc2sgPSBuZXcgRGlzaygpO1xuXG4gICAgdGhpcy5wID0gcDtcbiAgICB0aGlzLnEgPSBxO1xuICAgIHRoaXMuY29sb3VyID0gY29sb3VyIHx8ICdibGFjayc7XG4gICAgdGhpcy5yb3RhdGlvbiA9IHJvdGF0aW9uIHx8IDA7XG4gICAgdGhpcy5tYXhMYXllcnMgPSBtYXhMYXllcnMgfHwgNTtcblxuICAgIGlmICh0aGlzLmNoZWNrUGFyYW1zKCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChldmVudCkgPT4ge1xuICAgICAgLy93aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbG9hZCcpO1xuICAgICAgdGhpcy5pbml0KCk7XG4gICAgfSwgZmFsc2UpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH0sIGZhbHNlKTtcblxuXG5cbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy5mciA9IHRoaXMuZnVuZGFtZW50YWxSZWdpb24oKTtcbiAgICB0aGlzLnRlc3RpbmcoKTtcbiAgfVxuXG4gIHRlc3RpbmcoKSB7XG4gICAgbGV0IHdpcmVmcmFtZSA9IGZhbHNlO1xuICAgIHdpcmVmcmFtZSA9IHRydWU7XG5cbiAgICAvL3RoaXMuZGlzay5wb2x5Z29uKHRoaXMuZnIsIEUucmFuZG9tSW50KDEwMDAwLCAxNDc3NzIxNSksICcnLCB3aXJlZnJhbWUpO1xuICAgIGNvbnN0IHBvbHkyID0gSC5yZWZsZWN0KHRoaXMuZnIsIHRoaXMuZnJbMV0sIHRoaXMuZnJbMl0sIHRoaXMuZGlzay5jaXJjbGUpO1xuICAgIC8vdGhpcy5kaXNrLnBvbHlnb24ocG9seTIsIEUucmFuZG9tSW50KDEwMDAwLCAxNDc3NzIxNSkpO1xuXG4gICAgY29uc3QgcG9seTMgPSBILnJlZmxlY3QocG9seTIsIHBvbHkyWzBdLCBwb2x5MlsxXSwgdGhpcy5kaXNrLmNpcmNsZSk7XG4gICAgLy90aGlzLmRpc2sucG9seWdvbihwb2x5MywgRS5yYW5kb21JbnQoMTAwMDAsIDE0Nzc3MjE1KSwgJycsIHdpcmVmcmFtZSk7XG5cbiAgICBjb25zdCBwb2x5NCA9IEgucmVmbGVjdChwb2x5MywgcG9seTNbMl0sIHBvbHkzWzBdLCB0aGlzLmRpc2suY2lyY2xlKTtcbiAgICAvL3RoaXMuZGlzay5wb2x5Z29uKHBvbHk0LCBFLnJhbmRvbUludCgxMDAwMCwgMTQ3NzcyMTUpLCAnJywgd2lyZWZyYW1lKTtcblxuICAgIGNvbnN0IHBvbHk1ID0gSC5yZWZsZWN0KHBvbHk0LCBwb2x5NFsxXSwgcG9seTRbMF0sIHRoaXMuZGlzay5jaXJjbGUpO1xuICAgIC8vdGhpcy5kaXNrLnBvbHlnb24ocG9seTUsIEUucmFuZG9tSW50KDEwMDAwLCAxNDc3NzIxNSksICcnLCB3aXJlZnJhbWUpO1xuXG4gICAgY29uc3QgcG9seTYgPSBILnJlZmxlY3QocG9seTMsIHBvbHkzWzJdLCBwb2x5M1sxXSwgdGhpcy5kaXNrLmNpcmNsZSk7XG4gICAgLy90aGlzLmRpc2sucG9seWdvbihwb2x5NiwgRS5yYW5kb21JbnQoMTAwMDAsIDE0Nzc3MjE1KSwgJycsIHdpcmVmcmFtZSk7XG5cbiAgICBjb25zdCBwb2x5NyA9IEgucmVmbGVjdChwb2x5NiwgcG9seTZbMF0sIHBvbHk2WzJdLCB0aGlzLmRpc2suY2lyY2xlKTtcbiAgICAvL3RoaXMuZGlzay5wb2x5Z29uKHBvbHk3LCBFLnJhbmRvbUludCgxMDAwMCwgMTQ3NzcyMTUpLCAnJywgd2lyZWZyYW1lKTtcblxuICAgIGNvbnN0IHBvbHk4ID0gSC5yZWZsZWN0KHBvbHk2LCBwb2x5NlswXSwgcG9seTZbMV0sIHRoaXMuZGlzay5jaXJjbGUpO1xuICAgIC8vdGhpcy5kaXNrLnBvbHlnb24ocG9seTgsIEUucmFuZG9tSW50KDEwMDAwLCAxNDc3NzIxNSksICcnLCB3aXJlZnJhbWUpO1xuXG4gICAgY29uc3QgcG9seTkgPSBILnJlZmxlY3QocG9seTcsIHBvbHk3WzBdLCBwb2x5N1sxXSwgdGhpcy5kaXNrLmNpcmNsZSk7XG4gICAgLy90aGlzLmRpc2sucG9seWdvbihwb2x5OSwgRS5yYW5kb21JbnQoMTAwMDAsIDE0Nzc3MjE1KSwgJycsIHdpcmVmcmFtZSk7XG5cbiAgICBsZXQgbnVtID0gdGhpcy5wKjI7XG4gICAgZm9yKGxldCBpID0wOyBpIDwgbnVtOyBpKyspe1xuICAgICAgbGV0IHBvbHkgPSBILnJvdGF0ZVBnb25BYm91dE9yaWdpbih0aGlzLmZyLCAoMipNYXRoLlBJL251bSkqKGkrMSkpO1xuICAgICAgdGhpcy5kaXNrLnBvbHlnb24ocG9seSwgRS5yYW5kb21JbnQoMTAwMDAsIDE0Nzc3MjE1KSwgJycsIHdpcmVmcmFtZSk7XG4gICAgICBwb2x5ID0gSC5yb3RhdGVQZ29uQWJvdXRPcmlnaW4ocG9seTIsICgyKk1hdGguUEkvbnVtKSooaSsxKSk7XG4gICAgICB0aGlzLmRpc2sucG9seWdvbihwb2x5LCBFLnJhbmRvbUludCgxMDAwMCwgMTQ3NzcyMTUpLCAnJywgd2lyZWZyYW1lKTtcbiAgICAgIHBvbHkgPSBILnJvdGF0ZVBnb25BYm91dE9yaWdpbihwb2x5MywgKDIqTWF0aC5QSS9udW0pKihpKzEpKTtcbiAgICAgIHRoaXMuZGlzay5wb2x5Z29uKHBvbHksIEUucmFuZG9tSW50KDEwMDAwLCAxNDc3NzIxNSksICcnLCB3aXJlZnJhbWUpO1xuICAgICAgcG9seSA9IEgucm90YXRlUGdvbkFib3V0T3JpZ2luKHBvbHk0LCAoMipNYXRoLlBJL251bSkqKGkrMSkpO1xuICAgICAgdGhpcy5kaXNrLnBvbHlnb24ocG9seSwgRS5yYW5kb21JbnQoMTAwMDAsIDE0Nzc3MjE1KSwgJycsIHdpcmVmcmFtZSk7XG4gICAgICBwb2x5ID0gSC5yb3RhdGVQZ29uQWJvdXRPcmlnaW4ocG9seTUsICgyKk1hdGguUEkvbnVtKSooaSsxKSk7XG4gICAgICB0aGlzLmRpc2sucG9seWdvbihwb2x5LCBFLnJhbmRvbUludCgxMDAwMCwgMTQ3NzcyMTUpLCAnJywgd2lyZWZyYW1lKTtcbiAgICAgIHBvbHkgPSBILnJvdGF0ZVBnb25BYm91dE9yaWdpbihwb2x5NiwgKDIqTWF0aC5QSS9udW0pKihpKzEpKTtcbiAgICAgIHRoaXMuZGlzay5wb2x5Z29uKHBvbHksIEUucmFuZG9tSW50KDEwMDAwLCAxNDc3NzIxNSksICcnLCB3aXJlZnJhbWUpO1xuICAgICAgcG9seSA9IEgucm90YXRlUGdvbkFib3V0T3JpZ2luKHBvbHk3LCAoMipNYXRoLlBJL251bSkqKGkrMSkpO1xuICAgICAgdGhpcy5kaXNrLnBvbHlnb24ocG9seSwgRS5yYW5kb21JbnQoMTAwMDAsIDE0Nzc3MjE1KSwgJycsIHdpcmVmcmFtZSk7XG4gICAgICBwb2x5ID0gSC5yb3RhdGVQZ29uQWJvdXRPcmlnaW4ocG9seTgsICgyKk1hdGguUEkvbnVtKSooaSsxKSk7XG4gICAgICB0aGlzLmRpc2sucG9seWdvbihwb2x5LCBFLnJhbmRvbUludCgxMDAwMCwgMTQ3NzcyMTUpLCAnJywgd2lyZWZyYW1lKTtcbiAgICAgIHBvbHkgPSBILnJvdGF0ZVBnb25BYm91dE9yaWdpbihwb2x5OSwgKDIqTWF0aC5QSS9udW0pKihpKzEpKTtcbiAgICAgIHRoaXMuZGlzay5wb2x5Z29uKHBvbHksIEUucmFuZG9tSW50KDEwMDAwLCAxNDc3NzIxNSksICcnLCB3aXJlZnJhbWUpO1xuICAgIH1cblxuXG4gIH1cblxuICAvL2NhbGN1bGF0ZSBmaXJzdCBwb2ludCBvZiBmdW5kYW1lbnRhbCBwb2x5Z29uIHVzaW5nIENveGV0ZXIncyBtZXRob2RcbiAgZnVuZGFtZW50YWxSZWdpb24oKSB7XG4gICAgY29uc3QgcmFkaXVzID0gdGhpcy5kaXNrLmNpcmNsZS5yYWRpdXM7XG4gICAgY29uc3QgcyA9IE1hdGguc2luKE1hdGguUEkgLyB0aGlzLnApO1xuICAgIGNvbnN0IHQgPSBNYXRoLmNvcyhNYXRoLlBJIC8gdGhpcy5xKTtcbiAgICAvL211bHRpcGx5IHRoZXNlIGJ5IHRoZSBkaXNrcyByYWRpdXMgKENveGV0ZXIgdXNlZCB1bml0IGRpc2spO1xuICAgIGNvbnN0IHIgPSAxIC8gTWF0aC5zcXJ0KCh0ICogdCkgLyAocyAqIHMpIC0gMSkgKiByYWRpdXM7XG4gICAgY29uc3QgZCA9IDEgLyBNYXRoLnNxcnQoMSAtIChzICogcykgLyAodCAqIHQpKSAqIHJhZGl1cztcbiAgICBjb25zdCBiID0gbmV3IFBvaW50KHJhZGl1cyAqIE1hdGguY29zKE1hdGguUEkgLyB0aGlzLnApLFxuICAgIC1yYWRpdXMgKiBNYXRoLnNpbihNYXRoLlBJIC8gdGhpcy5wKSk7XG5cbiAgICBjb25zdCBjaXJjbGUgPSBuZXcgQ2lyY2xlKGQsIDAsIHIpO1xuXG4gICAgLy90aGVyZSB3aWxsIGJlIHR3byBwb2ludHMgb2YgaW50ZXJzZWN0aW9uLCBvZiB3aGljaCB3ZSB3YW50IHRoZSBmaXJzdFxuICAgIGNvbnN0IHAxID0gRS5jaXJjbGVMaW5lSW50ZXJzZWN0KGNpcmNsZSwgdGhpcy5kaXNrLmNlbnRyZSwgYikucDE7XG5cbiAgICBjb25zdCBwMiA9IG5ldyBQb2ludChkLXIsMCk7XG5cbiAgICBjb25zdCBwb2ludHMgPSBbdGhpcy5kaXNrLmNlbnRyZSwgcDEsIHAyXTtcblxuICAgIHJldHVybiBwb2ludHM7XG4gIH1cblxuICAvL1RoZSB0ZXNzZWxhdGlvbiByZXF1aXJlcyB0aGF0IChwLTIpKHEtMikgPiA0IHRvIHdvcmsgKG90aGVyd2lzZSBpdCBpc1xuICAvLyBlaXRoZXIgYW4gZWxsaXB0aWNhbCBvciBldWNsaWRlYW4gdGVzc2VsYXRpb24pO1xuICAvL0ZvciBub3cgYWxzbyByZXF1aXJlIHAscSA+IDMsIGFzIHRoZXNlIGFyZSBzcGVjaWFsIGNhc2VzXG4gIGNoZWNrUGFyYW1zKCkge1xuICAgIGlmICh0aGlzLm1heExheWVycyA8IDAgfHwgaXNOYU4odGhpcy5tYXhMYXllcnMpKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdtYXhMYXllcnMgbXVzdCBiZSBncmVhdGVyIHRoYW4gMCcpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIGlmICgodGhpcy5wIC0gMikgKiAodGhpcy5xIC0gMikgPD0gNCkge1xuICAgICAgY29uc29sZS5lcnJvcignSHlwZXJib2xpYyB0ZXNzZWxhdGlvbnMgcmVxdWlyZSB0aGF0IChwLTEpKHEtMikgPCA0IScpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8vVE9ETyBpbXBsZW1lbnQgc3BlY2lhbCBjYXNlcyBmb3IgcSA9IDMgb3IgcCA9IDNcbiAgICBlbHNlIGlmICh0aGlzLnEgPD0gMyB8fCBpc05hTih0aGlzLnEpKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdUZXNzZWxhdGlvbiBlcnJvcjogYXQgbGVhc3QgMyBwLWdvbnMgbXVzdCBtZWV0IFxcXG4gICAgICAgICAgICAgICAgICAgIGF0IGVhY2ggdmVydGV4IScpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIGlmICh0aGlzLnAgPD0gMyB8fCBpc05hTih0aGlzLnApKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdUZXNzZWxhdGlvbiBlcnJvcjogcG9seWdvbiBuZWVkcyBhdCBsZWFzdCAzIHNpZGVzIScpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbn1cbiIsIi8vTk9URSB3aWxsIGdpdmUgYSB3YXJuaW5nOiAgVG9vIG1hbnkgYWN0aXZlIFdlYkdMIGNvbnRleHRzXG4vL2FmdGVyIHJlc2l6aW5nIDE2IHRpbWVzLiBUaGlzIGlzIGEgYnVnIGluIHRocmVlanMgYW5kIGNhbiBiZSBzYWZlbHkgaWdub3JlZC5cbi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICpcbi8vICogIFRIUkVFIEpTIENMQVNTXG4vLyAqXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5leHBvcnQgY2xhc3MgVGhyZWVKUyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZXZlbnQpID0+IHtcbiAgICAgIC8vd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnKTtcbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH0sIGZhbHNlKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XG4gICAgICB0aGlzLnJlc2V0KCk7XG4gICAgfSwgZmFsc2UpO1xuXG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcbiAgICB0aGlzLmluaXRDYW1lcmEoKTtcblxuICAgIHRoaXMuaW5pdExpZ2h0aW5nKCk7XG5cbiAgICB0aGlzLmF4ZXMoKTtcblxuICAgIHRoaXMuaW5pdFJlbmRlcmVyKCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLmlkKTsgLy8gU3RvcCB0aGUgYW5pbWF0aW9uXG4gICAgdGhpcy5zY2VuZSA9IG51bGw7XG4gICAgdGhpcy5wcm9qZWN0b3IgPSBudWxsO1xuICAgIHRoaXMuY2FtZXJhID0gbnVsbDtcbiAgICB0aGlzLmNvbnRyb2xzID0gbnVsbDtcblxuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnY2FudmFzJyk7XG4gICAgZm9yIChsZXQgaW5kZXggPSBlbGVtZW50Lmxlbmd0aCAtIDE7IGluZGV4ID49IDA7IGluZGV4LS0pIHtcbiAgICAgIGVsZW1lbnRbaW5kZXhdLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbWVudFtpbmRleF0pO1xuICAgIH1cbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIGluaXRDYW1lcmEoKSB7XG4gICAgdGhpcy5jYW1lcmEgPSBuZXcgVEhSRUUuT3J0aG9ncmFwaGljQ2FtZXJhKHdpbmRvdy5pbm5lcldpZHRoIC8gLTIsXG4gICAgICB3aW5kb3cuaW5uZXJXaWR0aCAvIDIsIHdpbmRvdy5pbm5lckhlaWdodCAvIDIsIHdpbmRvdy5pbm5lckhlaWdodCAvIC0yLCAtMiwgMSk7XG4gICAgdGhpcy5zY2VuZS5hZGQodGhpcy5jYW1lcmEpO1xuICAgIHRoaXMuY2FtZXJhLnBvc2l0aW9uLnggPSAwO1xuICAgIHRoaXMuY2FtZXJhLnBvc2l0aW9uLnkgPSAwO1xuXG4gICAgdGhpcy5jYW1lcmEucG9zaXRpb24ueiA9IDE7XG4gIH1cblxuICBpbml0TGlnaHRpbmcoKSB7XG4gICAgY29uc3QgYW1iaWVudExpZ2h0ID0gbmV3IFRIUkVFLkFtYmllbnRMaWdodCgweGZmZmZmZik7XG4gICAgdGhpcy5zY2VuZS5hZGQoYW1iaWVudExpZ2h0KTtcbiAgfVxuXG4gIGluaXRSZW5kZXJlcigpIHtcbiAgICB0aGlzLnJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoe1xuICAgICAgYW50aWFsaWFzOiB0cnVlLFxuICAgIH0pO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0Q2xlYXJDb2xvcigweGZmZmZmZiwgMS4wKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIGRpc2soY2VudHJlLCByYWRpdXMsIGNvbG9yKSB7XG4gICAgaWYgKGNvbG9yID09PSB1bmRlZmluZWQpIGNvbG9yID0gMHhmZmZmZmY7XG5cbiAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5DaXJjbGVHZW9tZXRyeShyYWRpdXMsIDEwMCwgMCwgMiAqIE1hdGguUEkpO1xuICAgIGNvbnN0IGNpcmNsZSA9IHRoaXMuY3JlYXRlTWVzaChnZW9tZXRyeSwgY29sb3IpO1xuICAgIGNpcmNsZS5wb3NpdGlvbi54ID0gY2VudHJlLng7XG4gICAgY2lyY2xlLnBvc2l0aW9uLnkgPSBjZW50cmUueTtcblxuICAgIHRoaXMuc2NlbmUuYWRkKGNpcmNsZSk7XG4gIH1cblxuICBzZWdtZW50KGNpcmNsZSwgYWxwaGEsIG9mZnNldCwgY29sb3IpIHtcbiAgICBpZiAoY29sb3IgPT09IHVuZGVmaW5lZCkgY29sb3IgPSAweGZmZmZmZjtcblxuICAgIGNvbnN0IGN1cnZlID0gbmV3IFRIUkVFLkVsbGlwc2VDdXJ2ZShcbiAgICAgIGNpcmNsZS5jZW50cmUueCwgY2lyY2xlLmNlbnRyZS55LCAvLyBheCwgYVlcbiAgICAgIGNpcmNsZS5yYWRpdXMsIGNpcmNsZS5yYWRpdXMsIC8vIHhSYWRpdXMsIHlSYWRpdXNcbiAgICAgIGFscGhhLCBvZmZzZXQsIC8vIGFTdGFydEFuZ2xlLCBhRW5kQW5nbGVcbiAgICAgIGZhbHNlIC8vIGFDbG9ja3dpc2VcbiAgICApO1xuXG4gICAgY29uc3QgcG9pbnRzID0gY3VydmUuZ2V0U3BhY2VkUG9pbnRzKDEwMCk7XG5cbiAgICBjb25zdCBwYXRoID0gbmV3IFRIUkVFLlBhdGgoKTtcbiAgICBjb25zdCBnZW9tZXRyeSA9IHBhdGguY3JlYXRlR2VvbWV0cnkocG9pbnRzKTtcblxuICAgIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKHtcbiAgICAgIGNvbG9yOiBjb2xvclxuICAgIH0pO1xuICAgIGNvbnN0IHMgPSBuZXcgVEhSRUUuTGluZShnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXG4gICAgdGhpcy5zY2VuZS5hZGQocyk7XG4gIH1cblxuICBsaW5lKHN0YXJ0LCBlbmQsIGNvbG9yKSB7XG4gICAgaWYgKGNvbG9yID09PSB1bmRlZmluZWQpIGNvbG9yID0gMHhmZmZmZmY7XG5cbiAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5HZW9tZXRyeSgpO1xuXG4gICAgZ2VvbWV0cnkudmVydGljZXMucHVzaChcbiAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKHN0YXJ0LngsIHN0YXJ0LnksIDApLFxuICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoZW5kLngsIGVuZC55LCAwKVxuICAgICk7XG4gICAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoe1xuICAgICAgY29sb3I6IGNvbG9yXG4gICAgfSk7XG4gICAgY29uc3QgbCA9IG5ldyBUSFJFRS5MaW5lKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgdGhpcy5zY2VuZS5hZGQobCk7XG4gIH1cblxuICBwb2x5Z29uKHZlcnRpY2VzLCBjb2xvciwgdGV4dHVyZSwgd2lyZWZyYW1lKSB7XG4gICAgaWYgKGNvbG9yID09PSB1bmRlZmluZWQpIGNvbG9yID0gMHhmZmZmZmY7XG5cbiAgICBjb25zdCBwb2x5ID0gbmV3IFRIUkVFLlNoYXBlKCk7XG4gICAgcG9seS5tb3ZlVG8odmVydGljZXNbMF0ueCwgdmVydGljZXNbMF0ueSk7XG5cbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IHZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBwb2x5LmxpbmVUbyh2ZXJ0aWNlc1tpXS54LCB2ZXJ0aWNlc1tpXS55KVxuICAgIH1cblxuICAgIHBvbHkubGluZVRvKHZlcnRpY2VzWzBdLngsIHZlcnRpY2VzWzBdLnkpO1xuXG4gICAgY29uc3QgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuU2hhcGVHZW9tZXRyeShwb2x5KTtcblxuICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMuY3JlYXRlTWVzaChnZW9tZXRyeSwgY29sb3IsIHRleHR1cmUsIHdpcmVmcmFtZSkpO1xuICB9XG5cbiAgY3JlYXRlTWVzaChnZW9tZXRyeSwgY29sb3IsIGltYWdlVVJMLCB3aXJlZnJhbWUpIHtcbiAgICBpZih3aXJlZnJhbWUgPT09IHVuZGVmaW5lZCkgd2lyZWZyYW1lID0gZmFsc2U7XG4gICAgaWYgKGNvbG9yID09PSB1bmRlZmluZWQpIGNvbG9yID0gMHhmZmZmZmY7XG5cbiAgICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XG4gICAgICBjb2xvcjogY29sb3IsXG4gICAgICB3aXJlZnJhbWU6IHdpcmVmcmFtZVxuICAgIH0pO1xuXG4gICAgaWYgKGltYWdlVVJMKSB7XG4gICAgICBjb25zdCB0ZXh0dXJlTG9hZGVyID0gbmV3IFRIUkVFLlRleHR1cmVMb2FkZXIoKTtcblxuICAgICAgLy9sb2FkIHRleHR1cmUgYW5kIGFwcGx5IHRvIG1hdGVyaWFsIGluIGNhbGxiYWNrXG4gICAgICBjb25zdCB0ZXh0dXJlID0gdGV4dHVyZUxvYWRlci5sb2FkKGltYWdlVVJMLCAodGV4KSA9PiB7fSk7XG4gICAgICB0ZXh0dXJlLnJlcGVhdC5zZXQoMC4wNSwgMC4wNSk7XG4gICAgICBtYXRlcmlhbC5tYXAgPSB0ZXh0dXJlO1xuICAgICAgbWF0ZXJpYWwubWFwLndyYXBUID0gVEhSRUUuUmVwZWF0V3JhcHBpbmc7XG4gICAgICBtYXRlcmlhbC5tYXAud3JhcFMgPSBUSFJFRS5SZXBlYXRXcmFwcGluZztcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgfVxuXG4gIGF4ZXMoKSB7XG4gICAgY29uc3QgeHl6ID0gbmV3IFRIUkVFLkF4aXNIZWxwZXIoMjApO1xuICAgIHRoaXMuc2NlbmUuYWRkKHh5eik7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHRoaXMucmVuZGVyKClcbiAgICB9KTtcblxuICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUsIHRoaXMuY2FtZXJhKTtcbiAgfVxuXG59XG4iXX0=
