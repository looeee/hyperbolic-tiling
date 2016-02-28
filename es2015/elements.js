import * as E from './euclid';
import { ThreeJS } from './threejs';

// * ***********************************************************************
// * ***********************************************************************
// * ***********************************************************************
// *
// *   HYPERBOLIC ELEMENT CLASSES
// *
// *************************************************************************
// * ***********************************************************************
// * ***********************************************************************

// * ***********************************************************************
// *
// *   POINT CLASS
// *   2D point class
// *
// *************************************************************************

export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.checkPoint();

    //start with z = 0; this will used to transform to/from Weierstrass form
    this.z = 0;
  }

  toFixed(places) {
    this.x = E.toFixed(this.x, places);
    this.y = E.toFixed(this.y, places);
  }

  //compare two points taking rounding errors into account
  compare(p2) {
    if (typeof p2 === 'undefined') {
      console.warn('Warning: point not defined.')
      return false;
    }
    const t1 = this.toFixed(12);
    const t2 = p2.toFixed(12);

    if (this.p1.x === p2.x && this.p1.y === p2.y) return true;
    else return false;
  }

  //move the point to Hyperboloid (Weierstrass) space, apply the transform,
  //then move back
  transform(transform) {
    const mat = transform.matrix;
    const p = this.poincareToWeierstrass();
    const x = p.x * mat[0][0] + p.y * mat[0][1] + p.z * mat[0][2];
    const y = p.x * mat[1][0] + p.y * mat[1][1] + p.z * mat[1][2];
    const z = p.x * mat[2][0] + p.y * mat[2][1] + p.z * mat[2][2];
    const q =  new Point(x, y);
    q.z = z;
    return q.weierstrassToPoincare();
  }

  poincareToWeierstrass() {
    const factor = 1 / (1 - this.x * this.x - this.y * this.y);
    const x = 2 * factor * this.x;
    const y = 2 * factor * this.y;
    const z = factor * (1 + this.x * this.x + this.y * this.y);
    const p = new Point(x, y);
    p.z = z;
    return p;
  }

  weierstrassToPoincare() {
    const factor = 1 / (1 + this.z);
    const x = factor * this.x;
    const y = factor * this.y;
    return new Point(x, y);
  }

  clone(){
    return new Point(this.x, this.y);
  }

  //check that the point lies in the unit disk and warn otherwise
  //(don't check points that are in Weierstrass form with z !==0)
  checkPoint(){
    if (this.z === 0 && E.distance(this, {x: 0, y:0 }) > 1) {
      console.warn('Error! Point (' + this.x + ', ' + this.y + ') lies outside the unit disk!');
    }
  }
}

// * ***********************************************************************
// *
// *   CIRCLE CLASS
// *
// *************************************************************************

export class Circle {
  constructor(centreX, centreY, radius) {
    this.centre = new Point(centreX, centreY);
    this.radius = radius;
  }
}

// * ***********************************************************************
// *
// *   ARC CLASS
// *
// *************************************************************************

export class Arc {
  constructor(startPoint, endPoint) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;

    if (E.throughOrigin(startPoint, endPoint)) {
      this.circle = new Circle(0, 0, 1);
      this.startAngle = 0;
      this.endAngle = 0;
      this.clockwise = false;
      this.straightLine = true;
    }
    else{
      this.hyperbolicMethod();
    }
  }

  //Calculate the arc using Dunham's method
  hyperbolicMethod(){
    //calculate centre of arcCircle relative to unit disk
    const wq1 = this.startPoint.poincareToWeierstrass();
    const wq2 = this.endPoint.poincareToWeierstrass();
    const wcp = this.weierstrassCrossProduct(wq1, wq2);
    const arcCentre = new Point(wcp.x / wcp.z, wcp.y / wcp.z, true);

    const arcRadius = Math.sqrt(Math.pow(this.startPoint.x - arcCentre.x, 2) + Math.pow(this.startPoint.y - arcCentre.y, 2));

    const arcCircle = new Circle(arcCentre.x, arcCentre.y, arcRadius, true);

    //translate points to origin and calculate arctan
    let alpha = Math.atan2(this.startPoint.y - arcCentre.y, this.startPoint.x - arcCentre.x);
    let beta = Math.atan2(this.endPoint.y - arcCentre.y, this.endPoint.x - arcCentre.x);

    //angles are in (-pi, pi), transform to (0,2pi)
    alpha = (alpha < 0) ? 2 * Math.PI + alpha : alpha;
    beta = (beta < 0) ? 2 * Math.PI + beta : beta;

    //check whether points are in clockwise order and assign angles accordingly
    const cw = E.clockwise(alpha, beta);
    if (cw) {
      this.startAngle = alpha;
      this.endAngle = beta;
    } else {
      this.startAngle = beta;
      this.endAngle = alpha;
    }

    this.circle = arcCircle;
    this.clockwise = cw;
    this.straightLine = false;
  }

  weierstrassCrossProduct(point3D_1, point3D_2){
    let r = {
      x: point3D_1.y * point3D_2.z - point3D_1.z * point3D_2.y,
      y: point3D_1.z * point3D_2.x - point3D_1.x * point3D_2.z,
      z: -point3D_1.x * point3D_2.y + point3D_1.y * point3D_2.x
    };
    return r;
  }
}

