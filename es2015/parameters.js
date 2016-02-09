export class Parameters{
  constructor(p, q){
    this.p = p;
    this.q = q;

    this.minExposure = q-2;
    this.maxExposure = q-1;
  }

  exposure(layer, vertexNum, pgonNum){
    if(layer === 0){
      if(pgonNum === 0){ //layer 0, pgon 0
        if(this.q === 3) return this.maxExposure;
        else return this.minExposure;
      }
      else return this.maxExposure; //layer 0, pgon != 0
    }

    else{ //layer != 0
      if(vertexNum === 0 && pgonNum === 0){
        return this.minExposure;
      }
      else if(vertexNum === 0){
        if(this.q !== 3) return this.maxExposure;
        else return this.minExposure;
      }
      else if(pgonNum === 0){
        if(this.q !== 3) return this.minExposure;
        else return this.maxExposure;
      }
      else return this.maxExposure;
    }
  }

  pSkip(exposure){
    if(exposure === this.minExposure){
      if(this.q !== 3) return 1;
      else return 3;
    }
    else if(exposure === this.maxExposure){
      if(this.p === 3) return 1;
      else if(this.q === 3) return 2;
      else return 0;
    }
    else{
      console.error('pSkip: wrong exposure value!')
      return false;
    }
  }

  qSkip(exposure, vertexNum){
    if(exposure === this.minExposure){
      if(vertexNum === 0){
        if(this.q !== 3) return -1;
        else return 0;
      }
      else{
        if(this.p ===3) return -1;
        else return 0;
      }
    }
    else if(exposure === this.maxExposure){
      if(vertexNum === 0){
        if(this.p === 3 || this.q === 3) return 0;
        else return -1;
      }
      else return 0;
    }
    else{
      console.error('qSkip: wrong exposure value!')
      return false;
    }
  }

  verticesToDo(exposure){
    if(exposure === this.minExposure){
      if(this.p === 3) return 1;
      else if(this.q === 3) return this.p - 5;
      else return this.p - 3;
    }
    else if(exposure === this.maxExposure){
      if(this.p === 3) return 1;
      else if(this.q === 3) return this.p - 4;
      else return this.p - 2;
    }
    else{
      console.error('verticesToDo: wrong exposure value!')
      return false;
    }
  }

  pgonsToDO(exposure, vertexNum){
    if(exposure === this.minExposure){
      if(vertexNum === 0){
        if(this.p === 3) return this.q - 4;
        else if(this.q === 3) return 1;
        else return this.q - 3;
      }
      else{
        if(this.p === 3) return this.q - 4;
        else if(this.q === 3) return 1;
        else return this.q - 2;
      }
    }
    else if(exposure === this.maxExposure){
      if(vertexNum === 0){
        if(this.p === 3) return this.q - 3;
        else if(this.q === 3) return 1;
        else return this.q - 3;
      }
      else{
        if(this.p === 3) return this.q - 3;
        else if(this.q === 3) return 1;
        else return this.q - 2;
      }
    }
    else{
      console.error('pgonsToDO: wrong exposure value!')
      return false;
    }
  }
}
