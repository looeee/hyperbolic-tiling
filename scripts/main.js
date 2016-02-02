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
       this.draw.disk(a.circle.centre, a.circle.radius, 0xffffff, false);
       const p4 = E.nextPoint(a.circle, p2, 20).p1;
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
      var arc = H.arc(p1, p2, this.circle);

      if (a.straightLine) {
        this.draw.line(p1, p2, col);
      } else {
        this.draw.segment(arc.circle, arc.startAngle, arc.endAngle, colour);
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
        var arc = H.arc(vertices[i], vertices[(i + 1) % l], this.circle);

        //line not through the origin (hyperbolic arc)
        if (!arc.straightLine) {
          if (arc.clockwise) {
            p = E.spacedPointOnArc(arc.circle, vertices[i], spacing).p2;
          } else {
            p = E.spacedPointOnArc(arc.circle, vertices[i], spacing).p1;
          }
          points.push(p);

          while (E.distance(p, vertices[(i + 1) % l]) > spacing) {

            if (arc.clockwise) {
              p = E.spacedPointOnArc(arc.circle, p, spacing).p2;
            } else {
              p = E.spacedPointOnArc(arc.circle, p, spacing).p1;
            }

            points.push(p);
          }
          points.push(vertices[(i + 1) % l]);
        }

        //line through origin (straight line)
        else {
            points.push(vertices[(i + 1) % l]);
          }
      }
      //TESTING
      //console.table(points);
      /*
      for(let point of points){
        this.point(point,2,0x10ded8);
      }
      */
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
var spacedPointOnArc = exports.spacedPointOnArc = function spacedPointOnArc(circle, point, spacing) {
  var cosTheta = -(spacing * spacing / (2 * circle.radius * circle.radius) - 1);
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
  if (E.throughOrigin(p1, p2)) {
    return {
      circle: circle,
      startAngle: 0,
      endAngle: 0,
      clockwise: false,
      straightLine: true
    };
  }
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
    circle: c,
    startAngle: startAngle,
    endAngle: endAngle,
    clockwise: clockwise,
    straightLine: false
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

  if (!a.straightLine) {
    for (var i = 0; i < l; i++) {
      newPoints.push(E.inverse(pointsArray[i], a.circle.radius, a.circle.centre));
    }
  } else {
    for (var i = 0; i < l; i++) {
      newPoints.push();
    }
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
      //this.disk.polygon(this.fr, 0xe80348);
      var poly2 = H.reflect(this.fr, this.fr[1], this.fr[2], this.disk.circle);
      //console.table(poly2);
      //this.disk.polygon(poly2, 0xc3167e);

      var poly3 = H.rotatePgonAboutOrigin(poly2, Math.PI / 5);
      //console.table(poly2);
      console.table(poly3);
      //this.disk.polygon(poly3, 0xd2be11);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJlczIwMTUvZGlzay5qcyIsImVzMjAxNS9ldWNsaWQuanMiLCJlczIwMTUvaHlwZXJib2xpYy5qcyIsImVzMjAxNS9tYWluLmpzIiwiZXMyMDE1L3JlZ3VsYXJUZXNzZWxhdGlvbi5qcyIsImVzMjAxNS90aHJlZWpzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7SUNBWSxDQUFDOzs7O0lBQ0QsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztJQWNBLElBQUksV0FBSixJQUFJO0FBQ2YsV0FEVyxJQUFJLEdBQ0Q7OzswQkFESCxJQUFJOztBQUViLFFBQUksQ0FBQyxJQUFJLEdBQUcsYUFiZCxPQUFPLEVBYW9CLENBQUM7O0FBRTFCLFVBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDekMsWUFBTSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ25DLFlBQUssSUFBSSxFQUFFLENBQUM7S0FDYixFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUVWLFVBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsWUFBTTtBQUN0QyxZQUFLLElBQUksRUFBRSxDQUFDO0tBQ2IsRUFBRSxLQUFLLENBQUMsQ0FBQztHQUVYOztlQWJVLElBQUk7OzJCQWVSO0FBQ0wsVUFBSSxDQUFDLE1BQU0sR0FBRztBQUNaLFNBQUMsRUFBRSxDQUFDO0FBQ0osU0FBQyxFQUFFLENBQUM7T0FDTDs7O0FBQUEsQUFHRCxVQUFJLENBQUMsTUFBTSxHQUFHLEFBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsV0FBVyxHQUFJLEFBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLEdBQUksQ0FBQyxHQUFHLEFBQUMsTUFBTSxDQUFDLFdBQVcsR0FBRyxDQUFDLEdBQUksQ0FBQyxDQUFDOztBQUVwSCxVQUFJLENBQUMsTUFBTSxHQUFHO0FB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QU07QUFDZCxVQUFNLEVBQUUsTUFBTTtHQUNmLENBQUM7Q0FDSDs7O0FBQUEsQUFHTSxJQUFNLGFBQWEsV0FBYixhQUFhLEdBQUcsU0FBaEIsYUFBYSxDQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFLO0FBQzFDLE1BQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsQ0FBQSxJQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBQztBQUNuSSxNQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLENBQUEsSUFBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUEsQUFBQyxDQUFDO0FBQ3ZJLE1BQUksTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzFDLFNBQU87QUFDTCxVQUFNLEVBQUU7QUFDTixPQUFDLEVBQUUsQ0FBQztBQUNKLE9BQUMsRUFBRSxDQUFDO0tBQ0w7QUFDRCxVQUFNLEVBQUUsTUFBTTtHQUNmLENBQUE7Q0FDRjs7Ozs7O0FBQUEsQUFNTSxJQUFNLGVBQWUsV0FBZixlQUFlLEdBQUcsU0FBbEIsZUFBZSxDQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBSztBQUNqRCxNQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2IsTUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNiLE1BQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDYixNQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2IsTUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsSUFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsSUFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsQ0FBQyxDQUFDOztBQUU1RCxNQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUEsSUFBSyxJQUFJLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQSxBQUFDLElBQUksSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUEsQUFBQyxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUEsQUFBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVwRyxNQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsR0FBSSxDQUFDLEdBQUcsQUFBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsSUFBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUEsQUFBQyxJQUFLLENBQUMsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFBLEFBQUMsQ0FBQztBQUNqRixNQUFJLEVBQUUsR0FBRyxRQUFRLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFBLEFBQUMsQ0FBQztBQUN0RCxNQUFJLEVBQUUsR0FBRyxRQUFRLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFBLEFBQUMsQ0FBQzs7QUFFdEQsTUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksQ0FBQyxHQUFHLEFBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLElBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFBLEFBQUMsSUFBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7QUFDakYsTUFBSSxFQUFFLEdBQUcsUUFBUSxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7QUFDdEQsTUFBSSxFQUFFLEdBQUcsUUFBUSxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7O0FBRXRELE1BQUksRUFBRSxHQUFHO0FBQ1AsS0FBQyxFQUFFLEVBQUU7QUFDTCxLQUFDLEVBQUUsRUFBRTtHQUNOLENBQUE7O0FBRUQsTUFBSSxFQUFFLEdBQUc7QUFDUCxLQUFDLEVBQUUsRUFBRTtBQUNMLEtBQUMs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SyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQSxBQUFDLEdBQUcsV0FBVyxJQUFJLEtBQUssQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUEsQUFBQyxDQUFDO0FBQ2xILE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLFFBQVEsSUFBSSxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBLEFBQUMsR0FBRyxXQUFXLElBQUksS0FBSyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQSxBQUFDLENBQUM7QUFDbEgsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsV0FBVyxJQUFJLEtBQUssQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUEsQUFBQyxHQUFHLFFBQVEsSUFBSSxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBQztBQUNsSCxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxXQUFXLElBQUksS0FBSyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQSxBQUFDLEdBQUcsUUFBUSxJQUFJLEtBQUssQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUEsQUFBQyxDQUFDOztBQUVsSCxNQUFNLEVBQUUsR0FBRztBQUNULEtBQUMsRUFBRSxJQUFJO0FBQ1AsS0FBQyxFQUFFLElBQUk7R0FDUixDQUFDO0FBQ0YsTUFBTSxFQUFFLEdBQUc7QUFDVCxLQUFDLEVBQUUsSUFBSTtBQUNQLEtBQUMsRUFBRSxJQUFJO0dBQ1IsQ0FBQztBQUNGLFNBQU87QUFDTCxNQUFFLEVBQUUsRUFBRTtBQUNOLE1BQUUsRUFBRSxFQUFFO0dBQ1AsQ0FB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LENBQUMsQ0FBQztBQUNyQyxVQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQzs7QUFBQyxBQUVyQyxVQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxBQUFDLENBQUMsR0FBRyxDQUFDLElBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUM3RCxVQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQUFBQyxDQUFDLEdBQUcsQ0FBQyxJQUFLLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUM3RCxVQUFNLENBQUMsR0FBRztBQUNSLFNBQUMsRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzNDLFNBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7T0FDN0MsQ0FBQTtBQUNELFVBQU0sTUFBTSxHQUFHO0FBQ2IsU0FBQyxFQUFFLENBQUM7QUFDSixTQUFDLEVBQUUsQ0FBQztPQUNMOztBQUFDLEFBRUYsVUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDOztBQUVwRSxVQUFNLEVBQUUsR0FBRztBQUNULFNBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQztBQUNSLFNBQUMsRUFBRSxDQUFDO09BQ0wsQ0FBQzs7QUFFRixVQUFNLE1BQU0sR0FBRyxD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dXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCAqIGFzIEUgZnJvbSAnLi9ldWNsaWQnO1xuaW1wb3J0ICogYXMgSCBmcm9tICcuL2h5cGVyYm9saWMnO1xuXG5pbXBvcnQge1xuICBUaHJlZUpTXG59XG5mcm9tICcuL3RocmVlanMnO1xuXG4vLyAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyAqXG4vLyAqICAgRElTSyBDTEFTU1xuLy8gKiAgIFBvaW5jYXJlIERpc2sgcmVwcmVzZW50YXRpb24gb2YgdGhlIGh5cGVyYm9saWMgcGxhbmVcbi8vICogICBDb250YWlucyBhbnkgZnVuY3Rpb25zIHVzZWQgdG8gZHJhdyB0byB0aGUgZGlza1xuLy8gKiAgIChDdXJyZW50bHkgdXNpbmcgdGhyZWUganMgYXMgZHJhd2luZyBjbGFzcylcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbmV4cG9ydCBjbGFzcyBEaXNrIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5kcmF3ID0gbmV3IFRocmVlSlMoKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGV2ZW50KSA9PiB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbG9hZCcpO1xuICAgICAgdGhpcy5pbml0KCk7XG4gICAgfSwgZmFsc2UpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH0sIGZhbHNlKTtcblxuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLmNlbnRyZSA9IHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwXG4gICAgfVxuXG4gICAgLy9kcmF3IGxhcmdlc3QgY2lyY2xlIHBvc3NpYmxlIGdpdmVuIHdpbmRvdyBkaW1zXG4gICAgdGhpcy5yYWRpdXMgPSAod2luZG93LmlubmVyV2lkdGggPCB3aW5kb3cuaW5uZXJIZWlnaHQpID8gKHdpbmRvdy5pbm5lcldpZHRoIC8gMikgLSA1IDogKHdpbmRvdy5pbm5lckhlaWdodCAvIDIpIC0gNTtcblxuICAgIHRoaXMuY2lyY2xlID0ge1xuICAgICAgY2VudHJlOiB0aGlzLmNlbnRyZSxcbiAgICAgIHJhZGl1czogdGhpcy5yYWRpdXNcbiAgICB9XG5cbiAgICAvL3NtYWxsZXIgY2lyY2xlIGZvciB0ZXN0aW5nXG4gICAgLy90aGlzLnJhZGl1cyA9IHRoaXMucmFkaXVzIC8gMjtcblxuICAgIHRoaXMuZHJhd0Rpc2soKTtcblxuICAgIC8vdGhpcy50ZXN0aW5nKCk7XG4gIH1cblxuICB0ZXN0aW5nKCkge1xuICAgIGNvbnN0IHAxID0ge1xuICAgICAgeDogMTAwLFxuICAgICAgeTogMjUwXG4gICAgfTtcbiAgICBjb25zdCBwMiA9IHtcbiAgICAgIHg6IC0xNTAsXG4gICAgICB5OiAxNTBcbiAgICB9O1xuICAgIGNvbnN0IHAzID0ge1xuICAgICAgeDogLTcwLFxuICAgICAgeTogLTI1MFxuICAgIH07XG5cbiAgICBjb25zdCBwNCA9IHtcbiAgICAgIHg6IC0xNzAsXG4gICAgICB5OiAtMTUwXG4gICAgfTtcblxuICAgIGNvbnN0IHA1ID0ge1xuICAgICAgeDogMTcwLFxuICAgICAgeTogLTE1MFxuICAgIH07XG4gICAgdGhpcy5wb2ludChwMSwgNSwgMHhmMDBmMGYpO1xuICAgIHRoaXMucG9pbnQocDIsIDUsIDB4ZmZmZjBmKTtcbiAgICB0aGlzLnBvaW50KHAzLCA1LCAweDFkMDBkNSk7XG4gICAgdGhpcy5wb2ludChwNCwgNSwgMHgwMGZmMGYpO1xuICAgIHRoaXMucG9pbnQocDUsIDUsIDB4MzU5NTQzKTtcblxuICAgIC8qXG4gICAgY29uc3QgYSA9IEguYXJjKHAxLCBwMik7XG5cbiAgICB0aGlzLmRyYXcuZGlzayhhLmNpcmNsZS5jZW50cmUsIGEuY2lyY2xlLnJhZGl1cywgMHhmZmZmZmYsIGZhbHNlKTtcblxuICAgIGNvbnN0IHA0ID0gRS5uZXh0UG9pbnQoYS5jaXJjbGUsIHAyLCAyMCkucDE7XG4gICAgY29uc29sZS5sb2cocDQpO1xuXG5cblxuICAgIC8vdGhpcy5kcmF3QXJjKHAyLCBwMywgMHhmMDBmMGYpO1xuICAgICovXG4gICAgLy90aGlzLnBvbHlnb25PdXRsaW5lKFtwMSwgcDIsIHAzXSwweGYwMGYwZilcbiAgICB0aGlzLnBvbHlnb24oW3AxLCBwMiwgcDQsIHAzLCBwNV0sIDB4NzAwNjlhKTtcbiAgICAvL3RoaXMucG9seWdvbihbcDIsIHAzLCBwNF0pO1xuICB9XG4gIGdldFJhZGl1cygpIHtcbiAgICByZXR1cm4gdGhpcy5yYWRpdXM7XG4gIH1cblxuICAvL2RyYXcgdGhlIGRpc2sgYmFja2dyb3VuZFxuICBkcmF3RGlzaygpIHtcbiAgICB0aGlzLmRyYXcuZGlzayh0aGlzLmNlbnRyZSwgdGhpcy5yYWRpdXMsIDB4MDAwMDAwLCB0cnVlKTtcbiAgfVxuXG4gIHBvaW50KGNlbnRyZSwgcmFkaXVzLCBjb2xvcikge1xuICAgIHRoaXMuZHJhdy5kaXNrKGNlbnRyZSwgcmFkaXVzLCBjb2xvciwgZmFsc2UpO1xuICB9XG5cbiAgLy9kcmF3IGEgaHlwZXJib2xpYyBsaW5lIGJldHdlZW4gdHdvIHBvaW50cyBvbiB0aGUgYm91bmRhcnkgY2lyY2xlXG4gIC8vVE9ETzogZml4IVxuICBsaW5lKHAxLCBwMiwgY29sb3IpIHtcbiAgICBjb25zdCBjID0gRS5ncmVhdENpcmNsZShwMSwgcDIsIHRoaXMucmFkaXVzLCB0aGlzLmNlbnRyZSk7XG4gICAgY29uc3QgcG9pbnRzID0gRS5jaXJjbGVJbnRlcnNlY3QodGhpcy5jZW50cmUsIGMuY2VudHJlLCB0aGlzLnJhZGl1cywgYy5yYWRpdXMpO1xuXG4gICAgdGhpcy5kcmF3QXJjKHBvaW50cy5wMSwgcG9pbnRzLnAyLCBjb2xvcilcbiAgfVxuXG4gIC8vRHJhdyBhbiBhcmMgKGh5cGVyYm9saWMgbGluZSBzZWdtZW50KSBiZXR3ZWVuIHR3byBwb2ludHMgb24gdGhlIGRpc2tcbiAgZHJhd0FyYyhwMSwgcDIsIGNvbG91cikge1xuICAgIC8vY2hlY2sgdGhhdCB0aGUgcG9pbnRzIGFyZSBpbiB0aGUgZGlza1xuICAgIGlmICh0aGlzLmNoZWNrUG9pbnRzKHAxLCBwMikpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICBjb25zdCBjb2wgPSBjb2xvdXIgfHwgMHhmZmZmZmY7XG4gICAgY29uc3QgYXJjID0gSC5hcmMocDEsIHAyLCB0aGlzLmNpcmNsZSk7XG5cbiAgICBpZiAoYS5zdHJhaWdodExpbmUpIHtcbiAgICAgIHRoaXMuZHJhdy5saW5lKHAxLCBwMiwgY29sKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kcmF3LnNlZ21lbnQoYXJjLmNpcmNsZSwgYXJjLnN0YXJ0QW5nbGUsIGFyYy5lbmRBbmdsZSwgY29sb3VyKTtcbiAgICB9XG4gIH1cblxuICBwb2x5Z29uT3V0bGluZSh2ZXJ0aWNlcywgY29sb3VyKSB7XG4gICAgY29uc3QgbCA9IHZlcnRpY2VzLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgdGhpcy5kcmF3QXJjKHZlcnRpY2VzW2ldLCB2ZXJ0aWNlc1soaSArIDEpICUgbF0sIGNvbG91cik7XG4gICAgfVxuICB9XG5cbiAgLy9jcmVhdGUgYW4gYXJyYXkgb2YgcG9pbnRzIHNwYWNlZCBlcXVhbGx5IGFyb3VuZCB0aGUgYXJjcyBkZWZpbmluZyBhIGh5cGVyYm9saWNcbiAgLy9wb2x5Z29uIGFuZCBwYXNzIHRoZXNlIHRvIFRocmVlSlMucG9seWdvbigpXG4gIC8vVE9ETyBtYWtlIHNwYWNpbmcgYSBmdW5jdGlvbiBvZiBmaW5hbCByZXNvbHV0aW9uXG4gIC8vVE9ETyBjaGVjayB3aGV0aGVyIHZlcnRpY2VzIGFyZSBpbiB0aGUgcmlnaHQgb3JkZXJcbiAgcG9seWdvbih2ZXJ0aWNlcywgY29sb3IsIHRleHR1cmUpIHtcbiAgICBjb25zdCBwb2ludHMgPSBbXTtcbiAgICBjb25zdCBzcGFjaW5nID0gNTtcbiAgICBjb25zdCBsID0gdmVydGljZXMubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbDsgaSsrKSB7XG4gICAgICBsZXQgcDtcbiAgICAgIGNvbnN0IGFyYyA9IEguYXJjKHZlcnRpY2VzW2ldLCB2ZXJ0aWNlc1soaSArIDEpICUgbF0sIHRoaXMuY2lyY2xlKTtcblxuICAgICAgLy9saW5lIG5vdCB0aHJvdWdoIHRoZSBvcmlnaW4gKGh5cGVyYm9saWMgYXJjKVxuICAgICAgaWYgKCFhcmMuc3RyYWlnaHRMaW5lKSB7XG4gICAgICAgIGlmIChhcmMuY2xvY2t3aXNlKSB7XG4gICAgICAgICAgcCA9IEUuc3BhY2VkUG9pbnRPbkFyYyhhcmMuY2lyY2xlLCB2ZXJ0aWNlc1tpXSwgc3BhY2luZykucDI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcCA9IEUuc3BhY2VkUG9pbnRPbkFyYyhhcmMuY2lyY2xlLCB2ZXJ0aWNlc1tpXSwgc3BhY2luZykucDE7XG4gICAgICAgIH1cbiAgICAgICAgcG9pbnRzLnB1c2gocCk7XG5cbiAgICAgICAgd2hpbGUgKEUuZGlzdGFuY2UocCwgdmVydGljZXNbKGkgKyAxKSAlIGxdKSA+IHNwYWNpbmcpIHtcblxuICAgICAgICAgIGlmIChhcmMuY2xvY2t3aXNlKSB7XG4gICAgICAgICAgICBwID0gRS5zcGFjZWRQb2ludE9uQXJjKGFyYy5jaXJjbGUsIHAsIHNwYWNpbmcpLnAyXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHAgPSBFLnNwYWNlZFBvaW50T25BcmMoYXJjLmNpcmNsZSwgcCwgc3BhY2luZykucDFcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBwb2ludHMucHVzaChwKTtcbiAgICAgICAgfVxuICAgICAgICBwb2ludHMucHVzaCh2ZXJ0aWNlc1soaSArIDEpICUgbF0pO1xuICAgICAgfVxuXG4gICAgICAvL2xpbmUgdGhyb3VnaCBvcmlnaW4gKHN0cmFpZ2h0IGxpbmUpXG4gICAgICBlbHNle1xuICAgICAgICBwb2ludHMucHVzaCh2ZXJ0aWNlc1soaSArIDEpICUgbF0pO1xuICAgICAgfVxuICAgIH1cbiAgICAvL1RFU1RJTkdcbiAgICAvL2NvbnNvbGUudGFibGUocG9pbnRzKTtcbiAgICAvKlxuICAgIGZvcihsZXQgcG9pbnQgb2YgcG9pbnRzKXtcbiAgICAgIHRoaXMucG9pbnQocG9pbnQsMiwweDEwZGVkOCk7XG4gICAgfVxuICAgICovXG4gICAgdGhpcy5kcmF3LnBvbHlnb24ocG9pbnRzLCBjb2xvciwgdGV4dHVyZSk7XG4gIH1cblxuICAvL3JldHVybiB0cnVlIGlmIGFueSBvZiB0aGUgcG9pbnRzIGlzIG5vdCBpbiB0aGUgZGlza1xuICBjaGVja1BvaW50cyguLi5wb2ludHMpIHtcbiAgICBjb25zdCByID0gdGhpcy5yYWRpdXM7XG4gICAgbGV0IHRlc3QgPSBmYWxzZTtcbiAgICBmb3IgKGxldCBwb2ludCBvZiBwb2ludHMpIHtcbiAgICAgIGlmIChFLmRpc3RhbmNlKHBvaW50LCB0aGlzLmNlbnRyZSkgPiByKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yISBQb2ludCAoJyArIHBvaW50LnggKyAnLCAnICsgcG9pbnQueSArICcpIGxpZXMgb3V0c2lkZSB0aGUgcGxhbmUhJyk7XG4gICAgICAgIHRlc3QgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGVzdCkgcmV0dXJuIHRydWVcbiAgICBlbHNlIHJldHVybiBmYWxzZVxuICB9XG59XG4iLCIvLyAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyAqXG4vLyAqICAgRVVDTElERUFOIEZVTkNUSU9OU1xuLy8gKiAgIGEgcGxhY2UgdG8gc3Rhc2ggYWxsIHRoZSBmdW5jdGlvbnMgdGhhdCBhcmUgZXVjbGlkZWFuIGdlb21ldHJpY2FsXG4vLyAqICAgb3BlcmF0aW9uc1xuLy8gKlxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4vL2Rpc3RhbmNlIGJldHdlZW4gdHdvIHBvaW50c1xuZXhwb3J0IGNvbnN0IGRpc3RhbmNlID0gKHAxLCBwMikgPT4gTWF0aC5zcXJ0KE1hdGgucG93KChwMi54IC0gcDEueCksIDIpICsgTWF0aC5wb3coKHAyLnkgLSBwMS55KSwgMikpO1xuXG4vL21pZHBvaW50IG9mIHRoZSBsaW5lIHNlZ21lbnQgY29ubmVjdGluZyB0d28gcG9pbnRzXG5leHBvcnQgY29uc3QgbWlkcG9pbnQgPSAocDEsIHAyKSA9PiB7XG4gIHJldHVybiB7XG4gICAgeDogKHAxLnggKyBwMi54KSAvIDIsXG4gICAgeTogKHAxLnkgKyBwMi55KSAvIDJcbiAgfVxufVxuXG4vL3Nsb3BlIG9mIGxpbmUgdGhyb3VnaCBwMSwgcDJcbmV4cG9ydCBjb25zdCBzbG9wZSA9IChwMSwgcDIpID0+IChwMi54IC0gcDEueCkgLyAocDIueSAtIHAxLnkpO1xuXG4vL3Nsb3BlIG9mIGxpbmUgcGVycGVuZGljdWxhciB0byBhIGxpbmUgZGVmaW5lZCBieSBwMSxwMlxuZXhwb3J0IGNvbnN0IHBlcnBlbmRpY3VsYXJTbG9wZSA9IChwMSwgcDIpID0+IC0xIC8gKE1hdGgucG93KHNsb3BlKHAxLCBwMiksIC0xKSk7XG5cbi8vaW50ZXJzZWN0aW9uIHBvaW50IG9mIHR3byBsaW5lcyBkZWZpbmVkIGJ5IHAxLG0xIGFuZCBxMSxtMlxuLy9OT1QgV09SS0lORyBGT1IgVkVSVElDQUwgTElORVMhISFcbmV4cG9ydCBjb25zdCBpbnRlcnNlY3Rpb24gPSAocDEsIG0xLCBwMiwgbTIpID0+IHtcbiAgbGV0IGMxLCBjMiwgeCwgeTtcbiAgLy9jYXNlIHdoZXJlIGZpcnN0IGxpbmUgaXMgdmVydGljYWxcbiAgLy9pZihtMSA+IDUwMDAgfHwgbTEgPCAtNTAwMCB8fCBtMSA9PT0gSW5maW5pdHkpe1xuICBpZiAocDEueSA8IDAuMDAwMDAxICYmIHAxLnkgPiAtMC4wMDAwMDEpIHtcbiAgICB4ID0gcDEueDtcbiAgICB5ID0gKG0yKSAqIChwMS54IC0gcDIueCkgKyBwMi55O1xuICB9XG4gIC8vY2FzZSB3aGVyZSBzZWNvbmQgbGluZSBpcyB2ZXJ0aWNhbFxuICAvL2Vsc2UgaWYobTIgPiA1MDAwIHx8IG0yIDwgLTUwMDAgfHwgbTEgPT09IEluZmluaXR5KXtcbiAgZWxzZSBpZiAocDIueSA8IDAuMDAwMDAxICYmIHAyLnkgPiAtMC4wMDAwMDEpIHtcbiAgICB4ID0gcDIueDtcbiAgICB5ID0gKG0xICogKHAyLnggLSBwMS54KSkgKyBwMS55O1xuICB9IGVsc2Uge1xuICAgIC8veSBpbnRlcmNlcHQgb2YgZmlyc3QgbGluZVxuICAgIGMxID0gcDEueSAtIG0xICogcDEueDtcbiAgICAvL3kgaW50ZXJjZXB0IG9mIHNlY29uZCBsaW5lXG4gICAgYzIgPSBwMi55IC0gbTIgKiBwMi54O1xuXG4gICAgeCA9IChjMiAtIGMxKSAvIChtMSAtIG0yKTtcbiAgICB5ID0gbTEgKiB4ICsgYzE7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHg6IHgsXG4gICAgeTogeVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCByYWRpYW5zID0gKGRlZ3JlZXMpID0+IChNYXRoLlBJIC8gMTgwKSAqIGRlZ3JlZXM7XG5cbi8vZ2V0IHRoZSBjaXJjbGUgaW52ZXJzZSBvZiBhIHBvaW50IHAgd2l0aCByZXNwZWN0IGEgY2lyY2xlIHJhZGl1cyByIGNlbnRyZSBjXG5leHBvcnQgY29uc3QgaW52ZXJzZSA9IChwLCByLCBjKSA9PiB7XG4gIGxldCBhbHBoYSA9IChyICogcikgLyAoTWF0aC5wb3cocC54IC0gYy54LCAyKSArIE1hdGgucG93KHAueSAtIGMueSwgMikpO1xuICByZXR1cm4ge1xuICAgIHg6IGFscGhhICogKHAueCAtIGMueCkgKyBjLngsXG4gICAgeTogYWxwaGEgKiAocC55IC0gYy55KSArIGMueVxuICB9O1xufVxuXG4vL2NhbGN1bGF0ZSB0aGUgcmFkaXVzIGFuZCBjZW50cmUgb2YgdGhlIGNpcmNsZSByZXF1aXJlZCB0byBkcmF3IGEgbGluZSBiZXR3ZWVuXG4vL3R3byBwb2ludHMgaW4gdGhlIGh5cGVyYm9saWMgcGxhbmUgZGVmaW5lZCBieSB0aGUgZGlzayAociwgYylcbmV4cG9ydCBjb25zdCBncmVhdENpcmNsZSA9IChwMSwgcDIsIHIsIGMpID0+IHtcbiAgbGV0IHAxSW52ZXJzZSA9IGludmVyc2UocDEsIHIsIGMpO1xuICBsZXQgcDJJbnZlcnNlID0gaW52ZXJzZShwMiwgciwgYyk7XG5cbiAgbGV0IG0gPSBtaWRwb2ludChwMSwgcDFJbnZlcnNlKTtcbiAgbGV0IG4gPSBtaWRwb2ludChwMiwgcDJJbnZlcnNlKTtcblxuICBsZXQgbTEgPSBwZXJwZW5kaWN1bGFyU2xvcGUobSwgcDFJbnZlcnNlKTtcbiAgbGV0IG0yID0gcGVycGVuZGljdWxhclNsb3BlKG4sIHAySW52ZXJzZSk7XG5cblxuICAvL2NlbnRyZSBpcyB0aGUgY2VudHJlcG9pbnQgb2YgdGhlIGNpcmNsZSBvdXQgb2Ygd2hpY2ggdGhlIGFyYyBpcyBtYWRlXG4gIGxldCBjZW50cmUgPSBpbnRlcnNlY3Rpb24obSwgbTEsIG4sIG0yKTtcbiAgbGV0IHJhZGl1cyA9IGRpc3RhbmNlKGNlbnRyZSwgcDEpO1xuICByZXR1cm4ge1xuICAgIGNlbnRyZTogY2VudHJlLFxuICAgIHJhZGl1czogcmFkaXVzXG4gIH07XG59XG5cbi8vYW4gYXR0ZW1wdCBhdCBjYWxjdWxhdGluZyB0aGUgY2lyY2xlIGFsZ2VicmFpY2FsbHlcbmV4cG9ydCBjb25zdCBncmVhdENpcmNsZVYyID0gKHAxLCBwMiwgcikgPT4ge1xuICBsZXQgeCA9IChwMi55ICogKHAxLnggKiBwMS54ICsgcikgKyBwMS55ICogcDEueSAqIHAyLnkgLSBwMS55ICogKHAyLnggKiBwMi54ICsgcDIueSAqIHAyLnkgKyByKSkgLyAoMiAqIHAxLnggKiBwMi55IC0gcDEueSAqIHAyLngpO1xuICBsZXQgeSA9IChwMS54ICogcDEueCAqIHAyLnggLSBwMS54ICogKHAyLnggKiBwMi54ICsgcDIueSAqIHAyLnkgKyByKSArIHAyLnggKiAocDEueSAqIHAxLnkgKyByKSkgLyAoMiAqIHAxLnkgKiBwMi54ICsgMiAqIHAxLnggKiBwMi55KTtcbiAgbGV0IHJhZGl1cyA9IE1hdGguc3FydCh4ICogeCArIHkgKiB5IC0gcik7XG4gIHJldHVybiB7XG4gICAgY2VudHJlOiB7XG4gICAgICB4OiB4LFxuICAgICAgeTogeVxuICAgIH0sXG4gICAgcmFkaXVzOiByYWRpdXNcbiAgfVxufVxuXG4vL2ludGVyc2VjdGlvbiBvZiB0d28gY2lyY2xlcyB3aXRoIGVxdWF0aW9uczpcbi8vKHgtYSleMiArKHktYSleMiA9IHIwXjJcbi8vKHgtYileMiArKHktYyleMiA9IHIxXjJcbi8vTk9URSBhc3N1bWVzIHRoZSB0d28gY2lyY2xlcyBETyBpbnRlcnNlY3QhXG5leHBvcnQgY29uc3QgY2lyY2xlSW50ZXJzZWN0ID0gKGMwLCBjMSwgcjAsIHIxKSA9PiB7XG4gIGxldCBhID0gYzAueDtcbiAgbGV0IGIgPSBjMC55O1xuICBsZXQgYyA9IGMxLng7XG4gIGxldCBkID0gYzEueTtcbiAgbGV0IGRpc3QgPSBNYXRoLnNxcnQoKGMgLSBhKSAqIChjIC0gYSkgKyAoZCAtIGIpICogKGQgLSBiKSk7XG5cbiAgbGV0IGRlbCA9IE1hdGguc3FydCgoZGlzdCArIHIwICsgcjEpICogKGRpc3QgKyByMCAtIHIxKSAqIChkaXN0IC0gcjAgKyByMSkgKiAoLWRpc3QgKyByMCArIHIxKSkgLyA0O1xuXG4gIGxldCB4UGFydGlhbCA9IChhICsgYykgLyAyICsgKChjIC0gYSkgKiAocjAgKiByMCAtIHIxICogcjEpKSAvICgyICogZGlzdCAqIGRpc3QpO1xuICBsZXQgeDEgPSB4UGFydGlhbCAtIDIgKiBkZWwgKiAoYiAtIGQpIC8gKGRpc3QgKiBkaXN0KTtcbiAgbGV0IHgyID0geFBhcnRpYWwgKyAyICogZGVsICogKGIgLSBkKSAvIChkaXN0ICogZGlzdCk7XG5cbiAgbGV0IHlQYXJ0aWFsID0gKGIgKyBkKSAvIDIgKyAoKGQgLSBiKSAqIChyMCAqIHIwIC0gcjEgKiByMSkpIC8gKDIgKiBkaXN0ICogZGlzdCk7XG4gIGxldCB5MSA9IHlQYXJ0aWFsICsgMiAqIGRlbCAqIChhIC0gYykgLyAoZGlzdCAqIGRpc3QpO1xuICBsZXQgeTIgPSB5UGFydGlhbCAtIDIgKiBkZWwgKiAoYSAtIGMpIC8gKGRpc3QgKiBkaXN0KTtcblxuICBsZXQgcDEgPSB7XG4gICAgeDogeDEsXG4gICAgeTogeTFcbiAgfVxuXG4gIGxldCBwMiA9IHtcbiAgICB4OiB4MixcbiAgICB5OiB5MlxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBwMTogcDEsXG4gICAgcDI6IHAyXG4gIH07XG59XG5cbmV4cG9ydCBjb25zdCBjaXJjbGVMaW5lSW50ZXJzZWN0ID0gKGMsIHIsIHAxLCBwMikgPT4ge1xuXG4gIGNvbnN0IGQgPSBkaXN0YW5jZShwMSwgcDIpO1xuICAvL3VuaXQgdmVjdG9yIHAxIHAyXG4gIGNvbnN0IGR4ID0gKHAyLnggLSBwMS54KSAvIGQ7XG4gIGNvbnN0IGR5ID0gKHAyLnkgLSBwMS55KSAvIGQ7XG5cbiAgLy9wb2ludCBvbiBsaW5lIGNsb3Nlc3QgdG8gY2lyY2xlIGNlbnRyZVxuICBjb25zdCB0ID0gZHggKiAoYy54IC0gcDEueCkgKyBkeSAqIChjLnkgLSBwMS55KTtcbiAgY29uc3QgcCA9IHtcbiAgICB4OiB0ICogZHggKyBwMS54LFxuICAgIHk6IHQgKiBkeSArIHAxLnlcbiAgfTtcblxuICAvL2Rpc3RhbmNlIGZyb20gdGhpcyBwb2ludCB0byBjZW50cmVcbiAgY29uc3QgZDIgPSBkaXN0YW5jZShwLCBjKTtcblxuICAvL2xpbmUgaW50ZXJzZWN0cyBjaXJjbGVcbiAgaWYgKGQyIDwgcikge1xuICAgIGNvbnN0IGR0ID0gTWF0aC5zcXJ0KHIgKiByIC0gZDIgKiBkMik7XG4gICAgLy9wb2ludCAxXG4gICAgY29uc3QgcTEgPSB7XG4gICAgICB4OiAodCAtIGR0KSAqIGR4ICsgcDEueCxcbiAgICAgIHk6ICh0IC0gZHQpICogZHkgKyBwMS55XG4gICAgfVxuICAgIC8vcG9pbnQgMlxuICAgIGNvbnN0IHEyID0ge1xuICAgICAgeDogKHQgKyBkdCkgKiBkeCArIHAxLngsXG4gICAgICB5OiAodCArIGR0KSAqIGR5ICsgcDEueVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBwMTogcTEsXG4gICAgICBwMjogcTJcbiAgICB9O1xuICB9IGVsc2UgaWYgKGQyID09PSByKSB7XG4gICAgcmV0dXJuIHA7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3I6IGxpbmUgZG9lcyBub3QgaW50ZXJzZWN0IGNpcmNsZSEnKTtcbiAgfVxufVxuXG4vL2FuZ2xlIGluIHJhZGlhbnMgYmV0d2VlbiB0d28gcG9pbnRzIG9uIGNpcmNsZSBvZiByYWRpdXMgclxuZXhwb3J0IGNvbnN0IGNlbnRyYWxBbmdsZSA9IChwMSwgcDIsIHIpID0+IHtcbiAgcmV0dXJuIDIgKiBNYXRoLmFzaW4oMC41ICogZGlzdGFuY2UocDEsIHAyKSAvIHIpO1xufVxuXG4vL2NhbGN1bGF0ZSB0aGUgbm9ybWFsIHZlY3RvciBnaXZlbiAyIHBvaW50c1xuZXhwb3J0IGNvbnN0IG5vcm1hbFZlY3RvciA9IChwMSwgcDIpID0+IHtcbiAgbGV0IGQgPSBNYXRoLnNxcnQoTWF0aC5wb3cocDIueCAtIHAxLngsIDIpICsgTWF0aC5wb3cocDIueSAtIHAxLnksIDIpKTtcbiAgcmV0dXJuIHtcbiAgICB4OiAocDIueCAtIHAxLngpIC8gZCxcbiAgICB5OiAocDIueSAtIHAxLnkpIC8gZFxuICB9XG59XG5cbi8vZG9lcyB0aGUgbGluZSBjb25uZWN0aW5nIHAxLCBwMiBnbyB0aHJvdWdoIHRoZSBwb2ludCAoMCwwKT9cbmV4cG9ydCBjb25zdCB0aHJvdWdoT3JpZ2luID0gKHAxLCBwMikgPT4ge1xuICBpZiAocDEueCA9PT0gMCAmJiBwMi54ID09PSAwKSB7XG4gICAgLy92ZXJ0aWNhbCBsaW5lIHRocm91Z2ggY2VudHJlXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgY29uc3QgdGVzdCA9ICgtcDEueCAqIHAyLnkgKyBwMS54ICogcDEueSkgLyAocDIueCAtIHAxLngpICsgcDEueTtcbiAgaWYgKHRlc3QgPT09IDApIHJldHVybiB0cnVlO1xuICBlbHNlIHJldHVybiBmYWxzZTtcbn1cblxuLy9maW5kIHRoZSBjZW50cm9pZCBvZiBhIG5vbi1zZWxmLWludGVyc2VjdGluZyBwb2x5Z29uXG5leHBvcnQgY29uc3QgY2VudHJvaWRPZlBvbHlnb24gPSAocG9pbnRzKSA9PiB7XG4gIGxldCBmaXJzdCA9IHBvaW50c1swXSxcbiAgICBsYXN0ID0gcG9pbnRzW3BvaW50cy5sZW5ndGggLSAxXTtcbiAgaWYgKGZpcnN0LnggIT0gbGFzdC54IHx8IGZpcnN0LnkgIT0gbGFzdC55KSBwb2ludHMucHVzaChmaXJzdCk7XG4gIGxldCB0d2ljZWFyZWEgPSAwLFxuICAgIHggPSAwLFxuICAgIHkgPSAwLFxuICAgIG5QdHMgPSBwb2ludHMubGVuZ3RoLFxuICAgIHAxLCBwMiwgZjtcbiAgZm9yICh2YXIgaSA9IDAsIGogPSBuUHRzIC0gMTsgaSA8IG5QdHM7IGogPSBpKyspIHtcbiAgICBwMSA9IHBvaW50c1tpXTtcbiAgICBwMiA9IHBvaW50c1tqXTtcbiAgICBmID0gcDEueCAqIHAyLnkgLSBwMi54ICogcDEueTtcbiAgICB0d2ljZWFyZWEgKz0gZjtcbiAgICB4ICs9IChwMS54ICsgcDIueCkgKiBmO1xuICAgIHkgKz0gKHAxLnkgKyBwMi55KSAqIGY7XG4gIH1cbiAgZiA9IHR3aWNlYXJlYSAqIDM7XG4gIHJldHVybiB7XG4gICAgeDogeCAvIGYsXG4gICAgeTogeSAvIGZcbiAgfTtcbn1cblxuLy9jb21wYXJlIHR3byBwb2ludHMgdGFraW5nIHJvdW5kaW5nIGVycm9ycyBpbnRvIGFjY291bnRcbmV4cG9ydCBjb25zdCBjb21wYXJlUG9pbnRzID0gKHAxLCBwMikgPT4ge1xuICBpZiAodHlwZW9mIHAxID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgcDIgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcDEgPSBwb2ludFRvRml4ZWQocDEsIDYpO1xuICBwMiA9IHBvaW50VG9GaXhlZChwMiwgNik7XG4gIGlmIChwMS54ID09PSBwMi54ICYmIHAxLnkgPT09IHAyLnkpIHJldHVybiB0cnVlO1xuICBlbHNlIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGNvbnN0IHBvaW50VG9GaXhlZCA9IChwLCBwbGFjZXMpID0+IHtcbiAgcmV0dXJuIHtcbiAgICB4OiBwLngudG9GaXhlZChwbGFjZXMpLFxuICAgIHk6IHAueS50b0ZpeGVkKHBsYWNlcylcbiAgfTtcbn1cblxuLy9maW5kIGEgcG9pbnQgYXQgYSBkaXN0YW5jZSBkIGFsb25nIHRoZSBjaXJjdW1mZXJlbmNlIG9mXG4vL2EgY2lyY2xlIG9mIHJhZGl1cyByLCBjZW50cmUgYyBmcm9tIGEgcG9pbnQgYWxzb1xuLy9vbiB0aGUgY2lyY3VtZmVyZW5jZVxuZXhwb3J0IGNvbnN0IHNwYWNlZFBvaW50T25BcmMgPSAoY2lyY2xlLCBwb2ludCwgc3BhY2luZykgPT4ge1xuICBjb25zdCBjb3NUaGV0YSA9IC0oKHNwYWNpbmcgKiBzcGFjaW5nKSAvICgyICogY2lyY2xlLnJhZGl1cyAqIGNpcmNsZS5yYWRpdXMpIC0gMSk7XG4gIGNvbnN0IHNpblRoZXRhUG9zID0gTWF0aC5zcXJ0KDEgLSBNYXRoLnBvdyhjb3NUaGV0YSwgMikpO1xuICBjb25zdCBzaW5UaGV0YU5lZyA9IC1zaW5UaGV0YVBvcztcblxuICBjb25zdCB4UG9zID0gY2lyY2xlLmNlbnRyZS54ICsgY29zVGhldGEgKiAocG9pbnQueCAtIGNpcmNsZS5jZW50cmUueCkgLSBzaW5UaGV0YVBvcyAqIChwb2ludC55IC0gY2lyY2xlLmNlbnRyZS55KTtcbiAgY29uc3QgeE5lZyA9IGNpcmNsZS5jZW50cmUueCArIGNvc1RoZXRhICogKHBvaW50LnggLSBjaXJjbGUuY2VudHJlLngpIC0gc2luVGhldGFOZWcgKiAocG9pbnQueSAtIGNpcmNsZS5jZW50cmUueSk7XG4gIGNvbnN0IHlQb3MgPSBjaXJjbGUuY2VudHJlLnkgKyBzaW5UaGV0YVBvcyAqIChwb2ludC54IC0gY2lyY2xlLmNlbnRyZS54KSArIGNvc1RoZXRhICogKHBvaW50LnkgLSBjaXJjbGUuY2VudHJlLnkpO1xuICBjb25zdCB5TmVnID0gY2lyY2xlLmNlbnRyZS55ICsgc2luVGhldGFOZWcgKiAocG9pbnQueCAtIGNpcmNsZS5jZW50cmUueCkgKyBjb3NUaGV0YSAqIChwb2ludC55IC0gY2lyY2xlLmNlbnRyZS55KTtcblxuICBjb25zdCBwMSA9IHtcbiAgICB4OiB4UG9zLFxuICAgIHk6IHlQb3NcbiAgfTtcbiAgY29uc3QgcDIgPSB7XG4gICAgeDogeE5lZyxcbiAgICB5OiB5TmVnXG4gIH07XG4gIHJldHVybiB7XG4gICAgcDE6IHAxLFxuICAgIHAyOiBwMlxuICB9XG59XG4iLCJpbXBvcnQgKiBhcyBFIGZyb20gJy4vZXVjbGlkJztcbi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICpcbi8vICogICBIWVBFUkJPTElDIEZVTkNUSU9OU1xuLy8gKiAgIGEgcGxhY2UgdG8gc3Rhc2ggYWxsIHRoZSBmdW5jdGlvbnMgdGhhdCBhcmUgaHlwZXJib2xpYyBnZW1lb21ldHJpY2FsXG4vLyAqICAgb3BlcmF0aW9uc1xuLy8gKlxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4vL2NhbGN1bGF0ZSBncmVhdENpcmNsZSwgc3RhcnRBbmdsZSBhbmQgZW5kQW5nbGUgZm9yIGh5cGVyYm9saWMgYXJjXG4vL1RPRE8gZGVhbCB3aXRoIGNhc2Ugb2Ygc3RhaWdodCBsaW5lcyB0aHJvdWdoIGNlbnRyZVxuZXhwb3J0IGNvbnN0IGFyYyA9ICggcDEsIHAyLCBjaXJjbGUgKSA9PiB7XG4gIGlmKEUudGhyb3VnaE9yaWdpbihwMSxwMikpe1xuICAgIHJldHVybiB7XG4gICAgICBjaXJjbGU6IGNpcmNsZSxcbiAgICAgIHN0YXJ0QW5nbGU6IDAsXG4gICAgICBlbmRBbmdsZTogMCxcbiAgICAgIGNsb2Nrd2lzZTogZmFsc2UsXG4gICAgICBzdHJhaWdodExpbmU6IHRydWUsXG4gICAgfVxuICB9XG4gIGxldCBjbG9ja3dpc2UgPSBmYWxzZTtcbiAgbGV0IGFscGhhMSwgYWxwaGEyLCBzdGFydEFuZ2xlLCBlbmRBbmdsZTtcbiAgY29uc3QgYyA9IEUuZ3JlYXRDaXJjbGUoIHAxLCBwMiwgY2lyY2xlLnJhZGl1cywgY2lyY2xlLmNlbnRyZSApO1xuXG4gIGNvbnN0IG95ID0gYy5jZW50cmUueTtcbiAgY29uc3Qgb3ggPSBjLmNlbnRyZS54O1xuXG4gIC8vcG9pbnQgYXQgMCByYWRpYW5zIG9uIGNcbiAgY29uc3QgcDMgPSB7XG4gICAgeDogb3ggKyBjLnJhZGl1cyxcbiAgICB5OiBveVxuICB9XG5cbiAgLy9jYWxjdWxhdGUgdGhlIHBvc2l0aW9uIG9mIGVhY2ggcG9pbnQgaW4gdGhlIGNpcmNsZVxuICBhbHBoYTEgPSBFLmNlbnRyYWxBbmdsZSggcDMsIHAxLCBjLnJhZGl1cyApO1xuICBhbHBoYTEgPSAoIHAxLnkgPCBveSApID8gMiAqIE1hdGguUEkgLSBhbHBoYTEgOiBhbHBoYTE7XG4gIGFscGhhMiA9IEUuY2VudHJhbEFuZ2xlKCBwMywgcDIsIGMucmFkaXVzICk7XG4gIGFscGhhMiA9ICggcDIueSA8IG95ICkgPyAyICogTWF0aC5QSSAtIGFscGhhMiA6IGFscGhhMjtcblxuICAvL2Nhc2Ugd2hlcmUgcDEgYWJvdmUgYW5kIHAyIGJlbG93IHRoZSBsaW5lIGMuY2VudHJlIC0+IHAzXG4gIGlmICggKCBwMS54ID4gb3ggJiYgcDIueCA+IG94ICkgJiYgKCBwMS55IDwgb3kgJiYgcDIueSA+IG95ICkgKSB7XG4gICAgc3RhcnRBbmdsZSA9IGFscGhhMTtcbiAgICBlbmRBbmdsZSA9IGFscGhhMjtcbiAgfVxuICAvL2Nhc2Ugd2hlcmUgcDIgYWJvdmUgYW5kIHAxIGJlbG93IHRoZSBsaW5lIGMuY2VudHJlIC0+IHAzXG4gIGVsc2UgaWYgKCAoIHAxLnggPiBveCAmJiBwMi54ID4gb3ggKSAmJiAoIHAxLnkgPiBveSAmJiBwMi55IDwgb3kgKSApIHtcbiAgICBzdGFydEFuZ2xlID0gYWxwaGEyO1xuICAgIGVuZEFuZ2xlID0gYWxwaGExO1xuICAgIGNsb2Nrd2lzZSA9IHRydWU7XG4gIH1cbiAgLy9wb2ludHMgaW4gY2xvY2t3aXNlIG9yZGVyXG4gIGVsc2UgaWYgKCBhbHBoYTEgPiBhbHBoYTIgKSB7XG4gICAgc3RhcnRBbmdsZSA9IGFscGhhMjtcbiAgICBlbmRBbmdsZSA9IGFscGhhMTtcbiAgICBjbG9ja3dpc2UgPSB0cnVlO1xuICB9XG4gIC8vcG9pbnRzIGluIGFudGljbG9ja3dpc2Ugb3JkZXJcbiAgZWxzZSB7XG4gICAgc3RhcnRBbmdsZSA9IGFscGhhMTtcbiAgICBlbmRBbmdsZSA9IGFscGhhMjtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgY2lyY2xlOiBjLFxuICAgIHN0YXJ0QW5nbGU6IHN0YXJ0QW5nbGUsXG4gICAgZW5kQW5nbGU6IGVuZEFuZ2xlLFxuICAgIGNsb2Nrd2lzZTogY2xvY2t3aXNlLFxuICAgIHN0cmFpZ2h0TGluZTogZmFsc2UsXG4gIH1cbn1cblxuLy90cmFuc2xhdGUgYSBzZXQgb2YgcG9pbnRzIGFsb25nIHRoZSB4IGF4aXNcbmV4cG9ydCBjb25zdCB0cmFuc2xhdGVYID0gKCBwb2ludHNBcnJheSwgZGlzdGFuY2UgKSA9PiB7XG4gIGNvbnN0IGwgPSBwb2ludHNBcnJheS5sZW5ndGg7XG4gIGNvbnN0IG5ld1BvaW50cyA9IFtdO1xuICBjb25zdCBlID0gTWF0aC5wb3coIE1hdGguRSwgZGlzdGFuY2UgKTtcbiAgY29uc3QgcG9zID0gZSArIDE7XG4gIGNvbnN0IG5lZyA9IGUgLSAxO1xuICBmb3IgKCBsZXQgaSA9IDA7IGkgPCBsOyBpKysgKSB7XG4gICAgY29uc3QgeCA9IHBvcyAqIHBvaW50c0FycmF5WyBpIF0ueCArIG5lZyAqIHBvaW50c0FycmF5WyBpIF0ueTtcbiAgICBjb25zdCB5ID0gbmVnICogcG9pbnRzQXJyYXlbIGkgXS54ICsgcG9zICogcG9pbnRzQXJyYXlbIGkgXS55O1xuICAgIG5ld1BvaW50cy5wdXNoKCB7XG4gICAgICB4OiB4LFxuICAgICAgeTogeVxuICAgIH0gKVxuICB9XG4gIHJldHVybiBuZXdQb2ludHM7XG59XG5cbi8vcm90YXRlIGEgc2V0IG9mIHBvaW50cyBhYm91dCBhIHBvaW50IGJ5IGEgZ2l2ZW4gYW5nbGVcbi8vY2xvY2t3aXNlIGRlZmF1bHRzIHRvIGZhbHNlXG5leHBvcnQgY29uc3Qgcm90YXRpb24gPSAoIHBvaW50c0FycmF5LCBwb2ludCwgYW5nbGUsIGNsb2Nrd2lzZSApID0+IHtcblxufVxuXG4vL3JlZmxlY3QgYSBzZXQgb2YgcG9pbnRzIGFjcm9zcyBhIGh5cGVyYm9saWMgYXJjXG4vL1RPRE8gYWRkIGNhc2Ugd2hlcmUgcmVmbGVjdGlvbiBpcyBhY3Jvc3Mgc3RyYWlnaHQgbGluZVxuZXhwb3J0IGNvbnN0IHJlZmxlY3QgPSAoIHBvaW50c0FycmF5LCBwMSwgcDIsIGNpcmNsZSApID0+IHtcbiAgY29uc3QgbCA9IHBvaW50c0FycmF5Lmxlbmd0aDtcbiAgY29uc3QgYSA9IGFyYyggcDEsIHAyLCBjaXJjbGUgKTtcbiAgY29uc3QgbmV3UG9pbnRzID0gW107XG4gIFxuICBpZighYS5zdHJhaWdodExpbmUpe1xuICAgIGZvciAoIGxldCBpID0gMDsgaSA8IGw7IGkrKyApIHtcbiAgICAgIG5ld1BvaW50cy5wdXNoKCBFLmludmVyc2UoIHBvaW50c0FycmF5WyBpIF0sIGEuY2lyY2xlLnJhZGl1cywgYS5jaXJjbGUuY2VudHJlICkgKTtcbiAgICB9XG4gIH1cbiAgZWxzZXtcbiAgICBmb3IgKCBsZXQgaSA9IDA7IGkgPCBsOyBpKysgKSB7XG4gICAgICBuZXdQb2ludHMucHVzaCggKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG5ld1BvaW50cztcbn1cblxuZXhwb3J0IGNvbnN0IHBvaW5jYXJlVG9XZWllcnN0cmFzcyA9ICggcG9pbnQyRCApID0+IHtcbiAgY29uc3QgZmFjdG9yID0gMSAvICggMSAtIHBvaW50MkQueCAqIHBvaW50MkQueCAtIHBvaW50MkQueSAqIHBvaW50MkQueSApO1xuICByZXR1cm4ge1xuICAgIHg6IDIgKiBmYWN0b3IgKiBwb2ludDJELngsXG4gICAgeTogMiAqIGZhY3RvciAqIHBvaW50MkQueSxcbiAgICB6OiBmYWN0b3IgKiAoIDEgKyBwb2ludDJELnggKiBwb2ludDJELnggKyBwb2ludDJELnkgKiBwb2ludDJELnkgKVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCB3ZWllcnN0cmFzc1RvUG9pbmNhcmUgPSAoIHBvaW50M0QgKSA9PiB7XG4gIGNvbnN0IGZhY3RvciA9IDEgLyAoIDEgKyBwb2ludDNELnogKTtcbiAgcmV0dXJuIHtcbiAgICB4OiBmYWN0b3IgKiBwb2ludDNELngsXG4gICAgeTogZmFjdG9yICogcG9pbnQzRC55XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHJvdGF0ZUFib3V0T3JpZ2luV2VpZXJzdHJhc3MgPSAoIHBvaW50M0QsIGFuZ2xlICkgPT4ge1xuICByZXR1cm4ge1xuICAgIHg6IE1hdGguY29zKCBhbmdsZSApICogcG9pbnQzRC54IC0gTWF0aC5zaW4oIGFuZ2xlICkgKiBwb2ludDNELnksXG4gICAgeTogTWF0aC5zaW4oIGFuZ2xlICkgKiBwb2ludDNELnggKyBNYXRoLmNvcyggYW5nbGUgKSAqIHBvaW50M0QueSxcbiAgICB6OiBwb2ludDNELnpcbiAgfVxufVxuXG5leHBvcnQgY29uc3Qgcm90YXRlUGdvbkFib3V0T3JpZ2luID0gKCBwb2ludHMyREFycmF5LCBhbmdsZSApID0+IHtcbiAgY29uc3QgbCA9IHBvaW50czJEQXJyYXkubGVuZ3RoO1xuICBjb25zdCByb3RhdGVkUG9pbnRzMkRBcnJheSA9IFtdO1xuICBmb3IgKCBsZXQgaSA9IDA7IGkgPCBsOyBpKysgKSB7XG4gICAgbGV0IHBvaW50ID0gcG9pbmNhcmVUb1dlaWVyc3RyYXNzKCBwb2ludHMyREFycmF5WyBpIF0gKTtcbiAgICBwb2ludCA9IHJvdGF0ZUFib3V0T3JpZ2luV2VpZXJzdHJhc3MoIHBvaW50LCBhbmdsZSApO1xuICAgIHBvaW50ID0gd2VpZXJzdHJhc3NUb1BvaW5jYXJlKHBvaW50KTtcbiAgICByb3RhdGVkUG9pbnRzMkRBcnJheS5wdXNoKHBvaW50KTtcbiAgfVxuICByZXR1cm4gcm90YXRlZFBvaW50czJEQXJyYXk7XG59XG4iLCJpbXBvcnQgeyBSZWd1bGFyVGVzc2VsYXRpb24gfSBmcm9tICcuL3JlZ3VsYXJUZXNzZWxhdGlvbic7XG5pbXBvcnQgKiBhcyBFIGZyb20gJy4vZXVjbGlkJztcbmltcG9ydCB7IERpc2sgfSBmcm9tICcuL2Rpc2snO1xuXG5cbi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICpcbi8vICogICBTRVRVUFxuLy8gKlxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4vL2NvbnN0IGRpc2sgPSBuZXcgRGlzaygpO1xuXG5jb25zdCB0ZXNzZWxhdGlvbiA9IG5ldyBSZWd1bGFyVGVzc2VsYXRpb24oNCwgNSwgMCwgJ3JlZCcpO1xuIiwiaW1wb3J0ICogYXMgRSBmcm9tICcuL2V1Y2xpZCc7XG5pbXBvcnQgKiBhcyBIIGZyb20gJy4vaHlwZXJib2xpYyc7XG5pbXBvcnQge1xuICBEaXNrXG59XG5mcm9tICcuL2Rpc2snO1xuXG5cbi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICogICAgVEVTU0VMQVRJT04gQ0xBU1Ncbi8vICogICAgQ3JlYXRlcyBhIHJlZ3VsYXIgVGVzc2VsYXRpb24gb2YgdGhlIFBvaW5jYXJlIERpc2tcbi8vICogICAgcTogbnVtYmVyIG9mIHAtZ29ucyBtZWV0aW5nIGF0IGVhY2ggdmVydGV4XG4vLyAqICAgIHA6IG51bWJlciBvZiBzaWRlcyBvZiBwLWdvblxuLy8gKiAgICB1c2luZyB0aGUgdGVjaG5pcXVlcyBjcmVhdGVkIGJ5IENveGV0ZXIgYW5kIER1bmhhbVxuLy8gKlxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuZXhwb3J0IGNsYXNzIFJlZ3VsYXJUZXNzZWxhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHAsIHEsIHJvdGF0aW9uLCBjb2xvdXIsIG1heExheWVycykge1xuICAgIHRoaXMuZGlzayA9IG5ldyBEaXNrKCk7XG5cbiAgICB0aGlzLmNlbnRyZSA9IHtcbiAgICAgIHg6IDAsXG4gICAgICB5OiAwXG4gICAgfVxuICAgIHRoaXMucCA9IHA7XG4gICAgdGhpcy5xID0gcTtcbiAgICB0aGlzLmNvbG91ciA9IGNvbG91ciB8fCAnYmxhY2snO1xuICAgIHRoaXMucm90YXRpb24gPSByb3RhdGlvbiB8fCAwO1xuICAgIHRoaXMubWF4TGF5ZXJzID0gbWF4TGF5ZXJzIHx8IDU7XG5cbiAgICBpZiAodGhpcy5jaGVja1BhcmFtcygpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZXZlbnQpID0+IHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJyk7XG4gICAgICB0aGlzLmluaXQoKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgdGhpcy5pbml0KCk7XG4gICAgfSwgZmFsc2UpO1xuXG5cblxuICB9XG5cbiAgaW5pdCgpIHtcbiAgICB0aGlzLnJhZGl1cyA9IHRoaXMuZGlzay5nZXRSYWRpdXMoKTtcbiAgICB0aGlzLmZyID0gdGhpcy5mdW5kYW1lbnRhbFJlZ2lvbigpO1xuICAgIHRoaXMudGVzdGluZygpO1xuICB9XG5cbiAgdGVzdGluZygpIHtcbiAgICAvL3RoaXMuZGlzay5wb2x5Z29uT3V0bGluZShbdGhpcy5mci5hLCB0aGlzLmZyLmIsIHRoaXMuZnIuY10sIDB4NTMxMmJhKTtcbiAgICAvL3RoaXMuZGlzay5wb2x5Z29uKHRoaXMuZnIsIDB4ZTgwMzQ4KTtcbiAgICBjb25zdCBwb2x5MiA9IEgucmVmbGVjdCh0aGlzLmZyLCB0aGlzLmZyWzFdLCB0aGlzLmZyWzJdLCB0aGlzLmRpc2suY2lyY2xlKTtcbiAgICAvL2NvbnNvbGUudGFibGUocG9seTIpO1xuICAgIC8vdGhpcy5kaXNrLnBvbHlnb24ocG9seTIsIDB4YzMxNjdlKTtcblxuICAgIGNvbnN0IHBvbHkzID0gSC5yb3RhdGVQZ29uQWJvdXRPcmlnaW4ocG9seTIsIE1hdGguUEkvNSk7XG4gICAgLy9jb25zb2xlLnRhYmxlKHBvbHkyKTtcbiAgICBjb25zb2xlLnRhYmxlKHBvbHkzKTtcbiAgICAvL3RoaXMuZGlzay5wb2x5Z29uKHBvbHkzLCAweGQyYmUxMSk7XG4gIH1cblxuICAvL2NhbGN1bGF0ZSBmaXJzdCBwb2ludCBvZiBmdW5kYW1lbnRhbCBwb2x5Z29uIHVzaW5nIENveGV0ZXIncyBtZXRob2RcbiAgZnVuZGFtZW50YWxSZWdpb24oKSB7XG4gICAgY29uc3QgcyA9IE1hdGguc2luKE1hdGguUEkgLyB0aGlzLnApO1xuICAgIGNvbnN0IHQgPSBNYXRoLmNvcyhNYXRoLlBJIC8gdGhpcy5xKTtcbiAgICAvL211bHRpcGx5IHRoZXNlIGJ5IHRoZSBkaXNrcyByYWRpdXMgKENveGV0ZXIgdXNlZCB1bml0IGRpc2spO1xuICAgIGNvbnN0IHIgPSAxIC8gTWF0aC5zcXJ0KCh0ICogdCkgLyAocyAqIHMpIC0gMSkgKiB0aGlzLnJhZGl1cztcbiAgICBjb25zdCBkID0gMSAvIE1hdGguc3FydCgxIC0gKHMgKiBzKSAvICh0ICogdCkpICogdGhpcy5yYWRpdXM7XG4gICAgY29uc3QgYiA9IHtcbiAgICAgIHg6IHRoaXMucmFkaXVzICogTWF0aC5jb3MoTWF0aC5QSSAvIHRoaXMucCksXG4gICAgICB5OiAtdGhpcy5yYWRpdXMgKiBNYXRoLnNpbihNYXRoLlBJIC8gdGhpcy5wKVxuICAgIH1cbiAgICBjb25zdCBjZW50cmUgPSB7XG4gICAgICB4OiBkLFxuICAgICAgeTogMFxuICAgIH07XG4gICAgLy90aGVyZSB3aWxsIGJlIHR3byBwb2ludHMgb2YgaW50ZXJzZWN0aW9uLCBvZiB3aGljaCB3ZSB3YW50IHRoZSBmaXJzdFxuICAgIGNvbnN0IHAxID0gRS5jaXJjbGVMaW5lSW50ZXJzZWN0KGNlbnRyZSwgciwgdGhpcy5kaXNrLmNlbnRyZSwgYikucDE7XG5cbiAgICBjb25zdCBwMiA9IHtcbiAgICAgIHg6IGQgLSByLFxuICAgICAgeTogMFxuICAgIH07XG5cbiAgICBjb25zdCBwb2ludHMgPSBbdGhpcy5kaXNrLmNlbnRyZSwgcDEsIHAyXTtcblxuICAgIHJldHVybiBwb2ludHM7XG4gIH1cblxuICAvL1RoZSB0ZXNzZWxhdGlvbiByZXF1aXJlcyB0aGF0IChwLTIpKHEtMikgPiA0IHRvIHdvcmsgKG90aGVyd2lzZSBpdCBpc1xuICAvLyBlaXRoZXIgYW4gZWxsaXB0aWNhbCBvciBldWNsaWRlYW4gdGVzc2VsYXRpb24pO1xuICBjaGVja1BhcmFtcygpIHtcbiAgICBpZiAodGhpcy5tYXhMYXllcnMgPCAwIHx8IGlzTmFOKHRoaXMubWF4TGF5ZXJzKSkge1xuICAgICAgY29uc29sZS5lcnJvcignbWF4TGF5ZXJzIG11c3QgYmUgZ3JlYXRlciB0aGFuIDAnKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAoKHRoaXMucCAtIDIpICogKHRoaXMucSAtIDIpIDw9IDQpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0h5cGVyYm9saWMgdGVzc2VsYXRpb25zIHJlcXVpcmUgdGhhdCAocC0xKShxLTIpIDwgNCEnKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvL0ZvciBub3cgcmVxdWlyZSBwLHEgPiAzLFxuICAgIC8vVE9ETyBpbXBsZW1lbnQgc3BlY2lhbCBjYXNlcyBmb3IgcSA9IDMgb3IgcCA9IDNcbiAgICBlbHNlIGlmICh0aGlzLnEgPD0gMyB8fCBpc05hTih0aGlzLnEpKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdUZXNzZWxhdGlvbiBlcnJvcjogYXQgbGVhc3QgMyBwLWdvbnMgbXVzdCBtZWV0IFxcXG4gICAgICAgICAgICAgICAgICAgIGF0IGVhY2ggdmVydGV4IScpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIGlmICh0aGlzLnAgPD0gMyB8fCBpc05hTih0aGlzLnApKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdUZXNzZWxhdGlvbiBlcnJvcjogcG9seWdvbiBuZWVkcyBhdCBsZWFzdCAzIHNpZGVzIScpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbn1cbiIsIi8vICogKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICpcbi8vICogIFRIUkVFIEpTIENMQVNTXG4vLyAqXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5leHBvcnQgY2xhc3MgVGhyZWVKUyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCAoZXZlbnQpID0+IHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdsb2FkJyk7XG4gICAgICB0aGlzLmluaXQoKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xuICAgICAgLy90aGlzLmNhbWVyYS5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgIC8vdGhpcy5jYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuICAgICAgLy90aGlzLnJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG5cbiAgICAgIHRoaXMucmVzZXQoKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy5zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuICAgIHRoaXMuaW5pdENhbWVyYSgpO1xuXG4gICAgdGhpcy5pbml0TGlnaHRpbmcoKTtcblxuICAgIHRoaXMuYXhlcygpO1xuXG4gICAgdGhpcy5pbml0UmVuZGVyZXIoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuaWQpOyAvLyBTdG9wIHRoZSBhbmltYXRpb25cbiAgICB0aGlzLnJlbmRlcmVyLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZGJsY2xpY2snLCBudWxsLCBmYWxzZSk7IC8vcmVtb3ZlIGxpc3RlbmVyIHRvIHJlbmRlclxuICAgIHRoaXMuc2NlbmUgPSBudWxsO1xuICAgIHRoaXMucHJvamVjdG9yID0gbnVsbDtcbiAgICB0aGlzLmNhbWVyYSA9IG51bGw7XG4gICAgdGhpcy5jb250cm9scyA9IG51bGw7XG5cbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2NhbnZhcycpO1xuICAgIGZvciAobGV0IGluZGV4ID0gZWxlbWVudC5sZW5ndGggLSAxOyBpbmRleCA+PSAwOyBpbmRleC0tKSB7XG4gICAgICBlbGVtZW50W2luZGV4XS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsZW1lbnRbaW5kZXhdKTtcbiAgICB9XG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBpbml0Q2FtZXJhKCkge1xuICAgIHRoaXMuY2FtZXJhID0gbmV3IFRIUkVFLk9ydGhvZ3JhcGhpY0NhbWVyYSh3aW5kb3cuaW5uZXJXaWR0aCAvIC0yLFxuICAgICAgd2luZG93LmlubmVyV2lkdGggLyAyLCB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyLCB3aW5kb3cuaW5uZXJIZWlnaHQgLyAtMiwgLTIsIDEpO1xuICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMuY2FtZXJhKTtcbiAgICB0aGlzLmNhbWVyYS5wb3NpdGlvbi54ID0gMDtcbiAgICB0aGlzLmNhbWVyYS5wb3NpdGlvbi55ID0gMDtcblxuICAgIHRoaXMuY2FtZXJhLnBvc2l0aW9uLnogPSAxO1xuICB9XG5cbiAgaW5pdExpZ2h0aW5nKCkge1xuICAgIC8vY29uc3Qgc3BvdExpZ2h0ID0gbmV3IFRIUkVFLlNwb3RMaWdodCgweGZmZmZmZik7XG4gICAgLy9zcG90TGlnaHQucG9zaXRpb24uc2V0KDAsIDAsIDEwMCk7XG4gICAgLy90aGlzLnNjZW5lLmFkZChzcG90TGlnaHQpO1xuICAgIGNvbnN0IGFtYmllbnRMaWdodCA9IG5ldyBUSFJFRS5BbWJpZW50TGlnaHQoMHhmZmZmZmYpO1xuICAgIHRoaXMuc2NlbmUuYWRkKGFtYmllbnRMaWdodCk7XG4gIH1cblxuICBpbml0UmVuZGVyZXIoKSB7XG4gICAgdGhpcy5yZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHtcbiAgICAgIGFudGlhbGlhczogdHJ1ZSxcbiAgICB9KTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldENsZWFyQ29sb3IoMHhmZmZmZmYsIDEuMCk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5yZW5kZXJlci5kb21FbGVtZW50KTtcblxuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICAvL2JlaGluZDogdHJ1ZS9mYWxzZVxuICBkaXNrKGNlbnRyZSwgcmFkaXVzLCBjb2xvciwgYmVoaW5kKSB7XG4gICAgbGV0IGNvbCA9IGNvbG9yO1xuICAgIGlmIChjb2wgPT09ICd1bmRlZmluZWQnKSBjb2wgPSAweGZmZmZmZjtcblxuICAgIGNvbnN0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkNpcmNsZUdlb21ldHJ5KHJhZGl1cywgMTAwLCAwLCAyICogTWF0aC5QSSk7XG4gICAgY29uc3QgY2lyY2xlID0gdGhpcy5jcmVhdGVNZXNoKGdlb21ldHJ5LCBjb2wpO1xuICAgIGNpcmNsZS5wb3NpdGlvbi54ID0gY2VudHJlLng7XG4gICAgY2lyY2xlLnBvc2l0aW9uLnkgPSBjZW50cmUueTtcbiAgICBpZiAoIWJlaGluZCkge1xuICAgICAgY2lyY2xlLnBvc2l0aW9uLnogPSAxO1xuICAgIH1cblxuICAgIHRoaXMuc2NlbmUuYWRkKGNpcmNsZSk7XG4gIH1cblxuICBzZWdtZW50KGNpcmNsZSwgYWxwaGEsIG9mZnNldCwgY29sb3IpIHtcbiAgICBsZXQgY29sID0gY29sb3I7XG4gICAgaWYgKGNvbCA9PT0gJ3VuZGVmaW5lZCcpIGNvbCA9IDB4ZmZmZmZmO1xuXG4gICAgY29uc3QgY3VydmUgPSBuZXcgVEhSRUUuRWxsaXBzZUN1cnZlKFxuICAgICAgY2lyY2xlLmNlbnRyZS54LCBjaXJjbGUuY2VudHJlLnksIC8vIGF4LCBhWVxuICAgICAgY2lyY2xlLnJhZGl1cywgY2lyY2xlLnJhZGl1cywgLy8geFJhZGl1cywgeVJhZGl1c1xuICAgICAgYWxwaGEsIG9mZnNldCwgLy8gYVN0YXJ0QW5nbGUsIGFFbmRBbmdsZVxuICAgICAgZmFsc2UgLy8gYUNsb2Nrd2lzZVxuICAgICk7XG5cbiAgICBjb25zdCBwb2ludHMgPSBjdXJ2ZS5nZXRTcGFjZWRQb2ludHMoMTAwKTtcblxuICAgIGNvbnN0IHBhdGggPSBuZXcgVEhSRUUuUGF0aCgpO1xuICAgIGNvbnN0IGdlb21ldHJ5ID0gcGF0aC5jcmVhdGVHZW9tZXRyeShwb2ludHMpO1xuXG4gICAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoe1xuICAgICAgY29sb3I6IGNvbFxuICAgIH0pO1xuICAgIGNvbnN0IHMgPSBuZXcgVEhSRUUuTGluZShnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXG4gICAgdGhpcy5zY2VuZS5hZGQocyk7XG4gIH1cblxuICBsaW5lKHN0YXJ0LCBlbmQsIGNvbG9yKSB7XG4gICAgbGV0IGNvbCA9IGNvbG9yO1xuICAgIGlmIChjb2wgPT09ICd1bmRlZmluZWQnKSBjb2wgPSAweGZmZmZmZjtcblxuICAgIGNvbnN0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkdlb21ldHJ5KCk7XG5cbiAgICBnZW9tZXRyeS52ZXJ0aWNlcy5wdXNoKFxuICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoc3RhcnQueCwgc3RhcnQueSwgMCksXG4gICAgICBuZXcgVEhSRUUuVmVjdG9yMyhlbmQueCwgZW5kLnksIDApXG4gICAgKTtcbiAgICBjb25zdCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5MaW5lQmFzaWNNYXRlcmlhbCh7XG4gICAgICBjb2xvcjogY29sXG4gICAgfSk7XG4gICAgY29uc3QgbCA9IG5ldyBUSFJFRS5MaW5lKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgdGhpcy5zY2VuZS5hZGQobCk7XG4gIH1cblxuICBwb2x5Z29uKHZlcnRpY2VzLCBjb2xvciwgdGV4dHVyZSkge1xuICAgIGxldCBjb2wgPSBjb2xvcjtcbiAgICBpZiAoY29sID09PSAndW5kZWZpbmVkJykgY29sID0gMHhmZmZmZmY7XG5cbiAgICBjb25zdCBwb2x5ID0gbmV3IFRIUkVFLlNoYXBlKCk7XG4gICAgcG9seS5tb3ZlVG8odmVydGljZXNbMF0ueCwgdmVydGljZXNbMF0ueSk7XG5cbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IHZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBwb2x5LmxpbmVUbyh2ZXJ0aWNlc1tpXS54LCB2ZXJ0aWNlc1tpXS55KVxuICAgIH1cblxuICAgIHBvbHkubGluZVRvKHZlcnRpY2VzWzBdLngsIHZlcnRpY2VzWzBdLnkpO1xuXG4gICAgY29uc3QgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuU2hhcGVHZW9tZXRyeShwb2x5KTtcblxuICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMuY3JlYXRlTWVzaChnZW9tZXRyeSwgY29sb3IsIHRleHR1cmUpKTtcbiAgfVxuXG4gIGNyZWF0ZU1lc2goZ2VvbWV0cnksIGNvbG9yLCBpbWFnZVVSTCkge1xuICAgIGxldCBjb2wgPSBjb2xvcjtcbiAgICBpZiAoY29sID09PSAndW5kZWZpbmVkJykgY29sID0gMHhmZmZmZmY7XG4gICAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoe1xuICAgICAgY29sb3I6IGNvbCxcbiAgICAgIC8vd2lyZWZyYW1lOiB0cnVlXG4gICAgfSk7XG5cbiAgICBpZiAoaW1hZ2VVUkwpIHtcbiAgICAgIGNvbnN0IHRleHR1cmVMb2FkZXIgPSBuZXcgVEhSRUUuVGV4dHVyZUxvYWRlcigpO1xuXG4gICAgICAvL2xvYWQgdGV4dHVyZSBhbmQgYXBwbHkgdG8gbWF0ZXJpYWwgaW4gY2FsbGJhY2tcbiAgICAgIGNvbnN0IHRleHR1cmUgPSB0ZXh0dXJlTG9hZGVyLmxvYWQoaW1hZ2VVUkwsICh0ZXgpID0+IHt9KTtcbiAgICAgIHRleHR1cmUucmVwZWF0LnNldCgwLjA1LCAwLjA1KTtcbiAgICAgIG1hdGVyaWFsLm1hcCA9IHRleHR1cmU7XG4gICAgICBtYXRlcmlhbC5tYXAud3JhcFQgPSBUSFJFRS5SZXBlYXRXcmFwcGluZztcbiAgICAgIG1hdGVyaWFsLm1hcC53cmFwUyA9IFRIUkVFLlJlcGVhdFdyYXBwaW5nO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICB9XG5cbiAgYXhlcygpIHtcbiAgICBjb25zdCB4eXogPSBuZXcgVEhSRUUuQXhpc0hlbHBlcigyMCk7XG4gICAgdGhpcy5zY2VuZS5hZGQoeHl6KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgdGhpcy5yZW5kZXIoKVxuICAgIH0pO1xuXG4gICAgdGhpcy5yZW5kZXJlci5yZW5kZXIodGhpcy5zY2VuZSwgdGhpcy5jYW1lcmEpO1xuICB9XG5cbn1cbiJdfQ==
