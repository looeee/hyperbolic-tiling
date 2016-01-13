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

// * ***********************************************************************
// *
// *   HELPER FUNCTIONS
// *   define any global helper functions here
// *
// *************************************************************************

var radians = function radians(degrees) {
  return Math.PI / 180 * degrees;
};

// * ***********************************************************************
// *
// *   DOCUMENT READY
// *
// *************************************************************************
$(document).ready(function () {

  // * ***********************************************************************
  // *
  // *  ELEMENTS CLASS
  // *  Holds references to any elements used
  // *
  // *************************************************************************

  var Elements = function Elements() {
    _classCallCheck(this, Elements);

    this.canvas = $('#canvas')[0];
    this.ctx = this.canvas.getContext('2d');
  };

  var elems = new Elements();

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
  // *   LAYOUT CLASS
  // *   overall layout set up goes here
  // *
  // *************************************************************************

  var Layout = function Layout() {
    _classCallCheck(this, Layout);

    $(window).resize(function () {});
  };

  var layout = new Layout();

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
      elems.ctx.translate(this.x, this.y);

      this.centre = {
        x: 0,
        y: 0
      };

      //draw largest circle possible given window dims
      this.radius = dims.windowWidth < dims.windowHeight ? dims.windowWidth / 2 - 5 : dims.windowHeight / 2 - 5;

      //smaller circle for testing
      //this.radius = this.radius / 2;

      this.color = 'black';

      this.drawOuterCircle();
      this.drawPoint(this.centre);

      var p1 = {
        x: -60,
        y: -40
      };

      var p2 = {
        x: -60,
        y: 100
      };
      this.drawPoint(p1);
      this.drawPoint(p2);

      this.drawArc(p1, p2);
    }

    _createClass(Disk, [{
      key: 'drawOuterCircle',
      value: function drawOuterCircle() {
        elems.ctx.beginPath();
        elems.ctx.arc(this.centre.x, this.centre.y, this.radius, 0, Math.PI * 2);
        elems.ctx.closePath();
        elems.ctx.strokeStyle = this.color;
        elems.ctx.stroke();
      }

      //draw a point on the disk, optional radius and colour

    }, {
      key: 'drawPoint',
      value: function drawPoint(point, radius, colour) {
        var c = colour || 'black';
        var r = radius || 2;
        elems.ctx.beginPath();
        elems.ctx.arc(point.x, point.y, r, 0, Math.PI * 2, true);
        elems.ctx.closePath();
        elems.ctx.fillStyle = c;
        elems.ctx.fill();
      }

      //Draw an arc (hyperbolic line) between two points on the disk

    }, {
      key: 'drawArc',
      value: function drawArc(p1, p2) {
        var p1Inverse = this.inverse(p1);
        var p2Inverse = this.inverse(p2);

        var m = this.midpoint(p1, p1Inverse);
        var n = this.midpoint(p2, p2Inverse);

        var m1 = this.perpendicularSlope(m, p1Inverse);
        var m2 = this.perpendicularSlope(n, p2Inverse);

        //intersect is the centrepoint of the circle out of which the arc is made
        var intersect = this.intersection(m, m1, n, m2);
        var radius = this.distance(intersect, p1);

        //draw the arch
        elems.ctx.beginPath();
        elems.ctx.arc(intersect.x, intersect.y, radius, 0, Math.PI * 2, true);
        elems.ctx.closePath();
        elems.ctx.strokeStyle = this.color;
        elems.ctx.stroke();
      }

      //get the inverse of a point with respect to the circular
      //boundary of the disk

    }, {
      key: 'inverse',
      value: function inverse(point) {
        var alpha = this.radius * this.radius / (Math.pow(point.x - this.centre.x, 2) + Math.pow(point.y - this.centre.y, 2));
        var inversePoint = {
          x: alpha * (point.x - this.centre.x) + this.centre.x,
          y: alpha * (point.y - this.centre.y) + this.centre.y
        };
        return inversePoint;
      }

      //distance between two points

    }, {
      key: 'distance',
      value: function distance(p1, p2) {
        return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
      }

      //midpoint of the line segment connecting two points

    }, {
      key: 'midpoint',
      value: function midpoint(p1, p2) {
        return {
          x: (p1.x + p2.x) / 2,
          y: (p1.y + p2.y) / 2
        };
      }

      //slope of line through p1, p2

    }, {
      key: 'slope',
      value: function slope(p1, p2) {
        return (p2.x - p1.x) / (p2.y - p1.y);
      }

      //slope of line perpendicular to a line defined by p1,p2

    }, {
      key: 'perpendicularSlope',
      value: function perpendicularSlope(p1, p2) {
        return -1 / Math.pow(this.slope(p1, p2), -1);
      }

      //intersection point of two lines defined by p1,m1 and q1,m2

    }, {
      key: 'intersection',
      value: function intersection(p1, m1, p2, m2) {
        //y intercept of first line
        var c1 = p1.y - m1 * p1.x;
        //y intercept of second line
        var c2 = p2.y - m2 * p2.x;

        var x = (c2 - c1) / (m1 - m2);
        var y = m1 * x + c1;
        return {
          x: x,
          y: y
        };
      }

      //draw a (euclidean) line between two points

    }, {
      key: 'drawLine',
      value: function drawLine(p1, p2, colour) {
        var c = colour || 'black';
        elems.ctx.beginPath();
        elems.ctx.moveTo(p1.x, p1.y);
        elems.ctx.lineTo(p2.x, p2.y);
        elems.ctx.strokeStyle = c;
        elems.ctx.stroke();
      }
    }]);

    return Disk;
  }();

  // * ***********************************************************************
  // *
  // *   CANVAS CLASS
  // *
  // *
  // *************************************************************************

  var Canvas = function () {
    function Canvas() {
      _classCallCheck(this, Canvas);

      this.disk = new Disk();
    }

    _createClass(Canvas, [{
      key: 'draw',
      value: function draw() {}
    }, {
      key: 'clear',
      value: function clear() {}
    }]);

    return Canvas;
  }();

  var canvas = new Canvas();
});

},{}]},{},[1]);
