import * as E from '../universal/mathFunctions';

// * ***********************************************************************
// *
// *   EUCLIDEAN TESSELATION CLASS
// *
// *************************************************************************
//TODO: refactor element classes to work as either hyperbolic or euclidean elenments
export class EuclideanTesselation {
  constructor(spec) {
    this.wireframe = spec.wireframe || false;
    this.textures = spec.textures;
    this.p = spec.p || 4;
    this.q = spec.q || 4;
  }

  //The tesselation requires that (p-2)(q-2) > 4 to work (otherwise it is
  //either an elliptical or euclidean tesselation);
  checkParams() {
    if ((this.p - 2) * (this.q - 2) > 4) {
      console.error('Euclidean tesselations require that (p-2)(q-2) <= 4!');
      return true;
    }
    else if (this.q < 3 || isNaN(this.q)) {
      console.error('Tesselation error: at least 3 p-gons must meet at each vertex!');
      return true;
    }
    else if (this.p < 3 || isNaN(this.p)) {
      console.error('Tesselation error: polygon needs at least 3 sides!');
      return true;
    }
    return false;
  }
}
