import * as E from './euclid';
import * as H from './hyperbolic';
import { Point } from './point';
import {
  Disk
}
from './disk';

import {
  Circle
}
from './circle';


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
    //console.log(p,q);
    this.disk = new Disk();

    this.p = p;
    this.q = q;
    this.colour = colour || 'black';
    this.rotation = rotation || 0;
    this.maxLayers = maxLayers || 5;

    if (this.checkParams()) {
      return false;
    }

    window.addEventListener('load', (event) => {
      //window.removeEventListener('load');
      this.init();
    }, false);

    window.addEventListener('resize', () => {
      this.init();
    }, false);



  }

  init() {
    this.fr = this.fundamentalRegion();
    this.testing();
  }

  testing() {
    let wireframe = false;
    wireframe = true;
    //let p1 = new Point(160.66832505298834, 278.2857021587673);
    //let p2 = new Point(94.98196390075151, 333.4031035749877);

    //this.disk.drawArc(p1,p3,1546645647)
    //this.disk.drawArc(p2,p3,1546645647)

    let p1 = new Point(100, -100);
    let p2 = new Point(100, 250);
    let p3 = new Point(-150, -100);

    /*
    this.disk.point(p1, 5);
    this.disk.point(p2, 5);
    this.disk.point(p3, 5);

    this.disk.drawArc(p1,p2,1546645647)
    this.disk.drawArc(p1,p3,1546645647)
    this.disk.drawArc(p3,p2,1546645647)
    */

    //this.disk.polygon([p1,p2,p3], E.randomInt(10000, 14777215));


    let a1 = H.arc(p1, p2, this.disk.circle);

    //let a2 = H.arcV2(p1, p2, this.disk.circle);
    //console.log(a1,a2);
    //this.disk.drawArc(p1,p2,1546645647)


    //this.disk.polygon(this.fr, E.randomInt(10000, 14777215), '', wireframe);
    const poly2 = H.reflect(this.fr, this.fr[1], this.fr[2], this.disk.circle);
    //this.disk.polygon(poly2, E.randomInt(10000, 14777215));

    const poly3 = H.reflect(poly2, poly2[0], poly2[1], this.disk.circle);
    //this.disk.polygon(poly3, E.randomInt(10000, 14777215), '', wireframe);

    const poly4 = H.reflect(poly3, poly3[2], poly3[0], this.disk.circle);
    //this.disk.polygon(poly4, E.randomInt(10000, 14777215), '', wireframe);

    const poly5 = H.reflect(poly4, poly4[1], poly4[0], this.disk.circle);
    //this.disk.polygon(poly5, E.randomInt(10000, 14777215), '', wireframe);

    const poly6 = H.reflect(poly3, poly3[2], poly3[1], this.disk.circle);
    //this.disk.polygon(poly6, E.randomInt(10000, 14777215), '', wireframe);

    const poly7 = H.reflect(poly6, poly6[0], poly6[2], this.disk.circle);
    //this.disk.polygon(poly7, E.randomInt(10000, 14777215), '', wireframe);

    const poly8 = H.reflect(poly6, poly6[0], poly6[1], this.disk.circle);
    //this.disk.polygon(poly8, E.randomInt(10000, 14777215), '', wireframe);

    const poly9 = H.reflect(poly7, poly7[0], poly7[1], this.disk.circle);
    //this.disk.polygon(poly9, E.randomInt(10000, 14777215), '', wireframe);

    let num = this.p*2;
    for(let i =0; i < num; i++){
      let poly = H.rotatePgonAboutOrigin(this.fr, (2*Math.PI/num)*(i+1));
      this.disk.polygon(poly, E.randomInt(10000, 14777215), '', wireframe);
      poly = H.rotatePgonAboutOrigin(poly2, (2*Math.PI/num)*(i+1));
      this.disk.polygon(poly, E.randomInt(10000, 14777215), '', wireframe);
      poly = H.rotatePgonAboutOrigin(poly3, (2*Math.PI/num)*(i+1));
      this.disk.polygon(poly, E.randomInt(10000, 14777215), '', wireframe);
      poly = H.rotatePgonAboutOrigin(poly4, (2*Math.PI/num)*(i+1));
      this.disk.polygon(poly, E.randomInt(10000, 14777215), '', wireframe);
      poly = H.rotatePgonAboutOrigin(poly5, (2*Math.PI/num)*(i+1));
      this.disk.polygon(poly, E.randomInt(10000, 14777215), '', wireframe);
      poly = H.rotatePgonAboutOrigin(poly6, (2*Math.PI/num)*(i+1));
      this.disk.polygon(poly, E.randomInt(10000, 14777215), '', wireframe);
      poly = H.rotatePgonAboutOrigin(poly7, (2*Math.PI/num)*(i+1));
      this.disk.polygon(poly, E.randomInt(10000, 14777215), '', wireframe);
      poly = H.rotatePgonAboutOrigin(poly8, (2*Math.PI/num)*(i+1));
      //if(i===3){
        //console.table(poly)
      this.disk.polygon(poly, E.randomInt(10000, 14777215), '', wireframe);
      //}
      poly = H.rotatePgonAboutOrigin(poly9, (2*Math.PI/num)*(i+1));
      this.disk.polygon(poly, E.randomInt(10000, 14777215), '', wireframe);
    }


  }

  //calculate first point of fundamental polygon using Coxeter's method
  fundamentalRegion() {
    const radius = this.disk.circle.radius;
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

    const points = [this.disk.centre, p1, p2];

    return points;
  }

  //The tesselation requires that (p-2)(q-2) > 4 to work (otherwise it is
  // either an elliptical or euclidean tesselation);
  //For now also require p,q > 3, as these are special cases
  checkParams() {
    if (this.maxLayers < 0 || isNaN(this.maxLayers)) {
      console.error('maxLayers must be greater than 0');
      return true;
    } else if ((this.p - 2) * (this.q - 2) <= 4) {
      console.error('Hyperbolic tesselations require that (p-1)(q-2) < 4!');
      return true;
    }
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
