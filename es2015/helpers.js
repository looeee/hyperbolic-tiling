import * as E from './euclid';

//TODO Document these classes
// * ***********************************************************************
// *
// *  TRANSFORM CLASS
// *
// *************************************************************************
export class Transform {
  constructor(matrix, orientation, position) {
    this.matrix = matrix || E.identityMatrix(3);
    this.orientation = orientation;
    this.position = position || false; //position not always required
  }

  multiply(transform) {
    if (!transform instanceof Transform) {
      console.error('Error: ' + transform + 'is not a Transform');
      return false;
    }
    const mat = E.multiplyMatrices(transform.matrix, this.matrix);
    const position = transform.position;
    let orientation = 1; //rotation
    if (transform.orientation * this.orientation < 0) {
      orientation = -1;
    }
    return new Transform(mat, orientation, position);
  }
}

// * ***********************************************************************
// *
// *  TRANSFORMATIONS CLASS
// *
// *
// *************************************************************************

export class Transformations {
  constructor(p, q) {
    this.p = p;
    this.q = q;

    this.initHypotenuseReflection();
    this.initEdgeReflection();
    this.initEdgeBisectorReflection();

    this.rot2 = E.multiplyMatrices(this.edgeReflection.matrix, this.edgeBisectorReflection.matrix);

    this.initPgonRotations();
    this.initEdges();
    this.initEdgeTransforms();

    this.identity = new Transform(E.identityMatrix(3));
  }

  //reflect across the hypotenuse of the fundamental region of a tesselation
  initHypotenuseReflection() {
    this.hypReflection = new Transform(E.identityMatrix(3), -1);
    this.hypReflection.matrix[0][0] = Math.cos(2 * Math.PI / this.p);
    this.hypReflection.matrix[0][1] = Math.sin(2 * Math.PI / this.p);
    this.hypReflection.matrix[1][0] = Math.sin(2 * Math.PI / this.p);
    this.hypReflection.matrix[1][1] = -Math.cos(2 * Math.PI / this.p);
  }

  //reflect across the first edge of the polygon (which crosses the radius
  // (0,0) -> (0,1) on unit disk). Combined with rotations we can reflect
  //across any edge
  initEdgeReflection() {
    const cosp = Math.cos(Math.PI / this.p);
    const sinp = Math.sin(Math.PI / this.p);
    const cos2p = Math.cos(2 * Math.PI / this.p);
    const sin2p = Math.sin(2 * Math.PI / this.p);

    const coshq = Math.cos(Math.PI / this.q) / sinp;
    const sinhq = Math.sqrt(coshq * coshq - 1);

    const cosh2q = 2 * coshq * coshq - 1;
    const sinh2q = 2 * sinhq * coshq;
    const num = 2;
    const den = 6;
    this.edgeReflection = new Transform(E.identityMatrix(3), -1);
    this.edgeReflection.matrix[0][0] = -cosh2q;
    this.edgeReflection.matrix[0][2] = sinh2q;
    this.edgeReflection.matrix[2][0] = -sinh2q;
    this.edgeReflection.matrix[2][2] = cosh2q;
  }

  initEdgeBisectorReflection() {
    this.edgeBisectorReflection = new Transform(E.identityMatrix(3), -1);
    this.edgeBisectorReflection.matrix[1][1] = -1;
  }

  //set up clockwise and anticlockwise rotations which will rotate by
  // PI/(number of sides of central polygon)
  initPgonRotations() {
    this.rotatePolygonCW = [];
    this.rotatePolygonCCW = [];
    for (let i = 0; i < this.p; i++) {
      this.rotatePolygonCW[i] = new Transform(E.identityMatrix(3), 1);
      this.rotatePolygonCW[i].matrix[0][0] = Math.cos(2 * i * Math.PI / this.p);
      this.rotatePolygonCW[i].matrix[0][1] = -Math.sin(2 * i * Math.PI / this.p);
      this.rotatePolygonCW[i].matrix[1][0] = Math.sin(2 * i * Math.PI / this.p);
      this.rotatePolygonCW[i].matrix[1][1] = Math.cos(2 * i * Math.PI / this.p);

      this.rotatePolygonCCW[i] = new Transform(E.identityMatrix(3), 1);
      this.rotatePolygonCCW[i].matrix[0][0] = Math.cos(2 * i * Math.PI / this.p);
      this.rotatePolygonCCW[i].matrix[0][1] = Math.sin(2 * i * Math.PI / this.p);
      this.rotatePolygonCCW[i].matrix[1][0] = -Math.sin(2 * i * Math.PI / this.p);
      this.rotatePolygonCCW[i].matrix[1][1] = Math.cos(2 * i * Math.PI / this.p);
    }
  }

