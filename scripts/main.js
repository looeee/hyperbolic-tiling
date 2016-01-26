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

var _webgl = require('./webgl');

// * ***********************************************************************
// *
// *   SETUP
// *
// *************************************************************************

var w = new _webgl.WebGL();
//const tesselation = new RegularTesselation(5, 4, 3*Math.PI/6*0, 'red');

},{"./regularTesselation":5,"./webgl":6}],5:[function(require,module,exports){
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
// *  CANVAS CLASS
// *
// *************************************************************************

var WebGL = exports.WebGL = function () {
  function WebGL() {
    _classCallCheck(this, WebGL);

    this.canvas = document.querySelector('canvas');

    //fullscreen
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.gl = this.initWebGL(canvas);

    this.rotation = 0;
    this.lastSquareUpdateTime = 0;
    this.squareXOffset = 0.0;
    this.squareYOffset = 0.0;
    this.squareZOffset = 0.0;
    this.lastSquareUpdateTime = 0;
    this.xIncValue = 0.2;
    this.yIncValue = -0.4;
    this.zIncValue = 0.3;

    if (this.gl) {
      this.start();
      this.initShaders();
      this.initBuffers();
      this.drawScene();
    }
  }

  _createClass(WebGL, [{
    key: 'start',
    value: function start() {
      // Set clear color to black, fully opaque
      this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
      // Enable depth testing
      this.gl.enable(this.gl.DEPTH_TEST);
      // Near things obscure far things
      this.gl.depthFunc(this.gl.LEQUAL);
      // Clear the color as well as the depth buffer.
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
  }, {
    key: 'initWebGL',
    value: function initWebGL(canvas) {
      this.gl = null;
      try {
        // Try to grab the standard context. If it fails, fallback to experimental.
        this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      } catch (e) {}

      if (!this.gl) {
        alert('Unable to initialize WebGL. Your browser may not support it.');
        this.gl = null;
      }
      return this.gl;
    }
  }, {
    key: 'initShaders',
    value: function initShaders() {
      var fragmentShader = this.getShader(this.gl, 'shader-fs');
      var vertexShader = this.getShader(this.gl, 'shader-vs');

      // Create the shader program

      this.shaderProgram = this.gl.createProgram();
      this.gl.attachShader(this.shaderProgram, vertexShader);
      this.gl.attachShader(this.shaderProgram, fragmentShader);
      this.gl.linkProgram(this.shaderProgram);

      // If creating the shader program failed, alert

      if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program.');
      }

      this.gl.useProgram(this.shaderProgram);

      this.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, 'aVertexPosition');
      this.gl.enableVertexAttribArray(this.vertexPositionAttribute);

      this.vertexColorAttribute = this.gl.getAttribLocation(this.shaderProgram, 'aVertexColor');
      this.gl.enableVertexAttribArray(this.vertexColorAttribute);
    }
  }, {
    key: 'getShader',
    value: function getShader(gl, id) {
      var shader = undefined;
      var shaderScript = document.getElementById(id);

      if (!shaderScript) {
        return null;
      }

      var theSource = '';
      var currentChild = shaderScript.firstChild;

      while (currentChild) {
        if (currentChild.nodeType == currentChild.TEXT_NODE) {
          theSource += currentChild.textContent;
        }

        currentChild = currentChild.nextSibling;
      }

      if (shaderScript.type == 'x-shader/x-fragment') {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
      } else if (shaderScript.type == 'x-shader/x-vertex') {
        shader = gl.createShader(gl.VERTEX_SHADER);
      } else {
        // Unknown shader type
        return null;
      }
      gl.shaderSource(shader, theSource);

      // Compile the shader program
      gl.compileShader(shader);

      // See if it compiled successfully
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        return null;
      }

      return shader;
    }
  }, {
    key: 'initBuffers',
    value: function initBuffers() {
      //const horizAspect = window.innerHeight / window.innerWidth;
      this.squareVerticesBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.squareVerticesBuffer);

      var vertices = [1.0, 1.0, 0.0, -1.0, 1.0, 0.0, 1.0, -1.0, 0.0, -1.0, -1.0, 0.0];

      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

      var colors = [1.0, 1.0, 1.0, 1.0, // white
      1.0, 0.0, 0.0, 1.0, // red
      0.0, 1.0, 0.0, 1.0, // green
      0.0, 0.0, 1.0, 1.0 // blue
      ];

      this.squareVerticesColorBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.squareVerticesColorBuffer);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
    }
  }, {
    key: 'drawScene',
    value: function drawScene() {
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

      this.perspectiveMatrix = makePerspective(45, window.innerWidth / window.innerHeight, 0.1, 100.0);

      loadIdentity();
      mvTranslate([-0.0, 0.0, -6.0]);

      //mvPushMatrix();
      mvRotate(this.rotation, [1, 0, 1]);

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.squareVerticesBuffer);
      this.gl.vertexAttribPointer(this.vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.squareVerticesColorBuffer);
      this.gl.vertexAttribPointer(this.vertexColorAttribute, 4, this.gl.FLOAT, false, 0, 0);

      this.setMatrixUniforms();
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

      //mvPopMatrix();
      this.currentTime = Date.now();
      //if (this.lastSquareUpdateTime) {
      var delta = this.currentTime - this.lastSquareUpdateTime;
      this.rotation += 30 * delta / 1000.0;
      //}

      this.lastSquareUpdateTime = this.currentTime;
    }
  }, {
    key: 'setMatrixUniforms',
    value: function setMatrixUniforms() {
      var pUniform = this.gl.getUniformLocation(this.shaderProgram, 'uPMatrix');
      this.gl.uniformMatrix4fv(pUniform, false, new Float32Array(this.perspectiveMatrix.flatten()));

      var mvUniform = this.gl.getUniformLocation(this.shaderProgram, 'uMVMatrix');
      this.gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
    }
  }]);

  return WebGL;
}();

},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJlczIwMTUvY2FudmFzLmpzIiwiZXMyMDE1L2Rpc2suanMiLCJlczIwMTUvZXVjbGlkLmpzIiwiZXMyMDE1L21haW4uanMiLCJlczIwMTUvcmVndWxhclRlc3NlbGF0aW9uLmpzIiwiZXMyMDE1L3dlYmdsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztJQ0thLE1BQU07QUFDakIsV0FEVyxNQUFNLEdBQ0o7MEJBREYsTUFBTTs7QUFFZixRQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0MsUUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7OztBQUFDLEFBR3hDLFFBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7QUFDdEMsUUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFdBQVc7OztBQUFDLEFBR3hDLFFBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUM7R0FFbkU7OztBQUFBO2VBWlUsTUFBTTs7NEJBZ0JULENBQUMsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUM7QUFDM0MsVUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNyQixVQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxLQUFLLEdBQUcsV0FBVyxDQUFDLENBQUM7QUFDakYs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V0FBZixlQUFlLEdBQUcsU0FBbEIsZUFBZSxDQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBSztBQUNqRCxNQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2IsTUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNiLE1BQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDYixNQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2IsTUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsSUFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsSUFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsQ0FBQyxDQUFDOztBQUU1RCxNQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUEsSUFBSyxJQUFJLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQSxBQUFDLElBQUksSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUEsQUFBQyxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUEsQUFBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVwRyxNQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsR0FBSSxDQUFDLEdBQUcsQUFBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsSUFBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUEsQUFBQyxJQUFLLENBQUMsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFBLEFBQUMsQ0FBQztBQUNqRixNQUFJLEVBQUUsR0FBRyxRQUFRLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFBLEFBQUMsQ0FBQztBQUN0RCxNQUFJLEVBQUUsR0FBRyxRQUFRLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFBLEFBQUMsQ0FBQzs7QUFFdEQsTUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksQ0FBQyxHQUFHLEFBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLElBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFBLEFBQUMsSUFBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7QUFDakYsTUFBSSxFQUFFLEdBQUcsUUFBUSxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7QUFDdEQsTUFBSSxFQUFFLEdBQUcsUUFBUSxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7O0FBRXRELE1BQUksRUFBRSxHQUFHO0FBQ1AsS0FBQyxFQUFFLEVBQUU7QUFDTCxLQUFDLEVBQUUsRUFBRTtHQUNOLENBQUE7O0FBRUQsTUFBSSxFQUFFLEdBQUc7QUFDUCxLQUFDLEVBQUUsRUFBRTtBQUNMLEtBQUMsRUFBRSxFQUFFO0dBQ04sQ0FBQTs7QUFFRCxTQUFPO0FBQ0wsTUFBRSxFQUFFLEVBQUU7QUFDTixNQUFFLEVBQUUsRUFBRTtHQUNQLENBQUM7Q0FDSCxDQUFBOztBQUVNLElBQU0sbUJBQW1CLFdBQW5CLG1CQUFtQixHQUFHLFNBQXRCLG1CQUFtQixDQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBSzs7QUFFbkQsTUFBTSxDQUFDLEdBQUcsUUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7O0FBQUMsQUFFM0IsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUEsR0FBRSxDQUFDLENBQUM7QUFDM0IsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUEsR0FBRSxDQUFDOzs7QUFBQyxBQUczQixNQUFNLENBQUMsR0FBRyxFQUFFLElBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRSxFQUFFLENBQUMsQ0FBQyxDQUFBLEFBQUMsR0FBRyxFQUFFLElBQUUsQ0FBQyxDQUFDLENBQUMsR0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBQztBQUN6QyxNQUFNLENBQUMsR0FBSSxFQUFDLENBQUMsRUFBRSxDQUFDLEdBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBQzs7O0FBQUMsQUFHOUMsTUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7OztBQUFDLEFBRzFCLE1BQUcsRUFBRSxHQUFHLENBQUMsRUFBQztBQUNSLFFBQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUUsQ0FBQyxHQUFDLENBQUMsR0FBRyxFQUFFLEdBQUMsRUFBRSxDQUFDOztBQUFDLEFBRW5DLFFBQU0sRUFBRSxHQUFHO0FBQ1QsT0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQSxHQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUNuQixPQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUMsRUFBRSxDQUFBLEdBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0tBQ3BCOztBQUFBLEFBRUQsUUFBTSxFQUFFLEdBQUc7QUFDVCxPQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUMsRUFBRSxDQUFBLEdBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ25CLE9BQUMsRUFBRSxDQUFD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OztBQUFDLEFBR2pELFVBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRTs7QUFBQyxBQUU5QixVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQztBQUMzRCxVQUFJLENBQUMsUUFBUSxJQUFJLEFBQUMsRUFBRSxHQUFHLEtBQUssR0FBSSxNQUFNOzs7QUFBQyxBQUd2QyxVQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztLQUM5Qzs7O3dDQUVtQjtBQUNsQixVQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDNUUsVUFBSSxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRTlGLFVBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUM5RSxVQUFJLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztLQUNsRjs7O1NBeExVLEtBQUsiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gKlxuLy8gKiAgQ0FOVkFTIENMQVNTXG4vLyAqXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5leHBvcnQgY2xhc3MgQ2FudmFze1xuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignY2FudmFzJyk7XG4gICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgLy9mdWxsc2NyZWVuXG4gICAgdGhpcy5jYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cbiAgICAvL3RyYW5zZm9ybSB0aGUgY2FudmFzIHNvIHRoZSBvcmlnaW4gaXMgYXQgdGhlIGNlbnRyZSBvZiB0aGUgZGlza1xuICAgIHRoaXMuY3R4LnRyYW5zbGF0ZSh3aW5kb3cuaW5uZXJXaWR0aCAvIDIsIHdpbmRvdy5pbm5lckhlaWdodCAvIDIpO1xuXG4gIH1cblxuXG4gIC8vZHJhdyBhIGh5cGVyYm9saWMgbGluZSBzZWdtZW50IHVzaW5nIGNhbGN1bGF0aW9ucyBmcm9tIGxpbmUoKSBvciBhcmMoKVxuICBzZWdtZW50KGMsIGFscGhhLCBhbHBoYU9mZnNldCwgY29sb3VyLCB3aWR0aCl7XG4gICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgdGhpcy5jdHguYXJjKGMuY2VudHJlLngsIGMuY2VudHJlLnksIGMucmFkaXVzLCBhbHBoYU9mZnNldCwgYWxwaGEgKyBhbHBoYU9mZnNldCk7XG4gICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBjb2xvdXIgfHwgJ2JsYWNrJztcbiAgICB0aGlzLmN0eC5saW5lV2lkdGggPSB3aWR0aCB8fCAxO1xuICAgIHRoaXMuY3R4LnN0cm9rZSgpO1xuICB9XG5cbiAgLy9kcmF3IGEgKGV1Y2xpZGVhbikgbGluZSBiZXR3ZWVuIHR3byBwb2ludHNcbiAgZXVjbGlkZWFuTGluZShwMSwgcDIsIGNvbG91ciwgd2lkdGgpe1xuICAgIGNvbnN0IGMgPSBjb2xvdXIgfHwgJ2JsYWNrJztcbiAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICB0aGlzLmN0eC5tb3ZlVG8ocDEueCwgcDEueSk7XG4gICAgdGhpcy5jdHgubGluZVRvKHAyLngsIHAyLnkpO1xuICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gYztcbiAgICB0aGlzLmN0eC5saW5lV2lkdGggPSB3aWR0aCB8fCAxO1xuICAgIHRoaXMuY3R4LnN0cm9rZSgpXG4gIH1cblxuICAvL2RyYXcgYSBwb2ludCBvbiB0aGUgZGlzaywgb3B0aW9uYWwgcmFkaXVzIGFuZCBjb2xvdXJcbiAgcG9pbnQocG9pbnQsIHJhZGl1cywgY29sb3VyKXtcbiAgICBjb25zdCBjb2wgPSBjb2xvdXIgfHwgJ2JsYWNrJztcbiAgICBjb25zdCByID0gcmFkaXVzIHx8IDI7XG4gICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgdGhpcy5jdHguYXJjKHBvaW50LngsIHBvaW50LnksIHIsIDAsIE1hdGguUEkgKiAyLCB0cnVlKTtcbiAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBjb2w7XG4gICAgdGhpcy5jdHguZmlsbCgpO1xuICB9XG5cbiAgLy9kcmF3IGEgY2lyY2xlIG9mIHJhZGl1cyByIGNlbnRyZSBjIGFuZCBvcHRpb25hbCBjb2xvdXJcbiAgY2lyY2xlKGMsIHIsIGNvbG91ciwgd2lkdGgpe1xuICAgIGNvbnN0IGNvbCA9IGNvbG91ciB8fCAnYmxhY2snO1xuICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgIHRoaXMuY3R4LmFyYyhjLngsIGMueSwgciwgMCwgTWF0aC5QSSAqIDIpO1xuICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gY29sO1xuICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IHdpZHRoIHx8IDE7XG4gICAgdGhpcy5jdHguc3Ryb2tlKCk7XG4gIH1cblxuICAvL2NvbnZlcnQgdGhlIGNhbnZhcyB0byBhIGJhc2U2NFVSTCBhbmQgc2VuZCB0byBzYXZlSW1hZ2UucGhwXG4gIHNhdmVJbWFnZSgpe1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmNhbnZhcy50b0RhdGFVUkwoKTtcbiAgICAkLmFqYXgoe1xuICAgICAgdHlwZTogJ1BPU1QnLFxuICAgICAgdXJsOiAnc2F2ZUltYWdlLnBocCcsXG4gICAgICBkYXRhOiB7IGltZzogZGF0YSB9XG4gICAgfSk7XG4gIH1cblxuICAvL3RoZSBjYW52YXMgaGFzIGJlZW4gdHJhbnNsYXRlZCB0byB0aGUgY2VudHJlIG9mIHRoZSBkaXNrIHNvIG5lZWQgdG9cbiAgLy91c2UgYW4gb2Zmc2V0IHRvIGNsZWFyIGl0LiBOT1QgV09SS0lORyBXSEVOIFNDUkVFTiBJUyBSRVNJWkVEXG4gIGNsZWFyU2NyZWVuKCkge1xuICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgtd2luZG93LmlubmVyV2lkdGgvMiwtd2luZG93LmlubmVySGVpZ2h0LzIsXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgfVxuXG59XG4iLCJpbXBvcnQgKiBhcyBFIGZyb20gJy4vZXVjbGlkJztcbmltcG9ydCB7IENhbnZhcyB9IGZyb20gJy4vY2FudmFzJztcblxuLy8gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gKlxuLy8gKiAgIERJU0sgQ0xBU1Ncbi8vICogICBQb2luY2FyZSBEaXNrIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBoeXBlcmJvbGljIHBsYW5lXG4vLyAqICAgQ29udGFpbnMgYW55IGZ1bmN0aW9ucyB1c2VkIHRvIGRyYXcgdG8gdGhlIGRpc2tcbi8vICogICBDb25zdHJ1Y3RvciB0YWtlcyB0aGUgZHJhd2luZyBjbGFzcyBhcyBhbiBhcmd1bWVudFxuLy8gKiAgIChDdXJyZW50bHkgb25seSBDYW52YXMgdXNlZCwgbWlnaHQgc3dpdGNoIHRvIFdlYkdMIGluIGZ1dHVyZSlcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbmV4cG9ydCBjbGFzcyBEaXNrIHtcbiAgY29uc3RydWN0b3IoZHJhd0NsYXNzKSB7XG4gICAgZHJhd0NsYXNzID0gZHJhd0NsYXNzIHx8ICdjYW52YXMnO1xuICAgIGlmKGRyYXdDbGFzcyA9PT0gJ2NhbnZhcycpe1xuICAgICAgdGhpcy5kcmF3ID0gbmV3IENhbnZhcygpO1xuICAgIH1cbiAgICB0aGlzLmRyYXcuY2xlYXJTY3JlZW4oKTtcblxuICAgIHRoaXMuY2VudHJlID0ge1xuICAgICAgeDogMCxcbiAgICAgIHk6IDBcbiAgICB9XG5cbiAgICAvL2RyYXcgbGFyZ2VzdCBjaXJjbGUgcG9zc2libGUgZ2l2ZW4gd2luZG93IGRpbXNcbiAgICB0aGlzLnJhZGl1cyA9ICh3aW5kb3cuaW5uZXJXaWR0aCA8IHdpbmRvdy5pbm5lckhlaWdodCkgPyAod2luZG93LmlubmVyV2lkdGggLyAyKSAtIDUgOiAod2luZG93LmlubmVySGVpZ2h0IC8gMikgLSA1O1xuXG4gICAgLy9zbWFsbGVyIGNpcmNsZSBmb3IgdGVzdGluZ1xuICAgIC8vIC90aGlzLnJhZGl1cyA9IHRoaXMucmFkaXVzIC8gMztcblxuICAgIHRoaXMub3V0ZXJDaXJjbGUoKTtcbiAgfVxuXG4gIC8vZHJhdyB0aGUgYm91bmRhcnkgY2lyY2xlXG4gIG91dGVyQ2lyY2xlKCkge1xuICAgIHRoaXMuZHJhdy5jaXJjbGUoe3g6IHRoaXMuY2VudHJlLngsIHk6IHRoaXMuY2VudHJlLnl9LCB0aGlzLnJhZGl1cyk7XG4gIH1cblxuICAvL2RyYXcgYSBoeXBlcmJvbGljIGxpbmUgYmV0d2VlbiB0d28gcG9pbnRzIG9uIHRoZSBib3VuZGFyeSBjaXJjbGVcbiAgbGluZShwMSwgcDIsIGNvbG91cikge1xuICAgIC8vbGV0IHB0cyA9IHRoaXMucHJlcFBvaW50cyhwMSwgcDIpO1xuICAgIC8vcDEgPSBwdHMucDE7XG4gICAgLy9wMiA9IHB0cy5wMjtcbiAgICBsZXQgY29sID0gY29sb3VyIHx8ICdibGFjayc7XG4gICAgbGV0IGMsIHBvaW50cztcblxuICAgIGlmKEUudGhyb3VnaE9yaWdpbihwMSxwMikpe1xuICAgICAgbGV0IHUgPSBub3JtYWxWZWN0b3IocDEscDIpO1xuICAgICAgcG9pbnRzID0ge1xuICAgICAgICBwMToge1xuICAgICAgICAgIHg6IHUueCAqIHRoaXMucmFkaXVzLFxuICAgICAgICAgIHk6IHUueSAqIHRoaXMucmFkaXVzXG4gICAgICAgIH0sXG4gICAgICAgIHAyOiB7XG4gICAgICAgICAgeDogLXUueCAqIHRoaXMucmFkaXVzLFxuICAgICAgICAgIHk6IC11LnkgKiB0aGlzLnJhZGl1c1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLmRyYXcuZXVjbGlkZWFuTGluZShwb2ludHMucDEscG9pbnRzLnAyLCBjb2wpO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgYyA9IEUuZ3JlYXRDaXJjbGUocDEsIHAyLCB0aGlzLnJhZGl1cywgdGhpcy5jZW50cmUpO1xuICAgICAgcG9pbnRzID0gRS5jaXJjbGVJbnRlcnNlY3QodGhpcy5jZW50cmUsIGMuY2VudHJlLCB0aGlzLnJhZGl1cywgYy5yYWRpdXMpO1xuXG4gICAgICAvL2FuZ2xlIHN1YnRlbmRlZCBieSB0aGUgYXJjXG4gICAgICBsZXQgYWxwaGEgPSBFLmNlbnRyYWxBbmdsZShwb2ludHMucDEsIHBvaW50cy5wMiwgYy5yYWRpdXMpO1xuXG4gICAgICBsZXQgb2Zmc2V0ID0gdGhpcy5hbHBoYU9mZnNldChwb2ludHMucDIsIHBvaW50cy5wMiwgYywgJ2xpbmUnKTtcbiAgICAgIHRoaXMuZHJhdy5zZWdtZW50KGMsIGFscGhhLCBvZmZzZXQsIGNvbCk7XG4gICAgfVxuICB9XG5cbiAgLy9jYWxjdWxhdGUgdGhlIG9mZnNldCAocG9zaXRpb24gYXJvdW5kIHRoZSBjaXJjbGUgZnJvbSB3aGljaCB0byBzdGFydCB0aGVcbiAgLy9saW5lIG9yIGFyYykuIEFzIGNhbnZhcyBkcmF3cyBhcmNzIGNsb2Nrd2lzZSBieSBkZWZhdWx0IHRoaXMgd2lsbCBjaGFuZ2VcbiAgLy9kZXBlbmRpbmcgb24gd2hlcmUgdGhlIGFyYyBpcyByZWxhdGl2ZSB0byB0aGUgb3JpZ2luXG4gIC8vc3BlY2lmaWNhbGwgd2hldGhlciBpdCBsaWVzIG9uIHRoZSB4IGF4aXMsIG9yIGFib3ZlIG9yIGJlbG93IGl0XG4gIC8vdHlwZSA9ICdsaW5lJyBvciAnYXJjJ1xuICBhbHBoYU9mZnNldChwMSwgcDIsIGMsIHR5cGUpIHtcbiAgICBsZXQgb2Zmc2V0O1xuXG4gICAgLy9wb2ludHMgYXQgMCByYWRpYW5zIG9uIGdyZWF0Q2lyY2xlXG4gICAgbGV0IHAgPSB7XG4gICAgICB4OiBjLmNlbnRyZS54ICsgYy5yYWRpdXMsXG4gICAgICB5OiBjLmNlbnRyZS55XG4gICAgfVxuXG4gICAgaWYocDEueSA8IGMuY2VudHJlLnkpe1xuICAgICAgb2Zmc2V0ID0gMipNYXRoLlBJIC0gRS5jZW50cmFsQW5nbGUocDEsIHAsIGMucmFkaXVzKTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIG9mZnNldCA9IEUuY2VudHJhbEFuZ2xlKHAxLCBwLCBjLnJhZGl1cyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9mZnNldDtcbiAgfVxuXG4gIC8vcHV0IHBvaW50cyBpbiBjbG9ja3dpc2Ugb3JkZXJcbiAgcHJlcFBvaW50cyhwMSwgcDIsIGMpe1xuICAgIGNvbnN0IHAgPSB7eDogYy5jZW50cmUueCArIGMucmFkaXVzLCB5OiBjLmNlbnRyZS55fTtcbiAgICAvL2Nhc2Ugd2hlcmUgcG9pbnRzIGFyZSBhYm92ZSBhbmQgYmVsb3cgdGhlIGxpbmUgYy5jZW50cmUgLT4gcFxuICAgIC8vaW4gdGhpcyBjYXNlIGp1c3QgcmV0dXJuIHBvaW50c1xuICAgIGNvbnN0IG95ID0gYy5jZW50cmUueTtcbiAgICBjb25zdCBveCA9IGMuY2VudHJlLng7XG5cbiAgICBpZihwMS54ID4gb3ggJiYgcDIueCA+IG94KXtcbiAgICAgIGlmKHAxLnkgPiBveSAmJiBwMi55IDwgb3kpIHJldHVybiB7cDE6IHAyLCBwMjogcDF9O1xuICAgICAgZWxzZSBpZihwMS55IDwgb3kgJiYgcDIueSA+IG95KSByZXR1cm4ge3AxOiBwMSwgcDI6IHAyfTtcbiAgICB9XG5cbiAgICBsZXQgYWxwaGExID0gRS5jZW50cmFsQW5nbGUocCwgcDEsIGMucmFkaXVzKTtcbiAgICBhbHBoYTEgPSAocDEueSA8IGMuY2VudHJlLnkpID8gMipNYXRoLlBJIC0gYWxwaGExIDogYWxwaGExO1xuICAgIGxldCBhbHBoYTIgPSBFLmNlbnRyYWxBbmdsZShwLCBwMiwgYy5yYWRpdXMpO1xuICAgIGFscGhhMiA9IChwMi55IDwgYy5jZW50cmUueSkgPyAyKk1hdGguUEkgLSBhbHBoYTIgOiBhbHBoYTI7XG5cbiAgICAvL2lmIHRoZSBwb2ludHMgYXJlIG5vdCBpbiBjbG9ja3dpc2Ugb3JkZXIgZmxpcCB0aGVtXG4gICAgaWYoYWxwaGExID4gYWxwaGEyKSByZXR1cm4ge3AxOiBwMiwgcDI6IHAxfTtcbiAgICBlbHNlIHJldHVybiB7cDE6IHAxLCBwMjogcDJ9O1xuXG4gIH1cblxuICAvL0RyYXcgYW4gYXJjIChoeXBlcmJvbGljIGxpbmUgc2VnbWVudCkgYmV0d2VlbiB0d28gcG9pbnRzIG9uIHRoZSBkaXNrXG4gIGFyYyhwMSwgcDIsIGNvbG91cikge1xuICAgIGlmKEUudGhyb3VnaE9yaWdpbihwMSxwMikpe1xuICAgICAgdGhpcy5kcmF3LmV1Y2xpZGVhbkxpbmUocDEscDIsIGNvbG91cik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBjb2wgPSBjb2xvdXIgfHwgJ2JsYWNrJztcbiAgICBsZXQgYyA9IEUuZ3JlYXRDaXJjbGUocDEsIHAyLCB0aGlzLnJhZGl1cywgdGhpcy5jZW50cmUpO1xuICAgIGxldCBwdHMgPSB0aGlzLnByZXBQb2ludHMocDEsIHAyLCBjKTtcbiAgICBwMSA9IHB0cy5wMTtcbiAgICBwMiA9IHB0cy5wMjtcblxuICAgIC8vbGVuZ3RoIG9mIHRoZSBhcmNcbiAgICBsZXQgYWxwaGEgPSBFLmNlbnRyYWxBbmdsZShwMSwgcDIsIGMucmFkaXVzKTtcblxuICAgIC8vaG93IGZhciBhcm91bmQgdGhlIGdyZWF0Q2lyY2xlIHRvIHN0YXJ0IGRyYXdpbmcgdGhlIGFyY1xuICAgIGxldCBvZmZzZXQgPSB0aGlzLmFscGhhT2Zmc2V0KHAxLCBwMiwgYywgJ2FyYycpO1xuICAgIHRoaXMuZHJhdy5zZWdtZW50KGMsIGFscGhhLCBvZmZzZXQsIGNvbG91cik7XG4gIH1cblxuICBwb2x5Z29uKHZlcnRpY2VzLCBjb2xvdXIpIHtcbiAgICBsZXQgbCA9IHZlcnRpY2VzLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgdGhpcy5hcmModmVydGljZXNbaV0sIHZlcnRpY2VzWyhpICsgMSklbF0sIGNvbG91cik7XG4gICAgfVxuICB9XG5cbiAgLy9yZXR1cm4gdHJ1ZSBpZiB0aGUgcG9pbnQgaXMgbm90IGluIHRoZSBkaXNrXG4gIGNoZWNrUG9pbnQocG9pbnQpIHtcbiAgICBsZXQgciA9IHRoaXMucmFkaXVzO1xuICAgIGlmIChFLmRpc3RhbmNlKHBvaW50LCB0aGlzLmNlbnRyZSkgPiByKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdFcnJvciEgUG9pbnQgKCcgKyBwb2ludC54ICsgJywgJyArIHBvaW50LnkgKyAnKSBsaWVzIG91dHNpZGUgdGhlIHBsYW5lIScpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuIiwiLy8gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gKlxuLy8gKiAgIEVVQ0xJREVBTiBGVU5DVElPTlNcbi8vICogICBhbGwgRXVjbGlkZWFuIG1hdGhlbWF0aWNhbCBmdW5jdGlvbnMgZ28gaGVyZVxuLy8gKlxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4vL2Rpc3RhbmNlIGJldHdlZW4gdHdvIHBvaW50c1xuZXhwb3J0IGNvbnN0IGRpc3RhbmNlID0gKHAxLCBwMikgPT4gTWF0aC5zcXJ0KE1hdGgucG93KChwMi54IC0gcDEueCksIDIpICsgTWF0aC5wb3coKHAyLnkgLSBwMS55KSwgMikpO1xuXG4vL21pZHBvaW50IG9mIHRoZSBsaW5lIHNlZ21lbnQgY29ubmVjdGluZyB0d28gcG9pbnRzXG5leHBvcnQgY29uc3QgbWlkcG9pbnQgPSAocDEsIHAyKSA9PiB7XG4gIHJldHVybiB7XG4gICAgeDogKHAxLnggKyBwMi54KSAvIDIsXG4gICAgeTogKHAxLnkgKyBwMi55KSAvIDJcbiAgfVxufVxuXG4vL3Nsb3BlIG9mIGxpbmUgdGhyb3VnaCBwMSwgcDJcbmV4cG9ydCBjb25zdCBzbG9wZSA9IChwMSwgcDIpID0+IChwMi54IC0gcDEueCkgLyAocDIueSAtIHAxLnkpO1xuXG4vL3Nsb3BlIG9mIGxpbmUgcGVycGVuZGljdWxhciB0byBhIGxpbmUgZGVmaW5lZCBieSBwMSxwMlxuZXhwb3J0IGNvbnN0IHBlcnBlbmRpY3VsYXJTbG9wZSA9IChwMSwgcDIpID0+IC0xIC8gKE1hdGgucG93KHNsb3BlKHAxLCBwMiksIC0xKSk7XG5cbi8vaW50ZXJzZWN0aW9uIHBvaW50IG9mIHR3byBsaW5lcyBkZWZpbmVkIGJ5IHAxLG0xIGFuZCBxMSxtMlxuLy9OT1QgV09SS0lORyBGT1IgVkVSVElDQUwgTElORVMhISFcbmV4cG9ydCBjb25zdCBpbnRlcnNlY3Rpb24gPSAocDEsIG0xLCBwMiwgbTIpID0+IHtcbiAgbGV0IGMxLCBjMiwgeCwgeTtcbiAgLy9jYXNlIHdoZXJlIGZpcnN0IGxpbmUgaXMgdmVydGljYWxcbiAgLy9pZihtMSA+IDUwMDAgfHwgbTEgPCAtNTAwMCB8fCBtMSA9PT0gSW5maW5pdHkpe1xuICBpZihwMS55IDwgMC4wMDAwMDEgJiYgcDEueSA+IC0wLjAwMDAwMSApe1xuICAgIHggPSBwMS54O1xuICAgIHkgPSAobTIpKihwMS54LXAyLngpICsgcDIueTtcbiAgfVxuICAvL2Nhc2Ugd2hlcmUgc2Vjb25kIGxpbmUgaXMgdmVydGljYWxcbiAgLy9lbHNlIGlmKG0yID4gNTAwMCB8fCBtMiA8IC01MDAwIHx8IG0xID09PSBJbmZpbml0eSl7XG4gIGVsc2UgaWYocDIueSA8IDAuMDAwMDAxICYmIHAyLnkgPiAtMC4wMDAwMDEgKXtcbiAgICB4ID0gcDIueDtcbiAgICB5ID0gKG0xKihwMi54LXAxLngpKSArIHAxLnk7XG4gIH1cbiAgZWxzZXtcbiAgICAvL3kgaW50ZXJjZXB0IG9mIGZpcnN0IGxpbmVcbiAgICBjMSA9IHAxLnkgLSBtMSAqIHAxLng7XG4gICAgLy95IGludGVyY2VwdCBvZiBzZWNvbmQgbGluZVxuICAgIGMyID0gcDIueSAtIG0yICogcDIueDtcblxuICAgIHggPSAoYzIgLSBjMSkgLyAobTEgLSBtMik7XG4gICAgeSA9IG0xICogeCArIGMxO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB4OiB4LFxuICAgIHk6IHlcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgcmFkaWFucyA9IChkZWdyZWVzKSA9PiAoTWF0aC5QSSAvIDE4MCkgKiBkZWdyZWVzO1xuXG4vL2dldCB0aGUgY2lyY2xlIGludmVyc2Ugb2YgYSBwb2ludCBwIHdpdGggcmVzcGVjdCBhIGNpcmNsZSByYWRpdXMgciBjZW50cmUgY1xuZXhwb3J0IGNvbnN0IGludmVyc2UgPSAocCwgciwgYykgPT4ge1xuICBsZXQgYWxwaGEgPSAociAqIHIpIC8gKE1hdGgucG93KHAueCAtIGMueCwgMikgKyBNYXRoLnBvdyhwLnkgLSBjLnksIDIpKTtcbiAgcmV0dXJuIHtcbiAgICB4OiBhbHBoYSAqIChwLnggLSBjLngpICsgYy54LFxuICAgIHk6IGFscGhhICogKHAueSAtIGMueSkgKyBjLnlcbiAgfTtcbn1cblxuLy9jYWxjdWxhdGUgdGhlIHJhZGl1cyBhbmQgY2VudHJlIG9mIHRoZSBjaXJjbGUgcmVxdWlyZWQgdG8gZHJhdyBhIGxpbmUgYmV0d2VlblxuLy90d28gcG9pbnRzIGluIHRoZSBoeXBlcmJvbGljIHBsYW5lIGRlZmluZWQgYnkgdGhlIGRpc2sgKHIsIGMpXG5leHBvcnQgY29uc3QgZ3JlYXRDaXJjbGUgPSAocDEsIHAyLCByLCBjKSA9PiB7XG4gIGxldCBwMUludmVyc2UgPSBpbnZlcnNlKHAxLCByLCBjKTtcbiAgbGV0IHAySW52ZXJzZSA9IGludmVyc2UocDIsIHIsIGMpO1xuXG4gIGxldCBtID0gbWlkcG9pbnQocDEsIHAxSW52ZXJzZSk7XG4gIGxldCBuID0gbWlkcG9pbnQocDIsIHAySW52ZXJzZSk7XG5cbiAgbGV0IG0xID0gcGVycGVuZGljdWxhclNsb3BlKG0sIHAxSW52ZXJzZSk7XG4gIGxldCBtMiA9IHBlcnBlbmRpY3VsYXJTbG9wZShuLCBwMkludmVyc2UpO1xuXG5cbiAgLy9jZW50cmUgaXMgdGhlIGNlbnRyZXBvaW50IG9mIHRoZSBjaXJjbGUgb3V0IG9mIHdoaWNoIHRoZSBhcmMgaXMgbWFkZVxuICBsZXQgY2VudHJlID0gaW50ZXJzZWN0aW9uKG0sIG0xLCBuLCBtMik7XG4gIGxldCByYWRpdXMgPSBkaXN0YW5jZShjZW50cmUsIHAxKTtcbiAgcmV0dXJuIHtcbiAgICBjZW50cmU6IGNlbnRyZSxcbiAgICByYWRpdXM6IHJhZGl1c1xuICB9O1xufVxuXG4vL2FuIGF0dGVtcHQgYXQgY2FsY3VsYXRpbmcgdGhlIGNpcmNsZSBhbGdlYnJhaWNhbGx5XG5leHBvcnQgY29uc3QgZ3JlYXRDaXJjbGVWMiA9IChwMSxwMiwgcikgPT57XG4gIGxldCB4ID0gKHAyLnkqKHAxLngqcDEueCArIHIpKyBwMS55KnAxLnkqcDIueS1wMS55KihwMi54KnAyLngrIHAyLnkqcDIueSArIHIpKS8oMipwMS54KnAyLnkgLSBwMS55KnAyLngpO1xuICBsZXQgeSA9IChwMS54KnAxLngqcDIueCAtIHAxLngqKHAyLngqcDIueCtwMi55KnAyLnkrcikrcDIueCoocDEueSpwMS55K3IpKS8oMipwMS55KnAyLnggKyAyKnAxLngqcDIueSk7XG4gIGxldCByYWRpdXMgPSAgIE1hdGguc3FydCh4KngreSp5LXIpO1xuICByZXR1cm4ge1xuICAgIGNlbnRyZToge1xuICAgICAgeDogeCxcbiAgICAgIHk6IHlcbiAgICB9LFxuICAgIHJhZGl1czogcmFkaXVzXG4gIH1cbn1cblxuLy9pbnRlcnNlY3Rpb24gb2YgdHdvIGNpcmNsZXMgd2l0aCBlcXVhdGlvbnM6XG4vLyh4LWEpXjIgKyh5LWEpXjIgPSByMF4yXG4vLyh4LWIpXjIgKyh5LWMpXjIgPSByMV4yXG4vL05PVEUgYXNzdW1lcyB0aGUgdHdvIGNpcmNsZXMgRE8gaW50ZXJzZWN0IVxuZXhwb3J0IGNvbnN0IGNpcmNsZUludGVyc2VjdCA9IChjMCwgYzEsIHIwLCByMSkgPT4ge1xuICBsZXQgYSA9IGMwLng7XG4gIGxldCBiID0gYzAueTtcbiAgbGV0IGMgPSBjMS54O1xuICBsZXQgZCA9IGMxLnk7XG4gIGxldCBkaXN0ID0gTWF0aC5zcXJ0KChjIC0gYSkgKiAoYyAtIGEpICsgKGQgLSBiKSAqIChkIC0gYikpO1xuXG4gIGxldCBkZWwgPSBNYXRoLnNxcnQoKGRpc3QgKyByMCArIHIxKSAqIChkaXN0ICsgcjAgLSByMSkgKiAoZGlzdCAtIHIwICsgcjEpICogKC1kaXN0ICsgcjAgKyByMSkpIC8gNDtcblxuICBsZXQgeFBhcnRpYWwgPSAoYSArIGMpIC8gMiArICgoYyAtIGEpICogKHIwICogcjAgLSByMSAqIHIxKSkgLyAoMiAqIGRpc3QgKiBkaXN0KTtcbiAgbGV0IHgxID0geFBhcnRpYWwgLSAyICogZGVsICogKGIgLSBkKSAvIChkaXN0ICogZGlzdCk7XG4gIGxldCB4MiA9IHhQYXJ0aWFsICsgMiAqIGRlbCAqIChiIC0gZCkgLyAoZGlzdCAqIGRpc3QpO1xuXG4gIGxldCB5UGFydGlhbCA9IChiICsgZCkgLyAyICsgKChkIC0gYikgKiAocjAgKiByMCAtIHIxICogcjEpKSAvICgyICogZGlzdCAqIGRpc3QpO1xuICBsZXQgeTEgPSB5UGFydGlhbCArIDIgKiBkZWwgKiAoYSAtIGMpIC8gKGRpc3QgKiBkaXN0KTtcbiAgbGV0IHkyID0geVBhcnRpYWwgLSAyICogZGVsICogKGEgLSBjKSAvIChkaXN0ICogZGlzdCk7XG5cbiAgbGV0IHAxID0ge1xuICAgIHg6IHgxLFxuICAgIHk6IHkxXG4gIH1cblxuICBsZXQgcDIgPSB7XG4gICAgeDogeDIsXG4gICAgeTogeTJcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcDE6IHAxLFxuICAgIHAyOiBwMlxuICB9O1xufVxuXG5leHBvcnQgY29uc3QgY2lyY2xlTGluZUludGVyc2VjdCA9IChjLCByLCBwMSwgcDIpID0+IHtcblxuICBjb25zdCBkID0gZGlzdGFuY2UocDEsIHAyKTtcbiAgLy91bml0IHZlY3RvciBwMSBwMlxuICBjb25zdCBkeCA9IChwMi54IC0gcDEueCkvZDtcbiAgY29uc3QgZHkgPSAocDIueSAtIHAxLnkpL2Q7XG5cbiAgLy9wb2ludCBvbiBsaW5lIGNsb3Nlc3QgdG8gY2lyY2xlIGNlbnRyZVxuICBjb25zdCB0ID0gZHgqKGMueCAtcDEueCkgKyBkeSooYy55LXAxLnkpO1xuICBjb25zdCBwID0gIHt4OiB0KiBkeCArIHAxLngsIHk6IHQqIGR5ICsgcDEueX07XG5cbiAgLy9kaXN0YW5jZSBmcm9tIHRoaXMgcG9pbnQgdG8gY2VudHJlXG4gIGNvbnN0IGQyID0gZGlzdGFuY2UocCwgYyk7XG5cbiAgLy9saW5lIGludGVyc2VjdHMgY2lyY2xlXG4gIGlmKGQyIDwgcil7XG4gICAgY29uc3QgZHQgPSBNYXRoLnNxcnQoIHIqciAtIGQyKmQyKTtcbiAgICAvL3BvaW50IDFcbiAgICBjb25zdCBxMSA9IHtcbiAgICAgIHg6ICh0LWR0KSpkeCArIHAxLngsXG4gICAgICB5OiAodC1kdCkqZHkgKyBwMS55XG4gICAgfVxuICAgIC8vcG9pbnQgMlxuICAgIGNvbnN0IHEyID0ge1xuICAgICAgeDogKHQrZHQpKmR4ICsgcDEueCxcbiAgICAgIHk6ICh0K2R0KSpkeSArIHAxLnlcbiAgICB9XG5cbiAgICByZXR1cm4ge3AxOiBxMSwgcDI6IHEyfTtcbiAgfVxuICBlbHNlIGlmKCBkMiA9PT0gcil7XG4gICAgcmV0dXJuIHA7XG4gIH1cbiAgZWxzZXtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvcjogbGluZSBkb2VzIG5vdCBpbnRlcnNlY3QgY2lyY2xlIScpO1xuICB9XG59XG5cbi8vYW5nbGUgaW4gcmFkaWFucyBiZXR3ZWVuIHR3byBwb2ludHMgb24gY2lyY2xlIG9mIHJhZGl1cyByXG5leHBvcnQgY29uc3QgY2VudHJhbEFuZ2xlID0gKHAxLCBwMiwgcikgPT4ge1xuICByZXR1cm4gMiAqIE1hdGguYXNpbigwLjUgKiBkaXN0YW5jZShwMSwgcDIpIC8gcik7XG59XG5cbi8vY2FsY3VsYXRlIHRoZSBub3JtYWwgdmVjdG9yIGdpdmVuIDIgcG9pbnRzXG5leHBvcnQgY29uc3Qgbm9ybWFsVmVjdG9yID0gKHAxLCBwMikgPT4ge1xuICBsZXQgZCA9IE1hdGguc3FydChNYXRoLnBvdyhwMi54LXAxLngsMikgKyBNYXRoLnBvdyhwMi55LXAxLnksMikpO1xuICByZXR1cm4ge1xuICAgIHg6IChwMi54LXAxLngpL2QsXG4gICAgeTogKHAyLnktcDEueSkvZFxuICB9XG59XG5cbi8vZG9lcyB0aGUgbGluZSBjb25uZWN0aW5nIHAxLCBwMiBnbyB0aHJvdWdoIHRoZSBwb2ludCAoMCwwKT9cbmV4cG9ydCBjb25zdCB0aHJvdWdoT3JpZ2luID0gKHAxLCBwMikgPT4ge1xuICBpZihwMS54ID09PSAwICYmIHAyLnggPT09IDApe1xuICAgIC8vdmVydGljYWwgbGluZSB0aHJvdWdoIGNlbnRyZVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGxldCB0ZXN0ID0gKC1wMS54KnAyLnkgKyBwMS54KnAxLnkpLyhwMi54LXAxLngpICsgcDEueTtcbiAgaWYodGVzdCA9PT0gMCkgcmV0dXJuIHRydWU7XG4gIGVsc2UgcmV0dXJuIGZhbHNlO1xufVxuXG4vL2ZpbmQgdGhlIGNlbnRyb2lkIG9mIGEgbm9uLXNlbGYtaW50ZXJzZWN0aW5nIHBvbHlnb25cbmV4cG9ydCBjb25zdCBjZW50cm9pZE9mUG9seWdvbiA9IChwb2ludHMpID0+IHtcbiAgbGV0IGZpcnN0ID0gcG9pbnRzWzBdLCBsYXN0ID0gcG9pbnRzW3BvaW50cy5sZW5ndGgtMV07XG4gIGlmIChmaXJzdC54ICE9IGxhc3QueCB8fCBmaXJzdC55ICE9IGxhc3QueSkgcG9pbnRzLnB1c2goZmlyc3QpO1xuICBsZXQgdHdpY2VhcmVhPTAsXG4gICAgeD0wLCB5PTAsXG4gICAgblB0cyA9IHBvaW50cy5sZW5ndGgsXG4gICAgcDEsIHAyLCBmO1xuICBmb3IgKCB2YXIgaT0wLCBqPW5QdHMtMSA7IGk8blB0cyA7IGo9aSsrICkge1xuICAgIHAxID0gcG9pbnRzW2ldOyBwMiA9IHBvaW50c1tqXTtcbiAgICBmID0gcDEueCpwMi55IC0gcDIueCpwMS55O1xuICAgIHR3aWNlYXJlYSArPSBmO1xuICAgIHggKz0gKCBwMS54ICsgcDIueCApICogZjtcbiAgICB5ICs9ICggcDEueSArIHAyLnkgKSAqIGY7XG4gIH1cbiAgZiA9IHR3aWNlYXJlYSAqIDM7XG4gIHJldHVybiB7IHg6eC9mLCB5OnkvZiB9O1xufVxuXG4vL2NvbXBhcmUgdHdvIHBvaW50cyB0YWtpbmcgcm91bmRpbmcgZXJyb3JzIGludG8gYWNjb3VudFxuZXhwb3J0IGNvbnN0IGNvbXBhcmVQb2ludHMgPSAocDEsIHAyKSA9PiB7XG4gIGlmKHR5cGVvZiBwMSA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHAyID09PSAndW5kZWZpbmVkJyl7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcDEgPSBwb2ludFRvRml4ZWQocDEsIDYpO1xuICBwMiA9IHBvaW50VG9GaXhlZChwMiwgNik7XG4gIGlmKHAxLnggPT09IHAyLnggJiYgcDEueSA9PT0gcDIueSkgcmV0dXJuIHRydWU7XG4gIGVsc2UgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgY29uc3QgcG9pbnRUb0ZpeGVkID0gKHAsIHBsYWNlcykgPT4ge1xuICByZXR1cm4ge1xuICAgIHg6IHAueC50b0ZpeGVkKHBsYWNlcyksXG4gICAgeTogcC55LnRvRml4ZWQocGxhY2VzKVxuICB9O1xufVxuXG4vKlxuLy9mbGlwIGEgc2V0IG9mIHBvaW50cyBvdmVyIGEgaHlwZXJvYmxpYyBsaW5lIGRlZmluZWQgYnkgdHdvIHBvaW50c1xuZXhwb3J0IGNvbnN0IHRyYW5zZm9ybSA9IChwb2ludHNBcnJheSwgcDEsIHAyKSA9PiB7XG4gIGxldCBuZXdQb2ludHNBcnJheSA9IFtdO1xuICBsZXQgYyA9IEUuZ3JlYXRDaXJjbGUocDEsIHAyLCBkaXNrLnJhZGl1cywgZGlzay5jZW50cmUpO1xuXG4gIGZvcihsZXQgcCBvZiBwb2ludHNBcnJheSl7XG4gICAgbGV0IG5ld1AgPSBFLmludmVyc2UocCwgYy5yYWRpdXMsIGMuY2VudHJlKTtcbiAgICBuZXdQb2ludHNBcnJheS5wdXNoKG5ld1ApO1xuICB9XG4gIHJldHVybiBuZXdQb2ludHNBcnJheTtcbn1cbiovXG4iLCJpbXBvcnQgeyBSZWd1bGFyVGVzc2VsYXRpb24gfSBmcm9tICcuL3JlZ3VsYXJUZXNzZWxhdGlvbic7XG5cbmltcG9ydCB7IFdlYkdMIH0gZnJvbSAnLi93ZWJnbCc7XG4vLyAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyAqXG4vLyAqICAgU0VUVVBcbi8vICpcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuY29uc3QgdyA9IG5ldyBXZWJHTCgpO1xuLy9jb25zdCB0ZXNzZWxhdGlvbiA9IG5ldyBSZWd1bGFyVGVzc2VsYXRpb24oNSwgNCwgMypNYXRoLlBJLzYqMCwgJ3JlZCcpO1xuIiwiaW1wb3J0ICogYXMgRSBmcm9tICcuL2V1Y2xpZCc7XG5pbXBvcnQgeyBEaXNrIH0gZnJvbSAnLi9kaXNrJztcbi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICogICAgVEVTU0VMQVRJT04gQ0xBU1Ncbi8vICogICAgQ3JlYXRlcyBhIHJlZ3VsYXIgVGVzc2VsYXRpb24gb2YgdGhlIFBvaW5jYXJlIERpc2tcbi8vICogICAgcTogbnVtYmVyIG9mIHAtZ29ucyBtZWV0aW5nIGF0IGVhY2ggdmVydGV4XG4vLyAqICAgIHA6IG51bWJlciBvZiBzaWRlcyBvZiBwLWdvblxuLy8gKiAgICB1c2luZyB0aGUgdGVjaG5pcXVlcyBjcmVhdGVkIGJ5IENveGV0ZXIgYW5kIER1bmhhbVxuLy8gKlxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuZXhwb3J0IGNsYXNzIFJlZ3VsYXJUZXNzZWxhdGlvbiBleHRlbmRzIERpc2sge1xuICBjb25zdHJ1Y3RvcihwLCBxLCByb3RhdGlvbiwgY29sb3VyLCBtYXhMYXllcnMsIGRyYXdDbGFzcykge1xuICAgIHN1cGVyKGRyYXdDbGFzcyk7XG4gICAgdGhpcy5wID0gcDtcbiAgICB0aGlzLnEgPSBxO1xuICAgIHRoaXMuY29sb3VyID0gY29sb3VyIHx8ICdibGFjayc7XG4gICAgdGhpcy5yb3RhdGlvbiA9IHJvdGF0aW9uIHx8IDA7XG4gICAgdGhpcy5tYXhMYXllcnMgPSBtYXhMYXllcnMgfHwgNTtcblxuICAgIGlmKHRoaXMuY2hlY2tQYXJhbXMoKSl7IHJldHVybiBmYWxzZTt9XG5cbiAgICB0aGlzLmZyID0gdGhpcy5mdW5kYW1lbnRhbFJlZ2lvbigpO1xuXG4gICAgdGhpcy5hcmModGhpcy5mci5hLCB0aGlzLmZyLmIpO1xuICAgIHRoaXMuYXJjKHRoaXMuZnIuYSwgdGhpcy5mci5jKTtcbiAgICB0aGlzLmFyYyh0aGlzLmZyLmIsIHRoaXMuZnIuYyk7XG4gIH1cblxuICAvL2NhbGN1bGF0ZSBmaXJzdCBwb2ludCBvZiBmdW5kYW1lbnRhbCBwb2x5Z29uIHVzaW5nIENveGV0ZXIncyBtZXRob2RcbiAgZnVuZGFtZW50YWxSZWdpb24oKXtcbiAgICBjb25zdCBzID0gTWF0aC5zaW4oTWF0aC5QSS90aGlzLnApO1xuICAgIGNvbnN0IHQgPSBNYXRoLmNvcyhNYXRoLlBJL3RoaXMucSk7XG4gICAgLy9tdWx0aXBseSB0aGVzZSBieSB0aGUgZGlza3MgcmFkaXVzIChDb3hldGVyIHVzZWQgdW5pdCBkaXNrKTtcbiAgICBjb25zdCByID0gMS9NYXRoLnNxcnQoKHQqdCkvKHMqcykgLTEpKnRoaXMucmFkaXVzO1xuICAgIGNvbnN0IGQgPSAxL01hdGguc3FydCgxLSAocypzKS8odCp0KSkqdGhpcy5yYWRpdXM7XG4gICAgY29uc3QgYiA9IHtcbiAgICAgIHg6IHRoaXMucmFkaXVzKk1hdGguY29zKE1hdGguUEkvdGhpcy5wKSxcbiAgICAgIHk6IC10aGlzLnJhZGl1cypNYXRoLnNpbihNYXRoLlBJL3RoaXMucClcbiAgICB9XG5cbiAgICBjb25zdCBjZW50cmUgPSB7eDogZCwgeTogMH07XG5cbiAgICAvL3RoZXJlIHdpbGwgYmUgdHdvIHBvaW50cyBvZiBpbnRlcnNlY3Rpb24sIG9mIHdoaWNoIHdlIHdhbnQgdGhlIGZpcnN0XG4gICAgY29uc3QgcDEgPSBFLmNpcmNsZUxpbmVJbnRlcnNlY3QoY2VudHJlLCByLCB0aGlzLmNlbnRyZSwgYikucDE7XG5cbiAgICByZXR1cm4ge1xuICAgICAgYTogdGhpcy5jZW50cmUsXG4gICAgICBiOiBwMSxcbiAgICAgIGM6IHsgeDogZC1yLCB5OiAwfVxuICAgIH07XG4gIH1cblxuICAvL1RoZSB0ZXNzZWxhdGlvbiByZXF1aXJlcyB0aGF0IChwLTIpKHEtMikgPiA0IHRvIHdvcmsgKG90aGVyd2lzZSBpdCBpc1xuICAvLyBlaXRoZXIgYW4gZWxsaXB0aWNhbCBvciBldWNsaWRlYW4gdGVzc2VsYXRpb24pO1xuICBjaGVja1BhcmFtcygpe1xuICAgIGlmKHRoaXMubWF4TGF5ZXJzIDwgMCB8fCBpc05hTih0aGlzLm1heExheWVycykpe1xuICAgICAgY29uc29sZS5lcnJvcignbWF4TGF5ZXJzIG11c3QgYmUgZ3JlYXRlciB0aGFuIDAnKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBlbHNlIGlmKCh0aGlzLnAgLTIpKih0aGlzLnEtMikgPD0gNCl7XG4gICAgICBjb25zb2xlLmVycm9yKCdIeXBlcmJvbGljIHRlc3NlbGF0aW9ucyByZXF1aXJlIHRoYXQgKHAtMSkocS0yKSA8IDQhJyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLy9Gb3Igbm93IHJlcXVpcmUgcCxxID4gMyxcbiAgICAvL1RPRE8gaW1wbGVtZW50IHNwZWNpYWwgY2FzZXMgZm9yIHEgPSAzIG9yIHAgPSAzXG4gICAgZWxzZSBpZih0aGlzLnEgPD0gMyB8fCBpc05hTih0aGlzLnEpKXtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1Rlc3NlbGF0aW9uIGVycm9yOiBhdCBsZWFzdCAzIHAtZ29ucyBtdXN0IG1lZXQgXFxcbiAgICAgICAgICAgICAgICAgICAgYXQgZWFjaCB2ZXJ0ZXghJyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZSBpZih0aGlzLnAgPD0gM3x8IGlzTmFOKHRoaXMucCkpe1xuICAgICAgY29uc29sZS5lcnJvcignVGVzc2VsYXRpb24gZXJyb3I6IHBvbHlnb24gbmVlZHMgYXQgbGVhc3QgMyBzaWRlcyEnKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBlbHNlIHsgcmV0dXJuIGZhbHNlOyB9XG4gIH1cbn1cbiIsIi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICpcbi8vICogIENBTlZBUyBDTEFTU1xuLy8gKlxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuZXhwb3J0IGNsYXNzIFdlYkdMIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdjYW52YXMnKTtcblxuICAgIC8vZnVsbHNjcmVlblxuICAgIHRoaXMuY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG4gICAgdGhpcy5nbCA9IHRoaXMuaW5pdFdlYkdMKGNhbnZhcyk7XG5cbiAgICB0aGlzLnJvdGF0aW9uID0gMDtcbiAgICB0aGlzLmxhc3RTcXVhcmVVcGRhdGVUaW1lID0gMDtcbiAgICB0aGlzLnNxdWFyZVhPZmZzZXQgPSAwLjA7XG4gICAgdGhpcy5zcXVhcmVZT2Zmc2V0ID0gMC4wO1xuICAgIHRoaXMuc3F1YXJlWk9mZnNldCA9IDAuMDtcbiAgICB0aGlzLmxhc3RTcXVhcmVVcGRhdGVUaW1lID0gMDtcbiAgICB0aGlzLnhJbmNWYWx1ZSA9IDAuMjtcbiAgICB0aGlzLnlJbmNWYWx1ZSA9IC0wLjQ7XG4gICAgdGhpcy56SW5jVmFsdWUgPSAwLjM7XG5cbiAgICBpZiAodGhpcy5nbCkge1xuICAgICAgdGhpcy5zdGFydCgpO1xuICAgICAgdGhpcy5pbml0U2hhZGVycygpO1xuICAgICAgdGhpcy5pbml0QnVmZmVycygpO1xuICAgICAgdGhpcy5kcmF3U2NlbmUoKTtcbiAgICB9XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICAvLyBTZXQgY2xlYXIgY29sb3IgdG8gYmxhY2ssIGZ1bGx5IG9wYXF1ZVxuICAgIHRoaXMuZ2wuY2xlYXJDb2xvcigwLjAsIDAuMCwgMC4wLCAxLjApO1xuICAgIC8vIEVuYWJsZSBkZXB0aCB0ZXN0aW5nXG4gICAgdGhpcy5nbC5lbmFibGUodGhpcy5nbC5ERVBUSF9URVNUKTtcbiAgICAvLyBOZWFyIHRoaW5ncyBvYnNjdXJlIGZhciB0aGluZ3NcbiAgICB0aGlzLmdsLmRlcHRoRnVuYyh0aGlzLmdsLkxFUVVBTCk7XG4gICAgLy8gQ2xlYXIgdGhlIGNvbG9yIGFzIHdlbGwgYXMgdGhlIGRlcHRoIGJ1ZmZlci5cbiAgICB0aGlzLmdsLmNsZWFyKHRoaXMuZ2wuQ09MT1JfQlVGRkVSX0JJVCB8IHRoaXMuZ2wuREVQVEhfQlVGRkVSX0JJVCk7XG4gIH1cblxuICBpbml0V2ViR0woY2FudmFzKSB7XG4gICAgdGhpcy5nbCA9IG51bGw7XG4gICAgdHJ5IHtcbiAgICAgIC8vIFRyeSB0byBncmFiIHRoZSBzdGFuZGFyZCBjb250ZXh0LiBJZiBpdCBmYWlscywgZmFsbGJhY2sgdG8gZXhwZXJpbWVudGFsLlxuICAgICAgdGhpcy5nbCA9IGNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbCcpIHx8IGNhbnZhcy5nZXRDb250ZXh0KCdleHBlcmltZW50YWwtd2ViZ2wnKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuXG4gICAgaWYgKCF0aGlzLmdsKSB7XG4gICAgICBhbGVydCgnVW5hYmxlIHRvIGluaXRpYWxpemUgV2ViR0wuIFlvdXIgYnJvd3NlciBtYXkgbm90IHN1cHBvcnQgaXQuJyk7XG4gICAgICB0aGlzLmdsID0gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZ2w7XG4gIH1cblxuICBpbml0U2hhZGVycygpIHtcbiAgICBjb25zdCBmcmFnbWVudFNoYWRlciA9IHRoaXMuZ2V0U2hhZGVyKHRoaXMuZ2wsICdzaGFkZXItZnMnKTtcbiAgICBjb25zdCB2ZXJ0ZXhTaGFkZXIgPSB0aGlzLmdldFNoYWRlcih0aGlzLmdsLCAnc2hhZGVyLXZzJyk7XG5cbiAgICAvLyBDcmVhdGUgdGhlIHNoYWRlciBwcm9ncmFtXG5cbiAgICB0aGlzLnNoYWRlclByb2dyYW0gPSB0aGlzLmdsLmNyZWF0ZVByb2dyYW0oKTtcbiAgICB0aGlzLmdsLmF0dGFjaFNoYWRlcih0aGlzLnNoYWRlclByb2dyYW0sIHZlcnRleFNoYWRlcik7XG4gICAgdGhpcy5nbC5hdHRhY2hTaGFkZXIodGhpcy5zaGFkZXJQcm9ncmFtLCBmcmFnbWVudFNoYWRlcik7XG4gICAgdGhpcy5nbC5saW5rUHJvZ3JhbSh0aGlzLnNoYWRlclByb2dyYW0pO1xuXG4gICAgLy8gSWYgY3JlYXRpbmcgdGhlIHNoYWRlciBwcm9ncmFtIGZhaWxlZCwgYWxlcnRcblxuICAgIGlmICghdGhpcy5nbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHRoaXMuc2hhZGVyUHJvZ3JhbSwgdGhpcy5nbC5MSU5LX1NUQVRVUykpIHtcbiAgICAgIGFsZXJ0KCdVbmFibGUgdG8gaW5pdGlhbGl6ZSB0aGUgc2hhZGVyIHByb2dyYW0uJyk7XG4gICAgfVxuXG4gICAgdGhpcy5nbC51c2VQcm9ncmFtKHRoaXMuc2hhZGVyUHJvZ3JhbSk7XG5cbiAgICB0aGlzLnZlcnRleFBvc2l0aW9uQXR0cmlidXRlID0gdGhpcy5nbC5nZXRBdHRyaWJMb2NhdGlvbih0aGlzLnNoYWRlclByb2dyYW0sICdhVmVydGV4UG9zaXRpb24nKTtcbiAgICB0aGlzLmdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHRoaXMudmVydGV4UG9zaXRpb25BdHRyaWJ1dGUpO1xuXG4gICAgdGhpcy52ZXJ0ZXhDb2xvckF0dHJpYnV0ZSA9IHRoaXMuZ2wuZ2V0QXR0cmliTG9jYXRpb24odGhpcy5zaGFkZXJQcm9ncmFtLCAnYVZlcnRleENvbG9yJyk7XG4gICAgdGhpcy5nbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheSh0aGlzLnZlcnRleENvbG9yQXR0cmlidXRlKTtcblxuICB9XG5cbiAgZ2V0U2hhZGVyKGdsLCBpZCkge1xuICAgIGxldCBzaGFkZXI7XG4gICAgY29uc3Qgc2hhZGVyU2NyaXB0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuXG4gICAgaWYgKCFzaGFkZXJTY3JpcHQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGxldCB0aGVTb3VyY2UgPSAnJztcbiAgICBsZXQgY3VycmVudENoaWxkID0gc2hhZGVyU2NyaXB0LmZpcnN0Q2hpbGQ7XG5cbiAgICB3aGlsZSAoY3VycmVudENoaWxkKSB7XG4gICAgICBpZiAoY3VycmVudENoaWxkLm5vZGVUeXBlID09IGN1cnJlbnRDaGlsZC5URVhUX05PREUpIHtcbiAgICAgICAgdGhlU291cmNlICs9IGN1cnJlbnRDaGlsZC50ZXh0Q29udGVudDtcbiAgICAgIH1cblxuICAgICAgY3VycmVudENoaWxkID0gY3VycmVudENoaWxkLm5leHRTaWJsaW5nO1xuICAgIH1cblxuICAgIGlmIChzaGFkZXJTY3JpcHQudHlwZSA9PSAneC1zaGFkZXIveC1mcmFnbWVudCcpIHtcbiAgICAgIHNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcihnbC5GUkFHTUVOVF9TSEFERVIpO1xuICAgIH0gZWxzZSBpZiAoc2hhZGVyU2NyaXB0LnR5cGUgPT0gJ3gtc2hhZGVyL3gtdmVydGV4Jykge1xuICAgICAgc2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKGdsLlZFUlRFWF9TSEFERVIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBVbmtub3duIHNoYWRlciB0eXBlXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZ2wuc2hhZGVyU291cmNlKHNoYWRlciwgdGhlU291cmNlKTtcblxuICAgIC8vIENvbXBpbGUgdGhlIHNoYWRlciBwcm9ncmFtXG4gICAgZ2wuY29tcGlsZVNoYWRlcihzaGFkZXIpO1xuXG4gICAgLy8gU2VlIGlmIGl0IGNvbXBpbGVkIHN1Y2Nlc3NmdWxseVxuICAgIGlmICghZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgZ2wuQ09NUElMRV9TVEFUVVMpKSB7XG4gICAgICBhbGVydCgnQW4gZXJyb3Igb2NjdXJyZWQgY29tcGlsaW5nIHRoZSBzaGFkZXJzOiAnICsgZ2wuZ2V0U2hhZGVySW5mb0xvZyhzaGFkZXIpKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBzaGFkZXI7XG4gIH1cblxuICBpbml0QnVmZmVycygpIHtcbiAgICAvL2NvbnN0IGhvcml6QXNwZWN0ID0gd2luZG93LmlubmVySGVpZ2h0IC8gd2luZG93LmlubmVyV2lkdGg7XG4gICAgdGhpcy5zcXVhcmVWZXJ0aWNlc0J1ZmZlciA9IHRoaXMuZ2wuY3JlYXRlQnVmZmVyKCk7XG4gICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLnNxdWFyZVZlcnRpY2VzQnVmZmVyKTtcblxuICAgIGNvbnN0IHZlcnRpY2VzID0gW1xuICAgICAgMS4wLCAxLjAsIDAuMCwgLTEuMCwgMS4wLCAwLjAsXG4gICAgICAxLjAsIC0xLjAsIDAuMCwgLTEuMCwgLTEuMCwgMC4wXG4gICAgXTtcblxuICAgIHRoaXMuZ2wuYnVmZmVyRGF0YSh0aGlzLmdsLkFSUkFZX0JVRkZFUixcbiAgICAgIG5ldyBGbG9hdDMyQXJyYXkodmVydGljZXMpLFxuICAgICAgdGhpcy5nbC5TVEFUSUNfRFJBVyk7XG5cbiAgICBjb25zdCBjb2xvcnMgPSBbXG4gICAgICAxLjAsIDEuMCwgMS4wLCAxLjAsIC8vIHdoaXRlXG4gICAgICAxLjAsIDAuMCwgMC4wLCAxLjAsIC8vIHJlZFxuICAgICAgMC4wLCAxLjAsIDAuMCwgMS4wLCAvLyBncmVlblxuICAgICAgMC4wLCAwLjAsIDEuMCwgMS4wIC8vIGJsdWVcbiAgICBdO1xuXG4gICAgdGhpcy5zcXVhcmVWZXJ0aWNlc0NvbG9yQnVmZmVyID0gdGhpcy5nbC5jcmVhdGVCdWZmZXIoKTtcbiAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIHRoaXMuc3F1YXJlVmVydGljZXNDb2xvckJ1ZmZlcik7XG4gICAgdGhpcy5nbC5idWZmZXJEYXRhKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCBuZXcgRmxvYXQzMkFycmF5KGNvbG9ycyksIHRoaXMuZ2wuU1RBVElDX0RSQVcpO1xuICB9XG5cbiAgZHJhd1NjZW5lKCkge1xuICAgIHRoaXMuZ2wuY2xlYXIodGhpcy5nbC5DT0xPUl9CVUZGRVJfQklUIHwgdGhpcy5nbC5ERVBUSF9CVUZGRVJfQklUKTtcblxuICAgIHRoaXMucGVyc3BlY3RpdmVNYXRyaXggPSBtYWtlUGVyc3BlY3RpdmUoNDUsIHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0LCAwLjEsIDEwMC4wKTtcblxuICAgIGxvYWRJZGVudGl0eSgpO1xuICAgIG12VHJhbnNsYXRlKFstMC4wLCAwLjAsIC02LjBdKTtcblxuICAgIC8vbXZQdXNoTWF0cml4KCk7XG4gICAgbXZSb3RhdGUodGhpcy5yb3RhdGlvbiwgWzEsIDAsIDFdKTtcblxuXG4gICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLnNxdWFyZVZlcnRpY2VzQnVmZmVyKTtcbiAgICB0aGlzLmdsLnZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy52ZXJ0ZXhQb3NpdGlvbkF0dHJpYnV0ZSwgMywgdGhpcy5nbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xuXG4gICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLnNxdWFyZVZlcnRpY2VzQ29sb3JCdWZmZXIpO1xuICAgIHRoaXMuZ2wudmVydGV4QXR0cmliUG9pbnRlcih0aGlzLnZlcnRleENvbG9yQXR0cmlidXRlLCA0LCB0aGlzLmdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XG5cbiAgICB0aGlzLnNldE1hdHJpeFVuaWZvcm1zKCk7XG4gICAgdGhpcy5nbC5kcmF3QXJyYXlzKHRoaXMuZ2wuVFJJQU5HTEVfU1RSSVAsIDAsIDQpO1xuXG4gICAgLy9tdlBvcE1hdHJpeCgpO1xuICAgIHRoaXMuY3VycmVudFRpbWUgPSBEYXRlLm5vdygpO1xuICAgIC8vaWYgKHRoaXMubGFzdFNxdWFyZVVwZGF0ZVRpbWUpIHtcbiAgICBjb25zdCBkZWx0YSA9IHRoaXMuY3VycmVudFRpbWUgLSB0aGlzLmxhc3RTcXVhcmVVcGRhdGVUaW1lO1xuICAgIHRoaXMucm90YXRpb24gKz0gKDMwICogZGVsdGEpIC8gMTAwMC4wO1xuICAgIC8vfVxuXG4gICAgdGhpcy5sYXN0U3F1YXJlVXBkYXRlVGltZSA9IHRoaXMuY3VycmVudFRpbWU7XG4gIH1cblxuICBzZXRNYXRyaXhVbmlmb3JtcygpIHtcbiAgICBjb25zdCBwVW5pZm9ybSA9IHRoaXMuZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMuc2hhZGVyUHJvZ3JhbSwgJ3VQTWF0cml4Jyk7XG4gICAgdGhpcy5nbC51bmlmb3JtTWF0cml4NGZ2KHBVbmlmb3JtLCBmYWxzZSwgbmV3IEZsb2F0MzJBcnJheSh0aGlzLnBlcnNwZWN0aXZlTWF0cml4LmZsYXR0ZW4oKSkpO1xuXG4gICAgY29uc3QgbXZVbmlmb3JtID0gdGhpcy5nbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5zaGFkZXJQcm9ncmFtLCAndU1WTWF0cml4Jyk7XG4gICAgdGhpcy5nbC51bmlmb3JtTWF0cml4NGZ2KG12VW5pZm9ybSwgZmFsc2UsIG5ldyBGbG9hdDMyQXJyYXkobXZNYXRyaXguZmxhdHRlbigpKSk7XG4gIH1cblxufVxuIl19
