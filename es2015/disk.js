import * as E from './euclid';
import * as H from './hyperbolic';
import {
  Polygon, Arc, Circle, Point
}
from './elements';
import { ThreeJS } from './threejs';

// * ***********************************************************************
// *
// *   DISK CLASS
// *   Poincare Disk representation of the hyperbolic plane
// *   Contains any functions used to draw to the disk
// *   which are then passed to ThreeJS
// *************************************************************************
export class Disk {
  constructor() {
    this.draw = new ThreeJS();

    window.addEventListener('load', (event) => {
      this.init();
    }, false);

    window.addEventListener('resize', () => {
      this.init();
    }, false);

  }

  init() {
    this.centre = new Point(0,0);

    //draw largest circle possible given window dims
    this.radius = (window.innerWidth < window.innerHeight) ? (window.innerWidth / 2) - 5 : (window.innerHeight / 2) - 5;

    this.circle = new Circle(this.centre.x, this.centre.y, this.radius);

    //smaller circle for testing
    //this.radius = this.radius / 2;

    this.drawDisk();
  }

  //draw the disk background
  drawDisk() {
    this.draw.disk(this.centre, this.radius, 0x000000);
  }

  drawPoint(centre, radius, color) {
    this.draw.disk(centre, radius, color, false);
  }

  //Draw an arc (hyperbolic line segment) between two points on the disk
  drawArc(p1, p2, colour) {
    //check that the points are in the disk
    if (this.checkPoints(p1, p2)) {
      return false
    }
    const col = colour || 0xffffff;
    const arc = new Arc(p1, p2, this.circle);

    if (arc.straightLine) {
      this.draw.line(p1, p2, col);
    } else {
      this.draw.segment(arc.circle, arc.startAngle, arc.endAngle, colour);
    }
  }

  drawPolygonOutline(polygon, colour) {
    //check that the points are in the disk
    if (this.checkPoints(polygon.vertices)) {
      return false
    }
    const l = polygon.vertices.length;
    for (let i = 0; i < l; i++) {
      this.drawArc(polygon.vertices[i], polygon.vertices[(i + 1) % l], colour);
    }
  }

  drawPolygon(polygon, color, texture, wireframe){
    //check that the points are in the disk
    if (this.checkPoints(polygon.vertices)) {
      return false
    }
    this.draw.polygon(polygon.points, polygon.centre, color, texture, wireframe);
    //TESTING
    //for(let point of polygon.points){
    //  this.drawPoint(point, 2);
    //}
  }

  //return true if any of the points is not in the disk
  checkPoints(...points) {
    //pass in either a list of points or an array
    if(points[0] instanceof Array) points = points[0];

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
