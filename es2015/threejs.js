// * ***********************************************************************
// *
// *  THREE JS CLASS
// *
// *************************************************************************
//TODO: after resizing a few times the scene stops drawing - possible memory
//not being freed in clearScene?
//TODO add functions to save image to disk/screen for download
export class ThreeJS {
  constructor() {
    this.init();
  }

  init() {
    if (this.scene === undefined) this.scene = new THREE.Scene();
    this.initCamera();

    this.initLighting();

    this.initRenderer();
  }

  reset() {
    cancelAnimationFrame(this.id); // Stop the animation
    this.clearScene();
    this.projector = null;
    this.camera = null;
    this.init();
  }

  clearScene() {
    for(let i = this.scene.children.length - 1; i >= 0; i--) {
      //this.scene.children[i].material.map.dispose();
      //this.scene.children[i].material.dispose();
      //this.scene.children[i].geometry.dispose();
      //this.scene.children[i] = null;
      this.scene.remove(this.scene.children[i]);
    }
  }

  initCamera() {
    this.camera = new THREE.OrthographicCamera(window.innerWidth / -2,
      window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -2, 1);
    this.scene.add(this.camera);
  }

  initLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff);
    this.scene.add(ambientLight);
  }

  initRenderer() {
    if (this.renderer === undefined) {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        preserveDrawingBuffer: true
      });
      this.renderer.setClearColor(0xffffff, 1.0);
      document.body.appendChild(this.renderer.domElement);
    }

    this.renderer.setSize(window.innerWidth, window.innerHeight);

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

  segment(circle, startAngle, endAngle, color) {
    if (color === undefined) color = 0xffffff;

    const curve = new THREE.EllipseCurve(
      circle.centre.x, circle.centre.y, // ax, aY
      circle.radius, circle.radius, // xRadius, yRadius
      startAngle, endAngle,
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

  polygon(vertices, centre, color, texture, wireframe) {
    if (color === undefined) color = 0xffffff;
    const l = vertices.length;
    /*
    const poly = new THREE.Shape();

    poly.moveTo(vertices[0].x, vertices[0].y);
    for(let i = 0; i < l; i++) {
      //poly.moveTo(vertices[i].x, vertices[i].y);
      //poly.lineTo(centre.x, centre.y);
      //poly.moveTo(vertices[i].x, vertices[i].y);
      poly.lineTo(vertices[(i + 1) % l].x, vertices[(i + 1) % l].y);
    }

    let geometry = new THREE.ShapeGeometry(poly);
    */
    const geometry = new THREE.Geometry();

    //vertex 0 = polygon barycentre
    geometry.vertices.push(new THREE.Vector3(centre.x, centre.y, 0));

    //push first vertex to vertices array
    //This means that when the next vertex is pushed in the loop
    //we can also create the first face triangle
    geometry.vertices.push(new THREE.Vector3(vertices[0].x, vertices[0].y, 0));

    //each vertex added creates a new triangle, use this to create a new face
    for (let i = 1; i < l; i++) {
      geometry.vertices.push(new THREE.Vector3(vertices[i].x, vertices[i].y, 0));
      geometry.faces.push(new THREE.Face3(0, i, i + 1));
    }

    //push the final face
    geometry.faces.push(new THREE.Face3(0, l, 1));
    this.scene.add(this.createMesh(geometry, color, texture, wireframe));
  }

  //TODO learn how UVs work then write this function
  setUvs(geometry) {
    const uvs = geometry.faceVertexUvs[0];
    for (let i = 0; i < uvs.length; i++) {
      const uv = uvs[i];
      for (var j = 0; j < 3; j++) {
        console.log(uv[j]);
      }
    }
  }

  //NOTE: some polygons are inverted due to vertex order,
  //solved this but this might cause problems with textures
  createMesh(geometry, color, imageURL, wireframe) {
    if (wireframe === undefined) wireframe = false;
    if (color === undefined) color = 0xffffff;

    const material = new THREE.MeshBasicMaterial({
      color: color,
      wireframe: wireframe,
      side: THREE.DoubleSide
    });

    //material.

    if (imageURL) {
      const textureLoader = new THREE.TextureLoader();

      //load texture and apply to material in callback
      const texture = textureLoader.load(imageURL, (tex) => {
        material.map = tex;
        //material.map.wrapT = THREE.RepeatWrapping;
        //material.map.wrapS = THREE.RepeatWrapping;
        //texture.repeat.set(0.05, 0.05);
      });
    }

    return new THREE.Mesh(geometry, material);
  }

  render() {
    requestAnimationFrame(() => {
      this.render()
    });

    this.renderer.render(this.scene, this.camera);
  }

  //convert the canvas to a base64URL and send to saveImage.php
  //TODO: make work!
  saveImage(){
    const data = this.renderer.domElement.toDataURL('image/png');
    console.log(data);
    const xhttp = new XMLHttpRequest();
    xhttp.open('POST', 'saveImage.php', true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send('img=' + data);
  }

}
