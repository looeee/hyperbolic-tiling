import { distance, arcLength, throughOrigin, poincareToHyperboloid, hyperboloidCrossProduct, transformPoint } from './mathFunctions.js';

// * ***********************************************************************
// *
// *  HYPERBOLIC ARC CLASS
// *  Represents a hyperbolic arc on the Poincare disk, which is a
// *  Euclidean straight line if it goes through the origin
// *
// *************************************************************************

class HyperbolicArc {
  constructor( startPoint, endPoint ) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;

    if ( throughOrigin( startPoint.x, startPoint.y, endPoint.x, endPoint.y ) ) {
      this.straightLine = true;
      this.arcLength = distance( startPoint.x, startPoint.y, endPoint.x, endPoint.y );
      this.curvature = 0;
    } else {
      this.calculateArc();
      this.arcLength = arcLength( this.radius, this.startAngle, this.endAngle );
      this.curvature = ( this.arcLength ) / ( this.radius );
    }
  }

  // Calculate the arc using Dunham's method
  calculateArc() {
    // calculate centre of the circle the arc lies on relative to unit disk
    const a = poincareToHyperboloid( this.startPoint.x, this.startPoint.y );
    const b = poincareToHyperboloid( this.endPoint.x, this.endPoint.y );
    const hp = hyperboloidCrossProduct( a.x, a.y, a.z, b.x, b.y, b.z );

    const arcCentre = { x: hp.x / hp.z, y: hp.y / hp.z, z: 0 };
    const arcRadius = Math.sqrt(
      ( this.startPoint.x - arcCentre.x ) * ( this.startPoint.x - arcCentre.x )
      + ( this.startPoint.y - arcCentre.y ) * ( this.startPoint.y - arcCentre.y ),
    );

    // translate points to origin and calculate arctan
    this.startAngle = Math.atan2(
      this.startPoint.y - arcCentre.y,
      this.startPoint.x - arcCentre.x,
    );
    this.endAngle = Math.atan2(
      this.endPoint.y - arcCentre.y,
      this.endPoint.x - arcCentre.x,
    );

    // angles are in (-pi, pi), transform to (0,2pi)
    this.startAngle = ( this.startAngle < 0 )
                      ? 2 * Math.PI + this.startAngle
                      : this.startAngle;
    this.endAngle = ( this.endAngle < 0 )
                      ? 2 * Math.PI + this.endAngle
                      : this.endAngle;

    this.centre = arcCentre;
    this.radius = arcRadius;
  }

}

// * ***********************************************************************
// *
// *  (TRIANGULAR) HYPERBOLIC POLYGON CLASS
// *
// *************************************************************************
// NOTE: sometimes polygons will be backwards facing. Solved with DoubleSide material
// but may cause problems
// materialIndex: which tile to use
export class HyperbolicPolygon {
  constructor( vertices, materialIndex = 0 ) {

    this.materialIndex = materialIndex;
    this.vertices = vertices;

    this.edges = [
      new HyperbolicArc( this.vertices[0], this.vertices[1] ),
      new HyperbolicArc( this.vertices[1], this.vertices[2] ),
      new HyperbolicArc( this.vertices[2], this.vertices[0] ),
    ];
  }

  // Apply a Transform to the polygon
  transform( transform, materialIndex = this.materialIndex ) {
    const newVertices = [];
    for ( let i = 0; i < this.vertices.length; i++ ) {
      newVertices.push( transformPoint( transform, this.vertices[i].x, this.vertices[i].y ) );
    }

    return new HyperbolicPolygon( newVertices, materialIndex );
  }
}
