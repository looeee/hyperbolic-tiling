/* main.js */

import { Controller } from './controller';
// * ***********************************************************************
// *
// *   POLYFILLS
// *
// *************************************************************************

Math.sinh = Math.sinh || function sinh(x) {
  const y = Math.exp(x);
  return (y - 1 / y) / 2;
};

Math.cosh = Math.cosh || function cosh(x) {
  const y = Math.exp(x);
  return (y + 1 / y) / 2;
};

Math.cot = Math.cot || function cot(x) {
  return 1 / Math.tan(x);
};


// * ***********************************************************************
// *
// *   SETUP
// *
// *************************************************************************

let controller;
window.onload = () => {
  controller = new Controller();
};

window.onresize = () => {
  controller.onResize();
};
