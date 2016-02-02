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

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = points[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          //this.point(point,2,0x10ded8);

          var point = _step.value;
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

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = points[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var point = _step2.value;

          if (E.distance(point, this.centre) > r) {
            console.error('Error! Point (' + point.x + ', ' + point.y + ') lies outside the plane!');
            test = true;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
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
//needs to take into account roundoff errors so returns true if
//test is close to 0
var throughOrigin = exports.throughOrigin = function throughOrigin(p1, p2) {
  if (p1.x === 0 && p2.x === 0) {
    //vertical line through centre
    return true;
  }
  var test = (-p1.x * p2.y + p1.x * p1.y) / (p2.x - p1.x) + p1.y;

  if (test.toFixed(6) == 0) return true;else return false;
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
      this.disk.polygon(poly2, 0xc3167e);

      var poly3 = H.rotatePgonAboutOrigin(poly2, Math.PI);

      //console.log(E.throughOrigin(poly3[0], poly3[1]));
      //console.log(E.throughOrigin(poly3[1], poly3[2]));
      //console.log(E.throughOrigin(poly3[2], poly3[0]));

      //console.table(poly2);
      //console.log(poly3);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJlczIwMTUvZGlzay5qcyIsImVzMjAxNS9ldWNsaWQuanMiLCJlczIwMTUvaHlwZXJib2xpYy5qcyIsImVzMjAxNS9tYWluLmpzIiwiZXMyMDE1L3JlZ3VsYXJUZXNzZWxhdGlvbi5qcyIsImVzMjAxNS90aHJlZWpzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7SUNBWSxDQUFDOzs7O0lBQ0QsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztJQWNBLElBQUksV0FBSixJQUFJO0FBQ2YsV0FEVyxJQUFJLEdBQ0Q7OzswQkFESCxJQUFJOztBQUViLFFBQUksQ0FBQyxJQUFJLEdBQUcsYUFiZCxPQUFPLEVBYW9CLENBQUM7O0FBRTFCLFVBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDekMsWUFBTSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ25DLFlBQUssSUFBSSxFQUFFLENBQUM7S0FDYixFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUVWLFVBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsWUFBTTtBQUN0QyxZQUFLLElBQUksRUFBRSxDQUFDO0tBQ2IsRUFBRSxLQUFLLENBQUMsQ0FBQztHQUVYOztlQWJVLElBQUk7OzJCQWVSO0FBQ0wsVUFBSSxDQUFDLE1BQU0sR0FBRztBQUNaLFNBQUMsRUFBRSxDQUFDO0FBQ0osU0FBQyxFQUFFLENBQUM7T0FDTDs7O0FBQUEsQUFHRCxVQUFJLENBQUMsTUFBTSxHQUFHLEFBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsV0FBVyxHQUFJLEFBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLEdBQUksQ0FBQyxHQUFHLEFBQUMsTUFBTSxDQUFDLFdBQVcsR0FBRyxDQUFDLEdBQUksQ0FBQyxDQUFDOztBQUVwSCxVQUFJLENBQUMsTUFBTSxHQUFHO0FB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LEdBQUcsQ0FBQyxDQUFDOztBQUVwRyxNQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsR0FBSSxDQUFDLEdBQUcsQUFBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsSUFBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUEsQUFBQyxJQUFLLENBQUMsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFBLEFBQUMsQ0FBQztBQUNqRixNQUFJLEVBQUUsR0FBRyxRQUFRLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFBLEFBQUMsQ0FBQztBQUN0RCxNQUFJLEVBQUUsR0FBRyxRQUFRLEdBQUcsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFBLEFBQUMsQ0FBQzs7QUFFdEQsTUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksQ0FBQyxHQUFHLEFBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLElBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFBLEFBQUMsSUFBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7QUFDakYsTUFBSSxFQUFFLEdBQUcsUUFBUSxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7QUFDdEQsTUFBSSxFQUFFLEdBQUcsUUFBUSxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSxBQUFDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQSxBQUFDLENBQUM7O0FBRXRELE1BQUksRUFBRSxHQUFHO0FBQ1AsS0FBQyxFQUFFLEVBQUU7QUFDTCxLQUFDLEVBQUUsRUFBRTtHQUNO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R0FBRyxDQUFDLFdBQVcsQ0FBQzs7QUFFakMsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsUUFBUSxJQUFJLEtBQUssQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUEsQUFBQyxHQUFHLFdBQVcsSUFBSSxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBQztBQUNsSCxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxRQUFRLElBQUksS0FBSyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQSxBQUFDLEdBQUcsV0FBVyxJQUFJLEtBQUssQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUEsQUFBQyxDQUFDO0FBQ2xILE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLFdBQVcsSUFBSSxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBLEFBQUMsR0FBRyxRQUFRLElBQUksS0FBSyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQSxBQUFDLENBQUM7QUFDbEgsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsV0FBVyxJQUFJLEtBQUssQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUEsQUFBQyxHQUFHLFFBQVEsSUFBSSxLQUFLLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFBLEFBQUMsQ0FBQzs7QUFFbEgsTUFBTSxFQUFFLEdBQUc7QUFDVCxLQUFDLEVBQUUsSUFBSTtBQUNQLEtBQUMsRUFBRSxJQUFJO0dBQ1IsQ0FBQztBQUNGLE1BQU0sRUFBRSxHQUFHO0FBQ1QsS0FBQyxFQUFFLElBQUk7QUFD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O0FBQUMsQUFRcEQsVUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ3BDOzs7Ozs7d0NBR21CO0FBQ2xCLFVBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckMsVUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7O0FBQUMsQUFFckMsVUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQUFBQyxDQUFDLEdBQUcsQ0FBQyxJQUFLLENBQUMsR0FBRyxDQUFDLENBQUEsQUFBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDN0QsVUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEFBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEFBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7QUFDN0QsVUFBTSxDQUFDLEdBQUc7QUFDUixTQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUMzQyxTQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO09BQzdDLENBQUE7QUFDRCxVQUFNLE1BQU0sR0FBRztBQUNiLFNBQUMsRUFBRSxDQUFDO0FBQ0osU0FBQyxFQUFFLENBQUM7T0FDTDs7QUFBQyxBQUVGLFVBQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFF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QUFLLE1BQU0sRUFBRSxDQUFBO09BQ2QsQ0FBQyxDQUFDOztBQUVILFVBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQy9DOzs7U0FyTFUsT0FBTyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgKiBhcyBFIGZyb20gJy4vZXVjbGlkJztcbmltcG9ydCAqIGFzIEggZnJvbSAnLi9oeXBlcmJvbGljJztcblxuaW1wb3J0IHtcbiAgVGhyZWVKU1xufVxuZnJvbSAnLi90aHJlZWpzJztcblxuLy8gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gKlxuLy8gKiAgIERJU0sgQ0xBU1Ncbi8vICogICBQb2luY2FyZSBEaXNrIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBoeXBlcmJvbGljIHBsYW5lXG4vLyAqICAgQ29udGFpbnMgYW55IGZ1bmN0aW9ucyB1c2VkIHRvIGRyYXcgdG8gdGhlIGRpc2tcbi8vICogICAoQ3VycmVudGx5IHVzaW5nIHRocmVlIGpzIGFzIGRyYXdpbmcgY2xhc3MpXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5leHBvcnQgY2xhc3MgRGlzayB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZHJhdyA9IG5ldyBUaHJlZUpTKCk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChldmVudCkgPT4ge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnKTtcbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH0sIGZhbHNlKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XG4gICAgICB0aGlzLmluaXQoKTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgfVxuXG4gIGluaXQoKSB7XG4gICAgdGhpcy5jZW50cmUgPSB7XG4gICAgICB4OiAwLFxuICAgICAgeTogMFxuICAgIH1cblxuICAgIC8vZHJhdyBsYXJnZXN0IGNpcmNsZSBwb3NzaWJsZSBnaXZlbiB3aW5kb3cgZGltc1xuICAgIHRoaXMucmFkaXVzID0gKHdpbmRvdy5pbm5lcldpZHRoIDwgd2luZG93LmlubmVySGVpZ2h0KSA/ICh3aW5kb3cuaW5uZXJXaWR0aCAvIDIpIC0gNSA6ICh3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKSAtIDU7XG5cbiAgICB0aGlzLmNpcmNsZSA9IHtcbiAgICAgIGNlbnRyZTogdGhpcy5jZW50cmUsXG4gICAgICByYWRpdXM6IHRoaXMucmFkaXVzXG4gICAgfVxuXG4gICAgLy9zbWFsbGVyIGNpcmNsZSBmb3IgdGVzdGluZ1xuICAgIC8vdGhpcy5yYWRpdXMgPSB0aGlzLnJhZGl1cyAvIDI7XG5cbiAgICB0aGlzLmRyYXdEaXNrKCk7XG5cbiAgICAvL3RoaXMudGVzdGluZygpO1xuICB9XG5cbiAgdGVzdGluZygpIHtcbiAgICBjb25zdCBwMSA9IHtcbiAgICAgIHg6IDEwMCxcbiAgICAgIHk6IDI1MFxuICAgIH07XG4gICAgY29uc3QgcDIgPSB7XG4gICAgICB4OiAtMTUwLFxuICAgICAgeTogMTUwXG4gICAgfTtcbiAgICBjb25zdCBwMyA9IHtcbiAgICAgIHg6IC03MCxcbiAgICAgIHk6IC0yNTBcbiAgICB9O1xuXG4gICAgY29uc3QgcDQgPSB7XG4gICAgICB4OiAtMTcwLFxuICAgICAgeTogLTE1MFxuICAgIH07XG5cbiAgICBjb25zdCBwNSA9IHtcbiAgICAgIHg6IDE3MCxcbiAgICAgIHk6IC0xNTBcbiAgICB9O1xuICAgIHRoaXMucG9pbnQocDEsIDUsIDB4ZjAwZjBmKTtcbiAgICB0aGlzLnBvaW50KHAyLCA1LCAweGZmZmYwZik7XG4gICAgdGhpcy5wb2ludChwMywgNSwgMHgxZDAwZDUpO1xuICAgIHRoaXMucG9pbnQocDQsIDUsIDB4MDBmZjBmKTtcbiAgICB0aGlzLnBvaW50KHA1LCA1LCAweDM1OTU0Myk7XG5cbiAgICAvKlxuICAgIGNvbnN0IGEgPSBILmFyYyhwMSwgcDIpO1xuXG4gICAgdGhpcy5kcmF3LmRpc2soYS5jaXJjbGUuY2VudHJlLCBhLmNpcmNsZS5yYWRpdXMsIDB4ZmZmZmZmLCBmYWxzZSk7XG5cbiAgICBjb25zdCBwNCA9IEUubmV4dFBvaW50KGEuY2lyY2xlLCBwMiwgMjApLnAxO1xuICAgIGNvbnNvbGUubG9nKHA0KTtcblxuXG5cbiAgICAvL3RoaXMuZHJhd0FyYyhwMiwgcDMsIDB4ZjAwZjBmKTtcbiAgICAqL1xuICAgIC8vdGhpcy5wb2x5Z29uT3V0bGluZShbcDEsIHAyLCBwM10sMHhmMDBmMGYpXG4gICAgdGhpcy5wb2x5Z29uKFtwMSwgcDIsIHA0LCBwMywgcDVdLCAweDcwMDY5YSk7XG4gICAgLy90aGlzLnBvbHlnb24oW3AyLCBwMywgcDRdKTtcbiAgfVxuICBnZXRSYWRpdXMoKSB7XG4gICAgcmV0dXJuIHRoaXMucmFkaXVzO1xuICB9XG5cbiAgLy9kcmF3IHRoZSBkaXNrIGJhY2tncm91bmRcbiAgZHJhd0Rpc2soKSB7XG4gICAgdGhpcy5kcmF3LmRpc2sodGhpcy5jZW50cmUsIHRoaXMucmFkaXVzLCAweDAwMDAwMCwgdHJ1ZSk7XG4gIH1cblxuICBwb2ludChjZW50cmUsIHJhZGl1cywgY29sb3IpIHtcbiAgICB0aGlzLmRyYXcuZGlzayhjZW50cmUsIHJhZGl1cywgY29sb3IsIGZhbHNlKTtcbiAgfVxuXG4gIC8vZHJhdyBhIGh5cGVyYm9saWMgbGluZSBiZXR3ZWVuIHR3byBwb2ludHMgb24gdGhlIGJvdW5kYXJ5IGNpcmNsZVxuICAvL1RPRE86IGZpeCFcbiAgbGluZShwMSwgcDIsIGNvbG9yKSB7XG4gICAgY29uc3QgYyA9IEUuZ3JlYXRDaXJjbGUocDEsIHAyLCB0aGlzLnJhZGl1cywgdGhpcy5jZW50cmUpO1xuICAgIGNvbnN0IHBvaW50cyA9IEUuY2lyY2xlSW50ZXJzZWN0KHRoaXMuY2VudHJlLCBjLmNlbnRyZSwgdGhpcy5yYWRpdXMsIGMucmFkaXVzKTtcblxuICAgIHRoaXMuZHJhd0FyYyhwb2ludHMucDEsIHBvaW50cy5wMiwgY29sb3IpXG4gIH1cblxuICAvL0RyYXcgYW4gYXJjIChoeXBlcmJvbGljIGxpbmUgc2VnbWVudCkgYmV0d2VlbiB0d28gcG9pbnRzIG9uIHRoZSBkaXNrXG4gIGRyYXdBcmMocDEsIHAyLCBjb2xvdXIpIHtcbiAgICAvL2NoZWNrIHRoYXQgdGhlIHBvaW50cyBhcmUgaW4gdGhlIGRpc2tcbiAgICBpZiAodGhpcy5jaGVja1BvaW50cyhwMSwgcDIpKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gICAgY29uc3QgY29sID0gY29sb3VyIHx8IDB4ZmZmZmZmO1xuICAgIGNvbnN0IGFyYyA9IEguYXJjKHAxLCBwMiwgdGhpcy5jaXJjbGUpO1xuXG4gICAgaWYgKGEuc3RyYWlnaHRMaW5lKSB7XG4gICAgICB0aGlzLmRyYXcubGluZShwMSwgcDIsIGNvbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZHJhdy5zZWdtZW50KGFyYy5jaXJjbGUsIGFyYy5zdGFydEFuZ2xlLCBhcmMuZW5kQW5nbGUsIGNvbG91cik7XG4gICAgfVxuICB9XG5cbiAgcG9seWdvbk91dGxpbmUodmVydGljZXMsIGNvbG91cikge1xuICAgIGNvbnN0IGwgPSB2ZXJ0aWNlcy5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsOyBpKyspIHtcbiAgICAgIHRoaXMuZHJhd0FyYyh2ZXJ0aWNlc1tpXSwgdmVydGljZXNbKGkgKyAxKSAlIGxdLCBjb2xvdXIpO1xuICAgIH1cbiAgfVxuXG4gIC8vY3JlYXRlIGFuIGFycmF5IG9mIHBvaW50cyBzcGFjZWQgZXF1YWxseSBhcm91bmQgdGhlIGFyY3MgZGVmaW5pbmcgYSBoeXBlcmJvbGljXG4gIC8vcG9seWdvbiBhbmQgcGFzcyB0aGVzZSB0byBUaHJlZUpTLnBvbHlnb24oKVxuICAvL1RPRE8gbWFrZSBzcGFjaW5nIGEgZnVuY3Rpb24gb2YgZmluYWwgcmVzb2x1dGlvblxuICAvL1RPRE8gY2hlY2sgd2hldGhlciB2ZXJ0aWNlcyBhcmUgaW4gdGhlIHJpZ2h0IG9yZGVyXG4gIHBvbHlnb24odmVydGljZXMsIGNvbG9yLCB0ZXh0dXJlKSB7XG4gICAgY29uc3QgcG9pbnRzID0gW107XG4gICAgY29uc3Qgc3BhY2luZyA9IDU7XG4gICAgY29uc3QgbCA9IHZlcnRpY2VzLmxlbmd0aDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGw7IGkrKykge1xuICAgICAgbGV0IHA7XG4gICAgICBjb25zdCBhcmMgPSBILmFyYyh2ZXJ0aWNlc1tpXSwgdmVydGljZXNbKGkgKyAxKSAlIGxdLCB0aGlzLmNpcmNsZSk7XG5cbiAgICAgIC8vbGluZSBub3QgdGhyb3VnaCB0aGUgb3JpZ2luIChoeXBlcmJvbGljIGFyYylcbiAgICAgIGlmICghYXJjLnN0cmFpZ2h0TGluZSkge1xuXG4gICAgICAgIGlmIChhcmMuY2xvY2t3aXNlKSB7XG4gICAgICAgICAgcCA9IEUuc3BhY2VkUG9pbnRPbkFyYyhhcmMuY2lyY2xlLCB2ZXJ0aWNlc1tpXSwgc3BhY2luZykucDI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcCA9IEUuc3BhY2VkUG9pbnRPbkFyYyhhcmMuY2lyY2xlLCB2ZXJ0aWNlc1tpXSwgc3BhY2luZykucDE7XG4gICAgICAgIH1cbiAgICAgICAgcG9pbnRzLnB1c2gocCk7XG5cbiAgICAgICAgd2hpbGUgKEUuZGlzdGFuY2UocCwgdmVydGljZXNbKGkgKyAxKSAlIGxdKSA+IHNwYWNpbmcpIHtcblxuICAgICAgICAgIGlmIChhcmMuY2xvY2t3aXNlKSB7XG4gICAgICAgICAgICBwID0gRS5zcGFjZWRQb2ludE9uQXJjKGFyYy5jaXJjbGUsIHAsIHNwYWNpbmcpLnAyO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwID0gRS5zcGFjZWRQb2ludE9uQXJjKGFyYy5jaXJjbGUsIHAsIHNwYWNpbmcpLnAxO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHBvaW50cy5wdXNoKHApO1xuICAgICAgICB9XG4gICAgICAgIHBvaW50cy5wdXNoKHZlcnRpY2VzWyhpICsgMSkgJSBsXSk7XG4gICAgICB9XG5cbiAgICAgIC8vbGluZSB0aHJvdWdoIG9yaWdpbiAoc3RyYWlnaHQgbGluZSlcbiAgICAgIGVsc2V7XG4gICAgICAgIHBvaW50cy5wdXNoKHZlcnRpY2VzWyhpICsgMSkgJSBsXSk7XG4gICAgICB9XG4gICAgfVxuICAgIC8vVEVTVElOR1xuICAgIC8vY29uc29sZS50YWJsZShwb2ludHMpO1xuXG4gICAgZm9yKGxldCBwb2ludCBvZiBwb2ludHMpe1xuICAgICAgLy90aGlzLnBvaW50KHBvaW50LDIsMHgxMGRlZDgpO1xuICAgIH1cblxuICAgIHRoaXMuZHJhdy5wb2x5Z29uKHBvaW50cywgY29sb3IsIHRleHR1cmUpO1xuICB9XG5cbiAgLy9yZXR1cm4gdHJ1ZSBpZiBhbnkgb2YgdGhlIHBvaW50cyBpcyBub3QgaW4gdGhlIGRpc2tcbiAgY2hlY2tQb2ludHMoLi4ucG9pbnRzKSB7XG4gICAgY29uc3QgciA9IHRoaXMucmFkaXVzO1xuICAgIGxldCB0ZXN0ID0gZmFsc2U7XG4gICAgZm9yIChsZXQgcG9pbnQgb2YgcG9pbnRzKSB7XG4gICAgICBpZiAoRS5kaXN0YW5jZShwb2ludCwgdGhpcy5jZW50cmUpID4gcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciEgUG9pbnQgKCcgKyBwb2ludC54ICsgJywgJyArIHBvaW50LnkgKyAnKSBsaWVzIG91dHNpZGUgdGhlIHBsYW5lIScpO1xuICAgICAgICB0ZXN0ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRlc3QpIHJldHVybiB0cnVlXG4gICAgZWxzZSByZXR1cm4gZmFsc2VcbiAgfVxufVxuIiwiLy8gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gKlxuLy8gKiAgIEVVQ0xJREVBTiBGVU5DVElPTlNcbi8vICogICBhIHBsYWNlIHRvIHN0YXNoIGFsbCB0aGUgZnVuY3Rpb25zIHRoYXQgYXJlIGV1Y2xpZGVhbiBnZW9tZXRyaWNhbFxuLy8gKiAgIG9wZXJhdGlvbnNcbi8vICpcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuLy9kaXN0YW5jZSBiZXR3ZWVuIHR3byBwb2ludHNcbmV4cG9ydCBjb25zdCBkaXN0YW5jZSA9IChwMSwgcDIpID0+IE1hdGguc3FydChNYXRoLnBvdygocDIueCAtIHAxLngpLCAyKSArIE1hdGgucG93KChwMi55IC0gcDEueSksIDIpKTtcblxuLy9taWRwb2ludCBvZiB0aGUgbGluZSBzZWdtZW50IGNvbm5lY3RpbmcgdHdvIHBvaW50c1xuZXhwb3J0IGNvbnN0IG1pZHBvaW50ID0gKHAxLCBwMikgPT4ge1xuICByZXR1cm4ge1xuICAgIHg6IChwMS54ICsgcDIueCkgLyAyLFxuICAgIHk6IChwMS55ICsgcDIueSkgLyAyXG4gIH1cbn1cblxuLy9zbG9wZSBvZiBsaW5lIHRocm91Z2ggcDEsIHAyXG5leHBvcnQgY29uc3Qgc2xvcGUgPSAocDEsIHAyKSA9PiAocDIueCAtIHAxLngpIC8gKHAyLnkgLSBwMS55KTtcblxuLy9zbG9wZSBvZiBsaW5lIHBlcnBlbmRpY3VsYXIgdG8gYSBsaW5lIGRlZmluZWQgYnkgcDEscDJcbmV4cG9ydCBjb25zdCBwZXJwZW5kaWN1bGFyU2xvcGUgPSAocDEsIHAyKSA9PiAtMSAvIChNYXRoLnBvdyhzbG9wZShwMSwgcDIpLCAtMSkpO1xuXG4vL2ludGVyc2VjdGlvbiBwb2ludCBvZiB0d28gbGluZXMgZGVmaW5lZCBieSBwMSxtMSBhbmQgcTEsbTJcbi8vTk9UIFdPUktJTkcgRk9SIFZFUlRJQ0FMIExJTkVTISEhXG5leHBvcnQgY29uc3QgaW50ZXJzZWN0aW9uID0gKHAxLCBtMSwgcDIsIG0yKSA9PiB7XG4gIGxldCBjMSwgYzIsIHgsIHk7XG4gIC8vY2FzZSB3aGVyZSBmaXJzdCBsaW5lIGlzIHZlcnRpY2FsXG4gIC8vaWYobTEgPiA1MDAwIHx8IG0xIDwgLTUwMDAgfHwgbTEgPT09IEluZmluaXR5KXtcbiAgaWYgKHAxLnkgPCAwLjAwMDAwMSAmJiBwMS55ID4gLTAuMDAwMDAxKSB7XG4gICAgeCA9IHAxLng7XG4gICAgeSA9IChtMikgKiAocDEueCAtIHAyLngpICsgcDIueTtcbiAgfVxuICAvL2Nhc2Ugd2hlcmUgc2Vjb25kIGxpbmUgaXMgdmVydGljYWxcbiAgLy9lbHNlIGlmKG0yID4gNTAwMCB8fCBtMiA8IC01MDAwIHx8IG0xID09PSBJbmZpbml0eSl7XG4gIGVsc2UgaWYgKHAyLnkgPCAwLjAwMDAwMSAmJiBwMi55ID4gLTAuMDAwMDAxKSB7XG4gICAgeCA9IHAyLng7XG4gICAgeSA9IChtMSAqIChwMi54IC0gcDEueCkpICsgcDEueTtcbiAgfSBlbHNlIHtcbiAgICAvL3kgaW50ZXJjZXB0IG9mIGZpcnN0IGxpbmVcbiAgICBjMSA9IHAxLnkgLSBtMSAqIHAxLng7XG4gICAgLy95IGludGVyY2VwdCBvZiBzZWNvbmQgbGluZVxuICAgIGMyID0gcDIueSAtIG0yICogcDIueDtcblxuICAgIHggPSAoYzIgLSBjMSkgLyAobTEgLSBtMik7XG4gICAgeSA9IG0xICogeCArIGMxO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB4OiB4LFxuICAgIHk6IHlcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgcmFkaWFucyA9IChkZWdyZWVzKSA9PiAoTWF0aC5QSSAvIDE4MCkgKiBkZWdyZWVzO1xuXG4vL2dldCB0aGUgY2lyY2xlIGludmVyc2Ugb2YgYSBwb2ludCBwIHdpdGggcmVzcGVjdCBhIGNpcmNsZSByYWRpdXMgciBjZW50cmUgY1xuZXhwb3J0IGNvbnN0IGludmVyc2UgPSAocCwgciwgYykgPT4ge1xuICBsZXQgYWxwaGEgPSAociAqIHIpIC8gKE1hdGgucG93KHAueCAtIGMueCwgMikgKyBNYXRoLnBvdyhwLnkgLSBjLnksIDIpKTtcbiAgcmV0dXJuIHtcbiAgICB4OiBhbHBoYSAqIChwLnggLSBjLngpICsgYy54LFxuICAgIHk6IGFscGhhICogKHAueSAtIGMueSkgKyBjLnlcbiAgfTtcbn1cblxuLy9jYWxjdWxhdGUgdGhlIHJhZGl1cyBhbmQgY2VudHJlIG9mIHRoZSBjaXJjbGUgcmVxdWlyZWQgdG8gZHJhdyBhIGxpbmUgYmV0d2VlblxuLy90d28gcG9pbnRzIGluIHRoZSBoeXBlcmJvbGljIHBsYW5lIGRlZmluZWQgYnkgdGhlIGRpc2sgKHIsIGMpXG5leHBvcnQgY29uc3QgZ3JlYXRDaXJjbGUgPSAocDEsIHAyLCByLCBjKSA9PiB7XG4gIGxldCBwMUludmVyc2UgPSBpbnZlcnNlKHAxLCByLCBjKTtcbiAgbGV0IHAySW52ZXJzZSA9IGludmVyc2UocDIsIHIsIGMpO1xuXG4gIGxldCBtID0gbWlkcG9pbnQocDEsIHAxSW52ZXJzZSk7XG4gIGxldCBuID0gbWlkcG9pbnQocDIsIHAySW52ZXJzZSk7XG5cbiAgbGV0IG0xID0gcGVycGVuZGljdWxhclNsb3BlKG0sIHAxSW52ZXJzZSk7XG4gIGxldCBtMiA9IHBlcnBlbmRpY3VsYXJTbG9wZShuLCBwMkludmVyc2UpO1xuXG5cbiAgLy9jZW50cmUgaXMgdGhlIGNlbnRyZXBvaW50IG9mIHRoZSBjaXJjbGUgb3V0IG9mIHdoaWNoIHRoZSBhcmMgaXMgbWFkZVxuICBsZXQgY2VudHJlID0gaW50ZXJzZWN0aW9uKG0sIG0xLCBuLCBtMik7XG4gIGxldCByYWRpdXMgPSBkaXN0YW5jZShjZW50cmUsIHAxKTtcbiAgcmV0dXJuIHtcbiAgICBjZW50cmU6IGNlbnRyZSxcbiAgICByYWRpdXM6IHJhZGl1c1xuICB9O1xufVxuXG4vL2FuIGF0dGVtcHQgYXQgY2FsY3VsYXRpbmcgdGhlIGNpcmNsZSBhbGdlYnJhaWNhbGx5XG5leHBvcnQgY29uc3QgZ3JlYXRDaXJjbGVWMiA9IChwMSwgcDIsIHIpID0+IHtcbiAgbGV0IHggPSAocDIueSAqIChwMS54ICogcDEueCArIHIpICsgcDEueSAqIHAxLnkgKiBwMi55IC0gcDEueSAqIChwMi54ICogcDIueCArIHAyLnkgKiBwMi55ICsgcikpIC8gKDIgKiBwMS54ICogcDIueSAtIHAxLnkgKiBwMi54KTtcbiAgbGV0IHkgPSAocDEueCAqIHAxLnggKiBwMi54IC0gcDEueCAqIChwMi54ICogcDIueCArIHAyLnkgKiBwMi55ICsgcikgKyBwMi54ICogKHAxLnkgKiBwMS55ICsgcikpIC8gKDIgKiBwMS55ICogcDIueCArIDIgKiBwMS54ICogcDIueSk7XG4gIGxldCByYWRpdXMgPSBNYXRoLnNxcnQoeCAqIHggKyB5ICogeSAtIHIpO1xuICByZXR1cm4ge1xuICAgIGNlbnRyZToge1xuICAgICAgeDogeCxcbiAgICAgIHk6IHlcbiAgICB9LFxuICAgIHJhZGl1czogcmFkaXVzXG4gIH1cbn1cblxuLy9pbnRlcnNlY3Rpb24gb2YgdHdvIGNpcmNsZXMgd2l0aCBlcXVhdGlvbnM6XG4vLyh4LWEpXjIgKyh5LWEpXjIgPSByMF4yXG4vLyh4LWIpXjIgKyh5LWMpXjIgPSByMV4yXG4vL05PVEUgYXNzdW1lcyB0aGUgdHdvIGNpcmNsZXMgRE8gaW50ZXJzZWN0IVxuZXhwb3J0IGNvbnN0IGNpcmNsZUludGVyc2VjdCA9IChjMCwgYzEsIHIwLCByMSkgPT4ge1xuICBsZXQgYSA9IGMwLng7XG4gIGxldCBiID0gYzAueTtcbiAgbGV0IGMgPSBjMS54O1xuICBsZXQgZCA9IGMxLnk7XG4gIGxldCBkaXN0ID0gTWF0aC5zcXJ0KChjIC0gYSkgKiAoYyAtIGEpICsgKGQgLSBiKSAqIChkIC0gYikpO1xuXG4gIGxldCBkZWwgPSBNYXRoLnNxcnQoKGRpc3QgKyByMCArIHIxKSAqIChkaXN0ICsgcjAgLSByMSkgKiAoZGlzdCAtIHIwICsgcjEpICogKC1kaXN0ICsgcjAgKyByMSkpIC8gNDtcblxuICBsZXQgeFBhcnRpYWwgPSAoYSArIGMpIC8gMiArICgoYyAtIGEpICogKHIwICogcjAgLSByMSAqIHIxKSkgLyAoMiAqIGRpc3QgKiBkaXN0KTtcbiAgbGV0IHgxID0geFBhcnRpYWwgLSAyICogZGVsICogKGIgLSBkKSAvIChkaXN0ICogZGlzdCk7XG4gIGxldCB4MiA9IHhQYXJ0aWFsICsgMiAqIGRlbCAqIChiIC0gZCkgLyAoZGlzdCAqIGRpc3QpO1xuXG4gIGxldCB5UGFydGlhbCA9IChiICsgZCkgLyAyICsgKChkIC0gYikgKiAocjAgKiByMCAtIHIxICogcjEpKSAvICgyICogZGlzdCAqIGRpc3QpO1xuICBsZXQgeTEgPSB5UGFydGlhbCArIDIgKiBkZWwgKiAoYSAtIGMpIC8gKGRpc3QgKiBkaXN0KTtcbiAgbGV0IHkyID0geVBhcnRpYWwgLSAyICogZGVsICogKGEgLSBjKSAvIChkaXN0ICogZGlzdCk7XG5cbiAgbGV0IHAxID0ge1xuICAgIHg6IHgxLFxuICAgIHk6IHkxXG4gIH1cblxuICBsZXQgcDIgPSB7XG4gICAgeDogeDIsXG4gICAgeTogeTJcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcDE6IHAxLFxuICAgIHAyOiBwMlxuICB9O1xufVxuXG5leHBvcnQgY29uc3QgY2lyY2xlTGluZUludGVyc2VjdCA9IChjLCByLCBwMSwgcDIpID0+IHtcblxuICBjb25zdCBkID0gZGlzdGFuY2UocDEsIHAyKTtcbiAgLy91bml0IHZlY3RvciBwMSBwMlxuICBjb25zdCBkeCA9IChwMi54IC0gcDEueCkgLyBkO1xuICBjb25zdCBkeSA9IChwMi55IC0gcDEueSkgLyBkO1xuXG4gIC8vcG9pbnQgb24gbGluZSBjbG9zZXN0IHRvIGNpcmNsZSBjZW50cmVcbiAgY29uc3QgdCA9IGR4ICogKGMueCAtIHAxLngpICsgZHkgKiAoYy55IC0gcDEueSk7XG4gIGNvbnN0IHAgPSB7XG4gICAgeDogdCAqIGR4ICsgcDEueCxcbiAgICB5OiB0ICogZHkgKyBwMS55XG4gIH07XG5cbiAgLy9kaXN0YW5jZSBmcm9tIHRoaXMgcG9pbnQgdG8gY2VudHJlXG4gIGNvbnN0IGQyID0gZGlzdGFuY2UocCwgYyk7XG5cbiAgLy9saW5lIGludGVyc2VjdHMgY2lyY2xlXG4gIGlmIChkMiA8IHIpIHtcbiAgICBjb25zdCBkdCA9IE1hdGguc3FydChyICogciAtIGQyICogZDIpO1xuICAgIC8vcG9pbnQgMVxuICAgIGNvbnN0IHExID0ge1xuICAgICAgeDogKHQgLSBkdCkgKiBkeCArIHAxLngsXG4gICAgICB5OiAodCAtIGR0KSAqIGR5ICsgcDEueVxuICAgIH1cbiAgICAvL3BvaW50IDJcbiAgICBjb25zdCBxMiA9IHtcbiAgICAgIHg6ICh0ICsgZHQpICogZHggKyBwMS54LFxuICAgICAgeTogKHQgKyBkdCkgKiBkeSArIHAxLnlcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgcDE6IHExLFxuICAgICAgcDI6IHEyXG4gICAgfTtcbiAgfSBlbHNlIGlmIChkMiA9PT0gcikge1xuICAgIHJldHVybiBwO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yOiBsaW5lIGRvZXMgbm90IGludGVyc2VjdCBjaXJjbGUhJyk7XG4gIH1cbn1cblxuLy9hbmdsZSBpbiByYWRpYW5zIGJldHdlZW4gdHdvIHBvaW50cyBvbiBjaXJjbGUgb2YgcmFkaXVzIHJcbmV4cG9ydCBjb25zdCBjZW50cmFsQW5nbGUgPSAocDEsIHAyLCByKSA9PiB7XG4gIHJldHVybiAyICogTWF0aC5hc2luKDAuNSAqIGRpc3RhbmNlKHAxLCBwMikgLyByKTtcbn1cblxuLy9jYWxjdWxhdGUgdGhlIG5vcm1hbCB2ZWN0b3IgZ2l2ZW4gMiBwb2ludHNcbmV4cG9ydCBjb25zdCBub3JtYWxWZWN0b3IgPSAocDEsIHAyKSA9PiB7XG4gIGxldCBkID0gTWF0aC5zcXJ0KE1hdGgucG93KHAyLnggLSBwMS54LCAyKSArIE1hdGgucG93KHAyLnkgLSBwMS55LCAyKSk7XG4gIHJldHVybiB7XG4gICAgeDogKHAyLnggLSBwMS54KSAvIGQsXG4gICAgeTogKHAyLnkgLSBwMS55KSAvIGRcbiAgfVxufVxuXG4vL2RvZXMgdGhlIGxpbmUgY29ubmVjdGluZyBwMSwgcDIgZ28gdGhyb3VnaCB0aGUgcG9pbnQgKDAsMCk/XG4vL25lZWRzIHRvIHRha2UgaW50byBhY2NvdW50IHJvdW5kb2ZmIGVycm9ycyBzbyByZXR1cm5zIHRydWUgaWZcbi8vdGVzdCBpcyBjbG9zZSB0byAwXG5leHBvcnQgY29uc3QgdGhyb3VnaE9yaWdpbiA9IChwMSwgcDIpID0+IHtcbiAgaWYgKHAxLnggPT09IDAgJiYgcDIueCA9PT0gMCkge1xuICAgIC8vdmVydGljYWwgbGluZSB0aHJvdWdoIGNlbnRyZVxuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGNvbnN0IHRlc3QgPSAoLXAxLnggKiBwMi55ICsgcDEueCAqIHAxLnkpIC8gKHAyLnggLSBwMS54KSArIHAxLnk7XG5cbiAgaWYgKHRlc3QudG9GaXhlZCg2KSA9PSAwKSByZXR1cm4gdHJ1ZTtcbiAgZWxzZSByZXR1cm4gZmFsc2U7XG59XG5cbi8vZmluZCB0aGUgY2VudHJvaWQgb2YgYSBub24tc2VsZi1pbnRlcnNlY3RpbmcgcG9seWdvblxuZXhwb3J0IGNvbnN0IGNlbnRyb2lkT2ZQb2x5Z29uID0gKHBvaW50cykgPT4ge1xuICBsZXQgZmlyc3QgPSBwb2ludHNbMF0sXG4gICAgbGFzdCA9IHBvaW50c1twb2ludHMubGVuZ3RoIC0gMV07XG4gIGlmIChmaXJzdC54ICE9IGxhc3QueCB8fCBmaXJzdC55ICE9IGxhc3QueSkgcG9pbnRzLnB1c2goZmlyc3QpO1xuICBsZXQgdHdpY2VhcmVhID0gMCxcbiAgICB4ID0gMCxcbiAgICB5ID0gMCxcbiAgICBuUHRzID0gcG9pbnRzLmxlbmd0aCxcbiAgICBwMSwgcDIsIGY7XG4gIGZvciAodmFyIGkgPSAwLCBqID0gblB0cyAtIDE7IGkgPCBuUHRzOyBqID0gaSsrKSB7XG4gICAgcDEgPSBwb2ludHNbaV07XG4gICAgcDIgPSBwb2ludHNbal07XG4gICAgZiA9IHAxLnggKiBwMi55IC0gcDIueCAqIHAxLnk7XG4gICAgdHdpY2VhcmVhICs9IGY7XG4gICAgeCArPSAocDEueCArIHAyLngpICogZjtcbiAgICB5ICs9IChwMS55ICsgcDIueSkgKiBmO1xuICB9XG4gIGYgPSB0d2ljZWFyZWEgKiAzO1xuICByZXR1cm4ge1xuICAgIHg6IHggLyBmLFxuICAgIHk6IHkgLyBmXG4gIH07XG59XG5cbi8vY29tcGFyZSB0d28gcG9pbnRzIHRha2luZyByb3VuZGluZyBlcnJvcnMgaW50byBhY2NvdW50XG5leHBvcnQgY29uc3QgY29tcGFyZVBvaW50cyA9IChwMSwgcDIpID0+IHtcbiAgaWYgKHR5cGVvZiBwMSA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHAyID09PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHAxID0gcG9pbnRUb0ZpeGVkKHAxLCA2KTtcbiAgcDIgPSBwb2ludFRvRml4ZWQocDIsIDYpO1xuICBpZiAocDEueCA9PT0gcDIueCAmJiBwMS55ID09PSBwMi55KSByZXR1cm4gdHJ1ZTtcbiAgZWxzZSByZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydCBjb25zdCBwb2ludFRvRml4ZWQgPSAocCwgcGxhY2VzKSA9PiB7XG4gIHJldHVybiB7XG4gICAgeDogcC54LnRvRml4ZWQocGxhY2VzKSxcbiAgICB5OiBwLnkudG9GaXhlZChwbGFjZXMpXG4gIH07XG59XG5cbi8vZmluZCBhIHBvaW50IGF0IGEgZGlzdGFuY2UgZCBhbG9uZyB0aGUgY2lyY3VtZmVyZW5jZSBvZlxuLy9hIGNpcmNsZSBvZiByYWRpdXMgciwgY2VudHJlIGMgZnJvbSBhIHBvaW50IGFsc29cbi8vb24gdGhlIGNpcmN1bWZlcmVuY2VcbmV4cG9ydCBjb25zdCBzcGFjZWRQb2ludE9uQXJjID0gKGNpcmNsZSwgcG9pbnQsIHNwYWNpbmcpID0+IHtcbiAgY29uc3QgY29zVGhldGEgPSAtKChzcGFjaW5nICogc3BhY2luZykgLyAoMiAqIGNpcmNsZS5yYWRpdXMgKiBjaXJjbGUucmFkaXVzKSAtIDEpO1xuICBjb25zdCBzaW5UaGV0YVBvcyA9IE1hdGguc3FydCgxIC0gTWF0aC5wb3coY29zVGhldGEsIDIpKTtcbiAgY29uc3Qgc2luVGhldGFOZWcgPSAtc2luVGhldGFQb3M7XG5cbiAgY29uc3QgeFBvcyA9IGNpcmNsZS5jZW50cmUueCArIGNvc1RoZXRhICogKHBvaW50LnggLSBjaXJjbGUuY2VudHJlLngpIC0gc2luVGhldGFQb3MgKiAocG9pbnQueSAtIGNpcmNsZS5jZW50cmUueSk7XG4gIGNvbnN0IHhOZWcgPSBjaXJjbGUuY2VudHJlLnggKyBjb3NUaGV0YSAqIChwb2ludC54IC0gY2lyY2xlLmNlbnRyZS54KSAtIHNpblRoZXRhTmVnICogKHBvaW50LnkgLSBjaXJjbGUuY2VudHJlLnkpO1xuICBjb25zdCB5UG9zID0gY2lyY2xlLmNlbnRyZS55ICsgc2luVGhldGFQb3MgKiAocG9pbnQueCAtIGNpcmNsZS5jZW50cmUueCkgKyBjb3NUaGV0YSAqIChwb2ludC55IC0gY2lyY2xlLmNlbnRyZS55KTtcbiAgY29uc3QgeU5lZyA9IGNpcmNsZS5jZW50cmUueSArIHNpblRoZXRhTmVnICogKHBvaW50LnggLSBjaXJjbGUuY2VudHJlLngpICsgY29zVGhldGEgKiAocG9pbnQueSAtIGNpcmNsZS5jZW50cmUueSk7XG5cbiAgY29uc3QgcDEgPSB7XG4gICAgeDogeFBvcyxcbiAgICB5OiB5UG9zXG4gIH07XG4gIGNvbnN0IHAyID0ge1xuICAgIHg6IHhOZWcsXG4gICAgeTogeU5lZ1xuICB9O1xuICByZXR1cm4ge1xuICAgIHAxOiBwMSxcbiAgICBwMjogcDJcbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgRSBmcm9tICcuL2V1Y2xpZCc7XG4vLyAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyAqXG4vLyAqICAgSFlQRVJCT0xJQyBGVU5DVElPTlNcbi8vICogICBhIHBsYWNlIHRvIHN0YXNoIGFsbCB0aGUgZnVuY3Rpb25zIHRoYXQgYXJlIGh5cGVyYm9saWMgZ2VtZW9tZXRyaWNhbFxuLy8gKiAgIG9wZXJhdGlvbnNcbi8vICpcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuLy9jYWxjdWxhdGUgZ3JlYXRDaXJjbGUsIHN0YXJ0QW5nbGUgYW5kIGVuZEFuZ2xlIGZvciBoeXBlcmJvbGljIGFyY1xuLy9UT0RPIGRlYWwgd2l0aCBjYXNlIG9mIHN0YWlnaHQgbGluZXMgdGhyb3VnaCBjZW50cmVcbmV4cG9ydCBjb25zdCBhcmMgPSAoIHAxLCBwMiwgY2lyY2xlICkgPT4ge1xuICBpZihFLnRocm91Z2hPcmlnaW4ocDEscDIpKXtcbiAgICByZXR1cm4ge1xuICAgICAgY2lyY2xlOiBjaXJjbGUsXG4gICAgICBzdGFydEFuZ2xlOiAwLFxuICAgICAgZW5kQW5nbGU6IDAsXG4gICAgICBjbG9ja3dpc2U6IGZhbHNlLFxuICAgICAgc3RyYWlnaHRMaW5lOiB0cnVlLFxuICAgIH1cbiAgfVxuICBsZXQgY2xvY2t3aXNlID0gZmFsc2U7XG4gIGxldCBhbHBoYTEsIGFscGhhMiwgc3RhcnRBbmdsZSwgZW5kQW5nbGU7XG4gIGNvbnN0IGMgPSBFLmdyZWF0Q2lyY2xlKCBwMSwgcDIsIGNpcmNsZS5yYWRpdXMsIGNpcmNsZS5jZW50cmUgKTtcblxuICBjb25zdCBveSA9IGMuY2VudHJlLnk7XG4gIGNvbnN0IG94ID0gYy5jZW50cmUueDtcblxuICAvL3BvaW50IGF0IDAgcmFkaWFucyBvbiBjXG4gIGNvbnN0IHAzID0ge1xuICAgIHg6IG94ICsgYy5yYWRpdXMsXG4gICAgeTogb3lcbiAgfVxuXG4gIC8vY2FsY3VsYXRlIHRoZSBwb3NpdGlvbiBvZiBlYWNoIHBvaW50IGluIHRoZSBjaXJjbGVcbiAgYWxwaGExID0gRS5jZW50cmFsQW5nbGUoIHAzLCBwMSwgYy5yYWRpdXMgKTtcbiAgYWxwaGExID0gKCBwMS55IDwgb3kgKSA/IDIgKiBNYXRoLlBJIC0gYWxwaGExIDogYWxwaGExO1xuICBhbHBoYTIgPSBFLmNlbnRyYWxBbmdsZSggcDMsIHAyLCBjLnJhZGl1cyApO1xuICBhbHBoYTIgPSAoIHAyLnkgPCBveSApID8gMiAqIE1hdGguUEkgLSBhbHBoYTIgOiBhbHBoYTI7XG5cbiAgLy9jYXNlIHdoZXJlIHAxIGFib3ZlIGFuZCBwMiBiZWxvdyB0aGUgbGluZSBjLmNlbnRyZSAtPiBwM1xuICBpZiAoICggcDEueCA+IG94ICYmIHAyLnggPiBveCApICYmICggcDEueSA8IG95ICYmIHAyLnkgPiBveSApICkge1xuICAgIHN0YXJ0QW5nbGUgPSBhbHBoYTE7XG4gICAgZW5kQW5nbGUgPSBhbHBoYTI7XG4gIH1cbiAgLy9jYXNlIHdoZXJlIHAyIGFib3ZlIGFuZCBwMSBiZWxvdyB0aGUgbGluZSBjLmNlbnRyZSAtPiBwM1xuICBlbHNlIGlmICggKCBwMS54ID4gb3ggJiYgcDIueCA+IG94ICkgJiYgKCBwMS55ID4gb3kgJiYgcDIueSA8IG95ICkgKSB7XG4gICAgc3RhcnRBbmdsZSA9IGFscGhhMjtcbiAgICBlbmRBbmdsZSA9IGFscGhhMTtcbiAgICBjbG9ja3dpc2UgPSB0cnVlO1xuICB9XG4gIC8vcG9pbnRzIGluIGNsb2Nrd2lzZSBvcmRlclxuICBlbHNlIGlmICggYWxwaGExID4gYWxwaGEyICkge1xuICAgIHN0YXJ0QW5nbGUgPSBhbHBoYTI7XG4gICAgZW5kQW5nbGUgPSBhbHBoYTE7XG4gICAgY2xvY2t3aXNlID0gdHJ1ZTtcbiAgfVxuICAvL3BvaW50cyBpbiBhbnRpY2xvY2t3aXNlIG9yZGVyXG4gIGVsc2Uge1xuICAgIHN0YXJ0QW5nbGUgPSBhbHBoYTE7XG4gICAgZW5kQW5nbGUgPSBhbHBoYTI7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGNpcmNsZTogYyxcbiAgICBzdGFydEFuZ2xlOiBzdGFydEFuZ2xlLFxuICAgIGVuZEFuZ2xlOiBlbmRBbmdsZSxcbiAgICBjbG9ja3dpc2U6IGNsb2Nrd2lzZSxcbiAgICBzdHJhaWdodExpbmU6IGZhbHNlLFxuICB9XG59XG5cbi8vdHJhbnNsYXRlIGEgc2V0IG9mIHBvaW50cyBhbG9uZyB0aGUgeCBheGlzXG5leHBvcnQgY29uc3QgdHJhbnNsYXRlWCA9ICggcG9pbnRzQXJyYXksIGRpc3RhbmNlICkgPT4ge1xuICBjb25zdCBsID0gcG9pbnRzQXJyYXkubGVuZ3RoO1xuICBjb25zdCBuZXdQb2ludHMgPSBbXTtcbiAgY29uc3QgZSA9IE1hdGgucG93KCBNYXRoLkUsIGRpc3RhbmNlICk7XG4gIGNvbnN0IHBvcyA9IGUgKyAxO1xuICBjb25zdCBuZWcgPSBlIC0gMTtcbiAgZm9yICggbGV0IGkgPSAwOyBpIDwgbDsgaSsrICkge1xuICAgIGNvbnN0IHggPSBwb3MgKiBwb2ludHNBcnJheVsgaSBdLnggKyBuZWcgKiBwb2ludHNBcnJheVsgaSBdLnk7XG4gICAgY29uc3QgeSA9IG5lZyAqIHBvaW50c0FycmF5WyBpIF0ueCArIHBvcyAqIHBvaW50c0FycmF5WyBpIF0ueTtcbiAgICBuZXdQb2ludHMucHVzaCgge1xuICAgICAgeDogeCxcbiAgICAgIHk6IHlcbiAgICB9IClcbiAgfVxuICByZXR1cm4gbmV3UG9pbnRzO1xufVxuXG4vL3JvdGF0ZSBhIHNldCBvZiBwb2ludHMgYWJvdXQgYSBwb2ludCBieSBhIGdpdmVuIGFuZ2xlXG4vL2Nsb2Nrd2lzZSBkZWZhdWx0cyB0byBmYWxzZVxuZXhwb3J0IGNvbnN0IHJvdGF0aW9uID0gKCBwb2ludHNBcnJheSwgcG9pbnQsIGFuZ2xlLCBjbG9ja3dpc2UgKSA9PiB7XG5cbn1cblxuLy9yZWZsZWN0IGEgc2V0IG9mIHBvaW50cyBhY3Jvc3MgYSBoeXBlcmJvbGljIGFyY1xuLy9UT0RPIGFkZCBjYXNlIHdoZXJlIHJlZmxlY3Rpb24gaXMgYWNyb3NzIHN0cmFpZ2h0IGxpbmVcbmV4cG9ydCBjb25zdCByZWZsZWN0ID0gKCBwb2ludHNBcnJheSwgcDEsIHAyLCBjaXJjbGUgKSA9PiB7XG4gIGNvbnN0IGwgPSBwb2ludHNBcnJheS5sZW5ndGg7XG4gIGNvbnN0IGEgPSBhcmMoIHAxLCBwMiwgY2lyY2xlICk7XG4gIGNvbnN0IG5ld1BvaW50cyA9IFtdO1xuXG4gIGlmKCFhLnN0cmFpZ2h0TGluZSl7XG4gICAgZm9yICggbGV0IGkgPSAwOyBpIDwgbDsgaSsrICkge1xuICAgICAgbmV3UG9pbnRzLnB1c2goIEUuaW52ZXJzZSggcG9pbnRzQXJyYXlbIGkgXSwgYS5jaXJjbGUucmFkaXVzLCBhLmNpcmNsZS5jZW50cmUgKSApO1xuICAgIH1cbiAgfVxuICBlbHNle1xuICAgIGZvciAoIGxldCBpID0gMDsgaSA8IGw7IGkrKyApIHtcbiAgICAgIG5ld1BvaW50cy5wdXNoKCApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbmV3UG9pbnRzO1xufVxuXG5leHBvcnQgY29uc3QgcG9pbmNhcmVUb1dlaWVyc3RyYXNzID0gKCBwb2ludDJEICkgPT4ge1xuICBjb25zdCBmYWN0b3IgPSAxIC8gKCAxIC0gcG9pbnQyRC54ICogcG9pbnQyRC54IC0gcG9pbnQyRC55ICogcG9pbnQyRC55ICk7XG4gIHJldHVybiB7XG4gICAgeDogMiAqIGZhY3RvciAqIHBvaW50MkQueCxcbiAgICB5OiAyICogZmFjdG9yICogcG9pbnQyRC55LFxuICAgIHo6IGZhY3RvciAqICggMSArIHBvaW50MkQueCAqIHBvaW50MkQueCArIHBvaW50MkQueSAqIHBvaW50MkQueSApXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IHdlaWVyc3RyYXNzVG9Qb2luY2FyZSA9ICggcG9pbnQzRCApID0+IHtcbiAgY29uc3QgZmFjdG9yID0gMSAvICggMSArIHBvaW50M0QueiApO1xuICByZXR1cm4ge1xuICAgIHg6IGZhY3RvciAqIHBvaW50M0QueCxcbiAgICB5OiBmYWN0b3IgKiBwb2ludDNELnlcbiAgfVxufVxuXG5leHBvcnQgY29uc3Qgcm90YXRlQWJvdXRPcmlnaW5XZWllcnN0cmFzcyA9ICggcG9pbnQzRCwgYW5nbGUgKSA9PiB7XG4gIHJldHVybiB7XG4gICAgeDogTWF0aC5jb3MoIGFuZ2xlICkgKiBwb2ludDNELnggLSBNYXRoLnNpbiggYW5nbGUgKSAqIHBvaW50M0QueSxcbiAgICB5OiBNYXRoLnNpbiggYW5nbGUgKSAqIHBvaW50M0QueCArIE1hdGguY29zKCBhbmdsZSApICogcG9pbnQzRC55LFxuICAgIHo6IHBvaW50M0QuelxuICB9XG59XG5cbmV4cG9ydCBjb25zdCByb3RhdGVQZ29uQWJvdXRPcmlnaW4gPSAoIHBvaW50czJEQXJyYXksIGFuZ2xlICkgPT4ge1xuICBjb25zdCBsID0gcG9pbnRzMkRBcnJheS5sZW5ndGg7XG4gIGNvbnN0IHJvdGF0ZWRQb2ludHMyREFycmF5ID0gW107XG4gIGZvciAoIGxldCBpID0gMDsgaSA8IGw7IGkrKyApIHtcbiAgICBsZXQgcG9pbnQgPSBwb2luY2FyZVRvV2VpZXJzdHJhc3MoIHBvaW50czJEQXJyYXlbIGkgXSApO1xuICAgIHBvaW50ID0gcm90YXRlQWJvdXRPcmlnaW5XZWllcnN0cmFzcyggcG9pbnQsIGFuZ2xlICk7XG4gICAgcG9pbnQgPSB3ZWllcnN0cmFzc1RvUG9pbmNhcmUocG9pbnQpO1xuICAgIHJvdGF0ZWRQb2ludHMyREFycmF5LnB1c2gocG9pbnQpO1xuICB9XG4gIHJldHVybiByb3RhdGVkUG9pbnRzMkRBcnJheTtcbn1cbiIsImltcG9ydCB7IFJlZ3VsYXJUZXNzZWxhdGlvbiB9IGZyb20gJy4vcmVndWxhclRlc3NlbGF0aW9uJztcbmltcG9ydCAqIGFzIEUgZnJvbSAnLi9ldWNsaWQnO1xuaW1wb3J0IHsgRGlzayB9IGZyb20gJy4vZGlzayc7XG5cblxuLy8gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gKlxuLy8gKiAgIFNFVFVQXG4vLyAqXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbi8vY29uc3QgZGlzayA9IG5ldyBEaXNrKCk7XG5cbmNvbnN0IHRlc3NlbGF0aW9uID0gbmV3IFJlZ3VsYXJUZXNzZWxhdGlvbig0LCA1LCAwLCAncmVkJyk7XG4iLCJpbXBvcnQgKiBhcyBFIGZyb20gJy4vZXVjbGlkJztcbmltcG9ydCAqIGFzIEggZnJvbSAnLi9oeXBlcmJvbGljJztcbmltcG9ydCB7XG4gIERpc2tcbn1cbmZyb20gJy4vZGlzayc7XG5cblxuLy8gKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gKiAgICBURVNTRUxBVElPTiBDTEFTU1xuLy8gKiAgICBDcmVhdGVzIGEgcmVndWxhciBUZXNzZWxhdGlvbiBvZiB0aGUgUG9pbmNhcmUgRGlza1xuLy8gKiAgICBxOiBudW1iZXIgb2YgcC1nb25zIG1lZXRpbmcgYXQgZWFjaCB2ZXJ0ZXhcbi8vICogICAgcDogbnVtYmVyIG9mIHNpZGVzIG9mIHAtZ29uXG4vLyAqICAgIHVzaW5nIHRoZSB0ZWNobmlxdWVzIGNyZWF0ZWQgYnkgQ294ZXRlciBhbmQgRHVuaGFtXG4vLyAqXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5leHBvcnQgY2xhc3MgUmVndWxhclRlc3NlbGF0aW9uIHtcbiAgY29uc3RydWN0b3IocCwgcSwgcm90YXRpb24sIGNvbG91ciwgbWF4TGF5ZXJzKSB7XG4gICAgdGhpcy5kaXNrID0gbmV3IERpc2soKTtcblxuICAgIHRoaXMuY2VudHJlID0ge1xuICAgICAgeDogMCxcbiAgICAgIHk6IDBcbiAgICB9XG4gICAgdGhpcy5wID0gcDtcbiAgICB0aGlzLnEgPSBxO1xuICAgIHRoaXMuY29sb3VyID0gY29sb3VyIHx8ICdibGFjayc7XG4gICAgdGhpcy5yb3RhdGlvbiA9IHJvdGF0aW9uIHx8IDA7XG4gICAgdGhpcy5tYXhMYXllcnMgPSBtYXhMYXllcnMgfHwgNTtcblxuICAgIGlmICh0aGlzLmNoZWNrUGFyYW1zKCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIChldmVudCkgPT4ge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2xvYWQnKTtcbiAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH0sIGZhbHNlKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XG4gICAgICB0aGlzLmluaXQoKTtcbiAgICB9LCBmYWxzZSk7XG5cblxuXG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMucmFkaXVzID0gdGhpcy5kaXNrLmdldFJhZGl1cygpO1xuICAgIHRoaXMuZnIgPSB0aGlzLmZ1bmRhbWVudGFsUmVnaW9uKCk7XG4gICAgdGhpcy50ZXN0aW5nKCk7XG4gIH1cblxuICB0ZXN0aW5nKCkge1xuICAgIC8vdGhpcy5kaXNrLnBvbHlnb25PdXRsaW5lKFt0aGlzLmZyLmEsIHRoaXMuZnIuYiwgdGhpcy5mci5jXSwgMHg1MzEyYmEpO1xuICAgIC8vdGhpcy5kaXNrLnBvbHlnb24odGhpcy5mciwgMHhlODAzNDgpO1xuICAgIGNvbnN0IHBvbHkyID0gSC5yZWZsZWN0KHRoaXMuZnIsIHRoaXMuZnJbMV0sIHRoaXMuZnJbMl0sIHRoaXMuZGlzay5jaXJjbGUpO1xuICAgIC8vY29uc29sZS50YWJsZShwb2x5Mik7XG4gICAgdGhpcy5kaXNrLnBvbHlnb24ocG9seTIsIDB4YzMxNjdlKTtcblxuICAgIGxldCBwb2x5MyA9IEgucm90YXRlUGdvbkFib3V0T3JpZ2luKHBvbHkyLCBNYXRoLlBJKTtcblxuICAgIC8vY29uc29sZS5sb2coRS50aHJvdWdoT3JpZ2luKHBvbHkzWzBdLCBwb2x5M1sxXSkpO1xuICAgIC8vY29uc29sZS5sb2coRS50aHJvdWdoT3JpZ2luKHBvbHkzWzFdLCBwb2x5M1syXSkpO1xuICAgIC8vY29uc29sZS5sb2coRS50aHJvdWdoT3JpZ2luKHBvbHkzWzJdLCBwb2x5M1swXSkpO1xuXG4gICAgLy9jb25zb2xlLnRhYmxlKHBvbHkyKTtcbiAgICAvL2NvbnNvbGUubG9nKHBvbHkzKTtcbiAgICB0aGlzLmRpc2sucG9seWdvbihwb2x5MywgMHhkMmJlMTEpO1xuICB9XG5cbiAgLy9jYWxjdWxhdGUgZmlyc3QgcG9pbnQgb2YgZnVuZGFtZW50YWwgcG9seWdvbiB1c2luZyBDb3hldGVyJ3MgbWV0aG9kXG4gIGZ1bmRhbWVudGFsUmVnaW9uKCkge1xuICAgIGNvbnN0IHMgPSBNYXRoLnNpbihNYXRoLlBJIC8gdGhpcy5wKTtcbiAgICBjb25zdCB0ID0gTWF0aC5jb3MoTWF0aC5QSSAvIHRoaXMucSk7XG4gICAgLy9tdWx0aXBseSB0aGVzZSBieSB0aGUgZGlza3MgcmFkaXVzIChDb3hldGVyIHVzZWQgdW5pdCBkaXNrKTtcbiAgICBjb25zdCByID0gMSAvIE1hdGguc3FydCgodCAqIHQpIC8gKHMgKiBzKSAtIDEpICogdGhpcy5yYWRpdXM7XG4gICAgY29uc3QgZCA9IDEgLyBNYXRoLnNxcnQoMSAtIChzICogcykgLyAodCAqIHQpKSAqIHRoaXMucmFkaXVzO1xuICAgIGNvbnN0IGIgPSB7XG4gICAgICB4OiB0aGlzLnJhZGl1cyAqIE1hdGguY29zKE1hdGguUEkgLyB0aGlzLnApLFxuICAgICAgeTogLXRoaXMucmFkaXVzICogTWF0aC5zaW4oTWF0aC5QSSAvIHRoaXMucClcbiAgICB9XG4gICAgY29uc3QgY2VudHJlID0ge1xuICAgICAgeDogZCxcbiAgICAgIHk6IDBcbiAgICB9O1xuICAgIC8vdGhlcmUgd2lsbCBiZSB0d28gcG9pbnRzIG9mIGludGVyc2VjdGlvbiwgb2Ygd2hpY2ggd2Ugd2FudCB0aGUgZmlyc3RcbiAgICBjb25zdCBwMSA9IEUuY2lyY2xlTGluZUludGVyc2VjdChjZW50cmUsIHIsIHRoaXMuZGlzay5jZW50cmUsIGIpLnAxO1xuXG4gICAgY29uc3QgcDIgPSB7XG4gICAgICB4OiBkIC0gcixcbiAgICAgIHk6IDBcbiAgICB9O1xuXG4gICAgY29uc3QgcG9pbnRzID0gW3RoaXMuZGlzay5jZW50cmUsIHAxLCBwMl07XG5cbiAgICByZXR1cm4gcG9pbnRzO1xuICB9XG5cbiAgLy9UaGUgdGVzc2VsYXRpb24gcmVxdWlyZXMgdGhhdCAocC0yKShxLTIpID4gNCB0byB3b3JrIChvdGhlcndpc2UgaXQgaXNcbiAgLy8gZWl0aGVyIGFuIGVsbGlwdGljYWwgb3IgZXVjbGlkZWFuIHRlc3NlbGF0aW9uKTtcbiAgY2hlY2tQYXJhbXMoKSB7XG4gICAgaWYgKHRoaXMubWF4TGF5ZXJzIDwgMCB8fCBpc05hTih0aGlzLm1heExheWVycykpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ21heExheWVycyBtdXN0IGJlIGdyZWF0ZXIgdGhhbiAwJyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKCh0aGlzLnAgLSAyKSAqICh0aGlzLnEgLSAyKSA8PSA0KSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdIeXBlcmJvbGljIHRlc3NlbGF0aW9ucyByZXF1aXJlIHRoYXQgKHAtMSkocS0yKSA8IDQhJyk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLy9Gb3Igbm93IHJlcXVpcmUgcCxxID4gMyxcbiAgICAvL1RPRE8gaW1wbGVtZW50IHNwZWNpYWwgY2FzZXMgZm9yIHEgPSAzIG9yIHAgPSAzXG4gICAgZWxzZSBpZiAodGhpcy5xIDw9IDMgfHwgaXNOYU4odGhpcy5xKSkge1xuICAgICAgY29uc29sZS5lcnJvcignVGVzc2VsYXRpb24gZXJyb3I6IGF0IGxlYXN0IDMgcC1nb25zIG11c3QgbWVldCBcXFxuICAgICAgICAgICAgICAgICAgICBhdCBlYWNoIHZlcnRleCEnKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wIDw9IDMgfHwgaXNOYU4odGhpcy5wKSkge1xuICAgICAgY29uc29sZS5lcnJvcignVGVzc2VsYXRpb24gZXJyb3I6IHBvbHlnb24gbmVlZHMgYXQgbGVhc3QgMyBzaWRlcyEnKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG59XG4iLCIvLyAqICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyAqXG4vLyAqICBUSFJFRSBKUyBDTEFTU1xuLy8gKlxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuZXhwb3J0IGNsYXNzIFRocmVlSlMge1xuICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKGV2ZW50KSA9PiB7XG4gICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignbG9hZCcpO1xuICAgICAgdGhpcy5pbml0KCk7XG4gICAgfSwgZmFsc2UpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgIC8vdGhpcy5jYW1lcmEuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAvL3RoaXMuY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcbiAgICAgIC8vdGhpcy5yZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuXG4gICAgICB0aGlzLnJlc2V0KCk7XG4gICAgfSwgZmFsc2UpO1xuXG4gIH1cblxuICBpbml0KCkge1xuICAgIHRoaXMuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcbiAgICB0aGlzLmluaXRDYW1lcmEoKTtcblxuICAgIHRoaXMuaW5pdExpZ2h0aW5nKCk7XG5cbiAgICB0aGlzLmF4ZXMoKTtcblxuICAgIHRoaXMuaW5pdFJlbmRlcmVyKCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLmlkKTsgLy8gU3RvcCB0aGUgYW5pbWF0aW9uXG4gICAgdGhpcy5yZW5kZXJlci5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2RibGNsaWNrJywgbnVsbCwgZmFsc2UpOyAvL3JlbW92ZSBsaXN0ZW5lciB0byByZW5kZXJcbiAgICB0aGlzLnNjZW5lID0gbnVsbDtcbiAgICB0aGlzLnByb2plY3RvciA9IG51bGw7XG4gICAgdGhpcy5jYW1lcmEgPSBudWxsO1xuICAgIHRoaXMuY29udHJvbHMgPSBudWxsO1xuXG4gICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdjYW52YXMnKTtcbiAgICBmb3IgKGxldCBpbmRleCA9IGVsZW1lbnQubGVuZ3RoIC0gMTsgaW5kZXggPj0gMDsgaW5kZXgtLSkge1xuICAgICAgZWxlbWVudFtpbmRleF0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbGVtZW50W2luZGV4XSk7XG4gICAgfVxuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgaW5pdENhbWVyYSgpIHtcbiAgICB0aGlzLmNhbWVyYSA9IG5ldyBUSFJFRS5PcnRob2dyYXBoaWNDYW1lcmEod2luZG93LmlubmVyV2lkdGggLyAtMixcbiAgICAgIHdpbmRvdy5pbm5lcldpZHRoIC8gMiwgd2luZG93LmlubmVySGVpZ2h0IC8gMiwgd2luZG93LmlubmVySGVpZ2h0IC8gLTIsIC0yLCAxKTtcbiAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLmNhbWVyYSk7XG4gICAgdGhpcy5jYW1lcmEucG9zaXRpb24ueCA9IDA7XG4gICAgdGhpcy5jYW1lcmEucG9zaXRpb24ueSA9IDA7XG5cbiAgICB0aGlzLmNhbWVyYS5wb3NpdGlvbi56ID0gMTtcbiAgfVxuXG4gIGluaXRMaWdodGluZygpIHtcbiAgICAvL2NvbnN0IHNwb3RMaWdodCA9IG5ldyBUSFJFRS5TcG90TGlnaHQoMHhmZmZmZmYpO1xuICAgIC8vc3BvdExpZ2h0LnBvc2l0aW9uLnNldCgwLCAwLCAxMDApO1xuICAgIC8vdGhpcy5zY2VuZS5hZGQoc3BvdExpZ2h0KTtcbiAgICBjb25zdCBhbWJpZW50TGlnaHQgPSBuZXcgVEhSRUUuQW1iaWVudExpZ2h0KDB4ZmZmZmZmKTtcbiAgICB0aGlzLnNjZW5lLmFkZChhbWJpZW50TGlnaHQpO1xuICB9XG5cbiAgaW5pdFJlbmRlcmVyKCkge1xuICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7XG4gICAgICBhbnRpYWxpYXM6IHRydWUsXG4gICAgfSk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRDbGVhckNvbG9yKDB4ZmZmZmZmLCAxLjApO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMucmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgICB0aGlzLnJlbmRlcigpO1xuICB9XG5cbiAgLy9iZWhpbmQ6IHRydWUvZmFsc2VcbiAgZGlzayhjZW50cmUsIHJhZGl1cywgY29sb3IsIGJlaGluZCkge1xuICAgIGxldCBjb2wgPSBjb2xvcjtcbiAgICBpZiAoY29sID09PSAndW5kZWZpbmVkJykgY29sID0gMHhmZmZmZmY7XG5cbiAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5DaXJjbGVHZW9tZXRyeShyYWRpdXMsIDEwMCwgMCwgMiAqIE1hdGguUEkpO1xuICAgIGNvbnN0IGNpcmNsZSA9IHRoaXMuY3JlYXRlTWVzaChnZW9tZXRyeSwgY29sKTtcbiAgICBjaXJjbGUucG9zaXRpb24ueCA9IGNlbnRyZS54O1xuICAgIGNpcmNsZS5wb3NpdGlvbi55ID0gY2VudHJlLnk7XG4gICAgaWYgKCFiZWhpbmQpIHtcbiAgICAgIGNpcmNsZS5wb3NpdGlvbi56ID0gMTtcbiAgICB9XG5cbiAgICB0aGlzLnNjZW5lLmFkZChjaXJjbGUpO1xuICB9XG5cbiAgc2VnbWVudChjaXJjbGUsIGFscGhhLCBvZmZzZXQsIGNvbG9yKSB7XG4gICAgbGV0IGNvbCA9IGNvbG9yO1xuICAgIGlmIChjb2wgPT09ICd1bmRlZmluZWQnKSBjb2wgPSAweGZmZmZmZjtcblxuICAgIGNvbnN0IGN1cnZlID0gbmV3IFRIUkVFLkVsbGlwc2VDdXJ2ZShcbiAgICAgIGNpcmNsZS5jZW50cmUueCwgY2lyY2xlLmNlbnRyZS55LCAvLyBheCwgYVlcbiAgICAgIGNpcmNsZS5yYWRpdXMsIGNpcmNsZS5yYWRpdXMsIC8vIHhSYWRpdXMsIHlSYWRpdXNcbiAgICAgIGFscGhhLCBvZmZzZXQsIC8vIGFTdGFydEFuZ2xlLCBhRW5kQW5nbGVcbiAgICAgIGZhbHNlIC8vIGFDbG9ja3dpc2VcbiAgICApO1xuXG4gICAgY29uc3QgcG9pbnRzID0gY3VydmUuZ2V0U3BhY2VkUG9pbnRzKDEwMCk7XG5cbiAgICBjb25zdCBwYXRoID0gbmV3IFRIUkVFLlBhdGgoKTtcbiAgICBjb25zdCBnZW9tZXRyeSA9IHBhdGguY3JlYXRlR2VvbWV0cnkocG9pbnRzKTtcblxuICAgIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLkxpbmVCYXNpY01hdGVyaWFsKHtcbiAgICAgIGNvbG9yOiBjb2xcbiAgICB9KTtcbiAgICBjb25zdCBzID0gbmV3IFRIUkVFLkxpbmUoZ2VvbWV0cnksIG1hdGVyaWFsKTtcblxuICAgIHRoaXMuc2NlbmUuYWRkKHMpO1xuICB9XG5cbiAgbGluZShzdGFydCwgZW5kLCBjb2xvcikge1xuICAgIGxldCBjb2wgPSBjb2xvcjtcbiAgICBpZiAoY29sID09PSAndW5kZWZpbmVkJykgY29sID0gMHhmZmZmZmY7XG5cbiAgICBjb25zdCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5HZW9tZXRyeSgpO1xuXG4gICAgZ2VvbWV0cnkudmVydGljZXMucHVzaChcbiAgICAgIG5ldyBUSFJFRS5WZWN0b3IzKHN0YXJ0LngsIHN0YXJ0LnksIDApLFxuICAgICAgbmV3IFRIUkVFLlZlY3RvcjMoZW5kLngsIGVuZC55LCAwKVxuICAgICk7XG4gICAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTGluZUJhc2ljTWF0ZXJpYWwoe1xuICAgICAgY29sb3I6IGNvbFxuICAgIH0pO1xuICAgIGNvbnN0IGwgPSBuZXcgVEhSRUUuTGluZShnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgIHRoaXMuc2NlbmUuYWRkKGwpO1xuICB9XG5cbiAgcG9seWdvbih2ZXJ0aWNlcywgY29sb3IsIHRleHR1cmUpIHtcbiAgICBsZXQgY29sID0gY29sb3I7XG4gICAgaWYgKGNvbCA9PT0gJ3VuZGVmaW5lZCcpIGNvbCA9IDB4ZmZmZmZmO1xuXG4gICAgY29uc3QgcG9seSA9IG5ldyBUSFJFRS5TaGFwZSgpO1xuICAgIHBvbHkubW92ZVRvKHZlcnRpY2VzWzBdLngsIHZlcnRpY2VzWzBdLnkpO1xuXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCB2ZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgcG9seS5saW5lVG8odmVydGljZXNbaV0ueCwgdmVydGljZXNbaV0ueSlcbiAgICB9XG5cbiAgICBwb2x5LmxpbmVUbyh2ZXJ0aWNlc1swXS54LCB2ZXJ0aWNlc1swXS55KTtcblxuICAgIGNvbnN0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLlNoYXBlR2VvbWV0cnkocG9seSk7XG5cbiAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLmNyZWF0ZU1lc2goZ2VvbWV0cnksIGNvbG9yLCB0ZXh0dXJlKSk7XG4gIH1cblxuICBjcmVhdGVNZXNoKGdlb21ldHJ5LCBjb2xvciwgaW1hZ2VVUkwpIHtcbiAgICBsZXQgY29sID0gY29sb3I7XG4gICAgaWYgKGNvbCA9PT0gJ3VuZGVmaW5lZCcpIGNvbCA9IDB4ZmZmZmZmO1xuICAgIGNvbnN0IG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHtcbiAgICAgIGNvbG9yOiBjb2wsXG4gICAgICAvL3dpcmVmcmFtZTogdHJ1ZVxuICAgIH0pO1xuXG4gICAgaWYgKGltYWdlVVJMKSB7XG4gICAgICBjb25zdCB0ZXh0dXJlTG9hZGVyID0gbmV3IFRIUkVFLlRleHR1cmVMb2FkZXIoKTtcblxuICAgICAgLy9sb2FkIHRleHR1cmUgYW5kIGFwcGx5IHRvIG1hdGVyaWFsIGluIGNhbGxiYWNrXG4gICAgICBjb25zdCB0ZXh0dXJlID0gdGV4dHVyZUxvYWRlci5sb2FkKGltYWdlVVJMLCAodGV4KSA9PiB7fSk7XG4gICAgICB0ZXh0dXJlLnJlcGVhdC5zZXQoMC4wNSwgMC4wNSk7XG4gICAgICBtYXRlcmlhbC5tYXAgPSB0ZXh0dXJlO1xuICAgICAgbWF0ZXJpYWwubWFwLndyYXBUID0gVEhSRUUuUmVwZWF0V3JhcHBpbmc7XG4gICAgICBtYXRlcmlhbC5tYXAud3JhcFMgPSBUSFJFRS5SZXBlYXRXcmFwcGluZztcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgfVxuXG4gIGF4ZXMoKSB7XG4gICAgY29uc3QgeHl6ID0gbmV3IFRIUkVFLkF4aXNIZWxwZXIoMjApO1xuICAgIHRoaXMuc2NlbmUuYWRkKHh5eik7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIHRoaXMucmVuZGVyKClcbiAgICB9KTtcblxuICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUsIHRoaXMuY2FtZXJhKTtcbiAgfVxuXG59XG4iXX0=
