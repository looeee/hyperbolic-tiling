import * as E from './euclid';
//import { Canvas } from './canvas';
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

    //smaller circle for testing
    //this.radius = this.radius / 2;

    this.drawDisk();

    this.testing();
  }

  testing() {
    const p1 = {
      x: -200,
      y: 250
    };
    const p2 = {
      x: 50,
      y: 50
    };
    const p3 = {
      x: 70,
      y: -50
    };

    //this.drawArc(p2, p3, 0xf00f0f);

    this.polygonOutline([p1, p2, p3],0xf00f0f)
    this.polygon([p1, p2, p3]);
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
  line(p1, p2, colour) {
    const c = E.greatCircle(p1, p2, this.radius, this.centre);
    const points = E.circleIntersect(this.centre, c.centre, this.radius, c.radius);

    this.arc(points.p1, points.p2, colour)
  }

  //Draw an arc (hyperbolic line segment) between two points on the disk
  drawArc(p1, p2, colour) {
    const col = colour || 0xffffff;
    if (E.throughOrigin(p1, p2)) {
      this.draw.line(p1, p2, col);
    } else {
      const arc = this.arc(p1, p2);
      this.draw.segment(arc.c, arc.startAngle, arc.endAngle, colour);
    }
  }

  //calculate greatCircle, startAngle and endAngle for hyperbolic arc
  arc(p1, p2) {
    //check that the points are in the disk
    if(this.checkPoints(p1, p2)){
      return false
    }
    let alpha1, alpha2, startAngle, endAngle;
    const c = E.greatCircle(p1, p2, this.radius, this.centre);

    const oy = c.centre.y;
    const ox = c.centre.x;

    //point at 0 radians on c
    const p3 = {
      x: ox + c.radius,
      y: oy
    }

    //calculate the position of each point in the circle
    alpha1 = E.centralAngle(p3, p1, c.radius);
    alpha1 = (p1.y < oy) ? 2 * Math.PI - alpha1 : alpha1;
    alpha2 = E.centralAngle(p3, p2, c.radius);
    alpha2 = (p2.y < oy) ? 2 * Math.PI - alpha2 : alpha2;

    //case where p1 above and p2 below the line c.centre -> p3
    if ((p1.x > ox && p2.x > ox) && (p1.y < oy && p2.y > oy)) {
      startAngle = alpha1;
      endAngle = alpha2;
    }
    //case where p2 above and p1 below the line c.centre -> p3
    else if ((p1.x > ox && p2.x > ox) && (p1.y > oy && p2.y < oy)) {
      startAngle = alpha2;
      endAngle = alpha1;
    }
    //points in clockwise order
    else if (alpha1 > alpha2) {
      startAngle = alpha2;
      endAngle = alpha1;
    }
    //points in anticlockwise order
    else {
      startAngle = alpha1;
      endAngle = alpha2;
    }

    return {
      c: c,
      startAngle: startAngle,
      endAngle: endAngle
    }
  }

  polygonOutline(vertices, colour) {
    const l = vertices.length;
    for (let i = 0; i < l; i++) {
      this.drawArc(vertices[i], vertices[(i + 1) % l], colour);
    }
  }

  polygon(vertices) {
    const edges = [];
    const l = vertices.length;
    for (let i = 0; i < l; i++) {
      edges.push(this.arc(vertices[i], vertices[(i + 1) % l]));
    }
    this.draw.polygon(edges);
  }

  //return true if any of the points is not in the disk
  checkPoints(...points) {
    const r = this.radius;
    let test = false;
    for(let point of points){
      if (E.distance(point, this.centre) > r) {
        console.error('Error! Point (' + point.x + ', ' + point.y + ') lies outside the plane!');
        test = true;
      }
    }
    if(test) return true
    else return false
  }
}
