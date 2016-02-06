var babelHelpers = {};

babelHelpers.classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

babelHelpers.createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

babelHelpers;

// * ***********************************************************************
// *
// *   EUCLIDEAN FUNCTIONS
// *   a place to stash all the functions that are euclidean geometrical
// *   operations
// *   All functions are 2D unless otherwise specified!
// *
// *************************************************************************

//distance between two points
var distance = function distance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

//midpoint of the line segment connecting two points
var midpoint = function midpoint(p1, p2) {
  return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
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
var intersection = function intersection(p1, m1, p2, m2) {
  var c1 = undefined,
      c2 = undefined,
      x = undefined,
      y = undefined;
  if (toFixed(p1.y, 10) == 0) {
    x = p1.x;
    y = m2 * (p1.x - p2.x) + p2.y;
  } else if (toFixed(p2.y, 10) == 0) {
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

  return new Point(x, y);
};

//get the circle inverse of a point p with respect a circle radius r centre c
var inverse = function inverse(point, circle) {
  var c = circle.centre;
  var r = circle.radius;
  var alpha = r * r / (Math.pow(point.x - c.x, 2) + Math.pow(point.y - c.y, 2));
  return new Point(alpha * (point.x - c.x) + c.x, alpha * (point.y - c.y) + c.y);
};

//reflect p3 across the line defined by p1,p2
var lineReflection = function lineReflection(p1, p2, p3) {
  var m = slope(p1, p2);
  //reflection in y axis
  if (m > 999999 || m < -999999) {
    return new Point(p3.x, -p3.y);
  }
  //reflection in x axis
  else if (toFixed(m, 10) == 0) {
      return new Point(-p3.x, p3.y);
    }
    //reflection in arbitrary line
    else {
        var c = p1.y - m * p1.x;
        var d = (p3.x + (p3.y - c) * m) / (1 + m * m);
        var x = 2 * d - p3.x;
        var y = 2 * d * m - p3.y + 2 * c;
        return new Point(x, y);
      }
};

//calculate the radius and centre of the circle required to draw a line between
//two points in the hyperbolic plane defined by the disk (r, c)
var greatCircle = function greatCircle(p1, p2, circle) {
  var p1Inverse = inverse(p1, circle);
  var p2Inverse = inverse(p2, circle);

  var m = midpoint(p1, p1Inverse);
  var n = midpoint(p2, p2Inverse);

  var m1 = perpendicularSlope(m, p1Inverse);
  var m2 = perpendicularSlope(n, p2Inverse);

  //centre is the centrepoint of the circle out of which the arc is made
  var centre = intersection(m, m1, n, m2);
  var radius = distance(centre, p1);

  return new Circle(centre.x, centre.y, radius);
};

var circleLineIntersect = function circleLineIntersect(circle, p1, p2) {
  var cx = circle.centre.x;
  var cy = circle.centre.y;
  var r = circle.radius;

  var d = distance(p1, p2);
  //unit vector p1 p2
  var dx = (p2.x - p1.x) / d;
  var dy = (p2.y - p1.y) / d;

  //point on line closest to circle centre
  var t = dx * (cx - p1.x) + dy * (cy - p1.y);
  var p = new Point(t * dx + p1.x, t * dy + p1.y);

  //distance from this point to centre
  var d2 = distance(p, circle.centre);

  //line intersects circle
  if (d2 < r) {
    var dt = Math.sqrt(r * r - d2 * d2);
    //point 1
    var q1 = new Point((t - dt) * dx + p1.x, (t - dt) * dy + p1.y);
    //point 2
    var q2 = new Point((t + dt) * dx + p1.x, (t + dt) * dy + p1.y);

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
var centralAngle = function centralAngle(p1, p2, r) {
  //round off error can result in this being very slightly greater than 1
  var temp = 0.5 * distance(p1, p2) / r;
  temp = toFixed(temp, 10);
  var res = 2 * Math.asin(temp);
  if (isNaN(res)) res = 0;
  return res;
};

//does the line connecting p1, p2 go through the point (0,0)?
//needs to take into account roundoff errors so returns true if
//test is close to 0
var throughOrigin = function throughOrigin(p1, p2) {
  if (toFixed(p1.x, 10) == 0 && toFixed(p2.x, 10) === 0) {
    //vertical line through centre
    return true;
  }
  var test = (-p1.x * p2.y + p1.x * p1.y) / (p2.x - p1.x) + p1.y;

  if (toFixed(test, 10) == 0) return true;else return false;
};

//find a point at a distance d along the circumference of
//a circle of radius r, centre c from a point also
//on the circumference
var spacedPointOnArc = function spacedPointOnArc(circle, point, spacing) {
  var cosTheta = -(spacing * spacing / (2 * circle.radius * circle.radius) - 1);
  var sinThetaPos = Math.sqrt(1 - Math.pow(cosTheta, 2));
  var sinThetaNeg = -sinThetaPos;

  var xPos = circle.centre.x + cosTheta * (point.x - circle.centre.x) - sinThetaPos * (point.y - circle.centre.y);
  var xNeg = circle.centre.x + cosTheta * (point.x - circle.centre.x) - sinThetaNeg * (point.y - circle.centre.y);
  var yPos = circle.centre.y + sinThetaPos * (point.x - circle.centre.x) + cosTheta * (point.y - circle.centre.y);
  var yNeg = circle.centre.y + sinThetaNeg * (point.x - circle.centre.x) + cosTheta * (point.y - circle.centre.y);

  return {
    p1: new Point(xPos, yPos),
    p2: new Point(xNeg, yNeg)
  };
};

var randomInt = function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

//.toFixed returns a string for some no doubt very good reason.
//Change it back to a float
var toFixed = function toFixed(number, places) {
  return parseFloat(number.toFixed(places));
};

// * ***********************************************************************
// *
// *   POINT CLASS
// *   2d point class
// *************************************************************************

var Point = function () {
  function Point(x, y) {
    babelHelpers.classCallCheck(this, Point);

    if (toFixed(x, 10) == 0) {
      x = 0;
    }
    if (toFixed(y, 10) == 0) {
      y = 0;
    }
    this.x = x;
    this.y = y;
  }

  babelHelpers.createClass(Point, [{
    key: 'toFixed',
    value: function toFixed$$(places) {
      this.x = toFixed(this.x, places);
      this.y = toFixed(this.y, places);
    }

    //compare two points taking rounding errors into account

  }, {
    key: 'compare',
    value: function compare(p2) {
      if (typeof p2 === 'undefined') {
        console.warn('Warning: point not defined.');
        return false;
      }
      var t1 = this.toFixed(10);
      var t2 = p2.toFixed(10);

      if (p1.x === p2.x && p1.y === p2.y) return true;else return false;
    }

    //map from disk of currentRadius to unit disk

  }, {
    key: 'toUnitDisk',
    value: function toUnitDisk(currentRadius) {
      return new Point(this.x / currentRadius, this.y / currentRadius);
    }

    //map from unit disk to disk of newRadius

  }, {
    key: 'fromUnitDisk',
    value: function fromUnitDisk(newRadius) {
      return new Point(this.x * newRadius, this.y * newRadius);
    }
  }]);
  return Point;
}();

// * ***********************************************************************
// *
// *   CIRCLE CLASS
// *
// *************************************************************************

var Circle = function Circle(centreX, centreY, radius) {
  babelHelpers.classCallCheck(this, Circle);

  if (toFixed(radius) == 0) {
    radius = 0;
  }
  this.centre = new Point(centreX, centreY);
  this.radius = radius;
};

//calculate greatCircle, startAngle and endAngle for hyperbolic arc
//TODO deal with case of staight lines through centre
var arc = function arc(p1, p2, circle) {
  if (throughOrigin(p1, p2)) {
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
  var c = greatCircle(p1, p2, circle);
  var oy = toFixed(c.centre.y, 10);
  var ox = toFixed(c.centre.x, 10);

  //point at 0 radians on c
  var p3 = new Point(ox + c.radius, oy);

  //calculate the position of each point in the circle
  alpha1 = centralAngle(p3, p1, c.radius);
  alpha2 = centralAngle(p3, p2, c.radius);

  //for comparison to avoid round off errors
  var p1X = toFixed(p1.x, 10);
  var p1Y = toFixed(p1.y, 10);
  var p2X = toFixed(p2.x, 10);
  var p2Y = toFixed(p2.y, 10);

  //console.log('p2x: ', p2X,'ox: ', ox);
  //console.log('p1y: ', p1Y, 'p2y: ', p2Y,'ox: ', ox);

  alpha1 = p1Y < oy ? 2 * Math.PI - alpha1 : alpha1;
  alpha2 = p2Y < oy ? 2 * Math.PI - alpha2 : alpha2;

  //console.log(alpha1, alpha2);

  //case where p1 above and p2 below or on the line c.centre -> p3
  if (!(p1X <= ox && p2X <= ox) && p1Y <= oy && p2Y >= oy) {
    //console.log('obj');
    startAngle = alpha1;
    endAngle = alpha2;
  }
  //case where p2 above and p1 below or on the line c.centre -> p3
  else if (p1X >= ox && p2X >= ox && p1Y >= oy && p2Y <= oy) {
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
  //console.log(startAngle, endAngle, clockwise);
  return {
    circle: c,
    startAngle: startAngle,
    endAngle: endAngle,
    clockwise: clockwise,
    straightLine: false
  };
};

//reflect a set of points across a hyperbolic arc
//TODO add case where reflection is across straight line
var reflect = function reflect(pointsArray, p1, p2, circle) {
  var l = pointsArray.length;
  var a = arc(p1, p2, circle);
  var newPoints = [];

  if (!a.straightLine) {
    for (var i = 0; i < l; i++) {
      newPoints.push(inverse(pointsArray[i], a.circle));
    }
  } else {
    for (var i = 0; i < l; i++) {
      newPoints.push(lineReflection(p1, p2, pointsArray[i]));
    }
  }
  return newPoints;
};

var rotateAboutOrigin = function rotateAboutOrigin(point2D, angle) {
  return new Point(Math.cos(angle) * point2D.x - Math.sin(angle) * point2D.y, Math.sin(angle) * point2D.x + Math.cos(angle) * point2D.y);
};

var rotatePgonAboutOrigin = function rotatePgonAboutOrigin(points2DArray, angle) {
  var l = points2DArray.length;
  var rotatedPoints2DArray = [];
  for (var i = 0; i < l; i++) {
    var point = rotateAboutOrigin(points2DArray[i], angle);
    rotatedPoints2DArray.push(point);
  }
  return rotatedPoints2DArray;
};

//NOTE will give a warning:  Too many active WebGL contexts
//after resizing 16 times. This is a bug in threejs and can be safely ignored.
// * ***********************************************************************
// *
// *  THREE JS CLASS
// *
// *************************************************************************
var ThreeJS = function () {
  function ThreeJS() {
    var _this = this;

    babelHelpers.classCallCheck(this, ThreeJS);

    window.addEventListener('load', function (event) {
      //window.removeEventListener('load');
      _this.init();
    }, false);

    window.addEventListener('resize', function () {
      _this.reset();
    }, false);
  }

  babelHelpers.createClass(ThreeJS, [{
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
  }, {
    key: 'disk',
    value: function disk(centre, radius, color) {
      if (color === undefined) color = 0xffffff;

      var geometry = new THREE.CircleGeometry(radius, 100, 0, 2 * Math.PI);
      var circle = this.createMesh(geometry, color);
      circle.position.x = centre.x;
      circle.position.y = centre.y;

      this.scene.add(circle);
    }
  }, {
    key: 'segment',
    value: function segment(circle, alpha, offset, color) {
      if (color === undefined) color = 0xffffff;

      var curve = new THREE.EllipseCurve(circle.centre.x, circle.centre.y, // ax, aY
      circle.radius, circle.radius, // xRadius, yRadius
      alpha, offset, // aStartAngle, aEndAngle
      false // aClockwise
      );

      var points = curve.getSpacedPoints(100);

      var path = new THREE.Path();
      var geometry = path.createGeometry(points);

      var material = new THREE.LineBasicMaterial({
        color: color
      });
      var s = new THREE.Line(geometry, material);

      this.scene.add(s);
    }
  }, {
    key: 'line',
    value: function line(start, end, color) {
      if (color === undefined) color = 0xffffff;

      var geometry = new THREE.Geometry();

      geometry.vertices.push(new THREE.Vector3(start.x, start.y, 0), new THREE.Vector3(end.x, end.y, 0));
      var material = new THREE.LineBasicMaterial({
        color: color
      });
      var l = new THREE.Line(geometry, material);
      this.scene.add(l);
    }
  }, {
    key: 'polygon',
    value: function polygon(vertices, color, texture, wireframe) {
      if (color === undefined) color = 0xffffff;

      var poly = new THREE.Shape();
      poly.moveTo(vertices[0].x, vertices[0].y);

      for (var i = 1; i < vertices.length; i++) {
        poly.lineTo(vertices[i].x, vertices[i].y);
      }

      poly.lineTo(vertices[0].x, vertices[0].y);

      var geometry = new THREE.ShapeGeometry(poly);

      this.scene.add(this.createMesh(geometry, color, texture, wireframe));
    }
  }, {
    key: 'createMesh',
    value: function createMesh(geometry, color, imageURL, wireframe) {
      if (wireframe === undefined) wireframe = false;
      if (color === undefined) color = 0xffffff;

      var material = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: wireframe
      });

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

// * ***********************************************************************
// *
// *   DISK CLASS
// *   Poincare Disk representation of the hyperbolic plane
// *   Contains any functions used to draw to the disk
// *   (Currently using three js as drawing class)
// *************************************************************************
var Disk = function () {
  function Disk() {
    var _this = this;

    babelHelpers.classCallCheck(this, Disk);

    this.draw = new ThreeJS();

    window.addEventListener('load', function (event) {
      //window.removeEventListener('load');
      _this.init();
    }, false);

    window.addEventListener('resize', function () {
      _this.init();
    }, false);
  }

  babelHelpers.createClass(Disk, [{
    key: 'init',
    value: function init() {
      this.centre = new Point(0, 0);

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
    value: function testing() {}

    //draw the disk background

  }, {
    key: 'drawDisk',
    value: function drawDisk() {
      this.draw.disk(this.centre, this.radius, 0x000000);
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
      //const c = E.greatCircle(p1, p2, this.radius, this.centre);
      //const points = E.circleIntersect(this.centre, c.centre, this.radius, c.radius);

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
      var arc$$ = arc(p1, p2, this.circle);

      if (arc$$.straightLine) {
        this.draw.line(p1, p2, col);
      } else {
        this.draw.segment(arc$$.circle, arc$$.startAngle, arc$$.endAngle, colour);
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
    value: function polygon(vertices, color, texture, wireframe) {
      var points = [];
      var spacing = 5;
      var l = vertices.length;
      for (var i = 0; i < l; i++) {
        var p = undefined;
        var arc$$ = arc(vertices[i], vertices[(i + 1) % l], this.circle);

        //line not through the origin (hyperbolic arc)
        if (!arc$$.straightLine) {

          if (arc$$.clockwise) {
            p = spacedPointOnArc(arc$$.circle, vertices[i], spacing).p2;
          } else {
            p = spacedPointOnArc(arc$$.circle, vertices[i], spacing).p1;
          }
          points.push(p);

          while (distance(p, vertices[(i + 1) % l]) > spacing) {

            if (arc$$.clockwise) {
              p = spacedPointOnArc(arc$$.circle, p, spacing).p2;
            } else {
              p = spacedPointOnArc(arc$$.circle, p, spacing).p1;
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

      this.draw.polygon(points, color, texture, wireframe);
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

          if (distance(point, this.centre) > r) {
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

// * ***********************************************************************
// *    TESSELATION CLASS
// *    Creates a regular Tesselation of the Poincare Disk
// *    q: number of p-gons meeting at each vertex
// *    p: number of sides of p-gon
// *    using the techniques created by Coxeter and Dunham
// *
// *************************************************************************
var RegularTesselation = function () {
  function RegularTesselation(p, q, rotation, colour, maxLayers) {
    var _this = this;

    babelHelpers.classCallCheck(this, RegularTesselation);

    //console.log(p,q);
    this.disk = new Disk();

    this.p = p;
    this.q = q;
    this.colour = colour || 'black';
    this.rotation = rotation || 0;
    this.maxLayers = maxLayers || 5;

    if (this.checkParams()) {
      return false;
    }

    window.addEventListener('load', function (event) {
      //window.removeEventListener('load');
      _this.init();
    }, false);

    window.addEventListener('resize', function () {
      _this.init();
    }, false);
  }

  babelHelpers.createClass(RegularTesselation, [{
    key: 'init',
    value: function init() {
      this.fr = this.fundamentalRegion();
      this.testing();
    }
  }, {
    key: 'testing',
    value: function testing() {
      var wireframe = false;
      wireframe = true;
      //let p1 = new Point(160.66832505298834, 278.2857021587673);
      //let p2 = new Point(94.98196390075151, 333.4031035749877);

      //this.disk.drawArc(p1,p3,1546645647)
      //this.disk.drawArc(p2,p3,1546645647)

      var p1 = new Point(100, -100);
      var p2 = new Point(100, 250);
      var p3 = new Point(-150, -100);

      /*
      this.disk.point(p1, 5);
      this.disk.point(p2, 5);
      this.disk.point(p3, 5);
       this.disk.drawArc(p1,p2,1546645647)
      this.disk.drawArc(p1,p3,1546645647)
      this.disk.drawArc(p3,p2,1546645647)
      */

      //this.disk.polygon([p1,p2,p3], E.randomInt(10000, 14777215));

      var a1 = arc(p1, p2, this.disk.circle);

      //let a2 = H.arcV2(p1, p2, this.disk.circle);
      //console.log(a1,a2);
      //this.disk.drawArc(p1,p2,1546645647)

      //this.disk.polygon(this.fr, E.randomInt(10000, 14777215), '', wireframe);
      var poly2 = reflect(this.fr, this.fr[1], this.fr[2], this.disk.circle);
      //this.disk.polygon(poly2, E.randomInt(10000, 14777215));

      var poly3 = reflect(poly2, poly2[0], poly2[1], this.disk.circle);
      //this.disk.polygon(poly3, E.randomInt(10000, 14777215), '', wireframe);

      var poly4 = reflect(poly3, poly3[2], poly3[0], this.disk.circle);
      //this.disk.polygon(poly4, E.randomInt(10000, 14777215), '', wireframe);

      var poly5 = reflect(poly4, poly4[1], poly4[0], this.disk.circle);
      //this.disk.polygon(poly5, E.randomInt(10000, 14777215), '', wireframe);

      var poly6 = reflect(poly3, poly3[2], poly3[1], this.disk.circle);
      //this.disk.polygon(poly6, E.randomInt(10000, 14777215), '', wireframe);

      var poly7 = reflect(poly6, poly6[0], poly6[2], this.disk.circle);
      //this.disk.polygon(poly7, E.randomInt(10000, 14777215), '', wireframe);

      var poly8 = reflect(poly6, poly6[0], poly6[1], this.disk.circle);
      //this.disk.polygon(poly8, E.randomInt(10000, 14777215), '', wireframe);

      var poly9 = reflect(poly7, poly7[0], poly7[1], this.disk.circle);
      //this.disk.polygon(poly9, E.randomInt(10000, 14777215), '', wireframe);

      var num = this.p * 2;
      for (var i = 0; i < num; i++) {
        var poly = rotatePgonAboutOrigin(this.fr, 2 * Math.PI / num * (i + 1));
        this.disk.polygon(poly, randomInt(10000, 14777215), '', wireframe);
        poly = rotatePgonAboutOrigin(poly2, 2 * Math.PI / num * (i + 1));
        this.disk.polygon(poly, randomInt(10000, 14777215), '', wireframe);
        poly = rotatePgonAboutOrigin(poly3, 2 * Math.PI / num * (i + 1));
        this.disk.polygon(poly, randomInt(10000, 14777215), '', wireframe);
        poly = rotatePgonAboutOrigin(poly4, 2 * Math.PI / num * (i + 1));
        this.disk.polygon(poly, randomInt(10000, 14777215), '', wireframe);
        poly = rotatePgonAboutOrigin(poly5, 2 * Math.PI / num * (i + 1));
        this.disk.polygon(poly, randomInt(10000, 14777215), '', wireframe);
        poly = rotatePgonAboutOrigin(poly6, 2 * Math.PI / num * (i + 1));
        this.disk.polygon(poly, randomInt(10000, 14777215), '', wireframe);
        poly = rotatePgonAboutOrigin(poly7, 2 * Math.PI / num * (i + 1));
        this.disk.polygon(poly, randomInt(10000, 14777215), '', wireframe);
        poly = rotatePgonAboutOrigin(poly8, 2 * Math.PI / num * (i + 1));
        //if(i===3){
        //console.table(poly)
        this.disk.polygon(poly, randomInt(10000, 14777215), '', wireframe);
        //}
        poly = rotatePgonAboutOrigin(poly9, 2 * Math.PI / num * (i + 1));
        this.disk.polygon(poly, randomInt(10000, 14777215), '', wireframe);
      }
    }

    //calculate first point of fundamental polygon using Coxeter's method

  }, {
    key: 'fundamentalRegion',
    value: function fundamentalRegion() {
      var radius = this.disk.circle.radius;
      var s = Math.sin(Math.PI / this.p);
      var t = Math.cos(Math.PI / this.q);
      //multiply these by the disks radius (Coxeter used unit disk);
      var r = 1 / Math.sqrt(t * t / (s * s) - 1) * radius;
      var d = 1 / Math.sqrt(1 - s * s / (t * t)) * radius;
      var b = new Point(radius * Math.cos(Math.PI / this.p), -radius * Math.sin(Math.PI / this.p));

      var circle = new Circle(d, 0, r);

      //there will be two points of intersection, of which we want the first
      var p1 = circleLineIntersect(circle, this.disk.centre, b).p1;

      var p2 = new Point(d - r, 0);

      var points = [this.disk.centre, p1, p2];

      return points;
    }

    //The tesselation requires that (p-2)(q-2) > 4 to work (otherwise it is
    // either an elliptical or euclidean tesselation);
    //For now also require p,q > 3, as these are special cases

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

// * ***********************************************************************
// *
// *   SETUP
// *
// *************************************************************************

var tesselation = new RegularTesselation(randomInt(4, 12), randomInt(4, 12));
//const tesselation = new RegularTesselation(9, 4);