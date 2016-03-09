import {
  Controller
}
from './controller';

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

const controller = new Controller();

//Run after load to get window width and height
window.onload = () => {
  //tesselation = new RegularTesselation(circleLimit1Spec);
  //tesselation = new RegularTesselation(p, q);
}

window.onresize = () => {
  //tesselation.disk.draw.resize();
}
