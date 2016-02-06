import * as E from './euclid';
// * ***********************************************************************
// *
// *   POINT CLASS
// *   2d point class
// *************************************************************************

export class Point{
  constructor(x, y){
    if(E.toFixed(x , 10) == 0){
      x = 0;
    }
    if(E.toFixed(y , 10) == 0){
      y = 0;
    }
    this.x = x;
    this.y = y;
  }

  toFixed(places){
    this.x = E.toFixed(this.x, places);
    this.y = E.toFixed(this.y, places);
  }

  //compare two points taking rounding errors into account
  compare(p2){
    if (typeof p2 === 'undefined') {
      console.warn('Warning: point not defined.')
      return false;
    }
    const t1 = this.toFixed(10);
    const t2 = p2.toFixed(10);

    if (p1.x === p2.x && p1.y === p2.y) return true;
    else return false;
  }

  //map from disk of currentRadius to unit disk
  toUnitDisk(currentRadius){
    return new Point(this.x/currentRadius, this.y/currentRadius);
  }

  //map from unit disk to disk of newRadius
  fromUnitDisk(newRadius){
    return new Point(this.x * newRadius, this.y * newRadius);
  }

}
