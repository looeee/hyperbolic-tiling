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
// *   Represents a point either in the Poincare Disk (2D)
// *   or Hyperboloid (Weierstrass) Space (3D)
// *   Default is in Poincare form with z = 0;
// *   NOTE: cannot be consrtucted in Hyperbolid form, only transformed using
// *   built in function
// *************************************************************************

export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.z = 0;
  }

  //compare two points taking rounding errors into account
  compare(otherPoint) {
    if (typeof otherPoint === 'undefined') {
      console.warn('Compare Points: point not defined.')
      return false;
    }
    const a = E.toFixed(this.x) === E.toFixed(otherPoint.x);
    const b = E.toFixed(this.y) === E.toFixed(otherPoint.y);
    if (a && b) return true;
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
}

// * ***********************************************************************
// *
// *   CIRCLE CLASS
// *   A circle in the Poincare disk is identical to a circle in Euclidean space
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
// *  ARC CLASS
// *  Represents a hyperbolic arc on the Poincare disk, which is a
// *  Euclidean straight line if it goes through the origin
// *
// *************************************************************************

export class Arc {
  constructor(startPoint, endPoint) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;

    if ( E.throughOrigin(startPoint, endPoint) ) {
      this.straightLine = true;
      this.arcLength = E.distance(startPoint, endPoint);
      this.curvature = 0;
    }
    else{
      this.calculateArc();
      this.arcLength = E.arcLength(this.circle, this.startAngle, this.endAngle);
      this.curvature = this.arcLength / this.circle.radius;
    }
  }

  //Calculate the arc using Dunham's method
  calculateArc(){
    //calculate centre of arcCircle relative to unit disk
    const hp = this.hyperboloidCrossProduct(
      this.startPoint.poincareToHyperboloid(),
      this.endPoint.poincareToHyperboloid()
    );

    const arcCentre = new Point(hp.x / hp.z, hp.y / hp.z);
    const arcRadius = Math.sqrt(
      Math.pow(this.startPoint.x - arcCentre.x, 2)
      + Math.pow(this.startPoint.y - arcCentre.y, 2)
    );

    //translate points to origin and calculate arctan
    this.startAngle = Math.atan2(
      this.startPoint.y - arcCentre.y,
      this.startPoint.x - arcCentre.x
    );
    this.endAngle = Math.atan2(
      this.endPoint.y - arcCentre.y,
      this.endPoint.x - arcCentre.x
    );

    //angles are in (-pi, pi), transform to (0,2pi)
    this.startAngle = (this.startAngle < 0)
                      ? 2 * Math.PI + this.startAngle
                      : this.startAngle;
    this.endAngle = (this.endAngle < 0)
                      ? 2 * Math.PI + this.endAngle
                      : this.endAngle;

    this.circle = new Circle(arcCentre.x, arcCentre.y, arcRadius);
  }

  hyperboloidCrossProduct(point3D_1, point3D_2){
    return {
      x: point3D_1.y * point3D_2.z - point3D_1.z * point3D_2.y,
      y: point3D_1.z * point3D_2.x - point3D_1.x * point3D_2.z,
      z: -point3D_1.x * point3D_2.y + point3D_1.y * point3D_2.x
    };
  }
}

// * ***********************************************************************
// *
// *   EDGE CLASS
// *   Represents a hyperbolic polygon edge
// *
// *************************************************************************
class Edge {
  constructor(startPoint, endPoint) {
    this.arc = new Arc(startPoint, endPoint);
  }

  //calculate the spacing for subdividing the edge into an even number of pieces.
  //For the first ( longest ) edge this will be calculated based on spacing
  //then for the rest of the edges it will be calculated based on the number of
  //subdivisions of the first edge ( so that all edges are divided into an equal
  // number of pieces)
  calculateSpacing( numDivisions ){
    //NOTE: this is the overall subdivision spacing for polygons.
    //Not the best, but the simplest place to define it
    //NOTE: a value of > ~0.01 is required to hide all gaps
    this.spacing = 0.01;

    //calculate the number of subdivisions required break the arc into an
    //even number of pieces with each <= this.spacing
    this.numDivisions = numDivisions || 2* Math.ceil( (this.arc.arcLength / this.spacing) / 2 );

    //recalculate spacing based on number of points
    this.spacing = this.arc.arcLength / this.numDivisions;
  }

  subdivideEdge( numDivisions ) {
    this.calculateSpacing( numDivisions );

    this.points = [this.arc.startPoint];

    //tiny pgons near the edges of the disk don't need to be subdivided
    if(this.arc.arcLength > this.spacing){

      let p = (!this.arc.straightLine)
              ? E.directedSpacedPointOnArc(this.arc.circle, this.arc.startPoint, this.arc.endPoint, this.spacing)
              : E.directedSpacedPointOnLine(this.arc.startPoint, this.arc.endPoint, this.spacing);

      this.points.push(p);

      for(let i = 0; i < this.numDivisions -2; i++){
        p = (!this.arc.straightLine)
            ? E.directedSpacedPointOnArc(this.arc.circle, p, this.arc.endPoint, this.spacing)
            : E.directedSpacedPointOnLine(p, this.arc.endPoint, this.spacing);
        this.points.push(p);
      }

    }

    //push the final vertex
    this.points.push(this.arc.endPoint);
  }
}

