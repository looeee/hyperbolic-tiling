(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Disk = undefined;

var _euclid = require('./euclid');

var E = _interopRequireWildcard(_euclid);

var _hyperbolic = require('./hyperbolic');

var H = _interopRequireWildcard(_hyperbolic);

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

      this.circle = {
        centre: this.centre,
        radius: this.radius
      };
      //smaller circle for testing
      //this.radius = this.radius / 2;

      this.drawDisk();

      //this.testing();
    }
  }, {
    key: 'testing',
    value: function testing() {
      var p1 = {
        x: 100,
        y: 250
      };
      var p2 = {
        x: -150,
        y: 150
      };
      var p3 = {
        x: -70,
        y: -250
      };

      var p4 = {
        x: -170,
        y: -150
      };

      var p5 = {
        x: 170,
        y: -150
      };
      this.point(p1, 5, 0xf00f0f);
      this.point(p2, 5, 0xffff0f);
      this.point(p3, 5, 0x1d00d5);
      this.point(p4, 5, 0x00ff0f);
      this.point(p5, 5, 0x359543);

      /*
      const a = H.arc(p1, p2);
       this.draw.disk(a.c.centre, a.c.radius, 0xffffff, false);
       const p4 = E.nextPoint(a.c, p2, 20).p1;
      console.log(p4);
         //this.drawArc(p2, p3, 0xf00f0f);
      */
      //this.polygonOutline([p1, p2, p3],0xf00f0f)
      this.polygon([p1, p2, p4, p3, p5], 0x70069a);
      //this.polygon([p2, p3, p4]);
    }
  }, {
    key: 'getRadius',
    value: function getRadius() {
      return this.radius;
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
      this.draw.disk(centre, radius, color, false);
    }

    //draw a hyperbolic line between two points on the boundary circle
    //TODO: fix!

  }, {
    key: 'line',
    value: function line(p1, p2, color) {
      var c = E.greatCircle(p1, p2, this.radius, this.centre);
      var points = E.circleIntersect(this.centre, c.centre, this.radius, c.radius);

      this.drawArc(points.p1, points.p2, color);
    }

    //Draw an arc (hyperbolic line segment) between two points on the disk

  }, {
    key: 'drawArc',
    value: function drawArc(p1, p2, colour) {
      //check that the points are in the disk
      if (this.checkPoints(p1, p2)) {
        return false;
      }
      var col = colour || 0xffffff;
      if (E.throughOrigin(p1, p2)) {
        this.draw.line(p1, p2, col);
      } else {
        var arc = H.arc(p1, p2, this.circle);
        this.draw.segment(arc.c, arc.startAngle, arc.endAngle, colour);
      }
    }
  }, {
    key: 'polygonOutline',
    value: function polygonOutline(vertices, colour) {
      var l = vertices.length;
      for (var i = 0; i < l; i++) {
        this.drawArc(vertices[i], vertices[(i + 1) % l], colour);
      }
    }

    //create an array of points spaced equally around the arcs defining a hyperbolic
    //polygon and pass these to ThreeJS.polygon()
    //TODO make spacing a function of final resolution
    //TODO check whether vertices are in the right order

  }, {
    key: 'polygon',
    value: function polygon(vertices, color, texture) {
      var points = [];
      var spacing = 5;
      var l = vertices.length;
      for (var i = 0; i < l; i++) {
        var p = undefined;
        var a = H.arc(vertices[i], vertices[(i + 1) % l], this.circle);

        if (a.clockwise) {
          p = E.nextPoint(a.c, vertices[i], spacing).p2;
        } else {
          p = E.nextPoint(a.c, vertices[i], spacing).p1;
        }
        points.push(p);

        while (E.distance(p, vertices[(i + 1) % l]) > spacing) {

          if (a.clockwise) {
            p = E.nextPoint(a.c, p, spacing).p2;
          } else {
            p = E.nextPoint(a.c, p, spacing).p1;
          }

          points.push(p);
        }
        points.push(vertices[(i + 1) % l]);
      }
      this.draw.polygon(points, color, texture);
    }

    //return true if any of the points is not in the disk

  }, {
    key: 'checkPoints',
    value: function checkPoints() {
      var r = this.radius;
      var test = false;

      for (var _len = arguments.length, points = Array(_len), _key = 0; _key < _len; _key++) {
        points[_key] = arguments[_key];
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = points[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var point = _step.value;

          if (E.distance(point, this.centre) > r) {
            console.error('Error! Point (' + point.x + ', ' + point.y + ') lies outside the plane!');
            test = true;
          }
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

      if (test) return true;else return false;
    }
  }]);

  return Disk;
}();

},{"./euclid":2,"./hyperbolic":3,"./threejs":6}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// * ***********************************************************************
// *
// *   EUCLIDEAN FUNCTIONS
// *   a place to stash all the functions that are euclidean geometrical
// *   operations
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
  var p = {
    x: t * dx + p1.x,
    y: t * dy + p1.y
  };

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

    return {
      p1: q1,
      p2: q2
    };
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
    p1 = points[i];
    p2 = points[j];
    f = p1.x * p2.y - p2.x * p1.y;
    twicearea += f;
    x += (p1.x + p2.x) * f;
    y += (p1.y + p2.y) * f;
  }
  f = twicearea * 3;
  return {
    x: x / f,
    y: y / f
  };
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

//find a point at a distance d along the circumference of
//a circle of radius r, centre c from a point also
//on the circumference
var nextPoint = exports.nextPoint = function nextPoint(circle, point, d) {
  var cosTheta = -(d * d / (2 * circle.radius * circle.radius) - 1);
  var sinThetaPos = Math.sqrt(1 - Math.pow(cosTheta, 2));
  var sinThetaNeg = -sinThetaPos;

  var xPos = circle.centre.x + cosTheta * (point.x - circle.centre.x) - sinThetaPos * (point.y - circle.centre.y);
  var xNeg = circle.centre.x + cosTheta * (point.x - circle.centre.x) - sinThetaNeg * (point.y - circle.centre.y);
  var yPos = circle.centre.y + sinThetaPos * (point.x - circle.centre.x) + cosTheta * (point.y - circle.centre.y);
  var yNeg = circle.centre.y + sinThetaNeg * (point.x - circle.centre.x) + cosTheta * (point.y - circle.centre.y);

  var p1 = {
    x: xPos,
    y: yPos
  };
  var p2 = {
    x: xNeg,
    y: yNeg
  };
  return {
    p1: p1,
    p2: p2
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

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rotatePgonAboutOrigin = exports.rotateAboutOriginWeierstrass = exports.weierstrassToPoincare = exports.poincareToWeierstrass = exports.reflect = exports.rotation = exports.translateX = exports.arc = undefined;

var _euclid = require('./euclid');

var E = _interopRequireWildcard(_euclid);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// * ***********************************************************************
// *
// *   HYPERBOLIC FUNCTIONS
// *   a place to stash all the functions that are hyperbolic gemeometrical
// *   operations
// *
// *************************************************************************

//calculate greatCircle, startAngle and endAngle for hyperbolic arc
//TODO deal with case of staight lines through centre
var arc = exports.arc = function arc(p1, p2, circle) {
  var clockwise = false;
  var alpha1 = undefined,
      alpha2 = undefined,
      startAngle = undefined,
      endAngle = undefined;
  var c = E.greatCircle(p1, p2, circle.radius, circle.centre);

  var oy = c.centre.y;
  var ox = c.centre.x;

  //point at 0 radians on c
  var p3 = {
    x: ox + c.radius,
    y: oy
  };

  //calculate the position of each point in the circle
  alpha1 = E.centralAngle(p3, p1, c.radius);
  alpha1 = p1.y < oy ? 2 * Math.PI - alpha1 : alpha1;
  alpha2 = E.centralAngle(p3, p2, c.radius);
  alpha2 = p2.y < oy ? 2 * Math.PI - alpha2 : alpha2;

  //case where p1 above and p2 below the line c.centre -> p3
  if (p1.x > ox && p2.x > ox && p1.y < oy && p2.y > oy) {
    startAngle = alpha1;
    endAngle = alpha2;
  }
  //case where p2 above and p1 below the line c.centre -> p3
  else if (p1.x > ox && p2.x > ox && p1.y > oy && p2.y < oy) {
      startAngle = alpha2;
      endAngle = alpha1;
      clockwise = true;
    }
    //points in clockwise order
    else if (alpha1 > alpha2) {
        startAngle = alpha2;
        endAngle = alpha1;
        clockwise = true;
      }
      //points in anticlockwise order
      else {
          startAngle = alpha1;
          endAngle = alpha2;
        }

  return {
    c: c,
    startAngle: startAngle,
    endAngle: endAngle,
    clockwise: clockwise
  };
};

//translate a set of points along the x axis
var translateX = exports.translateX = function translateX(pointsArray, distance) {
  var l = pointsArray.length;
  var newPoints = [];
  var e = Math.pow(Math.E, distance);
  var pos = e + 1;
  var neg = e - 1;
  for (var i = 0; i < l; i++) {
    var x = pos * pointsArray[i].x + neg * pointsArray[i].y;
    var y = neg * pointsArray[i].x + pos * pointsArray[i].y;
    newPoints.push({
      x: x,
      y: y
    });
  }
  return newPoints;
};

//rotate a set of points about a point by a given angle
//clockwise defaults to false
var rotation = exports.rotation = function rotation(pointsArray, point, angle, clockwise) {};

//reflect a set of points across a hyperbolic arc
//TODO add case where reflection is across straight line
var reflect = exports.reflect = function reflect(pointsArray, p1, p2, circle) {
  var l = pointsArray.length;
  var a = arc(p1, p2, circle);
  var newPoints = [];
  for (var i = 0; i < l; i++) {
    newPoints.push(E.inverse(pointsArray[i], a.c.radius, a.c.centre));
  }
  return newPoints;
};

var poincareToWeierstrass = exports.poincareToWeierstrass = function poincareToWeierstrass(point2D) {
  var factor = 1 / (1 - point2D.x * point2D.x - point2D.y * point2D.y);
  return {
    x: 2 * factor * point2D.x,
    y: 2 * factor * point2D.y,
    z: factor * (1 + point2D.x * point2D.x + point2D.y * point2D.y)
  };
};

var weierstrassToPoincare = exports.weierstrassToPoincare = function weierstrassToPoincare(point3D) {
  var factor = 1 / (1 + point3D.z);
  return {
    x: factor * point3D.x,
    y: factor * point3D.y
  };
};

var rotateAboutOriginWeierstrass = exports.rotateAboutOriginWeierstrass = function rotateAboutOriginWeierstrass(point3D, angle) {
  return {
    x: Math.cos(angle) * point3D.x - Math.sin(angle) * point3D.y,
    y: Math.sin(angle) * point3D.x + Math.cos(angle) * point3D.y,
    z: point3D.z
  };
};

var rotatePgonAboutOrigin = exports.rotatePgonAboutOrigin = function rotatePgonAboutOrigin(points2DArray, angle) {
  var l = points2DArray.length;
  var rotatedPoints2DArray = [];
  for (var i = 0; i < l; i++) {
    var point = poincareToWeierstrass(points2DArray[i]);
    point = rotateAboutOriginWeierstrass(point, angle);
    point = weierstrassToPoincare(point);
    rotatedPoints2DArray.push(point);
  }
  return rotatedPoints2DArray;
};

},{"./euclid":2}],4:[function(require,module,exports){
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

//const disk = new Disk();

var tesselation = new _regularTesselation.RegularTesselation(4, 5, 0, 'red');

},{"./disk":1,"./euclid":2,"./regularTesselation":5}],5:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RegularTesselation = undefined;

var _euclid = require('./euclid');

var E = _interopRequireWildcard(_euclid);

var _hyperbolic = require('./hyperbolic');

var H = _interopRequireWildcard(_hyperbolic);

var _disk = require('./disk');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// * ***********************************************************************
// *    TESSELATION CLASS
// *    Creates a regular Tesselation of the Poincare Disk
// *    q: number of p-gons meeting at each vertex
// *    p: number of sides of p-gon
// *    using the techniques created by Coxeter and Dunham
// *
// *************************************************************************

