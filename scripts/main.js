(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
//import { Canvas } from './canvas';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Disk = undefined;

var _euclid = require('./euclid');

var E = _interopRequireWildcard(_euclid);

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

      //smaller circle for testing
      //this.radius = this.radius / 2;

      this.drawDisk();

      this.testing();
    }
  }, {
    key: 'testing',
    value: function testing() {
      var p1 = {
        x: -200,
        y: 250
      };
      var p2 = {
        x: -150,
        y: 150
      };
      var p3 = {
        x: 70,
        y: -50
      };

      var a = this.arc(p1, p2);
      console.log(a);

      this.draw.disk(a.c.centre, a.c.radius, 0xffffff, false);

      var p4 = E.nextPoint(a.c, p2, 50).p2;
      console.log(p4);

      this.point(p1, 5, 0xf00f0f);
      this.point(p2, 5, 0xffff0f);
      this.point(p4, 5, 0x00ff0f);

      //this.drawArc(p2, p3, 0xf00f0f);

      //this.polygonOutline([p1, p2, p3],0xf00f0f)
      //this.polygon([p1, p2, p3]);
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
    value: function line(p1, p2, colour) {
      var c = E.greatCircle(p1, p2, this.radius, this.centre);
      var points = E.circleIntersect(this.centre, c.centre, this.radius, c.radius);

      this.arc(points.p1, points.p2, colour);
    }

    //Draw an arc (hyperbolic line segment) between two points on the disk

  }, {
    key: 'drawArc',
    value: function drawArc(p1, p2, colour) {
      var col = colour || 0xffffff;
      if (E.throughOrigin(p1, p2)) {
        this.draw.line(p1, p2, col);
      } else {
        var arc = this.arc(p1, p2);
        this.draw.segment(arc.c, arc.startAngle, arc.endAngle, colour);
      }
    }

    //calculate greatCircle, startAngle and endAngle for hyperbolic arc

  }, {
    key: 'arc',
    value: function arc(p1, p2) {
      //check that the points are in the disk
      if (this.checkPoints(p1, p2)) {
        return false;
      }
      var alpha1 = undefined,
          alpha2 = undefined,
          startAngle = undefined,
          endAngle = undefined;
      var c = E.greatCircle(p1, p2, this.radius, this.centre);

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
        }
        //points in clockwise order
        else if (alpha1 > alpha2) {
            startAngle = alpha2;
            endAngle = alpha1;
          }
          //points in anticlockwise order
          else {
              startAngle = alpha1;
              endAngle = alpha2;
            }

      return {
        c: c,
        startAngle: startAngle,
        endAngle: endAngle
      };
    }
  }, {
    key: 'polygonOutline',
    value: function polygonOutline(vertices, colour) {
      var l = vertices.length;
      for (var i = 0; i < l; i++) {
        this.drawArc(vertices[i], vertices[(i + 1) % l], colour);
      }
    }
  }, {
    key: 'polygon',
    value: function polygon(vertices) {
      var edges = [];
      var l = vertices.length;
      for (var i = 0; i < l; i++) {
        edges.push(this.arc(vertices[i], vertices[(i + 1) % l]));
      }
      console.log(edges);
      this.draw.polygon(edges);
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

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = points[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var point = _step.value;

          if (E.distance(point, this.centre) > r) {
            console.error('Error! Point (' + point.x + ', ' + point.y + ') lies outside the plane!');
            test = true;
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

      if (test) return true;else return false;
    }
  }]);

  return Disk;
}();

},{"./euclid":2,"./threejs":5}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// * ***********************************************************************
// *
// *   EUCLIDEAN FUNCTIONS
// *   all Euclidean mathematical functions go here
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
  var p = { x: t * dx + p1.x, y: t * dy + p1.y };

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

    return { p1: q1, p2: q2 };
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
var throughOrigin = exports.throughOrigin = function throughOrigin(p1, p2) {
  if (p1.x === 0 && p2.x === 0) {
    //vertical line through centre
    return true;
  }
  var test = (-p1.x * p2.y + p1.x * p1.y) / (p2.x - p1.x) + p1.y;
  if (test === 0) return true;else return false;
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
    p1 = points[i];p2 = points[j];
    f = p1.x * p2.y - p2.x * p1.y;
    twicearea += f;
    x += (p1.x + p2.x) * f;
    y += (p1.y + p2.y) * f;
  }
  f = twicearea * 3;
  return { x: x / f, y: y / f };
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
var nextPoint = exports.nextPoint = function nextPoint(circle, point, distance) {
  var cosTheta = -(distance * distance / (2 * circle.radius * circle.radius) - 1);
  var sinThetaPos = Math.sqrt(1 - Math.pow(cosTheta, 2));
  var sinThetaNeg = -sinThetaPos;
  console.log(cosTheta, sinThetaPos);

  var xPos = circle.centre.x + cosTheta * (point.x - circle.centre.x) - sinThetaPos * (point.y - circle.centre.y);
  var xNeg = circle.centre.x + cosTheta * (point.x - circle.centre.x) - sinThetaNeg * (point.y - circle.centre.y);
  var yPos = circle.centre.y + sinThetaPos * (point.x - circle.centre.x) + cosTheta * (point.y - circle.centre.y);
  var yNeg = circle.centre.y + sinThetaNeg * (point.x - circle.centre.x) + cosTheta * (point.y - circle.centre.y);

  var p1 = { x: xPos, y: yPos };
  var p2 = { x: xNeg, y: yNeg };
  return {
    p1: p1,
    p2: p2
  };
};

/*
//flip a set of points over a hyperoblic line defined by two points
export const transform = (pointsArray, p1, p2) => {
  let newPointsArray = [];
  let c = E.greatCircle(p1, p2, disk.radius, disk.centre);

  for(let p of pointsArray){
    let newP = E.inverse(p, c.radius, c.centre);
    newPointsArray.push(newP);
  }
  return newPointsArray;
}
*/

},{}],3:[function(require,module,exports){
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

var disk = new _disk.Disk('threejs');

//const tesselation = new RegularTesselation(5, 4, 3*Math.PI/6*0, 'red');

},{"./disk":1,"./euclid":2,"./regularTesselation":4}],4:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RegularTesselation = undefined;

var _euclid = require('./euclid');

var E = _interopRequireWildcard(_euclid);

var _disk = require('./disk');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// * ***********************************************************************
// *    TESSELATION CLASS
// *    Creates a regular Tesselation of the Poincare Disk
// *    q: number of p-gons meeting at each vertex
// *    p: number of sides of p-gon
// *    using the techniques created by Coxeter and Dunham
// *
// *************************************************************************

