import * as E from './euclid';
import { Point } from './point';
// * ***********************************************************************
// *
// *   CIRCLE CLASS
// *
// *************************************************************************

export class Circle{
  constructor(centreX, centreY, radius){
    if( E.toFixed(radius) == 0){
      radius = 0;
    }
    this.centre = new Point(centreX, centreY);
    this.radius = radius;
  }
}
