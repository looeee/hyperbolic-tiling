(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// * ***********************************************************************
// *
// *  CANVAS UTILITY FUNCTIONS
// *
// *************************************************************************

var Canvas = function () {
  function Canvas() {
    _classCallCheck(this, Canvas);

    this.canvas = document.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');

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
    key: 'clear',
    value: function clear() {
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
    this.centre = {
      x: 0,
      y: 0
    };

    //draw largest circle possible given window dims
    this.radius = window.innerWidth < window.innerHeight ? window.innerWidth / 2 - 5 : window.innerHeight / 2 - 5;

    //smaller circle for testing
    // /this.radius = this.radius / 3;

    this.color = 'black';
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

// * ***********************************************************************
// *
// *   SETUP
// *
// *************************************************************************

var tesselation = new _regularTesselation.RegularTesselation(5, 4, 3 * Math.PI / 6 * 0, 'red');

},{"./regularTesselation":5}],5:[function(require,module,exports){
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

  function RegularTesselation(p, q, rotation, colour, drawClass) {
    _classCallCheck(this, RegularTesselation);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(RegularTesselation).call(this, drawClass));

    _this.p = p;
    _this.q = q;
    _this.minExp = p - 3;
    _this.maxExp = p - 2;
    _this.colour = colour || 'black';
    _this.rotation = rotation || 0;

    if (_this.checkParams()) {
      var _ret;

      return _ret = false, _possibleConstructorReturn(_this, _ret);
    }

    _this.q = q;
    _this.maxLayers = 3;
    _this.limit = 10000;

    //array of all lines that have been reflected over
    _this.reflectedLines = [];

    //array of centroids for all polygons drawn so far
    _this.polygonCentroids = [];

    _this.tesselation();
    return _this;
  }

  _createClass(RegularTesselation, [{
    key: 'tesselation',
    value: function tesselation() {
      var vertices = this.fundamentalPolygon();
      this.polygon(vertices, this.colour);

      var p = E.centroidOfPolygon(vertices);
      p = E.pointToFixed(p, 6);
      this.polygonCentroids.push(p);

      this.recursivePolyGen(vertices, { x: 0, y: 0 }, { x: 0, y: 0 }, 2);
    }

    //recursively reflect each polygon over each edge, draw the new polygons
    //and repeat for each of their edges
    //TODO make sure no line is drawn more than once

  }, {
    key: 'recursivePolyGen',
    value: function recursivePolyGen(vertices, prevP1, prevP2, layer) {
      var _this2 = this;

      //TESTING
      if (this.limit <= 0) {
        return;
      }
      this.limit--;

      //console.log('Layer: ', layer);
      //if(layer > this.maxLayers){ return; }

      var l = vertices.length;

      var _loop = function _loop(i) {
        var p1 = vertices[i];
        var p2 = vertices[(i + 1) % l];
        //don't reflect back over the line we've just reflected across as this
        //causes a loop
        if (!E.comparePoints(p1, prevP1) && !E.comparePoints(p2, prevP2)) {
          (function () {
            //if(!this.polygonExists(vertices) ){//&& !this.alreadyReflected(p1, p2)){
            var newVertices = _this2.reflectPolygon(vertices, p1, p2);
            _this2.polygon(newVertices, _this2.colour);
            window.setTimeout(function () {
              _this2.recursivePolyGen(newVertices, p1, p2, layer++);
            }, 500);
          })();
        }
        //}
      };

      for (var i = 0; i < l; i++) {
        _loop(i);
      }
    }

    //check if the polygon has already been drawn

  }, {
    key: 'polygonExists',
    value: function polygonExists(vertices) {
      var p = E.centroidOfPolygon(vertices);
      p = E.pointToFixed(p, 6);

      var i = $.inArray(p.x, this.polygonCentroids);
      //case 1, centroid is not in array
      if (i === -1) {
        this.polygonCentroids.push(p.x, p.y);
        drawPoint(p);
        return false;
      }
      //case 2: centroid is not in array
      else if (this.polygonCentroids[i + 1] !== p.y) {
          this.polygonCentroids.push(p.x, p.y);
          drawPoint(p);
          return false;
        }
        //case 3: centroid is in array
        else {
            return true;
          }
    }

    //check if a particular line has already been to do a reflection and if not
    //add the current line to the array

  }, {
    key: 'alreadyReflected',
    value: function alreadyReflected(p1, p2) {
      var x1 = p1.x.toFixed(6);
      var y1 = p1.y.toFixed(6);
      var x2 = p2.x.toFixed(6);
      var y2 = p2.y.toFixed(6);

      var i = $.inArray(x1, this.reflectedLines);
      //case1: first point not in array, line has not been used to reflect
      if (i === -1) {
        this.reflectedLines.push(x1);
        this.reflectedLines.push(y1);
        this.reflectedLines.push(x2);
        this.reflectedLines.push(y2);
        return false;
      }
      //case 2: first point is in array
      else if (this.reflectedLines[i + 1] === y1) {
          //case 2a: second point is in the array adjacent to first point;
          // => lines has alraedy been used
          var a = this.reflectedLines[i + 2] === x2 && this.reflectedLines[i + 3] === y2;
          var b = this.reflectedLines[i - 2] === x2 && this.reflectedLines[i - 1] === y2;
          if (a || b) {
            return true;
          }
          //case 2b: 1st point was in array but as part of different line
          else {
              this.reflectedLines.push(x1);
              this.reflectedLines.push(y1);
              this.reflectedLines.push(x2);
              this.reflectedLines.push(y2);
              return false;
            }
        }
    }

    //rotate the first points around the disk to generate the fundamental polygon
    //TODO: use Dunham's method of reflecting a fundamental triangle which will
    //contain a motif eventually

  }, {
    key: 'fundamentalPolygon',
    value: function fundamentalPolygon() {
      var p = this.firstPoint();
      var alpha = 2 * Math.PI / this.p;
      var vertices = [p];

      for (var i = 1; i < this.p; i++) {
        //rotate around the disk by alpha radians for next points
        var q = {
          x: Math.cos(alpha * i) * p.x + Math.sin(alpha * i) * p.y,
          y: -Math.sin(alpha * i) * p.x + Math.cos(alpha * i) * p.y
        };

        vertices.push(q);
      }
      return vertices;
    }

    //calculate first point of fundamental polygon using Coxeter's method

  }, {
    key: 'firstPoint',
    value: function firstPoint() {
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
      var p = E.circleLineIntersect(centre, r, this.centre, b).p1;

      //apply the rotation
      p = {
        x: Math.cos(this.rotation) * p.x - Math.sin(this.rotation) * p.y,
        y: Math.sin(this.rotation) * p.x + Math.cos(this.rotation) * p.y
      };

      return p;
    }

    //reflect the polygon defined by vertices across the line p1, p2

  }, {
    key: 'reflectPolygon',
    value: function reflectPolygon(vertices, p1, p2) {
      var l = vertices.length;
      var newVertices = [];
      var c = E.greatCircle(p1, p2, this.radius, this.centre);
      for (var i = 0; i < l; i++) {
        var p = E.inverse(vertices[i], c.radius, c.centre);
        newVertices.push(p);
      }

      return newVertices;
    }

    //The tesselation requires that (p-2)(q-2) > 4 to work (otherwise it is
    // either an elliptical or euclidean tesselation);

  }, {
    key: 'checkParams',
    value: function checkParams() {
      if ((this.p - 2) * (this.q - 2) <= 4) {
        console.error('Hyperbolic tesselations require that (p-1)(q-2) < 4!');
        return true;
      } else if (this.q < 3) {
        console.error('Tesselation error: at least 3 p-gons must meet \
                    at each vertex!');
        return true;
      } else if (this.p < 3) {
        console.error('Tesselation error: polygon needs at least 3 sides!');
        return true;
      } else {
        return false;
      }
    }
  }]);

  return RegularTesselation;
}(_disk.Disk);

},{"./disk":2,"./euclid":3}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJlczIwMTUvY2FudmFzLmpzIiwiZXMyMDE1L2Rpc2suanMiLCJlczIwMTUvZXVjbGlkLmpzIiwiZXMyMDE1L21haW4uanMiLCJlczIwMTUvcmVndWxhclRlc3NlbGF0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztJQ0thLE1BQU07QUFDakIsV0FEVyxNQUFNLEdBQ0o7MEJBREYsTUFBTTs7QUFFZixRQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0MsUUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFeEMsUUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztBQUN0QyxRQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVzs7O0FBQUMsQUFHeEMsUUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsQ0FBQztHQUVuRTs7O0FBQUE7ZUFYVSxNQUFNOzs0QkFlVCxDQUFDLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFDO0FBQzNDLFVBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDckIsVUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxXQUFXLEVBQUUsS0FBSyxHQUFHLFdBQVcsQ0FBQyxDQUFDO0FBQ2pGLFVBQUksQ0FBQyxHQUFHLENBQUMs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QUFFLEVBQUUsRUFBSztBQUNqRCxNQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2IsTUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNiLE1BQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDYixNQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2IsTUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsSUFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsSUFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsQ0FBQyxDQUFDOztBQUU1RCxNQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUEsSUFBSyxJQUFJLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQSxBQUFDLElBQUksSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUEsQUFBQyxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUEsQUFBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVwRyxNQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsR0FBSSxDQUFDLEdBQUcsQUFBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsSUFBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUEsQUFBQyxJQUFLLENBQUMsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFBLEFBQUMsQ0FBQztBQUNqRixNQUFJLEVBQUUsR0FBRyxRQUFRLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFBLEFBQUMsQ0FBQztBQUN0RCxNQUFJLEVBQUUsR0FBRyxRQUFRLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFBLEFBQUMsQ0FBQzs7QUFFdEQsTUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksQ0FBQyxHQUFHLEFBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLElBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFBLEFBQUMsSUFBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7QUFDakYsTUFBSSxFQUFFLEdBQUcsUUFBUSxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7QUFDdEQsTUFBSSxFQUFFLEdBQUcsUUFBUSxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7O0FBRXRELE1BQUksRUFBRSxHQUFHO0FBQ1AsS0FBQyxFQUFFLEVBQUU7QUFDTCxLQUFDLEVBQUUsRUFBRTtHQUNOLENBQUE7O0FBRUQsTUFBSSxFQUFFLEdBQUc7QUFDUCxLQUFDLEVBQUUsRUFBRTtBQUNMLEtBQUMsRUFBRSxFQUFFO0dBQ04sQ0FBQTs7QUFFRCxTQUFPO0FBQ0wsTUFBRSxFQUFFLEVBQUU7QUFDTixNQUFFLEVBQUUsRUFBRTtHQUNQLENBQUM7Q0FDSCxDQUFBOztBQUVNLElBQU0sbUJBQW1CLFdBQW5CLG1CQUFtQixHQUFHLFNBQXRCLG1CQUFtQixDQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBSzs7QUFFbkQsTUFBTSxDQUFDLEdBQUcsUUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7O0FBQUMsQUFFM0IsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUEsR0FBRSxDQUFDLENBQUM7QUFDM0IsTUFBTSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUEsR0FBRSxDQUFDOzs7QUFBQyxBQUczQixNQUFNLENBQUMsR0FBRyxFQUFFLElBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRSxFQUFFLENBQUMsQ0FBQyxDQUFBLEFBQUMsR0FBRyxFQUFFLElBQUUsQ0FBQyxDQUFDLENBQUMsR0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBQztBQUN6QyxNQUFNLENBQUMsR0FBSSxFQUFDLENBQUMsRUFBRSxDQUFDLEdBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBQzs7O0FBQUMsQUFHOUMsTUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7OztBQUFDLEFBRzFCLE1BQUcsRUFBRSxHQUFHLENBQUMsRUFBQztBQUNSLFFBQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUUsQ0FBQyxHQUFDLENBQUMsR0FBRyxFQUFFLEdBQUMsRUFBRSxDQUFDOztBQUFDLEFBRW5DLFFBQU0sRUFBRSxHQUFHO0FBQ1QsT0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQSxHQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUNuQixPQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUMsRUFBRSxDQUFBLEdBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0tBQ3BCOztBQUFBLEFBRUQsUUFBTSxFQUFFLEdBQUc7QUFDVCxPQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUMsRUFBRSxDQUFBLEdBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ25CLE9BQUMsRUFBRSxDQUFDLENBQUMsR0FBQyxFQUFFLENBQUEsR0FBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7S0FDcEIsQ0FBQTs7QUFFRCxXQUFPLEVBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFDLENBQUM7R0FDekIsTUFDSSxJQUFJLEVBQUUsS0FBSyxDQUFDLEVBQUM7QUFDaEIsV0FBTyxDQUFDLENBQUM7R0FDVixNQUNHO0FBQ0YsV0FBTyxDQUFDLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO0dBQ3pEO0NBQ0Y7OztBQUFBLEFBR00sSUFBTSxZQUFZLFdBQVosWUFBWSxHQUFHLFNBQWYsWUFBWSxDQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFLO0FBQ3pDLFNBQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Q0FDbEQ7OztBQUFBLEFBR00sSUFBTSxZQUFZLFdBQVosWUFBWSxHQUFHLFNBQWYsWUFBWSxDQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUs7QUFDdEMsTUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUMsRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pFLFNBQU87QUFDTCxLQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUEsR0FBRSxDQUFDO0FBQ2hCLEtBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQSxHQUFFLENBQUM7R0FDakIsQ0FBQTtDQUNGOzs7QUFBQSxBQUdNLElBQU0sYUFBYSxXQUFiLGFBQWEsR0FBRyxTQUFoQixhQUFhLENBQUksRUFBRSxFQUFFLEVBQUUsRUFBSztBQUN2QyxNQUFHLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFDOztBQUUxQixXQUFPLElBQUksQ0FBQztHQUNiO0FBQ0QsTUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUEsSUFBRyxFQUFFLENBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUEsQUFBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDdkQsTUFBRyxJQUFJLEtBQUssQ0FBQyxFQUFFLE9BQU8sSUFBSSxDQUFDLEtBQ3RCLE9BQU8sS0FBSyxDQUFDO0NBQ25COzs7QUFBQSxBQUdNLElBQU0saUJBQWlCLFdBQWpCLGlCQUFpQixHQUFHLFNBQXBCLGlCQUFpQixDQUFJLE1BQU0sRUFBSztBQUMzQyxNQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO01BQUUsSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RELE1BQUksS0FBSyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQy9ELE1BQUksU0FBUyxHQUFDLENBQUM7TUFDYixDQUFDLEdBQUMsQ0FBQztNQUFFLENBQUMsR0FBQyxDQUFDO01BQ1IsSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNO01BQ3BCLEVBQUUsWUFBQTtNQUFFLEVBQUUsWUFBQTtNQUFFLENBQUMsWUFBQSxDQUFDO0FBQ1osT0FBTSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLElBQUksR0FBQyxDQUFDLEVBQUcsQ0FBQyxHQUFDLElBQUksRUFBRyxDQUFDLEdBQUMsQ0FBQyxFQUFFLEVBQUc7QUFDekMsTUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxBQUFDLEVBQUUsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDL0IsS0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDMUIsYUFBUyxJQUFJLENBQUMsQ0FBQztBQUNmLEtBQUMsSUFBSSxDQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQSxHQUFLLENBQUMsQ0FBQztBQUN6QixLQUFDLElBQUksQ0FBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUEsR0FBSyxDQUFDLENBQUM7R0FDMUI7QUFDRCxHQUFDLEdBQUcsU0FBUyxHQUFHLENBQUMsQ0FBQztBQUNsQixTQUFPLEVBQUUsQ0FBQyxFQUFDLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQztDQUN6Qjs7O0FBQUEsQUFHTSxJQUFNLGFBQWEsV0FBYixhQUFhLEdBQUcsU0FBaEIsYUFBYSxDQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUs7QUFDdkMsTUFBRyxPQUFPLEVBQUUsS0FBSyxXQUFXLElBQUksT0FBTyxFQUFFLEtBQUssV0FBVyxFQUFDO0FBQ3hELFdBQU8sSUFBSSxDQUFDO0dBQ2I7QUFDRCxJQUFFLEdBQUcsWUFBWSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6QixJQUFFLEdBQUcsWUFBWSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6QixNQUFHLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxJQUFJLENBQUMsS0FDMUMsT0FBTyxLQUFLLENBQUM7Q0FDbkIsQ0FBQTs7QUFFTSxJQUFNLFlBQVksV0FBWixZQUFZLEdBQUcsU0FBZixZQUFZLENBQUksQ0FBQyxFQUFFLE1BQU0sRUFBSztBQUN6QyxTQUFPO0FBQ0wsS0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztBQUN0QixLQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO0dBQ3ZCLENBQUM7Q0FDSDs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7OztBQ3RPRCxJQUFNLFdBQVcsR0FBRyx3QkFSWCxrQkFBa0IsQ0FRZ0IsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUMsSUFBSSxDQUFDLEVBQUUsR0FBQyxDQUFDLEdBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7OztJQ1IzRCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFVQSxrQkFBa0IsV0FBbEIsa0JBQWtCO1lBQWxCLGtCQUFrQjs7QUFDN0IsV0FEVyxrQkFBa0IsQ0FDakIsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRTswQkFEcEMsa0JBQWtCOzt1RUFBbEIsa0JBQWtCLGFBRXJCLFNBQVM7O0FBQ2YsVUFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ1gsVUFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ1gsVUFBSyxNQUFNLEdBQUcsQ0FBQyxHQUFDLENBQUMsQ0FBQztBQUNsQixVQUFLLE1BQU0sR0FBRyxDQUFDLEdBQUMsQ0FBQyxDQUFDO0FBQ2xCLFVBQUssTUFBTSxHQUFHLE1BQU0sSUFBSSxPQUFPLENBQUM7QUFDaEMsVUFBSyxRQUFRLEdBQUcsUUFBUSxJQUFJLENBQUMsQ0FBQzs7QUFFOUIsUUFBRyxNQUFLLFdBQVcsRUFBRSxFQUFDOzs7QUFBRSxvQkFBTyxLQUFLLDBDQUFDO0tBQUM7O0FBRXRDLFVBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNYLFVBQUssU0FBUyxHQUFHLENBQUMsQ0FBQztBQUNuQixVQUFLLEtBQUssR0FBRyxLQUFLOzs7QUFBQyxBQUduQixVQUFLLGNBQWMsR0FBRyxFQUFFOzs7QUFBQyxBQUd6QixVQUFLLGdCQUFnQixHQUFHLEVBQUUsQ0FBQzs7QUFFM0IsVUFBSyxXQUFXLEVBQUUsQ0FBQzs7R0FDcEI7O2VBdkJVLGtCQUFrQjs7a0NBeUJoQjtBQUNYLFVBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0FBQzNDLFVBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFcEMsVUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3RDLE9BQUMsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6QixVQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUU5QixVQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLEVBQUUsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUNoRTs7Ozs7Ozs7cUNBS2dCLFFBQVEsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBQzs7OztBQUUvQyxVQUFHLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxFQUFDO0FBQUUsZUFBUTtPQUFDO0FBQzlCLFVBQUksQ0FBQyxLQUFLLEVBQUc7Ozs7O0FBQUMsQUFLZCxVQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDOztpQ0FJbEIsQ0FBQztBQUNQLFlBQUksRUFBRSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyQixZQUFJLEVBQUUsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUUsQ0FBQyxDQUFDOzs7QUFBQyxBQUc3QixZQUFHLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsRUFBQzs7O0FBRTlELGdCQUFJLFdBQVcsR0FBRyxPQUFLLGNBQWMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3hELG1CQUFLLE9BQU8sQ0FBQyxXQUFXLEVBQUUsT0FBSyxNQUFNLENBQUMsQ0FBQztBQUN2QyxrQkFBTSxDQUFDLFVBQVUsQ0FBQyxZQUFNO0FBQ3RCLHFCQUFLLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7YUFDckQsRUFBRSxHQUFHLENBQUMsQ0FBQzs7U0FDVDs7QUFBQTs7QUFaSCxXQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFDO2NBQWxCLENBQUM7T0FjUjtLQUNGOzs7Ozs7a0NBR2EsUUFBUSxFQUFDO0FBQ3JCLFVBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN0QyxPQUFDLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBR3pCLFVBQUksQ0FBQyxHQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUM7O0FBQUMsQUFFL0MsVUFBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUM7QUFDVixZQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JDLGlCQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDYixlQUFPLEtBQUssQ0FBQzs7O0FBQ2QsV0FFSSxJQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBQztBQUN6QyxjQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JDLG1CQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDYixpQkFBTyxLQUFLLENBQUM7OztBQUNkLGFBRUc7QUFDRixtQkFBTyxJQUFJLENBQUM7V0FDYjtLQUNGOzs7Ozs7O3FDQUlnQixFQUFFLEVBQUUsRUFBRSxFQUFDO0FBQ3RCLFVBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pCLFVBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pCLFVBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pCLFVBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUV6QixVQUFJLENBQUMsR0FBSSxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDOztBQUFDLEFBRTVDLFVBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFDO0FBQ1YsWUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDN0IsWUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDN0IsWUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDN0IsWUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDN0IsZUFBTyxLQUFLLENBQUE7OztBQUNiLFdBRUksSUFBRyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUM7OztBQUd2QyxjQUFJLENBQUMsR0FBSSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxBQUFDLENBQUM7QUFDN0UsY0FBSSxDQUFDLEdBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQUFBQyxDQUFDO0FBQzdFLGNBQUcsQ0FBQyxJQUFJLENBQUMsRUFBQztBQUNSLG1CQUFPLElBQUksQ0FBQzs7O0FBQ2IsZUFFRztBQUNGLGtCQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM3QixrQkFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDN0Isa0JBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzdCLGtCQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM3QixxQkFBTyxLQUFLLENBQUE7YUFDYjtTQUNGO0tBQ0Y7Ozs7Ozs7O3lDQUttQjtBQUNsQixVQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDNUIsVUFBSSxLQUFLLEdBQUcsQ0FBQyxHQUFDLElBQUksQ0FBQyxFQUFFLEdBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUM3QixVQUFNLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUVyQixXQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBQzs7QUFFN0IsWUFBSSxDQUFDLEdBQUc7QUFDTixXQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoRCxXQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2xELENBQUE7O0FBRUQsZ0JBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7T0FDbEI7QUFDRCxhQUFPLFFBQVEsQ0FBQztLQUNqQjs7Ozs7O2lDQUdXO0FBQ1YsVUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuQyxVQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7QUFBQyxBQUVuQyxVQUFNLENBQUMsR0FBRyxDQUFDLEdBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxBQUFDLENBQUMsR0FBQyxDQUFDLElBQUcsQ0FBQyxHQUFDLENBQUMsQ0FBQSxBQUFDLEdBQUUsQ0FBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUNsRCxVQUFNLENBQUMsR0FBRyxDQUFDLEdBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUUsQUFBQyxDQUFDLEdBQUMsQ0FBQyxJQUFHLENBQUMsR0FBQyxDQUFDLENBQUEsQUFBQyxDQUFDLEdBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUNsRCxVQUFNLENBQUMsR0FBRztBQUNSLFNBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLFNBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7T0FDekMsQ0FBQTs7QUFFRCxVQUFNLE1BQU0sR0FBRyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQzs7O0FBQUMsQUFHNUIsVUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFOzs7QUFBQyxBQUc1RCxPQUFDLEdBQUc7QUFDRixTQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1RCxTQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQztPQUM3RCxDQUFBOztBQUVELGFBQU8sQ0FBQyxDQUFDO0tBQ1Y7Ozs7OzttQ0FHYyxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBQztBQUM5QixVQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO0FBQzFCLFVBQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQztBQUN2QixVQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDMUQsV0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBQztBQUN2QixZQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNuRCxtQkFBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztPQUNyQjs7QUFFRCxhQUFPLFdBQVcsQ0FBQztLQUNwQjs7Ozs7OztrQ0FJWTtBQUNYLFVBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFFLENBQUMsQ0FBQSxJQUFHLElBQUksQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFBLEFBQUMsSUFBSSxDQUFDLEVBQUM7QUFDN0IsZUFBTyxDQUFDLEtBQUssQ0FBQyxzREFBc0QsQ0FBQyxDQUFDO0FBQ3RFLGVBQU8sSUFBSSxDQUFDO09BQ2IsTUFDSSxJQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFDO0FBQ2pCLGVBQU8sQ0FBQyxLQUFLLENBQUM7b0NBQ2dCLENBQUMsQ0FBQztBQUNoQyxlQUFPLElBQUksQ0FBQztPQUNiLE1BQ0ksSUFBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBQztBQUNqQixlQUFPLENBQUMsS0FBSyxDQUFDLG9EQUFvRCxDQUFDLENBQUM7QUFDcEUsZUFBTyxJQUFJLENBQUM7T0FDYixNQUNJO0FBQUUsZUFBTyxLQUFLLENBQUM7T0FBRTtLQUN2Qjs7O1NBOU1VLGtCQUFrQjtRQVR0QixJQUFJIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICpcbi8vICogIENBTlZBUyBVVElMSVRZIEZVTkNUSU9OU1xuLy8gKlxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuZXhwb3J0IGNsYXNzIENhbnZhc3tcbiAgY29uc3RydWN0b3IoKXtcbiAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2NhbnZhcycpO1xuICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgIHRoaXMuY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG4gICAgLy90cmFuc2Zvcm0gdGhlIGNhbnZhcyBzbyB0aGUgb3JpZ2luIGlzIGF0IHRoZSBjZW50cmUgb2YgdGhlIGRpc2tcbiAgICB0aGlzLmN0eC50cmFuc2xhdGUod2luZG93LmlubmVyV2lkdGggLyAyLCB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKTtcblxuICB9XG5cblxuICAvL2RyYXcgYSBoeXBlcmJvbGljIGxpbmUgc2VnbWVudCB1c2luZyBjYWxjdWxhdGlvbnMgZnJvbSBsaW5lKCkgb3IgYXJjKClcbiAgc2VnbWVudChjLCBhbHBoYSwgYWxwaGFPZmZzZXQsIGNvbG91ciwgd2lkdGgpe1xuICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgIHRoaXMuY3R4LmFyYyhjLmNlbnRyZS54LCBjLmNlbnRyZS55LCBjLnJhZGl1cywgYWxwaGFPZmZzZXQsIGFscGhhICsgYWxwaGFPZmZzZXQpO1xuICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gY29sb3VyIHx8ICdibGFjayc7XG4gICAgdGhpcy5jdHgubGluZVdpZHRoID0gd2lkdGggfHwgMTtcbiAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgfVxuXG4gIC8vZHJhdyBhIChldWNsaWRlYW4pIGxpbmUgYmV0d2VlbiB0d28gcG9pbnRzXG4gIGV1Y2xpZGVhbkxpbmUocDEsIHAyLCBjb2xvdXIsIHdpZHRoKXtcbiAgICBjb25zdCBjID0gY29sb3VyIHx8ICdibGFjayc7XG4gICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgdGhpcy5jdHgubW92ZVRvKHAxLngsIHAxLnkpO1xuICAgIHRoaXMuY3R4LmxpbmVUbyhwMi54LCBwMi55KTtcbiAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IGM7XG4gICAgdGhpcy5jdHgubGluZVdpZHRoID0gd2lkdGggfHwgMTtcbiAgICB0aGlzLmN0eC5zdHJva2UoKVxuICB9XG5cbiAgLy9kcmF3IGEgcG9pbnQgb24gdGhlIGRpc2ssIG9wdGlvbmFsIHJhZGl1cyBhbmQgY29sb3VyXG4gIHBvaW50KHBvaW50LCByYWRpdXMsIGNvbG91cil7XG4gICAgY29uc3QgY29sID0gY29sb3VyIHx8ICdibGFjayc7XG4gICAgY29uc3QgciA9IHJhZGl1cyB8fCAyO1xuICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgIHRoaXMuY3R4LmFyYyhwb2ludC54LCBwb2ludC55LCByLCAwLCBNYXRoLlBJICogMiwgdHJ1ZSk7XG4gICAgdGhpcy5jdHguZmlsbFN0eWxlID0gY29sO1xuICAgIHRoaXMuY3R4LmZpbGwoKTtcbiAgfVxuXG4gIC8vZHJhdyBhIGNpcmNsZSBvZiByYWRpdXMgciBjZW50cmUgYyBhbmQgb3B0aW9uYWwgY29sb3VyXG4gIGNpcmNsZShjLCByLCBjb2xvdXIsIHdpZHRoKXtcbiAgICBjb25zdCBjb2wgPSBjb2xvdXIgfHwgJ2JsYWNrJztcbiAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICB0aGlzLmN0eC5hcmMoYy54LCBjLnksIHIsIDAsIE1hdGguUEkgKiAyKTtcbiAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IGNvbDtcbiAgICB0aGlzLmN0eC5saW5lV2lkdGggPSB3aWR0aCB8fCAxO1xuICAgIHRoaXMuY3R4LnN0cm9rZSgpO1xuICB9XG5cbiAgLy9jb252ZXJ0IHRoZSBjYW52YXMgdG8gYSBiYXNlNjRVUkwgYW5kIHNlbmQgdG8gc2F2ZUltYWdlLnBocFxuICBzYXZlSW1hZ2UoKXtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5jYW52YXMudG9EYXRhVVJMKCk7XG4gICAgJC5hamF4KHtcbiAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgIHVybDogJ3NhdmVJbWFnZS5waHAnLFxuICAgICAgZGF0YTogeyBpbWc6IGRhdGEgfVxuICAgIH0pO1xuICB9XG5cbiAgLy90aGUgY2FudmFzIGhhcyBiZWVuIHRyYW5zbGF0ZWQgdG8gdGhlIGNlbnRyZSBvZiB0aGUgZGlzayBzbyBuZWVkIHRvXG4gIC8vdXNlIGFuIG9mZnNldCB0byBjbGVhciBpdC4gTk9UIFdPUktJTkcgV0hFTiBTQ1JFRU4gSVMgUkVTSVpFRFxuICBjbGVhcigpIHtcbiAgICB0aGlzLmN0eC5jbGVhclJlY3QoLXdpbmRvdy5pbm5lcldpZHRoLzIsLXdpbmRvdy5pbm5lckhlaWdodC8yLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gIH1cblxufVxuIiwiaW1wb3J0ICogYXMgRSBmcm9tICcuL2V1Y2xpZCc7XG5pbXBvcnQgeyBDYW52YXMgfSBmcm9tICcuL2NhbnZhcyc7XG5cbi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICpcbi8vICogICBESVNLIENMQVNTXG4vLyAqICAgUG9pbmNhcmUgRGlzayByZXByZXNlbnRhdGlvbiBvZiB0aGUgaHlwZXJib2xpYyBwbGFuZVxuLy8gKiAgIENvbnRhaW5zIGFueSBmdW5jdGlvbnMgdXNlZCB0byBkcmF3IHRvIHRoZSBkaXNrXG4vLyAqICAgQ29uc3RydWN0b3IgdGFrZXMgdGhlIGRyYXdpbmcgY2xhc3MgYXMgYW4gYXJndW1lbnRcbi8vICogICAoQ3VycmVudGx5IG9ubHkgQ2FudmFzIHVzZWQsIG1pZ2h0IHN3aXRjaCB0byBXZWJHTCBpbiBmdXR1cmUpXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5leHBvcnQgY2xhc3MgRGlzayB7XG4gIGNvbnN0cnVjdG9yKGRyYXdDbGFzcykge1xuICAgIGRyYXdDbGFzcyA9IGRyYXdDbGFzcyB8fCAnY2FudmFzJztcbiAgICBpZihkcmF3Q2xhc3MgPT09ICdjYW52YXMnKXtcbiAgICAgIHRoaXMuZHJhdyA9IG5ldyBDYW52YXMoKTtcbiAgICB9XG4gICAgdGhpcy5jZW50cmUgPSB7XG4gICAgICB4OiAwLFxuICAgICAgeTogMFxuICAgIH1cblxuICAgIC8vZHJhdyBsYXJnZXN0IGNpcmNsZSBwb3NzaWJsZSBnaXZlbiB3aW5kb3cgZGltc1xuICAgIHRoaXMucmFkaXVzID0gKHdpbmRvdy5pbm5lcldpZHRoIDwgd2luZG93LmlubmVySGVpZ2h0KSA/ICh3aW5kb3cuaW5uZXJXaWR0aCAvIDIpIC0gNSA6ICh3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKSAtIDU7XG5cbiAgICAvL3NtYWxsZXIgY2lyY2xlIGZvciB0ZXN0aW5nXG4gICAgLy8gL3RoaXMucmFkaXVzID0gdGhpcy5yYWRpdXMgLyAzO1xuXG4gICAgdGhpcy5jb2xvciA9ICdibGFjayc7XG4gIH1cblxuICAvL2RyYXcgdGhlIGJvdW5kYXJ5IGNpcmNsZVxuICBvdXRlckNpcmNsZSgpIHtcbiAgICB0aGlzLmRyYXcuY2lyY2xlKHt4OiB0aGlzLmNlbnRyZS54LCB5OiB0aGlzLmNlbnRyZS55fSwgdGhpcy5yYWRpdXMpO1xuICB9XG5cbiAgLy9kcmF3IGEgaHlwZXJib2xpYyBsaW5lIGJldHdlZW4gdHdvIHBvaW50cyBvbiB0aGUgYm91bmRhcnkgY2lyY2xlXG4gIGxpbmUocDEsIHAyLCBjb2xvdXIpIHtcbiAgICAvL2xldCBwdHMgPSB0aGlzLnByZXBQb2ludHMocDEsIHAyKTtcbiAgICAvL3AxID0gcHRzLnAxO1xuICAgIC8vcDIgPSBwdHMucDI7XG4gICAgbGV0IGNvbCA9IGNvbG91ciB8fCAnYmxhY2snO1xuICAgIGxldCBjLCBwb2ludHM7XG5cbiAgICBpZihFLnRocm91Z2hPcmlnaW4ocDEscDIpKXtcbiAgICAgIGxldCB1ID0gbm9ybWFsVmVjdG9yKHAxLHAyKTtcbiAgICAgIHBvaW50cyA9IHtcbiAgICAgICAgcDE6IHtcbiAgICAgICAgICB4OiB1LnggKiB0aGlzLnJhZGl1cyxcbiAgICAgICAgICB5OiB1LnkgKiB0aGlzLnJhZGl1c1xuICAgICAgICB9LFxuICAgICAgICBwMjoge1xuICAgICAgICAgIHg6IC11LnggKiB0aGlzLnJhZGl1cyxcbiAgICAgICAgICB5OiAtdS55ICogdGhpcy5yYWRpdXNcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5kcmF3LmV1Y2xpZGVhbkxpbmUocG9pbnRzLnAxLHBvaW50cy5wMiwgY29sKTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgIGMgPSBFLmdyZWF0Q2lyY2xlKHAxLCBwMiwgdGhpcy5yYWRpdXMsIHRoaXMuY2VudHJlKTtcbiAgICAgIHBvaW50cyA9IEUuY2lyY2xlSW50ZXJzZWN0KHRoaXMuY2VudHJlLCBjLmNlbnRyZSwgdGhpcy5yYWRpdXMsIGMucmFkaXVzKTtcblxuICAgICAgLy9hbmdsZSBzdWJ0ZW5kZWQgYnkgdGhlIGFyY1xuICAgICAgbGV0IGFscGhhID0gRS5jZW50cmFsQW5nbGUocG9pbnRzLnAxLCBwb2ludHMucDIsIGMucmFkaXVzKTtcblxuICAgICAgbGV0IG9mZnNldCA9IHRoaXMuYWxwaGFPZmZzZXQocG9pbnRzLnAyLCBwb2ludHMucDIsIGMsICdsaW5lJyk7XG4gICAgICB0aGlzLmRyYXcuc2VnbWVudChjLCBhbHBoYSwgb2Zmc2V0LCBjb2wpO1xuICAgIH1cbiAgfVxuXG4gIC8vY2FsY3VsYXRlIHRoZSBvZmZzZXQgKHBvc2l0aW9uIGFyb3VuZCB0aGUgY2lyY2xlIGZyb20gd2hpY2ggdG8gc3RhcnQgdGhlXG4gIC8vbGluZSBvciBhcmMpLiBBcyBjYW52YXMgZHJhd3MgYXJjcyBjbG9ja3dpc2UgYnkgZGVmYXVsdCB0aGlzIHdpbGwgY2hhbmdlXG4gIC8vZGVwZW5kaW5nIG9uIHdoZXJlIHRoZSBhcmMgaXMgcmVsYXRpdmUgdG8gdGhlIG9yaWdpblxuICAvL3NwZWNpZmljYWxsIHdoZXRoZXIgaXQgbGllcyBvbiB0aGUgeCBheGlzLCBvciBhYm92ZSBvciBiZWxvdyBpdFxuICAvL3R5cGUgPSAnbGluZScgb3IgJ2FyYydcbiAgYWxwaGFPZmZzZXQocDEsIHAyLCBjLCB0eXBlKSB7XG4gICAgbGV0IG9mZnNldDtcblxuICAgIC8vcG9pbnRzIGF0IDAgcmFkaWFucyBvbiBncmVhdENpcmNsZVxuICAgIGxldCBwID0ge1xuICAgICAgeDogYy5jZW50cmUueCArIGMucmFkaXVzLFxuICAgICAgeTogYy5jZW50cmUueVxuICAgIH1cblxuICAgIGlmKHAxLnkgPCBjLmNlbnRyZS55KXtcbiAgICAgIG9mZnNldCA9IDIqTWF0aC5QSSAtIEUuY2VudHJhbEFuZ2xlKHAxLCBwLCBjLnJhZGl1cyk7XG4gICAgfVxuICAgIGVsc2V7XG4gICAgICBvZmZzZXQgPSBFLmNlbnRyYWxBbmdsZShwMSwgcCwgYy5yYWRpdXMpO1xuICAgIH1cblxuICAgIHJldHVybiBvZmZzZXQ7XG4gIH1cblxuICAvL3B1dCBwb2ludHMgaW4gY2xvY2t3aXNlIG9yZGVyXG4gIHByZXBQb2ludHMocDEsIHAyLCBjKXtcbiAgICBjb25zdCBwID0ge3g6IGMuY2VudHJlLnggKyBjLnJhZGl1cywgeTogYy5jZW50cmUueX07XG4gICAgLy9jYXNlIHdoZXJlIHBvaW50cyBhcmUgYWJvdmUgYW5kIGJlbG93IHRoZSBsaW5lIGMuY2VudHJlIC0+IHBcbiAgICAvL2luIHRoaXMgY2FzZSBqdXN0IHJldHVybiBwb2ludHNcbiAgICBjb25zdCBveSA9IGMuY2VudHJlLnk7XG4gICAgY29uc3Qgb3ggPSBjLmNlbnRyZS54O1xuXG4gICAgaWYocDEueCA+IG94ICYmIHAyLnggPiBveCl7XG4gICAgICBpZihwMS55ID4gb3kgJiYgcDIueSA8IG95KSByZXR1cm4ge3AxOiBwMiwgcDI6IHAxfTtcbiAgICAgIGVsc2UgaWYocDEueSA8IG95ICYmIHAyLnkgPiBveSkgcmV0dXJuIHtwMTogcDEsIHAyOiBwMn07XG4gICAgfVxuXG4gICAgbGV0IGFscGhhMSA9IEUuY2VudHJhbEFuZ2xlKHAsIHAxLCBjLnJhZGl1cyk7XG4gICAgYWxwaGExID0gKHAxLnkgPCBjLmNlbnRyZS55KSA/IDIqTWF0aC5QSSAtIGFscGhhMSA6IGFscGhhMTtcbiAgICBsZXQgYWxwaGEyID0gRS5jZW50cmFsQW5nbGUocCwgcDIsIGMucmFkaXVzKTtcbiAgICBhbHBoYTIgPSAocDIueSA8IGMuY2VudHJlLnkpID8gMipNYXRoLlBJIC0gYWxwaGEyIDogYWxwaGEyO1xuXG4gICAgLy9pZiB0aGUgcG9pbnRzIGFyZSBub3QgaW4gY2xvY2t3aXNlIG9yZGVyIGZsaXAgdGhlbVxuICAgIGlmKGFscGhhMSA+IGFscGhhMikgcmV0dXJuIHtwMTogcDIsIHAyOiBwMX07XG4gICAgZWxzZSByZXR1cm4ge3AxOiBwMSwgcDI6IHAyfTtcblxuICB9XG5cbiAgLy9EcmF3IGFuIGFyYyAoaHlwZXJib2xpYyBsaW5lIHNlZ21lbnQpIGJldHdlZW4gdHdvIHBvaW50cyBvbiB0aGUgZGlza1xuICBhcmMocDEsIHAyLCBjb2xvdXIpIHtcbiAgICBpZihFLnRocm91Z2hPcmlnaW4ocDEscDIpKXtcbiAgICAgIHRoaXMuZHJhdy5ldWNsaWRlYW5MaW5lKHAxLHAyLCBjb2xvdXIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgY29sID0gY29sb3VyIHx8ICdibGFjayc7XG4gICAgbGV0IGMgPSBFLmdyZWF0Q2lyY2xlKHAxLCBwMiwgdGhpcy5yYWRpdXMsIHRoaXMuY2VudHJlKTtcbiAgICBsZXQgcHRzID0gdGhpcy5wcmVwUG9pbnRzKHAxLCBwMiwgYyk7XG4gICAgcDEgPSBwdHMucDE7XG4gICAgcDIgPSBwdHMucDI7XG5cbiAgICAvL2xlbmd0aCBvZiB0aGUgYXJjXG4gICAgbGV0IGFscGhhID0gRS5jZW50cmFsQW5nbGUocDEsIHAyLCBjLnJhZGl1cyk7XG5cbiAgICAvL2hvdyBmYXIgYXJvdW5kIHRoZSBncmVhdENpcmNsZSB0byBzdGFydCBkcmF3aW5nIHRoZSBhcmNcbiAgICBsZXQgb2Zmc2V0ID0gdGhpcy5hbHBoYU9mZnNldChwMSwgcDIsIGMsICdhcmMnKTtcbiAgICB0aGlzLmRyYXcuc2VnbWVudChjLCBhbHBoYSwgb2Zmc2V0LCBjb2xvdXIpO1xuICB9XG5cbiAgcG9seWdvbih2ZXJ0aWNlcywgY29sb3VyKSB7XG4gICAgbGV0IGwgPSB2ZXJ0aWNlcy5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgIHRoaXMuYXJjKHZlcnRpY2VzW2ldLCB2ZXJ0aWNlc1soaSArIDEpJWxdLCBjb2xvdXIpO1xuICAgIH1cbiAgfVxuXG4gIC8vcmV0dXJuIHRydWUgaWYgdGhlIHBvaW50IGlzIG5vdCBpbiB0aGUgZGlza1xuICBjaGVja1BvaW50KHBvaW50KSB7XG4gICAgbGV0IHIgPSB0aGlzLnJhZGl1cztcbiAgICBpZiAoRS5kaXN0YW5jZShwb2ludCwgdGhpcy5jZW50cmUpID4gcikge1xuICAgICAgY29uc29sZS5lcnJvcignRXJyb3IhIFBvaW50ICgnICsgcG9pbnQueCArICcsICcgKyBwb2ludC55ICsgJykgbGllcyBvdXRzaWRlIHRoZSBwbGFuZSEnKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cbiIsIi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICpcbi8vICogICBFVUNMSURFQU4gRlVOQ1RJT05TXG4vLyAqICAgYWxsIEV1Y2xpZGVhbiBtYXRoZW1hdGljYWwgZnVuY3Rpb25zIGdvIGhlcmVcbi8vICpcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuLy9kaXN0YW5jZSBiZXR3ZWVuIHR3byBwb2ludHNcbmV4cG9ydCBjb25zdCBkaXN0YW5jZSA9IChwMSwgcDIpID0+IE1hdGguc3FydChNYXRoLnBvdygocDIueCAtIHAxLngpLCAyKSArIE1hdGgucG93KChwMi55IC0gcDEueSksIDIpKTtcblxuLy9taWRwb2ludCBvZiB0aGUgbGluZSBzZWdtZW50IGNvbm5lY3RpbmcgdHdvIHBvaW50c1xuZXhwb3J0IGNvbnN0IG1pZHBvaW50ID0gKHAxLCBwMikgPT4ge1xuICByZXR1cm4ge1xuICAgIHg6IChwMS54ICsgcDIueCkgLyAyLFxuICAgIHk6IChwMS55ICsgcDIueSkgLyAyXG4gIH1cbn1cblxuLy9zbG9wZSBvZiBsaW5lIHRocm91Z2ggcDEsIHAyXG5leHBvcnQgY29uc3Qgc2xvcGUgPSAocDEsIHAyKSA9PiAocDIueCAtIHAxLngpIC8gKHAyLnkgLSBwMS55KTtcblxuLy9zbG9wZSBvZiBsaW5lIHBlcnBlbmRpY3VsYXIgdG8gYSBsaW5lIGRlZmluZWQgYnkgcDEscDJcbmV4cG9ydCBjb25zdCBwZXJwZW5kaWN1bGFyU2xvcGUgPSAocDEsIHAyKSA9PiAtMSAvIChNYXRoLnBvdyhzbG9wZShwMSwgcDIpLCAtMSkpO1xuXG4vL2ludGVyc2VjdGlvbiBwb2ludCBvZiB0d28gbGluZXMgZGVmaW5lZCBieSBwMSxtMSBhbmQgcTEsbTJcbi8vTk9UIFdPUktJTkcgRk9SIFZFUlRJQ0FMIExJTkVTISEhXG5leHBvcnQgY29uc3QgaW50ZXJzZWN0aW9uID0gKHAxLCBtMSwgcDIsIG0yKSA9PiB7XG4gIGxldCBjMSwgYzIsIHgsIHk7XG4gIC8vY2FzZSB3aGVyZSBmaXJzdCBsaW5lIGlzIHZlcnRpY2FsXG4gIC8vaWYobTEgPiA1MDAwIHx8IG0xIDwgLTUwMDAgfHwgbTEgPT09IEluZmluaXR5KXtcbiAgaWYocDEueSA8IDAuMDAwMDAxICYmIHAxLnkgPiAtMC4wMDAwMDEgKXtcbiAgICB4ID0gcDEueDtcbiAgICB5ID0gKG0yKSoocDEueC1wMi54KSArIHAyLnk7XG4gIH1cbiAgLy9jYXNlIHdoZXJlIHNlY29uZCBsaW5lIGlzIHZlcnRpY2FsXG4gIC8vZWxzZSBpZihtMiA+IDUwMDAgfHwgbTIgPCAtNTAwMCB8fCBtMSA9PT0gSW5maW5pdHkpe1xuICBlbHNlIGlmKHAyLnkgPCAwLjAwMDAwMSAmJiBwMi55ID4gLTAuMDAwMDAxICl7XG4gICAgeCA9IHAyLng7XG4gICAgeSA9IChtMSoocDIueC1wMS54KSkgKyBwMS55O1xuICB9XG4gIGVsc2V7XG4gICAgLy95IGludGVyY2VwdCBvZiBmaXJzdCBsaW5lXG4gICAgYzEgPSBwMS55IC0gbTEgKiBwMS54O1xuICAgIC8veSBpbnRlcmNlcHQgb2Ygc2Vjb25kIGxpbmVcbiAgICBjMiA9IHAyLnkgLSBtMiAqIHAyLng7XG5cbiAgICB4ID0gKGMyIC0gYzEpIC8gKG0xIC0gbTIpO1xuICAgIHkgPSBtMSAqIHggKyBjMTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgeDogeCxcbiAgICB5OiB5XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHJhZGlhbnMgPSAoZGVncmVlcykgPT4gKE1hdGguUEkgLyAxODApICogZGVncmVlcztcblxuLy9nZXQgdGhlIGNpcmNsZSBpbnZlcnNlIG9mIGEgcG9pbnQgcCB3aXRoIHJlc3BlY3QgYSBjaXJjbGUgcmFkaXVzIHIgY2VudHJlIGNcbmV4cG9ydCBjb25zdCBpbnZlcnNlID0gKHAsIHIsIGMpID0+IHtcbiAgbGV0IGFscGhhID0gKHIgKiByKSAvIChNYXRoLnBvdyhwLnggLSBjLngsIDIpICsgTWF0aC5wb3cocC55IC0gYy55LCAyKSk7XG4gIHJldHVybiB7XG4gICAgeDogYWxwaGEgKiAocC54IC0gYy54KSArIGMueCxcbiAgICB5OiBhbHBoYSAqIChwLnkgLSBjLnkpICsgYy55XG4gIH07XG59XG5cbi8vY2FsY3VsYXRlIHRoZSByYWRpdXMgYW5kIGNlbnRyZSBvZiB0aGUgY2lyY2xlIHJlcXVpcmVkIHRvIGRyYXcgYSBsaW5lIGJldHdlZW5cbi8vdHdvIHBvaW50cyBpbiB0aGUgaHlwZXJib2xpYyBwbGFuZSBkZWZpbmVkIGJ5IHRoZSBkaXNrIChyLCBjKVxuZXhwb3J0IGNvbnN0IGdyZWF0Q2lyY2xlID0gKHAxLCBwMiwgciwgYykgPT4ge1xuICBsZXQgcDFJbnZlcnNlID0gaW52ZXJzZShwMSwgciwgYyk7XG4gIGxldCBwMkludmVyc2UgPSBpbnZlcnNlKHAyLCByLCBjKTtcblxuICBsZXQgbSA9IG1pZHBvaW50KHAxLCBwMUludmVyc2UpO1xuICBsZXQgbiA9IG1pZHBvaW50KHAyLCBwMkludmVyc2UpO1xuXG4gIGxldCBtMSA9IHBlcnBlbmRpY3VsYXJTbG9wZShtLCBwMUludmVyc2UpO1xuICBsZXQgbTIgPSBwZXJwZW5kaWN1bGFyU2xvcGUobiwgcDJJbnZlcnNlKTtcblxuXG4gIC8vY2VudHJlIGlzIHRoZSBjZW50cmVwb2ludCBvZiB0aGUgY2lyY2xlIG91dCBvZiB3aGljaCB0aGUgYXJjIGlzIG1hZGVcbiAgbGV0IGNlbnRyZSA9IGludGVyc2VjdGlvbihtLCBtMSwgbiwgbTIpO1xuICBsZXQgcmFkaXVzID0gZGlzdGFuY2UoY2VudHJlLCBwMSk7XG4gIHJldHVybiB7XG4gICAgY2VudHJlOiBjZW50cmUsXG4gICAgcmFkaXVzOiByYWRpdXNcbiAgfTtcbn1cblxuLy9hbiBhdHRlbXB0IGF0IGNhbGN1bGF0aW5nIHRoZSBjaXJjbGUgYWxnZWJyYWljYWxseVxuZXhwb3J0IGNvbnN0IGdyZWF0Q2lyY2xlVjIgPSAocDEscDIsIHIpID0+e1xuICBsZXQgeCA9IChwMi55KihwMS54KnAxLnggKyByKSsgcDEueSpwMS55KnAyLnktcDEueSoocDIueCpwMi54KyBwMi55KnAyLnkgKyByKSkvKDIqcDEueCpwMi55IC0gcDEueSpwMi54KTtcbiAgbGV0IHkgPSAocDEueCpwMS54KnAyLnggLSBwMS54KihwMi54KnAyLngrcDIueSpwMi55K3IpK3AyLngqKHAxLnkqcDEueStyKSkvKDIqcDEueSpwMi54ICsgMipwMS54KnAyLnkpO1xuICBsZXQgcmFkaXVzID0gICBNYXRoLnNxcnQoeCp4K3kqeS1yKTtcbiAgcmV0dXJuIHtcbiAgICBjZW50cmU6IHtcbiAgICAgIHg6IHgsXG4gICAgICB5OiB5XG4gICAgfSxcbiAgICByYWRpdXM6IHJhZGl1c1xuICB9XG59XG5cbi8vaW50ZXJzZWN0aW9uIG9mIHR3byBjaXJjbGVzIHdpdGggZXF1YXRpb25zOlxuLy8oeC1hKV4yICsoeS1hKV4yID0gcjBeMlxuLy8oeC1iKV4yICsoeS1jKV4yID0gcjFeMlxuLy9OT1RFIGFzc3VtZXMgdGhlIHR3byBjaXJjbGVzIERPIGludGVyc2VjdCFcbmV4cG9ydCBjb25zdCBjaXJjbGVJbnRlcnNlY3QgPSAoYzAsIGMxLCByMCwgcjEpID0+IHtcbiAgbGV0IGEgPSBjMC54O1xuICBsZXQgYiA9IGMwLnk7XG4gIGxldCBjID0gYzEueDtcbiAgbGV0IGQgPSBjMS55O1xuICBsZXQgZGlzdCA9IE1hdGguc3FydCgoYyAtIGEpICogKGMgLSBhKSArIChkIC0gYikgKiAoZCAtIGIpKTtcblxuICBsZXQgZGVsID0gTWF0aC5zcXJ0KChkaXN0ICsgcjAgKyByMSkgKiAoZGlzdCArIHIwIC0gcjEpICogKGRpc3QgLSByMCArIHIxKSAqICgtZGlzdCArIHIwICsgcjEpKSAvIDQ7XG5cbiAgbGV0IHhQYXJ0aWFsID0gKGEgKyBjKSAvIDIgKyAoKGMgLSBhKSAqIChyMCAqIHIwIC0gcjEgKiByMSkpIC8gKDIgKiBkaXN0ICogZGlzdCk7XG4gIGxldCB4MSA9IHhQYXJ0aWFsIC0gMiAqIGRlbCAqIChiIC0gZCkgLyAoZGlzdCAqIGRpc3QpO1xuICBsZXQgeDIgPSB4UGFydGlhbCArIDIgKiBkZWwgKiAoYiAtIGQpIC8gKGRpc3QgKiBkaXN0KTtcblxuICBsZXQgeVBhcnRpYWwgPSAoYiArIGQpIC8gMiArICgoZCAtIGIpICogKHIwICogcjAgLSByMSAqIHIxKSkgLyAoMiAqIGRpc3QgKiBkaXN0KTtcbiAgbGV0IHkxID0geVBhcnRpYWwgKyAyICogZGVsICogKGEgLSBjKSAvIChkaXN0ICogZGlzdCk7XG4gIGxldCB5MiA9IHlQYXJ0aWFsIC0gMiAqIGRlbCAqIChhIC0gYykgLyAoZGlzdCAqIGRpc3QpO1xuXG4gIGxldCBwMSA9IHtcbiAgICB4OiB4MSxcbiAgICB5OiB5MVxuICB9XG5cbiAgbGV0IHAyID0ge1xuICAgIHg6IHgyLFxuICAgIHk6IHkyXG4gIH1cblxuICByZXR1cm4ge1xuICAgIHAxOiBwMSxcbiAgICBwMjogcDJcbiAgfTtcbn1cblxuZXhwb3J0IGNvbnN0IGNpcmNsZUxpbmVJbnRlcnNlY3QgPSAoYywgciwgcDEsIHAyKSA9PiB7XG5cbiAgY29uc3QgZCA9IGRpc3RhbmNlKHAxLCBwMik7XG4gIC8vdW5pdCB2ZWN0b3IgcDEgcDJcbiAgY29uc3QgZHggPSAocDIueCAtIHAxLngpL2Q7XG4gIGNvbnN0IGR5ID0gKHAyLnkgLSBwMS55KS9kO1xuXG4gIC8vcG9pbnQgb24gbGluZSBjbG9zZXN0IHRvIGNpcmNsZSBjZW50cmVcbiAgY29uc3QgdCA9IGR4KihjLnggLXAxLngpICsgZHkqKGMueS1wMS55KTtcbiAgY29uc3QgcCA9ICB7eDogdCogZHggKyBwMS54LCB5OiB0KiBkeSArIHAxLnl9O1xuXG4gIC8vZGlzdGFuY2UgZnJvbSB0aGlzIHBvaW50IHRvIGNlbnRyZVxuICBjb25zdCBkMiA9IGRpc3RhbmNlKHAsIGMpO1xuXG4gIC8vbGluZSBpbnRlcnNlY3RzIGNpcmNsZVxuICBpZihkMiA8IHIpe1xuICAgIGNvbnN0IGR0ID0gTWF0aC5zcXJ0KCByKnIgLSBkMipkMik7XG4gICAgLy9wb2ludCAxXG4gICAgY29uc3QgcTEgPSB7XG4gICAgICB4OiAodC1kdCkqZHggKyBwMS54LFxuICAgICAgeTogKHQtZHQpKmR5ICsgcDEueVxuICAgIH1cbiAgICAvL3BvaW50IDJcbiAgICBjb25zdCBxMiA9IHtcbiAgICAgIHg6ICh0K2R0KSpkeCArIHAxLngsXG4gICAgICB5OiAodCtkdCkqZHkgKyBwMS55XG4gICAgfVxuXG4gICAgcmV0dXJuIHtwMTogcTEsIHAyOiBxMn07XG4gIH1cbiAgZWxzZSBpZiggZDIgPT09IHIpe1xuICAgIHJldHVybiBwO1xuICB9XG4gIGVsc2V7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3I6IGxpbmUgZG9lcyBub3QgaW50ZXJzZWN0IGNpcmNsZSEnKTtcbiAgfVxufVxuXG4vL2FuZ2xlIGluIHJhZGlhbnMgYmV0d2VlbiB0d28gcG9pbnRzIG9uIGNpcmNsZSBvZiByYWRpdXMgclxuZXhwb3J0IGNvbnN0IGNlbnRyYWxBbmdsZSA9IChwMSwgcDIsIHIpID0+IHtcbiAgcmV0dXJuIDIgKiBNYXRoLmFzaW4oMC41ICogZGlzdGFuY2UocDEsIHAyKSAvIHIpO1xufVxuXG4vL2NhbGN1bGF0ZSB0aGUgbm9ybWFsIHZlY3RvciBnaXZlbiAyIHBvaW50c1xuZXhwb3J0IGNvbnN0IG5vcm1hbFZlY3RvciA9IChwMSwgcDIpID0+IHtcbiAgbGV0IGQgPSBNYXRoLnNxcnQoTWF0aC5wb3cocDIueC1wMS54LDIpICsgTWF0aC5wb3cocDIueS1wMS55LDIpKTtcbiAgcmV0dXJuIHtcbiAgICB4OiAocDIueC1wMS54KS9kLFxuICAgIHk6IChwMi55LXAxLnkpL2RcbiAgfVxufVxuXG4vL2RvZXMgdGhlIGxpbmUgY29ubmVjdGluZyBwMSwgcDIgZ28gdGhyb3VnaCB0aGUgcG9pbnQgKDAsMCk/XG5leHBvcnQgY29uc3QgdGhyb3VnaE9yaWdpbiA9IChwMSwgcDIpID0+IHtcbiAgaWYocDEueCA9PT0gMCAmJiBwMi54ID09PSAwKXtcbiAgICAvL3ZlcnRpY2FsIGxpbmUgdGhyb3VnaCBjZW50cmVcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBsZXQgdGVzdCA9ICgtcDEueCpwMi55ICsgcDEueCpwMS55KS8ocDIueC1wMS54KSArIHAxLnk7XG4gIGlmKHRlc3QgPT09IDApIHJldHVybiB0cnVlO1xuICBlbHNlIHJldHVybiBmYWxzZTtcbn1cblxuLy9maW5kIHRoZSBjZW50cm9pZCBvZiBhIG5vbi1zZWxmLWludGVyc2VjdGluZyBwb2x5Z29uXG5leHBvcnQgY29uc3QgY2VudHJvaWRPZlBvbHlnb24gPSAocG9pbnRzKSA9PiB7XG4gIGxldCBmaXJzdCA9IHBvaW50c1swXSwgbGFzdCA9IHBvaW50c1twb2ludHMubGVuZ3RoLTFdO1xuICBpZiAoZmlyc3QueCAhPSBsYXN0LnggfHwgZmlyc3QueSAhPSBsYXN0LnkpIHBvaW50cy5wdXNoKGZpcnN0KTtcbiAgbGV0IHR3aWNlYXJlYT0wLFxuICAgIHg9MCwgeT0wLFxuICAgIG5QdHMgPSBwb2ludHMubGVuZ3RoLFxuICAgIHAxLCBwMiwgZjtcbiAgZm9yICggdmFyIGk9MCwgaj1uUHRzLTEgOyBpPG5QdHMgOyBqPWkrKyApIHtcbiAgICBwMSA9IHBvaW50c1tpXTsgcDIgPSBwb2ludHNbal07XG4gICAgZiA9IHAxLngqcDIueSAtIHAyLngqcDEueTtcbiAgICB0d2ljZWFyZWEgKz0gZjtcbiAgICB4ICs9ICggcDEueCArIHAyLnggKSAqIGY7XG4gICAgeSArPSAoIHAxLnkgKyBwMi55ICkgKiBmO1xuICB9XG4gIGYgPSB0d2ljZWFyZWEgKiAzO1xuICByZXR1cm4geyB4OngvZiwgeTp5L2YgfTtcbn1cblxuLy9jb21wYXJlIHR3byBwb2ludHMgdGFraW5nIHJvdW5kaW5nIGVycm9ycyBpbnRvIGFjY291bnRcbmV4cG9ydCBjb25zdCBjb21wYXJlUG9pbnRzID0gKHAxLCBwMikgPT4ge1xuICBpZih0eXBlb2YgcDEgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBwMiA9PT0gJ3VuZGVmaW5lZCcpe1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHAxID0gcG9pbnRUb0ZpeGVkKHAxLCA2KTtcbiAgcDIgPSBwb2ludFRvRml4ZWQocDIsIDYpO1xuICBpZihwMS54ID09PSBwMi54ICYmIHAxLnkgPT09IHAyLnkpIHJldHVybiB0cnVlO1xuICBlbHNlIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGNvbnN0IHBvaW50VG9GaXhlZCA9IChwLCBwbGFjZXMpID0+IHtcbiAgcmV0dXJuIHtcbiAgICB4OiBwLngudG9GaXhlZChwbGFjZXMpLFxuICAgIHk6IHAueS50b0ZpeGVkKHBsYWNlcylcbiAgfTtcbn1cblxuLypcbi8vZmxpcCBhIHNldCBvZiBwb2ludHMgb3ZlciBhIGh5cGVyb2JsaWMgbGluZSBkZWZpbmVkIGJ5IHR3byBwb2ludHNcbmV4cG9ydCBjb25zdCB0cmFuc2Zvcm0gPSAocG9pbnRzQXJyYXksIHAxLCBwMikgPT4ge1xuICBsZXQgbmV3UG9pbnRzQXJyYXkgPSBbXTtcbiAgbGV0IGMgPSBFLmdyZWF0Q2lyY2xlKHAxLCBwMiwgZGlzay5yYWRpdXMsIGRpc2suY2VudHJlKTtcblxuICBmb3IobGV0IHAgb2YgcG9pbnRzQXJyYXkpe1xuICAgIGxldCBuZXdQID0gRS5pbnZlcnNlKHAsIGMucmFkaXVzLCBjLmNlbnRyZSk7XG4gICAgbmV3UG9pbnRzQXJyYXkucHVzaChuZXdQKTtcbiAgfVxuICByZXR1cm4gbmV3UG9pbnRzQXJyYXk7XG59XG4qL1xuIiwiaW1wb3J0IHsgUmVndWxhclRlc3NlbGF0aW9uIH0gZnJvbSAnLi9yZWd1bGFyVGVzc2VsYXRpb24nO1xuXG4vLyAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyAqXG4vLyAqICAgU0VUVVBcbi8vICpcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuY29uc3QgdGVzc2VsYXRpb24gPSBuZXcgUmVndWxhclRlc3NlbGF0aW9uKDUsIDQsIDMqTWF0aC5QSS82KjAsICdyZWQnKTtcbiIsImltcG9ydCAqIGFzIEUgZnJvbSAnLi9ldWNsaWQnO1xuaW1wb3J0IHsgRGlzayB9IGZyb20gJy4vZGlzayc7XG4vLyAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyAqICAgIFRFU1NFTEFUSU9OIENMQVNTXG4vLyAqICAgIENyZWF0ZXMgYSByZWd1bGFyIFRlc3NlbGF0aW9uIG9mIHRoZSBQb2luY2FyZSBEaXNrXG4vLyAqICAgIHE6IG51bWJlciBvZiBwLWdvbnMgbWVldGluZyBhdCBlYWNoIHZlcnRleFxuLy8gKiAgICBwOiBudW1iZXIgb2Ygc2lkZXMgb2YgcC1nb25cbi8vICogICAgdXNpbmcgdGhlIHRlY2huaXF1ZXMgY3JlYXRlZCBieSBDb3hldGVyIGFuZCBEdW5oYW1cbi8vICpcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbmV4cG9ydCBjbGFzcyBSZWd1bGFyVGVzc2VsYXRpb24gZXh0ZW5kcyBEaXNrIHtcbiAgY29uc3RydWN0b3IocCwgcSwgcm90YXRpb24sIGNvbG91ciwgZHJhd0NsYXNzKSB7XG4gICAgc3VwZXIoZHJhd0NsYXNzKTtcbiAgICB0aGlzLnAgPSBwO1xuICAgIHRoaXMucSA9IHE7XG4gICAgdGhpcy5taW5FeHAgPSBwLTM7XG4gICAgdGhpcy5tYXhFeHAgPSBwLTI7XG4gICAgdGhpcy5jb2xvdXIgPSBjb2xvdXIgfHwgJ2JsYWNrJztcbiAgICB0aGlzLnJvdGF0aW9uID0gcm90YXRpb24gfHwgMDtcblxuICAgIGlmKHRoaXMuY2hlY2tQYXJhbXMoKSl7IHJldHVybiBmYWxzZTt9XG5cbiAgICB0aGlzLnEgPSBxO1xuICAgIHRoaXMubWF4TGF5ZXJzID0gMztcbiAgICB0aGlzLmxpbWl0ID0gMTAwMDA7XG5cbiAgICAvL2FycmF5IG9mIGFsbCBsaW5lcyB0aGF0IGhhdmUgYmVlbiByZWZsZWN0ZWQgb3ZlclxuICAgIHRoaXMucmVmbGVjdGVkTGluZXMgPSBbXTtcblxuICAgIC8vYXJyYXkgb2YgY2VudHJvaWRzIGZvciBhbGwgcG9seWdvbnMgZHJhd24gc28gZmFyXG4gICAgdGhpcy5wb2x5Z29uQ2VudHJvaWRzID0gW107XG5cbiAgICB0aGlzLnRlc3NlbGF0aW9uKCk7XG4gIH1cblxuICB0ZXNzZWxhdGlvbigpe1xuICAgIGNvbnN0IHZlcnRpY2VzID0gdGhpcy5mdW5kYW1lbnRhbFBvbHlnb24oKTtcbiAgICB0aGlzLnBvbHlnb24odmVydGljZXMsIHRoaXMuY29sb3VyKTtcblxuICAgIGxldCBwID0gRS5jZW50cm9pZE9mUG9seWdvbih2ZXJ0aWNlcyk7XG4gICAgcCA9IEUucG9pbnRUb0ZpeGVkKHAsIDYpO1xuICAgIHRoaXMucG9seWdvbkNlbnRyb2lkcy5wdXNoKHApO1xuXG4gICAgdGhpcy5yZWN1cnNpdmVQb2x5R2VuKHZlcnRpY2VzLCB7eDogMCwgeTogMH0sIHt4OiAwLCB5OiAwfSwgMik7XG4gIH1cblxuICAvL3JlY3Vyc2l2ZWx5IHJlZmxlY3QgZWFjaCBwb2x5Z29uIG92ZXIgZWFjaCBlZGdlLCBkcmF3IHRoZSBuZXcgcG9seWdvbnNcbiAgLy9hbmQgcmVwZWF0IGZvciBlYWNoIG9mIHRoZWlyIGVkZ2VzXG4gIC8vVE9ETyBtYWtlIHN1cmUgbm8gbGluZSBpcyBkcmF3biBtb3JlIHRoYW4gb25jZVxuICByZWN1cnNpdmVQb2x5R2VuKHZlcnRpY2VzLCBwcmV2UDEsIHByZXZQMiwgbGF5ZXIpe1xuICAgIC8vVEVTVElOR1xuICAgIGlmKHRoaXMubGltaXQgPD0gMCl7IHJldHVybiA7fVxuICAgIHRoaXMubGltaXQgLS07XG5cbiAgICAvL2NvbnNvbGUubG9nKCdMYXllcjogJywgbGF5ZXIpO1xuICAgIC8vaWYobGF5ZXIgPiB0aGlzLm1heExheWVycyl7IHJldHVybjsgfVxuXG4gICAgY29uc3QgbCA9IHZlcnRpY2VzLmxlbmd0aDtcblxuXG5cbiAgICBmb3IobGV0IGkgPSAwOyBpIDwgbDsgaSsrKXtcbiAgICAgIGxldCBwMSA9IHZlcnRpY2VzW2ldO1xuICAgICAgbGV0IHAyID0gdmVydGljZXNbKGkgKyAxKSVsXTtcbiAgICAgIC8vZG9uJ3QgcmVmbGVjdCBiYWNrIG92ZXIgdGhlIGxpbmUgd2UndmUganVzdCByZWZsZWN0ZWQgYWNyb3NzIGFzIHRoaXNcbiAgICAgIC8vY2F1c2VzIGEgbG9vcFxuICAgICAgaWYoIUUuY29tcGFyZVBvaW50cyhwMSwgcHJldlAxKSAmJiAhRS5jb21wYXJlUG9pbnRzKHAyLCBwcmV2UDIpKXtcbiAgICAgIC8vaWYoIXRoaXMucG9seWdvbkV4aXN0cyh2ZXJ0aWNlcykgKXsvLyYmICF0aGlzLmFscmVhZHlSZWZsZWN0ZWQocDEsIHAyKSl7XG4gICAgICAgIGxldCBuZXdWZXJ0aWNlcyA9IHRoaXMucmVmbGVjdFBvbHlnb24odmVydGljZXMsIHAxLCBwMik7XG4gICAgICAgIHRoaXMucG9seWdvbihuZXdWZXJ0aWNlcywgdGhpcy5jb2xvdXIpO1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5yZWN1cnNpdmVQb2x5R2VuKG5ld1ZlcnRpY2VzLCBwMSwgcDIsIGxheWVyKyspO1xuICAgICAgICB9LCA1MDApO1xuICAgICAgfVxuICAgICAgLy99XG4gICAgfVxuICB9XG5cbiAgLy9jaGVjayBpZiB0aGUgcG9seWdvbiBoYXMgYWxyZWFkeSBiZWVuIGRyYXduXG4gIHBvbHlnb25FeGlzdHModmVydGljZXMpe1xuICAgIGxldCBwID0gRS5jZW50cm9pZE9mUG9seWdvbih2ZXJ0aWNlcyk7XG4gICAgcCA9IEUucG9pbnRUb0ZpeGVkKHAsIDYpO1xuXG5cbiAgICBsZXQgaSA9ICAkLmluQXJyYXkocC54LCB0aGlzLnBvbHlnb25DZW50cm9pZHMpO1xuICAgIC8vY2FzZSAxLCBjZW50cm9pZCBpcyBub3QgaW4gYXJyYXlcbiAgICBpZihpID09PSAtMSl7XG4gICAgICB0aGlzLnBvbHlnb25DZW50cm9pZHMucHVzaChwLngsIHAueSk7XG4gICAgICBkcmF3UG9pbnQocCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vY2FzZSAyOiBjZW50cm9pZCBpcyBub3QgaW4gYXJyYXlcbiAgICBlbHNlIGlmKHRoaXMucG9seWdvbkNlbnRyb2lkc1tpKzFdICE9PSBwLnkpe1xuICAgICAgdGhpcy5wb2x5Z29uQ2VudHJvaWRzLnB1c2gocC54LCBwLnkpO1xuICAgICAgZHJhd1BvaW50KHApO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvL2Nhc2UgMzogY2VudHJvaWQgaXMgaW4gYXJyYXlcbiAgICBlbHNle1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgLy9jaGVjayBpZiBhIHBhcnRpY3VsYXIgbGluZSBoYXMgYWxyZWFkeSBiZWVuIHRvIGRvIGEgcmVmbGVjdGlvbiBhbmQgaWYgbm90XG4gIC8vYWRkIHRoZSBjdXJyZW50IGxpbmUgdG8gdGhlIGFycmF5XG4gIGFscmVhZHlSZWZsZWN0ZWQocDEsIHAyKXtcbiAgICBsZXQgeDEgPSBwMS54LnRvRml4ZWQoNik7XG4gICAgbGV0IHkxID0gcDEueS50b0ZpeGVkKDYpO1xuICAgIGxldCB4MiA9IHAyLngudG9GaXhlZCg2KTtcbiAgICBsZXQgeTIgPSBwMi55LnRvRml4ZWQoNik7XG5cbiAgICBsZXQgaSA9ICAkLmluQXJyYXkoeDEsIHRoaXMucmVmbGVjdGVkTGluZXMpO1xuICAgIC8vY2FzZTE6IGZpcnN0IHBvaW50IG5vdCBpbiBhcnJheSwgbGluZSBoYXMgbm90IGJlZW4gdXNlZCB0byByZWZsZWN0XG4gICAgaWYoaSA9PT0gLTEpe1xuICAgICAgdGhpcy5yZWZsZWN0ZWRMaW5lcy5wdXNoKHgxKTtcbiAgICAgIHRoaXMucmVmbGVjdGVkTGluZXMucHVzaCh5MSk7XG4gICAgICB0aGlzLnJlZmxlY3RlZExpbmVzLnB1c2goeDIpO1xuICAgICAgdGhpcy5yZWZsZWN0ZWRMaW5lcy5wdXNoKHkyKTtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICAvL2Nhc2UgMjogZmlyc3QgcG9pbnQgaXMgaW4gYXJyYXlcbiAgICBlbHNlIGlmKHRoaXMucmVmbGVjdGVkTGluZXNbaSArMV0gPT09IHkxKXtcbiAgICAgIC8vY2FzZSAyYTogc2Vjb25kIHBvaW50IGlzIGluIHRoZSBhcnJheSBhZGphY2VudCB0byBmaXJzdCBwb2ludDtcbiAgICAgIC8vID0+IGxpbmVzIGhhcyBhbHJhZWR5IGJlZW4gdXNlZFxuICAgICAgbGV0IGEgPSAodGhpcy5yZWZsZWN0ZWRMaW5lc1tpKzJdID09PSB4MiAmJiB0aGlzLnJlZmxlY3RlZExpbmVzW2krM10gPT09IHkyKTtcbiAgICAgIGxldCBiID0gKHRoaXMucmVmbGVjdGVkTGluZXNbaS0yXSA9PT0geDIgJiYgdGhpcy5yZWZsZWN0ZWRMaW5lc1tpLTFdID09PSB5Mik7XG4gICAgICBpZihhIHx8IGIpe1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIC8vY2FzZSAyYjogMXN0IHBvaW50IHdhcyBpbiBhcnJheSBidXQgYXMgcGFydCBvZiBkaWZmZXJlbnQgbGluZVxuICAgICAgZWxzZXtcbiAgICAgICAgdGhpcy5yZWZsZWN0ZWRMaW5lcy5wdXNoKHgxKTtcbiAgICAgICAgdGhpcy5yZWZsZWN0ZWRMaW5lcy5wdXNoKHkxKTtcbiAgICAgICAgdGhpcy5yZWZsZWN0ZWRMaW5lcy5wdXNoKHgyKTtcbiAgICAgICAgdGhpcy5yZWZsZWN0ZWRMaW5lcy5wdXNoKHkyKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy9yb3RhdGUgdGhlIGZpcnN0IHBvaW50cyBhcm91bmQgdGhlIGRpc2sgdG8gZ2VuZXJhdGUgdGhlIGZ1bmRhbWVudGFsIHBvbHlnb25cbiAgLy9UT0RPOiB1c2UgRHVuaGFtJ3MgbWV0aG9kIG9mIHJlZmxlY3RpbmcgYSBmdW5kYW1lbnRhbCB0cmlhbmdsZSB3aGljaCB3aWxsXG4gIC8vY29udGFpbiBhIG1vdGlmIGV2ZW50dWFsbHlcbiAgZnVuZGFtZW50YWxQb2x5Z29uKCl7XG4gICAgY29uc3QgcCA9IHRoaXMuZmlyc3RQb2ludCgpO1xuICAgIGxldCBhbHBoYSA9IDIqTWF0aC5QSS90aGlzLnA7XG4gICAgY29uc3QgdmVydGljZXMgPSBbcF07XG5cbiAgICBmb3IobGV0IGkgPSAxOyBpIDwgdGhpcy5wOyBpKyspe1xuICAgICAgLy9yb3RhdGUgYXJvdW5kIHRoZSBkaXNrIGJ5IGFscGhhIHJhZGlhbnMgZm9yIG5leHQgcG9pbnRzXG4gICAgICBsZXQgcSA9IHtcbiAgICAgICAgeDogTWF0aC5jb3MoYWxwaGEqaSkqcC54ICsgTWF0aC5zaW4oYWxwaGEqaSkqcC55LFxuICAgICAgICB5OiAtTWF0aC5zaW4oYWxwaGEqaSkqcC54ICsgTWF0aC5jb3MoYWxwaGEqaSkqcC55XG4gICAgICB9XG5cbiAgICAgIHZlcnRpY2VzLnB1c2gocSk7XG4gICAgfVxuICAgIHJldHVybiB2ZXJ0aWNlcztcbiAgfVxuXG4gIC8vY2FsY3VsYXRlIGZpcnN0IHBvaW50IG9mIGZ1bmRhbWVudGFsIHBvbHlnb24gdXNpbmcgQ294ZXRlcidzIG1ldGhvZFxuICBmaXJzdFBvaW50KCl7XG4gICAgY29uc3QgcyA9IE1hdGguc2luKE1hdGguUEkvdGhpcy5wKTtcbiAgICBjb25zdCB0ID0gTWF0aC5jb3MoTWF0aC5QSS90aGlzLnEpO1xuICAgIC8vbXVsdGlwbHkgdGhlc2UgYnkgdGhlIGRpc2tzIHJhZGl1cyAoQ294ZXRlciB1c2VkIHVuaXQgZGlzayk7XG4gICAgY29uc3QgciA9IDEvTWF0aC5zcXJ0KCh0KnQpLyhzKnMpIC0xKSp0aGlzLnJhZGl1cztcbiAgICBjb25zdCBkID0gMS9NYXRoLnNxcnQoMS0gKHMqcykvKHQqdCkpKnRoaXMucmFkaXVzO1xuICAgIGNvbnN0IGIgPSB7XG4gICAgICB4OiB0aGlzLnJhZGl1cypNYXRoLmNvcyhNYXRoLlBJL3RoaXMucCksXG4gICAgICB5OiAtdGhpcy5yYWRpdXMqTWF0aC5zaW4oTWF0aC5QSS90aGlzLnApXG4gICAgfVxuXG4gICAgY29uc3QgY2VudHJlID0ge3g6IGQsIHk6IDB9O1xuXG4gICAgLy90aGVyZSB3aWxsIGJlIHR3byBwb2ludHMgb2YgaW50ZXJzZWN0aW9uLCBvZiB3aGljaCB3ZSB3YW50IHRoZSBmaXJzdFxuICAgIGxldCBwID0gRS5jaXJjbGVMaW5lSW50ZXJzZWN0KGNlbnRyZSwgciwgdGhpcy5jZW50cmUsIGIpLnAxO1xuXG4gICAgLy9hcHBseSB0aGUgcm90YXRpb25cbiAgICBwID0ge1xuICAgICAgeDogTWF0aC5jb3ModGhpcy5yb3RhdGlvbikqcC54IC0gTWF0aC5zaW4odGhpcy5yb3RhdGlvbikqcC55LFxuICAgICAgeTogTWF0aC5zaW4odGhpcy5yb3RhdGlvbikqcC54ICsgTWF0aC5jb3ModGhpcy5yb3RhdGlvbikqcC55XG4gICAgfVxuXG4gICAgcmV0dXJuIHA7XG4gIH1cblxuICAvL3JlZmxlY3QgdGhlIHBvbHlnb24gZGVmaW5lZCBieSB2ZXJ0aWNlcyBhY3Jvc3MgdGhlIGxpbmUgcDEsIHAyXG4gIHJlZmxlY3RQb2x5Z29uKHZlcnRpY2VzLCBwMSwgcDIpe1xuICAgIGNvbnN0IGwgPSB2ZXJ0aWNlcy5sZW5ndGg7XG4gICAgY29uc3QgbmV3VmVydGljZXMgPSBbXTtcbiAgICBjb25zdCBjID0gRS5ncmVhdENpcmNsZShwMSwgcDIsIHRoaXMucmFkaXVzLCB0aGlzLmNlbnRyZSk7XG4gICAgZm9yKGxldCBpID0gMDsgaTwgbDsgaSsrKXtcbiAgICAgIGxldCBwID0gRS5pbnZlcnNlKHZlcnRpY2VzW2ldLCBjLnJhZGl1cywgYy5jZW50cmUpO1xuICAgICAgbmV3VmVydGljZXMucHVzaChwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3VmVydGljZXM7XG4gIH1cblxuICAvL1RoZSB0ZXNzZWxhdGlvbiByZXF1aXJlcyB0aGF0IChwLTIpKHEtMikgPiA0IHRvIHdvcmsgKG90aGVyd2lzZSBpdCBpc1xuICAvLyBlaXRoZXIgYW4gZWxsaXB0aWNhbCBvciBldWNsaWRlYW4gdGVzc2VsYXRpb24pO1xuICBjaGVja1BhcmFtcygpe1xuICAgIGlmKCh0aGlzLnAgLTIpKih0aGlzLnEtMikgPD0gNCl7XG4gICAgICBjb25zb2xlLmVycm9yKCdIeXBlcmJvbGljIHRlc3NlbGF0aW9ucyByZXF1aXJlIHRoYXQgKHAtMSkocS0yKSA8IDQhJyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZSBpZih0aGlzLnEgPCAzKXtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1Rlc3NlbGF0aW9uIGVycm9yOiBhdCBsZWFzdCAzIHAtZ29ucyBtdXN0IG1lZXQgXFxcbiAgICAgICAgICAgICAgICAgICAgYXQgZWFjaCB2ZXJ0ZXghJyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZSBpZih0aGlzLnAgPCAzKXtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1Rlc3NlbGF0aW9uIGVycm9yOiBwb2x5Z29uIG5lZWRzIGF0IGxlYXN0IDMgc2lkZXMhJyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZSB7IHJldHVybiBmYWxzZTsgfVxuICB9XG59XG4iXX0=
