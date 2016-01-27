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
      _this.camera.aspect = window.innerWidth / window.innerHeight;
      _this.camera.updateProjectionMatrix();
      _this.renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);
  }

  _createClass(ThreeJS, [{
    key: 'init',
    value: function init() {
      this.scene = new THREE.Scene();
      this.camera();

      this.lighting();

      this.axes();
      this.shape();
      this.renderer();
    }
  }, {
    key: 'camera',
    value: function camera() {
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.scene.add(this.camera);
      this.camera.position.x = 0;
      this.camera.position.y = 0;
      this.camera.lookAt(this.scene.position);

      this.camera.position.z = 10;
    }
  }, {
    key: 'renderer',
    value: function renderer() {
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setClearColor(0x000000, 1.0);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement);

      this.render();
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
    value: function createMesh(geometry, imageURL) {
      var material = new THREE.MeshBasicMaterial({
        color: 0xff00ff
      });

      var textureLoader = new THREE.TextureLoader();

      //load texture and apply to material in callback
      var texture = textureLoader.load(imageURL, function (tex) {});
      texture.repeat.set(0.05, 0.05);
      material.map = texture;
      material.map.wrapT = THREE.RepeatWrapping;
      material.map.wrapS = THREE.RepeatWrapping;

      //geometry = new THREE.BoxGeometry( 8, 8, 8 );
      console.log(geometry.faceVertexUvs);

      geometry.faceVertexUvs[0][0][0].x = 0.5;
      geometry.faceVertexUvs[0][0][0].y = 0.5;
      geometry.faceVertexUvs[0][0][1].x = 0.5;
      geometry.faceVertexUvs[0][0][1].y = 0.5;
      geometry.faceVertexUvs[0][0][2].x = 0.5;
      geometry.faceVertexUvs[0][0][2].y = 0.5;
      console.log(geometry.faceVertexUvs);

      return new THREE.Mesh(geometry, material);
    }
  }, {
    key: 'lighting',
    value: function lighting() {
      //const spotLight = new THREE.SpotLight(0xffffff);
      //spotLight.position.set(0, 0, 100);
      //this.scene.add(spotLight);
      var ambientLight = new THREE.AmbientLight(0xffffff);
      this.scene.add(ambientLight);
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
      //this.curve.rotation.y += 0.02;
      this.renderer.render(this.scene, this.camera);
    }
  }]);

  return ThreeJS;
}();

},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJlczIwMTUvY2FudmFzLmpzIiwiZXMyMDE1L2Rpc2suanMiLCJlczIwMTUvZXVjbGlkLmpzIiwiZXMyMDE1L21haW4uanMiLCJlczIwMTUvcmVndWxhclRlc3NlbGF0aW9uLmpzIiwiZXMyMDE1L3RocmVlanMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDS2EsTUFBTTtBQUNqQixXQURXLE1BQU0sR0FDSjswQkFERixNQUFNOztBQUVmLFFBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQyxRQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQzs7O0FBQUMsQUFHeEMsUUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztBQUN0QyxRQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVzs7O0FBQUMsQUFHeEMsUUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQztHQUVuRTs7O0FBQUE7ZUFaVSxNQUFNOzs0QkFnQlQsQ0FBQyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBQztBQUMzQyxVQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ3JCLFVBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLEtBQUssR0FBRyxXQUFXLENBQUMsQ0FBQztBQUNq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QUFDLEdBQUMsRUFBRSxDQUFDLENBQUMsR0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUUsRUFBRSxDQUFDLENBQUMsR0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxDQUFBLElBQUcsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUEsQUFBQyxDQUFDO0FBQ3pHLE1BQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUMsRUFBRSxDQUFDLENBQUMsR0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQSxBQUFDLEdBQUMsRUFBRSxDQUFDLENBQUMsSUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBQSxJQUFHLENBQUMsR0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQSxBQUFDLENBQUM7QUFDdkcsTUFBSSxNQUFNLEdBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUMsQ0FBQyxHQUFDLENBQUMsR0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEMsU0FBTztBQUNMLFVBQU0sRUFBRTtBQUNOLE9BQUMsRUFBRSxDQUFDO0FBQ0osT0FBQyxFQUFFLENBQUM7S0FDTDtBQUNELFVBQU0sRUFBRSxNQUFNO0dBQ2YsQ0FBQTtDQUNGOzs7Ozs7QUFBQSxBQU1NLElBQU0sZUFBZSxXQUFmLGVBQWUsR0FBRyxTQUFsQixlQUFlLENBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFLO0FBQ2pELE1BQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDYixNQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2IsTUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNiLE1BQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDYixNQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxJQUFLLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxJQUFLLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxDQUFDLENBQUM7O0FBRTVELE1BQUksR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQSxJQUFLLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFBLEFBQUMsSUFBSSxJQUFJLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQSxBQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQSxBQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRXBHLE1BQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxHQUFJLENBQUMsR0FBRyxBQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxJQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQSxBQUFDLElBQUssQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUEsQUFBQyxDQUFDO0FBQ2pGLE1BQUksRUFBRSxHQUFHLFFBQVEsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUEsQUFBQyxDQUFDO0FBQ3RELE1BQUksRUFBRSxHQUFHLFFBQVEsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUEsQUFBQyxDQUFDOztBQUV0RCxNQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsR0FBSSxDQUFDLEdBQUcsQUFBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsSUFBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUEsQUFBQyxJQUFLLENBQUMsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFBLEFBQUMsQ0FBQztBQUNqRixNQUFJLEVBQUUsR0FBRyxRQUFRLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFBLEFBQUMsQ0FBQztBQUN0RCxNQUFJLEVBQUUsR0FBRyxRQUFRLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFBLEFBQUMsQ0FBQzs7QUFFdEQsTUFBSSxFQUFFLEdBQUc7QUFDUCxLQUFDLEVBQUUsRUFBRTtBQUNMLEtBQUMsRUFBRSxFQUFFO0dBQ04sQ0FBQTs7QUFFRCxNQUFJLEVBQUUsR0FBRztBQUNQLEtBQUMsRUFBRSxFQUFFO0FBQ0wsS0FBQyxFQUFFLEVBQUU7R0FDTixDQUFBOztBQUVELFNBQU87QUFDTCxNQUFFLEVBQUUsRUFBRTtBQUNOLE1BQUUsRUFBRSxFQUFFO0dBQ1AsQ0FBQztDQUNILENBQUE7O0FBRU0sSUFBTSxtQkFBbUIsV0FBbkIsbUJBQW1CLEdBQUcsU0FBdEIsbUJBQW1CLENBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFLOztBQUVuRCxNQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQzs7QUFBQyxBQUUzQixNQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQSxHQUFFLENBQUMsQ0FBQztBQUMzQixNQUFNLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQSxHQUFFLENBQUM7OztBQUFDLEFBRzNCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUEsQUFBQyxHQUFHLEVBQUUsSUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUEsQUFBQyxDQUFDO0FBQ3pDLE1BQU0sQ0FBQyxHQUFJLEVBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFDOzs7QUFBQyxBQUc5QyxNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQzs7O0FBQUMsQUFHMUIsTUFBRyxFQUFFLEdBQUcsQ0FBQyxFQUFDO0FBQ1IsUUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBRSxDQUFDLEdBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBQyxFQUFFLENBQUM7O0FBQUMsQUFFbkMsUUFBTSxFQUFFLEdBQUc7QUFDVCxPQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUMsRUFBRSxDQUFBLEdBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ25CLE9BQUMsRUFBRSxDQUFDLENBQUMsR0FBQyxFQUFFLENBQUEsR0FBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7S0FDcEI7O0FBQUEsQUFFRCxRQUFNLEVBQUUsR0FBRztBQUNULE9BQUMsRUFBRSxDQUFDLENBQUMsR0FBQyxFQUFFLENBQUEsR0FBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDbkIsT0FBQyxFQUFFLENB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Q0FBQyxNQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsTUFBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsVUFBSyxHQUFHLENBQUMsTUFBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLE1BQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDOztHQUNoQzs7O0FBQUE7ZUFoQlUsa0JBQWtCOzt3Q0FtQlY7QUFDakIsVUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuQyxVQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7QUFBQyxBQUVuQyxVQUFNLENBQUMsR0FBRyxDQUFDLEdBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxBQUFDLENBQUMsR0FBQyxDQUFDLElBQUcsQ0FBQyxHQUFDLENBQUMsQ0FBQSxBQUFDLEdBQUUsQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUNsRCxVQUFNLENBQUMsR0FBRyxDQUFDLEdBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUUsQUFBQyxDQUFDLEdBQUMsQ0FBQyxJQUFHLENBQUMsR0FBQyxDQUFDLENBQUEsQUFBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUNsRCxVQUFNLENBQUMsR0FBRztBQUNSLFNBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLFNBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7T0FDekMsQ0FBQTs7QUFFRCxVQUFNLE1BQU0sR0FBRyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUs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LENBQUMsWUFBTTtBQUMxQixlQUFLLE1BQU0sRUFBRSxDQUFBO09BQ2QsQ0FBQzs7QUFBQyxBQUVILFVBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQy9DOzs7U0FySFUsT0FBTyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyAqXG4vLyAqICBDQU5WQVMgQ0xBU1Ncbi8vICpcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbmV4cG9ydCBjbGFzcyBDYW52YXN7XG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdjYW52YXMnKTtcbiAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICAvL2Z1bGxzY3JlZW5cbiAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuICAgIC8vdHJhbnNmb3JtIHRoZSBjYW52YXMgc28gdGhlIG9yaWdpbiBpcyBhdCB0aGUgY2VudHJlIG9mIHRoZSBkaXNrXG4gICAgdGhpcy5jdHgudHJhbnNsYXRlKHdpbmRvdy5pbm5lcldpZHRoIC8gMiwgd2luZG93LmlubmVySGVpZ2h0IC8gMik7XG5cbiAgfVxuXG5cbiAgLy9kcmF3IGEgaHlwZXJib2xpYyBsaW5lIHNlZ21lbnQgdXNpbmcgY2FsY3VsYXRpb25zIGZyb20gbGluZSgpIG9yIGFyYygpXG4gIHNlZ21lbnQoYywgYWxwaGEsIGFscGhhT2Zmc2V0LCBjb2xvdXIsIHdpZHRoKXtcbiAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICB0aGlzLmN0eC5hcmMoYy5jZW50cmUueCwgYy5jZW50cmUueSwgYy5yYWRpdXMsIGFscGhhT2Zmc2V0LCBhbHBoYSArIGFscGhhT2Zmc2V0KTtcbiAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IGNvbG91ciB8fCAnYmxhY2snO1xuICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IHdpZHRoIHx8IDE7XG4gICAgdGhpcy5jdHguc3Ryb2tlKCk7XG4gIH1cblxuICAvL2RyYXcgYSAoZXVjbGlkZWFuKSBsaW5lIGJldHdlZW4gdHdvIHBvaW50c1xuICBldWNsaWRlYW5MaW5lKHAxLCBwMiwgY29sb3VyLCB3aWR0aCl7XG4gICAgY29uc3QgYyA9IGNvbG91ciB8fCAnYmxhY2snO1xuICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgIHRoaXMuY3R4Lm1vdmVUbyhwMS54LCBwMS55KTtcbiAgICB0aGlzLmN0eC5saW5lVG8ocDIueCwgcDIueSk7XG4gICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBjO1xuICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IHdpZHRoIHx8IDE7XG4gICAgdGhpcy5jdHguc3Ryb2tlKClcbiAgfVxuXG4gIC8vZHJhdyBhIHBvaW50IG9uIHRoZSBkaXNrLCBvcHRpb25hbCByYWRpdXMgYW5kIGNvbG91clxuICBwb2ludChwb2ludCwgcmFkaXVzLCBjb2xvdXIpe1xuICAgIGNvbnN0IGNvbCA9IGNvbG91ciB8fCAnYmxhY2snO1xuICAgIGNvbnN0IHIgPSByYWRpdXMgfHwgMjtcbiAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICB0aGlzLmN0eC5hcmMocG9pbnQueCwgcG9pbnQueSwgciwgMCwgTWF0aC5QSSAqIDIsIHRydWUpO1xuICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGNvbDtcbiAgICB0aGlzLmN0eC5maWxsKCk7XG4gIH1cblxuICAvL2RyYXcgYSBjaXJjbGUgb2YgcmFkaXVzIHIgY2VudHJlIGMgYW5kIG9wdGlvbmFsIGNvbG91clxuICBjaXJjbGUoYywgciwgY29sb3VyLCB3aWR0aCl7XG4gICAgY29uc3QgY29sID0gY29sb3VyIHx8ICdibGFjayc7XG4gICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgdGhpcy5jdHguYXJjKGMueCwgYy55LCByLCAwLCBNYXRoLlBJICogMik7XG4gICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBjb2w7XG4gICAgdGhpcy5jdHgubGluZVdpZHRoID0gd2lkdGggfHwgMTtcbiAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgfVxuXG4gIC8vY29udmVydCB0aGUgY2FudmFzIHRvIGEgYmFzZTY0VVJMIGFuZCBzZW5kIHRvIHNhdmVJbWFnZS5waHBcbiAgc2F2ZUltYWdlKCl7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuY2FudmFzLnRvRGF0YVVSTCgpO1xuICAgICQuYWpheCh7XG4gICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICB1cmw6ICdzYXZlSW1hZ2UucGhwJyxcbiAgICAgIGRhdGE6IHsgaW1nOiBkYXRhIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vdGhlIGNhbnZhcyBoYXMgYmVlbiB0cmFuc2xhdGVkIHRvIHRoZSBjZW50cmUgb2YgdGhlIGRpc2sgc28gbmVlZCB0b1xuICAvL3VzZSBhbiBvZmZzZXQgdG8gY2xlYXIgaXQuIE5PVCBXT1JLSU5HIFdIRU4gU0NSRUVOIElTIFJFU0laRURcbiAgY2xlYXJTY3JlZW4oKSB7XG4gICAgdGhpcy5jdHguY2xlYXJSZWN0KC13aW5kb3cuaW5uZXJXaWR0aC8yLC13aW5kb3cuaW5uZXJIZWlnaHQvMixcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICB9XG5cbn1cbiIsImltcG9ydCAqIGFzIEUgZnJvbSAnLi9ldWNsaWQnO1xuaW1wb3J0IHsgQ2FudmFzIH0gZnJvbSAnLi9jYW52YXMnO1xuXG4vLyAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyAqXG4vLyAqICAgRElTSyBDTEFTU1xuLy8gKiAgIFBvaW5jYXJlIERpc2sgcmVwcmVzZW50YXRpb24gb2YgdGhlIGh5cGVyYm9saWMgcGxhbmVcbi8vICogICBDb250YWlucyBhbnkgZnVuY3Rpb25zIHVzZWQgdG8gZHJhdyB0byB0aGUgZGlza1xuLy8gKiAgIENvbnN0cnVjdG9yIHRha2VzIHRoZSBkcmF3aW5nIGNsYXNzIGFzIGFuIGFyZ3VtZW50XG4vLyAqICAgKEN1cnJlbnRseSBvbmx5IENhbnZhcyB1c2VkLCBtaWdodCBzd2l0Y2ggdG8gV2ViR0wgaW4gZnV0dXJlKVxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuZXhwb3J0IGNsYXNzIERpc2sge1xuICBjb25zdHJ1Y3RvcihkcmF3Q2xhc3MpIHtcbiAgICBkcmF3Q2xhc3MgPSBkcmF3Q2xhc3MgfHwgJ2NhbnZhcyc7XG4gICAgaWYoZHJhd0NsYXNzID09PSAnY2FudmFzJyl7XG4gICAgICB0aGlzLmRyYXcgPSBuZXcgQ2FudmFzKCk7XG4gICAgfVxuICAgIHRoaXMuZHJhdy5jbGVhclNjcmVlbigpO1xuXG4gICAgdGhpcy5jZW50cmUgPSB7XG4gICAgICB4OiAwLFxuICAgICAgeTogMFxuICAgIH1cblxuICAgIC8vZHJhdyBsYXJnZXN0IGNpcmNsZSBwb3NzaWJsZSBnaXZlbiB3aW5kb3cgZGltc1xuICAgIHRoaXMucmFkaXVzID0gKHdpbmRvdy5pbm5lcldpZHRoIDwgd2luZG93LmlubmVySGVpZ2h0KSA/ICh3aW5kb3cuaW5uZXJXaWR0aCAvIDIpIC0gNSA6ICh3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKSAtIDU7XG5cbiAgICAvL3NtYWxsZXIgY2lyY2xlIGZvciB0ZXN0aW5nXG4gICAgLy8gL3RoaXMucmFkaXVzID0gdGhpcy5yYWRpdXMgLyAzO1xuXG4gICAgdGhpcy5vdXRlckNpcmNsZSgpO1xuICB9XG5cbiAgLy9kcmF3IHRoZSBib3VuZGFyeSBjaXJjbGVcbiAgb3V0ZXJDaXJjbGUoKSB7XG4gICAgdGhpcy5kcmF3LmNpcmNsZSh7eDogdGhpcy5jZW50cmUueCwgeTogdGhpcy5jZW50cmUueX0sIHRoaXMucmFkaXVzKTtcbiAgfVxuXG4gIC8vZHJhdyBhIGh5cGVyYm9saWMgbGluZSBiZXR3ZWVuIHR3byBwb2ludHMgb24gdGhlIGJvdW5kYXJ5IGNpcmNsZVxuICBsaW5lKHAxLCBwMiwgY29sb3VyKSB7XG4gICAgLy9sZXQgcHRzID0gdGhpcy5wcmVwUG9pbnRzKHAxLCBwMik7XG4gICAgLy9wMSA9IHB0cy5wMTtcbiAgICAvL3AyID0gcHRzLnAyO1xuICAgIGxldCBjb2wgPSBjb2xvdXIgfHwgJ2JsYWNrJztcbiAgICBsZXQgYywgcG9pbnRzO1xuXG4gICAgaWYoRS50aHJvdWdoT3JpZ2luKHAxLHAyKSl7XG4gICAgICBsZXQgdSA9IG5vcm1hbFZlY3RvcihwMSxwMik7XG4gICAgICBwb2ludHMgPSB7XG4gICAgICAgIHAxOiB7XG4gICAgICAgICAgeDogdS54ICogdGhpcy5yYWRpdXMsXG4gICAgICAgICAgeTogdS55ICogdGhpcy5yYWRpdXNcbiAgICAgICAgfSxcbiAgICAgICAgcDI6IHtcbiAgICAgICAgICB4OiAtdS54ICogdGhpcy5yYWRpdXMsXG4gICAgICAgICAgeTogLXUueSAqIHRoaXMucmFkaXVzXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuZHJhdy5ldWNsaWRlYW5MaW5lKHBvaW50cy5wMSxwb2ludHMucDIsIGNvbCk7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICBjID0gRS5ncmVhdENpcmNsZShwMSwgcDIsIHRoaXMucmFkaXVzLCB0aGlzLmNlbnRyZSk7XG4gICAgICBwb2ludHMgPSBFLmNpcmNsZUludGVyc2VjdCh0aGlzLmNlbnRyZSwgYy5jZW50cmUsIHRoaXMucmFkaXVzLCBjLnJhZGl1cyk7XG5cbiAgICAgIC8vYW5nbGUgc3VidGVuZGVkIGJ5IHRoZSBhcmNcbiAgICAgIGxldCBhbHBoYSA9IEUuY2VudHJhbEFuZ2xlKHBvaW50cy5wMSwgcG9pbnRzLnAyLCBjLnJhZGl1cyk7XG5cbiAgICAgIGxldCBvZmZzZXQgPSB0aGlzLmFscGhhT2Zmc2V0KHBvaW50cy5wMiwgcG9pbnRzLnAyLCBjLCAnbGluZScpO1xuICAgICAgdGhpcy5kcmF3LnNlZ21lbnQoYywgYWxwaGEsIG9mZnNldCwgY29sKTtcbiAgICB9XG4gIH1cblxuICAvL2NhbGN1bGF0ZSB0aGUgb2Zmc2V0IChwb3NpdGlvbiBhcm91bmQgdGhlIGNpcmNsZSBmcm9tIHdoaWNoIHRvIHN0YXJ0IHRoZVxuICAvL2xpbmUgb3IgYXJjKS4gQXMgY2FudmFzIGRyYXdzIGFyY3MgY2xvY2t3aXNlIGJ5IGRlZmF1bHQgdGhpcyB3aWxsIGNoYW5nZVxuICAvL2RlcGVuZGluZyBvbiB3aGVyZSB0aGUgYXJjIGlzIHJlbGF0aXZlIHRvIHRoZSBvcmlnaW5cbiAgLy9zcGVjaWZpY2FsbCB3aGV0aGVyIGl0IGxpZXMgb24gdGhlIHggYXhpcywgb3IgYWJvdmUgb3IgYmVsb3cgaXRcbiAgLy90eXBlID0gJ2xpbmUnIG9yICdhcmMnXG4gIGFscGhhT2Zmc2V0KHAxLCBwMiwgYywgdHlwZSkge1xuICAgIGxldCBvZmZzZXQ7XG5cbiAgICAvL3BvaW50cyBhdCAwIHJhZGlhbnMgb24gZ3JlYXRDaXJjbGVcbiAgICBsZXQgcCA9IHtcbiAgICAgIHg6IGMuY2VudHJlLnggKyBjLnJhZGl1cyxcbiAgICAgIHk6IGMuY2VudHJlLnlcbiAgICB9XG5cbiAgICBpZihwMS55IDwgYy5jZW50cmUueSl7XG4gICAgICBvZmZzZXQgPSAyKk1hdGguUEkgLSBFLmNlbnRyYWxBbmdsZShwMSwgcCwgYy5yYWRpdXMpO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgb2Zmc2V0ID0gRS5jZW50cmFsQW5nbGUocDEsIHAsIGMucmFkaXVzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb2Zmc2V0O1xuICB9XG5cbiAgLy9wdXQgcG9pbnRzIGluIGNsb2Nrd2lzZSBvcmRlclxuICBwcmVwUG9pbnRzKHAxLCBwMiwgYyl7XG4gICAgY29uc3QgcCA9IHt4OiBjLmNlbnRyZS54ICsgYy5yYWRpdXMsIHk6IGMuY2VudHJlLnl9O1xuICAgIC8vY2FzZSB3aGVyZSBwb2ludHMgYXJlIGFib3ZlIGFuZCBiZWxvdyB0aGUgbGluZSBjLmNlbnRyZSAtPiBwXG4gICAgLy9pbiB0aGlzIGNhc2UganVzdCByZXR1cm4gcG9pbnRzXG4gICAgY29uc3Qgb3kgPSBjLmNlbnRyZS55O1xuICAgIGNvbnN0IG94ID0gYy5jZW50cmUueDtcblxuICAgIGlmKHAxLnggPiBveCAmJiBwMi54ID4gb3gpe1xuICAgICAgaWYocDEueSA+IG95ICYmIHAyLnkgPCBveSkgcmV0dXJuIHtwMTogcDIsIHAyOiBwMX07XG4gICAgICBlbHNlIGlmKHAxLnkgPCBveSAmJiBwMi55ID4gb3kpIHJldHVybiB7cDE6IHAxLCBwMjogcDJ9O1xuICAgIH1cblxuICAgIGxldCBhbHBoYTEgPSBFLmNlbnRyYWxBbmdsZShwLCBwMSwgYy5yYWRpdXMpO1xuICAgIGFscGhhMSA9IChwMS55IDwgYy5jZW50cmUueSkgPyAyKk1hdGguUEkgLSBhbHBoYTEgOiBhbHBoYTE7XG4gICAgbGV0IGFscGhhMiA9IEUuY2VudHJhbEFuZ2xlKHAsIHAyLCBjLnJhZGl1cyk7XG4gICAgYWxwaGEyID0gKHAyLnkgPCBjLmNlbnRyZS55KSA/IDIqTWF0aC5QSSAtIGFscGhhMiA6IGFscGhhMjtcblxuICAgIC8vaWYgdGhlIHBvaW50cyBhcmUgbm90IGluIGNsb2Nrd2lzZSBvcmRlciBmbGlwIHRoZW1cbiAgICBpZihhbHBoYTEgPiBhbHBoYTIpIHJldHVybiB7cDE6IHAyLCBwMjogcDF9O1xuICAgIGVsc2UgcmV0dXJuIHtwMTogcDEsIHAyOiBwMn07XG5cbiAgfVxuXG4gIC8vRHJhdyBhbiBhcmMgKGh5cGVyYm9saWMgbGluZSBzZWdtZW50KSBiZXR3ZWVuIHR3byBwb2ludHMgb24gdGhlIGRpc2tcbiAgYXJjKHAxLCBwMiwgY29sb3VyKSB7XG4gICAgaWYoRS50aHJvdWdoT3JpZ2luKHAxLHAyKSl7XG4gICAgICB0aGlzLmRyYXcuZXVjbGlkZWFuTGluZShwMSxwMiwgY29sb3VyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IGNvbCA9IGNvbG91ciB8fCAnYmxhY2snO1xuICAgIGxldCBjID0gRS5ncmVhdENpcmNsZShwMSwgcDIsIHRoaXMucmFkaXVzLCB0aGlzLmNlbnRyZSk7XG4gICAgbGV0IHB0cyA9IHRoaXMucHJlcFBvaW50cyhwMSwgcDIsIGMpO1xuICAgIHAxID0gcHRzLnAxO1xuICAgIHAyID0gcHRzLnAyO1xuXG4gICAgLy9sZW5ndGggb2YgdGhlIGFyY1xuICAgIGxldCBhbHBoYSA9IEUuY2VudHJhbEFuZ2xlKHAxLCBwMiwgYy5yYWRpdXMpO1xuXG4gICAgLy9ob3cgZmFyIGFyb3VuZCB0aGUgZ3JlYXRDaXJjbGUgdG8gc3RhcnQgZHJhd2luZyB0aGUgYXJjXG4gICAgbGV0IG9mZnNldCA9IHRoaXMuYWxwaGFPZmZzZXQocDEsIHAyLCBjLCAnYXJjJyk7XG4gICAgdGhpcy5kcmF3LnNlZ21lbnQoYywgYWxwaGEsIG9mZnNldCwgY29sb3VyKTtcbiAgfVxuXG4gIHBvbHlnb24odmVydGljZXMsIGNvbG91cikge1xuICAgIGxldCBsID0gdmVydGljZXMubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICB0aGlzLmFyYyh2ZXJ0aWNlc1tpXSwgdmVydGljZXNbKGkgKyAxKSVsXSwgY29sb3VyKTtcbiAgICB9XG4gIH1cblxuICAvL3JldHVybiB0cnVlIGlmIHRoZSBwb2ludCBpcyBub3QgaW4gdGhlIGRpc2tcbiAgY2hlY2tQb2ludChwb2ludCkge1xuICAgIGxldCByID0gdGhpcy5yYWRpdXM7XG4gICAgaWYgKEUuZGlzdGFuY2UocG9pbnQsIHRoaXMuY2VudHJlKSA+IHIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yISBQb2ludCAoJyArIHBvaW50LnggKyAnLCAnICsgcG9pbnQueSArICcpIGxpZXMgb3V0c2lkZSB0aGUgcGxhbmUhJyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG4iLCIvLyAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyAqXG4vLyAqICAgRVVDTElERUFOIEZVTkNUSU9OU1xuLy8gKiAgIGFsbCBFdWNsaWRlYW4gbWF0aGVtYXRpY2FsIGZ1bmN0aW9ucyBnbyBoZXJlXG4vLyAqXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbi8vZGlzdGFuY2UgYmV0d2VlbiB0d28gcG9pbnRzXG5leHBvcnQgY29uc3QgZGlzdGFuY2UgPSAocDEsIHAyKSA9PiBNYXRoLnNxcnQoTWF0aC5wb3coKHAyLnggLSBwMS54KSwgMikgKyBNYXRoLnBvdygocDIueSAtIHAxLnkpLCAyKSk7XG5cbi8vbWlkcG9pbnQgb2YgdGhlIGxpbmUgc2VnbWVudCBjb25uZWN0aW5nIHR3byBwb2ludHNcbmV4cG9ydCBjb25zdCBtaWRwb2ludCA9IChwMSwgcDIpID0+IHtcbiAgcmV0dXJuIHtcbiAgICB4OiAocDEueCArIHAyLngpIC8gMixcbiAgICB5OiAocDEueSArIHAyLnkpIC8gMlxuICB9XG59XG5cbi8vc2xvcGUgb2YgbGluZSB0aHJvdWdoIHAxLCBwMlxuZXhwb3J0IGNvbnN0IHNsb3BlID0gKHAxLCBwMikgPT4gKHAyLnggLSBwMS54KSAvIChwMi55IC0gcDEueSk7XG5cbi8vc2xvcGUgb2YgbGluZSBwZXJwZW5kaWN1bGFyIHRvIGEgbGluZSBkZWZpbmVkIGJ5IHAxLHAyXG5leHBvcnQgY29uc3QgcGVycGVuZGljdWxhclNsb3BlID0gKHAxLCBwMikgPT4gLTEgLyAoTWF0aC5wb3coc2xvcGUocDEsIHAyKSwgLTEpKTtcblxuLy9pbnRlcnNlY3Rpb24gcG9pbnQgb2YgdHdvIGxpbmVzIGRlZmluZWQgYnkgcDEsbTEgYW5kIHExLG0yXG4vL05PVCBXT1JLSU5HIEZPUiBWRVJUSUNBTCBMSU5FUyEhIVxuZXhwb3J0IGNvbnN0IGludGVyc2VjdGlvbiA9IChwMSwgbTEsIHAyLCBtMikgPT4ge1xuICBsZXQgYzEsIGMyLCB4LCB5O1xuICAvL2Nhc2Ugd2hlcmUgZmlyc3QgbGluZSBpcyB2ZXJ0aWNhbFxuICAvL2lmKG0xID4gNTAwMCB8fCBtMSA8IC01MDAwIHx8IG0xID09PSBJbmZpbml0eSl7XG4gIGlmKHAxLnkgPCAwLjAwMDAwMSAmJiBwMS55ID4gLTAuMDAwMDAxICl7XG4gICAgeCA9IHAxLng7XG4gICAgeSA9IChtMikqKHAxLngtcDIueCkgKyBwMi55O1xuICB9XG4gIC8vY2FzZSB3aGVyZSBzZWNvbmQgbGluZSBpcyB2ZXJ0aWNhbFxuICAvL2Vsc2UgaWYobTIgPiA1MDAwIHx8IG0yIDwgLTUwMDAgfHwgbTEgPT09IEluZmluaXR5KXtcbiAgZWxzZSBpZihwMi55IDwgMC4wMDAwMDEgJiYgcDIueSA+IC0wLjAwMDAwMSApe1xuICAgIHggPSBwMi54O1xuICAgIHkgPSAobTEqKHAyLngtcDEueCkpICsgcDEueTtcbiAgfVxuICBlbHNle1xuICAgIC8veSBpbnRlcmNlcHQgb2YgZmlyc3QgbGluZVxuICAgIGMxID0gcDEueSAtIG0xICogcDEueDtcbiAgICAvL3kgaW50ZXJjZXB0IG9mIHNlY29uZCBsaW5lXG4gICAgYzIgPSBwMi55IC0gbTIgKiBwMi54O1xuXG4gICAgeCA9IChjMiAtIGMxKSAvIChtMSAtIG0yKTtcbiAgICB5ID0gbTEgKiB4ICsgYzE7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHg6IHgsXG4gICAgeTogeVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCByYWRpYW5zID0gKGRlZ3JlZXMpID0+IChNYXRoLlBJIC8gMTgwKSAqIGRlZ3JlZXM7XG5cbi8vZ2V0IHRoZSBjaXJjbGUgaW52ZXJzZSBvZiBhIHBvaW50IHAgd2l0aCByZXNwZWN0IGEgY2lyY2xlIHJhZGl1cyByIGNlbnRyZSBjXG5leHBvcnQgY29uc3QgaW52ZXJzZSA9IChwLCByLCBjKSA9PiB7XG4gIGxldCBhbHBoYSA9IChyICogcikgLyAoTWF0aC5wb3cocC54IC0gYy54LCAyKSArIE1hdGgucG93KHAueSAtIGMueSwgMikpO1xuICByZXR1cm4ge1xuICAgIHg6IGFscGhhICogKHAueCAtIGMueCkgKyBjLngsXG4gICAgeTogYWxwaGEgKiAocC55IC0gYy55KSArIGMueVxuICB9O1xufVxuXG4vL2NhbGN1bGF0ZSB0aGUgcmFkaXVzIGFuZCBjZW50cmUgb2YgdGhlIGNpcmNsZSByZXF1aXJlZCB0byBkcmF3IGEgbGluZSBiZXR3ZWVuXG4vL3R3byBwb2ludHMgaW4gdGhlIGh5cGVyYm9saWMgcGxhbmUgZGVmaW5lZCBieSB0aGUgZGlzayAociwgYylcbmV4cG9ydCBjb25zdCBncmVhdENpcmNsZSA9IChwMSwgcDIsIHIsIGMpID0+IHtcbiAgbGV0IHAxSW52ZXJzZSA9IGludmVyc2UocDEsIHIsIGMpO1xuICBsZXQgcDJJbnZlcnNlID0gaW52ZXJzZShwMiwgciwgYyk7XG5cbiAgbGV0IG0gPSBtaWRwb2ludChwMSwgcDFJbnZlcnNlKTtcbiAgbGV0IG4gPSBtaWRwb2ludChwMiwgcDJJbnZlcnNlKTtcblxuICBsZXQgbTEgPSBwZXJwZW5kaWN1bGFyU2xvcGUobSwgcDFJbnZlcnNlKTtcbiAgbGV0IG0yID0gcGVycGVuZGljdWxhclNsb3BlKG4sIHAySW52ZXJzZSk7XG5cblxuICAvL2NlbnRyZSBpcyB0aGUgY2VudHJlcG9pbnQgb2YgdGhlIGNpcmNsZSBvdXQgb2Ygd2hpY2ggdGhlIGFyYyBpcyBtYWRlXG4gIGxldCBjZW50cmUgPSBpbnRlcnNlY3Rpb24obSwgbTEsIG4sIG0yKTtcbiAgbGV0IHJhZGl1cyA9IGRpc3RhbmNlKGNlbnRyZSwgcDEpO1xuICByZXR1cm4ge1xuICAgIGNlbnRyZTogY2VudHJlLFxuICAgIHJhZGl1czogcmFkaXVzXG4gIH07XG59XG5cbi8vYW4gYXR0ZW1wdCBhdCBjYWxjdWxhdGluZyB0aGUgY2lyY2xlIGFsZ2VicmFpY2FsbHlcbmV4cG9ydCBjb25zdCBncmVhdENpcmNsZVYyID0gKHAxLHAyLCByKSA9PntcbiAgbGV0IHggPSAocDIueSoocDEueCpwMS54ICsgcikrIHAxLnkqcDEueSpwMi55LXAxLnkqKHAyLngqcDIueCsgcDIueSpwMi55ICsgcikpLygyKnAxLngqcDIueSAtIHAxLnkqcDIueCk7XG4gIGxldCB5ID0gKHAxLngqcDEueCpwMi54IC0gcDEueCoocDIueCpwMi54K3AyLnkqcDIueStyKStwMi54KihwMS55KnAxLnkrcikpLygyKnAxLnkqcDIueCArIDIqcDEueCpwMi55KTtcbiAgbGV0IHJhZGl1cyA9ICAgTWF0aC5zcXJ0KHgqeCt5Knktcik7XG4gIHJldHVybiB7XG4gICAgY2VudHJlOiB7XG4gICAgICB4OiB4LFxuICAgICAgeTogeVxuICAgIH0sXG4gICAgcmFkaXVzOiByYWRpdXNcbiAgfVxufVxuXG4vL2ludGVyc2VjdGlvbiBvZiB0d28gY2lyY2xlcyB3aXRoIGVxdWF0aW9uczpcbi8vKHgtYSleMiArKHktYSleMiA9IHIwXjJcbi8vKHgtYileMiArKHktYyleMiA9IHIxXjJcbi8vTk9URSBhc3N1bWVzIHRoZSB0d28gY2lyY2xlcyBETyBpbnRlcnNlY3QhXG5leHBvcnQgY29uc3QgY2lyY2xlSW50ZXJzZWN0ID0gKGMwLCBjMSwgcjAsIHIxKSA9PiB7XG4gIGxldCBhID0gYzAueDtcbiAgbGV0IGIgPSBjMC55O1xuICBsZXQgYyA9IGMxLng7XG4gIGxldCBkID0gYzEueTtcbiAgbGV0IGRpc3QgPSBNYXRoLnNxcnQoKGMgLSBhKSAqIChjIC0gYSkgKyAoZCAtIGIpICogKGQgLSBiKSk7XG5cbiAgbGV0IGRlbCA9IE1hdGguc3FydCgoZGlzdCArIHIwICsgcjEpICogKGRpc3QgKyByMCAtIHIxKSAqIChkaXN0IC0gcjAgKyByMSkgKiAoLWRpc3QgKyByMCArIHIxKSkgLyA0O1xuXG4gIGxldCB4UGFydGlhbCA9IChhICsgYykgLyAyICsgKChjIC0gYSkgKiAocjAgKiByMCAtIHIxICogcjEpKSAvICgyICogZGlzdCAqIGRpc3QpO1xuICBsZXQgeDEgPSB4UGFydGlhbCAtIDIgKiBkZWwgKiAoYiAtIGQpIC8gKGRpc3QgKiBkaXN0KTtcbiAgbGV0IHgyID0geFBhcnRpYWwgKyAyICogZGVsICogKGIgLSBkKSAvIChkaXN0ICogZGlzdCk7XG5cbiAgbGV0IHlQYXJ0aWFsID0gKGIgKyBkKSAvIDIgKyAoKGQgLSBiKSAqIChyMCAqIHIwIC0gcjEgKiByMSkpIC8gKDIgKiBkaXN0ICogZGlzdCk7XG4gIGxldCB5MSA9IHlQYXJ0aWFsICsgMiAqIGRlbCAqIChhIC0gYykgLyAoZGlzdCAqIGRpc3QpO1xuICBsZXQgeTIgPSB5UGFydGlhbCAtIDIgKiBkZWwgKiAoYSAtIGMpIC8gKGRpc3QgKiBkaXN0KTtcblxuICBsZXQgcDEgPSB7XG4gICAgeDogeDEsXG4gICAgeTogeTFcbiAgfVxuXG4gIGxldCBwMiA9IHtcbiAgICB4OiB4MixcbiAgICB5OiB5MlxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBwMTogcDEsXG4gICAgcDI6IHAyXG4gIH07XG59XG5cbmV4cG9ydCBjb25zdCBjaXJjbGVMaW5lSW50ZXJzZWN0ID0gKGMsIHIsIHAxLCBwMikgPT4ge1xuXG4gIGNvbnN0IGQgPSBkaXN0YW5jZShwMSwgcDIpO1xuICAvL3VuaXQgdmVjdG9yIHAxIHAyXG4gIGNvbnN0IGR4ID0gKHAyLnggLSBwMS54KS9kO1xuICBjb25zdCBkeSA9IChwMi55IC0gcDEueSkvZDtcblxuICAvL3BvaW50IG9uIGxpbmUgY2xvc2VzdCB0byBjaXJjbGUgY2VudHJlXG4gIGNvbnN0IHQgPSBkeCooYy54IC1wMS54KSArIGR5KihjLnktcDEueSk7XG4gIGNvbnN0IHAgPSAge3g6IHQqIGR4ICsgcDEueCwgeTogdCogZHkgKyBwMS55fTtcblxuICAvL2Rpc3RhbmNlIGZyb20gdGhpcyBwb2ludCB0byBjZW50cmVcbiAgY29uc3QgZDIgPSBkaXN0YW5jZShwLCBjKTtcblxuICAvL2xpbmUgaW50ZXJzZWN0cyBjaXJjbGVcbiAgaWYoZDIgPCByKXtcbiAgICBjb25zdCBkdCA9IE1hdGguc3FydCggcipyIC0gZDIqZDIpO1xuICAgIC8vcG9pbnQgMVxuICAgIGNvbnN0IHExID0ge1xuICAgICAgeDogKHQtZHQpKmR4ICsgcDEueCxcbiAgICAgIHk6ICh0LWR0KSpkeSArIHAxLnlcbiAgICB9XG4gICAgLy9wb2ludCAyXG4gICAgY29uc3QgcTIgPSB7XG4gICAgICB4OiAodCtkdCkqZHggKyBwMS54LFxuICAgICAgeTogKHQrZHQpKmR5ICsgcDEueVxuICAgIH1cblxuICAgIHJldHVybiB7cDE6IHExLCBwMjogcTJ9O1xuICB9XG4gIGVsc2UgaWYoIGQyID09PSByKXtcbiAgICByZXR1cm4gcDtcbiAgfVxuICBlbHNle1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yOiBsaW5lIGRvZXMgbm90IGludGVyc2VjdCBjaXJjbGUhJyk7XG4gIH1cbn1cblxuLy9hbmdsZSBpbiByYWRpYW5zIGJldHdlZW4gdHdvIHBvaW50cyBvbiBjaXJjbGUgb2YgcmFkaXVzIHJcbmV4cG9ydCBjb25zdCBjZW50cmFsQW5nbGUgPSAocDEsIHAyLCByKSA9PiB7XG4gIHJldHVybiAyICogTWF0aC5hc2luKDAuNSAqIGRpc3RhbmNlKHAxLCBwMikgLyByKTtcbn1cblxuLy9jYWxjdWxhdGUgdGhlIG5vcm1hbCB2ZWN0b3IgZ2l2ZW4gMiBwb2ludHNcbmV4cG9ydCBjb25zdCBub3JtYWxWZWN0b3IgPSAocDEsIHAyKSA9PiB7XG4gIGxldCBkID0gTWF0aC5zcXJ0KE1hdGgucG93KHAyLngtcDEueCwyKSArIE1hdGgucG93KHAyLnktcDEueSwyKSk7XG4gIHJldHVybiB7XG4gICAgeDogKHAyLngtcDEueCkvZCxcbiAgICB5OiAocDIueS1wMS55KS9kXG4gIH1cbn1cblxuLy9kb2VzIHRoZSBsaW5lIGNvbm5lY3RpbmcgcDEsIHAyIGdvIHRocm91Z2ggdGhlIHBvaW50ICgwLDApP1xuZXhwb3J0IGNvbnN0IHRocm91Z2hPcmlnaW4gPSAocDEsIHAyKSA9PiB7XG4gIGlmKHAxLnggPT09IDAgJiYgcDIueCA9PT0gMCl7XG4gICAgLy92ZXJ0aWNhbCBsaW5lIHRocm91Z2ggY2VudHJlXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgbGV0IHRlc3QgPSAoLXAxLngqcDIueSArIHAxLngqcDEueSkvKHAyLngtcDEueCkgKyBwMS55O1xuICBpZih0ZXN0ID09PSAwKSByZXR1cm4gdHJ1ZTtcbiAgZWxzZSByZXR1cm4gZmFsc2U7XG59XG5cbi8vZmluZCB0aGUgY2VudHJvaWQgb2YgYSBub24tc2VsZi1pbnRlcnNlY3RpbmcgcG9seWdvblxuZXhwb3J0IGNvbnN0IGNlbnRyb2lkT2ZQb2x5Z29uID0gKHBvaW50cykgPT4ge1xuICBsZXQgZmlyc3QgPSBwb2ludHNbMF0sIGxhc3QgPSBwb2ludHNbcG9pbnRzLmxlbmd0aC0xXTtcbiAgaWYgKGZpcnN0LnggIT0gbGFzdC54IHx8IGZpcnN0LnkgIT0gbGFzdC55KSBwb2ludHMucHVzaChmaXJzdCk7XG4gIGxldCB0d2ljZWFyZWE9MCxcbiAgICB4PTAsIHk9MCxcbiAgICBuUHRzID0gcG9pbnRzLmxlbmd0aCxcbiAgICBwMSwgcDIsIGY7XG4gIGZvciAoIHZhciBpPTAsIGo9blB0cy0xIDsgaTxuUHRzIDsgaj1pKysgKSB7XG4gICAgcDEgPSBwb2ludHNbaV07IHAyID0gcG9pbnRzW2pdO1xuICAgIGYgPSBwMS54KnAyLnkgLSBwMi54KnAxLnk7XG4gICAgdHdpY2VhcmVhICs9IGY7XG4gICAgeCArPSAoIHAxLnggKyBwMi54ICkgKiBmO1xuICAgIHkgKz0gKCBwMS55ICsgcDIueSApICogZjtcbiAgfVxuICBmID0gdHdpY2VhcmVhICogMztcbiAgcmV0dXJuIHsgeDp4L2YsIHk6eS9mIH07XG59XG5cbi8vY29tcGFyZSB0d28gcG9pbnRzIHRha2luZyByb3VuZGluZyBlcnJvcnMgaW50byBhY2NvdW50XG5leHBvcnQgY29uc3QgY29tcGFyZVBvaW50cyA9IChwMSwgcDIpID0+IHtcbiAgaWYodHlwZW9mIHAxID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgcDIgPT09ICd1bmRlZmluZWQnKXtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBwMSA9IHBvaW50VG9GaXhlZChwMSwgNik7XG4gIHAyID0gcG9pbnRUb0ZpeGVkKHAyLCA2KTtcbiAgaWYocDEueCA9PT0gcDIueCAmJiBwMS55ID09PSBwMi55KSByZXR1cm4gdHJ1ZTtcbiAgZWxzZSByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBjb25zdCBwb2ludFRvRml4ZWQgPSAocCwgcGxhY2VzKSA9PiB7XG4gIHJldHVybiB7XG4gICAgeDogcC54LnRvRml4ZWQocGxhY2VzKSxcbiAgICB5OiBwLnkudG9GaXhlZChwbGFjZXMpXG4gIH07XG59XG5cbi8qXG4vL2ZsaXAgYSBzZXQgb2YgcG9pbnRzIG92ZXIgYSBoeXBlcm9ibGljIGxpbmUgZGVmaW5lZCBieSB0d28gcG9pbnRzXG5leHBvcnQgY29uc3QgdHJhbnNmb3JtID0gKHBvaW50c0FycmF5LCBwMSwgcDIpID0+IHtcbiAgbGV0IG5ld1BvaW50c0FycmF5ID0gW107XG4gIGxldCBjID0gRS5ncmVhdENpcmNsZShwMSwgcDIsIGRpc2sucmFkaXVzLCBkaXNrLmNlbnRyZSk7XG5cbiAgZm9yKGxldCBwIG9mIHBvaW50c0FycmF5KXtcbiAgICBsZXQgbmV3UCA9IEUuaW52ZXJzZShwLCBjLnJhZGl1cywgYy5jZW50cmUpO1xuICAgIG5ld1BvaW50c0FycmF5LnB1c2gobmV3UCk7XG4gIH1cbiAgcmV0dXJuIG5ld1BvaW50c0FycmF5O1xufVxuKi9cbiIsImltcG9ydCB7IFJlZ3VsYXJUZXNzZWxhdGlvbiB9IGZyb20gJy4vcmVndWxhclRlc3NlbGF0aW9uJztcblxuaW1wb3J0IHsgVGhyZWVKUyB9IGZyb20gJy4vdGhyZWVqcyc7XG5cbi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICpcbi8vICogICBTRVRVUFxuLy8gKlxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG5jb25zdCB0aHJlZSA9IG5ldyBUaHJlZUpTKCk7XG5cbi8vY29uc3QgdGVzc2VsYXRpb24gPSBuZXcgUmVndWxhclRlc3NlbGF0aW9uKDUsIDQsIDMqTWF0aC5QSS82KjAsICdyZWQnKTtcbiIsImltcG9ydCAqIGFzIEUgZnJvbSAnLi9ldWNsaWQnO1xuaW1wb3J0IHsgRGlzayB9IGZyb20gJy4vZGlzayc7XG4vLyAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyAqICAgIFRFU1NFTEFUSU9OIENMQVNTXG4vLyAqICAgIENyZWF0ZXMgYSByZWd1bGFyIFRlc3NlbGF0aW9uIG9mIHRoZSBQb2luY2FyZSBEaXNrXG4vLyAqICAgIHE6IG51bWJlciBvZiBwLWdvbnMgbWVldGluZyBhdCBlYWNoIHZlcnRleFxuLy8gKiAgICBwOiBudW1iZXIgb2Ygc2lkZXMgb2YgcC1nb25cbi8vICogICAgdXNpbmcgdGhlIHRlY2huaXF1ZXMgY3JlYXRlZCBieSBDb3hldGVyIGFuZCBEdW5oYW1cbi8vICpcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbmV4cG9ydCBjbGFzcyBSZWd1bGFyVGVzc2VsYXRpb24gZXh0ZW5kcyBEaXNrIHtcbiAgY29uc3RydWN0b3IocCwgcSwgcm90YXRpb24sIGNvbG91ciwgbWF4TGF5ZXJzLCBkcmF3Q2xhc3MpIHtcbiAgICBzdXBlcihkcmF3Q2xhc3MpO1xuICAgIHRoaXMucCA9IHA7XG4gICAgdGhpcy5xID0gcTtcbiAgICB0aGlzLmNvbG91ciA9IGNvbG91ciB8fCAnYmxhY2snO1xuICAgIHRoaXMucm90YXRpb24gPSByb3RhdGlvbiB8fCAwO1xuICAgIHRoaXMubWF4TGF5ZXJzID0gbWF4TGF5ZXJzIHx8IDU7XG5cbiAgICBpZih0aGlzLmNoZWNrUGFyYW1zKCkpeyByZXR1cm4gZmFsc2U7fVxuXG4gICAgdGhpcy5mciA9IHRoaXMuZnVuZGFtZW50YWxSZWdpb24oKTtcblxuICAgIHRoaXMuYXJjKHRoaXMuZnIuYSwgdGhpcy5mci5iKTtcbiAgICB0aGlzLmFyYyh0aGlzLmZyLmEsIHRoaXMuZnIuYyk7XG4gICAgdGhpcy5hcmModGhpcy5mci5iLCB0aGlzLmZyLmMpO1xuICB9XG5cbiAgLy9jYWxjdWxhdGUgZmlyc3QgcG9pbnQgb2YgZnVuZGFtZW50YWwgcG9seWdvbiB1c2luZyBDb3hldGVyJ3MgbWV0aG9kXG4gIGZ1bmRhbWVudGFsUmVnaW9uKCl7XG4gICAgY29uc3QgcyA9IE1hdGguc2luKE1hdGguUEkvdGhpcy5wKTtcbiAgICBjb25zdCB0ID0gTWF0aC5jb3MoTWF0aC5QSS90aGlzLnEpO1xuICAgIC8vbXVsdGlwbHkgdGhlc2UgYnkgdGhlIGRpc2tzIHJhZGl1cyAoQ294ZXRlciB1c2VkIHVuaXQgZGlzayk7XG4gICAgY29uc3QgciA9IDEvTWF0aC5zcXJ0KCh0KnQpLyhzKnMpIC0xKSp0aGlzLnJhZGl1cztcbiAgICBjb25zdCBkID0gMS9NYXRoLnNxcnQoMS0gKHMqcykvKHQqdCkpKnRoaXMucmFkaXVzO1xuICAgIGNvbnN0IGIgPSB7XG4gICAgICB4OiB0aGlzLnJhZGl1cypNYXRoLmNvcyhNYXRoLlBJL3RoaXMucCksXG4gICAgICB5OiAtdGhpcy5yYWRpdXMqTWF0aC5zaW4oTWF0aC5QSS90aGlzLnApXG4gICAgfVxuXG4gICAgY29uc3QgY2VudHJlID0ge3g6IGQsIHk6IDB9O1xuXG4gICAgLy90aGVyZSB3aWxsIGJlIHR3byBwb2ludHMgb2YgaW50ZXJzZWN0aW9uLCBvZiB3aGljaCB3ZSB3YW50IHRoZSBmaXJzdFxuICAgIGNvbnN0IHAxID0gRS5jaXJjbGVMaW5lSW50ZXJzZWN0KGNlbnRyZSwgciwgdGhpcy5jZW50cmUsIGIpLnAxO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGE6IHRoaXMuY2VudHJlLFxuICAgICAgYjogcDEsXG4gICAgICBjOiB7IHg6IGQtciwgeTogMH1cbiAgICB9O1xuICB9XG5cbiAgLy9UaGUgdGVzc2VsYXRpb24gcmVxdWlyZXMgdGhhdCAocC0yKShxLTIpID4gNCB0byB3b3JrIChvdGhlcndpc2UgaXQgaXNcbiAgLy8gZWl0aGVyIGFuIGVsbGlwdGljYWwgb3IgZXVjbGlkZWFuIHRlc3NlbGF0aW9uKTtcbiAgY2hlY2tQYXJhbXMoKXtcbiAgICBpZih0aGlzLm1heExheWVycyA8IDAgfHwgaXNOYU4odGhpcy5tYXhMYXllcnMpKXtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ21heExheWVycyBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAwJyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZSBpZigodGhpcy5wIC0yKSoodGhpcy5xLTIpIDw9IDQpe1xuICAgICAgY29uc29sZS5lcnJvcignSHlwZXJib2xpYyB0ZXNzZWxhdGlvbnMgcmVxdWlyZSB0aGF0IChwLTEpKHEtMikgPCA0IScpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8vRm9yIG5vdyByZXF1aXJlIHAscSA+IDMsXG4gICAgLy9UT0RPIGltcGxlbWVudCBzcGVjaWFsIGNhc2VzIGZvciBxID0gMyBvciBwID0gM1xuICAgIGVsc2UgaWYodGhpcy5xIDw9IDMgfHwgaXNOYU4odGhpcy5xKSl7XG4gICAgICBjb25zb2xlLmVycm9yKCdUZXNzZWxhdGlvbiBlcnJvcjogYXQgbGVhc3QgMyBwLWdvbnMgbXVzdCBtZWV0IFxcXG4gICAgICAgICAgICAgICAgICAgIGF0IGVhY2ggdmVydGV4IScpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGVsc2UgaWYodGhpcy5wIDw9IDN8fCBpc05hTih0aGlzLnApKXtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1Rlc3NlbGF0aW9uIGVycm9yOiBwb2x5Z29uIG5lZWRzIGF0IGxlYXN0IDMgc2lkZXMhJyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZSB7IHJldHVybiBmYWxzZTsgfVxuICB9XG59XG4iLCIvLyAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyAqXG4vLyAqICBUSFJFRSBKUyBDTEFTU1xuLy8gKlxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuZXhwb3J0IGNsYXNzIFRocmVlSlMge1xuICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGV2ZW50KSA9PiB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbG9hZCcpO1xuICAgICAgdGhpcy5pbml0KCk7XG4gICAgfSwgZmFsc2UpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgIHRoaXMuY2FtZXJhLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgdGhpcy5jYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgIH0sIGZhbHNlKTtcblxuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLnNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG4gICAgdGhpcy5jYW1lcmEoKTtcblxuICAgIHRoaXMubGlnaHRpbmcoKTtcblxuICAgIHRoaXMuYXhlcygpO1xuICAgIHRoaXMuc2hhcGUoKTtcbiAgICB0aGlzLnJlbmRlcmVyKCk7XG4gIH1cblxuICBjYW1lcmEoKSB7XG4gICAgdGhpcy5jYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoNzUsXG4gICAgICB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCwgMC4xLCAxMDAwKTtcbiAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLmNhbWVyYSk7XG4gICAgdGhpcy5jYW1lcmEucG9zaXRpb24ueCA9IDA7XG4gICAgdGhpcy5jYW1lcmEucG9zaXRpb24ueSA9IDA7XG4gICAgdGhpcy5jYW1lcmEubG9va0F0KHRoaXMuc2NlbmUucG9zaXRpb24pO1xuXG4gICAgdGhpcy5jYW1lcmEucG9zaXRpb24ueiA9IDEwO1xuICB9XG5cbiAgcmVuZGVyZXIoKSB7XG4gICAgdGhpcy5yZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKCk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRDbGVhckNvbG9yKDB4MDAwMDAwLCAxLjApO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMucmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgc2hhcGUoKSB7XG4gICAgLy8gY3JlYXRlIGEgYmFzaWMgc2hhcGVcbiAgICB2YXIgc2hhcGUgPSBuZXcgVEhSRUUuU2hhcGUoKTtcblxuICAgIC8vIHN0YXJ0cG9pbnRcbiAgICBzaGFwZS5tb3ZlVG8oMCwgMCk7XG5cbiAgICAvLyBzdHJhaWdodCBsaW5lIHVwd2FyZHNcbiAgICBzaGFwZS5saW5lVG8oMCwgNTApO1xuXG4gICAgLy8gdGhlIHRvcCBvZiB0aGUgZmlndXJlLCBjdXJ2ZSB0byB0aGUgcmlnaHRcbiAgICBzaGFwZS5xdWFkcmF0aWNDdXJ2ZVRvKDE1LCAyNSwgMjUsIDMwKTtcblxuICAgIHNoYXBlLmxpbmVUbygwLCAwKTtcblxuICAgIGNvbnN0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLlNoYXBlR2VvbWV0cnkoc2hhcGUpO1xuICAgIHRoaXMuY3VydmUgPSB0aGlzLmNyZWF0ZU1lc2goZ2VvbWV0cnksICcuL2ltYWdlcy90ZXh0dXJlcy90ZXN0LmpwZycpO1xuICAgIHRoaXMuY3VydmUucG9zaXRpb24ueSA9IC0zMDtcbiAgICB0aGlzLmN1cnZlLnBvc2l0aW9uLnogPSAtNDA7XG4gICAgdGhpcy5zY2VuZS5hZGQodGhpcy5jdXJ2ZSk7XG4gIH1cblxuICBjcmVhdGVNZXNoKGdlb21ldHJ5LCBpbWFnZVVSTCkge1xuICAgIGxldCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XG4gICAgICBjb2xvcjogMHhmZjAwZmZcbiAgICB9KTtcblxuICAgIGNvbnN0IHRleHR1cmVMb2FkZXIgPSBuZXcgVEhSRUUuVGV4dHVyZUxvYWRlcigpO1xuXG4gICAgLy9sb2FkIHRleHR1cmUgYW5kIGFwcGx5IHRvIG1hdGVyaWFsIGluIGNhbGxiYWNrXG4gICAgbGV0IHRleHR1cmUgPSB0ZXh0dXJlTG9hZGVyLmxvYWQoaW1hZ2VVUkwsICh0ZXgpID0+IHt9KTtcbiAgICB0ZXh0dXJlLnJlcGVhdC5zZXQoMC4wNSwwLjA1KTtcbiAgICBtYXRlcmlhbC5tYXAgPSB0ZXh0dXJlO1xuICAgIG1hdGVyaWFsLm1hcC53cmFwVCA9IFRIUkVFLlJlcGVhdFdyYXBwaW5nO1xuICAgIG1hdGVyaWFsLm1hcC53cmFwUyA9IFRIUkVFLlJlcGVhdFdyYXBwaW5nO1xuXG4gICAgLy9nZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSggOCwgOCwgOCApO1xuICAgIGNvbnNvbGUubG9nKGdlb21ldHJ5LmZhY2VWZXJ0ZXhVdnMpO1xuXG4gICAgZ2VvbWV0cnkuZmFjZVZlcnRleFV2c1swXVswXVswXS54ID0gMC41O1xuICAgIGdlb21ldHJ5LmZhY2VWZXJ0ZXhVdnNbMF1bMF1bMF0ueSA9IDAuNTtcbiAgICBnZW9tZXRyeS5mYWNlVmVydGV4VXZzWzBdWzBdWzFdLnggPSAwLjU7XG4gICAgZ2VvbWV0cnkuZmFjZVZlcnRleFV2c1swXVswXVsxXS55ID0gMC41O1xuICAgIGdlb21ldHJ5LmZhY2VWZXJ0ZXhVdnNbMF1bMF1bMl0ueCA9IDAuNTtcbiAgICBnZW9tZXRyeS5mYWNlVmVydGV4VXZzWzBdWzBdWzJdLnkgPSAwLjU7XG4gICAgY29uc29sZS5sb2coZ2VvbWV0cnkuZmFjZVZlcnRleFV2cyk7XG5cblxuICAgIHJldHVybiBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICB9XG5cbiAgbGlnaHRpbmcoKSB7XG4gICAgLy9jb25zdCBzcG90TGlnaHQgPSBuZXcgVEhSRUUuU3BvdExpZ2h0KDB4ZmZmZmZmKTtcbiAgICAvL3Nwb3RMaWdodC5wb3NpdGlvbi5zZXQoMCwgMCwgMTAwKTtcbiAgICAvL3RoaXMuc2NlbmUuYWRkKHNwb3RMaWdodCk7XG4gICAgY29uc3QgYW1iaWVudExpZ2h0ID0gbmV3IFRIUkVFLkFtYmllbnRMaWdodCgweGZmZmZmZik7XG4gICAgdGhpcy5zY2VuZS5hZGQoYW1iaWVudExpZ2h0KTtcbiAgfVxuXG4gIGF4ZXMoKSB7XG4gICAgY29uc3QgeHl6ID0gbmV3IFRIUkVFLkF4aXNIZWxwZXIoMjApO1xuICAgIHRoaXMuc2NlbmUuYWRkKHh5eik7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHRoaXMucmVuZGVyKClcbiAgICB9KTtcbiAgICAvL3RoaXMuY3VydmUucm90YXRpb24ueSArPSAwLjAyO1xuICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUsIHRoaXMuY2FtZXJhKTtcbiAgfVxuXG59XG4iXX0=
