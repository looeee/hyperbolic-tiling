import * as E from './euclid';

import {
  Polygon, Arc, Circle, Point, Disk
}
from './elements';

import {
  Transform, Transformations, Parameters
}
from './helpers';


// * ***********************************************************************
// *    TESSELATION CLASS
// *    Creates a regular Tesselation of the Poincare Disk
// *    q: number of p-gons meeting at each vertex
// *    p: number of sides of p-gon
// *    using the techniques created by Coxeter and Dunham
// *
// *************************************************************************
export class RegularTesselation {
  constructor(p, q, maxLayers) {
    //TESTING
    this.wireframe = false;
    this.wireframe = true;
    console.log(p, q, maxLayers);
    //this.textures = ['./images/textures/fish-black1.png', './images/textures/fish-white1-flipped.png'];
    this.textures = ['./images/textures/black.png', './images/textures/white.png'];

    this.p = p;
    this.q = q;
    this.maxLayers = maxLayers || 5;

    this.disk = new Disk();
    this.params = new Parameters(p, q);
    this.transforms = new Transformations(p, q);

    this.layers = [];
    for (let i = 0; i <= maxLayers; i++) {
      this.layers[i] = []
    }

    if (this.checkParams()) {
      return false;
    }

    this.init();
  }

  init(p, q, maxLayers) {
    this.buildCentralPattern();

    if (this.maxLayers > 1) {
      let t0 = performance.now();
      this.generateLayers();
      let t1 = performance.now();
      console.log('GenerateLayers took ' + (t1 - t0) + ' milliseconds.')
    }
    let t0 = performance.now();
    //this.drawLayers();
    let t1 = performance.now();
    console.log('DrawLayers took ' + (t1 - t0) + ' milliseconds.')
  }

  //fundamentalRegion calculation using Dunham's method
  //this is a right angle triangle above the radius on the line (0,0) -> (0,1)
  //of the central polygon
  fundamentalRegion() {
    const cosh2 = Math.cot(Math.PI / this.p) * Math.cot(Math.PI / this.q);

    const sinh2 = Math.sqrt(cosh2 * cosh2 - 1);

    const coshq = Math.cos(Math.PI / this.q) / Math.sin(Math.PI / this.p);
    const sinhq = Math.sqrt(coshq * coshq - 1);

    const rad2 = sinh2 / (cosh2 + 1); //radius of circle containing layer 0
    const x2pt = sinhq / (coshq + 1); //x coordinate of third vertex of triangle

    //point at end of hypotenuse of fundamental region
    const xqpt = Math.cos(Math.PI / this.p) * rad2;
    const yqpt = Math.sin(Math.PI / this.p) * rad2;

    //create points and move them from the unit disk to our radius
    const p1 = new Point(xqpt, yqpt);
    const p2 = new Point(x2pt, 0);
    const p3 = p1.transform(this.transforms.edgeBisectorReflection);
    const vertices = [this.disk.centre, p1, p2];

    return new Polygon(vertices, 0);
  }

  //this is a kite shaped region consisting of two copies of the fundamental
  //region with different textures applied to create the basic pattern
  //NOTE: for the time being just using edge bisector reflection to recreate Circle
  //Limit I, other patterns will require different options
  fundamentalPattern(){
    const upper = this.fundamentalRegion();
    this.disk.drawPolygon(upper,0xffffff, this.textures, this.wireframe);
    const lower = upper.transform(this.transforms.edgeBisectorReflection, 1);
    return [upper, lower];
  }

  //The pattern in the central polygon is made up of transformed copies
  //of the fundamental pattern
  buildCentralPattern() {
    //add the first two polygons to the central pattern
    this.centralPattern = this.fundamentalPattern();

    //NOTE: could do this more concisely using array indices and multiplying transforms
    //but naming the regions for clarity
    const upper = this.centralPattern[0];
    const lower = this.centralPattern[1]

    //created reflected versions of the two pattern pieces
    const upperReflected = this.centralPattern[0].transform(this.transforms.edgeBisectorReflection);
    const lowerReflected = this.centralPattern[1].transform(this.transforms.edgeBisectorReflection);

    for (let i = 1; i < this.p; i++) {
      if(i % 2 === 1){
        this.centralPattern.push(upperReflected.transform(this.transforms.rotatePolygonCW[i]));
        this.centralPattern.push(lowerReflected.transform(this.transforms.rotatePolygonCW[i]));
      }
      else{
        this.centralPattern.push(upper.transform(this.transforms.rotatePolygonCW[i]));
        this.centralPattern.push(lower.transform(this.transforms.rotatePolygonCW[i]));
      }
    }

    this.layers[0][0] = this.centralPattern;
  }

