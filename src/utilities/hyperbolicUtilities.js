import { identityMatrix, multiplyMatrices } from './mathFunctions.js';

// TODO Document these classes
// * ***********************************************************************
// *
// *  TRANSFORM CLASS
// *  Represents a transformation of a point in hyperbolic space
// *
// *************************************************************************
export class HyperbolicTransform {
  constructor( matrix, orientation, position ) {
    this.matrix = matrix || identityMatrix( 3 );
    this.orientation = orientation;
    this.position = position || false; // position not always required
  }

  multiply( transform ) {
    if ( !( transform instanceof HyperbolicTransform ) ) {
      console.error( `Error: ${transform} is not a HyperbolicTransform` );
      return false;
    }
    const mat = multiplyMatrices( transform.matrix, this.matrix );
    const position = transform.position;
    let orientation = 1; // rotation
    if ( transform.orientation * this.orientation < 0 ) {
      orientation = -1;
    }
    return new HyperbolicTransform( mat, orientation, position );
  }
}

// * ***********************************************************************
// *
// *  TRANSFORMATIONS CLASS
// *
// *
// *************************************************************************

export class HyperbolicTransformations {
  constructor( p, q ) {
    this.p = p;
    this.q = q;

    this.initHypotenuseReflection();
    this.initEdgeReflection();
    this.initEdgeBisectorReflection();

    this.rot2 = multiplyMatrices( this.edgeReflection.matrix, this.edgeBisectorReflection.matrix );

    this.initPgonRotations();
    this.initEdges();
    this.initEdgeTransforms();

    this.identity = new HyperbolicTransform( identityMatrix( 3 ) );
  }

  // reflect across the hypotenuse of the fundamental region of a tesselation
  initHypotenuseReflection() {
    this.hypReflection = new HyperbolicTransform( identityMatrix( 3 ), -1 );
    this.hypReflection.matrix[0][0] = Math.cos( 2 * Math.PI / this.p );
    this.hypReflection.matrix[0][1] = Math.sin( 2 * Math.PI / this.p );
    this.hypReflection.matrix[1][0] = Math.sin( 2 * Math.PI / this.p );
    this.hypReflection.matrix[1][1] = -Math.cos( 2 * Math.PI / this.p );
  }

  // reflect across the first edge of the polygon (which crosses the radius
  // (0,0) -> (0,1) on unit disk). Combined with rotations we can reflect
  // across any edge
  initEdgeReflection() {
    const cosp = Math.cos( Math.PI / this.p );
    const sinp = Math.sin( Math.PI / this.p );
    const cos2p = Math.cos( 2 * Math.PI / this.p );
    const sin2p = Math.sin( 2 * Math.PI / this.p );

    const coshq = Math.cos( Math.PI / this.q ) / sinp;
    const sinhq = Math.sqrt( coshq * coshq - 1 );

    const cosh2q = 2 * coshq * coshq - 1;
    const sinh2q = 2 * sinhq * coshq;
    const num = 2;
    const den = 6;
    this.edgeReflection = new HyperbolicTransform( identityMatrix( 3 ), -1 );
    this.edgeReflection.matrix[0][0] = -cosh2q;
    this.edgeReflection.matrix[0][2] = sinh2q;
    this.edgeReflection.matrix[2][0] = -sinh2q;
    this.edgeReflection.matrix[2][2] = cosh2q;
  }

  initEdgeBisectorReflection() {
    this.edgeBisectorReflection = new HyperbolicTransform( identityMatrix( 3 ), -1 );
    this.edgeBisectorReflection.matrix[1][1] = -1;
  }

  // set up clockwise and anticlockwise rotations which will rotate by
  // PI/(number of sides of central polygon)
  initPgonRotations() {
    this.rotatePolygonCW = [];
    this.rotatePolygonCCW = [];
    for ( let i = 0; i < this.p; i++ ) {
      this.rotatePolygonCW[i] = new HyperbolicTransform( identityMatrix( 3 ), 1 );
      this.rotatePolygonCW[i].matrix[0][0] = Math.cos( 2 * i * Math.PI / this.p );
      this.rotatePolygonCW[i].matrix[0][1] = -Math.sin( 2 * i * Math.PI / this.p );
      this.rotatePolygonCW[i].matrix[1][0] = Math.sin( 2 * i * Math.PI / this.p );
      this.rotatePolygonCW[i].matrix[1][1] = Math.cos( 2 * i * Math.PI / this.p );

      this.rotatePolygonCCW[i] = new HyperbolicTransform( identityMatrix( 3 ), 1 );
      this.rotatePolygonCCW[i].matrix[0][0] = Math.cos( 2 * i * Math.PI / this.p );
      this.rotatePolygonCCW[i].matrix[0][1] = Math.sin( 2 * i * Math.PI / this.p );
      this.rotatePolygonCCW[i].matrix[1][0] = -Math.sin( 2 * i * Math.PI / this.p );
      this.rotatePolygonCCW[i].matrix[1][1] = Math.cos( 2 * i * Math.PI / this.p );
    }
  }

