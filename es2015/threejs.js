import * as E from './euclid';
// * ***********************************************************************
// *
// *  THREE JS CLASS
// *
// *  All operations involved in drawing to the screen occur here.
// *  All objects are assumed to be on the unit Disk when passed here and
// *  are converted to screen space (which will generally invole multiplying
// *  by the radius ~ half screen resolution)
// *************************************************************************
//TODO: after resizing a few times the scene stops drawing - possible memory
//not being freed in clearScene?
//TODO add functions to save image to disk/screen for download
//TODO perhaps all calculations should be carried out on the unit disk and
//only multiplied by window.radius here
export class ThreeJS {
  constructor() {
    this.init();
  }

  init() {
    this.radius = (window.innerWidth < window.innerHeight) ? (window.innerWidth / 2) - 5 : (window.innerHeight / 2) - 5;
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
    for (let i = this.scene.children.length - 1; i >= 0; i--) {
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

  //TODO refactor to assume centre is on unit disk
  disk(centre, radius, color) {
    if (color === undefined) color = 0xffffff;

    const geometry = new THREE.CircleGeometry(radius * this.radius, 100, 0, 2 * Math.PI);
    const circle = this.createMesh(geometry, color);
    circle.position.x = centre.x * this.radius;
    circle.position.y = centre.y * this.radius;

    this.scene.add(circle);
  }

  polygon(vertices, centre, color, texture, wireframe) {
    if (color === undefined) color = 0xffffff;
    const l = vertices.length;

    const geometry = new THREE.Geometry();

    //vertex 0 = polygon barycentre
    geometry.vertices.push(new THREE.Vector3(centre.x * this.radius, centre.y * this.radius, 0));

    //push first vertex to vertices array
    //This means that when the next vertex is pushed in the loop
    //we can also create the first face triangle
    geometry.vertices.push(new THREE.Vector3(vertices[0].x * this.radius, vertices[0].y * this.radius, 0));

    //each vertex added creates a new triangle, use this to create a new face
    for (let i = 1; i < l; i++) {
      geometry.vertices.push(new THREE.Vector3(vertices[i].x * this.radius, vertices[i].y * this.radius, 0));
      geometry.faces.push(new THREE.Face3(0, i, i + 1));
    }

    //push the final face
    geometry.faces.push(new THREE.Face3(0, l, 1));

    this.setUvs(geometry, vertices, centre);

    const mesh = this.createMesh(geometry, color, texture, wireframe);
    this.scene.add(mesh);

    //this.addBoundingBoxHelper(mesh);
    //this.disk(centre, 1, 0xff0000)
  }

  //TODO make work!
  setUvs(geometry, vertices, centre) {
    //the incentre of the triangle (0,0), (1,0), (1,1)
    const incentre = new THREE.Vector2(1 / Math.sqrt(2), 1 - 1 / Math.sqrt(2));

    const l = vertices.length;

    geometry.computeBoundingBox();
    const max = geometry.boundingBox.max;
    const min = geometry.boundingBox.min;
    const offset = new THREE.Vector2(min.x, min.y);
    const range = new THREE.Vector2(max.x - min.x, max.y - min.y);
    const r = E.distance(min, max);
    geometry.faceVertexUvs[0] = [];

    for (let i = 0; i < l - 1; i++) {
      geometry.faceVertexUvs[0].push(
        [
          //new THREE.Vector2((centre.x + offset.x) / r, (centre.y + offset.y) / r),
          new THREE.Vector2(incentre.x, incentre.y),
          new THREE.Vector2((vertices[i].x + offset.x) / r, (vertices[i].y + offset.y) / r),
          new THREE.Vector2((vertices[i + 1].x + offset.x) / r, (vertices[i + 1].y + offset.y) / r)
        ]);
    }

    //push the final face vertex
    geometry.faceVertexUvs[0].push(
      [
        //new THREE.Vector2((centre.x + offset.x) / r, (centre.y + offset.y) / r),
        new THREE.Vector2(incentre.x, incentre.y),
        new THREE.Vector2((vertices[l - 1].x + offset.x) / r, (vertices[l - 1].y + offset.y) / r),
        new THREE.Vector2((vertices[0].x + offset.x) / r, (vertices[0].y + offset.y) / r)
      ]);

    geometry.uvsNeedUpdate = true;
  }

  //NOTE: some polygons are inverted due to vertex order,
  //solved this but this might cause problems with textures
  //TODO should probably only be creating materials/textures
  //once and then cloning where possible
  createMesh(geometry, color, imageURL, wireframe) {
    if (wireframe === undefined) wireframe = false;
    if (color === undefined) color = 0xffffff;

    const material = new THREE.MeshBasicMaterial({
      color: color,
      wireframe: wireframe,
      side: THREE.DoubleSide,
      //transparent: true,
    });

    if (imageURL) {
      const texture = new THREE.TextureLoader().load(imageURL);
      texture.wrapS = 1000;
      texture.wrapT = 1000;
      material.map = texture;
      material.needsUpdate = true;
    }


    return new THREE.Mesh(geometry, material);
  }

  addBoundingBoxHelper(mesh) {
    const box = new THREE.BoxHelper(mesh);
    //box.update();
    this.scene.add(box);
  }

  //TODO as this is a static image requestAnimationFrame is redundant
  //however render() needs to be called after all the shapes
  //are calculated
  render() {
    requestAnimationFrame(() => {
      this.render()
    });
    this.renderer.render(this.scene, this.camera);
  }

  //convert the canvas to a base64URL and send to saveImage.php
  //TODO: make work!
  saveImage() {
    const data = this.renderer.domElement.toDataURL('image/png');
    console.log(data);
    const xhttp = new XMLHttpRequest();
    xhttp.open('POST', 'saveImage.php', true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send('img=' + data);
  }

  segment(circle, startAngle, endAngle, color) {
    if (color === undefined) color = 0xffffff;

    const curve = new THREE.EllipseCurve(
      circle.centre.x * this.radius,
      circle.centre.y * this.radius,
      circle.radius * this.radius,
      circle.radius * this.radius, // xRadius, yRadius
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
      new THREE.Vector3(start.x * this.radius, start.y * this.radius, 0),
      new THREE.Vector3(end.x * this.radius, end.y * this.radius, 0)
    );
    const material = new THREE.LineBasicMaterial({
      color: color
    });
    const l = new THREE.Line(geometry, material);
    this.scene.add(l);
  }
}

/*
//OLD POLYGON METHOD
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
