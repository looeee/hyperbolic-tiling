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
      this.curvature = (this.arcLength ) / (this.circle.radius);
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
    //subdivision spacing for edges
    this.spacing = (this.arc.arcLength > 0.03)
                  ? this.arc.arcLength / 5 //approx maximum that hides all gaps
                  : 0.02;

    //calculate the number of subdivisions required break the arc into an
    //even number of pieces (or 1 in case of tiny polygons)
    const subdivisions = (this.arc.arcLength > 0.01)
                    ? 2* Math.ceil( (this.arc.arcLength / this.spacing) / 2 )
                    : 1;

    this.numDivisions = numDivisions || subdivisions;

    //recalculate spacing based on number of points
    this.spacing = this.arc.arcLength / this.numDivisions;
  }

  //calculate the spacing for subdividing the edge into an even number of pieces.
  //For the first ( longest ) edge this will be calculated based on spacing
  //then for the rest of the edges it will be calculated based on the number of
  //subdivisions of the first edge ( so that all edges are divided into an equal
  // number of pieces)
  calculateExpandedSpacing( numDivisions ){
    //subdivision spacing for edges
    this.expandedSpacing = (this.arc.arcLength > 0.03 * radius)
                  ? this.arc.arcLength / 5 //approx maximum that hides all gaps
                  : 0.02 * radius;

    //calculate the number of subdivisions required break the arc into an
    //even number of pieces (or 1 in case of tiny polygons)
    const subdivisions = (this.arc.arcLength > 0.01 * radius)
                    ? 2* Math.ceil( (this.arc.arcLength / this.expandedSpacing) / 2 )
                    : 1;

    this.numDivisions = numDivisions || subdivisions;

    //recalculate spacing based on number of points
    this.expandedSpacing = this.arc.arcLength / this.numDivisions;
  }

  subdivideExpandedEdge( numDivisions ) {
    this.calculateExpandedSpacing( numDivisions );
    this.points = [this.arc.startPoint];

    //tiny pgons near the edges of the disk don't need to be subdivided
    if(this.arc.arcLength > this.expandedSpacing){
      let p = (!this.arc.straightLine)
              ? E.directedSpacedPointOnArc(this.arc.circle, this.arc.startPoint, this.arc.endPoint, this.expandedSpacing)
              : E.directedSpacedPointOnLine(this.arc.startPoint, this.arc.endPoint, this.expandedSpacing);
      this.points.push(p);

      for(let i = 0; i < this.numDivisions - 2; i++){
        p = (!this.arc.straightLine)
            ? E.directedSpacedPointOnArc(this.arc.circle, p, this.arc.endPoint, this.expandedSpacing)
            : E.directedSpacedPointOnLine(p, this.arc.endPoint, this.expandedSpacing);
        this.points.push(p);
      }
    }
    //push the final vertex
    this.points.push(this.arc.endPoint);
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

      for(let i = 0; i < this.numDivisions - 2; i++){
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
    this.findSubdivisionEdge();
    this.subdivideMesh();
    /*
    this.addExpandedVertices( radius );
    this.addExpandedEdges();
    this.findExpandedSubdivisionEdge();
    this.subdivideExpandedMesh();
    */
  }

  addEdges(){
    this.edges = [];
    for (let i = 0; i < this.vertices.length; i++) {
      this.edges.push(
        new Edge(this.vertices[i], this.vertices[(i+1) % this.vertices.length])
      )
    }
  }

  //The longest edge with radius > 0 should be used to calculate how the finely
  //the polygon gets subdivided
  findSubdivisionEdge(){
    const a = (this.edges[0].arc.curvature === 0)
              ? 0
              : this.edges[0].arc.arcLength;
    const b = (this.edges[1].arc.curvature === 0)
              ? 0
              : this.edges[1].arc.arcLength;
    const c = (this.edges[2].arc.curvature === 0)
              ? 0
              : this.edges[2].arc.arcLength;
    if( a > b && a > c) this.subdivisionEdge = 0;
    else if( b > c) this.subdivisionEdge = 1;
    else this.subdivisionEdge = 2;
  }

  //subdivide the subdivision edge, then subdivide the other two edges with the
  //same number of points as the subdivision
  subdivideEdges(){
    this.edges[this.subdivisionEdge].subdivideEdge();
    this.numDivisions = this.edges[this.subdivisionEdge].points.length -1;

    this.edges[(this.subdivisionEdge + 1) % 3].subdivideEdge(this.numDivisions);
    this.edges[(this.subdivisionEdge + 2) % 3].subdivideEdge(this.numDivisions);
  }

  subdivideMesh(){
    this.subdivideEdges();
    this.mesh = [].concat(this.edges[0].points);

    for(let i = 1; i < this.numDivisions; i++){
      const startPoint = this.edges[2].points[(this.numDivisions - i)];
      const endPoint = this.edges[1].points[i];
      this.subdivideInteriorArc(startPoint, endPoint, i);
    }

    //push the final vertex
    this.mesh.push(this.edges[2].points[0]);
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

/*
addExpandedVertices( newRadius){
  this.expandedVertices = [
    new Point(this.vertices[0].x * newRadius, this.vertices[0].y * newRadius),
    new Point(this.vertices[1].x * newRadius, this.vertices[1].y * newRadius),
    new Point(this.vertices[2].x * newRadius, this.vertices[2].y * newRadius)
  ]
}

addExpandedEdges(){
  this.expandedEdges = [
    new Edge(this.expandedVertices[0], this.expandedVertices[1]),
    new Edge(this.expandedVertices[1], this.expandedVertices[2]),
    new Edge(this.expandedVertices[2], this.expandedVertices[0]),
  ];
}

//The longest edge with radius > 0 should be used to calculate how the finely
//the polygon gets subdivided
findExpandedSubdivisionEdge(){
  const a = (this.expandedEdges[0].arc.curvature === 0)
            ? 0
            : this.expandedEdges[0].arc.arcLength;
  const b = (this.expandedEdges[1].arc.curvature === 0)
            ? 0
            : this.expandedEdges[1].arc.arcLength;
  const c = (this.expandedEdges[2].arc.curvature === 0)
            ? 0
            : this.expandedEdges[2].arc.arcLength;
  if( a > b && a > c) this.expandedSubdivisionEdge = 0;
  else if( b > c) this.expandedSubdivisionEdge = 1;
  else this.expandedSubdivisionEdge = 2;
}

//subdivide the subdivision edge, then subdivide the other two edges with the
//same number of points as the subdivision
subdivideExpandedEdges(){
  this.expandedEdges[this.expandedSubdivisionEdge].subdivideExpandedEdge();
  this.expandedNumDivisions = this.expandedEdges[this.expandedSubdivisionEdge].points.length -1;

  this.expandedEdges[(this.expandedSubdivisionEdge + 1) % 3].subdivideExpandedEdge(this.numDivisions);
  this.expandedEdges[(this.expandedSubdivisionEdge + 2) % 3].subdivideExpandedEdge(this.numDivisions);
}

subdivideExpandedMesh(){
  this.subdivideExpandedEdges();
  this.expandedMesh = [].concat(this.expandedEdges[0].points);

  for(let i = 1; i < this.expandedNumDivisions; i++){
    const startPoint = this.expandedEdges[2].points[(this.expandedNumDivisions - i)];
    const endPoint = this.expandedEdges[1].points[i];
    //console.log(startPoint, endPoint);
    this.subdivideInteriorExpandedArc(startPoint, endPoint, i);
  }

  //push the final vertex
  this.expandedMesh.push(this.expandedEdges[2].points[0]);
}

//find the points along the arc between opposite subdivions of the second two
//edges of the polygon
subdivideInteriorExpandedArc(startPoint, endPoint, arcIndex){
  const circle = new Arc(startPoint, endPoint).circle;
  this.expandedMesh.push(startPoint);

  //for each arc, the number of divisions will be reduced by one
  const divisions = this.expandedNumDivisions - arcIndex;

  //if the line get divided add points along line to mesh
  if(divisions > 1){
    const spacing = E.distance(startPoint, endPoint) / (divisions);
    //let nextPoint = E.directedSpacedPointOnArc(circle, startPoint, endPoint, spacing);
    let nextPoint = E.directedSpacedPointOnLine(startPoint, endPoint, spacing);
    for(let j = 0; j < divisions -1 ; j++){
      this.expandedMesh.push(nextPoint);
      //nextPoint = E.directedSpacedPointOnArc(circle, nextPoint, endPoint, spacing);
      nextPoint = E.directedSpacedPointOnLine(nextPoint, endPoint, spacing);
    }
  }

  this.expandedMesh.push(endPoint);
}
*/
