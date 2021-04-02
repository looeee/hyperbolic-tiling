import {
  HyperbolicPolygon as Polygon,
}
from './hyperbolicEntities.js';

import {
  // HyperbolicTransform as Transform,
  HyperbolicTransformations as Transformations,
  HyperbolicParameters as Parameters,
}
from './hyperbolicUtilities.js';


// * ***********************************************************************
// *    REGULAR HYPERBOLIC TESSELATION CLASS
// *    Creates a regular Tesselation of the Poincare Disk using the techniques
// *    created by Coxeter and Dunham
// *
// *    spec = {
// *      wireframe: true/false
// *      p: number of sides of p-gon
// *      q: number of p-gons meeting at each vertex
// *      textures: array
// *      edgeAdjacency: [ (multiDim array)
// *                      [
// *                        edge_0 orientation (-1 = reflection, 1 = rotation)],
// *                        edge_0 adjacency (range p - 1)],
// *                      ],
// *                    ...
// *                      [edge_p orientation, edge_p adjacency]
// *                    ],
// *      minPolygonSize: stop at polygons below this size,
// *    }
// *
// *
// *
// *************************************************************************

export default class RegularHyperbolicTesselation {
  constructor( spec ) {
    this.wireframe = spec.wireframe || false;
    this.textures = spec.textures;
    this.p = spec.p || 4;
    this.q = spec.q || 6;

    // Stop drawing when polygons reach this size (on unit disk)
    // a value of about 0.02 seems to be the minimum that webgl can handle easily.
    this.minPolygonSize = spec.minPolygonSize || 0.1;

    console.log( '{', this.p, ', ', this.q, '} tiling.' );

    this.params = new Parameters( this.p, this.q );
    this.transforms = new Transformations( this.p, this.q );

    if ( this.checkParams() ) {
      return false;
    }
    return this;
  }

  // fundamentalRegion calculation using Dunham's method
  // this is a right angle triangle above the radius on the line (0,0) -> (0,1)
  // of the central polygon
  fundamentalRegion() {
    const cosh2 = Math.cot( Math.PI / this.p ) * Math.cot( Math.PI / this.q );

    const sinh2 = Math.sqrt( cosh2 * cosh2 - 1 );

    const coshq = Math.cos( Math.PI / this.q ) / Math.sin( Math.PI / this.p );
    const sinhq = Math.sqrt( coshq * coshq - 1 );

    const rad2 = sinh2 / ( cosh2 + 1 ); // radius of circle containing layer 0
    const x2pt = sinhq / ( coshq + 1 ); // x coordinate of third vertex of triangle

    // point at end of hypotenuse of fundamental region
    const xqpt = Math.cos( Math.PI / this.p ) * rad2;
    const yqpt = Math.sin( Math.PI / this.p ) * rad2;

    // create points and move them from the unit disk to our radius
    const p1 = { x: xqpt, y: yqpt, z: 0 };
    const p2 = { x: x2pt, y: 0, z: 0 };
    // const p3 = transformPoint( this.transforms.edgeBisectorReflection, p1.x, p1.y );
    const vertices = [{ x: 0, y: 0, z: 0 }, p1, p2];

    return new Polygon( vertices, 0 );
  }

  // this is a kite shaped region consisting of two copies of the fundamental
  // region with different textures applied to create the basic pattern
  // NOTE: for the time being just using edge bisector reflection to recreate Circle
  // Limit I, other patterns will require different options
  fundamentalPattern() {
    const upper = this.fundamentalRegion();
    const lower = upper.transform( this.transforms.edgeBisectorReflection, 1 );
    return [upper, lower];
  }

  // The pattern in the central polygon is made up of transformed copies
  // of the fundamental pattern
  buildCentralPattern() {
    // add the first two polygons to the central pattern
    const centralPattern = this.fundamentalPattern();

    // created reflected versions of the two pattern pieces
    const upperReflected = centralPattern[0].transform( this.transforms.edgeBisectorReflection );
    const lowerReflected = centralPattern[1].transform( this.transforms.edgeBisectorReflection );

    // add the rest of the pattern pieces to the central pattern
    for ( let i = 1; i < this.p; i++ ) {
      if ( i % 2 === 1 ) {
        centralPattern.push( upperReflected.transform( this.transforms.rotatePolygonCW[i] ) );
        centralPattern.push( lowerReflected.transform( this.transforms.rotatePolygonCW[i] ) );
      } else {
        centralPattern.push( centralPattern[0].transform( this.transforms.rotatePolygonCW[i] ) );
        centralPattern.push( centralPattern[1].transform( this.transforms.rotatePolygonCW[i] ) );
      }
    }

    return centralPattern;
  }

