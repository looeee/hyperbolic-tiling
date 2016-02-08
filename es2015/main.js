import * as E from './euclid';
import { RegularTesselation } from './regularTesselation';

//TODO window.removeEventListener('load'); not working in firefox



// * ***********************************************************************
// *
// *   SETUP
// *
// *************************************************************************

const tesselation = new RegularTesselation(E.randomInt(4,8), E.randomInt(4,8));
//const tesselation = new RegularTesselation(11, 9);
