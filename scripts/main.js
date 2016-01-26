(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// * ***********************************************************************
// *
// *  CANVAS CLASS
// *
// *************************************************************************

var Canvas = function () {
  function Canvas() {
    _classCallCheck(this, Canvas);

    this.canvas = document.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');

    //fullscreen
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    //transform the canvas so the origin is at the centre of the disk
    this.ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
  }

  //draw a hyperbolic line segment using calculations from line() or arc()

  _createClass(Canvas, [{
    key: 'segment',
    value: function segment(c, alpha, alphaOffset, colour, width) {
      this.ctx.beginPath();
      this.ctx.arc(c.centre.x, c.centre.y, c.radius, alphaOffset, alpha + alphaOffset);
      this.ctx.strokeStyle = colour || 'black';
      this.ctx.lineWidth = width || 1;
      this.ctx.stroke();
    }

    //draw a (euclidean) line between two points

  }, {
    key: 'euclideanLine',
    value: function euclideanLine(p1, p2, colour, width) {
      var c = colour || 'black';
      this.ctx.beginPath();
      this.ctx.moveTo(p1.x, p1.y);
      this.ctx.lineTo(p2.x, p2.y);
      this.ctx.strokeStyle = c;
      this.ctx.lineWidth = width || 1;
      this.ctx.stroke();
    }

    //draw a point on the disk, optional radius and colour

  }, {
    key: 'point',
    value: function point(_point, radius, colour) {
      var col = colour || 'black';
      var r = radius || 2;
      this.ctx.beginPath();
      this.ctx.arc(_point.x, _point.y, r, 0, Math.PI * 2, true);
      this.ctx.fillStyle = col;
      this.ctx.fill();
    }

    //draw a circle of radius r centre c and optional colour

  }, {
    key: 'circle',
    value: function circle(c, r, colour, width) {
      var col = colour || 'black';
      this.ctx.beginPath();
      this.ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
      this.ctx.strokeStyle = col;
      this.ctx.lineWidth = width || 1;
      this.ctx.stroke();
    }

    //convert the canvas to a base64URL and send to saveImage.php

  }, {
    key: 'saveImage',
    value: function saveImage() {
      var data = this.canvas.toDataURL();
      $.ajax({
        type: 'POST',
        url: 'saveImage.php',
        data: { img: data }
      });
    }

    //the canvas has been translated to the centre of the disk so need to
    //use an offset to clear it. NOT WORKING WHEN SCREEN IS RESIZED

  }, {
    key: 'clearScreen',
    value: function clearScreen() {
      this.ctx.clearRect(-window.innerWidth / 2, -window.innerHeight / 2, window.innerWidth, window.innerHeight);
    }
  }]);

  return Canvas;
}();

exports.Canvas = Canvas;

},{}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Disk = undefined;

var _euclid = require('./euclid');

var E = _interopRequireWildcard(_euclid);

var _canvas = require('./canvas');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// * ***********************************************************************
// *
// *   DISK CLASS
// *   Poincare Disk representation of the hyperbolic plane
// *   Contains any functions used to draw to the disk
// *   Constructor takes the drawing class as an argument
// *   (Currently only Canvas used, might switch to WebGL in future)
// *************************************************************************

