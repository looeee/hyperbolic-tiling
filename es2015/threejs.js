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
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);

  }

  init() {
    this.scene = new THREE.Scene();
    this.camera();

    this.lighting();

    this.axes();
    this.shape();
    this.renderer();
  }

  camera() {
    this.camera = new THREE.PerspectiveCamera(75,
      window.innerWidth / window.innerHeight, 0.1, 1000);
    this.scene.add(this.camera);
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.lookAt(this.scene.position);

    this.camera.position.z = 10;
  }

  renderer() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(0x000000, 1.0);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.render();
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

  createMesh(geometry, imageURL) {
    let material = new THREE.MeshBasicMaterial({
      color: 0xff00ff
    });

    const textureLoader = new THREE.TextureLoader();

    //load texture and apply to material in callback
    let texture = textureLoader.load(imageURL, (tex) => {});
    texture.repeat.set(0.05,0.05);
    material.map = texture;
    material.map.wrapT = THREE.RepeatWrapping;
    material.map.wrapS = THREE.RepeatWrapping;

    //geometry = new THREE.BoxGeometry( 8, 8, 8 );
    console.log(geometry.faceVertexUvs);

    geometry.faceVertexUvs[0][0][0].x = 0.5;
    geometry.faceVertexUvs[0][0][0].y = 0.5;
    geometry.faceVertexUvs[0][0][1].x = 0.5;
    geometry.faceVertexUvs[0][0][1].y = 0.5;
    geometry.faceVertexUvs[0][0][2].x = 0.5;
    geometry.faceVertexUvs[0][0][2].y = 0.5;
    console.log(geometry.faceVertexUvs);


    return new THREE.Mesh(geometry, material);
  }

  lighting() {
    //const spotLight = new THREE.SpotLight(0xffffff);
    //spotLight.position.set(0, 0, 100);
    //this.scene.add(spotLight);
    const ambientLight = new THREE.AmbientLight(0xffffff);
    this.scene.add(ambientLight);
  }

  axes() {
    const xyz = new THREE.AxisHelper(20);
    this.scene.add(xyz);
  }

  render() {
    requestAnimationFrame(() => {
      this.render()
    });
    //this.curve.rotation.y += 0.02;
    this.renderer.render(this.scene, this.camera);
  }

}
