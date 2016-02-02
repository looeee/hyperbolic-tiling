import * as E from './euclid';
import { Disk } from './disk';
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

    this.centre = {
      x: 0,
      y: 0
    }
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

  init(){
    this.radius = this.disk.getRadius();
    this.fr = this.fundamentalRegion();

    this.testing();
  }

  testing(){
    //this.disk.polygonOutline([this.fr.a, this.fr.b, this.fr.c], 0x5312ba);
    this.disk.polygon([this.fr.a, this.fr.b, this.fr.c], 0xe80348);

  }

  //calculate first point of fundamental polygon using Coxeter's method
  fundamentalRegion() {
    const s = Math.sin(Math.PI / this.p);
    const t = Math.cos(Math.PI / this.q);
    //multiply these by the disks radius (Coxeter used unit disk);
    const r = 1 / Math.sqrt((t * t) / (s * s) - 1) * this.radius;
    const d = 1 / Math.sqrt(1 - (s * s) / (t * t)) * this.radius;
    const b = {
      x: this.radius * Math.cos(Math.PI / this.p),
      y: -this.radius * Math.sin(Math.PI / this.p)
    }
    const centre = {
      x: d,
      y: 0
    };
    //there will be two points of intersection, of which we want the first
    const p1 = E.circleLineIntersect(centre, r, this.disk.centre, b).p1;

    return {
      a: this.disk.centre,
      b: p1,
      c: {
        x: d - r,
        y: 0
      }
    };
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
