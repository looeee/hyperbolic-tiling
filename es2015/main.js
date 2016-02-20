import * as E from './euclid';
import {
  RegularTesselation
}
from './regularTesselation';

// * ***********************************************************************
// *
// *   POLYFILLS
// *
// *************************************************************************

Math.sinh = Math.sinh || function(x) {
  var y = Math.exp(x);
  return (y - 1 / y) / 2;
}

Math.cosh = Math.cosh || function(x) {
  var y = Math.exp(x);
  return (y + 1 / y) / 2;
};

Math.cot = Math.cot || function(x) {
  return 1 / Math.tan(x);
};

// * ***********************************************************************
// *
// *   SETUP
// *
// *************************************************************************
//window.isOnUnitDisk = new Circle(0,0,1);
let tesselation;
let p = E.randomInt(4, 7);
let q = E.randomInt(4, 7);

if (p === 4 && q === 4) q = 5;

//Run after load to get window width and height
window.onload = () => {
  tesselation = new RegularTesselation(4, 5, 3);
  //tesselation = new RegularTesselation(p, q, 3);
}


window.onresize = () => {
  tesselation.disk.draw.reset();
  tesselation.disk.init();
  tesselation.init();
}
