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

import {Parameters} from './parameters';


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
    console.log(p,q);
    this.disk = new Disk();

    this.p = p;
    this.q = q;
    this.maxLayers = maxLayers || 5;

    this.params = new Parameters(p,q);

    if (this.checkParams()) {
      return false;
    }

    window.addEventListener('load', (event) => {
      this.init();
    }, false);

    window.addEventListener('resize', () => {
      this.init();
    }, false);



  }

  init() {
    this.fr = this.fundamentalRegion();
    this.centralPolygon();
    if(this.mayLayers > 1) this.generateLayers();

    //this.testing();
  }

  testing() {
    let p1 = new Point(-200, 150);
    let p2 = new Point(100, -200);
    let p3 = new Point(290, -20);
    let pgon = new Polygon([p1,p2,p3], this.disk.circle);
    this.disk.drawPolygon(pgon, E.randomInt(900000, 14777215), '', wireframe);

  }

  generateLayers(){

  }

  //calculate the central polygon which is made up of transformed copies
  //of the fundamental region
  centralPolygon(){
    this.frCopy = this.fr.reflect(this.fr.vertices[0], this.fr.vertices[2]);
    this.layerZero = [this.fr, this.frCopy];

    for(let i = 0; i < this.p; i++){
      this.layerZero.push(this.layerZero[0].rotateAboutOrigin(2*Math.PI/this.p*i));
      this.layerZero.push(this.layerZero[1].rotateAboutOrigin(2*Math.PI/this.p*i));
    }

    for(let pgon of this.layerZero){
      this.disk.drawPolygon(pgon, E.randomInt(1900000, 14777215), '', this.wireframe);
    }
  }

  //calculate the fundamental region (triangle out of which Layer 0 is built)
  //using Coxeter's method
  fundamentalRegion() {
    const radius = this.disk.radius;
    const s = Math.sin(Math.PI / this.p);
    const t = Math.cos(Math.PI / this.q);
    //multiply these by the disks radius (Coxeter used unit disk);
    const r = 1 / Math.sqrt((t * t) / (s * s) - 1) * radius;
    const d = 1 / Math.sqrt(1 - (s * s) / (t * t)) * radius;
    const b = new Point(radius * Math.cos(Math.PI / this.p),
    -radius * Math.sin(Math.PI / this.p));

    const circle = new Circle(d, 0, r);

    //there will be two points of intersection, of which we want the first
    const p1 = E.circleLineIntersect(circle, this.disk.centre, b).p1;

    const p2 = new Point(d-r,0);

    const vertices = [this.disk.centre, p1, p2];

    return new Polygon(vertices, this.disk.circle);
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
    }
    else if (this.q < 3 || isNaN(this.q)) {
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
