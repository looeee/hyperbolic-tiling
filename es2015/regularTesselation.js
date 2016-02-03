import * as E from './euclid';
import * as H from './hyperbolic';
import { Point } from './point';
import {
  Disk
}
from './disk';


// * ***********************************************************************
// *    TESSELATION CLASS
// *    Creates a regular Tesselation of the Poincare Disk
// *    q: number of p-gons meeting at each vertex
// *    p: number of sides of p-gon
// *    using the techniques created by Coxeter and Dunham
// *
// *************************************************************************
export class RegularTesselation {
  constructor(p, q, rotation, colour, maxLayers) {
    this.disk = new Disk();

    this.centre = new Point(0,0);

    this.p = p;
    this.q = q;
    this.colour = colour || 'black';
    this.rotation = rotation || 0;
    this.maxLayers = maxLayers || 5;

    if (this.checkParams()) {
      return false;
    }

    window.addEventListener('load', (event) => {
      window.removeEventListener('load');
      this.init();
    }, false);

    window.addEventListener('resize', () => {
      this.init();
    }, false);



  }

  init() {
    this.radius = this.disk.getRadius();
    this.fr = this.fundamentalRegion();
    this.testing();
  }

  testing() {

    this.disk.polygon(this.fr, E.randomInt(10000, 14777215));
    const poly2 = H.reflect(this.fr, this.fr[0], this.fr[2], this.disk.circle);
    this.disk.polygon(poly2, E.randomInt(10000, 14777215));

    const poly3 = H.reflect(poly2, poly2[0], poly2[1], this.disk.circle);
    this.disk.polygon(poly3, E.randomInt(10000, 14777215));

    const poly4 = H.reflect(poly3, poly3[0], poly3[2], this.disk.circle);
    this.disk.polygon(poly4, E.randomInt(10000, 14777215));

    const poly5 = H.reflect(poly4, poly4[0], poly4[1], this.disk.circle);
    this.disk.polygon(poly5, E.randomInt(10000, 14777215));

    const poly6 = H.reflect(poly5, poly5[0], poly5[2], this.disk.circle);
    this.disk.polygon(poly6, E.randomInt(10000, 14777215));

    const poly7 = H.reflect(poly6, poly6[0], poly6[1], this.disk.circle);
    this.disk.polygon(poly7, E.randomInt(10000, 14777215));

    const poly8 = H.reflect(poly7, poly7[0], poly7[2], this.disk.circle);
    this.disk.polygon(poly8, E.randomInt(10000, 14777215));

    let num = 0;
    for(let i =0; i < num; i++){
      let poly = H.rotatePgonAboutOrigin(poly2, (2*Math.PI/num)*(i+1));
      this.disk.polygon(poly, E.randomInt(10000, 14777215));
      poly = H.rotatePgonAboutOrigin(this.fr, (2*Math.PI/num)*(i+1));
      this.disk.polygon(poly, E.randomInt(10000, 14777215));
    }
  }

  //calculate first point of fundamental polygon using Coxeter's method
  fundamentalRegion() {
    const s = Math.sin(Math.PI / this.p);
    const t = Math.cos(Math.PI / this.q);
    //multiply these by the disks radius (Coxeter used unit disk);
    const r = 1 / Math.sqrt((t * t) / (s * s) - 1) * this.radius;
    const d = 1 / Math.sqrt(1 - (s * s) / (t * t)) * this.radius;
    const b = new Point(this.radius * Math.cos(Math.PI / this.p),
    -this.radius * Math.sin(Math.PI / this.p));

    const centre = new Point(d,0);

    //there will be two points of intersection, of which we want the first
    const p1 = E.circleLineIntersect(centre, r, this.disk.centre, b).p1;

    const p2 = new Point(d-r,0);

    const points = [this.disk.centre, p1, p2];

    return points;
  }

  //The tesselation requires that (p-2)(q-2) > 4 to work (otherwise it is
  // either an elliptical or euclidean tesselation);
  checkParams() {
    if (this.maxLayers < 0 || isNaN(this.maxLayers)) {
      console.error('maxLayers must be greater than 0');
      return true;
    } else if ((this.p - 2) * (this.q - 2) <= 4) {
      console.error('Hyperbolic tesselations require that (p-1)(q-2) < 4!');
      return true;
    }
    //For now require p,q > 3,
    //TODO implement special cases for q = 3 or p = 3
    else if (this.q <= 3 || isNaN(this.q)) {
      console.error('Tesselation error: at least 3 p-gons must meet \
                    at each vertex!');
      return true;
    } else if (this.p <= 3 || isNaN(this.p)) {
      console.error('Tesselation error: polygon needs at least 3 sides!');
      return true;
    } else {
      return false;
    }
  }
}
