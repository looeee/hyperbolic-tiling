(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// * ***********************************************************************
// *
// *   PRE-SETUP
// *
// *************************************************************************
document.write('<canvas id="canvas" width="' + window.innerWidth + '" height="' + window.innerHeight + '"> \
  <h1> Canvas doesn\'t seem to be working! </h1> \
</canvas>');

// * ***********************************************************************
// *
// *   CONSTANTS
// *   define any global constants here
// *
// *************************************************************************
var canvas = $('#canvas')[0];
var ctx = canvas.getContext('2d');

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

//find the centroid of a non-self-intersecting polygon
var centroidOfPolygon = function centroidOfPolygon(points) {
  var first = pts[0],
      last = pts[pts.length - 1];
  if (first.x != last.x || first.y != last.y) pts.push(first);
  var twicearea = 0,
      x = 0,
      y = 0,
      nPts = pts.length,
      p1 = undefined,
      p2 = undefined,
      f = undefined;
  for (var i = 0, j = nPts - 1; i < nPts; j = i++) {
    p1 = pts[i];p2 = pts[j];
    f = p1.x * p2.y - p2.x * p1.y;
    twicearea += f;
    x += (p1.x + p2.x) * f;
    y += (p1.y + p2.y) * f;
  }
  f = twicearea * 3;
  return { x: x / f, y: y / f };
};

//distance between two points
var distance = function distance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

//midpoint of the line segment connecting two points
var midpoint = function midpoint(p1, p2) {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  };
};

//slope of line through p1, p2
var slope = function slope(p1, p2) {
  return (p2.x - p1.x) / (p2.y - p1.y);
};

//slope of line perpendicular to a line defined by p1,p2
var perpendicularSlope = function perpendicularSlope(p1, p2) {
  return -1 / Math.pow(slope(p1, p2), -1);
};

