import {
  RegularTesselation
}
from './regularTesselation';
import {
  ThreeJS
}
from './threejs';
// * ***********************************************************************
// *
// *  PAGE CONTROLLER CLASS
// *
// *************************************************************************


export class Controller {
  constructor() {
    this.draw = new ThreeJS();
    this.regularHyperbolicTiling( );
    this.saveImageButtons();
  }

  regularHyperbolicTiling(  ){
    document.querySelector('#generate-tiling').onclick = () => {
      const spec = this.tilingSpec();
      const regularTesselation = new RegularTesselation( spec );

      let t0 = performance.now();
      const tiling = regularTesselation.generateTiling();
      let t1 = performance.now();
      console.log('generateTiling took ' + (t1 - t0) + ' milliseconds.')
      t0 = performance.now();
      this.draw.polygonArray( tiling, spec.textures);
      t1 = performance.now();
      console.log('DrawTiling took ' + (t1 - t0) + ' milliseconds.')
    }
  }

  tilingSpec(){
    const spec = {
      wireframe: false,
      p: document.querySelector('#p').value,
      q: document.querySelector('#q').value,
      textures: ['./images/textures/fish-black1.png', './images/textures/fish-white1-flipped.png'],
      edgeAdjacency: [ //array of length p
                      [1, //edge_0 orientation (-1 = reflection, 1 = rotation)
                        5 //edge_0 adjacency (range p - 1)
                      ],
                      [1, 4], //edge_1 orientation, adjacency
                      [1, 3], [1, 2], [1, 1], [1, 0]],
      minPolygonSize: 0.05,
    }

    return spec;
  }

  saveImageButtons(){
    document.querySelector('#save-image').onclick = () => this.draw.saveImage();
    document.querySelector('#download-image').onclick = () => this.draw.downloadImage();

  }
}
