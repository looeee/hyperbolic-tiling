import {
  RegularTesselation
}
from './regularTesselation';
// * ***********************************************************************
// *
// *  PAGE CONTROLLER CLASS
// *
// *************************************************************************
const circleLimit1Spec = {
  wireframe: false,
  p: 6,
  q: 6,
  textures: ['./images/textures/fish-black1.png', './images/textures/fish-white1-flipped.png'],
  edgeAdjacency: [     //array of length p
                  [ 1, //edge_0 orientation (-1 = reflection, 1 = rotation)
                    5  //edge_0 adjacency (range p - 1)
                  ],
                  [1, 4], //edge_1 orientation, adjacency
                  [1, 3], [1, 2], [1, 1], [1, 0]],
  minPolygonSize: 0.02,
};


export class Controller {
  constructor() {
    this.tilingSpec = circleLimit1Spec;
    this.setupButtons();
  }

  setupButtons(){
    document.querySelector('#generate-tiling').onclick = () =>
      new RegularTesselation(this.tilingSpec);
  }
}
