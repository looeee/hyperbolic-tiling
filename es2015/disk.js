import * as E from './euclid';
import * as H from './hyperbolic';
import { Point } from './point';
import { ThreeJS } from './threejs';

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
      //window.removeEventListener('load');
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

  }

  //draw the disk background
  drawDisk() {
    this.draw.disk(this.centre, this.radius, 0x000000);
  }

  point(centre, radius, color) {
    this.draw.disk(centre, radius, color, false);
  }

  //draw a hyperbolic line between two points on the boundary circle
  //TODO: fix!
  line(p1, p2, color) {
    //const c = E.greatCircle(p1, p2, this.radius, this.centre);
    //const points = E.circleIntersect(this.centre, c.centre, this.radius, c.radius);

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

    if (arc.straightLine) {
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
  polygon(vertices, color, texture, wireframe) {
    const points = [];
    const spacing = 5;
    const l = vertices.length;
    for (let i = 0; i < l; i++) {
      let p;
      const arc = H.arc(vertices[i], vertices[(i + 1) % l], this.circle);

      //line not through the origin (hyperbolic arc)
      if (!arc.straightLine) {
        if(!arc.clockwise) p = E.spacedPointOnArc(arc.circle, vertices[i], spacing).p2;
        else p = E.spacedPointOnArc(arc.circle, vertices[i], spacing).p1;
        points.push(p);


        while (E.distance(p, vertices[(i + 1) % l]) > spacing) {
        //for(let i = 0; i< 10; i++){
          if(!arc.clockwise){
            p = E.spacedPointOnArc(arc.circle, p, spacing).p2;
          }
          else{
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
    for(let point of points){
      //if(point) this.point(point,2,0x10ded8);
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
