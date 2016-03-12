import {
  RegularTesselation
}
from './regularTesselation';
import {
  Drawing
}
from './drawing';
// * ***********************************************************************
// *
// *  CONTROLLER CLASS
// *
// *************************************************************************
export class Controller {
  constructor() {
    this.getElements();
    this.draw = new Drawing();
    this.setupControls();
    this.regularHyperbolicTiling( );

  }

  //any calls to document.querySelector() go here
  getElements(){
    this.leftControlsDiv = document.querySelector('#left-controls');
    this.rightControlsDiv = document.querySelector('#right-controls');
    this.imageControlsDiv = document.querySelector('#image-controls');
    this.saveImageBtn = document.querySelector('#save-image');
    this.downloadImageBtn = document.querySelector('#download-image');
    this.testBtn = document.querySelector('#test');
    this.pValueDropdown = document.querySelector('#p');
    this.qValueDropdown = document.querySelector('#q');
    this.generateTilingBtn = document.querySelector('#generate-tiling');
    this.showControlsCheckbox = document.querySelector('#show-controls');
    this.imageElem = document.querySelector('#tiling-image');
    this.radiusSlider = document.querySelector('#tiling-radius');
    this.radiusValue = document.querySelector('#selected-radius');
  }

  setupControls(){
    this.saveImageButtons();
    this.hideControls();
    this.setupRadiusSlider();
    this.setupTestBtn()
  }

  setupTestBtn(){
    this.testBtn.onclick = () => {
      //this.draw.reset();
      //this.imageElem.setAttribute('src', '');
    }
  }

  setupRadiusSlider(){
    const maxRadius = (window.innerWidth < window.innerHeight) ? (window.innerWidth / 2) - 5 : (window.innerHeight / 2) - 5;
    this.radiusSlider.setAttribute('max', maxRadius);
    this.radiusSlider.value = maxRadius;
    this.radiusValue.innerHTML = this.radiusSlider.value;
    this.draw.radius = this.radiusSlider.value;
    this.radiusSlider.oninput = () => {
      this.radiusValue.innerHTML = this.radiusSlider.value;
      this.draw.radius = this.radiusSlider.value;
    }
  }

  regularHyperbolicTiling(  ){
    this.generateTilingBtn.onclick = () => {
      this.draw.reset();
      const spec = this.tilingSpec();
      const regularTesselation = new RegularTesselation( spec );
      let t0 = performance.now();
      const tiling = regularTesselation.generateTiling();
      let t1 = performance.now();
      console.log('generateTiling took ' + (t1 - t0) + ' milliseconds.');
      t0 = performance.now();
      this.draw.polygonArray( tiling, spec.textures);
      t1 = performance.now();
      console.log('DrawTiling took ' + (t1 - t0) + ' milliseconds.');
      this.imageControlsDiv.classList.remove('hide');
    }
  }

  tilingSpec(){
    const spec = {
      wireframe: false,
      p: this.pValueDropdown.value,
      q: this.qValueDropdown.value,
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
    this.saveImageBtn.onclick = () => this.draw.saveImage();
    this.downloadImageBtn.onclick = () => this.draw.downloadImage();
  }

  hideControls(){
    this.showControlsCheckbox.onclick = () => {
      this.leftControlsDiv.classList.toggle('hide');
    }
  }
}
