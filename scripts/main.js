(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
  }, {
    key: 'getRadius',
    value: function getRadius() {
      return this.radius;
    }

    //draw the disk background

  }, {
    key: 'drawDisk',
    value: function drawDisk() {
      this.draw.disk(this.centre, this.radius, 0x000000, true);
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
      var c = E.greatCircle(p1, p2, this.radius, this.centre);
      var points = E.circleIntersect(this.centre, c.centre, this.radius, c.radius);

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

},{"./euclid":2,"./hyperbolic":3,"./point":5,"./threejs":7}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomInt = exports.randomFloat = exports.spacedPointOnArc = exports.pointToFixed = exports.comparePoints = exports.centroidOfPolygon = exports.throughOrigin = exports.normalVector = exports.centralAngle = exports.circleLineIntersect = exports.circleIntersect = exports.greatCircleV2 = exports.greatCircle = exports.lineReflection = exports.inverse = exports.radians = exports.intersection = exports.perpendicularSlope = exports.slope = exports.midpoint = exports.distance = undefined;

var _point = require('./point');

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
//NOT WORKING FOR VERTICAL LINES!!!
var intersection = exports.intersection = function intersection(p1, m1, p2, m2) {
  var c1 = undefined,
      c2 = undefined,
      x = undefined,
      y = undefined;
  //case where first line is vertical
  //if(m1 > 5000 || m1 < -5000 || m1 === Infinity){
  if (p1.y < 0.000001 && p1.y > -0.000001) {
    x = p1.x;
    y = m2 * (p1.x - p2.x) + p2.y;
  }
  //case where second line is vertical
  //else if(m2 > 5000 || m2 < -5000 || m1 === Infinity){
  else if (p2.y < 0.000001 && p2.y > -0.000001) {
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
var inverse = exports.inverse = function inverse(p, r, c) {
  var alpha = r * r / (Math.pow(p.x - c.x, 2) + Math.pow(p.y - c.y, 2));
  return new _point.Point(alpha * (p.x - c.x) + c.x, alpha * (p.y - c.y) + c.y);
};

//reflect p3 across the line defined by p1,p2
var lineReflection = exports.lineReflection = function lineReflection(p1, p2, p3) {
  var m = slope(p1, p2);
  //reflection in y axis
  if (m > 999999 || m < -999999) {
    return new _point.Point(p3.x, -p3.y);
  }
  //reflection in x axis
  else if (m.toFixed(6) == 0) {
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
var greatCircle = exports.greatCircle = function greatCircle(p1, p2, r, c) {
  var p1Inverse = inverse(p1, r, c);
  var p2Inverse = inverse(p2, r, c);

  var m = midpoint(p1, p1Inverse);
  var n = midpoint(p2, p2Inverse);

  var m1 = perpendicularSlope(m, p1Inverse);
  var m2 = perpendicularSlope(n, p2Inverse);

  //centre is the centrepoint of the circle out of which the arc is made
  var centre = intersection(m, m1, n, m2);
  var radius = distance(centre, p1);
  return {
    centre: centre,
    radius: radius
  };
};

//an attempt at calculating the circle algebraically
var greatCircleV2 = exports.greatCircleV2 = function greatCircleV2(p1, p2, r) {
  var x = (p2.y * (p1.x * p1.x + r) + p1.y * p1.y * p2.y - p1.y * (p2.x * p2.x + p2.y * p2.y + r)) / (2 * p1.x * p2.y - p1.y * p2.x);
  var y = (p1.x * p1.x * p2.x - p1.x * (p2.x * p2.x + p2.y * p2.y + r) + p2.x * (p1.y * p1.y + r)) / (2 * p1.y * p2.x + 2 * p1.x * p2.y);
  var radius = Math.sqrt(x * x + y * y - r);
  return {
    centre: {
      x: x,
      y: y
    },
    radius: radius
  };
};

//intersection of two circles with equations:
//(x-a)^2 +(y-a)^2 = r0^2
//(x-b)^2 +(y-c)^2 = r1^2
//NOTE assumes the two circles DO intersect!
var circleIntersect = exports.circleIntersect = function circleIntersect(c0, c1, r0, r1) {
  var a = c0.x;
  var b = c0.y;
  var c = c1.x;
  var d = c1.y;
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

var circleLineIntersect = exports.circleLineIntersect = function circleLineIntersect(c, r, p1, p2) {

  var d = distance(p1, p2);
  //unit vector p1 p2
  var dx = (p2.x - p1.x) / d;
  var dy = (p2.y - p1.y) / d;

  //point on line closest to circle centre
  var t = dx * (c.x - p1.x) + dy * (c.y - p1.y);
  var p = new _point.Point(t * dx + p1.x, t * dy + p1.y);

  //distance from this point to centre
  var d2 = distance(p, c);

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
  var temp = (0.5 * distance(p1, p2) / r).toFixed(12);
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

  if (test.toFixed(6) == 0) return true;else return false;
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

//compare two points taking rounding errors into account
var comparePoints = exports.comparePoints = function comparePoints(p1, p2) {
  if (typeof p1 === 'undefined' || typeof p2 === 'undefined') {
    console.warn('Warning: point no defined.');
    return false;
  }
  p1 = pointToFixed(p1, 10);
  p2 = pointToFixed(p2, 10);
  if (p1.x === p2.x && p1.y === p2.y) return true;else return false;
};

var pointToFixed = exports.pointToFixed = function pointToFixed(p, places) {
  return {
    x: p.x.toFixed(places),
    y: p.y.toFixed(places)
  };
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

},{"./point":5}],3:[function(require,module,exports){
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
  var c = E.greatCircle(p1, p2, circle.radius, circle.centre);

  var oy = c.centre.y;
  var ox = c.centre.x;

  //point at 0 radians on c
  var p3 = new _point.Point(ox + c.radius, oy);

  //point at PI radians on c
  var p4 = new _point.Point(ox - c.radius, oy);

  //calculate the position of each point in the circle
  alpha1 = E.centralAngle(p3, p1, c.radius);
  alpha1 = p1.y < oy ? 2 * Math.PI - alpha1 : alpha1;
  alpha2 = E.centralAngle(p3, p2, c.radius);
  alpha2 = p2.y < oy ? 2 * Math.PI - alpha2 : alpha2;

  //console.log(c.centre, c.radius, alpha1, alpha2);

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
      newPoints.push(E.inverse(pointsArray[i], a.circle.radius, a.circle.centre));
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

},{"./euclid":2,"./point":5}],4:[function(require,module,exports){
'use strict';

var _regularTesselation = require('./regularTesselation');

// * ***********************************************************************
// *
// *   SETUP
// *
// *************************************************************************

//const tesselation = new RegularTesselation(E.randomInt(4,12), E.randomInt(4,12));
var tesselation = new _regularTesselation.RegularTesselation(6, 12); //TODO create circle class and refactor
//TODO window.removeEventListener('load'); not working in firefox

},{"./regularTesselation":6}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// * ***********************************************************************
// *
// *   POINT CLASS
// *   2d point class
// *************************************************************************

var Point = exports.Point = function Point(x, y) {
  _classCallCheck(this, Point);

  if (x.toFixed(10) == 0) {
    x = 0;
  }
  if (y.toFixed(10) == 0) {
    y = 0;
  }
  this.x = x;
  this.y = y;
};

},{}],6:[function(require,module,exports){
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

    this.centre = new _point.Point(0, 0);

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
      this.radius = this.disk.getRadius();
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
      this.disk.polygon(poly9, E.randomInt(10000, 14777215), '', wireframe);

      var c = {
        centre: this.centre,
        radius: this.radius
      };

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
      var s = Math.sin(Math.PI / this.p);
      var t = Math.cos(Math.PI / this.q);
      //multiply these by the disks radius (Coxeter used unit disk);
      var r = 1 / Math.sqrt(t * t / (s * s) - 1) * this.radius;
      var d = 1 / Math.sqrt(1 - s * s / (t * t)) * this.radius;
      var b = new _point.Point(this.radius * Math.cos(Math.PI / this.p), -this.radius * Math.sin(Math.PI / this.p));

      var centre = new _point.Point(d, 0);

      //there will be two points of intersection, of which we want the first
      var p1 = E.circleLineIntersect(centre, r, this.disk.centre, b).p1;

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

},{"./disk":1,"./euclid":2,"./hyperbolic":3,"./point":5}],7:[function(require,module,exports){
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
      //const spotLight = new THREE.SpotLight(0xffffff);
      //spotLight.position.set(0, 0, 100);
      //this.scene.add(spotLight);
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

    //behind: true/false

  }, {
    key: 'disk',
    value: function disk(centre, radius, color, behind) {
      if (color === undefined) color = 0xffffff;

      var geometry = new THREE.CircleGeometry(radius, 100, 0, 2 * Math.PI);
      var circle = this.createMesh(geometry, color);
      circle.position.x = centre.x;
      circle.position.y = centre.y;
      if (!behind) {
        circle.position.z = 1;
      }

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

},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJlczIwMTUvZGlzay5qcyIsImVzMjAxNS9ldWNsaWQuanMiLCJlczIwMTUvaHlwZXJib2xpYy5qcyIsImVzMjAxNS9tYWluLmpzIiwiZXMyMDE1L3BvaW50LmpzIiwiZXMyMDE1L3JlZ3VsYXJUZXNzZWxhdGlvbi5qcyIsImVzMjAxNS90aHJlZWpzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7SUNBWSxDQUFDOzs7O0lBQ0QsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBV0EsSUFBSSxXQUFKLElBQUk7QUFDZixXQURXLElBQUksR0FDRDs7OzBCQURILElBQUk7O0FBRWIsUUFBSSxDQUFDLElBQUksR0FBRyxhQVhQLE9BQU8sRUFXYSxDQUFDOztBQUUxQixVQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLFVBQUMsS0FBSyxFQUFLOztBQUV6QyxZQUFLLElBQUksRUFBRSxDQUFDO0tBQ2IsRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFVixVQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFlBQU07QUFDdEMsWUFBSyxJQUFJLEVBQUUsQ0FBQztLQUNiLEVBQUUsS0FBSyxDQUFDLENBQUM7R0FFWDs7ZUFiVSxJQUFJOzsyQkFlUjtBQUNMLFVBQUksQ0FBQyxNQUFNLEdBQUcsV0ExQlQsS0FBSyxDQTBCYyxDQUFDLEVBQUMsQ0FBQyxDQUFDOzs7QUFBQyxBQUc3QixVQUFJLENBQUMsTUFBTSxHQUFHLEFBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsV0FBVyxHQUFJLEFBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLEdBQUksQ0FBQyxHQUFHLEFBQUMsTUFBTSxDQUFDLFdBQVcsR0FBRyxDQUFDLEdBQUksQ0FBQyxDQUFDOztBQUVwSCxVQUFJLENBQUMsTUFBTSxHQUFHO0FBQ1osY0FBTSxFQUFFLElBQUksQ0FBQyxNQUFNO0FB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LElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFBLEFBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFBLEFBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFcEcsTUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksQ0FBQyxHQUFHLEFBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLElBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFBLEFBQUMsSUFBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7QUFDakYsTUFBSSxFQUFFLEdBQUcsUUFBUSxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7QUFDdEQsTUFBSSxFQUFFLEdBQUcsUUFBUSxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7O0FBRXRELE1BQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxHQUFJLENBQUMsR0FBRyxBQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxJQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQSxBQUFDLElBQUssQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUEsQUFBQyxDQUFDO0FBQ2pGLE1BQUksRUFBRSxHQUFHLFFBQVEsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUEsQUFBQyxDQUFDO0FBQ3RELE1BQUksRUFBRSxHQUFHLFFBQVEsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxJQUFJLElBQUksR0FBRyxJ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QVMsR0FBRyxLQUFLLENBQUM7QUFDdEIsTUFBSSxNQUFNLFlBQUE7TUFBRSxNQUFNLFlBQUE7TUFBRSxVQUFVLFlBQUE7TUFBRSxRQUFRLFlBQUEsQ0FBQztBQUN6QyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRTlELE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ3RCLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7O0FBQUMsQUFHdEIsTUFBTSxFQUFFLEdBQUcsV0E3QkosS0FBSyxDQTZCVSxFQUFFLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUM7OztBQUFDLEFBR3pDLE1BQU0sRUFBRSxHQUFHLFdBaENKLEtBQUssQ0FnQ1UsRUFBRSxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDOzs7QUFBQyxBQUd6QyxRQUFNLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMxQyxRQUFNLEdBQUcsQUFBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JELFFBQU0sR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzFDLFFBQU0sR0FBRyxBQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLE1BQU0sR0FBRyxNQUFNOzs7OztBQUFDLEFBS3JELE1BQUksQUFBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxJ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QUFFLENBQUM7QUFDcEMsVUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztBQUNuQyxVQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDaEI7Ozs4QkFFUztBQUNSLFVBQUksU0FBUyxHQUFHLEtBQUssQ0FBQztBQUN0QixlQUFTLEdBQUcsSUFBSTs7O0FBQUMsQUFJakIsVUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7O0FBQUMsQUFHM0UsVUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7O0FBQUMsQUFHckUsVUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7O0FBQUMsQUFHckUsVUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7O0FBQUMsQUFHckUsVUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7O0FBQUMsQUFHckUsVUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7O0FBQUMsQUFHckUsVUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQzs7O0FBQUMsQUFHckUsVUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3JFLFVBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7O0FBR3RFLFVBQU0sQ0FBQyxHQUFHO0FBQ1IsY0FBTSxFQUFFLElBQUksQ0FBQyxNQUFNO0FBQ25CLGNBQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtPQUNwQixDQUFDOztBQUVGLFVBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDO0FBQ25CLFdBQUksSUFBSSxDQUFDLEdBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUM7QUFDekIsWUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQUFBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLEVBQUUsR0FBQyxHQUFHLElBQUcsQ0FBQyxHQUFDLENBQUMsQ0FBQSxBQUFDLENBQUMsQ0FBQztBQUNuRSxZQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3JFLFlBQUksR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsS0FBSyxFQUFFLEFBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxFQUFFLEdBQUMsR0FBRyxJQUFHLENBQUMsR0FBQyxDQUFDLENBQUEsQUFBQyxDQUFDLENBQUM7QUFDN0QsWUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNyRSxZQUFJLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLEtBQUssRUFBRSxBQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsRUFBRSxHQUFDLEdBQUcsSUFBRyxDQUFDLEdBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBQyxDQUFDO0FBQzdELFlBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDckUsWUFBSSxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsQUFBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLEVBQUUsR0FBQyxHQUFHLElBQUcsQ0FBQyxHQUFDLENBQUMsQ0FBQSxBQUFDLENBQUMsQ0FBQztBQUM3RCxZQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3JFLFlBQUksR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsS0FBSyxFQUFFLEFBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxFQUFFLEdBQUMsR0FBRyxJQUFHLENBQUMsR0FBQyxDQUFDLENBQUEsQUFBQyxDQUFDLENBQUM7QUFDN0QsWUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNyRSxZQUFJLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLEtBQUssRUFBRSxBQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsRUFBRSxHQUFDLEdBQUcsSUFBRyxDQUFDLEdBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBQyxDQUFDO0FBQzdELFlBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDckUsWUFBSSxHQUFHLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsQUFBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLEVBQUUsR0FBQyxHQUFHLElBQUcsQ0FBQyxHQUFDLENBQUMsQ0FBQSxBQUFDLENBQUMsQ0FBQztBQUM3RCxZQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3JFLFlBQUksR0FBRyxDQUFDLENBQUMscUJBQXFCLENBQUMsS0FBSyxFQUFFLEFBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxFQUFFLEdBQUMsR0FBRyxJQUFHLENBQUMsR0FBQyxDQUFDLENBQUEsQUFBQyxDQUFDLENBQUM7QUFDN0QsWUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNyRSxZQUFJLEdBQUcsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLEtBQUssRUFBRSxBQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsRUFBRSxHQUFDLEdBQUcsSUFBRyxDQUFDLEdBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBQyxDQUFDO0FBQzdELFlBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7T0FDdEU7S0FDRjs7Ozs7O3dDQUdtQjtBQUNsQixVQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JDLFVBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDOztBQUFDLEFBRXJDLFVBQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEFBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQzdELFVBQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxBQUFDLENBQUMsR0FBRyxDQUFDLElBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQzdELFVBQU0sQ0FBQyxHQUFHLFdBckhMLEtBQUssQ0FxSFUsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUM1RCxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFB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LENBQUMsQ0FBQzs7QUFFSCxVQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUMvQzs7O1NBN0tVLE9BQU8iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0ICogYXMgRSBmcm9tICcuL2V1Y2xpZCc7XG5pbXBvcnQgKiBhcyBIIGZyb20gJy4vaHlwZXJib2xpYyc7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gJy4vcG9pbnQnO1xuaW1wb3J0IHsgVGhyZWVKUyB9IGZyb20gJy4vdGhyZWVqcyc7XG5cbi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICpcbi8vICogICBESVNLIENMQVNTXG4vLyAqICAgUG9pbmNhcmUgRGlzayByZXByZXNlbnRhdGlvbiBvZiB0aGUgaHlwZXJib2xpYyBwbGFuZVxuLy8gKiAgIENvbnRhaW5zIGFueSBmdW5jdGlvbnMgdXNlZCB0byBkcmF3IHRvIHRoZSBkaXNrXG4vLyAqICAgKEN1cnJlbnRseSB1c2luZyB0aHJlZSBqcyBhcyBkcmF3aW5nIGNsYXNzKVxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuZXhwb3J0IGNsYXNzIERpc2sge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmRyYXcgPSBuZXcgVGhyZWVKUygpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZXZlbnQpID0+IHtcbiAgICAgIC8vd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnKTtcbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH0sIGZhbHNlKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XG4gICAgICB0aGlzLmluaXQoKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy5jZW50cmUgPSBuZXcgUG9pbnQoMCwwKTtcblxuICAgIC8vZHJhdyBsYXJnZXN0IGNpcmNsZSBwb3NzaWJsZSBnaXZlbiB3aW5kb3cgZGltc1xuICAgIHRoaXMucmFkaXVzID0gKHdpbmRvdy5pbm5lcldpZHRoIDwgd2luZG93LmlubmVySGVpZ2h0KSA/ICh3aW5kb3cuaW5uZXJXaWR0aCAvIDIpIC0gNSA6ICh3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKSAtIDU7XG5cbiAgICB0aGlzLmNpcmNsZSA9IHtcbiAgICAgIGNlbnRyZTogdGhpcy5jZW50cmUsXG4gICAgICByYWRpdXM6IHRoaXMucmFkaXVzXG4gICAgfVxuXG4gICAgLy9zbWFsbGVyIGNpcmNsZSBmb3IgdGVzdGluZ1xuICAgIC8vdGhpcy5yYWRpdXMgPSB0aGlzLnJhZGl1cyAvIDI7XG5cbiAgICB0aGlzLmRyYXdEaXNrKCk7XG5cbiAgICAvL3RoaXMudGVzdGluZygpO1xuICB9XG5cbiAgdGVzdGluZygpIHtcblxuICB9XG5cbiAgZ2V0UmFkaXVzKCkge1xuICAgIHJldHVybiB0aGlzLnJhZGl1cztcbiAgfVxuXG4gIC8vZHJhdyB0aGUgZGlzayBiYWNrZ3JvdW5kXG4gIGRyYXdEaXNrKCkge1xuICAgIHRoaXMuZHJhdy5kaXNrKHRoaXMuY2VudHJlLCB0aGlzLnJhZGl1cywgMHgwMDAwMDAsIHRydWUpO1xuICB9XG5cbiAgcG9pbnQoY2VudHJlLCByYWRpdXMsIGNvbG9yKSB7XG4gICAgdGhpcy5kcmF3LmRpc2soY2VudHJlLCByYWRpdXMsIGNvbG9yLCBmYWxzZSk7XG4gIH1cblxuICAvL2RyYXcgYSBoeXBlcmJvbGljIGxpbmUgYmV0d2VlbiB0d28gcG9pbnRzIG9uIHRoZSBib3VuZGFyeSBjaXJjbGVcbiAgLy9UT0RPOiBmaXghXG4gIGxpbmUocDEsIHAyLCBjb2xvcikge1xuICAgIGNvbnN0IGMgPSBFLmdyZWF0Q2lyY2xlKHAxLCBwMiwgdGhpcy5yYWRpdXMsIHRoaXMuY2VudHJlKTtcbiAgICBjb25zdCBwb2ludHMgPSBFLmNpcmNsZUludGVyc2VjdCh0aGlzLmNlbnRyZSwgYy5jZW50cmUsIHRoaXMucmFkaXVzLCBjLnJhZGl1cyk7XG5cbiAgICB0aGlzLmRyYXdBcmMocG9pbnRzLnAxLCBwb2ludHMucDIsIGNvbG9yKVxuICB9XG5cbiAgLy9EcmF3IGFuIGFyYyAoaHlwZXJib2xpYyBsaW5lIHNlZ21lbnQpIGJldHdlZW4gdHdvIHBvaW50cyBvbiB0aGUgZGlza1xuICBkcmF3QXJjKHAxLCBwMiwgY29sb3VyKSB7XG4gICAgLy9jaGVjayB0aGF0IHRoZSBwb2ludHMgYXJlIGluIHRoZSBkaXNrXG4gICAgaWYgKHRoaXMuY2hlY2tQb2ludHMocDEsIHAyKSkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIGNvbnN0IGNvbCA9IGNvbG91ciB8fCAweGZmZmZmZjtcbiAgICBjb25zdCBhcmMgPSBILmFyYyhwMSwgcDIsIHRoaXMuY2lyY2xlKTtcblxuICAgIGlmIChhcmMuc3RyYWlnaHRMaW5lKSB7XG4gICAgICB0aGlzLmRyYXcubGluZShwMSwgcDIsIGNvbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZHJhdy5zZWdtZW50KGFyYy5jaXJjbGUsIGFyYy5zdGFydEFuZ2xlLCBhcmMuZW5kQW5nbGUsIGNvbG91cik7XG4gICAgfVxuICB9XG5cbiAgcG9seWdvbk91dGxpbmUodmVydGljZXMsIGNvbG91cikge1xuICAgIGNvbnN0IGwgPSB2ZXJ0aWNlcy5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgIHRoaXMuZHJhd0FyYyh2ZXJ0aWNlc1tpXSwgdmVydGljZXNbKGkgKyAxKSAlIGxdLCBjb2xvdXIpO1xuICAgIH1cbiAgfVxuXG4gIC8vY3JlYXRlIGFuIGFycmF5IG9mIHBvaW50cyBzcGFjZWQgZXF1YWxseSBhcm91bmQgdGhlIGFyY3MgZGVmaW5pbmcgYSBoeXBlcmJvbGljXG4gIC8vcG9seWdvbiBhbmQgcGFzcyB0aGVzZSB0byBUaHJlZUpTLnBvbHlnb24oKVxuICAvL1RPRE8gbWFrZSBzcGFjaW5nIGEgZnVuY3Rpb24gb2YgZmluYWwgcmVzb2x1dGlvblxuICAvL1RPRE8gY2hlY2sgd2hldGhlciB2ZXJ0aWNlcyBhcmUgaW4gdGhlIHJpZ2h0IG9yZGVyXG4gIHBvbHlnb24odmVydGljZXMsIGNvbG9yLCB0ZXh0dXJlLCB3aXJlZnJhbWUpIHtcbiAgICBjb25zdCBwb2ludHMgPSBbXTtcbiAgICBjb25zdCBzcGFjaW5nID0gNTtcbiAgICBjb25zdCBsID0gdmVydGljZXMubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICBsZXQgcDtcbiAgICAgIGNvbnN0IGFyYyA9IEguYXJjKHZlcnRpY2VzW2ldLCB2ZXJ0aWNlc1soaSArIDEpICUgbF0sIHRoaXMuY2lyY2xlKTtcblxuICAgICAgLy9saW5lIG5vdCB0aHJvdWdoIHRoZSBvcmlnaW4gKGh5cGVyYm9saWMgYXJjKVxuICAgICAgaWYgKCFhcmMuc3RyYWlnaHRMaW5lKSB7XG5cbiAgICAgICAgaWYgKGFyYy5jbG9ja3dpc2UpIHtcbiAgICAgICAgICBwID0gRS5zcGFjZWRQb2ludE9uQXJjKGFyYy5jaXJjbGUsIHZlcnRpY2VzW2ldLCBzcGFjaW5nKS5wMjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwID0gRS5zcGFjZWRQb2ludE9uQXJjKGFyYy5jaXJjbGUsIHZlcnRpY2VzW2ldLCBzcGFjaW5nKS5wMTtcbiAgICAgICAgfVxuICAgICAgICBwb2ludHMucHVzaChwKTtcblxuICAgICAgICB3aGlsZSAoRS5kaXN0YW5jZShwLCB2ZXJ0aWNlc1soaSArIDEpICUgbF0pID4gc3BhY2luZykge1xuXG4gICAgICAgICAgaWYgKGFyYy5jbG9ja3dpc2UpIHtcbiAgICAgICAgICAgIHAgPSBFLnNwYWNlZFBvaW50T25BcmMoYXJjLmNpcmNsZSwgcCwgc3BhY2luZykucDI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHAgPSBFLnNwYWNlZFBvaW50T25BcmMoYXJjLmNpcmNsZSwgcCwgc3BhY2luZykucDE7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcG9pbnRzLnB1c2gocCk7XG4gICAgICAgIH1cbiAgICAgICAgcG9pbnRzLnB1c2godmVydGljZXNbKGkgKyAxKSAlIGxdKTtcbiAgICAgIH1cblxuICAgICAgLy9saW5lIHRocm91Z2ggb3JpZ2luIChzdHJhaWdodCBsaW5lKVxuICAgICAgZWxzZXtcbiAgICAgICAgcG9pbnRzLnB1c2godmVydGljZXNbKGkgKyAxKSAlIGxdKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IobGV0IHBvaW50IG9mIHBvaW50cyl7XG4gICAgICAvL3RoaXMucG9pbnQocG9pbnQsMiwweDEwZGVkOCk7XG4gICAgfVxuXG4gICAgdGhpcy5kcmF3LnBvbHlnb24ocG9pbnRzLCBjb2xvciwgdGV4dHVyZSwgd2lyZWZyYW1lKTtcbiAgfVxuXG4gIC8vcmV0dXJuIHRydWUgaWYgYW55IG9mIHRoZSBwb2ludHMgaXMgbm90IGluIHRoZSBkaXNrXG4gIGNoZWNrUG9pbnRzKC4uLnBvaW50cykge1xuICAgIGNvbnN0IHIgPSB0aGlzLnJhZGl1cztcbiAgICBsZXQgdGVzdCA9IGZhbHNlO1xuICAgIGZvciAobGV0IHBvaW50IG9mIHBvaW50cykge1xuICAgICAgaWYgKEUuZGlzdGFuY2UocG9pbnQsIHRoaXMuY2VudHJlKSA+IHIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IhIFBvaW50ICgnICsgcG9pbnQueCArICcsICcgKyBwb2ludC55ICsgJykgbGllcyBvdXRzaWRlIHRoZSBwbGFuZSEnKTtcbiAgICAgICAgdGVzdCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0ZXN0KSByZXR1cm4gdHJ1ZVxuICAgIGVsc2UgcmV0dXJuIGZhbHNlXG4gIH1cbn1cbiIsImltcG9ydCB7XG4gIFBvaW50XG59XG5mcm9tICcuL3BvaW50Jztcbi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICpcbi8vICogICBFVUNMSURFQU4gRlVOQ1RJT05TXG4vLyAqICAgYSBwbGFjZSB0byBzdGFzaCBhbGwgdGhlIGZ1bmN0aW9ucyB0aGF0IGFyZSBldWNsaWRlYW4gZ2VvbWV0cmljYWxcbi8vICogICBvcGVyYXRpb25zXG4vLyAqICAgQWxsIGZ1bmN0aW9ucyBhcmUgMkQgdW5sZXNzIG90aGVyd2lzZSBzcGVjaWZpZWQhXG4vLyAqXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbi8vZGlzdGFuY2UgYmV0d2VlbiB0d28gcG9pbnRzXG5leHBvcnQgY29uc3QgZGlzdGFuY2UgPSAocDEsIHAyKSA9PiB7XG4gIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3coKHAyLnggLSBwMS54KSwgMikgKyBNYXRoLnBvdygocDIueSAtIHAxLnkpLCAyKSk7XG59XG5cbi8vbWlkcG9pbnQgb2YgdGhlIGxpbmUgc2VnbWVudCBjb25uZWN0aW5nIHR3byBwb2ludHNcbmV4cG9ydCBjb25zdCBtaWRwb2ludCA9IChwMSwgcDIpID0+IHtcbiAgcmV0dXJuIG5ldyBQb2ludCgocDEueCArIHAyLngpIC8gMiwgKHAxLnkgKyBwMi55KSAvIDIpO1xufVxuXG4vL3Nsb3BlIG9mIGxpbmUgdGhyb3VnaCBwMSwgcDJcbmV4cG9ydCBjb25zdCBzbG9wZSA9IChwMSwgcDIpID0+IHtcbiAgcmV0dXJuIChwMi54IC0gcDEueCkgLyAocDIueSAtIHAxLnkpO1xufVxuXG4vL3Nsb3BlIG9mIGxpbmUgcGVycGVuZGljdWxhciB0byBhIGxpbmUgZGVmaW5lZCBieSBwMSxwMlxuZXhwb3J0IGNvbnN0IHBlcnBlbmRpY3VsYXJTbG9wZSA9IChwMSwgcDIpID0+IHtcbiAgcmV0dXJuIC0xIC8gKE1hdGgucG93KHNsb3BlKHAxLCBwMiksIC0xKSk7XG59XG5cbi8vaW50ZXJzZWN0aW9uIHBvaW50IG9mIHR3byBsaW5lcyBkZWZpbmVkIGJ5IHAxLG0xIGFuZCBxMSxtMlxuLy9OT1QgV09SS0lORyBGT1IgVkVSVElDQUwgTElORVMhISFcbmV4cG9ydCBjb25zdCBpbnRlcnNlY3Rpb24gPSAocDEsIG0xLCBwMiwgbTIpID0+IHtcbiAgbGV0IGMxLCBjMiwgeCwgeTtcbiAgLy9jYXNlIHdoZXJlIGZpcnN0IGxpbmUgaXMgdmVydGljYWxcbiAgLy9pZihtMSA+IDUwMDAgfHwgbTEgPCAtNTAwMCB8fCBtMSA9PT0gSW5maW5pdHkpe1xuICBpZiAocDEueSA8IDAuMDAwMDAxICYmIHAxLnkgPiAtMC4wMDAwMDEpIHtcbiAgICB4ID0gcDEueDtcbiAgICB5ID0gKG0yKSAqIChwMS54IC0gcDIueCkgKyBwMi55O1xuICB9XG4gIC8vY2FzZSB3aGVyZSBzZWNvbmQgbGluZSBpcyB2ZXJ0aWNhbFxuICAvL2Vsc2UgaWYobTIgPiA1MDAwIHx8IG0yIDwgLTUwMDAgfHwgbTEgPT09IEluZmluaXR5KXtcbiAgZWxzZSBpZiAocDIueSA8IDAuMDAwMDAxICYmIHAyLnkgPiAtMC4wMDAwMDEpIHtcbiAgICB4ID0gcDIueDtcbiAgICB5ID0gKG0xICogKHAyLnggLSBwMS54KSkgKyBwMS55O1xuICB9IGVsc2Uge1xuICAgIC8veSBpbnRlcmNlcHQgb2YgZmlyc3QgbGluZVxuICAgIGMxID0gcDEueSAtIG0xICogcDEueDtcbiAgICAvL3kgaW50ZXJjZXB0IG9mIHNlY29uZCBsaW5lXG4gICAgYzIgPSBwMi55IC0gbTIgKiBwMi54O1xuXG4gICAgeCA9IChjMiAtIGMxKSAvIChtMSAtIG0yKTtcbiAgICB5ID0gbTEgKiB4ICsgYzE7XG4gIH1cblxuICByZXR1cm4gbmV3IFBvaW50KHgsIHkpO1xufVxuXG5leHBvcnQgY29uc3QgcmFkaWFucyA9IChkZWdyZWVzKSA9PiB7XG4gIHJldHVybiAoTWF0aC5QSSAvIDE4MCkgKiBkZWdyZWVzO1xufVxuXG4vL2dldCB0aGUgY2lyY2xlIGludmVyc2Ugb2YgYSBwb2ludCBwIHdpdGggcmVzcGVjdCBhIGNpcmNsZSByYWRpdXMgciBjZW50cmUgY1xuZXhwb3J0IGNvbnN0IGludmVyc2UgPSAocCwgciwgYykgPT4ge1xuICBsZXQgYWxwaGEgPSAociAqIHIpIC8gKE1hdGgucG93KHAueCAtIGMueCwgMikgKyBNYXRoLnBvdyhwLnkgLSBjLnksIDIpKTtcbiAgcmV0dXJuIG5ldyBQb2ludChhbHBoYSAqIChwLnggLSBjLngpICsgYy54LCBhbHBoYSAqIChwLnkgLSBjLnkpICsgYy55KTtcbn1cblxuLy9yZWZsZWN0IHAzIGFjcm9zcyB0aGUgbGluZSBkZWZpbmVkIGJ5IHAxLHAyXG5leHBvcnQgY29uc3QgbGluZVJlZmxlY3Rpb24gPSAocDEsIHAyLCBwMykgPT4ge1xuICBjb25zdCBtID0gc2xvcGUocDEsIHAyKTtcbiAgLy9yZWZsZWN0aW9uIGluIHkgYXhpc1xuICBpZiAobSA+IDk5OTk5OSB8fCBtIDwgLTk5OTk5OSkge1xuICAgIHJldHVybiBuZXcgUG9pbnQoIHAzLngsIC1wMy55KTtcbiAgfVxuICAvL3JlZmxlY3Rpb24gaW4geCBheGlzXG4gIGVsc2UgaWYgKG0udG9GaXhlZCg2KSA9PSAwKSB7XG4gICAgcmV0dXJuIG5ldyBQb2ludCggLXAzLngsIHAzLnkpO1xuICB9XG4gIC8vcmVmbGVjdGlvbiBpbiBhcmJpdHJhcnkgbGluZVxuICBlbHNlIHtcbiAgICBjb25zdCBjID0gcDEueSAtIG0gKiBwMS54O1xuICAgIGNvbnN0IGQgPSAocDMueCArIChwMy55IC0gYykgKiBtKSAvICgxICsgbSAqIG0pO1xuICAgIGNvbnN0IHggPSAyICogZCAtIHAzLng7XG4gICAgY29uc3QgeSA9IDIgKiBkICogbSAtIHAzLnkgKyAyICogYztcbiAgICByZXR1cm4gbmV3IFBvaW50KHgseSk7XG4gIH1cbn1cblxuLy9jYWxjdWxhdGUgdGhlIHJhZGl1cyBhbmQgY2VudHJlIG9mIHRoZSBjaXJjbGUgcmVxdWlyZWQgdG8gZHJhdyBhIGxpbmUgYmV0d2VlblxuLy90d28gcG9pbnRzIGluIHRoZSBoeXBlcmJvbGljIHBsYW5lIGRlZmluZWQgYnkgdGhlIGRpc2sgKHIsIGMpXG5leHBvcnQgY29uc3QgZ3JlYXRDaXJjbGUgPSAocDEsIHAyLCByLCBjKSA9PiB7XG4gIGxldCBwMUludmVyc2UgPSBpbnZlcnNlKHAxLCByLCBjKTtcbiAgbGV0IHAySW52ZXJzZSA9IGludmVyc2UocDIsIHIsIGMpO1xuXG4gIGxldCBtID0gbWlkcG9pbnQocDEsIHAxSW52ZXJzZSk7XG4gIGxldCBuID0gbWlkcG9pbnQocDIsIHAySW52ZXJzZSk7XG5cbiAgbGV0IG0xID0gcGVycGVuZGljdWxhclNsb3BlKG0sIHAxSW52ZXJzZSk7XG4gIGxldCBtMiA9IHBlcnBlbmRpY3VsYXJTbG9wZShuLCBwMkludmVyc2UpO1xuXG5cbiAgLy9jZW50cmUgaXMgdGhlIGNlbnRyZXBvaW50IG9mIHRoZSBjaXJjbGUgb3V0IG9mIHdoaWNoIHRoZSBhcmMgaXMgbWFkZVxuICBsZXQgY2VudHJlID0gaW50ZXJzZWN0aW9uKG0sIG0xLCBuLCBtMik7XG4gIGxldCByYWRpdXMgPSBkaXN0YW5jZShjZW50cmUsIHAxKTtcbiAgcmV0dXJuIHtcbiAgICBjZW50cmU6IGNlbnRyZSxcbiAgICByYWRpdXM6IHJhZGl1c1xuICB9O1xufVxuXG4vL2FuIGF0dGVtcHQgYXQgY2FsY3VsYXRpbmcgdGhlIGNpcmNsZSBhbGdlYnJhaWNhbGx5XG5leHBvcnQgY29uc3QgZ3JlYXRDaXJjbGVWMiA9IChwMSwgcDIsIHIpID0+IHtcbiAgbGV0IHggPSAocDIueSAqIChwMS54ICogcDEueCArIHIpICsgcDEueSAqIHAxLnkgKiBwMi55IC0gcDEueSAqIChwMi54ICogcDIueCArIHAyLnkgKiBwMi55ICsgcikpIC8gKDIgKiBwMS54ICogcDIueSAtIHAxLnkgKiBwMi54KTtcbiAgbGV0IHkgPSAocDEueCAqIHAxLnggKiBwMi54IC0gcDEueCAqIChwMi54ICogcDIueCArIHAyLnkgKiBwMi55ICsgcikgKyBwMi54ICogKHAxLnkgKiBwMS55ICsgcikpIC8gKDIgKiBwMS55ICogcDIueCArIDIgKiBwMS54ICogcDIueSk7XG4gIGxldCByYWRpdXMgPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSAtIHIpO1xuICByZXR1cm4ge1xuICAgIGNlbnRyZToge1xuICAgICAgeDogeCxcbiAgICAgIHk6IHlcbiAgICB9LFxuICAgIHJhZGl1czogcmFkaXVzXG4gIH1cbn1cblxuLy9pbnRlcnNlY3Rpb24gb2YgdHdvIGNpcmNsZXMgd2l0aCBlcXVhdGlvbnM6XG4vLyh4LWEpXjIgKyh5LWEpXjIgPSByMF4yXG4vLyh4LWIpXjIgKyh5LWMpXjIgPSByMV4yXG4vL05PVEUgYXNzdW1lcyB0aGUgdHdvIGNpcmNsZXMgRE8gaW50ZXJzZWN0IVxuZXhwb3J0IGNvbnN0IGNpcmNsZUludGVyc2VjdCA9IChjMCwgYzEsIHIwLCByMSkgPT4ge1xuICBsZXQgYSA9IGMwLng7XG4gIGxldCBiID0gYzAueTtcbiAgbGV0IGMgPSBjMS54O1xuICBsZXQgZCA9IGMxLnk7XG4gIGxldCBkaXN0ID0gTWF0aC5zcXJ0KChjIC0gYSkgKiAoYyAtIGEpICsgKGQgLSBiKSAqIChkIC0gYikpO1xuXG4gIGxldCBkZWwgPSBNYXRoLnNxcnQoKGRpc3QgKyByMCArIHIxKSAqIChkaXN0ICsgcjAgLSByMSkgKiAoZGlzdCAtIHIwICsgcjEpICogKC1kaXN0ICsgcjAgKyByMSkpIC8gNDtcblxuICBsZXQgeFBhcnRpYWwgPSAoYSArIGMpIC8gMiArICgoYyAtIGEpICogKHIwICogcjAgLSByMSAqIHIxKSkgLyAoMiAqIGRpc3QgKiBkaXN0KTtcbiAgbGV0IHgxID0geFBhcnRpYWwgLSAyICogZGVsICogKGIgLSBkKSAvIChkaXN0ICogZGlzdCk7XG4gIGxldCB4MiA9IHhQYXJ0aWFsICsgMiAqIGRlbCAqIChiIC0gZCkgLyAoZGlzdCAqIGRpc3QpO1xuXG4gIGxldCB5UGFydGlhbCA9IChiICsgZCkgLyAyICsgKChkIC0gYikgKiAocjAgKiByMCAtIHIxICogcjEpKSAvICgyICogZGlzdCAqIGRpc3QpO1xuICBsZXQgeTEgPSB5UGFydGlhbCArIDIgKiBkZWwgKiAoYSAtIGMpIC8gKGRpc3QgKiBkaXN0KTtcbiAgbGV0IHkyID0geVBhcnRpYWwgLSAyICogZGVsICogKGEgLSBjKSAvIChkaXN0ICogZGlzdCk7XG5cbiAgbGV0IHAxID0gbmV3IFBvaW50KHgxLHkxKTtcblxuICBsZXQgcDIgPSBuZXcgUG9pbnQoeDIseTIpO1xuXG4gIHJldHVybiB7XG4gICAgcDE6IHAxLFxuICAgIHAyOiBwMlxuICB9O1xufVxuXG5leHBvcnQgY29uc3QgY2lyY2xlTGluZUludGVyc2VjdCA9IChjLCByLCBwMSwgcDIpID0+IHtcblxuICBjb25zdCBkID0gZGlzdGFuY2UocDEsIHAyKTtcbiAgLy91bml0IHZlY3RvciBwMSBwMlxuICBjb25zdCBkeCA9IChwMi54IC0gcDEueCkgLyBkO1xuICBjb25zdCBkeSA9IChwMi55IC0gcDEueSkgLyBkO1xuXG4gIC8vcG9pbnQgb24gbGluZSBjbG9zZXN0IHRvIGNpcmNsZSBjZW50cmVcbiAgY29uc3QgdCA9IGR4ICogKGMueCAtIHAxLngpICsgZHkgKiAoYy55IC0gcDEueSk7XG4gIGNvbnN0IHAgPSBuZXcgUG9pbnQodCAqIGR4ICsgcDEueCwgdCAqIGR5ICsgcDEueSk7XG5cbiAgLy9kaXN0YW5jZSBmcm9tIHRoaXMgcG9pbnQgdG8gY2VudHJlXG4gIGNvbnN0IGQyID0gZGlzdGFuY2UocCwgYyk7XG5cbiAgLy9saW5lIGludGVyc2VjdHMgY2lyY2xlXG4gIGlmIChkMiA8IHIpIHtcbiAgICBjb25zdCBkdCA9IE1hdGguc3FydChyICogciAtIGQyICogZDIpO1xuICAgIC8vcG9pbnQgMVxuICAgIGNvbnN0IHExID0gbmV3IFBvaW50KCh0IC0gZHQpICogZHggKyBwMS54LCAodCAtIGR0KSAqIGR5ICsgcDEueSk7XG4gICAgLy9wb2ludCAyXG4gICAgY29uc3QgcTIgPSBuZXcgUG9pbnQoKHQgKyBkdCkgKiBkeCArIHAxLngsKHQgKyBkdCkgKiBkeSArIHAxLnkpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHAxOiBxMSxcbiAgICAgIHAyOiBxMlxuICAgIH07XG4gIH0gZWxzZSBpZiAoZDIgPT09IHIpIHtcbiAgICByZXR1cm4gcDtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvcjogbGluZSBkb2VzIG5vdCBpbnRlcnNlY3QgY2lyY2xlIScpO1xuICB9XG59XG5cbi8vYW5nbGUgaW4gcmFkaWFucyBiZXR3ZWVuIHR3byBwb2ludHMgb24gY2lyY2xlIG9mIHJhZGl1cyByXG5leHBvcnQgY29uc3QgY2VudHJhbEFuZ2xlID0gKHAxLCBwMiwgcikgPT4ge1xuICAvL3JvdW5kIG9mZiBlcnJvciBjYW4gcmVzdWx0IGluIHRoaXMgYmVpbmcgdmVyeSBzbGlnaHRseSBncmVhdGVyIHRoYW4gMVxuICBsZXQgdGVtcCA9ICgwLjUgKiBkaXN0YW5jZShwMSwgcDIpIC8gcikudG9GaXhlZCgxMik7XG4gIGxldCByZXMgPSAyICogTWF0aC5hc2luKHRlbXApO1xuICBpZihpc05hTihyZXMpKSByZXMgPSAwO1xuICByZXR1cm4gcmVzO1xufVxuXG4vL2NhbGN1bGF0ZSB0aGUgbm9ybWFsIHZlY3RvciBnaXZlbiAyIHBvaW50c1xuZXhwb3J0IGNvbnN0IG5vcm1hbFZlY3RvciA9IChwMSwgcDIpID0+IHtcbiAgbGV0IGQgPSBNYXRoLnNxcnQoTWF0aC5wb3cocDIueCAtIHAxLngsIDIpICsgTWF0aC5wb3cocDIueSAtIHAxLnksIDIpKTtcbiAgcmV0dXJuIG5ldyBQb2ludCgocDIueCAtIHAxLngpIC8gZCwocDIueSAtIHAxLnkpIC8gZCk7XG59XG5cbi8vZG9lcyB0aGUgbGluZSBjb25uZWN0aW5nIHAxLCBwMiBnbyB0aHJvdWdoIHRoZSBwb2ludCAoMCwwKT9cbi8vbmVlZHMgdG8gdGFrZSBpbnRvIGFjY291bnQgcm91bmRvZmYgZXJyb3JzIHNvIHJldHVybnMgdHJ1ZSBpZlxuLy90ZXN0IGlzIGNsb3NlIHRvIDBcbmV4cG9ydCBjb25zdCB0aHJvdWdoT3JpZ2luID0gKHAxLCBwMikgPT4ge1xuICBpZiAocDEueCA9PT0gMCAmJiBwMi54ID09PSAwKSB7XG4gICAgLy92ZXJ0aWNhbCBsaW5lIHRocm91Z2ggY2VudHJlXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgY29uc3QgdGVzdCA9ICgtcDEueCAqIHAyLnkgKyBwMS54ICogcDEueSkgLyAocDIueCAtIHAxLngpICsgcDEueTtcblxuICBpZiAodGVzdC50b0ZpeGVkKDYpID09IDApIHJldHVybiB0cnVlO1xuICBlbHNlIHJldHVybiBmYWxzZTtcbn1cblxuLy9maW5kIHRoZSBjZW50cm9pZCBvZiBhIG5vbi1zZWxmLWludGVyc2VjdGluZyBwb2x5Z29uXG5leHBvcnQgY29uc3QgY2VudHJvaWRPZlBvbHlnb24gPSAocG9pbnRzKSA9PiB7XG4gIGxldCBmaXJzdCA9IHBvaW50c1swXSxcbiAgICBsYXN0ID0gcG9pbnRzW3BvaW50cy5sZW5ndGggLSAxXTtcbiAgaWYgKGZpcnN0LnggIT0gbGFzdC54IHx8IGZpcnN0LnkgIT0gbGFzdC55KSBwb2ludHMucHVzaChmaXJzdCk7XG4gIGxldCB0d2ljZWFyZWEgPSAwLFxuICAgIHggPSAwLFxuICAgIHkgPSAwLFxuICAgIG5QdHMgPSBwb2ludHMubGVuZ3RoLFxuICAgIHAxLCBwMiwgZjtcbiAgZm9yICh2YXIgaSA9IDAsIGogPSBuUHRzIC0gMTsgaSA8IG5QdHM7IGogPSBpKyspIHtcbiAgICBwMSA9IHBvaW50c1tpXTtcbiAgICBwMiA9IHBvaW50c1tqXTtcbiAgICBmID0gcDEueCAqIHAyLnkgLSBwMi54ICogcDEueTtcbiAgICB0d2ljZWFyZWEgKz0gZjtcbiAgICB4ICs9IChwMS54ICsgcDIueCkgKiBmO1xuICAgIHkgKz0gKHAxLnkgKyBwMi55KSAqIGY7XG4gIH1cbiAgZiA9IHR3aWNlYXJlYSAqIDM7XG4gIHJldHVybiBuZXcgUG9pbnQoIHggLyBmLCB5IC8gZik7XG59XG5cbi8vY29tcGFyZSB0d28gcG9pbnRzIHRha2luZyByb3VuZGluZyBlcnJvcnMgaW50byBhY2NvdW50XG5leHBvcnQgY29uc3QgY29tcGFyZVBvaW50cyA9IChwMSwgcDIpID0+IHtcbiAgaWYgKHR5cGVvZiBwMSA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHAyID09PSAndW5kZWZpbmVkJykge1xuICAgIGNvbnNvbGUud2FybignV2FybmluZzogcG9pbnQgbm8gZGVmaW5lZC4nKVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBwMSA9IHBvaW50VG9GaXhlZChwMSwgMTApO1xuICBwMiA9IHBvaW50VG9GaXhlZChwMiwgMTApO1xuICBpZiAocDEueCA9PT0gcDIueCAmJiBwMS55ID09PSBwMi55KSByZXR1cm4gdHJ1ZTtcbiAgZWxzZSByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBjb25zdCBwb2ludFRvRml4ZWQgPSAocCwgcGxhY2VzKSA9PiB7XG4gIHJldHVybiB7XG4gICAgeDogcC54LnRvRml4ZWQocGxhY2VzKSxcbiAgICB5OiBwLnkudG9GaXhlZChwbGFjZXMpXG4gIH07XG59XG5cbi8vZmluZCBhIHBvaW50IGF0IGEgZGlzdGFuY2UgZCBhbG9uZyB0aGUgY2lyY3VtZmVyZW5jZSBvZlxuLy9hIGNpcmNsZSBvZiByYWRpdXMgciwgY2VudHJlIGMgZnJvbSBhIHBvaW50IGFsc29cbi8vb24gdGhlIGNpcmN1bWZlcmVuY2VcbmV4cG9ydCBjb25zdCBzcGFjZWRQb2ludE9uQXJjID0gKGNpcmNsZSwgcG9pbnQsIHNwYWNpbmcpID0+IHtcbiAgY29uc3QgY29zVGhldGEgPSAtKChzcGFjaW5nICogc3BhY2luZykgLyAoMiAqIGNpcmNsZS5yYWRpdXMgKiBjaXJjbGUucmFkaXVzKSAtIDEpO1xuICBjb25zdCBzaW5UaGV0YVBvcyA9IE1hdGguc3FydCgxIC0gTWF0aC5wb3coY29zVGhldGEsIDIpKTtcbiAgY29uc3Qgc2luVGhldGFOZWcgPSAtc2luVGhldGFQb3M7XG5cbiAgY29uc3QgeFBvcyA9IGNpcmNsZS5jZW50cmUueCArIGNvc1RoZXRhICogKHBvaW50LnggLSBjaXJjbGUuY2VudHJlLngpIC0gc2luVGhldGFQb3MgKiAocG9pbnQueSAtIGNpcmNsZS5jZW50cmUueSk7XG4gIGNvbnN0IHhOZWcgPSBjaXJjbGUuY2VudHJlLnggKyBjb3NUaGV0YSAqIChwb2ludC54IC0gY2lyY2xlLmNlbnRyZS54KSAtIHNpblRoZXRhTmVnICogKHBvaW50LnkgLSBjaXJjbGUuY2VudHJlLnkpO1xuICBjb25zdCB5UG9zID0gY2lyY2xlLmNlbnRyZS55ICsgc2luVGhldGFQb3MgKiAocG9pbnQueCAtIGNpcmNsZS5jZW50cmUueCkgKyBjb3NUaGV0YSAqIChwb2ludC55IC0gY2lyY2xlLmNlbnRyZS55KTtcbiAgY29uc3QgeU5lZyA9IGNpcmNsZS5jZW50cmUueSArIHNpblRoZXRhTmVnICogKHBvaW50LnggLSBjaXJjbGUuY2VudHJlLngpICsgY29zVGhldGEgKiAocG9pbnQueSAtIGNpcmNsZS5jZW50cmUueSk7XG5cbiAgcmV0dXJuIHtcbiAgICBwMTogbmV3IFBvaW50KHhQb3MsIHlQb3MpLFxuICAgIHAyOiBuZXcgUG9pbnQoeE5lZyx5TmVnKVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCByYW5kb21GbG9hdCA9IChtaW4sIG1heCkgPT4ge1xuICByZXR1cm4gTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pICsgbWluO1xufVxuXG5leHBvcnQgY29uc3QgcmFuZG9tSW50ID0gKG1pbiwgbWF4KSA9PiB7XG4gIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluICsgMSkgKyBtaW4pO1xufVxuIiwiaW1wb3J0ICogYXMgRSBmcm9tICcuL2V1Y2xpZCc7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gJy4vcG9pbnQnO1xuLy8gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gKlxuLy8gKiAgIEhZUEVSQk9MSUMgRlVOQ1RJT05TXG4vLyAqICAgYSBwbGFjZSB0byBzdGFzaCBhbGwgdGhlIGZ1bmN0aW9ucyB0aGF0IGFyZSBoeXBlcmJvbGljIGdlbWVvbWV0cmljYWxcbi8vICogICBvcGVyYXRpb25zXG4vLyAqXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbi8vY2FsY3VsYXRlIGdyZWF0Q2lyY2xlLCBzdGFydEFuZ2xlIGFuZCBlbmRBbmdsZSBmb3IgaHlwZXJib2xpYyBhcmNcbi8vVE9ETyBkZWFsIHdpdGggY2FzZSBvZiBzdGFpZ2h0IGxpbmVzIHRocm91Z2ggY2VudHJlXG5leHBvcnQgY29uc3QgYXJjID0gKHAxLCBwMiwgY2lyY2xlKSA9PiB7XG4gIGlmIChFLnRocm91Z2hPcmlnaW4ocDEsIHAyKSkge1xuICAgIHJldHVybiB7XG4gICAgICBjaXJjbGU6IGNpcmNsZSxcbiAgICAgIHN0YXJ0QW5nbGU6IDAsXG4gICAgICBlbmRBbmdsZTogMCxcbiAgICAgIGNsb2Nrd2lzZTogZmFsc2UsXG4gICAgICBzdHJhaWdodExpbmU6IHRydWUsXG4gICAgfVxuICB9XG4gIGxldCBjbG9ja3dpc2UgPSBmYWxzZTtcbiAgbGV0IGFscGhhMSwgYWxwaGEyLCBzdGFydEFuZ2xlLCBlbmRBbmdsZTtcbiAgY29uc3QgYyA9IEUuZ3JlYXRDaXJjbGUocDEsIHAyLCBjaXJjbGUucmFkaXVzLCBjaXJjbGUuY2VudHJlKTtcblxuICBjb25zdCBveSA9IGMuY2VudHJlLnk7XG4gIGNvbnN0IG94ID0gYy5jZW50cmUueDtcblxuICAvL3BvaW50IGF0IDAgcmFkaWFucyBvbiBjXG4gIGNvbnN0IHAzID0gbmV3IFBvaW50KCBveCArIGMucmFkaXVzLCBveSk7XG5cbiAgLy9wb2ludCBhdCBQSSByYWRpYW5zIG9uIGNcbiAgY29uc3QgcDQgPSBuZXcgUG9pbnQoIG94IC0gYy5yYWRpdXMsIG95KTtcblxuICAvL2NhbGN1bGF0ZSB0aGUgcG9zaXRpb24gb2YgZWFjaCBwb2ludCBpbiB0aGUgY2lyY2xlXG4gIGFscGhhMSA9IEUuY2VudHJhbEFuZ2xlKHAzLCBwMSwgYy5yYWRpdXMpO1xuICBhbHBoYTEgPSAocDEueSA8IG95KSA/IDIgKiBNYXRoLlBJIC0gYWxwaGExIDogYWxwaGExO1xuICBhbHBoYTIgPSBFLmNlbnRyYWxBbmdsZShwMywgcDIsIGMucmFkaXVzKTtcbiAgYWxwaGEyID0gKHAyLnkgPCBveSkgPyAyICogTWF0aC5QSSAtIGFscGhhMiA6IGFscGhhMjtcblxuICAvL2NvbnNvbGUubG9nKGMuY2VudHJlLCBjLnJhZGl1cywgYWxwaGExLCBhbHBoYTIpO1xuXG4gIC8vY2FzZSB3aGVyZSBwMSBhYm92ZSBhbmQgcDIgYmVsb3cgb3Igb24gdGhlIGxpbmUgYy5jZW50cmUgLT4gcDNcbiAgaWYgKChwMS54ID49IG94ICYmIHAyLnggPj0gb3gpICYmIChwMS55IDw9IG95ICYmIHAyLnkgPj0gb3kpKSB7XG4gICAgc3RhcnRBbmdsZSA9IGFscGhhMTtcbiAgICBlbmRBbmdsZSA9IGFscGhhMjtcbiAgfVxuICAvL2Nhc2Ugd2hlcmUgcDIgYWJvdmUgYW5kIHAxIGJlbG93IG9yIG9uIHRoZSBsaW5lIGMuY2VudHJlIC0+IHAzXG4gIGVsc2UgaWYgKChwMS54ID49IG94ICYmIHAyLnggPj0gb3gpICYmIChwMS55ID49IG95ICYmIHAyLnkgPD0gb3kpKSB7XG4gICAgc3RhcnRBbmdsZSA9IGFscGhhMjtcbiAgICBlbmRBbmdsZSA9IGFscGhhMTtcbiAgICBjbG9ja3dpc2UgPSB0cnVlO1xuICB9XG4gIC8vcG9pbnRzIGluIGNsb2Nrd2lzZSBvcmRlclxuICBlbHNlIGlmIChhbHBoYTEgPiBhbHBoYTIpIHtcbiAgICBzdGFydEFuZ2xlID0gYWxwaGEyO1xuICAgIGVuZEFuZ2xlID0gYWxwaGExO1xuICAgIGNsb2Nrd2lzZSA9IHRydWU7XG4gIH1cbiAgLy9wb2ludHMgaW4gYW50aWNsb2Nrd2lzZSBvcmRlclxuICBlbHNlIHtcbiAgICBzdGFydEFuZ2xlID0gYWxwaGExO1xuICAgIGVuZEFuZ2xlID0gYWxwaGEyO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBjaXJjbGU6IGMsXG4gICAgc3RhcnRBbmdsZTogc3RhcnRBbmdsZSxcbiAgICBlbmRBbmdsZTogZW5kQW5nbGUsXG4gICAgY2xvY2t3aXNlOiBjbG9ja3dpc2UsXG4gICAgc3RyYWlnaHRMaW5lOiBmYWxzZSxcbiAgfVxufVxuXG4vL3RyYW5zbGF0ZSBhIHNldCBvZiBwb2ludHMgYWxvbmcgdGhlIHggYXhpc1xuZXhwb3J0IGNvbnN0IHRyYW5zbGF0ZVggPSAocG9pbnRzQXJyYXksIGRpc3RhbmNlKSA9PiB7XG4gIGNvbnN0IGwgPSBwb2ludHNBcnJheS5sZW5ndGg7XG4gIGNvbnN0IG5ld1BvaW50cyA9IFtdO1xuICBjb25zdCBlID0gTWF0aC5wb3coTWF0aC5FLCBkaXN0YW5jZSk7XG4gIGNvbnN0IHBvcyA9IGUgKyAxO1xuICBjb25zdCBuZWcgPSBlIC0gMTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICBjb25zdCB4ID0gcG9zICogcG9pbnRzQXJyYXlbaV0ueCArIG5lZyAqIHBvaW50c0FycmF5W2ldLnk7XG4gICAgY29uc3QgeSA9IG5lZyAqIHBvaW50c0FycmF5W2ldLnggKyBwb3MgKiBwb2ludHNBcnJheVtpXS55O1xuICAgIG5ld1BvaW50cy5wdXNoKCBuZXcgUG9pbnQoeCx5KSk7XG4gIH1cbiAgcmV0dXJuIG5ld1BvaW50cztcbn1cblxuLy9yb3RhdGUgYSBzZXQgb2YgcG9pbnRzIGFib3V0IGEgcG9pbnQgYnkgYSBnaXZlbiBhbmdsZVxuLy9jbG9ja3dpc2UgZGVmYXVsdHMgdG8gZmFsc2VcbmV4cG9ydCBjb25zdCByb3RhdGlvbiA9IChwb2ludHNBcnJheSwgcG9pbnQsIGFuZ2xlLCBjbG9ja3dpc2UpID0+IHtcblxufVxuXG4vL3JlZmxlY3QgYSBzZXQgb2YgcG9pbnRzIGFjcm9zcyBhIGh5cGVyYm9saWMgYXJjXG4vL1RPRE8gYWRkIGNhc2Ugd2hlcmUgcmVmbGVjdGlvbiBpcyBhY3Jvc3Mgc3RyYWlnaHQgbGluZVxuZXhwb3J0IGNvbnN0IHJlZmxlY3QgPSAocG9pbnRzQXJyYXksIHAxLCBwMiwgY2lyY2xlKSA9PiB7XG4gIGNvbnN0IGwgPSBwb2ludHNBcnJheS5sZW5ndGg7XG4gIGNvbnN0IGEgPSBhcmMocDEsIHAyLCBjaXJjbGUpO1xuICBjb25zdCBuZXdQb2ludHMgPSBbXTtcblxuICBpZiAoIWEuc3RyYWlnaHRMaW5lKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgIG5ld1BvaW50cy5wdXNoKEUuaW52ZXJzZShwb2ludHNBcnJheVtpXSwgYS5jaXJjbGUucmFkaXVzLCBhLmNpcmNsZS5jZW50cmUpKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgIG5ld1BvaW50cy5wdXNoKEUubGluZVJlZmxlY3Rpb24ocDEscDIscG9pbnRzQXJyYXlbaV0pKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG5ld1BvaW50cztcbn1cblxuZXhwb3J0IGNvbnN0IHBvaW5jYXJlVG9XZWllcnN0cmFzcyA9IChwb2ludDJEKSA9PiB7XG4gIGNvbnN0IGZhY3RvciA9IDEgLyAoMSAtIHBvaW50MkQueCAqIHBvaW50MkQueCAtIHBvaW50MkQueSAqIHBvaW50MkQueSk7XG4gIHJldHVybiB7XG4gICAgeDogMiAqIGZhY3RvciAqIHBvaW50MkQueCxcbiAgICB5OiAyICogZmFjdG9yICogcG9pbnQyRC55LFxuICAgIHo6IGZhY3RvciAqICgxICsgcG9pbnQyRC54ICogcG9pbnQyRC54ICsgcG9pbnQyRC55ICogcG9pbnQyRC55KVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCB3ZWllcnN0cmFzc1RvUG9pbmNhcmUgPSAocG9pbnQzRCkgPT4ge1xuICBjb25zdCBmYWN0b3IgPSAxIC8gKDEgKyBwb2ludDNELnopO1xuICByZXR1cm4gbmV3IFBvaW50KGZhY3RvciAqIHBvaW50M0QueCxmYWN0b3IgKiBwb2ludDNELnkpO1xufVxuXG5leHBvcnQgY29uc3Qgcm90YXRlQWJvdXRPcmlnaW5XZWllcnN0cmFzcyA9IChwb2ludDNELCBhbmdsZSkgPT4ge1xuICByZXR1cm4ge1xuICAgIHg6IE1hdGguY29zKGFuZ2xlKSAqIHBvaW50M0QueCAtIE1hdGguc2luKGFuZ2xlKSAqIHBvaW50M0QueSxcbiAgICB5OiBNYXRoLnNpbihhbmdsZSkgKiBwb2ludDNELnggKyBNYXRoLmNvcyhhbmdsZSkgKiBwb2ludDNELnksXG4gICAgejogcG9pbnQzRC56XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHJvdGF0ZUFib3V0T3JpZ2luID0gKHBvaW50MkQsIGFuZ2xlKSA9PiB7XG4gIHJldHVybiBuZXcgUG9pbnQoTWF0aC5jb3MoYW5nbGUpICogcG9pbnQyRC54IC0gTWF0aC5zaW4oYW5nbGUpICogcG9pbnQyRC55LFxuICAgICBNYXRoLnNpbihhbmdsZSkgKiBwb2ludDJELnggKyBNYXRoLmNvcyhhbmdsZSkgKiBwb2ludDJELnkpO1xufVxuXG5leHBvcnQgY29uc3Qgcm90YXRlUGdvbkFib3V0T3JpZ2luID0gKHBvaW50czJEQXJyYXksIGFuZ2xlKSA9PiB7XG4gIGNvbnN0IGwgPSBwb2ludHMyREFycmF5Lmxlbmd0aDtcbiAgY29uc3Qgcm90YXRlZFBvaW50czJEQXJyYXkgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICBsZXQgcG9pbnQgPSByb3RhdGVBYm91dE9yaWdpbihwb2ludHMyREFycmF5W2ldLCBhbmdsZSk7XG4gICAgcm90YXRlZFBvaW50czJEQXJyYXkucHVzaChwb2ludCk7XG4gIH1cbiAgcmV0dXJuIHJvdGF0ZWRQb2ludHMyREFycmF5O1xufVxuXG4vL3doZW4gdGhlIHBvaW50IHAxIGlzIHRyYW5zbGF0ZWQgdG8gdGhlIG9yaWdpbiwgdGhlIHBvaW50IHAyXG4vL2lzIHRyYW5zbGF0ZWQgYWNjb3JkaW5nIHRvIHRoaXMgZm9ybXVsYVxuLy9odHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Qb2luY2FyJUMzJUE5X2Rpc2tfbW9kZWwjSXNvbWV0cmljX1RyYW5zZm9ybWF0aW9uc1xuZXhwb3J0IGNvbnN0IHRyYW5zbGF0ZVBvaW5jYXJlID0gKHAxLCBwMikgPT4ge1xuICBjb25zdCBkb3QgPSBwMS54ICogcDIueCArIHAxLnkgKiBwMi55O1xuICBjb25zdCBub3JtU3F1YXJlZFAxID0gTWF0aC5wb3coTWF0aC5zcXJ0KHAxLnggKiBwMS54ICsgcDEueSAqIHAxLnkpLCAyKTtcbiAgY29uc3Qgbm9ybVNxdWFyZWRQMiA9IE1hdGgucG93KE1hdGguc3FydChwMi54ICogcDIueCArIHAyLnkgKiBwMi55KSwgMik7XG4gIGNvbnN0IGRlbm9taW5hdG9yID0gMSArIDIgKiBkb3QgKyBub3JtU3F1YXJlZFAxICogbm9ybVNxdWFyZWRQMjtcblxuICBjb25zdCBwMUZhY3RvciA9ICgxICsgMiAqIGRvdCArIG5vcm1TcXVhcmVkUDIpIC8gZGVub21pbmF0b3I7XG4gIGNvbnN0IHAyRmFjdG9yID0gKDEgLSBub3JtU3F1YXJlZFAxKSAvIGRlbm9taW5hdG9yO1xuXG4gIGNvbnN0IHggPSBwMUZhY3RvciAqIHAxLnggKyBwMkZhY3RvciAqIHAyLng7XG4gIGNvbnN0IHkgPSBwMUZhY3RvciAqIHAxLnkgKyBwMkZhY3RvciAqIHAyLnk7XG5cbiAgcmV0dXJuIG5ldyBQb2ludCh4LHkpO1xufVxuXG5leHBvcnQgY29uc3QgaW52ZXJzZVRyYW5zbGF0ZVBvaW5jYXJlID0gKHAxLCBwMikgPT4ge1xuXG59XG4iLCIvL1RPRE8gY3JlYXRlIGNpcmNsZSBjbGFzcyBhbmQgcmVmYWN0b3Jcbi8vVE9ETyB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbG9hZCcpOyBub3Qgd29ya2luZyBpbiBmaXJlZm94XG5cbmltcG9ydCB7IFJlZ3VsYXJUZXNzZWxhdGlvbiB9IGZyb20gJy4vcmVndWxhclRlc3NlbGF0aW9uJztcblxuLy8gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gKlxuLy8gKiAgIFNFVFVQXG4vLyAqXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbi8vY29uc3QgdGVzc2VsYXRpb24gPSBuZXcgUmVndWxhclRlc3NlbGF0aW9uKEUucmFuZG9tSW50KDQsMTIpLCBFLnJhbmRvbUludCg0LDEyKSk7XG5jb25zdCB0ZXNzZWxhdGlvbiA9IG5ldyBSZWd1bGFyVGVzc2VsYXRpb24oNiwgMTIpO1xuIiwiLy8gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gKlxuLy8gKiAgIFBPSU5UIENMQVNTXG4vLyAqICAgMmQgcG9pbnQgY2xhc3Ncbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuZXhwb3J0IGNsYXNzIFBvaW50e1xuICBjb25zdHJ1Y3Rvcih4LCB5KXtcbiAgICBpZih4LnRvRml4ZWQoMTApID09IDApe1xuICAgICAgeCA9IDA7XG4gICAgfVxuICAgIGlmKHkudG9GaXhlZCgxMCkgPT0gMCl7XG4gICAgICB5ID0gMDtcbiAgICB9XG4gICAgdGhpcy54ID0geDtcbiAgICB0aGlzLnkgPSB5O1xuICB9XG59XG4iLCJpbXBvcnQgKiBhcyBFIGZyb20gJy4vZXVjbGlkJztcbmltcG9ydCAqIGFzIEggZnJvbSAnLi9oeXBlcmJvbGljJztcbmltcG9ydCB7IFBvaW50IH0gZnJvbSAnLi9wb2ludCc7XG5pbXBvcnQge1xuICBEaXNrXG59XG5mcm9tICcuL2Rpc2snO1xuXG5cbi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICogICAgVEVTU0VMQVRJT04gQ0xBU1Ncbi8vICogICAgQ3JlYXRlcyBhIHJlZ3VsYXIgVGVzc2VsYXRpb24gb2YgdGhlIFBvaW5jYXJlIERpc2tcbi8vICogICAgcTogbnVtYmVyIG9mIHAtZ29ucyBtZWV0aW5nIGF0IGVhY2ggdmVydGV4XG4vLyAqICAgIHA6IG51bWJlciBvZiBzaWRlcyBvZiBwLWdvblxuLy8gKiAgICB1c2luZyB0aGUgdGVjaG5pcXVlcyBjcmVhdGVkIGJ5IENveGV0ZXIgYW5kIER1bmhhbVxuLy8gKlxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuZXhwb3J0IGNsYXNzIFJlZ3VsYXJUZXNzZWxhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHAsIHEsIHJvdGF0aW9uLCBjb2xvdXIsIG1heExheWVycykge1xuICAgIGNvbnNvbGUubG9nKHAscSk7XG4gICAgdGhpcy5kaXNrID0gbmV3IERpc2soKTtcblxuICAgIHRoaXMuY2VudHJlID0gbmV3IFBvaW50KDAsMCk7XG5cbiAgICB0aGlzLnAgPSBwO1xuICAgIHRoaXMucSA9IHE7XG4gICAgdGhpcy5jb2xvdXIgPSBjb2xvdXIgfHwgJ2JsYWNrJztcbiAgICB0aGlzLnJvdGF0aW9uID0gcm90YXRpb24gfHwgMDtcbiAgICB0aGlzLm1heExheWVycyA9IG1heExheWVycyB8fCA1O1xuXG4gICAgaWYgKHRoaXMuY2hlY2tQYXJhbXMoKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGV2ZW50KSA9PiB7XG4gICAgICAvL3dpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJyk7XG4gICAgICB0aGlzLmluaXQoKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgdGhpcy5pbml0KCk7XG4gICAgfSwgZmFsc2UpO1xuXG5cblxuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLnJhZGl1cyA9IHRoaXMuZGlzay5nZXRSYWRpdXMoKTtcbiAgICB0aGlzLmZyID0gdGhpcy5mdW5kYW1lbnRhbFJlZ2lvbigpO1xuICAgIHRoaXMudGVzdGluZygpO1xuICB9XG5cbiAgdGVzdGluZygpIHtcbiAgICBsZXQgd2lyZWZyYW1lID0gZmFsc2U7XG4gICAgd2lyZWZyYW1lID0gdHJ1ZTtcblxuXG4gICAgLy90aGlzLmRpc2sucG9seWdvbih0aGlzLmZyLCBFLnJhbmRvbUludCgxMDAwMCwgMTQ3NzcyMTUpLCAnJywgd2lyZWZyYW1lKTtcbiAgICBjb25zdCBwb2x5MiA9IEgucmVmbGVjdCh0aGlzLmZyLCB0aGlzLmZyWzFdLCB0aGlzLmZyWzJdLCB0aGlzLmRpc2suY2lyY2xlKTtcbiAgICAvL3RoaXMuZGlzay5wb2x5Z29uKHBvbHkyLCBFLnJhbmRvbUludCgxMDAwMCwgMTQ3NzcyMTUpKTtcblxuICAgIGNvbnN0IHBvbHkzID0gSC5yZWZsZWN0KHBvbHkyLCBwb2x5MlswXSwgcG9seTJbMV0sIHRoaXMuZGlzay5jaXJjbGUpO1xuICAgIC8vdGhpcy5kaXNrLnBvbHlnb24ocG9seTMsIEUucmFuZG9tSW50KDEwMDAwLCAxNDc3NzIxNSksICcnLCB3aXJlZnJhbWUpO1xuXG4gICAgY29uc3QgcG9seTQgPSBILnJlZmxlY3QocG9seTMsIHBvbHkzWzJdLCBwb2x5M1swXSwgdGhpcy5kaXNrLmNpcmNsZSk7XG4gICAgLy90aGlzLmRpc2sucG9seWdvbihwb2x5NCwgRS5yYW5kb21JbnQoMTAwMDAsIDE0Nzc3MjE1KSwgJycsIHdpcmVmcmFtZSk7XG5cbiAgICBjb25zdCBwb2x5NSA9IEgucmVmbGVjdChwb2x5NCwgcG9seTRbMV0sIHBvbHk0WzBdLCB0aGlzLmRpc2suY2lyY2xlKTtcbiAgICAvL3RoaXMuZGlzay5wb2x5Z29uKHBvbHk1LCBFLnJhbmRvbUludCgxMDAwMCwgMTQ3NzcyMTUpLCAnJywgd2lyZWZyYW1lKTtcblxuICAgIGNvbnN0IHBvbHk2ID0gSC5yZWZsZWN0KHBvbHkzLCBwb2x5M1syXSwgcG9seTNbMV0sIHRoaXMuZGlzay5jaXJjbGUpO1xuICAgIC8vdGhpcy5kaXNrLnBvbHlnb24ocG9seTYsIEUucmFuZG9tSW50KDEwMDAwLCAxNDc3NzIxNSksICcnLCB3aXJlZnJhbWUpO1xuXG4gICAgY29uc3QgcG9seTcgPSBILnJlZmxlY3QocG9seTYsIHBvbHk2WzBdLCBwb2x5NlsyXSwgdGhpcy5kaXNrLmNpcmNsZSk7XG4gICAgLy90aGlzLmRpc2sucG9seWdvbihwb2x5NywgRS5yYW5kb21JbnQoMTAwMDAsIDE0Nzc3MjE1KSwgJycsIHdpcmVmcmFtZSk7XG5cbiAgICBjb25zdCBwb2x5OCA9IEgucmVmbGVjdChwb2x5NiwgcG9seTZbMF0sIHBvbHk2WzFdLCB0aGlzLmRpc2suY2lyY2xlKTtcbiAgICAvL3RoaXMuZGlzay5wb2x5Z29uKHBvbHk4LCBFLnJhbmRvbUludCgxMDAwMCwgMTQ3NzcyMTUpLCAnJywgd2lyZWZyYW1lKTtcblxuICAgIGNvbnN0IHBvbHk5ID0gSC5yZWZsZWN0KHBvbHk3LCBwb2x5N1swXSwgcG9seTdbMV0sIHRoaXMuZGlzay5jaXJjbGUpO1xuICAgIHRoaXMuZGlzay5wb2x5Z29uKHBvbHk5LCBFLnJhbmRvbUludCgxMDAwMCwgMTQ3NzcyMTUpLCAnJywgd2lyZWZyYW1lKTtcblxuXG4gICAgY29uc3QgYyA9IHtcbiAgICAgIGNlbnRyZTogdGhpcy5jZW50cmUsXG4gICAgICByYWRpdXM6IHRoaXMucmFkaXVzXG4gICAgfTtcblxuICAgIGxldCBudW0gPSB0aGlzLnAqMjtcbiAgICBmb3IobGV0IGkgPTA7IGkgPCBudW07IGkrKyl7XG4gICAgICBsZXQgcG9seSA9IEgucm90YXRlUGdvbkFib3V0T3JpZ2luKHRoaXMuZnIsICgyKk1hdGguUEkvbnVtKSooaSsxKSk7XG4gICAgICB0aGlzLmRpc2sucG9seWdvbihwb2x5LCBFLnJhbmRvbUludCgxMDAwMCwgMTQ3NzcyMTUpLCAnJywgd2lyZWZyYW1lKTtcbiAgICAgIHBvbHkgPSBILnJvdGF0ZVBnb25BYm91dE9yaWdpbihwb2x5MiwgKDIqTWF0aC5QSS9udW0pKihpKzEpKTtcbiAgICAgIHRoaXMuZGlzay5wb2x5Z29uKHBvbHksIEUucmFuZG9tSW50KDEwMDAwLCAxNDc3NzIxNSksICcnLCB3aXJlZnJhbWUpO1xuICAgICAgcG9seSA9IEgucm90YXRlUGdvbkFib3V0T3JpZ2luKHBvbHkzLCAoMipNYXRoLlBJL251bSkqKGkrMSkpO1xuICAgICAgdGhpcy5kaXNrLnBvbHlnb24ocG9seSwgRS5yYW5kb21JbnQoMTAwMDAsIDE0Nzc3MjE1KSwgJycsIHdpcmVmcmFtZSk7XG4gICAgICBwb2x5ID0gSC5yb3RhdGVQZ29uQWJvdXRPcmlnaW4ocG9seTQsICgyKk1hdGguUEkvbnVtKSooaSsxKSk7XG4gICAgICB0aGlzLmRpc2sucG9seWdvbihwb2x5LCBFLnJhbmRvbUludCgxMDAwMCwgMTQ3NzcyMTUpLCAnJywgd2lyZWZyYW1lKTtcbiAgICAgIHBvbHkgPSBILnJvdGF0ZVBnb25BYm91dE9yaWdpbihwb2x5NSwgKDIqTWF0aC5QSS9udW0pKihpKzEpKTtcbiAgICAgIHRoaXMuZGlzay5wb2x5Z29uKHBvbHksIEUucmFuZG9tSW50KDEwMDAwLCAxNDc3NzIxNSksICcnLCB3aXJlZnJhbWUpO1xuICAgICAgcG9seSA9IEgucm90YXRlUGdvbkFib3V0T3JpZ2luKHBvbHk2LCAoMipNYXRoLlBJL251bSkqKGkrMSkpO1xuICAgICAgdGhpcy5kaXNrLnBvbHlnb24ocG9seSwgRS5yYW5kb21JbnQoMTAwMDAsIDE0Nzc3MjE1KSwgJycsIHdpcmVmcmFtZSk7XG4gICAgICBwb2x5ID0gSC5yb3RhdGVQZ29uQWJvdXRPcmlnaW4ocG9seTcsICgyKk1hdGguUEkvbnVtKSooaSsxKSk7XG4gICAgICB0aGlzLmRpc2sucG9seWdvbihwb2x5LCBFLnJhbmRvbUludCgxMDAwMCwgMTQ3NzcyMTUpLCAnJywgd2lyZWZyYW1lKTtcbiAgICAgIHBvbHkgPSBILnJvdGF0ZVBnb25BYm91dE9yaWdpbihwb2x5OCwgKDIqTWF0aC5QSS9udW0pKihpKzEpKTtcbiAgICAgIHRoaXMuZGlzay5wb2x5Z29uKHBvbHksIEUucmFuZG9tSW50KDEwMDAwLCAxNDc3NzIxNSksICcnLCB3aXJlZnJhbWUpO1xuICAgICAgcG9seSA9IEgucm90YXRlUGdvbkFib3V0T3JpZ2luKHBvbHk5LCAoMipNYXRoLlBJL251bSkqKGkrMSkpO1xuICAgICAgdGhpcy5kaXNrLnBvbHlnb24ocG9seSwgRS5yYW5kb21JbnQoMTAwMDAsIDE0Nzc3MjE1KSwgJycsIHdpcmVmcmFtZSk7XG4gICAgfVxuICB9XG5cbiAgLy9jYWxjdWxhdGUgZmlyc3QgcG9pbnQgb2YgZnVuZGFtZW50YWwgcG9seWdvbiB1c2luZyBDb3hldGVyJ3MgbWV0aG9kXG4gIGZ1bmRhbWVudGFsUmVnaW9uKCkge1xuICAgIGNvbnN0IHMgPSBNYXRoLnNpbihNYXRoLlBJIC8gdGhpcy5wKTtcbiAgICBjb25zdCB0ID0gTWF0aC5jb3MoTWF0aC5QSSAvIHRoaXMucSk7XG4gICAgLy9tdWx0aXBseSB0aGVzZSBieSB0aGUgZGlza3MgcmFkaXVzIChDb3hldGVyIHVzZWQgdW5pdCBkaXNrKTtcbiAgICBjb25zdCByID0gMSAvIE1hdGguc3FydCgodCAqIHQpIC8gKHMgKiBzKSAtIDEpICogdGhpcy5yYWRpdXM7XG4gICAgY29uc3QgZCA9IDEgLyBNYXRoLnNxcnQoMSAtIChzICogcykgLyAodCAqIHQpKSAqIHRoaXMucmFkaXVzO1xuICAgIGNvbnN0IGIgPSBuZXcgUG9pbnQodGhpcy5yYWRpdXMgKiBNYXRoLmNvcyhNYXRoLlBJIC8gdGhpcy5wKSxcbiAgICAtdGhpcy5yYWRpdXMgKiBNYXRoLnNpbihNYXRoLlBJIC8gdGhpcy5wKSk7XG5cbiAgICBjb25zdCBjZW50cmUgPSBuZXcgUG9pbnQoZCwwKTtcblxuICAgIC8vdGhlcmUgd2lsbCBiZSB0d28gcG9pbnRzIG9mIGludGVyc2VjdGlvbiwgb2Ygd2hpY2ggd2Ugd2FudCB0aGUgZmlyc3RcbiAgICBjb25zdCBwMSA9IEUuY2lyY2xlTGluZUludGVyc2VjdChjZW50cmUsIHIsIHRoaXMuZGlzay5jZW50cmUsIGIpLnAxO1xuXG4gICAgY29uc3QgcDIgPSBuZXcgUG9pbnQoZC1yLDApO1xuXG4gICAgY29uc3QgcG9pbnRzID0gW3RoaXMuZGlzay5jZW50cmUsIHAxLCBwMl07XG5cbiAgICByZXR1cm4gcG9pbnRzO1xuICB9XG5cbiAgLy9UaGUgdGVzc2VsYXRpb24gcmVxdWlyZXMgdGhhdCAocC0yKShxLTIpID4gNCB0byB3b3JrIChvdGhlcndpc2UgaXQgaXNcbiAgLy8gZWl0aGVyIGFuIGVsbGlwdGljYWwgb3IgZXVjbGlkZWFuIHRlc3NlbGF0aW9uKTtcbiAgLy9Gb3Igbm93IGFsc28gcmVxdWlyZSBwLHEgPiAzLCBhcyB0aGVzZSBhcmUgc3BlY2lhbCBjYXNlc1xuICBjaGVja1BhcmFtcygpIHtcbiAgICBpZiAodGhpcy5tYXhMYXllcnMgPCAwIHx8IGlzTmFOKHRoaXMubWF4TGF5ZXJzKSkge1xuICAgICAgY29uc29sZS5lcnJvcignbWF4TGF5ZXJzIG11c3QgYmUgZ3JlYXRlciB0aGFuIDAnKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAoKHRoaXMucCAtIDIpICogKHRoaXMucSAtIDIpIDw9IDQpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0h5cGVyYm9saWMgdGVzc2VsYXRpb25zIHJlcXVpcmUgdGhhdCAocC0xKShxLTIpIDwgNCEnKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvL1RPRE8gaW1wbGVtZW50IHNwZWNpYWwgY2FzZXMgZm9yIHEgPSAzIG9yIHAgPSAzXG4gICAgZWxzZSBpZiAodGhpcy5xIDw9IDMgfHwgaXNOYU4odGhpcy5xKSkge1xuICAgICAgY29uc29sZS5lcnJvcignVGVzc2VsYXRpb24gZXJyb3I6IGF0IGxlYXN0IDMgcC1nb25zIG11c3QgbWVldCBcXFxuICAgICAgICAgICAgICAgICAgICBhdCBlYWNoIHZlcnRleCEnKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wIDw9IDMgfHwgaXNOYU4odGhpcy5wKSkge1xuICAgICAgY29uc29sZS5lcnJvcignVGVzc2VsYXRpb24gZXJyb3I6IHBvbHlnb24gbmVlZHMgYXQgbGVhc3QgMyBzaWRlcyEnKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG59XG4iLCIvL05PVEUgd2lsbCBnaXZlIGEgd2FybmluZzogIFRvbyBtYW55IGFjdGl2ZSBXZWJHTCBjb250ZXh0c1xuLy9hZnRlciByZXNpemluZyAxNiB0aW1lcy4gVGhpcyBpcyBhIGJ1ZyBpbiB0aHJlZWpzIGFuZCBjYW4gYmUgc2FmZWx5IGlnbm9yZWQuXG4vLyAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyAqXG4vLyAqICBUSFJFRSBKUyBDTEFTU1xuLy8gKlxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuZXhwb3J0IGNsYXNzIFRocmVlSlMge1xuICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGV2ZW50KSA9PiB7XG4gICAgICAvL3dpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJyk7XG4gICAgICB0aGlzLmluaXQoKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgdGhpcy5yZXNldCgpO1xuICAgIH0sIGZhbHNlKTtcblxuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG4gICAgdGhpcy5pbml0Q2FtZXJhKCk7XG5cbiAgICB0aGlzLmluaXRMaWdodGluZygpO1xuXG4gICAgdGhpcy5heGVzKCk7XG5cbiAgICB0aGlzLmluaXRSZW5kZXJlcigpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5pZCk7IC8vIFN0b3AgdGhlIGFuaW1hdGlvblxuICAgIHRoaXMuc2NlbmUgPSBudWxsO1xuICAgIHRoaXMucHJvamVjdG9yID0gbnVsbDtcbiAgICB0aGlzLmNhbWVyYSA9IG51bGw7XG4gICAgdGhpcy5jb250cm9scyA9IG51bGw7XG5cbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2NhbnZhcycpO1xuICAgIGZvciAobGV0IGluZGV4ID0gZWxlbWVudC5sZW5ndGggLSAxOyBpbmRleCA+PSAwOyBpbmRleC0tKSB7XG4gICAgICBlbGVtZW50W2luZGV4XS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnRbaW5kZXhdKTtcbiAgICB9XG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBpbml0Q2FtZXJhKCkge1xuICAgIHRoaXMuY2FtZXJhID0gbmV3IFRIUkVFLk9ydGhvZ3JhcGhpY0NhbWVyYSh3aW5kb3cuaW5uZXJXaWR0aCAvIC0yLFxuICAgICAgd2luZG93LmlubmVyV2lkdGggLyAyLCB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyLCB3aW5kb3cuaW5uZXJIZWlnaHQgLyAtMiwgLTIsIDEpO1xuICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMuY2FtZXJhKTtcbiAgICB0aGlzLmNhbWVyYS5wb3NpdGlvbi54ID0gMDtcbiAgICB0aGlzLmNhbWVyYS5wb3NpdGlvbi55ID0gMDtcblxuICAgIHRoaXMuY2FtZXJhLnBvc2l0aW9uLnogPSAxO1xuICB9XG5cbiAgaW5pdExpZ2h0aW5nKCkge1xuICAgIC8vY29uc3Qgc3BvdExpZ2h0ID0gbmV3IFRIUkVFLlNwb3RMaWdodCgweGZmZmZmZik7XG4gICAgLy9zcG90TGlnaHQucG9zaXRpb24uc2V0KDAsIDAsIDEwMCk7XG4gICAgLy90aGlzLnNjZW5lLmFkZChzcG90TGlnaHQpO1xuICAgIGNvbnN0IGFtYmllbnRMaWdodCA9IG5ldyBUSFJFRS5BbWJpZW50TGlnaHQoMHhmZmZmZmYpO1xuICAgIHRoaXMuc2NlbmUuYWRkKGFtYmllbnRMaWdodCk7XG4gIH1cblxuICBpbml0UmVuZGVyZXIoKSB7XG4gICAgdGhpcy5yZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHtcbiAgICAgIGFudGlhbGlhczogdHJ1ZSxcbiAgICB9KTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldENsZWFyQ29sb3IoMHhmZmZmZmYsIDEuMCk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5yZW5kZXJlci5kb21FbGVtZW50KTtcblxuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICAvL2JlaGluZDogdHJ1ZS9mYWxzZVxuICBkaXNrKGNlbnRyZSwgcmFkaXVzLCBjb2xvciwgYmVoaW5kKSB7XG4gICAgaWYgKGNvbG9yID09PSB1bmRlZmluZWQpIGNvbG9yID0gMHhmZmZmZmY7XG5cbiAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5DaXJjbGVHZW9tZXRyeShyYWRpdXMsIDEwMCwgMCwgMiAqIE1hdGguUEkpO1xuICAgIGNvbnN0IGNpcmNsZSA9IHRoaXMuY3JlYXRlTWVzaChnZW9tZXRyeSwgY29sb3IpO1xuICAgIGNpcmNsZS5wb3NpdGlvbi54ID0gY2VudHJlLng7XG4gICAgY2lyY2xlLnBvc2l0aW9uLnkgPSBjZW50cmUueTtcbiAgICBpZiAoIWJlaGluZCkge1xuICAgICAgY2lyY2xlLnBvc2l0aW9uLnogPSAxO1xuICAgIH1cblxuICAgIHRoaXMuc2NlbmUuYWRkKGNpcmNsZSk7XG4gIH1cblxuICBzZWdtZW50KGNpcmNsZSwgYWxwaGEsIG9mZnNldCwgY29sb3IpIHtcbiAgICBpZiAoY29sb3IgPT09IHVuZGVmaW5lZCkgY29sb3IgPSAweGZmZmZmZjtcblxuICAgIGNvbnN0IGN1cnZlID0gbmV3IFRIUkVFLkVsbGlwc2VDdXJ2ZShcbiAgICAgIGNpcmNsZS5jZW50cmUueCwgY2lyY2xlLmNlbnRyZS55LCAvLyBheCwgYVlcbiAgICAgIGNpcmNsZS5yYWRpdXMsIGNpcmNsZS5yYWRpdXMsIC8vIHhSYWRpdXMsIHlSYWRpdXNcbiAgICAgIGFscGhhLCBvZmZzZXQsIC8vIGFTdGFydEFuZ2xlLCBhRW5kQW5nbGVcbiAgICAgIGZhbHNlIC8vIGFDbG9ja3dpc2VcbiAgICApO1xuXG4gICAgY29uc3QgcG9pbnRzID0gY3VydmUuZ2V0U3BhY2VkUG9pbnRzKDEwMCk7XG5cbiAgICBjb25zdCBwYXRoID0gbmV3IFRIUkVFLlBhdGgoKTtcbiAgICBjb25zdCBnZW9tZXRyeSA9IHBhdGguY3JlYXRlR2VvbWV0cnkocG9pbnRzKTtcblxuICAgIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKHtcbiAgICAgIGNvbG9yOiBjb2xvclxuICAgIH0pO1xuICAgIGNvbnN0IHMgPSBuZXcgVEhSRUUuTGluZShnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXG4gICAgdGhpcy5zY2VuZS5hZGQocyk7XG4gIH1cblxuICBsaW5lKHN0YXJ0LCBlbmQsIGNvbG9yKSB7XG4gICAgaWYgKGNvbG9yID09PSB1bmRlZmluZWQpIGNvbG9yID0gMHhmZmZmZmY7XG5cbiAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5HZW9tZXRyeSgpO1xuXG4gICAgZ2VvbWV0cnkudmVydGljZXMucHVzaChcbiAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKHN0YXJ0LngsIHN0YXJ0LnksIDApLFxuICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoZW5kLngsIGVuZC55LCAwKVxuICAgICk7XG4gICAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoe1xuICAgICAgY29sb3I6IGNvbG9yXG4gICAgfSk7XG4gICAgY29uc3QgbCA9IG5ldyBUSFJFRS5MaW5lKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgdGhpcy5zY2VuZS5hZGQobCk7XG4gIH1cblxuICBwb2x5Z29uKHZlcnRpY2VzLCBjb2xvciwgdGV4dHVyZSwgd2lyZWZyYW1lKSB7XG4gICAgaWYgKGNvbG9yID09PSB1bmRlZmluZWQpIGNvbG9yID0gMHhmZmZmZmY7XG5cbiAgICBjb25zdCBwb2x5ID0gbmV3IFRIUkVFLlNoYXBlKCk7XG4gICAgcG9seS5tb3ZlVG8odmVydGljZXNbMF0ueCwgdmVydGljZXNbMF0ueSk7XG5cbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IHZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBwb2x5LmxpbmVUbyh2ZXJ0aWNlc1tpXS54LCB2ZXJ0aWNlc1tpXS55KVxuICAgIH1cblxuICAgIHBvbHkubGluZVRvKHZlcnRpY2VzWzBdLngsIHZlcnRpY2VzWzBdLnkpO1xuXG4gICAgY29uc3QgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuU2hhcGVHZW9tZXRyeShwb2x5KTtcblxuICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMuY3JlYXRlTWVzaChnZW9tZXRyeSwgY29sb3IsIHRleHR1cmUsIHdpcmVmcmFtZSkpO1xuICB9XG5cbiAgY3JlYXRlTWVzaChnZW9tZXRyeSwgY29sb3IsIGltYWdlVVJMLCB3aXJlZnJhbWUpIHtcbiAgICBpZih3aXJlZnJhbWUgPT09IHVuZGVmaW5lZCkgd2lyZWZyYW1lID0gZmFsc2U7XG4gICAgaWYgKGNvbG9yID09PSB1bmRlZmluZWQpIGNvbG9yID0gMHhmZmZmZmY7XG5cbiAgICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XG4gICAgICBjb2xvcjogY29sb3IsXG4gICAgICB3aXJlZnJhbWU6IHdpcmVmcmFtZVxuICAgIH0pO1xuXG4gICAgaWYgKGltYWdlVVJMKSB7XG4gICAgICBjb25zdCB0ZXh0dXJlTG9hZGVyID0gbmV3IFRIUkVFLlRleHR1cmVMb2FkZXIoKTtcblxuICAgICAgLy9sb2FkIHRleHR1cmUgYW5kIGFwcGx5IHRvIG1hdGVyaWFsIGluIGNhbGxiYWNrXG4gICAgICBjb25zdCB0ZXh0dXJlID0gdGV4dHVyZUxvYWRlci5sb2FkKGltYWdlVVJMLCAodGV4KSA9PiB7fSk7XG4gICAgICB0ZXh0dXJlLnJlcGVhdC5zZXQoMC4wNSwgMC4wNSk7XG4gICAgICBtYXRlcmlhbC5tYXAgPSB0ZXh0dXJlO1xuICAgICAgbWF0ZXJpYWwubWFwLndyYXBUID0gVEhSRUUuUmVwZWF0V3JhcHBpbmc7XG4gICAgICBtYXRlcmlhbC5tYXAud3JhcFMgPSBUSFJFRS5SZXBlYXRXcmFwcGluZztcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgfVxuXG4gIGF4ZXMoKSB7XG4gICAgY29uc3QgeHl6ID0gbmV3IFRIUkVFLkF4aXNIZWxwZXIoMjApO1xuICAgIHRoaXMuc2NlbmUuYWRkKHh5eik7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHRoaXMucmVuZGVyKClcbiAgICB9KTtcblxuICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUsIHRoaXMuY2FtZXJhKTtcbiAgfVxuXG59XG4iXX0=
