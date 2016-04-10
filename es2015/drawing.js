/* drawing.js */

import * as E from './universal/mathFunctions';
import { Point } from './universal/universalElements';
// * ***********************************************************************
// *
// *  DRAWING CLASS
// *
// *  All operations involved in drawing to the screen occur here.
// *  All objects are assumed to be on the unit Disk when passed here and
// *  are converted to screen space (which involves multiplying
// *  by the radius ~ half screen resolution)
// *************************************************************************
export class Drawing {
  constructor(radius) {
    this._radius = radius || 100;
    this.init();
  }

  init() {
    this.scene = new THREE.Scene();
    this.initCamera();
    this.initRenderer();
  }

  set radius(newRadius) {this._radius = newRadius;}
  get radius() {return this._radius;}

  reset() {
    this.clearScene();
    this.pattern = null; //reset materials;
    this.setCamera();
    this.setRenderer();
  }

  clearScene() {
    for (let i = this.scene.children.length - 1; i >= 0; i--) {
      const object = this.scene.children[i];
      if (object.type === 'Mesh') {
        object.geometry.dispose();
        object.material.dispose();
        this.scene.remove(object);
      }
    }
  }

  initCamera() {
    this.camera = new THREE.OrthographicCamera();
    this.setCamera();
    this.scene.add(this.camera);
  }

  setCamera() {
    this.camera.left = -window.innerWidth / 2;
    this.camera.right = window.innerWidth / 2;
    this.camera.top = window.innerHeight / 2;
    this.camera.bottom = -window.innerHeight / 2;
    this.camera.near = -2;
    this.camera.far = 1;
    this.camera.frustumCulled = false;
    this.camera.updateProjectionMatrix();
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
    });
    this.setRenderer();
  }

  setRenderer() {
    this.renderer.setClearColor(0xffffff, 1.0);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  disk(centre, radius, color) {
    if (color === undefined) color = 0xffffff;
    const geometry = new THREE.CircleGeometry(radius * this.radius, 100, 0, 2 * Math.PI);
    const material = new THREE.MeshBasicMaterial({ color });

    const circle = new THREE.Mesh(geometry, material);
    circle.position.x = centre.x * this.radius;
    circle.position.y = centre.y * this.radius;

    this.scene.add(circle);
  }

  //TODO: passing elem param through lots of function to eventually get to renderToImageElem
  // which is called after final texture has loaded. There must be a better way!
  polygonArray(array, textureArray, color, wireframe, elem) {
    color = color || 0xffffff;
    wireframe = wireframe || false;
    for (let i = 0; i < array.length; i++) {
      this.polygon(array[i], color, textureArray, wireframe, elem);
    }
  }

  //Note: polygons assumed to be triangular
  polygon(polygon, color, textures, wireframe, elem) {
    const divisions = polygon.numDivisions || 1;
    const p = 1 / divisions;
    const geometry = new THREE.Geometry();
    geometry.faceVertexUvs[0] = [];

    if (polygon.needsResizing) {
      for (let i = 0; i < polygon.mesh.length; i++) {
        geometry.vertices.push(
          new Point(polygon.mesh[i].x * this.radius, polygon.mesh[i].y * this.radius)
        );
      }
    }
    else {
      geometry.vertices = polygon.mesh;
    }


    let edgeStartingVertex = 0;
    //loop over each interior edge of the polygon's subdivion mesh
    for (let i = 0; i < divisions; i++) {
      //edge divisions reduce by one for each interior edge
      const m = divisions - i + 1;
      geometry.faces.push(
        new THREE.Face3(
          edgeStartingVertex,
          edgeStartingVertex + m,
          edgeStartingVertex + 1
        ));
      geometry.faceVertexUvs[0].push(
        [
          new Point(i * p, 0),
          new Point((i + 1) * p, 0),
          new Point((i + 1) * p, p),
        ]);

      //range m-2 because we are ignoring the edges first vertex which was
      //used in the previous faces.push
      for (let j = 0; j < m - 2; j++) {
        geometry.faces.push(
          new THREE.Face3(
            edgeStartingVertex + j + 1,
            edgeStartingVertex + m + j,
            edgeStartingVertex + m + 1 + j
          ));
        geometry.faceVertexUvs[0].push(
          [
            new Point((i + 1 + j) * p, (1 + j) * p),
            new Point((i + 1 + j) * p, j * p),
            new Point((i + j + 2) * p, (j + 1) * p),
          ]);
        geometry.faces.push(
          new THREE.Face3(
            edgeStartingVertex + j + 1,
            edgeStartingVertex + m + 1 + j,
            edgeStartingVertex + j + 2
          ));
        geometry.faceVertexUvs[0].push(
          [
            new Point((i + 1 + j) * p, (1 + j) * p),
            new Point((i + 2 + j) * p, (j + 1) * p),
            new Point((i + j + 2) * p, (j + 2) * p),
          ]);
      }
      edgeStartingVertex += m;
    }
    const mesh = this.createMesh(geometry, color, textures, polygon.materialIndex, wireframe, elem);
    this.scene.add(mesh);
  }

  //NOTE: some polygons are inverted due to vertex order,
  //solved this by making material doubles sided
  createMesh(geometry, color, textures, materialIndex, wireframe, elem) {
    if (wireframe === undefined) wireframe = false;
    if (color === undefined) color = 0xffffff;

    if (!this.pattern) {
      this.createPattern(color, textures, wireframe, elem);
    }
    return new THREE.Mesh(geometry, this.pattern.materials[materialIndex]);
  }

  createPattern(color, textures, wireframe, elem) {
    this.pattern = new THREE.MultiMaterial();
    const texturesLoaded = [];

    for (let i = 0; i < textures.length; i++) {
      const material = new THREE.MeshBasicMaterial({
        color,
        wireframe,
        side: THREE.DoubleSide,
      });

      const texture = new THREE.TextureLoader().load(textures[i],
        () => {
          texturesLoaded.push(i);
          //call render when all textures are loaded
          if (texturesLoaded.length === textures.length) {
            this.renderToImageElem(elem);
          }
        });

      material.map = texture;
      this.pattern.materials.push(material);
    }
  }

  //render to image elem
  renderToImageElem(elem) {
    this.renderer.render(this.scene, this.camera);
    this.appendImageToDom(elem);
    this.clearScene();
  }

  appendImageToDom(elem) {
    document.querySelector(elem).setAttribute('src', this.renderer.domElement.toDataURL());
  }

  //Download the canvas as a png image
  downloadImage() {
    const link = document.querySelector('#download-image');
    link.href = this.renderer.domElement.toDataURL();
    link.download = 'hyperbolic-tiling.png';
  }

  //convert the canvas to a base64URL and send to saveImage.php
  saveImage() {
    const data = this.renderer.domElement.toDataURL();
    const xhttp = new XMLHttpRequest();
    xhttp.open('POST', 'saveImage.php', true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(`img=${data}`);
  }
}

/* UNUSED FUNCTIONS

addBoundingBoxHelper(mesh) {
  const box = new THREE.BoxHelper(mesh);
  //box.update();
  this.scene.add(box);
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
*/
