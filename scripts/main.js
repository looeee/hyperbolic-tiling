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
    key: 'drawSegment',
    value: function drawSegment(c, alpha, alphaOffset, colour, width) {
      ctx.beginPath();
      ctx.arc(c.centre.x, c.centre.y, c.radius, alphaOffset, alpha + alphaOffset);
      ctx.strokeStyle = colour || 'black';
      ctx.lineWidth = width || 1;
      ctx.stroke();
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
    key: 'drawPoint',
    value: function drawPoint(point, radius, colour) {
      var col = colour || 'black';
      var r = radius || 2;
      this.ctx.beginPath();
      this.ctx.arc(point.x, point.y, r, 0, Math.PI * 2, true);
      this.ctx.fillStyle = col;
      this.ctx.fill();
    }

    //draw a circle of radius r centre c and optional colour

  }, {
    key: 'drawCircle',
    value: function drawCircle(c, r, colour, width) {
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

},{}],3:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // * ***********************************************************************
// *
// *   PRE-SETUP
// *
// *************************************************************************

// * ***********************************************************************
// *
// *   CONSTANTS
// *   define any global constants here
// *
// *************************************************************************

// * ***********************************************************************
// *
// *   IMPORTS
// *
// *************************************************************************

var _euclid = require('./euclid');

var E = _interopRequireWildcard(_euclid);

var _canvas = require('./canvas');

var C = _interopRequireWildcard(_canvas);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// * ***********************************************************************
// *
// *   HELPER FUNCTIONS
// *   define any global helper functions here
// *
// *************************************************************************

//compare two points taking rounding errors into account
var comparePoints = function comparePoints(p1, p2) {
  if (typeof p1 === 'undefined' || typeof p2 === 'undefined') {
    return true;
  }
  p1 = pointToFixed(p1, 6);
  p2 = pointToFixed(p2, 6);
  if (p1.x === p2.x && p1.y === p2.y) return true;else return false;
};

var pointToFixed = function pointToFixed(p, places) {
  return {
    x: p.x.toFixed(places),
    y: p.y.toFixed(places)
  };
};