var RegularTesselation = exports.RegularTesselation = function () {
  function RegularTesselation(p, q, rotation, colour, maxLayers) {
    var _this = this;

    _classCallCheck(this, RegularTesselation);

    this.disk = new _disk.Disk();

    this.centre = {
      x: 0,
      y: 0
    };
    this.p = p;
    this.q = q;
    this.colour = colour || 'black';
    this.rotation = rotation || 0;
    this.maxLayers = maxLayers || 5;

    if (this.checkParams()) {
      return false;
    }

    window.addEventListener('load', function (event) {
      window.removeEventListener('load');
      _this.init();
    }, false);

    window.addEventListener('resize', function () {
      _this.init();
    }, false);
  }

  _createClass(RegularTesselation, [{
    key: 'init',
    value: function init() {
      this.radius = this.disk.getRadius();
      this.fr = this.fundamentalRegion();
      this.testing();
    }
  }, {
    key: 'testing',
    value: function testing() {
      //this.disk.polygonOutline([this.fr.a, this.fr.b, this.fr.c], 0x5312ba);
      this.disk.polygon(this.fr, 0xe80348);
      var poly2 = H.reflect(this.fr, this.fr[1], this.fr[2], this.disk.circle);

      this.disk.polygon(poly2, 0xc3167e);

      var poly3 = H.rotatePgonAboutOrigin(this.fr, Math.PI);
      console.table(poly3);
      this.disk.polygon(poly3, 0xd2be11);
    }

    //calculate first point of fundamental polygon using Coxeter's method

  }, {
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
      var centre = {
        x: d,
        y: 0
      };
      //there will be two points of intersection, of which we want the first
      var p1 = E.circleLineIntersect(centre, r, this.disk.centre, b).p1;

      var p2 = {
        x: d - r,
        y: 0
      };

      var points = [this.disk.centre, p1, p2];

      return points;
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
}();

},{"./disk":1,"./euclid":2,"./hyperbolic":3}],6:[function(require,module,exports){
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
      this.camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -2, 1);
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
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      });
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
    key: 'segment',
    value: function segment(circle, alpha, offset, color) {
      var col = color;
      if (col === 'undefined') col = 0xffffff;

      var curve = new THREE.EllipseCurve(circle.centre.x, circle.centre.y, // ax, aY
      circle.radius, circle.radius, // xRadius, yRadius
      alpha, offset, // aStartAngle, aEndAngle
      false // aClockwise
      );

      var points = curve.getSpacedPoints(100);

      var path = new THREE.Path();
      var geometry = path.createGeometry(points);

      var material = new THREE.LineBasicMaterial({
        color: col
      });
      var s = new THREE.Line(geometry, material);

      this.scene.add(s);
    }
  }, {
    key: 'line',
    value: function line(start, end, color) {
      var col = color;
      if (col === 'undefined') col = 0xffffff;

      var geometry = new THREE.Geometry();

      geometry.vertices.push(new THREE.Vector3(start.x, start.y, 0), new THREE.Vector3(end.x, end.y, 0));
      var material = new THREE.LineBasicMaterial({
        color: col
      });
      var l = new THREE.Line(geometry, material);
      this.scene.add(l);
    }
  }, {
    key: 'polygon',
    value: function polygon(vertices, color, texture) {
      var col = color;
      if (col === 'undefined') col = 0xffffff;

      var poly = new THREE.Shape();
      poly.moveTo(vertices[0].x, vertices[0].y);

      for (var i = 1; i < vertices.length; i++) {
        poly.lineTo(vertices[i].x, vertices[i].y);
      }

      poly.lineTo(vertices[0].x, vertices[0].y);

      var geometry = new THREE.ShapeGeometry(poly);

      this.scene.add(this.createMesh(geometry, color, texture));
    }
  }, {
    key: 'createMesh',
    value: function createMesh(geometry, color, imageURL) {
      var col = color;
      if (col === 'undefined') col = 0xffffff;
      var material = new THREE.MeshBasicMaterial({
        color: col
      });

      //wireframe: true
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

      this.renderer.render(this.scene, this.camera);
    }
  }]);

  return ThreeJS;
}();

},{}]},{},[4])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJlczIwMTUvZGlzay5qcyIsImVzMjAxNS9ldWNsaWQuanMiLCJlczIwMTUvaHlwZXJib2xpYy5qcyIsImVzMjAxNS9tYWluLmpzIiwiZXMyMDE1L3JlZ3VsYXJUZXNzZWxhdGlvbi5qcyIsImVzMjAxNS90aHJlZWpzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7SUNBWSxDQUFDOzs7O0lBQ0QsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztJQWNBLElBQUksV0FBSixJQUFJO0FBQ2YsV0FEVyxJQUFJLEdBQ0Q7OzswQkFESCxJQUFJOztBQUViLFFBQUksQ0FBQyxJQUFJLEdBQUcsYUFiZCxPQUFPLEVBYW9CLENBQUM7O0FBRTFCLFVBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDekMsWUFBTSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ25DLFlBQUssSUFBSSxFQUFFLENBQUM7S0FDYixFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUVWLFVBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsWUFBTTtBQUN0QyxZQUFLLElBQUksRUFBRSxDQUFDO0tBQ2IsRUFBRSxLQUFLLENBQUMsQ0FBQztHQUVYOztlQWJVLElBQUk7OzJCQWVSO0FBQ0wsVUFBSSxDQUFDLE1BQU0sR0FBRztBQUNaLFNBQUMsRUFBRSxDQUFDO0FBQ0osU0FBQyxFQUFFLENBQUM7T0FDTDs7O0FBQUEsQUFHRCxVQUFJLENBQUMsTUFBTSxHQUFHLEFBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsV0FBVyxHQUFJLEFBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLEdBQUksQ0FBQyxHQUFHLEFBQUMsTUFBTSxDQUFDLFdBQVcsR0FBRyxDQUFDLEdBQUksQ0FBQyxDQUFDOztBQUVwSCxVQUFJLENBQUMsTUFBTSxHQUFHO0FB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LEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLENBQUEsSUFBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQSxBQUFDLENBQUM7QUFDbkksTUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxDQUFBLElBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBQztBQUN2SSxNQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUMxQyxTQUFPO0FBQ0wsVUFBTSxFQUFFO0FBQ04sT0FBQyxFQUFFLENBQUM7QUFDSixPQUFDLEVBQUUsQ0FBQztLQUNMO0FBQ0QsVUFBTSxFQUFFLE1BQU07R0FDZixDQUFBO0NBQ0Y7Ozs7OztBQUFBLEFBTU0sSUFBTSxlQUFlLFdBQWYsZUFBZSxHQUFHLFNBQWxCLGVBQWUsQ0FBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUs7QUFDakQsTUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNiLE1BQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDYixNQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2IsTUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNiLE1BQUksSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLElBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLElBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLENBQUMsQ0FBQzs7QUFFNUQsTUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFBLElBQUssSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUEsQUFBQyxJQUFJLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFBLEFBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFBLEFBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFcEcsTUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksQ0FBQyxHQUFHLEFBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLElBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFBLEFBQUMsSUFBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7QUFDakYsTUFBSSxFQUFFLEdBQUcsUUFBUSxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7QUFDdEQsTUFBSSxFQUFFLEdBQUcsUUFBUSxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7O0FBRXRELE1BQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxHQUFJLENBQUMsR0FBRyxBQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxJQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQSxBQUFDLElBQUssQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUEsQUFBQyxDQUFDO0FBQ2pGLE1BQUksRUFBRSxHQUFHLFFBQVEsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUEsQUFBQyxDQUFDO0FBQ3RELE1BQUksRUFBRSxHQUFHLFFBQVEsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUEsQUFBQyxDQUFDOztBQUV0RCxNQUFJLEVBQUUsR0FBRztBQUNQLEtBQUMsRUFBRSxFQUFFO0FBQ0wsS0FBQyxFQUFFLEVBQUU7R0FDTixDQUFBOztBQUVELE1BQUksRUFBRSxHQUFHO0FBQ1AsS0FBQyxFQUFFLEVBQUU7QUFDTCxLQUFDLEVBQUUsRUFBRTtHQUNOLENBQUE7O0FBRUQsU0FBTztBQUNMLE1BQUUsRUFBRSxFQUFFO0FBQ04sTUFBRSxFQUFFLEVBQUU7R0FDUCxDQUFDO0NBQ0gsQ0FBQTs7QUFFTSxJQUFNLG1CQUFtQixXQUFuQixtQkFBbUIsR0FBRyxTQUF0QixtQkFBbUIsQ0FBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUs7O0FBRW5ELE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDOztBQUFDLEFBRTNCLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFBLEdBQUksQ0FBQyxDQUFDO0FBQzdCLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFBLEdBQUksQ0FBQzs7O0FBQUMsQUFHN0IsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQSxBQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQSxBQUFDLENBQUM7QUFDaEQsTUFBTSxDQUFDLEdBQUc7QUFDUixLQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUNoQixLQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztHQUNqQjs7O0FBQUMsQUFHRixNQUFNLEVBQUUsR0FBRyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQzs7O0FBQUMsQUFHMUIsTUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFO0FBQ1YsUUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7O0FBQUMsQUFFdEMsUUFBTSxFQUFFLEdBQUc7QUFDVCxPQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFBLEdBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZCLE9BQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUEsR0FBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7S0FDeEI7O0FBQUEsQUFFRCxRQUFNLEVBQUUsR0FBRztBQUNULE9BQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUEsR0FBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDdkIsT0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQSxHQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztLQUN4QixDQUFBOztBQUVELFdBQU87QUFDTCxRQUFFLEVBQUUsRUFBRTtBQUNOLFFBQUUsRUFBRSxFQUFFO0tBQ1AsQ0FBQztHQUNILE1BQU0sSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFO0FBQ25CLFdBQU8sQ0FBQyxDQUFDO0dBQ1YsTUFBTTtBQUNMLFdBQU8sQ0FBQyxLQUFLLENBQUMsd0NBQXdDLENBQUMsQ0FBQztHQUN6RDtDQUNGOzs7QUFBQSxBQUdNLElBQU0sWUFBWSxXQUFaLFlBQVksR0FBRyxTQUFmLFlBQVksQ0FBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBSztBQUN6QyxTQUFPLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0NBQ2xEOzs7QUFBQSxBQUdNLElBQU0sWUFBWSxXQUFaLFlBQVksR0FBRyxTQUFmLFlBQVksQ0FBSSxFQUFFLEVBQUUsRUFBRSxFQUFLO0FBQ3RDLE1BQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2RSxTQUFPO0FBQ0wsS0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFBLEdBQUksQ0FBQztBQUNwQixLQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUEsR0FBSSxDQUFDO0dBQ3JCLENBQUE7Q0FDRjs7O0FBQUEsQUFHTSxJQUFNLGFBQWEsV0FBYixhQUFhLEdBQUcsU0FBaEIsYUFBYSxDQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUs7QUFDdkMsTUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRTs7QUFFNUIsV0FBTyxJQUFJLENBQUM7R0FDYjtBQUNELE1BQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFBLElBQUssRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFBLEFBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQy9ELE1BQUksSUFBSSxLQUFLLENBQUMsRUFBRSxPQUFPLElBQUksQ0FBQyxLQUN2QixPQUFPLEtBQUssQ0FBQztDQUNuQjs7O0FBQUEsQUFHTSxJQUFNLGlCQUFpQixXQUFqQixpQkFBaUIsR0FBRyxTQUFwQixpQkFBaUIsQ0FBSSxNQUFNLEVBQUs7QUFDM0MsTUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQztNQUNuQixJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDbkMsTUFBSSxLQUFLLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDL0QsTUFBSSxTQUFTLEdBQUcsQ0FBQztNQUNmLENBQUMsR0FBRyxDQUFDO01BQ0wsQ0FBQyxHQUFHLENBQUM7TUFDTCxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU07TUFDcEIsRUFBRSxZQUFBO01BQUUsRUFBRSxZQUFBO01BQUUsQ0FBQyxZQUFBLENBQUM7QUFDWixPQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRTtBQUMvQyxNQUFFLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2YsTUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNmLEtBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzlCLGFBQVMsSUFBSSxDQUFDLENBQUM7QUFDZixLQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUEsR0FBSSxDQUFDLENBQUM7QUFDdkIsS0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFBLEdBQUksQ0FBQyxDQUFDO0dBQ3hCO0FBQ0QsR0FBQyxHQUFHLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDbEIsU0FBTztBQUNMLEtBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQztBQUNSLEtBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQztHQUNULENBQUM7Q0FDSDs7O0FBQUEsQUFHTSxJQUFNLGFBQWEsV0FBYixhQUFhLEdBQUcsU0FBaEIsYUFBYSxDQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUs7QUFDdkMsTUFBSSxPQUFPLEVBQUUsS0FBSyxXQUFXLElBQUksT0FBTyxFQUFFLEtBQUssV0FBVyxFQUFFO0FBQzFELFdBQU8sSUFBSSxDQUFDO0dBQ2I7QUFDRCxJQUFFLEdBQUcsWUFBWSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6QixJQUFFLEdBQUcsWUFBWSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN6QixNQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxJQUFJLENBQUMsS0FDM0MsT0FBTyxLQUFLLENBQUM7Q0FDbkIsQ0FBQTs7QUFFTSxJQUFNLFlBQVksV0FBWixZQUFZLEdBQUcsU0FBZixZQUFZLENBQUksQ0FBQyxFQUFFLE1BQU0sRUFBSztBQUN6QyxTQUFPO0FBQ0wsS0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztBQUN0QixLQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO0dBQ3ZCLENBQUM7Q0FDSDs7Ozs7QUFBQSxBQUtNLElBQU0sU0FBUyxXQUFULFNBQVMsR0FBRyxTQUFaLFNBQVMsQ0FBSSxNQUFNLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBSztBQUM3QyxNQUFNLFFBQVEsR0FBRyxFQUFFLEFBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFBLEFBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxDQUFDO0FBQ3RFLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekQsTUFBTSxXQUFXLEdBQUcsQ0FBQyxXQUFXLENBQUM7O0FBRWpDLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLFFBQVEsSUFBSSxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBLEFBQUMsR0FBRyxXQUFXLElBQUksS0FBSyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQSxBQUFDLENBQUM7QUFDbEgsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsUUFBUSxJQUFJLEtBQUssQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUEsQUFBQyxHQUFHLFdBQVcsSUFBSSxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBQztBQUNsSCxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxXQUFXLElBQUksS0FBSyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQSxBQUFDLEdBQUcsUUFBUSxJQUFJLEtBQUssQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUEsQUFBQyxDQUFDO0FBQ2xILE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLFdBQVcsSUFBSSxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBLEFBQUMsR0FBRyxRQUFRLElBQUksS0FBSyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQSxBQUFDLENBQUM7O0FBRWxILE1BQU0sRUFBRSxHQUFHO0FBQ1QsS0FBQyxFQUFFLElBQUk7QUFDUCxLQUFDLEVBQUUsSUFBSTtHQUNSLENBQUM7QUFDRixNQUFNLEVBQUUsR0FBRztBQUNULEtBQUMsRUFBRSxJQUFJO0FBQ1AsS0FBQyxFQUFFLElBQUk7R0FDUixDQUFDO0FBQ0YsU0FBTztBQUNMLE1BQUUsRUFBRSxFQUFFO0FBQ04sTUFBRSxFQUFFLEVBQUU7R0FDUCxDQUFBO0NBQ0Y7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7OztJQ25SVyxDQUFDOzs7Ozs7Ozs7Ozs7OztBQVdOLElBQU0sR0FBRyxXQUFILEdBQUcsR0FBRyxTQUFOLEdBQUcsQ0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBTTtBQUN2QyxNQUFJLFNBQVMsR0FBRyxLQUFLLENBQUM7QUFDdEIsTUFBSSxNQUFNLFlBQUE7TUFBRSxNQUFNLFlBQUE7TUFBRSxVQUFVLFlBQUE7TUFBRSxRQUFRLFlBQUEsQ0FBQztBQUN6QyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFFLENBQUM7O0FBRWhFLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ3RCLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7O0FBQUMsQUFHdEIsTUFBTSxFQUFFLEdBQUc7QUFDVCxLQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQyxNQUFNO0FBQ2hCLEtBQUMsRUFBRSxFQUFFO0dBQ047OztBQUFBLEFBR0QsUUFBTSxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFFLENBQUM7QUFDNUMsUUFBTSxHQUFHLEFBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsTUFBTSxHQUFHLE1BQU0sQ0FBQztBQUN2RCxRQUFNLEdBQUcsQ0FBQyxDQUFDLFlBQVksQ0FBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUUsQ0FBQztBQUM1QyxRQUFNLEdBQUcsQUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxNQUFNLEdBQUcsTUFBTTs7O0FBQUMsQUFHdkQsTUFBSyxBQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFRLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxBQUFFLEVBQUc7QUFDOUQs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QUFHLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQy9CLGdCQUFRLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQztBQUN2QixnQkFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQztBQUMxQyxnQkFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQztPQUMzQzs7QUFFRCxhQUFPLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDM0M7OzsyQkFFTTtBQUNMLFVBQU0sR0FBRyxHQUFHLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNyQyxVQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNyQjs7OzZCQUVROzs7QUFDUCwyQkFBcUIsQ0FBQyxZQUFNO0FBQzFCLGVBQUssTUFBTSxFQUFFLENBQUE7T0FDZCxDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDL0M7OztTQXJMVSxPQUFPIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCAqIGFzIEUgZnJvbSAnLi9ldWNsaWQnO1xuaW1wb3J0ICogYXMgSCBmcm9tICcuL2h5cGVyYm9saWMnO1xuXG5pbXBvcnQge1xuICBUaHJlZUpTXG59XG5mcm9tICcuL3RocmVlanMnO1xuXG4vLyAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyAqXG4vLyAqICAgRElTSyBDTEFTU1xuLy8gKiAgIFBvaW5jYXJlIERpc2sgcmVwcmVzZW50YXRpb24gb2YgdGhlIGh5cGVyYm9saWMgcGxhbmVcbi8vICogICBDb250YWlucyBhbnkgZnVuY3Rpb25zIHVzZWQgdG8gZHJhdyB0byB0aGUgZGlza1xuLy8gKiAgIChDdXJyZW50bHkgdXNpbmcgdGhyZWUganMgYXMgZHJhd2luZyBjbGFzcylcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbmV4cG9ydCBjbGFzcyBEaXNrIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5kcmF3ID0gbmV3IFRocmVlSlMoKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGV2ZW50KSA9PiB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbG9hZCcpO1xuICAgICAgdGhpcy5pbml0KCk7XG4gICAgfSwgZmFsc2UpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH0sIGZhbHNlKTtcblxuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLmNlbnRyZSA9IHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwXG4gICAgfVxuXG4gICAgLy9kcmF3IGxhcmdlc3QgY2lyY2xlIHBvc3NpYmxlIGdpdmVuIHdpbmRvdyBkaW1zXG4gICAgdGhpcy5yYWRpdXMgPSAod2luZG93LmlubmVyV2lkdGggPCB3aW5kb3cuaW5uZXJIZWlnaHQpID8gKHdpbmRvdy5pbm5lcldpZHRoIC8gMikgLSA1IDogKHdpbmRvdy5pbm5lckhlaWdodCAvIDIpIC0gNTtcblxuICAgIHRoaXMuY2lyY2xlID0ge1xuICAgICAgY2VudHJlOiB0aGlzLmNlbnRyZSxcbiAgICAgIHJhZGl1czogdGhpcy5yYWRpdXNcbiAgICB9XG4gICAgLy9zbWFsbGVyIGNpcmNsZSBmb3IgdGVzdGluZ1xuICAgIC8vdGhpcy5yYWRpdXMgPSB0aGlzLnJhZGl1cyAvIDI7XG5cbiAgICB0aGlzLmRyYXdEaXNrKCk7XG5cbiAgICAvL3RoaXMudGVzdGluZygpO1xuICB9XG5cbiAgdGVzdGluZygpIHtcbiAgICBjb25zdCBwMSA9IHtcbiAgICAgIHg6IDEwMCxcbiAgICAgIHk6IDI1MFxuICAgIH07XG4gICAgY29uc3QgcDIgPSB7XG4gICAgICB4OiAtMTUwLFxuICAgICAgeTogMTUwXG4gICAgfTtcbiAgICBjb25zdCBwMyA9IHtcbiAgICAgIHg6IC03MCxcbiAgICAgIHk6IC0yNTBcbiAgICB9O1xuXG4gICAgY29uc3QgcDQgPSB7XG4gICAgICB4OiAtMTcwLFxuICAgICAgeTogLTE1MFxuICAgIH07XG5cbiAgICBjb25zdCBwNSA9IHtcbiAgICAgIHg6IDE3MCxcbiAgICAgIHk6IC0xNTBcbiAgICB9O1xuICAgIHRoaXMucG9pbnQocDEsIDUsIDB4ZjAwZjBmKTtcbiAgICB0aGlzLnBvaW50KHAyLCA1LCAweGZmZmYwZik7XG4gICAgdGhpcy5wb2ludChwMywgNSwgMHgxZDAwZDUpO1xuICAgIHRoaXMucG9pbnQocDQsIDUsIDB4MDBmZjBmKTtcbiAgICB0aGlzLnBvaW50KHA1LCA1LCAweDM1OTU0Myk7XG5cbiAgICAvKlxuICAgIGNvbnN0IGEgPSBILmFyYyhwMSwgcDIpO1xuXG4gICAgdGhpcy5kcmF3LmRpc2soYS5jLmNlbnRyZSwgYS5jLnJhZGl1cywgMHhmZmZmZmYsIGZhbHNlKTtcblxuICAgIGNvbnN0IHA0ID0gRS5uZXh0UG9pbnQoYS5jLCBwMiwgMjApLnAxO1xuICAgIGNvbnNvbGUubG9nKHA0KTtcblxuXG5cbiAgICAvL3RoaXMuZHJhd0FyYyhwMiwgcDMsIDB4ZjAwZjBmKTtcbiAgICAqL1xuICAgIC8vdGhpcy5wb2x5Z29uT3V0bGluZShbcDEsIHAyLCBwM10sMHhmMDBmMGYpXG4gICAgdGhpcy5wb2x5Z29uKFtwMSwgcDIsIHA0LCBwMywgcDVdLCAweDcwMDY5YSk7XG4gICAgLy90aGlzLnBvbHlnb24oW3AyLCBwMywgcDRdKTtcbiAgfVxuICBnZXRSYWRpdXMoKXtcbiAgICByZXR1cm4gdGhpcy5yYWRpdXM7XG4gIH1cblxuICAvL2RyYXcgdGhlIGRpc2sgYmFja2dyb3VuZFxuICBkcmF3RGlzaygpIHtcbiAgICB0aGlzLmRyYXcuZGlzayh0aGlzLmNlbnRyZSwgdGhpcy5yYWRpdXMsIDB4MDAwMDAwLCB0cnVlKTtcbiAgfVxuXG4gIHBvaW50KGNlbnRyZSwgcmFkaXVzLCBjb2xvcikge1xuICAgIHRoaXMuZHJhdy5kaXNrKGNlbnRyZSwgcmFkaXVzLCBjb2xvciwgZmFsc2UpO1xuICB9XG5cbiAgLy9kcmF3IGEgaHlwZXJib2xpYyBsaW5lIGJldHdlZW4gdHdvIHBvaW50cyBvbiB0aGUgYm91bmRhcnkgY2lyY2xlXG4gIC8vVE9ETzogZml4IVxuICBsaW5lKHAxLCBwMiwgY29sb3IpIHtcbiAgICBjb25zdCBjID0gRS5ncmVhdENpcmNsZShwMSwgcDIsIHRoaXMucmFkaXVzLCB0aGlzLmNlbnRyZSk7XG4gICAgY29uc3QgcG9pbnRzID0gRS5jaXJjbGVJbnRlcnNlY3QodGhpcy5jZW50cmUsIGMuY2VudHJlLCB0aGlzLnJhZGl1cywgYy5yYWRpdXMpO1xuXG4gICAgdGhpcy5kcmF3QXJjKHBvaW50cy5wMSwgcG9pbnRzLnAyLCBjb2xvcilcbiAgfVxuXG4gIC8vRHJhdyBhbiBhcmMgKGh5cGVyYm9saWMgbGluZSBzZWdtZW50KSBiZXR3ZWVuIHR3byBwb2ludHMgb24gdGhlIGRpc2tcbiAgZHJhd0FyYyhwMSwgcDIsIGNvbG91cikge1xuICAgIC8vY2hlY2sgdGhhdCB0aGUgcG9pbnRzIGFyZSBpbiB0aGUgZGlza1xuICAgIGlmKHRoaXMuY2hlY2tQb2ludHMocDEsIHAyKSl7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgY29uc3QgY29sID0gY29sb3VyIHx8IDB4ZmZmZmZmO1xuICAgIGlmIChFLnRocm91Z2hPcmlnaW4ocDEsIHAyKSkge1xuICAgICAgdGhpcy5kcmF3LmxpbmUocDEsIHAyLCBjb2wpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBhcmMgPSBILmFyYyhwMSwgcDIsIHRoaXMuY2lyY2xlKTtcbiAgICAgIHRoaXMuZHJhdy5zZWdtZW50KGFyYy5jLCBhcmMuc3RhcnRBbmdsZSwgYXJjLmVuZEFuZ2xlLCBjb2xvdXIpO1xuICAgIH1cbiAgfVxuXG4gIHBvbHlnb25PdXRsaW5lKHZlcnRpY2VzLCBjb2xvdXIpIHtcbiAgICBjb25zdCBsID0gdmVydGljZXMubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICB0aGlzLmRyYXdBcmModmVydGljZXNbaV0sIHZlcnRpY2VzWyhpICsgMSkgJSBsXSwgY29sb3VyKTtcbiAgICB9XG4gIH1cblxuICAvL2NyZWF0ZSBhbiBhcnJheSBvZiBwb2ludHMgc3BhY2VkIGVxdWFsbHkgYXJvdW5kIHRoZSBhcmNzIGRlZmluaW5nIGEgaHlwZXJib2xpY1xuICAvL3BvbHlnb24gYW5kIHBhc3MgdGhlc2UgdG8gVGhyZWVKUy5wb2x5Z29uKClcbiAgLy9UT0RPIG1ha2Ugc3BhY2luZyBhIGZ1bmN0aW9uIG9mIGZpbmFsIHJlc29sdXRpb25cbiAgLy9UT0RPIGNoZWNrIHdoZXRoZXIgdmVydGljZXMgYXJlIGluIHRoZSByaWdodCBvcmRlclxuICBwb2x5Z29uKHZlcnRpY2VzLCBjb2xvciwgdGV4dHVyZSkge1xuICAgIGNvbnN0IHBvaW50cyA9IFtdO1xuICAgIGNvbnN0IHNwYWNpbmcgPSA1O1xuICAgIGNvbnN0IGwgPSB2ZXJ0aWNlcy5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgIGxldCBwO1xuICAgICAgY29uc3QgYSA9IEguYXJjKHZlcnRpY2VzW2ldLCB2ZXJ0aWNlc1soaSArIDEpICUgbF0sIHRoaXMuY2lyY2xlKTtcblxuICAgICAgaWYoYS5jbG9ja3dpc2UpeyBwID0gRS5uZXh0UG9pbnQoYS5jLCB2ZXJ0aWNlc1tpXSwgc3BhY2luZykucDI7fVxuICAgICAgZWxzZXsgcCA9IEUubmV4dFBvaW50KGEuYywgdmVydGljZXNbaV0sIHNwYWNpbmcpLnAxO31cbiAgICAgIHBvaW50cy5wdXNoKHApO1xuXG4gICAgICB3aGlsZShFLmRpc3RhbmNlKHAsIHZlcnRpY2VzWyhpICsgMSkgJSBsXSkgPiBzcGFjaW5nICl7XG5cbiAgICAgICAgaWYoYS5jbG9ja3dpc2UpeyBwID0gRS5uZXh0UG9pbnQoYS5jLCBwLCBzcGFjaW5nKS5wMiB9XG4gICAgICAgIGVsc2V7IHAgPSBFLm5leHRQb2ludChhLmMsIHAsIHNwYWNpbmcpLnAxIH1cblxuICAgICAgICBwb2ludHMucHVzaChwKTtcbiAgICAgIH1cbiAgICAgIHBvaW50cy5wdXNoKHZlcnRpY2VzWyhpICsgMSkgJSBsXSk7XG4gICAgfVxuICAgIHRoaXMuZHJhdy5wb2x5Z29uKHBvaW50cywgY29sb3IsIHRleHR1cmUpO1xuICB9XG5cbiAgLy9yZXR1cm4gdHJ1ZSBpZiBhbnkgb2YgdGhlIHBvaW50cyBpcyBub3QgaW4gdGhlIGRpc2tcbiAgY2hlY2tQb2ludHMoLi4ucG9pbnRzKSB7XG4gICAgY29uc3QgciA9IHRoaXMucmFkaXVzO1xuICAgIGxldCB0ZXN0ID0gZmFsc2U7XG4gICAgZm9yKGxldCBwb2ludCBvZiBwb2ludHMpe1xuICAgICAgaWYgKEUuZGlzdGFuY2UocG9pbnQsIHRoaXMuY2VudHJlKSA+IHIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IhIFBvaW50ICgnICsgcG9pbnQueCArICcsICcgKyBwb2ludC55ICsgJykgbGllcyBvdXRzaWRlIHRoZSBwbGFuZSEnKTtcbiAgICAgICAgdGVzdCA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIGlmKHRlc3QpIHJldHVybiB0cnVlXG4gICAgZWxzZSByZXR1cm4gZmFsc2VcbiAgfVxufVxuIiwiLy8gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gKlxuLy8gKiAgIEVVQ0xJREVBTiBGVU5DVElPTlNcbi8vICogICBhIHBsYWNlIHRvIHN0YXNoIGFsbCB0aGUgZnVuY3Rpb25zIHRoYXQgYXJlIGV1Y2xpZGVhbiBnZW9tZXRyaWNhbFxuLy8gKiAgIG9wZXJhdGlvbnNcbi8vICpcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuLy9kaXN0YW5jZSBiZXR3ZWVuIHR3byBwb2ludHNcbmV4cG9ydCBjb25zdCBkaXN0YW5jZSA9IChwMSwgcDIpID0+IE1hdGguc3FydChNYXRoLnBvdygocDIueCAtIHAxLngpLCAyKSArIE1hdGgucG93KChwMi55IC0gcDEueSksIDIpKTtcblxuLy9taWRwb2ludCBvZiB0aGUgbGluZSBzZWdtZW50IGNvbm5lY3RpbmcgdHdvIHBvaW50c1xuZXhwb3J0IGNvbnN0IG1pZHBvaW50ID0gKHAxLCBwMikgPT4ge1xuICByZXR1cm4ge1xuICAgIHg6IChwMS54ICsgcDIueCkgLyAyLFxuICAgIHk6IChwMS55ICsgcDIueSkgLyAyXG4gIH1cbn1cblxuLy9zbG9wZSBvZiBsaW5lIHRocm91Z2ggcDEsIHAyXG5leHBvcnQgY29uc3Qgc2xvcGUgPSAocDEsIHAyKSA9PiAocDIueCAtIHAxLngpIC8gKHAyLnkgLSBwMS55KTtcblxuLy9zbG9wZSBvZiBsaW5lIHBlcnBlbmRpY3VsYXIgdG8gYSBsaW5lIGRlZmluZWQgYnkgcDEscDJcbmV4cG9ydCBjb25zdCBwZXJwZW5kaWN1bGFyU2xvcGUgPSAocDEsIHAyKSA9PiAtMSAvIChNYXRoLnBvdyhzbG9wZShwMSwgcDIpLCAtMSkpO1xuXG4vL2ludGVyc2VjdGlvbiBwb2ludCBvZiB0d28gbGluZXMgZGVmaW5lZCBieSBwMSxtMSBhbmQgcTEsbTJcbi8vTk9UIFdPUktJTkcgRk9SIFZFUlRJQ0FMIExJTkVTISEhXG5leHBvcnQgY29uc3QgaW50ZXJzZWN0aW9uID0gKHAxLCBtMSwgcDIsIG0yKSA9PiB7XG4gIGxldCBjMSwgYzIsIHgsIHk7XG4gIC8vY2FzZSB3aGVyZSBmaXJzdCBsaW5lIGlzIHZlcnRpY2FsXG4gIC8vaWYobTEgPiA1MDAwIHx8IG0xIDwgLTUwMDAgfHwgbTEgPT09IEluZmluaXR5KXtcbiAgaWYgKHAxLnkgPCAwLjAwMDAwMSAmJiBwMS55ID4gLTAuMDAwMDAxKSB7XG4gICAgeCA9IHAxLng7XG4gICAgeSA9IChtMikgKiAocDEueCAtIHAyLngpICsgcDIueTtcbiAgfVxuICAvL2Nhc2Ugd2hlcmUgc2Vjb25kIGxpbmUgaXMgdmVydGljYWxcbiAgLy9lbHNlIGlmKG0yID4gNTAwMCB8fCBtMiA8IC01MDAwIHx8IG0xID09PSBJbmZpbml0eSl7XG4gIGVsc2UgaWYgKHAyLnkgPCAwLjAwMDAwMSAmJiBwMi55ID4gLTAuMDAwMDAxKSB7XG4gICAgeCA9IHAyLng7XG4gICAgeSA9IChtMSAqIChwMi54IC0gcDEueCkpICsgcDEueTtcbiAgfSBlbHNlIHtcbiAgICAvL3kgaW50ZXJjZXB0IG9mIGZpcnN0IGxpbmVcbiAgICBjMSA9IHAxLnkgLSBtMSAqIHAxLng7XG4gICAgLy95IGludGVyY2VwdCBvZiBzZWNvbmQgbGluZVxuICAgIGMyID0gcDIueSAtIG0yICogcDIueDtcblxuICAgIHggPSAoYzIgLSBjMSkgLyAobTEgLSBtMik7XG4gICAgeSA9IG0xICogeCArIGMxO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB4OiB4LFxuICAgIHk6IHlcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgcmFkaWFucyA9IChkZWdyZWVzKSA9PiAoTWF0aC5QSSAvIDE4MCkgKiBkZWdyZWVzO1xuXG4vL2dldCB0aGUgY2lyY2xlIGludmVyc2Ugb2YgYSBwb2ludCBwIHdpdGggcmVzcGVjdCBhIGNpcmNsZSByYWRpdXMgciBjZW50cmUgY1xuZXhwb3J0IGNvbnN0IGludmVyc2UgPSAocCwgciwgYykgPT4ge1xuICBsZXQgYWxwaGEgPSAociAqIHIpIC8gKE1hdGgucG93KHAueCAtIGMueCwgMikgKyBNYXRoLnBvdyhwLnkgLSBjLnksIDIpKTtcbiAgcmV0dXJuIHtcbiAgICB4OiBhbHBoYSAqIChwLnggLSBjLngpICsgYy54LFxuICAgIHk6IGFscGhhICogKHAueSAtIGMueSkgKyBjLnlcbiAgfTtcbn1cblxuLy9jYWxjdWxhdGUgdGhlIHJhZGl1cyBhbmQgY2VudHJlIG9mIHRoZSBjaXJjbGUgcmVxdWlyZWQgdG8gZHJhdyBhIGxpbmUgYmV0d2VlblxuLy90d28gcG9pbnRzIGluIHRoZSBoeXBlcmJvbGljIHBsYW5lIGRlZmluZWQgYnkgdGhlIGRpc2sgKHIsIGMpXG5leHBvcnQgY29uc3QgZ3JlYXRDaXJjbGUgPSAocDEsIHAyLCByLCBjKSA9PiB7XG4gIGxldCBwMUludmVyc2UgPSBpbnZlcnNlKHAxLCByLCBjKTtcbiAgbGV0IHAySW52ZXJzZSA9IGludmVyc2UocDIsIHIsIGMpO1xuXG4gIGxldCBtID0gbWlkcG9pbnQocDEsIHAxSW52ZXJzZSk7XG4gIGxldCBuID0gbWlkcG9pbnQocDIsIHAySW52ZXJzZSk7XG5cbiAgbGV0IG0xID0gcGVycGVuZGljdWxhclNsb3BlKG0sIHAxSW52ZXJzZSk7XG4gIGxldCBtMiA9IHBlcnBlbmRpY3VsYXJTbG9wZShuLCBwMkludmVyc2UpO1xuXG5cbiAgLy9jZW50cmUgaXMgdGhlIGNlbnRyZXBvaW50IG9mIHRoZSBjaXJjbGUgb3V0IG9mIHdoaWNoIHRoZSBhcmMgaXMgbWFkZVxuICBsZXQgY2VudHJlID0gaW50ZXJzZWN0aW9uKG0sIG0xLCBuLCBtMik7XG4gIGxldCByYWRpdXMgPSBkaXN0YW5jZShjZW50cmUsIHAxKTtcbiAgcmV0dXJuIHtcbiAgICBjZW50cmU6IGNlbnRyZSxcbiAgICByYWRpdXM6IHJhZGl1c1xuICB9O1xufVxuXG4vL2FuIGF0dGVtcHQgYXQgY2FsY3VsYXRpbmcgdGhlIGNpcmNsZSBhbGdlYnJhaWNhbGx5XG5leHBvcnQgY29uc3QgZ3JlYXRDaXJjbGVWMiA9IChwMSwgcDIsIHIpID0+IHtcbiAgbGV0IHggPSAocDIueSAqIChwMS54ICogcDEueCArIHIpICsgcDEueSAqIHAxLnkgKiBwMi55IC0gcDEueSAqIChwMi54ICogcDIueCArIHAyLnkgKiBwMi55ICsgcikpIC8gKDIgKiBwMS54ICogcDIueSAtIHAxLnkgKiBwMi54KTtcbiAgbGV0IHkgPSAocDEueCAqIHAxLnggKiBwMi54IC0gcDEueCAqIChwMi54ICogcDIueCArIHAyLnkgKiBwMi55ICsgcikgKyBwMi54ICogKHAxLnkgKiBwMS55ICsgcikpIC8gKDIgKiBwMS55ICogcDIueCArIDIgKiBwMS54ICogcDIueSk7XG4gIGxldCByYWRpdXMgPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSAtIHIpO1xuICByZXR1cm4ge1xuICAgIGNlbnRyZToge1xuICAgICAgeDogeCxcbiAgICAgIHk6IHlcbiAgICB9LFxuICAgIHJhZGl1czogcmFkaXVzXG4gIH1cbn1cblxuLy9pbnRlcnNlY3Rpb24gb2YgdHdvIGNpcmNsZXMgd2l0aCBlcXVhdGlvbnM6XG4vLyh4LWEpXjIgKyh5LWEpXjIgPSByMF4yXG4vLyh4LWIpXjIgKyh5LWMpXjIgPSByMV4yXG4vL05PVEUgYXNzdW1lcyB0aGUgdHdvIGNpcmNsZXMgRE8gaW50ZXJzZWN0IVxuZXhwb3J0IGNvbnN0IGNpcmNsZUludGVyc2VjdCA9IChjMCwgYzEsIHIwLCByMSkgPT4ge1xuICBsZXQgYSA9IGMwLng7XG4gIGxldCBiID0gYzAueTtcbiAgbGV0IGMgPSBjMS54O1xuICBsZXQgZCA9IGMxLnk7XG4gIGxldCBkaXN0ID0gTWF0aC5zcXJ0KChjIC0gYSkgKiAoYyAtIGEpICsgKGQgLSBiKSAqIChkIC0gYikpO1xuXG4gIGxldCBkZWwgPSBNYXRoLnNxcnQoKGRpc3QgKyByMCArIHIxKSAqIChkaXN0ICsgcjAgLSByMSkgKiAoZGlzdCAtIHIwICsgcjEpICogKC1kaXN0ICsgcjAgKyByMSkpIC8gNDtcblxuICBsZXQgeFBhcnRpYWwgPSAoYSArIGMpIC8gMiArICgoYyAtIGEpICogKHIwICogcjAgLSByMSAqIHIxKSkgLyAoMiAqIGRpc3QgKiBkaXN0KTtcbiAgbGV0IHgxID0geFBhcnRpYWwgLSAyICogZGVsICogKGIgLSBkKSAvIChkaXN0ICogZGlzdCk7XG4gIGxldCB4MiA9IHhQYXJ0aWFsICsgMiAqIGRlbCAqIChiIC0gZCkgLyAoZGlzdCAqIGRpc3QpO1xuXG4gIGxldCB5UGFydGlhbCA9IChiICsgZCkgLyAyICsgKChkIC0gYikgKiAocjAgKiByMCAtIHIxICogcjEpKSAvICgyICogZGlzdCAqIGRpc3QpO1xuICBsZXQgeTEgPSB5UGFydGlhbCArIDIgKiBkZWwgKiAoYSAtIGMpIC8gKGRpc3QgKiBkaXN0KTtcbiAgbGV0IHkyID0geVBhcnRpYWwgLSAyICogZGVsICogKGEgLSBjKSAvIChkaXN0ICogZGlzdCk7XG5cbiAgbGV0IHAxID0ge1xuICAgIHg6IHgxLFxuICAgIHk6IHkxXG4gIH1cblxuICBsZXQgcDIgPSB7XG4gICAgeDogeDIsXG4gICAgeTogeTJcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcDE6IHAxLFxuICAgIHAyOiBwMlxuICB9O1xufVxuXG5leHBvcnQgY29uc3QgY2lyY2xlTGluZUludGVyc2VjdCA9IChjLCByLCBwMSwgcDIpID0+IHtcblxuICBjb25zdCBkID0gZGlzdGFuY2UocDEsIHAyKTtcbiAgLy91bml0IHZlY3RvciBwMSBwMlxuICBjb25zdCBkeCA9IChwMi54IC0gcDEueCkgLyBkO1xuICBjb25zdCBkeSA9IChwMi55IC0gcDEueSkgLyBkO1xuXG4gIC8vcG9pbnQgb24gbGluZSBjbG9zZXN0IHRvIGNpcmNsZSBjZW50cmVcbiAgY29uc3QgdCA9IGR4ICogKGMueCAtIHAxLngpICsgZHkgKiAoYy55IC0gcDEueSk7XG4gIGNvbnN0IHAgPSB7XG4gICAgeDogdCAqIGR4ICsgcDEueCxcbiAgICB5OiB0ICogZHkgKyBwMS55XG4gIH07XG5cbiAgLy9kaXN0YW5jZSBmcm9tIHRoaXMgcG9pbnQgdG8gY2VudHJlXG4gIGNvbnN0IGQyID0gZGlzdGFuY2UocCwgYyk7XG5cbiAgLy9saW5lIGludGVyc2VjdHMgY2lyY2xlXG4gIGlmIChkMiA8IHIpIHtcbiAgICBjb25zdCBkdCA9IE1hdGguc3FydChyICogciAtIGQyICogZDIpO1xuICAgIC8vcG9pbnQgMVxuICAgIGNvbnN0IHExID0ge1xuICAgICAgeDogKHQgLSBkdCkgKiBkeCArIHAxLngsXG4gICAgICB5OiAodCAtIGR0KSAqIGR5ICsgcDEueVxuICAgIH1cbiAgICAvL3BvaW50IDJcbiAgICBjb25zdCBxMiA9IHtcbiAgICAgIHg6ICh0ICsgZHQpICogZHggKyBwMS54LFxuICAgICAgeTogKHQgKyBkdCkgKiBkeSArIHAxLnlcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgcDE6IHExLFxuICAgICAgcDI6IHEyXG4gICAgfTtcbiAgfSBlbHNlIGlmIChkMiA9PT0gcikge1xuICAgIHJldHVybiBwO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yOiBsaW5lIGRvZXMgbm90IGludGVyc2VjdCBjaXJjbGUhJyk7XG4gIH1cbn1cblxuLy9hbmdsZSBpbiByYWRpYW5zIGJldHdlZW4gdHdvIHBvaW50cyBvbiBjaXJjbGUgb2YgcmFkaXVzIHJcbmV4cG9ydCBjb25zdCBjZW50cmFsQW5nbGUgPSAocDEsIHAyLCByKSA9PiB7XG4gIHJldHVybiAyICogTWF0aC5hc2luKDAuNSAqIGRpc3RhbmNlKHAxLCBwMikgLyByKTtcbn1cblxuLy9jYWxjdWxhdGUgdGhlIG5vcm1hbCB2ZWN0b3IgZ2l2ZW4gMiBwb2ludHNcbmV4cG9ydCBjb25zdCBub3JtYWxWZWN0b3IgPSAocDEsIHAyKSA9PiB7XG4gIGxldCBkID0gTWF0aC5zcXJ0KE1hdGgucG93KHAyLnggLSBwMS54LCAyKSArIE1hdGgucG93KHAyLnkgLSBwMS55LCAyKSk7XG4gIHJldHVybiB7XG4gICAgeDogKHAyLnggLSBwMS54KSAvIGQsXG4gICAgeTogKHAyLnkgLSBwMS55KSAvIGRcbiAgfVxufVxuXG4vL2RvZXMgdGhlIGxpbmUgY29ubmVjdGluZyBwMSwgcDIgZ28gdGhyb3VnaCB0aGUgcG9pbnQgKDAsMCk/XG5leHBvcnQgY29uc3QgdGhyb3VnaE9yaWdpbiA9IChwMSwgcDIpID0+IHtcbiAgaWYgKHAxLnggPT09IDAgJiYgcDIueCA9PT0gMCkge1xuICAgIC8vdmVydGljYWwgbGluZSB0aHJvdWdoIGNlbnRyZVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGxldCB0ZXN0ID0gKC1wMS54ICogcDIueSArIHAxLnggKiBwMS55KSAvIChwMi54IC0gcDEueCkgKyBwMS55O1xuICBpZiAodGVzdCA9PT0gMCkgcmV0dXJuIHRydWU7XG4gIGVsc2UgcmV0dXJuIGZhbHNlO1xufVxuXG4vL2ZpbmQgdGhlIGNlbnRyb2lkIG9mIGEgbm9uLXNlbGYtaW50ZXJzZWN0aW5nIHBvbHlnb25cbmV4cG9ydCBjb25zdCBjZW50cm9pZE9mUG9seWdvbiA9IChwb2ludHMpID0+IHtcbiAgbGV0IGZpcnN0ID0gcG9pbnRzWzBdLFxuICAgIGxhc3QgPSBwb2ludHNbcG9pbnRzLmxlbmd0aCAtIDFdO1xuICBpZiAoZmlyc3QueCAhPSBsYXN0LnggfHwgZmlyc3QueSAhPSBsYXN0LnkpIHBvaW50cy5wdXNoKGZpcnN0KTtcbiAgbGV0IHR3aWNlYXJlYSA9IDAsXG4gICAgeCA9IDAsXG4gICAgeSA9IDAsXG4gICAgblB0cyA9IHBvaW50cy5sZW5ndGgsXG4gICAgcDEsIHAyLCBmO1xuICBmb3IgKHZhciBpID0gMCwgaiA9IG5QdHMgLSAxOyBpIDwgblB0czsgaiA9IGkrKykge1xuICAgIHAxID0gcG9pbnRzW2ldO1xuICAgIHAyID0gcG9pbnRzW2pdO1xuICAgIGYgPSBwMS54ICogcDIueSAtIHAyLnggKiBwMS55O1xuICAgIHR3aWNlYXJlYSArPSBmO1xuICAgIHggKz0gKHAxLnggKyBwMi54KSAqIGY7XG4gICAgeSArPSAocDEueSArIHAyLnkpICogZjtcbiAgfVxuICBmID0gdHdpY2VhcmVhICogMztcbiAgcmV0dXJuIHtcbiAgICB4OiB4IC8gZixcbiAgICB5OiB5IC8gZlxuICB9O1xufVxuXG4vL2NvbXBhcmUgdHdvIHBvaW50cyB0YWtpbmcgcm91bmRpbmcgZXJyb3JzIGludG8gYWNjb3VudFxuZXhwb3J0IGNvbnN0IGNvbXBhcmVQb2ludHMgPSAocDEsIHAyKSA9PiB7XG4gIGlmICh0eXBlb2YgcDEgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBwMiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBwMSA9IHBvaW50VG9GaXhlZChwMSwgNik7XG4gIHAyID0gcG9pbnRUb0ZpeGVkKHAyLCA2KTtcbiAgaWYgKHAxLnggPT09IHAyLnggJiYgcDEueSA9PT0gcDIueSkgcmV0dXJuIHRydWU7XG4gIGVsc2UgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgY29uc3QgcG9pbnRUb0ZpeGVkID0gKHAsIHBsYWNlcykgPT4ge1xuICByZXR1cm4ge1xuICAgIHg6IHAueC50b0ZpeGVkKHBsYWNlcyksXG4gICAgeTogcC55LnRvRml4ZWQocGxhY2VzKVxuICB9O1xufVxuXG4vL2ZpbmQgYSBwb2ludCBhdCBhIGRpc3RhbmNlIGQgYWxvbmcgdGhlIGNpcmN1bWZlcmVuY2Ugb2Zcbi8vYSBjaXJjbGUgb2YgcmFkaXVzIHIsIGNlbnRyZSBjIGZyb20gYSBwb2ludCBhbHNvXG4vL29uIHRoZSBjaXJjdW1mZXJlbmNlXG5leHBvcnQgY29uc3QgbmV4dFBvaW50ID0gKGNpcmNsZSwgcG9pbnQsIGQpID0+IHtcbiAgY29uc3QgY29zVGhldGEgPSAtKChkICogZCkgLyAoMiAqIGNpcmNsZS5yYWRpdXMgKiBjaXJjbGUucmFkaXVzKSAtIDEpO1xuICBjb25zdCBzaW5UaGV0YVBvcyA9IE1hdGguc3FydCgxIC0gTWF0aC5wb3coY29zVGhldGEsIDIpKTtcbiAgY29uc3Qgc2luVGhldGFOZWcgPSAtc2luVGhldGFQb3M7XG5cbiAgY29uc3QgeFBvcyA9IGNpcmNsZS5jZW50cmUueCArIGNvc1RoZXRhICogKHBvaW50LnggLSBjaXJjbGUuY2VudHJlLngpIC0gc2luVGhldGFQb3MgKiAocG9pbnQueSAtIGNpcmNsZS5jZW50cmUueSk7XG4gIGNvbnN0IHhOZWcgPSBjaXJjbGUuY2VudHJlLnggKyBjb3NUaGV0YSAqIChwb2ludC54IC0gY2lyY2xlLmNlbnRyZS54KSAtIHNpblRoZXRhTmVnICogKHBvaW50LnkgLSBjaXJjbGUuY2VudHJlLnkpO1xuICBjb25zdCB5UG9zID0gY2lyY2xlLmNlbnRyZS55ICsgc2luVGhldGFQb3MgKiAocG9pbnQueCAtIGNpcmNsZS5jZW50cmUueCkgKyBjb3NUaGV0YSAqIChwb2ludC55IC0gY2lyY2xlLmNlbnRyZS55KTtcbiAgY29uc3QgeU5lZyA9IGNpcmNsZS5jZW50cmUueSArIHNpblRoZXRhTmVnICogKHBvaW50LnggLSBjaXJjbGUuY2VudHJlLngpICsgY29zVGhldGEgKiAocG9pbnQueSAtIGNpcmNsZS5jZW50cmUueSk7XG5cbiAgY29uc3QgcDEgPSB7XG4gICAgeDogeFBvcyxcbiAgICB5OiB5UG9zXG4gIH07XG4gIGNvbnN0IHAyID0ge1xuICAgIHg6IHhOZWcsXG4gICAgeTogeU5lZ1xuICB9O1xuICByZXR1cm4ge1xuICAgIHAxOiBwMSxcbiAgICBwMjogcDJcbiAgfVxufVxuXG4vKlxuLy9mbGlwIGEgc2V0IG9mIHBvaW50cyBvdmVyIGEgaHlwZXJvYmxpYyBsaW5lIGRlZmluZWQgYnkgdHdvIHBvaW50c1xuZXhwb3J0IGNvbnN0IHRyYW5zZm9ybSA9IChwb2ludHNBcnJheSwgcDEsIHAyKSA9PiB7XG4gIGxldCBuZXdQb2ludHNBcnJheSA9IFtdO1xuICBsZXQgYyA9IEUuZ3JlYXRDaXJjbGUocDEsIHAyLCBkaXNrLnJhZGl1cywgZGlzay5jZW50cmUpO1xuXG4gIGZvcihsZXQgcCBvZiBwb2ludHNBcnJheSl7XG4gICAgbGV0IG5ld1AgPSBFLmludmVyc2UocCwgYy5yYWRpdXMsIGMuY2VudHJlKTtcbiAgICBuZXdQb2ludHNBcnJheS5wdXNoKG5ld1ApO1xuICB9XG4gIHJldHVybiBuZXdQb2ludHNBcnJheTtcbn1cbiovXG4iLCJpbXBvcnQgKiBhcyBFIGZyb20gJy4vZXVjbGlkJztcbi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICpcbi8vICogICBIWVBFUkJPTElDIEZVTkNUSU9OU1xuLy8gKiAgIGEgcGxhY2UgdG8gc3Rhc2ggYWxsIHRoZSBmdW5jdGlvbnMgdGhhdCBhcmUgaHlwZXJib2xpYyBnZW1lb21ldHJpY2FsXG4vLyAqICAgb3BlcmF0aW9uc1xuLy8gKlxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4vL2NhbGN1bGF0ZSBncmVhdENpcmNsZSwgc3RhcnRBbmdsZSBhbmQgZW5kQW5nbGUgZm9yIGh5cGVyYm9saWMgYXJjXG4vL1RPRE8gZGVhbCB3aXRoIGNhc2Ugb2Ygc3RhaWdodCBsaW5lcyB0aHJvdWdoIGNlbnRyZVxuZXhwb3J0IGNvbnN0IGFyYyA9ICggcDEsIHAyLCBjaXJjbGUgKSA9PiB7XG4gIGxldCBjbG9ja3dpc2UgPSBmYWxzZTtcbiAgbGV0IGFscGhhMSwgYWxwaGEyLCBzdGFydEFuZ2xlLCBlbmRBbmdsZTtcbiAgY29uc3QgYyA9IEUuZ3JlYXRDaXJjbGUoIHAxLCBwMiwgY2lyY2xlLnJhZGl1cywgY2lyY2xlLmNlbnRyZSApO1xuXG4gIGNvbnN0IG95ID0gYy5jZW50cmUueTtcbiAgY29uc3Qgb3ggPSBjLmNlbnRyZS54O1xuXG4gIC8vcG9pbnQgYXQgMCByYWRpYW5zIG9uIGNcbiAgY29uc3QgcDMgPSB7XG4gICAgeDogb3ggKyBjLnJhZGl1cyxcbiAgICB5OiBveVxuICB9XG5cbiAgLy9jYWxjdWxhdGUgdGhlIHBvc2l0aW9uIG9mIGVhY2ggcG9pbnQgaW4gdGhlIGNpcmNsZVxuICBhbHBoYTEgPSBFLmNlbnRyYWxBbmdsZSggcDMsIHAxLCBjLnJhZGl1cyApO1xuICBhbHBoYTEgPSAoIHAxLnkgPCBveSApID8gMiAqIE1hdGguUEkgLSBhbHBoYTEgOiBhbHBoYTE7XG4gIGFscGhhMiA9IEUuY2VudHJhbEFuZ2xlKCBwMywgcDIsIGMucmFkaXVzICk7XG4gIGFscGhhMiA9ICggcDIueSA8IG95ICkgPyAyICogTWF0aC5QSSAtIGFscGhhMiA6IGFscGhhMjtcblxuICAvL2Nhc2Ugd2hlcmUgcDEgYWJvdmUgYW5kIHAyIGJlbG93IHRoZSBsaW5lIGMuY2VudHJlIC0+IHAzXG4gIGlmICggKCBwMS54ID4gb3ggJiYgcDIueCA+IG94ICkgJiYgKCBwMS55IDwgb3kgJiYgcDIueSA+IG95ICkgKSB7XG4gICAgc3RhcnRBbmdsZSA9IGFscGhhMTtcbiAgICBlbmRBbmdsZSA9IGFscGhhMjtcbiAgfVxuICAvL2Nhc2Ugd2hlcmUgcDIgYWJvdmUgYW5kIHAxIGJlbG93IHRoZSBsaW5lIGMuY2VudHJlIC0+IHAzXG4gIGVsc2UgaWYgKCAoIHAxLnggPiBveCAmJiBwMi54ID4gb3ggKSAmJiAoIHAxLnkgPiBveSAmJiBwMi55IDwgb3kgKSApIHtcbiAgICBzdGFydEFuZ2xlID0gYWxwaGEyO1xuICAgIGVuZEFuZ2xlID0gYWxwaGExO1xuICAgIGNsb2Nrd2lzZSA9IHRydWU7XG4gIH1cbiAgLy9wb2ludHMgaW4gY2xvY2t3aXNlIG9yZGVyXG4gIGVsc2UgaWYgKCBhbHBoYTEgPiBhbHBoYTIgKSB7XG4gICAgc3RhcnRBbmdsZSA9IGFscGhhMjtcbiAgICBlbmRBbmdsZSA9IGFscGhhMTtcbiAgICBjbG9ja3dpc2UgPSB0cnVlO1xuICB9XG4gIC8vcG9pbnRzIGluIGFudGljbG9ja3dpc2Ugb3JkZXJcbiAgZWxzZSB7XG4gICAgc3RhcnRBbmdsZSA9IGFscGhhMTtcbiAgICBlbmRBbmdsZSA9IGFscGhhMjtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgYzogYyxcbiAgICBzdGFydEFuZ2xlOiBzdGFydEFuZ2xlLFxuICAgIGVuZEFuZ2xlOiBlbmRBbmdsZSxcbiAgICBjbG9ja3dpc2U6IGNsb2Nrd2lzZVxuICB9XG59XG5cbi8vdHJhbnNsYXRlIGEgc2V0IG9mIHBvaW50cyBhbG9uZyB0aGUgeCBheGlzXG5leHBvcnQgY29uc3QgdHJhbnNsYXRlWCA9ICggcG9pbnRzQXJyYXksIGRpc3RhbmNlICkgPT4ge1xuICBjb25zdCBsID0gcG9pbnRzQXJyYXkubGVuZ3RoO1xuICBjb25zdCBuZXdQb2ludHMgPSBbXTtcbiAgY29uc3QgZSA9IE1hdGgucG93KCBNYXRoLkUsIGRpc3RhbmNlICk7XG4gIGNvbnN0IHBvcyA9IGUgKyAxO1xuICBjb25zdCBuZWcgPSBlIC0gMTtcbiAgZm9yICggbGV0IGkgPSAwOyBpIDwgbDsgaSsrICkge1xuICAgIGNvbnN0IHggPSBwb3MgKiBwb2ludHNBcnJheVsgaSBdLnggKyBuZWcgKiBwb2ludHNBcnJheVsgaSBdLnk7XG4gICAgY29uc3QgeSA9IG5lZyAqIHBvaW50c0FycmF5WyBpIF0ueCArIHBvcyAqIHBvaW50c0FycmF5WyBpIF0ueTtcbiAgICBuZXdQb2ludHMucHVzaCgge1xuICAgICAgeDogeCxcbiAgICAgIHk6IHlcbiAgICB9IClcbiAgfVxuICByZXR1cm4gbmV3UG9pbnRzO1xufVxuXG4vL3JvdGF0ZSBhIHNldCBvZiBwb2ludHMgYWJvdXQgYSBwb2ludCBieSBhIGdpdmVuIGFuZ2xlXG4vL2Nsb2Nrd2lzZSBkZWZhdWx0cyB0byBmYWxzZVxuZXhwb3J0IGNvbnN0IHJvdGF0aW9uID0gKCBwb2ludHNBcnJheSwgcG9pbnQsIGFuZ2xlLCBjbG9ja3dpc2UgKSA9PiB7XG5cbn1cblxuLy9yZWZsZWN0IGEgc2V0IG9mIHBvaW50cyBhY3Jvc3MgYSBoeXBlcmJvbGljIGFyY1xuLy9UT0RPIGFkZCBjYXNlIHdoZXJlIHJlZmxlY3Rpb24gaXMgYWNyb3NzIHN0cmFpZ2h0IGxpbmVcbmV4cG9ydCBjb25zdCByZWZsZWN0ID0gKCBwb2ludHNBcnJheSwgcDEsIHAyLCBjaXJjbGUgKSA9PiB7XG4gIGNvbnN0IGwgPSBwb2ludHNBcnJheS5sZW5ndGg7XG4gIGNvbnN0IGEgPSBhcmMoIHAxLCBwMiwgY2lyY2xlICk7XG4gIGNvbnN0IG5ld1BvaW50cyA9IFtdO1xuICBmb3IgKCBsZXQgaSA9IDA7IGkgPCBsOyBpKysgKSB7XG4gICAgbmV3UG9pbnRzLnB1c2goIEUuaW52ZXJzZSggcG9pbnRzQXJyYXlbIGkgXSwgYS5jLnJhZGl1cywgYS5jLmNlbnRyZSApICk7XG4gIH1cbiAgcmV0dXJuIG5ld1BvaW50cztcbn1cblxuZXhwb3J0IGNvbnN0IHBvaW5jYXJlVG9XZWllcnN0cmFzcyA9ICggcG9pbnQyRCApID0+IHtcbiAgY29uc3QgZmFjdG9yID0gMSAvICggMSAtIHBvaW50MkQueCAqIHBvaW50MkQueCAtIHBvaW50MkQueSAqIHBvaW50MkQueSApO1xuICByZXR1cm4ge1xuICAgIHg6IDIgKiBmYWN0b3IgKiBwb2ludDJELngsXG4gICAgeTogMiAqIGZhY3RvciAqIHBvaW50MkQueSxcbiAgICB6OiBmYWN0b3IgKiAoIDEgKyBwb2ludDJELnggKiBwb2ludDJELnggKyBwb2ludDJELnkgKiBwb2ludDJELnkgKVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCB3ZWllcnN0cmFzc1RvUG9pbmNhcmUgPSAoIHBvaW50M0QgKSA9PiB7XG4gIGNvbnN0IGZhY3RvciA9IDEgLyAoIDEgKyBwb2ludDNELnogKTtcbiAgcmV0dXJuIHtcbiAgICB4OiBmYWN0b3IgKiBwb2ludDNELngsXG4gICAgeTogZmFjdG9yICogcG9pbnQzRC55XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHJvdGF0ZUFib3V0T3JpZ2luV2VpZXJzdHJhc3MgPSAoIHBvaW50M0QsIGFuZ2xlICkgPT4ge1xuICByZXR1cm4ge1xuICAgIHg6IE1hdGguY29zKCBhbmdsZSApICogcG9pbnQzRC54IC0gTWF0aC5zaW4oIGFuZ2xlICkgKiBwb2ludDNELnksXG4gICAgeTogTWF0aC5zaW4oIGFuZ2xlICkgKiBwb2ludDNELnggKyBNYXRoLmNvcyggYW5nbGUgKSAqIHBvaW50M0QueSxcbiAgICB6OiBwb2ludDNELnpcbiAgfVxufVxuXG5leHBvcnQgY29uc3Qgcm90YXRlUGdvbkFib3V0T3JpZ2luID0gKCBwb2ludHMyREFycmF5LCBhbmdsZSApID0+IHtcbiAgY29uc3QgbCA9IHBvaW50czJEQXJyYXkubGVuZ3RoO1xuICBjb25zdCByb3RhdGVkUG9pbnRzMkRBcnJheSA9IFtdO1xuICBmb3IgKCBsZXQgaSA9IDA7IGkgPCBsOyBpKysgKSB7XG4gICAgbGV0IHBvaW50ID0gcG9pbmNhcmVUb1dlaWVyc3RyYXNzKCBwb2ludHMyREFycmF5WyBpIF0gKTtcbiAgICBwb2ludCA9IHJvdGF0ZUFib3V0T3JpZ2luV2VpZXJzdHJhc3MoIHBvaW50LCBhbmdsZSApO1xuICAgIHBvaW50ID0gd2VpZXJzdHJhc3NUb1BvaW5jYXJlKHBvaW50KTtcbiAgICByb3RhdGVkUG9pbnRzMkRBcnJheS5wdXNoKHBvaW50KTtcbiAgfVxuICByZXR1cm4gcm90YXRlZFBvaW50czJEQXJyYXk7XG59XG4iLCJpbXBvcnQgeyBSZWd1bGFyVGVzc2VsYXRpb24gfSBmcm9tICcuL3JlZ3VsYXJUZXNzZWxhdGlvbic7XG5pbXBvcnQgKiBhcyBFIGZyb20gJy4vZXVjbGlkJztcbmltcG9ydCB7IERpc2sgfSBmcm9tICcuL2Rpc2snO1xuXG5cbi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICpcbi8vICogICBTRVRVUFxuLy8gKlxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4vL2NvbnN0IGRpc2sgPSBuZXcgRGlzaygpO1xuXG5jb25zdCB0ZXNzZWxhdGlvbiA9IG5ldyBSZWd1bGFyVGVzc2VsYXRpb24oNCwgNSwgMCwgJ3JlZCcpO1xuIiwiaW1wb3J0ICogYXMgRSBmcm9tICcuL2V1Y2xpZCc7XG5pbXBvcnQgKiBhcyBIIGZyb20gJy4vaHlwZXJib2xpYyc7XG5pbXBvcnQge1xuICBEaXNrXG59XG5mcm9tICcuL2Rpc2snO1xuXG5cbi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICogICAgVEVTU0VMQVRJT04gQ0xBU1Ncbi8vICogICAgQ3JlYXRlcyBhIHJlZ3VsYXIgVGVzc2VsYXRpb24gb2YgdGhlIFBvaW5jYXJlIERpc2tcbi8vICogICAgcTogbnVtYmVyIG9mIHAtZ29ucyBtZWV0aW5nIGF0IGVhY2ggdmVydGV4XG4vLyAqICAgIHA6IG51bWJlciBvZiBzaWRlcyBvZiBwLWdvblxuLy8gKiAgICB1c2luZyB0aGUgdGVjaG5pcXVlcyBjcmVhdGVkIGJ5IENveGV0ZXIgYW5kIER1bmhhbVxuLy8gKlxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuZXhwb3J0IGNsYXNzIFJlZ3VsYXJUZXNzZWxhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHAsIHEsIHJvdGF0aW9uLCBjb2xvdXIsIG1heExheWVycykge1xuICAgIHRoaXMuZGlzayA9IG5ldyBEaXNrKCk7XG5cbiAgICB0aGlzLmNlbnRyZSA9IHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwXG4gICAgfVxuICAgIHRoaXMucCA9IHA7XG4gICAgdGhpcy5xID0gcTtcbiAgICB0aGlzLmNvbG91ciA9IGNvbG91ciB8fCAnYmxhY2snO1xuICAgIHRoaXMucm90YXRpb24gPSByb3RhdGlvbiB8fCAwO1xuICAgIHRoaXMubWF4TGF5ZXJzID0gbWF4TGF5ZXJzIHx8IDU7XG5cbiAgICBpZiAodGhpcy5jaGVja1BhcmFtcygpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZXZlbnQpID0+IHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJyk7XG4gICAgICB0aGlzLmluaXQoKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgdGhpcy5pbml0KCk7XG4gICAgfSwgZmFsc2UpO1xuXG5cblxuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLnJhZGl1cyA9IHRoaXMuZGlzay5nZXRSYWRpdXMoKTtcbiAgICB0aGlzLmZyID0gdGhpcy5mdW5kYW1lbnRhbFJlZ2lvbigpO1xuICAgIHRoaXMudGVzdGluZygpO1xuICB9XG5cbiAgdGVzdGluZygpIHtcbiAgICAvL3RoaXMuZGlzay5wb2x5Z29uT3V0bGluZShbdGhpcy5mci5hLCB0aGlzLmZyLmIsIHRoaXMuZnIuY10sIDB4NTMxMmJhKTtcbiAgICB0aGlzLmRpc2sucG9seWdvbih0aGlzLmZyLCAweGU4MDM0OCk7XG4gICAgY29uc3QgcG9seTIgPSBILnJlZmxlY3QodGhpcy5mciwgdGhpcy5mclsxXSwgdGhpcy5mclsyXSwgdGhpcy5kaXNrLmNpcmNsZSk7XG5cbiAgICB0aGlzLmRpc2sucG9seWdvbihwb2x5MiwgMHhjMzE2N2UpO1xuXG4gICAgY29uc3QgcG9seTMgPSBILnJvdGF0ZVBnb25BYm91dE9yaWdpbih0aGlzLmZyLCBNYXRoLlBJKTtcbiAgICBjb25zb2xlLnRhYmxlKHBvbHkzKTtcbiAgICB0aGlzLmRpc2sucG9seWdvbihwb2x5MywgMHhkMmJlMTEpO1xuICB9XG5cbiAgLy9jYWxjdWxhdGUgZmlyc3QgcG9pbnQgb2YgZnVuZGFtZW50YWwgcG9seWdvbiB1c2luZyBDb3hldGVyJ3MgbWV0aG9kXG4gIGZ1bmRhbWVudGFsUmVnaW9uKCkge1xuICAgIGNvbnN0IHMgPSBNYXRoLnNpbihNYXRoLlBJIC8gdGhpcy5wKTtcbiAgICBjb25zdCB0ID0gTWF0aC5jb3MoTWF0aC5QSSAvIHRoaXMucSk7XG4gICAgLy9tdWx0aXBseSB0aGVzZSBieSB0aGUgZGlza3MgcmFkaXVzIChDb3hldGVyIHVzZWQgdW5pdCBkaXNrKTtcbiAgICBjb25zdCByID0gMSAvIE1hdGguc3FydCgodCAqIHQpIC8gKHMgKiBzKSAtIDEpICogdGhpcy5yYWRpdXM7XG4gICAgY29uc3QgZCA9IDEgLyBNYXRoLnNxcnQoMSAtIChzICogcykgLyAodCAqIHQpKSAqIHRoaXMucmFkaXVzO1xuICAgIGNvbnN0IGIgPSB7XG4gICAgICB4OiB0aGlzLnJhZGl1cyAqIE1hdGguY29zKE1hdGguUEkgLyB0aGlzLnApLFxuICAgICAgeTogLXRoaXMucmFkaXVzICogTWF0aC5zaW4oTWF0aC5QSSAvIHRoaXMucClcbiAgICB9XG4gICAgY29uc3QgY2VudHJlID0ge1xuICAgICAgeDogZCxcbiAgICAgIHk6IDBcbiAgICB9O1xuICAgIC8vdGhlcmUgd2lsbCBiZSB0d28gcG9pbnRzIG9mIGludGVyc2VjdGlvbiwgb2Ygd2hpY2ggd2Ugd2FudCB0aGUgZmlyc3RcbiAgICBjb25zdCBwMSA9IEUuY2lyY2xlTGluZUludGVyc2VjdChjZW50cmUsIHIsIHRoaXMuZGlzay5jZW50cmUsIGIpLnAxO1xuXG4gICAgY29uc3QgcDIgPSB7XG4gICAgICB4OiBkIC0gcixcbiAgICAgIHk6IDBcbiAgICB9O1xuXG4gICAgY29uc3QgcG9pbnRzID0gW3RoaXMuZGlzay5jZW50cmUsIHAxLCBwMl07XG5cbiAgICByZXR1cm4gcG9pbnRzO1xuICB9XG5cbiAgLy9UaGUgdGVzc2VsYXRpb24gcmVxdWlyZXMgdGhhdCAocC0yKShxLTIpID4gNCB0byB3b3JrIChvdGhlcndpc2UgaXQgaXNcbiAgLy8gZWl0aGVyIGFuIGVsbGlwdGljYWwgb3IgZXVjbGlkZWFuIHRlc3NlbGF0aW9uKTtcbiAgY2hlY2tQYXJhbXMoKSB7XG4gICAgaWYgKHRoaXMubWF4TGF5ZXJzIDwgMCB8fCBpc05hTih0aGlzLm1heExheWVycykpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ21heExheWVycyBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAwJyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKCh0aGlzLnAgLSAyKSAqICh0aGlzLnEgLSAyKSA8PSA0KSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdIeXBlcmJvbGljIHRlc3NlbGF0aW9ucyByZXF1aXJlIHRoYXQgKHAtMSkocS0yKSA8IDQhJyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLy9Gb3Igbm93IHJlcXVpcmUgcCxxID4gMyxcbiAgICAvL1RPRE8gaW1wbGVtZW50IHNwZWNpYWwgY2FzZXMgZm9yIHEgPSAzIG9yIHAgPSAzXG4gICAgZWxzZSBpZiAodGhpcy5xIDw9IDMgfHwgaXNOYU4odGhpcy5xKSkge1xuICAgICAgY29uc29sZS5lcnJvcignVGVzc2VsYXRpb24gZXJyb3I6IGF0IGxlYXN0IDMgcC1nb25zIG11c3QgbWVldCBcXFxuICAgICAgICAgICAgICAgICAgICBhdCBlYWNoIHZlcnRleCEnKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wIDw9IDMgfHwgaXNOYU4odGhpcy5wKSkge1xuICAgICAgY29uc29sZS5lcnJvcignVGVzc2VsYXRpb24gZXJyb3I6IHBvbHlnb24gbmVlZHMgYXQgbGVhc3QgMyBzaWRlcyEnKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG59XG4iLCIvLyAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyAqXG4vLyAqICBUSFJFRSBKUyBDTEFTU1xuLy8gKlxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuZXhwb3J0IGNsYXNzIFRocmVlSlMge1xuICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGV2ZW50KSA9PiB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbG9hZCcpO1xuICAgICAgdGhpcy5pbml0KCk7XG4gICAgfSwgZmFsc2UpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgIC8vdGhpcy5jYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAvL3RoaXMuY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcbiAgICAgIC8vdGhpcy5yZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuXG4gICAgICB0aGlzLnJlc2V0KCk7XG4gICAgfSwgZmFsc2UpO1xuXG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcbiAgICB0aGlzLmluaXRDYW1lcmEoKTtcblxuICAgIHRoaXMuaW5pdExpZ2h0aW5nKCk7XG5cbiAgICB0aGlzLmF4ZXMoKTtcblxuICAgIHRoaXMuaW5pdFJlbmRlcmVyKCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLmlkKTsgLy8gU3RvcCB0aGUgYW5pbWF0aW9uXG4gICAgdGhpcy5yZW5kZXJlci5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgbnVsbCwgZmFsc2UpOyAvL3JlbW92ZSBsaXN0ZW5lciB0byByZW5kZXJcbiAgICB0aGlzLnNjZW5lID0gbnVsbDtcbiAgICB0aGlzLnByb2plY3RvciA9IG51bGw7XG4gICAgdGhpcy5jYW1lcmEgPSBudWxsO1xuICAgIHRoaXMuY29udHJvbHMgPSBudWxsO1xuXG4gICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdjYW52YXMnKTtcbiAgICBmb3IgKGxldCBpbmRleCA9IGVsZW1lbnQubGVuZ3RoIC0gMTsgaW5kZXggPj0gMDsgaW5kZXgtLSkge1xuICAgICAgZWxlbWVudFtpbmRleF0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtZW50W2luZGV4XSk7XG4gICAgfVxuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgaW5pdENhbWVyYSgpIHtcbiAgICB0aGlzLmNhbWVyYSA9IG5ldyBUSFJFRS5PcnRob2dyYXBoaWNDYW1lcmEod2luZG93LmlubmVyV2lkdGggLyAtMixcbiAgICAgIHdpbmRvdy5pbm5lcldpZHRoIC8gMiwgd2luZG93LmlubmVySGVpZ2h0IC8gMiwgd2luZG93LmlubmVySGVpZ2h0IC8gLTIsIC0yLCAxKTtcbiAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLmNhbWVyYSk7XG4gICAgdGhpcy5jYW1lcmEucG9zaXRpb24ueCA9IDA7XG4gICAgdGhpcy5jYW1lcmEucG9zaXRpb24ueSA9IDA7XG5cbiAgICB0aGlzLmNhbWVyYS5wb3NpdGlvbi56ID0gMTtcbiAgfVxuXG4gIGluaXRMaWdodGluZygpIHtcbiAgICAvL2NvbnN0IHNwb3RMaWdodCA9IG5ldyBUSFJFRS5TcG90TGlnaHQoMHhmZmZmZmYpO1xuICAgIC8vc3BvdExpZ2h0LnBvc2l0aW9uLnNldCgwLCAwLCAxMDApO1xuICAgIC8vdGhpcy5zY2VuZS5hZGQoc3BvdExpZ2h0KTtcbiAgICBjb25zdCBhbWJpZW50TGlnaHQgPSBuZXcgVEhSRUUuQW1iaWVudExpZ2h0KDB4ZmZmZmZmKTtcbiAgICB0aGlzLnNjZW5lLmFkZChhbWJpZW50TGlnaHQpO1xuICB9XG5cbiAgaW5pdFJlbmRlcmVyKCkge1xuICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7XG4gICAgICBhbnRpYWxpYXM6IHRydWUsXG4gICAgfSk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRDbGVhckNvbG9yKDB4ZmZmZmZmLCAxLjApO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMucmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgLy9iZWhpbmQ6IHRydWUvZmFsc2VcbiAgZGlzayhjZW50cmUsIHJhZGl1cywgY29sb3IsIGJlaGluZCkge1xuICAgIGxldCBjb2wgPSBjb2xvcjtcbiAgICBpZiAoY29sID09PSAndW5kZWZpbmVkJykgY29sID0gMHhmZmZmZmY7XG5cbiAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5DaXJjbGVHZW9tZXRyeShyYWRpdXMsIDEwMCwgMCwgMiAqIE1hdGguUEkpO1xuICAgIGNvbnN0IGNpcmNsZSA9IHRoaXMuY3JlYXRlTWVzaChnZW9tZXRyeSwgY29sKTtcbiAgICBjaXJjbGUucG9zaXRpb24ueCA9IGNlbnRyZS54O1xuICAgIGNpcmNsZS5wb3NpdGlvbi55ID0gY2VudHJlLnk7XG4gICAgaWYgKCFiZWhpbmQpIHtcbiAgICAgIGNpcmNsZS5wb3NpdGlvbi56ID0gMTtcbiAgICB9XG5cbiAgICB0aGlzLnNjZW5lLmFkZChjaXJjbGUpO1xuICB9XG5cbiAgc2VnbWVudChjaXJjbGUsIGFscGhhLCBvZmZzZXQsIGNvbG9yKSB7XG4gICAgbGV0IGNvbCA9IGNvbG9yO1xuICAgIGlmIChjb2wgPT09ICd1bmRlZmluZWQnKSBjb2wgPSAweGZmZmZmZjtcblxuICAgIGNvbnN0IGN1cnZlID0gbmV3IFRIUkVFLkVsbGlwc2VDdXJ2ZShcbiAgICAgIGNpcmNsZS5jZW50cmUueCwgY2lyY2xlLmNlbnRyZS55LCAvLyBheCwgYVlcbiAgICAgIGNpcmNsZS5yYWRpdXMsIGNpcmNsZS5yYWRpdXMsIC8vIHhSYWRpdXMsIHlSYWRpdXNcbiAgICAgIGFscGhhLCBvZmZzZXQsIC8vIGFTdGFydEFuZ2xlLCBhRW5kQW5nbGVcbiAgICAgIGZhbHNlIC8vIGFDbG9ja3dpc2VcbiAgICApO1xuXG4gICAgY29uc3QgcG9pbnRzID0gY3VydmUuZ2V0U3BhY2VkUG9pbnRzKDEwMCk7XG5cbiAgICBjb25zdCBwYXRoID0gbmV3IFRIUkVFLlBhdGgoKTtcbiAgICBjb25zdCBnZW9tZXRyeSA9IHBhdGguY3JlYXRlR2VvbWV0cnkocG9pbnRzKTtcblxuICAgIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKHtcbiAgICAgIGNvbG9yOiBjb2xcbiAgICB9KTtcbiAgICBjb25zdCBzID0gbmV3IFRIUkVFLkxpbmUoZ2VvbWV0cnksIG1hdGVyaWFsKTtcblxuICAgIHRoaXMuc2NlbmUuYWRkKHMpO1xuICB9XG5cbiAgbGluZShzdGFydCwgZW5kLCBjb2xvcikge1xuICAgIGxldCBjb2wgPSBjb2xvcjtcbiAgICBpZiAoY29sID09PSAndW5kZWZpbmVkJykgY29sID0gMHhmZmZmZmY7XG5cbiAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5HZW9tZXRyeSgpO1xuXG4gICAgZ2VvbWV0cnkudmVydGljZXMucHVzaChcbiAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKHN0YXJ0LngsIHN0YXJ0LnksIDApLFxuICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoZW5kLngsIGVuZC55LCAwKVxuICAgICk7XG4gICAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoe1xuICAgICAgY29sb3I6IGNvbFxuICAgIH0pO1xuICAgIGNvbnN0IGwgPSBuZXcgVEhSRUUuTGluZShnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgIHRoaXMuc2NlbmUuYWRkKGwpO1xuICB9XG5cbiAgcG9seWdvbih2ZXJ0aWNlcywgY29sb3IsIHRleHR1cmUpIHtcbiAgICBsZXQgY29sID0gY29sb3I7XG4gICAgaWYgKGNvbCA9PT0gJ3VuZGVmaW5lZCcpIGNvbCA9IDB4ZmZmZmZmO1xuXG4gICAgY29uc3QgcG9seSA9IG5ldyBUSFJFRS5TaGFwZSgpO1xuICAgIHBvbHkubW92ZVRvKHZlcnRpY2VzWzBdLngsIHZlcnRpY2VzWzBdLnkpO1xuXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCB2ZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgcG9seS5saW5lVG8odmVydGljZXNbaV0ueCwgdmVydGljZXNbaV0ueSlcbiAgICB9XG5cbiAgICBwb2x5LmxpbmVUbyh2ZXJ0aWNlc1swXS54LCB2ZXJ0aWNlc1swXS55KTtcblxuICAgIGNvbnN0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLlNoYXBlR2VvbWV0cnkocG9seSk7XG5cbiAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLmNyZWF0ZU1lc2goZ2VvbWV0cnksIGNvbG9yLCB0ZXh0dXJlKSk7XG4gIH1cblxuICBjcmVhdGVNZXNoKGdlb21ldHJ5LCBjb2xvciwgaW1hZ2VVUkwpIHtcbiAgICBsZXQgY29sID0gY29sb3I7XG4gICAgaWYgKGNvbCA9PT0gJ3VuZGVmaW5lZCcpIGNvbCA9IDB4ZmZmZmZmO1xuICAgIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcbiAgICAgIGNvbG9yOiBjb2wsXG4gICAgICAvL3dpcmVmcmFtZTogdHJ1ZVxuICAgIH0pO1xuXG4gICAgaWYgKGltYWdlVVJMKSB7XG4gICAgICBjb25zdCB0ZXh0dXJlTG9hZGVyID0gbmV3IFRIUkVFLlRleHR1cmVMb2FkZXIoKTtcblxuICAgICAgLy9sb2FkIHRleHR1cmUgYW5kIGFwcGx5IHRvIG1hdGVyaWFsIGluIGNhbGxiYWNrXG4gICAgICBjb25zdCB0ZXh0dXJlID0gdGV4dHVyZUxvYWRlci5sb2FkKGltYWdlVVJMLCAodGV4KSA9PiB7fSk7XG4gICAgICB0ZXh0dXJlLnJlcGVhdC5zZXQoMC4wNSwgMC4wNSk7XG4gICAgICBtYXRlcmlhbC5tYXAgPSB0ZXh0dXJlO1xuICAgICAgbWF0ZXJpYWwubWFwLndyYXBUID0gVEhSRUUuUmVwZWF0V3JhcHBpbmc7XG4gICAgICBtYXRlcmlhbC5tYXAud3JhcFMgPSBUSFJFRS5SZXBlYXRXcmFwcGluZztcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgfVxuXG4gIGF4ZXMoKSB7XG4gICAgY29uc3QgeHl6ID0gbmV3IFRIUkVFLkF4aXNIZWxwZXIoMjApO1xuICAgIHRoaXMuc2NlbmUuYWRkKHh5eik7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHRoaXMucmVuZGVyKClcbiAgICB9KTtcblxuICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUsIHRoaXMuY2FtZXJhKTtcbiAgfVxuXG59XG4iXX0=
