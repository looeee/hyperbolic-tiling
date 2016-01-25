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
    }
  }, {
    key: 'getShader',
    value: function getShader(gl, id) {
      var shaderScript = undefined,
          theSource = undefined,
          currentChild = undefined,
          shader = undefined;

      shaderScript = document.getElementById(id);

      if (!shaderScript) {
        return null;
      }

      theSource = '';
      currentChild = shaderScript.firstChild;

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
      var horizAspect = window.innerHeight / window.innerWidth;
      this.squareVerticesBuffer = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.squareVerticesBuffer);

      var vertices = [1.0, 1.0, 0.0, -1.0, 1.0, 0.0, 1.0, -1.0, 0.0, -1.0, -1.0, 0.0];

      this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
    }
  }, {
    key: 'drawScene',
    value: function drawScene() {
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

      this.perspectiveMatrix = makePerspective(45, window.innerWidth / window.innerHeight, 0.1, 100.0);

      loadIdentity();
      mvTranslate([-0.0, 0.0, -6.0]);

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.squareVerticesBuffer);
      this.gl.vertexAttribPointer(this.vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);
      this.setMatrixUniforms();
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJlczIwMTUvY2FudmFzLmpzIiwiZXMyMDE1L2Rpc2suanMiLCJlczIwMTUvZXVjbGlkLmpzIiwiZXMyMDE1L21haW4uanMiLCJlczIwMTUvcmVndWxhclRlc3NlbGF0aW9uLmpzIiwiZXMyMDE1L3dlYmdsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztJQ0thLE1BQU07QUFDakIsV0FEVyxNQUFNLEdBQ0o7MEJBREYsTUFBTTs7QUFFZixRQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0MsUUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUM7OztBQUFDLEFBR3hDLFFBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7QUFDdEMsUUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFdBQVc7OztBQUFDLEFBR3hDLFFBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLENBQUM7R0FFbkU7OztBQUFBO2VBWlUsTUFBTTs7NEJBZ0JULENBQUMsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUM7QUFDM0MsVUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNyQixVQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLFdBQVcsRUFBRSxLQUFLLEdBQUcsV0FBVyxDQUFDLENBQUM7QUFDakYs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V0FBZixlQUFlLEdBQUcsU0FBbEIsZUFBZSxDQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBSztBQUNqRCxNQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2IsTUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNiLE1BQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDYixNQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2IsTUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsSUFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsSUFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsQ0FBQyxDQUFDOztBQUU1RCxNQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUEsSUFBSyxJQUFJLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQSxBQUFDLElBQUksSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUEsQUFBQyxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUEsQUFBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVwRyxNQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsR0FBSSxDQUFDLEdBQUcsQUFBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsSUFBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUEsQUFBQyxJQUFLLENBQUMsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFBLEFBQUMsQ0FBQztBQUNqRixNQUFJLEVBQUUsR0FBRyxRQUFRLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFBLEFBQUMsQ0FBQztBQUN0RCxNQUFJLEVBQUUsR0FBRyxRQUFRLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFBLEFBQUMsQ0FBQzs7QUFFdEQsTUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksQ0FBQyxHQUFHLEFBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLElBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFBLEFBQUMsSUFBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7QUFDakYsTUFBSSxFQUFFLEdBQUcsUUFBUSxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7QUFDdEQsTUFBSSxFQUFFLEdBQUcsUUFBUSxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7O0FBRXRELE1BQUksRUFBRSxHQUFHO0FBQ1AsS0FBQyxFQUFFLEVBQUU7QUFDTCxLQUFDLEVBQUUsRUFBRTtHQUNOLENBQUE7O0FBRUQsTUFBSSxFQUFFLEdBQUc7QUFDUCxLQUFDLEVBQUUsRUFBRTtBQUNMLEtBQUMsRUFBRSxFQUFFO0dBQ04sQ0FBQTs7QUFFRCxTQUFPO0FBQ0wsTUFBRSxFQUFFLEVBQUU7QUFDTixNQUFFLEVBQUUsRUFBRTtHQUNQLENBQUM7Q0FDSCxDQUFBOztBQUVNLElBQU0sbUJBQW1CLFdBQW5CLG1CQUFtQixHQUFHLFNBQXRCLG1CQUFtQixDQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBSzs7QUFFbkQsTUFBTSxDQUFDLEdBQUcsUUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7O0FBQUMsQUFFM0IsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUEsR0FBRSxDQUFDLENBQUM7QUFDM0IsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUEsR0FBRSxDQUFDOzs7QUFBQyxBQUczQixNQUFNLENBQUMsR0FBRyxFQUFFLElBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRSxFQUFFLENBQUMsQ0FBQyxDQUFBLEFBQUMsR0FBRyxFQUFFLElBQUUsQ0FBQyxDQUFDLENBQUMsR0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBQztBQUN6QyxNQUFNLENBQUMsR0FBSSxFQUFDLENBQUMsRUFBRSxDQUFDLEdBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBQzs7O0FBQUMsQUFHOUMsTUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7OztBQUFDLEFBRzFCLE1BQUcsRUFBRSxHQUFHLENBQUMsRUFBQztBQUNSLFFBQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUUsQ0FBQyxHQUFDLENBQUMsR0FBRyxFQUFFLEdBQUMsRUFBRSxDQUFDOztBQUFDLEFBRW5DLFFBQU0sRUFBRSxHQUFHO0FBQ1QsT0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQSxHQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUNuQixPQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUMsRUFBRSxDQUFBLEdBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0tBQ3BCOztBQUFBLEFBRUQsUUFBTSxFQUFFLEdBQUc7QUFDVCxPQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUMsRUFBRSxDQUFBLEdBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ25CLE9BQUMsRUFBRSxDQUFD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QUFFLFdBQVcsQ0FBQyxDQUFDO0FBQzVFLFVBQUksQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxJQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ2xGOzs7U0EvSVUsS0FBSyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyAqXG4vLyAqICBDQU5WQVMgQ0xBU1Ncbi8vICpcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbmV4cG9ydCBjbGFzcyBDYW52YXN7XG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdjYW52YXMnKTtcbiAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICAvL2Z1bGxzY3JlZW5cbiAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuICAgIC8vdHJhbnNmb3JtIHRoZSBjYW52YXMgc28gdGhlIG9yaWdpbiBpcyBhdCB0aGUgY2VudHJlIG9mIHRoZSBkaXNrXG4gICAgdGhpcy5jdHgudHJhbnNsYXRlKHdpbmRvdy5pbm5lcldpZHRoIC8gMiwgd2luZG93LmlubmVySGVpZ2h0IC8gMik7XG5cbiAgfVxuXG5cbiAgLy9kcmF3IGEgaHlwZXJib2xpYyBsaW5lIHNlZ21lbnQgdXNpbmcgY2FsY3VsYXRpb25zIGZyb20gbGluZSgpIG9yIGFyYygpXG4gIHNlZ21lbnQoYywgYWxwaGEsIGFscGhhT2Zmc2V0LCBjb2xvdXIsIHdpZHRoKXtcbiAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICB0aGlzLmN0eC5hcmMoYy5jZW50cmUueCwgYy5jZW50cmUueSwgYy5yYWRpdXMsIGFscGhhT2Zmc2V0LCBhbHBoYSArIGFscGhhT2Zmc2V0KTtcbiAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IGNvbG91ciB8fCAnYmxhY2snO1xuICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IHdpZHRoIHx8IDE7XG4gICAgdGhpcy5jdHguc3Ryb2tlKCk7XG4gIH1cblxuICAvL2RyYXcgYSAoZXVjbGlkZWFuKSBsaW5lIGJldHdlZW4gdHdvIHBvaW50c1xuICBldWNsaWRlYW5MaW5lKHAxLCBwMiwgY29sb3VyLCB3aWR0aCl7XG4gICAgY29uc3QgYyA9IGNvbG91ciB8fCAnYmxhY2snO1xuICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgIHRoaXMuY3R4Lm1vdmVUbyhwMS54LCBwMS55KTtcbiAgICB0aGlzLmN0eC5saW5lVG8ocDIueCwgcDIueSk7XG4gICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBjO1xuICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IHdpZHRoIHx8IDE7XG4gICAgdGhpcy5jdHguc3Ryb2tlKClcbiAgfVxuXG4gIC8vZHJhdyBhIHBvaW50IG9uIHRoZSBkaXNrLCBvcHRpb25hbCByYWRpdXMgYW5kIGNvbG91clxuICBwb2ludChwb2ludCwgcmFkaXVzLCBjb2xvdXIpe1xuICAgIGNvbnN0IGNvbCA9IGNvbG91ciB8fCAnYmxhY2snO1xuICAgIGNvbnN0IHIgPSByYWRpdXMgfHwgMjtcbiAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICB0aGlzLmN0eC5hcmMocG9pbnQueCwgcG9pbnQueSwgciwgMCwgTWF0aC5QSSAqIDIsIHRydWUpO1xuICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGNvbDtcbiAgICB0aGlzLmN0eC5maWxsKCk7XG4gIH1cblxuICAvL2RyYXcgYSBjaXJjbGUgb2YgcmFkaXVzIHIgY2VudHJlIGMgYW5kIG9wdGlvbmFsIGNvbG91clxuICBjaXJjbGUoYywgciwgY29sb3VyLCB3aWR0aCl7XG4gICAgY29uc3QgY29sID0gY29sb3VyIHx8ICdibGFjayc7XG4gICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgdGhpcy5jdHguYXJjKGMueCwgYy55LCByLCAwLCBNYXRoLlBJICogMik7XG4gICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBjb2w7XG4gICAgdGhpcy5jdHgubGluZVdpZHRoID0gd2lkdGggfHwgMTtcbiAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgfVxuXG4gIC8vY29udmVydCB0aGUgY2FudmFzIHRvIGEgYmFzZTY0VVJMIGFuZCBzZW5kIHRvIHNhdmVJbWFnZS5waHBcbiAgc2F2ZUltYWdlKCl7XG4gICAgY29uc3QgZGF0YSA9IHRoaXMuY2FudmFzLnRvRGF0YVVSTCgpO1xuICAgICQuYWpheCh7XG4gICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICB1cmw6ICdzYXZlSW1hZ2UucGhwJyxcbiAgICAgIGRhdGE6IHsgaW1nOiBkYXRhIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vdGhlIGNhbnZhcyBoYXMgYmVlbiB0cmFuc2xhdGVkIHRvIHRoZSBjZW50cmUgb2YgdGhlIGRpc2sgc28gbmVlZCB0b1xuICAvL3VzZSBhbiBvZmZzZXQgdG8gY2xlYXIgaXQuIE5PVCBXT1JLSU5HIFdIRU4gU0NSRUVOIElTIFJFU0laRURcbiAgY2xlYXJTY3JlZW4oKSB7XG4gICAgdGhpcy5jdHguY2xlYXJSZWN0KC13aW5kb3cuaW5uZXJXaWR0aC8yLC13aW5kb3cuaW5uZXJIZWlnaHQvMixcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICB9XG5cbn1cbiIsImltcG9ydCAqIGFzIEUgZnJvbSAnLi9ldWNsaWQnO1xuaW1wb3J0IHsgQ2FudmFzIH0gZnJvbSAnLi9jYW52YXMnO1xuXG4vLyAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyAqXG4vLyAqICAgRElTSyBDTEFTU1xuLy8gKiAgIFBvaW5jYXJlIERpc2sgcmVwcmVzZW50YXRpb24gb2YgdGhlIGh5cGVyYm9saWMgcGxhbmVcbi8vICogICBDb250YWlucyBhbnkgZnVuY3Rpb25zIHVzZWQgdG8gZHJhdyB0byB0aGUgZGlza1xuLy8gKiAgIENvbnN0cnVjdG9yIHRha2VzIHRoZSBkcmF3aW5nIGNsYXNzIGFzIGFuIGFyZ3VtZW50XG4vLyAqICAgKEN1cnJlbnRseSBvbmx5IENhbnZhcyB1c2VkLCBtaWdodCBzd2l0Y2ggdG8gV2ViR0wgaW4gZnV0dXJlKVxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuZXhwb3J0IGNsYXNzIERpc2sge1xuICBjb25zdHJ1Y3RvcihkcmF3Q2xhc3MpIHtcbiAgICBkcmF3Q2xhc3MgPSBkcmF3Q2xhc3MgfHwgJ2NhbnZhcyc7XG4gICAgaWYoZHJhd0NsYXNzID09PSAnY2FudmFzJyl7XG4gICAgICB0aGlzLmRyYXcgPSBuZXcgQ2FudmFzKCk7XG4gICAgfVxuICAgIHRoaXMuZHJhdy5jbGVhclNjcmVlbigpO1xuXG4gICAgdGhpcy5jZW50cmUgPSB7XG4gICAgICB4OiAwLFxuICAgICAgeTogMFxuICAgIH1cblxuICAgIC8vZHJhdyBsYXJnZXN0IGNpcmNsZSBwb3NzaWJsZSBnaXZlbiB3aW5kb3cgZGltc1xuICAgIHRoaXMucmFkaXVzID0gKHdpbmRvdy5pbm5lcldpZHRoIDwgd2luZG93LmlubmVySGVpZ2h0KSA/ICh3aW5kb3cuaW5uZXJXaWR0aCAvIDIpIC0gNSA6ICh3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKSAtIDU7XG5cbiAgICAvL3NtYWxsZXIgY2lyY2xlIGZvciB0ZXN0aW5nXG4gICAgLy8gL3RoaXMucmFkaXVzID0gdGhpcy5yYWRpdXMgLyAzO1xuXG4gICAgdGhpcy5vdXRlckNpcmNsZSgpO1xuICB9XG5cbiAgLy9kcmF3IHRoZSBib3VuZGFyeSBjaXJjbGVcbiAgb3V0ZXJDaXJjbGUoKSB7XG4gICAgdGhpcy5kcmF3LmNpcmNsZSh7eDogdGhpcy5jZW50cmUueCwgeTogdGhpcy5jZW50cmUueX0sIHRoaXMucmFkaXVzKTtcbiAgfVxuXG4gIC8vZHJhdyBhIGh5cGVyYm9saWMgbGluZSBiZXR3ZWVuIHR3byBwb2ludHMgb24gdGhlIGJvdW5kYXJ5IGNpcmNsZVxuICBsaW5lKHAxLCBwMiwgY29sb3VyKSB7XG4gICAgLy9sZXQgcHRzID0gdGhpcy5wcmVwUG9pbnRzKHAxLCBwMik7XG4gICAgLy9wMSA9IHB0cy5wMTtcbiAgICAvL3AyID0gcHRzLnAyO1xuICAgIGxldCBjb2wgPSBjb2xvdXIgfHwgJ2JsYWNrJztcbiAgICBsZXQgYywgcG9pbnRzO1xuXG4gICAgaWYoRS50aHJvdWdoT3JpZ2luKHAxLHAyKSl7XG4gICAgICBsZXQgdSA9IG5vcm1hbFZlY3RvcihwMSxwMik7XG4gICAgICBwb2ludHMgPSB7XG4gICAgICAgIHAxOiB7XG4gICAgICAgICAgeDogdS54ICogdGhpcy5yYWRpdXMsXG4gICAgICAgICAgeTogdS55ICogdGhpcy5yYWRpdXNcbiAgICAgICAgfSxcbiAgICAgICAgcDI6IHtcbiAgICAgICAgICB4OiAtdS54ICogdGhpcy5yYWRpdXMsXG4gICAgICAgICAgeTogLXUueSAqIHRoaXMucmFkaXVzXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuZHJhdy5ldWNsaWRlYW5MaW5lKHBvaW50cy5wMSxwb2ludHMucDIsIGNvbCk7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICBjID0gRS5ncmVhdENpcmNsZShwMSwgcDIsIHRoaXMucmFkaXVzLCB0aGlzLmNlbnRyZSk7XG4gICAgICBwb2ludHMgPSBFLmNpcmNsZUludGVyc2VjdCh0aGlzLmNlbnRyZSwgYy5jZW50cmUsIHRoaXMucmFkaXVzLCBjLnJhZGl1cyk7XG5cbiAgICAgIC8vYW5nbGUgc3VidGVuZGVkIGJ5IHRoZSBhcmNcbiAgICAgIGxldCBhbHBoYSA9IEUuY2VudHJhbEFuZ2xlKHBvaW50cy5wMSwgcG9pbnRzLnAyLCBjLnJhZGl1cyk7XG5cbiAgICAgIGxldCBvZmZzZXQgPSB0aGlzLmFscGhhT2Zmc2V0KHBvaW50cy5wMiwgcG9pbnRzLnAyLCBjLCAnbGluZScpO1xuICAgICAgdGhpcy5kcmF3LnNlZ21lbnQoYywgYWxwaGEsIG9mZnNldCwgY29sKTtcbiAgICB9XG4gIH1cblxuICAvL2NhbGN1bGF0ZSB0aGUgb2Zmc2V0IChwb3NpdGlvbiBhcm91bmQgdGhlIGNpcmNsZSBmcm9tIHdoaWNoIHRvIHN0YXJ0IHRoZVxuICAvL2xpbmUgb3IgYXJjKS4gQXMgY2FudmFzIGRyYXdzIGFyY3MgY2xvY2t3aXNlIGJ5IGRlZmF1bHQgdGhpcyB3aWxsIGNoYW5nZVxuICAvL2RlcGVuZGluZyBvbiB3aGVyZSB0aGUgYXJjIGlzIHJlbGF0aXZlIHRvIHRoZSBvcmlnaW5cbiAgLy9zcGVjaWZpY2FsbCB3aGV0aGVyIGl0IGxpZXMgb24gdGhlIHggYXhpcywgb3IgYWJvdmUgb3IgYmVsb3cgaXRcbiAgLy90eXBlID0gJ2xpbmUnIG9yICdhcmMnXG4gIGFscGhhT2Zmc2V0KHAxLCBwMiwgYywgdHlwZSkge1xuICAgIGxldCBvZmZzZXQ7XG5cbiAgICAvL3BvaW50cyBhdCAwIHJhZGlhbnMgb24gZ3JlYXRDaXJjbGVcbiAgICBsZXQgcCA9IHtcbiAgICAgIHg6IGMuY2VudHJlLnggKyBjLnJhZGl1cyxcbiAgICAgIHk6IGMuY2VudHJlLnlcbiAgICB9XG5cbiAgICBpZihwMS55IDwgYy5jZW50cmUueSl7XG4gICAgICBvZmZzZXQgPSAyKk1hdGguUEkgLSBFLmNlbnRyYWxBbmdsZShwMSwgcCwgYy5yYWRpdXMpO1xuICAgIH1cbiAgICBlbHNle1xuICAgICAgb2Zmc2V0ID0gRS5jZW50cmFsQW5nbGUocDEsIHAsIGMucmFkaXVzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb2Zmc2V0O1xuICB9XG5cbiAgLy9wdXQgcG9pbnRzIGluIGNsb2Nrd2lzZSBvcmRlclxuICBwcmVwUG9pbnRzKHAxLCBwMiwgYyl7XG4gICAgY29uc3QgcCA9IHt4OiBjLmNlbnRyZS54ICsgYy5yYWRpdXMsIHk6IGMuY2VudHJlLnl9O1xuICAgIC8vY2FzZSB3aGVyZSBwb2ludHMgYXJlIGFib3ZlIGFuZCBiZWxvdyB0aGUgbGluZSBjLmNlbnRyZSAtPiBwXG4gICAgLy9pbiB0aGlzIGNhc2UganVzdCByZXR1cm4gcG9pbnRzXG4gICAgY29uc3Qgb3kgPSBjLmNlbnRyZS55O1xuICAgIGNvbnN0IG94ID0gYy5jZW50cmUueDtcblxuICAgIGlmKHAxLnggPiBveCAmJiBwMi54ID4gb3gpe1xuICAgICAgaWYocDEueSA+IG95ICYmIHAyLnkgPCBveSkgcmV0dXJuIHtwMTogcDIsIHAyOiBwMX07XG4gICAgICBlbHNlIGlmKHAxLnkgPCBveSAmJiBwMi55ID4gb3kpIHJldHVybiB7cDE6IHAxLCBwMjogcDJ9O1xuICAgIH1cblxuICAgIGxldCBhbHBoYTEgPSBFLmNlbnRyYWxBbmdsZShwLCBwMSwgYy5yYWRpdXMpO1xuICAgIGFscGhhMSA9IChwMS55IDwgYy5jZW50cmUueSkgPyAyKk1hdGguUEkgLSBhbHBoYTEgOiBhbHBoYTE7XG4gICAgbGV0IGFscGhhMiA9IEUuY2VudHJhbEFuZ2xlKHAsIHAyLCBjLnJhZGl1cyk7XG4gICAgYWxwaGEyID0gKHAyLnkgPCBjLmNlbnRyZS55KSA/IDIqTWF0aC5QSSAtIGFscGhhMiA6IGFscGhhMjtcblxuICAgIC8vaWYgdGhlIHBvaW50cyBhcmUgbm90IGluIGNsb2Nrd2lzZSBvcmRlciBmbGlwIHRoZW1cbiAgICBpZihhbHBoYTEgPiBhbHBoYTIpIHJldHVybiB7cDE6IHAyLCBwMjogcDF9O1xuICAgIGVsc2UgcmV0dXJuIHtwMTogcDEsIHAyOiBwMn07XG5cbiAgfVxuXG4gIC8vRHJhdyBhbiBhcmMgKGh5cGVyYm9saWMgbGluZSBzZWdtZW50KSBiZXR3ZWVuIHR3byBwb2ludHMgb24gdGhlIGRpc2tcbiAgYXJjKHAxLCBwMiwgY29sb3VyKSB7XG4gICAgaWYoRS50aHJvdWdoT3JpZ2luKHAxLHAyKSl7XG4gICAgICB0aGlzLmRyYXcuZXVjbGlkZWFuTGluZShwMSxwMiwgY29sb3VyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IGNvbCA9IGNvbG91ciB8fCAnYmxhY2snO1xuICAgIGxldCBjID0gRS5ncmVhdENpcmNsZShwMSwgcDIsIHRoaXMucmFkaXVzLCB0aGlzLmNlbnRyZSk7XG4gICAgbGV0IHB0cyA9IHRoaXMucHJlcFBvaW50cyhwMSwgcDIsIGMpO1xuICAgIHAxID0gcHRzLnAxO1xuICAgIHAyID0gcHRzLnAyO1xuXG4gICAgLy9sZW5ndGggb2YgdGhlIGFyY1xuICAgIGxldCBhbHBoYSA9IEUuY2VudHJhbEFuZ2xlKHAxLCBwMiwgYy5yYWRpdXMpO1xuXG4gICAgLy9ob3cgZmFyIGFyb3VuZCB0aGUgZ3JlYXRDaXJjbGUgdG8gc3RhcnQgZHJhd2luZyB0aGUgYXJjXG4gICAgbGV0IG9mZnNldCA9IHRoaXMuYWxwaGFPZmZzZXQocDEsIHAyLCBjLCAnYXJjJyk7XG4gICAgdGhpcy5kcmF3LnNlZ21lbnQoYywgYWxwaGEsIG9mZnNldCwgY29sb3VyKTtcbiAgfVxuXG4gIHBvbHlnb24odmVydGljZXMsIGNvbG91cikge1xuICAgIGxldCBsID0gdmVydGljZXMubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICB0aGlzLmFyYyh2ZXJ0aWNlc1tpXSwgdmVydGljZXNbKGkgKyAxKSVsXSwgY29sb3VyKTtcbiAgICB9XG4gIH1cblxuICAvL3JldHVybiB0cnVlIGlmIHRoZSBwb2ludCBpcyBub3QgaW4gdGhlIGRpc2tcbiAgY2hlY2tQb2ludChwb2ludCkge1xuICAgIGxldCByID0gdGhpcy5yYWRpdXM7XG4gICAgaWYgKEUuZGlzdGFuY2UocG9pbnQsIHRoaXMuY2VudHJlKSA+IHIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yISBQb2ludCAoJyArIHBvaW50LnggKyAnLCAnICsgcG9pbnQueSArICcpIGxpZXMgb3V0c2lkZSB0aGUgcGxhbmUhJyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG4iLCIvLyAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyAqXG4vLyAqICAgRVVDTElERUFOIEZVTkNUSU9OU1xuLy8gKiAgIGFsbCBFdWNsaWRlYW4gbWF0aGVtYXRpY2FsIGZ1bmN0aW9ucyBnbyBoZXJlXG4vLyAqXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbi8vZGlzdGFuY2UgYmV0d2VlbiB0d28gcG9pbnRzXG5leHBvcnQgY29uc3QgZGlzdGFuY2UgPSAocDEsIHAyKSA9PiBNYXRoLnNxcnQoTWF0aC5wb3coKHAyLnggLSBwMS54KSwgMikgKyBNYXRoLnBvdygocDIueSAtIHAxLnkpLCAyKSk7XG5cbi8vbWlkcG9pbnQgb2YgdGhlIGxpbmUgc2VnbWVudCBjb25uZWN0aW5nIHR3byBwb2ludHNcbmV4cG9ydCBjb25zdCBtaWRwb2ludCA9IChwMSwgcDIpID0+IHtcbiAgcmV0dXJuIHtcbiAgICB4OiAocDEueCArIHAyLngpIC8gMixcbiAgICB5OiAocDEueSArIHAyLnkpIC8gMlxuICB9XG59XG5cbi8vc2xvcGUgb2YgbGluZSB0aHJvdWdoIHAxLCBwMlxuZXhwb3J0IGNvbnN0IHNsb3BlID0gKHAxLCBwMikgPT4gKHAyLnggLSBwMS54KSAvIChwMi55IC0gcDEueSk7XG5cbi8vc2xvcGUgb2YgbGluZSBwZXJwZW5kaWN1bGFyIHRvIGEgbGluZSBkZWZpbmVkIGJ5IHAxLHAyXG5leHBvcnQgY29uc3QgcGVycGVuZGljdWxhclNsb3BlID0gKHAxLCBwMikgPT4gLTEgLyAoTWF0aC5wb3coc2xvcGUocDEsIHAyKSwgLTEpKTtcblxuLy9pbnRlcnNlY3Rpb24gcG9pbnQgb2YgdHdvIGxpbmVzIGRlZmluZWQgYnkgcDEsbTEgYW5kIHExLG0yXG4vL05PVCBXT1JLSU5HIEZPUiBWRVJUSUNBTCBMSU5FUyEhIVxuZXhwb3J0IGNvbnN0IGludGVyc2VjdGlvbiA9IChwMSwgbTEsIHAyLCBtMikgPT4ge1xuICBsZXQgYzEsIGMyLCB4LCB5O1xuICAvL2Nhc2Ugd2hlcmUgZmlyc3QgbGluZSBpcyB2ZXJ0aWNhbFxuICAvL2lmKG0xID4gNTAwMCB8fCBtMSA8IC01MDAwIHx8IG0xID09PSBJbmZpbml0eSl7XG4gIGlmKHAxLnkgPCAwLjAwMDAwMSAmJiBwMS55ID4gLTAuMDAwMDAxICl7XG4gICAgeCA9IHAxLng7XG4gICAgeSA9IChtMikqKHAxLngtcDIueCkgKyBwMi55O1xuICB9XG4gIC8vY2FzZSB3aGVyZSBzZWNvbmQgbGluZSBpcyB2ZXJ0aWNhbFxuICAvL2Vsc2UgaWYobTIgPiA1MDAwIHx8IG0yIDwgLTUwMDAgfHwgbTEgPT09IEluZmluaXR5KXtcbiAgZWxzZSBpZihwMi55IDwgMC4wMDAwMDEgJiYgcDIueSA+IC0wLjAwMDAwMSApe1xuICAgIHggPSBwMi54O1xuICAgIHkgPSAobTEqKHAyLngtcDEueCkpICsgcDEueTtcbiAgfVxuICBlbHNle1xuICAgIC8veSBpbnRlcmNlcHQgb2YgZmlyc3QgbGluZVxuICAgIGMxID0gcDEueSAtIG0xICogcDEueDtcbiAgICAvL3kgaW50ZXJjZXB0IG9mIHNlY29uZCBsaW5lXG4gICAgYzIgPSBwMi55IC0gbTIgKiBwMi54O1xuXG4gICAgeCA9IChjMiAtIGMxKSAvIChtMSAtIG0yKTtcbiAgICB5ID0gbTEgKiB4ICsgYzE7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHg6IHgsXG4gICAgeTogeVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCByYWRpYW5zID0gKGRlZ3JlZXMpID0+IChNYXRoLlBJIC8gMTgwKSAqIGRlZ3JlZXM7XG5cbi8vZ2V0IHRoZSBjaXJjbGUgaW52ZXJzZSBvZiBhIHBvaW50IHAgd2l0aCByZXNwZWN0IGEgY2lyY2xlIHJhZGl1cyByIGNlbnRyZSBjXG5leHBvcnQgY29uc3QgaW52ZXJzZSA9IChwLCByLCBjKSA9PiB7XG4gIGxldCBhbHBoYSA9IChyICogcikgLyAoTWF0aC5wb3cocC54IC0gYy54LCAyKSArIE1hdGgucG93KHAueSAtIGMueSwgMikpO1xuICByZXR1cm4ge1xuICAgIHg6IGFscGhhICogKHAueCAtIGMueCkgKyBjLngsXG4gICAgeTogYWxwaGEgKiAocC55IC0gYy55KSArIGMueVxuICB9O1xufVxuXG4vL2NhbGN1bGF0ZSB0aGUgcmFkaXVzIGFuZCBjZW50cmUgb2YgdGhlIGNpcmNsZSByZXF1aXJlZCB0byBkcmF3IGEgbGluZSBiZXR3ZWVuXG4vL3R3byBwb2ludHMgaW4gdGhlIGh5cGVyYm9saWMgcGxhbmUgZGVmaW5lZCBieSB0aGUgZGlzayAociwgYylcbmV4cG9ydCBjb25zdCBncmVhdENpcmNsZSA9IChwMSwgcDIsIHIsIGMpID0+IHtcbiAgbGV0IHAxSW52ZXJzZSA9IGludmVyc2UocDEsIHIsIGMpO1xuICBsZXQgcDJJbnZlcnNlID0gaW52ZXJzZShwMiwgciwgYyk7XG5cbiAgbGV0IG0gPSBtaWRwb2ludChwMSwgcDFJbnZlcnNlKTtcbiAgbGV0IG4gPSBtaWRwb2ludChwMiwgcDJJbnZlcnNlKTtcblxuICBsZXQgbTEgPSBwZXJwZW5kaWN1bGFyU2xvcGUobSwgcDFJbnZlcnNlKTtcbiAgbGV0IG0yID0gcGVycGVuZGljdWxhclNsb3BlKG4sIHAySW52ZXJzZSk7XG5cblxuICAvL2NlbnRyZSBpcyB0aGUgY2VudHJlcG9pbnQgb2YgdGhlIGNpcmNsZSBvdXQgb2Ygd2hpY2ggdGhlIGFyYyBpcyBtYWRlXG4gIGxldCBjZW50cmUgPSBpbnRlcnNlY3Rpb24obSwgbTEsIG4sIG0yKTtcbiAgbGV0IHJhZGl1cyA9IGRpc3RhbmNlKGNlbnRyZSwgcDEpO1xuICByZXR1cm4ge1xuICAgIGNlbnRyZTogY2VudHJlLFxuICAgIHJhZGl1czogcmFkaXVzXG4gIH07XG59XG5cbi8vYW4gYXR0ZW1wdCBhdCBjYWxjdWxhdGluZyB0aGUgY2lyY2xlIGFsZ2VicmFpY2FsbHlcbmV4cG9ydCBjb25zdCBncmVhdENpcmNsZVYyID0gKHAxLHAyLCByKSA9PntcbiAgbGV0IHggPSAocDIueSoocDEueCpwMS54ICsgcikrIHAxLnkqcDEueSpwMi55LXAxLnkqKHAyLngqcDIueCsgcDIueSpwMi55ICsgcikpLygyKnAxLngqcDIueSAtIHAxLnkqcDIueCk7XG4gIGxldCB5ID0gKHAxLngqcDEueCpwMi54IC0gcDEueCoocDIueCpwMi54K3AyLnkqcDIueStyKStwMi54KihwMS55KnAxLnkrcikpLygyKnAxLnkqcDIueCArIDIqcDEueCpwMi55KTtcbiAgbGV0IHJhZGl1cyA9ICAgTWF0aC5zcXJ0KHgqeCt5Knktcik7XG4gIHJldHVybiB7XG4gICAgY2VudHJlOiB7XG4gICAgICB4OiB4LFxuICAgICAgeTogeVxuICAgIH0sXG4gICAgcmFkaXVzOiByYWRpdXNcbiAgfVxufVxuXG4vL2ludGVyc2VjdGlvbiBvZiB0d28gY2lyY2xlcyB3aXRoIGVxdWF0aW9uczpcbi8vKHgtYSleMiArKHktYSleMiA9IHIwXjJcbi8vKHgtYileMiArKHktYyleMiA9IHIxXjJcbi8vTk9URSBhc3N1bWVzIHRoZSB0d28gY2lyY2xlcyBETyBpbnRlcnNlY3QhXG5leHBvcnQgY29uc3QgY2lyY2xlSW50ZXJzZWN0ID0gKGMwLCBjMSwgcjAsIHIxKSA9PiB7XG4gIGxldCBhID0gYzAueDtcbiAgbGV0IGIgPSBjMC55O1xuICBsZXQgYyA9IGMxLng7XG4gIGxldCBkID0gYzEueTtcbiAgbGV0IGRpc3QgPSBNYXRoLnNxcnQoKGMgLSBhKSAqIChjIC0gYSkgKyAoZCAtIGIpICogKGQgLSBiKSk7XG5cbiAgbGV0IGRlbCA9IE1hdGguc3FydCgoZGlzdCArIHIwICsgcjEpICogKGRpc3QgKyByMCAtIHIxKSAqIChkaXN0IC0gcjAgKyByMSkgKiAoLWRpc3QgKyByMCArIHIxKSkgLyA0O1xuXG4gIGxldCB4UGFydGlhbCA9IChhICsgYykgLyAyICsgKChjIC0gYSkgKiAocjAgKiByMCAtIHIxICogcjEpKSAvICgyICogZGlzdCAqIGRpc3QpO1xuICBsZXQgeDEgPSB4UGFydGlhbCAtIDIgKiBkZWwgKiAoYiAtIGQpIC8gKGRpc3QgKiBkaXN0KTtcbiAgbGV0IHgyID0geFBhcnRpYWwgKyAyICogZGVsICogKGIgLSBkKSAvIChkaXN0ICogZGlzdCk7XG5cbiAgbGV0IHlQYXJ0aWFsID0gKGIgKyBkKSAvIDIgKyAoKGQgLSBiKSAqIChyMCAqIHIwIC0gcjEgKiByMSkpIC8gKDIgKiBkaXN0ICogZGlzdCk7XG4gIGxldCB5MSA9IHlQYXJ0aWFsICsgMiAqIGRlbCAqIChhIC0gYykgLyAoZGlzdCAqIGRpc3QpO1xuICBsZXQgeTIgPSB5UGFydGlhbCAtIDIgKiBkZWwgKiAoYSAtIGMpIC8gKGRpc3QgKiBkaXN0KTtcblxuICBsZXQgcDEgPSB7XG4gICAgeDogeDEsXG4gICAgeTogeTFcbiAgfVxuXG4gIGxldCBwMiA9IHtcbiAgICB4OiB4MixcbiAgICB5OiB5MlxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBwMTogcDEsXG4gICAgcDI6IHAyXG4gIH07XG59XG5cbmV4cG9ydCBjb25zdCBjaXJjbGVMaW5lSW50ZXJzZWN0ID0gKGMsIHIsIHAxLCBwMikgPT4ge1xuXG4gIGNvbnN0IGQgPSBkaXN0YW5jZShwMSwgcDIpO1xuICAvL3VuaXQgdmVjdG9yIHAxIHAyXG4gIGNvbnN0IGR4ID0gKHAyLnggLSBwMS54KS9kO1xuICBjb25zdCBkeSA9IChwMi55IC0gcDEueSkvZDtcblxuICAvL3BvaW50IG9uIGxpbmUgY2xvc2VzdCB0byBjaXJjbGUgY2VudHJlXG4gIGNvbnN0IHQgPSBkeCooYy54IC1wMS54KSArIGR5KihjLnktcDEueSk7XG4gIGNvbnN0IHAgPSAge3g6IHQqIGR4ICsgcDEueCwgeTogdCogZHkgKyBwMS55fTtcblxuICAvL2Rpc3RhbmNlIGZyb20gdGhpcyBwb2ludCB0byBjZW50cmVcbiAgY29uc3QgZDIgPSBkaXN0YW5jZShwLCBjKTtcblxuICAvL2xpbmUgaW50ZXJzZWN0cyBjaXJjbGVcbiAgaWYoZDIgPCByKXtcbiAgICBjb25zdCBkdCA9IE1hdGguc3FydCggcipyIC0gZDIqZDIpO1xuICAgIC8vcG9pbnQgMVxuICAgIGNvbnN0IHExID0ge1xuICAgICAgeDogKHQtZHQpKmR4ICsgcDEueCxcbiAgICAgIHk6ICh0LWR0KSpkeSArIHAxLnlcbiAgICB9XG4gICAgLy9wb2ludCAyXG4gICAgY29uc3QgcTIgPSB7XG4gICAgICB4OiAodCtkdCkqZHggKyBwMS54LFxuICAgICAgeTogKHQrZHQpKmR5ICsgcDEueVxuICAgIH1cblxuICAgIHJldHVybiB7cDE6IHExLCBwMjogcTJ9O1xuICB9XG4gIGVsc2UgaWYoIGQyID09PSByKXtcbiAgICByZXR1cm4gcDtcbiAgfVxuICBlbHNle1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yOiBsaW5lIGRvZXMgbm90IGludGVyc2VjdCBjaXJjbGUhJyk7XG4gIH1cbn1cblxuLy9hbmdsZSBpbiByYWRpYW5zIGJldHdlZW4gdHdvIHBvaW50cyBvbiBjaXJjbGUgb2YgcmFkaXVzIHJcbmV4cG9ydCBjb25zdCBjZW50cmFsQW5nbGUgPSAocDEsIHAyLCByKSA9PiB7XG4gIHJldHVybiAyICogTWF0aC5hc2luKDAuNSAqIGRpc3RhbmNlKHAxLCBwMikgLyByKTtcbn1cblxuLy9jYWxjdWxhdGUgdGhlIG5vcm1hbCB2ZWN0b3IgZ2l2ZW4gMiBwb2ludHNcbmV4cG9ydCBjb25zdCBub3JtYWxWZWN0b3IgPSAocDEsIHAyKSA9PiB7XG4gIGxldCBkID0gTWF0aC5zcXJ0KE1hdGgucG93KHAyLngtcDEueCwyKSArIE1hdGgucG93KHAyLnktcDEueSwyKSk7XG4gIHJldHVybiB7XG4gICAgeDogKHAyLngtcDEueCkvZCxcbiAgICB5OiAocDIueS1wMS55KS9kXG4gIH1cbn1cblxuLy9kb2VzIHRoZSBsaW5lIGNvbm5lY3RpbmcgcDEsIHAyIGdvIHRocm91Z2ggdGhlIHBvaW50ICgwLDApP1xuZXhwb3J0IGNvbnN0IHRocm91Z2hPcmlnaW4gPSAocDEsIHAyKSA9PiB7XG4gIGlmKHAxLnggPT09IDAgJiYgcDIueCA9PT0gMCl7XG4gICAgLy92ZXJ0aWNhbCBsaW5lIHRocm91Z2ggY2VudHJlXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgbGV0IHRlc3QgPSAoLXAxLngqcDIueSArIHAxLngqcDEueSkvKHAyLngtcDEueCkgKyBwMS55O1xuICBpZih0ZXN0ID09PSAwKSByZXR1cm4gdHJ1ZTtcbiAgZWxzZSByZXR1cm4gZmFsc2U7XG59XG5cbi8vZmluZCB0aGUgY2VudHJvaWQgb2YgYSBub24tc2VsZi1pbnRlcnNlY3RpbmcgcG9seWdvblxuZXhwb3J0IGNvbnN0IGNlbnRyb2lkT2ZQb2x5Z29uID0gKHBvaW50cykgPT4ge1xuICBsZXQgZmlyc3QgPSBwb2ludHNbMF0sIGxhc3QgPSBwb2ludHNbcG9pbnRzLmxlbmd0aC0xXTtcbiAgaWYgKGZpcnN0LnggIT0gbGFzdC54IHx8IGZpcnN0LnkgIT0gbGFzdC55KSBwb2ludHMucHVzaChmaXJzdCk7XG4gIGxldCB0d2ljZWFyZWE9MCxcbiAgICB4PTAsIHk9MCxcbiAgICBuUHRzID0gcG9pbnRzLmxlbmd0aCxcbiAgICBwMSwgcDIsIGY7XG4gIGZvciAoIHZhciBpPTAsIGo9blB0cy0xIDsgaTxuUHRzIDsgaj1pKysgKSB7XG4gICAgcDEgPSBwb2ludHNbaV07IHAyID0gcG9pbnRzW2pdO1xuICAgIGYgPSBwMS54KnAyLnkgLSBwMi54KnAxLnk7XG4gICAgdHdpY2VhcmVhICs9IGY7XG4gICAgeCArPSAoIHAxLnggKyBwMi54ICkgKiBmO1xuICAgIHkgKz0gKCBwMS55ICsgcDIueSApICogZjtcbiAgfVxuICBmID0gdHdpY2VhcmVhICogMztcbiAgcmV0dXJuIHsgeDp4L2YsIHk6eS9mIH07XG59XG5cbi8vY29tcGFyZSB0d28gcG9pbnRzIHRha2luZyByb3VuZGluZyBlcnJvcnMgaW50byBhY2NvdW50XG5leHBvcnQgY29uc3QgY29tcGFyZVBvaW50cyA9IChwMSwgcDIpID0+IHtcbiAgaWYodHlwZW9mIHAxID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgcDIgPT09ICd1bmRlZmluZWQnKXtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBwMSA9IHBvaW50VG9GaXhlZChwMSwgNik7XG4gIHAyID0gcG9pbnRUb0ZpeGVkKHAyLCA2KTtcbiAgaWYocDEueCA9PT0gcDIueCAmJiBwMS55ID09PSBwMi55KSByZXR1cm4gdHJ1ZTtcbiAgZWxzZSByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBjb25zdCBwb2ludFRvRml4ZWQgPSAocCwgcGxhY2VzKSA9PiB7XG4gIHJldHVybiB7XG4gICAgeDogcC54LnRvRml4ZWQocGxhY2VzKSxcbiAgICB5OiBwLnkudG9GaXhlZChwbGFjZXMpXG4gIH07XG59XG5cbi8qXG4vL2ZsaXAgYSBzZXQgb2YgcG9pbnRzIG92ZXIgYSBoeXBlcm9ibGljIGxpbmUgZGVmaW5lZCBieSB0d28gcG9pbnRzXG5leHBvcnQgY29uc3QgdHJhbnNmb3JtID0gKHBvaW50c0FycmF5LCBwMSwgcDIpID0+IHtcbiAgbGV0IG5ld1BvaW50c0FycmF5ID0gW107XG4gIGxldCBjID0gRS5ncmVhdENpcmNsZShwMSwgcDIsIGRpc2sucmFkaXVzLCBkaXNrLmNlbnRyZSk7XG5cbiAgZm9yKGxldCBwIG9mIHBvaW50c0FycmF5KXtcbiAgICBsZXQgbmV3UCA9IEUuaW52ZXJzZShwLCBjLnJhZGl1cywgYy5jZW50cmUpO1xuICAgIG5ld1BvaW50c0FycmF5LnB1c2gobmV3UCk7XG4gIH1cbiAgcmV0dXJuIG5ld1BvaW50c0FycmF5O1xufVxuKi9cbiIsImltcG9ydCB7IFJlZ3VsYXJUZXNzZWxhdGlvbiB9IGZyb20gJy4vcmVndWxhclRlc3NlbGF0aW9uJztcblxuaW1wb3J0IHsgV2ViR0wgfSBmcm9tICcuL3dlYmdsJztcbi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICpcbi8vICogICBTRVRVUFxuLy8gKlxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG5jb25zdCB3ID0gbmV3IFdlYkdMKCk7XG4vL2NvbnN0IHRlc3NlbGF0aW9uID0gbmV3IFJlZ3VsYXJUZXNzZWxhdGlvbig1LCA0LCAzKk1hdGguUEkvNiowLCAncmVkJyk7XG4iLCJpbXBvcnQgKiBhcyBFIGZyb20gJy4vZXVjbGlkJztcbmltcG9ydCB7IERpc2sgfSBmcm9tICcuL2Rpc2snO1xuLy8gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gKiAgICBURVNTRUxBVElPTiBDTEFTU1xuLy8gKiAgICBDcmVhdGVzIGEgcmVndWxhciBUZXNzZWxhdGlvbiBvZiB0aGUgUG9pbmNhcmUgRGlza1xuLy8gKiAgICBxOiBudW1iZXIgb2YgcC1nb25zIG1lZXRpbmcgYXQgZWFjaCB2ZXJ0ZXhcbi8vICogICAgcDogbnVtYmVyIG9mIHNpZGVzIG9mIHAtZ29uXG4vLyAqICAgIHVzaW5nIHRoZSB0ZWNobmlxdWVzIGNyZWF0ZWQgYnkgQ294ZXRlciBhbmQgRHVuaGFtXG4vLyAqXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5leHBvcnQgY2xhc3MgUmVndWxhclRlc3NlbGF0aW9uIGV4dGVuZHMgRGlzayB7XG4gIGNvbnN0cnVjdG9yKHAsIHEsIHJvdGF0aW9uLCBjb2xvdXIsIG1heExheWVycywgZHJhd0NsYXNzKSB7XG4gICAgc3VwZXIoZHJhd0NsYXNzKTtcbiAgICB0aGlzLnAgPSBwO1xuICAgIHRoaXMucSA9IHE7XG4gICAgdGhpcy5jb2xvdXIgPSBjb2xvdXIgfHwgJ2JsYWNrJztcbiAgICB0aGlzLnJvdGF0aW9uID0gcm90YXRpb24gfHwgMDtcbiAgICB0aGlzLm1heExheWVycyA9IG1heExheWVycyB8fCA1O1xuXG4gICAgaWYodGhpcy5jaGVja1BhcmFtcygpKXsgcmV0dXJuIGZhbHNlO31cblxuICAgIHRoaXMuZnIgPSB0aGlzLmZ1bmRhbWVudGFsUmVnaW9uKCk7XG5cbiAgICB0aGlzLmFyYyh0aGlzLmZyLmEsIHRoaXMuZnIuYik7XG4gICAgdGhpcy5hcmModGhpcy5mci5hLCB0aGlzLmZyLmMpO1xuICAgIHRoaXMuYXJjKHRoaXMuZnIuYiwgdGhpcy5mci5jKTtcbiAgfVxuXG4gIC8vY2FsY3VsYXRlIGZpcnN0IHBvaW50IG9mIGZ1bmRhbWVudGFsIHBvbHlnb24gdXNpbmcgQ294ZXRlcidzIG1ldGhvZFxuICBmdW5kYW1lbnRhbFJlZ2lvbigpe1xuICAgIGNvbnN0IHMgPSBNYXRoLnNpbihNYXRoLlBJL3RoaXMucCk7XG4gICAgY29uc3QgdCA9IE1hdGguY29zKE1hdGguUEkvdGhpcy5xKTtcbiAgICAvL211bHRpcGx5IHRoZXNlIGJ5IHRoZSBkaXNrcyByYWRpdXMgKENveGV0ZXIgdXNlZCB1bml0IGRpc2spO1xuICAgIGNvbnN0IHIgPSAxL01hdGguc3FydCgodCp0KS8ocypzKSAtMSkqdGhpcy5yYWRpdXM7XG4gICAgY29uc3QgZCA9IDEvTWF0aC5zcXJ0KDEtIChzKnMpLyh0KnQpKSp0aGlzLnJhZGl1cztcbiAgICBjb25zdCBiID0ge1xuICAgICAgeDogdGhpcy5yYWRpdXMqTWF0aC5jb3MoTWF0aC5QSS90aGlzLnApLFxuICAgICAgeTogLXRoaXMucmFkaXVzKk1hdGguc2luKE1hdGguUEkvdGhpcy5wKVxuICAgIH1cblxuICAgIGNvbnN0IGNlbnRyZSA9IHt4OiBkLCB5OiAwfTtcblxuICAgIC8vdGhlcmUgd2lsbCBiZSB0d28gcG9pbnRzIG9mIGludGVyc2VjdGlvbiwgb2Ygd2hpY2ggd2Ugd2FudCB0aGUgZmlyc3RcbiAgICBjb25zdCBwMSA9IEUuY2lyY2xlTGluZUludGVyc2VjdChjZW50cmUsIHIsIHRoaXMuY2VudHJlLCBiKS5wMTtcblxuICAgIHJldHVybiB7XG4gICAgICBhOiB0aGlzLmNlbnRyZSxcbiAgICAgIGI6IHAxLFxuICAgICAgYzogeyB4OiBkLXIsIHk6IDB9XG4gICAgfTtcbiAgfVxuXG4gIC8vVGhlIHRlc3NlbGF0aW9uIHJlcXVpcmVzIHRoYXQgKHAtMikocS0yKSA+IDQgdG8gd29yayAob3RoZXJ3aXNlIGl0IGlzXG4gIC8vIGVpdGhlciBhbiBlbGxpcHRpY2FsIG9yIGV1Y2xpZGVhbiB0ZXNzZWxhdGlvbik7XG4gIGNoZWNrUGFyYW1zKCl7XG4gICAgaWYodGhpcy5tYXhMYXllcnMgPCAwIHx8IGlzTmFOKHRoaXMubWF4TGF5ZXJzKSl7XG4gICAgICBjb25zb2xlLmVycm9yKCdtYXhMYXllcnMgbXVzdCBiZSBncmVhdGVyIHRoYW4gMCcpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGVsc2UgaWYoKHRoaXMucCAtMikqKHRoaXMucS0yKSA8PSA0KXtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0h5cGVyYm9saWMgdGVzc2VsYXRpb25zIHJlcXVpcmUgdGhhdCAocC0xKShxLTIpIDwgNCEnKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvL0ZvciBub3cgcmVxdWlyZSBwLHEgPiAzLFxuICAgIC8vVE9ETyBpbXBsZW1lbnQgc3BlY2lhbCBjYXNlcyBmb3IgcSA9IDMgb3IgcCA9IDNcbiAgICBlbHNlIGlmKHRoaXMucSA8PSAzIHx8IGlzTmFOKHRoaXMucSkpe1xuICAgICAgY29uc29sZS5lcnJvcignVGVzc2VsYXRpb24gZXJyb3I6IGF0IGxlYXN0IDMgcC1nb25zIG11c3QgbWVldCBcXFxuICAgICAgICAgICAgICAgICAgICBhdCBlYWNoIHZlcnRleCEnKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBlbHNlIGlmKHRoaXMucCA8PSAzfHwgaXNOYU4odGhpcy5wKSl7XG4gICAgICBjb25zb2xlLmVycm9yKCdUZXNzZWxhdGlvbiBlcnJvcjogcG9seWdvbiBuZWVkcyBhdCBsZWFzdCAzIHNpZGVzIScpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGVsc2UgeyByZXR1cm4gZmFsc2U7IH1cbiAgfVxufVxuIiwiLy8gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gKlxuLy8gKiAgQ0FOVkFTIENMQVNTXG4vLyAqXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5leHBvcnQgY2xhc3MgV2ViR0wge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2NhbnZhcycpO1xuXG4gICAgLy9mdWxsc2NyZWVuXG4gICAgdGhpcy5jYW52YXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG5cbiAgICB0aGlzLmdsID0gdGhpcy5pbml0V2ViR0woY2FudmFzKTtcblxuICAgIGlmICh0aGlzLmdsKSB7XG4gICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgICB0aGlzLmluaXRTaGFkZXJzKCk7XG4gICAgICB0aGlzLmluaXRCdWZmZXJzKCk7XG4gICAgICB0aGlzLmRyYXdTY2VuZSgpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIC8vIFNldCBjbGVhciBjb2xvciB0byBibGFjaywgZnVsbHkgb3BhcXVlXG4gICAgdGhpcy5nbC5jbGVhckNvbG9yKDAuMCwgMC4wLCAwLjAsIDEuMCk7XG4gICAgLy8gRW5hYmxlIGRlcHRoIHRlc3RpbmdcbiAgICB0aGlzLmdsLmVuYWJsZSh0aGlzLmdsLkRFUFRIX1RFU1QpO1xuICAgIC8vIE5lYXIgdGhpbmdzIG9ic2N1cmUgZmFyIHRoaW5nc1xuICAgIHRoaXMuZ2wuZGVwdGhGdW5jKHRoaXMuZ2wuTEVRVUFMKTtcbiAgICAvLyBDbGVhciB0aGUgY29sb3IgYXMgd2VsbCBhcyB0aGUgZGVwdGggYnVmZmVyLlxuICAgIHRoaXMuZ2wuY2xlYXIodGhpcy5nbC5DT0xPUl9CVUZGRVJfQklUIHwgdGhpcy5nbC5ERVBUSF9CVUZGRVJfQklUKTtcbiAgfVxuXG4gIGluaXRXZWJHTChjYW52YXMpIHtcbiAgICB0aGlzLmdsID0gbnVsbDtcbiAgICB0cnkge1xuICAgICAgLy8gVHJ5IHRvIGdyYWIgdGhlIHN0YW5kYXJkIGNvbnRleHQuIElmIGl0IGZhaWxzLCBmYWxsYmFjayB0byBleHBlcmltZW50YWwuXG4gICAgICB0aGlzLmdsID0gY2FudmFzLmdldENvbnRleHQoJ3dlYmdsJykgfHwgY2FudmFzLmdldENvbnRleHQoJ2V4cGVyaW1lbnRhbC13ZWJnbCcpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG5cbiAgICBpZiAoIXRoaXMuZ2wpIHtcbiAgICAgIGFsZXJ0KCdVbmFibGUgdG8gaW5pdGlhbGl6ZSBXZWJHTC4gWW91ciBicm93c2VyIG1heSBub3Qgc3VwcG9ydCBpdC4nKTtcbiAgICAgIHRoaXMuZ2wgPSBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5nbDtcbiAgfVxuXG4gIGluaXRTaGFkZXJzKCkge1xuICAgIGNvbnN0IGZyYWdtZW50U2hhZGVyID0gdGhpcy5nZXRTaGFkZXIodGhpcy5nbCwgJ3NoYWRlci1mcycpO1xuICAgIGNvbnN0IHZlcnRleFNoYWRlciA9IHRoaXMuZ2V0U2hhZGVyKHRoaXMuZ2wsICdzaGFkZXItdnMnKTtcblxuICAgIC8vIENyZWF0ZSB0aGUgc2hhZGVyIHByb2dyYW1cblxuICAgIHRoaXMuc2hhZGVyUHJvZ3JhbSA9IHRoaXMuZ2wuY3JlYXRlUHJvZ3JhbSgpO1xuICAgIHRoaXMuZ2wuYXR0YWNoU2hhZGVyKHRoaXMuc2hhZGVyUHJvZ3JhbSwgdmVydGV4U2hhZGVyKTtcbiAgICB0aGlzLmdsLmF0dGFjaFNoYWRlcih0aGlzLnNoYWRlclByb2dyYW0sIGZyYWdtZW50U2hhZGVyKTtcbiAgICB0aGlzLmdsLmxpbmtQcm9ncmFtKHRoaXMuc2hhZGVyUHJvZ3JhbSk7XG5cbiAgICAvLyBJZiBjcmVhdGluZyB0aGUgc2hhZGVyIHByb2dyYW0gZmFpbGVkLCBhbGVydFxuXG4gICAgaWYgKCF0aGlzLmdsLmdldFByb2dyYW1QYXJhbWV0ZXIodGhpcy5zaGFkZXJQcm9ncmFtLCB0aGlzLmdsLkxJTktfU1RBVFVTKSkge1xuICAgICAgYWxlcnQoJ1VuYWJsZSB0byBpbml0aWFsaXplIHRoZSBzaGFkZXIgcHJvZ3JhbS4nKTtcbiAgICB9XG5cbiAgICB0aGlzLmdsLnVzZVByb2dyYW0odGhpcy5zaGFkZXJQcm9ncmFtKTtcblxuICAgIHRoaXMudmVydGV4UG9zaXRpb25BdHRyaWJ1dGUgPSB0aGlzLmdsLmdldEF0dHJpYkxvY2F0aW9uKHRoaXMuc2hhZGVyUHJvZ3JhbSwgJ2FWZXJ0ZXhQb3NpdGlvbicpO1xuICAgIHRoaXMuZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy52ZXJ0ZXhQb3NpdGlvbkF0dHJpYnV0ZSk7XG4gIH1cblxuICBnZXRTaGFkZXIoZ2wsIGlkKSB7XG4gICAgbGV0IHNoYWRlclNjcmlwdCwgdGhlU291cmNlLCBjdXJyZW50Q2hpbGQsIHNoYWRlcjtcblxuICAgIHNoYWRlclNjcmlwdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcblxuICAgIGlmICghc2hhZGVyU2NyaXB0KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB0aGVTb3VyY2UgPSAnJztcbiAgICBjdXJyZW50Q2hpbGQgPSBzaGFkZXJTY3JpcHQuZmlyc3RDaGlsZDtcblxuICAgIHdoaWxlIChjdXJyZW50Q2hpbGQpIHtcbiAgICAgIGlmIChjdXJyZW50Q2hpbGQubm9kZVR5cGUgPT0gY3VycmVudENoaWxkLlRFWFRfTk9ERSkge1xuICAgICAgICB0aGVTb3VyY2UgKz0gY3VycmVudENoaWxkLnRleHRDb250ZW50O1xuICAgICAgfVxuXG4gICAgICBjdXJyZW50Q2hpbGQgPSBjdXJyZW50Q2hpbGQubmV4dFNpYmxpbmc7XG4gICAgfVxuXG4gICAgaWYgKHNoYWRlclNjcmlwdC50eXBlID09ICd4LXNoYWRlci94LWZyYWdtZW50Jykge1xuICAgICAgc2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKGdsLkZSQUdNRU5UX1NIQURFUik7XG4gICAgfSBlbHNlIGlmIChzaGFkZXJTY3JpcHQudHlwZSA9PSAneC1zaGFkZXIveC12ZXJ0ZXgnKSB7XG4gICAgICBzaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIoZ2wuVkVSVEVYX1NIQURFUik7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFVua25vd24gc2hhZGVyIHR5cGVcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBnbC5zaGFkZXJTb3VyY2Uoc2hhZGVyLCB0aGVTb3VyY2UpO1xuXG4gICAgLy8gQ29tcGlsZSB0aGUgc2hhZGVyIHByb2dyYW1cbiAgICBnbC5jb21waWxlU2hhZGVyKHNoYWRlcik7XG5cbiAgICAvLyBTZWUgaWYgaXQgY29tcGlsZWQgc3VjY2Vzc2Z1bGx5XG4gICAgaWYgKCFnbC5nZXRTaGFkZXJQYXJhbWV0ZXIoc2hhZGVyLCBnbC5DT01QSUxFX1NUQVRVUykpIHtcbiAgICAgIGFsZXJ0KCdBbiBlcnJvciBvY2N1cnJlZCBjb21waWxpbmcgdGhlIHNoYWRlcnM6ICcgKyBnbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlcikpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNoYWRlcjtcbiAgfVxuXG4gIGluaXRCdWZmZXJzKCkge1xuICAgIGNvbnN0IGhvcml6QXNwZWN0ID0gd2luZG93LmlubmVySGVpZ2h0IC8gd2luZG93LmlubmVyV2lkdGg7XG4gICAgdGhpcy5zcXVhcmVWZXJ0aWNlc0J1ZmZlciA9IHRoaXMuZ2wuY3JlYXRlQnVmZmVyKCk7XG4gICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLnNxdWFyZVZlcnRpY2VzQnVmZmVyKTtcblxuICAgIGNvbnN0IHZlcnRpY2VzID0gW1xuICAgICAgMS4wLCAxLjAsIDAuMCwgLTEuMCwgMS4wLCAwLjAsXG4gICAgICAxLjAsIC0xLjAsIDAuMCwgLTEuMCwgLTEuMCwgMC4wXG4gICAgXTtcblxuICAgIHRoaXMuZ2wuYnVmZmVyRGF0YSh0aGlzLmdsLkFSUkFZX0JVRkZFUixcbiAgICAgIG5ldyBGbG9hdDMyQXJyYXkodmVydGljZXMpLFxuICAgICAgdGhpcy5nbC5TVEFUSUNfRFJBVyk7XG4gIH1cblxuICBkcmF3U2NlbmUoKSB7XG4gICAgdGhpcy5nbC5jbGVhcih0aGlzLmdsLkNPTE9SX0JVRkZFUl9CSVQgfCB0aGlzLmdsLkRFUFRIX0JVRkZFUl9CSVQpO1xuXG4gICAgdGhpcy5wZXJzcGVjdGl2ZU1hdHJpeCA9IG1ha2VQZXJzcGVjdGl2ZSg0NSwgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsIDAuMSwgMTAwLjApO1xuXG4gICAgbG9hZElkZW50aXR5KCk7XG4gICAgbXZUcmFuc2xhdGUoWy0wLjAsIDAuMCwgLTYuMF0pO1xuXG4gICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCB0aGlzLnNxdWFyZVZlcnRpY2VzQnVmZmVyKTtcbiAgICB0aGlzLmdsLnZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy52ZXJ0ZXhQb3NpdGlvbkF0dHJpYnV0ZSwgMywgdGhpcy5nbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xuICAgIHRoaXMuc2V0TWF0cml4VW5pZm9ybXMoKTtcbiAgICB0aGlzLmdsLmRyYXdBcnJheXModGhpcy5nbC5UUklBTkdMRV9TVFJJUCwgMCwgNCk7XG4gIH1cblxuICBzZXRNYXRyaXhVbmlmb3JtcygpIHtcbiAgICBsZXQgcFVuaWZvcm0gPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLnNoYWRlclByb2dyYW0sICd1UE1hdHJpeCcpO1xuICAgIHRoaXMuZ2wudW5pZm9ybU1hdHJpeDRmdihwVW5pZm9ybSwgZmFsc2UsIG5ldyBGbG9hdDMyQXJyYXkodGhpcy5wZXJzcGVjdGl2ZU1hdHJpeC5mbGF0dGVuKCkpKTtcblxuICAgIGxldCBtdlVuaWZvcm0gPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLnNoYWRlclByb2dyYW0sICd1TVZNYXRyaXgnKTtcbiAgICB0aGlzLmdsLnVuaWZvcm1NYXRyaXg0ZnYobXZVbmlmb3JtLCBmYWxzZSwgbmV3IEZsb2F0MzJBcnJheShtdk1hdHJpeC5mbGF0dGVuKCkpKTtcbiAgfVxuXG59XG4iXX0=
