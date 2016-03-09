import * as E from './euclid';
import { Point } from './elements';
// * ***********************************************************************
// *
// *  THREE JS CLASS
// *
// *  All operations involved in drawing to the screen occur here.
// *  All objects are assumed to be on the unit Disk when passed here and
// *  are converted to screen space (which involves multiplying
// *  by the radius ~ half screen resolution)
// *************************************************************************
export class ThreeJS {
  constructor() {
    this.init();
  }

  init() {
    this.radius = (window.innerWidth < window.innerHeight)
                  ? (window.innerWidth / 2) - 5
                  : (window.innerHeight / 2) - 5;
    this.radiusSetByWidth = (window.innerWidth < window.innerHeight)
                  ? true
                  : false;
    if (this.scene === undefined) this.scene = new THREE.Scene();
    this.initCamera();
    this.initRenderer();
    //this.render();

    document.querySelector('#save-image').onclick = () => this.saveImage();
    document.querySelector('#download-image').onclick = () => this.downloadImage();
  }

  reset() {
    cancelAnimationFrame(this.id);
    this.clearScene();
    this.projector = null;
    this.camera = null;
    this.init();
  }

  //TODO: sometimes messes up ratio
  resize(){
    const w = (window.innerWidth / 2) - 5;
    const h = (window.innerHeight / 2) - 5;
    if(this.radiusSetByWidth && w < h){
      this.radius = w;
    }
    else if(! w < h){
      this.radius = h;
    }

    /*
    this.camera.aspect = this.radius * -1,
                    this.radius ,
                    this.radius ,
                    this.radius * -1,
                    -2,
                    1;
    */
    //this.camera.updateProjectionMatrix();
    this.renderer.setSize(
      (this.radius + 5) * 2,
      (this.radius + 5) * 2 );

  }

  clearScene() {
    for (let i = this.scene.children.length - 1; i >= 0; i--) {
      this.scene.remove(this.scene.children[i]);
    }
  }

  initCamera() {
    this.camera = new THREE.OrthographicCamera(window.innerWidth / -2,
      window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, -2, 1);
    this.camera.frustumCulled = false;
    this.scene.add(this.camera);
  }

  initRenderer() {
    if (this.renderer === undefined) {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        preserveDrawingBuffer: true,
      });
      this.renderer.setClearColor(0xffffff, 1.0);
      //document.body.appendChild(this.renderer.domElement);
    }
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  disk(centre, radius, color) {
    if (color === undefined) color = 0xffffff;
    const geometry = new THREE.CircleGeometry(radius * this.radius, 100, 0, 2 * Math.PI);
    const material = new THREE.MeshBasicMaterial({color: color});

    const circle = new THREE.Mesh(geometry, material);
    circle.position.x = centre.x * this.radius;
    circle.position.y = centre.y * this.radius;

    this.scene.add(circle);
  }

  //Note: polygons assumed to be triangular!
  polygon(polygon, color, texture, wireframe){
    const p = 1/polygon.numDivisions;
    const divisions = polygon.numDivisions;
    const geometry = new THREE.Geometry();
    geometry.faceVertexUvs[0] = [];

    for(let i = 0; i < polygon.mesh.length; i++){
      geometry.vertices.push(new Point(polygon.mesh[i].x * radius, polygon.mesh[i].y * this.radius));
    }

    //const radius = this.radius;
    //geometry.vertices = polygon.expandedMesh;
    //console.log(geometry.vertices, polygon.expandedMesh);
    //geometry.vertices = polygon.expandedSubdivisionMesh();

    let edgeStartingVertex = 0;
    //loop over each interior edge of the polygon's subdivion mesh
    for(let i = 0; i < divisions; i++){
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
          new Point(i*p, 0),
          new Point((i+1)*p, 0),
          new Point((i+1)*p, p),
        ]);

      //range m-2 because we are ignoring the edges first vertex which was used in the previous faces.push
      for(let j = 0; j < m - 2; j++){
        geometry.faces.push(
          new THREE.Face3(
            edgeStartingVertex + j + 1,
            edgeStartingVertex + m + j,
            edgeStartingVertex + m + 1 + j
          ));
        geometry.faceVertexUvs[0].push(
          [
            new Point((i+1+j)*p, (1+j)*p),
            new Point((i+1+j)*p, j*p),
            new Point((i+j+2)*p, (j+1)*p),
          ]);
        geometry.faces.push(
          new THREE.Face3(
            edgeStartingVertex + j + 1,
            edgeStartingVertex + m + 1 + j,
            edgeStartingVertex + j + 2
          ));
        geometry.faceVertexUvs[0].push(
          [
            new Point((i+1+j)*p, (1+j)*p),
            new Point((i+2+j)*p, (j+1)*p),
            new Point((i+j+2)*p, (j+2)*p),
          ]);
      }
      edgeStartingVertex += m;
    }

    const mesh = this.createMesh(geometry, color, texture, polygon.materialIndex, wireframe);
    this.scene.add(mesh);

  }

  //NOTE: some polygons are inverted due to vertex order,
  //solved this by making material doubles sided but this might cause problems with textures
  createMesh(geometry, color, textures, materialIndex, wireframe) {
    if (wireframe === undefined) wireframe = false;
    if (color === undefined) color = 0xffffff;

    if(!this.pattern){
      this.createPattern(color, textures, wireframe);
    }
    return new THREE.Mesh(geometry, this.pattern.materials[materialIndex]);
  }

  createPattern(color, textures, wireframe){
    this.pattern = new THREE.MultiMaterial();
    const texturesLoaded = [];

    for( let i = 0; i < textures.length; i++){
      const material = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: wireframe,
        side: THREE.DoubleSide,
      });

      const texture = new THREE.TextureLoader().load(textures[i],
        () => {
          texturesLoaded.push(i);
          //call render when all textures are loaded
          if(texturesLoaded.length === textures.length){
            this.render();
          }
        });

      material.map = texture;
      this.pattern.materials.push(material);
    }
  }

  render() {

    this.renderer.render(this.scene, this.camera);
    this.appendImageToDom();
    //window.setTimeout(() => {
    this.clearScene();
    //}, 100);
  }

  appendImageToDom(){
    const imageElem = document.querySelector('#tiling-image');
    imageElem.style.height = window.innerHeight + 'px';
    imageElem.style.width = window.innerWidth + 'px';
    imageElem.setAttribute('src', this.renderer.domElement.toDataURL());
  }

  //Download the canvas as a png image
  downloadImage(){
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
    xhttp.send('img=' + data);
  }
}