  //TODO document this function
  generateLayers() {
    for (let i = 0; i < this.p; i++) {
      let qTransform = this.transforms.edgeTransforms[i];
      for (let j = 0; j < this.q - 2; j++) {
        if ((this.p === 3) && (this.q - 3 === j)) {
          this.layers[i].push( this.transformPattern(this.centralPattern, qTransform) );
        }
        else {
          this.layerRecursion(this.params.exposure(0, i, j), 1, qTransform);
        }
        if ((-1 % this.p) !== 0) {
          qTransform = this.transforms.shiftTrans(qTransform, -1); // -1 means clockwise
        }
      }
    }
  }

  //calculate the polygons in each layer and add them to this.layers[layer] array
  //but don't draw them yet
  //TODO document this function
  layerRecursion(exposure, layer, transform) {
    this.layers[layer].push(this.transformPattern(this.centralPattern, transform));

    if (layer >= this.maxLayers) return;

    let pSkip = this.params.pSkip(exposure);
    let verticesToDo = this.params.verticesToDo(exposure);

    for (let i = 0; i < verticesToDo; i++) {
      let pTransform = this.transforms.shiftTrans(transform, pSkip);
      let qTransform;

      let qSkip = this.params.qSkip(exposure, i);
      if (qSkip % this.p !== 0) {
        qTransform = this.transforms.shiftTrans(pTransform, qSkip);
      }
      else {
        qTransform = pTransform;
      }

      let pgonsToDo = this.params.pgonsToDo(exposure, i);

      for (let j = 0; j < pgonsToDo; j++) {
        if ((this.p === 3) && (j === pgonsToDo - 1)) {
          this.layers[layer].push( this.transformPattern(this.centralPattern, qTransform) );
        }
        else {
          this.layerRecursion(this.params.exposure(layer, i, j), layer + 1, qTransform);
        }
        if ((-1 % this.p) !== 0) {
          qTransform = this.transforms.shiftTrans(qTransform, -1); // -1 means clockwise
        }
      }
      pSkip = (pSkip + 1) % this.p;
    }
  }

  transformPattern(pattern, transform) {
    const newPattern = [];
    for (let polygon of pattern) {
      newPattern.push(polygon.transform(transform));
    }
    return newPattern;
  }

  drawPattern(pattern) {
    for (let polygon of pattern) {
      this.disk.drawPolygon(polygon, 0xffffff, this.textures, this.wireframe);
    }
  }

  drawLayers() {
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      for (let j = 0; j < layer.length; j++) {
        this.drawPattern(layer[j]);
      }
    }
  }

  //The tesselation requires that (p-2)(q-2) > 4 to work (otherwise it is
  //either an elliptical or euclidean tesselation);
  checkParams() {
    if (this.maxLayers < 0 || isNaN(this.maxLayers)) {
      console.error('maxLayers must be greater than 0');
      return true;
    }
    else if ((this.p - 2) * (this.q - 2) <= 4) {
      console.error('Hyperbolic tesselations require that (p-2)(q-2) > 4!');
      return true;
    }
    else if (this.q < 3 || isNaN(this.q)) {
      console.error('Tesselation error: at least 3 p-gons must meet \
                    at each vertex!');
      return true;
    }
    else if (this.p < 3 || isNaN(this.p)) {
      console.error('Tesselation error: polygon needs at least 3 sides!');
      return true;
    }
    else {
      return false;
    }
  }
}

/*
buildCentralPolygon() {
  const vertices = [];
  for (let i = 0; i < this.p; i++) {
    const p = this.fr.vertices[1];
    vertices.push(p.transform(this.transforms.rotatePolygonCW[i]))
  }
  this.centralPolygon = new Polygon(vertices, true);
}
*/

/*
//calculate the fundamental region (triangle out of which Layer 0 is built)
//using Coxeter's method
fundamentalRegion() {
  const s = Math.sin(Math.PI / this.p);
  const t = Math.cos(Math.PI / this.q);
  //multiply these by the disks radius (Coxeter used unit disk);
  const r = 1 / Math.sqrt((t * t) / (s * s) - 1) * window.radius;
  const d = 1 / Math.sqrt(1 - (s * s) / (t * t)) * window.radius;
  const b = new Point(window.radius * Math.cos(Math.PI / this.p), window.radius * Math.sin(Math.PI / this.p));

  const circle = new Circle(d, 0, r);

  //there will be two points of intersection, of which we want the first
  const p1 = E.circleLineIntersect(circle, this.disk.centre, b).p1;

  const p2 = new Point(d - r, 0);

  const vertices = [this.disk.centre, p1, p2];

  return new Polygon(vertices);
}
*/