//intersection point of two lines defined by p1,m1 and q1,m2
//NOT WORKING FOR VERTICAL LINES!!!
var intersection = function intersection(p1, m1, p2, m2) {
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

var radians = function radians(degrees) {
  return Math.PI / 180 * degrees;
};

//get the circle inverse of a point p with respect a circle radius r centre c
var inverse = function inverse(p, r, c) {
  var alpha = r * r / (Math.pow(p.x - c.x, 2) + Math.pow(p.y - c.y, 2));
  return {
    x: alpha * (p.x - c.x) + c.x,
    y: alpha * (p.y - c.y) + c.y
  };
};

//calculate the radius and centre of the circle required to draw a line between
//two points in the hyperbolic plane defined by the disk (r, c)
var greatCircle = function greatCircle(p1, p2, r, c) {
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
var greatCircleV2 = function greatCircleV2(p1, p2, r) {
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
var circleIntersect = function circleIntersect(c0, c1, r0, r1) {
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

var circleLineIntersect = function circleLineIntersect(c, r, p1, p2) {

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
var centralAngle = function centralAngle(p1, p2, r) {
  return 2 * Math.asin(0.5 * distance(p1, p2) / r);
};

//calculate the normal vector given 2 points
var normalVector = function normalVector(p1, p2) {
  var d = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  return {
    x: (p2.x - p1.x) / d,
    y: (p2.y - p1.y) / d
  };
};

//does the line connecting p1, p2 go through the point (0,0)?
var throughOrigin = function throughOrigin(p1, p2) {
  if (p1.x === 0 && p2.x === 0) {
    //vertical line through centre
    return true;
  }
  var test = (-p1.x * p2.y + p1.x * p1.y) / (p2.x - p1.x) + p1.y;
  if (test === 0) return true;else return false;
};

//flip a set of points over a hyperoblic line defined by two points
var transform = function transform(pointsArray, p1, p2) {
  var newPointsArray = [];
  var c = greatCircle(p1, p2, disk.radius, disk.centre);

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = pointsArray[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var p = _step.value;

      var newP = inverse(p, c.radius, c.centre);
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
// *   CANVAS UTILITY FUNCTIONS
// *
// *************************************************************************

//draw a hyperbolic line segment using calculations from line() or arc()
var drawSegment = function drawSegment(c, alpha, alphaOffset, colour, width) {
  ctx.beginPath();
  ctx.arc(c.centre.x, c.centre.y, c.radius, alphaOffset, alpha + alphaOffset);
  ctx.strokeStyle = colour || 'black';
  ctx.lineWidth = width || 1;
  ctx.stroke();
};

//draw a (euclidean) line between two points
var euclideanLine = function euclideanLine(p1, p2, colour, width) {
  var c = colour || 'black';
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.strokeStyle = c;
  ctx.lineWidth = width || 1;
  ctx.stroke();
};

//draw a point on the disk, optional radius and colour
var drawPoint = function drawPoint(point, radius, colour) {
  var col = colour || 'black';
  var r = radius || 2;
  ctx.beginPath();
  ctx.arc(point.x, point.y, r, 0, Math.PI * 2, true);
  ctx.fillStyle = col;
  ctx.fill();
};

//draw a circle of radius r centre c and optional colour
var drawCircle = function drawCircle(c, r, colour, width) {
  var col = colour || 'black';
  ctx.beginPath();
  ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
  ctx.strokeStyle = col;
  ctx.lineWidth = width || 1;
  ctx.stroke();
};

// * ***********************************************************************
// *
// *   DOCUMENT READY
// *
// *************************************************************************
$(document).ready(function () {

  // * ***********************************************************************
  // *
  // *  DIMENSIONS CLASS
  // *  Hold references to any dimensions used in calculations and
  // *  recalculate as needed (e.g. on window resize)
  // *
  // *************************************************************************

  var Dimensions = function () {
    function Dimensions() {
      var _this = this;

      _classCallCheck(this, Dimensions);

      //set the dimensions on load
      this.setDims();

      $(window).resize(function () {
        //reset the dimensions on window resize
        _this.setDims();
      });
    }

    _createClass(Dimensions, [{
      key: 'setDims',
      value: function setDims() {
        this.windowWidth = window.innerWidth;
        this.windowHeight = window.innerHeight;
      }
    }]);

    return Dimensions;
  }();

  var dims = new Dimensions();

  // * ***********************************************************************
  // *
  // *   DISK CLASS
  // *   Poincare Disk representation of the hyperbolic plane
  // *
  // *************************************************************************

  var Disk = function () {
    function Disk() {
      _classCallCheck(this, Disk);

      this.x = dims.windowWidth / 2;
      this.y = dims.windowHeight / 2;

      //transform the canvas so the origin is at the centre of the disk
      ctx.translate(this.x, this.y);

      this.centre = {
        x: 0,
        y: 0
      };

      //draw largest circle possible given window dims
      this.radius = dims.windowWidth < dims.windowHeight ? dims.windowWidth / 2 - 5 : dims.windowHeight / 2 - 5;

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

        if (throughOrigin(p1, p2)) {
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
          c = greatCircle(p1, p2, this.radius, this.centre);
          points = circleIntersect(this.centre, c.centre, this.radius, c.radius);

          //angle subtended by the arc
          var alpha = centralAngle(points.p1, points.p2, c.radius);

          var offset = this.alphaOffset(points.p2, points.p2, c, 'line');
          drawSegment(c, alpha, offset, col);
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
          offset = 2 * Math.PI - centralAngle(p1, p, c.radius);
        } else {
          offset = centralAngle(p1, p, c.radius);
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
        if (p1.y > oy && p2.y < oy && p1.x > ox && p2.x > ox) {
          return { p1: p2, p2: p1 };
        }

        var alpha1 = centralAngle(p, p1, c.radius);
        alpha1 = p1.y < c.centre.y ? 2 * Math.PI - alpha1 : alpha1;
        var alpha2 = centralAngle(p, p2, c.radius);
        alpha2 = p2.y < c.centre.y ? 2 * Math.PI - alpha2 : alpha2;

        //if the points are not in clockwise order flip them
        if (alpha1 > alpha2) return { p1: p2, p2: p1 };else return { p1: p1, p2: p2 };
      }

      //Draw an arc (hyperbolic line segment) between two points on the disk

    }, {
      key: 'arc',
      value: function arc(p1, p2, colour) {
        if (throughOrigin(p1, p2)) {
          euclideanLine(p1, p2, colour);
          return;
        }
        var col = colour || 'black';
        var c = greatCircle(p1, p2, this.radius, this.centre);
        var pts = this.prepPoints(p1, p2, c);
        p1 = pts.p1;
        p2 = pts.p2;

        //length of the arc
        var alpha = centralAngle(p1, p2, c.radius);

        //how far around the greatCircle to start drawing the arc
        var offset = this.alphaOffset(p1, p2, c, 'arc');
        drawSegment(c, alpha, offset, colour);
      }
    }, {
      key: 'polygon',
      value: function polygon(pointsArray, colour) {
        var l = pointsArray.length;

        for (var i = 0; i < l; i++) {
          this.arc(pointsArray[i], pointsArray[(i + 1) % l], colour);
        }
      }

      //return true if the point is not in the disk

    }, {
      key: 'checkPoint',
      value: function checkPoint(p) {
        var r = this.radius;
        if (distance(p, this.centre) > r) {
          console.error('Error! Point (' + p.x + ', ' + p.y + ') lies outside the plane!');
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
    function Tesselation(disk, p, q) {
      _classCallCheck(this, Tesselation);

      this.level = 220;
      this.disk = disk;
      this.p = p;
      this.q = q;

      if (this.checkParams()) {
        return false;
      }

      //an array which will hold coordinates of pairs of points that have been
      //drawn so far to prevent duplication
      this.drawnArray = [];

      this.p = p;
      if (this.p < 3) {
        console.error('Tesselation error: polygon needs at least 3 sides!');
        return;
      }
      this.q = q;
      if (this.q < 3) {
        console.error('Tesselation error: at least 3 p-gons must meet \
                      at each vertex!');
        return;
      }

      this.reflectedLines = [];

      this.tesselation();
    }

    //The tesselation requires that (p-2)(q-2) > 4 to work (otherwise it is
    // either an elliptical or euclidean tesselation);

    _createClass(Tesselation, [{
      key: 'checkParams',
      value: function checkParams() {
        if ((this.p - 2) * (this.q - 2) <= 4) {
          console.error('Hyperbolic tesselations require that (p-1)(q-2) < 4!');
          return true;
        } else {
          return false;
        }
      }
    }, {
      key: 'tesselation',
      value: function tesselation() {
        var vertices = this.fundamentalPolygon();
        this.disk.polygon(vertices, 'red');

        this.recursivePolyGen(vertices, { x: 0, y: 0 }, { x: 0, y: 0 });
      }

      //recursively refelct each polygon over each edge, draw the new polygons
      //and repeat for each of their edges

    }, {
      key: 'recursivePolyGen',
      value: function recursivePolyGen(vertices, prevP1, prevP2) {
        var _this2 = this;

        if (this.level === 0) {
          return;
        };
        this.level--;
        var l = vertices.length;

        var _loop = function _loop(i) {
          if (!comparePoints(vertices[i], prevP1) && !comparePoints(vertices[(i + 1) % l], prevP2)) {
            (function () {
              var newVertices = _this2.reflectPolygon(vertices, vertices[i], vertices[(i + 1) % l]);
              _this2.disk.polygon(newVertices, 'red');
              if (distance(vertices[i], vertices[(i + 1) % l]) > 0.01) {
                window.setTimeout(function () {
                  _this2.recursivePolyGen(newVertices, vertices[i], vertices[(i + 1) % l]);
                }, 1000);
              }
            })();
          }
        };

        for (var i = 0; i < l; i++) {
          _loop(i);
        }
      }

      //check if a particular line has already been to do a reflection and if not
      //add the current line to the array

    }, {
      key: 'linesOfReflection',
      value: function linesOfReflection(p1, p2) {
        console.log(this.reflectedLines);
        if ($.inArray(points, this.reflectedLines) === -1) {
          this.reflectedLines.push(points);
          return false;
        } else {
          return true;
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
        return circleLineIntersect(centre, r, this.disk.centre, b).p1;
      }

      //reflect the polygon defined by it's vertices across the line p1, p2

    }, {
      key: 'reflectPolygon',
      value: function reflectPolygon(vertices, p1, p2) {
        var l = vertices.length;
        var newVertices = [];
        var c = greatCircle(p1, p2, this.disk.radius, this.disk.centre);
        for (var i = 0; i < l; i++) {
          var p = inverse(vertices[i], c.radius, c.centre);
          newVertices.push(p);
        }

        return newVertices;
      }
    }]);

    return Tesselation;
  }();

  var tesselation = new Tesselation(disk, 4, 5);

  // * ***********************************************************************
  // *
  // *   CANVAS CLASS
  // *
  // *
  // *************************************************************************

  var Canvas = function () {
    function Canvas() {
      _classCallCheck(this, Canvas);

      //this.tesellations();
      this.draw();
      $(window).resize(function () {
        //this.clear();
        //this.draw();
      });

      //this.saveImage();
      //this.clear();
    }

    _createClass(Canvas, [{
      key: 'draw',
      value: function draw() {
        disk.outerCircle();
        drawPoint(disk.centre);

        /*
        //TESTING
        let p1 = {
          x: -53.395036426959535,
          y: -3.552713678800501e-15
        }
         let p2 = {
          x: -16.49997367119987,
          y: 50.78169733167696
        }
          //disk.line(p1,p2, 'black');
        disk.arc(p1,p2, 'red');
         drawPoint(p1, 5, 'green');
        drawPoint(p2, 5, 'blue');
         p1 = {
          x: 104.7936594333809,
          y: 5.936864064325499e-14
        }
         p2 = {
          x: 91.08228051326563,
          y: 29.59442691657064
        }
          //disk.line(p1,p2, 'black');
        disk.arc(p1,p2, 'red');
         drawPoint(p1, 5, 'green');
        drawPoint(p2, 5, 'blue');
        */
      }
    }, {
      key: 'tesellations',
      value: function tesellations() {
        for (var i = 3; i < 11; i++) {
          this.draw();

          new Tesselation(disk, i, 3, 50, 0);

          this.saveImage();
          this.clear();
        }
      }

      //the canvas has been translated to the centre of the disk so need to
      //use an offset to clear it. NOT WORKING WHEN SCREEN IS RESIZED

    }, {
      key: 'clear',
      value: function clear() {
        ctx.clearRect(-window.innerWidth / 2, -window.innerHeight / 2, window.innerWidth, window.innerHeight);
      }

      //convert the canvas to a base64URL and send to saveImage.php

    }, {
      key: 'saveImage',
      value: function saveImage() {
        var data = canvas.toDataURL();
        $.ajax({
          type: 'POST',
          url: 'saveImage.php',
          data: { img: data }
        });
      }
    }]);

    return Canvas;
  }();

  var canvas = new Canvas();
});

},{}]},{},[1]);
