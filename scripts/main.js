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

      this.point(this.centre, 4, 0xffff00);
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
      this.draw.disk(this.centre, radius, color, false);
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
        this.draw.euclideanLine(points.p1, points.p2, col);
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
      var p = { x: c.centre.x + c.radius, y: c.centre.y };
      //case where points are above and below the line c.centre -> p
      //in this case just return points
      var oy = c.centre.y;
      var ox = c.centre.x;

      if (p1.x > ox && p2.x > ox) {
        if (p1.y > oy && p2.y < oy) return { p1: p2, p2: p1 };else if (p1.y < oy && p2.y > oy) return { p1: p1, p2: p2 };
      }

      var alpha1 = E.centralAngle(p, p1, c.radius);
      alpha1 = p1.y < c.centre.y ? 2 * Math.PI - alpha1 : alpha1;
      var alpha2 = E.centralAngle(p, p2, c.radius);
      alpha2 = p2.y < c.centre.y ? 2 * Math.PI - alpha2 : alpha2;

      //if the points are not in clockwise order flip them
      if (alpha1 > alpha2) return { p1: p2, p2: p1 };else return { p1: p1, p2: p2 };
    }

    //Draw an arc (hyperbolic line segment) between two points on the disk

  }, {
    key: 'arc',
    value: function arc(p1, p2, colour) {
      if (E.throughOrigin(p1, p2)) {
        this.draw.euclideanLine(p1, p2, colour);
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
      this.camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -1, 1);
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
      this.renderer = new THREE.WebGLRenderer();
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
    key: 'createMesh',
    value: function createMesh(geometry, color, imageURL) {
      var col = color;
      if (col === 'undefined') col = 0xffffff;
      var material = new THREE.MeshBasicMaterial({ color: col });

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJlczIwMTUvZGlzay5qcyIsImVzMjAxNS9ldWNsaWQuanMiLCJlczIwMTUvbWFpbi5qcyIsImVzMjAxNS9yZWd1bGFyVGVzc2VsYXRpb24uanMiLCJlczIwMTUvdGhyZWVqcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7OztJQ0FZLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7SUFXQSxJQUFJLFdBQUosSUFBSTtBQUNmLFdBRFcsSUFBSSxHQUNEOzs7MEJBREgsSUFBSTs7QUFFYixRQUFJLENBQUMsSUFBSSxHQUFHLGFBWFAsT0FBTyxFQVdhLENBQUM7O0FBRzFCLFVBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDekMsWUFBTSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ25DLFlBQUssSUFBSSxFQUFFLENBQUM7S0FDYixFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUVWLFVBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsWUFBTTtBQUN0QyxZQUFLLElBQUksRUFBRSxDQUFDO0tBQ2IsRUFBRSxLQUFLLENBQUMsQ0FBQztHQUVYOztlQWRVLElBQUk7OzJCQWdCVDtBQUNKLFVBQUksQ0FBQyxNQUFNLEdBQUc7QUFDWixTQUFDLEVBQUUsQ0FBQztBQUNKLFNBQUMsRUFBRSxDQUFDO09BQ0w7OztBQUFBLEFBR0QsVUFBSSxDQUFDLE1BQU0sR0FBRyxBQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFdBQVcsR0FBSSxBQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxHQUFJLENBQUMsR0FBRyxBQUFDLE1BQU0sQ0FBQyxXQUFXLEdBQUcsQ0FBQyxHQUFJLENBQUM7Ozs7QUFBQyxBQUlwSCxVQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7O0FBRWhCLFVBQUksQ0FBQyxLQUFLLENBQUMsSUFB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LEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUEsSUFBSyxJQUFJLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQSxBQUFDLElBQUksSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUEsQUFBQyxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUEsQUFBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVwRyxNQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsR0FBSSxDQUFDLEdBQUcsQUFBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsSUFBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUEsQUFBQyxJQUFLLENBQUMsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFBLEFBQUMsQ0FBQztBQUNqRixNQUFJLEVBQUUsR0FBRyxRQUFRLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFBLEFBQUMsQ0FBQztBQUN0RCxNQUFJLEVBQUUsR0FBRyxRQUFRLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFBLEFBQUMsQ0FBQzs7QUFFdEQsTUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksQ0FBQyxHQUFHLEFBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLElBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFBLEFBQUMsSUFBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7QUFDakYsTUFBSSxFQUFFLEdBQUcsUUFBUSxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLElBQUksSUFBSSxHQUFHLElB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Ozs2QkFFUTs7O0FBQ1AsMkJBQXFCLENBQUMsWUFBTTtBQUMxQixlQUFLLE1BQU0sRUFBRSxDQUFBO09BQ2QsQ0FBQzs7QUFBQyxBQUVILFVBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQy9DOzs7U0E3SVUsT0FBTyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgKiBhcyBFIGZyb20gJy4vZXVjbGlkJztcbi8vaW1wb3J0IHsgQ2FudmFzIH0gZnJvbSAnLi9jYW52YXMnO1xuaW1wb3J0IHsgVGhyZWVKUyB9IGZyb20gJy4vdGhyZWVqcyc7XG5cbi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICpcbi8vICogICBESVNLIENMQVNTXG4vLyAqICAgUG9pbmNhcmUgRGlzayByZXByZXNlbnRhdGlvbiBvZiB0aGUgaHlwZXJib2xpYyBwbGFuZVxuLy8gKiAgIENvbnRhaW5zIGFueSBmdW5jdGlvbnMgdXNlZCB0byBkcmF3IHRvIHRoZSBkaXNrXG4vLyAqICAgKEN1cnJlbnRseSB1c2luZyB0aHJlZSBqcyBhcyBkcmF3aW5nIGNsYXNzKVxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuZXhwb3J0IGNsYXNzIERpc2sge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmRyYXcgPSBuZXcgVGhyZWVKUygpO1xuXG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChldmVudCkgPT4ge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnKTtcbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH0sIGZhbHNlKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XG4gICAgICB0aGlzLmluaXQoKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgfVxuXG4gIGluaXQoKXtcbiAgICB0aGlzLmNlbnRyZSA9IHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwXG4gICAgfVxuXG4gICAgLy9kcmF3IGxhcmdlc3QgY2lyY2xlIHBvc3NpYmxlIGdpdmVuIHdpbmRvdyBkaW1zXG4gICAgdGhpcy5yYWRpdXMgPSAod2luZG93LmlubmVyV2lkdGggPCB3aW5kb3cuaW5uZXJIZWlnaHQpID8gKHdpbmRvdy5pbm5lcldpZHRoIC8gMikgLSA1IDogKHdpbmRvdy5pbm5lckhlaWdodCAvIDIpIC0gNTtcbiAgICAvL3NtYWxsZXIgY2lyY2xlIGZvciB0ZXN0aW5nXG4gICAgLy90aGlzLnJhZGl1cyA9IHRoaXMucmFkaXVzIC8gMztcblxuICAgIHRoaXMuZHJhd0Rpc2soKTtcblxuICAgIHRoaXMucG9pbnQodGhpcy5jZW50cmUsIDQsIDB4ZmZmZjAwKTtcbiAgfVxuXG4gIC8vZHJhdyB0aGUgZGlzayBiYWNrZ3JvdW5kXG4gIGRyYXdEaXNrKCl7XG4gICAgdGhpcy5kcmF3LmRpc2sodGhpcy5jZW50cmUsIHRoaXMucmFkaXVzLCAweDAwMDAwMCwgdHJ1ZSk7XG4gIH1cblxuICBwb2ludChjZW50cmUsIHJhZGl1cywgY29sb3Ipe1xuICAgIHRoaXMuZHJhdy5kaXNrKHRoaXMuY2VudHJlLCByYWRpdXMsIGNvbG9yLCBmYWxzZSk7XG4gIH1cblxuICAvL2RyYXcgYSBoeXBlcmJvbGljIGxpbmUgYmV0d2VlbiB0d28gcG9pbnRzIG9uIHRoZSBib3VuZGFyeSBjaXJjbGVcbiAgbGluZShwMSwgcDIsIGNvbG91cikge1xuICAgIC8vbGV0IHB0cyA9IHRoaXMucHJlcFBvaW50cyhwMSwgcDIpO1xuICAgIC8vcDEgPSBwdHMucDE7XG4gICAgLy9wMiA9IHB0cy5wMjtcbiAgICBsZXQgY29sID0gY29sb3VyIHx8ICdibGFjayc7XG4gICAgbGV0IGMsIHBvaW50cztcblxuICAgIGlmKEUudGhyb3VnaE9yaWdpbihwMSxwMikpe1xuICAgICAgbGV0IHUgPSBub3JtYWxWZWN0b3IocDEscDIpO1xuICAgICAgcG9pbnRzID0ge1xuICAgICAgICBwMToge1xuICAgICAgICAgIHg6IHUueCAqIHRoaXMucmFkaXVzLFxuICAgICAgICAgIHk6IHUueSAqIHRoaXMucmFkaXVzXG4gICAgICAgIH0sXG4gICAgICAgIHAyOiB7XG4gICAgICAgICAgeDogLXUueCAqIHRoaXMucmFkaXVzLFxuICAgICAgICAgIHk6IC11LnkgKiB0aGlzLnJhZGl1c1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmRyYXcuZXVjbGlkZWFuTGluZShwb2ludHMucDEscG9pbnRzLnAyLCBjb2wpO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgYyA9IEUuZ3JlYXRDaXJjbGUocDEsIHAyLCB0aGlzLnJhZGl1cywgdGhpcy5jZW50cmUpO1xuICAgICAgcG9pbnRzID0gRS5jaXJjbGVJbnRlcnNlY3QodGhpcy5jZW50cmUsIGMuY2VudHJlLCB0aGlzLnJhZGl1cywgYy5yYWRpdXMpO1xuXG4gICAgICAvL2FuZ2xlIHN1YnRlbmRlZCBieSB0aGUgYXJjXG4gICAgICBsZXQgYWxwaGEgPSBFLmNlbnRyYWxBbmdsZShwb2ludHMucDEsIHBvaW50cy5wMiwgYy5yYWRpdXMpO1xuXG4gICAgICBsZXQgb2Zmc2V0ID0gdGhpcy5hbHBoYU9mZnNldChwb2ludHMucDIsIHBvaW50cy5wMiwgYywgJ2xpbmUnKTtcbiAgICAgIHRoaXMuZHJhdy5zZWdtZW50KGMsIGFscGhhLCBvZmZzZXQsIGNvbCk7XG4gICAgfVxuICB9XG5cbiAgLy9jYWxjdWxhdGUgdGhlIG9mZnNldCAocG9zaXRpb24gYXJvdW5kIHRoZSBjaXJjbGUgZnJvbSB3aGljaCB0byBzdGFydCB0aGVcbiAgLy9saW5lIG9yIGFyYykuIEFzIGNhbnZhcyBkcmF3cyBhcmNzIGNsb2Nrd2lzZSBieSBkZWZhdWx0IHRoaXMgd2lsbCBjaGFuZ2VcbiAgLy9kZXBlbmRpbmcgb24gd2hlcmUgdGhlIGFyYyBpcyByZWxhdGl2ZSB0byB0aGUgb3JpZ2luXG4gIC8vc3BlY2lmaWNhbGwgd2hldGhlciBpdCBsaWVzIG9uIHRoZSB4IGF4aXMsIG9yIGFib3ZlIG9yIGJlbG93IGl0XG4gIC8vdHlwZSA9ICdsaW5lJyBvciAnYXJjJ1xuICBhbHBoYU9mZnNldChwMSwgcDIsIGMsIHR5cGUpIHtcbiAgICBsZXQgb2Zmc2V0O1xuXG4gICAgLy9wb2ludHMgYXQgMCByYWRpYW5zIG9uIGdyZWF0Q2lyY2xlXG4gICAgbGV0IHAgPSB7XG4gICAgICB4OiBjLmNlbnRyZS54ICsgYy5yYWRpdXMsXG4gICAgICB5OiBjLmNlbnRyZS55XG4gICAgfVxuXG4gICAgaWYocDEueSA8IGMuY2VudHJlLnkpe1xuICAgICAgb2Zmc2V0ID0gMipNYXRoLlBJIC0gRS5jZW50cmFsQW5nbGUocDEsIHAsIGMucmFkaXVzKTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIG9mZnNldCA9IEUuY2VudHJhbEFuZ2xlKHAxLCBwLCBjLnJhZGl1cyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9mZnNldDtcbiAgfVxuXG4gIC8vcHV0IHBvaW50cyBpbiBjbG9ja3dpc2Ugb3JkZXJcbiAgcHJlcFBvaW50cyhwMSwgcDIsIGMpe1xuICAgIGNvbnN0IHAgPSB7eDogYy5jZW50cmUueCArIGMucmFkaXVzLCB5OiBjLmNlbnRyZS55fTtcbiAgICAvL2Nhc2Ugd2hlcmUgcG9pbnRzIGFyZSBhYm92ZSBhbmQgYmVsb3cgdGhlIGxpbmUgYy5jZW50cmUgLT4gcFxuICAgIC8vaW4gdGhpcyBjYXNlIGp1c3QgcmV0dXJuIHBvaW50c1xuICAgIGNvbnN0IG95ID0gYy5jZW50cmUueTtcbiAgICBjb25zdCBveCA9IGMuY2VudHJlLng7XG5cbiAgICBpZihwMS54ID4gb3ggJiYgcDIueCA+IG94KXtcbiAgICAgIGlmKHAxLnkgPiBveSAmJiBwMi55IDwgb3kpIHJldHVybiB7cDE6IHAyLCBwMjogcDF9O1xuICAgICAgZWxzZSBpZihwMS55IDwgb3kgJiYgcDIueSA+IG95KSByZXR1cm4ge3AxOiBwMSwgcDI6IHAyfTtcbiAgICB9XG5cbiAgICBsZXQgYWxwaGExID0gRS5jZW50cmFsQW5nbGUocCwgcDEsIGMucmFkaXVzKTtcbiAgICBhbHBoYTEgPSAocDEueSA8IGMuY2VudHJlLnkpID8gMipNYXRoLlBJIC0gYWxwaGExIDogYWxwaGExO1xuICAgIGxldCBhbHBoYTIgPSBFLmNlbnRyYWxBbmdsZShwLCBwMiwgYy5yYWRpdXMpO1xuICAgIGFscGhhMiA9IChwMi55IDwgYy5jZW50cmUueSkgPyAyKk1hdGguUEkgLSBhbHBoYTIgOiBhbHBoYTI7XG5cbiAgICAvL2lmIHRoZSBwb2ludHMgYXJlIG5vdCBpbiBjbG9ja3dpc2Ugb3JkZXIgZmxpcCB0aGVtXG4gICAgaWYoYWxwaGExID4gYWxwaGEyKSByZXR1cm4ge3AxOiBwMiwgcDI6IHAxfTtcbiAgICBlbHNlIHJldHVybiB7cDE6IHAxLCBwMjogcDJ9O1xuXG4gIH1cblxuICAvL0RyYXcgYW4gYXJjIChoeXBlcmJvbGljIGxpbmUgc2VnbWVudCkgYmV0d2VlbiB0d28gcG9pbnRzIG9uIHRoZSBkaXNrXG4gIGFyYyhwMSwgcDIsIGNvbG91cikge1xuICAgIGlmKEUudGhyb3VnaE9yaWdpbihwMSxwMikpe1xuICAgICAgdGhpcy5kcmF3LmV1Y2xpZGVhbkxpbmUocDEscDIsIGNvbG91cik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBjb2wgPSBjb2xvdXIgfHwgJ2JsYWNrJztcbiAgICBsZXQgYyA9IEUuZ3JlYXRDaXJjbGUocDEsIHAyLCB0aGlzLnJhZGl1cywgdGhpcy5jZW50cmUpO1xuICAgIGxldCBwdHMgPSB0aGlzLnByZXBQb2ludHMocDEsIHAyLCBjKTtcbiAgICBwMSA9IHB0cy5wMTtcbiAgICBwMiA9IHB0cy5wMjtcblxuICAgIC8vbGVuZ3RoIG9mIHRoZSBhcmNcbiAgICBsZXQgYWxwaGEgPSBFLmNlbnRyYWxBbmdsZShwMSwgcDIsIGMucmFkaXVzKTtcblxuICAgIC8vaG93IGZhciBhcm91bmQgdGhlIGdyZWF0Q2lyY2xlIHRvIHN0YXJ0IGRyYXdpbmcgdGhlIGFyY1xuICAgIGxldCBvZmZzZXQgPSB0aGlzLmFscGhhT2Zmc2V0KHAxLCBwMiwgYywgJ2FyYycpO1xuICAgIHRoaXMuZHJhdy5zZWdtZW50KGMsIGFscGhhLCBvZmZzZXQsIGNvbG91cik7XG4gIH1cblxuICBwb2x5Z29uKHZlcnRpY2VzLCBjb2xvdXIpIHtcbiAgICBsZXQgbCA9IHZlcnRpY2VzLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgdGhpcy5hcmModmVydGljZXNbaV0sIHZlcnRpY2VzWyhpICsgMSklbF0sIGNvbG91cik7XG4gICAgfVxuICB9XG5cbiAgLy9yZXR1cm4gdHJ1ZSBpZiB0aGUgcG9pbnQgaXMgbm90IGluIHRoZSBkaXNrXG4gIGNoZWNrUG9pbnQocG9pbnQpIHtcbiAgICBsZXQgciA9IHRoaXMucmFkaXVzO1xuICAgIGlmIChFLmRpc3RhbmNlKHBvaW50LCB0aGlzLmNlbnRyZSkgPiByKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciEgUG9pbnQgKCcgKyBwb2ludC54ICsgJywgJyArIHBvaW50LnkgKyAnKSBsaWVzIG91dHNpZGUgdGhlIHBsYW5lIScpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuIiwiLy8gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gKlxuLy8gKiAgIEVVQ0xJREVBTiBGVU5DVElPTlNcbi8vICogICBhbGwgRXVjbGlkZWFuIG1hdGhlbWF0aWNhbCBmdW5jdGlvbnMgZ28gaGVyZVxuLy8gKlxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4vL2Rpc3RhbmNlIGJldHdlZW4gdHdvIHBvaW50c1xuZXhwb3J0IGNvbnN0IGRpc3RhbmNlID0gKHAxLCBwMikgPT4gTWF0aC5zcXJ0KE1hdGgucG93KChwMi54IC0gcDEueCksIDIpICsgTWF0aC5wb3coKHAyLnkgLSBwMS55KSwgMikpO1xuXG4vL21pZHBvaW50IG9mIHRoZSBsaW5lIHNlZ21lbnQgY29ubmVjdGluZyB0d28gcG9pbnRzXG5leHBvcnQgY29uc3QgbWlkcG9pbnQgPSAocDEsIHAyKSA9PiB7XG4gIHJldHVybiB7XG4gICAgeDogKHAxLnggKyBwMi54KSAvIDIsXG4gICAgeTogKHAxLnkgKyBwMi55KSAvIDJcbiAgfVxufVxuXG4vL3Nsb3BlIG9mIGxpbmUgdGhyb3VnaCBwMSwgcDJcbmV4cG9ydCBjb25zdCBzbG9wZSA9IChwMSwgcDIpID0+IChwMi54IC0gcDEueCkgLyAocDIueSAtIHAxLnkpO1xuXG4vL3Nsb3BlIG9mIGxpbmUgcGVycGVuZGljdWxhciB0byBhIGxpbmUgZGVmaW5lZCBieSBwMSxwMlxuZXhwb3J0IGNvbnN0IHBlcnBlbmRpY3VsYXJTbG9wZSA9IChwMSwgcDIpID0+IC0xIC8gKE1hdGgucG93KHNsb3BlKHAxLCBwMiksIC0xKSk7XG5cbi8vaW50ZXJzZWN0aW9uIHBvaW50IG9mIHR3byBsaW5lcyBkZWZpbmVkIGJ5IHAxLG0xIGFuZCBxMSxtMlxuLy9OT1QgV09SS0lORyBGT1IgVkVSVElDQUwgTElORVMhISFcbmV4cG9ydCBjb25zdCBpbnRlcnNlY3Rpb24gPSAocDEsIG0xLCBwMiwgbTIpID0+IHtcbiAgbGV0IGMxLCBjMiwgeCwgeTtcbiAgLy9jYXNlIHdoZXJlIGZpcnN0IGxpbmUgaXMgdmVydGljYWxcbiAgLy9pZihtMSA+IDUwMDAgfHwgbTEgPCAtNTAwMCB8fCBtMSA9PT0gSW5maW5pdHkpe1xuICBpZihwMS55IDwgMC4wMDAwMDEgJiYgcDEueSA+IC0wLjAwMDAwMSApe1xuICAgIHggPSBwMS54O1xuICAgIHkgPSAobTIpKihwMS54LXAyLngpICsgcDIueTtcbiAgfVxuICAvL2Nhc2Ugd2hlcmUgc2Vjb25kIGxpbmUgaXMgdmVydGljYWxcbiAgLy9lbHNlIGlmKG0yID4gNTAwMCB8fCBtMiA8IC01MDAwIHx8IG0xID09PSBJbmZpbml0eSl7XG4gIGVsc2UgaWYocDIueSA8IDAuMDAwMDAxICYmIHAyLnkgPiAtMC4wMDAwMDEgKXtcbiAgICB4ID0gcDIueDtcbiAgICB5ID0gKG0xKihwMi54LXAxLngpKSArIHAxLnk7XG4gIH1cbiAgZWxzZXtcbiAgICAvL3kgaW50ZXJjZXB0IG9mIGZpcnN0IGxpbmVcbiAgICBjMSA9IHAxLnkgLSBtMSAqIHAxLng7XG4gICAgLy95IGludGVyY2VwdCBvZiBzZWNvbmQgbGluZVxuICAgIGMyID0gcDIueSAtIG0yICogcDIueDtcblxuICAgIHggPSAoYzIgLSBjMSkgLyAobTEgLSBtMik7XG4gICAgeSA9IG0xICogeCArIGMxO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB4OiB4LFxuICAgIHk6IHlcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgcmFkaWFucyA9IChkZWdyZWVzKSA9PiAoTWF0aC5QSSAvIDE4MCkgKiBkZWdyZWVzO1xuXG4vL2dldCB0aGUgY2lyY2xlIGludmVyc2Ugb2YgYSBwb2ludCBwIHdpdGggcmVzcGVjdCBhIGNpcmNsZSByYWRpdXMgciBjZW50cmUgY1xuZXhwb3J0IGNvbnN0IGludmVyc2UgPSAocCwgciwgYykgPT4ge1xuICBsZXQgYWxwaGEgPSAociAqIHIpIC8gKE1hdGgucG93KHAueCAtIGMueCwgMikgKyBNYXRoLnBvdyhwLnkgLSBjLnksIDIpKTtcbiAgcmV0dXJuIHtcbiAgICB4OiBhbHBoYSAqIChwLnggLSBjLngpICsgYy54LFxuICAgIHk6IGFscGhhICogKHAueSAtIGMueSkgKyBjLnlcbiAgfTtcbn1cblxuLy9jYWxjdWxhdGUgdGhlIHJhZGl1cyBhbmQgY2VudHJlIG9mIHRoZSBjaXJjbGUgcmVxdWlyZWQgdG8gZHJhdyBhIGxpbmUgYmV0d2VlblxuLy90d28gcG9pbnRzIGluIHRoZSBoeXBlcmJvbGljIHBsYW5lIGRlZmluZWQgYnkgdGhlIGRpc2sgKHIsIGMpXG5leHBvcnQgY29uc3QgZ3JlYXRDaXJjbGUgPSAocDEsIHAyLCByLCBjKSA9PiB7XG4gIGxldCBwMUludmVyc2UgPSBpbnZlcnNlKHAxLCByLCBjKTtcbiAgbGV0IHAySW52ZXJzZSA9IGludmVyc2UocDIsIHIsIGMpO1xuXG4gIGxldCBtID0gbWlkcG9pbnQocDEsIHAxSW52ZXJzZSk7XG4gIGxldCBuID0gbWlkcG9pbnQocDIsIHAySW52ZXJzZSk7XG5cbiAgbGV0IG0xID0gcGVycGVuZGljdWxhclNsb3BlKG0sIHAxSW52ZXJzZSk7XG4gIGxldCBtMiA9IHBlcnBlbmRpY3VsYXJTbG9wZShuLCBwMkludmVyc2UpO1xuXG5cbiAgLy9jZW50cmUgaXMgdGhlIGNlbnRyZXBvaW50IG9mIHRoZSBjaXJjbGUgb3V0IG9mIHdoaWNoIHRoZSBhcmMgaXMgbWFkZVxuICBsZXQgY2VudHJlID0gaW50ZXJzZWN0aW9uKG0sIG0xLCBuLCBtMik7XG4gIGxldCByYWRpdXMgPSBkaXN0YW5jZShjZW50cmUsIHAxKTtcbiAgcmV0dXJuIHtcbiAgICBjZW50cmU6IGNlbnRyZSxcbiAgICByYWRpdXM6IHJhZGl1c1xuICB9O1xufVxuXG4vL2FuIGF0dGVtcHQgYXQgY2FsY3VsYXRpbmcgdGhlIGNpcmNsZSBhbGdlYnJhaWNhbGx5XG5leHBvcnQgY29uc3QgZ3JlYXRDaXJjbGVWMiA9IChwMSxwMiwgcikgPT57XG4gIGxldCB4ID0gKHAyLnkqKHAxLngqcDEueCArIHIpKyBwMS55KnAxLnkqcDIueS1wMS55KihwMi54KnAyLngrIHAyLnkqcDIueSArIHIpKS8oMipwMS54KnAyLnkgLSBwMS55KnAyLngpO1xuICBsZXQgeSA9IChwMS54KnAxLngqcDIueCAtIHAxLngqKHAyLngqcDIueCtwMi55KnAyLnkrcikrcDIueCoocDEueSpwMS55K3IpKS8oMipwMS55KnAyLnggKyAyKnAxLngqcDIueSk7XG4gIGxldCByYWRpdXMgPSAgIE1hdGguc3FydCh4KngreSp5LXIpO1xuICByZXR1cm4ge1xuICAgIGNlbnRyZToge1xuICAgICAgeDogeCxcbiAgICAgIHk6IHlcbiAgICB9LFxuICAgIHJhZGl1czogcmFkaXVzXG4gIH1cbn1cblxuLy9pbnRlcnNlY3Rpb24gb2YgdHdvIGNpcmNsZXMgd2l0aCBlcXVhdGlvbnM6XG4vLyh4LWEpXjIgKyh5LWEpXjIgPSByMF4yXG4vLyh4LWIpXjIgKyh5LWMpXjIgPSByMV4yXG4vL05PVEUgYXNzdW1lcyB0aGUgdHdvIGNpcmNsZXMgRE8gaW50ZXJzZWN0IVxuZXhwb3J0IGNvbnN0IGNpcmNsZUludGVyc2VjdCA9IChjMCwgYzEsIHIwLCByMSkgPT4ge1xuICBsZXQgYSA9IGMwLng7XG4gIGxldCBiID0gYzAueTtcbiAgbGV0IGMgPSBjMS54O1xuICBsZXQgZCA9IGMxLnk7XG4gIGxldCBkaXN0ID0gTWF0aC5zcXJ0KChjIC0gYSkgKiAoYyAtIGEpICsgKGQgLSBiKSAqIChkIC0gYikpO1xuXG4gIGxldCBkZWwgPSBNYXRoLnNxcnQoKGRpc3QgKyByMCArIHIxKSAqIChkaXN0ICsgcjAgLSByMSkgKiAoZGlzdCAtIHIwICsgcjEpICogKC1kaXN0ICsgcjAgKyByMSkpIC8gNDtcblxuICBsZXQgeFBhcnRpYWwgPSAoYSArIGMpIC8gMiArICgoYyAtIGEpICogKHIwICogcjAgLSByMSAqIHIxKSkgLyAoMiAqIGRpc3QgKiBkaXN0KTtcbiAgbGV0IHgxID0geFBhcnRpYWwgLSAyICogZGVsICogKGIgLSBkKSAvIChkaXN0ICogZGlzdCk7XG4gIGxldCB4MiA9IHhQYXJ0aWFsICsgMiAqIGRlbCAqIChiIC0gZCkgLyAoZGlzdCAqIGRpc3QpO1xuXG4gIGxldCB5UGFydGlhbCA9IChiICsgZCkgLyAyICsgKChkIC0gYikgKiAocjAgKiByMCAtIHIxICogcjEpKSAvICgyICogZGlzdCAqIGRpc3QpO1xuICBsZXQgeTEgPSB5UGFydGlhbCArIDIgKiBkZWwgKiAoYSAtIGMpIC8gKGRpc3QgKiBkaXN0KTtcbiAgbGV0IHkyID0geVBhcnRpYWwgLSAyICogZGVsICogKGEgLSBjKSAvIChkaXN0ICogZGlzdCk7XG5cbiAgbGV0IHAxID0ge1xuICAgIHg6IHgxLFxuICAgIHk6IHkxXG4gIH1cblxuICBsZXQgcDIgPSB7XG4gICAgeDogeDIsXG4gICAgeTogeTJcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcDE6IHAxLFxuICAgIHAyOiBwMlxuICB9O1xufVxuXG5leHBvcnQgY29uc3QgY2lyY2xlTGluZUludGVyc2VjdCA9IChjLCByLCBwMSwgcDIpID0+IHtcblxuICBjb25zdCBkID0gZGlzdGFuY2UocDEsIHAyKTtcbiAgLy91bml0IHZlY3RvciBwMSBwMlxuICBjb25zdCBkeCA9IChwMi54IC0gcDEueCkvZDtcbiAgY29uc3QgZHkgPSAocDIueSAtIHAxLnkpL2Q7XG5cbiAgLy9wb2ludCBvbiBsaW5lIGNsb3Nlc3QgdG8gY2lyY2xlIGNlbnRyZVxuICBjb25zdCB0ID0gZHgqKGMueCAtcDEueCkgKyBkeSooYy55LXAxLnkpO1xuICBjb25zdCBwID0gIHt4OiB0KiBkeCArIHAxLngsIHk6IHQqIGR5ICsgcDEueX07XG5cbiAgLy9kaXN0YW5jZSBmcm9tIHRoaXMgcG9pbnQgdG8gY2VudHJlXG4gIGNvbnN0IGQyID0gZGlzdGFuY2UocCwgYyk7XG5cbiAgLy9saW5lIGludGVyc2VjdHMgY2lyY2xlXG4gIGlmKGQyIDwgcil7XG4gICAgY29uc3QgZHQgPSBNYXRoLnNxcnQoIHIqciAtIGQyKmQyKTtcbiAgICAvL3BvaW50IDFcbiAgICBjb25zdCBxMSA9IHtcbiAgICAgIHg6ICh0LWR0KSpkeCArIHAxLngsXG4gICAgICB5OiAodC1kdCkqZHkgKyBwMS55XG4gICAgfVxuICAgIC8vcG9pbnQgMlxuICAgIGNvbnN0IHEyID0ge1xuICAgICAgeDogKHQrZHQpKmR4ICsgcDEueCxcbiAgICAgIHk6ICh0K2R0KSpkeSArIHAxLnlcbiAgICB9XG5cbiAgICByZXR1cm4ge3AxOiBxMSwgcDI6IHEyfTtcbiAgfVxuICBlbHNlIGlmKCBkMiA9PT0gcil7XG4gICAgcmV0dXJuIHA7XG4gIH1cbiAgZWxzZXtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvcjogbGluZSBkb2VzIG5vdCBpbnRlcnNlY3QgY2lyY2xlIScpO1xuICB9XG59XG5cbi8vYW5nbGUgaW4gcmFkaWFucyBiZXR3ZWVuIHR3byBwb2ludHMgb24gY2lyY2xlIG9mIHJhZGl1cyByXG5leHBvcnQgY29uc3QgY2VudHJhbEFuZ2xlID0gKHAxLCBwMiwgcikgPT4ge1xuICByZXR1cm4gMiAqIE1hdGguYXNpbigwLjUgKiBkaXN0YW5jZShwMSwgcDIpIC8gcik7XG59XG5cbi8vY2FsY3VsYXRlIHRoZSBub3JtYWwgdmVjdG9yIGdpdmVuIDIgcG9pbnRzXG5leHBvcnQgY29uc3Qgbm9ybWFsVmVjdG9yID0gKHAxLCBwMikgPT4ge1xuICBsZXQgZCA9IE1hdGguc3FydChNYXRoLnBvdyhwMi54LXAxLngsMikgKyBNYXRoLnBvdyhwMi55LXAxLnksMikpO1xuICByZXR1cm4ge1xuICAgIHg6IChwMi54LXAxLngpL2QsXG4gICAgeTogKHAyLnktcDEueSkvZFxuICB9XG59XG5cbi8vZG9lcyB0aGUgbGluZSBjb25uZWN0aW5nIHAxLCBwMiBnbyB0aHJvdWdoIHRoZSBwb2ludCAoMCwwKT9cbmV4cG9ydCBjb25zdCB0aHJvdWdoT3JpZ2luID0gKHAxLCBwMikgPT4ge1xuICBpZihwMS54ID09PSAwICYmIHAyLnggPT09IDApe1xuICAgIC8vdmVydGljYWwgbGluZSB0aHJvdWdoIGNlbnRyZVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGxldCB0ZXN0ID0gKC1wMS54KnAyLnkgKyBwMS54KnAxLnkpLyhwMi54LXAxLngpICsgcDEueTtcbiAgaWYodGVzdCA9PT0gMCkgcmV0dXJuIHRydWU7XG4gIGVsc2UgcmV0dXJuIGZhbHNlO1xufVxuXG4vL2ZpbmQgdGhlIGNlbnRyb2lkIG9mIGEgbm9uLXNlbGYtaW50ZXJzZWN0aW5nIHBvbHlnb25cbmV4cG9ydCBjb25zdCBjZW50cm9pZE9mUG9seWdvbiA9IChwb2ludHMpID0+IHtcbiAgbGV0IGZpcnN0ID0gcG9pbnRzWzBdLCBsYXN0ID0gcG9pbnRzW3BvaW50cy5sZW5ndGgtMV07XG4gIGlmIChmaXJzdC54ICE9IGxhc3QueCB8fCBmaXJzdC55ICE9IGxhc3QueSkgcG9pbnRzLnB1c2goZmlyc3QpO1xuICBsZXQgdHdpY2VhcmVhPTAsXG4gICAgeD0wLCB5PTAsXG4gICAgblB0cyA9IHBvaW50cy5sZW5ndGgsXG4gICAgcDEsIHAyLCBmO1xuICBmb3IgKCB2YXIgaT0wLCBqPW5QdHMtMSA7IGk8blB0cyA7IGo9aSsrICkge1xuICAgIHAxID0gcG9pbnRzW2ldOyBwMiA9IHBvaW50c1tqXTtcbiAgICBmID0gcDEueCpwMi55IC0gcDIueCpwMS55O1xuICAgIHR3aWNlYXJlYSArPSBmO1xuICAgIHggKz0gKCBwMS54ICsgcDIueCApICogZjtcbiAgICB5ICs9ICggcDEueSArIHAyLnkgKSAqIGY7XG4gIH1cbiAgZiA9IHR3aWNlYXJlYSAqIDM7XG4gIHJldHVybiB7IHg6eC9mLCB5OnkvZiB9O1xufVxuXG4vL2NvbXBhcmUgdHdvIHBvaW50cyB0YWtpbmcgcm91bmRpbmcgZXJyb3JzIGludG8gYWNjb3VudFxuZXhwb3J0IGNvbnN0IGNvbXBhcmVQb2ludHMgPSAocDEsIHAyKSA9PiB7XG4gIGlmKHR5cGVvZiBwMSA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHAyID09PSAndW5kZWZpbmVkJyl7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcDEgPSBwb2ludFRvRml4ZWQocDEsIDYpO1xuICBwMiA9IHBvaW50VG9GaXhlZChwMiwgNik7XG4gIGlmKHAxLnggPT09IHAyLnggJiYgcDEueSA9PT0gcDIueSkgcmV0dXJuIHRydWU7XG4gIGVsc2UgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgY29uc3QgcG9pbnRUb0ZpeGVkID0gKHAsIHBsYWNlcykgPT4ge1xuICByZXR1cm4ge1xuICAgIHg6IHAueC50b0ZpeGVkKHBsYWNlcyksXG4gICAgeTogcC55LnRvRml4ZWQocGxhY2VzKVxuICB9O1xufVxuXG4vKlxuLy9mbGlwIGEgc2V0IG9mIHBvaW50cyBvdmVyIGEgaHlwZXJvYmxpYyBsaW5lIGRlZmluZWQgYnkgdHdvIHBvaW50c1xuZXhwb3J0IGNvbnN0IHRyYW5zZm9ybSA9IChwb2ludHNBcnJheSwgcDEsIHAyKSA9PiB7XG4gIGxldCBuZXdQb2ludHNBcnJheSA9IFtdO1xuICBsZXQgYyA9IEUuZ3JlYXRDaXJjbGUocDEsIHAyLCBkaXNrLnJhZGl1cywgZGlzay5jZW50cmUpO1xuXG4gIGZvcihsZXQgcCBvZiBwb2ludHNBcnJheSl7XG4gICAgbGV0IG5ld1AgPSBFLmludmVyc2UocCwgYy5yYWRpdXMsIGMuY2VudHJlKTtcbiAgICBuZXdQb2ludHNBcnJheS5wdXNoKG5ld1ApO1xuICB9XG4gIHJldHVybiBuZXdQb2ludHNBcnJheTtcbn1cbiovXG4iLCJpbXBvcnQgeyBSZWd1bGFyVGVzc2VsYXRpb24gfSBmcm9tICcuL3JlZ3VsYXJUZXNzZWxhdGlvbic7XG5pbXBvcnQgKiBhcyBFIGZyb20gJy4vZXVjbGlkJztcbmltcG9ydCB7IERpc2sgfSBmcm9tICcuL2Rpc2snO1xuXG5cbi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICpcbi8vICogICBTRVRVUFxuLy8gKlxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG5jb25zdCBkaXNrID0gbmV3IERpc2soJ3RocmVlanMnKTtcblxuLy9jb25zdCB0ZXNzZWxhdGlvbiA9IG5ldyBSZWd1bGFyVGVzc2VsYXRpb24oNSwgNCwgMypNYXRoLlBJLzYqMCwgJ3JlZCcpO1xuIiwiaW1wb3J0ICogYXMgRSBmcm9tICcuL2V1Y2xpZCc7XG5pbXBvcnQgeyBEaXNrIH0gZnJvbSAnLi9kaXNrJztcbi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICogICAgVEVTU0VMQVRJT04gQ0xBU1Ncbi8vICogICAgQ3JlYXRlcyBhIHJlZ3VsYXIgVGVzc2VsYXRpb24gb2YgdGhlIFBvaW5jYXJlIERpc2tcbi8vICogICAgcTogbnVtYmVyIG9mIHAtZ29ucyBtZWV0aW5nIGF0IGVhY2ggdmVydGV4XG4vLyAqICAgIHA6IG51bWJlciBvZiBzaWRlcyBvZiBwLWdvblxuLy8gKiAgICB1c2luZyB0aGUgdGVjaG5pcXVlcyBjcmVhdGVkIGJ5IENveGV0ZXIgYW5kIER1bmhhbVxuLy8gKlxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuZXhwb3J0IGNsYXNzIFJlZ3VsYXJUZXNzZWxhdGlvbiBleHRlbmRzIERpc2sge1xuICBjb25zdHJ1Y3RvcihwLCBxLCByb3RhdGlvbiwgY29sb3VyLCBtYXhMYXllcnMsIGRyYXdDbGFzcykge1xuICAgIHN1cGVyKGRyYXdDbGFzcyk7XG4gICAgdGhpcy5wID0gcDtcbiAgICB0aGlzLnEgPSBxO1xuICAgIHRoaXMuY29sb3VyID0gY29sb3VyIHx8ICdibGFjayc7XG4gICAgdGhpcy5yb3RhdGlvbiA9IHJvdGF0aW9uIHx8IDA7XG4gICAgdGhpcy5tYXhMYXllcnMgPSBtYXhMYXllcnMgfHwgNTtcblxuICAgIGlmKHRoaXMuY2hlY2tQYXJhbXMoKSl7IHJldHVybiBmYWxzZTt9XG5cbiAgICB0aGlzLmZyID0gdGhpcy5mdW5kYW1lbnRhbFJlZ2lvbigpO1xuXG4gICAgdGhpcy5hcmModGhpcy5mci5hLCB0aGlzLmZyLmIpO1xuICAgIHRoaXMuYXJjKHRoaXMuZnIuYSwgdGhpcy5mci5jKTtcbiAgICB0aGlzLmFyYyh0aGlzLmZyLmIsIHRoaXMuZnIuYyk7XG4gIH1cblxuICAvL2NhbGN1bGF0ZSBmaXJzdCBwb2ludCBvZiBmdW5kYW1lbnRhbCBwb2x5Z29uIHVzaW5nIENveGV0ZXIncyBtZXRob2RcbiAgZnVuZGFtZW50YWxSZWdpb24oKXtcbiAgICBjb25zdCBzID0gTWF0aC5zaW4oTWF0aC5QSS90aGlzLnApO1xuICAgIGNvbnN0IHQgPSBNYXRoLmNvcyhNYXRoLlBJL3RoaXMucSk7XG4gICAgLy9tdWx0aXBseSB0aGVzZSBieSB0aGUgZGlza3MgcmFkaXVzIChDb3hldGVyIHVzZWQgdW5pdCBkaXNrKTtcbiAgICBjb25zdCByID0gMS9NYXRoLnNxcnQoKHQqdCkvKHMqcykgLTEpKnRoaXMucmFkaXVzO1xuICAgIGNvbnN0IGQgPSAxL01hdGguc3FydCgxLSAocypzKS8odCp0KSkqdGhpcy5yYWRpdXM7XG4gICAgY29uc3QgYiA9IHtcbiAgICAgIHg6IHRoaXMucmFkaXVzKk1hdGguY29zKE1hdGguUEkvdGhpcy5wKSxcbiAgICAgIHk6IC10aGlzLnJhZGl1cypNYXRoLnNpbihNYXRoLlBJL3RoaXMucClcbiAgICB9XG5cbiAgICBjb25zdCBjZW50cmUgPSB7eDogZCwgeTogMH07XG5cbiAgICAvL3RoZXJlIHdpbGwgYmUgdHdvIHBvaW50cyBvZiBpbnRlcnNlY3Rpb24sIG9mIHdoaWNoIHdlIHdhbnQgdGhlIGZpcnN0XG4gICAgY29uc3QgcDEgPSBFLmNpcmNsZUxpbmVJbnRlcnNlY3QoY2VudHJlLCByLCB0aGlzLmNlbnRyZSwgYikucDE7XG5cbiAgICByZXR1cm4ge1xuICAgICAgYTogdGhpcy5jZW50cmUsXG4gICAgICBiOiBwMSxcbiAgICAgIGM6IHsgeDogZC1yLCB5OiAwfVxuICAgIH07XG4gIH1cblxuICAvL1RoZSB0ZXNzZWxhdGlvbiByZXF1aXJlcyB0aGF0IChwLTIpKHEtMikgPiA0IHRvIHdvcmsgKG90aGVyd2lzZSBpdCBpc1xuICAvLyBlaXRoZXIgYW4gZWxsaXB0aWNhbCBvciBldWNsaWRlYW4gdGVzc2VsYXRpb24pO1xuICBjaGVja1BhcmFtcygpe1xuICAgIGlmKHRoaXMubWF4TGF5ZXJzIDwgMCB8fCBpc05hTih0aGlzLm1heExheWVycykpe1xuICAgICAgY29uc29sZS5lcnJvcignbWF4TGF5ZXJzIG11c3QgYmUgZ3JlYXRlciB0aGFuIDAnKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBlbHNlIGlmKCh0aGlzLnAgLTIpKih0aGlzLnEtMikgPD0gNCl7XG4gICAgICBjb25zb2xlLmVycm9yKCdIeXBlcmJvbGljIHRlc3NlbGF0aW9ucyByZXF1aXJlIHRoYXQgKHAtMSkocS0yKSA8IDQhJyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLy9Gb3Igbm93IHJlcXVpcmUgcCxxID4gMyxcbiAgICAvL1RPRE8gaW1wbGVtZW50IHNwZWNpYWwgY2FzZXMgZm9yIHEgPSAzIG9yIHAgPSAzXG4gICAgZWxzZSBpZih0aGlzLnEgPD0gMyB8fCBpc05hTih0aGlzLnEpKXtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1Rlc3NlbGF0aW9uIGVycm9yOiBhdCBsZWFzdCAzIHAtZ29ucyBtdXN0IG1lZXQgXFxcbiAgICAgICAgICAgICAgICAgICAgYXQgZWFjaCB2ZXJ0ZXghJyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZSBpZih0aGlzLnAgPD0gM3x8IGlzTmFOKHRoaXMucCkpe1xuICAgICAgY29uc29sZS5lcnJvcignVGVzc2VsYXRpb24gZXJyb3I6IHBvbHlnb24gbmVlZHMgYXQgbGVhc3QgMyBzaWRlcyEnKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBlbHNlIHsgcmV0dXJuIGZhbHNlOyB9XG4gIH1cbn1cbiIsIi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICpcbi8vICogIFRIUkVFIEpTIENMQVNTXG4vLyAqXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5leHBvcnQgY2xhc3MgVGhyZWVKUyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZXZlbnQpID0+IHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJyk7XG4gICAgICB0aGlzLmluaXQoKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgLy90aGlzLmNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgIC8vdGhpcy5jYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuICAgICAgLy90aGlzLnJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG5cbiAgICAgIHRoaXMucmVzZXQoKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy5zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuICAgIHRoaXMuaW5pdENhbWVyYSgpO1xuXG4gICAgdGhpcy5pbml0TGlnaHRpbmcoKTtcblxuICAgIHRoaXMuYXhlcygpO1xuXG4gICAgdGhpcy5pbml0UmVuZGVyZXIoKTtcbiAgICAvL2NvbnNvbGUubG9nKHRoaXMuc2NlbmUpO1xuICB9XG5cbiAgcmVzZXQoKXtcbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLmlkKTsvLyBTdG9wIHRoZSBhbmltYXRpb25cbiAgICB0aGlzLnJlbmRlcmVyLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZGJsY2xpY2snLCBudWxsLCBmYWxzZSk7IC8vcmVtb3ZlIGxpc3RlbmVyIHRvIHJlbmRlclxuICAgIHRoaXMuc2NlbmUgPSBudWxsO1xuICAgIHRoaXMucHJvamVjdG9yID0gbnVsbDtcbiAgICB0aGlzLmNhbWVyYSA9IG51bGw7XG4gICAgdGhpcy5jb250cm9scyA9IG51bGw7XG5cbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2NhbnZhcycpO1xuICAgIGZvciAobGV0IGluZGV4ID0gZWxlbWVudC5sZW5ndGggLSAxOyBpbmRleCA+PSAwOyBpbmRleC0tKSB7XG4gICAgICBlbGVtZW50W2luZGV4XS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnRbaW5kZXhdKTtcbiAgICB9XG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBpbml0Q2FtZXJhKCkge1xuICAgIHRoaXMuY2FtZXJhID0gbmV3IFRIUkVFLk9ydGhvZ3JhcGhpY0NhbWVyYSh3aW5kb3cuaW5uZXJXaWR0aCAvIC0gMixcbiAgICAgIHdpbmRvdy5pbm5lcldpZHRoIC8gMiwgd2luZG93LmlubmVySGVpZ2h0IC8gMiwgd2luZG93LmlubmVySGVpZ2h0IC8gLSAyLFxuICAgICAgLTEsIDEpO1xuICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMuY2FtZXJhKTtcbiAgICB0aGlzLmNhbWVyYS5wb3NpdGlvbi54ID0gMDtcbiAgICB0aGlzLmNhbWVyYS5wb3NpdGlvbi55ID0gMDtcblxuICAgIHRoaXMuY2FtZXJhLnBvc2l0aW9uLnogPSAxO1xuICB9XG5cbiAgaW5pdExpZ2h0aW5nKCkge1xuICAgIC8vY29uc3Qgc3BvdExpZ2h0ID0gbmV3IFRIUkVFLlNwb3RMaWdodCgweGZmZmZmZik7XG4gICAgLy9zcG90TGlnaHQucG9zaXRpb24uc2V0KDAsIDAsIDEwMCk7XG4gICAgLy90aGlzLnNjZW5lLmFkZChzcG90TGlnaHQpO1xuICAgIGNvbnN0IGFtYmllbnRMaWdodCA9IG5ldyBUSFJFRS5BbWJpZW50TGlnaHQoMHhmZmZmZmYpO1xuICAgIHRoaXMuc2NlbmUuYWRkKGFtYmllbnRMaWdodCk7XG4gIH1cblxuICBpbml0UmVuZGVyZXIoKSB7XG4gICAgdGhpcy5yZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKCk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRDbGVhckNvbG9yKDB4ZmZmZmZmLCAxLjApO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMucmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgLy9iZWhpbmQ6IHRydWUvZmFsc2VcbiAgZGlzayhjZW50cmUsIHJhZGl1cywgY29sb3IsIGJlaGluZCl7XG4gICAgbGV0IGNvbCA9IGNvbG9yO1xuICAgIGlmKCBjb2wgPT09ICd1bmRlZmluZWQnKSBjb2wgPSAweGZmZmZmZjtcblxuICAgIGNvbnN0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkNpcmNsZUdlb21ldHJ5KHJhZGl1cywgMTAwLCAwLCAyKk1hdGguUEkpO1xuICAgIGNvbnN0IGNpcmNsZSA9IHRoaXMuY3JlYXRlTWVzaChnZW9tZXRyeSwgY29sKTtcbiAgICBjaXJjbGUucG9zaXRpb24ueCA9IGNlbnRyZS54O1xuICAgIGNpcmNsZS5wb3NpdGlvbi55ID0gY2VudHJlLnk7XG4gICAgaWYoIWJlaGluZCl7XG4gICAgICBjaXJjbGUucG9zaXRpb24ueiA9IDE7XG4gICAgfVxuXG4gICAgdGhpcy5zY2VuZS5hZGQoY2lyY2xlKTtcbiAgfVxuXG4gIGNyZWF0ZU1lc2goZ2VvbWV0cnksIGNvbG9yLCBpbWFnZVVSTCkge1xuICAgIGxldCBjb2wgPSBjb2xvcjtcbiAgICBpZiggY29sID09PSAndW5kZWZpbmVkJykgY29sID0gMHhmZmZmZmY7XG4gICAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBjb2xvcjogY29sIH0pO1xuXG4gICAgaWYoaW1hZ2VVUkwpe1xuICAgICAgY29uc3QgdGV4dHVyZUxvYWRlciA9IG5ldyBUSFJFRS5UZXh0dXJlTG9hZGVyKCk7XG5cbiAgICAgIC8vbG9hZCB0ZXh0dXJlIGFuZCBhcHBseSB0byBtYXRlcmlhbCBpbiBjYWxsYmFja1xuICAgICAgY29uc3QgdGV4dHVyZSA9IHRleHR1cmVMb2FkZXIubG9hZChpbWFnZVVSTCwgKHRleCkgPT4ge30pO1xuICAgICAgdGV4dHVyZS5yZXBlYXQuc2V0KDAuMDUsMC4wNSk7XG4gICAgICBtYXRlcmlhbC5tYXAgPSB0ZXh0dXJlO1xuICAgICAgbWF0ZXJpYWwubWFwLndyYXBUID0gVEhSRUUuUmVwZWF0V3JhcHBpbmc7XG4gICAgICBtYXRlcmlhbC5tYXAud3JhcFMgPSBUSFJFRS5SZXBlYXRXcmFwcGluZztcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgfVxuXG4gIHNoYXBlKCkge1xuICAgIC8vIGNyZWF0ZSBhIGJhc2ljIHNoYXBlXG4gICAgdmFyIHNoYXBlID0gbmV3IFRIUkVFLlNoYXBlKCk7XG5cbiAgICAvLyBzdGFydHBvaW50XG4gICAgc2hhcGUubW92ZVRvKDAsIDApO1xuXG4gICAgLy8gc3RyYWlnaHQgbGluZSB1cHdhcmRzXG4gICAgc2hhcGUubGluZVRvKDAsIDUwKTtcblxuICAgIC8vIHRoZSB0b3Agb2YgdGhlIGZpZ3VyZSwgY3VydmUgdG8gdGhlIHJpZ2h0XG4gICAgc2hhcGUucXVhZHJhdGljQ3VydmVUbygxNSwgMjUsIDI1LCAzMCk7XG5cbiAgICBzaGFwZS5saW5lVG8oMCwgMCk7XG5cbiAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5TaGFwZUdlb21ldHJ5KHNoYXBlKTtcbiAgICB0aGlzLmN1cnZlID0gdGhpcy5jcmVhdGVNZXNoKGdlb21ldHJ5LCAnLi9pbWFnZXMvdGV4dHVyZXMvdGVzdC5qcGcnKTtcbiAgICB0aGlzLmN1cnZlLnBvc2l0aW9uLnkgPSAtMzA7XG4gICAgdGhpcy5jdXJ2ZS5wb3NpdGlvbi56ID0gLTQwO1xuICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMuY3VydmUpO1xuICB9XG5cbiAgYXhlcygpIHtcbiAgICBjb25zdCB4eXogPSBuZXcgVEhSRUUuQXhpc0hlbHBlcigyMCk7XG4gICAgdGhpcy5zY2VuZS5hZGQoeHl6KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgdGhpcy5yZW5kZXIoKVxuICAgIH0pO1xuICAgIC8vdGhpcy5jaXJjbGUucm90YXRpb24ueCArPSAwLjAyO1xuICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUsIHRoaXMuY2FtZXJhKTtcbiAgfVxuXG59XG4iXX0=
