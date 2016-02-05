//NOTE will give a warning:  Too many active WebGL contexts
//after resizing 16 times. This is a bug in threejs and can be safely ignored.
// * ***********************************************************************
// *
// *  THREE JS CLASS
// *
// *************************************************************************
export class ThreeJS {
  constructor() {

    window.addEventListener('load', (event) => {
      //window.removeEventListener('load');
      this.init();
    }, false);

    window.addEventListener('resize', () => {
      this.reset();
    }, false);

  }

  init() {
    this.scene = new THREE.Scene();
    this.initCamera();

    this.initLighting();

    this.axes();

    this.initRenderer();
  }

  reset() {
    cancelAnimationFrame(this.id); // Stop the animation
    this.scene = null;
    this.projector = null;
    this.camera = null;
    this.controls = null;

    const element = document.getElementsByTagName('canvas');
    for (let index = element.length - 1; index >= 0; index--) {
      element[index].parentNode.removeChild(element[index]);
    }
    this.init();
  }

  initCamera() {
    this.camera = new THREE.OrthographicCamera(window.innerWidth / -2,
      window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -2, 1);
    this.scene.add(this.camera);
    this.camera.position.x = 0;
    this.camera.position.y = 0;

    this.camera.position.z = 1;
  }

  initLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff);
    this.scene.add(ambientLight);
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    this.renderer.setClearColor(0xffffff, 1.0);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.render();
  }

  disk(centre, radius, color) {
    if (color === undefined) color = 0xffffff;

    const geometry = new THREE.CircleGeometry(radius, 100, 0, 2 * Math.PI);
    const circle = this.createMesh(geometry, color);
    circle.position.x = centre.x;
    circle.position.y = centre.y;

    this.scene.add(circle);
  }

  segment(circle, alpha, offset, color) {
    if (color === undefined) color = 0xffffff;

    const curve = new THREE.EllipseCurve(
      circle.centre.x, circle.centre.y, // ax, aY
      circle.radius, circle.radius, // xRadius, yRadius
      alpha, offset, // aStartAngle, aEndAngle
      false // aClockwise
    );

    const points = curve.getSpacedPoints(100);

    const path = new THREE.Path();
    const geometry = path.createGeometry(points);

    const material = new THREE.LineBasicMaterial({
      color: color
    });
    const s = new THREE.Line(geometry, material);

    this.scene.add(s);
  }

  line(start, end, color) {
    if (color === undefined) color = 0xffffff;

    const geometry = new THREE.Geometry();

    geometry.vertices.push(
      new THREE.Vector3(start.x, start.y, 0),
      new THREE.Vector3(end.x, end.y, 0)
    );
    const material = new THREE.LineBasicMaterial({
      color: color
    });
    const l = new THREE.Line(geometry, material);
    this.scene.add(l);
  }

  polygon(vertices, color, texture, wireframe) {
    if (color === undefined) color = 0xffffff;

    const poly = new THREE.Shape();
    poly.moveTo(vertices[0].x, vertices[0].y);

    for (let i = 1; i < vertices.length; i++) {
      poly.lineTo(vertices[i].x, vertices[i].y)
    }

    poly.lineTo(vertices[0].x, vertices[0].y);

    const geometry = new THREE.ShapeGeometry(poly);

    this.scene.add(this.createMesh(geometry, color, texture, wireframe));
  }

  createMesh(geometry, color, imageURL, wireframe) {
    if(wireframe === undefined) wireframe = false;
    if (color === undefined) color = 0xffffff;

    const material = new THREE.MeshBasicMaterial({
      color: color,
      wireframe: wireframe
    });

    if (imageURL) {
      const textureLoader = new THREE.TextureLoader();

      //load texture and apply to material in callback
      const texture = textureLoader.load(imageURL, (tex) => {});
      texture.repeat.set(0.05, 0.05);
      material.map = texture;
      material.map.wrapT = THREE.RepeatWrapping;
      material.map.wrapS = THREE.RepeatWrapping;
    }

    return new THREE.Mesh(geometry, material);
  }

  axes() {
    const xyz = new THREE.AxisHelper(20);
    this.scene.add(xyz);
  }

  render() {
    requestAnimationFrame(() => {
      this.render()
    });

    this.renderer.render(this.scene, this.camera);
  }

}
