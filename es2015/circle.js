import { Point } from './point';
// * ***********************************************************************
// *
// *   CIRCLE CLASS
// *
// *************************************************************************

export class Circle{
  constructor(centreX, centreY, radius){
    if(centreX.toFixed(10) == 0){
      centreX = 0;
    }
    if(centreY.toFixed(10) == 0){
      centreY = 0;
    }
    if(radius.toFixed(10) == 0){
      radius = 0;
    }
    this.centre = new Point(centreX, centreY);
    this.radius = radius;
  }
}