/* DEPRECATED FUNCTIONS

//NOTE: UV mapping for old polygon subdivision method
//The texture is assumed to be a square power of transparent png with the image
//in the lower right triange triangle (0,0), (1,0), (1,1)
setUvs(geometry, edges) {
  //the incentre of the triangle is mapped to the polygon barycentre
  const incentre = new THREE.Vector2(1 / Math.sqrt(2), 1 - 1 / Math.sqrt(2));

  geometry.faceVertexUvs[0] = [];

  //EDGE 0
  let e = edges[0].points.length - 1;
  for(let i = 0; i < e; i++){
    geometry.faceVertexUvs[0].push(
      [
        new THREE.Vector2(incentre.x, incentre.y),
        new THREE.Vector2(i*(1/e), i*(1/e)),
        new THREE.Vector2((i+1)*(1/e), (i+1)*(1/e))
      ]);

  }
  //EDGE 1
  e = edges[1].points.length -1;
  for(let i = 0; i < e; i++){
    geometry.faceVertexUvs[0].push(
      [
        new THREE.Vector2(incentre.x, incentre.y),
        new THREE.Vector2(1, 1-i*(1/e)),
        new THREE.Vector2(1, 1-(i+1)*(1/e))
      ]);
  }
  //EDGE 2
  e = edges[2].points.length -1;
  for(let i = 0; i < e; i++){
    geometry.faceVertexUvs[0].push(
      [
        new THREE.Vector2(incentre.x, incentre.y),
        new THREE.Vector2(1-i*(1/e), 0),
        new THREE.Vector2(1-(i+1)*(1/e), 0)
      ]);
  }

  geometry.uvsNeedUpdate = true;
}

//Divided polygon radially from centre, not good for texture mapping but more efficient
polygonOLD(polygon, color, texture, wireframe) {
  if (color === undefined) color = 0xffffff;
  const geometry = new THREE.Geometry();

  //assign polygon barycentre to vertex 0
  geometry.vertices.push(new THREE.Vector3(polygon.centre.x * this.radius, polygon.centre.y * this.radius, 0));

  const edges = polygon.edges;
  //push first vertex of polygon to vertices array
  //This means that when the next vertex is pushed in the loop
  //we can also create the first face triangle
  geometry.vertices.push(new THREE.Vector3(edges[0].points[0].x * this.radius, edges[0].points[0].y * this.radius, 0));

  //vertices pushed so far counting from 0
  let count = 1;

  for (let i = 0; i < edges.length; i++) {
    const points = edges[i].points;
    for (let j = 1; j < points.length; j++) {
      geometry.vertices.push(new THREE.Vector3(points[j].x * this.radius, points[j].y * this.radius, 0));
      geometry.faces.push(new THREE.Face3(0, count, count + 1));
      count++;
    }
  }
  this.setUvs(geometry, edges);

  const mesh = this.createMesh(geometry, color, texture, polygon.materialIndex, wireframe);
  this.scene.add(mesh);
}


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

//POLYGON METHOD V2
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
*/

/*
//POLYGON METHOD V1
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