// * ***********************************************************************
// *
// *  (TRIANGULAR) POLYGON CLASS
// *
// *************************************************************************
//NOTE: sometimes polygons will be backwards facing. Solved with DoubleSide material
//but may cause problems
//@param vertices: array of Points
//@param materialIndex: which material from THREE.Multimaterial to use
//TODO: the subdivion mesh is calculated in the unit disk then mapped to screen coords
//by ThreeJS class. This is very inefficient. Better to do the multiplication as the mesh is
//being generated
export class Polygon {
  constructor(vertices, materialIndex = 0) {
    this.materialIndex = materialIndex;
    this.vertices = vertices;
    this.addEdges();
    this.findLongestEdge();
    
    //if(this.edges[0].arc.arcLength > 0.02){
    this.subdivideMesh();
    //}
    //else this.mesh = this.vertices;
  }

  addEdges(){
    this.edges = [];
    for (let i = 0; i < this.vertices.length; i++) {
      this.edges.push(
        new Edge(this.vertices[i], this.vertices[(i+1)%this.vertices.length])
      )
    }
  }

  findCurviestEdge(){
    const a = this.edges[0].arc.curvature;
    const b = this.edges[1].arc.curvature;
    const c = this.edges[2].arc.curvature;

    if( a > b && a > c) this.curviestEdge = 0;
    else if( b > c) this.curviestEdge = 1;
    else this.curviestEdge = 2;
  }

  findLongestEdge(){
    const a = this.edges[0].arc.arcLength;
    const b = this.edges[1].arc.arcLength;
    const c = this.edges[2].arc.arcLength;

    if( a > b && a > c) this.longestEdge = 0;
    else if( b > c) this.longestEdge = 1;
    else this.longestEdge = 2;
  }

  //subdivide the longest edge, then subdivide the other two edges with the
  //same number of points as the longest
  subdivideEdges(){
    this.edges[this.longestEdge].subdivideEdge();

    this.numDivisions = this.edges[this.longestEdge].points.length -1;

    this.edges[(this.longestEdge + 1) % 3].subdivideEdge(this.numDivisions);
    this.edges[(this.longestEdge + 2) % 3].subdivideEdge(this.numDivisions);
  }

  subdivideMesh(){
    this.subdivideEdges();
    this.mesh = [];
    this.mesh = [].concat(this.edges[this.longestEdge].points);

    let edge1, edge2;
    if(this.edges[(this.longestEdge + 1) % 3].points[0].compare(this.mesh[0])){
      edge2 = this.edges[(this.longestEdge + 1) % 3];
      edge3 = this.edges[(this.longestEdge + 2) % 3];
    }
    else{
      edge3 = this.edges[(this.longestEdge + 1) % 3];
      edge2 = this.edges[(this.longestEdge + 2) % 3];
    }

    for(let i = 1; i < this.numDivisions; i++){
      const startPoint = edge2.points[(this.numDivisions - i)];
      const endPoint = edge3.points[i];
      this.subdivideInteriorArc(startPoint, endPoint, i);
    }

    //push the final vertex
    this.mesh.push(edge2.points[0]);
  }

  //find the points along the arc between opposite subdivions of the second two
  //edges of the polygon
  subdivideInteriorArc(startPoint, endPoint, arcIndex){
    const circle = new Arc(startPoint, endPoint).circle;
    this.mesh.push(startPoint);

    //for each arc, the number of divisions will be reduced by one
    const divisions = this.numDivisions - arcIndex;

    //if the line get divided add points along line to mesh
    if(divisions > 1){
      const spacing = E.distance(startPoint, endPoint) / (divisions);
      let nextPoint = E.directedSpacedPointOnArc(circle, startPoint, endPoint, spacing);
      for(let j = 0; j < divisions -1 ; j++){
        this.mesh.push(nextPoint);
        nextPoint = E.directedSpacedPointOnArc(circle, nextPoint, endPoint, spacing);
      }
    }

    this.mesh.push(endPoint);
  }

  //Apply a Transform to the polygon
  transform(transform, materialIndex = this.materialIndex) {
    const newVertices = [];
    for (let i = 0; i < this.vertices.length; i++) {
      newVertices.push(this.vertices[i].transform(transform));
    }
    return new Polygon(newVertices, materialIndex);
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
    this.draw.disk(this.centre, 1, 0);
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

//Incentre of triangular polygon
findCentre() {
  const a = E.distance(this.vertices[0], this.vertices[1]);
  const b = E.distance(this.vertices[1], this.vertices[2]);
  const c = E.distance(this.vertices[0], this.vertices[2]);
  const x = (a*this.vertices[2].x + b*this.vertices[0].x + c*this.vertices[1].x)/(a+b+c);
  const y = (a*this.vertices[2].y + b*this.vertices[0].y + c*this.vertices[1].y)/(a+b+c);
  this.centre = new Point(x, y);
}
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