  // orientation: either reflection = -1 OR rotation = 1
  // NOTE: hard coded for Circle Limit I
  initEdges() {
    this.edges = [];
    for ( let i = 0; i < this.p; i++ ) {
      this.edges.push( {
        orientation: 1,
        adjacentEdge: i,
      } );
    }
  }

  initEdgeTransforms() {
    this.edgeTransforms = [];

    for ( let i = 0; i < this.p; i++ ) {
      const adj = this.edges[i].adjacentEdge;
      // Case 1: reflection
      if ( this.edges[i].orientation === -1 ) {
        let mat = multiplyMatrices( this.rotatePolygonCW[i].matrix, this.edgeReflection.matrix );
        mat = multiplyMatrices( mat, this.rotatePolygonCCW[adj].matrix );
        this.edgeTransforms[i] = new HyperbolicTransform( mat );
      }
      // Case 2: rotation
      else if ( this.edges[i].orientation === 1 ) {
        let mat = multiplyMatrices( this.rotatePolygonCW[i].matrix, this.rot2 );
        mat = multiplyMatrices( mat, this.rotatePolygonCCW[adj].matrix );
        this.edgeTransforms[i] = new HyperbolicTransform( mat );
      } else {
        console.error( 'initEdgeTransforms(): invalid orientation value' );
        console.error( this.edges[i] );
      }
      this.edgeTransforms[i].orientation = this.edges[adj].orientation;
      this.edgeTransforms[i].position = adj;
    }
  }

  shiftTrans( transform, shift ) {
    const newEdge = ( transform.position + transform.orientation * shift + 2 * this.p ) % this.p;
    if ( newEdge < 0 || newEdge > ( this.p - 1 ) ) {
      console.error( 'Error: shiftTran newEdge out of range.' );
    }
    return transform.multiply( this.edgeTransforms[newEdge] );
  }
}

// * ***********************************************************************
// *
// *  PARAMETERS CLASS
// *
// *  Adapted from the table on pg 19 of Ajit Dajar's thesis (See Documents folder)
// *************************************************************************

export class HyperbolicParameters {
  constructor( p, q ) {
    this.p = p;
    this.q = q;

    this.minExposure = q - 2;
    this.maxExposure = q - 1;
  }

  exposure( layer, vertexNum, pgonNum ) {
    if ( layer === 0 ) {
      if ( pgonNum === 0 ) { // layer 0, pgon 0
        if ( this.q === 3 ) return this.maxExposure;
        return this.minExposure;
      }
      return this.maxExposure; // layer 0, pgon != 0
    }
    if ( vertexNum === 0 && pgonNum === 0 ) {
      return this.minExposure;
    } else if ( vertexNum === 0 ) {
      if ( this.q !== 3 ) return this.maxExposure;
      return this.minExposure;
    } else if ( pgonNum === 0 ) {
      if ( this.q !== 3 ) return this.minExposure;
      return this.maxExposure;
    }
    return this.maxExposure;
  }

  pSkip( exposure ) {
    if ( exposure === this.minExposure ) {
      if ( this.q !== 3 ) return 1;
      return 3;
    } else if ( exposure === this.maxExposure ) {
      if ( this.p === 3 ) return 1;
      else if ( this.q === 3 ) return 2;
      return 0;
    }
    console.error( 'pSkip: wrong exposure value!' );
    return false;
  }

  qSkip( exposure, vertexNum ) {
    if ( exposure === this.minExposure ) {
      if ( vertexNum === 0 ) {
        if ( this.q !== 3 ) return -1;
        return 0;
      }
      if ( this.p === 3 ) return -1;
      return 0;
    } else if ( exposure === this.maxExposure ) {
      if ( vertexNum === 0 ) {
        if ( this.p === 3 || this.q === 3 ) return 0;
        return -1;
      }
      return 0;
    }
    console.error( 'qSkip: wrong exposure value!' );
    return false;
  }

  verticesToDo( exposure ) {
    if ( this.p === 3 ) return 1;
    else if ( exposure === this.minExposure ) {
      if ( this.q === 3 ) return this.p - 5;
      return this.p - 3;
    } else if ( exposure === this.maxExposure ) {
      if ( this.q === 3 ) return this.p - 4;
      return this.p - 2;
    }
    console.error( 'verticesToDo: wrong exposure value!' );
    return false;
  }

  pgonsToDo( exposure, vertexNum ) {
    if ( this.q === 3 ) return 1;
    else if ( vertexNum === 0 ) return this.q - 3;
    else if ( exposure === this.minExposure ) {
      if ( this.p === 3 ) return this.q - 4;
      return this.q - 2;
    } else if ( exposure === this.maxExposure ) {
      if ( this.p === 3 ) return this.q - 3;
      return this.q - 2;
    }
    console.error( 'pgonsToDo: wrong exposure value!' );
    return false;
  }
}
