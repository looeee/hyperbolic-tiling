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

// * ***********************************************************************
// *
// *   HYPERBOLIC FUNCTIONS
// *   a place to stash all the functions that are hyperbolic gemeometrical
// *   operations
// *
// *************************************************************************

//are the angles alpha, beta in clockwise order on unit disk?
var clockwise = function clockwise(alpha, beta) {
  var cw = true;
  var a = beta > 3 * Math.PI / 2 && alpha < Math.PI / 2;
  var b = beta - alpha > Math.PI;
  var c = alpha > beta && !(alpha - beta > Math.PI);
  if (a || b || c) {
    cw = false;
  }
  return cw;
};

//Similar to the method developed by Ajit Datar for his HyperArt program
//TODO test which arc method is fastest
var arc = function arc(p1, p2, circle) {
  var startAngle = undefined,
      endAngle = undefined;
  if (throughOrigin(p1, p2)) {
    return {
      circle: circle,
      startAngle: 0,
      endAngle: 0,
      straightLine: true
    };
  }
  var q1 = p1.toUnitDisk(circle.radius);
  var q2 = p2.toUnitDisk(circle.radius);

  var wp1 = poincareToWeierstrass(q1);
  var wp2 = poincareToWeierstrass(q2);

  var wcp = weierstrassCrossProduct(wp1, wp2);

  var arcCentre = new Point(wcp.x / wcp.z, wcp.y / wcp.z);

  //calculate centre of arcCircle relative to unit disk
  var cx = wcp.x / wcp.z;
  var cy = wcp.y / wcp.z;

  //translate points to origin before calculating arctan
  q1.x = q1.x - arcCentre.x;
  q1.y = q1.y - arcCentre.y;
  q2.x = q2.x - arcCentre.x;
  q2.y = q2.y - arcCentre.y;

  var r = Math.sqrt(q1.x * q1.x + q1.y * q1.y);
  var arcCircle = new Circle(arcCentre.x * circle.radius, arcCentre.y * circle.radius, r * circle.radius);

  var alpha = Math.atan2(q1.y, q1.x);

  var beta = Math.atan2(q2.y, q2.x);

  //angles are in (-pi, pi), transform to (0,2pi)
  alpha = alpha < 0 ? 2 * Math.PI + alpha : alpha;
  beta = beta < 0 ? 2 * Math.PI + beta : beta;

  /*
  //points are above and below the line (0,0)->(0,1) on unit disk
  //clockwise order
  if(alpha > 3*Math.PI/2 && beta < Math.PI/2){
    startAngle = alpha;
    endAngle = beta;
  }
  //points are above and below the line (0,0)->(0,1) on unit disk
  //anticlockwise order
  else if(beta > 3*Math.PI/2 && alpha < Math.PI/2){
    startAngle = beta;
    endAngle = alpha;
  }
  //other case where we are drawing the wrong way around the circle
  else if(beta - alpha > Math.PI){
    startAngle = beta;
    endAngle = alpha;
  }
  else if(alpha - beta > Math.PI){
    startAngle = alpha;
    endAngle = beta;
  }
  else if(alpha > beta){
    startAngle = beta;
    endAngle = alpha;
  }
  else{
    startAngle = alpha;
    endAngle = beta;
  }
  */
  if (clockwise(alpha, beta)) {
    startAngle = alpha;
    endAngle = beta;
  } else {
    startAngle = beta;
    endAngle = alpha;
  }

  return {
    circle: arcCircle,
    startAngle: startAngle,
    endAngle: endAngle,
    straightLine: false
  };
};

var poincareToWeierstrass = function poincareToWeierstrass(point2D) {
  var factor = 1 / (1 - point2D.x * point2D.x - point2D.y * point2D.y);
  return {
    x: 2 * factor * point2D.x,
    y: 2 * factor * point2D.y,
    z: factor * (1 + point2D.x * point2D.x + point2D.y * point2D.y)
  };
};

