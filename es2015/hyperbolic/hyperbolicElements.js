/* hyperbolicELements.js */

import * as E from '../universal/mathFunctions';
import {
  Point, Circle,
} from '../universal/universalElements';

// * ***********************************************************************
// *
// *  HYPERBOLIC ARC CLASS
// *  Represents a hyperbolic arc on the Poincare disk, which is a
// *  Euclidean straight line if it goes through the origin
// *
// *************************************************************************

class HyperbolicArc {
  constructor(startPoint, endPoint) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;

    if (E.throughOrigin(startPoint, endPoint)) {
      this.straightLine = true;
      this.arcLength = E.distance(startPoint, endPoint);
      this.curvature = 0;
    }
    else {
      this.calculateArc();
      this.arcLength = E.arcLength(this.circle, this.startAngle, this.endAngle);
      this.curvature = (this.arcLength) / (this.circle.radius);
    }
  }

  //Calculate the arc using Dunham's method
  calculateArc() {
    //calculate centre of the circle the arc lies on relative to unit disk
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

  hyperboloidCrossProduct(point3D1, point3D2) {
    return {
      x: point3D1.y * point3D2.z - point3D1.z * point3D2.y,
      y: point3D1.z * point3D2.x - point3D1.x * point3D2.z,
      z: -point3D1.x * point3D2.y + point3D1.y * point3D2.x,
    };
  }
}

// * ***********************************************************************
// *
// *   EDGE CLASS
// *   Represents a hyperbolic polygon edge
// *
// *************************************************************************
class HyperbolicEdge {
  constructor(startPoint, endPoint) {
    this.arc = new HyperbolicArc(startPoint, endPoint);
  }

  //calculate the spacing for subdividing the edge into an even number of pieces.
  //For the first ( longest ) edge this will be calculated based on spacing
  //then for the rest of the edges it will be calculated based on the number of
  //subdivisions of the first edge ( so that all edges are divided into an equal
  // number of pieces)
  calculateSpacing(numDivisions) {
    //subdivision spacing for edges
    this.spacing = (this.arc.arcLength > 0.03)
                  ? this.arc.arcLength / 5 //approx maximum that hides all gaps
                  : 0.02;

    //calculate the number of subdivisions required to break the arc into an
    //even number of pieces (or 1 in case of tiny polygons)
    const subdivisions = (this.arc.arcLength > 0.01)
                    ? 2 * Math.ceil((this.arc.arcLength / this.spacing) / 2)
                    : 1;

    this.numDivisions = numDivisions || subdivisions;

    //recalculate spacing based on number of points
    this.spacing = this.arc.arcLength / this.numDivisions;
  }

  //Subdivide the edge into lengths calculated by calculateSpacing()
  subdivideEdge(numDivisions) {
    this.calculateSpacing(numDivisions);
    this.points = [this.arc.startPoint];

    //tiny pgons near the edges of the disk don't need to be subdivided
    if (this.arc.arcLength > this.spacing) {
      let p = (!this.arc.straightLine)
        ? E.directedSpacedPointOnArc(
          this.arc.circle, this.arc.startPoint, this.arc.endPoint, this.spacing)
        : E.directedSpacedPointOnLine(this.arc.startPoint, this.arc.endPoint, this.spacing);
      this.points.push(p);

      for (let i = 0; i < this.numDivisions - 2; i++) {
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
// *  (TRIANGULAR) HYPERBOLIC POLYGON CLASS
// *
// *************************************************************************
//NOTE: sometimes polygons will be backwards facing. Solved with DoubleSide material
//but may cause problems
//vertices: array of Points
//materialIndex: which material from THREE.Multimaterial to use
export class HyperbolicPolygon {
  constructor(vertices, materialIndex = 0) {
    //hyperbolic elenments are calculated on the unit Pointcare so they will
    //need to be resized before drawing
    this.needsResizing = true;
    this.materialIndex = materialIndex;
    this.vertices = vertices;
    this.addEdges();
    this.findSubdivisionEdge();
    this.subdivideMesh();
  }

  addEdges() {
    this.edges = [];
    for (let i = 0; i < this.vertices.length; i++) {
      this.edges.push(
        new HyperbolicEdge(this.vertices[i], this.vertices[(i + 1) % this.vertices.length])
      );
    }
  }

  //The longest edge with radius > 0 should be used to calculate how finely
  //the polygon gets subdivided
  findSubdivisionEdge() {
    const a = (this.edges[0].arc.curvature === 0)
              ? 0
              : this.edges[0].arc.arcLength;
    const b = (this.edges[1].arc.curvature === 0)
              ? 0
              : this.edges[1].arc.arcLength;
    const c = (this.edges[2].arc.curvature === 0)
              ? 0
              : this.edges[2].arc.arcLength;
    if (a > b && a > c) this.subdivisionEdge = 0;
    else if (b > c) this.subdivisionEdge = 1;
    else this.subdivisionEdge = 2;
  }

  //subdivide the subdivision edge, then subdivide the other two edges with the
  //same number of points as the subdivision
  subdivideEdges() {
    this.edges[this.subdivisionEdge].subdivideEdge();
    this.numDivisions = this.edges[this.subdivisionEdge].points.length - 1;

    this.edges[(this.subdivisionEdge + 1) % 3].subdivideEdge(this.numDivisions);
    this.edges[(this.subdivisionEdge + 2) % 3].subdivideEdge(this.numDivisions);
  }

  //create triangular subdivision mesh to fill the interior of the polygon
  subdivideMesh() {
    this.subdivideEdges();
    this.mesh = [].concat(this.edges[0].points);

    for (let i = 1; i < this.numDivisions; i++) {
      const startPoint = this.edges[2].points[(this.numDivisions - i)];
      const endPoint = this.edges[1].points[i];
      this.subdivideInteriorArc(startPoint, endPoint, i);
    }

    //push the final vertex
    this.mesh.push(this.edges[2].points[0]);
  }

  //find the points along the arc between opposite subdivions of the second two
  //edges of the polygon. Each subsequent arc will have one less subdivision
  subdivideInteriorArc(startPoint, endPoint, arcIndex) {
    const circle = new HyperbolicArc(startPoint, endPoint).circle;
    this.mesh.push(startPoint);

    //for each arc, the number of divisions will be reduced by one
    const divisions = this.numDivisions - arcIndex;

    //if the line get divided add points along line to mesh
    if (divisions > 1) {
      const spacing = E.distance(startPoint, endPoint) / (divisions);
      let nextPoint = E.directedSpacedPointOnArc(circle, startPoint, endPoint, spacing);
      for (let j = 0; j < divisions - 1; j++) {
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
    return new HyperbolicPolygon(newVertices, materialIndex);
  }
}
