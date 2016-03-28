import * as E from '../universal/mathFunctions';

// * ***********************************************************************
// * ***********************************************************************
// * ***********************************************************************
// *
// *   EUCLIDEAN SPECIFIC ELEMENT CLASSES
// *
// *************************************************************************
// * ***********************************************************************
// * ***********************************************************************

// * ***********************************************************************
// *
// *   EDGE CLASS
// *   Represents a hyperbolic polygon edge
// *
// *************************************************************************
class EuclideanEdge {
  constructor(startPoint, endPoint) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;
  }
}

// * ***********************************************************************
// *
// *  (TRIANGULAR) POLYGON CLASS
// *
// *************************************************************************
export class EuclideanPolygon {
  constructor(vertices, materialIndex = 0) {
    this.materialIndex = materialIndex;
    this.mesh = vertices;
  }

  addEdges() {
    this.edges = [];
    for (let i = 0; i < this.vertices.length; i++) {
      this.edges.push(
        new Edge(this.vertices[i], this.vertices[(i + 1) % this.vertices.length])
      );
    }
  }

  //Apply a Transform to the polygon
  transform(transform, materialIndex = this.materialIndex) {
    const newVertices = [];
    for (let i = 0; i < this.vertices.length; i++) {
      newVertices.push(this.vertices[i].transform(transform));
    }
    return new EuclideanPolygon(newVertices, materialIndex);
  }
}
