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

const controller = new Controller();

window.onload = () => {
  controller.render();
}

window.onresize = () => {
  controller.onResize();
}