var Disk = exports.Disk = function () {
  function Disk(drawClass) {
    _classCallCheck(this, Disk);

    drawClass = drawClass || 'canvas';
    if (drawClass === 'canvas') {
      this.draw = new _canvas.Canvas();
    }
    this.draw.clearScreen();

    this.centre = {
      x: 0,
      y: 0
    };

    //draw largest circle possible given window dims
    this.radius = window.innerWidth < window.innerHeight ? window.innerWidth / 2 - 5 : window.innerHeight / 2 - 5;

    //smaller circle for testing
    // /this.radius = this.radius / 3;

    this.outerCircle();
  }

  //draw the boundary circle

  _createClass(Disk, [{
    key: 'outerCircle',
    value: function outerCircle() {
      this.draw.circle({ x: this.centre.x, y: this.centre.y }, this.radius);
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

},{"./canvas":1,"./euclid":3}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
'use strict';

var _regularTesselation = require('./regularTesselation');

var _threejs = require('./threejs');

// * ***********************************************************************
// *
// *   SETUP
// *
// *************************************************************************

var three = new _threejs.ThreeJS();
//const tesselation = new RegularTesselation(5, 4, 3*Math.PI/6*0, 'red');

},{"./regularTesselation":5,"./threejs":6}],5:[function(require,module,exports){
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

},{"./disk":2,"./euclid":3}],6:[function(require,module,exports){
"use strict";

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
    _classCallCheck(this, ThreeJS);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.geometry = new THREE.BoxGeometry(1, 1, 1);
    this.material = new THREE.MeshBasicMaterial({
      color: 0x00ff00
    });
    this.cube = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.cube);

    this.camera.position.z = 5;

    this.render();
  }

  _createClass(ThreeJS, [{
    key: "render",
    value: function render() {
      var _this = this;

      requestAnimationFrame(function () {
        _this.render();
      });

      this.cube.rotation.x += 0.01;
      this.cube.rotation.y += 0.01;

      this.renderer.render(this.scene, this.camera);
    }
  }]);

  return ThreeJS;
}();

},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJlczIwMTUvY2FudmFzLmpzIiwiZXMyMDE1L2Rpc2suanMiLCJlczIwMTUvZXVjbGlkLmpzIiwiZXMyMDE1L21haW4uanMiLCJlczIwMTUvcmVndWxhclRlc3NlbGF0aW9uLmpzIiwiZXMyMDE1L3RocmVlanMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDS2EsTUFBTTtBQUNqQixXQURXLE1BQU0sR0FDSjswQkFERixNQUFNOztBQUVmLFFBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQyxRQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQzs7O0FBQUMsQUFHeEMsUUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztBQUN0QyxRQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVzs7O0FBQUMsQUFHeEMsUUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQztHQUVuRTs7O0FBQUE7ZUFaVSxNQUFNOzs0QkFnQlQsQ0FBQyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBQztBQUMzQyxVQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ3JCLFVBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLEtBQUssR0FBRyxXQUFXLENBQUMsQ0FBQztBQUNq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QUFDLEdBQUMsRUFBRSxDQUFDLENBQUMsR0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUUsRUFBRSxDQUFDLENBQUMsR0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxDQUFBLElBQUcsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUEsQUFBQyxDQUFDO0FBQ3pHLE1BQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUMsRUFBRSxDQUFDLENBQUMsR0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQSxBQUFDLEdBQUMsRUFBRSxDQUFDLENBQUMsSUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBQSxJQUFHLENBQUMsR0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQSxBQUFDLENBQUM7QUFDdkcsTUFBSSxNQUFNLEdBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEMsU0FBTztBQUNMLFVBQU0sRUFBRTtBQUNOLE9BQUMsRUFBRSxDQUFDO0FBQ0osT0FBQyxFQUFFLENBQUM7S0FDTDtBQUNELFVBQU0sRUFBRSxNQUFNO0dBQ2YsQ0FBQTtDQUNGOzs7Ozs7QUFBQSxBQU1NLElBQU0sZUFBZSxXQUFmLGVBQWUsR0FBRyxTQUFsQixlQUFlLENBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFLO0FBQ2pELE1BQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDYixNQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2IsTUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNiLE1BQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDYixNQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxJQUFLLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxJQUFLLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxDQUFDLENBQUM7O0FBRTVELE1BQUksR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQSxJQUFLLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFBLEFBQUMsSUFBSSxJQUFJLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQSxBQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQSxBQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRXBHLE1BQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxHQUFJLENBQUMsR0FBRyxBQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxJQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQSxBQUFDLElBQUssQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUEsQUFBQyxDQUFDO0FBQ2pGLE1BQUksRUFBRSxHQUFHLFFBQVEsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUEsQUFBQyxDQUFDO0FBQ3RELE1BQUksRUFBRSxHQUFHLFFBQVEsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUEsQUFBQyxDQUFDOztBQUV0RCxNQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsR0FBSSxDQUFDLEdBQUcsQUFBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsSUFBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUEsQUFBQyxJQUFLLENBQUMsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFBLEFBQUMsQ0FBQztBQUNqRixNQUFJLEVBQUUsR0FBRyxRQUFRLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFBLEFBQUMsQ0FBQztBQUN0RCxNQUFJLEVBQUUsR0FBRyxRQUFRLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFBLEFBQUMsQ0FBQzs7QUFFdEQsTUFBSSxFQUFFLEdBQUc7QUFDUCxLQUFDLEVBQUUsRUFBRTtBQUNMLEtBQUMsRUFBRSxFQUFFO0dBQ04sQ0FBQTs7QUFFRCxNQUFJLEVBQUUsR0FBRztBQUNQLEtBQUMsRUFBRSxFQUFFO0FBQ0wsS0FBQyxFQUFFLEVBQUU7R0FDTixDQUFBOztBQUVELFNBQU87QUFDTCxNQUFFLEVBQUUsRUFBRTtBQUNOLE1BQUUsRUFBRSxFQUFFO0dBQ1AsQ0FBQztDQUNILENBQUE7O0FBRU0sSUFBTSxtQkFBbUIsV0FBbkIsbUJBQW1CLEdBQUcsU0FBdEIsbUJBQW1CLENBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFLOztBQUVuRCxNQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQzs7QUFBQyxBQUUzQixNQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQSxHQUFFLENBQUMsQ0FBQztBQUMzQixNQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQSxHQUFFLENBQUM7OztBQUFDLEFBRzNCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUEsQUFBQyxHQUFHLEVBQUUsSUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUEsQUFBQyxDQUFDO0FBQ3pDLE1BQU0sQ0FBQyxHQUFJLEVBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFDOzs7QUFBQyxBQUc5QyxNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQzs7O0FBQUMsQUFHMUIsTUFBRyxFQUFFLEdBQUcsQ0FBQyxFQUFDO0FBQ1IsUUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBRSxDQUFDLEdBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBQyxFQUFFLENBQUM7O0FBQUMsQUFFbkMsUUFBTSxFQUFFLEdBQUc7QUFDVCxPQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUMsRUFBRSxDQUFBLEdBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ25CLE9BQUMsRUFBRSxDQUFDLENBQUMsR0FBQyxFQUFFLENBQUEsR0FBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7S0FDcEI7O0FBQUEsQUFFRCxRQUFNLEVBQUUsR0FBRztBQUNULE9BQUMsRUFBRSxDQUFDLENBQUMsR0FBQyxFQUFFLENBQUEsR0FBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDbkIsT0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQSxHQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztLQUNwQixDQUFBOztBQUVELFdBQU8sRUFBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUMsQ0FBQztHQUN6QixNQUNJLElBQUksRUFBRSxLQUFLLENBQUMsRUFBQztBQUNoQixXQUFPLENBQUMsQ0FBQztHQUNWLE1BQ0c7QUFDRixXQUFPLENBQUMsS0FBSyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7R0FDekQ7Q0FDRjs7O0FBQUEsQUFHTSxJQUFNLFlBQVksV0FBWixZQUFZLEdBQUcsU0FBZixZQUFZLENBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUs7QUFDekMsU0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztDQUNsRDs7O0FBQUEsQUFHTSxJQUFNLFlBQVksV0FBWixZQUFZLEdBQUcsU0FBZixZQUFZLENBQUksRUFBRSxFQUFFLEVBQUUsRUFBSztBQUN0QyxNQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDakUsU0FBTztBQUNMLEtBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQSxHQUFFLENBQUM7QUFDaEIsS0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBLEdBQUUsQ0FBQztHQUNqQixDQUFBO0NBQ0Y7OztBQUFBLEFBR00sSUFBTSxhQUFhLFdBQWIsYUFBYSxHQUFHLFNBQWhCLGFBQWEsQ0FBSSxFQUFFLEVBQUUsRUFBRSxFQUFLO0FBQ3ZDLE1BQUcsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUM7O0FBRTFCLFdBQU8sSUFBSSxDQUFDO0dBQ2I7QUFDRCxNQUFJLElBQUksR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQSxJQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQSxBQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN2RCxNQUFHLElBQUksS0FBSyxDQUFDLEVBQUUsT0FBTyxJQUFJLENBQUMsS0FDdEIsT0FBTyxLQUFLLENBQUM7Q0FDbkI7OztBQUFBLEFBR00sSUFBTSxpQkFBaUIsV0FBakIsaUJBQWlCLEdBQUcsU0FBcEIsaUJBQWlCLENBQUksTUFBTSxFQUFLO0FBQzNDLE1BQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7TUFBRSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEQsTUFBSSxLQUFLLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDL0QsTUFBSSxTQUFTLEdBQUMsQ0FBQztNQUNiLENBQUMsR0FBQyxDQUFDO01BQUUsQ0FBQyxHQUFDLENBQUM7TUFDUixJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU07TUFDcEIsRUFBRSxZQUFBO01BQUUsRUFBRSxZQUFBO01BQUUsQ0FBQyxZQUFBLENBQUM7QUFDWixPQUFNLElBQUksQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEdBQUMsSUFBSSxHQUFDLENBQUMsRUFBRyxDQUFDLEdBQUMsSUFBSSxFQUFHLENBQUMsR0FBQyxDQUFDLEVBQUUsRUFBRztBQUN6QyxNQUFFLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEFBQUMsRUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixLQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMxQixhQUFTLElBQUksQ0FBQyxDQUFDO0FBQ2YsS0FBQyxJQUFJLENBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFBLEdBQUssQ0FBQyxDQUFDO0FBQ3pCLEtBQUMsSUFBSSxDQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQSxHQUFLLENBQUMsQ0FBQztHQUMxQjtBQUNELEdBQUMsR0FBRyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLFNBQU8sRUFBRSxDQUFDLEVBQUMsQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDO0NBQ3pCOzs7QUFBQSxBQUdNLElBQU0sYUFBYSxXQUFiLGFBQWEsR0FBRyxTQUFoQixhQUFhLENBQUksRUFBRSxFQUFFLEVBQUUsRUFBSztBQUN2QyxNQUFHLE9BQU8sRUFBRSxLQUFLLFdBQVcsSUFBSSxPQUFPLEVBQUUsS0FBSyxXQUFXLEVBQUM7QUFDeEQsV0FBTyxJQUFJLENBQUM7R0FDYjtBQUNELElBQUUsR0FBRyxZQUFZLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3pCLElBQUUsR0FBRyxZQUFZLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ3pCLE1BQUcsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsRUFBRSxPQUFPLElBQUksQ0FBQyxLQUMxQyxPQUFPLEtBQUssQ0FBQztDQUNuQixDQUFBOztBQUVNLElBQU0sWUFBWSxXQUFaLFlBQVksR0FBRyxTQUFmLFlBQVksQ0FBSSxDQUFDLEVBQUUsTUFBTSxFQUFLO0FBQ3pDLFNBQU87QUFDTCxLQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO0FBQ3RCLEtBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7R0FDdkIsQ0FBQztDQUNIOzs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7QUNyT0QsSUFBTSxLQUFLLEdBQUcsYUFQTCxPQUFPLEVBT1c7O0FBQUM7Ozs7Ozs7Ozs7Ozs7SUNUaEIsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBVUEsa0JBQWtCLFdBQWxCLGtCQUFrQjtZQUFsQixrQkFBa0I7O0FBQzdCLFdBRFcsa0JBQWtCLENBQ2pCLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFOzBCQUQvQyxrQkFBa0I7O3VFQUFsQixrQkFBa0IsYUFFckIsU0FBUzs7QUFDZixVQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDWCxVQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDWCxVQUFLLE1BQU0sR0FBRyxNQUFNLElBQUksT0FBTyxDQUFDO0FBQ2hDLFVBQUssUUFBUSxHQUFHLFFBQVEsSUFBSSxDQUFDLENBQUM7QUFDOUIsVUFBSyxTQUFTLEdBQUcsU0FBUyxJQUFJLENBQUMsQ0FBQzs7QUFFaEMsUUFBRyxNQUFLLFdBQVcsRUFBRSxFQUFDOzs7QUFBRSxvQkFBTyxLQUFLLDBDQUFDO0tBQUM7O0FBRXRDLFVBQUssRUFBRSxHQUFHLE1BQUssaUJBQWlCLEVBQUUsQ0FBQzs7QUFFbkMsVUFBSyxHQUFHLENBQUMsTUFBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLE1BQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFVBQUssR0FBRyxDQUFDLE1BQUssRUFBRSxDQUFDLENBQUMsRUFBRSxNQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixVQUFLLEdBQUcsQ0FBQyxNQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsTUFBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7O0dBQ2hDOzs7QUFBQTtlQWhCVSxrQkFBa0I7O3dDQW1CVjtBQUNqQixVQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ25DLFVBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOztBQUFDLEFBRW5DLFVBQU0sQ0FBQyxHQUFHLENBQUMsR0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEFBQUMsQ0FBQyxHQUFDLENBQUMsSUFBRyxDQUFDLEdBQUMsQ0FBQyxDQUFBLEFBQUMsR0FBRSxDQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQ2xELFVBQU0sQ0FBQyxHQUFHLENBQUMsR0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRSxBQUFDLENBQUMsR0FBQyxDQUFDLElBQUcsQ0FBQyxHQUFDLENBQUMsQ0FBQSxBQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQ2xELFVBQU0sQ0FBQyxHQUFHO0FBQ1IsU0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDdkMsU0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztPQUN6QyxDQUFBOztBQUVELFVBQU0sTUFBTSxHQUFHLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDOzs7QUFBQyxBQUc1QixVQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsbUJBQW1CLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQzs7QUFFL0QsYUFBTztBQUNMLFNBQUMsRUFBRSxJQUFJLENBQUMsTUFBTTtBQUNkLFNBQUMsRUFBRSxFQUFFO0FBQ0wsU0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQztPQUNuQixDQUFDO0tBQ0g7Ozs7Ozs7a0NBSVk7QUFDWCxVQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUM7QUFDN0MsZUFBTyxDQUFDLEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO0FBQ2xELGVBQU8sSUFBSSxDQUFDO09BQ2IsTUFDSSxJQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRSxDQUFDLENBQUEsSUFBRyxJQUFJLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQSxBQUFDLElBQUksQ0FBQyxFQUFDO0FBQ2xDLGVBQU8sQ0FBQyxLQUFLLENBQUMsc0RBQXNELENBQUMsQ0FBQztBQUN0RSxlQUFPLElBQUksQ0FBQzs7OztBQUNiLFdBR0ksSUFBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDO0FBQ25DLGlCQUFPLENBQUMsS0FBSyxDQUFDO29DQUNnQixDQUFDLENBQUM7QUFDaEMsaUJBQU8sSUFBSSxDQUFDO1NBQ2IsTUFDSSxJQUFHLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUM7QUFDbEMsaUJBQU8sQ0FBQyxLQUFLLENBQUMsb0RBQW9ELENBQUMsQ0FBQztBQUNwRSxpQkFBTyxJQUFJLENBQUM7U0FDYixNQUNJO0FBQUUsaUJBQU8sS0FBSyxDQUFDO1NBQUU7S0FDdkI7OztTQWpFVSxrQkFBa0I7UUFUdEIsSUFBSTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQ0lBLE9BQU8sV0FBUCxPQUFPO0FBQ2xCLFdBRFcsT0FBTyxHQUNKOzBCQURILE9BQU87O0FBRWhCLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDL0IsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLEVBQzFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7O0FBRXJELFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUM7QUFDMUMsUUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDN0QsWUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQzs7QUFFcEQsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMvQyxRQUFJLENBQUMsUUFBUSxHQUFHLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDO0FBQzFDLFdBQUssRUFBRSxRQUFRO0tBQ2hCLENBQUMsQ0FBQztBQUNILFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3pELFFBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFMUIsUUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFM0IsUUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0dBQ2Y7O2VBcEJVLE9BQU87OzZCQXNCVDs7O0FBQ1AsMkJBQXFCLENBQUUsWUFBTTtBQUFFLGNBQUssTUFBTSxFQUFFLENBQUE7T0FBRSxDQUFFLENBQUM7O0FBRWpELFVBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUM7QUFDN0IsVUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQzs7QUFFN0IsVUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDL0M7OztTQTdCVSxPQUFPIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICpcbi8vICogIENBTlZBUyBDTEFTU1xuLy8gKlxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuZXhwb3J0IGNsYXNzIENhbnZhc3tcbiAgY29uc3RydWN0b3IoKXtcbiAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2NhbnZhcycpO1xuICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgIC8vZnVsbHNjcmVlblxuICAgIHRoaXMuY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG4gICAgLy90cmFuc2Zvcm0gdGhlIGNhbnZhcyBzbyB0aGUgb3JpZ2luIGlzIGF0IHRoZSBjZW50cmUgb2YgdGhlIGRpc2tcbiAgICB0aGlzLmN0eC50cmFuc2xhdGUod2luZG93LmlubmVyV2lkdGggLyAyLCB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKTtcblxuICB9XG5cblxuICAvL2RyYXcgYSBoeXBlcmJvbGljIGxpbmUgc2VnbWVudCB1c2luZyBjYWxjdWxhdGlvbnMgZnJvbSBsaW5lKCkgb3IgYXJjKClcbiAgc2VnbWVudChjLCBhbHBoYSwgYWxwaGFPZmZzZXQsIGNvbG91ciwgd2lkdGgpe1xuICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgIHRoaXMuY3R4LmFyYyhjLmNlbnRyZS54LCBjLmNlbnRyZS55LCBjLnJhZGl1cywgYWxwaGFPZmZzZXQsIGFscGhhICsgYWxwaGFPZmZzZXQpO1xuICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gY29sb3VyIHx8ICdibGFjayc7XG4gICAgdGhpcy5jdHgubGluZVdpZHRoID0gd2lkdGggfHwgMTtcbiAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgfVxuXG4gIC8vZHJhdyBhIChldWNsaWRlYW4pIGxpbmUgYmV0d2VlbiB0d28gcG9pbnRzXG4gIGV1Y2xpZGVhbkxpbmUocDEsIHAyLCBjb2xvdXIsIHdpZHRoKXtcbiAgICBjb25zdCBjID0gY29sb3VyIHx8ICdibGFjayc7XG4gICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgdGhpcy5jdHgubW92ZVRvKHAxLngsIHAxLnkpO1xuICAgIHRoaXMuY3R4LmxpbmVUbyhwMi54LCBwMi55KTtcbiAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IGM7XG4gICAgdGhpcy5jdHgubGluZVdpZHRoID0gd2lkdGggfHwgMTtcbiAgICB0aGlzLmN0eC5zdHJva2UoKVxuICB9XG5cbiAgLy9kcmF3IGEgcG9pbnQgb24gdGhlIGRpc2ssIG9wdGlvbmFsIHJhZGl1cyBhbmQgY29sb3VyXG4gIHBvaW50KHBvaW50LCByYWRpdXMsIGNvbG91cil7XG4gICAgY29uc3QgY29sID0gY29sb3VyIHx8ICdibGFjayc7XG4gICAgY29uc3QgciA9IHJhZGl1cyB8fCAyO1xuICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgIHRoaXMuY3R4LmFyYyhwb2ludC54LCBwb2ludC55LCByLCAwLCBNYXRoLlBJICogMiwgdHJ1ZSk7XG4gICAgdGhpcy5jdHguZmlsbFN0eWxlID0gY29sO1xuICAgIHRoaXMuY3R4LmZpbGwoKTtcbiAgfVxuXG4gIC8vZHJhdyBhIGNpcmNsZSBvZiByYWRpdXMgciBjZW50cmUgYyBhbmQgb3B0aW9uYWwgY29sb3VyXG4gIGNpcmNsZShjLCByLCBjb2xvdXIsIHdpZHRoKXtcbiAgICBjb25zdCBjb2wgPSBjb2xvdXIgfHwgJ2JsYWNrJztcbiAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICB0aGlzLmN0eC5hcmMoYy54LCBjLnksIHIsIDAsIE1hdGguUEkgKiAyKTtcbiAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IGNvbDtcbiAgICB0aGlzLmN0eC5saW5lV2lkdGggPSB3aWR0aCB8fCAxO1xuICAgIHRoaXMuY3R4LnN0cm9rZSgpO1xuICB9XG5cbiAgLy9jb252ZXJ0IHRoZSBjYW52YXMgdG8gYSBiYXNlNjRVUkwgYW5kIHNlbmQgdG8gc2F2ZUltYWdlLnBocFxuICBzYXZlSW1hZ2UoKXtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5jYW52YXMudG9EYXRhVVJMKCk7XG4gICAgJC5hamF4KHtcbiAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgIHVybDogJ3NhdmVJbWFnZS5waHAnLFxuICAgICAgZGF0YTogeyBpbWc6IGRhdGEgfVxuICAgIH0pO1xuICB9XG5cbiAgLy90aGUgY2FudmFzIGhhcyBiZWVuIHRyYW5zbGF0ZWQgdG8gdGhlIGNlbnRyZSBvZiB0aGUgZGlzayBzbyBuZWVkIHRvXG4gIC8vdXNlIGFuIG9mZnNldCB0byBjbGVhciBpdC4gTk9UIFdPUktJTkcgV0hFTiBTQ1JFRU4gSVMgUkVTSVpFRFxuICBjbGVhclNjcmVlbigpIHtcbiAgICB0aGlzLmN0eC5jbGVhclJlY3QoLXdpbmRvdy5pbm5lcldpZHRoLzIsLXdpbmRvdy5pbm5lckhlaWdodC8yLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gIH1cblxufVxuIiwiaW1wb3J0ICogYXMgRSBmcm9tICcuL2V1Y2xpZCc7XG5pbXBvcnQgeyBDYW52YXMgfSBmcm9tICcuL2NhbnZhcyc7XG5cbi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICpcbi8vICogICBESVNLIENMQVNTXG4vLyAqICAgUG9pbmNhcmUgRGlzayByZXByZXNlbnRhdGlvbiBvZiB0aGUgaHlwZXJib2xpYyBwbGFuZVxuLy8gKiAgIENvbnRhaW5zIGFueSBmdW5jdGlvbnMgdXNlZCB0byBkcmF3IHRvIHRoZSBkaXNrXG4vLyAqICAgQ29uc3RydWN0b3IgdGFrZXMgdGhlIGRyYXdpbmcgY2xhc3MgYXMgYW4gYXJndW1lbnRcbi8vICogICAoQ3VycmVudGx5IG9ubHkgQ2FudmFzIHVzZWQsIG1pZ2h0IHN3aXRjaCB0byBXZWJHTCBpbiBmdXR1cmUpXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5leHBvcnQgY2xhc3MgRGlzayB7XG4gIGNvbnN0cnVjdG9yKGRyYXdDbGFzcykge1xuICAgIGRyYXdDbGFzcyA9IGRyYXdDbGFzcyB8fCAnY2FudmFzJztcbiAgICBpZihkcmF3Q2xhc3MgPT09ICdjYW52YXMnKXtcbiAgICAgIHRoaXMuZHJhdyA9IG5ldyBDYW52YXMoKTtcbiAgICB9XG4gICAgdGhpcy5kcmF3LmNsZWFyU2NyZWVuKCk7XG5cbiAgICB0aGlzLmNlbnRyZSA9IHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwXG4gICAgfVxuXG4gICAgLy9kcmF3IGxhcmdlc3QgY2lyY2xlIHBvc3NpYmxlIGdpdmVuIHdpbmRvdyBkaW1zXG4gICAgdGhpcy5yYWRpdXMgPSAod2luZG93LmlubmVyV2lkdGggPCB3aW5kb3cuaW5uZXJIZWlnaHQpID8gKHdpbmRvdy5pbm5lcldpZHRoIC8gMikgLSA1IDogKHdpbmRvdy5pbm5lckhlaWdodCAvIDIpIC0gNTtcblxuICAgIC8vc21hbGxlciBjaXJjbGUgZm9yIHRlc3RpbmdcbiAgICAvLyAvdGhpcy5yYWRpdXMgPSB0aGlzLnJhZGl1cyAvIDM7XG5cbiAgICB0aGlzLm91dGVyQ2lyY2xlKCk7XG4gIH1cblxuICAvL2RyYXcgdGhlIGJvdW5kYXJ5IGNpcmNsZVxuICBvdXRlckNpcmNsZSgpIHtcbiAgICB0aGlzLmRyYXcuY2lyY2xlKHt4OiB0aGlzLmNlbnRyZS54LCB5OiB0aGlzLmNlbnRyZS55fSwgdGhpcy5yYWRpdXMpO1xuICB9XG5cbiAgLy9kcmF3IGEgaHlwZXJib2xpYyBsaW5lIGJldHdlZW4gdHdvIHBvaW50cyBvbiB0aGUgYm91bmRhcnkgY2lyY2xlXG4gIGxpbmUocDEsIHAyLCBjb2xvdXIpIHtcbiAgICAvL2xldCBwdHMgPSB0aGlzLnByZXBQb2ludHMocDEsIHAyKTtcbiAgICAvL3AxID0gcHRzLnAxO1xuICAgIC8vcDIgPSBwdHMucDI7XG4gICAgbGV0IGNvbCA9IGNvbG91ciB8fCAnYmxhY2snO1xuICAgIGxldCBjLCBwb2ludHM7XG5cbiAgICBpZihFLnRocm91Z2hPcmlnaW4ocDEscDIpKXtcbiAgICAgIGxldCB1ID0gbm9ybWFsVmVjdG9yKHAxLHAyKTtcbiAgICAgIHBvaW50cyA9IHtcbiAgICAgICAgcDE6IHtcbiAgICAgICAgICB4OiB1LnggKiB0aGlzLnJhZGl1cyxcbiAgICAgICAgICB5OiB1LnkgKiB0aGlzLnJhZGl1c1xuICAgICAgICB9LFxuICAgICAgICBwMjoge1xuICAgICAgICAgIHg6IC11LnggKiB0aGlzLnJhZGl1cyxcbiAgICAgICAgICB5OiAtdS55ICogdGhpcy5yYWRpdXNcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5kcmF3LmV1Y2xpZGVhbkxpbmUocG9pbnRzLnAxLHBvaW50cy5wMiwgY29sKTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIGMgPSBFLmdyZWF0Q2lyY2xlKHAxLCBwMiwgdGhpcy5yYWRpdXMsIHRoaXMuY2VudHJlKTtcbiAgICAgIHBvaW50cyA9IEUuY2lyY2xlSW50ZXJzZWN0KHRoaXMuY2VudHJlLCBjLmNlbnRyZSwgdGhpcy5yYWRpdXMsIGMucmFkaXVzKTtcblxuICAgICAgLy9hbmdsZSBzdWJ0ZW5kZWQgYnkgdGhlIGFyY1xuICAgICAgbGV0IGFscGhhID0gRS5jZW50cmFsQW5nbGUocG9pbnRzLnAxLCBwb2ludHMucDIsIGMucmFkaXVzKTtcblxuICAgICAgbGV0IG9mZnNldCA9IHRoaXMuYWxwaGFPZmZzZXQocG9pbnRzLnAyLCBwb2ludHMucDIsIGMsICdsaW5lJyk7XG4gICAgICB0aGlzLmRyYXcuc2VnbWVudChjLCBhbHBoYSwgb2Zmc2V0LCBjb2wpO1xuICAgIH1cbiAgfVxuXG4gIC8vY2FsY3VsYXRlIHRoZSBvZmZzZXQgKHBvc2l0aW9uIGFyb3VuZCB0aGUgY2lyY2xlIGZyb20gd2hpY2ggdG8gc3RhcnQgdGhlXG4gIC8vbGluZSBvciBhcmMpLiBBcyBjYW52YXMgZHJhd3MgYXJjcyBjbG9ja3dpc2UgYnkgZGVmYXVsdCB0aGlzIHdpbGwgY2hhbmdlXG4gIC8vZGVwZW5kaW5nIG9uIHdoZXJlIHRoZSBhcmMgaXMgcmVsYXRpdmUgdG8gdGhlIG9yaWdpblxuICAvL3NwZWNpZmljYWxsIHdoZXRoZXIgaXQgbGllcyBvbiB0aGUgeCBheGlzLCBvciBhYm92ZSBvciBiZWxvdyBpdFxuICAvL3R5cGUgPSAnbGluZScgb3IgJ2FyYydcbiAgYWxwaGFPZmZzZXQocDEsIHAyLCBjLCB0eXBlKSB7XG4gICAgbGV0IG9mZnNldDtcblxuICAgIC8vcG9pbnRzIGF0IDAgcmFkaWFucyBvbiBncmVhdENpcmNsZVxuICAgIGxldCBwID0ge1xuICAgICAgeDogYy5jZW50cmUueCArIGMucmFkaXVzLFxuICAgICAgeTogYy5jZW50cmUueVxuICAgIH1cblxuICAgIGlmKHAxLnkgPCBjLmNlbnRyZS55KXtcbiAgICAgIG9mZnNldCA9IDIqTWF0aC5QSSAtIEUuY2VudHJhbEFuZ2xlKHAxLCBwLCBjLnJhZGl1cyk7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICBvZmZzZXQgPSBFLmNlbnRyYWxBbmdsZShwMSwgcCwgYy5yYWRpdXMpO1xuICAgIH1cblxuICAgIHJldHVybiBvZmZzZXQ7XG4gIH1cblxuICAvL3B1dCBwb2ludHMgaW4gY2xvY2t3aXNlIG9yZGVyXG4gIHByZXBQb2ludHMocDEsIHAyLCBjKXtcbiAgICBjb25zdCBwID0ge3g6IGMuY2VudHJlLnggKyBjLnJhZGl1cywgeTogYy5jZW50cmUueX07XG4gICAgLy9jYXNlIHdoZXJlIHBvaW50cyBhcmUgYWJvdmUgYW5kIGJlbG93IHRoZSBsaW5lIGMuY2VudHJlIC0+IHBcbiAgICAvL2luIHRoaXMgY2FzZSBqdXN0IHJldHVybiBwb2ludHNcbiAgICBjb25zdCBveSA9IGMuY2VudHJlLnk7XG4gICAgY29uc3Qgb3ggPSBjLmNlbnRyZS54O1xuXG4gICAgaWYocDEueCA+IG94ICYmIHAyLnggPiBveCl7XG4gICAgICBpZihwMS55ID4gb3kgJiYgcDIueSA8IG95KSByZXR1cm4ge3AxOiBwMiwgcDI6IHAxfTtcbiAgICAgIGVsc2UgaWYocDEueSA8IG95ICYmIHAyLnkgPiBveSkgcmV0dXJuIHtwMTogcDEsIHAyOiBwMn07XG4gICAgfVxuXG4gICAgbGV0IGFscGhhMSA9IEUuY2VudHJhbEFuZ2xlKHAsIHAxLCBjLnJhZGl1cyk7XG4gICAgYWxwaGExID0gKHAxLnkgPCBjLmNlbnRyZS55KSA/IDIqTWF0aC5QSSAtIGFscGhhMSA6IGFscGhhMTtcbiAgICBsZXQgYWxwaGEyID0gRS5jZW50cmFsQW5nbGUocCwgcDIsIGMucmFkaXVzKTtcbiAgICBhbHBoYTIgPSAocDIueSA8IGMuY2VudHJlLnkpID8gMipNYXRoLlBJIC0gYWxwaGEyIDogYWxwaGEyO1xuXG4gICAgLy9pZiB0aGUgcG9pbnRzIGFyZSBub3QgaW4gY2xvY2t3aXNlIG9yZGVyIGZsaXAgdGhlbVxuICAgIGlmKGFscGhhMSA+IGFscGhhMikgcmV0dXJuIHtwMTogcDIsIHAyOiBwMX07XG4gICAgZWxzZSByZXR1cm4ge3AxOiBwMSwgcDI6IHAyfTtcblxuICB9XG5cbiAgLy9EcmF3IGFuIGFyYyAoaHlwZXJib2xpYyBsaW5lIHNlZ21lbnQpIGJldHdlZW4gdHdvIHBvaW50cyBvbiB0aGUgZGlza1xuICBhcmMocDEsIHAyLCBjb2xvdXIpIHtcbiAgICBpZihFLnRocm91Z2hPcmlnaW4ocDEscDIpKXtcbiAgICAgIHRoaXMuZHJhdy5ldWNsaWRlYW5MaW5lKHAxLHAyLCBjb2xvdXIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgY29sID0gY29sb3VyIHx8ICdibGFjayc7XG4gICAgbGV0IGMgPSBFLmdyZWF0Q2lyY2xlKHAxLCBwMiwgdGhpcy5yYWRpdXMsIHRoaXMuY2VudHJlKTtcbiAgICBsZXQgcHRzID0gdGhpcy5wcmVwUG9pbnRzKHAxLCBwMiwgYyk7XG4gICAgcDEgPSBwdHMucDE7XG4gICAgcDIgPSBwdHMucDI7XG5cbiAgICAvL2xlbmd0aCBvZiB0aGUgYXJjXG4gICAgbGV0IGFscGhhID0gRS5jZW50cmFsQW5nbGUocDEsIHAyLCBjLnJhZGl1cyk7XG5cbiAgICAvL2hvdyBmYXIgYXJvdW5kIHRoZSBncmVhdENpcmNsZSB0byBzdGFydCBkcmF3aW5nIHRoZSBhcmNcbiAgICBsZXQgb2Zmc2V0ID0gdGhpcy5hbHBoYU9mZnNldChwMSwgcDIsIGMsICdhcmMnKTtcbiAgICB0aGlzLmRyYXcuc2VnbWVudChjLCBhbHBoYSwgb2Zmc2V0LCBjb2xvdXIpO1xuICB9XG5cbiAgcG9seWdvbih2ZXJ0aWNlcywgY29sb3VyKSB7XG4gICAgbGV0IGwgPSB2ZXJ0aWNlcy5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgIHRoaXMuYXJjKHZlcnRpY2VzW2ldLCB2ZXJ0aWNlc1soaSArIDEpJWxdLCBjb2xvdXIpO1xuICAgIH1cbiAgfVxuXG4gIC8vcmV0dXJuIHRydWUgaWYgdGhlIHBvaW50IGlzIG5vdCBpbiB0aGUgZGlza1xuICBjaGVja1BvaW50KHBvaW50KSB7XG4gICAgbGV0IHIgPSB0aGlzLnJhZGl1cztcbiAgICBpZiAoRS5kaXN0YW5jZShwb2ludCwgdGhpcy5jZW50cmUpID4gcikge1xuICAgICAgY29uc29sZS5lcnJvcignRXJyb3IhIFBvaW50ICgnICsgcG9pbnQueCArICcsICcgKyBwb2ludC55ICsgJykgbGllcyBvdXRzaWRlIHRoZSBwbGFuZSEnKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cbiIsIi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICpcbi8vICogICBFVUNMSURFQU4gRlVOQ1RJT05TXG4vLyAqICAgYWxsIEV1Y2xpZGVhbiBtYXRoZW1hdGljYWwgZnVuY3Rpb25zIGdvIGhlcmVcbi8vICpcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuLy9kaXN0YW5jZSBiZXR3ZWVuIHR3byBwb2ludHNcbmV4cG9ydCBjb25zdCBkaXN0YW5jZSA9IChwMSwgcDIpID0+IE1hdGguc3FydChNYXRoLnBvdygocDIueCAtIHAxLngpLCAyKSArIE1hdGgucG93KChwMi55IC0gcDEueSksIDIpKTtcblxuLy9taWRwb2ludCBvZiB0aGUgbGluZSBzZWdtZW50IGNvbm5lY3RpbmcgdHdvIHBvaW50c1xuZXhwb3J0IGNvbnN0IG1pZHBvaW50ID0gKHAxLCBwMikgPT4ge1xuICByZXR1cm4ge1xuICAgIHg6IChwMS54ICsgcDIueCkgLyAyLFxuICAgIHk6IChwMS55ICsgcDIueSkgLyAyXG4gIH1cbn1cblxuLy9zbG9wZSBvZiBsaW5lIHRocm91Z2ggcDEsIHAyXG5leHBvcnQgY29uc3Qgc2xvcGUgPSAocDEsIHAyKSA9PiAocDIueCAtIHAxLngpIC8gKHAyLnkgLSBwMS55KTtcblxuLy9zbG9wZSBvZiBsaW5lIHBlcnBlbmRpY3VsYXIgdG8gYSBsaW5lIGRlZmluZWQgYnkgcDEscDJcbmV4cG9ydCBjb25zdCBwZXJwZW5kaWN1bGFyU2xvcGUgPSAocDEsIHAyKSA9PiAtMSAvIChNYXRoLnBvdyhzbG9wZShwMSwgcDIpLCAtMSkpO1xuXG4vL2ludGVyc2VjdGlvbiBwb2ludCBvZiB0d28gbGluZXMgZGVmaW5lZCBieSBwMSxtMSBhbmQgcTEsbTJcbi8vTk9UIFdPUktJTkcgRk9SIFZFUlRJQ0FMIExJTkVTISEhXG5leHBvcnQgY29uc3QgaW50ZXJzZWN0aW9uID0gKHAxLCBtMSwgcDIsIG0yKSA9PiB7XG4gIGxldCBjMSwgYzIsIHgsIHk7XG4gIC8vY2FzZSB3aGVyZSBmaXJzdCBsaW5lIGlzIHZlcnRpY2FsXG4gIC8vaWYobTEgPiA1MDAwIHx8IG0xIDwgLTUwMDAgfHwgbTEgPT09IEluZmluaXR5KXtcbiAgaWYocDEueSA8IDAuMDAwMDAxICYmIHAxLnkgPiAtMC4wMDAwMDEgKXtcbiAgICB4ID0gcDEueDtcbiAgICB5ID0gKG0yKSoocDEueC1wMi54KSArIHAyLnk7XG4gIH1cbiAgLy9jYXNlIHdoZXJlIHNlY29uZCBsaW5lIGlzIHZlcnRpY2FsXG4gIC8vZWxzZSBpZihtMiA+IDUwMDAgfHwgbTIgPCAtNTAwMCB8fCBtMSA9PT0gSW5maW5pdHkpe1xuICBlbHNlIGlmKHAyLnkgPCAwLjAwMDAwMSAmJiBwMi55ID4gLTAuMDAwMDAxICl7XG4gICAgeCA9IHAyLng7XG4gICAgeSA9IChtMSoocDIueC1wMS54KSkgKyBwMS55O1xuICB9XG4gIGVsc2V7XG4gICAgLy95IGludGVyY2VwdCBvZiBmaXJzdCBsaW5lXG4gICAgYzEgPSBwMS55IC0gbTEgKiBwMS54O1xuICAgIC8veSBpbnRlcmNlcHQgb2Ygc2Vjb25kIGxpbmVcbiAgICBjMiA9IHAyLnkgLSBtMiAqIHAyLng7XG5cbiAgICB4ID0gKGMyIC0gYzEpIC8gKG0xIC0gbTIpO1xuICAgIHkgPSBtMSAqIHggKyBjMTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgeDogeCxcbiAgICB5OiB5XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHJhZGlhbnMgPSAoZGVncmVlcykgPT4gKE1hdGguUEkgLyAxODApICogZGVncmVlcztcblxuLy9nZXQgdGhlIGNpcmNsZSBpbnZlcnNlIG9mIGEgcG9pbnQgcCB3aXRoIHJlc3BlY3QgYSBjaXJjbGUgcmFkaXVzIHIgY2VudHJlIGNcbmV4cG9ydCBjb25zdCBpbnZlcnNlID0gKHAsIHIsIGMpID0+IHtcbiAgbGV0IGFscGhhID0gKHIgKiByKSAvIChNYXRoLnBvdyhwLnggLSBjLngsIDIpICsgTWF0aC5wb3cocC55IC0gYy55LCAyKSk7XG4gIHJldHVybiB7XG4gICAgeDogYWxwaGEgKiAocC54IC0gYy54KSArIGMueCxcbiAgICB5OiBhbHBoYSAqIChwLnkgLSBjLnkpICsgYy55XG4gIH07XG59XG5cbi8vY2FsY3VsYXRlIHRoZSByYWRpdXMgYW5kIGNlbnRyZSBvZiB0aGUgY2lyY2xlIHJlcXVpcmVkIHRvIGRyYXcgYSBsaW5lIGJldHdlZW5cbi8vdHdvIHBvaW50cyBpbiB0aGUgaHlwZXJib2xpYyBwbGFuZSBkZWZpbmVkIGJ5IHRoZSBkaXNrIChyLCBjKVxuZXhwb3J0IGNvbnN0IGdyZWF0Q2lyY2xlID0gKHAxLCBwMiwgciwgYykgPT4ge1xuICBsZXQgcDFJbnZlcnNlID0gaW52ZXJzZShwMSwgciwgYyk7XG4gIGxldCBwMkludmVyc2UgPSBpbnZlcnNlKHAyLCByLCBjKTtcblxuICBsZXQgbSA9IG1pZHBvaW50KHAxLCBwMUludmVyc2UpO1xuICBsZXQgbiA9IG1pZHBvaW50KHAyLCBwMkludmVyc2UpO1xuXG4gIGxldCBtMSA9IHBlcnBlbmRpY3VsYXJTbG9wZShtLCBwMUludmVyc2UpO1xuICBsZXQgbTIgPSBwZXJwZW5kaWN1bGFyU2xvcGUobiwgcDJJbnZlcnNlKTtcblxuXG4gIC8vY2VudHJlIGlzIHRoZSBjZW50cmVwb2ludCBvZiB0aGUgY2lyY2xlIG91dCBvZiB3aGljaCB0aGUgYXJjIGlzIG1hZGVcbiAgbGV0IGNlbnRyZSA9IGludGVyc2VjdGlvbihtLCBtMSwgbiwgbTIpO1xuICBsZXQgcmFkaXVzID0gZGlzdGFuY2UoY2VudHJlLCBwMSk7XG4gIHJldHVybiB7XG4gICAgY2VudHJlOiBjZW50cmUsXG4gICAgcmFkaXVzOiByYWRpdXNcbiAgfTtcbn1cblxuLy9hbiBhdHRlbXB0IGF0IGNhbGN1bGF0aW5nIHRoZSBjaXJjbGUgYWxnZWJyYWljYWxseVxuZXhwb3J0IGNvbnN0IGdyZWF0Q2lyY2xlVjIgPSAocDEscDIsIHIpID0+e1xuICBsZXQgeCA9IChwMi55KihwMS54KnAxLnggKyByKSsgcDEueSpwMS55KnAyLnktcDEueSoocDIueCpwMi54KyBwMi55KnAyLnkgKyByKSkvKDIqcDEueCpwMi55IC0gcDEueSpwMi54KTtcbiAgbGV0IHkgPSAocDEueCpwMS54KnAyLnggLSBwMS54KihwMi54KnAyLngrcDIueSpwMi55K3IpK3AyLngqKHAxLnkqcDEueStyKSkvKDIqcDEueSpwMi54ICsgMipwMS54KnAyLnkpO1xuICBsZXQgcmFkaXVzID0gICBNYXRoLnNxcnQoeCp4K3kqeS1yKTtcbiAgcmV0dXJuIHtcbiAgICBjZW50cmU6IHtcbiAgICAgIHg6IHgsXG4gICAgICB5OiB5XG4gICAgfSxcbiAgICByYWRpdXM6IHJhZGl1c1xuICB9XG59XG5cbi8vaW50ZXJzZWN0aW9uIG9mIHR3byBjaXJjbGVzIHdpdGggZXF1YXRpb25zOlxuLy8oeC1hKV4yICsoeS1hKV4yID0gcjBeMlxuLy8oeC1iKV4yICsoeS1jKV4yID0gcjFeMlxuLy9OT1RFIGFzc3VtZXMgdGhlIHR3byBjaXJjbGVzIERPIGludGVyc2VjdCFcbmV4cG9ydCBjb25zdCBjaXJjbGVJbnRlcnNlY3QgPSAoYzAsIGMxLCByMCwgcjEpID0+IHtcbiAgbGV0IGEgPSBjMC54O1xuICBsZXQgYiA9IGMwLnk7XG4gIGxldCBjID0gYzEueDtcbiAgbGV0IGQgPSBjMS55O1xuICBsZXQgZGlzdCA9IE1hdGguc3FydCgoYyAtIGEpICogKGMgLSBhKSArIChkIC0gYikgKiAoZCAtIGIpKTtcblxuICBsZXQgZGVsID0gTWF0aC5zcXJ0KChkaXN0ICsgcjAgKyByMSkgKiAoZGlzdCArIHIwIC0gcjEpICogKGRpc3QgLSByMCArIHIxKSAqICgtZGlzdCArIHIwICsgcjEpKSAvIDQ7XG5cbiAgbGV0IHhQYXJ0aWFsID0gKGEgKyBjKSAvIDIgKyAoKGMgLSBhKSAqIChyMCAqIHIwIC0gcjEgKiByMSkpIC8gKDIgKiBkaXN0ICogZGlzdCk7XG4gIGxldCB4MSA9IHhQYXJ0aWFsIC0gMiAqIGRlbCAqIChiIC0gZCkgLyAoZGlzdCAqIGRpc3QpO1xuICBsZXQgeDIgPSB4UGFydGlhbCArIDIgKiBkZWwgKiAoYiAtIGQpIC8gKGRpc3QgKiBkaXN0KTtcblxuICBsZXQgeVBhcnRpYWwgPSAoYiArIGQpIC8gMiArICgoZCAtIGIpICogKHIwICogcjAgLSByMSAqIHIxKSkgLyAoMiAqIGRpc3QgKiBkaXN0KTtcbiAgbGV0IHkxID0geVBhcnRpYWwgKyAyICogZGVsICogKGEgLSBjKSAvIChkaXN0ICogZGlzdCk7XG4gIGxldCB5MiA9IHlQYXJ0aWFsIC0gMiAqIGRlbCAqIChhIC0gYykgLyAoZGlzdCAqIGRpc3QpO1xuXG4gIGxldCBwMSA9IHtcbiAgICB4OiB4MSxcbiAgICB5OiB5MVxuICB9XG5cbiAgbGV0IHAyID0ge1xuICAgIHg6IHgyLFxuICAgIHk6IHkyXG4gIH1cblxuICByZXR1cm4ge1xuICAgIHAxOiBwMSxcbiAgICBwMjogcDJcbiAgfTtcbn1cblxuZXhwb3J0IGNvbnN0IGNpcmNsZUxpbmVJbnRlcnNlY3QgPSAoYywgciwgcDEsIHAyKSA9PiB7XG5cbiAgY29uc3QgZCA9IGRpc3RhbmNlKHAxLCBwMik7XG4gIC8vdW5pdCB2ZWN0b3IgcDEgcDJcbiAgY29uc3QgZHggPSAocDIueCAtIHAxLngpL2Q7XG4gIGNvbnN0IGR5ID0gKHAyLnkgLSBwMS55KS9kO1xuXG4gIC8vcG9pbnQgb24gbGluZSBjbG9zZXN0IHRvIGNpcmNsZSBjZW50cmVcbiAgY29uc3QgdCA9IGR4KihjLnggLXAxLngpICsgZHkqKGMueS1wMS55KTtcbiAgY29uc3QgcCA9ICB7eDogdCogZHggKyBwMS54LCB5OiB0KiBkeSArIHAxLnl9O1xuXG4gIC8vZGlzdGFuY2UgZnJvbSB0aGlzIHBvaW50IHRvIGNlbnRyZVxuICBjb25zdCBkMiA9IGRpc3RhbmNlKHAsIGMpO1xuXG4gIC8vbGluZSBpbnRlcnNlY3RzIGNpcmNsZVxuICBpZihkMiA8IHIpe1xuICAgIGNvbnN0IGR0ID0gTWF0aC5zcXJ0KCByKnIgLSBkMipkMik7XG4gICAgLy9wb2ludCAxXG4gICAgY29uc3QgcTEgPSB7XG4gICAgICB4OiAodC1kdCkqZHggKyBwMS54LFxuICAgICAgeTogKHQtZHQpKmR5ICsgcDEueVxuICAgIH1cbiAgICAvL3BvaW50IDJcbiAgICBjb25zdCBxMiA9IHtcbiAgICAgIHg6ICh0K2R0KSpkeCArIHAxLngsXG4gICAgICB5OiAodCtkdCkqZHkgKyBwMS55XG4gICAgfVxuXG4gICAgcmV0dXJuIHtwMTogcTEsIHAyOiBxMn07XG4gIH1cbiAgZWxzZSBpZiggZDIgPT09IHIpe1xuICAgIHJldHVybiBwO1xuICB9XG4gIGVsc2V7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3I6IGxpbmUgZG9lcyBub3QgaW50ZXJzZWN0IGNpcmNsZSEnKTtcbiAgfVxufVxuXG4vL2FuZ2xlIGluIHJhZGlhbnMgYmV0d2VlbiB0d28gcG9pbnRzIG9uIGNpcmNsZSBvZiByYWRpdXMgclxuZXhwb3J0IGNvbnN0IGNlbnRyYWxBbmdsZSA9IChwMSwgcDIsIHIpID0+IHtcbiAgcmV0dXJuIDIgKiBNYXRoLmFzaW4oMC41ICogZGlzdGFuY2UocDEsIHAyKSAvIHIpO1xufVxuXG4vL2NhbGN1bGF0ZSB0aGUgbm9ybWFsIHZlY3RvciBnaXZlbiAyIHBvaW50c1xuZXhwb3J0IGNvbnN0IG5vcm1hbFZlY3RvciA9IChwMSwgcDIpID0+IHtcbiAgbGV0IGQgPSBNYXRoLnNxcnQoTWF0aC5wb3cocDIueC1wMS54LDIpICsgTWF0aC5wb3cocDIueS1wMS55LDIpKTtcbiAgcmV0dXJuIHtcbiAgICB4OiAocDIueC1wMS54KS9kLFxuICAgIHk6IChwMi55LXAxLnkpL2RcbiAgfVxufVxuXG4vL2RvZXMgdGhlIGxpbmUgY29ubmVjdGluZyBwMSwgcDIgZ28gdGhyb3VnaCB0aGUgcG9pbnQgKDAsMCk/XG5leHBvcnQgY29uc3QgdGhyb3VnaE9yaWdpbiA9IChwMSwgcDIpID0+IHtcbiAgaWYocDEueCA9PT0gMCAmJiBwMi54ID09PSAwKXtcbiAgICAvL3ZlcnRpY2FsIGxpbmUgdGhyb3VnaCBjZW50cmVcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBsZXQgdGVzdCA9ICgtcDEueCpwMi55ICsgcDEueCpwMS55KS8ocDIueC1wMS54KSArIHAxLnk7XG4gIGlmKHRlc3QgPT09IDApIHJldHVybiB0cnVlO1xuICBlbHNlIHJldHVybiBmYWxzZTtcbn1cblxuLy9maW5kIHRoZSBjZW50cm9pZCBvZiBhIG5vbi1zZWxmLWludGVyc2VjdGluZyBwb2x5Z29uXG5leHBvcnQgY29uc3QgY2VudHJvaWRPZlBvbHlnb24gPSAocG9pbnRzKSA9PiB7XG4gIGxldCBmaXJzdCA9IHBvaW50c1swXSwgbGFzdCA9IHBvaW50c1twb2ludHMubGVuZ3RoLTFdO1xuICBpZiAoZmlyc3QueCAhPSBsYXN0LnggfHwgZmlyc3QueSAhPSBsYXN0LnkpIHBvaW50cy5wdXNoKGZpcnN0KTtcbiAgbGV0IHR3aWNlYXJlYT0wLFxuICAgIHg9MCwgeT0wLFxuICAgIG5QdHMgPSBwb2ludHMubGVuZ3RoLFxuICAgIHAxLCBwMiwgZjtcbiAgZm9yICggdmFyIGk9MCwgaj1uUHRzLTEgOyBpPG5QdHMgOyBqPWkrKyApIHtcbiAgICBwMSA9IHBvaW50c1tpXTsgcDIgPSBwb2ludHNbal07XG4gICAgZiA9IHAxLngqcDIueSAtIHAyLngqcDEueTtcbiAgICB0d2ljZWFyZWEgKz0gZjtcbiAgICB4ICs9ICggcDEueCArIHAyLnggKSAqIGY7XG4gICAgeSArPSAoIHAxLnkgKyBwMi55ICkgKiBmO1xuICB9XG4gIGYgPSB0d2ljZWFyZWEgKiAzO1xuICByZXR1cm4geyB4OngvZiwgeTp5L2YgfTtcbn1cblxuLy9jb21wYXJlIHR3byBwb2ludHMgdGFraW5nIHJvdW5kaW5nIGVycm9ycyBpbnRvIGFjY291bnRcbmV4cG9ydCBjb25zdCBjb21wYXJlUG9pbnRzID0gKHAxLCBwMikgPT4ge1xuICBpZih0eXBlb2YgcDEgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBwMiA9PT0gJ3VuZGVmaW5lZCcpe1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHAxID0gcG9pbnRUb0ZpeGVkKHAxLCA2KTtcbiAgcDIgPSBwb2ludFRvRml4ZWQocDIsIDYpO1xuICBpZihwMS54ID09PSBwMi54ICYmIHAxLnkgPT09IHAyLnkpIHJldHVybiB0cnVlO1xuICBlbHNlIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGNvbnN0IHBvaW50VG9GaXhlZCA9IChwLCBwbGFjZXMpID0+IHtcbiAgcmV0dXJuIHtcbiAgICB4OiBwLngudG9GaXhlZChwbGFjZXMpLFxuICAgIHk6IHAueS50b0ZpeGVkKHBsYWNlcylcbiAgfTtcbn1cblxuLypcbi8vZmxpcCBhIHNldCBvZiBwb2ludHMgb3ZlciBhIGh5cGVyb2JsaWMgbGluZSBkZWZpbmVkIGJ5IHR3byBwb2ludHNcbmV4cG9ydCBjb25zdCB0cmFuc2Zvcm0gPSAocG9pbnRzQXJyYXksIHAxLCBwMikgPT4ge1xuICBsZXQgbmV3UG9pbnRzQXJyYXkgPSBbXTtcbiAgbGV0IGMgPSBFLmdyZWF0Q2lyY2xlKHAxLCBwMiwgZGlzay5yYWRpdXMsIGRpc2suY2VudHJlKTtcblxuICBmb3IobGV0IHAgb2YgcG9pbnRzQXJyYXkpe1xuICAgIGxldCBuZXdQID0gRS5pbnZlcnNlKHAsIGMucmFkaXVzLCBjLmNlbnRyZSk7XG4gICAgbmV3UG9pbnRzQXJyYXkucHVzaChuZXdQKTtcbiAgfVxuICByZXR1cm4gbmV3UG9pbnRzQXJyYXk7XG59XG4qL1xuIiwiaW1wb3J0IHsgUmVndWxhclRlc3NlbGF0aW9uIH0gZnJvbSAnLi9yZWd1bGFyVGVzc2VsYXRpb24nO1xuXG5pbXBvcnQgeyBUaHJlZUpTIH0gZnJvbSAnLi90aHJlZWpzJztcbi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICpcbi8vICogICBTRVRVUFxuLy8gKlxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG5jb25zdCB0aHJlZSA9IG5ldyBUaHJlZUpTKCk7XG4vL2NvbnN0IHRlc3NlbGF0aW9uID0gbmV3IFJlZ3VsYXJUZXNzZWxhdGlvbig1LCA0LCAzKk1hdGguUEkvNiowLCAncmVkJyk7XG4iLCJpbXBvcnQgKiBhcyBFIGZyb20gJy4vZXVjbGlkJztcbmltcG9ydCB7IERpc2sgfSBmcm9tICcuL2Rpc2snO1xuLy8gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gKiAgICBURVNTRUxBVElPTiBDTEFTU1xuLy8gKiAgICBDcmVhdGVzIGEgcmVndWxhciBUZXNzZWxhdGlvbiBvZiB0aGUgUG9pbmNhcmUgRGlza1xuLy8gKiAgICBxOiBudW1iZXIgb2YgcC1nb25zIG1lZXRpbmcgYXQgZWFjaCB2ZXJ0ZXhcbi8vICogICAgcDogbnVtYmVyIG9mIHNpZGVzIG9mIHAtZ29uXG4vLyAqICAgIHVzaW5nIHRoZSB0ZWNobmlxdWVzIGNyZWF0ZWQgYnkgQ294ZXRlciBhbmQgRHVuaGFtXG4vLyAqXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5leHBvcnQgY2xhc3MgUmVndWxhclRlc3NlbGF0aW9uIGV4dGVuZHMgRGlzayB7XG4gIGNvbnN0cnVjdG9yKHAsIHEsIHJvdGF0aW9uLCBjb2xvdXIsIG1heExheWVycywgZHJhd0NsYXNzKSB7XG4gICAgc3VwZXIoZHJhd0NsYXNzKTtcbiAgICB0aGlzLnAgPSBwO1xuICAgIHRoaXMucSA9IHE7XG4gICAgdGhpcy5jb2xvdXIgPSBjb2xvdXIgfHwgJ2JsYWNrJztcbiAgICB0aGlzLnJvdGF0aW9uID0gcm90YXRpb24gfHwgMDtcbiAgICB0aGlzLm1heExheWVycyA9IG1heExheWVycyB8fCA1O1xuXG4gICAgaWYodGhpcy5jaGVja1BhcmFtcygpKXsgcmV0dXJuIGZhbHNlO31cblxuICAgIHRoaXMuZnIgPSB0aGlzLmZ1bmRhbWVudGFsUmVnaW9uKCk7XG5cbiAgICB0aGlzLmFyYyh0aGlzLmZyLmEsIHRoaXMuZnIuYik7XG4gICAgdGhpcy5hcmModGhpcy5mci5hLCB0aGlzLmZyLmMpO1xuICAgIHRoaXMuYXJjKHRoaXMuZnIuYiwgdGhpcy5mci5jKTtcbiAgfVxuXG4gIC8vY2FsY3VsYXRlIGZpcnN0IHBvaW50IG9mIGZ1bmRhbWVudGFsIHBvbHlnb24gdXNpbmcgQ294ZXRlcidzIG1ldGhvZFxuICBmdW5kYW1lbnRhbFJlZ2lvbigpe1xuICAgIGNvbnN0IHMgPSBNYXRoLnNpbihNYXRoLlBJL3RoaXMucCk7XG4gICAgY29uc3QgdCA9IE1hdGguY29zKE1hdGguUEkvdGhpcy5xKTtcbiAgICAvL211bHRpcGx5IHRoZXNlIGJ5IHRoZSBkaXNrcyByYWRpdXMgKENveGV0ZXIgdXNlZCB1bml0IGRpc2spO1xuICAgIGNvbnN0IHIgPSAxL01hdGguc3FydCgodCp0KS8ocypzKSAtMSkqdGhpcy5yYWRpdXM7XG4gICAgY29uc3QgZCA9IDEvTWF0aC5zcXJ0KDEtIChzKnMpLyh0KnQpKSp0aGlzLnJhZGl1cztcbiAgICBjb25zdCBiID0ge1xuICAgICAgeDogdGhpcy5yYWRpdXMqTWF0aC5jb3MoTWF0aC5QSS90aGlzLnApLFxuICAgICAgeTogLXRoaXMucmFkaXVzKk1hdGguc2luKE1hdGguUEkvdGhpcy5wKVxuICAgIH1cblxuICAgIGNvbnN0IGNlbnRyZSA9IHt4OiBkLCB5OiAwfTtcblxuICAgIC8vdGhlcmUgd2lsbCBiZSB0d28gcG9pbnRzIG9mIGludGVyc2VjdGlvbiwgb2Ygd2hpY2ggd2Ugd2FudCB0aGUgZmlyc3RcbiAgICBjb25zdCBwMSA9IEUuY2lyY2xlTGluZUludGVyc2VjdChjZW50cmUsIHIsIHRoaXMuY2VudHJlLCBiKS5wMTtcblxuICAgIHJldHVybiB7XG4gICAgICBhOiB0aGlzLmNlbnRyZSxcbiAgICAgIGI6IHAxLFxuICAgICAgYzogeyB4OiBkLXIsIHk6IDB9XG4gICAgfTtcbiAgfVxuXG4gIC8vVGhlIHRlc3NlbGF0aW9uIHJlcXVpcmVzIHRoYXQgKHAtMikocS0yKSA+IDQgdG8gd29yayAob3RoZXJ3aXNlIGl0IGlzXG4gIC8vIGVpdGhlciBhbiBlbGxpcHRpY2FsIG9yIGV1Y2xpZGVhbiB0ZXNzZWxhdGlvbik7XG4gIGNoZWNrUGFyYW1zKCl7XG4gICAgaWYodGhpcy5tYXhMYXllcnMgPCAwIHx8IGlzTmFOKHRoaXMubWF4TGF5ZXJzKSl7XG4gICAgICBjb25zb2xlLmVycm9yKCdtYXhMYXllcnMgbXVzdCBiZSBncmVhdGVyIHRoYW4gMCcpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGVsc2UgaWYoKHRoaXMucCAtMikqKHRoaXMucS0yKSA8PSA0KXtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0h5cGVyYm9saWMgdGVzc2VsYXRpb25zIHJlcXVpcmUgdGhhdCAocC0xKShxLTIpIDwgNCEnKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvL0ZvciBub3cgcmVxdWlyZSBwLHEgPiAzLFxuICAgIC8vVE9ETyBpbXBsZW1lbnQgc3BlY2lhbCBjYXNlcyBmb3IgcSA9IDMgb3IgcCA9IDNcbiAgICBlbHNlIGlmKHRoaXMucSA8PSAzIHx8IGlzTmFOKHRoaXMucSkpe1xuICAgICAgY29uc29sZS5lcnJvcignVGVzc2VsYXRpb24gZXJyb3I6IGF0IGxlYXN0IDMgcC1nb25zIG11c3QgbWVldCBcXFxuICAgICAgICAgICAgICAgICAgICBhdCBlYWNoIHZlcnRleCEnKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBlbHNlIGlmKHRoaXMucCA8PSAzfHwgaXNOYU4odGhpcy5wKSl7XG4gICAgICBjb25zb2xlLmVycm9yKCdUZXNzZWxhdGlvbiBlcnJvcjogcG9seWdvbiBuZWVkcyBhdCBsZWFzdCAzIHNpZGVzIScpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGVsc2UgeyByZXR1cm4gZmFsc2U7IH1cbiAgfVxufVxuIiwiLy8gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gKlxuLy8gKiAgVEhSRUUgSlMgQ0xBU1Ncbi8vICpcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbmV4cG9ydCBjbGFzcyBUaHJlZUpTIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuICAgIHRoaXMuY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LFxuICAgICAgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsIDAuMSwgMTAwMCk7XG5cbiAgICB0aGlzLnJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gICAgdGhpcy5nZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSgxLCAxLCAxKTtcbiAgICB0aGlzLm1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcbiAgICAgIGNvbG9yOiAweDAwZmYwMFxuICAgIH0pO1xuICAgIHRoaXMuY3ViZSA9IG5ldyBUSFJFRS5NZXNoKHRoaXMuZ2VvbWV0cnksIHRoaXMubWF0ZXJpYWwpO1xuICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMuY3ViZSk7XG5cbiAgICB0aGlzLmNhbWVyYS5wb3NpdGlvbi56ID0gNTtcblxuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCAoKSA9PiB7IHRoaXMucmVuZGVyKCkgfSApO1xuXG4gICAgdGhpcy5jdWJlLnJvdGF0aW9uLnggKz0gMC4wMTtcbiAgICB0aGlzLmN1YmUucm90YXRpb24ueSArPSAwLjAxO1xuXG4gICAgdGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5zY2VuZSwgdGhpcy5jYW1lcmEpO1xuICB9XG5cbn1cbiJdfQ==
