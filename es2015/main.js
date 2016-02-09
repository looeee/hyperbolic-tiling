import * as E from './euclid';
import { RegularTesselation } from './regularTesselation';

// * ***********************************************************************
// *
// *   SETUP
// *
// *************************************************************************

let p = E.randomInt(4,8);
let q = E.randomInt(4,8);

if(p === 4 && q ===4) p = 5;

const tesselation = new RegularTesselation(p, q);
//const tesselation = new RegularTesselation(11, 9);
