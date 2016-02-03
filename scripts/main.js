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
  if (m > 999999) {
    return {
      x: p3.x,
      y: -p3.y
    };
  }
  //reflection in x axis
  else if (m.toFixed(6) == 0) {
      return {
        x: -p3.x,
        y: p3.y
      };
    }
    //reflection in arbitrary line
    else {
        var c = p1.y - m * p1.x;
        var d = (p3.x + (p3.y - c) * m) / (1 + m * m);
        var x = 2 * d - p3.x;
        var y = 2 * d * m - p3.y + 2 * c;
        return {
          x: x,
          y: y
        };
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

},{"./point":5}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inverseTranslatePoincare = exports.translatePoincare = exports.rotatePgonAboutOrigin = exports.rotateAboutOriginPoincare = exports.rotateAboutOriginWeierstrass = exports.weierstrassToPoincare = exports.poincareToWeierstrass = exports.reflect = exports.rotation = exports.translateX = exports.arc = undefined;

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

},{"./euclid":2,"./point":5}],4:[function(require,module,exports){
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

},{"./disk":1,"./euclid":2,"./regularTesselation":6}],5:[function(require,module,exports){
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

      this.disk.polygon(this.fr, E.randomInt(10000, 14777215));
      var poly2 = H.reflect(this.fr, this.fr[0], this.fr[2], this.disk.circle);
      console.table(poly2);
      this.disk.polygon(poly2, E.randomInt(10000, 14777215));

      var poly3 = H.reflect(poly2, poly2[0], poly2[1], this.disk.circle);
      console.table(poly3);
      this.disk.polygon(poly3, E.randomInt(10000, 14777215));

      var poly4 = H.reflect(poly3, poly3[0], poly3[2], this.disk.circle);
      console.table(poly4);
      this.disk.polygon(poly4, E.randomInt(10000, 14777215));

      var poly5 = H.reflect(poly4, poly4[0], poly4[1], this.disk.circle);
      console.table(poly5);
      this.disk.polygon(poly5, E.randomInt(10000, 14777215));

      var poly6 = H.reflect(poly5, poly5[0], poly5[2], this.disk.circle);
      console.table(poly6);
      this.disk.polygon(poly6, E.randomInt(10000, 14777215));

      var poly7 = H.reflect(poly6, poly6[0], poly6[1], this.disk.circle);
      console.table(poly7);
      this.disk.polygon(poly7, E.randomInt(10000, 14777215));

      var poly8 = H.reflect(poly7, poly7[0], poly7[2], this.disk.circle);
      console.table(poly8);
      this.disk.polygon(poly8, E.randomInt(10000, 14777215));

      var num = 8;
      for (var i = 0; i < num; i++) {
        var poly = H.rotatePgonAboutOrigin(poly2, 2 * Math.PI / num * (i + 1));
        this.disk.polygon(poly, E.randomInt(10000, 14777215));
        poly = H.rotatePgonAboutOrigin(this.fr, 2 * Math.PI / num * (i + 1));
        this.disk.polygon(poly, E.randomInt(10000, 14777215));
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

},{"./disk":1,"./euclid":2,"./hyperbolic":3,"./point":5}],7:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJlczIwMTUvZGlzay5qcyIsImVzMjAxNS9ldWNsaWQuanMiLCJlczIwMTUvaHlwZXJib2xpYy5qcyIsImVzMjAxNS9tYWluLmpzIiwiZXMyMDE1L3BvaW50LmpzIiwiZXMyMDE1L3JlZ3VsYXJUZXNzZWxhdGlvbi5qcyIsImVzMjAxNS90aHJlZWpzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7SUNBWSxDQUFDOzs7O0lBQ0QsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBV0EsSUFBSSxXQUFKLElBQUk7QUFDZixXQURXLElBQUksR0FDRDs7OzBCQURILElBQUk7O0FBRWIsUUFBSSxDQUFDLElBQUksR0FBRyxhQVhQLE9BQU8sRUFXYSxDQUFDOztBQUUxQixVQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQ3pDLFlBQU0sQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNuQyxZQUFLLElBQUksRUFBRSxDQUFDO0tBQ2IsRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFVixVQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFlBQU07QUFDdEMsWUFBSyxJQUFJLEVBQUUsQ0FBQztLQUNiLEVBQUUsS0FBSyxDQUFDLENBQUM7R0FFWDs7ZUFiVSxJQUFJOzsyQkFlUjtBQUNMLFVBQUksQ0FBQyxNQUFNLEdBQUc7QUFDWixTQUFDLEVBQUUsQ0FBQztBQUNKLFNBQUMsRUFBRSxDQUFDO09BQ0w7OztBQUFBLEFBR0QsVUFBSSxDQUFDLE1BQU0sR0FBRyxBQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFdBQVcsR0FBSSxBQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxHQUFJLENBQUMsR0FBRyxBQUFDLE1BQU0sQ0FBQyxXQUFXLEdBQUcsQ0FBQyxHQUFJLENBQUMsQ0FBQzs7QUFFcEgsVUFBSSxDQUFDLE1BQU0sR0FBRztBQUNaLGNBQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtBQUNuQixjQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07T0FDcEI7Ozs7O0FBQUEsQUFLRCxVQUFJLENBQUMsUUFBUSxFQUFFOzs7QUFBQyxLQUdqQjs7OzhCQUVTO0FBQ1IsVUFBTSxFQUFFLEdBQUc7QUFDVCxTQUFDLEVBQUUsR0FBRztBQUNOLFNBQUMsRUFBRSxHQUFHO09BQ1AsQ0FBQztBQUNGLFVBQU0sRUFBRSxHQUFHO0FBQ1QsU0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFNBQUMsRUFBRSxHQUFHO09BQ1AsQ0FBQztBQUNGLFVBQU0sRUFBRSxHQUFHO0FBQ1QsU0FBQyxFQUFFLENBQUMsRUFBRTtBQUNOLFNBQUMsRUFBRSxDQUFDLEdBQUc7T0FDUixDQUFDOztBQUVGLFVBQU0sRUFBRSxHQUFHO0FBQ1QsU0FBQyxFQUFFLENBQUMsR0FBRztBQUNQLFNBQUMsRUFBRSxDQUFDLEdBQUc7T0FDUixDQUFDOztBQUVGLFVBQU0sRUFBRSxHQUFHO0FBQ1QsU0FBQyxFQUFFLEdBQUc7QUFDTixTQUFDLEVBQUUsQ0FBQyxHQUFHO09BQ1IsQ0FBQztBQUNGLFVBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUM1QixVQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDNUIsVUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQzVCLFVBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUM1QixVQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDOzs7Ozs7Ozs7O0FBQUMsQUFlNUIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUM7O0FBQUMsS0FFOUM7OztnQ0FDVztBQUNWLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztLQUNwQjs7Ozs7OytCQUdVO0FBQ1QsVUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUMxRDs7OzBCQUVLLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO0FBQzNCLFVBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQzlDOzs7Ozs7O3lCQUlJLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFO0FBQ2xCLFVBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUMxRCxVQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFL0UsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUE7S0FDMUM7Ozs7Ozs0QkFHTyxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRTs7QUFFdEIsVUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRTtBQUM1QixlQUFPLEtBQUssQ0FBQTtPQUNiO0FBQ0QsVUFBTSxHQUFHLEdBQUcsTUFBTSxJQUFJLFFBQVEsQ0FBQztBQUMvQixVQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUV2QyxVQUFJLENBQUMsQ0FBQyxZQUFZLEVBQUU7QUFDbEIsWUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztPQUM3QixNQUFNO0FBQ0wsWUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7T0FDckU7S0FDRjs7O21DQUVjLFFBQVEsRUFBRSxNQUFNLEVBQUU7QUFDL0IsVUFBTSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztBQUMxQixXQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzFCLFlBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsR0FBSSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztPQUMxRDtLQUNGOzs7Ozs7Ozs7NEJBTU8sUUFBUSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUU7QUFDaEMsVUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLFVBQU0sT0FBTyxHQUFHLENBQUMsQ0FBQztBQUNsQixVQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO0FBQzFCLFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDMUIsWUFBSSxDQUFDLFlBQUEsQ0FBQztBQUNOLFlBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsR0FBSSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDOzs7QUFBQyxBQUduRSxZQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRTs7QUFFckIsY0FBSSxHQUFHLENBQUMsU0FBUyxFQUFFO0FBQ2pCLGFBQUMsR0FBRyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDO1dBQzdELE1BQU07QUFDTCxhQUFDLEdBQUcsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQztXQUM3RDtBQUNELGdCQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUVmLGlCQUFPLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsR0FBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sRUFBRTs7QUFFckQsZ0JBQUksR0FBRyxDQUFDLFNBQVMsRUFBRTtBQUNqQixlQUFDLEdBQUcsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQzthQUNuRCxNQUFNO0FBQ0wsZUFBQyxHQUFHLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUM7YUFDbkQ7O0FBRUQsa0JBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7V0FDaEI7QUFDRCxnQkFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs7OztBQUNwQyxhQUdHO0FBQ0Ysa0JBQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxHQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7V0FDcEM7T0FDRjs7QUFFRCxVQUFJLFNBQVMsR0FBRyxLQUFLOztBQUFDLEFBRXRCLGVBQVMsR0FBRyxJQUFJLENBQUM7Ozs7OztBQUNqQiw2QkFBaUIsTUFBTSw4SEFBQzs7O2NBQWhCLEtBQUs7U0FFWjs7Ozs7Ozs7Ozs7Ozs7OztBQUVELFVBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0tBQ3REOzs7Ozs7a0NBR3NCO0FBQ3JCLFVBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDdEIsVUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDOzt3Q0FGSixNQUFNO0FBQU4sY0FBTTs7Ozs7Ozs7QUFHbkIsOEJBQWtCLE1BQU0sbUlBQUU7Y0FBakIsS0FBSzs7QUFDWixjQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDdEMsbUJBQU8sQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsR0FBRywyQkFBMkIsQ0FBQyxDQUFDO0FBQ3pGLGdCQUFJLEdBQUcsSUFBSSxDQUFDO1dBQ2I7U0FDRjs7Ozs7Ozs7Ozs7Ozs7OztBQUNELFVBQUksSUFBSSxFQUFFLE9BQU8sSUFBSSxDQUFBLEtBQ2hCLE9BQU8sS0FBSyxDQUFBO0tBQ2xCOzs7U0E5TFUsSUFBSTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNFVixJQUFNLFFBQVEsV0FBUixRQUFRLEdBQUcsU0FBWCxRQUFRLENBQUksRUFBRSxFQUFFLEVBQUUsRUFBSztBQUNsQyxTQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUMzRTs7O0FBQUEsQUFHTSxJQUFNLFFBQVEsV0FBUixRQUFRLEdBQUcsU0FBWCxRQUFRLENBQUksRUFBRSxFQUFFLEVBQUUsRUFBSztBQUNsQyxTQUFPLFdBbkJQLEtBQUssQ0FtQlksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUEsR0FBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUEsR0FBSSxDQUFDLENBQUMsQ0FBQztDQUN4RDs7O0FBQUEsQUFHTSxJQUFNLEtBQUssV0FBTCxLQUFLLEdBQUcsU0FBUixLQUFLLENBQUksRUFBRSxFQUFFLEVBQUUsRUFBSztBQUMvQixTQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFBLElBQUssRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBQztDQUN0Qzs7O0FBQUEsQUFHTSxJQUFNLGtCQUFrQixXQUFsQixrQkFBa0IsR0FBRyxTQUFyQixrQkFBa0IsQ0FBSSxFQUFFLEVBQUUsRUFBRSxFQUFLO0FBQzVDLFNBQU8sQ0FBQyxDQUFDLEdBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEFBQUMsQ0FBQztDQUMzQzs7OztBQUFBLEFBSU0sSUFBTSxZQUFZLFdBQVosWUFBWSxHQUFHLFNBQWYsWUFBWSxDQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBSztBQUM5QyxNQUFJLEVBQUUsWUFBQTtNQUFFLEVBQUUsWUFBQTtNQUFFLENBQUMsWUFBQTtNQUFFLENBQUMsWUFBQTs7O0FBQUMsQUFHakIsTUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLFFBQVEsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFO0FBQ3ZDLEtBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ1QsS0FBQyxHQUFHLEFBQUMsRUFBRSxJQUFLLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQSxBQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQzs7OztBQUNqQyxPQUdJLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxRQUFRLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRTtBQUM1QyxPQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNULE9BQUMsR0FBRyxBQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUEsQUFBQyxHQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDakMsTUFBTTs7QUFFTCxRQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7O0FBQUMsQUFFdEIsUUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRXRCLE9BQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUEsSUFBSyxFQUFFLEdBQUcsRUFBRSxDQUFBLEFBQUMsQ0FBQztBQUMxQixPQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7S0FDakI7O0FBRUQsU0FBTyxXQXpEUCxLQUFLLENBeURZLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztDQUN4QixDQUFBOztBQUVNLElBQU0sT0FBTyxXQUFQLE9BQU8sR0FBRyxTQUFWLE9BQU8sQ0FBSSxPQUFPLEVBQUs7QUFDbEMsU0FBTyxBQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxHQUFJLE9BQU8sQ0FBQztDQUNsQzs7O0FBQUEsQUFHTSxJQUFNLE9BQU8sV0FBUCxPQUFPLEdBQUcsU0FBVixPQUFPLENBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUs7QUFDbEMsTUFBSSxLQUFLLEdBQUcsQUFBQyxDQUFDLEdBQUcsQ0FBQyxJQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBQztBQUN4RSxTQUFPLFdBbkVQLEtBQUssQ0FtRVksS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQSxBQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBLEFBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDeEU7OztBQUFBLEFBR00sSUFBTSxjQUFjLFdBQWQsY0FBYyxHQUFHLFNBQWpCLGNBQWMsQ0FBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBSztBQUM1QyxNQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQzs7QUFBQyxBQUV4QixNQUFJLENBQUMsR0FBRyxNQUFNLEVBQUU7QUFDZCxXQUFPO0FBQ0wsT0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ1AsT0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDVCxDQUFDOzs7QUFDSCxPQUVJLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDMUIsYUFBTztBQUNMLFNBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ1IsU0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO09BQ1IsQ0FBQzs7O0FBQ0gsU0FFSTtBQUNILFlBQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDMUIsWUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsR0FBSSxDQUFDLENBQUEsSUFBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLENBQUM7QUFDaEQsWUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3ZCLFlBQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNuQyxlQUFPO0FBQ0wsV0FBQyxFQUFFLENBQUM7QUFDSixXQUFDLEVBQUUsQ0FBQztTQUNMLENBQUM7T0FDSDtDQUNGOzs7O0FBQUEsQUFJTSxJQUFNLFdBQVcsV0FBWCxXQUFXLEdBQUcsU0FBZCxXQUFXLENBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFLO0FBQzNDLE1BQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2xDLE1BQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUVsQyxNQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ2hDLE1BQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7O0FBRWhDLE1BQUksRUFBRSxHQUFHLGtCQUFrQixDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUMxQyxNQUFJLEVBQUUsR0FBRyxrQkFBa0IsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDOzs7QUFBQyxBQUkxQyxNQUFJLE1BQU0sR0FBRyxZQUFZLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDeEMsTUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNsQyxTQUFPO0FBQ0wsVUFBTSxFQUFFLE1BQU07QUFDZCxVQUFNLEVBQUUsTUFBTTtHQUNmLENBQUM7Q0FDSDs7O0FBQUEsQUFHTSxJQUFNLGFBQWEsV0FBYixhQUFhLEdBQUcsU0FBaEIsYUFBYSxDQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFLO0FBQzFDLE1BQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsQ0FBQSxJQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBQztBQUNuSSxNQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLENBQUEsSUFBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUEsQUFBQyxDQUFDO0FBQ3ZJLE1BQUksTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzFDLFNBQU87QUFDTCxVQUFNLEVBQUU7QUFDTixPQUFDLEVBQUUsQ0FBQztBQUNKLE9BQUMsRUFBRSxDQUFDO0tBQ0w7QUFDRCxVQUFNLEVBQUUsTUFBTTtHQUNmLENBQUE7Q0FDRjs7Ozs7O0FBQUEsQUFNTSxJQUFNLGVBQWUsV0FBZixlQUFlLEdBQUcsU0FBbEIsZUFBZSxDQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBSztBQUNqRCxNQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2IsTUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNiLE1BQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDYixNQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2IsTUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsSUFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsSUFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsQ0FBQyxDQUFDOztBQUU1RCxNQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUEsSUFBSyxJQUFJLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQSxBQUFDLElBQUksSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUEsQUFBQyxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUEsQUFBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVwRyxNQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsR0FBSSxDQUFDLEdBQUcsQUFBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsSUFBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUEsQUFBQyxJQUFLLENBQUMsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFBLEFBQUMsQ0FBQztBQUNqRixNQUFJLEVBQUUsR0FBRyxRQUFRLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFBLEFBQUMsQ0FBQztBQUN0RCxNQUFJLEVBQUUsR0FBRyxRQUFRLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFBLEFBQUMsQ0FBQzs7QUFFdEQsTUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksQ0FBQyxHQUFHLEFBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLElBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFBLEFBQUMsSUFBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7QUFDakYsTUFBSSxFQUFFLEdBQUcsUUFBUSxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7QUFDdEQsTUFBSSxFQUFFLEdBQUcsUUFBUSxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQSxB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QUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6RCxNQUFNLFdBQVcsR0FBRyxDQUFDLFdBQVcsQ0FBQzs7QUFFakMsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsUUFBUSxJQUFJLEtBQUssQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUEsQUFBQyxHQUFHLFdBQVcsSUFBSSxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBQztBQUNsSCxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxRQUFRLElBQUksS0FBSyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQSxBQUFDLEdBQUcsV0FBVyxJQUFJLEtBQUssQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUEsQUFBQyxDQUFDO0FBQ2xILE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLFdBQVcsSUFBSSxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBLEFBQUMsR0FBRyxRQUFRLElBQUksS0FBSyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQSxBQUFDLENBQUM7QUFDbEgsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsV0FBVyxJQUFJLEtBQUssQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUEsQUFBQyxHQUFHLFFBQVEsSUFBSSxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBQzs7QUFFbEgsTUFBTSxFQUFFLEdBQUc7QUFDVCxLQUFDLEVBQUUsSUFB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bEIsVUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyQyxVQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQzs7QUFBQyxBQUVyQyxVQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxBQUFDLENBQUMsR0FBRyxDQUFDLElBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUM3RCxVQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQUFBQyxDQUFDLEdBQUcsQ0FBQyxJQUFLLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUM3RCxVQUFNLENBQUMsR0FBRztBQUNSLFNBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzNDLFNBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7T0FDN0MsQ0FBQTtBQUNELFVBQU0sTUFBTSxHQUFHO0FBQ2IsU0FBQyxFQUFFLENBQUM7QUFDSixTQUFDLEVBQUUsQ0FBQztPQUNMOztBQUFDLEFBRUYsVUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDOztBQUVwRSxVQUFNLEVBQUUsR0FBRztBQUNULFNBQUMs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LFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUM3QyxVQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNuQjs7OzRCQUVPLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRTtBQUMzQyxVQUFJLEtBQUssS0FBSyxTQUFTLEVBQUUsS0FBSyxHQUFHLFFBQVEsQ0FBQzs7QUFFMUMsVUFBTSxJQUFJLEdBQUcsSUFBSSxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDL0IsVUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFMUMsV0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDeEMsWUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtPQUMxQzs7QUFFRCxVQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUUxQyxVQUFNLFFBQVEsR0FBRyxJQUFJLEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRS9DLFVBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztLQUN0RTs7OytCQUVVLFFBQVEsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRTtBQUMvQyxVQUFHLFNBQVMsS0FBSyxTQUFTLEVBQUUsU0FBUyxHQUFHLEtBQUssQ0FBQztBQUM5QyxVQUFJLEtBQUssS0FBSyxTQUFTLEVBQUUsS0FBSyxHQUFHLFFBQVEsQ0FBQzs7QUFFMUMsVUFBTSxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUM7QUFDM0MsYUFBSyxFQUFFLEtBQUs7QUFDWixpQkFBUyxFQUFFLFNBQVM7T0FDckIsQ0FBQyxDQUFDOztBQUVILFVBQUksUUFBUSxFQUFFO0FBQ1osWUFBTSxhQUFhLEdBQUcsSUFBSSxLQUFLLENBQUMsYUFBYSxFQUFFOzs7QUFBQyxBQUdoRCxZQUFNLE9BQU8sR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxVQUFDLEdBQUcsRUFBSyxFQUFFLENBQUMsQ0FBQztBQUMxRCxlQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDL0IsZ0JBQVEsQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLGdCQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDO0FBQzFDLGdCQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDO09BQzNDOztBQUVELGFBQU8sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUMzQzs7OzJCQUVNO0FBQ0wsVUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3JDLFVBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3JCOzs7NkJBRVE7OztBQUNQLDJCQUFxQixDQUFDLFlBQU07QUFDMUIsZUFBSyxNQUFNLEVBQUUsQ0FBQTtPQUNkLENBQUMsQ0FBQzs7QUFFSCxVQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUMvQzs7O1NBbExVLE9BQU8iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0ICogYXMgRSBmcm9tICcuL2V1Y2xpZCc7XG5pbXBvcnQgKiBhcyBIIGZyb20gJy4vaHlwZXJib2xpYyc7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gJy4vcG9pbnQnO1xuaW1wb3J0IHsgVGhyZWVKUyB9IGZyb20gJy4vdGhyZWVqcyc7XG5cbi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICpcbi8vICogICBESVNLIENMQVNTXG4vLyAqICAgUG9pbmNhcmUgRGlzayByZXByZXNlbnRhdGlvbiBvZiB0aGUgaHlwZXJib2xpYyBwbGFuZVxuLy8gKiAgIENvbnRhaW5zIGFueSBmdW5jdGlvbnMgdXNlZCB0byBkcmF3IHRvIHRoZSBkaXNrXG4vLyAqICAgKEN1cnJlbnRseSB1c2luZyB0aHJlZSBqcyBhcyBkcmF3aW5nIGNsYXNzKVxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuZXhwb3J0IGNsYXNzIERpc2sge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmRyYXcgPSBuZXcgVGhyZWVKUygpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZXZlbnQpID0+IHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJyk7XG4gICAgICB0aGlzLmluaXQoKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgdGhpcy5pbml0KCk7XG4gICAgfSwgZmFsc2UpO1xuXG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMuY2VudHJlID0ge1xuICAgICAgeDogMCxcbiAgICAgIHk6IDBcbiAgICB9XG5cbiAgICAvL2RyYXcgbGFyZ2VzdCBjaXJjbGUgcG9zc2libGUgZ2l2ZW4gd2luZG93IGRpbXNcbiAgICB0aGlzLnJhZGl1cyA9ICh3aW5kb3cuaW5uZXJXaWR0aCA8IHdpbmRvdy5pbm5lckhlaWdodCkgPyAod2luZG93LmlubmVyV2lkdGggLyAyKSAtIDUgOiAod2luZG93LmlubmVySGVpZ2h0IC8gMikgLSA1O1xuXG4gICAgdGhpcy5jaXJjbGUgPSB7XG4gICAgICBjZW50cmU6IHRoaXMuY2VudHJlLFxuICAgICAgcmFkaXVzOiB0aGlzLnJhZGl1c1xuICAgIH1cblxuICAgIC8vc21hbGxlciBjaXJjbGUgZm9yIHRlc3RpbmdcbiAgICAvL3RoaXMucmFkaXVzID0gdGhpcy5yYWRpdXMgLyAyO1xuXG4gICAgdGhpcy5kcmF3RGlzaygpO1xuXG4gICAgLy90aGlzLnRlc3RpbmcoKTtcbiAgfVxuXG4gIHRlc3RpbmcoKSB7XG4gICAgY29uc3QgcDEgPSB7XG4gICAgICB4OiAxMDAsXG4gICAgICB5OiAyNTBcbiAgICB9O1xuICAgIGNvbnN0IHAyID0ge1xuICAgICAgeDogLTE1MCxcbiAgICAgIHk6IDE1MFxuICAgIH07XG4gICAgY29uc3QgcDMgPSB7XG4gICAgICB4OiAtNzAsXG4gICAgICB5OiAtMjUwXG4gICAgfTtcblxuICAgIGNvbnN0IHA0ID0ge1xuICAgICAgeDogLTE3MCxcbiAgICAgIHk6IC0xNTBcbiAgICB9O1xuXG4gICAgY29uc3QgcDUgPSB7XG4gICAgICB4OiAxNzAsXG4gICAgICB5OiAtMTUwXG4gICAgfTtcbiAgICB0aGlzLnBvaW50KHAxLCA1LCAweGYwMGYwZik7XG4gICAgdGhpcy5wb2ludChwMiwgNSwgMHhmZmZmMGYpO1xuICAgIHRoaXMucG9pbnQocDMsIDUsIDB4MWQwMGQ1KTtcbiAgICB0aGlzLnBvaW50KHA0LCA1LCAweDAwZmYwZik7XG4gICAgdGhpcy5wb2ludChwNSwgNSwgMHgzNTk1NDMpO1xuXG4gICAgLypcbiAgICBjb25zdCBhID0gSC5hcmMocDEsIHAyKTtcblxuICAgIHRoaXMuZHJhdy5kaXNrKGEuY2lyY2xlLmNlbnRyZSwgYS5jaXJjbGUucmFkaXVzLCAweGZmZmZmZiwgZmFsc2UpO1xuXG4gICAgY29uc3QgcDQgPSBFLm5leHRQb2ludChhLmNpcmNsZSwgcDIsIDIwKS5wMTtcbiAgICBjb25zb2xlLmxvZyhwNCk7XG5cblxuXG4gICAgLy90aGlzLmRyYXdBcmMocDIsIHAzLCAweGYwMGYwZik7XG4gICAgKi9cbiAgICAvL3RoaXMucG9seWdvbk91dGxpbmUoW3AxLCBwMiwgcDNdLDB4ZjAwZjBmKVxuICAgIHRoaXMucG9seWdvbihbcDEsIHAyLCBwNCwgcDMsIHA1XSwgMHg3MDA2OWEpO1xuICAgIC8vdGhpcy5wb2x5Z29uKFtwMiwgcDMsIHA0XSk7XG4gIH1cbiAgZ2V0UmFkaXVzKCkge1xuICAgIHJldHVybiB0aGlzLnJhZGl1cztcbiAgfVxuXG4gIC8vZHJhdyB0aGUgZGlzayBiYWNrZ3JvdW5kXG4gIGRyYXdEaXNrKCkge1xuICAgIHRoaXMuZHJhdy5kaXNrKHRoaXMuY2VudHJlLCB0aGlzLnJhZGl1cywgMHgwMDAwMDAsIHRydWUpO1xuICB9XG5cbiAgcG9pbnQoY2VudHJlLCByYWRpdXMsIGNvbG9yKSB7XG4gICAgdGhpcy5kcmF3LmRpc2soY2VudHJlLCByYWRpdXMsIGNvbG9yLCBmYWxzZSk7XG4gIH1cblxuICAvL2RyYXcgYSBoeXBlcmJvbGljIGxpbmUgYmV0d2VlbiB0d28gcG9pbnRzIG9uIHRoZSBib3VuZGFyeSBjaXJjbGVcbiAgLy9UT0RPOiBmaXghXG4gIGxpbmUocDEsIHAyLCBjb2xvcikge1xuICAgIGNvbnN0IGMgPSBFLmdyZWF0Q2lyY2xlKHAxLCBwMiwgdGhpcy5yYWRpdXMsIHRoaXMuY2VudHJlKTtcbiAgICBjb25zdCBwb2ludHMgPSBFLmNpcmNsZUludGVyc2VjdCh0aGlzLmNlbnRyZSwgYy5jZW50cmUsIHRoaXMucmFkaXVzLCBjLnJhZGl1cyk7XG5cbiAgICB0aGlzLmRyYXdBcmMocG9pbnRzLnAxLCBwb2ludHMucDIsIGNvbG9yKVxuICB9XG5cbiAgLy9EcmF3IGFuIGFyYyAoaHlwZXJib2xpYyBsaW5lIHNlZ21lbnQpIGJldHdlZW4gdHdvIHBvaW50cyBvbiB0aGUgZGlza1xuICBkcmF3QXJjKHAxLCBwMiwgY29sb3VyKSB7XG4gICAgLy9jaGVjayB0aGF0IHRoZSBwb2ludHMgYXJlIGluIHRoZSBkaXNrXG4gICAgaWYgKHRoaXMuY2hlY2tQb2ludHMocDEsIHAyKSkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIGNvbnN0IGNvbCA9IGNvbG91ciB8fCAweGZmZmZmZjtcbiAgICBjb25zdCBhcmMgPSBILmFyYyhwMSwgcDIsIHRoaXMuY2lyY2xlKTtcblxuICAgIGlmIChhLnN0cmFpZ2h0TGluZSkge1xuICAgICAgdGhpcy5kcmF3LmxpbmUocDEsIHAyLCBjb2wpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRyYXcuc2VnbWVudChhcmMuY2lyY2xlLCBhcmMuc3RhcnRBbmdsZSwgYXJjLmVuZEFuZ2xlLCBjb2xvdXIpO1xuICAgIH1cbiAgfVxuXG4gIHBvbHlnb25PdXRsaW5lKHZlcnRpY2VzLCBjb2xvdXIpIHtcbiAgICBjb25zdCBsID0gdmVydGljZXMubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICB0aGlzLmRyYXdBcmModmVydGljZXNbaV0sIHZlcnRpY2VzWyhpICsgMSkgJSBsXSwgY29sb3VyKTtcbiAgICB9XG4gIH1cblxuICAvL2NyZWF0ZSBhbiBhcnJheSBvZiBwb2ludHMgc3BhY2VkIGVxdWFsbHkgYXJvdW5kIHRoZSBhcmNzIGRlZmluaW5nIGEgaHlwZXJib2xpY1xuICAvL3BvbHlnb24gYW5kIHBhc3MgdGhlc2UgdG8gVGhyZWVKUy5wb2x5Z29uKClcbiAgLy9UT0RPIG1ha2Ugc3BhY2luZyBhIGZ1bmN0aW9uIG9mIGZpbmFsIHJlc29sdXRpb25cbiAgLy9UT0RPIGNoZWNrIHdoZXRoZXIgdmVydGljZXMgYXJlIGluIHRoZSByaWdodCBvcmRlclxuICBwb2x5Z29uKHZlcnRpY2VzLCBjb2xvciwgdGV4dHVyZSkge1xuICAgIGNvbnN0IHBvaW50cyA9IFtdO1xuICAgIGNvbnN0IHNwYWNpbmcgPSA1O1xuICAgIGNvbnN0IGwgPSB2ZXJ0aWNlcy5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgIGxldCBwO1xuICAgICAgY29uc3QgYXJjID0gSC5hcmModmVydGljZXNbaV0sIHZlcnRpY2VzWyhpICsgMSkgJSBsXSwgdGhpcy5jaXJjbGUpO1xuXG4gICAgICAvL2xpbmUgbm90IHRocm91Z2ggdGhlIG9yaWdpbiAoaHlwZXJib2xpYyBhcmMpXG4gICAgICBpZiAoIWFyYy5zdHJhaWdodExpbmUpIHtcblxuICAgICAgICBpZiAoYXJjLmNsb2Nrd2lzZSkge1xuICAgICAgICAgIHAgPSBFLnNwYWNlZFBvaW50T25BcmMoYXJjLmNpcmNsZSwgdmVydGljZXNbaV0sIHNwYWNpbmcpLnAyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHAgPSBFLnNwYWNlZFBvaW50T25BcmMoYXJjLmNpcmNsZSwgdmVydGljZXNbaV0sIHNwYWNpbmcpLnAxO1xuICAgICAgICB9XG4gICAgICAgIHBvaW50cy5wdXNoKHApO1xuXG4gICAgICAgIHdoaWxlIChFLmRpc3RhbmNlKHAsIHZlcnRpY2VzWyhpICsgMSkgJSBsXSkgPiBzcGFjaW5nKSB7XG5cbiAgICAgICAgICBpZiAoYXJjLmNsb2Nrd2lzZSkge1xuICAgICAgICAgICAgcCA9IEUuc3BhY2VkUG9pbnRPbkFyYyhhcmMuY2lyY2xlLCBwLCBzcGFjaW5nKS5wMjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcCA9IEUuc3BhY2VkUG9pbnRPbkFyYyhhcmMuY2lyY2xlLCBwLCBzcGFjaW5nKS5wMTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBwb2ludHMucHVzaChwKTtcbiAgICAgICAgfVxuICAgICAgICBwb2ludHMucHVzaCh2ZXJ0aWNlc1soaSArIDEpICUgbF0pO1xuICAgICAgfVxuXG4gICAgICAvL2xpbmUgdGhyb3VnaCBvcmlnaW4gKHN0cmFpZ2h0IGxpbmUpXG4gICAgICBlbHNle1xuICAgICAgICBwb2ludHMucHVzaCh2ZXJ0aWNlc1soaSArIDEpICUgbF0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxldCB3aXJlZnJhbWUgPSBmYWxzZTtcbiAgICAvL1RFU1RJTkdcbiAgICB3aXJlZnJhbWUgPSB0cnVlO1xuICAgIGZvcihsZXQgcG9pbnQgb2YgcG9pbnRzKXtcbiAgICAgIC8vdGhpcy5wb2ludChwb2ludCwyLDB4MTBkZWQ4KTtcbiAgICB9XG5cbiAgICB0aGlzLmRyYXcucG9seWdvbihwb2ludHMsIGNvbG9yLCB0ZXh0dXJlLCB3aXJlZnJhbWUpO1xuICB9XG5cbiAgLy9yZXR1cm4gdHJ1ZSBpZiBhbnkgb2YgdGhlIHBvaW50cyBpcyBub3QgaW4gdGhlIGRpc2tcbiAgY2hlY2tQb2ludHMoLi4ucG9pbnRzKSB7XG4gICAgY29uc3QgciA9IHRoaXMucmFkaXVzO1xuICAgIGxldCB0ZXN0ID0gZmFsc2U7XG4gICAgZm9yIChsZXQgcG9pbnQgb2YgcG9pbnRzKSB7XG4gICAgICBpZiAoRS5kaXN0YW5jZShwb2ludCwgdGhpcy5jZW50cmUpID4gcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciEgUG9pbnQgKCcgKyBwb2ludC54ICsgJywgJyArIHBvaW50LnkgKyAnKSBsaWVzIG91dHNpZGUgdGhlIHBsYW5lIScpO1xuICAgICAgICB0ZXN0ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRlc3QpIHJldHVybiB0cnVlXG4gICAgZWxzZSByZXR1cm4gZmFsc2VcbiAgfVxufVxuIiwiaW1wb3J0IHtcbiAgUG9pbnRcbn1cbmZyb20gJy4vcG9pbnQnO1xuLy8gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gKlxuLy8gKiAgIEVVQ0xJREVBTiBGVU5DVElPTlNcbi8vICogICBhIHBsYWNlIHRvIHN0YXNoIGFsbCB0aGUgZnVuY3Rpb25zIHRoYXQgYXJlIGV1Y2xpZGVhbiBnZW9tZXRyaWNhbFxuLy8gKiAgIG9wZXJhdGlvbnNcbi8vICogICBBbGwgZnVuY3Rpb25zIGFyZSAyRCB1bmxlc3Mgb3RoZXJ3aXNlIHNwZWNpZmllZCFcbi8vICpcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuLy9kaXN0YW5jZSBiZXR3ZWVuIHR3byBwb2ludHNcbmV4cG9ydCBjb25zdCBkaXN0YW5jZSA9IChwMSwgcDIpID0+IHtcbiAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdygocDIueCAtIHAxLngpLCAyKSArIE1hdGgucG93KChwMi55IC0gcDEueSksIDIpKTtcbn1cblxuLy9taWRwb2ludCBvZiB0aGUgbGluZSBzZWdtZW50IGNvbm5lY3RpbmcgdHdvIHBvaW50c1xuZXhwb3J0IGNvbnN0IG1pZHBvaW50ID0gKHAxLCBwMikgPT4ge1xuICByZXR1cm4gbmV3IFBvaW50KChwMS54ICsgcDIueCkgLyAyLCAocDEueSArIHAyLnkpIC8gMik7XG59XG5cbi8vc2xvcGUgb2YgbGluZSB0aHJvdWdoIHAxLCBwMlxuZXhwb3J0IGNvbnN0IHNsb3BlID0gKHAxLCBwMikgPT4ge1xuICByZXR1cm4gKHAyLnggLSBwMS54KSAvIChwMi55IC0gcDEueSk7XG59XG5cbi8vc2xvcGUgb2YgbGluZSBwZXJwZW5kaWN1bGFyIHRvIGEgbGluZSBkZWZpbmVkIGJ5IHAxLHAyXG5leHBvcnQgY29uc3QgcGVycGVuZGljdWxhclNsb3BlID0gKHAxLCBwMikgPT4ge1xuICByZXR1cm4gLTEgLyAoTWF0aC5wb3coc2xvcGUocDEsIHAyKSwgLTEpKTtcbn1cblxuLy9pbnRlcnNlY3Rpb24gcG9pbnQgb2YgdHdvIGxpbmVzIGRlZmluZWQgYnkgcDEsbTEgYW5kIHExLG0yXG4vL05PVCBXT1JLSU5HIEZPUiBWRVJUSUNBTCBMSU5FUyEhIVxuZXhwb3J0IGNvbnN0IGludGVyc2VjdGlvbiA9IChwMSwgbTEsIHAyLCBtMikgPT4ge1xuICBsZXQgYzEsIGMyLCB4LCB5O1xuICAvL2Nhc2Ugd2hlcmUgZmlyc3QgbGluZSBpcyB2ZXJ0aWNhbFxuICAvL2lmKG0xID4gNTAwMCB8fCBtMSA8IC01MDAwIHx8IG0xID09PSBJbmZpbml0eSl7XG4gIGlmIChwMS55IDwgMC4wMDAwMDEgJiYgcDEueSA+IC0wLjAwMDAwMSkge1xuICAgIHggPSBwMS54O1xuICAgIHkgPSAobTIpICogKHAxLnggLSBwMi54KSArIHAyLnk7XG4gIH1cbiAgLy9jYXNlIHdoZXJlIHNlY29uZCBsaW5lIGlzIHZlcnRpY2FsXG4gIC8vZWxzZSBpZihtMiA+IDUwMDAgfHwgbTIgPCAtNTAwMCB8fCBtMSA9PT0gSW5maW5pdHkpe1xuICBlbHNlIGlmIChwMi55IDwgMC4wMDAwMDEgJiYgcDIueSA+IC0wLjAwMDAwMSkge1xuICAgIHggPSBwMi54O1xuICAgIHkgPSAobTEgKiAocDIueCAtIHAxLngpKSArIHAxLnk7XG4gIH0gZWxzZSB7XG4gICAgLy95IGludGVyY2VwdCBvZiBmaXJzdCBsaW5lXG4gICAgYzEgPSBwMS55IC0gbTEgKiBwMS54O1xuICAgIC8veSBpbnRlcmNlcHQgb2Ygc2Vjb25kIGxpbmVcbiAgICBjMiA9IHAyLnkgLSBtMiAqIHAyLng7XG5cbiAgICB4ID0gKGMyIC0gYzEpIC8gKG0xIC0gbTIpO1xuICAgIHkgPSBtMSAqIHggKyBjMTtcbiAgfVxuXG4gIHJldHVybiBuZXcgUG9pbnQoeCwgeSk7XG59XG5cbmV4cG9ydCBjb25zdCByYWRpYW5zID0gKGRlZ3JlZXMpID0+IHtcbiAgcmV0dXJuIChNYXRoLlBJIC8gMTgwKSAqIGRlZ3JlZXM7XG59XG5cbi8vZ2V0IHRoZSBjaXJjbGUgaW52ZXJzZSBvZiBhIHBvaW50IHAgd2l0aCByZXNwZWN0IGEgY2lyY2xlIHJhZGl1cyByIGNlbnRyZSBjXG5leHBvcnQgY29uc3QgaW52ZXJzZSA9IChwLCByLCBjKSA9PiB7XG4gIGxldCBhbHBoYSA9IChyICogcikgLyAoTWF0aC5wb3cocC54IC0gYy54LCAyKSArIE1hdGgucG93KHAueSAtIGMueSwgMikpO1xuICByZXR1cm4gbmV3IFBvaW50KGFscGhhICogKHAueCAtIGMueCkgKyBjLngsIGFscGhhICogKHAueSAtIGMueSkgKyBjLnkpO1xufVxuXG4vL3JlZmxlY3QgcDMgYWNyb3NzIHRoZSBsaW5lIGRlZmluZWQgYnkgcDEscDJcbmV4cG9ydCBjb25zdCBsaW5lUmVmbGVjdGlvbiA9IChwMSwgcDIsIHAzKSA9PiB7XG4gIGNvbnN0IG0gPSBzbG9wZShwMSwgcDIpO1xuICAvL3JlZmxlY3Rpb24gaW4geSBheGlzXG4gIGlmIChtID4gOTk5OTk5KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHg6IHAzLngsXG4gICAgICB5OiAtcDMueVxuICAgIH07XG4gIH1cbiAgLy9yZWZsZWN0aW9uIGluIHggYXhpc1xuICBlbHNlIGlmIChtLnRvRml4ZWQoNikgPT0gMCkge1xuICAgIHJldHVybiB7XG4gICAgICB4OiAtcDMueCxcbiAgICAgIHk6IHAzLnlcbiAgICB9O1xuICB9XG4gIC8vcmVmbGVjdGlvbiBpbiBhcmJpdHJhcnkgbGluZVxuICBlbHNlIHtcbiAgICBjb25zdCBjID0gcDEueSAtIG0gKiBwMS54O1xuICAgIGNvbnN0IGQgPSAocDMueCArIChwMy55IC0gYykgKiBtKSAvICgxICsgbSAqIG0pO1xuICAgIGNvbnN0IHggPSAyICogZCAtIHAzLng7XG4gICAgY29uc3QgeSA9IDIgKiBkICogbSAtIHAzLnkgKyAyICogYztcbiAgICByZXR1cm4ge1xuICAgICAgeDogeCxcbiAgICAgIHk6IHlcbiAgICB9O1xuICB9XG59XG5cbi8vY2FsY3VsYXRlIHRoZSByYWRpdXMgYW5kIGNlbnRyZSBvZiB0aGUgY2lyY2xlIHJlcXVpcmVkIHRvIGRyYXcgYSBsaW5lIGJldHdlZW5cbi8vdHdvIHBvaW50cyBpbiB0aGUgaHlwZXJib2xpYyBwbGFuZSBkZWZpbmVkIGJ5IHRoZSBkaXNrIChyLCBjKVxuZXhwb3J0IGNvbnN0IGdyZWF0Q2lyY2xlID0gKHAxLCBwMiwgciwgYykgPT4ge1xuICBsZXQgcDFJbnZlcnNlID0gaW52ZXJzZShwMSwgciwgYyk7XG4gIGxldCBwMkludmVyc2UgPSBpbnZlcnNlKHAyLCByLCBjKTtcblxuICBsZXQgbSA9IG1pZHBvaW50KHAxLCBwMUludmVyc2UpO1xuICBsZXQgbiA9IG1pZHBvaW50KHAyLCBwMkludmVyc2UpO1xuXG4gIGxldCBtMSA9IHBlcnBlbmRpY3VsYXJTbG9wZShtLCBwMUludmVyc2UpO1xuICBsZXQgbTIgPSBwZXJwZW5kaWN1bGFyU2xvcGUobiwgcDJJbnZlcnNlKTtcblxuXG4gIC8vY2VudHJlIGlzIHRoZSBjZW50cmVwb2ludCBvZiB0aGUgY2lyY2xlIG91dCBvZiB3aGljaCB0aGUgYXJjIGlzIG1hZGVcbiAgbGV0IGNlbnRyZSA9IGludGVyc2VjdGlvbihtLCBtMSwgbiwgbTIpO1xuICBsZXQgcmFkaXVzID0gZGlzdGFuY2UoY2VudHJlLCBwMSk7XG4gIHJldHVybiB7XG4gICAgY2VudHJlOiBjZW50cmUsXG4gICAgcmFkaXVzOiByYWRpdXNcbiAgfTtcbn1cblxuLy9hbiBhdHRlbXB0IGF0IGNhbGN1bGF0aW5nIHRoZSBjaXJjbGUgYWxnZWJyYWljYWxseVxuZXhwb3J0IGNvbnN0IGdyZWF0Q2lyY2xlVjIgPSAocDEsIHAyLCByKSA9PiB7XG4gIGxldCB4ID0gKHAyLnkgKiAocDEueCAqIHAxLnggKyByKSArIHAxLnkgKiBwMS55ICogcDIueSAtIHAxLnkgKiAocDIueCAqIHAyLnggKyBwMi55ICogcDIueSArIHIpKSAvICgyICogcDEueCAqIHAyLnkgLSBwMS55ICogcDIueCk7XG4gIGxldCB5ID0gKHAxLnggKiBwMS54ICogcDIueCAtIHAxLnggKiAocDIueCAqIHAyLnggKyBwMi55ICogcDIueSArIHIpICsgcDIueCAqIChwMS55ICogcDEueSArIHIpKSAvICgyICogcDEueSAqIHAyLnggKyAyICogcDEueCAqIHAyLnkpO1xuICBsZXQgcmFkaXVzID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkgLSByKTtcbiAgcmV0dXJuIHtcbiAgICBjZW50cmU6IHtcbiAgICAgIHg6IHgsXG4gICAgICB5OiB5XG4gICAgfSxcbiAgICByYWRpdXM6IHJhZGl1c1xuICB9XG59XG5cbi8vaW50ZXJzZWN0aW9uIG9mIHR3byBjaXJjbGVzIHdpdGggZXF1YXRpb25zOlxuLy8oeC1hKV4yICsoeS1hKV4yID0gcjBeMlxuLy8oeC1iKV4yICsoeS1jKV4yID0gcjFeMlxuLy9OT1RFIGFzc3VtZXMgdGhlIHR3byBjaXJjbGVzIERPIGludGVyc2VjdCFcbmV4cG9ydCBjb25zdCBjaXJjbGVJbnRlcnNlY3QgPSAoYzAsIGMxLCByMCwgcjEpID0+IHtcbiAgbGV0IGEgPSBjMC54O1xuICBsZXQgYiA9IGMwLnk7XG4gIGxldCBjID0gYzEueDtcbiAgbGV0IGQgPSBjMS55O1xuICBsZXQgZGlzdCA9IE1hdGguc3FydCgoYyAtIGEpICogKGMgLSBhKSArIChkIC0gYikgKiAoZCAtIGIpKTtcblxuICBsZXQgZGVsID0gTWF0aC5zcXJ0KChkaXN0ICsgcjAgKyByMSkgKiAoZGlzdCArIHIwIC0gcjEpICogKGRpc3QgLSByMCArIHIxKSAqICgtZGlzdCArIHIwICsgcjEpKSAvIDQ7XG5cbiAgbGV0IHhQYXJ0aWFsID0gKGEgKyBjKSAvIDIgKyAoKGMgLSBhKSAqIChyMCAqIHIwIC0gcjEgKiByMSkpIC8gKDIgKiBkaXN0ICogZGlzdCk7XG4gIGxldCB4MSA9IHhQYXJ0aWFsIC0gMiAqIGRlbCAqIChiIC0gZCkgLyAoZGlzdCAqIGRpc3QpO1xuICBsZXQgeDIgPSB4UGFydGlhbCArIDIgKiBkZWwgKiAoYiAtIGQpIC8gKGRpc3QgKiBkaXN0KTtcblxuICBsZXQgeVBhcnRpYWwgPSAoYiArIGQpIC8gMiArICgoZCAtIGIpICogKHIwICogcjAgLSByMSAqIHIxKSkgLyAoMiAqIGRpc3QgKiBkaXN0KTtcbiAgbGV0IHkxID0geVBhcnRpYWwgKyAyICogZGVsICogKGEgLSBjKSAvIChkaXN0ICogZGlzdCk7XG4gIGxldCB5MiA9IHlQYXJ0aWFsIC0gMiAqIGRlbCAqIChhIC0gYykgLyAoZGlzdCAqIGRpc3QpO1xuXG4gIGxldCBwMSA9IHtcbiAgICB4OiB4MSxcbiAgICB5OiB5MVxuICB9XG5cbiAgbGV0IHAyID0ge1xuICAgIHg6IHgyLFxuICAgIHk6IHkyXG4gIH1cblxuICByZXR1cm4ge1xuICAgIHAxOiBwMSxcbiAgICBwMjogcDJcbiAgfTtcbn1cblxuZXhwb3J0IGNvbnN0IGNpcmNsZUxpbmVJbnRlcnNlY3QgPSAoYywgciwgcDEsIHAyKSA9PiB7XG5cbiAgY29uc3QgZCA9IGRpc3RhbmNlKHAxLCBwMik7XG4gIC8vdW5pdCB2ZWN0b3IgcDEgcDJcbiAgY29uc3QgZHggPSAocDIueCAtIHAxLngpIC8gZDtcbiAgY29uc3QgZHkgPSAocDIueSAtIHAxLnkpIC8gZDtcblxuICAvL3BvaW50IG9uIGxpbmUgY2xvc2VzdCB0byBjaXJjbGUgY2VudHJlXG4gIGNvbnN0IHQgPSBkeCAqIChjLnggLSBwMS54KSArIGR5ICogKGMueSAtIHAxLnkpO1xuICBjb25zdCBwID0ge1xuICAgIHg6IHQgKiBkeCArIHAxLngsXG4gICAgeTogdCAqIGR5ICsgcDEueVxuICB9O1xuXG4gIC8vZGlzdGFuY2UgZnJvbSB0aGlzIHBvaW50IHRvIGNlbnRyZVxuICBjb25zdCBkMiA9IGRpc3RhbmNlKHAsIGMpO1xuXG4gIC8vbGluZSBpbnRlcnNlY3RzIGNpcmNsZVxuICBpZiAoZDIgPCByKSB7XG4gICAgY29uc3QgZHQgPSBNYXRoLnNxcnQociAqIHIgLSBkMiAqIGQyKTtcbiAgICAvL3BvaW50IDFcbiAgICBjb25zdCBxMSA9IHtcbiAgICAgIHg6ICh0IC0gZHQpICogZHggKyBwMS54LFxuICAgICAgeTogKHQgLSBkdCkgKiBkeSArIHAxLnlcbiAgICB9XG4gICAgLy9wb2ludCAyXG4gICAgY29uc3QgcTIgPSB7XG4gICAgICB4OiAodCArIGR0KSAqIGR4ICsgcDEueCxcbiAgICAgIHk6ICh0ICsgZHQpICogZHkgKyBwMS55XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHAxOiBxMSxcbiAgICAgIHAyOiBxMlxuICAgIH07XG4gIH0gZWxzZSBpZiAoZDIgPT09IHIpIHtcbiAgICByZXR1cm4gcDtcbiAgfSBlbHNlIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvcjogbGluZSBkb2VzIG5vdCBpbnRlcnNlY3QgY2lyY2xlIScpO1xuICB9XG59XG5cbi8vYW5nbGUgaW4gcmFkaWFucyBiZXR3ZWVuIHR3byBwb2ludHMgb24gY2lyY2xlIG9mIHJhZGl1cyByXG5leHBvcnQgY29uc3QgY2VudHJhbEFuZ2xlID0gKHAxLCBwMiwgcikgPT4ge1xuICByZXR1cm4gMiAqIE1hdGguYXNpbigwLjUgKiBkaXN0YW5jZShwMSwgcDIpIC8gcik7XG59XG5cbi8vY2FsY3VsYXRlIHRoZSBub3JtYWwgdmVjdG9yIGdpdmVuIDIgcG9pbnRzXG5leHBvcnQgY29uc3Qgbm9ybWFsVmVjdG9yID0gKHAxLCBwMikgPT4ge1xuICBsZXQgZCA9IE1hdGguc3FydChNYXRoLnBvdyhwMi54IC0gcDEueCwgMikgKyBNYXRoLnBvdyhwMi55IC0gcDEueSwgMikpO1xuICByZXR1cm4ge1xuICAgIHg6IChwMi54IC0gcDEueCkgLyBkLFxuICAgIHk6IChwMi55IC0gcDEueSkgLyBkXG4gIH1cbn1cblxuLy9kb2VzIHRoZSBsaW5lIGNvbm5lY3RpbmcgcDEsIHAyIGdvIHRocm91Z2ggdGhlIHBvaW50ICgwLDApP1xuLy9uZWVkcyB0byB0YWtlIGludG8gYWNjb3VudCByb3VuZG9mZiBlcnJvcnMgc28gcmV0dXJucyB0cnVlIGlmXG4vL3Rlc3QgaXMgY2xvc2UgdG8gMFxuZXhwb3J0IGNvbnN0IHRocm91Z2hPcmlnaW4gPSAocDEsIHAyKSA9PiB7XG4gIGlmIChwMS54ID09PSAwICYmIHAyLnggPT09IDApIHtcbiAgICAvL3ZlcnRpY2FsIGxpbmUgdGhyb3VnaCBjZW50cmVcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBjb25zdCB0ZXN0ID0gKC1wMS54ICogcDIueSArIHAxLnggKiBwMS55KSAvIChwMi54IC0gcDEueCkgKyBwMS55O1xuXG4gIGlmICh0ZXN0LnRvRml4ZWQoNikgPT0gMCkgcmV0dXJuIHRydWU7XG4gIGVsc2UgcmV0dXJuIGZhbHNlO1xufVxuXG4vL2ZpbmQgdGhlIGNlbnRyb2lkIG9mIGEgbm9uLXNlbGYtaW50ZXJzZWN0aW5nIHBvbHlnb25cbmV4cG9ydCBjb25zdCBjZW50cm9pZE9mUG9seWdvbiA9IChwb2ludHMpID0+IHtcbiAgbGV0IGZpcnN0ID0gcG9pbnRzWzBdLFxuICAgIGxhc3QgPSBwb2ludHNbcG9pbnRzLmxlbmd0aCAtIDFdO1xuICBpZiAoZmlyc3QueCAhPSBsYXN0LnggfHwgZmlyc3QueSAhPSBsYXN0LnkpIHBvaW50cy5wdXNoKGZpcnN0KTtcbiAgbGV0IHR3aWNlYXJlYSA9IDAsXG4gICAgeCA9IDAsXG4gICAgeSA9IDAsXG4gICAgblB0cyA9IHBvaW50cy5sZW5ndGgsXG4gICAgcDEsIHAyLCBmO1xuICBmb3IgKHZhciBpID0gMCwgaiA9IG5QdHMgLSAxOyBpIDwgblB0czsgaiA9IGkrKykge1xuICAgIHAxID0gcG9pbnRzW2ldO1xuICAgIHAyID0gcG9pbnRzW2pdO1xuICAgIGYgPSBwMS54ICogcDIueSAtIHAyLnggKiBwMS55O1xuICAgIHR3aWNlYXJlYSArPSBmO1xuICAgIHggKz0gKHAxLnggKyBwMi54KSAqIGY7XG4gICAgeSArPSAocDEueSArIHAyLnkpICogZjtcbiAgfVxuICBmID0gdHdpY2VhcmVhICogMztcbiAgcmV0dXJuIHtcbiAgICB4OiB4IC8gZixcbiAgICB5OiB5IC8gZlxuICB9O1xufVxuXG4vL2NvbXBhcmUgdHdvIHBvaW50cyB0YWtpbmcgcm91bmRpbmcgZXJyb3JzIGludG8gYWNjb3VudFxuZXhwb3J0IGNvbnN0IGNvbXBhcmVQb2ludHMgPSAocDEsIHAyKSA9PiB7XG4gIGlmICh0eXBlb2YgcDEgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBwMiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBwMSA9IHBvaW50VG9GaXhlZChwMSwgNik7XG4gIHAyID0gcG9pbnRUb0ZpeGVkKHAyLCA2KTtcbiAgaWYgKHAxLnggPT09IHAyLnggJiYgcDEueSA9PT0gcDIueSkgcmV0dXJuIHRydWU7XG4gIGVsc2UgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgY29uc3QgcG9pbnRUb0ZpeGVkID0gKHAsIHBsYWNlcykgPT4ge1xuICByZXR1cm4ge1xuICAgIHg6IHAueC50b0ZpeGVkKHBsYWNlcyksXG4gICAgeTogcC55LnRvRml4ZWQocGxhY2VzKVxuICB9O1xufVxuXG4vL2ZpbmQgYSBwb2ludCBhdCBhIGRpc3RhbmNlIGQgYWxvbmcgdGhlIGNpcmN1bWZlcmVuY2Ugb2Zcbi8vYSBjaXJjbGUgb2YgcmFkaXVzIHIsIGNlbnRyZSBjIGZyb20gYSBwb2ludCBhbHNvXG4vL29uIHRoZSBjaXJjdW1mZXJlbmNlXG5leHBvcnQgY29uc3Qgc3BhY2VkUG9pbnRPbkFyYyA9IChjaXJjbGUsIHBvaW50LCBzcGFjaW5nKSA9PiB7XG4gIGNvbnN0IGNvc1RoZXRhID0gLSgoc3BhY2luZyAqIHNwYWNpbmcpIC8gKDIgKiBjaXJjbGUucmFkaXVzICogY2lyY2xlLnJhZGl1cykgLSAxKTtcbiAgY29uc3Qgc2luVGhldGFQb3MgPSBNYXRoLnNxcnQoMSAtIE1hdGgucG93KGNvc1RoZXRhLCAyKSk7XG4gIGNvbnN0IHNpblRoZXRhTmVnID0gLXNpblRoZXRhUG9zO1xuXG4gIGNvbnN0IHhQb3MgPSBjaXJjbGUuY2VudHJlLnggKyBjb3NUaGV0YSAqIChwb2ludC54IC0gY2lyY2xlLmNlbnRyZS54KSAtIHNpblRoZXRhUG9zICogKHBvaW50LnkgLSBjaXJjbGUuY2VudHJlLnkpO1xuICBjb25zdCB4TmVnID0gY2lyY2xlLmNlbnRyZS54ICsgY29zVGhldGEgKiAocG9pbnQueCAtIGNpcmNsZS5jZW50cmUueCkgLSBzaW5UaGV0YU5lZyAqIChwb2ludC55IC0gY2lyY2xlLmNlbnRyZS55KTtcbiAgY29uc3QgeVBvcyA9IGNpcmNsZS5jZW50cmUueSArIHNpblRoZXRhUG9zICogKHBvaW50LnggLSBjaXJjbGUuY2VudHJlLngpICsgY29zVGhldGEgKiAocG9pbnQueSAtIGNpcmNsZS5jZW50cmUueSk7XG4gIGNvbnN0IHlOZWcgPSBjaXJjbGUuY2VudHJlLnkgKyBzaW5UaGV0YU5lZyAqIChwb2ludC54IC0gY2lyY2xlLmNlbnRyZS54KSArIGNvc1RoZXRhICogKHBvaW50LnkgLSBjaXJjbGUuY2VudHJlLnkpO1xuXG4gIGNvbnN0IHAxID0ge1xuICAgIHg6IHhQb3MsXG4gICAgeTogeVBvc1xuICB9O1xuICBjb25zdCBwMiA9IHtcbiAgICB4OiB4TmVnLFxuICAgIHk6IHlOZWdcbiAgfTtcbiAgcmV0dXJuIHtcbiAgICBwMTogcDEsXG4gICAgcDI6IHAyXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHJhbmRvbUZsb2F0ID0gKG1pbiwgbWF4KSA9PiB7XG4gIHJldHVybiBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW47XG59XG5cbmV4cG9ydCBjb25zdCByYW5kb21JbnQgPSAobWluLCBtYXgpID0+IHtcbiAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4gKyAxKSArIG1pbik7XG59XG4iLCJpbXBvcnQgKiBhcyBFIGZyb20gJy4vZXVjbGlkJztcbmltcG9ydCB7IFBvaW50IH0gZnJvbSAnLi9wb2ludCc7XG4vLyAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyAqXG4vLyAqICAgSFlQRVJCT0xJQyBGVU5DVElPTlNcbi8vICogICBhIHBsYWNlIHRvIHN0YXNoIGFsbCB0aGUgZnVuY3Rpb25zIHRoYXQgYXJlIGh5cGVyYm9saWMgZ2VtZW9tZXRyaWNhbFxuLy8gKiAgIG9wZXJhdGlvbnNcbi8vICpcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuLy9jYWxjdWxhdGUgZ3JlYXRDaXJjbGUsIHN0YXJ0QW5nbGUgYW5kIGVuZEFuZ2xlIGZvciBoeXBlcmJvbGljIGFyY1xuLy9UT0RPIGRlYWwgd2l0aCBjYXNlIG9mIHN0YWlnaHQgbGluZXMgdGhyb3VnaCBjZW50cmVcbmV4cG9ydCBjb25zdCBhcmMgPSAocDEsIHAyLCBjaXJjbGUpID0+IHtcbiAgaWYgKEUudGhyb3VnaE9yaWdpbihwMSwgcDIpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNpcmNsZTogY2lyY2xlLFxuICAgICAgc3RhcnRBbmdsZTogMCxcbiAgICAgIGVuZEFuZ2xlOiAwLFxuICAgICAgY2xvY2t3aXNlOiBmYWxzZSxcbiAgICAgIHN0cmFpZ2h0TGluZTogdHJ1ZSxcbiAgICB9XG4gIH1cbiAgbGV0IGNsb2Nrd2lzZSA9IGZhbHNlO1xuICBsZXQgYWxwaGExLCBhbHBoYTIsIHN0YXJ0QW5nbGUsIGVuZEFuZ2xlO1xuICBjb25zdCBjID0gRS5ncmVhdENpcmNsZShwMSwgcDIsIGNpcmNsZS5yYWRpdXMsIGNpcmNsZS5jZW50cmUpO1xuXG4gIGNvbnN0IG95ID0gYy5jZW50cmUueTtcbiAgY29uc3Qgb3ggPSBjLmNlbnRyZS54O1xuXG4gIC8vcG9pbnQgYXQgMCByYWRpYW5zIG9uIGNcbiAgY29uc3QgcDMgPSB7XG4gICAgeDogb3ggKyBjLnJhZGl1cyxcbiAgICB5OiBveVxuICB9XG5cbiAgLy9jYWxjdWxhdGUgdGhlIHBvc2l0aW9uIG9mIGVhY2ggcG9pbnQgaW4gdGhlIGNpcmNsZVxuICBhbHBoYTEgPSBFLmNlbnRyYWxBbmdsZShwMywgcDEsIGMucmFkaXVzKTtcbiAgYWxwaGExID0gKHAxLnkgPCBveSkgPyAyICogTWF0aC5QSSAtIGFscGhhMSA6IGFscGhhMTtcbiAgYWxwaGEyID0gRS5jZW50cmFsQW5nbGUocDMsIHAyLCBjLnJhZGl1cyk7XG4gIGFscGhhMiA9IChwMi55IDwgb3kpID8gMiAqIE1hdGguUEkgLSBhbHBoYTIgOiBhbHBoYTI7XG5cbiAgLy9jYXNlIHdoZXJlIHAxIGFib3ZlIGFuZCBwMiBiZWxvdyB0aGUgbGluZSBjLmNlbnRyZSAtPiBwM1xuICBpZiAoKHAxLnggPiBveCAmJiBwMi54ID4gb3gpICYmIChwMS55IDwgb3kgJiYgcDIueSA+IG95KSkge1xuICAgIHN0YXJ0QW5nbGUgPSBhbHBoYTE7XG4gICAgZW5kQW5nbGUgPSBhbHBoYTI7XG4gIH1cbiAgLy9jYXNlIHdoZXJlIHAyIGFib3ZlIGFuZCBwMSBiZWxvdyB0aGUgbGluZSBjLmNlbnRyZSAtPiBwM1xuICBlbHNlIGlmICgocDEueCA+IG94ICYmIHAyLnggPiBveCkgJiYgKHAxLnkgPiBveSAmJiBwMi55IDwgb3kpKSB7XG4gICAgc3RhcnRBbmdsZSA9IGFscGhhMjtcbiAgICBlbmRBbmdsZSA9IGFscGhhMTtcbiAgICBjbG9ja3dpc2UgPSB0cnVlO1xuICB9XG4gIC8vcG9pbnRzIGluIGNsb2Nrd2lzZSBvcmRlclxuICBlbHNlIGlmIChhbHBoYTEgPiBhbHBoYTIpIHtcbiAgICBzdGFydEFuZ2xlID0gYWxwaGEyO1xuICAgIGVuZEFuZ2xlID0gYWxwaGExO1xuICAgIGNsb2Nrd2lzZSA9IHRydWU7XG4gIH1cbiAgLy9wb2ludHMgaW4gYW50aWNsb2Nrd2lzZSBvcmRlclxuICBlbHNlIHtcbiAgICBzdGFydEFuZ2xlID0gYWxwaGExO1xuICAgIGVuZEFuZ2xlID0gYWxwaGEyO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBjaXJjbGU6IGMsXG4gICAgc3RhcnRBbmdsZTogc3RhcnRBbmdsZSxcbiAgICBlbmRBbmdsZTogZW5kQW5nbGUsXG4gICAgY2xvY2t3aXNlOiBjbG9ja3dpc2UsXG4gICAgc3RyYWlnaHRMaW5lOiBmYWxzZSxcbiAgfVxufVxuXG4vL3RyYW5zbGF0ZSBhIHNldCBvZiBwb2ludHMgYWxvbmcgdGhlIHggYXhpc1xuZXhwb3J0IGNvbnN0IHRyYW5zbGF0ZVggPSAocG9pbnRzQXJyYXksIGRpc3RhbmNlKSA9PiB7XG4gIGNvbnN0IGwgPSBwb2ludHNBcnJheS5sZW5ndGg7XG4gIGNvbnN0IG5ld1BvaW50cyA9IFtdO1xuICBjb25zdCBlID0gTWF0aC5wb3coTWF0aC5FLCBkaXN0YW5jZSk7XG4gIGNvbnN0IHBvcyA9IGUgKyAxO1xuICBjb25zdCBuZWcgPSBlIC0gMTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICBjb25zdCB4ID0gcG9zICogcG9pbnRzQXJyYXlbaV0ueCArIG5lZyAqIHBvaW50c0FycmF5W2ldLnk7XG4gICAgY29uc3QgeSA9IG5lZyAqIHBvaW50c0FycmF5W2ldLnggKyBwb3MgKiBwb2ludHNBcnJheVtpXS55O1xuICAgIG5ld1BvaW50cy5wdXNoKHtcbiAgICAgIHg6IHgsXG4gICAgICB5OiB5XG4gICAgfSlcbiAgfVxuICByZXR1cm4gbmV3UG9pbnRzO1xufVxuXG4vL3JvdGF0ZSBhIHNldCBvZiBwb2ludHMgYWJvdXQgYSBwb2ludCBieSBhIGdpdmVuIGFuZ2xlXG4vL2Nsb2Nrd2lzZSBkZWZhdWx0cyB0byBmYWxzZVxuZXhwb3J0IGNvbnN0IHJvdGF0aW9uID0gKHBvaW50c0FycmF5LCBwb2ludCwgYW5nbGUsIGNsb2Nrd2lzZSkgPT4ge1xuXG59XG5cbi8vcmVmbGVjdCBhIHNldCBvZiBwb2ludHMgYWNyb3NzIGEgaHlwZXJib2xpYyBhcmNcbi8vVE9ETyBhZGQgY2FzZSB3aGVyZSByZWZsZWN0aW9uIGlzIGFjcm9zcyBzdHJhaWdodCBsaW5lXG5leHBvcnQgY29uc3QgcmVmbGVjdCA9IChwb2ludHNBcnJheSwgcDEsIHAyLCBjaXJjbGUpID0+IHtcbiAgY29uc3QgbCA9IHBvaW50c0FycmF5Lmxlbmd0aDtcbiAgY29uc3QgYSA9IGFyYyhwMSwgcDIsIGNpcmNsZSk7XG4gIGNvbnN0IG5ld1BvaW50cyA9IFtdO1xuXG4gIGlmICghYS5zdHJhaWdodExpbmUpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgbmV3UG9pbnRzLnB1c2goRS5pbnZlcnNlKHBvaW50c0FycmF5W2ldLCBhLmNpcmNsZS5yYWRpdXMsIGEuY2lyY2xlLmNlbnRyZSkpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgLy9jb25zb2xlLmVycm9yKCdyZWZsZWN0aW9uIGFjcm9zcyBzdHJhaWdodCBsaW5lIG5vdCBpbXBsZW1lbnRlZCEgJylcbiAgICAgIG5ld1BvaW50cy5wdXNoKEUubGluZVJlZmxlY3Rpb24ocDEscDIscG9pbnRzQXJyYXlbaV0pKTtcbiAgICB9XG4gIH1cbiAgY29uc29sZS5sb2cobmV3UG9pbnRzKTtcbiAgcmV0dXJuIG5ld1BvaW50cztcbn1cblxuZXhwb3J0IGNvbnN0IHBvaW5jYXJlVG9XZWllcnN0cmFzcyA9IChwb2ludDJEKSA9PiB7XG4gIGNvbnN0IGZhY3RvciA9IDEgLyAoMSAtIHBvaW50MkQueCAqIHBvaW50MkQueCAtIHBvaW50MkQueSAqIHBvaW50MkQueSk7XG4gIHJldHVybiB7XG4gICAgeDogMiAqIGZhY3RvciAqIHBvaW50MkQueCxcbiAgICB5OiAyICogZmFjdG9yICogcG9pbnQyRC55LFxuICAgIHo6IGZhY3RvciAqICgxICsgcG9pbnQyRC54ICogcG9pbnQyRC54ICsgcG9pbnQyRC55ICogcG9pbnQyRC55KVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCB3ZWllcnN0cmFzc1RvUG9pbmNhcmUgPSAocG9pbnQzRCkgPT4ge1xuICBjb25zdCBmYWN0b3IgPSAxIC8gKDEgKyBwb2ludDNELnopO1xuICByZXR1cm4ge1xuICAgIHg6IGZhY3RvciAqIHBvaW50M0QueCxcbiAgICB5OiBmYWN0b3IgKiBwb2ludDNELnlcbiAgfVxufVxuXG5leHBvcnQgY29uc3Qgcm90YXRlQWJvdXRPcmlnaW5XZWllcnN0cmFzcyA9IChwb2ludDNELCBhbmdsZSkgPT4ge1xuICByZXR1cm4ge1xuICAgIHg6IE1hdGguY29zKGFuZ2xlKSAqIHBvaW50M0QueCAtIE1hdGguc2luKGFuZ2xlKSAqIHBvaW50M0QueSxcbiAgICB5OiBNYXRoLnNpbihhbmdsZSkgKiBwb2ludDNELnggKyBNYXRoLmNvcyhhbmdsZSkgKiBwb2ludDNELnksXG4gICAgejogcG9pbnQzRC56XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHJvdGF0ZUFib3V0T3JpZ2luUG9pbmNhcmUgPSAocG9pbnQyRCwgYW5nbGUpID0+IHtcbiAgcmV0dXJuIHtcbiAgICB4OiBNYXRoLmNvcyhhbmdsZSkgKiBwb2ludDJELnggLSBNYXRoLnNpbihhbmdsZSkgKiBwb2ludDJELnksXG4gICAgeTogTWF0aC5zaW4oYW5nbGUpICogcG9pbnQyRC54ICsgTWF0aC5jb3MoYW5nbGUpICogcG9pbnQyRC55LFxuICB9XG59XG5cbmV4cG9ydCBjb25zdCByb3RhdGVQZ29uQWJvdXRPcmlnaW4gPSAocG9pbnRzMkRBcnJheSwgYW5nbGUpID0+IHtcbiAgY29uc3QgbCA9IHBvaW50czJEQXJyYXkubGVuZ3RoO1xuICBjb25zdCByb3RhdGVkUG9pbnRzMkRBcnJheSA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgIGxldCBwb2ludCA9IHJvdGF0ZUFib3V0T3JpZ2luUG9pbmNhcmUocG9pbnRzMkRBcnJheVtpXSwgYW5nbGUpO1xuICAgIHJvdGF0ZWRQb2ludHMyREFycmF5LnB1c2gocG9pbnQpO1xuICB9XG4gIHJldHVybiByb3RhdGVkUG9pbnRzMkRBcnJheTtcbn1cblxuLy93aGVuIHRoZSBwb2ludCBwMSBpcyB0cmFuc2xhdGVkIHRvIHRoZSBvcmlnaW4sIHRoZSBwb2ludCBwMlxuLy9pcyB0cmFuc2xhdGVkIGFjY29yZGluZyB0byB0aGlzIGZvcm11bGFcbi8vaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvUG9pbmNhciVDMyVBOV9kaXNrX21vZGVsI0lzb21ldHJpY19UcmFuc2Zvcm1hdGlvbnNcbmV4cG9ydCBjb25zdCB0cmFuc2xhdGVQb2luY2FyZSA9IChwMSwgcDIpID0+IHtcbiAgY29uc3QgZG90ID0gcDEueCAqIHAyLnggKyBwMS55ICogcDIueTtcbiAgY29uc3Qgbm9ybVNxdWFyZWRQMSA9IE1hdGgucG93KE1hdGguc3FydChwMS54ICogcDEueCArIHAxLnkgKiBwMS55KSwgMik7XG4gIGNvbnN0IG5vcm1TcXVhcmVkUDIgPSBNYXRoLnBvdyhNYXRoLnNxcnQocDIueCAqIHAyLnggKyBwMi55ICogcDIueSksIDIpO1xuICBjb25zdCBkZW5vbWluYXRvciA9IDEgKyAyICogZG90ICsgbm9ybVNxdWFyZWRQMSAqIG5vcm1TcXVhcmVkUDI7XG5cbiAgY29uc3QgcDFGYWN0b3IgPSAoMSArIDIgKiBkb3QgKyBub3JtU3F1YXJlZFAyKSAvIGRlbm9taW5hdG9yO1xuICBjb25zdCBwMkZhY3RvciA9ICgxIC0gbm9ybVNxdWFyZWRQMSkgLyBkZW5vbWluYXRvcjtcblxuICBjb25zdCB4ID0gcDFGYWN0b3IgKiBwMS54ICsgcDJGYWN0b3IgKiBwMi54O1xuICBjb25zdCB5ID0gcDFGYWN0b3IgKiBwMS55ICsgcDJGYWN0b3IgKiBwMi55O1xuXG4gIHJldHVybiB7XG4gICAgeDogeCxcbiAgICB5OiB5XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGludmVyc2VUcmFuc2xhdGVQb2luY2FyZSA9IChwMSwgcDIpID0+IHtcblxufVxuIiwiaW1wb3J0IHsgUmVndWxhclRlc3NlbGF0aW9uIH0gZnJvbSAnLi9yZWd1bGFyVGVzc2VsYXRpb24nO1xuaW1wb3J0ICogYXMgRSBmcm9tICcuL2V1Y2xpZCc7XG5pbXBvcnQgeyBEaXNrIH0gZnJvbSAnLi9kaXNrJztcblxuXG4vLyAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyAqXG4vLyAqICAgU0VUVVBcbi8vICpcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuLy9jb25zdCBkaXNrID0gbmV3IERpc2soKTtcblxuY29uc3QgdGVzc2VsYXRpb24gPSBuZXcgUmVndWxhclRlc3NlbGF0aW9uKDQsIDUsIDAsICdyZWQnKTtcbiIsIi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICpcbi8vICogICBQT0lOVCBDTEFTU1xuLy8gKiAgIDJkIHBvaW50IGNsYXNzXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbmV4cG9ydCBjbGFzcyBQb2ludHtcbiAgY29uc3RydWN0b3IoeCwgeSl7XG4gICAgaWYoeC50b0ZpeGVkKDEwKSA9PSAwKXtcbiAgICAgIHggPSAwO1xuICAgIH1cbiAgICBpZih5LnRvRml4ZWQoMTApID09IDApe1xuICAgICAgeSA9IDA7XG4gICAgfVxuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgRSBmcm9tICcuL2V1Y2xpZCc7XG5pbXBvcnQgKiBhcyBIIGZyb20gJy4vaHlwZXJib2xpYyc7XG5pbXBvcnQgeyBQb2ludCB9IGZyb20gJy4vcG9pbnQnO1xuaW1wb3J0IHtcbiAgRGlza1xufVxuZnJvbSAnLi9kaXNrJztcblxuXG4vLyAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyAqICAgIFRFU1NFTEFUSU9OIENMQVNTXG4vLyAqICAgIENyZWF0ZXMgYSByZWd1bGFyIFRlc3NlbGF0aW9uIG9mIHRoZSBQb2luY2FyZSBEaXNrXG4vLyAqICAgIHE6IG51bWJlciBvZiBwLWdvbnMgbWVldGluZyBhdCBlYWNoIHZlcnRleFxuLy8gKiAgICBwOiBudW1iZXIgb2Ygc2lkZXMgb2YgcC1nb25cbi8vICogICAgdXNpbmcgdGhlIHRlY2huaXF1ZXMgY3JlYXRlZCBieSBDb3hldGVyIGFuZCBEdW5oYW1cbi8vICpcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbmV4cG9ydCBjbGFzcyBSZWd1bGFyVGVzc2VsYXRpb24ge1xuICBjb25zdHJ1Y3RvcihwLCBxLCByb3RhdGlvbiwgY29sb3VyLCBtYXhMYXllcnMpIHtcbiAgICB0aGlzLmRpc2sgPSBuZXcgRGlzaygpO1xuXG4gICAgdGhpcy5jZW50cmUgPSB7XG4gICAgICB4OiAwLFxuICAgICAgeTogMFxuICAgIH1cbiAgICB0aGlzLnAgPSBwO1xuICAgIHRoaXMucSA9IHE7XG4gICAgdGhpcy5jb2xvdXIgPSBjb2xvdXIgfHwgJ2JsYWNrJztcbiAgICB0aGlzLnJvdGF0aW9uID0gcm90YXRpb24gfHwgMDtcbiAgICB0aGlzLm1heExheWVycyA9IG1heExheWVycyB8fCA1O1xuXG4gICAgaWYgKHRoaXMuY2hlY2tQYXJhbXMoKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGV2ZW50KSA9PiB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbG9hZCcpO1xuICAgICAgdGhpcy5pbml0KCk7XG4gICAgfSwgZmFsc2UpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH0sIGZhbHNlKTtcblxuXG5cbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy5yYWRpdXMgPSB0aGlzLmRpc2suZ2V0UmFkaXVzKCk7XG4gICAgdGhpcy5mciA9IHRoaXMuZnVuZGFtZW50YWxSZWdpb24oKTtcbiAgICB0aGlzLnRlc3RpbmcoKTtcbiAgfVxuXG4gIHRlc3RpbmcoKSB7XG5cbiAgICB0aGlzLmRpc2sucG9seWdvbih0aGlzLmZyLCBFLnJhbmRvbUludCgxMDAwMCwgMTQ3NzcyMTUpKTtcbiAgICBjb25zdCBwb2x5MiA9IEgucmVmbGVjdCh0aGlzLmZyLCB0aGlzLmZyWzBdLCB0aGlzLmZyWzJdLCB0aGlzLmRpc2suY2lyY2xlKTtcbiAgICBjb25zb2xlLnRhYmxlKHBvbHkyKTtcbiAgICB0aGlzLmRpc2sucG9seWdvbihwb2x5MiwgRS5yYW5kb21JbnQoMTAwMDAsIDE0Nzc3MjE1KSk7XG5cbiAgICBjb25zdCBwb2x5MyA9IEgucmVmbGVjdChwb2x5MiwgcG9seTJbMF0sIHBvbHkyWzFdLCB0aGlzLmRpc2suY2lyY2xlKTtcbiAgICBjb25zb2xlLnRhYmxlKHBvbHkzKTtcbiAgICB0aGlzLmRpc2sucG9seWdvbihwb2x5MywgRS5yYW5kb21JbnQoMTAwMDAsIDE0Nzc3MjE1KSk7XG5cbiAgICBjb25zdCBwb2x5NCA9IEgucmVmbGVjdChwb2x5MywgcG9seTNbMF0sIHBvbHkzWzJdLCB0aGlzLmRpc2suY2lyY2xlKTtcbiAgICBjb25zb2xlLnRhYmxlKHBvbHk0KTtcbiAgICB0aGlzLmRpc2sucG9seWdvbihwb2x5NCwgRS5yYW5kb21JbnQoMTAwMDAsIDE0Nzc3MjE1KSk7XG5cbiAgICBjb25zdCBwb2x5NSA9IEgucmVmbGVjdChwb2x5NCwgcG9seTRbMF0sIHBvbHk0WzFdLCB0aGlzLmRpc2suY2lyY2xlKTtcbiAgICBjb25zb2xlLnRhYmxlKHBvbHk1KTtcbiAgICB0aGlzLmRpc2sucG9seWdvbihwb2x5NSwgRS5yYW5kb21JbnQoMTAwMDAsIDE0Nzc3MjE1KSk7XG5cbiAgICBjb25zdCBwb2x5NiA9IEgucmVmbGVjdChwb2x5NSwgcG9seTVbMF0sIHBvbHk1WzJdLCB0aGlzLmRpc2suY2lyY2xlKTtcbiAgICBjb25zb2xlLnRhYmxlKHBvbHk2KTtcbiAgICB0aGlzLmRpc2sucG9seWdvbihwb2x5NiwgRS5yYW5kb21JbnQoMTAwMDAsIDE0Nzc3MjE1KSk7XG5cbiAgICBjb25zdCBwb2x5NyA9IEgucmVmbGVjdChwb2x5NiwgcG9seTZbMF0sIHBvbHk2WzFdLCB0aGlzLmRpc2suY2lyY2xlKTtcbiAgICBjb25zb2xlLnRhYmxlKHBvbHk3KTtcbiAgICB0aGlzLmRpc2sucG9seWdvbihwb2x5NywgRS5yYW5kb21JbnQoMTAwMDAsIDE0Nzc3MjE1KSk7XG5cbiAgICBjb25zdCBwb2x5OCA9IEgucmVmbGVjdChwb2x5NywgcG9seTdbMF0sIHBvbHk3WzJdLCB0aGlzLmRpc2suY2lyY2xlKTtcbiAgICBjb25zb2xlLnRhYmxlKHBvbHk4KTtcbiAgICB0aGlzLmRpc2sucG9seWdvbihwb2x5OCwgRS5yYW5kb21JbnQoMTAwMDAsIDE0Nzc3MjE1KSk7XG5cbiAgICBsZXQgbnVtID0gODtcbiAgICBmb3IobGV0IGkgPTA7IGkgPCBudW07IGkrKyl7XG4gICAgICBsZXQgcG9seSA9IEgucm90YXRlUGdvbkFib3V0T3JpZ2luKHBvbHkyLCAoMipNYXRoLlBJL251bSkqKGkrMSkpO1xuICAgICAgdGhpcy5kaXNrLnBvbHlnb24ocG9seSwgRS5yYW5kb21JbnQoMTAwMDAsIDE0Nzc3MjE1KSk7XG4gICAgICBwb2x5ID0gSC5yb3RhdGVQZ29uQWJvdXRPcmlnaW4odGhpcy5mciwgKDIqTWF0aC5QSS9udW0pKihpKzEpKTtcbiAgICAgIHRoaXMuZGlzay5wb2x5Z29uKHBvbHksIEUucmFuZG9tSW50KDEwMDAwLCAxNDc3NzIxNSkpO1xuICAgIH1cbiAgfVxuXG4gIC8vY2FsY3VsYXRlIGZpcnN0IHBvaW50IG9mIGZ1bmRhbWVudGFsIHBvbHlnb24gdXNpbmcgQ294ZXRlcidzIG1ldGhvZFxuICBmdW5kYW1lbnRhbFJlZ2lvbigpIHtcbiAgICBjb25zdCBzID0gTWF0aC5zaW4oTWF0aC5QSSAvIHRoaXMucCk7XG4gICAgY29uc3QgdCA9IE1hdGguY29zKE1hdGguUEkgLyB0aGlzLnEpO1xuICAgIC8vbXVsdGlwbHkgdGhlc2UgYnkgdGhlIGRpc2tzIHJhZGl1cyAoQ294ZXRlciB1c2VkIHVuaXQgZGlzayk7XG4gICAgY29uc3QgciA9IDEgLyBNYXRoLnNxcnQoKHQgKiB0KSAvIChzICogcykgLSAxKSAqIHRoaXMucmFkaXVzO1xuICAgIGNvbnN0IGQgPSAxIC8gTWF0aC5zcXJ0KDEgLSAocyAqIHMpIC8gKHQgKiB0KSkgKiB0aGlzLnJhZGl1cztcbiAgICBjb25zdCBiID0ge1xuICAgICAgeDogdGhpcy5yYWRpdXMgKiBNYXRoLmNvcyhNYXRoLlBJIC8gdGhpcy5wKSxcbiAgICAgIHk6IC10aGlzLnJhZGl1cyAqIE1hdGguc2luKE1hdGguUEkgLyB0aGlzLnApXG4gICAgfVxuICAgIGNvbnN0IGNlbnRyZSA9IHtcbiAgICAgIHg6IGQsXG4gICAgICB5OiAwXG4gICAgfTtcbiAgICAvL3RoZXJlIHdpbGwgYmUgdHdvIHBvaW50cyBvZiBpbnRlcnNlY3Rpb24sIG9mIHdoaWNoIHdlIHdhbnQgdGhlIGZpcnN0XG4gICAgY29uc3QgcDEgPSBFLmNpcmNsZUxpbmVJbnRlcnNlY3QoY2VudHJlLCByLCB0aGlzLmRpc2suY2VudHJlLCBiKS5wMTtcblxuICAgIGNvbnN0IHAyID0ge1xuICAgICAgeDogZCAtIHIsXG4gICAgICB5OiAwXG4gICAgfTtcblxuICAgIGNvbnN0IHBvaW50cyA9IFt0aGlzLmRpc2suY2VudHJlLCBwMSwgcDJdO1xuXG4gICAgcmV0dXJuIHBvaW50cztcbiAgfVxuXG4gIC8vVGhlIHRlc3NlbGF0aW9uIHJlcXVpcmVzIHRoYXQgKHAtMikocS0yKSA+IDQgdG8gd29yayAob3RoZXJ3aXNlIGl0IGlzXG4gIC8vIGVpdGhlciBhbiBlbGxpcHRpY2FsIG9yIGV1Y2xpZGVhbiB0ZXNzZWxhdGlvbik7XG4gIGNoZWNrUGFyYW1zKCkge1xuICAgIGlmICh0aGlzLm1heExheWVycyA8IDAgfHwgaXNOYU4odGhpcy5tYXhMYXllcnMpKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdtYXhMYXllcnMgbXVzdCBiZSBncmVhdGVyIHRoYW4gMCcpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIGlmICgodGhpcy5wIC0gMikgKiAodGhpcy5xIC0gMikgPD0gNCkge1xuICAgICAgY29uc29sZS5lcnJvcignSHlwZXJib2xpYyB0ZXNzZWxhdGlvbnMgcmVxdWlyZSB0aGF0IChwLTEpKHEtMikgPCA0IScpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8vRm9yIG5vdyByZXF1aXJlIHAscSA+IDMsXG4gICAgLy9UT0RPIGltcGxlbWVudCBzcGVjaWFsIGNhc2VzIGZvciBxID0gMyBvciBwID0gM1xuICAgIGVsc2UgaWYgKHRoaXMucSA8PSAzIHx8IGlzTmFOKHRoaXMucSkpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1Rlc3NlbGF0aW9uIGVycm9yOiBhdCBsZWFzdCAzIHAtZ29ucyBtdXN0IG1lZXQgXFxcbiAgICAgICAgICAgICAgICAgICAgYXQgZWFjaCB2ZXJ0ZXghJyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHRoaXMucCA8PSAzIHx8IGlzTmFOKHRoaXMucCkpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1Rlc3NlbGF0aW9uIGVycm9yOiBwb2x5Z29uIG5lZWRzIGF0IGxlYXN0IDMgc2lkZXMhJyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxufVxuIiwiLy8gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gKlxuLy8gKiAgVEhSRUUgSlMgQ0xBU1Ncbi8vICpcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbmV4cG9ydCBjbGFzcyBUaHJlZUpTIHtcbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChldmVudCkgPT4ge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnKTtcbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH0sIGZhbHNlKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XG4gICAgICAvL3RoaXMuY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgLy90aGlzLmNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gICAgICAvL3RoaXMucmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcblxuICAgICAgdGhpcy5yZXNldCgpO1xuICAgIH0sIGZhbHNlKTtcblxuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG4gICAgdGhpcy5pbml0Q2FtZXJhKCk7XG5cbiAgICB0aGlzLmluaXRMaWdodGluZygpO1xuXG4gICAgdGhpcy5heGVzKCk7XG5cbiAgICB0aGlzLmluaXRSZW5kZXJlcigpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5pZCk7IC8vIFN0b3AgdGhlIGFuaW1hdGlvblxuICAgIHRoaXMucmVuZGVyZXIuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdkYmxjbGljaycsIG51bGwsIGZhbHNlKTsgLy9yZW1vdmUgbGlzdGVuZXIgdG8gcmVuZGVyXG4gICAgdGhpcy5zY2VuZSA9IG51bGw7XG4gICAgdGhpcy5wcm9qZWN0b3IgPSBudWxsO1xuICAgIHRoaXMuY2FtZXJhID0gbnVsbDtcbiAgICB0aGlzLmNvbnRyb2xzID0gbnVsbDtcblxuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnY2FudmFzJyk7XG4gICAgZm9yIChsZXQgaW5kZXggPSBlbGVtZW50Lmxlbmd0aCAtIDE7IGluZGV4ID49IDA7IGluZGV4LS0pIHtcbiAgICAgIGVsZW1lbnRbaW5kZXhdLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbWVudFtpbmRleF0pO1xuICAgIH1cbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIGluaXRDYW1lcmEoKSB7XG4gICAgdGhpcy5jYW1lcmEgPSBuZXcgVEhSRUUuT3J0aG9ncmFwaGljQ2FtZXJhKHdpbmRvdy5pbm5lcldpZHRoIC8gLTIsXG4gICAgICB3aW5kb3cuaW5uZXJXaWR0aCAvIDIsIHdpbmRvdy5pbm5lckhlaWdodCAvIDIsIHdpbmRvdy5pbm5lckhlaWdodCAvIC0yLCAtMiwgMSk7XG4gICAgdGhpcy5zY2VuZS5hZGQodGhpcy5jYW1lcmEpO1xuICAgIHRoaXMuY2FtZXJhLnBvc2l0aW9uLnggPSAwO1xuICAgIHRoaXMuY2FtZXJhLnBvc2l0aW9uLnkgPSAwO1xuXG4gICAgdGhpcy5jYW1lcmEucG9zaXRpb24ueiA9IDE7XG4gIH1cblxuICBpbml0TGlnaHRpbmcoKSB7XG4gICAgLy9jb25zdCBzcG90TGlnaHQgPSBuZXcgVEhSRUUuU3BvdExpZ2h0KDB4ZmZmZmZmKTtcbiAgICAvL3Nwb3RMaWdodC5wb3NpdGlvbi5zZXQoMCwgMCwgMTAwKTtcbiAgICAvL3RoaXMuc2NlbmUuYWRkKHNwb3RMaWdodCk7XG4gICAgY29uc3QgYW1iaWVudExpZ2h0ID0gbmV3IFRIUkVFLkFtYmllbnRMaWdodCgweGZmZmZmZik7XG4gICAgdGhpcy5zY2VuZS5hZGQoYW1iaWVudExpZ2h0KTtcbiAgfVxuXG4gIGluaXRSZW5kZXJlcigpIHtcbiAgICB0aGlzLnJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoe1xuICAgICAgYW50aWFsaWFzOiB0cnVlLFxuICAgIH0pO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0Q2xlYXJDb2xvcigweGZmZmZmZiwgMS4wKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8vYmVoaW5kOiB0cnVlL2ZhbHNlXG4gIGRpc2soY2VudHJlLCByYWRpdXMsIGNvbG9yLCBiZWhpbmQpIHtcbiAgICBpZiAoY29sb3IgPT09IHVuZGVmaW5lZCkgY29sb3IgPSAweGZmZmZmZjtcblxuICAgIGNvbnN0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkNpcmNsZUdlb21ldHJ5KHJhZGl1cywgMTAwLCAwLCAyICogTWF0aC5QSSk7XG4gICAgY29uc3QgY2lyY2xlID0gdGhpcy5jcmVhdGVNZXNoKGdlb21ldHJ5LCBjb2xvcik7XG4gICAgY2lyY2xlLnBvc2l0aW9uLnggPSBjZW50cmUueDtcbiAgICBjaXJjbGUucG9zaXRpb24ueSA9IGNlbnRyZS55O1xuICAgIGlmICghYmVoaW5kKSB7XG4gICAgICBjaXJjbGUucG9zaXRpb24ueiA9IDE7XG4gICAgfVxuXG4gICAgdGhpcy5zY2VuZS5hZGQoY2lyY2xlKTtcbiAgfVxuXG4gIHNlZ21lbnQoY2lyY2xlLCBhbHBoYSwgb2Zmc2V0LCBjb2xvcikge1xuICAgIGlmIChjb2xvciA9PT0gdW5kZWZpbmVkKSBjb2xvciA9IDB4ZmZmZmZmO1xuXG4gICAgY29uc3QgY3VydmUgPSBuZXcgVEhSRUUuRWxsaXBzZUN1cnZlKFxuICAgICAgY2lyY2xlLmNlbnRyZS54LCBjaXJjbGUuY2VudHJlLnksIC8vIGF4LCBhWVxuICAgICAgY2lyY2xlLnJhZGl1cywgY2lyY2xlLnJhZGl1cywgLy8geFJhZGl1cywgeVJhZGl1c1xuICAgICAgYWxwaGEsIG9mZnNldCwgLy8gYVN0YXJ0QW5nbGUsIGFFbmRBbmdsZVxuICAgICAgZmFsc2UgLy8gYUNsb2Nrd2lzZVxuICAgICk7XG5cbiAgICBjb25zdCBwb2ludHMgPSBjdXJ2ZS5nZXRTcGFjZWRQb2ludHMoMTAwKTtcblxuICAgIGNvbnN0IHBhdGggPSBuZXcgVEhSRUUuUGF0aCgpO1xuICAgIGNvbnN0IGdlb21ldHJ5ID0gcGF0aC5jcmVhdGVHZW9tZXRyeShwb2ludHMpO1xuXG4gICAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoe1xuICAgICAgY29sb3I6IGNvbG9yXG4gICAgfSk7XG4gICAgY29uc3QgcyA9IG5ldyBUSFJFRS5MaW5lKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cbiAgICB0aGlzLnNjZW5lLmFkZChzKTtcbiAgfVxuXG4gIGxpbmUoc3RhcnQsIGVuZCwgY29sb3IpIHtcbiAgICBpZiAoY29sb3IgPT09IHVuZGVmaW5lZCkgY29sb3IgPSAweGZmZmZmZjtcblxuICAgIGNvbnN0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkdlb21ldHJ5KCk7XG5cbiAgICBnZW9tZXRyeS52ZXJ0aWNlcy5wdXNoKFxuICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoc3RhcnQueCwgc3RhcnQueSwgMCksXG4gICAgICBuZXcgVEhSRUUuVmVjdG9yMyhlbmQueCwgZW5kLnksIDApXG4gICAgKTtcbiAgICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5MaW5lQmFzaWNNYXRlcmlhbCh7XG4gICAgICBjb2xvcjogY29sb3JcbiAgICB9KTtcbiAgICBjb25zdCBsID0gbmV3IFRIUkVFLkxpbmUoZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICB0aGlzLnNjZW5lLmFkZChsKTtcbiAgfVxuXG4gIHBvbHlnb24odmVydGljZXMsIGNvbG9yLCB0ZXh0dXJlLCB3aXJlZnJhbWUpIHtcbiAgICBpZiAoY29sb3IgPT09IHVuZGVmaW5lZCkgY29sb3IgPSAweGZmZmZmZjtcblxuICAgIGNvbnN0IHBvbHkgPSBuZXcgVEhSRUUuU2hhcGUoKTtcbiAgICBwb2x5Lm1vdmVUbyh2ZXJ0aWNlc1swXS54LCB2ZXJ0aWNlc1swXS55KTtcblxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdmVydGljZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHBvbHkubGluZVRvKHZlcnRpY2VzW2ldLngsIHZlcnRpY2VzW2ldLnkpXG4gICAgfVxuXG4gICAgcG9seS5saW5lVG8odmVydGljZXNbMF0ueCwgdmVydGljZXNbMF0ueSk7XG5cbiAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5TaGFwZUdlb21ldHJ5KHBvbHkpO1xuXG4gICAgdGhpcy5zY2VuZS5hZGQodGhpcy5jcmVhdGVNZXNoKGdlb21ldHJ5LCBjb2xvciwgdGV4dHVyZSwgd2lyZWZyYW1lKSk7XG4gIH1cblxuICBjcmVhdGVNZXNoKGdlb21ldHJ5LCBjb2xvciwgaW1hZ2VVUkwsIHdpcmVmcmFtZSkge1xuICAgIGlmKHdpcmVmcmFtZSA9PT0gdW5kZWZpbmVkKSB3aXJlZnJhbWUgPSBmYWxzZTtcbiAgICBpZiAoY29sb3IgPT09IHVuZGVmaW5lZCkgY29sb3IgPSAweGZmZmZmZjtcblxuICAgIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcbiAgICAgIGNvbG9yOiBjb2xvcixcbiAgICAgIHdpcmVmcmFtZTogd2lyZWZyYW1lXG4gICAgfSk7XG5cbiAgICBpZiAoaW1hZ2VVUkwpIHtcbiAgICAgIGNvbnN0IHRleHR1cmVMb2FkZXIgPSBuZXcgVEhSRUUuVGV4dHVyZUxvYWRlcigpO1xuXG4gICAgICAvL2xvYWQgdGV4dHVyZSBhbmQgYXBwbHkgdG8gbWF0ZXJpYWwgaW4gY2FsbGJhY2tcbiAgICAgIGNvbnN0IHRleHR1cmUgPSB0ZXh0dXJlTG9hZGVyLmxvYWQoaW1hZ2VVUkwsICh0ZXgpID0+IHt9KTtcbiAgICAgIHRleHR1cmUucmVwZWF0LnNldCgwLjA1LCAwLjA1KTtcbiAgICAgIG1hdGVyaWFsLm1hcCA9IHRleHR1cmU7XG4gICAgICBtYXRlcmlhbC5tYXAud3JhcFQgPSBUSFJFRS5SZXBlYXRXcmFwcGluZztcbiAgICAgIG1hdGVyaWFsLm1hcC53cmFwUyA9IFRIUkVFLlJlcGVhdFdyYXBwaW5nO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICB9XG5cbiAgYXhlcygpIHtcbiAgICBjb25zdCB4eXogPSBuZXcgVEhSRUUuQXhpc0hlbHBlcigyMCk7XG4gICAgdGhpcy5zY2VuZS5hZGQoeHl6KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgdGhpcy5yZW5kZXIoKVxuICAgIH0pO1xuXG4gICAgdGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5zY2VuZSwgdGhpcy5jYW1lcmEpO1xuICB9XG5cbn1cbiJdfQ==
