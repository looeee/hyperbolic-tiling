import * as E from './euclid';
import * as H from './hyperbolic';
import {
  Disk
}
from './disk';

import {
  Polygon, Arc, Circle, Point
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
    this.wireframe = false;
    this.wireframe = true;
    console.log(p, q);
    this.disk = new Disk();

    this.p = p;
    this.q = q;
    this.maxLayers = maxLayers || 5;
    this.params = new Parameters(p, q);

    this.transforms = new Transformations(p, q);

    if (this.checkParams()) {
      return false;
    }

    this.init();

    window.addEventListener('resize', () => {
      this.init();
    }, false);



  }

  init() {
    this.fr = this.fundamentalRegion();
    this.buildCentralPattern();
    this.buildCentralPolygon();

    //if (this.maxLayers > 1) this.generateLayers();

    this.disk.drawPolygon(this.centralPolygon, 0x0ff000, '', true);
    this.drawPattern(this.layerZero)

    this.testing();
  }

  testing() {
        //TODO: this.transforms.edgeTransforms[0] + [2] broken!
    let pattern = './images/textures/pattern1.png';
    pattern = '';

    this.disk.drawPolygon(this.fr, 0xffffff, pattern, this.wireframe);
    let poly = this.centralPolygon.transform(this.transforms.edgeTransforms[3]);
    //this.disk.drawPolygon(poly, 0x5c30e0, pattern, this.wireframe);

  }

  generatePattern(pgonArray, transform) {
    const newArray = [];
    for (pgon of pgonArray) {
      newArray.push(pgon.transform(transform));
    }
    return newArray;
  }

  drawPattern(pgonArray) {
    for (let pgon of pgonArray) {
      this.disk.drawPolygon(pgon, E.randomInt(1000, 14777215), '', this.wireframe);
    }
  }

  generateLayers() {
    for (let i = 0; i < this.p; i++) {
      let qTransform = this.transforms.edgeTransforms[i];
      for (let j = 0; j < this.q - 2; j++) {
        if ((this.p === 3) && (this.q - 3 === j)) {
          //TODO: transform central polygon accordingly
        } else {
          this.layerRecursion(this.params.exposure(0, i, j), 1, qTransform);
        }
        if ((-1 % this.p) !== 0) {
          qTransform = this.transforms.shiftTrans(qTransform, -1); // -1 means clockwise
        }
      }
    }
  }

  layerRecursion(exposure, layer, transform) {
    //const pattern = this.generatePattern(this.layerZero, transform);
    //this.drawPattern(pattern);
    const poly = this.centralPolygon.transform(transform);
    this.disk.drawPolygon(poly, 0x301a45, '', this.wireframe);

    if (layer >= this.maxLayers) return;

    let pSkip = this.params.pSkip(exposure);
    let verticesToDo = this.params.verticesToDo(exposure);

    for (let i = 0; i < verticesToDo; i++) {
      let pTransform = this.transforms.shiftTrans(transform, pSkip);
      let qTransform;

      let qSkip = this.params.qSkip(exposure, i);
      if (qSkip % this.p !== 0) {
        qTransform = this.transforms.shiftTrans(pTransform, qSkip);
      } else {
        qTransform = pTransform;
      }

      let pgonsToDo = this.params.pgonsToDo(exposure, i);

      for (let j = 0; j < pgonsToDo; j++) {
        if ((this.p === 3) && (j === pgonsToDo - 1)) {
          //TODO: transform polygon accordingly
        } else {
          this.layerRecursion(this.params.exposure(layer, i, j), layer + 1, qTransform);
        }
        if ((-1 % this.p) !== 0) {
          qTransform = this.transforms.shiftTrans(qTransform, -1); // -1 means clockwise
        }
      }
      pSkip = (pSkip + 1) % this.p;
    }
  }

  //calculate the central polygon which is made up of transformed copies
  //of the fundamental region
  //TODO: refactor this to use Transforms
  buildCentralPattern() {
    this.frCopy = this.fr.reflect(this.fr.vertices[0], this.fr.vertices[2]);
    this.layerZero = [this.fr, this.frCopy];

    for (let i = 0; i < this.p; i++) {
      this.layerZero.push(this.layerZero[0].rotateAboutOrigin(2 * Math.PI / this.p * i));
      this.layerZero.push(this.layerZero[1].rotateAboutOrigin(2 * Math.PI / this.p * i));
    }
  }

  buildCentralPolygon(){
    const vertices = [];
    for(let i = 0; i < this.p; i++){
      const p = this.fr.vertices[1];
      vertices.push(p.transform(this.transforms.rotatePolygonCW[i]))
    }
    this.centralPolygon = new Polygon(vertices);
  }
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


  }
  */

  //fundamentalRegion calculation using Dunham's method
  fundamentalRegion() {
    const cosh2 = Math.cot(Math.PI / this.p)*Math.cot(Math.PI / this.q);

    const sinh2 = Math.sqrt(cosh2 *cosh2 - 1);

    const coshq = Math.cos(Math.PI / this.q) / Math.sin(Math.PI / this.p);
    const sinhq = Math.sqrt(coshq * coshq - 1);

    const rad2 = sinh2 / (cosh2 + 1); //radius of circle containing layer 0
    const x2pt = sinhq / (coshq + 1); //x coordinate of third vertex of triangle

    //point at end of hypotenuse of fundamental region
    const xqpt = Math.cos(Math.PI / this.p) * rad2;
    const yqpt = Math.sin(Math.PI / this.p) * rad2;

    //create points and move them from the unit disk to our radius
    const p1 = new Point(xqpt, yqpt, true).fromUnitDisk();
    const p2 = new Point(x2pt, 0, true).fromUnitDisk();
    const vertices = [this.disk.centre, p1, p2];

    return new Polygon(vertices);
  }

  //The tesselation requires that (p-2)(q-2) > 4 to work (otherwise it is
  //either an elliptical or euclidean tesselation);
  //For now also require p,q > 3, as these are special cases
  checkParams() {
    if (this.maxLayers < 0 || isNaN(this.maxLayers)) {
      console.error('maxLayers must be greater than 0');
      return true;
    } else if ((this.p - 2) * (this.q - 2) <= 4) {
      console.error('Hyperbolic tesselations require that (p-1)(q-2) > 4!');
      return true;
    } else if (this.q < 3 || isNaN(this.q)) {
      console.error('Tesselation error: at least 3 p-gons must meet \
                    at each vertex!');
      return true;
    } else if (this.p < 3 || isNaN(this.p)) {
      console.error('Tesselation error: polygon needs at least 3 sides!');
      return true;
    } else {
      return false;
    }
  }
}
