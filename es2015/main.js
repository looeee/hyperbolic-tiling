import * as E from './euclid';
//TODO create circle class and refactor
//TODO window.removeEventListener('load'); not working in firefox
//TODO apparently .toFixed() returns a string

import { RegularTesselation } from './regularTesselation';

// * ***********************************************************************
// *
// *   SETUP
// *
// *************************************************************************

const tesselation = new RegularTesselation(E.randomInt(4,8), E.randomInt(4,8));
//const tesselation = new RegularTesselation(11, 9);