// * ***********************************************************************
// *
// *   EDGE CLASS
// *   Represents a polygon edge
// *
// *************************************************************************
class Edge {
  constructor(startPoint, endPoint) {
    this.arc = new Arc(startPoint, endPoint);

    this.points = [];
    this.spacedPoints();
  }

  spacedPoints() {
    const spacing = .05;

    //push the first vertex
    this.points.push(this.arc.startPoint);

     //tiny pgons near the edges of the disk don't need to be subdivided
    if(E.distance(this.arc.startPoint, this.arc.endPoint) > spacing){
      let p;
      //line not through the origin (hyperbolic arc)
      if (!this.arc.straightLine) {
        if (this.arc.clockwise) p = E.spacedPointOnArc(this.arc.circle, this.arc.startPoint, spacing).p1;
        else p = E.spacedPointOnArc(this.arc.circle, this.arc.startPoint, spacing).p2;

        this.points.push(p);

        while (E.distance(p, this.arc.endPoint) > spacing) {
          if (this.arc.clockwise) p = E.spacedPointOnArc(this.arc.circle, p, spacing).p1;
          else p = E.spacedPointOnArc(this.arc.circle, p, spacing).p2;
          this.points.push(p);
        }
      }

      //line through origin (straight line)
      else {
        p = E.spacedPointOnLine(this.arc.startPoint, this.arc.endPoint, spacing).p2;
        this.points.push(p);
        while (E.distance(p, this.arc.endPoint) > spacing) {
          p = E.spacedPointOnLine(p, this.arc.startPoint, spacing).p1;
          this.points.push(p);
        }
      }
    }
    this.points.push(this.arc.endPoint);

    return this.points;
  }

}

// * ***********************************************************************
// *
// *  POLYGON CLASS
// *
// *  NOTE: all polygons are assumed to be triangular
// *************************************************************************
//NOTE: sometimes polygons will be backwards facing. Solved with DoubleSide material
//but may cause problems
//@param vertices: array of Points
//@param upper: Bool, use upper or lower texture
export class Polygon {
  constructor(vertices, upper) {
    this.upper = upper || true;
    this.vertices = vertices;
    this.centre = this.centre();
    this.edges = [];
    this.addEdges();
  }

  addEdges(){
    for (let i = 0; i < this.vertices.length; i++) {
      this.edges.push(new Edge(this.vertices[i], this.vertices[(i+1)%this.vertices.length]))
    }
  }

  //Apply a Transform to the polygon
  transform(transform) {
    const newVertices = [];
    for (let i = 0; i < this.vertices.length; i++) {
      newVertices.push(this.vertices[i].transform(transform));
    }
    return new Polygon(newVertices);
  }

  //Find the incentre of triangular polygon
  centre() {
    const a = E.distance(this.vertices[0], this.vertices[1]);
    const b = E.distance(this.vertices[1], this.vertices[2]);
    const c = E.distance(this.vertices[0], this.vertices[2]);
    const x = (a*this.vertices[2].x + b*this.vertices[0].x + c*this.vertices[1].x)/(a+b+c);
    const y = (a*this.vertices[2].y + b*this.vertices[0].y + c*this.vertices[1].y)/(a+b+c);
    return new Point(x, y);

  }
}

/*
barycentre() {
  const l = this.vertices.length;
  const first = this.vertices[0];
  const last = this.vertices[l - 1];

  let twicearea = 0,
    x = 0,
    y = 0,
    p1, p2, f;
  for (let i = 0, j = l - 1; i < l; j = i++) {
    p1 = this.vertices[i];
    p2 = this.vertices[j];
    f = p1.x * p2.y - p2.x * p1.y;
    twicearea += f;
    x += (p1.x + p2.x) * f;
    y += (p1.y + p2.y) * f;
  }
  f = twicearea * 3;
  return new Point(x / f, y / f);
}
*/

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
    if (arc.straightLine) {
      this.draw.line(arc.p1, arc.p2, color);
    }
    else {
      this.draw.segment(arc.circle, arc.startAngle, arc.endAngle, color);
    }
  }

  drawPolygonOutline(polygon, color) {
    const l = polygon.vertices.length;
    for (let i = 0; i < l; i++) {
      const arc = new Arc(polygon.vertices[i], polygon.vertices[(i + 1) % l])
      this.drawArc(arc, color);
    }
  }

  drawPolygon(polygon, color, texture, wireframe) {
    this.draw.polygon(polygon, color, texture, wireframe);
  }
}
