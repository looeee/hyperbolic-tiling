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
let tesselation;
let p = E.randomInt(3, 7);
let q = E.randomInt(3, 7);

if ((p-2)*(q-2) < 5){
  q = 5;
  p = 4
}

//Run after load to get window width and height
window.onload = () => {
  //tesselation = new RegularTesselation(3, 7, 2);
  tesselation = new RegularTesselation(p, q, 2);
}


window.onresize = () => {
  tesselation.disk.draw.reset();
  tesselation.disk.init();
  tesselation.init();
}
