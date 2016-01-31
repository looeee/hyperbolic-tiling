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
    this.radius = this.radius / 2;

    this.drawDisk();

    this.testing();
  }

  testing() {
    const p1 = {
      x: 0,
      y: 150
    };
    const p2 = {
      x: -50,
      y: 50
    };
    const p3 = {
      x: -50,
      y: -50
    };

    //this.point(p1, 4, 0x000fff);
    //this.point(p2, 4, 0xf0ff0f);
    //this.point(p3, 4, 0xf00fff);

    //this.arc(p2, p1, 0x000fff);

    //this.arc(p3, p2, 0xf00f0f);

    this.polygonOutline([p1,p2,p3], 0xf00f0f)
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
    let c = E.greatCircle(p1, p2, this.radius, this.centre);
    let points = E.circleIntersect(this.centre, c.centre, this.radius, c.radius);

    this.arc(points.p1, points.p2, colour)
  }

  //Draw an arc (hyperbolic line segment) between two points on the disk
  arc(p1, p2, colour) {
    let alpha1, alpha2, startAngle, endAngle;
    let col = colour || 'black';

    if (E.throughOrigin(p1, p2)) {
      this.draw.line(p1, p2, col);
      return;
    }

    let c = E.greatCircle(p1, p2, this.radius, this.centre);

    //point at 0 radians on c
    let p3 = {
      x: c.centre.x + c.radius,
      y: c.centre.y
    }

    this.point(p1, 4, 0xf0ff0f);
    this.point(p2, 4, 0xf0000f);
    this.point(p3, 4, 0xffffff);

    const oy = c.centre.y;
    const ox = c.centre.x;

    //calculate the position of each point in the circle
    alpha1 = E.centralAngle(p3, p1, c.radius);
    alpha1 = (p1.y < c.centre.y) ? 2 * Math.PI - alpha1 : alpha1;
    alpha2 = E.centralAngle(p3, p2, c.radius);
    alpha2 = (p2.y < c.centre.y) ? 2 * Math.PI - alpha2 : alpha2;

    //case where p1 above and p2 below the line c.centre -> p
    if ( (p1.x > ox && p2.x > ox) && (p1.y < oy && p2.y > oy) ) {
      //console.log('case 1'); //Working
      startAngle = alpha1;
      endAngle = alpha2;
    }
    //case where p2 above and p1 below the line c.centre -> p
    else if( (p1.x > ox && p2.x > ox) && (p1.y > oy && p2.y < oy) ){
      //console.log('case 1a'); //Working
      startAngle = alpha2;
      endAngle = alpha1;
    }
    //points in clockwise order
    else if(alpha1 > alpha2){
      console.log('case 2'); //working
      startAngle = alpha2;
      endAngle = alpha1;
    }
    //points in anticlockwise order
    else{
      console.log('case 3'); //working
      startAngle = alpha1;
      endAngle = alpha2;
    }

    console.log(startAngle, endAngle);
    this.draw.segment(c, startAngle, endAngle, colour);

  }

  polygonOutline(vertices, colour) {
    let l = vertices.length;
    for (let i = 0; i < l; i++) {
      this.arc(vertices[i], vertices[(i + 1) % l], colour);
    }
  }

  //return true if the point is not in the disk
  checkPoint(point) {
    let r = this.radius;
    if (E.distance(point, this.centre) > r) {
      console.error('Error! Point (' + point.x + ', ' + point.y + ') lies outside the plane!');
      return true;
    }
    return false;
  }
}
