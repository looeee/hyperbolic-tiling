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
      window.removeEventListener('load');
      _this.init();
    }, false);

    window.addEventListener('resize', function () {
      _this.init();
    }, false);
  }

  _createClass(Disk, [{
    key: 'init',
    value: function init() {
      this.centre = {
        x: 0,
        y: 0
      };

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
    value: function testing() {
      var p1 = {
        x: 100,
        y: 250
      };
      var p2 = {
        x: -150,
        y: 150
      };
      var p3 = {
        x: -70,
        y: -250
      };

      var p4 = {
        x: -170,
        y: -150
      };

      var p5 = {
        x: 170,
        y: -150
      };
      this.point(p1, 5, 0xf00f0f);
      this.point(p2, 5, 0xffff0f);
      this.point(p3, 5, 0x1d00d5);
      this.point(p4, 5, 0x00ff0f);
      this.point(p5, 5, 0x359543);

      /*
      const a = H.arc(p1, p2);
       this.draw.disk(a.circle.centre, a.circle.radius, 0xffffff, false);
       const p4 = E.nextPoint(a.circle, p2, 20).p1;
      console.log(p4);
         //this.drawArc(p2, p3, 0xf00f0f);
      */
      //this.polygonOutline([p1, p2, p3],0xf00f0f)
      this.polygon([p1, p2, p4, p3, p5], 0x70069a);
      //this.polygon([p2, p3, p4]);
    }
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

      if (a.straightLine) {
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
    value: function polygon(vertices, color, texture) {
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

      var wireframe = false;
      //TESTING
      wireframe = true;
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

},{"./euclid":2,"./hyperbolic":3,"./threejs":6}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// * ***********************************************************************
// *
// *   EUCLIDEAN FUNCTIONS
// *   a place to stash all the functions that are euclidean geometrical
// *   operations
// *
// *************************************************************************

//distance between two points
var distance = exports.distance = function distance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

//midpoint of the line segment connecting two points
var midpoint = exports.midpoint = function midpoint(p1, p2) {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  };
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

  return {
    x: x,
    y: y
  };
};

var radians = exports.radians = function radians(degrees) {
  return Math.PI / 180 * degrees;
};

//get the circle inverse of a point p with respect a circle radius r centre c
var inverse = exports.inverse = function inverse(p, r, c) {
  var alpha = r * r / (Math.pow(p.x - c.x, 2) + Math.pow(p.y - c.y, 2));
  return {
    x: alpha * (p.x - c.x) + c.x,
    y: alpha * (p.y - c.y) + c.y
  };
};

//reflect p3 across the line defined by p1,p2
var lineReflection = exports.lineReflection = function lineReflection(p1, p2, p3) {
  var m = slope(p1, p2);
  if (m === Infinity) {
    console.error('Reflection over x axis not implemented');
  }
  var c = p1.y - m * p1.x;
  var d = (p3.x + (p3.y - c) * m) / (1 + m * m);
  var x = 2 * d - p3.x;
  var y = 2 * d * m - p3.y + 2 * c;

  return { x: x, y: y };
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

  var p1 = {
    x: x1,
    y: y1
  };

  var p2 = {
    x: x2,
    y: y2
  };

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
  var p = {
    x: t * dx + p1.x,
    y: t * dy + p1.y
  };

  //distance from this point to centre
  var d2 = distance(p, c);

  //line intersects circle
  if (d2 < r) {
    var dt = Math.sqrt(r * r - d2 * d2);
    //point 1
    var q1 = {
      x: (t - dt) * dx + p1.x,
      y: (t - dt) * dy + p1.y
    };
    //point 2
    var q2 = {
      x: (t + dt) * dx + p1.x,
      y: (t + dt) * dy + p1.y
    };

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
  return 2 * Math.asin(0.5 * distance(p1, p2) / r);
};

//calculate the normal vector given 2 points
var normalVector = exports.normalVector = function normalVector(p1, p2) {
  var d = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  return {
    x: (p2.x - p1.x) / d,
    y: (p2.y - p1.y) / d
  };
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
  return {
    x: x / f,
    y: y / f
  };
};

//compare two points taking rounding errors into account
var comparePoints = exports.comparePoints = function comparePoints(p1, p2) {
  if (typeof p1 === 'undefined' || typeof p2 === 'undefined') {
    return true;
  }
  p1 = pointToFixed(p1, 6);
  p2 = pointToFixed(p2, 6);
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

  var p1 = {
    x: xPos,
    y: yPos
  };
  var p2 = {
    x: xNeg,
    y: yNeg
  };
  return {
    p1: p1,
    p2: p2
  };
};

var randomFloat = exports.randomFloat = function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
};

var randomInt = exports.randomInt = function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inverseTranslatePoincare = exports.translatePoincare = exports.rotatePgonAboutOrigin = exports.rotateAboutOriginPoincare = exports.rotateAboutOriginWeierstrass = exports.weierstrassToPoincare = exports.poincareToWeierstrass = exports.reflect = exports.rotation = exports.translateX = exports.arc = undefined;

var _euclid = require('./euclid');

var E = _interopRequireWildcard(_euclid);

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
  var p3 = {
    x: ox + c.radius,
    y: oy
  };

  //calculate the position of each point in the circle
  alpha1 = E.centralAngle(p3, p1, c.radius);
  alpha1 = p1.y < oy ? 2 * Math.PI - alpha1 : alpha1;
  alpha2 = E.centralAngle(p3, p2, c.radius);
  alpha2 = p2.y < oy ? 2 * Math.PI - alpha2 : alpha2;

  //case where p1 above and p2 below the line c.centre -> p3
  if (p1.x > ox && p2.x > ox && p1.y < oy && p2.y > oy) {
    startAngle = alpha1;
    endAngle = alpha2;
  }
  //case where p2 above and p1 below the line c.centre -> p3
  else if (p1.x > ox && p2.x > ox && p1.y > oy && p2.y < oy) {
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
    newPoints.push({
      x: x,
      y: y
    });
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
      //console.error('reflection across straight line not implemented! ')
      newPoints.push(E.lineReflection(p1, p2, pointsArray[i]));
    }
  }
  console.log(newPoints);
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
  return {
    x: factor * point3D.x,
    y: factor * point3D.y
  };
};

var rotateAboutOriginWeierstrass = exports.rotateAboutOriginWeierstrass = function rotateAboutOriginWeierstrass(point3D, angle) {
  return {
    x: Math.cos(angle) * point3D.x - Math.sin(angle) * point3D.y,
    y: Math.sin(angle) * point3D.x + Math.cos(angle) * point3D.y,
    z: point3D.z
  };
};

var rotateAboutOriginPoincare = exports.rotateAboutOriginPoincare = function rotateAboutOriginPoincare(point2D, angle) {
  return {
    x: Math.cos(angle) * point2D.x - Math.sin(angle) * point2D.y,
    y: Math.sin(angle) * point2D.x + Math.cos(angle) * point2D.y
  };
};

var rotatePgonAboutOrigin = exports.rotatePgonAboutOrigin = function rotatePgonAboutOrigin(points2DArray, angle) {
  var l = points2DArray.length;
  var rotatedPoints2DArray = [];
  for (var i = 0; i < l; i++) {
    var point = rotateAboutOriginPoincare(points2DArray[i], angle);
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

  return {
    x: x,
    y: y
  };
};

var inverseTranslatePoincare = exports.inverseTranslatePoincare = function inverseTranslatePoincare(p1, p2) {};

},{"./euclid":2}],4:[function(require,module,exports){
'use strict';

var _regularTesselation = require('./regularTesselation');

var _euclid = require('./euclid');

var E = _interopRequireWildcard(_euclid);

var _disk = require('./disk');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// * ***********************************************************************
// *
// *   SETUP
// *
// *************************************************************************

//const disk = new Disk();

var tesselation = new _regularTesselation.RegularTesselation(4, 5, 0, 'red');

},{"./disk":1,"./euclid":2,"./regularTesselation":5}],5:[function(require,module,exports){
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

    this.disk = new _disk.Disk();

    this.centre = {
      x: 0,
      y: 0
    };
    this.p = p;
    this.q = q;
    this.colour = colour || 'black';
    this.rotation = rotation || 0;
    this.maxLayers = maxLayers || 5;

    if (this.checkParams()) {
      return false;
    }

    window.addEventListener('load', function (event) {
      window.removeEventListener('load');
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

      this.disk.polygon(this.fr, 0xe80348);
      var poly2 = H.reflect(this.fr, this.fr[0], this.fr[1], this.disk.circle);
      //console.table(poly2);
      this.disk.polygon(poly2, 0xc3167e);

      var poly3 = H.reflect(poly2, poly2[0], poly2[2], this.disk.circle);
      this.disk.polygon(poly3, 0xd2be11);

      var num = 8;
      for (var i = 0; i < num; i++) {
        //let poly = H.rotatePgonAboutOrigin(poly2, (2*Math.PI/num)*(i+1));
        //this.disk.polygon(poly, E.randomInt(1000, 14777215));
        //poly = H.rotatePgonAboutOrigin(this.fr, (2*Math.PI/num)*(i+1));
        //this.disk.polygon(poly, E.randomInt(1000, 14777215));
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
      var b = {
        x: this.radius * Math.cos(Math.PI / this.p),
        y: -this.radius * Math.sin(Math.PI / this.p)
      };
      var centre = {
        x: d,
        y: 0
      };
      //there will be two points of intersection, of which we want the first
      var p1 = E.circleLineIntersect(centre, r, this.disk.centre, b).p1;

      var p2 = {
        x: d - r,
        y: 0
      };

      var points = [this.disk.centre, p1, p2];

      return points;
    }

    //The tesselation requires that (p-2)(q-2) > 4 to work (otherwise it is
    // either an elliptical or euclidean tesselation);

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
      //For now require p,q > 3,
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

},{"./disk":1,"./euclid":2,"./hyperbolic":3}],6:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
      window.removeEventListener('load');
      _this.init();
    }, false);

    window.addEventListener('resize', function () {
      //this.camera.aspect = window.innerWidth / window.innerHeight;
      //this.camera.updateProjectionMatrix();
      //this.renderer.setSize(window.innerWidth, window.innerHeight);

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
      this.renderer.domElement.addEventListener('dblclick', null, false); //remove listener to render
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJlczIwMTUvZGlzay5qcyIsImVzMjAxNS9ldWNsaWQuanMiLCJlczIwMTUvaHlwZXJib2xpYy5qcyIsImVzMjAxNS9tYWluLmpzIiwiZXMyMDE1L3JlZ3VsYXJUZXNzZWxhdGlvbi5qcyIsImVzMjAxNS90aHJlZWpzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7SUNBWSxDQUFDOzs7O0lBQ0QsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztJQWNBLElBQUksV0FBSixJQUFJO0FBQ2YsV0FEVyxJQUFJLEdBQ0Q7OzswQkFESCxJQUFJOztBQUViLFFBQUksQ0FBQyxJQUFJLEdBQUcsYUFiZCxPQUFPLEVBYW9CLENBQUM7O0FBRTFCLFVBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDekMsWUFBTSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ25DLFlBQUssSUFBSSxFQUFFLENBQUM7S0FDYixFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUVWLFVBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsWUFBTTtBQUN0QyxZQUFLLElBQUksRUFBRSxDQUFDO0tBQ2IsRUFBRSxLQUFLLENBQUMsQ0FBQztHQUVYOztlQWJVLElBQUk7OzJCQWVSO0FBQ0wsVUFBSSxDQUFDLE1BQU0sR0FBRztBQUNaLFNBQUMsRUFBRSxDQUFDO0FBQ0osU0FBQyxFQUFFLENBQUM7T0FDTDs7O0FBQUEsQUFHRCxVQUFJLENBQUMsTUFBTSxHQUFHLEFBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsV0FBVyxHQUFJLEFBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLEdBQUksQ0FBQyxHQUFHLEFBQUMsTUFBTSxDQUFDLFdBQVcsR0FBRyxDQUFDLEdBQUksQ0FBQyxDQUFDOztBQUVwSCxVQUFJLENBQUMsTUFBTSxHQUFHO0FB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LENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLENBQUEsSUFBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQSxBQUFDLENBQUM7QUFDbkksTUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxDQUFBLElBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBQztBQUN2SSxNQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUMxQyxTQUFPO0FBQ0wsVUFBTSxFQUFFO0FBQ04sT0FBQyxFQUFFLENBQUM7QUFDSixPQUFDLEVBQUUsQ0FBQztLQUNMO0FBQ0QsVUFBTSxFQUFFLE1BQU07R0FDZixDQUFBO0NBQ0Y7Ozs7OztBQUFBLEFBTU0sSUFBTSxlQUFlLFdBQWYsZUFBZSxHQUFHLFNBQWxCLGVBQWUsQ0FBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUs7QUFDakQsTUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNiLE1BQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDYixNQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2IsTUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNiLE1BQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLElBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLElBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLENBQUMsQ0FBQzs7QUFFNUQsTUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFBLElBQUssSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUEsQUFBQyxJQUFJLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFBLEFBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFBLEFBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFcEcsTUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksQ0FBQyxHQUFHLEFBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLElBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFBLEFBQUMsSUFBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7QUFDakYsTUFBSSxFQUFFLEdBQUcsUUFBUSxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7QUFDdEQsTUFBSSxFQUFFLEdBQUcsUUFBUSxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7O0FBRXRELE1BQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxHQUFJLENBQUMsR0FBRyxBQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxJQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQSxBQUFDLElBQUssQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUEsQUFBQyxDQUFDO0FBQ2pGLE1BQUksRUFBRSxHQUFHLFFBQVEsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUEsQUFBQyxDQUFDO0FBQ3RELE1BQUksRUFBRSxHQUFHLFFBQVEsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUEsQUFBQyxDQUFDOztBQUV0RCxNQUFJLEVBQUUsR0FBRztBQUNQLEtBQUMsRUFBRSxFQUFFO0FBQ0wsS0FBQyxFQUFFLEVBQUU7R0FDTixDQUFBOztBQUVELE1BQUksRUFBRSxHQUFHO0FBQ1AsS0FBQyxFQUFFLEVBQUU7QUFDTCxLQUFDLEVBQUUsRUFBRTtHQUNOLENBQUE7O0FBRUQsU0FBTztBQUNMLE1BQUUsRUFBRSxFQUFFO0FBQ04sTUFBRSxFQUFFLEVBQUU7R0FDUCxDQUFDO0NBQ0gsQ0FBQTs7QUFFTSxJQUFNLG1CQUFtQixXQUFuQixtQkFBbUIsR0FBRyxTQUF0QixtQkFBbUIsQ0FBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUs7O0FBRW5ELE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDOztBQUFDLEFBRTNCLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFBLEdBQUksQ0FBQyxDQUFDO0FBQzdCLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFBLEdBQUksQ0FBQzs7O0FBQUMsQUFHN0IsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQSxBQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQSxBQUFDLENBQUM7QUFDaEQsTUFBTSxDQUFDLEdBQUc7QUFDUixLQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUNoQixLQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztHQUNqQjs7O0FBQUMsQUFHRixNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQzs7O0FBQUMsQUFHMUIsTUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFO0FBQ1YsUUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7O0FBQUMsQUFFdEMsUUFBTSxFQUFFLEdBQUc7QUFDVCxPQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFBLEdBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZCLE9BQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUEsR0FBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7S0FDeEI7O0FBQUEsQUFFRCxRQUFNLEVBQUUsR0FBRztBQUNULE9BQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUEsR0FBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDdkIsT0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQSxHQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztLQUN4QixDQUFBOztBQUVELFdBQU87QUFDTCxRQUFFLEVBQUUsRUFBRTtBQUNOLFFBQUUsRUFBRSxFQUFFO0tBQ1AsQ0FBQztHQUNILE1BQU0sSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFO0FBQ25CLFdBQU8sQ0FBQyxDQUFDO0dBQ1YsTUFBTTtBQUNMLFdBQU8sQ0FBQyxLQUFLLENBQUMsd0NBQXdDLENBQUMsQ0FBQztHQUN6RDtDQUNGOzs7QUFBQSxBQUdNLElBQU0sWUFBWSxXQUFaLFlBQVksR0FBRyxTQUFmLFlBQVksQ0FBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBSztBQUN6QyxTQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0NBQ2xEOzs7QUFBQSxBQUdNLElBQU0sWUFBWSxXQUFaLFlBQVksR0FBRyxTQUFmLFlBQVksQ0FBSSxFQUFFLEVBQUUsRUFBRSxFQUFLO0FBQ3RDLE1BQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2RSxTQUFPO0FBQ0wsS0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFBLEdBQUksQ0FBQztBQUNwQixLQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUEsR0FBSSxDQUFDO0dBQ3JCLENBQUE7Q0FDRjs7Ozs7QUFBQSxBQUtNLElBQU0sYUFBYSxXQUFiLGFBQWEsR0FBRyxTQUFoQixhQUFhLENBQUksRUFBRSxFQUFFLEVBQUUsRUFBSztBQUN2QyxNQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFOztBQUU1QixXQUFPLElBQUksQ0FBQztHQUNiO0FBQ0QsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUEsSUFBSyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUEsQUFBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRWpFLE1BQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxJQUFJLENBQUMsS0FDakMsT0FBTyxLQUFLLENBQUM7Q0FDbkI7OztBQUFBLEFBR00sSUFBTSxpQkFBaUIsV0FBakIsaUJBQWlCLEdBQUcsU0FBcEIsaUJBQWlCLENBQUksTUFBTSxFQUFLO0FBQzNDLE1BQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7TUFDbkIsSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ25DLE1BQUksS0FBSyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQy9ELE1BQUksU0FBUyxHQUFHLENBQUM7TUFDZixDQUFDLEdBQUcsQ0FBQztNQUNMLENBQUMsR0FBRyxDQUFDO01BQ0wsSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNO01BQ3BCLEVBQUUsWUFBQTtNQUFFLEVBQUUsWUFBQTtNQUFFLENBQUMsWUFBQSxDQUFDO0FBQ1osT0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUU7QUFDL0MsTUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNmLE1BQUUsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZixLQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM5QixhQUFTLElBQUksQ0FBQyxDQUFDO0FBQ2YsS0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFBLEdBQUksQ0FBQyxDQUFDO0FBQ3ZCLEtBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQSxHQUFJLENBQUMsQ0FBQztHQUN4QjtBQUNELEdBQUMsR0FBRyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLFNBQU87QUFDTCxLQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUM7QUFDUixLQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUM7R0FDVCxDQUFDO0NBQ0g7OztBQUFBLEFBR00sSUFBTSxhQUFhLFdBQWIsYUFBYSxHQUFHLFNBQWhCLGFBQWEsQ0FBSSxFQUFFLEVBQUUsRUFBRSxFQUFLO0FBQ3ZDLE1BQUksT0FBTyxFQUFFLEtBQUssV0FBVyxJQUFJLE9BQU8sRUFBRSxLQUFLLFdBQVcsRUFBRTtBQUMxRCxXQUFPLElBQUksQ0FBQztHQUNiO0FBQ0QsSUFBRSxHQUFHLFlBQVksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDekIsSUFBRSxHQUFHLFlBQVksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDekIsTUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLE9BQU8sSUFBSSxDQUFDLEtBQzNDLE9BQU8sS0FBSyxDQUFDO0NBQ25CLENBQUE7O0FBRU0sSUFBTSxZQUFZLFdBQVosWUFBWSxHQUFHLFNBQWYsWUFBWSxDQUFJLENBQUMsRUFBRSxNQUFNLEVBQUs7QUFDekMsU0FBTztBQUNMLEtBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7QUFDdEIsS0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztHQUN2QixDQUFDO0NBQ0g7Ozs7O0FBQUEsQUFLTSxJQUFNLGdCQUFnQixXQUFoQixnQkFBZ0IsR0FBRyxTQUFuQixnQkFBZ0IsQ0FBSSxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBSztBQUMxRCxNQUFNLFFBQVEsR0FBRyxFQUFFLEFBQUMsT0FBTyxHQUFHLE9BQU8sSUFBSyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFBLEFBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxDQUFDO0FBQ2xGLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekQsTUFBTSxXQUFXLEdBQUcsQ0FBQyxXQUFXLENBQUM7O0FBRWpDLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLFFBQVEsSUFBSSxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBLEFBQUMsR0FBRyxXQUFXLElBQUksS0FBSyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQSxBQUFDLENBQUM7QUFDbEgsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsUUFBUSxJQUFJLEtBQUssQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUEsQUFBQyxHQUFHLFdBQVcsSUFBSSxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBQztBQUNsSCxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxXQUFXLElBQUksS0FBSyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQSxBQUFDLEdBQUcsUUFBUSxJQUFJLEtBQUssQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUEsQUFBQyxDQUFDO0FBQ2xILE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLFdBQVcsSUFBSSxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBLEFBQUMsR0FBRyxRQUFRLElBQUksS0FBSyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQSxBQUFDLENBQUM7O0FBRWxILE1BQU0sRUFBRSxHQUFHO0FBQ1QsS0FBQyxFQUFFLElBQUk7QUFDUCxLQUFDLEVBQUUsSUFBSTtHQUNSLENBQUM7QUFDRixNQUFNLEVBQUUsR0FBRztBQUNULEtBQUMsRUFBRSxJQUFJO0FBQ1AsS0FBQyxFQUFFLElBQUk7R0FDUixDQUFDO0FBQ0YsU0FBTztBQUNMLE1BQUUsRUFBRSxFQUFFO0FBQ04sTUFBRSxFQUFFLEVBQUU7R0FDUCxDQUFBO0NBQ0YsQ0FBQTs7QUFFTSxJQUFNLFdBQVcsV0FBWCxXQUFXLEdBQUcsU0FBZCxXQUFXLENBQUksR0FBRyxFQUFFLEdBQUcsRUFBSztBQUN2QyxTQUFPLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFBLEFBQUMsR0FBRyxHQUFHLENBQUM7Q0FDMUMsQ0FBQTs7QUFFTSxJQUFNLFNBQVMsV0FBVCxTQUFTLEdBQUcsU0FBWixTQUFTLENBQUksR0FBRyxFQUFFLEdBQUcsRUFBSztBQUNyQyxTQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFBLEFBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztDQUMxRCxDQUFBOzs7Ozs7Ozs7Ozs7SUM1U1csQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUFXTixJQUFNLEdBQUcsV0FBSCxHQUFHLEdBQUcsU0FBTixHQUFHLENBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUs7QUFDckMsTUFBSSxDQUFDLENBQUMsYUFBYSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRTtBQUMzQixXQUFPO0FBQ0wsWUFBTSxFQUFFLE1BQU07QUFDZCxnQkFBVSxFQUFFLENBQUM7QUFDYixjQUFRLEVBQUUsQ0FBQztBQUNYLGVBQVMsRUFBRSxLQUFLO0FBQ2hCLGtCQUFZLEVBQUUsSUFBSTtLQUNuQixDQUFBO0dBQ0Y7QUFDRCxNQUFJLFNBQVMsR0FBRyxLQUFLLENBQUM7QUFDdEIsTUFBSSxNQUFNLFlBQUE7TUFBRSxNQUFNLFlBQUE7TUFBRSxVQUFVLFlBQUE7TUFBRSxRQUFRLFlBQUEsQ0FBQztBQUN6QyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRTlELE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ3RCLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7O0FBQUMsQUFHdEIsTUFBTSxFQUFFLEdBQUc7QUFDVCxLQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxNQUFNO0FBQ2hCLEtBQUMsRUFBRSxFQUFFO0dBQ047OztBQUFBLEFBR0QsUUFBTSxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDMUMsUUFBTSxHQUFHLEFBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUNyRCxRQUFNLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMxQyxRQUFNLEdBQUcsQUFBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxNQUFNLEdBQUcsTUFBTTs7O0FBQUMsQUFHckQsTUFBSSxBQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFNLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxBQUFDLEVBQUU7QUFDeEQsY0FBVSxHQUFHLE1BQU0sQ0FBQztBQUNwQixZQUFRLEdBQUcsTUFBTSxDQUFDOzs7QUFDbkIsT0FFSSxJQUFJLEFBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLElBQU0sRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLEFBQUMsRUFBRTtBQUM3RCxnQkFBVSxHQUFHLE1BQU0sQ0FBQztBQUNwQixjQUFRLEdBQUcsTUFBTSxDQUFDO0FBQ2xCLGVBQVMsR0FBRyxJQUFJLENBQUM7OztBQUNsQixTQUVJLElBQUksTUFBTSxHQUFHLE1BQU0sRUFBRTtBQUN4QixrQkFBVSxHQUFHLE1BQU0sQ0FBQztBQUNwQixnQkFBUSxHQUFHLE1BQU0sQ0FBQztBQUNsQixpQkFBUyxHQUFHLElBQUksQ0FBQzs7O0FBQ2xCLFdBRUk7QUFDSCxvQkFBVSxHQUFHLE1BQU0sQ0FBQztBQUNwQixrQkFBUSxHQUFHLE1BQU0sQ0FBQztTQUNuQjs7QUFFRCxTQUFPO0FBQ0wsVUFBTSxFQUFFLENBQUM7QUFDVCxjQUFVLEVBQUUsVUFBVTtBQUN0QixZQUFRLEVBQUUsUUFBUTtBQUNsQixhQUFTLEVBQUUsU0FBUztBQUNwQixnQkFBWSxFQUFFLEtBQUs7R0FDcEIsQ0FBQTtDQUNGOzs7QUFBQSxBQUdNLElBQU0sVUFBVSxXQUFWLFVBQVUsR0FBRyxTQUFiLFVBQVUsQ0FBSSxXQUFXLEVBQUUsUUFBUSxFQUFLO0FBQ25ELE1BQU0sQ0FBQyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7QUFDN0IsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQ3JCLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNyQyxNQUFNLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLE1BQU0sR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbEIsT0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUMxQixRQUFNLENBQUMsR0FBRyxHQUFHLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxRCxRQUFNLENBQUMsR0FBRyxHQUFHLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxRCxhQUFTLENBQUMsSUFBSSxDQUFDO0FBQ2IsT0FBQyxFQUFFLENBQUM7QUFDSixPQUFDLEVBQUUsQ0FBQztLQUNMLENBQUMsQ0FBQTtHQUNIO0FBQ0QsU0FBTyxTQUFTLENBQUM7Q0FDbEI7Ozs7QUFBQSxBQUlNLElBQU0sUUFBUSxXQUFSLFFBQVEsR0FBRyxTQUFYLFFBQVEsQ0FBSSxXQUFXLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUssRUFFakU7Ozs7QUFBQSxBQUlNLElBQU0sT0FBTyxXQUFQLE9BQU8sR0FBRyxTQUFWLE9BQU8sQ0FBSSxXQUFXLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUs7QUFDdEQsTUFBTSxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQztBQUM3QixNQUFNLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUM5QixNQUFNLFNBQVMsR0FBRyxFQUFFLENBQUM7O0FBRXJCLE1BQUksQ0FBQyxDQUFDLENBQUMsWUFBWSxFQUFFO0FBQ25CLFNBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDMUIsZUFBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7S0FDN0U7R0FDRixNQUFNO0FBQ0wsU0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTs7QUFFMUIsZUFBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN4RDtHQUNGO0FBQ0QsU0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN2QixTQUFPLFNBQVMsQ0FBQztDQUNsQixDQUFBOztBQUVNLElBQU0scUJBQXFCLFdBQXJCLHFCQUFxQixHQUFHLFNBQXhCLHFCQUFxQixDQUFJLE9BQU8sRUFBSztBQUNoRCxNQUFNLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUEsQUFBQyxDQUFDO0FBQ3ZFLFNBQU87QUFDTCxLQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FBQztBQUN6QixLQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FBQztBQUN6QixLQUFDLEVBQUUsTUFBTSxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFBLEFBQUM7R0FDaEUsQ0FBQTtDQUNGLENBQUE7O0FBRU0sSUFBTSxxQkFBcUIsV0FBckIscUJBQXFCLEdBQUcsU0FBeEIscUJBQXFCLENBQUksT0FBTyxFQUFLO0FBQ2hELE1BQU0sTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQSxBQUFDLENBQUM7QUFDbkMsU0FBTztBQUNMLEtBQUMsRUFBRSxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUM7QUFDckIsS0FBQyxFQUFFLE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FBQztHQUN0QixDQUFBO0NBQ0YsQ0FBQTs7QUFFTSxJQUFNLDRCQUE0QixXQUE1Qiw0QkFBNEIsR0FBRyxTQUEvQiw0QkFBNEIsQ0FBSSxPQUFPLEVBQUUsS0FBSyxFQUFLO0FBQzlELFNBQU87QUFDTCxLQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUM7QUFDNUQsS0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDO0FBQzVELEtBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztHQUNiLENBQUE7Q0FDRixDQUFBOztBQUVNLElBQU0seUJBQXlCLFdBQXpCLHlCQUF5QixHQUFHLFNBQTVCLHlCQUF5QixDQUFJLE9BQU8sRUFBRSxLQUFLLEVBQUs7QUFDM0QsU0FBTztBQUNMLEtBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQztBQUM1RCxLQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUM7R0FDN0QsQ0FBQTtDQUNGLENBQUE7O0FBRU0sSUFBTSxxQkFBcUIsV0FBckIscUJBQXFCLEdBQUcsU0FBeEIscUJBQXFCLENBQUksYUFBYSxFQUFFLEtBQUssRUFBSztBQUM3RCxNQUFNLENBQUMsR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDO0FBQy9CLE1BQU0sb0JBQW9CLEdBQUcsRUFBRSxDQUFDO0FBQ2hDLE9BQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDMUIsUUFBSSxLQUFLLEdBQUcseUJBQXlCLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQy9ELHdCQUFvQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUNsQztBQUNELFNBQU8sb0JBQW9CLENBQUM7Q0FDN0I7Ozs7O0FBQUEsQUFLTSxJQUFNLGlCQUFpQixXQUFqQixpQkFBaUIsR0FBRyxTQUFwQixpQkFBaUIsQ0FBSSxFQUFFLEVBQUUsRUFBRSxFQUFLO0FBQzNDLE1BQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdEMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN4RSxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3hFLE1BQU0sV0FBVyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLGFBQWEsR0FBRyxhQUFhLENBQUM7O0FBRWhFLE1BQU0sUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsYUFBYSxDQUFBLEdBQUksV0FBVyxDQUFDO0FBQzdELE1BQU0sUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLGFBQWEsQ0FBQSxHQUFJLFdBQVcsQ0FBQzs7QUFFbkQsTUFBTSxDQUFDLEdBQUcsUUFBUSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsUUFBUSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDNUMsTUFBTSxDQUFDLEdBQUcsUUFBUSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsUUFBUSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRTVDLFNBQU87QUFDTCxLQUFDLEVBQUUsQ0FBQztBQUNKLEtBQUMsRUFBRSxDQUFDO0dBQ0wsQ0FBQTtDQUNGLENBQUE7O0FBRU0sSUFBTSx3QkFBd0IsV0FBeEIsd0JBQXdCLEdBQUcsU0FBM0Isd0JBQXdCLENBQUksRUFBRSxFQUFFLEVBQUUsRUFBSyxFQUVuRCxDQUFBOzs7Ozs7Ozs7SUNyTFcsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUFZYixJQUFNLFdBQVcsR0FBRyx3QkFiWCxrQkFBa0IsQ0FhZ0IsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7O0lDYi9DLENBQUM7Ozs7SUFDRCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7OztJQWVBLGtCQUFrQixXQUFsQixrQkFBa0I7QUFDN0IsV0FEVyxrQkFBa0IsQ0FDakIsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRTs7OzBCQURwQyxrQkFBa0I7O0FBRTNCLFFBQUksQ0FBQyxJQUFJLEdBQUcsVUFmZCxJQUFJLEVBZW9CLENBQUM7O0FBRXZCLFFBQUksQ0FBQyxNQUFNLEdBQUc7QUFDWixPQUFDLEVBQUUsQ0FBQztBQUNKLE9BQUMsRUFBRSxDQUFDO0tBQ0wsQ0FBQTtBQUNELFFBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ1gsUUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDWCxRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sSUFBSSxPQUFPLENBQUM7QUFDaEMsUUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLElBQUksQ0FBQyxDQUFDO0FBQzlCLFFBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxJQUFJLENBQUMsQ0FBQzs7QUFFaEMsUUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLEVBQUU7QUFDdEIsYUFBTyxLQUFLLENBQUM7S0FDZDs7QUFFRCxVQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQ3pDLFlBQU0sQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNuQyxZQUFLLElBQUksRUFBRSxDQUFDO0tBQ2IsRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFVixVQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFlBQU07QUFDdEMsWUFBSyxJQUFJLEVBQUUsQ0FBQztLQUNiLEVBQUUsS0FBSyxDQUFDLENBQUM7R0FJWDs7ZUE3QlUsa0JBQWtCOzsyQkErQnRCO0FBQ0wsVUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ3BDLFVBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7QUFDbkMsVUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ2hCOzs7OEJBRVM7O0FBRVIsVUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNyQyxVQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDOztBQUFDLEFBRTNFLFVBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQzs7QUFFbkMsVUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3JFLFVBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQzs7QUFFbkMsVUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0FBQ1osV0FBSSxJQUFJLENBQUMsR0FBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBQzs7Ozs7T0FLMUI7S0FDRjs7Ozs7O3dDQUdtQjtBQUNsQixVQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JDLFVBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDOztBQUFDLEFBRXJDLFVBQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEFBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQzdELFVBQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxBQUFDLENBQUMsR0FBRyxDQUFDLElBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQzdELFVBQU0sQ0FBQyxHQUFHO0FBQ1IsU0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDM0MsU0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztPQUM3QyxDQUFBO0FBQ0QsVUFBTSxNQUFNLEdBQUc7QUFDYixTQUFDLEVBQUUsQ0FBQztBQUNKLFNBQUMsRUFBRSxDQUFDO09BQ0w7O0FBQUMsQUFFRixVQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsbUJBQW1CLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7O0FBRXBFLFVBQU0sRUFBRSxHQUFHO0FBQ1QsU0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDO0FBQ1IsU0FBQyxFQUFFLENBQUM7T0FDTCxDQUFDOztBQUVGLFVBQU0sTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDOztBQUUxQyxhQUFPLE1BQU0sQ0FBQztLQUNmOzs7Ozs7O2tDQUlhO0FBQ1osVUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFO0FBQy9DLGVBQU8sQ0FBQyxLQUFLLENBQUMsa0NBQWtDLENBQUMsQ0FBQztBQUNsRCxlQUFPLElBQUksQ0FBQztPQUNiLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLElBQUssSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxJQUFJLENBQUMsRUFBRTtBQUMzQyxlQUFPLENBQUMsS0FBSyxDQUFDLHNEQUFzRCxDQUFDLENBQUM7QUFDdEUsZUFBTyxJQUFJLENBQUM7Ozs7QUFDYixXQUdJLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUNyQyxpQkFBTyxDQUFDLEtBQUssQ0FBQztvQ0FDZ0IsQ0FBQyxDQUFDO0FBQ2hDLGlCQUFPLElBQUksQ0FBQztTQUNiLE1BQU0sSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO0FBQ3ZDLGlCQUFPLENBQUMsS0FBSyxDQUFDLG9EQUFvRCxDQUFDLENBQUM7QUFDcEUsaUJBQU8sSUFBSSxDQUFDO1NBQ2IsTUFBTTtBQUNMLGlCQUFPLEtBQUssQ0FBQztTQUNkO0tBQ0Y7OztTQTFHVSxrQkFBa0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDWGxCLE9BQU8sV0FBUCxPQUFPO0FBQ2xCLFdBRFcsT0FBTyxHQUNKOzs7MEJBREgsT0FBTzs7QUFHaEIsVUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxVQUFDLEtBQUssRUFBSztBQUN6QyxZQUFNLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbkMsWUFBSyxJQUFJLEVBQUUsQ0FBQztLQUNiLEVBQUUsS0FBSyxDQUFDLENBQUM7O0FBRVYsVUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxZQUFNOzs7OztBQUt0QyxZQUFLLEtBQUssRUFBRSxDQUFDO0tBQ2QsRUFBRSxLQUFLLENBQUMsQ0FBQztHQUVYOztlQWhCVSxPQUFPOzsyQkFrQlg7QUFDTCxVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQy9CLFVBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQzs7QUFFbEIsVUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDOztBQUVwQixVQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRVosVUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0tBQ3JCOzs7NEJBRU87QUFDTiwwQkFBb0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO0FBQUMsQUFDOUIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUM7QUFBQyxBQUNuRSxVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNsQixVQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztBQUN0QixVQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztBQUNuQixVQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQzs7QUFFckIsVUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3hELFdBQUssSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsS0FBSyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRTtBQUN4RCxlQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztPQUN2RDtBQUNELFVBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNiOzs7aUNBRVk7QUFDWCxVQUFJLENBQUMsTUFBTSxHQUFHLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLEVBQy9ELE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxXQUFXLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDakYsVUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzVCLFVBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDM0IsVUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFM0IsVUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUM1Qjs7O21DQUVjOzs7O0FBSWIsVUFBTSxZQUFZLEdBQUcsSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3RELFVBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO0tBQzlCOzs7bUNBRWM7QUFDYixVQUFJLENBQUMsUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQztBQUN0QyxpQkFBUyxFQUFFLElBQUk7T0FDaEIsQ0FBQyxDQUFDO0FBQ0gsVUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzNDLFVBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzdELGNBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7O0FBRXBELFVBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUNmOzs7Ozs7eUJBR0ksTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQ2xDLFVBQUksS0FBSyxLQUFLLFNBQVMsRUFBRSxLQUFLLEdBQUcsUUFBUSxDQUFDOztBQUUxQyxVQUFNLFFBQVEsR0FBRyxJQUFJLEtBQUssQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUN2RSxVQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNoRCxZQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQzdCLFlBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDN0IsVUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNYLGNBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztPQUN2Qjs7QUFFRCxVQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUN4Qjs7OzRCQUVPLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTtBQUNwQyxVQUFJLEtBQUssS0FBSyxTQUFTLEVBQUUsS0FBSyxHQUFHLFFBQVEsQ0FBQzs7QUFFMUMsVUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsWUFBWSxDQUNsQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDaEMsWUFBTSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTTtBQUM1QixXQUFLLEVBQUUsTUFBTTtBQUNiO0FBQUssT0FDTixDQUFDOztBQUVGLFVBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRTFDLFVBQU0sSUFBSSxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzlCLFVBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRTdDLFVBQU0sUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDO0FBQzNDLGFBQUssRUFBRSxLQUFLO09BQ2IsQ0FBQyxDQUFDO0FBQ0gsVUFBTSxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQzs7QUFFN0MsVUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbkI7Ozt5QkFFSSxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRTtBQUN0QixVQUFJLEtBQUssS0FBSyxTQUFTLEVBQUUsS0FBSyxHQUFHLFFBQVEsQ0FBQzs7QUFFMUMsVUFBTSxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7O0FBRXRDLGNBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUNwQixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUN0QyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUNuQyxDQUFDO0FBQ0YsVUFBTSxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUM7QUFDM0MsYUFBSyxFQUFFLEtBQUs7T0FDYixDQUFDLENBQUM7QUFDSCxVQUFNLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQzdDLFVBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ25COzs7NEJBRU8sUUFBUSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFO0FBQzNDLFVBQUksS0FBSyxLQUFLLFNBQVMsRUFBRSxLQUFLLEdBQUcsUUFBUSxDQUFDOztBQUUxQyxVQUFNLElBQUksR0FBRyxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUMvQixVQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUUxQyxXQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN4QyxZQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO09BQzFDOztBQUVELFVBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRTFDLFVBQU0sUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFL0MsVUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO0tBQ3RFOzs7K0JBRVUsUUFBUSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFO0FBQy9DLFVBQUcsU0FBUyxLQUFLLFNBQVMsRUFBRSxTQUFTLEdBQUcsS0FBSyxDQUFDO0FBQzlDLFVBQUksS0FBSyxLQUFLLFNBQVMsRUFBRSxLQUFLLEdBQUcsUUFBUSxDQUFDOztBQUUxQyxVQUFNLFFBQVEsR0FBRyxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQztBQUMzQyxhQUFLLEVBQUUsS0FBSztBQUNaLGlCQUFTLEVBQUUsU0FBUztPQUNyQixDQUFDLENBQUM7O0FBRUgsVUFBSSxRQUFRLEVBQUU7QUFDWixZQUFNLGFBQWEsR0FBRyxJQUFJLEtBQUssQ0FBQyxhQUFhLEVBQUU7OztBQUFDLEFBR2hELFlBQU0sT0FBTyxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFVBQUMsR0FBRyxFQUFLLEVBQUUsQ0FBQyxDQUFDO0FBQzFELGVBQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMvQixnQkFBUSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUM7QUFDdkIsZ0JBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUM7QUFDMUMsZ0JBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUM7T0FDM0M7O0FBRUQsYUFBTyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQzNDOzs7MkJBRU07QUFDTCxVQUFNLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDckMsVUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDckI7Ozs2QkFFUTs7O0FBQ1AsMkJBQXFCLENBQUMsWUFBTTtBQUMxQixlQUFLLE1BQU0sRUFBRSxDQUFBO09BQ2QsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQy9DOzs7U0FsTFUsT0FBTyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgKiBhcyBFIGZyb20gJy4vZXVjbGlkJztcbmltcG9ydCAqIGFzIEggZnJvbSAnLi9oeXBlcmJvbGljJztcblxuaW1wb3J0IHtcbiAgVGhyZWVKU1xufVxuZnJvbSAnLi90aHJlZWpzJztcblxuLy8gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gKlxuLy8gKiAgIERJU0sgQ0xBU1Ncbi8vICogICBQb2luY2FyZSBEaXNrIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBoeXBlcmJvbGljIHBsYW5lXG4vLyAqICAgQ29udGFpbnMgYW55IGZ1bmN0aW9ucyB1c2VkIHRvIGRyYXcgdG8gdGhlIGRpc2tcbi8vICogICAoQ3VycmVudGx5IHVzaW5nIHRocmVlIGpzIGFzIGRyYXdpbmcgY2xhc3MpXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5leHBvcnQgY2xhc3MgRGlzayB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZHJhdyA9IG5ldyBUaHJlZUpTKCk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChldmVudCkgPT4ge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnKTtcbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH0sIGZhbHNlKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XG4gICAgICB0aGlzLmluaXQoKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy5jZW50cmUgPSB7XG4gICAgICB4OiAwLFxuICAgICAgeTogMFxuICAgIH1cblxuICAgIC8vZHJhdyBsYXJnZXN0IGNpcmNsZSBwb3NzaWJsZSBnaXZlbiB3aW5kb3cgZGltc1xuICAgIHRoaXMucmFkaXVzID0gKHdpbmRvdy5pbm5lcldpZHRoIDwgd2luZG93LmlubmVySGVpZ2h0KSA/ICh3aW5kb3cuaW5uZXJXaWR0aCAvIDIpIC0gNSA6ICh3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKSAtIDU7XG5cbiAgICB0aGlzLmNpcmNsZSA9IHtcbiAgICAgIGNlbnRyZTogdGhpcy5jZW50cmUsXG4gICAgICByYWRpdXM6IHRoaXMucmFkaXVzXG4gICAgfVxuXG4gICAgLy9zbWFsbGVyIGNpcmNsZSBmb3IgdGVzdGluZ1xuICAgIC8vdGhpcy5yYWRpdXMgPSB0aGlzLnJhZGl1cyAvIDI7XG5cbiAgICB0aGlzLmRyYXdEaXNrKCk7XG5cbiAgICAvL3RoaXMudGVzdGluZygpO1xuICB9XG5cbiAgdGVzdGluZygpIHtcbiAgICBjb25zdCBwMSA9IHtcbiAgICAgIHg6IDEwMCxcbiAgICAgIHk6IDI1MFxuICAgIH07XG4gICAgY29uc3QgcDIgPSB7XG4gICAgICB4OiAtMTUwLFxuICAgICAgeTogMTUwXG4gICAgfTtcbiAgICBjb25zdCBwMyA9IHtcbiAgICAgIHg6IC03MCxcbiAgICAgIHk6IC0yNTBcbiAgICB9O1xuXG4gICAgY29uc3QgcDQgPSB7XG4gICAgICB4OiAtMTcwLFxuICAgICAgeTogLTE1MFxuICAgIH07XG5cbiAgICBjb25zdCBwNSA9IHtcbiAgICAgIHg6IDE3MCxcbiAgICAgIHk6IC0xNTBcbiAgICB9O1xuICAgIHRoaXMucG9pbnQocDEsIDUsIDB4ZjAwZjBmKTtcbiAgICB0aGlzLnBvaW50KHAyLCA1LCAweGZmZmYwZik7XG4gICAgdGhpcy5wb2ludChwMywgNSwgMHgxZDAwZDUpO1xuICAgIHRoaXMucG9pbnQocDQsIDUsIDB4MDBmZjBmKTtcbiAgICB0aGlzLnBvaW50KHA1LCA1LCAweDM1OTU0Myk7XG5cbiAgICAvKlxuICAgIGNvbnN0IGEgPSBILmFyYyhwMSwgcDIpO1xuXG4gICAgdGhpcy5kcmF3LmRpc2soYS5jaXJjbGUuY2VudHJlLCBhLmNpcmNsZS5yYWRpdXMsIDB4ZmZmZmZmLCBmYWxzZSk7XG5cbiAgICBjb25zdCBwNCA9IEUubmV4dFBvaW50KGEuY2lyY2xlLCBwMiwgMjApLnAxO1xuICAgIGNvbnNvbGUubG9nKHA0KTtcblxuXG5cbiAgICAvL3RoaXMuZHJhd0FyYyhwMiwgcDMsIDB4ZjAwZjBmKTtcbiAgICAqL1xuICAgIC8vdGhpcy5wb2x5Z29uT3V0bGluZShbcDEsIHAyLCBwM10sMHhmMDBmMGYpXG4gICAgdGhpcy5wb2x5Z29uKFtwMSwgcDIsIHA0LCBwMywgcDVdLCAweDcwMDY5YSk7XG4gICAgLy90aGlzLnBvbHlnb24oW3AyLCBwMywgcDRdKTtcbiAgfVxuICBnZXRSYWRpdXMoKSB7XG4gICAgcmV0dXJuIHRoaXMucmFkaXVzO1xuICB9XG5cbiAgLy9kcmF3IHRoZSBkaXNrIGJhY2tncm91bmRcbiAgZHJhd0Rpc2soKSB7XG4gICAgdGhpcy5kcmF3LmRpc2sodGhpcy5jZW50cmUsIHRoaXMucmFkaXVzLCAweDAwMDAwMCwgdHJ1ZSk7XG4gIH1cblxuICBwb2ludChjZW50cmUsIHJhZGl1cywgY29sb3IpIHtcbiAgICB0aGlzLmRyYXcuZGlzayhjZW50cmUsIHJhZGl1cywgY29sb3IsIGZhbHNlKTtcbiAgfVxuXG4gIC8vZHJhdyBhIGh5cGVyYm9saWMgbGluZSBiZXR3ZWVuIHR3byBwb2ludHMgb24gdGhlIGJvdW5kYXJ5IGNpcmNsZVxuICAvL1RPRE86IGZpeCFcbiAgbGluZShwMSwgcDIsIGNvbG9yKSB7XG4gICAgY29uc3QgYyA9IEUuZ3JlYXRDaXJjbGUocDEsIHAyLCB0aGlzLnJhZGl1cywgdGhpcy5jZW50cmUpO1xuICAgIGNvbnN0IHBvaW50cyA9IEUuY2lyY2xlSW50ZXJzZWN0KHRoaXMuY2VudHJlLCBjLmNlbnRyZSwgdGhpcy5yYWRpdXMsIGMucmFkaXVzKTtcblxuICAgIHRoaXMuZHJhd0FyYyhwb2ludHMucDEsIHBvaW50cy5wMiwgY29sb3IpXG4gIH1cblxuICAvL0RyYXcgYW4gYXJjIChoeXBlcmJvbGljIGxpbmUgc2VnbWVudCkgYmV0d2VlbiB0d28gcG9pbnRzIG9uIHRoZSBkaXNrXG4gIGRyYXdBcmMocDEsIHAyLCBjb2xvdXIpIHtcbiAgICAvL2NoZWNrIHRoYXQgdGhlIHBvaW50cyBhcmUgaW4gdGhlIGRpc2tcbiAgICBpZiAodGhpcy5jaGVja1BvaW50cyhwMSwgcDIpKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgY29uc3QgY29sID0gY29sb3VyIHx8IDB4ZmZmZmZmO1xuICAgIGNvbnN0IGFyYyA9IEguYXJjKHAxLCBwMiwgdGhpcy5jaXJjbGUpO1xuXG4gICAgaWYgKGEuc3RyYWlnaHRMaW5lKSB7XG4gICAgICB0aGlzLmRyYXcubGluZShwMSwgcDIsIGNvbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZHJhdy5zZWdtZW50KGFyYy5jaXJjbGUsIGFyYy5zdGFydEFuZ2xlLCBhcmMuZW5kQW5nbGUsIGNvbG91cik7XG4gICAgfVxuICB9XG5cbiAgcG9seWdvbk91dGxpbmUodmVydGljZXMsIGNvbG91cikge1xuICAgIGNvbnN0IGwgPSB2ZXJ0aWNlcy5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgIHRoaXMuZHJhd0FyYyh2ZXJ0aWNlc1tpXSwgdmVydGljZXNbKGkgKyAxKSAlIGxdLCBjb2xvdXIpO1xuICAgIH1cbiAgfVxuXG4gIC8vY3JlYXRlIGFuIGFycmF5IG9mIHBvaW50cyBzcGFjZWQgZXF1YWxseSBhcm91bmQgdGhlIGFyY3MgZGVmaW5pbmcgYSBoeXBlcmJvbGljXG4gIC8vcG9seWdvbiBhbmQgcGFzcyB0aGVzZSB0byBUaHJlZUpTLnBvbHlnb24oKVxuICAvL1RPRE8gbWFrZSBzcGFjaW5nIGEgZnVuY3Rpb24gb2YgZmluYWwgcmVzb2x1dGlvblxuICAvL1RPRE8gY2hlY2sgd2hldGhlciB2ZXJ0aWNlcyBhcmUgaW4gdGhlIHJpZ2h0IG9yZGVyXG4gIHBvbHlnb24odmVydGljZXMsIGNvbG9yLCB0ZXh0dXJlKSB7XG4gICAgY29uc3QgcG9pbnRzID0gW107XG4gICAgY29uc3Qgc3BhY2luZyA9IDU7XG4gICAgY29uc3QgbCA9IHZlcnRpY2VzLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgbGV0IHA7XG4gICAgICBjb25zdCBhcmMgPSBILmFyYyh2ZXJ0aWNlc1tpXSwgdmVydGljZXNbKGkgKyAxKSAlIGxdLCB0aGlzLmNpcmNsZSk7XG5cbiAgICAgIC8vbGluZSBub3QgdGhyb3VnaCB0aGUgb3JpZ2luIChoeXBlcmJvbGljIGFyYylcbiAgICAgIGlmICghYXJjLnN0cmFpZ2h0TGluZSkge1xuXG4gICAgICAgIGlmIChhcmMuY2xvY2t3aXNlKSB7XG4gICAgICAgICAgcCA9IEUuc3BhY2VkUG9pbnRPbkFyYyhhcmMuY2lyY2xlLCB2ZXJ0aWNlc1tpXSwgc3BhY2luZykucDI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcCA9IEUuc3BhY2VkUG9pbnRPbkFyYyhhcmMuY2lyY2xlLCB2ZXJ0aWNlc1tpXSwgc3BhY2luZykucDE7XG4gICAgICAgIH1cbiAgICAgICAgcG9pbnRzLnB1c2gocCk7XG5cbiAgICAgICAgd2hpbGUgKEUuZGlzdGFuY2UocCwgdmVydGljZXNbKGkgKyAxKSAlIGxdKSA+IHNwYWNpbmcpIHtcblxuICAgICAgICAgIGlmIChhcmMuY2xvY2t3aXNlKSB7XG4gICAgICAgICAgICBwID0gRS5zcGFjZWRQb2ludE9uQXJjKGFyYy5jaXJjbGUsIHAsIHNwYWNpbmcpLnAyO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwID0gRS5zcGFjZWRQb2ludE9uQXJjKGFyYy5jaXJjbGUsIHAsIHNwYWNpbmcpLnAxO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHBvaW50cy5wdXNoKHApO1xuICAgICAgICB9XG4gICAgICAgIHBvaW50cy5wdXNoKHZlcnRpY2VzWyhpICsgMSkgJSBsXSk7XG4gICAgICB9XG5cbiAgICAgIC8vbGluZSB0aHJvdWdoIG9yaWdpbiAoc3RyYWlnaHQgbGluZSlcbiAgICAgIGVsc2V7XG4gICAgICAgIHBvaW50cy5wdXNoKHZlcnRpY2VzWyhpICsgMSkgJSBsXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHdpcmVmcmFtZSA9IGZhbHNlO1xuICAgIC8vVEVTVElOR1xuICAgIHdpcmVmcmFtZSA9IHRydWU7XG4gICAgZm9yKGxldCBwb2ludCBvZiBwb2ludHMpe1xuICAgICAgLy90aGlzLnBvaW50KHBvaW50LDIsMHgxMGRlZDgpO1xuICAgIH1cblxuICAgIHRoaXMuZHJhdy5wb2x5Z29uKHBvaW50cywgY29sb3IsIHRleHR1cmUsIHdpcmVmcmFtZSk7XG4gIH1cblxuICAvL3JldHVybiB0cnVlIGlmIGFueSBvZiB0aGUgcG9pbnRzIGlzIG5vdCBpbiB0aGUgZGlza1xuICBjaGVja1BvaW50cyguLi5wb2ludHMpIHtcbiAgICBjb25zdCByID0gdGhpcy5yYWRpdXM7XG4gICAgbGV0IHRlc3QgPSBmYWxzZTtcbiAgICBmb3IgKGxldCBwb2ludCBvZiBwb2ludHMpIHtcbiAgICAgIGlmIChFLmRpc3RhbmNlKHBvaW50LCB0aGlzLmNlbnRyZSkgPiByKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yISBQb2ludCAoJyArIHBvaW50LnggKyAnLCAnICsgcG9pbnQueSArICcpIGxpZXMgb3V0c2lkZSB0aGUgcGxhbmUhJyk7XG4gICAgICAgIHRlc3QgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGVzdCkgcmV0dXJuIHRydWVcbiAgICBlbHNlIHJldHVybiBmYWxzZVxuICB9XG59XG4iLCIvLyAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyAqXG4vLyAqICAgRVVDTElERUFOIEZVTkNUSU9OU1xuLy8gKiAgIGEgcGxhY2UgdG8gc3Rhc2ggYWxsIHRoZSBmdW5jdGlvbnMgdGhhdCBhcmUgZXVjbGlkZWFuIGdlb21ldHJpY2FsXG4vLyAqICAgb3BlcmF0aW9uc1xuLy8gKlxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4vL2Rpc3RhbmNlIGJldHdlZW4gdHdvIHBvaW50c1xuZXhwb3J0IGNvbnN0IGRpc3RhbmNlID0gKHAxLCBwMikgPT4gTWF0aC5zcXJ0KE1hdGgucG93KChwMi54IC0gcDEueCksIDIpICsgTWF0aC5wb3coKHAyLnkgLSBwMS55KSwgMikpO1xuXG4vL21pZHBvaW50IG9mIHRoZSBsaW5lIHNlZ21lbnQgY29ubmVjdGluZyB0d28gcG9pbnRzXG5leHBvcnQgY29uc3QgbWlkcG9pbnQgPSAocDEsIHAyKSA9PiB7XG4gIHJldHVybiB7XG4gICAgeDogKHAxLnggKyBwMi54KSAvIDIsXG4gICAgeTogKHAxLnkgKyBwMi55KSAvIDJcbiAgfVxufVxuXG4vL3Nsb3BlIG9mIGxpbmUgdGhyb3VnaCBwMSwgcDJcbmV4cG9ydCBjb25zdCBzbG9wZSA9IChwMSwgcDIpID0+IChwMi54IC0gcDEueCkgLyAocDIueSAtIHAxLnkpO1xuXG4vL3Nsb3BlIG9mIGxpbmUgcGVycGVuZGljdWxhciB0byBhIGxpbmUgZGVmaW5lZCBieSBwMSxwMlxuZXhwb3J0IGNvbnN0IHBlcnBlbmRpY3VsYXJTbG9wZSA9IChwMSwgcDIpID0+IC0xIC8gKE1hdGgucG93KHNsb3BlKHAxLCBwMiksIC0xKSk7XG5cbi8vaW50ZXJzZWN0aW9uIHBvaW50IG9mIHR3byBsaW5lcyBkZWZpbmVkIGJ5IHAxLG0xIGFuZCBxMSxtMlxuLy9OT1QgV09SS0lORyBGT1IgVkVSVElDQUwgTElORVMhISFcbmV4cG9ydCBjb25zdCBpbnRlcnNlY3Rpb24gPSAocDEsIG0xLCBwMiwgbTIpID0+IHtcbiAgbGV0IGMxLCBjMiwgeCwgeTtcbiAgLy9jYXNlIHdoZXJlIGZpcnN0IGxpbmUgaXMgdmVydGljYWxcbiAgLy9pZihtMSA+IDUwMDAgfHwgbTEgPCAtNTAwMCB8fCBtMSA9PT0gSW5maW5pdHkpe1xuICBpZiAocDEueSA8IDAuMDAwMDAxICYmIHAxLnkgPiAtMC4wMDAwMDEpIHtcbiAgICB4ID0gcDEueDtcbiAgICB5ID0gKG0yKSAqIChwMS54IC0gcDIueCkgKyBwMi55O1xuICB9XG4gIC8vY2FzZSB3aGVyZSBzZWNvbmQgbGluZSBpcyB2ZXJ0aWNhbFxuICAvL2Vsc2UgaWYobTIgPiA1MDAwIHx8IG0yIDwgLTUwMDAgfHwgbTEgPT09IEluZmluaXR5KXtcbiAgZWxzZSBpZiAocDIueSA8IDAuMDAwMDAxICYmIHAyLnkgPiAtMC4wMDAwMDEpIHtcbiAgICB4ID0gcDIueDtcbiAgICB5ID0gKG0xICogKHAyLnggLSBwMS54KSkgKyBwMS55O1xuICB9IGVsc2Uge1xuICAgIC8veSBpbnRlcmNlcHQgb2YgZmlyc3QgbGluZVxuICAgIGMxID0gcDEueSAtIG0xICogcDEueDtcbiAgICAvL3kgaW50ZXJjZXB0IG9mIHNlY29uZCBsaW5lXG4gICAgYzIgPSBwMi55IC0gbTIgKiBwMi54O1xuXG4gICAgeCA9IChjMiAtIGMxKSAvIChtMSAtIG0yKTtcbiAgICB5ID0gbTEgKiB4ICsgYzE7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHg6IHgsXG4gICAgeTogeVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCByYWRpYW5zID0gKGRlZ3JlZXMpID0+IChNYXRoLlBJIC8gMTgwKSAqIGRlZ3JlZXM7XG5cbi8vZ2V0IHRoZSBjaXJjbGUgaW52ZXJzZSBvZiBhIHBvaW50IHAgd2l0aCByZXNwZWN0IGEgY2lyY2xlIHJhZGl1cyByIGNlbnRyZSBjXG5leHBvcnQgY29uc3QgaW52ZXJzZSA9IChwLCByLCBjKSA9PiB7XG4gIGxldCBhbHBoYSA9IChyICogcikgLyAoTWF0aC5wb3cocC54IC0gYy54LCAyKSArIE1hdGgucG93KHAueSAtIGMueSwgMikpO1xuICByZXR1cm4ge1xuICAgIHg6IGFscGhhICogKHAueCAtIGMueCkgKyBjLngsXG4gICAgeTogYWxwaGEgKiAocC55IC0gYy55KSArIGMueVxuICB9O1xufVxuXG4vL3JlZmxlY3QgcDMgYWNyb3NzIHRoZSBsaW5lIGRlZmluZWQgYnkgcDEscDJcbmV4cG9ydCBjb25zdCBsaW5lUmVmbGVjdGlvbiA9IChwMSxwMixwMykgPT4ge1xuICBjb25zdCBtID0gc2xvcGUocDEscDIpO1xuICBpZihtID09PSBJbmZpbml0eSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ1JlZmxlY3Rpb24gb3ZlciB4IGF4aXMgbm90IGltcGxlbWVudGVkJyk7XG4gIH1cbiAgY29uc3QgYyA9IHAxLnkgLSBtKnAxLng7XG4gIGNvbnN0IGQgPSAocDMueCArIChwMy55IC0gYykqbSkvKDErbSptKTtcbiAgY29uc3QgeCA9IDIqZCAtIHAzLng7XG4gIGNvbnN0IHkgPSAyKmQqbSAtIHAzLnkgKyAyKmM7XG5cbiAgcmV0dXJuIHsgeDogeCwgeTogeX07XG59XG5cbi8vY2FsY3VsYXRlIHRoZSByYWRpdXMgYW5kIGNlbnRyZSBvZiB0aGUgY2lyY2xlIHJlcXVpcmVkIHRvIGRyYXcgYSBsaW5lIGJldHdlZW5cbi8vdHdvIHBvaW50cyBpbiB0aGUgaHlwZXJib2xpYyBwbGFuZSBkZWZpbmVkIGJ5IHRoZSBkaXNrIChyLCBjKVxuZXhwb3J0IGNvbnN0IGdyZWF0Q2lyY2xlID0gKHAxLCBwMiwgciwgYykgPT4ge1xuICBsZXQgcDFJbnZlcnNlID0gaW52ZXJzZShwMSwgciwgYyk7XG4gIGxldCBwMkludmVyc2UgPSBpbnZlcnNlKHAyLCByLCBjKTtcblxuICBsZXQgbSA9IG1pZHBvaW50KHAxLCBwMUludmVyc2UpO1xuICBsZXQgbiA9IG1pZHBvaW50KHAyLCBwMkludmVyc2UpO1xuXG4gIGxldCBtMSA9IHBlcnBlbmRpY3VsYXJTbG9wZShtLCBwMUludmVyc2UpO1xuICBsZXQgbTIgPSBwZXJwZW5kaWN1bGFyU2xvcGUobiwgcDJJbnZlcnNlKTtcblxuXG4gIC8vY2VudHJlIGlzIHRoZSBjZW50cmVwb2ludCBvZiB0aGUgY2lyY2xlIG91dCBvZiB3aGljaCB0aGUgYXJjIGlzIG1hZGVcbiAgbGV0IGNlbnRyZSA9IGludGVyc2VjdGlvbihtLCBtMSwgbiwgbTIpO1xuICBsZXQgcmFkaXVzID0gZGlzdGFuY2UoY2VudHJlLCBwMSk7XG4gIHJldHVybiB7XG4gICAgY2VudHJlOiBjZW50cmUsXG4gICAgcmFkaXVzOiByYWRpdXNcbiAgfTtcbn1cblxuLy9hbiBhdHRlbXB0IGF0IGNhbGN1bGF0aW5nIHRoZSBjaXJjbGUgYWxnZWJyYWljYWxseVxuZXhwb3J0IGNvbnN0IGdyZWF0Q2lyY2xlVjIgPSAocDEsIHAyLCByKSA9PiB7XG4gIGxldCB4ID0gKHAyLnkgKiAocDEueCAqIHAxLnggKyByKSArIHAxLnkgKiBwMS55ICogcDIueSAtIHAxLnkgKiAocDIueCAqIHAyLnggKyBwMi55ICogcDIueSArIHIpKSAvICgyICogcDEueCAqIHAyLnkgLSBwMS55ICogcDIueCk7XG4gIGxldCB5ID0gKHAxLnggKiBwMS54ICogcDIueCAtIHAxLnggKiAocDIueCAqIHAyLnggKyBwMi55ICogcDIueSArIHIpICsgcDIueCAqIChwMS55ICogcDEueSArIHIpKSAvICgyICogcDEueSAqIHAyLnggKyAyICogcDEueCAqIHAyLnkpO1xuICBsZXQgcmFkaXVzID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkgLSByKTtcbiAgcmV0dXJuIHtcbiAgICBjZW50cmU6IHtcbiAgICAgIHg6IHgsXG4gICAgICB5OiB5XG4gICAgfSxcbiAgICByYWRpdXM6IHJhZGl1c1xuICB9XG59XG5cbi8vaW50ZXJzZWN0aW9uIG9mIHR3byBjaXJjbGVzIHdpdGggZXF1YXRpb25zOlxuLy8oeC1hKV4yICsoeS1hKV4yID0gcjBeMlxuLy8oeC1iKV4yICsoeS1jKV4yID0gcjFeMlxuLy9OT1RFIGFzc3VtZXMgdGhlIHR3byBjaXJjbGVzIERPIGludGVyc2VjdCFcbmV4cG9ydCBjb25zdCBjaXJjbGVJbnRlcnNlY3QgPSAoYzAsIGMxLCByMCwgcjEpID0+IHtcbiAgbGV0IGEgPSBjMC54O1xuICBsZXQgYiA9IGMwLnk7XG4gIGxldCBjID0gYzEueDtcbiAgbGV0IGQgPSBjMS55O1xuICBsZXQgZGlzdCA9IE1hdGguc3FydCgoYyAtIGEpICogKGMgLSBhKSArIChkIC0gYikgKiAoZCAtIGIpKTtcblxuICBsZXQgZGVsID0gTWF0aC5zcXJ0KChkaXN0ICsgcjAgKyByMSkgKiAoZGlzdCArIHIwIC0gcjEpICogKGRpc3QgLSByMCArIHIxKSAqICgtZGlzdCArIHIwICsgcjEpKSAvIDQ7XG5cbiAgbGV0IHhQYXJ0aWFsID0gKGEgKyBjKSAvIDIgKyAoKGMgLSBhKSAqIChyMCAqIHIwIC0gcjEgKiByMSkpIC8gKDIgKiBkaXN0ICogZGlzdCk7XG4gIGxldCB4MSA9IHhQYXJ0aWFsIC0gMiAqIGRlbCAqIChiIC0gZCkgLyAoZGlzdCAqIGRpc3QpO1xuICBsZXQgeDIgPSB4UGFydGlhbCArIDIgKiBkZWwgKiAoYiAtIGQpIC8gKGRpc3QgKiBkaXN0KTtcblxuICBsZXQgeVBhcnRpYWwgPSAoYiArIGQpIC8gMiArICgoZCAtIGIpICogKHIwICogcjAgLSByMSAqIHIxKSkgLyAoMiAqIGRpc3QgKiBkaXN0KTtcbiAgbGV0IHkxID0geVBhcnRpYWwgKyAyICogZGVsICogKGEgLSBjKSAvIChkaXN0ICogZGlzdCk7XG4gIGxldCB5MiA9IHlQYXJ0aWFsIC0gMiAqIGRlbCAqIChhIC0gYykgLyAoZGlzdCAqIGRpc3QpO1xuXG4gIGxldCBwMSA9IHtcbiAgICB4OiB4MSxcbiAgICB5OiB5MVxuICB9XG5cbiAgbGV0IHAyID0ge1xuICAgIHg6IHgyLFxuICAgIHk6IHkyXG4gIH1cblxuICByZXR1cm4ge1xuICAgIHAxOiBwMSxcbiAgICBwMjogcDJcbiAgfTtcbn1cblxuZXhwb3J0IGNvbnN0IGNpcmNsZUxpbmVJbnRlcnNlY3QgPSAoYywgciwgcDEsIHAyKSA9PiB7XG5cbiAgY29uc3QgZCA9IGRpc3RhbmNlKHAxLCBwMik7XG4gIC8vdW5pdCB2ZWN0b3IgcDEgcDJcbiAgY29uc3QgZHggPSAocDIueCAtIHAxLngpIC8gZDtcbiAgY29uc3QgZHkgPSAocDIueSAtIHAxLnkpIC8gZDtcblxuICAvL3BvaW50IG9uIGxpbmUgY2xvc2VzdCB0byBjaXJjbGUgY2VudHJlXG4gIGNvbnN0IHQgPSBkeCAqIChjLnggLSBwMS54KSArIGR5ICogKGMueSAtIHAxLnkpO1xuICBjb25zdCBwID0ge1xuICAgIHg6IHQgKiBkeCArIHAxLngsXG4gICAgeTogdCAqIGR5ICsgcDEueVxuICB9O1xuXG4gIC8vZGlzdGFuY2UgZnJvbSB0aGlzIHBvaW50IHRvIGNlbnRyZVxuICBjb25zdCBkMiA9IGRpc3RhbmNlKHAsIGMpO1xuXG4gIC8vbGluZSBpbnRlcnNlY3RzIGNpcmNsZVxuICBpZiAoZDIgPCByKSB7XG4gICAgY29uc3QgZHQgPSBNYXRoLnNxcnQociAqIHIgLSBkMiAqIGQyKTtcbiAgICAvL3BvaW50IDFcbiAgICBjb25zdCBxMSA9IHtcbiAgICAgIHg6ICh0IC0gZHQpICogZHggKyBwMS54LFxuICAgICAgeTogKHQgLSBkdCkgKiBkeSArIHAxLnlcbiAgICB9XG4gICAgLy9wb2ludCAyXG4gICAgY29uc3QgcTIgPSB7XG4gICAgICB4OiAodCArIGR0KSAqIGR4ICsgcDEueCxcbiAgICAgIHk6ICh0ICsgZHQpICogZHkgKyBwMS55XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHAxOiBxMSxcbiAgICAgIHAyOiBxMlxuICAgIH07XG4gIH0gZWxzZSBpZiAoZDIgPT09IHIpIHtcbiAgICByZXR1cm4gcDtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvcjogbGluZSBkb2VzIG5vdCBpbnRlcnNlY3QgY2lyY2xlIScpO1xuICB9XG59XG5cbi8vYW5nbGUgaW4gcmFkaWFucyBiZXR3ZWVuIHR3byBwb2ludHMgb24gY2lyY2xlIG9mIHJhZGl1cyByXG5leHBvcnQgY29uc3QgY2VudHJhbEFuZ2xlID0gKHAxLCBwMiwgcikgPT4ge1xuICByZXR1cm4gMiAqIE1hdGguYXNpbigwLjUgKiBkaXN0YW5jZShwMSwgcDIpIC8gcik7XG59XG5cbi8vY2FsY3VsYXRlIHRoZSBub3JtYWwgdmVjdG9yIGdpdmVuIDIgcG9pbnRzXG5leHBvcnQgY29uc3Qgbm9ybWFsVmVjdG9yID0gKHAxLCBwMikgPT4ge1xuICBsZXQgZCA9IE1hdGguc3FydChNYXRoLnBvdyhwMi54IC0gcDEueCwgMikgKyBNYXRoLnBvdyhwMi55IC0gcDEueSwgMikpO1xuICByZXR1cm4ge1xuICAgIHg6IChwMi54IC0gcDEueCkgLyBkLFxuICAgIHk6IChwMi55IC0gcDEueSkgLyBkXG4gIH1cbn1cblxuLy9kb2VzIHRoZSBsaW5lIGNvbm5lY3RpbmcgcDEsIHAyIGdvIHRocm91Z2ggdGhlIHBvaW50ICgwLDApP1xuLy9uZWVkcyB0byB0YWtlIGludG8gYWNjb3VudCByb3VuZG9mZiBlcnJvcnMgc28gcmV0dXJucyB0cnVlIGlmXG4vL3Rlc3QgaXMgY2xvc2UgdG8gMFxuZXhwb3J0IGNvbnN0IHRocm91Z2hPcmlnaW4gPSAocDEsIHAyKSA9PiB7XG4gIGlmIChwMS54ID09PSAwICYmIHAyLnggPT09IDApIHtcbiAgICAvL3ZlcnRpY2FsIGxpbmUgdGhyb3VnaCBjZW50cmVcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBjb25zdCB0ZXN0ID0gKC1wMS54ICogcDIueSArIHAxLnggKiBwMS55KSAvIChwMi54IC0gcDEueCkgKyBwMS55O1xuXG4gIGlmICh0ZXN0LnRvRml4ZWQoNikgPT0gMCkgcmV0dXJuIHRydWU7XG4gIGVsc2UgcmV0dXJuIGZhbHNlO1xufVxuXG4vL2ZpbmQgdGhlIGNlbnRyb2lkIG9mIGEgbm9uLXNlbGYtaW50ZXJzZWN0aW5nIHBvbHlnb25cbmV4cG9ydCBjb25zdCBjZW50cm9pZE9mUG9seWdvbiA9IChwb2ludHMpID0+IHtcbiAgbGV0IGZpcnN0ID0gcG9pbnRzWzBdLFxuICAgIGxhc3QgPSBwb2ludHNbcG9pbnRzLmxlbmd0aCAtIDFdO1xuICBpZiAoZmlyc3QueCAhPSBsYXN0LnggfHwgZmlyc3QueSAhPSBsYXN0LnkpIHBvaW50cy5wdXNoKGZpcnN0KTtcbiAgbGV0IHR3aWNlYXJlYSA9IDAsXG4gICAgeCA9IDAsXG4gICAgeSA9IDAsXG4gICAgblB0cyA9IHBvaW50cy5sZW5ndGgsXG4gICAgcDEsIHAyLCBmO1xuICBmb3IgKHZhciBpID0gMCwgaiA9IG5QdHMgLSAxOyBpIDwgblB0czsgaiA9IGkrKykge1xuICAgIHAxID0gcG9pbnRzW2ldO1xuICAgIHAyID0gcG9pbnRzW2pdO1xuICAgIGYgPSBwMS54ICogcDIueSAtIHAyLnggKiBwMS55O1xuICAgIHR3aWNlYXJlYSArPSBmO1xuICAgIHggKz0gKHAxLnggKyBwMi54KSAqIGY7XG4gICAgeSArPSAocDEueSArIHAyLnkpICogZjtcbiAgfVxuICBmID0gdHdpY2VhcmVhICogMztcbiAgcmV0dXJuIHtcbiAgICB4OiB4IC8gZixcbiAgICB5OiB5IC8gZlxuICB9O1xufVxuXG4vL2NvbXBhcmUgdHdvIHBvaW50cyB0YWtpbmcgcm91bmRpbmcgZXJyb3JzIGludG8gYWNjb3VudFxuZXhwb3J0IGNvbnN0IGNvbXBhcmVQb2ludHMgPSAocDEsIHAyKSA9PiB7XG4gIGlmICh0eXBlb2YgcDEgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBwMiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBwMSA9IHBvaW50VG9GaXhlZChwMSwgNik7XG4gIHAyID0gcG9pbnRUb0ZpeGVkKHAyLCA2KTtcbiAgaWYgKHAxLnggPT09IHAyLnggJiYgcDEueSA9PT0gcDIueSkgcmV0dXJuIHRydWU7XG4gIGVsc2UgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgY29uc3QgcG9pbnRUb0ZpeGVkID0gKHAsIHBsYWNlcykgPT4ge1xuICByZXR1cm4ge1xuICAgIHg6IHAueC50b0ZpeGVkKHBsYWNlcyksXG4gICAgeTogcC55LnRvRml4ZWQocGxhY2VzKVxuICB9O1xufVxuXG4vL2ZpbmQgYSBwb2ludCBhdCBhIGRpc3RhbmNlIGQgYWxvbmcgdGhlIGNpcmN1bWZlcmVuY2Ugb2Zcbi8vYSBjaXJjbGUgb2YgcmFkaXVzIHIsIGNlbnRyZSBjIGZyb20gYSBwb2ludCBhbHNvXG4vL29uIHRoZSBjaXJjdW1mZXJlbmNlXG5leHBvcnQgY29uc3Qgc3BhY2VkUG9pbnRPbkFyYyA9IChjaXJjbGUsIHBvaW50LCBzcGFjaW5nKSA9PiB7XG4gIGNvbnN0IGNvc1RoZXRhID0gLSgoc3BhY2luZyAqIHNwYWNpbmcpIC8gKDIgKiBjaXJjbGUucmFkaXVzICogY2lyY2xlLnJhZGl1cykgLSAxKTtcbiAgY29uc3Qgc2luVGhldGFQb3MgPSBNYXRoLnNxcnQoMSAtIE1hdGgucG93KGNvc1RoZXRhLCAyKSk7XG4gIGNvbnN0IHNpblRoZXRhTmVnID0gLXNpblRoZXRhUG9zO1xuXG4gIGNvbnN0IHhQb3MgPSBjaXJjbGUuY2VudHJlLnggKyBjb3NUaGV0YSAqIChwb2ludC54IC0gY2lyY2xlLmNlbnRyZS54KSAtIHNpblRoZXRhUG9zICogKHBvaW50LnkgLSBjaXJjbGUuY2VudHJlLnkpO1xuICBjb25zdCB4TmVnID0gY2lyY2xlLmNlbnRyZS54ICsgY29zVGhldGEgKiAocG9pbnQueCAtIGNpcmNsZS5jZW50cmUueCkgLSBzaW5UaGV0YU5lZyAqIChwb2ludC55IC0gY2lyY2xlLmNlbnRyZS55KTtcbiAgY29uc3QgeVBvcyA9IGNpcmNsZS5jZW50cmUueSArIHNpblRoZXRhUG9zICogKHBvaW50LnggLSBjaXJjbGUuY2VudHJlLngpICsgY29zVGhldGEgKiAocG9pbnQueSAtIGNpcmNsZS5jZW50cmUueSk7XG4gIGNvbnN0IHlOZWcgPSBjaXJjbGUuY2VudHJlLnkgKyBzaW5UaGV0YU5lZyAqIChwb2ludC54IC0gY2lyY2xlLmNlbnRyZS54KSArIGNvc1RoZXRhICogKHBvaW50LnkgLSBjaXJjbGUuY2VudHJlLnkpO1xuXG4gIGNvbnN0IHAxID0ge1xuICAgIHg6IHhQb3MsXG4gICAgeTogeVBvc1xuICB9O1xuICBjb25zdCBwMiA9IHtcbiAgICB4OiB4TmVnLFxuICAgIHk6IHlOZWdcbiAgfTtcbiAgcmV0dXJuIHtcbiAgICBwMTogcDEsXG4gICAgcDI6IHAyXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHJhbmRvbUZsb2F0ID0gKG1pbiwgbWF4KSA9PiB7XG4gIHJldHVybiBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW47XG59XG5cbmV4cG9ydCBjb25zdCByYW5kb21JbnQgPSAobWluLCBtYXgpID0+IHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSArIG1pbik7XG59XG4iLCJpbXBvcnQgKiBhcyBFIGZyb20gJy4vZXVjbGlkJztcbi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICpcbi8vICogICBIWVBFUkJPTElDIEZVTkNUSU9OU1xuLy8gKiAgIGEgcGxhY2UgdG8gc3Rhc2ggYWxsIHRoZSBmdW5jdGlvbnMgdGhhdCBhcmUgaHlwZXJib2xpYyBnZW1lb21ldHJpY2FsXG4vLyAqICAgb3BlcmF0aW9uc1xuLy8gKlxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4vL2NhbGN1bGF0ZSBncmVhdENpcmNsZSwgc3RhcnRBbmdsZSBhbmQgZW5kQW5nbGUgZm9yIGh5cGVyYm9saWMgYXJjXG4vL1RPRE8gZGVhbCB3aXRoIGNhc2Ugb2Ygc3RhaWdodCBsaW5lcyB0aHJvdWdoIGNlbnRyZVxuZXhwb3J0IGNvbnN0IGFyYyA9IChwMSwgcDIsIGNpcmNsZSkgPT4ge1xuICBpZiAoRS50aHJvdWdoT3JpZ2luKHAxLCBwMikpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY2lyY2xlOiBjaXJjbGUsXG4gICAgICBzdGFydEFuZ2xlOiAwLFxuICAgICAgZW5kQW5nbGU6IDAsXG4gICAgICBjbG9ja3dpc2U6IGZhbHNlLFxuICAgICAgc3RyYWlnaHRMaW5lOiB0cnVlLFxuICAgIH1cbiAgfVxuICBsZXQgY2xvY2t3aXNlID0gZmFsc2U7XG4gIGxldCBhbHBoYTEsIGFscGhhMiwgc3RhcnRBbmdsZSwgZW5kQW5nbGU7XG4gIGNvbnN0IGMgPSBFLmdyZWF0Q2lyY2xlKHAxLCBwMiwgY2lyY2xlLnJhZGl1cywgY2lyY2xlLmNlbnRyZSk7XG5cbiAgY29uc3Qgb3kgPSBjLmNlbnRyZS55O1xuICBjb25zdCBveCA9IGMuY2VudHJlLng7XG5cbiAgLy9wb2ludCBhdCAwIHJhZGlhbnMgb24gY1xuICBjb25zdCBwMyA9IHtcbiAgICB4OiBveCArIGMucmFkaXVzLFxuICAgIHk6IG95XG4gIH1cblxuICAvL2NhbGN1bGF0ZSB0aGUgcG9zaXRpb24gb2YgZWFjaCBwb2ludCBpbiB0aGUgY2lyY2xlXG4gIGFscGhhMSA9IEUuY2VudHJhbEFuZ2xlKHAzLCBwMSwgYy5yYWRpdXMpO1xuICBhbHBoYTEgPSAocDEueSA8IG95KSA/IDIgKiBNYXRoLlBJIC0gYWxwaGExIDogYWxwaGExO1xuICBhbHBoYTIgPSBFLmNlbnRyYWxBbmdsZShwMywgcDIsIGMucmFkaXVzKTtcbiAgYWxwaGEyID0gKHAyLnkgPCBveSkgPyAyICogTWF0aC5QSSAtIGFscGhhMiA6IGFscGhhMjtcblxuICAvL2Nhc2Ugd2hlcmUgcDEgYWJvdmUgYW5kIHAyIGJlbG93IHRoZSBsaW5lIGMuY2VudHJlIC0+IHAzXG4gIGlmICgocDEueCA+IG94ICYmIHAyLnggPiBveCkgJiYgKHAxLnkgPCBveSAmJiBwMi55ID4gb3kpKSB7XG4gICAgc3RhcnRBbmdsZSA9IGFscGhhMTtcbiAgICBlbmRBbmdsZSA9IGFscGhhMjtcbiAgfVxuICAvL2Nhc2Ugd2hlcmUgcDIgYWJvdmUgYW5kIHAxIGJlbG93IHRoZSBsaW5lIGMuY2VudHJlIC0+IHAzXG4gIGVsc2UgaWYgKChwMS54ID4gb3ggJiYgcDIueCA+IG94KSAmJiAocDEueSA+IG95ICYmIHAyLnkgPCBveSkpIHtcbiAgICBzdGFydEFuZ2xlID0gYWxwaGEyO1xuICAgIGVuZEFuZ2xlID0gYWxwaGExO1xuICAgIGNsb2Nrd2lzZSA9IHRydWU7XG4gIH1cbiAgLy9wb2ludHMgaW4gY2xvY2t3aXNlIG9yZGVyXG4gIGVsc2UgaWYgKGFscGhhMSA+IGFscGhhMikge1xuICAgIHN0YXJ0QW5nbGUgPSBhbHBoYTI7XG4gICAgZW5kQW5nbGUgPSBhbHBoYTE7XG4gICAgY2xvY2t3aXNlID0gdHJ1ZTtcbiAgfVxuICAvL3BvaW50cyBpbiBhbnRpY2xvY2t3aXNlIG9yZGVyXG4gIGVsc2Uge1xuICAgIHN0YXJ0QW5nbGUgPSBhbHBoYTE7XG4gICAgZW5kQW5nbGUgPSBhbHBoYTI7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGNpcmNsZTogYyxcbiAgICBzdGFydEFuZ2xlOiBzdGFydEFuZ2xlLFxuICAgIGVuZEFuZ2xlOiBlbmRBbmdsZSxcbiAgICBjbG9ja3dpc2U6IGNsb2Nrd2lzZSxcbiAgICBzdHJhaWdodExpbmU6IGZhbHNlLFxuICB9XG59XG5cbi8vdHJhbnNsYXRlIGEgc2V0IG9mIHBvaW50cyBhbG9uZyB0aGUgeCBheGlzXG5leHBvcnQgY29uc3QgdHJhbnNsYXRlWCA9IChwb2ludHNBcnJheSwgZGlzdGFuY2UpID0+IHtcbiAgY29uc3QgbCA9IHBvaW50c0FycmF5Lmxlbmd0aDtcbiAgY29uc3QgbmV3UG9pbnRzID0gW107XG4gIGNvbnN0IGUgPSBNYXRoLnBvdyhNYXRoLkUsIGRpc3RhbmNlKTtcbiAgY29uc3QgcG9zID0gZSArIDE7XG4gIGNvbnN0IG5lZyA9IGUgLSAxO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgIGNvbnN0IHggPSBwb3MgKiBwb2ludHNBcnJheVtpXS54ICsgbmVnICogcG9pbnRzQXJyYXlbaV0ueTtcbiAgICBjb25zdCB5ID0gbmVnICogcG9pbnRzQXJyYXlbaV0ueCArIHBvcyAqIHBvaW50c0FycmF5W2ldLnk7XG4gICAgbmV3UG9pbnRzLnB1c2goe1xuICAgICAgeDogeCxcbiAgICAgIHk6IHlcbiAgICB9KVxuICB9XG4gIHJldHVybiBuZXdQb2ludHM7XG59XG5cbi8vcm90YXRlIGEgc2V0IG9mIHBvaW50cyBhYm91dCBhIHBvaW50IGJ5IGEgZ2l2ZW4gYW5nbGVcbi8vY2xvY2t3aXNlIGRlZmF1bHRzIHRvIGZhbHNlXG5leHBvcnQgY29uc3Qgcm90YXRpb24gPSAocG9pbnRzQXJyYXksIHBvaW50LCBhbmdsZSwgY2xvY2t3aXNlKSA9PiB7XG5cbn1cblxuLy9yZWZsZWN0IGEgc2V0IG9mIHBvaW50cyBhY3Jvc3MgYSBoeXBlcmJvbGljIGFyY1xuLy9UT0RPIGFkZCBjYXNlIHdoZXJlIHJlZmxlY3Rpb24gaXMgYWNyb3NzIHN0cmFpZ2h0IGxpbmVcbmV4cG9ydCBjb25zdCByZWZsZWN0ID0gKHBvaW50c0FycmF5LCBwMSwgcDIsIGNpcmNsZSkgPT4ge1xuICBjb25zdCBsID0gcG9pbnRzQXJyYXkubGVuZ3RoO1xuICBjb25zdCBhID0gYXJjKHAxLCBwMiwgY2lyY2xlKTtcbiAgY29uc3QgbmV3UG9pbnRzID0gW107XG5cbiAgaWYgKCFhLnN0cmFpZ2h0TGluZSkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICBuZXdQb2ludHMucHVzaChFLmludmVyc2UocG9pbnRzQXJyYXlbaV0sIGEuY2lyY2xlLnJhZGl1cywgYS5jaXJjbGUuY2VudHJlKSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICAvL2NvbnNvbGUuZXJyb3IoJ3JlZmxlY3Rpb24gYWNyb3NzIHN0cmFpZ2h0IGxpbmUgbm90IGltcGxlbWVudGVkISAnKVxuICAgICAgbmV3UG9pbnRzLnB1c2goRS5saW5lUmVmbGVjdGlvbihwMSxwMixwb2ludHNBcnJheVtpXSkpO1xuICAgIH1cbiAgfVxuICBjb25zb2xlLmxvZyhuZXdQb2ludHMpO1xuICByZXR1cm4gbmV3UG9pbnRzO1xufVxuXG5leHBvcnQgY29uc3QgcG9pbmNhcmVUb1dlaWVyc3RyYXNzID0gKHBvaW50MkQpID0+IHtcbiAgY29uc3QgZmFjdG9yID0gMSAvICgxIC0gcG9pbnQyRC54ICogcG9pbnQyRC54IC0gcG9pbnQyRC55ICogcG9pbnQyRC55KTtcbiAgcmV0dXJuIHtcbiAgICB4OiAyICogZmFjdG9yICogcG9pbnQyRC54LFxuICAgIHk6IDIgKiBmYWN0b3IgKiBwb2ludDJELnksXG4gICAgejogZmFjdG9yICogKDEgKyBwb2ludDJELnggKiBwb2ludDJELnggKyBwb2ludDJELnkgKiBwb2ludDJELnkpXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHdlaWVyc3RyYXNzVG9Qb2luY2FyZSA9IChwb2ludDNEKSA9PiB7XG4gIGNvbnN0IGZhY3RvciA9IDEgLyAoMSArIHBvaW50M0Queik7XG4gIHJldHVybiB7XG4gICAgeDogZmFjdG9yICogcG9pbnQzRC54LFxuICAgIHk6IGZhY3RvciAqIHBvaW50M0QueVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCByb3RhdGVBYm91dE9yaWdpbldlaWVyc3RyYXNzID0gKHBvaW50M0QsIGFuZ2xlKSA9PiB7XG4gIHJldHVybiB7XG4gICAgeDogTWF0aC5jb3MoYW5nbGUpICogcG9pbnQzRC54IC0gTWF0aC5zaW4oYW5nbGUpICogcG9pbnQzRC55LFxuICAgIHk6IE1hdGguc2luKGFuZ2xlKSAqIHBvaW50M0QueCArIE1hdGguY29zKGFuZ2xlKSAqIHBvaW50M0QueSxcbiAgICB6OiBwb2ludDNELnpcbiAgfVxufVxuXG5leHBvcnQgY29uc3Qgcm90YXRlQWJvdXRPcmlnaW5Qb2luY2FyZSA9IChwb2ludDJELCBhbmdsZSkgPT4ge1xuICByZXR1cm4ge1xuICAgIHg6IE1hdGguY29zKGFuZ2xlKSAqIHBvaW50MkQueCAtIE1hdGguc2luKGFuZ2xlKSAqIHBvaW50MkQueSxcbiAgICB5OiBNYXRoLnNpbihhbmdsZSkgKiBwb2ludDJELnggKyBNYXRoLmNvcyhhbmdsZSkgKiBwb2ludDJELnksXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHJvdGF0ZVBnb25BYm91dE9yaWdpbiA9IChwb2ludHMyREFycmF5LCBhbmdsZSkgPT4ge1xuICBjb25zdCBsID0gcG9pbnRzMkRBcnJheS5sZW5ndGg7XG4gIGNvbnN0IHJvdGF0ZWRQb2ludHMyREFycmF5ID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgbGV0IHBvaW50ID0gcm90YXRlQWJvdXRPcmlnaW5Qb2luY2FyZShwb2ludHMyREFycmF5W2ldLCBhbmdsZSk7XG4gICAgcm90YXRlZFBvaW50czJEQXJyYXkucHVzaChwb2ludCk7XG4gIH1cbiAgcmV0dXJuIHJvdGF0ZWRQb2ludHMyREFycmF5O1xufVxuXG4vL3doZW4gdGhlIHBvaW50IHAxIGlzIHRyYW5zbGF0ZWQgdG8gdGhlIG9yaWdpbiwgdGhlIHBvaW50IHAyXG4vL2lzIHRyYW5zbGF0ZWQgYWNjb3JkaW5nIHRvIHRoaXMgZm9ybXVsYVxuLy9odHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Qb2luY2FyJUMzJUE5X2Rpc2tfbW9kZWwjSXNvbWV0cmljX1RyYW5zZm9ybWF0aW9uc1xuZXhwb3J0IGNvbnN0IHRyYW5zbGF0ZVBvaW5jYXJlID0gKHAxLCBwMikgPT4ge1xuICBjb25zdCBkb3QgPSBwMS54ICogcDIueCArIHAxLnkgKiBwMi55O1xuICBjb25zdCBub3JtU3F1YXJlZFAxID0gTWF0aC5wb3coTWF0aC5zcXJ0KHAxLnggKiBwMS54ICsgcDEueSAqIHAxLnkpLCAyKTtcbiAgY29uc3Qgbm9ybVNxdWFyZWRQMiA9IE1hdGgucG93KE1hdGguc3FydChwMi54ICogcDIueCArIHAyLnkgKiBwMi55KSwgMik7XG4gIGNvbnN0IGRlbm9taW5hdG9yID0gMSArIDIgKiBkb3QgKyBub3JtU3F1YXJlZFAxICogbm9ybVNxdWFyZWRQMjtcblxuICBjb25zdCBwMUZhY3RvciA9ICgxICsgMiAqIGRvdCArIG5vcm1TcXVhcmVkUDIpIC8gZGVub21pbmF0b3I7XG4gIGNvbnN0IHAyRmFjdG9yID0gKDEgLSBub3JtU3F1YXJlZFAxKSAvIGRlbm9taW5hdG9yO1xuXG4gIGNvbnN0IHggPSBwMUZhY3RvciAqIHAxLnggKyBwMkZhY3RvciAqIHAyLng7XG4gIGNvbnN0IHkgPSBwMUZhY3RvciAqIHAxLnkgKyBwMkZhY3RvciAqIHAyLnk7XG5cbiAgcmV0dXJuIHtcbiAgICB4OiB4LFxuICAgIHk6IHlcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgaW52ZXJzZVRyYW5zbGF0ZVBvaW5jYXJlID0gKHAxLCBwMikgPT4ge1xuXG59XG4iLCJpbXBvcnQgeyBSZWd1bGFyVGVzc2VsYXRpb24gfSBmcm9tICcuL3JlZ3VsYXJUZXNzZWxhdGlvbic7XG5pbXBvcnQgKiBhcyBFIGZyb20gJy4vZXVjbGlkJztcbmltcG9ydCB7IERpc2sgfSBmcm9tICcuL2Rpc2snO1xuXG5cbi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICpcbi8vICogICBTRVRVUFxuLy8gKlxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4vL2NvbnN0IGRpc2sgPSBuZXcgRGlzaygpO1xuXG5jb25zdCB0ZXNzZWxhdGlvbiA9IG5ldyBSZWd1bGFyVGVzc2VsYXRpb24oNCwgNSwgMCwgJ3JlZCcpO1xuIiwiaW1wb3J0ICogYXMgRSBmcm9tICcuL2V1Y2xpZCc7XG5pbXBvcnQgKiBhcyBIIGZyb20gJy4vaHlwZXJib2xpYyc7XG5pbXBvcnQge1xuICBEaXNrXG59XG5mcm9tICcuL2Rpc2snO1xuXG5cbi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICogICAgVEVTU0VMQVRJT04gQ0xBU1Ncbi8vICogICAgQ3JlYXRlcyBhIHJlZ3VsYXIgVGVzc2VsYXRpb24gb2YgdGhlIFBvaW5jYXJlIERpc2tcbi8vICogICAgcTogbnVtYmVyIG9mIHAtZ29ucyBtZWV0aW5nIGF0IGVhY2ggdmVydGV4XG4vLyAqICAgIHA6IG51bWJlciBvZiBzaWRlcyBvZiBwLWdvblxuLy8gKiAgICB1c2luZyB0aGUgdGVjaG5pcXVlcyBjcmVhdGVkIGJ5IENveGV0ZXIgYW5kIER1bmhhbVxuLy8gKlxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuZXhwb3J0IGNsYXNzIFJlZ3VsYXJUZXNzZWxhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHAsIHEsIHJvdGF0aW9uLCBjb2xvdXIsIG1heExheWVycykge1xuICAgIHRoaXMuZGlzayA9IG5ldyBEaXNrKCk7XG5cbiAgICB0aGlzLmNlbnRyZSA9IHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwXG4gICAgfVxuICAgIHRoaXMucCA9IHA7XG4gICAgdGhpcy5xID0gcTtcbiAgICB0aGlzLmNvbG91ciA9IGNvbG91ciB8fCAnYmxhY2snO1xuICAgIHRoaXMucm90YXRpb24gPSByb3RhdGlvbiB8fCAwO1xuICAgIHRoaXMubWF4TGF5ZXJzID0gbWF4TGF5ZXJzIHx8IDU7XG5cbiAgICBpZiAodGhpcy5jaGVja1BhcmFtcygpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZXZlbnQpID0+IHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJyk7XG4gICAgICB0aGlzLmluaXQoKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgdGhpcy5pbml0KCk7XG4gICAgfSwgZmFsc2UpO1xuXG5cblxuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLnJhZGl1cyA9IHRoaXMuZGlzay5nZXRSYWRpdXMoKTtcbiAgICB0aGlzLmZyID0gdGhpcy5mdW5kYW1lbnRhbFJlZ2lvbigpO1xuICAgIHRoaXMudGVzdGluZygpO1xuICB9XG5cbiAgdGVzdGluZygpIHtcblxuICAgIHRoaXMuZGlzay5wb2x5Z29uKHRoaXMuZnIsIDB4ZTgwMzQ4KTtcbiAgICBjb25zdCBwb2x5MiA9IEgucmVmbGVjdCh0aGlzLmZyLCB0aGlzLmZyWzBdLCB0aGlzLmZyWzFdLCB0aGlzLmRpc2suY2lyY2xlKTtcbiAgICAvL2NvbnNvbGUudGFibGUocG9seTIpO1xuICAgIHRoaXMuZGlzay5wb2x5Z29uKHBvbHkyLCAweGMzMTY3ZSk7XG5cbiAgICBjb25zdCBwb2x5MyA9IEgucmVmbGVjdChwb2x5MiwgcG9seTJbMF0sIHBvbHkyWzJdLCB0aGlzLmRpc2suY2lyY2xlKTtcbiAgICB0aGlzLmRpc2sucG9seWdvbihwb2x5MywgMHhkMmJlMTEpO1xuXG4gICAgbGV0IG51bSA9IDg7XG4gICAgZm9yKGxldCBpID0wOyBpIDwgbnVtOyBpKyspe1xuICAgICAgLy9sZXQgcG9seSA9IEgucm90YXRlUGdvbkFib3V0T3JpZ2luKHBvbHkyLCAoMipNYXRoLlBJL251bSkqKGkrMSkpO1xuICAgICAgLy90aGlzLmRpc2sucG9seWdvbihwb2x5LCBFLnJhbmRvbUludCgxMDAwLCAxNDc3NzIxNSkpO1xuICAgICAgLy9wb2x5ID0gSC5yb3RhdGVQZ29uQWJvdXRPcmlnaW4odGhpcy5mciwgKDIqTWF0aC5QSS9udW0pKihpKzEpKTtcbiAgICAgIC8vdGhpcy5kaXNrLnBvbHlnb24ocG9seSwgRS5yYW5kb21JbnQoMTAwMCwgMTQ3NzcyMTUpKTtcbiAgICB9XG4gIH1cblxuICAvL2NhbGN1bGF0ZSBmaXJzdCBwb2ludCBvZiBmdW5kYW1lbnRhbCBwb2x5Z29uIHVzaW5nIENveGV0ZXIncyBtZXRob2RcbiAgZnVuZGFtZW50YWxSZWdpb24oKSB7XG4gICAgY29uc3QgcyA9IE1hdGguc2luKE1hdGguUEkgLyB0aGlzLnApO1xuICAgIGNvbnN0IHQgPSBNYXRoLmNvcyhNYXRoLlBJIC8gdGhpcy5xKTtcbiAgICAvL211bHRpcGx5IHRoZXNlIGJ5IHRoZSBkaXNrcyByYWRpdXMgKENveGV0ZXIgdXNlZCB1bml0IGRpc2spO1xuICAgIGNvbnN0IHIgPSAxIC8gTWF0aC5zcXJ0KCh0ICogdCkgLyAocyAqIHMpIC0gMSkgKiB0aGlzLnJhZGl1cztcbiAgICBjb25zdCBkID0gMSAvIE1hdGguc3FydCgxIC0gKHMgKiBzKSAvICh0ICogdCkpICogdGhpcy5yYWRpdXM7XG4gICAgY29uc3QgYiA9IHtcbiAgICAgIHg6IHRoaXMucmFkaXVzICogTWF0aC5jb3MoTWF0aC5QSSAvIHRoaXMucCksXG4gICAgICB5OiAtdGhpcy5yYWRpdXMgKiBNYXRoLnNpbihNYXRoLlBJIC8gdGhpcy5wKVxuICAgIH1cbiAgICBjb25zdCBjZW50cmUgPSB7XG4gICAgICB4OiBkLFxuICAgICAgeTogMFxuICAgIH07XG4gICAgLy90aGVyZSB3aWxsIGJlIHR3byBwb2ludHMgb2YgaW50ZXJzZWN0aW9uLCBvZiB3aGljaCB3ZSB3YW50IHRoZSBmaXJzdFxuICAgIGNvbnN0IHAxID0gRS5jaXJjbGVMaW5lSW50ZXJzZWN0KGNlbnRyZSwgciwgdGhpcy5kaXNrLmNlbnRyZSwgYikucDE7XG5cbiAgICBjb25zdCBwMiA9IHtcbiAgICAgIHg6IGQgLSByLFxuICAgICAgeTogMFxuICAgIH07XG5cbiAgICBjb25zdCBwb2ludHMgPSBbdGhpcy5kaXNrLmNlbnRyZSwgcDEsIHAyXTtcblxuICAgIHJldHVybiBwb2ludHM7XG4gIH1cblxuICAvL1RoZSB0ZXNzZWxhdGlvbiByZXF1aXJlcyB0aGF0IChwLTIpKHEtMikgPiA0IHRvIHdvcmsgKG90aGVyd2lzZSBpdCBpc1xuICAvLyBlaXRoZXIgYW4gZWxsaXB0aWNhbCBvciBldWNsaWRlYW4gdGVzc2VsYXRpb24pO1xuICBjaGVja1BhcmFtcygpIHtcbiAgICBpZiAodGhpcy5tYXhMYXllcnMgPCAwIHx8IGlzTmFOKHRoaXMubWF4TGF5ZXJzKSkge1xuICAgICAgY29uc29sZS5lcnJvcignbWF4TGF5ZXJzIG11c3QgYmUgZ3JlYXRlciB0aGFuIDAnKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAoKHRoaXMucCAtIDIpICogKHRoaXMucSAtIDIpIDw9IDQpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0h5cGVyYm9saWMgdGVzc2VsYXRpb25zIHJlcXVpcmUgdGhhdCAocC0xKShxLTIpIDwgNCEnKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvL0ZvciBub3cgcmVxdWlyZSBwLHEgPiAzLFxuICAgIC8vVE9ETyBpbXBsZW1lbnQgc3BlY2lhbCBjYXNlcyBmb3IgcSA9IDMgb3IgcCA9IDNcbiAgICBlbHNlIGlmICh0aGlzLnEgPD0gMyB8fCBpc05hTih0aGlzLnEpKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdUZXNzZWxhdGlvbiBlcnJvcjogYXQgbGVhc3QgMyBwLWdvbnMgbXVzdCBtZWV0IFxcXG4gICAgICAgICAgICAgICAgICAgIGF0IGVhY2ggdmVydGV4IScpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIGlmICh0aGlzLnAgPD0gMyB8fCBpc05hTih0aGlzLnApKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdUZXNzZWxhdGlvbiBlcnJvcjogcG9seWdvbiBuZWVkcyBhdCBsZWFzdCAzIHNpZGVzIScpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbn1cbiIsIi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICpcbi8vICogIFRIUkVFIEpTIENMQVNTXG4vLyAqXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5leHBvcnQgY2xhc3MgVGhyZWVKUyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZXZlbnQpID0+IHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJyk7XG4gICAgICB0aGlzLmluaXQoKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgLy90aGlzLmNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgIC8vdGhpcy5jYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuICAgICAgLy90aGlzLnJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG5cbiAgICAgIHRoaXMucmVzZXQoKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy5zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuICAgIHRoaXMuaW5pdENhbWVyYSgpO1xuXG4gICAgdGhpcy5pbml0TGlnaHRpbmcoKTtcblxuICAgIHRoaXMuYXhlcygpO1xuXG4gICAgdGhpcy5pbml0UmVuZGVyZXIoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuaWQpOyAvLyBTdG9wIHRoZSBhbmltYXRpb25cbiAgICB0aGlzLnJlbmRlcmVyLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZGJsY2xpY2snLCBudWxsLCBmYWxzZSk7IC8vcmVtb3ZlIGxpc3RlbmVyIHRvIHJlbmRlclxuICAgIHRoaXMuc2NlbmUgPSBudWxsO1xuICAgIHRoaXMucHJvamVjdG9yID0gbnVsbDtcbiAgICB0aGlzLmNhbWVyYSA9IG51bGw7XG4gICAgdGhpcy5jb250cm9scyA9IG51bGw7XG5cbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2NhbnZhcycpO1xuICAgIGZvciAobGV0IGluZGV4ID0gZWxlbWVudC5sZW5ndGggLSAxOyBpbmRleCA+PSAwOyBpbmRleC0tKSB7XG4gICAgICBlbGVtZW50W2luZGV4XS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnRbaW5kZXhdKTtcbiAgICB9XG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBpbml0Q2FtZXJhKCkge1xuICAgIHRoaXMuY2FtZXJhID0gbmV3IFRIUkVFLk9ydGhvZ3JhcGhpY0NhbWVyYSh3aW5kb3cuaW5uZXJXaWR0aCAvIC0yLFxuICAgICAgd2luZG93LmlubmVyV2lkdGggLyAyLCB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyLCB3aW5kb3cuaW5uZXJIZWlnaHQgLyAtMiwgLTIsIDEpO1xuICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMuY2FtZXJhKTtcbiAgICB0aGlzLmNhbWVyYS5wb3NpdGlvbi54ID0gMDtcbiAgICB0aGlzLmNhbWVyYS5wb3NpdGlvbi55ID0gMDtcblxuICAgIHRoaXMuY2FtZXJhLnBvc2l0aW9uLnogPSAxO1xuICB9XG5cbiAgaW5pdExpZ2h0aW5nKCkge1xuICAgIC8vY29uc3Qgc3BvdExpZ2h0ID0gbmV3IFRIUkVFLlNwb3RMaWdodCgweGZmZmZmZik7XG4gICAgLy9zcG90TGlnaHQucG9zaXRpb24uc2V0KDAsIDAsIDEwMCk7XG4gICAgLy90aGlzLnNjZW5lLmFkZChzcG90TGlnaHQpO1xuICAgIGNvbnN0IGFtYmllbnRMaWdodCA9IG5ldyBUSFJFRS5BbWJpZW50TGlnaHQoMHhmZmZmZmYpO1xuICAgIHRoaXMuc2NlbmUuYWRkKGFtYmllbnRMaWdodCk7XG4gIH1cblxuICBpbml0UmVuZGVyZXIoKSB7XG4gICAgdGhpcy5yZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHtcbiAgICAgIGFudGlhbGlhczogdHJ1ZSxcbiAgICB9KTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldENsZWFyQ29sb3IoMHhmZmZmZmYsIDEuMCk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5yZW5kZXJlci5kb21FbGVtZW50KTtcblxuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICAvL2JlaGluZDogdHJ1ZS9mYWxzZVxuICBkaXNrKGNlbnRyZSwgcmFkaXVzLCBjb2xvciwgYmVoaW5kKSB7XG4gICAgaWYgKGNvbG9yID09PSB1bmRlZmluZWQpIGNvbG9yID0gMHhmZmZmZmY7XG5cbiAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5DaXJjbGVHZW9tZXRyeShyYWRpdXMsIDEwMCwgMCwgMiAqIE1hdGguUEkpO1xuICAgIGNvbnN0IGNpcmNsZSA9IHRoaXMuY3JlYXRlTWVzaChnZW9tZXRyeSwgY29sb3IpO1xuICAgIGNpcmNsZS5wb3NpdGlvbi54ID0gY2VudHJlLng7XG4gICAgY2lyY2xlLnBvc2l0aW9uLnkgPSBjZW50cmUueTtcbiAgICBpZiAoIWJlaGluZCkge1xuICAgICAgY2lyY2xlLnBvc2l0aW9uLnogPSAxO1xuICAgIH1cblxuICAgIHRoaXMuc2NlbmUuYWRkKGNpcmNsZSk7XG4gIH1cblxuICBzZWdtZW50KGNpcmNsZSwgYWxwaGEsIG9mZnNldCwgY29sb3IpIHtcbiAgICBpZiAoY29sb3IgPT09IHVuZGVmaW5lZCkgY29sb3IgPSAweGZmZmZmZjtcblxuICAgIGNvbnN0IGN1cnZlID0gbmV3IFRIUkVFLkVsbGlwc2VDdXJ2ZShcbiAgICAgIGNpcmNsZS5jZW50cmUueCwgY2lyY2xlLmNlbnRyZS55LCAvLyBheCwgYVlcbiAgICAgIGNpcmNsZS5yYWRpdXMsIGNpcmNsZS5yYWRpdXMsIC8vIHhSYWRpdXMsIHlSYWRpdXNcbiAgICAgIGFscGhhLCBvZmZzZXQsIC8vIGFTdGFydEFuZ2xlLCBhRW5kQW5nbGVcbiAgICAgIGZhbHNlIC8vIGFDbG9ja3dpc2VcbiAgICApO1xuXG4gICAgY29uc3QgcG9pbnRzID0gY3VydmUuZ2V0U3BhY2VkUG9pbnRzKDEwMCk7XG5cbiAgICBjb25zdCBwYXRoID0gbmV3IFRIUkVFLlBhdGgoKTtcbiAgICBjb25zdCBnZW9tZXRyeSA9IHBhdGguY3JlYXRlR2VvbWV0cnkocG9pbnRzKTtcblxuICAgIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKHtcbiAgICAgIGNvbG9yOiBjb2xvclxuICAgIH0pO1xuICAgIGNvbnN0IHMgPSBuZXcgVEhSRUUuTGluZShnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXG4gICAgdGhpcy5zY2VuZS5hZGQocyk7XG4gIH1cblxuICBsaW5lKHN0YXJ0LCBlbmQsIGNvbG9yKSB7XG4gICAgaWYgKGNvbG9yID09PSB1bmRlZmluZWQpIGNvbG9yID0gMHhmZmZmZmY7XG5cbiAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5HZW9tZXRyeSgpO1xuXG4gICAgZ2VvbWV0cnkudmVydGljZXMucHVzaChcbiAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKHN0YXJ0LngsIHN0YXJ0LnksIDApLFxuICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoZW5kLngsIGVuZC55LCAwKVxuICAgICk7XG4gICAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoe1xuICAgICAgY29sb3I6IGNvbG9yXG4gICAgfSk7XG4gICAgY29uc3QgbCA9IG5ldyBUSFJFRS5MaW5lKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgdGhpcy5zY2VuZS5hZGQobCk7XG4gIH1cblxuICBwb2x5Z29uKHZlcnRpY2VzLCBjb2xvciwgdGV4dHVyZSwgd2lyZWZyYW1lKSB7XG4gICAgaWYgKGNvbG9yID09PSB1bmRlZmluZWQpIGNvbG9yID0gMHhmZmZmZmY7XG5cbiAgICBjb25zdCBwb2x5ID0gbmV3IFRIUkVFLlNoYXBlKCk7XG4gICAgcG9seS5tb3ZlVG8odmVydGljZXNbMF0ueCwgdmVydGljZXNbMF0ueSk7XG5cbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IHZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBwb2x5LmxpbmVUbyh2ZXJ0aWNlc1tpXS54LCB2ZXJ0aWNlc1tpXS55KVxuICAgIH1cblxuICAgIHBvbHkubGluZVRvKHZlcnRpY2VzWzBdLngsIHZlcnRpY2VzWzBdLnkpO1xuXG4gICAgY29uc3QgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuU2hhcGVHZW9tZXRyeShwb2x5KTtcblxuICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMuY3JlYXRlTWVzaChnZW9tZXRyeSwgY29sb3IsIHRleHR1cmUsIHdpcmVmcmFtZSkpO1xuICB9XG5cbiAgY3JlYXRlTWVzaChnZW9tZXRyeSwgY29sb3IsIGltYWdlVVJMLCB3aXJlZnJhbWUpIHtcbiAgICBpZih3aXJlZnJhbWUgPT09IHVuZGVmaW5lZCkgd2lyZWZyYW1lID0gZmFsc2U7XG4gICAgaWYgKGNvbG9yID09PSB1bmRlZmluZWQpIGNvbG9yID0gMHhmZmZmZmY7XG5cbiAgICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XG4gICAgICBjb2xvcjogY29sb3IsXG4gICAgICB3aXJlZnJhbWU6IHdpcmVmcmFtZVxuICAgIH0pO1xuXG4gICAgaWYgKGltYWdlVVJMKSB7XG4gICAgICBjb25zdCB0ZXh0dXJlTG9hZGVyID0gbmV3IFRIUkVFLlRleHR1cmVMb2FkZXIoKTtcblxuICAgICAgLy9sb2FkIHRleHR1cmUgYW5kIGFwcGx5IHRvIG1hdGVyaWFsIGluIGNhbGxiYWNrXG4gICAgICBjb25zdCB0ZXh0dXJlID0gdGV4dHVyZUxvYWRlci5sb2FkKGltYWdlVVJMLCAodGV4KSA9PiB7fSk7XG4gICAgICB0ZXh0dXJlLnJlcGVhdC5zZXQoMC4wNSwgMC4wNSk7XG4gICAgICBtYXRlcmlhbC5tYXAgPSB0ZXh0dXJlO1xuICAgICAgbWF0ZXJpYWwubWFwLndyYXBUID0gVEhSRUUuUmVwZWF0V3JhcHBpbmc7XG4gICAgICBtYXRlcmlhbC5tYXAud3JhcFMgPSBUSFJFRS5SZXBlYXRXcmFwcGluZztcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgfVxuXG4gIGF4ZXMoKSB7XG4gICAgY29uc3QgeHl6ID0gbmV3IFRIUkVFLkF4aXNIZWxwZXIoMjApO1xuICAgIHRoaXMuc2NlbmUuYWRkKHh5eik7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHRoaXMucmVuZGVyKClcbiAgICB9KTtcblxuICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUsIHRoaXMuY2FtZXJhKTtcbiAgfVxuXG59XG4iXX0=
