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

//Global radius
window.radius = (window.innerWidth < window.innerHeight) ? (window.innerWidth / 2) - 5 : (window.innerHeight / 2) - 5;

let tesselation;
let p = E.randomInt(2, 3)*2;
let q = E.randomInt(2, 4)*2;

if ((p-2)*(q-2) < 5){
  q = 4;
  p = 6
}


//Run after load to get window width and height
window.onload = () => {
  tesselation = new RegularTesselation(6, 6);
  //tesselation = new RegularTesselation(p, q);
}

window.onresize = () => {
  tesselation.disk.draw.resize();
}
