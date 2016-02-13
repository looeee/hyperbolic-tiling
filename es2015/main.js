import * as E from './euclid';
//import {Circle} from './elements';
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

if (p === 4 && q === 4) p = 5;

//Run after load to get window width and height
window.onload = () => {
  //global variable to hold the radius as this must be calculated on load and is
  //used across all classes
  window.radius = (window.innerWidth < window.innerHeight) ? (window.innerWidth / 2) - 5 : (window.innerHeight / 2) - 5;
  window.radius = Math.floor(window.radius);
  console.log(window.radius);
  tesselation = new RegularTesselation(4, 5, 2);
  //tesselation = new RegularTesselation(p, q, 2);
}

window.onresize = () => {
  window.radius = (window.innerWidth < window.innerHeight) ? (window.innerWidth / 2) - 5 : (window.innerHeight / 2) - 5;
  window.radius = Math.floor(window.radius);
  console.log(window.radius);
  tesselation.disk.draw.reset();
  tesselation.disk.init();
  tesselation.init();
}
