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
  // *   DISK CLASS
  // *   Poincare Disk representation of the hyperbolic plane
  // *
  // *************************************************************************

  var Disk = function () {
    function Disk() {
      _classCallCheck(this, Disk);

      this.x = window.innerWidth / 2;
      this.y = window.innerHeight / 2;

      //transform the canvas so the origin is at the centre of the disk
      ctx.translate(this.x, this.y);

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

        if (p1.x > ox && p2.x > ox) {
          if (p1.y > oy && p2.y < oy) return { p1: p2, p2: p1 };else if (p1.y < oy && p2.y > oy) return { p1: p1, p2: p2 };
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
        if (distance(point, this.centre) > r) {
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

      this.rotation = rotation || 0;
      this.disk = disk;
      this.p = p;
      this.q = q;
      this.colour = colour || 'black';

      if (this.checkParams()) {
        return false;
      }

      this.q = q;
      this.maxLayers = 3;
      this.limit = 1800;

      //array of all lines that have been reflected over
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
    }, {
      key: 'tesselation',
      value: function tesselation() {
        var vertices = this.fundamentalPolygon();
        this.disk.polygon(vertices, this.colour);
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
            if (!_this.alreadyReflected(p1, p2)) {
              (function () {
                var newVertices = _this.reflectPolygon(vertices, p1, p2);
                _this.disk.polygon(newVertices, _this.colour);
                window.setTimeout(function () {
                  _this.recursivePolyGen(newVertices, p1, p2, layer++);
                }, 500);
              })();
            }
          }
        };

        for (var i = 0; i < l; i++) {
          _loop(i);
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
        var p = circleLineIntersect(centre, r, this.disk.centre, b).p1;

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

  var tesselation = new Tesselation(disk, 5, 4, 3 * Math.PI / 6 * 0, 'red');

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
