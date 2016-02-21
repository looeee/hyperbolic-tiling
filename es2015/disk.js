import * as E from './euclid';
import {
  Polygon, Arc, Circle, Point
}
from './elements';
import {
  ThreeJS
}
from './threejs';

// * ***********************************************************************
// *
// *  DISK CLASS
// *  Poincare Disk representation of the hyperbolic plane (as the unit disk).
// *  Contains any functions used to draw to the disk which check the element
// *  to be drawn lie on the disk then passes them to Three.js for drawing
// *
// *************************************************************************
export class Disk {
  constructor() {
    this.draw = new ThreeJS();

    this.init();
  }

  init() {
    this.centre = new Point(0, 0);
    this.drawDisk();
  }

  //draw the disk background
  drawDisk() {
    this.draw.disk(this.centre, 1, 0x000000);
  }

  drawPoint(point, radius, color) {
    if (this.checkPoints(point)) {
      return false
    }
    this.draw.disk(point, radius, color, false);
  }

  //Draw an arc (hyperbolic line segment) between two points on the disk
  drawArc(arc, color) {
    if (this.checkPoints(arc.p1, arc.p2)) {
      return false
    }
    if (arc.straightLine) {
      this.draw.line(arc.p1, arc.p2, color);
    }
    else {
      this.draw.segment(arc.circle, arc.startAngle, arc.endAngle, color);
    }
  }

  drawPolygonOutline(polygon, color) {
    if (this.checkPoints(polygon.vertices)) {
      return false
    }
    const l = polygon.vertices.length;
    for (let i = 0; i < l; i++) {
      const arc = new Arc(polygon.vertices[i], polygon.vertices[(i + 1) % l])
      this.drawArc(arc, color);
    }
  }

  drawPolygon(polygon, color, texture, wireframe) {
    if (this.checkPoints(polygon.vertices)) {
      return false
    }
    //const points = polygon.spacedPointsOnEdges();
    //const centre = polygon.barycentre();
    //this.draw.polygon(points, centre, color, texture, wireframe);
    this.draw.polygon(polygon, color, texture, wireframe);
  }

  //return true if any of the points is not in the disk
  checkPoints(...points) {
    //pass in either a list of points or an array
    if (points[0] instanceof Array) points = points[0];

    let test = false;
    for (let i = 0; i < points.length; i++) {
      if (E.distance(points[i], this.centre) > 1) {
        console.error('Error! Point (' + points[i].x + ', ' + points[i].y + ') lies outside the plane!');
        test = true;
      }
    }
    if (test) return true
    else return false
  }
}
