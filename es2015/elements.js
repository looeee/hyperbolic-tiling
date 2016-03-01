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

    //start with z = 0; this will used to transform to/from hyperboloid form
    this.z = 0;
  }

  //compare two points taking rounding errors into account
  compare(otherPoint) {
    if (typeof otherPoint === 'undefined') {
      console.warn('Warning: point not defined.')
      return false;
    }
    const t1 = this.toFixed(12);
    const t2 = otherPoint.toFixed(12);

    if (this.p1.x === otherPoint.x && this.p1.y === otherPoint.y) return true;
    else return false;
  }

  //move the point to hyperboloid (Weierstrass) space, apply the transform,
  //then move back
  transform(transform) {
    const mat = transform.matrix;
    const p = this.poincareToHyperboloid();
    const x = p.x * mat[0][0] + p.y * mat[0][1] + p.z * mat[0][2];
    const y = p.x * mat[1][0] + p.y * mat[1][1] + p.z * mat[1][2];
    const z = p.x * mat[2][0] + p.y * mat[2][1] + p.z * mat[2][2];
    const q =  new Point(x, y);
    q.z = z;
    return q.hyperboloidToPoincare();
  }

  poincareToHyperboloid() {
    const factor = 1 / (1 - this.x * this.x - this.y * this.y);
    const x = 2 * factor * this.x;
    const y = 2 * factor * this.y;
    const z = factor * (1 + this.x * this.x + this.y * this.y);
    const p = new Point(x, y);
    p.z = z;
    return p;
  }

  hyperboloidToPoincare() {
    const factor = 1 / (1 + this.z);
    const x = factor * this.x;
    const y = factor * this.y;
    return new Point(x, y);
  }

  clone(){
    return new Point(this.x, this.y);
  }

  //check that the point lies in the unit disk and warn otherwise
  //(don't check points that are in hyperboloid form with z !==0)
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
      this.arcLength = E.distance(startPoint, endPoint);
    }
    else{
      this.calculateArc();
      this.arcLength = E.arcLength(this.circle, this.startAngle, this.endAngle);
    }
  }

  //Calculate the arc using Dunham's method
  calculateArc(){
    //calculate centre of arcCircle relative to unit disk
    const wq1 = this.startPoint.poincareToHyperboloid();
    const wq2 = this.endPoint.poincareToHyperboloid();
    const wcp = this.hyperboloidCrossProduct(wq1, wq2);

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

    //TODO test if angles need to be set by cw here
    //if (cw) {
    this.startAngle = alpha;
    this.endAngle = beta;
    //} else {
    //  this.startAngle = beta;
    //  this.endAngle = alpha;
    //}

    this.circle = arcCircle;
    this.clockwise = cw;
    this.straightLine = false;
  }

  hyperboloidCrossProduct(point3D_1, point3D_2){
    let h = {
      x: point3D_1.y * point3D_2.z - point3D_1.z * point3D_2.y,
      y: point3D_1.z * point3D_2.x - point3D_1.x * point3D_2.z,
      z: -point3D_1.x * point3D_2.y + point3D_1.y * point3D_2.x
    };
    return h;
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
    //This set the spacing between vertices along the arcs of the polygons
    this.spacing = 0.11;
    this.spacedPoints();
  }

  spacedPoints() {
    this.points = [];
    //push the first vertex
    this.points.push(this.arc.startPoint);

     //tiny pgons near the edges of the disk don't need to be subdivided
    if(E.distance(this.arc.startPoint, this.arc.endPoint) > this.spacing){
      if (!this.arc.straightLine) {
        this.pointsOnArc();
      }
      else {
        this.pointsOnStraightLine();
      }
    }

    //push the final vertex
    this.points.push(this.arc.endPoint);
  }

  pointsOnStraightLine(){
    let p = E.spacedPointOnLine(this.arc.startPoint, this.arc.endPoint, this.spacing).p2;
    this.points.push(p);
    while (E.distance(p, this.arc.endPoint) > this.spacing) {
      p = E.spacedPointOnLine(p, this.arc.startPoint, this.spacing).p1;
      this.points.push(p);
    }
  }

  pointsOnArc(){
    let p;
    if (this.arc.clockwise) p = E.spacedPointOnArc(this.arc.circle, this.arc.startPoint, this.spacing).p1;
    else p = E.spacedPointOnArc(this.arc.circle, this.arc.startPoint, this.spacing).p2;

    this.points.push(p);

    while (E.distance(p, this.arc.endPoint) > this.spacing) {
      if (this.arc.clockwise) p = E.spacedPointOnArc(this.arc.circle, p, this.spacing).p1;
      else p = E.spacedPointOnArc(this.arc.circle, p, this.spacing).p2;
      this.points.push(p);
    }
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
//@param materialIndex: which material from THREE.Multimaterial to use
export class Polygon {
  constructor(vertices, materialIndex = 0) {
    this.materialIndex = materialIndex;
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
  transform(transform, materialIndex = this.materialIndex) {
    const newVertices = [];
    for (let i = 0; i < this.vertices.length; i++) {
      newVertices.push(this.vertices[i].transform(transform));
    }
    return new Polygon(newVertices, materialIndex);
  }

  //Incentre of triangular polygon
  centre() {
    const a = E.distance(this.vertices[0], this.vertices[1]);
    const b = E.distance(this.vertices[1], this.vertices[2]);
    const c = E.distance(this.vertices[0], this.vertices[2]);
    const x = (a*this.vertices[2].x + b*this.vertices[0].x + c*this.vertices[1].x)/(a+b+c);
    const y = (a*this.vertices[2].y + b*this.vertices[0].y + c*this.vertices[1].y)/(a+b+c);
    return new Point(x, y);

  }
}

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
    this.centre = new Point(0, 0);
    this.drawDisk();
  }

  //draw the disk background
  drawDisk() {
    this.draw.disk(this.centre, 1, 0x00baff);
  }

  drawPoint(point, radius, color) {
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