var weierstrassCrossProduct = function weierstrassCrossProduct(point3D_1, point3D_2) {
  if (point3D_1.z === 'undefined' || point3D_2.z === 'undefined') {
    console.error('weierstrassCrossProduct: 3D points required');
  }
  var r = {
    x: point3D_1.y * point3D_2.z - point3D_1.z * point3D_2.y,
    y: point3D_1.z * point3D_2.x - point3D_1.x * point3D_2.z,
    z: -point3D_1.x * point3D_2.y + point3D_1.y * point3D_2.x
  };

  var norm = Math.sqrt(r.x * r.x + r.y * r.y - r.z * r.z);
  if (toFixed(norm, 10) == 0) {
    console.error('weierstrassCrossProduct: division by zero error');
  }
  r.x = r.x / norm;
  r.y = r.y / norm;
  r.z = r.z / norm;
  return r;
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

          //if (arc.clockwise) {
          p = spacedPointOnArc(arc$$.circle, vertices[i], spacing).p2;
          //} else {
          //p = E.spacedPointOnArc(arc.circle, vertices[i], spacing).p1;
          //}
          points.push(p);

          while (distance(p, vertices[(i + 1) % l]) > spacing) {

            //if (arc.clockwise) {
            //p = E.spacedPointOnArc(arc.circle, p, spacing).p2;
            //} else {
            p = spacedPointOnArc(arc$$.circle, p, spacing).p2;
            //}

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

    console.log(p, q);
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

      var p1 = new Point(220, 100);
      var p2 = new Point(-220, -250);
      var p3 = new Point(150, -250);

      this.disk.point(p1, 5, 0x008bf9);
      this.disk.point(p2, 5, 0x31f700);
      this.disk.point(p3, 5, 0xff0033);

      //this.disk.drawArc(p1,p2,0x008bf9)
      //this.disk.drawArc(p1,p3,0x31f700)
      //this.disk.drawArc(p3,p2,0xff0033)

      this.disk.polygonOutline([p1, p2, p3], randomInt(10000, 14777215));
      //this.disk.polygon([p1,p2,p3], E.randomInt(10000, 14777215));

      /*
      //this.disk.polygon(this.fr, E.randomInt(10000, 14777215), '', wireframe);
      const poly2 = H.reflect(this.fr, this.fr[2], this.fr[1], this.disk.circle);
      //this.disk.polygon(poly2, E.randomInt(10000, 14777215));
       const poly3 = H.reflect(poly2, poly2[0], poly2[1], this.disk.circle);
      //this.disk.polygon(poly3, E.randomInt(10000, 14777215), '', wireframe);
       const poly4 = H.reflect(poly3, poly3[0], poly3[2], this.disk.circle);
      //this.disk.polygon(poly4, E.randomInt(10000, 14777215), '', wireframe);
       const poly5 = H.reflect(poly4, poly4[0], poly4[1], this.disk.circle);
      //this.disk.polygon(poly5, E.randomInt(10000, 14777215), '', wireframe);
       const poly6 = H.reflect(poly5, poly3[0], poly3[2], this.disk.circle);
      //this.disk.polygon(poly6, E.randomInt(10000, 14777215), '', wireframe);
       const poly7 = H.reflect(poly6, poly6[0], poly6[1], this.disk.circle);
      //this.disk.polygon(poly7, E.randomInt(10000, 14777215), '', wireframe);
       const poly8 = H.reflect(poly7, poly6[0], poly6[2], this.disk.circle);
      //this.disk.polygon(poly8, E.randomInt(10000, 14777215), '', wireframe);
       const poly9 = H.reflect(poly8, poly7[0], poly7[1], this.disk.circle);
      //this.disk.polygon(poly9, E.randomInt(10000, 14777215), '', wireframe);
       let num = this.p*2;
      for(let i =0; i < num; i++){
        let poly = H.rotatePgonAboutOrigin(this.fr, (2*Math.PI/num)*(i+1));
        this.disk.polygon(poly, E.randomInt(10000, 14777215), '', wireframe);
        poly = H.rotatePgonAboutOrigin(poly2, (2*Math.PI/num)*(i+1));
        this.disk.polygonOutline(poly, E.randomInt(10000, 14777215), '', wireframe);
        poly = H.rotatePgonAboutOrigin(poly3, (2*Math.PI/num)*(i+1));
        this.disk.polygonOutline(poly, E.randomInt(10000, 14777215), '', wireframe);
        poly = H.rotatePgonAboutOrigin(poly4, (2*Math.PI/num)*(i+1));
        this.disk.polygonOutline(poly, E.randomInt(10000, 14777215), '', wireframe);
        poly = H.rotatePgonAboutOrigin(poly5, (2*Math.PI/num)*(i+1));
        this.disk.polygonOutline(poly, E.randomInt(10000, 14777215), '', wireframe);
        poly = H.rotatePgonAboutOrigin(poly6, (2*Math.PI/num)*(i+1));
        this.disk.polygonOutline(poly, E.randomInt(10000, 14777215), '', wireframe);
        poly = H.rotatePgonAboutOrigin(poly7, (2*Math.PI/num)*(i+1));
        this.disk.polygonOutline(poly, E.randomInt(10000, 14777215), '', wireframe);
        poly = H.rotatePgonAboutOrigin(poly8, (2*Math.PI/num)*(i+1));
        //if(i===3){
          //console.table(poly)
        this.disk.polygonOutline(poly, E.randomInt(10000, 14777215), '', wireframe);
        //}
        poly = H.rotatePgonAboutOrigin(poly9, (2*Math.PI/num)*(i+1));
        this.disk.polygonOutline(poly, E.randomInt(10000, 14777215), '', wireframe);
      }
      */
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
//const tesselation = new RegularTesselation(11, 9);