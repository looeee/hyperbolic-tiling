const multiplyMatrices = (m1, m2) => {
  const result = [];
  for (let i = 0; i < m1.length; i++) {
    result[i] = [];
    for (let j = 0; j < m2[0].length; j++) {
      let sum = 0;
      for (let k = 0; k < m1[0].length; k++) {
        sum += m1[i][k] * m2[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}

//create nxn identityMatrix
const identityMatrix = (n) => {
  return Array.apply(null, new Array(n)).map(function(x, i, a) {
    return a.map(function(y, k) {
      return i === k ? 1 : 0;
    })
  });
}




// * ***********************************************************************
// *
// *  TRANSFORM CLASS
// *
// *************************************************************************
export class Transform {
  constructor(matrix, orientation, position) {
    this.matrix = matrix || identityMatrix(3);
    this.orientation = orientation;
    this.position = position || false; //position not always required

  }

  multiply(transform){
    if(!transform instanceof Transform){
      console.error('Error: ' + transform + 'is not a Transform');
      return false;
    }
    const mat = multiplyMatrices(transform.matrix, this.matrix);
    const position = transform.position;
    let orientation = 1; //rotation
    if(transform.orientation * this.orientation < 0){
      orientation = -1;
    }
    return new Transform(mat, orientation, position);
  }
}

// * ***********************************************************************
// *
// *  TRANSFORMATIONS CLASS
// *
// *************************************************************************

//orientation: reflection = -1 OR rotation = 1
export class Transformations {
  constructor(p, q) {
    this.p = p;
    this.q = q;
    const PI = Math.PI;

    this.cosp = Math.cos(PI / p);
    this.sinp = Math.sin(PI / p);

    this.cosq = Math.cos(PI / q);
    this.sinq = Math.sin(PI / q);

    this.cos2p = Math.cos(2 * PI / p);
    this.sin2p = Math.sin(2 * PI / p);

    this.coshq = Math.cosh(PI / q);//Math.cos(PI / q) / this.sinp;
    this.sinhq = Math.sinh(PI / q);//Math.sqrt(this.coshq * this.coshq - 1);

    this.cosh2q = Math.cosh(2 * PI / q);//2 * this.coshq * this.coshq - 1;
    this.sinh2q = Math.sinh(2 * PI / q);//2 * this.sinhq * this.coshq;

    this.cosh2 = 1/(Math.tan(PI / p)*Math.tan(PI / q)) //1 / ((this.sinp / this.cosp) * (this.sinq / this.cosq));

    this.sinh2 = Math.sqrt(this.cosh2 * this.cosh2 - 1);

    this.rad2 = this.sinh2 / (this.cosh2 + 1);
    this.x2pt = this.sinhq / (this.coshq + 1);

    this.xqpt = this.cosp * this.rad2;
    this.yqpt = this.sinp * this.rad2;

    this.initEdgeReflection();
    this.initEdgeBisectorReflection();

    this.rot2 = multiplyMatrices(this.edgeReflection.matrix, this.edgeBisectorReflection.matrix);

    this.initPgonRotations();
    this.initEdges();
    this.initEdgeTransforms();

    this.identity = new Transform(identityMatrix(3));

  }

  //TESTED: Not working!
  initEdgeReflection() {
    this.edgeReflection = new Transform(identityMatrix(3), -1);
    this.edgeReflection.matrix[0][0] = -this.coshq;
    this.edgeReflection.matrix[0][2] = this.sinhq;
    this.edgeReflection.matrix[2][0] = -this.sinhq;
    this.edgeReflection.matrix[2][2] = this.coshq;

  }

  //TESTED: working
  initEdgeBisectorReflection() {
    this.edgeBisectorReflection = new Transform(identityMatrix(3), -1);
    this.edgeBisectorReflection.matrix[1][1] = -1;
  }

  //TESTED: working
  initPgonRotations() {
    this.rotatePolygonCW = [];
    this.rotatePolygonCCW = [];
    for (let i = 0; i < this.p; i++) {
      this.rotatePolygonCW[i] = new Transform(identityMatrix(3), 1);
      this.rotatePolygonCW[i].matrix[0][0] = Math.cos(2 * i * Math.PI / this.p);
      this.rotatePolygonCW[i].matrix[0][1] = -Math.sin(2 * i * Math.PI / this.p);
      this.rotatePolygonCW[i].matrix[1][0] = Math.sin(2 * i * Math.PI / this.p);
      this.rotatePolygonCW[i].matrix[1][1] = Math.cos(2 * i * Math.PI / this.p);

      this.rotatePolygonCCW[i] = new Transform(identityMatrix(3), 1);
      this.rotatePolygonCCW[i].matrix[0][0] = Math.cos(2 * i * Math.PI / this.p);
      this.rotatePolygonCCW[i].matrix[0][1] = Math.sin(2 * i * Math.PI / this.p);
      this.rotatePolygonCCW[i].matrix[1][0] = -Math.sin(2 * i * Math.PI / this.p);
      this.rotatePolygonCCW[i].matrix[1][1] = Math.cos(2 * i * Math.PI / this.p);
    }
  }

  //orientation: 0 -> reflection, 1 -> rotation
  initEdges(){
    this.edges = [];
    for (let i = 0; i < this.p; i++) {
      this.edges.push({
        orientation: 1,
        adjacentEdge: i,
      })
    }


  }

  //TESTED: not working!
  initEdgeTransforms(){
    this.edgeTransforms = [];

    for (let i = 0; i < this.p; i++) {
      const adj = this.edges[i].adjacentEdge;
      //Case 1: reflection
      if(this.edges[i].orientation === -1){
        let mat = multiplyMatrices(this.rotatePolygonCW[i], this.edgeReflection);
        mat = multiplyMatrices(mat, this.rotatePolygonCCW[adj]);
        this.edgeTransforms[i] = new Transform(mat);
      }
      //Case 2: rotation
      else if(this.edges[i].orientation === 1){
        let mat = multiplyMatrices(this.rotatePolygonCW[i].matrix, this.rot2);
        mat = multiplyMatrices(mat, this.rotatePolygonCCW[adj].matrix);
        this.edgeTransforms[i] = new Transform(mat);
      }
      else{
        console.error('Error: invalid orientation value');
        console.error(this.edges[i]);
      }
      this.edgeTransforms[i].orientation = this.edges[adj].orientation;
      this.edgeTransforms[i].position = adj;
    }
  }

  shiftTrans(transform, shift){
    const newEdge = (transform.position + transform.orientation*shift + 2*this.p) % this.p;
    if(newEdge < 0 || newEdge > (this.p-1) ){
      console.error('Error: shiftTran newEdge out of range.')
    }
    return transform.multiply(this.edgeTransforms[newEdge]);
  }
}

// * ***********************************************************************
// *
// *  PARAMETERS CLASS
// *
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
      } else return this.maxExposure; //layer 0, pgon != 0
    } else { //layer != 0
      if (vertexNum === 0 && pgonNum === 0) {
        return this.minExposure;
      } else if (vertexNum === 0) {
        if (this.q !== 3) return this.maxExposure;
        else return this.minExposure;
      } else if (pgonNum === 0) {
        if (this.q !== 3) return this.minExposure;
        else return this.maxExposure;
      } else return this.maxExposure;
    }
  }

  pSkip(exposure) {
    if (exposure === this.minExposure) {
      if (this.q !== 3) return 1;
      else return 3;
    } else if (exposure === this.maxExposure) {
      if (this.p === 3) return 1;
      else if (this.q === 3) return 2;
      else return 0;
    } else {
      console.error('pSkip: wrong exposure value!')
      return false;
    }
  }

  qSkip(exposure, vertexNum) {
    if (exposure === this.minExposure) {
      if (vertexNum === 0) {
        if (this.q !== 3) return -1;
        else return 0;
      } else {
        if (this.p === 3) return -1;
        else return 0;
      }
    } else if (exposure === this.maxExposure) {
      if (vertexNum === 0) {
        if (this.p === 3 || this.q === 3) return 0;
        else return -1;
      } else return 0;
    } else {
      console.error('qSkip: wrong exposure value!')
      return false;
    }
  }

  verticesToDo(exposure) {
    if (exposure === this.minExposure) {
      if (this.p === 3) return 1;
      else if (this.q === 3) return this.p - 5;
      else return this.p - 3;
    } else if (exposure === this.maxExposure) {
      if (this.p === 3) return 1;
      else if (this.q === 3) return this.p - 4;
      else return this.p - 2;
    } else {
      console.error('verticesToDo: wrong exposure value!')
      return false;
    }
  }

  pgonsToDo(exposure, vertexNum) {
    if (exposure === this.minExposure) {
      if (vertexNum === 0) {
        if (this.p === 3) return this.q - 4;
        else if (this.q === 3) return 1;
        else return this.q - 3;
      } else {
        if (this.p === 3) return this.q - 4;
        else if (this.q === 3) return 1;
        else return this.q - 2;
      }
    } else if (exposure === this.maxExposure) {
      if (vertexNum === 0) {
        if (this.p === 3) return this.q - 3;
        else if (this.q === 3) return 1;
        else return this.q - 3;
      } else {
        if (this.p === 3) return this.q - 3;
        else if (this.q === 3) return 1;
        else return this.q - 2;
      }
    } else {
      console.error('pgonsToDo: wrong exposure value!')
      return false;
    }
  }
}
