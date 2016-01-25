import * as E from './euclid';
import { Canvas } from './canvas';

// * ***********************************************************************
// *
// *   DISK CLASS
// *   Poincare Disk representation of the hyperbolic plane
// *   Contains any functions used to draw to the disk
// *   Constructor takes the drawing class as an argument
// *   (Currently only Canvas used, might switch to WebGL in future)
// *************************************************************************
export class Disk {
  constructor(drawClass) {
    drawClass = drawClass || 'canvas';
    if(drawClass === 'canvas'){
      this.draw = new Canvas();
    }
    this.centre = {
      x: 0,
      y: 0
    }

    //draw largest circle possible given window dims
    this.radius = (window.innerWidth < window.innerHeight) ? (window.innerWidth / 2) - 5 : (window.innerHeight / 2) - 5;

    //smaller circle for testing
    // /this.radius = this.radius / 3;

    this.color = 'black';
  }

  //draw the boundary circle
  outerCircle() {
    this.draw.circle({x: this.centre.x, y: this.centre.y}, this.radius);
  }

  //draw a hyperbolic line between two points on the boundary circle
  line(p1, p2, colour) {
    //let pts = this.prepPoints(p1, p2);
    //p1 = pts.p1;
    //p2 = pts.p2;
    let col = colour || 'black';
    let c, points;

    if(E.throughOrigin(p1,p2)){
      let u = normalVector(p1,p2);
      points = {
        p1: {
          x: u.x * this.radius,
          y: u.y * this.radius
        },
        p2: {
          x: -u.x * this.radius,
          y: -u.y * this.radius
        }
      }
      this.draw.euclideanLine(points.p1,points.p2, col);
    }
    else{
      c = E.greatCircle(p1, p2, this.radius, this.centre);
      points = E.circleIntersect(this.centre, c.centre, this.radius, c.radius);

      //angle subtended by the arc
      let alpha = E.centralAngle(points.p1, points.p2, c.radius);

      let offset = this.alphaOffset(points.p2, points.p2, c, 'line');
      this.draw.segment(c, alpha, offset, col);
    }
  }

  //calculate the offset (position around the circle from which to start the
  //line or arc). As canvas draws arcs clockwise by default this will change
  //depending on where the arc is relative to the origin
  //specificall whether it lies on the x axis, or above or below it
  //type = 'line' or 'arc'
  alphaOffset(p1, p2, c, type) {
    let offset;

    //points at 0 radians on greatCircle
    let p = {
      x: c.centre.x + c.radius,
      y: c.centre.y
    }

    if(p1.y < c.centre.y){
      offset = 2*Math.PI - E.centralAngle(p1, p, c.radius);
    }
    else{
      offset = E.centralAngle(p1, p, c.radius);
    }

    return offset;
  }

  //put points in clockwise order
  prepPoints(p1, p2, c){
    const p = {x: c.centre.x + c.radius, y: c.centre.y};
    //case where points are above and below the line c.centre -> p
    //in this case just return points
    const oy = c.centre.y;
    const ox = c.centre.x;

    if(p1.x > ox && p2.x > ox){
      if(p1.y > oy && p2.y < oy) return {p1: p2, p2: p1};
      else if(p1.y < oy && p2.y > oy) return {p1: p1, p2: p2};
    }

    let alpha1 = E.centralAngle(p, p1, c.radius);
    alpha1 = (p1.y < c.centre.y) ? 2*Math.PI - alpha1 : alpha1;
    let alpha2 = E.centralAngle(p, p2, c.radius);
    alpha2 = (p2.y < c.centre.y) ? 2*Math.PI - alpha2 : alpha2;

    //if the points are not in clockwise order flip them
    if(alpha1 > alpha2) return {p1: p2, p2: p1};
    else return {p1: p1, p2: p2};

  }

  //Draw an arc (hyperbolic line segment) between two points on the disk
  arc(p1, p2, colour) {
    if(E.throughOrigin(p1,p2)){
      this.draw.euclideanLine(p1,p2, colour);
      return;
    }
    let col = colour || 'black';
    let c = E.greatCircle(p1, p2, this.radius, this.centre);
    let pts = this.prepPoints(p1, p2, c);
    p1 = pts.p1;
    p2 = pts.p2;

    //length of the arc
    let alpha = E.centralAngle(p1, p2, c.radius);

    //how far around the greatCircle to start drawing the arc
    let offset = this.alphaOffset(p1, p2, c, 'arc');
    this.draw.segment(c, alpha, offset, colour);
  }

  polygon(vertices, colour) {
    let l = vertices.length;
    for (let i = 0; i < l; i++) {
      this.arc(vertices[i], vertices[(i + 1)%l], colour);
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