//flip a set of points over a hyperoblic line defined by two points
var transform = function transform(pointsArray, p1, p2) {
  var newPointsArray = [];
  var c = E.greatCircle(p1, p2, disk.radius, disk.centre);

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = pointsArray[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var p = _step.value;

      var newP = E.inverse(p, c.radius, c.centre);
      newPointsArray.push(newP);
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

  return newPointsArray;
};

// * ***********************************************************************
// *
// *   DOCUMENT READY
// *
// *************************************************************************
$(document).ready(function () {
  var c = new C.Canvas();
  // * ***********************************************************************
  // *
  // *   DISK CLASS
  // *   Poincare Disk representation of the hyperbolic plane
  // *
  // *************************************************************************

  var Disk = function () {
    function Disk() {
      _classCallCheck(this, Disk);

      this.x = window.innerWidth / 2;
      this.y = window.innerHeight / 2;

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
        drawCircle({ x: this.centre.x, y: this.centre.y }, this.radius);
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
          euclideanLine(points.p1, points.p2, col);
        } else {
          c = E.greatCircle(p1, p2, this.radius, this.centre);
          points = circleIntersect(this.centre, c.centre, this.radius, c.radius);

          //angle subtended by the arc
          var alpha = E.centralAngle(points.p1, points.p2, c.radius);

          var offset = this.alphaOffset(points.p2, points.p2, c, 'line');
          c.drawSegment(c, alpha, offset, col);
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
          euclideanLine(p1, p2, colour);
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
        c.drawSegment(c, alpha, offset, colour);
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

  var disk = new Disk();

  // * ***********************************************************************
  // *    TESSELATION CLASS
  // *    Creates a regular Tesselation of the Poincare Disk
  // *    q: number of p-gons meeting at each vertex
  // *    p: number of sides of p-gon
  // *    using the techniques created by Coxeter and Dunham
  // *
  // *************************************************************************

  var Tesselation = function () {
    function Tesselation(disk, p, q, rotation, colour) {
      _classCallCheck(this, Tesselation);

      this.disk = disk;
      this.p = p;
      this.q = q;
      this.minExp = p - 3;
      this.maxExp = p - 2;
      this.colour = colour || 'black';
      this.rotation = rotation || 0;

      if (this.checkParams()) {
        return false;
      }

      this.q = q;
      this.maxLayers = 3;
      this.limit = 10000;

      //array of all lines that have been reflected over
      this.reflectedLines = [];

      //array of centroids for all polygons drawn so far
      this.polygonCentroids = [];

      this.tesselation();
    }

    _createClass(Tesselation, [{
      key: 'tesselation',
      value: function tesselation() {
        var vertices = this.fundamentalPolygon();
        this.disk.polygon(vertices, this.colour);

        var p = E.centroidOfPolygon(vertices);
        p = pointToFixed(p, 6);
        this.polygonCentroids.push(p);

        this.recursivePolyGen(vertices, { x: 0, y: 0 }, { x: 0, y: 0 }, 2);
      }

      //recursively reflect each polygon over each edge, draw the new polygons
      //and repeat for each of their edges
      //TODO make sure no line is drawn more than once

    }, {
      key: 'recursivePolyGen',
      value: function recursivePolyGen(vertices, prevP1, prevP2, layer) {
        var _this = this;

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
          if (!comparePoints(p1, prevP1) && !comparePoints(p2, prevP2)) {
            (function () {
              //if(!this.polygonExists(vertices) ){//&& !this.alreadyReflected(p1, p2)){
              var newVertices = _this.reflectPolygon(vertices, p1, p2);
              _this.disk.polygon(newVertices, _this.colour);
              window.setTimeout(function () {
                _this.recursivePolyGen(newVertices, p1, p2, layer++);
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
        p = pointToFixed(p, 6);

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
        var r = 1 / Math.sqrt(t * t / (s * s) - 1) * this.disk.radius;
        var d = 1 / Math.sqrt(1 - s * s / (t * t)) * this.disk.radius;
        var b = {
          x: this.disk.radius * Math.cos(Math.PI / this.p),
          y: -this.disk.radius * Math.sin(Math.PI / this.p)
        };

        var centre = { x: d, y: 0 };

        //there will be two points of intersection, of which we want the first
        var p = E.circleLineIntersect(centre, r, this.disk.centre, b).p1;

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
        var c = E.greatCircle(p1, p2, this.disk.radius, this.disk.centre);
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

    return Tesselation;
  }();

  var tesselation = new Tesselation(disk, 5, 4, 3 * Math.PI / 6 * 0, 'red');
});

},{"./canvas":1,"./euclid":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJlczIwMTUvY2FudmFzLmpzIiwiZXMyMDE1L2V1Y2xpZC5qcyIsImVzMjAxNS9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7OztJQ0tNLE1BQU07QUFDVixXQURJLE1BQU0sR0FDRzswQkFEVCxNQUFNOztBQUVSLFFBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQyxRQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUV4QyxRQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO0FBQ3RDLFFBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxXQUFXOzs7QUFBQyxBQUd4QyxRQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxDQUFDO0dBRW5FOzs7QUFBQTtlQVhHLE1BQU07O2dDQWVFLENBQUMsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUM7QUFDL0MsU0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2hCLFNBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxXQUFXLEVBQUUsS0FBSyxHQUFHLFdBQVcsQ0FBQyxDQUFDO0FBQzVFLFNBQUcsQ0FBQyxXQUFXLEdBQUcsTUFBTSxJQUFJLE9BQU8sQ0FBQztBQUNwQyxTQUFHLENBQUMsU0FBUyxHQUFHLEtBQUssSUFBSSxDQUFDLENBQUM7QUFD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QUFBLElBQUssSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUEsQUFBQyxJQUFJLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFBLEFBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFBLEFBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFcEcsTUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksQ0FBQyxHQUFHLEFBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLElBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFBLEFBQUMsSUFBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7QUFDakYsTUFBSSxFQUFFLEdBQUcsUUFBUSxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7QUFDdEQsTUFBSSxFQUFFLEdBQUcsUUFBUSxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7O0FBRXRELE1BQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxHQUFJLENBQUMsR0FBRyxBQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxJQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQSxBQUFDLElBQUssQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUEsQUFBQyxDQUFDO0FBQ2pGLE1BQUksRUFBRSxHQUFHLFFBQVEsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUEsQUFBQyxDQUFDO0FBQ3RELE1BQUksRUFBRSxHQUFHLFFBQVEsR0FBRyxDQUFDLEdBQUcsR0FB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QUFFLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBQzs7O0FBQUMsQUFHcEQsWUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDdEIsWUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7O0FBRXRCLFlBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUM7QUFDeEIsY0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFDLENBQUMsS0FDOUMsSUFBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFDLENBQUM7U0FDekQ7O0FBRUQsWUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QyxjQUFNLEdBQUcsQUFBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFJLENBQUMsR0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDM0QsWUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QyxjQUFNLEdBQUcsQUFBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFJLENBQUMsR0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLE1BQU0sR0FBRyxNQUFNOzs7QUFBQyxB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SUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQzVCLFlBQUksS0FBSyxHQUFHLENBQUMsR0FBQyxJQUFJLENBQUMsRUFBRSxHQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDN0IsWUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFckIsYUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUM7O0FBRTdCLGNBQUksQ0FBQyxHQUFHO0FBQ04sYUFBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFDLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEQsYUFBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUMsQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBQyxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQztXQUNsRCxDQUFBOztBQUVELGtCQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2xCO0FBQ0QsZUFBTyxRQUFRLENBQUM7T0FDakI7Ozs7OzttQ0FHVztBQUNWLFlBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkMsWUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7O0FBQUMsQUFFbkMsWUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQUFBQyxDQUFDLEdBQUMsQ0FBQyxJQUFHLENBQUMsR0FBQyxDQUFDLENBQUEsQUFBQyxHQUFFLENBQUMsQ0FBQyxHQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQ3ZELFlBQU0sQ0FBQyxHQUFHLENBQUMsR0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRSxBQUFDLENBQUMsR0FBQyxDQUFDLElBQUcsQ0FBQyxHQUFDLENBQUMsQ0FBQSxBQUFDLENBQUMsR0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUN2RCxZQUFNLENBQUMsR0FBRztBQUNSLFdBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUM1QyxXQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztTQUM5QyxDQUFBOztBQUVELFlBQU0sTUFBTSxHQUFHLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDOzs7QUFBQyxBQUc1QixZQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsbUJBQW1CLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFOzs7QUFBQyxBQUdqRSxTQUFDLEdBQUc7QUFDRixXQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1RCxXQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQztTQUM3RCxDQUFBOztBQUVELGVBQU8sQ0FBQyxDQUFDO09BQ1Y7Ozs7OztxQ0FHYyxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBQztBQUM5QixZQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO0FBQzFCLFlBQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQztBQUN2QixZQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNwRSxhQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFDO0FBQ3ZCLGNBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ25ELHFCQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3JCOztBQUVELGVBQU8sV0FBVyxDQUFDO09BQ3BCOzs7Ozs7O29DQUlZO0FBQ1gsWUFBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUUsQ0FBQyxDQUFBLElBQUcsSUFBSSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUEsQUFBQyxJQUFJLENBQUMsRUFBQztBQUM3QixpQkFBTyxDQUFDLEtBQUssQ0FBQyxzREFBc0QsQ0FBQyxDQUFDO0FBQ3RFLGlCQUFPLElBQUksQ0FBQztTQUNiLE1BQ0ksSUFBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBQztBQUNqQixpQkFBTyxDQUFDLEtBQUssQ0FBQztzQ0FDZ0IsQ0FBQyxDQUFDO0FBQ2hDLGlCQUFPLElBQUksQ0FBQztTQUNiLE1BQ0ksSUFBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBQztBQUNqQixpQkFBTyxDQUFDLEtBQUssQ0FBQyxvREFBb0QsQ0FBQyxDQUFDO0FBQ3BFLGlCQUFPLElBQUksQ0FBQztTQUNiLE1BQ0k7QUFBRSxpQkFBTyxLQUFLLENBQUM7U0FBRTtPQUN2Qjs7O1dBL01HLFdBQVc7OztBQWtOakIsTUFBTSxXQUFXLEdBQUcsSUFBSSxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFDLElBQUksQ0FBQyxFQUFFLEdBQUMsQ0FBQyxHQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztDQUV2RSxDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gKlxuLy8gKiAgQ0FOVkFTIFVUSUxJVFkgRlVOQ1RJT05TXG4vLyAqXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5jbGFzcyBDYW52YXN7XG4gIGNvbnN0cnVjdG9yKCl7XG4gICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdjYW52YXMnKTtcbiAgICB0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICB0aGlzLmNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuICAgIC8vdHJhbnNmb3JtIHRoZSBjYW52YXMgc28gdGhlIG9yaWdpbiBpcyBhdCB0aGUgY2VudHJlIG9mIHRoZSBkaXNrXG4gICAgdGhpcy5jdHgudHJhbnNsYXRlKHdpbmRvdy5pbm5lcldpZHRoIC8gMiwgd2luZG93LmlubmVySGVpZ2h0IC8gMik7XG5cbiAgfVxuXG5cbiAgLy9kcmF3IGEgaHlwZXJib2xpYyBsaW5lIHNlZ21lbnQgdXNpbmcgY2FsY3VsYXRpb25zIGZyb20gbGluZSgpIG9yIGFyYygpXG4gIGRyYXdTZWdtZW50KGMsIGFscGhhLCBhbHBoYU9mZnNldCwgY29sb3VyLCB3aWR0aCl7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5hcmMoYy5jZW50cmUueCwgYy5jZW50cmUueSwgYy5yYWRpdXMsIGFscGhhT2Zmc2V0LCBhbHBoYSArIGFscGhhT2Zmc2V0KTtcbiAgICBjdHguc3Ryb2tlU3R5bGUgPSBjb2xvdXIgfHwgJ2JsYWNrJztcbiAgICBjdHgubGluZVdpZHRoID0gd2lkdGggfHwgMTtcbiAgICBjdHguc3Ryb2tlKCk7XG4gIH1cblxuICAvL2RyYXcgYSAoZXVjbGlkZWFuKSBsaW5lIGJldHdlZW4gdHdvIHBvaW50c1xuICBldWNsaWRlYW5MaW5lKHAxLCBwMiwgY29sb3VyLCB3aWR0aCl7XG4gICAgY29uc3QgYyA9IGNvbG91ciB8fCAnYmxhY2snO1xuICAgIHRoaXMuY3R4LmJlZ2luUGF0aCgpO1xuICAgIHRoaXMuY3R4Lm1vdmVUbyhwMS54LCBwMS55KTtcbiAgICB0aGlzLmN0eC5saW5lVG8ocDIueCwgcDIueSk7XG4gICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSBjO1xuICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IHdpZHRoIHx8IDE7XG4gICAgdGhpcy5jdHguc3Ryb2tlKClcbiAgfVxuXG4gIC8vZHJhdyBhIHBvaW50IG9uIHRoZSBkaXNrLCBvcHRpb25hbCByYWRpdXMgYW5kIGNvbG91clxuICBkcmF3UG9pbnQocG9pbnQsIHJhZGl1cywgY29sb3VyKXtcbiAgICBjb25zdCBjb2wgPSBjb2xvdXIgfHwgJ2JsYWNrJztcbiAgICBjb25zdCByID0gcmFkaXVzIHx8IDI7XG4gICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgdGhpcy5jdHguYXJjKHBvaW50LngsIHBvaW50LnksIHIsIDAsIE1hdGguUEkgKiAyLCB0cnVlKTtcbiAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBjb2w7XG4gICAgdGhpcy5jdHguZmlsbCgpO1xuICB9XG5cbiAgLy9kcmF3IGEgY2lyY2xlIG9mIHJhZGl1cyByIGNlbnRyZSBjIGFuZCBvcHRpb25hbCBjb2xvdXJcbiAgZHJhd0NpcmNsZShjLCByLCBjb2xvdXIsIHdpZHRoKXtcbiAgICBjb25zdCBjb2wgPSBjb2xvdXIgfHwgJ2JsYWNrJztcbiAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICB0aGlzLmN0eC5hcmMoYy54LCBjLnksIHIsIDAsIE1hdGguUEkgKiAyKTtcbiAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IGNvbDtcbiAgICB0aGlzLmN0eC5saW5lV2lkdGggPSB3aWR0aCB8fCAxO1xuICAgIHRoaXMuY3R4LnN0cm9rZSgpO1xuICB9XG5cbiAgLy9jb252ZXJ0IHRoZSBjYW52YXMgdG8gYSBiYXNlNjRVUkwgYW5kIHNlbmQgdG8gc2F2ZUltYWdlLnBocFxuICBzYXZlSW1hZ2UoKXtcbiAgICBjb25zdCBkYXRhID0gdGhpcy5jYW52YXMudG9EYXRhVVJMKCk7XG4gICAgJC5hamF4KHtcbiAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgIHVybDogJ3NhdmVJbWFnZS5waHAnLFxuICAgICAgZGF0YTogeyBpbWc6IGRhdGEgfVxuICAgIH0pO1xuICB9XG5cbiAgLy90aGUgY2FudmFzIGhhcyBiZWVuIHRyYW5zbGF0ZWQgdG8gdGhlIGNlbnRyZSBvZiB0aGUgZGlzayBzbyBuZWVkIHRvXG4gIC8vdXNlIGFuIG9mZnNldCB0byBjbGVhciBpdC4gTk9UIFdPUktJTkcgV0hFTiBTQ1JFRU4gSVMgUkVTSVpFRFxuICBjbGVhcigpIHtcbiAgICB0aGlzLmN0eC5jbGVhclJlY3QoLXdpbmRvdy5pbm5lcldpZHRoLzIsLXdpbmRvdy5pbm5lckhlaWdodC8yLFxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gIH1cblxufVxuXG5cblxuZXhwb3J0IHtDYW52YXN9XG4iLCIvLyAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyAqXG4vLyAqICAgRVVDTElERUFOIEZVTkNUSU9OU1xuLy8gKiAgIGFsbCBFdWNsaWRlYW4gbWF0aGVtYXRpY2FsIGZ1bmN0aW9ucyBnbyBoZXJlXG4vLyAqXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbi8vZGlzdGFuY2UgYmV0d2VlbiB0d28gcG9pbnRzXG5leHBvcnQgY29uc3QgZGlzdGFuY2UgPSAocDEsIHAyKSA9PiBNYXRoLnNxcnQoTWF0aC5wb3coKHAyLnggLSBwMS54KSwgMikgKyBNYXRoLnBvdygocDIueSAtIHAxLnkpLCAyKSk7XG5cbi8vbWlkcG9pbnQgb2YgdGhlIGxpbmUgc2VnbWVudCBjb25uZWN0aW5nIHR3byBwb2ludHNcbmV4cG9ydCBjb25zdCBtaWRwb2ludCA9IChwMSwgcDIpID0+IHtcbiAgcmV0dXJuIHtcbiAgICB4OiAocDEueCArIHAyLngpIC8gMixcbiAgICB5OiAocDEueSArIHAyLnkpIC8gMlxuICB9XG59XG5cbi8vc2xvcGUgb2YgbGluZSB0aHJvdWdoIHAxLCBwMlxuZXhwb3J0IGNvbnN0IHNsb3BlID0gKHAxLCBwMikgPT4gKHAyLnggLSBwMS54KSAvIChwMi55IC0gcDEueSk7XG5cbi8vc2xvcGUgb2YgbGluZSBwZXJwZW5kaWN1bGFyIHRvIGEgbGluZSBkZWZpbmVkIGJ5IHAxLHAyXG5leHBvcnQgY29uc3QgcGVycGVuZGljdWxhclNsb3BlID0gKHAxLCBwMikgPT4gLTEgLyAoTWF0aC5wb3coc2xvcGUocDEsIHAyKSwgLTEpKTtcblxuLy9pbnRlcnNlY3Rpb24gcG9pbnQgb2YgdHdvIGxpbmVzIGRlZmluZWQgYnkgcDEsbTEgYW5kIHExLG0yXG4vL05PVCBXT1JLSU5HIEZPUiBWRVJUSUNBTCBMSU5FUyEhIVxuZXhwb3J0IGNvbnN0IGludGVyc2VjdGlvbiA9IChwMSwgbTEsIHAyLCBtMikgPT4ge1xuICBsZXQgYzEsIGMyLCB4LCB5O1xuICAvL2Nhc2Ugd2hlcmUgZmlyc3QgbGluZSBpcyB2ZXJ0aWNhbFxuICAvL2lmKG0xID4gNTAwMCB8fCBtMSA8IC01MDAwIHx8IG0xID09PSBJbmZpbml0eSl7XG4gIGlmKHAxLnkgPCAwLjAwMDAwMSAmJiBwMS55ID4gLTAuMDAwMDAxICl7XG4gICAgeCA9IHAxLng7XG4gICAgeSA9IChtMikqKHAxLngtcDIueCkgKyBwMi55O1xuICB9XG4gIC8vY2FzZSB3aGVyZSBzZWNvbmQgbGluZSBpcyB2ZXJ0aWNhbFxuICAvL2Vsc2UgaWYobTIgPiA1MDAwIHx8IG0yIDwgLTUwMDAgfHwgbTEgPT09IEluZmluaXR5KXtcbiAgZWxzZSBpZihwMi55IDwgMC4wMDAwMDEgJiYgcDIueSA+IC0wLjAwMDAwMSApe1xuICAgIHggPSBwMi54O1xuICAgIHkgPSAobTEqKHAyLngtcDEueCkpICsgcDEueTtcbiAgfVxuICBlbHNle1xuICAgIC8veSBpbnRlcmNlcHQgb2YgZmlyc3QgbGluZVxuICAgIGMxID0gcDEueSAtIG0xICogcDEueDtcbiAgICAvL3kgaW50ZXJjZXB0IG9mIHNlY29uZCBsaW5lXG4gICAgYzIgPSBwMi55IC0gbTIgKiBwMi54O1xuXG4gICAgeCA9IChjMiAtIGMxKSAvIChtMSAtIG0yKTtcbiAgICB5ID0gbTEgKiB4ICsgYzE7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHg6IHgsXG4gICAgeTogeVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCByYWRpYW5zID0gKGRlZ3JlZXMpID0+IChNYXRoLlBJIC8gMTgwKSAqIGRlZ3JlZXM7XG5cbi8vZ2V0IHRoZSBjaXJjbGUgaW52ZXJzZSBvZiBhIHBvaW50IHAgd2l0aCByZXNwZWN0IGEgY2lyY2xlIHJhZGl1cyByIGNlbnRyZSBjXG5leHBvcnQgY29uc3QgaW52ZXJzZSA9IChwLCByLCBjKSA9PiB7XG4gIGxldCBhbHBoYSA9IChyICogcikgLyAoTWF0aC5wb3cocC54IC0gYy54LCAyKSArIE1hdGgucG93KHAueSAtIGMueSwgMikpO1xuICByZXR1cm4ge1xuICAgIHg6IGFscGhhICogKHAueCAtIGMueCkgKyBjLngsXG4gICAgeTogYWxwaGEgKiAocC55IC0gYy55KSArIGMueVxuICB9O1xufVxuXG4vL2NhbGN1bGF0ZSB0aGUgcmFkaXVzIGFuZCBjZW50cmUgb2YgdGhlIGNpcmNsZSByZXF1aXJlZCB0byBkcmF3IGEgbGluZSBiZXR3ZWVuXG4vL3R3byBwb2ludHMgaW4gdGhlIGh5cGVyYm9saWMgcGxhbmUgZGVmaW5lZCBieSB0aGUgZGlzayAociwgYylcbmV4cG9ydCBjb25zdCBncmVhdENpcmNsZSA9IChwMSwgcDIsIHIsIGMpID0+IHtcbiAgbGV0IHAxSW52ZXJzZSA9IGludmVyc2UocDEsIHIsIGMpO1xuICBsZXQgcDJJbnZlcnNlID0gaW52ZXJzZShwMiwgciwgYyk7XG5cbiAgbGV0IG0gPSBtaWRwb2ludChwMSwgcDFJbnZlcnNlKTtcbiAgbGV0IG4gPSBtaWRwb2ludChwMiwgcDJJbnZlcnNlKTtcblxuICBsZXQgbTEgPSBwZXJwZW5kaWN1bGFyU2xvcGUobSwgcDFJbnZlcnNlKTtcbiAgbGV0IG0yID0gcGVycGVuZGljdWxhclNsb3BlKG4sIHAySW52ZXJzZSk7XG5cblxuICAvL2NlbnRyZSBpcyB0aGUgY2VudHJlcG9pbnQgb2YgdGhlIGNpcmNsZSBvdXQgb2Ygd2hpY2ggdGhlIGFyYyBpcyBtYWRlXG4gIGxldCBjZW50cmUgPSBpbnRlcnNlY3Rpb24obSwgbTEsIG4sIG0yKTtcbiAgbGV0IHJhZGl1cyA9IGRpc3RhbmNlKGNlbnRyZSwgcDEpO1xuICByZXR1cm4ge1xuICAgIGNlbnRyZTogY2VudHJlLFxuICAgIHJhZGl1czogcmFkaXVzXG4gIH07XG59XG5cbi8vYW4gYXR0ZW1wdCBhdCBjYWxjdWxhdGluZyB0aGUgY2lyY2xlIGFsZ2VicmFpY2FsbHlcbmV4cG9ydCBjb25zdCBncmVhdENpcmNsZVYyID0gKHAxLHAyLCByKSA9PntcbiAgbGV0IHggPSAocDIueSoocDEueCpwMS54ICsgcikrIHAxLnkqcDEueSpwMi55LXAxLnkqKHAyLngqcDIueCsgcDIueSpwMi55ICsgcikpLygyKnAxLngqcDIueSAtIHAxLnkqcDIueCk7XG4gIGxldCB5ID0gKHAxLngqcDEueCpwMi54IC0gcDEueCoocDIueCpwMi54K3AyLnkqcDIueStyKStwMi54KihwMS55KnAxLnkrcikpLygyKnAxLnkqcDIueCArIDIqcDEueCpwMi55KTtcbiAgbGV0IHJhZGl1cyA9ICAgTWF0aC5zcXJ0KHgqeCt5Knktcik7XG4gIHJldHVybiB7XG4gICAgY2VudHJlOiB7XG4gICAgICB4OiB4LFxuICAgICAgeTogeVxuICAgIH0sXG4gICAgcmFkaXVzOiByYWRpdXNcbiAgfVxufVxuXG4vL2ludGVyc2VjdGlvbiBvZiB0d28gY2lyY2xlcyB3aXRoIGVxdWF0aW9uczpcbi8vKHgtYSleMiArKHktYSleMiA9IHIwXjJcbi8vKHgtYileMiArKHktYyleMiA9IHIxXjJcbi8vTk9URSBhc3N1bWVzIHRoZSB0d28gY2lyY2xlcyBETyBpbnRlcnNlY3QhXG5leHBvcnQgY29uc3QgY2lyY2xlSW50ZXJzZWN0ID0gKGMwLCBjMSwgcjAsIHIxKSA9PiB7XG4gIGxldCBhID0gYzAueDtcbiAgbGV0IGIgPSBjMC55O1xuICBsZXQgYyA9IGMxLng7XG4gIGxldCBkID0gYzEueTtcbiAgbGV0IGRpc3QgPSBNYXRoLnNxcnQoKGMgLSBhKSAqIChjIC0gYSkgKyAoZCAtIGIpICogKGQgLSBiKSk7XG5cbiAgbGV0IGRlbCA9IE1hdGguc3FydCgoZGlzdCArIHIwICsgcjEpICogKGRpc3QgKyByMCAtIHIxKSAqIChkaXN0IC0gcjAgKyByMSkgKiAoLWRpc3QgKyByMCArIHIxKSkgLyA0O1xuXG4gIGxldCB4UGFydGlhbCA9IChhICsgYykgLyAyICsgKChjIC0gYSkgKiAocjAgKiByMCAtIHIxICogcjEpKSAvICgyICogZGlzdCAqIGRpc3QpO1xuICBsZXQgeDEgPSB4UGFydGlhbCAtIDIgKiBkZWwgKiAoYiAtIGQpIC8gKGRpc3QgKiBkaXN0KTtcbiAgbGV0IHgyID0geFBhcnRpYWwgKyAyICogZGVsICogKGIgLSBkKSAvIChkaXN0ICogZGlzdCk7XG5cbiAgbGV0IHlQYXJ0aWFsID0gKGIgKyBkKSAvIDIgKyAoKGQgLSBiKSAqIChyMCAqIHIwIC0gcjEgKiByMSkpIC8gKDIgKiBkaXN0ICogZGlzdCk7XG4gIGxldCB5MSA9IHlQYXJ0aWFsICsgMiAqIGRlbCAqIChhIC0gYykgLyAoZGlzdCAqIGRpc3QpO1xuICBsZXQgeTIgPSB5UGFydGlhbCAtIDIgKiBkZWwgKiAoYSAtIGMpIC8gKGRpc3QgKiBkaXN0KTtcblxuICBsZXQgcDEgPSB7XG4gICAgeDogeDEsXG4gICAgeTogeTFcbiAgfVxuXG4gIGxldCBwMiA9IHtcbiAgICB4OiB4MixcbiAgICB5OiB5MlxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBwMTogcDEsXG4gICAgcDI6IHAyXG4gIH07XG59XG5cbmV4cG9ydCBjb25zdCBjaXJjbGVMaW5lSW50ZXJzZWN0ID0gKGMsIHIsIHAxLCBwMikgPT4ge1xuXG4gIGNvbnN0IGQgPSBkaXN0YW5jZShwMSwgcDIpO1xuICAvL3VuaXQgdmVjdG9yIHAxIHAyXG4gIGNvbnN0IGR4ID0gKHAyLnggLSBwMS54KS9kO1xuICBjb25zdCBkeSA9IChwMi55IC0gcDEueSkvZDtcblxuICAvL3BvaW50IG9uIGxpbmUgY2xvc2VzdCB0byBjaXJjbGUgY2VudHJlXG4gIGNvbnN0IHQgPSBkeCooYy54IC1wMS54KSArIGR5KihjLnktcDEueSk7XG4gIGNvbnN0IHAgPSAge3g6IHQqIGR4ICsgcDEueCwgeTogdCogZHkgKyBwMS55fTtcblxuICAvL2Rpc3RhbmNlIGZyb20gdGhpcyBwb2ludCB0byBjZW50cmVcbiAgY29uc3QgZDIgPSBkaXN0YW5jZShwLCBjKTtcblxuICAvL2xpbmUgaW50ZXJzZWN0cyBjaXJjbGVcbiAgaWYoZDIgPCByKXtcbiAgICBjb25zdCBkdCA9IE1hdGguc3FydCggcipyIC0gZDIqZDIpO1xuICAgIC8vcG9pbnQgMVxuICAgIGNvbnN0IHExID0ge1xuICAgICAgeDogKHQtZHQpKmR4ICsgcDEueCxcbiAgICAgIHk6ICh0LWR0KSpkeSArIHAxLnlcbiAgICB9XG4gICAgLy9wb2ludCAyXG4gICAgY29uc3QgcTIgPSB7XG4gICAgICB4OiAodCtkdCkqZHggKyBwMS54LFxuICAgICAgeTogKHQrZHQpKmR5ICsgcDEueVxuICAgIH1cblxuICAgIHJldHVybiB7cDE6IHExLCBwMjogcTJ9O1xuICB9XG4gIGVsc2UgaWYoIGQyID09PSByKXtcbiAgICByZXR1cm4gcDtcbiAgfVxuICBlbHNle1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yOiBsaW5lIGRvZXMgbm90IGludGVyc2VjdCBjaXJjbGUhJyk7XG4gIH1cbn1cblxuLy9hbmdsZSBpbiByYWRpYW5zIGJldHdlZW4gdHdvIHBvaW50cyBvbiBjaXJjbGUgb2YgcmFkaXVzIHJcbmV4cG9ydCBjb25zdCBjZW50cmFsQW5nbGUgPSAocDEsIHAyLCByKSA9PiB7XG4gIHJldHVybiAyICogTWF0aC5hc2luKDAuNSAqIGRpc3RhbmNlKHAxLCBwMikgLyByKTtcbn1cblxuLy9jYWxjdWxhdGUgdGhlIG5vcm1hbCB2ZWN0b3IgZ2l2ZW4gMiBwb2ludHNcbmV4cG9ydCBjb25zdCBub3JtYWxWZWN0b3IgPSAocDEsIHAyKSA9PiB7XG4gIGxldCBkID0gTWF0aC5zcXJ0KE1hdGgucG93KHAyLngtcDEueCwyKSArIE1hdGgucG93KHAyLnktcDEueSwyKSk7XG4gIHJldHVybiB7XG4gICAgeDogKHAyLngtcDEueCkvZCxcbiAgICB5OiAocDIueS1wMS55KS9kXG4gIH1cbn1cblxuLy9kb2VzIHRoZSBsaW5lIGNvbm5lY3RpbmcgcDEsIHAyIGdvIHRocm91Z2ggdGhlIHBvaW50ICgwLDApP1xuZXhwb3J0IGNvbnN0IHRocm91Z2hPcmlnaW4gPSAocDEsIHAyKSA9PiB7XG4gIGlmKHAxLnggPT09IDAgJiYgcDIueCA9PT0gMCl7XG4gICAgLy92ZXJ0aWNhbCBsaW5lIHRocm91Z2ggY2VudHJlXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgbGV0IHRlc3QgPSAoLXAxLngqcDIueSArIHAxLngqcDEueSkvKHAyLngtcDEueCkgKyBwMS55O1xuICBpZih0ZXN0ID09PSAwKSByZXR1cm4gdHJ1ZTtcbiAgZWxzZSByZXR1cm4gZmFsc2U7XG59XG5cbi8vZmluZCB0aGUgY2VudHJvaWQgb2YgYSBub24tc2VsZi1pbnRlcnNlY3RpbmcgcG9seWdvblxuZXhwb3J0IGNvbnN0IGNlbnRyb2lkT2ZQb2x5Z29uID0gKHBvaW50cykgPT4ge1xuICBsZXQgZmlyc3QgPSBwb2ludHNbMF0sIGxhc3QgPSBwb2ludHNbcG9pbnRzLmxlbmd0aC0xXTtcbiAgaWYgKGZpcnN0LnggIT0gbGFzdC54IHx8IGZpcnN0LnkgIT0gbGFzdC55KSBwb2ludHMucHVzaChmaXJzdCk7XG4gIGxldCB0d2ljZWFyZWE9MCxcbiAgICB4PTAsIHk9MCxcbiAgICBuUHRzID0gcG9pbnRzLmxlbmd0aCxcbiAgICBwMSwgcDIsIGY7XG4gIGZvciAoIHZhciBpPTAsIGo9blB0cy0xIDsgaTxuUHRzIDsgaj1pKysgKSB7XG4gICAgcDEgPSBwb2ludHNbaV07IHAyID0gcG9pbnRzW2pdO1xuICAgIGYgPSBwMS54KnAyLnkgLSBwMi54KnAxLnk7XG4gICAgdHdpY2VhcmVhICs9IGY7XG4gICAgeCArPSAoIHAxLnggKyBwMi54ICkgKiBmO1xuICAgIHkgKz0gKCBwMS55ICsgcDIueSApICogZjtcbiAgfVxuICBmID0gdHdpY2VhcmVhICogMztcbiAgcmV0dXJuIHsgeDp4L2YsIHk6eS9mIH07XG59XG4iLCIvLyAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyAqXG4vLyAqICAgUFJFLVNFVFVQXG4vLyAqXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cblxuLy8gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gKlxuLy8gKiAgIENPTlNUQU5UU1xuLy8gKiAgIGRlZmluZSBhbnkgZ2xvYmFsIGNvbnN0YW50cyBoZXJlXG4vLyAqXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cblxuLy8gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gKlxuLy8gKiAgIElNUE9SVFNcbi8vICpcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuaW1wb3J0ICogYXMgRSBmcm9tICcuL2V1Y2xpZCc7XG5pbXBvcnQgKiBhcyBDIGZyb20gJy4vY2FudmFzJztcblxuXG5cbi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICpcbi8vICogICBIRUxQRVIgRlVOQ1RJT05TXG4vLyAqICAgZGVmaW5lIGFueSBnbG9iYWwgaGVscGVyIGZ1bmN0aW9ucyBoZXJlXG4vLyAqXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbi8vY29tcGFyZSB0d28gcG9pbnRzIHRha2luZyByb3VuZGluZyBlcnJvcnMgaW50byBhY2NvdW50XG5jb25zdCBjb21wYXJlUG9pbnRzID0gKHAxLCBwMikgPT4ge1xuICBpZih0eXBlb2YgcDEgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBwMiA9PT0gJ3VuZGVmaW5lZCcpe1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHAxID0gcG9pbnRUb0ZpeGVkKHAxLCA2KTtcbiAgcDIgPSBwb2ludFRvRml4ZWQocDIsIDYpO1xuICBpZihwMS54ID09PSBwMi54ICYmIHAxLnkgPT09IHAyLnkpIHJldHVybiB0cnVlO1xuICBlbHNlIHJldHVybiBmYWxzZTtcbn1cblxuY29uc3QgcG9pbnRUb0ZpeGVkID0gKHAsIHBsYWNlcykgPT4ge1xuICByZXR1cm4ge1xuICAgIHg6IHAueC50b0ZpeGVkKHBsYWNlcyksXG4gICAgeTogcC55LnRvRml4ZWQocGxhY2VzKVxuICB9O1xufVxuXG4vL2ZsaXAgYSBzZXQgb2YgcG9pbnRzIG92ZXIgYSBoeXBlcm9ibGljIGxpbmUgZGVmaW5lZCBieSB0d28gcG9pbnRzXG5jb25zdCB0cmFuc2Zvcm0gPSAocG9pbnRzQXJyYXksIHAxLCBwMikgPT4ge1xuICBsZXQgbmV3UG9pbnRzQXJyYXkgPSBbXTtcbiAgbGV0IGMgPSBFLmdyZWF0Q2lyY2xlKHAxLCBwMiwgZGlzay5yYWRpdXMsIGRpc2suY2VudHJlKTtcblxuICBmb3IobGV0IHAgb2YgcG9pbnRzQXJyYXkpe1xuICAgIGxldCBuZXdQID0gRS5pbnZlcnNlKHAsIGMucmFkaXVzLCBjLmNlbnRyZSk7XG4gICAgbmV3UG9pbnRzQXJyYXkucHVzaChuZXdQKTtcbiAgfVxuICByZXR1cm4gbmV3UG9pbnRzQXJyYXk7XG59XG5cbi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICpcbi8vICogICBET0NVTUVOVCBSRUFEWVxuLy8gKlxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuJChkb2N1bWVudCkucmVhZHkoKCkgPT4ge1xuICBjb25zdCBjID0gbmV3IEMuQ2FudmFzKCk7XG4gIC8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgLy8gKlxuICAvLyAqICAgRElTSyBDTEFTU1xuICAvLyAqICAgUG9pbmNhcmUgRGlzayByZXByZXNlbnRhdGlvbiBvZiB0aGUgaHlwZXJib2xpYyBwbGFuZVxuICAvLyAqXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgY2xhc3MgRGlzayB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICB0aGlzLnggPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDI7XG4gICAgICB0aGlzLnkgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyO1xuXG4gICAgICB0aGlzLmNlbnRyZSA9IHtcbiAgICAgICAgeDogMCxcbiAgICAgICAgeTogMFxuICAgICAgfVxuXG4gICAgICAvL2RyYXcgbGFyZ2VzdCBjaXJjbGUgcG9zc2libGUgZ2l2ZW4gd2luZG93IGRpbXNcbiAgICAgIHRoaXMucmFkaXVzID0gKHdpbmRvdy5pbm5lcldpZHRoIDwgd2luZG93LmlubmVySGVpZ2h0KSA/ICh3aW5kb3cuaW5uZXJXaWR0aCAvIDIpIC0gNSA6ICh3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKSAtIDU7XG5cbiAgICAgIC8vc21hbGxlciBjaXJjbGUgZm9yIHRlc3RpbmdcbiAgICAgIC8vIC90aGlzLnJhZGl1cyA9IHRoaXMucmFkaXVzIC8gMztcblxuICAgICAgdGhpcy5jb2xvciA9ICdibGFjayc7XG4gICAgfVxuXG4gICAgLy9kcmF3IHRoZSBib3VuZGFyeSBjaXJjbGVcbiAgICBvdXRlckNpcmNsZSgpIHtcbiAgICAgIGRyYXdDaXJjbGUoe3g6IHRoaXMuY2VudHJlLngsIHk6IHRoaXMuY2VudHJlLnl9LCB0aGlzLnJhZGl1cyk7XG4gICAgfVxuXG4gICAgLy9kcmF3IGEgaHlwZXJib2xpYyBsaW5lIGJldHdlZW4gdHdvIHBvaW50cyBvbiB0aGUgYm91bmRhcnkgY2lyY2xlXG4gICAgbGluZShwMSwgcDIsIGNvbG91cikge1xuICAgICAgLy9sZXQgcHRzID0gdGhpcy5wcmVwUG9pbnRzKHAxLCBwMik7XG4gICAgICAvL3AxID0gcHRzLnAxO1xuICAgICAgLy9wMiA9IHB0cy5wMjtcbiAgICAgIGxldCBjb2wgPSBjb2xvdXIgfHwgJ2JsYWNrJztcbiAgICAgIGxldCBjLCBwb2ludHM7XG5cbiAgICAgIGlmKEUudGhyb3VnaE9yaWdpbihwMSxwMikpe1xuICAgICAgICBsZXQgdSA9IG5vcm1hbFZlY3RvcihwMSxwMik7XG4gICAgICAgIHBvaW50cyA9IHtcbiAgICAgICAgICBwMToge1xuICAgICAgICAgICAgeDogdS54ICogdGhpcy5yYWRpdXMsXG4gICAgICAgICAgICB5OiB1LnkgKiB0aGlzLnJhZGl1c1xuICAgICAgICAgIH0sXG4gICAgICAgICAgcDI6IHtcbiAgICAgICAgICAgIHg6IC11LnggKiB0aGlzLnJhZGl1cyxcbiAgICAgICAgICAgIHk6IC11LnkgKiB0aGlzLnJhZGl1c1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBldWNsaWRlYW5MaW5lKHBvaW50cy5wMSxwb2ludHMucDIsIGNvbCk7XG4gICAgICB9XG4gICAgICBlbHNle1xuICAgICAgICBjID0gRS5ncmVhdENpcmNsZShwMSwgcDIsIHRoaXMucmFkaXVzLCB0aGlzLmNlbnRyZSk7XG4gICAgICAgIHBvaW50cyA9IGNpcmNsZUludGVyc2VjdCh0aGlzLmNlbnRyZSwgYy5jZW50cmUsIHRoaXMucmFkaXVzLCBjLnJhZGl1cyk7XG5cbiAgICAgICAgLy9hbmdsZSBzdWJ0ZW5kZWQgYnkgdGhlIGFyY1xuICAgICAgICBsZXQgYWxwaGEgPSBFLmNlbnRyYWxBbmdsZShwb2ludHMucDEsIHBvaW50cy5wMiwgYy5yYWRpdXMpO1xuXG4gICAgICAgIGxldCBvZmZzZXQgPSB0aGlzLmFscGhhT2Zmc2V0KHBvaW50cy5wMiwgcG9pbnRzLnAyLCBjLCAnbGluZScpO1xuICAgICAgICBjLmRyYXdTZWdtZW50KGMsIGFscGhhLCBvZmZzZXQsIGNvbCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy9jYWxjdWxhdGUgdGhlIG9mZnNldCAocG9zaXRpb24gYXJvdW5kIHRoZSBjaXJjbGUgZnJvbSB3aGljaCB0byBzdGFydCB0aGVcbiAgICAvL2xpbmUgb3IgYXJjKS4gQXMgY2FudmFzIGRyYXdzIGFyY3MgY2xvY2t3aXNlIGJ5IGRlZmF1bHQgdGhpcyB3aWxsIGNoYW5nZVxuICAgIC8vZGVwZW5kaW5nIG9uIHdoZXJlIHRoZSBhcmMgaXMgcmVsYXRpdmUgdG8gdGhlIG9yaWdpblxuICAgIC8vc3BlY2lmaWNhbGwgd2hldGhlciBpdCBsaWVzIG9uIHRoZSB4IGF4aXMsIG9yIGFib3ZlIG9yIGJlbG93IGl0XG4gICAgLy90eXBlID0gJ2xpbmUnIG9yICdhcmMnXG4gICAgYWxwaGFPZmZzZXQocDEsIHAyLCBjLCB0eXBlKSB7XG4gICAgICBsZXQgb2Zmc2V0O1xuXG4gICAgICAvL3BvaW50cyBhdCAwIHJhZGlhbnMgb24gZ3JlYXRDaXJjbGVcbiAgICAgIGxldCBwID0ge1xuICAgICAgICB4OiBjLmNlbnRyZS54ICsgYy5yYWRpdXMsXG4gICAgICAgIHk6IGMuY2VudHJlLnlcbiAgICAgIH1cblxuICAgICAgaWYocDEueSA8IGMuY2VudHJlLnkpe1xuICAgICAgICBvZmZzZXQgPSAyKk1hdGguUEkgLSBFLmNlbnRyYWxBbmdsZShwMSwgcCwgYy5yYWRpdXMpO1xuICAgICAgfVxuICAgICAgZWxzZXtcbiAgICAgICAgb2Zmc2V0ID0gRS5jZW50cmFsQW5nbGUocDEsIHAsIGMucmFkaXVzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG9mZnNldDtcbiAgICB9XG5cbiAgICAvL3B1dCBwb2ludHMgaW4gY2xvY2t3aXNlIG9yZGVyXG4gICAgcHJlcFBvaW50cyhwMSwgcDIsIGMpe1xuICAgICAgY29uc3QgcCA9IHt4OiBjLmNlbnRyZS54ICsgYy5yYWRpdXMsIHk6IGMuY2VudHJlLnl9O1xuICAgICAgLy9jYXNlIHdoZXJlIHBvaW50cyBhcmUgYWJvdmUgYW5kIGJlbG93IHRoZSBsaW5lIGMuY2VudHJlIC0+IHBcbiAgICAgIC8vaW4gdGhpcyBjYXNlIGp1c3QgcmV0dXJuIHBvaW50c1xuICAgICAgY29uc3Qgb3kgPSBjLmNlbnRyZS55O1xuICAgICAgY29uc3Qgb3ggPSBjLmNlbnRyZS54O1xuXG4gICAgICBpZihwMS54ID4gb3ggJiYgcDIueCA+IG94KXtcbiAgICAgICAgaWYocDEueSA+IG95ICYmIHAyLnkgPCBveSkgcmV0dXJuIHtwMTogcDIsIHAyOiBwMX07XG4gICAgICAgIGVsc2UgaWYocDEueSA8IG95ICYmIHAyLnkgPiBveSkgcmV0dXJuIHtwMTogcDEsIHAyOiBwMn07XG4gICAgICB9XG5cbiAgICAgIGxldCBhbHBoYTEgPSBFLmNlbnRyYWxBbmdsZShwLCBwMSwgYy5yYWRpdXMpO1xuICAgICAgYWxwaGExID0gKHAxLnkgPCBjLmNlbnRyZS55KSA/IDIqTWF0aC5QSSAtIGFscGhhMSA6IGFscGhhMTtcbiAgICAgIGxldCBhbHBoYTIgPSBFLmNlbnRyYWxBbmdsZShwLCBwMiwgYy5yYWRpdXMpO1xuICAgICAgYWxwaGEyID0gKHAyLnkgPCBjLmNlbnRyZS55KSA/IDIqTWF0aC5QSSAtIGFscGhhMiA6IGFscGhhMjtcblxuICAgICAgLy9pZiB0aGUgcG9pbnRzIGFyZSBub3QgaW4gY2xvY2t3aXNlIG9yZGVyIGZsaXAgdGhlbVxuICAgICAgaWYoYWxwaGExID4gYWxwaGEyKSByZXR1cm4ge3AxOiBwMiwgcDI6IHAxfTtcbiAgICAgIGVsc2UgcmV0dXJuIHtwMTogcDEsIHAyOiBwMn07XG5cbiAgICB9XG5cbiAgICAvL0RyYXcgYW4gYXJjIChoeXBlcmJvbGljIGxpbmUgc2VnbWVudCkgYmV0d2VlbiB0d28gcG9pbnRzIG9uIHRoZSBkaXNrXG4gICAgYXJjKHAxLCBwMiwgY29sb3VyKSB7XG4gICAgICBpZihFLnRocm91Z2hPcmlnaW4ocDEscDIpKXtcbiAgICAgICAgZXVjbGlkZWFuTGluZShwMSxwMiwgY29sb3VyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgbGV0IGNvbCA9IGNvbG91ciB8fCAnYmxhY2snO1xuICAgICAgbGV0IGMgPSBFLmdyZWF0Q2lyY2xlKHAxLCBwMiwgdGhpcy5yYWRpdXMsIHRoaXMuY2VudHJlKTtcbiAgICAgIGxldCBwdHMgPSB0aGlzLnByZXBQb2ludHMocDEsIHAyLCBjKTtcbiAgICAgIHAxID0gcHRzLnAxO1xuICAgICAgcDIgPSBwdHMucDI7XG5cbiAgICAgIC8vbGVuZ3RoIG9mIHRoZSBhcmNcbiAgICAgIGxldCBhbHBoYSA9IEUuY2VudHJhbEFuZ2xlKHAxLCBwMiwgYy5yYWRpdXMpO1xuXG4gICAgICAvL2hvdyBmYXIgYXJvdW5kIHRoZSBncmVhdENpcmNsZSB0byBzdGFydCBkcmF3aW5nIHRoZSBhcmNcbiAgICAgIGxldCBvZmZzZXQgPSB0aGlzLmFscGhhT2Zmc2V0KHAxLCBwMiwgYywgJ2FyYycpO1xuICAgICAgYy5kcmF3U2VnbWVudChjLCBhbHBoYSwgb2Zmc2V0LCBjb2xvdXIpO1xuICAgIH1cblxuICAgIHBvbHlnb24odmVydGljZXMsIGNvbG91cikge1xuICAgICAgbGV0IGwgPSB2ZXJ0aWNlcy5sZW5ndGg7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgICB0aGlzLmFyYyh2ZXJ0aWNlc1tpXSwgdmVydGljZXNbKGkgKyAxKSVsXSwgY29sb3VyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvL3JldHVybiB0cnVlIGlmIHRoZSBwb2ludCBpcyBub3QgaW4gdGhlIGRpc2tcbiAgICBjaGVja1BvaW50KHBvaW50KSB7XG4gICAgICBsZXQgciA9IHRoaXMucmFkaXVzO1xuICAgICAgaWYgKEUuZGlzdGFuY2UocG9pbnQsIHRoaXMuY2VudHJlKSA+IHIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IhIFBvaW50ICgnICsgcG9pbnQueCArICcsICcgKyBwb2ludC55ICsgJykgbGllcyBvdXRzaWRlIHRoZSBwbGFuZSEnKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgZGlzayA9IG5ldyBEaXNrKCk7XG5cbiAgLy8gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAvLyAqICAgIFRFU1NFTEFUSU9OIENMQVNTXG4gIC8vICogICAgQ3JlYXRlcyBhIHJlZ3VsYXIgVGVzc2VsYXRpb24gb2YgdGhlIFBvaW5jYXJlIERpc2tcbiAgLy8gKiAgICBxOiBudW1iZXIgb2YgcC1nb25zIG1lZXRpbmcgYXQgZWFjaCB2ZXJ0ZXhcbiAgLy8gKiAgICBwOiBudW1iZXIgb2Ygc2lkZXMgb2YgcC1nb25cbiAgLy8gKiAgICB1c2luZyB0aGUgdGVjaG5pcXVlcyBjcmVhdGVkIGJ5IENveGV0ZXIgYW5kIER1bmhhbVxuICAvLyAqXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgY2xhc3MgVGVzc2VsYXRpb24ge1xuICAgIGNvbnN0cnVjdG9yKGRpc2ssIHAsIHEsIHJvdGF0aW9uLCBjb2xvdXIpIHtcblxuICAgICAgdGhpcy5kaXNrID0gZGlzaztcbiAgICAgIHRoaXMucCA9IHA7XG4gICAgICB0aGlzLnEgPSBxO1xuICAgICAgdGhpcy5taW5FeHAgPSBwLTM7XG4gICAgICB0aGlzLm1heEV4cCA9IHAtMjtcbiAgICAgIHRoaXMuY29sb3VyID0gY29sb3VyIHx8ICdibGFjayc7XG4gICAgICB0aGlzLnJvdGF0aW9uID0gcm90YXRpb24gfHwgMDtcblxuICAgICAgaWYodGhpcy5jaGVja1BhcmFtcygpKXsgcmV0dXJuIGZhbHNlO31cblxuICAgICAgdGhpcy5xID0gcTtcbiAgICAgIHRoaXMubWF4TGF5ZXJzID0gMztcbiAgICAgIHRoaXMubGltaXQgPSAxMDAwMDtcblxuICAgICAgLy9hcnJheSBvZiBhbGwgbGluZXMgdGhhdCBoYXZlIGJlZW4gcmVmbGVjdGVkIG92ZXJcbiAgICAgIHRoaXMucmVmbGVjdGVkTGluZXMgPSBbXTtcblxuICAgICAgLy9hcnJheSBvZiBjZW50cm9pZHMgZm9yIGFsbCBwb2x5Z29ucyBkcmF3biBzbyBmYXJcbiAgICAgIHRoaXMucG9seWdvbkNlbnRyb2lkcyA9IFtdO1xuXG4gICAgICB0aGlzLnRlc3NlbGF0aW9uKCk7XG4gICAgfVxuXG4gICAgdGVzc2VsYXRpb24oKXtcbiAgICAgIGNvbnN0IHZlcnRpY2VzID0gdGhpcy5mdW5kYW1lbnRhbFBvbHlnb24oKTtcbiAgICAgIHRoaXMuZGlzay5wb2x5Z29uKHZlcnRpY2VzLCB0aGlzLmNvbG91cik7XG5cbiAgICAgIGxldCBwID0gRS5jZW50cm9pZE9mUG9seWdvbih2ZXJ0aWNlcyk7XG4gICAgICBwID0gcG9pbnRUb0ZpeGVkKHAsIDYpO1xuICAgICAgdGhpcy5wb2x5Z29uQ2VudHJvaWRzLnB1c2gocCk7XG5cbiAgICAgIHRoaXMucmVjdXJzaXZlUG9seUdlbih2ZXJ0aWNlcywge3g6IDAsIHk6IDB9LCB7eDogMCwgeTogMH0sIDIpO1xuICAgIH1cblxuICAgIC8vcmVjdXJzaXZlbHkgcmVmbGVjdCBlYWNoIHBvbHlnb24gb3ZlciBlYWNoIGVkZ2UsIGRyYXcgdGhlIG5ldyBwb2x5Z29uc1xuICAgIC8vYW5kIHJlcGVhdCBmb3IgZWFjaCBvZiB0aGVpciBlZGdlc1xuICAgIC8vVE9ETyBtYWtlIHN1cmUgbm8gbGluZSBpcyBkcmF3biBtb3JlIHRoYW4gb25jZVxuICAgIHJlY3Vyc2l2ZVBvbHlHZW4odmVydGljZXMsIHByZXZQMSwgcHJldlAyLCBsYXllcil7XG4gICAgICAvL1RFU1RJTkdcbiAgICAgIGlmKHRoaXMubGltaXQgPD0gMCl7IHJldHVybiA7fVxuICAgICAgdGhpcy5saW1pdCAtLTtcblxuICAgICAgLy9jb25zb2xlLmxvZygnTGF5ZXI6ICcsIGxheWVyKTtcbiAgICAgIC8vaWYobGF5ZXIgPiB0aGlzLm1heExheWVycyl7IHJldHVybjsgfVxuXG4gICAgICBjb25zdCBsID0gdmVydGljZXMubGVuZ3RoO1xuXG5cblxuICAgICAgZm9yKGxldCBpID0gMDsgaSA8IGw7IGkrKyl7XG4gICAgICAgIGxldCBwMSA9IHZlcnRpY2VzW2ldO1xuICAgICAgICBsZXQgcDIgPSB2ZXJ0aWNlc1soaSArIDEpJWxdO1xuICAgICAgICAvL2Rvbid0IHJlZmxlY3QgYmFjayBvdmVyIHRoZSBsaW5lIHdlJ3ZlIGp1c3QgcmVmbGVjdGVkIGFjcm9zcyBhcyB0aGlzXG4gICAgICAgIC8vY2F1c2VzIGEgbG9vcFxuICAgICAgICBpZighY29tcGFyZVBvaW50cyhwMSwgcHJldlAxKSAmJiAhY29tcGFyZVBvaW50cyhwMiwgcHJldlAyKSl7XG4gICAgICAgIC8vaWYoIXRoaXMucG9seWdvbkV4aXN0cyh2ZXJ0aWNlcykgKXsvLyYmICF0aGlzLmFscmVhZHlSZWZsZWN0ZWQocDEsIHAyKSl7XG4gICAgICAgICAgbGV0IG5ld1ZlcnRpY2VzID0gdGhpcy5yZWZsZWN0UG9seWdvbih2ZXJ0aWNlcywgcDEsIHAyKTtcbiAgICAgICAgICB0aGlzLmRpc2sucG9seWdvbihuZXdWZXJ0aWNlcywgdGhpcy5jb2xvdXIpO1xuICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucmVjdXJzaXZlUG9seUdlbihuZXdWZXJ0aWNlcywgcDEsIHAyLCBsYXllcisrKTtcbiAgICAgICAgICB9LCA1MDApO1xuICAgICAgICB9XG4gICAgICAgIC8vfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vY2hlY2sgaWYgdGhlIHBvbHlnb24gaGFzIGFscmVhZHkgYmVlbiBkcmF3blxuICAgIHBvbHlnb25FeGlzdHModmVydGljZXMpe1xuICAgICAgbGV0IHAgPSBFLmNlbnRyb2lkT2ZQb2x5Z29uKHZlcnRpY2VzKTtcbiAgICAgIHAgPSBwb2ludFRvRml4ZWQocCwgNik7XG5cblxuICAgICAgbGV0IGkgPSAgJC5pbkFycmF5KHAueCwgdGhpcy5wb2x5Z29uQ2VudHJvaWRzKTtcbiAgICAgIC8vY2FzZSAxLCBjZW50cm9pZCBpcyBub3QgaW4gYXJyYXlcbiAgICAgIGlmKGkgPT09IC0xKXtcbiAgICAgICAgdGhpcy5wb2x5Z29uQ2VudHJvaWRzLnB1c2gocC54LCBwLnkpO1xuICAgICAgICBkcmF3UG9pbnQocCk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIC8vY2FzZSAyOiBjZW50cm9pZCBpcyBub3QgaW4gYXJyYXlcbiAgICAgIGVsc2UgaWYodGhpcy5wb2x5Z29uQ2VudHJvaWRzW2krMV0gIT09IHAueSl7XG4gICAgICAgIHRoaXMucG9seWdvbkNlbnRyb2lkcy5wdXNoKHAueCwgcC55KTtcbiAgICAgICAgZHJhd1BvaW50KHApO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICAvL2Nhc2UgMzogY2VudHJvaWQgaXMgaW4gYXJyYXlcbiAgICAgIGVsc2V7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vY2hlY2sgaWYgYSBwYXJ0aWN1bGFyIGxpbmUgaGFzIGFscmVhZHkgYmVlbiB0byBkbyBhIHJlZmxlY3Rpb24gYW5kIGlmIG5vdFxuICAgIC8vYWRkIHRoZSBjdXJyZW50IGxpbmUgdG8gdGhlIGFycmF5XG4gICAgYWxyZWFkeVJlZmxlY3RlZChwMSwgcDIpe1xuICAgICAgbGV0IHgxID0gcDEueC50b0ZpeGVkKDYpO1xuICAgICAgbGV0IHkxID0gcDEueS50b0ZpeGVkKDYpO1xuICAgICAgbGV0IHgyID0gcDIueC50b0ZpeGVkKDYpO1xuICAgICAgbGV0IHkyID0gcDIueS50b0ZpeGVkKDYpO1xuXG4gICAgICBsZXQgaSA9ICAkLmluQXJyYXkoeDEsIHRoaXMucmVmbGVjdGVkTGluZXMpO1xuICAgICAgLy9jYXNlMTogZmlyc3QgcG9pbnQgbm90IGluIGFycmF5LCBsaW5lIGhhcyBub3QgYmVlbiB1c2VkIHRvIHJlZmxlY3RcbiAgICAgIGlmKGkgPT09IC0xKXtcbiAgICAgICAgdGhpcy5yZWZsZWN0ZWRMaW5lcy5wdXNoKHgxKTtcbiAgICAgICAgdGhpcy5yZWZsZWN0ZWRMaW5lcy5wdXNoKHkxKTtcbiAgICAgICAgdGhpcy5yZWZsZWN0ZWRMaW5lcy5wdXNoKHgyKTtcbiAgICAgICAgdGhpcy5yZWZsZWN0ZWRMaW5lcy5wdXNoKHkyKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgICAvL2Nhc2UgMjogZmlyc3QgcG9pbnQgaXMgaW4gYXJyYXlcbiAgICAgIGVsc2UgaWYodGhpcy5yZWZsZWN0ZWRMaW5lc1tpICsxXSA9PT0geTEpe1xuICAgICAgICAvL2Nhc2UgMmE6IHNlY29uZCBwb2ludCBpcyBpbiB0aGUgYXJyYXkgYWRqYWNlbnQgdG8gZmlyc3QgcG9pbnQ7XG4gICAgICAgIC8vID0+IGxpbmVzIGhhcyBhbHJhZWR5IGJlZW4gdXNlZFxuICAgICAgICBsZXQgYSA9ICh0aGlzLnJlZmxlY3RlZExpbmVzW2krMl0gPT09IHgyICYmIHRoaXMucmVmbGVjdGVkTGluZXNbaSszXSA9PT0geTIpO1xuICAgICAgICBsZXQgYiA9ICh0aGlzLnJlZmxlY3RlZExpbmVzW2ktMl0gPT09IHgyICYmIHRoaXMucmVmbGVjdGVkTGluZXNbaS0xXSA9PT0geTIpO1xuICAgICAgICBpZihhIHx8IGIpe1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vY2FzZSAyYjogMXN0IHBvaW50IHdhcyBpbiBhcnJheSBidXQgYXMgcGFydCBvZiBkaWZmZXJlbnQgbGluZVxuICAgICAgICBlbHNle1xuICAgICAgICAgIHRoaXMucmVmbGVjdGVkTGluZXMucHVzaCh4MSk7XG4gICAgICAgICAgdGhpcy5yZWZsZWN0ZWRMaW5lcy5wdXNoKHkxKTtcbiAgICAgICAgICB0aGlzLnJlZmxlY3RlZExpbmVzLnB1c2goeDIpO1xuICAgICAgICAgIHRoaXMucmVmbGVjdGVkTGluZXMucHVzaCh5Mik7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvL3JvdGF0ZSB0aGUgZmlyc3QgcG9pbnRzIGFyb3VuZCB0aGUgZGlzayB0byBnZW5lcmF0ZSB0aGUgZnVuZGFtZW50YWwgcG9seWdvblxuICAgIC8vVE9ETzogdXNlIER1bmhhbSdzIG1ldGhvZCBvZiByZWZsZWN0aW5nIGEgZnVuZGFtZW50YWwgdHJpYW5nbGUgd2hpY2ggd2lsbFxuICAgIC8vY29udGFpbiBhIG1vdGlmIGV2ZW50dWFsbHlcbiAgICBmdW5kYW1lbnRhbFBvbHlnb24oKXtcbiAgICAgIGNvbnN0IHAgPSB0aGlzLmZpcnN0UG9pbnQoKTtcbiAgICAgIGxldCBhbHBoYSA9IDIqTWF0aC5QSS90aGlzLnA7XG4gICAgICBjb25zdCB2ZXJ0aWNlcyA9IFtwXTtcblxuICAgICAgZm9yKGxldCBpID0gMTsgaSA8IHRoaXMucDsgaSsrKXtcbiAgICAgICAgLy9yb3RhdGUgYXJvdW5kIHRoZSBkaXNrIGJ5IGFscGhhIHJhZGlhbnMgZm9yIG5leHQgcG9pbnRzXG4gICAgICAgIGxldCBxID0ge1xuICAgICAgICAgIHg6IE1hdGguY29zKGFscGhhKmkpKnAueCArIE1hdGguc2luKGFscGhhKmkpKnAueSxcbiAgICAgICAgICB5OiAtTWF0aC5zaW4oYWxwaGEqaSkqcC54ICsgTWF0aC5jb3MoYWxwaGEqaSkqcC55XG4gICAgICAgIH1cblxuICAgICAgICB2ZXJ0aWNlcy5wdXNoKHEpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHZlcnRpY2VzO1xuICAgIH1cblxuICAgIC8vY2FsY3VsYXRlIGZpcnN0IHBvaW50IG9mIGZ1bmRhbWVudGFsIHBvbHlnb24gdXNpbmcgQ294ZXRlcidzIG1ldGhvZFxuICAgIGZpcnN0UG9pbnQoKXtcbiAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihNYXRoLlBJL3RoaXMucCk7XG4gICAgICBjb25zdCB0ID0gTWF0aC5jb3MoTWF0aC5QSS90aGlzLnEpO1xuICAgICAgLy9tdWx0aXBseSB0aGVzZSBieSB0aGUgZGlza3MgcmFkaXVzIChDb3hldGVyIHVzZWQgdW5pdCBkaXNrKTtcbiAgICAgIGNvbnN0IHIgPSAxL01hdGguc3FydCgodCp0KS8ocypzKSAtMSkqdGhpcy5kaXNrLnJhZGl1cztcbiAgICAgIGNvbnN0IGQgPSAxL01hdGguc3FydCgxLSAocypzKS8odCp0KSkqdGhpcy5kaXNrLnJhZGl1cztcbiAgICAgIGNvbnN0IGIgPSB7XG4gICAgICAgIHg6IHRoaXMuZGlzay5yYWRpdXMqTWF0aC5jb3MoTWF0aC5QSS90aGlzLnApLFxuICAgICAgICB5OiAtdGhpcy5kaXNrLnJhZGl1cypNYXRoLnNpbihNYXRoLlBJL3RoaXMucClcbiAgICAgIH1cblxuICAgICAgY29uc3QgY2VudHJlID0ge3g6IGQsIHk6IDB9O1xuXG4gICAgICAvL3RoZXJlIHdpbGwgYmUgdHdvIHBvaW50cyBvZiBpbnRlcnNlY3Rpb24sIG9mIHdoaWNoIHdlIHdhbnQgdGhlIGZpcnN0XG4gICAgICBsZXQgcCA9IEUuY2lyY2xlTGluZUludGVyc2VjdChjZW50cmUsIHIsIHRoaXMuZGlzay5jZW50cmUsIGIpLnAxO1xuXG4gICAgICAvL2FwcGx5IHRoZSByb3RhdGlvblxuICAgICAgcCA9IHtcbiAgICAgICAgeDogTWF0aC5jb3ModGhpcy5yb3RhdGlvbikqcC54IC0gTWF0aC5zaW4odGhpcy5yb3RhdGlvbikqcC55LFxuICAgICAgICB5OiBNYXRoLnNpbih0aGlzLnJvdGF0aW9uKSpwLnggKyBNYXRoLmNvcyh0aGlzLnJvdGF0aW9uKSpwLnlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHA7XG4gICAgfVxuXG4gICAgLy9yZWZsZWN0IHRoZSBwb2x5Z29uIGRlZmluZWQgYnkgdmVydGljZXMgYWNyb3NzIHRoZSBsaW5lIHAxLCBwMlxuICAgIHJlZmxlY3RQb2x5Z29uKHZlcnRpY2VzLCBwMSwgcDIpe1xuICAgICAgY29uc3QgbCA9IHZlcnRpY2VzLmxlbmd0aDtcbiAgICAgIGNvbnN0IG5ld1ZlcnRpY2VzID0gW107XG4gICAgICBjb25zdCBjID0gRS5ncmVhdENpcmNsZShwMSwgcDIsIHRoaXMuZGlzay5yYWRpdXMsIHRoaXMuZGlzay5jZW50cmUpO1xuICAgICAgZm9yKGxldCBpID0gMDsgaTwgbDsgaSsrKXtcbiAgICAgICAgbGV0IHAgPSBFLmludmVyc2UodmVydGljZXNbaV0sIGMucmFkaXVzLCBjLmNlbnRyZSk7XG4gICAgICAgIG5ld1ZlcnRpY2VzLnB1c2gocCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXdWZXJ0aWNlcztcbiAgICB9XG5cbiAgICAvL1RoZSB0ZXNzZWxhdGlvbiByZXF1aXJlcyB0aGF0IChwLTIpKHEtMikgPiA0IHRvIHdvcmsgKG90aGVyd2lzZSBpdCBpc1xuICAgIC8vIGVpdGhlciBhbiBlbGxpcHRpY2FsIG9yIGV1Y2xpZGVhbiB0ZXNzZWxhdGlvbik7XG4gICAgY2hlY2tQYXJhbXMoKXtcbiAgICAgIGlmKCh0aGlzLnAgLTIpKih0aGlzLnEtMikgPD0gNCl7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0h5cGVyYm9saWMgdGVzc2VsYXRpb25zIHJlcXVpcmUgdGhhdCAocC0xKShxLTIpIDwgNCEnKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBlbHNlIGlmKHRoaXMucSA8IDMpe1xuICAgICAgICBjb25zb2xlLmVycm9yKCdUZXNzZWxhdGlvbiBlcnJvcjogYXQgbGVhc3QgMyBwLWdvbnMgbXVzdCBtZWV0IFxcXG4gICAgICAgICAgICAgICAgICAgICAgYXQgZWFjaCB2ZXJ0ZXghJyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgZWxzZSBpZih0aGlzLnAgPCAzKXtcbiAgICAgICAgY29uc29sZS5lcnJvcignVGVzc2VsYXRpb24gZXJyb3I6IHBvbHlnb24gbmVlZHMgYXQgbGVhc3QgMyBzaWRlcyEnKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBlbHNlIHsgcmV0dXJuIGZhbHNlOyB9XG4gICAgfVxuICB9XG5cbiAgY29uc3QgdGVzc2VsYXRpb24gPSBuZXcgVGVzc2VsYXRpb24oZGlzaywgNSwgNCwgMypNYXRoLlBJLzYqMCwgJ3JlZCcpO1xuXG59KTtcbiJdfQ==