  // recursively build tiling from transformed copies of central pattern
  generateTiling( designMode = false ) {
    const tiling = this.buildCentralPattern();

    const pRange = designMode ? 1 : this.p; // if we are in design mode only do one loop
    for ( let i = 0; i < pRange; i++ ) {
      let qTransform = this.transforms.edgeTransforms[i];

      const qRange = designMode ? 1 : this.q - 2; // if we are in design mode only do one loop
      for ( let j = 0; j < qRange; j++ ) {
        if ( ( this.p === 3 ) && ( this.q - 3 === j ) ) {
          this.addTransformedPattern( tiling, qTransform );
        } else {
          this.layerRecursion( this.params.exposure( 0, i, j ), 1, qTransform, tiling, designMode );
        }
        if ( ( -1 % this.p ) !== 0 ) {
          qTransform = this.transforms.shiftTrans( qTransform, -1 ); // -1 means clockwise
        }
      }
    }

    return tiling;
  }

  // calculate the polygons in each layer and add them to this.tiling[]
  // TODO: better designMode
  layerRecursion( exposure, layer, transform, tiling, designMode = false ) {
    this.addTransformedPattern( tiling, transform );
    // stop if the current pattern has reached the minimum size
    // TODO better method as this leaves holes at the edges
    if ( tiling[tiling.length - 1].edges[0].arcLength < this.minPolygonSize ) {
      return;
    }

    let pSkip = this.params.pSkip( exposure );
    const verticesToDo = this.params.verticesToDo( exposure );

    const verticesRange = designMode ? 1 : verticesToDo; // if we are in design mode only do one loop
    for ( let i = 0; i < verticesRange; i++ ) {
      const pTransform = this.transforms.shiftTrans( transform, pSkip );
      let qTransform;

      const qSkip = this.params.qSkip( exposure, i );
      if ( qSkip % this.p !== 0 ) {
        qTransform = this.transforms.shiftTrans( pTransform, qSkip );
      } else {
        qTransform = pTransform;
      }

      const pgonsToDo = this.params.pgonsToDo( exposure, i );

      const pgonsRange = designMode ? 1 : pgonsToDo; // if we are in design mode only do one loop
      for ( let j = 0; j < pgonsRange; j++ ) {
        if ( ( this.p === 3 ) && ( j === pgonsToDo - 1 ) ) {
          this.addTransformedPattern( tiling, qTransform );
        } else {
          this.layerRecursion( this.params.exposure( layer, i, j ), layer + 1, qTransform, tiling );
        }
        if ( ( -1 % this.p ) !== 0 ) {
          qTransform = this.transforms.shiftTrans( qTransform, -1 ); // -1 means clockwise
        }
      }
      pSkip = ( pSkip + 1 ) % this.p;
    }
  }

  // The first p*2 elements of the tiling hold the central pattern
  // The transform will be applied to these
  addTransformedPattern( tiling, transform ) {
    for ( let i = 0; i < this.p * 2; i++ ) {
      tiling.push( tiling[i].transform( transform ) );
    }
  }

  // The tesselation requires that (p-2)(q-2) > 4 to work (otherwise it is
  // either an elliptical or euclidean tesselation);
  checkParams() {
    if ( ( this.p - 2 ) * ( this.q - 2 ) <= 4 ) {
      console.error( 'Hyperbolic tesselations require that (p-2)(q-2) > 4!' );
      return true;
    } else if ( this.q < 3 || isNaN( this.q ) ) {
      console.error( 'Tesselation error: at least 3 p-gons must meet at each vertex!' );
      return true;
    } else if ( this.p < 3 || isNaN( this.p ) ) {
      console.error( 'Tesselation error: polygon needs at least 3 sides!' );
      return true;
    }
    return false;
  }
}