  //orientation: either reflection = -1 OR rotation = 1
  initEdges() {
    this.edges = [];
    for (let i = 0; i < this.p; i++) {
      this.edges.push({
        orientation: 1,
        adjacentEdge: i,
      });
    }
  }

  initEdgeTransforms() {
    this.edgeTransforms = [];

    for (let i = 0; i < this.p; i++) {
      const adj = this.edges[i].adjacentEdge;
      //Case 1: reflection
      if (this.edges[i].orientation === -1) {
        let mat = E.multiplyMatrices(this.rotatePolygonCW[i].matrix, this.edgeReflection.matrix);
        mat = E.multiplyMatrices(mat, this.rotatePolygonCCW[adj].matrix);
        this.edgeTransforms[i] = new Transform(mat);
      }
      //Case 2: rotation
      else if (this.edges[i].orientation === 1) {
        let mat = E.multiplyMatrices(this.rotatePolygonCW[i].matrix, this.rot2);
        mat = E.multiplyMatrices(mat, this.rotatePolygonCCW[adj].matrix);
        this.edgeTransforms[i] = new Transform(mat);
      }
      else {
        console.error('initEdgeTransforms(): invalid orientation value');
        console.error(this.edges[i]);
      }
      this.edgeTransforms[i].orientation = this.edges[adj].orientation;
      this.edgeTransforms[i].position = adj;
    }
  }

  shiftTrans(transform, shift) {
    const newEdge = (transform.position + transform.orientation * shift + 2 * this.p) % this.p;
    if (newEdge < 0 || newEdge > (this.p - 1)) {
      console.error('Error: shiftTran newEdge out of range.')
    }
    return transform.multiply(this.edgeTransforms[newEdge]);
  }
}

// * ***********************************************************************
// *
// *  PARAMETERS CLASS
// *
// *  These are largely taken from the table on pg 19 of Ajit Dajar's thesis
// *************************************************************************

export class Parameters {
  constructor(p, q) {
    this.p = p;
    this.q = q;

    this.minExposure = q - 2;
    this.maxExposure = q - 1;
  }

  exposure(layer, vertexNum, pgonNum) {
    if (layer === 0) {
      if (pgonNum === 0) { //layer 0, pgon 0
        if (this.q === 3) return this.maxExposure;
        else return this.minExposure;
      }
      else return this.maxExposure; //layer 0, pgon != 0
    }
    else { //layer != 0
      if (vertexNum === 0 && pgonNum === 0) {
        return this.minExposure;
      }
      else if (vertexNum === 0) {
        if (this.q !== 3) return this.maxExposure;
        else return this.minExposure;
      }
      else if (pgonNum === 0) {
        if (this.q !== 3) return this.minExposure;
        else return this.maxExposure;
      }
      else return this.maxExposure;
    }
  }

  pSkip(exposure) {
    if (exposure === this.minExposure) {
      if (this.q !== 3) return 1;
      else return 3;
    }
    else if (exposure === this.maxExposure) {
      if (this.p === 3) return 1;
      else if (this.q === 3) return 2;
      else return 0;
    }
    else {
      console.error('pSkip: wrong exposure value!')
      return false;
    }
  }

  qSkip(exposure, vertexNum) {
    if (exposure === this.minExposure) {
      if (vertexNum === 0) {
        if (this.q !== 3) return -1;
        else return 0;
      }
      else {
        if (this.p === 3) return -1;
        else return 0;
      }
    }
    else if (exposure === this.maxExposure) {
      if (vertexNum === 0) {
        if (this.p === 3 || this.q === 3) return 0;
        else return -1;
      }
      else return 0;
    }
    else {
      console.error('qSkip: wrong exposure value!')
      return false;
    }
  }

  verticesToDo(exposure) {
    if (this.p === 3) return 1;
    else if (exposure === this.minExposure) {
      if (this.q === 3) return this.p - 5;
      else return this.p - 3;
    }
    else if (exposure === this.maxExposure) {
      if (this.q === 3) return this.p - 4;
      else return this.p - 2;
    }
    else {
      console.error('verticesToDo: wrong exposure value!')
      return false;
    }
  }

  pgonsToDo(exposure, vertexNum) {
    if(this.q === 3) return 1;
    else if(vertexNum === 0) return this.q - 3;
    else if (exposure === this.minExposure) {
      if (this.p === 3) return this.q - 4;
      else return this.q - 2;
    }
    else if (exposure === this.maxExposure) {
      if (this.p === 3) return this.q - 3;
      else return this.q - 2;
    }
    else {
      console.error('pgonsToDo: wrong exposure value!')
      return false;
    }
  }
}
