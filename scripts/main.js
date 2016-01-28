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
      //this.radius = this.radius / 3;

      this.drawDisk();

      this.testing();
    }
  }, {
    key: 'testing',
    value: function testing() {
      var p1 = {
        x: 0,
        y: 150
      };
      var p2 = {
        x: -50,
        y: 150
      };
      var p3 = {
        x: 50,
        y: -150
      };

      this.point(p1, 4, 0x000fff);
      this.point(p2, 4, 0xf0ff0f);
      this.point(p3, 4, 0xf00fff);

      //this.arc(p1, p2, 0x000fff );

      this.arc(p1, this.centre, 0xf0ff0f);
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

  }, {
    key: 'line',
    value: function line(p1, p2, colour) {
      //let pts = this.prepPoints(p1, p2);
      //p1 = pts.p1;
      //p2 = pts.p2;
      var col = colour || 'black';
      var c = undefined,
          points = undefined;

      if (E.throughOrigin(p1, p2)) {
        var u = normalVector(p1, p2);
        points = {
          p1: {
            x: u.x * this.radius,
            y: u.y * this.radius
          },
          p2: {
            x: -u.x * this.radius,
            y: -u.y * this.radius
          }
        };
        this.draw.line(points.p1, points.p2, col);
      } else {
        c = E.greatCircle(p1, p2, this.radius, this.centre);
        points = E.circleIntersect(this.centre, c.centre, this.radius, c.radius);

        //angle subtended by the arc
        var alpha = E.centralAngle(points.p1, points.p2, c.radius);

        var offset = this.alphaOffset(points.p2, points.p2, c, 'line');
        this.draw.segment(c, alpha, offset, col);
      }
    }

    //calculate the offset (position around the circle from which to start the
    //line or arc). As canvas draws arcs clockwise by default this will change
    //depending on where the arc is relative to the origin
    //specificall whether it lies on the x axis, or above or below it
    //type = 'line' or 'arc'

  }, {
    key: 'alphaOffset',
    value: function alphaOffset(p1, p2, c, type) {
      var offset = undefined;

      //points at 0 radians on greatCircle
      var p = {
        x: c.centre.x + c.radius,
        y: c.centre.y
      };

      if (p1.y < c.centre.y) {
        offset = 2 * Math.PI - E.centralAngle(p1, p, c.radius);
      } else {
        offset = E.centralAngle(p1, p, c.radius);
      }

      return offset;
    }

    //put points in clockwise order

  }, {
    key: 'prepPoints',
    value: function prepPoints(p1, p2, c) {
      var p = {
        x: c.centre.x + c.radius,
        y: c.centre.y
      };
      //case where points are above and below the line c.centre -> p
      //in this case just return points
      var oy = c.centre.y;
      var ox = c.centre.x;

      if (p1.x > ox && p2.x > ox) {
        if (p1.y > oy && p2.y < oy) return {
          p1: p2,
          p2: p1
        };else if (p1.y < oy && p2.y > oy) return {
          p1: p1,
          p2: p2
        };
      }

      var alpha1 = E.centralAngle(p, p1, c.radius);
      alpha1 = p1.y < c.centre.y ? 2 * Math.PI - alpha1 : alpha1;
      var alpha2 = E.centralAngle(p, p2, c.radius);
      alpha2 = p2.y < c.centre.y ? 2 * Math.PI - alpha2 : alpha2;

      //if the points are not in clockwise order flip them
      if (alpha1 > alpha2) return {
        p1: p2,
        p2: p1
      };else return {
        p1: p1,
        p2: p2
      };
    }

    //Draw an arc (hyperbolic line segment) between two points on the disk

  }, {
    key: 'arc',
    value: function arc(p1, p2, colour) {
      if (E.throughOrigin(p1, p2)) {
        this.draw.line(p1, p2, colour);
        return;
      }
      var col = colour || 'black';
      var c = E.greatCircle(p1, p2, this.radius, this.centre);
      var pts = this.prepPoints(p1, p2, c);
      p1 = pts.p1;
      p2 = pts.p2;

      //length of the arc
      var alpha = E.centralAngle(p1, p2, c.radius);

      //how far around the greatCircle to start drawing the arc
      var offset = this.alphaOffset(p1, p2, c, 'arc');
      this.draw.segment(c, alpha, offset, colour);
    }
  }, {
    key: 'polygon',
    value: function polygon(vertices, colour) {
      var l = vertices.length;
      for (var i = 0; i < l; i++) {
        this.arc(vertices[i], vertices[(i + 1) % l], colour);
      }
    }

    //return true if the point is not in the disk

  }, {
    key: 'checkPoint',
    value: function checkPoint(point) {
      var r = this.radius;
      if (E.distance(point, this.centre) > r) {
        console.error('Error! Point (' + point.x + ', ' + point.y + ') lies outside the plane!');
        return true;
      }
      return false;
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
      true // aClockwise
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJlczIwMTUvZGlzay5qcyIsImVzMjAxNS9ldWNsaWQuanMiLCJlczIwMTUvbWFpbi5qcyIsImVzMjAxNS9yZWd1bGFyVGVzc2VsYXRpb24uanMiLCJlczIwMTUvdGhyZWVqcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7OztJQ0FZLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7SUFjQSxJQUFJLFdBQUosSUFBSTtBQUNmLFdBRFcsSUFBSSxHQUNEOzs7MEJBREgsSUFBSTs7QUFFYixRQUFJLENBQUMsSUFBSSxHQUFHLGFBYmQsT0FBTyxFQWFvQixDQUFDOztBQUcxQixVQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQ3pDLFlBQU0sQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNuQyxZQUFLLElBQUksRUFBRSxDQUFDO0tBQ2IsRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFVixVQUFNLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFlBQU07QUFDdEMsWUFBSyxJQUFJLEVBQUUsQ0FBQztLQUNiLEVBQUUsS0FBSyxDQUFDLENBQUM7R0FFWDs7ZUFkVSxJQUFJOzsyQkFnQlI7QUFDTCxVQUFJLENBQUMsTUFBTSxHQUFHO0FBQ1osU0FBQyxFQUFFLENBQUM7QUFDSixTQUFDLEVBQUUsQ0FBQztPQUNMOzs7QUFBQSxBQUdELFVBQUksQ0FBQyxNQUFNLEdBQUcsQUFBQyxNQUFNLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxXQUFXLEdBQUksQUFBQyxNQUFNLENBQUMsVUFBVSxHQUFHLENBQUMsR0FBSSxDQUFDLEdBQUcsQUFBQyxNQUFNLENBQUMsV0FBVyxHQUFHLENBQUMsR0FBSSxDQUFDOzs7O0FBQUMsQUFJcEgsVUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDOztBQUVoQixVQUFJLENBQUMsT0FBTyxFQUFFLENB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Q0FBQyxDQUFBLEFBQUMsR0FBRSxFQUFFLENBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUMsRUFBRSxDQUFDLENBQUMsR0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUMsRUFBRSxDQUFDLENBQUMsR0FBRSxFQUFFLENBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsQ0FBQSxJQUFHLENBQUMsR0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBQztBQUN6RyxNQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUMsRUFBRSxDQUFDLENBQUMsR0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUUsRUFBRSxDQUFDLENBQUMsR0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUMsRUFBRSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUEsQUFBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUUsRUFBRSxDQUFDLENBQUMsR0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQSxBQUFDLENBQUEsSUFBRyxDQUFDLEdBQUMsRUFBRSxDQUFDLENBQUMsR0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUEsQUFBQyxDQUFDO0FBQ3ZHLE1BQUksTUFBTSxHQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3BDLFNBQU87QUFDTCxVQUFNLEVBQUU7QUFDTixPQUFDLEVBQUUsQ0FBQztBQUNKLE9BQUMsRUFBRSxDQUFDO0tBQ0w7QUFDRCxVQUFNLEVBQUUsTUFBTTtHQUNmLENBQUE7Q0FDRjs7Ozs7O0FBQUEsQUFNTSxJQUFNLGVBQWUsV0FBZixlQUFlLEdBQUcsU0FBbEIsZUFBZSxDQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBSztBQUNqRCxNQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2IsTUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNiLE1BQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDYixNQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2IsTUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsSUFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsSUFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsQ0FBQyxDQUFDOztBQUU1RCxNQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUEsSUFBSyxJQUFJLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQSxBQUFDLElBQUksSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUEsQUFBQyxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUEsQUFBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVwRyxNQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsR0FBSSxDQUFDLEdBQUcsQUFBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsSUFBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUEsQUFBQyxJQUFLLENBQUMsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFBLEFBQUMsQ0FBQztBQUNqRixNQUFJLEVBQUUsR0FBRyxRQUFRLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFBLEFBQUMsQ0FBQztBQUN0RCxNQUFJLEVBQUUsR0FBRyxRQUFRLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFBLEFBQUMsQ0FBQzs7QUFFdEQsTUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksQ0FBQyxHQUFHLEFBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLElBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFBLEFBQUMsSUFBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7QUFDakYsTUFBSSxFQUFFLEdBQUcsUUFBUSxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7QUFDdEQsTUFBSSxFQUFFLEdBQUcsUUFBUSxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7O0FBRXRELE1BQUksRUFBRSxHQUFHO0FBQ1AsS0FBQyxFQUFFLEVBQUU7QUFDTCxLQUFDLEVBQUUsRUFBRTtHQUNOLENBQUE7O0FBRUQsTUFBSSxFQUFFLEdBQUc7QUFDUCxLQUFDLEVBQUUsRUFBRTtBQUNMLEtBQUMsRUFBRSxFQUFFO0dBQ04sQ0FBQTs7QUFFRCxTQUFPO0FBQ0wsTUFBRSxFQUFFLEVBQUU7QUFDTixNQUFFLEVBQUUsRUFBRTtHQUNQLENBQUM7Q0FDSCxDQUFBOztBQUVNLElBQU0sbUJBQW1CLFdBQW5CLG1CQUFtQixHQUFHLFNBQXRCLG1CQUFtQixDQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBSzs7QUFFbkQsTUFBTSxDQUFDLEdBQUcsUUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7O0FBQUMsQUFFM0IsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUEsR0FBRSxDQUFDLENBQUM7QUFDM0IsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUEsR0FBRSxDQUFDOzs7QUFBQyxBQUczQixNQUFNLENBQUMsR0FBRyxFQUFFLElBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRSxFQUFFLENBQUMsQ0FBQyxDQUFBLEFBQUMsR0FBRyxFQUFFLElBQUUsQ0FBQyxDQUFDLENBQUMsR0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBQztBQUN6QyxNQUFNLENBQUMsR0FBSSxFQUFDLENBQUMsRUFBRSxDQUFDLEdBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBQzs7O0FBQUMsQUFHOUMsTUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7OztBQUFDLEFBRzFCLE1BQUcsRUFBRSxHQUFHLENBQUMsRUFBQztBQUNSLFFBQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUUsQ0FBQyxHQUFDLENBQUMsR0FBRyxFQUFFLEdBQUMsRUFBRSxDQUFDOztBQUFDLEFBRW5DLFFBQU0sRUFBRSxHQUFHO0FBQ1QsT0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQSxHQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUNuQixPQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUMsRUFBRSxDQUFBLEdBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0tBQ3BCOztBQUFBLEFBRUQsUUFBTSxFQUFFLEdBQUc7QUFDVCxPQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUMsRUFBRSxDQUFBLEdBQUUsRUFBRSxHQUFHLEVB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QUFFLENBQUE7T0FDZCxDQUFDOztBQUFDLEFBRUgsVUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDL0M7OztTQXhMVSxPQUFPIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCAqIGFzIEUgZnJvbSAnLi9ldWNsaWQnO1xuLy9pbXBvcnQgeyBDYW52YXMgfSBmcm9tICcuL2NhbnZhcyc7XG5pbXBvcnQge1xuICBUaHJlZUpTXG59XG5mcm9tICcuL3RocmVlanMnO1xuXG4vLyAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyAqXG4vLyAqICAgRElTSyBDTEFTU1xuLy8gKiAgIFBvaW5jYXJlIERpc2sgcmVwcmVzZW50YXRpb24gb2YgdGhlIGh5cGVyYm9saWMgcGxhbmVcbi8vICogICBDb250YWlucyBhbnkgZnVuY3Rpb25zIHVzZWQgdG8gZHJhdyB0byB0aGUgZGlza1xuLy8gKiAgIChDdXJyZW50bHkgdXNpbmcgdGhyZWUganMgYXMgZHJhd2luZyBjbGFzcylcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbmV4cG9ydCBjbGFzcyBEaXNrIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5kcmF3ID0gbmV3IFRocmVlSlMoKTtcblxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZXZlbnQpID0+IHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJyk7XG4gICAgICB0aGlzLmluaXQoKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgdGhpcy5pbml0KCk7XG4gICAgfSwgZmFsc2UpO1xuXG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMuY2VudHJlID0ge1xuICAgICAgeDogMCxcbiAgICAgIHk6IDBcbiAgICB9XG5cbiAgICAvL2RyYXcgbGFyZ2VzdCBjaXJjbGUgcG9zc2libGUgZ2l2ZW4gd2luZG93IGRpbXNcbiAgICB0aGlzLnJhZGl1cyA9ICh3aW5kb3cuaW5uZXJXaWR0aCA8IHdpbmRvdy5pbm5lckhlaWdodCkgPyAod2luZG93LmlubmVyV2lkdGggLyAyKSAtIDUgOiAod2luZG93LmlubmVySGVpZ2h0IC8gMikgLSA1O1xuICAgIC8vc21hbGxlciBjaXJjbGUgZm9yIHRlc3RpbmdcbiAgICAvL3RoaXMucmFkaXVzID0gdGhpcy5yYWRpdXMgLyAzO1xuXG4gICAgdGhpcy5kcmF3RGlzaygpO1xuXG4gICAgdGhpcy50ZXN0aW5nKCk7XG4gIH1cblxuICB0ZXN0aW5nKCkge1xuICAgIGNvbnN0IHAxID0ge1xuICAgICAgeDogMCxcbiAgICAgIHk6IDE1MFxuICAgIH07XG4gICAgY29uc3QgcDIgPSB7XG4gICAgICB4OiAtNTAsXG4gICAgICB5OiAxNTBcbiAgICB9O1xuICAgIGNvbnN0IHAzID0ge1xuICAgICAgeDogNTAsXG4gICAgICB5OiAtMTUwXG4gICAgfTtcblxuICAgIHRoaXMucG9pbnQocDEsIDQsIDB4MDAwZmZmKTtcbiAgICB0aGlzLnBvaW50KHAyLCA0LCAweGYwZmYwZik7XG4gICAgdGhpcy5wb2ludChwMywgNCwgMHhmMDBmZmYpO1xuXG4gICAgLy90aGlzLmFyYyhwMSwgcDIsIDB4MDAwZmZmICk7XG5cbiAgICB0aGlzLmFyYyhwMSwgdGhpcy5jZW50cmUsIDB4ZjBmZjBmKTtcbiAgfVxuXG4gIC8vZHJhdyB0aGUgZGlzayBiYWNrZ3JvdW5kXG4gIGRyYXdEaXNrKCkge1xuICAgIHRoaXMuZHJhdy5kaXNrKHRoaXMuY2VudHJlLCB0aGlzLnJhZGl1cywgMHgwMDAwMDAsIHRydWUpO1xuICB9XG5cbiAgcG9pbnQoY2VudHJlLCByYWRpdXMsIGNvbG9yKSB7XG4gICAgdGhpcy5kcmF3LmRpc2soY2VudHJlLCByYWRpdXMsIGNvbG9yLCBmYWxzZSk7XG4gIH1cblxuICAvL2RyYXcgYSBoeXBlcmJvbGljIGxpbmUgYmV0d2VlbiB0d28gcG9pbnRzIG9uIHRoZSBib3VuZGFyeSBjaXJjbGVcbiAgbGluZShwMSwgcDIsIGNvbG91cikge1xuICAgIC8vbGV0IHB0cyA9IHRoaXMucHJlcFBvaW50cyhwMSwgcDIpO1xuICAgIC8vcDEgPSBwdHMucDE7XG4gICAgLy9wMiA9IHB0cy5wMjtcbiAgICBsZXQgY29sID0gY29sb3VyIHx8ICdibGFjayc7XG4gICAgbGV0IGMsIHBvaW50cztcblxuICAgIGlmIChFLnRocm91Z2hPcmlnaW4ocDEsIHAyKSkge1xuICAgICAgbGV0IHUgPSBub3JtYWxWZWN0b3IocDEsIHAyKTtcbiAgICAgIHBvaW50cyA9IHtcbiAgICAgICAgcDE6IHtcbiAgICAgICAgICB4OiB1LnggKiB0aGlzLnJhZGl1cyxcbiAgICAgICAgICB5OiB1LnkgKiB0aGlzLnJhZGl1c1xuICAgICAgICB9LFxuICAgICAgICBwMjoge1xuICAgICAgICAgIHg6IC11LnggKiB0aGlzLnJhZGl1cyxcbiAgICAgICAgICB5OiAtdS55ICogdGhpcy5yYWRpdXNcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5kcmF3LmxpbmUocG9pbnRzLnAxLCBwb2ludHMucDIsIGNvbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGMgPSBFLmdyZWF0Q2lyY2xlKHAxLCBwMiwgdGhpcy5yYWRpdXMsIHRoaXMuY2VudHJlKTtcbiAgICAgIHBvaW50cyA9IEUuY2lyY2xlSW50ZXJzZWN0KHRoaXMuY2VudHJlLCBjLmNlbnRyZSwgdGhpcy5yYWRpdXMsIGMucmFkaXVzKTtcblxuICAgICAgLy9hbmdsZSBzdWJ0ZW5kZWQgYnkgdGhlIGFyY1xuICAgICAgbGV0IGFscGhhID0gRS5jZW50cmFsQW5nbGUocG9pbnRzLnAxLCBwb2ludHMucDIsIGMucmFkaXVzKTtcblxuICAgICAgbGV0IG9mZnNldCA9IHRoaXMuYWxwaGFPZmZzZXQocG9pbnRzLnAyLCBwb2ludHMucDIsIGMsICdsaW5lJyk7XG4gICAgICB0aGlzLmRyYXcuc2VnbWVudChjLCBhbHBoYSwgb2Zmc2V0LCBjb2wpO1xuICAgIH1cbiAgfVxuXG4gIC8vY2FsY3VsYXRlIHRoZSBvZmZzZXQgKHBvc2l0aW9uIGFyb3VuZCB0aGUgY2lyY2xlIGZyb20gd2hpY2ggdG8gc3RhcnQgdGhlXG4gIC8vbGluZSBvciBhcmMpLiBBcyBjYW52YXMgZHJhd3MgYXJjcyBjbG9ja3dpc2UgYnkgZGVmYXVsdCB0aGlzIHdpbGwgY2hhbmdlXG4gIC8vZGVwZW5kaW5nIG9uIHdoZXJlIHRoZSBhcmMgaXMgcmVsYXRpdmUgdG8gdGhlIG9yaWdpblxuICAvL3NwZWNpZmljYWxsIHdoZXRoZXIgaXQgbGllcyBvbiB0aGUgeCBheGlzLCBvciBhYm92ZSBvciBiZWxvdyBpdFxuICAvL3R5cGUgPSAnbGluZScgb3IgJ2FyYydcbiAgYWxwaGFPZmZzZXQocDEsIHAyLCBjLCB0eXBlKSB7XG4gICAgbGV0IG9mZnNldDtcblxuICAgIC8vcG9pbnRzIGF0IDAgcmFkaWFucyBvbiBncmVhdENpcmNsZVxuICAgIGxldCBwID0ge1xuICAgICAgeDogYy5jZW50cmUueCArIGMucmFkaXVzLFxuICAgICAgeTogYy5jZW50cmUueVxuICAgIH1cblxuICAgIGlmIChwMS55IDwgYy5jZW50cmUueSkge1xuICAgICAgb2Zmc2V0ID0gMiAqIE1hdGguUEkgLSBFLmNlbnRyYWxBbmdsZShwMSwgcCwgYy5yYWRpdXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvZmZzZXQgPSBFLmNlbnRyYWxBbmdsZShwMSwgcCwgYy5yYWRpdXMpO1xuICAgIH1cblxuICAgIHJldHVybiBvZmZzZXQ7XG4gIH1cblxuICAvL3B1dCBwb2ludHMgaW4gY2xvY2t3aXNlIG9yZGVyXG4gIHByZXBQb2ludHMocDEsIHAyLCBjKSB7XG4gICAgY29uc3QgcCA9IHtcbiAgICAgIHg6IGMuY2VudHJlLnggKyBjLnJhZGl1cyxcbiAgICAgIHk6IGMuY2VudHJlLnlcbiAgICB9O1xuICAgIC8vY2FzZSB3aGVyZSBwb2ludHMgYXJlIGFib3ZlIGFuZCBiZWxvdyB0aGUgbGluZSBjLmNlbnRyZSAtPiBwXG4gICAgLy9pbiB0aGlzIGNhc2UganVzdCByZXR1cm4gcG9pbnRzXG4gICAgY29uc3Qgb3kgPSBjLmNlbnRyZS55O1xuICAgIGNvbnN0IG94ID0gYy5jZW50cmUueDtcblxuICAgIGlmIChwMS54ID4gb3ggJiYgcDIueCA+IG94KSB7XG4gICAgICBpZiAocDEueSA+IG95ICYmIHAyLnkgPCBveSkgcmV0dXJuIHtcbiAgICAgICAgcDE6IHAyLFxuICAgICAgICBwMjogcDFcbiAgICAgIH07XG4gICAgICBlbHNlIGlmIChwMS55IDwgb3kgJiYgcDIueSA+IG95KSByZXR1cm4ge1xuICAgICAgICBwMTogcDEsXG4gICAgICAgIHAyOiBwMlxuICAgICAgfTtcbiAgICB9XG5cbiAgICBsZXQgYWxwaGExID0gRS5jZW50cmFsQW5nbGUocCwgcDEsIGMucmFkaXVzKTtcbiAgICBhbHBoYTEgPSAocDEueSA8IGMuY2VudHJlLnkpID8gMiAqIE1hdGguUEkgLSBhbHBoYTEgOiBhbHBoYTE7XG4gICAgbGV0IGFscGhhMiA9IEUuY2VudHJhbEFuZ2xlKHAsIHAyLCBjLnJhZGl1cyk7XG4gICAgYWxwaGEyID0gKHAyLnkgPCBjLmNlbnRyZS55KSA/IDIgKiBNYXRoLlBJIC0gYWxwaGEyIDogYWxwaGEyO1xuXG4gICAgLy9pZiB0aGUgcG9pbnRzIGFyZSBub3QgaW4gY2xvY2t3aXNlIG9yZGVyIGZsaXAgdGhlbVxuICAgIGlmIChhbHBoYTEgPiBhbHBoYTIpIHJldHVybiB7XG4gICAgICBwMTogcDIsXG4gICAgICBwMjogcDFcbiAgICB9O1xuICAgIGVsc2UgcmV0dXJuIHtcbiAgICAgIHAxOiBwMSxcbiAgICAgIHAyOiBwMlxuICAgIH07XG5cbiAgfVxuXG4gIC8vRHJhdyBhbiBhcmMgKGh5cGVyYm9saWMgbGluZSBzZWdtZW50KSBiZXR3ZWVuIHR3byBwb2ludHMgb24gdGhlIGRpc2tcbiAgYXJjKHAxLCBwMiwgY29sb3VyKSB7XG4gICAgaWYgKEUudGhyb3VnaE9yaWdpbihwMSwgcDIpKSB7XG4gICAgICB0aGlzLmRyYXcubGluZShwMSwgcDIsIGNvbG91cik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBjb2wgPSBjb2xvdXIgfHwgJ2JsYWNrJztcbiAgICBsZXQgYyA9IEUuZ3JlYXRDaXJjbGUocDEsIHAyLCB0aGlzLnJhZGl1cywgdGhpcy5jZW50cmUpO1xuICAgIGxldCBwdHMgPSB0aGlzLnByZXBQb2ludHMocDEsIHAyLCBjKTtcbiAgICBwMSA9IHB0cy5wMTtcbiAgICBwMiA9IHB0cy5wMjtcblxuICAgIC8vbGVuZ3RoIG9mIHRoZSBhcmNcbiAgICBsZXQgYWxwaGEgPSBFLmNlbnRyYWxBbmdsZShwMSwgcDIsIGMucmFkaXVzKTtcblxuICAgIC8vaG93IGZhciBhcm91bmQgdGhlIGdyZWF0Q2lyY2xlIHRvIHN0YXJ0IGRyYXdpbmcgdGhlIGFyY1xuICAgIGxldCBvZmZzZXQgPSB0aGlzLmFscGhhT2Zmc2V0KHAxLCBwMiwgYywgJ2FyYycpO1xuICAgIHRoaXMuZHJhdy5zZWdtZW50KGMsIGFscGhhLCBvZmZzZXQsIGNvbG91cik7XG4gIH1cblxuICBwb2x5Z29uKHZlcnRpY2VzLCBjb2xvdXIpIHtcbiAgICBsZXQgbCA9IHZlcnRpY2VzLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgdGhpcy5hcmModmVydGljZXNbaV0sIHZlcnRpY2VzWyhpICsgMSkgJSBsXSwgY29sb3VyKTtcbiAgICB9XG4gIH1cblxuICAvL3JldHVybiB0cnVlIGlmIHRoZSBwb2ludCBpcyBub3QgaW4gdGhlIGRpc2tcbiAgY2hlY2tQb2ludChwb2ludCkge1xuICAgIGxldCByID0gdGhpcy5yYWRpdXM7XG4gICAgaWYgKEUuZGlzdGFuY2UocG9pbnQsIHRoaXMuY2VudHJlKSA+IHIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yISBQb2ludCAoJyArIHBvaW50LnggKyAnLCAnICsgcG9pbnQueSArICcpIGxpZXMgb3V0c2lkZSB0aGUgcGxhbmUhJyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG4iLCIvLyAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyAqXG4vLyAqICAgRVVDTElERUFOIEZVTkNUSU9OU1xuLy8gKiAgIGFsbCBFdWNsaWRlYW4gbWF0aGVtYXRpY2FsIGZ1bmN0aW9ucyBnbyBoZXJlXG4vLyAqXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbi8vZGlzdGFuY2UgYmV0d2VlbiB0d28gcG9pbnRzXG5leHBvcnQgY29uc3QgZGlzdGFuY2UgPSAocDEsIHAyKSA9PiBNYXRoLnNxcnQoTWF0aC5wb3coKHAyLnggLSBwMS54KSwgMikgKyBNYXRoLnBvdygocDIueSAtIHAxLnkpLCAyKSk7XG5cbi8vbWlkcG9pbnQgb2YgdGhlIGxpbmUgc2VnbWVudCBjb25uZWN0aW5nIHR3byBwb2ludHNcbmV4cG9ydCBjb25zdCBtaWRwb2ludCA9IChwMSwgcDIpID0+IHtcbiAgcmV0dXJuIHtcbiAgICB4OiAocDEueCArIHAyLngpIC8gMixcbiAgICB5OiAocDEueSArIHAyLnkpIC8gMlxuICB9XG59XG5cbi8vc2xvcGUgb2YgbGluZSB0aHJvdWdoIHAxLCBwMlxuZXhwb3J0IGNvbnN0IHNsb3BlID0gKHAxLCBwMikgPT4gKHAyLnggLSBwMS54KSAvIChwMi55IC0gcDEueSk7XG5cbi8vc2xvcGUgb2YgbGluZSBwZXJwZW5kaWN1bGFyIHRvIGEgbGluZSBkZWZpbmVkIGJ5IHAxLHAyXG5leHBvcnQgY29uc3QgcGVycGVuZGljdWxhclNsb3BlID0gKHAxLCBwMikgPT4gLTEgLyAoTWF0aC5wb3coc2xvcGUocDEsIHAyKSwgLTEpKTtcblxuLy9pbnRlcnNlY3Rpb24gcG9pbnQgb2YgdHdvIGxpbmVzIGRlZmluZWQgYnkgcDEsbTEgYW5kIHExLG0yXG4vL05PVCBXT1JLSU5HIEZPUiBWRVJUSUNBTCBMSU5FUyEhIVxuZXhwb3J0IGNvbnN0IGludGVyc2VjdGlvbiA9IChwMSwgbTEsIHAyLCBtMikgPT4ge1xuICBsZXQgYzEsIGMyLCB4LCB5O1xuICAvL2Nhc2Ugd2hlcmUgZmlyc3QgbGluZSBpcyB2ZXJ0aWNhbFxuICAvL2lmKG0xID4gNTAwMCB8fCBtMSA8IC01MDAwIHx8IG0xID09PSBJbmZpbml0eSl7XG4gIGlmKHAxLnkgPCAwLjAwMDAwMSAmJiBwMS55ID4gLTAuMDAwMDAxICl7XG4gICAgeCA9IHAxLng7XG4gICAgeSA9IChtMikqKHAxLngtcDIueCkgKyBwMi55O1xuICB9XG4gIC8vY2FzZSB3aGVyZSBzZWNvbmQgbGluZSBpcyB2ZXJ0aWNhbFxuICAvL2Vsc2UgaWYobTIgPiA1MDAwIHx8IG0yIDwgLTUwMDAgfHwgbTEgPT09IEluZmluaXR5KXtcbiAgZWxzZSBpZihwMi55IDwgMC4wMDAwMDEgJiYgcDIueSA+IC0wLjAwMDAwMSApe1xuICAgIHggPSBwMi54O1xuICAgIHkgPSAobTEqKHAyLngtcDEueCkpICsgcDEueTtcbiAgfVxuICBlbHNle1xuICAgIC8veSBpbnRlcmNlcHQgb2YgZmlyc3QgbGluZVxuICAgIGMxID0gcDEueSAtIG0xICogcDEueDtcbiAgICAvL3kgaW50ZXJjZXB0IG9mIHNlY29uZCBsaW5lXG4gICAgYzIgPSBwMi55IC0gbTIgKiBwMi54O1xuXG4gICAgeCA9IChjMiAtIGMxKSAvIChtMSAtIG0yKTtcbiAgICB5ID0gbTEgKiB4ICsgYzE7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHg6IHgsXG4gICAgeTogeVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCByYWRpYW5zID0gKGRlZ3JlZXMpID0+IChNYXRoLlBJIC8gMTgwKSAqIGRlZ3JlZXM7XG5cbi8vZ2V0IHRoZSBjaXJjbGUgaW52ZXJzZSBvZiBhIHBvaW50IHAgd2l0aCByZXNwZWN0IGEgY2lyY2xlIHJhZGl1cyByIGNlbnRyZSBjXG5leHBvcnQgY29uc3QgaW52ZXJzZSA9IChwLCByLCBjKSA9PiB7XG4gIGxldCBhbHBoYSA9IChyICogcikgLyAoTWF0aC5wb3cocC54IC0gYy54LCAyKSArIE1hdGgucG93KHAueSAtIGMueSwgMikpO1xuICByZXR1cm4ge1xuICAgIHg6IGFscGhhICogKHAueCAtIGMueCkgKyBjLngsXG4gICAgeTogYWxwaGEgKiAocC55IC0gYy55KSArIGMueVxuICB9O1xufVxuXG4vL2NhbGN1bGF0ZSB0aGUgcmFkaXVzIGFuZCBjZW50cmUgb2YgdGhlIGNpcmNsZSByZXF1aXJlZCB0byBkcmF3IGEgbGluZSBiZXR3ZWVuXG4vL3R3byBwb2ludHMgaW4gdGhlIGh5cGVyYm9saWMgcGxhbmUgZGVmaW5lZCBieSB0aGUgZGlzayAociwgYylcbmV4cG9ydCBjb25zdCBncmVhdENpcmNsZSA9IChwMSwgcDIsIHIsIGMpID0+IHtcbiAgbGV0IHAxSW52ZXJzZSA9IGludmVyc2UocDEsIHIsIGMpO1xuICBsZXQgcDJJbnZlcnNlID0gaW52ZXJzZShwMiwgciwgYyk7XG5cbiAgbGV0IG0gPSBtaWRwb2ludChwMSwgcDFJbnZlcnNlKTtcbiAgbGV0IG4gPSBtaWRwb2ludChwMiwgcDJJbnZlcnNlKTtcblxuICBsZXQgbTEgPSBwZXJwZW5kaWN1bGFyU2xvcGUobSwgcDFJbnZlcnNlKTtcbiAgbGV0IG0yID0gcGVycGVuZGljdWxhclNsb3BlKG4sIHAySW52ZXJzZSk7XG5cblxuICAvL2NlbnRyZSBpcyB0aGUgY2VudHJlcG9pbnQgb2YgdGhlIGNpcmNsZSBvdXQgb2Ygd2hpY2ggdGhlIGFyYyBpcyBtYWRlXG4gIGxldCBjZW50cmUgPSBpbnRlcnNlY3Rpb24obSwgbTEsIG4sIG0yKTtcbiAgbGV0IHJhZGl1cyA9IGRpc3RhbmNlKGNlbnRyZSwgcDEpO1xuICByZXR1cm4ge1xuICAgIGNlbnRyZTogY2VudHJlLFxuICAgIHJhZGl1czogcmFkaXVzXG4gIH07XG59XG5cbi8vYW4gYXR0ZW1wdCBhdCBjYWxjdWxhdGluZyB0aGUgY2lyY2xlIGFsZ2VicmFpY2FsbHlcbmV4cG9ydCBjb25zdCBncmVhdENpcmNsZVYyID0gKHAxLHAyLCByKSA9PntcbiAgbGV0IHggPSAocDIueSoocDEueCpwMS54ICsgcikrIHAxLnkqcDEueSpwMi55LXAxLnkqKHAyLngqcDIueCsgcDIueSpwMi55ICsgcikpLygyKnAxLngqcDIueSAtIHAxLnkqcDIueCk7XG4gIGxldCB5ID0gKHAxLngqcDEueCpwMi54IC0gcDEueCoocDIueCpwMi54K3AyLnkqcDIueStyKStwMi54KihwMS55KnAxLnkrcikpLygyKnAxLnkqcDIueCArIDIqcDEueCpwMi55KTtcbiAgbGV0IHJhZGl1cyA9ICAgTWF0aC5zcXJ0KHgqeCt5Knktcik7XG4gIHJldHVybiB7XG4gICAgY2VudHJlOiB7XG4gICAgICB4OiB4LFxuICAgICAgeTogeVxuICAgIH0sXG4gICAgcmFkaXVzOiByYWRpdXNcbiAgfVxufVxuXG4vL2ludGVyc2VjdGlvbiBvZiB0d28gY2lyY2xlcyB3aXRoIGVxdWF0aW9uczpcbi8vKHgtYSleMiArKHktYSleMiA9IHIwXjJcbi8vKHgtYileMiArKHktYyleMiA9IHIxXjJcbi8vTk9URSBhc3N1bWVzIHRoZSB0d28gY2lyY2xlcyBETyBpbnRlcnNlY3QhXG5leHBvcnQgY29uc3QgY2lyY2xlSW50ZXJzZWN0ID0gKGMwLCBjMSwgcjAsIHIxKSA9PiB7XG4gIGxldCBhID0gYzAueDtcbiAgbGV0IGIgPSBjMC55O1xuICBsZXQgYyA9IGMxLng7XG4gIGxldCBkID0gYzEueTtcbiAgbGV0IGRpc3QgPSBNYXRoLnNxcnQoKGMgLSBhKSAqIChjIC0gYSkgKyAoZCAtIGIpICogKGQgLSBiKSk7XG5cbiAgbGV0IGRlbCA9IE1hdGguc3FydCgoZGlzdCArIHIwICsgcjEpICogKGRpc3QgKyByMCAtIHIxKSAqIChkaXN0IC0gcjAgKyByMSkgKiAoLWRpc3QgKyByMCArIHIxKSkgLyA0O1xuXG4gIGxldCB4UGFydGlhbCA9IChhICsgYykgLyAyICsgKChjIC0gYSkgKiAocjAgKiByMCAtIHIxICogcjEpKSAvICgyICogZGlzdCAqIGRpc3QpO1xuICBsZXQgeDEgPSB4UGFydGlhbCAtIDIgKiBkZWwgKiAoYiAtIGQpIC8gKGRpc3QgKiBkaXN0KTtcbiAgbGV0IHgyID0geFBhcnRpYWwgKyAyICogZGVsICogKGIgLSBkKSAvIChkaXN0ICogZGlzdCk7XG5cbiAgbGV0IHlQYXJ0aWFsID0gKGIgKyBkKSAvIDIgKyAoKGQgLSBiKSAqIChyMCAqIHIwIC0gcjEgKiByMSkpIC8gKDIgKiBkaXN0ICogZGlzdCk7XG4gIGxldCB5MSA9IHlQYXJ0aWFsICsgMiAqIGRlbCAqIChhIC0gYykgLyAoZGlzdCAqIGRpc3QpO1xuICBsZXQgeTIgPSB5UGFydGlhbCAtIDIgKiBkZWwgKiAoYSAtIGMpIC8gKGRpc3QgKiBkaXN0KTtcblxuICBsZXQgcDEgPSB7XG4gICAgeDogeDEsXG4gICAgeTogeTFcbiAgfVxuXG4gIGxldCBwMiA9IHtcbiAgICB4OiB4MixcbiAgICB5OiB5MlxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBwMTogcDEsXG4gICAgcDI6IHAyXG4gIH07XG59XG5cbmV4cG9ydCBjb25zdCBjaXJjbGVMaW5lSW50ZXJzZWN0ID0gKGMsIHIsIHAxLCBwMikgPT4ge1xuXG4gIGNvbnN0IGQgPSBkaXN0YW5jZShwMSwgcDIpO1xuICAvL3VuaXQgdmVjdG9yIHAxIHAyXG4gIGNvbnN0IGR4ID0gKHAyLnggLSBwMS54KS9kO1xuICBjb25zdCBkeSA9IChwMi55IC0gcDEueSkvZDtcblxuICAvL3BvaW50IG9uIGxpbmUgY2xvc2VzdCB0byBjaXJjbGUgY2VudHJlXG4gIGNvbnN0IHQgPSBkeCooYy54IC1wMS54KSArIGR5KihjLnktcDEueSk7XG4gIGNvbnN0IHAgPSAge3g6IHQqIGR4ICsgcDEueCwgeTogdCogZHkgKyBwMS55fTtcblxuICAvL2Rpc3RhbmNlIGZyb20gdGhpcyBwb2ludCB0byBjZW50cmVcbiAgY29uc3QgZDIgPSBkaXN0YW5jZShwLCBjKTtcblxuICAvL2xpbmUgaW50ZXJzZWN0cyBjaXJjbGVcbiAgaWYoZDIgPCByKXtcbiAgICBjb25zdCBkdCA9IE1hdGguc3FydCggcipyIC0gZDIqZDIpO1xuICAgIC8vcG9pbnQgMVxuICAgIGNvbnN0IHExID0ge1xuICAgICAgeDogKHQtZHQpKmR4ICsgcDEueCxcbiAgICAgIHk6ICh0LWR0KSpkeSArIHAxLnlcbiAgICB9XG4gICAgLy9wb2ludCAyXG4gICAgY29uc3QgcTIgPSB7XG4gICAgICB4OiAodCtkdCkqZHggKyBwMS54LFxuICAgICAgeTogKHQrZHQpKmR5ICsgcDEueVxuICAgIH1cblxuICAgIHJldHVybiB7cDE6IHExLCBwMjogcTJ9O1xuICB9XG4gIGVsc2UgaWYoIGQyID09PSByKXtcbiAgICByZXR1cm4gcDtcbiAgfVxuICBlbHNle1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yOiBsaW5lIGRvZXMgbm90IGludGVyc2VjdCBjaXJjbGUhJyk7XG4gIH1cbn1cblxuLy9hbmdsZSBpbiByYWRpYW5zIGJldHdlZW4gdHdvIHBvaW50cyBvbiBjaXJjbGUgb2YgcmFkaXVzIHJcbmV4cG9ydCBjb25zdCBjZW50cmFsQW5nbGUgPSAocDEsIHAyLCByKSA9PiB7XG4gIHJldHVybiAyICogTWF0aC5hc2luKDAuNSAqIGRpc3RhbmNlKHAxLCBwMikgLyByKTtcbn1cblxuLy9jYWxjdWxhdGUgdGhlIG5vcm1hbCB2ZWN0b3IgZ2l2ZW4gMiBwb2ludHNcbmV4cG9ydCBjb25zdCBub3JtYWxWZWN0b3IgPSAocDEsIHAyKSA9PiB7XG4gIGxldCBkID0gTWF0aC5zcXJ0KE1hdGgucG93KHAyLngtcDEueCwyKSArIE1hdGgucG93KHAyLnktcDEueSwyKSk7XG4gIHJldHVybiB7XG4gICAgeDogKHAyLngtcDEueCkvZCxcbiAgICB5OiAocDIueS1wMS55KS9kXG4gIH1cbn1cblxuLy9kb2VzIHRoZSBsaW5lIGNvbm5lY3RpbmcgcDEsIHAyIGdvIHRocm91Z2ggdGhlIHBvaW50ICgwLDApP1xuZXhwb3J0IGNvbnN0IHRocm91Z2hPcmlnaW4gPSAocDEsIHAyKSA9PiB7XG4gIGlmKHAxLnggPT09IDAgJiYgcDIueCA9PT0gMCl7XG4gICAgLy92ZXJ0aWNhbCBsaW5lIHRocm91Z2ggY2VudHJlXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgbGV0IHRlc3QgPSAoLXAxLngqcDIueSArIHAxLngqcDEueSkvKHAyLngtcDEueCkgKyBwMS55O1xuICBpZih0ZXN0ID09PSAwKSByZXR1cm4gdHJ1ZTtcbiAgZWxzZSByZXR1cm4gZmFsc2U7XG59XG5cbi8vZmluZCB0aGUgY2VudHJvaWQgb2YgYSBub24tc2VsZi1pbnRlcnNlY3RpbmcgcG9seWdvblxuZXhwb3J0IGNvbnN0IGNlbnRyb2lkT2ZQb2x5Z29uID0gKHBvaW50cykgPT4ge1xuICBsZXQgZmlyc3QgPSBwb2ludHNbMF0sIGxhc3QgPSBwb2ludHNbcG9pbnRzLmxlbmd0aC0xXTtcbiAgaWYgKGZpcnN0LnggIT0gbGFzdC54IHx8IGZpcnN0LnkgIT0gbGFzdC55KSBwb2ludHMucHVzaChmaXJzdCk7XG4gIGxldCB0d2ljZWFyZWE9MCxcbiAgICB4PTAsIHk9MCxcbiAgICBuUHRzID0gcG9pbnRzLmxlbmd0aCxcbiAgICBwMSwgcDIsIGY7XG4gIGZvciAoIHZhciBpPTAsIGo9blB0cy0xIDsgaTxuUHRzIDsgaj1pKysgKSB7XG4gICAgcDEgPSBwb2ludHNbaV07IHAyID0gcG9pbnRzW2pdO1xuICAgIGYgPSBwMS54KnAyLnkgLSBwMi54KnAxLnk7XG4gICAgdHdpY2VhcmVhICs9IGY7XG4gICAgeCArPSAoIHAxLnggKyBwMi54ICkgKiBmO1xuICAgIHkgKz0gKCBwMS55ICsgcDIueSApICogZjtcbiAgfVxuICBmID0gdHdpY2VhcmVhICogMztcbiAgcmV0dXJuIHsgeDp4L2YsIHk6eS9mIH07XG59XG5cbi8vY29tcGFyZSB0d28gcG9pbnRzIHRha2luZyByb3VuZGluZyBlcnJvcnMgaW50byBhY2NvdW50XG5leHBvcnQgY29uc3QgY29tcGFyZVBvaW50cyA9IChwMSwgcDIpID0+IHtcbiAgaWYodHlwZW9mIHAxID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgcDIgPT09ICd1bmRlZmluZWQnKXtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBwMSA9IHBvaW50VG9GaXhlZChwMSwgNik7XG4gIHAyID0gcG9pbnRUb0ZpeGVkKHAyLCA2KTtcbiAgaWYocDEueCA9PT0gcDIueCAmJiBwMS55ID09PSBwMi55KSByZXR1cm4gdHJ1ZTtcbiAgZWxzZSByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBjb25zdCBwb2ludFRvRml4ZWQgPSAocCwgcGxhY2VzKSA9PiB7XG4gIHJldHVybiB7XG4gICAgeDogcC54LnRvRml4ZWQocGxhY2VzKSxcbiAgICB5OiBwLnkudG9GaXhlZChwbGFjZXMpXG4gIH07XG59XG5cbi8qXG4vL2ZsaXAgYSBzZXQgb2YgcG9pbnRzIG92ZXIgYSBoeXBlcm9ibGljIGxpbmUgZGVmaW5lZCBieSB0d28gcG9pbnRzXG5leHBvcnQgY29uc3QgdHJhbnNmb3JtID0gKHBvaW50c0FycmF5LCBwMSwgcDIpID0+IHtcbiAgbGV0IG5ld1BvaW50c0FycmF5ID0gW107XG4gIGxldCBjID0gRS5ncmVhdENpcmNsZShwMSwgcDIsIGRpc2sucmFkaXVzLCBkaXNrLmNlbnRyZSk7XG5cbiAgZm9yKGxldCBwIG9mIHBvaW50c0FycmF5KXtcbiAgICBsZXQgbmV3UCA9IEUuaW52ZXJzZShwLCBjLnJhZGl1cywgYy5jZW50cmUpO1xuICAgIG5ld1BvaW50c0FycmF5LnB1c2gobmV3UCk7XG4gIH1cbiAgcmV0dXJuIG5ld1BvaW50c0FycmF5O1xufVxuKi9cbiIsImltcG9ydCB7IFJlZ3VsYXJUZXNzZWxhdGlvbiB9IGZyb20gJy4vcmVndWxhclRlc3NlbGF0aW9uJztcbmltcG9ydCAqIGFzIEUgZnJvbSAnLi9ldWNsaWQnO1xuaW1wb3J0IHsgRGlzayB9IGZyb20gJy4vZGlzayc7XG5cblxuLy8gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gKlxuLy8gKiAgIFNFVFVQXG4vLyAqXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbmNvbnN0IGRpc2sgPSBuZXcgRGlzaygndGhyZWVqcycpO1xuXG4vL2NvbnN0IHRlc3NlbGF0aW9uID0gbmV3IFJlZ3VsYXJUZXNzZWxhdGlvbig1LCA0LCAzKk1hdGguUEkvNiowLCAncmVkJyk7XG4iLCJpbXBvcnQgKiBhcyBFIGZyb20gJy4vZXVjbGlkJztcbmltcG9ydCB7IERpc2sgfSBmcm9tICcuL2Rpc2snO1xuLy8gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gKiAgICBURVNTRUxBVElPTiBDTEFTU1xuLy8gKiAgICBDcmVhdGVzIGEgcmVndWxhciBUZXNzZWxhdGlvbiBvZiB0aGUgUG9pbmNhcmUgRGlza1xuLy8gKiAgICBxOiBudW1iZXIgb2YgcC1nb25zIG1lZXRpbmcgYXQgZWFjaCB2ZXJ0ZXhcbi8vICogICAgcDogbnVtYmVyIG9mIHNpZGVzIG9mIHAtZ29uXG4vLyAqICAgIHVzaW5nIHRoZSB0ZWNobmlxdWVzIGNyZWF0ZWQgYnkgQ294ZXRlciBhbmQgRHVuaGFtXG4vLyAqXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5leHBvcnQgY2xhc3MgUmVndWxhclRlc3NlbGF0aW9uIGV4dGVuZHMgRGlzayB7XG4gIGNvbnN0cnVjdG9yKHAsIHEsIHJvdGF0aW9uLCBjb2xvdXIsIG1heExheWVycywgZHJhd0NsYXNzKSB7XG4gICAgc3VwZXIoZHJhd0NsYXNzKTtcbiAgICB0aGlzLnAgPSBwO1xuICAgIHRoaXMucSA9IHE7XG4gICAgdGhpcy5jb2xvdXIgPSBjb2xvdXIgfHwgJ2JsYWNrJztcbiAgICB0aGlzLnJvdGF0aW9uID0gcm90YXRpb24gfHwgMDtcbiAgICB0aGlzLm1heExheWVycyA9IG1heExheWVycyB8fCA1O1xuXG4gICAgaWYodGhpcy5jaGVja1BhcmFtcygpKXsgcmV0dXJuIGZhbHNlO31cblxuICAgIHRoaXMuZnIgPSB0aGlzLmZ1bmRhbWVudGFsUmVnaW9uKCk7XG5cbiAgICB0aGlzLmFyYyh0aGlzLmZyLmEsIHRoaXMuZnIuYik7XG4gICAgdGhpcy5hcmModGhpcy5mci5hLCB0aGlzLmZyLmMpO1xuICAgIHRoaXMuYXJjKHRoaXMuZnIuYiwgdGhpcy5mci5jKTtcbiAgfVxuXG4gIC8vY2FsY3VsYXRlIGZpcnN0IHBvaW50IG9mIGZ1bmRhbWVudGFsIHBvbHlnb24gdXNpbmcgQ294ZXRlcidzIG1ldGhvZFxuICBmdW5kYW1lbnRhbFJlZ2lvbigpe1xuICAgIGNvbnN0IHMgPSBNYXRoLnNpbihNYXRoLlBJL3RoaXMucCk7XG4gICAgY29uc3QgdCA9IE1hdGguY29zKE1hdGguUEkvdGhpcy5xKTtcbiAgICAvL211bHRpcGx5IHRoZXNlIGJ5IHRoZSBkaXNrcyByYWRpdXMgKENveGV0ZXIgdXNlZCB1bml0IGRpc2spO1xuICAgIGNvbnN0IHIgPSAxL01hdGguc3FydCgodCp0KS8ocypzKSAtMSkqdGhpcy5yYWRpdXM7XG4gICAgY29uc3QgZCA9IDEvTWF0aC5zcXJ0KDEtIChzKnMpLyh0KnQpKSp0aGlzLnJhZGl1cztcbiAgICBjb25zdCBiID0ge1xuICAgICAgeDogdGhpcy5yYWRpdXMqTWF0aC5jb3MoTWF0aC5QSS90aGlzLnApLFxuICAgICAgeTogLXRoaXMucmFkaXVzKk1hdGguc2luKE1hdGguUEkvdGhpcy5wKVxuICAgIH1cblxuICAgIGNvbnN0IGNlbnRyZSA9IHt4OiBkLCB5OiAwfTtcblxuICAgIC8vdGhlcmUgd2lsbCBiZSB0d28gcG9pbnRzIG9mIGludGVyc2VjdGlvbiwgb2Ygd2hpY2ggd2Ugd2FudCB0aGUgZmlyc3RcbiAgICBjb25zdCBwMSA9IEUuY2lyY2xlTGluZUludGVyc2VjdChjZW50cmUsIHIsIHRoaXMuY2VudHJlLCBiKS5wMTtcblxuICAgIHJldHVybiB7XG4gICAgICBhOiB0aGlzLmNlbnRyZSxcbiAgICAgIGI6IHAxLFxuICAgICAgYzogeyB4OiBkLXIsIHk6IDB9XG4gICAgfTtcbiAgfVxuXG4gIC8vVGhlIHRlc3NlbGF0aW9uIHJlcXVpcmVzIHRoYXQgKHAtMikocS0yKSA+IDQgdG8gd29yayAob3RoZXJ3aXNlIGl0IGlzXG4gIC8vIGVpdGhlciBhbiBlbGxpcHRpY2FsIG9yIGV1Y2xpZGVhbiB0ZXNzZWxhdGlvbik7XG4gIGNoZWNrUGFyYW1zKCl7XG4gICAgaWYodGhpcy5tYXhMYXllcnMgPCAwIHx8IGlzTmFOKHRoaXMubWF4TGF5ZXJzKSl7XG4gICAgICBjb25zb2xlLmVycm9yKCdtYXhMYXllcnMgbXVzdCBiZSBncmVhdGVyIHRoYW4gMCcpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGVsc2UgaWYoKHRoaXMucCAtMikqKHRoaXMucS0yKSA8PSA0KXtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0h5cGVyYm9saWMgdGVzc2VsYXRpb25zIHJlcXVpcmUgdGhhdCAocC0xKShxLTIpIDwgNCEnKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvL0ZvciBub3cgcmVxdWlyZSBwLHEgPiAzLFxuICAgIC8vVE9ETyBpbXBsZW1lbnQgc3BlY2lhbCBjYXNlcyBmb3IgcSA9IDMgb3IgcCA9IDNcbiAgICBlbHNlIGlmKHRoaXMucSA8PSAzIHx8IGlzTmFOKHRoaXMucSkpe1xuICAgICAgY29uc29sZS5lcnJvcignVGVzc2VsYXRpb24gZXJyb3I6IGF0IGxlYXN0IDMgcC1nb25zIG11c3QgbWVldCBcXFxuICAgICAgICAgICAgICAgICAgICBhdCBlYWNoIHZlcnRleCEnKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBlbHNlIGlmKHRoaXMucCA8PSAzfHwgaXNOYU4odGhpcy5wKSl7XG4gICAgICBjb25zb2xlLmVycm9yKCdUZXNzZWxhdGlvbiBlcnJvcjogcG9seWdvbiBuZWVkcyBhdCBsZWFzdCAzIHNpZGVzIScpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGVsc2UgeyByZXR1cm4gZmFsc2U7IH1cbiAgfVxufVxuIiwiLy8gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gKlxuLy8gKiAgVEhSRUUgSlMgQ0xBU1Ncbi8vICpcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbmV4cG9ydCBjbGFzcyBUaHJlZUpTIHtcbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChldmVudCkgPT4ge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnKTtcbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH0sIGZhbHNlKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XG4gICAgICAvL3RoaXMuY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgLy90aGlzLmNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gICAgICAvL3RoaXMucmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcblxuICAgICAgdGhpcy5yZXNldCgpO1xuICAgIH0sIGZhbHNlKTtcblxuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG4gICAgdGhpcy5pbml0Q2FtZXJhKCk7XG5cbiAgICB0aGlzLmluaXRMaWdodGluZygpO1xuXG4gICAgdGhpcy5heGVzKCk7XG5cbiAgICB0aGlzLmluaXRSZW5kZXJlcigpO1xuICAgIC8vY29uc29sZS5sb2codGhpcy5zY2VuZSk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLmlkKTsgLy8gU3RvcCB0aGUgYW5pbWF0aW9uXG4gICAgdGhpcy5yZW5kZXJlci5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgbnVsbCwgZmFsc2UpOyAvL3JlbW92ZSBsaXN0ZW5lciB0byByZW5kZXJcbiAgICB0aGlzLnNjZW5lID0gbnVsbDtcbiAgICB0aGlzLnByb2plY3RvciA9IG51bGw7XG4gICAgdGhpcy5jYW1lcmEgPSBudWxsO1xuICAgIHRoaXMuY29udHJvbHMgPSBudWxsO1xuXG4gICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdjYW52YXMnKTtcbiAgICBmb3IgKGxldCBpbmRleCA9IGVsZW1lbnQubGVuZ3RoIC0gMTsgaW5kZXggPj0gMDsgaW5kZXgtLSkge1xuICAgICAgZWxlbWVudFtpbmRleF0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtZW50W2luZGV4XSk7XG4gICAgfVxuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgaW5pdENhbWVyYSgpIHtcbiAgICB0aGlzLmNhbWVyYSA9IG5ldyBUSFJFRS5PcnRob2dyYXBoaWNDYW1lcmEod2luZG93LmlubmVyV2lkdGggLyAtMixcbiAgICAgIHdpbmRvdy5pbm5lcldpZHRoIC8gMiwgd2luZG93LmlubmVySGVpZ2h0IC8gMiwgd2luZG93LmlubmVySGVpZ2h0IC8gLTIsIC0yLCAxKTtcbiAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLmNhbWVyYSk7XG4gICAgdGhpcy5jYW1lcmEucG9zaXRpb24ueCA9IDA7XG4gICAgdGhpcy5jYW1lcmEucG9zaXRpb24ueSA9IDA7XG5cbiAgICB0aGlzLmNhbWVyYS5wb3NpdGlvbi56ID0gMTtcbiAgfVxuXG4gIGluaXRMaWdodGluZygpIHtcbiAgICAvL2NvbnN0IHNwb3RMaWdodCA9IG5ldyBUSFJFRS5TcG90TGlnaHQoMHhmZmZmZmYpO1xuICAgIC8vc3BvdExpZ2h0LnBvc2l0aW9uLnNldCgwLCAwLCAxMDApO1xuICAgIC8vdGhpcy5zY2VuZS5hZGQoc3BvdExpZ2h0KTtcbiAgICBjb25zdCBhbWJpZW50TGlnaHQgPSBuZXcgVEhSRUUuQW1iaWVudExpZ2h0KDB4ZmZmZmZmKTtcbiAgICB0aGlzLnNjZW5lLmFkZChhbWJpZW50TGlnaHQpO1xuICB9XG5cbiAgaW5pdFJlbmRlcmVyKCkge1xuICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7XG4gICAgICBhbnRpYWxpYXM6IHRydWUsXG4gICAgfSk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRDbGVhckNvbG9yKDB4ZmZmZmZmLCAxLjApO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMucmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgLy9iZWhpbmQ6IHRydWUvZmFsc2VcbiAgZGlzayhjZW50cmUsIHJhZGl1cywgY29sb3IsIGJlaGluZCkge1xuICAgIGxldCBjb2wgPSBjb2xvcjtcbiAgICBpZiAoY29sID09PSAndW5kZWZpbmVkJykgY29sID0gMHhmZmZmZmY7XG5cbiAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5DaXJjbGVHZW9tZXRyeShyYWRpdXMsIDEwMCwgMCwgMiAqIE1hdGguUEkpO1xuICAgIGNvbnN0IGNpcmNsZSA9IHRoaXMuY3JlYXRlTWVzaChnZW9tZXRyeSwgY29sKTtcbiAgICBjaXJjbGUucG9zaXRpb24ueCA9IGNlbnRyZS54O1xuICAgIGNpcmNsZS5wb3NpdGlvbi55ID0gY2VudHJlLnk7XG4gICAgaWYgKCFiZWhpbmQpIHtcbiAgICAgIGNpcmNsZS5wb3NpdGlvbi56ID0gMTtcbiAgICB9XG5cbiAgICB0aGlzLnNjZW5lLmFkZChjaXJjbGUpO1xuICB9XG5cbiAgc2VnbWVudChjaXJjbGUsIGFscGhhLCBvZmZzZXQsIGNvbG9yKSB7XG4gICAgbGV0IGNvbCA9IGNvbG9yO1xuICAgIGlmIChjb2wgPT09ICd1bmRlZmluZWQnKSBjb2wgPSAweGZmZmZmZjtcbiAgICBjb25zdCBjdXJ2ZSA9IG5ldyBUSFJFRS5FbGxpcHNlQ3VydmUoXG4gICAgICBjaXJjbGUuY2VudHJlLngsIGNpcmNsZS5jZW50cmUueSwgLy8gYXgsIGFZXG4gICAgICBjaXJjbGUucmFkaXVzLCBjaXJjbGUucmFkaXVzLCAvLyB4UmFkaXVzLCB5UmFkaXVzXG4gICAgICBhbHBoYSwgb2Zmc2V0LCAvLyBhU3RhcnRBbmdsZSwgYUVuZEFuZ2xlXG4gICAgICB0cnVlIC8vIGFDbG9ja3dpc2VcbiAgICApO1xuXG4gICAgY29uc3QgcG9pbnRzID0gY3VydmUuZ2V0U3BhY2VkUG9pbnRzKDEwMCk7XG5cbiAgICBjb25zdCBwYXRoID0gbmV3IFRIUkVFLlBhdGgoKTtcbiAgICBjb25zdCBnZW9tZXRyeSA9IHBhdGguY3JlYXRlR2VvbWV0cnkocG9pbnRzKTtcblxuICAgIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKHtcbiAgICAgIGNvbG9yOiBjb2xcbiAgICB9KTtcbiAgICBjb25zdCBzID0gbmV3IFRIUkVFLkxpbmUoZ2VvbWV0cnksIG1hdGVyaWFsKTtcblxuICAgIHRoaXMuc2NlbmUuYWRkKHMpO1xuICB9XG5cbiAgbGluZShzdGFydCwgZW5kLCBjb2xvcikge1xuICAgIGxldCBjb2wgPSBjb2xvcjtcbiAgICBpZiAoY29sID09PSAndW5kZWZpbmVkJykgY29sID0gMHhmZmZmZmY7XG5cbiAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5HZW9tZXRyeSgpO1xuXG4gICAgZ2VvbWV0cnkudmVydGljZXMucHVzaChcbiAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKHN0YXJ0LngsIHN0YXJ0LnksIDApLFxuICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoZW5kLngsIGVuZC55LCAwKVxuICAgICk7XG4gICAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoe1xuICAgICAgY29sb3I6IGNvbFxuICAgIH0pO1xuICAgIGNvbnN0IGwgPSBuZXcgVEhSRUUuTGluZShnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgIHRoaXMuc2NlbmUuYWRkKGwpO1xuICB9XG5cbiAgY3JlYXRlTWVzaChnZW9tZXRyeSwgY29sb3IsIGltYWdlVVJMKSB7XG4gICAgbGV0IGNvbCA9IGNvbG9yO1xuICAgIGlmIChjb2wgPT09ICd1bmRlZmluZWQnKSBjb2wgPSAweGZmZmZmZjtcbiAgICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XG4gICAgICBjb2xvcjogY29sXG4gICAgfSk7XG5cbiAgICBpZiAoaW1hZ2VVUkwpIHtcbiAgICAgIGNvbnN0IHRleHR1cmVMb2FkZXIgPSBuZXcgVEhSRUUuVGV4dHVyZUxvYWRlcigpO1xuXG4gICAgICAvL2xvYWQgdGV4dHVyZSBhbmQgYXBwbHkgdG8gbWF0ZXJpYWwgaW4gY2FsbGJhY2tcbiAgICAgIGNvbnN0IHRleHR1cmUgPSB0ZXh0dXJlTG9hZGVyLmxvYWQoaW1hZ2VVUkwsICh0ZXgpID0+IHt9KTtcbiAgICAgIHRleHR1cmUucmVwZWF0LnNldCgwLjA1LCAwLjA1KTtcbiAgICAgIG1hdGVyaWFsLm1hcCA9IHRleHR1cmU7XG4gICAgICBtYXRlcmlhbC5tYXAud3JhcFQgPSBUSFJFRS5SZXBlYXRXcmFwcGluZztcbiAgICAgIG1hdGVyaWFsLm1hcC53cmFwUyA9IFRIUkVFLlJlcGVhdFdyYXBwaW5nO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICB9XG5cbiAgc2hhcGUoKSB7XG4gICAgLy8gY3JlYXRlIGEgYmFzaWMgc2hhcGVcbiAgICB2YXIgc2hhcGUgPSBuZXcgVEhSRUUuU2hhcGUoKTtcblxuICAgIC8vIHN0YXJ0cG9pbnRcbiAgICBzaGFwZS5tb3ZlVG8oMCwgMCk7XG5cbiAgICAvLyBzdHJhaWdodCBsaW5lIHVwd2FyZHNcbiAgICBzaGFwZS5saW5lVG8oMCwgNTApO1xuXG4gICAgLy8gdGhlIHRvcCBvZiB0aGUgZmlndXJlLCBjdXJ2ZSB0byB0aGUgcmlnaHRcbiAgICBzaGFwZS5xdWFkcmF0aWNDdXJ2ZVRvKDE1LCAyNSwgMjUsIDMwKTtcblxuICAgIHNoYXBlLmxpbmVUbygwLCAwKTtcblxuICAgIGNvbnN0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLlNoYXBlR2VvbWV0cnkoc2hhcGUpO1xuICAgIHRoaXMuY3VydmUgPSB0aGlzLmNyZWF0ZU1lc2goZ2VvbWV0cnksICcuL2ltYWdlcy90ZXh0dXJlcy90ZXN0LmpwZycpO1xuICAgIHRoaXMuY3VydmUucG9zaXRpb24ueSA9IC0zMDtcbiAgICB0aGlzLmN1cnZlLnBvc2l0aW9uLnogPSAtNDA7XG4gICAgdGhpcy5zY2VuZS5hZGQodGhpcy5jdXJ2ZSk7XG4gIH1cblxuICBheGVzKCkge1xuICAgIGNvbnN0IHh5eiA9IG5ldyBUSFJFRS5BeGlzSGVscGVyKDIwKTtcbiAgICB0aGlzLnNjZW5lLmFkZCh4eXopO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICB0aGlzLnJlbmRlcigpXG4gICAgfSk7XG4gICAgLy90aGlzLmNpcmNsZS5yb3RhdGlvbi54ICs9IDAuMDI7XG4gICAgdGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5zY2VuZSwgdGhpcy5jYW1lcmEpO1xuICB9XG5cbn1cbiJdfQ==
