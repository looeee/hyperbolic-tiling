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
// *  Poincare Disk representation of the hyperbolic plane. Contains any
// *  functions used to draw to the disk which are then passed to Three.js
// *  Also responsible for checking whether elements are on the unit Disk
// *  and resizing them if they are
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
    let p;
    if (point.isOnUnitDisk) {
      p = point.fromUnitDisk();
      this.draw.disk(p, radius, color, false);
    }
    else {
      p = point;
    }

    if (this.checkPoints(p)) {
      return false
    }

    this.draw.disk(point, radius, color, false);
  }

  //Draw an arc (hyperbolic line segment) between two points on the disk
  drawArc(arc, color) {
    console.log(arc);
    //if (this.checkPoints(arc.p1, arc.p2)) {
    //  return false
    //}

    if (arc.straightLine) {
      this.draw.line(arc.p1, arc.p2, color);
    }
    else {
      this.draw.segment(arc.circle, arc.startAngle, arc.endAngle, color);
    }
  }

  drawPolygonOutline(polygon, color) {
    //resize if polygon is on unit disk
    let p;
    if (polygon.isOnUnitDisk) p = polygon.fromUnitDisk();
    else p = polygon;

    if (this.checkPoints(p.vertices)) {
      return false
    }

    const l = p.vertices.length;
    for (let i = 0; i < l; i++) {
      const arc = new Arc(p.vertices[i], p.vertices[(i + 1) % l])
      this.drawArc(arc, color);
    }
  }

  drawPolygon(polygon, color, texture, wireframe) {
    //resize if polygon is on unit disk
    //let p;
    //if (polygon.isOnUnitDisk) p = polygon.fromUnitDisk();
    //else p = polygon;
    //if (this.checkPoints(p.vertices)) {
    //  return false
    //}
    const p = polygon;

    const points = p.spacedPointsOnEdges();
    const centre = p.barycentre();
    this.draw.polygon(points, centre, color, texture, wireframe);

  }

  //return true if any of the points is not in the disk
  checkPoints(...points) {
    //pass in either a list of points or an array
    if (points[0] instanceof Array) points = points[0];

    let test = false;
    for (let i = 0; i < points.length; i++) {
      if (E.distance(points[i], this.centre) > 1) {
        console.error('Error! Point (' + points[i].x + ', ' + point[i].y + ') lies outside the plane!');
        test = true;
      }
    }
    if (test) return true
    else return false
  }
}