var RegularTesselation = exports.RegularTesselation = function (_Disk) {
  _inherits(RegularTesselation, _Disk);

  function RegularTesselation(p, q, rotation, colour, maxLayers, drawClass) {
    _classCallCheck(this, RegularTesselation);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(RegularTesselation).call(this, drawClass));

    _this.p = p;
    _this.q = q;
    _this.colour = colour || 'black';
    _this.rotation = rotation || 0;
    _this.maxLayers = maxLayers || 5;

    if (_this.checkParams()) {
      var _ret;

      return _ret = false, _possibleConstructorReturn(_this, _ret);
    }

    _this.fr = _this.fundamentalRegion();

    _this.arc(_this.fr.a, _this.fr.b);
    _this.arc(_this.fr.a, _this.fr.c);
    _this.arc(_this.fr.b, _this.fr.c);
    return _this;
  }

  //calculate first point of fundamental polygon using Coxeter's method

  _createClass(RegularTesselation, [{
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

      var centre = { x: d, y: 0 };

      //there will be two points of intersection, of which we want the first
      var p1 = E.circleLineIntersect(centre, r, this.centre, b).p1;

      return {
        a: this.centre,
        b: p1,
        c: { x: d - r, y: 0 }
      };
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
}(_disk.Disk);

},{"./disk":1,"./euclid":2}],5:[function(require,module,exports){
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
      //console.log(this.scene);
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
      var col = color;
      if (col === 'undefined') col = 0xffffff;

      var geometry = new THREE.CircleGeometry(radius, 100, 0, 2 * Math.PI);
      var circle = this.createMesh(geometry, col);
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
      var col = color;
      if (col === 'undefined') col = 0xffffff;

      var curve = new THREE.EllipseCurve(circle.centre.x, circle.centre.y, // ax, aY
      circle.radius, circle.radius, // xRadius, yRadius
      alpha, offset, // aStartAngle, aEndAngle
      false // aClockwise
      );

      var points = curve.getSpacedPoints(100);

      var path = new THREE.Path();
      var geometry = path.createGeometry(points);

      var material = new THREE.LineBasicMaterial({
        color: col
      });
      var s = new THREE.Line(geometry, material);

      this.scene.add(s);
    }
  }, {
    key: 'line',
    value: function line(start, end, color) {
      var col = color;
      if (col === 'undefined') col = 0xffffff;

      var geometry = new THREE.Geometry();

      geometry.vertices.push(new THREE.Vector3(start.x, start.y, 0), new THREE.Vector3(end.x, end.y, 0));
      var material = new THREE.LineBasicMaterial({
        color: col
      });
      var l = new THREE.Line(geometry, material);
      this.scene.add(l);
    }
  }, {
    key: 'polygon',
    value: function polygon(edges) {
      var points = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = edges[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var edge = _step.value;

          var curve = new THREE.EllipseCurve(edge.c.centre.x, edge.c.centre.y, edge.c.radius, edge.c.radius, edge.startAngle, edge.endAngle, false);
          points = points.concat(curve.getSpacedPoints(10));
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

      var l = points.length;

      var poly = new THREE.Shape();
      poly.moveTo(points[0].x, points[0].y);

      for (var i = 1; i < points.length; i++) {
        poly.lineTo(points[i].x, points[i].y);
      }

      poly.lineTo(points[0].x, points[0].y);

      var geometry = new THREE.ShapeGeometry(poly);

      this.scene.add(this.createMesh(geometry, 0xffffff));
    }
  }, {
    key: 'shape',
    value: function shape() {
      // create a basic shape
      var shape = new THREE.Shape();

      // startpoint
      shape.moveTo(0, 0);

      // straight line upwards
      shape.lineTo(0, 50);

      // the top of the figure, curve to the right
      shape.quadraticCurveTo(15, 25, 25, 30);

      shape.lineTo(0, 0);

      var geometry = new THREE.ShapeGeometry(shape);
      this.curve = this.createMesh(geometry, './images/textures/test.jpg');
      this.curve.position.y = -30;
      this.curve.position.z = -40;
      this.scene.add(this.curve);
    }
  }, {
    key: 'createMesh',
    value: function createMesh(geometry, color, imageURL) {
      var col = color;
      if (col === 'undefined') col = 0xffffff;
      var material = new THREE.MeshBasicMaterial({
        color: col
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
      //this.circle.rotation.x += 0.02;
      this.renderer.render(this.scene, this.camera);
    }
  }]);

  return ThreeJS;
}();

},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJlczIwMTUvZGlzay5qcyIsImVzMjAxNS9ldWNsaWQuanMiLCJlczIwMTUvbWFpbi5qcyIsImVzMjAxNS9yZWd1bGFyVGVzc2VsYXRpb24uanMiLCJlczIwMTUvdGhyZWVqcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7OztJQ0FZLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7SUFjQSxJQUFJLFdBQUosSUFBSTtBQUNmLFdBRFcsSUFBSSxHQUNEOzs7MEJBREgsSUFBSTs7QUFFYixRQUFJLENBQUMsSUFBSSxHQUFHLGFBYmQsT0FBTyxFQWFvQixDQUFDOztBQUcxQixVQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQ3pDLFlBQU0sQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNuQyxZQUFLLElBQUksRUFBRSxDQUFDO0tBQ2IsRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFVixVQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFlBQU07QUFDdEMsWUFBSyxJQUFJLEVBQUUsQ0FBQztLQUNiLEVBQUUsS0FBSyxDQUFDLENBQUM7R0FFWDs7ZUFkVSxJQUFJOzsyQkFnQlI7QUFDTCxVQUFJLENBQUMsTUFBTSxHQUFHO0FBQ1osU0FBQyxFQUFFLENBQUM7QUFDSixTQUFDLEVBQUUsQ0FBQztPQUNMOzs7QUFBQSxBQUdELFVBQUksQ0FBQyxNQUFNLEdBQUcsQUFBQyxNQUFNLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxXQUFXLEdBQUksQUFBQyxNQUFNLENBQUMsVUFBVSxHQUFHLENBQUMsR0FBSSxDQUFDLEdBQUcsQUFBQyxNQUFNLENBQUMsV0FBVyxHQUFHLENBQUMsR0FBSSxDQUFDOzs7OztBQUFDLEFBS3BILFVBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQzs7QUFFaEIsVUFBSSxDQUFDLE9BQU8sRUFBRSxD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QUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFBLElBQUssSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUEsQUFBQyxJQUFJLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFBLEFBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFBLEFBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFcEcsTUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksQ0FBQyxHQUFHLEFBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLElBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFBLEFBQUMsSUFBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7QUFDakYsTUFBSSxFQUFFLEdBQUcsUUFBUSxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7QUFDdEQsTUFBSSxFQUFFLEdBQUcsUUFBUSxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7O0FBRXRELE1BQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxHQUFJLENBQUMsR0FBRyxBQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxJQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQSxBQUFDLElBQUssQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUEsQUFBQyxDQUFDO0FBQ2pGLE1BQUksRUFBRSxHQUFHLFFBQVEsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxJQUFJLElBQUksR0FBRyxJQUFJ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LE1BQU0sQ0FBQSxBQUFDLEdBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBQztBQUN6RSxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pELE1BQU0sV0FBVyxHQUFHLENBQUMsV0FBVyxDQUFDO0FBQ2pDLFNBQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDOztBQUVuQyxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxRQUFRLElBQUUsS0FBSyxDQUFDLENBQUMsR0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQSxBQUFDLEdBQUcsV0FBVyxJQUFFLEtBQUssQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUEsQUFBQyxDQUFDO0FBQzVHLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLFFBQVEsSUFBRSxLQUFLLENBQUMsQ0FBQyxHQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBLEFBQUMsR0FBRyxXQUFXLElBQUUsS0FBSyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQSxBQUFDLENBQUM7QUFDNUcsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsV0FBVyxJQUFFLEtBQUssQ0FBQyxDQUFDLEdBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUEsQUFBQyxHQUFHLFFBQVEsSUFBRSxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBQztBQUM1RyxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxXQUFXLElBQUUsS0FBSyxDQUFDLENBQUMsR0FBQyxNQUFNLENBQUMsTUFBTSxD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QUFFLFFBQVEsQ0FBQyxDQUFDO0tBQzNDOzs7MkJBRU07QUFDTCxVQUFNLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDckMsVUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDckI7Ozs2QkFFUTs7O0FBQ1AsMkJBQXFCLENBQUMsWUFBTTtBQUMxQixlQUFLLE1BQU0sRUFBRSxDQUFBO09BQ2QsQ0FBQzs7QUFBQyxBQUVILFVBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQy9DOzs7U0F6TlUsT0FBTyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgKiBhcyBFIGZyb20gJy4vZXVjbGlkJztcbi8vaW1wb3J0IHsgQ2FudmFzIH0gZnJvbSAnLi9jYW52YXMnO1xuaW1wb3J0IHtcbiAgVGhyZWVKU1xufVxuZnJvbSAnLi90aHJlZWpzJztcblxuLy8gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gKlxuLy8gKiAgIERJU0sgQ0xBU1Ncbi8vICogICBQb2luY2FyZSBEaXNrIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBoeXBlcmJvbGljIHBsYW5lXG4vLyAqICAgQ29udGFpbnMgYW55IGZ1bmN0aW9ucyB1c2VkIHRvIGRyYXcgdG8gdGhlIGRpc2tcbi8vICogICAoQ3VycmVudGx5IHVzaW5nIHRocmVlIGpzIGFzIGRyYXdpbmcgY2xhc3MpXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5leHBvcnQgY2xhc3MgRGlzayB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZHJhdyA9IG5ldyBUaHJlZUpTKCk7XG5cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGV2ZW50KSA9PiB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbG9hZCcpO1xuICAgICAgdGhpcy5pbml0KCk7XG4gICAgfSwgZmFsc2UpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH0sIGZhbHNlKTtcblxuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLmNlbnRyZSA9IHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwXG4gICAgfVxuXG4gICAgLy9kcmF3IGxhcmdlc3QgY2lyY2xlIHBvc3NpYmxlIGdpdmVuIHdpbmRvdyBkaW1zXG4gICAgdGhpcy5yYWRpdXMgPSAod2luZG93LmlubmVyV2lkdGggPCB3aW5kb3cuaW5uZXJIZWlnaHQpID8gKHdpbmRvdy5pbm5lcldpZHRoIC8gMikgLSA1IDogKHdpbmRvdy5pbm5lckhlaWdodCAvIDIpIC0gNTtcblxuICAgIC8vc21hbGxlciBjaXJjbGUgZm9yIHRlc3RpbmdcbiAgICAvL3RoaXMucmFkaXVzID0gdGhpcy5yYWRpdXMgLyAyO1xuXG4gICAgdGhpcy5kcmF3RGlzaygpO1xuXG4gICAgdGhpcy50ZXN0aW5nKCk7XG4gIH1cblxuICB0ZXN0aW5nKCkge1xuICAgIGNvbnN0IHAxID0ge1xuICAgICAgeDogLTIwMCxcbiAgICAgIHk6IDI1MFxuICAgIH07XG4gICAgY29uc3QgcDIgPSB7XG4gICAgICB4OiAtMTUwLFxuICAgICAgeTogMTUwXG4gICAgfTtcbiAgICBjb25zdCBwMyA9IHtcbiAgICAgIHg6IDcwLFxuICAgICAgeTogLTUwXG4gICAgfTtcblxuICAgIGNvbnN0IGEgPSB0aGlzLmFyYyhwMSwgcDIpO1xuICAgIGNvbnNvbGUubG9nKGEpO1xuXG4gICAgdGhpcy5kcmF3LmRpc2soYS5jLmNlbnRyZSwgYS5jLnJhZGl1cywgMHhmZmZmZmYsIGZhbHNlKTtcblxuICAgIGNvbnN0IHA0ID0gRS5uZXh0UG9pbnQoYS5jLCBwMiwgNTApLnAyO1xuICAgIGNvbnNvbGUubG9nKHA0KTtcblxuICAgIHRoaXMucG9pbnQocDEsIDUsIDB4ZjAwZjBmKTtcbiAgICB0aGlzLnBvaW50KHAyLCA1LCAweGZmZmYwZik7XG4gICAgdGhpcy5wb2ludChwNCwgNSwgMHgwMGZmMGYpO1xuXG4gICAgLy90aGlzLmRyYXdBcmMocDIsIHAzLCAweGYwMGYwZik7XG5cbiAgICAvL3RoaXMucG9seWdvbk91dGxpbmUoW3AxLCBwMiwgcDNdLDB4ZjAwZjBmKVxuICAgIC8vdGhpcy5wb2x5Z29uKFtwMSwgcDIsIHAzXSk7XG4gIH1cblxuICAvL2RyYXcgdGhlIGRpc2sgYmFja2dyb3VuZFxuICBkcmF3RGlzaygpIHtcbiAgICB0aGlzLmRyYXcuZGlzayh0aGlzLmNlbnRyZSwgdGhpcy5yYWRpdXMsIDB4MDAwMDAwLCB0cnVlKTtcbiAgfVxuXG4gIHBvaW50KGNlbnRyZSwgcmFkaXVzLCBjb2xvcikge1xuICAgIHRoaXMuZHJhdy5kaXNrKGNlbnRyZSwgcmFkaXVzLCBjb2xvciwgZmFsc2UpO1xuICB9XG5cbiAgLy9kcmF3IGEgaHlwZXJib2xpYyBsaW5lIGJldHdlZW4gdHdvIHBvaW50cyBvbiB0aGUgYm91bmRhcnkgY2lyY2xlXG4gIC8vVE9ETzogZml4IVxuICBsaW5lKHAxLCBwMiwgY29sb3VyKSB7XG4gICAgY29uc3QgYyA9IEUuZ3JlYXRDaXJjbGUocDEsIHAyLCB0aGlzLnJhZGl1cywgdGhpcy5jZW50cmUpO1xuICAgIGNvbnN0IHBvaW50cyA9IEUuY2lyY2xlSW50ZXJzZWN0KHRoaXMuY2VudHJlLCBjLmNlbnRyZSwgdGhpcy5yYWRpdXMsIGMucmFkaXVzKTtcblxuICAgIHRoaXMuYXJjKHBvaW50cy5wMSwgcG9pbnRzLnAyLCBjb2xvdXIpXG4gIH1cblxuICAvL0RyYXcgYW4gYXJjIChoeXBlcmJvbGljIGxpbmUgc2VnbWVudCkgYmV0d2VlbiB0d28gcG9pbnRzIG9uIHRoZSBkaXNrXG4gIGRyYXdBcmMocDEsIHAyLCBjb2xvdXIpIHtcbiAgICBjb25zdCBjb2wgPSBjb2xvdXIgfHwgMHhmZmZmZmY7XG4gICAgaWYgKEUudGhyb3VnaE9yaWdpbihwMSwgcDIpKSB7XG4gICAgICB0aGlzLmRyYXcubGluZShwMSwgcDIsIGNvbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGFyYyA9IHRoaXMuYXJjKHAxLCBwMik7XG4gICAgICB0aGlzLmRyYXcuc2VnbWVudChhcmMuYywgYXJjLnN0YXJ0QW5nbGUsIGFyYy5lbmRBbmdsZSwgY29sb3VyKTtcbiAgICB9XG4gIH1cblxuICAvL2NhbGN1bGF0ZSBncmVhdENpcmNsZSwgc3RhcnRBbmdsZSBhbmQgZW5kQW5nbGUgZm9yIGh5cGVyYm9saWMgYXJjXG4gIGFyYyhwMSwgcDIpIHtcbiAgICAvL2NoZWNrIHRoYXQgdGhlIHBvaW50cyBhcmUgaW4gdGhlIGRpc2tcbiAgICBpZih0aGlzLmNoZWNrUG9pbnRzKHAxLCBwMikpe1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICAgIGxldCBhbHBoYTEsIGFscGhhMiwgc3RhcnRBbmdsZSwgZW5kQW5nbGU7XG4gICAgY29uc3QgYyA9IEUuZ3JlYXRDaXJjbGUocDEsIHAyLCB0aGlzLnJhZGl1cywgdGhpcy5jZW50cmUpO1xuXG4gICAgY29uc3Qgb3kgPSBjLmNlbnRyZS55O1xuICAgIGNvbnN0IG94ID0gYy5jZW50cmUueDtcblxuICAgIC8vcG9pbnQgYXQgMCByYWRpYW5zIG9uIGNcbiAgICBjb25zdCBwMyA9IHtcbiAgICAgIHg6IG94ICsgYy5yYWRpdXMsXG4gICAgICB5OiBveVxuICAgIH1cblxuICAgIC8vY2FsY3VsYXRlIHRoZSBwb3NpdGlvbiBvZiBlYWNoIHBvaW50IGluIHRoZSBjaXJjbGVcbiAgICBhbHBoYTEgPSBFLmNlbnRyYWxBbmdsZShwMywgcDEsIGMucmFkaXVzKTtcbiAgICBhbHBoYTEgPSAocDEueSA8IG95KSA/IDIgKiBNYXRoLlBJIC0gYWxwaGExIDogYWxwaGExO1xuICAgIGFscGhhMiA9IEUuY2VudHJhbEFuZ2xlKHAzLCBwMiwgYy5yYWRpdXMpO1xuICAgIGFscGhhMiA9IChwMi55IDwgb3kpID8gMiAqIE1hdGguUEkgLSBhbHBoYTIgOiBhbHBoYTI7XG5cbiAgICAvL2Nhc2Ugd2hlcmUgcDEgYWJvdmUgYW5kIHAyIGJlbG93IHRoZSBsaW5lIGMuY2VudHJlIC0+IHAzXG4gICAgaWYgKChwMS54ID4gb3ggJiYgcDIueCA+IG94KSAmJiAocDEueSA8IG95ICYmIHAyLnkgPiBveSkpIHtcbiAgICAgIHN0YXJ0QW5nbGUgPSBhbHBoYTE7XG4gICAgICBlbmRBbmdsZSA9IGFscGhhMjtcbiAgICB9XG4gICAgLy9jYXNlIHdoZXJlIHAyIGFib3ZlIGFuZCBwMSBiZWxvdyB0aGUgbGluZSBjLmNlbnRyZSAtPiBwM1xuICAgIGVsc2UgaWYgKChwMS54ID4gb3ggJiYgcDIueCA+IG94KSAmJiAocDEueSA+IG95ICYmIHAyLnkgPCBveSkpIHtcbiAgICAgIHN0YXJ0QW5nbGUgPSBhbHBoYTI7XG4gICAgICBlbmRBbmdsZSA9IGFscGhhMTtcbiAgICB9XG4gICAgLy9wb2ludHMgaW4gY2xvY2t3aXNlIG9yZGVyXG4gICAgZWxzZSBpZiAoYWxwaGExID4gYWxwaGEyKSB7XG4gICAgICBzdGFydEFuZ2xlID0gYWxwaGEyO1xuICAgICAgZW5kQW5nbGUgPSBhbHBoYTE7XG4gICAgfVxuICAgIC8vcG9pbnRzIGluIGFudGljbG9ja3dpc2Ugb3JkZXJcbiAgICBlbHNlIHtcbiAgICAgIHN0YXJ0QW5nbGUgPSBhbHBoYTE7XG4gICAgICBlbmRBbmdsZSA9IGFscGhhMjtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgYzogYyxcbiAgICAgIHN0YXJ0QW5nbGU6IHN0YXJ0QW5nbGUsXG4gICAgICBlbmRBbmdsZTogZW5kQW5nbGVcbiAgICB9XG4gIH1cblxuICBwb2x5Z29uT3V0bGluZSh2ZXJ0aWNlcywgY29sb3VyKSB7XG4gICAgY29uc3QgbCA9IHZlcnRpY2VzLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgdGhpcy5kcmF3QXJjKHZlcnRpY2VzW2ldLCB2ZXJ0aWNlc1soaSArIDEpICUgbF0sIGNvbG91cik7XG4gICAgfVxuICB9XG5cbiAgcG9seWdvbih2ZXJ0aWNlcykge1xuICAgIGNvbnN0IGVkZ2VzID0gW107XG4gICAgY29uc3QgbCA9IHZlcnRpY2VzLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgZWRnZXMucHVzaCh0aGlzLmFyYyh2ZXJ0aWNlc1tpXSwgdmVydGljZXNbKGkgKyAxKSAlIGxdKSk7XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKGVkZ2VzKTtcbiAgICB0aGlzLmRyYXcucG9seWdvbihlZGdlcyk7XG4gIH1cblxuICAvL3JldHVybiB0cnVlIGlmIGFueSBvZiB0aGUgcG9pbnRzIGlzIG5vdCBpbiB0aGUgZGlza1xuICBjaGVja1BvaW50cyguLi5wb2ludHMpIHtcbiAgICBjb25zdCByID0gdGhpcy5yYWRpdXM7XG4gICAgbGV0IHRlc3QgPSBmYWxzZTtcbiAgICBmb3IobGV0IHBvaW50IG9mIHBvaW50cyl7XG4gICAgICBpZiAoRS5kaXN0YW5jZShwb2ludCwgdGhpcy5jZW50cmUpID4gcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciEgUG9pbnQgKCcgKyBwb2ludC54ICsgJywgJyArIHBvaW50LnkgKyAnKSBsaWVzIG91dHNpZGUgdGhlIHBsYW5lIScpO1xuICAgICAgICB0ZXN0ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYodGVzdCkgcmV0dXJuIHRydWVcbiAgICBlbHNlIHJldHVybiBmYWxzZVxuICB9XG59XG4iLCIvLyAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyAqXG4vLyAqICAgRVVDTElERUFOIEZVTkNUSU9OU1xuLy8gKiAgIGFsbCBFdWNsaWRlYW4gbWF0aGVtYXRpY2FsIGZ1bmN0aW9ucyBnbyBoZXJlXG4vLyAqXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbi8vZGlzdGFuY2UgYmV0d2VlbiB0d28gcG9pbnRzXG5leHBvcnQgY29uc3QgZGlzdGFuY2UgPSAocDEsIHAyKSA9PiBNYXRoLnNxcnQoTWF0aC5wb3coKHAyLnggLSBwMS54KSwgMikgKyBNYXRoLnBvdygocDIueSAtIHAxLnkpLCAyKSk7XG5cbi8vbWlkcG9pbnQgb2YgdGhlIGxpbmUgc2VnbWVudCBjb25uZWN0aW5nIHR3byBwb2ludHNcbmV4cG9ydCBjb25zdCBtaWRwb2ludCA9IChwMSwgcDIpID0+IHtcbiAgcmV0dXJuIHtcbiAgICB4OiAocDEueCArIHAyLngpIC8gMixcbiAgICB5OiAocDEueSArIHAyLnkpIC8gMlxuICB9XG59XG5cbi8vc2xvcGUgb2YgbGluZSB0aHJvdWdoIHAxLCBwMlxuZXhwb3J0IGNvbnN0IHNsb3BlID0gKHAxLCBwMikgPT4gKHAyLnggLSBwMS54KSAvIChwMi55IC0gcDEueSk7XG5cbi8vc2xvcGUgb2YgbGluZSBwZXJwZW5kaWN1bGFyIHRvIGEgbGluZSBkZWZpbmVkIGJ5IHAxLHAyXG5leHBvcnQgY29uc3QgcGVycGVuZGljdWxhclNsb3BlID0gKHAxLCBwMikgPT4gLTEgLyAoTWF0aC5wb3coc2xvcGUocDEsIHAyKSwgLTEpKTtcblxuLy9pbnRlcnNlY3Rpb24gcG9pbnQgb2YgdHdvIGxpbmVzIGRlZmluZWQgYnkgcDEsbTEgYW5kIHExLG0yXG4vL05PVCBXT1JLSU5HIEZPUiBWRVJUSUNBTCBMSU5FUyEhIVxuZXhwb3J0IGNvbnN0IGludGVyc2VjdGlvbiA9IChwMSwgbTEsIHAyLCBtMikgPT4ge1xuICBsZXQgYzEsIGMyLCB4LCB5O1xuICAvL2Nhc2Ugd2hlcmUgZmlyc3QgbGluZSBpcyB2ZXJ0aWNhbFxuICAvL2lmKG0xID4gNTAwMCB8fCBtMSA8IC01MDAwIHx8IG0xID09PSBJbmZpbml0eSl7XG4gIGlmKHAxLnkgPCAwLjAwMDAwMSAmJiBwMS55ID4gLTAuMDAwMDAxICl7XG4gICAgeCA9IHAxLng7XG4gICAgeSA9IChtMikqKHAxLngtcDIueCkgKyBwMi55O1xuICB9XG4gIC8vY2FzZSB3aGVyZSBzZWNvbmQgbGluZSBpcyB2ZXJ0aWNhbFxuICAvL2Vsc2UgaWYobTIgPiA1MDAwIHx8IG0yIDwgLTUwMDAgfHwgbTEgPT09IEluZmluaXR5KXtcbiAgZWxzZSBpZihwMi55IDwgMC4wMDAwMDEgJiYgcDIueSA+IC0wLjAwMDAwMSApe1xuICAgIHggPSBwMi54O1xuICAgIHkgPSAobTEqKHAyLngtcDEueCkpICsgcDEueTtcbiAgfVxuICBlbHNle1xuICAgIC8veSBpbnRlcmNlcHQgb2YgZmlyc3QgbGluZVxuICAgIGMxID0gcDEueSAtIG0xICogcDEueDtcbiAgICAvL3kgaW50ZXJjZXB0IG9mIHNlY29uZCBsaW5lXG4gICAgYzIgPSBwMi55IC0gbTIgKiBwMi54O1xuXG4gICAgeCA9IChjMiAtIGMxKSAvIChtMSAtIG0yKTtcbiAgICB5ID0gbTEgKiB4ICsgYzE7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHg6IHgsXG4gICAgeTogeVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCByYWRpYW5zID0gKGRlZ3JlZXMpID0+IChNYXRoLlBJIC8gMTgwKSAqIGRlZ3JlZXM7XG5cbi8vZ2V0IHRoZSBjaXJjbGUgaW52ZXJzZSBvZiBhIHBvaW50IHAgd2l0aCByZXNwZWN0IGEgY2lyY2xlIHJhZGl1cyByIGNlbnRyZSBjXG5leHBvcnQgY29uc3QgaW52ZXJzZSA9IChwLCByLCBjKSA9PiB7XG4gIGxldCBhbHBoYSA9IChyICogcikgLyAoTWF0aC5wb3cocC54IC0gYy54LCAyKSArIE1hdGgucG93KHAueSAtIGMueSwgMikpO1xuICByZXR1cm4ge1xuICAgIHg6IGFscGhhICogKHAueCAtIGMueCkgKyBjLngsXG4gICAgeTogYWxwaGEgKiAocC55IC0gYy55KSArIGMueVxuICB9O1xufVxuXG4vL2NhbGN1bGF0ZSB0aGUgcmFkaXVzIGFuZCBjZW50cmUgb2YgdGhlIGNpcmNsZSByZXF1aXJlZCB0byBkcmF3IGEgbGluZSBiZXR3ZWVuXG4vL3R3byBwb2ludHMgaW4gdGhlIGh5cGVyYm9saWMgcGxhbmUgZGVmaW5lZCBieSB0aGUgZGlzayAociwgYylcbmV4cG9ydCBjb25zdCBncmVhdENpcmNsZSA9IChwMSwgcDIsIHIsIGMpID0+IHtcbiAgbGV0IHAxSW52ZXJzZSA9IGludmVyc2UocDEsIHIsIGMpO1xuICBsZXQgcDJJbnZlcnNlID0gaW52ZXJzZShwMiwgciwgYyk7XG5cbiAgbGV0IG0gPSBtaWRwb2ludChwMSwgcDFJbnZlcnNlKTtcbiAgbGV0IG4gPSBtaWRwb2ludChwMiwgcDJJbnZlcnNlKTtcblxuICBsZXQgbTEgPSBwZXJwZW5kaWN1bGFyU2xvcGUobSwgcDFJbnZlcnNlKTtcbiAgbGV0IG0yID0gcGVycGVuZGljdWxhclNsb3BlKG4sIHAySW52ZXJzZSk7XG5cblxuICAvL2NlbnRyZSBpcyB0aGUgY2VudHJlcG9pbnQgb2YgdGhlIGNpcmNsZSBvdXQgb2Ygd2hpY2ggdGhlIGFyYyBpcyBtYWRlXG4gIGxldCBjZW50cmUgPSBpbnRlcnNlY3Rpb24obSwgbTEsIG4sIG0yKTtcbiAgbGV0IHJhZGl1cyA9IGRpc3RhbmNlKGNlbnRyZSwgcDEpO1xuICByZXR1cm4ge1xuICAgIGNlbnRyZTogY2VudHJlLFxuICAgIHJhZGl1czogcmFkaXVzXG4gIH07XG59XG5cbi8vYW4gYXR0ZW1wdCBhdCBjYWxjdWxhdGluZyB0aGUgY2lyY2xlIGFsZ2VicmFpY2FsbHlcbmV4cG9ydCBjb25zdCBncmVhdENpcmNsZVYyID0gKHAxLHAyLCByKSA9PntcbiAgbGV0IHggPSAocDIueSoocDEueCpwMS54ICsgcikrIHAxLnkqcDEueSpwMi55LXAxLnkqKHAyLngqcDIueCsgcDIueSpwMi55ICsgcikpLygyKnAxLngqcDIueSAtIHAxLnkqcDIueCk7XG4gIGxldCB5ID0gKHAxLngqcDEueCpwMi54IC0gcDEueCoocDIueCpwMi54K3AyLnkqcDIueStyKStwMi54KihwMS55KnAxLnkrcikpLygyKnAxLnkqcDIueCArIDIqcDEueCpwMi55KTtcbiAgbGV0IHJhZGl1cyA9ICAgTWF0aC5zcXJ0KHgqeCt5Knktcik7XG4gIHJldHVybiB7XG4gICAgY2VudHJlOiB7XG4gICAgICB4OiB4LFxuICAgICAgeTogeVxuICAgIH0sXG4gICAgcmFkaXVzOiByYWRpdXNcbiAgfVxufVxuXG4vL2ludGVyc2VjdGlvbiBvZiB0d28gY2lyY2xlcyB3aXRoIGVxdWF0aW9uczpcbi8vKHgtYSleMiArKHktYSleMiA9IHIwXjJcbi8vKHgtYileMiArKHktYyleMiA9IHIxXjJcbi8vTk9URSBhc3N1bWVzIHRoZSB0d28gY2lyY2xlcyBETyBpbnRlcnNlY3QhXG5leHBvcnQgY29uc3QgY2lyY2xlSW50ZXJzZWN0ID0gKGMwLCBjMSwgcjAsIHIxKSA9PiB7XG4gIGxldCBhID0gYzAueDtcbiAgbGV0IGIgPSBjMC55O1xuICBsZXQgYyA9IGMxLng7XG4gIGxldCBkID0gYzEueTtcbiAgbGV0IGRpc3QgPSBNYXRoLnNxcnQoKGMgLSBhKSAqIChjIC0gYSkgKyAoZCAtIGIpICogKGQgLSBiKSk7XG5cbiAgbGV0IGRlbCA9IE1hdGguc3FydCgoZGlzdCArIHIwICsgcjEpICogKGRpc3QgKyByMCAtIHIxKSAqIChkaXN0IC0gcjAgKyByMSkgKiAoLWRpc3QgKyByMCArIHIxKSkgLyA0O1xuXG4gIGxldCB4UGFydGlhbCA9IChhICsgYykgLyAyICsgKChjIC0gYSkgKiAocjAgKiByMCAtIHIxICogcjEpKSAvICgyICogZGlzdCAqIGRpc3QpO1xuICBsZXQgeDEgPSB4UGFydGlhbCAtIDIgKiBkZWwgKiAoYiAtIGQpIC8gKGRpc3QgKiBkaXN0KTtcbiAgbGV0IHgyID0geFBhcnRpYWwgKyAyICogZGVsICogKGIgLSBkKSAvIChkaXN0ICogZGlzdCk7XG5cbiAgbGV0IHlQYXJ0aWFsID0gKGIgKyBkKSAvIDIgKyAoKGQgLSBiKSAqIChyMCAqIHIwIC0gcjEgKiByMSkpIC8gKDIgKiBkaXN0ICogZGlzdCk7XG4gIGxldCB5MSA9IHlQYXJ0aWFsICsgMiAqIGRlbCAqIChhIC0gYykgLyAoZGlzdCAqIGRpc3QpO1xuICBsZXQgeTIgPSB5UGFydGlhbCAtIDIgKiBkZWwgKiAoYSAtIGMpIC8gKGRpc3QgKiBkaXN0KTtcblxuICBsZXQgcDEgPSB7XG4gICAgeDogeDEsXG4gICAgeTogeTFcbiAgfVxuXG4gIGxldCBwMiA9IHtcbiAgICB4OiB4MixcbiAgICB5OiB5MlxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBwMTogcDEsXG4gICAgcDI6IHAyXG4gIH07XG59XG5cbmV4cG9ydCBjb25zdCBjaXJjbGVMaW5lSW50ZXJzZWN0ID0gKGMsIHIsIHAxLCBwMikgPT4ge1xuXG4gIGNvbnN0IGQgPSBkaXN0YW5jZShwMSwgcDIpO1xuICAvL3VuaXQgdmVjdG9yIHAxIHAyXG4gIGNvbnN0IGR4ID0gKHAyLnggLSBwMS54KS9kO1xuICBjb25zdCBkeSA9IChwMi55IC0gcDEueSkvZDtcblxuICAvL3BvaW50IG9uIGxpbmUgY2xvc2VzdCB0byBjaXJjbGUgY2VudHJlXG4gIGNvbnN0IHQgPSBkeCooYy54IC1wMS54KSArIGR5KihjLnktcDEueSk7XG4gIGNvbnN0IHAgPSAge3g6IHQqIGR4ICsgcDEueCwgeTogdCogZHkgKyBwMS55fTtcblxuICAvL2Rpc3RhbmNlIGZyb20gdGhpcyBwb2ludCB0byBjZW50cmVcbiAgY29uc3QgZDIgPSBkaXN0YW5jZShwLCBjKTtcblxuICAvL2xpbmUgaW50ZXJzZWN0cyBjaXJjbGVcbiAgaWYoZDIgPCByKXtcbiAgICBjb25zdCBkdCA9IE1hdGguc3FydCggcipyIC0gZDIqZDIpO1xuICAgIC8vcG9pbnQgMVxuICAgIGNvbnN0IHExID0ge1xuICAgICAgeDogKHQtZHQpKmR4ICsgcDEueCxcbiAgICAgIHk6ICh0LWR0KSpkeSArIHAxLnlcbiAgICB9XG4gICAgLy9wb2ludCAyXG4gICAgY29uc3QgcTIgPSB7XG4gICAgICB4OiAodCtkdCkqZHggKyBwMS54LFxuICAgICAgeTogKHQrZHQpKmR5ICsgcDEueVxuICAgIH1cblxuICAgIHJldHVybiB7cDE6IHExLCBwMjogcTJ9O1xuICB9XG4gIGVsc2UgaWYoIGQyID09PSByKXtcbiAgICByZXR1cm4gcDtcbiAgfVxuICBlbHNle1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yOiBsaW5lIGRvZXMgbm90IGludGVyc2VjdCBjaXJjbGUhJyk7XG4gIH1cbn1cblxuLy9hbmdsZSBpbiByYWRpYW5zIGJldHdlZW4gdHdvIHBvaW50cyBvbiBjaXJjbGUgb2YgcmFkaXVzIHJcbmV4cG9ydCBjb25zdCBjZW50cmFsQW5nbGUgPSAocDEsIHAyLCByKSA9PiB7XG4gIHJldHVybiAyICogTWF0aC5hc2luKDAuNSAqIGRpc3RhbmNlKHAxLCBwMikgLyByKTtcbn1cblxuLy9jYWxjdWxhdGUgdGhlIG5vcm1hbCB2ZWN0b3IgZ2l2ZW4gMiBwb2ludHNcbmV4cG9ydCBjb25zdCBub3JtYWxWZWN0b3IgPSAocDEsIHAyKSA9PiB7XG4gIGxldCBkID0gTWF0aC5zcXJ0KE1hdGgucG93KHAyLngtcDEueCwyKSArIE1hdGgucG93KHAyLnktcDEueSwyKSk7XG4gIHJldHVybiB7XG4gICAgeDogKHAyLngtcDEueCkvZCxcbiAgICB5OiAocDIueS1wMS55KS9kXG4gIH1cbn1cblxuLy9kb2VzIHRoZSBsaW5lIGNvbm5lY3RpbmcgcDEsIHAyIGdvIHRocm91Z2ggdGhlIHBvaW50ICgwLDApP1xuZXhwb3J0IGNvbnN0IHRocm91Z2hPcmlnaW4gPSAocDEsIHAyKSA9PiB7XG4gIGlmKHAxLnggPT09IDAgJiYgcDIueCA9PT0gMCl7XG4gICAgLy92ZXJ0aWNhbCBsaW5lIHRocm91Z2ggY2VudHJlXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgbGV0IHRlc3QgPSAoLXAxLngqcDIueSArIHAxLngqcDEueSkvKHAyLngtcDEueCkgKyBwMS55O1xuICBpZih0ZXN0ID09PSAwKSByZXR1cm4gdHJ1ZTtcbiAgZWxzZSByZXR1cm4gZmFsc2U7XG59XG5cbi8vZmluZCB0aGUgY2VudHJvaWQgb2YgYSBub24tc2VsZi1pbnRlcnNlY3RpbmcgcG9seWdvblxuZXhwb3J0IGNvbnN0IGNlbnRyb2lkT2ZQb2x5Z29uID0gKHBvaW50cykgPT4ge1xuICBsZXQgZmlyc3QgPSBwb2ludHNbMF0sIGxhc3QgPSBwb2ludHNbcG9pbnRzLmxlbmd0aC0xXTtcbiAgaWYgKGZpcnN0LnggIT0gbGFzdC54IHx8IGZpcnN0LnkgIT0gbGFzdC55KSBwb2ludHMucHVzaChmaXJzdCk7XG4gIGxldCB0d2ljZWFyZWE9MCxcbiAgICB4PTAsIHk9MCxcbiAgICBuUHRzID0gcG9pbnRzLmxlbmd0aCxcbiAgICBwMSwgcDIsIGY7XG4gIGZvciAoIHZhciBpPTAsIGo9blB0cy0xIDsgaTxuUHRzIDsgaj1pKysgKSB7XG4gICAgcDEgPSBwb2ludHNbaV07IHAyID0gcG9pbnRzW2pdO1xuICAgIGYgPSBwMS54KnAyLnkgLSBwMi54KnAxLnk7XG4gICAgdHdpY2VhcmVhICs9IGY7XG4gICAgeCArPSAoIHAxLnggKyBwMi54ICkgKiBmO1xuICAgIHkgKz0gKCBwMS55ICsgcDIueSApICogZjtcbiAgfVxuICBmID0gdHdpY2VhcmVhICogMztcbiAgcmV0dXJuIHsgeDp4L2YsIHk6eS9mIH07XG59XG5cbi8vY29tcGFyZSB0d28gcG9pbnRzIHRha2luZyByb3VuZGluZyBlcnJvcnMgaW50byBhY2NvdW50XG5leHBvcnQgY29uc3QgY29tcGFyZVBvaW50cyA9IChwMSwgcDIpID0+IHtcbiAgaWYodHlwZW9mIHAxID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgcDIgPT09ICd1bmRlZmluZWQnKXtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBwMSA9IHBvaW50VG9GaXhlZChwMSwgNik7XG4gIHAyID0gcG9pbnRUb0ZpeGVkKHAyLCA2KTtcbiAgaWYocDEueCA9PT0gcDIueCAmJiBwMS55ID09PSBwMi55KSByZXR1cm4gdHJ1ZTtcbiAgZWxzZSByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBjb25zdCBwb2ludFRvRml4ZWQgPSAocCwgcGxhY2VzKSA9PiB7XG4gIHJldHVybiB7XG4gICAgeDogcC54LnRvRml4ZWQocGxhY2VzKSxcbiAgICB5OiBwLnkudG9GaXhlZChwbGFjZXMpXG4gIH07XG59XG5cbi8vZmluZCBhIHBvaW50IGF0IGEgZGlzdGFuY2UgZCBhbG9uZyB0aGUgY2lyY3VtZmVyZW5jZSBvZlxuLy9hIGNpcmNsZSBvZiByYWRpdXMgciwgY2VudHJlIGMgZnJvbSBhIHBvaW50IGFsc29cbi8vb24gdGhlIGNpcmN1bWZlcmVuY2VcbmV4cG9ydCBjb25zdCBuZXh0UG9pbnQgPSAoY2lyY2xlLCBwb2ludCwgZGlzdGFuY2UpID0+IHtcbiAgY29uc3QgY29zVGhldGEgPS0oKGRpc3RhbmNlKmRpc3RhbmNlKS8oMipjaXJjbGUucmFkaXVzKmNpcmNsZS5yYWRpdXMpLTEpO1xuICBjb25zdCBzaW5UaGV0YVBvcyA9IE1hdGguc3FydCgxIC0gTWF0aC5wb3coY29zVGhldGEsIDIpKTtcbiAgY29uc3Qgc2luVGhldGFOZWcgPSAtc2luVGhldGFQb3M7XG4gIGNvbnNvbGUubG9nKGNvc1RoZXRhLCBzaW5UaGV0YVBvcyk7XG5cbiAgY29uc3QgeFBvcyA9IGNpcmNsZS5jZW50cmUueCArIGNvc1RoZXRhKihwb2ludC54LWNpcmNsZS5jZW50cmUueCkgLSBzaW5UaGV0YVBvcyoocG9pbnQueSAtIGNpcmNsZS5jZW50cmUueSk7XG4gIGNvbnN0IHhOZWcgPSBjaXJjbGUuY2VudHJlLnggKyBjb3NUaGV0YSoocG9pbnQueC1jaXJjbGUuY2VudHJlLngpIC0gc2luVGhldGFOZWcqKHBvaW50LnkgLSBjaXJjbGUuY2VudHJlLnkpO1xuICBjb25zdCB5UG9zID0gY2lyY2xlLmNlbnRyZS55ICsgc2luVGhldGFQb3MqKHBvaW50LngtY2lyY2xlLmNlbnRyZS54KSArIGNvc1RoZXRhKihwb2ludC55IC0gY2lyY2xlLmNlbnRyZS55KTtcbiAgY29uc3QgeU5lZyA9IGNpcmNsZS5jZW50cmUueSArIHNpblRoZXRhTmVnKihwb2ludC54LWNpcmNsZS5jZW50cmUueCkgKyBjb3NUaGV0YSoocG9pbnQueSAtIGNpcmNsZS5jZW50cmUueSk7XG5cbiAgY29uc3QgcDEgPSB7eDogeFBvcywgeTogeVBvc307XG4gIGNvbnN0IHAyID0ge3g6IHhOZWcsIHk6IHlOZWd9O1xuICByZXR1cm4ge1xuICAgIHAxOiBwMSxcbiAgICBwMjogcDJcbiAgfVxufVxuXG4vKlxuLy9mbGlwIGEgc2V0IG9mIHBvaW50cyBvdmVyIGEgaHlwZXJvYmxpYyBsaW5lIGRlZmluZWQgYnkgdHdvIHBvaW50c1xuZXhwb3J0IGNvbnN0IHRyYW5zZm9ybSA9IChwb2ludHNBcnJheSwgcDEsIHAyKSA9PiB7XG4gIGxldCBuZXdQb2ludHNBcnJheSA9IFtdO1xuICBsZXQgYyA9IEUuZ3JlYXRDaXJjbGUocDEsIHAyLCBkaXNrLnJhZGl1cywgZGlzay5jZW50cmUpO1xuXG4gIGZvcihsZXQgcCBvZiBwb2ludHNBcnJheSl7XG4gICAgbGV0IG5ld1AgPSBFLmludmVyc2UocCwgYy5yYWRpdXMsIGMuY2VudHJlKTtcbiAgICBuZXdQb2ludHNBcnJheS5wdXNoKG5ld1ApO1xuICB9XG4gIHJldHVybiBuZXdQb2ludHNBcnJheTtcbn1cbiovXG4iLCJpbXBvcnQgeyBSZWd1bGFyVGVzc2VsYXRpb24gfSBmcm9tICcuL3JlZ3VsYXJUZXNzZWxhdGlvbic7XG5pbXBvcnQgKiBhcyBFIGZyb20gJy4vZXVjbGlkJztcbmltcG9ydCB7IERpc2sgfSBmcm9tICcuL2Rpc2snO1xuXG5cbi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICpcbi8vICogICBTRVRVUFxuLy8gKlxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG5jb25zdCBkaXNrID0gbmV3IERpc2soJ3RocmVlanMnKTtcblxuLy9jb25zdCB0ZXNzZWxhdGlvbiA9IG5ldyBSZWd1bGFyVGVzc2VsYXRpb24oNSwgNCwgMypNYXRoLlBJLzYqMCwgJ3JlZCcpO1xuIiwiaW1wb3J0ICogYXMgRSBmcm9tICcuL2V1Y2xpZCc7XG5pbXBvcnQgeyBEaXNrIH0gZnJvbSAnLi9kaXNrJztcbi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICogICAgVEVTU0VMQVRJT04gQ0xBU1Ncbi8vICogICAgQ3JlYXRlcyBhIHJlZ3VsYXIgVGVzc2VsYXRpb24gb2YgdGhlIFBvaW5jYXJlIERpc2tcbi8vICogICAgcTogbnVtYmVyIG9mIHAtZ29ucyBtZWV0aW5nIGF0IGVhY2ggdmVydGV4XG4vLyAqICAgIHA6IG51bWJlciBvZiBzaWRlcyBvZiBwLWdvblxuLy8gKiAgICB1c2luZyB0aGUgdGVjaG5pcXVlcyBjcmVhdGVkIGJ5IENveGV0ZXIgYW5kIER1bmhhbVxuLy8gKlxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuZXhwb3J0IGNsYXNzIFJlZ3VsYXJUZXNzZWxhdGlvbiBleHRlbmRzIERpc2sge1xuICBjb25zdHJ1Y3RvcihwLCBxLCByb3RhdGlvbiwgY29sb3VyLCBtYXhMYXllcnMsIGRyYXdDbGFzcykge1xuICAgIHN1cGVyKGRyYXdDbGFzcyk7XG4gICAgdGhpcy5wID0gcDtcbiAgICB0aGlzLnEgPSBxO1xuICAgIHRoaXMuY29sb3VyID0gY29sb3VyIHx8ICdibGFjayc7XG4gICAgdGhpcy5yb3RhdGlvbiA9IHJvdGF0aW9uIHx8IDA7XG4gICAgdGhpcy5tYXhMYXllcnMgPSBtYXhMYXllcnMgfHwgNTtcblxuICAgIGlmKHRoaXMuY2hlY2tQYXJhbXMoKSl7IHJldHVybiBmYWxzZTt9XG5cbiAgICB0aGlzLmZyID0gdGhpcy5mdW5kYW1lbnRhbFJlZ2lvbigpO1xuXG4gICAgdGhpcy5hcmModGhpcy5mci5hLCB0aGlzLmZyLmIpO1xuICAgIHRoaXMuYXJjKHRoaXMuZnIuYSwgdGhpcy5mci5jKTtcbiAgICB0aGlzLmFyYyh0aGlzLmZyLmIsIHRoaXMuZnIuYyk7XG4gIH1cblxuICAvL2NhbGN1bGF0ZSBmaXJzdCBwb2ludCBvZiBmdW5kYW1lbnRhbCBwb2x5Z29uIHVzaW5nIENveGV0ZXIncyBtZXRob2RcbiAgZnVuZGFtZW50YWxSZWdpb24oKXtcbiAgICBjb25zdCBzID0gTWF0aC5zaW4oTWF0aC5QSS90aGlzLnApO1xuICAgIGNvbnN0IHQgPSBNYXRoLmNvcyhNYXRoLlBJL3RoaXMucSk7XG4gICAgLy9tdWx0aXBseSB0aGVzZSBieSB0aGUgZGlza3MgcmFkaXVzIChDb3hldGVyIHVzZWQgdW5pdCBkaXNrKTtcbiAgICBjb25zdCByID0gMS9NYXRoLnNxcnQoKHQqdCkvKHMqcykgLTEpKnRoaXMucmFkaXVzO1xuICAgIGNvbnN0IGQgPSAxL01hdGguc3FydCgxLSAocypzKS8odCp0KSkqdGhpcy5yYWRpdXM7XG4gICAgY29uc3QgYiA9IHtcbiAgICAgIHg6IHRoaXMucmFkaXVzKk1hdGguY29zKE1hdGguUEkvdGhpcy5wKSxcbiAgICAgIHk6IC10aGlzLnJhZGl1cypNYXRoLnNpbihNYXRoLlBJL3RoaXMucClcbiAgICB9XG5cbiAgICBjb25zdCBjZW50cmUgPSB7eDogZCwgeTogMH07XG5cbiAgICAvL3RoZXJlIHdpbGwgYmUgdHdvIHBvaW50cyBvZiBpbnRlcnNlY3Rpb24sIG9mIHdoaWNoIHdlIHdhbnQgdGhlIGZpcnN0XG4gICAgY29uc3QgcDEgPSBFLmNpcmNsZUxpbmVJbnRlcnNlY3QoY2VudHJlLCByLCB0aGlzLmNlbnRyZSwgYikucDE7XG5cbiAgICByZXR1cm4ge1xuICAgICAgYTogdGhpcy5jZW50cmUsXG4gICAgICBiOiBwMSxcbiAgICAgIGM6IHsgeDogZC1yLCB5OiAwfVxuICAgIH07XG4gIH1cblxuICAvL1RoZSB0ZXNzZWxhdGlvbiByZXF1aXJlcyB0aGF0IChwLTIpKHEtMikgPiA0IHRvIHdvcmsgKG90aGVyd2lzZSBpdCBpc1xuICAvLyBlaXRoZXIgYW4gZWxsaXB0aWNhbCBvciBldWNsaWRlYW4gdGVzc2VsYXRpb24pO1xuICBjaGVja1BhcmFtcygpe1xuICAgIGlmKHRoaXMubWF4TGF5ZXJzIDwgMCB8fCBpc05hTih0aGlzLm1heExheWVycykpe1xuICAgICAgY29uc29sZS5lcnJvcignbWF4TGF5ZXJzIG11c3QgYmUgZ3JlYXRlciB0aGFuIDAnKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBlbHNlIGlmKCh0aGlzLnAgLTIpKih0aGlzLnEtMikgPD0gNCl7XG4gICAgICBjb25zb2xlLmVycm9yKCdIeXBlcmJvbGljIHRlc3NlbGF0aW9ucyByZXF1aXJlIHRoYXQgKHAtMSkocS0yKSA8IDQhJyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLy9Gb3Igbm93IHJlcXVpcmUgcCxxID4gMyxcbiAgICAvL1RPRE8gaW1wbGVtZW50IHNwZWNpYWwgY2FzZXMgZm9yIHEgPSAzIG9yIHAgPSAzXG4gICAgZWxzZSBpZih0aGlzLnEgPD0gMyB8fCBpc05hTih0aGlzLnEpKXtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1Rlc3NlbGF0aW9uIGVycm9yOiBhdCBsZWFzdCAzIHAtZ29ucyBtdXN0IG1lZXQgXFxcbiAgICAgICAgICAgICAgICAgICAgYXQgZWFjaCB2ZXJ0ZXghJyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZSBpZih0aGlzLnAgPD0gM3x8IGlzTmFOKHRoaXMucCkpe1xuICAgICAgY29uc29sZS5lcnJvcignVGVzc2VsYXRpb24gZXJyb3I6IHBvbHlnb24gbmVlZHMgYXQgbGVhc3QgMyBzaWRlcyEnKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBlbHNlIHsgcmV0dXJuIGZhbHNlOyB9XG4gIH1cbn1cbiIsIi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICpcbi8vICogIFRIUkVFIEpTIENMQVNTXG4vLyAqXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5leHBvcnQgY2xhc3MgVGhyZWVKUyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZXZlbnQpID0+IHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJyk7XG4gICAgICB0aGlzLmluaXQoKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgLy90aGlzLmNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgIC8vdGhpcy5jYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuICAgICAgLy90aGlzLnJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG5cbiAgICAgIHRoaXMucmVzZXQoKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy5zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuICAgIHRoaXMuaW5pdENhbWVyYSgpO1xuXG4gICAgdGhpcy5pbml0TGlnaHRpbmcoKTtcblxuICAgIHRoaXMuYXhlcygpO1xuXG4gICAgdGhpcy5pbml0UmVuZGVyZXIoKTtcbiAgICAvL2NvbnNvbGUubG9nKHRoaXMuc2NlbmUpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5pZCk7IC8vIFN0b3AgdGhlIGFuaW1hdGlvblxuICAgIHRoaXMucmVuZGVyZXIuZG9tRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdkYmxjbGljaycsIG51bGwsIGZhbHNlKTsgLy9yZW1vdmUgbGlzdGVuZXIgdG8gcmVuZGVyXG4gICAgdGhpcy5zY2VuZSA9IG51bGw7XG4gICAgdGhpcy5wcm9qZWN0b3IgPSBudWxsO1xuICAgIHRoaXMuY2FtZXJhID0gbnVsbDtcbiAgICB0aGlzLmNvbnRyb2xzID0gbnVsbDtcblxuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnY2FudmFzJyk7XG4gICAgZm9yIChsZXQgaW5kZXggPSBlbGVtZW50Lmxlbmd0aCAtIDE7IGluZGV4ID49IDA7IGluZGV4LS0pIHtcbiAgICAgIGVsZW1lbnRbaW5kZXhdLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZWxlbWVudFtpbmRleF0pO1xuICAgIH1cbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIGluaXRDYW1lcmEoKSB7XG4gICAgdGhpcy5jYW1lcmEgPSBuZXcgVEhSRUUuT3J0aG9ncmFwaGljQ2FtZXJhKHdpbmRvdy5pbm5lcldpZHRoIC8gLTIsXG4gICAgICB3aW5kb3cuaW5uZXJXaWR0aCAvIDIsIHdpbmRvdy5pbm5lckhlaWdodCAvIDIsIHdpbmRvdy5pbm5lckhlaWdodCAvIC0yLCAtMiwgMSk7XG4gICAgdGhpcy5zY2VuZS5hZGQodGhpcy5jYW1lcmEpO1xuICAgIHRoaXMuY2FtZXJhLnBvc2l0aW9uLnggPSAwO1xuICAgIHRoaXMuY2FtZXJhLnBvc2l0aW9uLnkgPSAwO1xuXG4gICAgdGhpcy5jYW1lcmEucG9zaXRpb24ueiA9IDE7XG4gIH1cblxuICBpbml0TGlnaHRpbmcoKSB7XG4gICAgLy9jb25zdCBzcG90TGlnaHQgPSBuZXcgVEhSRUUuU3BvdExpZ2h0KDB4ZmZmZmZmKTtcbiAgICAvL3Nwb3RMaWdodC5wb3NpdGlvbi5zZXQoMCwgMCwgMTAwKTtcbiAgICAvL3RoaXMuc2NlbmUuYWRkKHNwb3RMaWdodCk7XG4gICAgY29uc3QgYW1iaWVudExpZ2h0ID0gbmV3IFRIUkVFLkFtYmllbnRMaWdodCgweGZmZmZmZik7XG4gICAgdGhpcy5zY2VuZS5hZGQoYW1iaWVudExpZ2h0KTtcbiAgfVxuXG4gIGluaXRSZW5kZXJlcigpIHtcbiAgICB0aGlzLnJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoe1xuICAgICAgYW50aWFsaWFzOiB0cnVlLFxuICAgIH0pO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0Q2xlYXJDb2xvcigweGZmZmZmZiwgMS4wKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8vYmVoaW5kOiB0cnVlL2ZhbHNlXG4gIGRpc2soY2VudHJlLCByYWRpdXMsIGNvbG9yLCBiZWhpbmQpIHtcbiAgICBsZXQgY29sID0gY29sb3I7XG4gICAgaWYgKGNvbCA9PT0gJ3VuZGVmaW5lZCcpIGNvbCA9IDB4ZmZmZmZmO1xuXG4gICAgY29uc3QgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQ2lyY2xlR2VvbWV0cnkocmFkaXVzLCAxMDAsIDAsIDIgKiBNYXRoLlBJKTtcbiAgICBjb25zdCBjaXJjbGUgPSB0aGlzLmNyZWF0ZU1lc2goZ2VvbWV0cnksIGNvbCk7XG4gICAgY2lyY2xlLnBvc2l0aW9uLnggPSBjZW50cmUueDtcbiAgICBjaXJjbGUucG9zaXRpb24ueSA9IGNlbnRyZS55O1xuICAgIGlmICghYmVoaW5kKSB7XG4gICAgICBjaXJjbGUucG9zaXRpb24ueiA9IDE7XG4gICAgfVxuXG4gICAgdGhpcy5zY2VuZS5hZGQoY2lyY2xlKTtcbiAgfVxuXG4gIHNlZ21lbnQoY2lyY2xlLCBhbHBoYSwgb2Zmc2V0LCBjb2xvcikge1xuICAgIGxldCBjb2wgPSBjb2xvcjtcbiAgICBpZiAoY29sID09PSAndW5kZWZpbmVkJykgY29sID0gMHhmZmZmZmY7XG5cbiAgICBjb25zdCBjdXJ2ZSA9IG5ldyBUSFJFRS5FbGxpcHNlQ3VydmUoXG4gICAgICBjaXJjbGUuY2VudHJlLngsIGNpcmNsZS5jZW50cmUueSwgLy8gYXgsIGFZXG4gICAgICBjaXJjbGUucmFkaXVzLCBjaXJjbGUucmFkaXVzLCAvLyB4UmFkaXVzLCB5UmFkaXVzXG4gICAgICBhbHBoYSwgb2Zmc2V0LCAvLyBhU3RhcnRBbmdsZSwgYUVuZEFuZ2xlXG4gICAgICBmYWxzZSAvLyBhQ2xvY2t3aXNlXG4gICAgKTtcblxuICAgIGNvbnN0IHBvaW50cyA9IGN1cnZlLmdldFNwYWNlZFBvaW50cygxMDApO1xuXG4gICAgY29uc3QgcGF0aCA9IG5ldyBUSFJFRS5QYXRoKCk7XG4gICAgY29uc3QgZ2VvbWV0cnkgPSBwYXRoLmNyZWF0ZUdlb21ldHJ5KHBvaW50cyk7XG5cbiAgICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5MaW5lQmFzaWNNYXRlcmlhbCh7XG4gICAgICBjb2xvcjogY29sXG4gICAgfSk7XG4gICAgY29uc3QgcyA9IG5ldyBUSFJFRS5MaW5lKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cbiAgICB0aGlzLnNjZW5lLmFkZChzKTtcbiAgfVxuXG4gIGxpbmUoc3RhcnQsIGVuZCwgY29sb3IpIHtcbiAgICBsZXQgY29sID0gY29sb3I7XG4gICAgaWYgKGNvbCA9PT0gJ3VuZGVmaW5lZCcpIGNvbCA9IDB4ZmZmZmZmO1xuXG4gICAgY29uc3QgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuR2VvbWV0cnkoKTtcblxuICAgIGdlb21ldHJ5LnZlcnRpY2VzLnB1c2goXG4gICAgICBuZXcgVEhSRUUuVmVjdG9yMyhzdGFydC54LCBzdGFydC55LCAwKSxcbiAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKGVuZC54LCBlbmQueSwgMClcbiAgICApO1xuICAgIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKHtcbiAgICAgIGNvbG9yOiBjb2xcbiAgICB9KTtcbiAgICBjb25zdCBsID0gbmV3IFRIUkVFLkxpbmUoZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICB0aGlzLnNjZW5lLmFkZChsKTtcbiAgfVxuXG4gIHBvbHlnb24oZWRnZXMpe1xuICAgIGxldCBwb2ludHMgPSBbXTtcbiAgICBmb3IobGV0IGVkZ2Ugb2YgZWRnZXMpe1xuICAgICAgY29uc3QgY3VydmUgPSBuZXcgVEhSRUUuRWxsaXBzZUN1cnZlKFxuICAgICAgICBlZGdlLmMuY2VudHJlLngsXG4gICAgICAgIGVkZ2UuYy5jZW50cmUueSxcbiAgICAgICAgZWRnZS5jLnJhZGl1cyxcbiAgICAgICAgZWRnZS5jLnJhZGl1cyxcbiAgICAgICAgZWRnZS5zdGFydEFuZ2xlLFxuICAgICAgICBlZGdlLmVuZEFuZ2xlLFxuICAgICAgICBmYWxzZVxuICAgICAgKTtcbiAgICAgIHBvaW50cyA9IHBvaW50cy5jb25jYXQoY3VydmUuZ2V0U3BhY2VkUG9pbnRzKDEwKSk7XG4gICAgfVxuXG4gICAgY29uc3QgbCA9IHBvaW50cy5sZW5ndGg7XG5cbiAgICBjb25zdCBwb2x5ID0gbmV3IFRIUkVFLlNoYXBlKCk7XG4gICAgcG9seS5tb3ZlVG8ocG9pbnRzWzBdLngsIHBvaW50c1swXS55KTtcblxuICAgIGZvcihsZXQgaSA9IDE7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspe1xuICAgICAgcG9seS5saW5lVG8ocG9pbnRzW2ldLngsIHBvaW50c1tpXS55KVxuICAgIH1cblxuICAgIHBvbHkubGluZVRvKHBvaW50c1swXS54LCBwb2ludHNbMF0ueSk7XG5cbiAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5TaGFwZUdlb21ldHJ5KCBwb2x5ICk7XG5cbiAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLmNyZWF0ZU1lc2goZ2VvbWV0cnksIDB4ZmZmZmZmKSk7XG4gIH1cblxuICBzaGFwZSgpIHtcbiAgICAvLyBjcmVhdGUgYSBiYXNpYyBzaGFwZVxuICAgIHZhciBzaGFwZSA9IG5ldyBUSFJFRS5TaGFwZSgpO1xuXG4gICAgLy8gc3RhcnRwb2ludFxuICAgIHNoYXBlLm1vdmVUbygwLCAwKTtcblxuICAgIC8vIHN0cmFpZ2h0IGxpbmUgdXB3YXJkc1xuICAgIHNoYXBlLmxpbmVUbygwLCA1MCk7XG5cbiAgICAvLyB0aGUgdG9wIG9mIHRoZSBmaWd1cmUsIGN1cnZlIHRvIHRoZSByaWdodFxuICAgIHNoYXBlLnF1YWRyYXRpY0N1cnZlVG8oMTUsIDI1LCAyNSwgMzApO1xuXG4gICAgc2hhcGUubGluZVRvKDAsIDApO1xuXG4gICAgY29uc3QgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuU2hhcGVHZW9tZXRyeShzaGFwZSk7XG4gICAgdGhpcy5jdXJ2ZSA9IHRoaXMuY3JlYXRlTWVzaChnZW9tZXRyeSwgJy4vaW1hZ2VzL3RleHR1cmVzL3Rlc3QuanBnJyk7XG4gICAgdGhpcy5jdXJ2ZS5wb3NpdGlvbi55ID0gLTMwO1xuICAgIHRoaXMuY3VydmUucG9zaXRpb24ueiA9IC00MDtcbiAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLmN1cnZlKTtcbiAgfVxuXG5cbiAgY3JlYXRlTWVzaChnZW9tZXRyeSwgY29sb3IsIGltYWdlVVJMKSB7XG4gICAgbGV0IGNvbCA9IGNvbG9yO1xuICAgIGlmIChjb2wgPT09ICd1bmRlZmluZWQnKSBjb2wgPSAweGZmZmZmZjtcbiAgICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XG4gICAgICBjb2xvcjogY29sXG4gICAgfSk7XG5cbiAgICBpZiAoaW1hZ2VVUkwpIHtcbiAgICAgIGNvbnN0IHRleHR1cmVMb2FkZXIgPSBuZXcgVEhSRUUuVGV4dHVyZUxvYWRlcigpO1xuXG4gICAgICAvL2xvYWQgdGV4dHVyZSBhbmQgYXBwbHkgdG8gbWF0ZXJpYWwgaW4gY2FsbGJhY2tcbiAgICAgIGNvbnN0IHRleHR1cmUgPSB0ZXh0dXJlTG9hZGVyLmxvYWQoaW1hZ2VVUkwsICh0ZXgpID0+IHt9KTtcbiAgICAgIHRleHR1cmUucmVwZWF0LnNldCgwLjA1LCAwLjA1KTtcbiAgICAgIG1hdGVyaWFsLm1hcCA9IHRleHR1cmU7XG4gICAgICBtYXRlcmlhbC5tYXAud3JhcFQgPSBUSFJFRS5SZXBlYXRXcmFwcGluZztcbiAgICAgIG1hdGVyaWFsLm1hcC53cmFwUyA9IFRIUkVFLlJlcGVhdFdyYXBwaW5nO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICB9XG5cbiAgYXhlcygpIHtcbiAgICBjb25zdCB4eXogPSBuZXcgVEhSRUUuQXhpc0hlbHBlcigyMCk7XG4gICAgdGhpcy5zY2VuZS5hZGQoeHl6KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgdGhpcy5yZW5kZXIoKVxuICAgIH0pO1xuICAgIC8vdGhpcy5jaXJjbGUucm90YXRpb24ueCArPSAwLjAyO1xuICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUsIHRoaXMuY2FtZXJhKTtcbiAgfVxuXG59XG4iXX0=
