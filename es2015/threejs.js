// * ***********************************************************************
// *
// *  THREE JS CLASS
// *
// *************************************************************************
export class ThreeJS {
  constructor() {

    window.addEventListener('load', (event) => {
      window.removeEventListener('load');
      this.init();
    }, false);

    window.addEventListener('resize', () => {
      //this.camera.aspect = window.innerWidth / window.innerHeight;
      //this.camera.updateProjectionMatrix();
      //this.renderer.setSize(window.innerWidth, window.innerHeight);

      this.reset();
    }, false);

  }

  init() {
    this.scene = new THREE.Scene();
    this.initCamera();

    this.initLighting();

    this.axes();

    this.initRenderer();
    //console.log(this.scene);
  }

  reset() {
    cancelAnimationFrame(this.id); // Stop the animation
    this.renderer.domElement.addEventListener('dblclick', null, false); //remove listener to render
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
    //const spotLight = new THREE.SpotLight(0xffffff);
    //spotLight.position.set(0, 0, 100);
    //this.scene.add(spotLight);
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

  //behind: true/false
  disk(centre, radius, color, behind) {
    let col = color;
    if (col === 'undefined') col = 0xffffff;

    const geometry = new THREE.CircleGeometry(radius, 100, 0, 2 * Math.PI);
    const circle = this.createMesh(geometry, col);
    circle.position.x = centre.x;
    circle.position.y = centre.y;
    if (!behind) {
      circle.position.z = 1;
    }

    this.scene.add(circle);
  }

  segment(circle, alpha, offset, color) {
    let col = color;
    if (col === 'undefined') col = 0xffffff;

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
      color: col
    });
    const s = new THREE.Line(geometry, material);

    this.scene.add(s);
  }

  line(start, end, color) {
    let col = color;
    if (col === 'undefined') col = 0xffffff;

    const geometry = new THREE.Geometry();

    geometry.vertices.push(
      new THREE.Vector3(start.x, start.y, 0),
      new THREE.Vector3(end.x, end.y, 0)
    );
    const material = new THREE.LineBasicMaterial({
      color: col
    });
    const l = new THREE.Line(geometry, material);
    this.scene.add(l);
  }

  createMesh(geometry, color, imageURL) {
    let col = color;
    if (col === 'undefined') col = 0xffffff;
    const material = new THREE.MeshBasicMaterial({
      color: col
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

  shape() {
    // create a basic shape
    var shape = new THREE.Shape();

    // startpoint
    shape.moveTo(0, 0);

    // straight line upwards
    shape.lineTo(0, 50);

    // the top of the figure, curve to the right
    shape.quadraticCurveTo(15, 25, 25, 30);

    shape.lineTo(0, 0);

    const geometry = new THREE.ShapeGeometry(shape);
    this.curve = this.createMesh(geometry, './images/textures/test.jpg');
    this.curve.position.y = -30;
    this.curve.position.z = -40;
    this.scene.add(this.curve);
  }

  axes() {
    const xyz = new THREE.AxisHelper(20);
    this.scene.add(xyz);
  }

  render() {
    requestAnimationFrame(() => {
      this.render()
    });
    //this.circle.rotation.x += 0.02;
    this.renderer.render(this.scene, this.camera);
  }

}
