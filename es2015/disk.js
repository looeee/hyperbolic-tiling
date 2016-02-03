import * as E from './euclid';
import * as H from './hyperbolic';

import {
  ThreeJS
}
from './threejs';

// * ***********************************************************************
// *
// *   DISK CLASS
// *   Poincare Disk representation of the hyperbolic plane
// *   Contains any functions used to draw to the disk
// *   (Currently using three js as drawing class)
// *************************************************************************
export class Disk {
  constructor() {
    this.draw = new ThreeJS();

    window.addEventListener('load', (event) => {
      window.removeEventListener('load');
      this.init();
    }, false);

    window.addEventListener('resize', () => {
      this.init();
    }, false);

  }

  init() {
    this.centre = {
      x: 0,
      y: 0
    }

    //draw largest circle possible given window dims
    this.radius = (window.innerWidth < window.innerHeight) ? (window.innerWidth / 2) - 5 : (window.innerHeight / 2) - 5;

    this.circle = {
      centre: this.centre,
      radius: this.radius
    }

    //smaller circle for testing
    //this.radius = this.radius / 2;

    this.drawDisk();

    //this.testing();
  }

  testing() {
    const p1 = {
      x: 100,
      y: 250
    };
    const p2 = {
      x: -150,
      y: 150
    };
    const p3 = {
      x: -70,
      y: -250
    };

    const p4 = {
      x: -170,
      y: -150
    };

    const p5 = {
      x: 170,
      y: -150
    };
    this.point(p1, 5, 0xf00f0f);
    this.point(p2, 5, 0xffff0f);
    this.point(p3, 5, 0x1d00d5);
    this.point(p4, 5, 0x00ff0f);
    this.point(p5, 5, 0x359543);

    /*
    const a = H.arc(p1, p2);

    this.draw.disk(a.circle.centre, a.circle.radius, 0xffffff, false);

    const p4 = E.nextPoint(a.circle, p2, 20).p1;
    console.log(p4);



    //this.drawArc(p2, p3, 0xf00f0f);
    */
    //this.polygonOutline([p1, p2, p3],0xf00f0f)
    this.polygon([p1, p2, p4, p3, p5], 0x70069a);
    //this.polygon([p2, p3, p4]);
  }
  getRadius() {
    return this.radius;
  }

  //draw the disk background
  drawDisk() {
    this.draw.disk(this.centre, this.radius, 0x000000, true);
  }

  point(centre, radius, color) {
    this.draw.disk(centre, radius, color, false);
  }

  //draw a hyperbolic line between two points on the boundary circle
  //TODO: fix!
  line(p1, p2, color) {
    const c = E.greatCircle(p1, p2, this.radius, this.centre);
    const points = E.circleIntersect(this.centre, c.centre, this.radius, c.radius);

    this.drawArc(points.p1, points.p2, color)
  }

  //Draw an arc (hyperbolic line segment) between two points on the disk
  drawArc(p1, p2, colour) {
    //check that the points are in the disk
    if (this.checkPoints(p1, p2)) {
      return false
    }
    const col = colour || 0xffffff;
    const arc = H.arc(p1, p2, this.circle);

    if (a.straightLine) {
      this.draw.line(p1, p2, col);
    } else {
      this.draw.segment(arc.circle, arc.startAngle, arc.endAngle, colour);
    }
  }

  polygonOutline(vertices, colour) {
    const l = vertices.length;
    for (let i = 0; i < l; i++) {
      this.drawArc(vertices[i], vertices[(i + 1) % l], colour);
    }
  }

  //create an array of points spaced equally around the arcs defining a hyperbolic
  //polygon and pass these to ThreeJS.polygon()
  //TODO make spacing a function of final resolution
  //TODO check whether vertices are in the right order
  polygon(vertices, color, texture) {
    const points = [];
    const spacing = 5;
    const l = vertices.length;
    for (let i = 0; i < l; i++) {
      let p;
      const arc = H.arc(vertices[i], vertices[(i + 1) % l], this.circle);

      //line not through the origin (hyperbolic arc)
      if (!arc.straightLine) {

        if (arc.clockwise) {
          p = E.spacedPointOnArc(arc.circle, vertices[i], spacing).p2;
        } else {
          p = E.spacedPointOnArc(arc.circle, vertices[i], spacing).p1;
        }
        points.push(p);

        while (E.distance(p, vertices[(i + 1) % l]) > spacing) {

          if (arc.clockwise) {
            p = E.spacedPointOnArc(arc.circle, p, spacing).p2;
          } else {
            p = E.spacedPointOnArc(arc.circle, p, spacing).p1;
          }

          points.push(p);
        }
        points.push(vertices[(i + 1) % l]);
      }

      //line through origin (straight line)
      else{
        points.push(vertices[(i + 1) % l]);
      }
    }

    let wireframe = false;
    //TESTING
    wireframe = true;
    for(let point of points){
      //this.point(point,2,0x10ded8);
    }

    this.draw.polygon(points, color, texture, wireframe);
  }

  //return true if any of the points is not in the disk
  checkPoints(...points) {
    const r = this.radius;
    let test = false;
    for (let point of points) {
      if (E.distance(point, this.centre) > r) {
        console.error('Error! Point (' + point.x + ', ' + point.y + ') lies outside the plane!');
        test = true;
      }
    }
    if (test) return true
    else return false
  }
}
