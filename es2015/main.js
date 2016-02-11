import * as E from './euclid';
import { RegularTesselation } from './regularTesselation';

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

let p = E.randomInt(4,8);
let q = E.randomInt(4,8);

if(p === 4 && q ===4) p = 5;

//Run after load to get window width and height
window.addEventListener('load', (event) => {
  //global variable to hold the radius as this must be calculated on load and is
  //used across all classes
  window.radius = (window.innerWidth < window.innerHeight) ? (window.innerWidth / 2) - 5 : (window.innerHeight / 2) - 5;

  const tesselation = new RegularTesselation(4, 5, 2);
  //const tesselation = new RegularTesselation(p, q, 2);
}, false);
