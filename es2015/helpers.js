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

//TESTING
//let a = [[8, 3], [2, 4], [3, 6]];
//let b = [[1, 2, 3], [4, 6, 8]];

// * ***********************************************************************
// *
// *  TRANSFORMATIONS CLASS
// *
// *************************************************************************
export class Transformations {
  constructor(p, q) {
    const PI = Math.PI;
    this.sinp = Math.sin(PI / p);
    this.cosp = Math.cos(PI / p);
    this.cos2p = Math.cos(2 * PI / p);
    this.sin2p = Math.sin(2 * PI / p);
    this.coshq = Math.cos(PI / q) / this.sinp;
    this.sinhq = Math.sqrt(this.coshq * this.coshq - 1);
    this.cosh2q = 2 * this.coshq * this.coshq -1;
    this.sinh2q = 2 * this.sinhq * this.coshq;
    this.cosh2 = 1 / (this.sinp/this.cosp) * Math.sin(PI/q);
    this.sinh2 = Math.sqrt( this.cosh2 * this.cosh2 -1);
    this.rad2 = this.sinh2 / (this.cosh2 + 1);
    this.x2pt = this.sinhq / (this.coshq + 1);
    this.xqpt = this.cosp * this.rad2;
    this.yqpt = this.sinp * this.rad2;

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

  pgonsToDO(exposure, vertexNum) {
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
      console.error('pgonsToDO: wrong exposure value!')
      return false;
    }
  }
}
