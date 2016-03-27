import {
  RegularTesselation,
}
from './hyperbolic/regularTesselation';
import {
  Drawing,
}
from './drawing';
import {
  Layout,
}
from './layout';

// * ***********************************************************************
// *
// *  CONTROLLER CLASS
// *
// *************************************************************************
export class Controller {
  constructor() {
    this.layout = new Layout();
    this.draw = new Drawing();
    //this.regularHyperbolicTiling();
    this.setupControls();
    this.layout = new Layout();
    this.updateLowQualityTiling();
    this.throttledUpdateLowQualityTiling = _.throttle(() => {
      this.updateLowQualityTiling();
    }, 100);
  }

  onResize() {
    this.layout.onResize();
    const sliderValue = document.querySelector('#tiling-radius').value;
    if (this.draw.radius > sliderValue) {
      this.draw.radius = sliderValue;
    }
  }

  setupControls() {
    this.saveImageButtons();
    this.radiusSlider();
    this.tesselationTypeSelectButtons();
    this.generateTilingButton();
  }

  tesselationTypeSelectButtons() {
    const euclidean = document.querySelector('#euclidean');
    const hyperbolic = document.querySelector('#hyperbolic');
    euclidean.onclick = () => {
      euclidean.classList.add('selected');
      hyperbolic.classList.remove('selected');
      this.layout.showElement('#euclidean-controls');
      this.layout.hideElement('#hyperbolic-controls');
      this.layout.showElement('#universal-controls');
    };
    hyperbolic.onclick = () => {
      hyperbolic.classList.add('selected');
      euclidean.classList.remove('selected');
      this.layout.showElement('#hyperbolic-controls');
      this.layout.hideElement('#euclidean-controls');
      this.layout.showElement('#universal-controls');
    };
  }

  polygonSidesDropdown() {
    document.querySelector('#p').onchange = () => {
      console.log('obj');
      this.throttledUpdateLowQualityTiling();
    };
  }

  radiusSlider() {
    const test = () => { console.log('test');};
    const slider = document.querySelector('#tiling-radius');
    const selectedRadius = document.querySelector('#selected-radius');
    this.draw.radius = slider.value;
    slider.oninput = () => {
      selectedRadius.innerHTML = slider.value;
      this.draw.radius = slider.value;
      this.throttledUpdateLowQualityTiling();
    };
  }

  updateLowQualityTiling() {
    this.generateTiling('#low-quality-image', true);
  }

  generateTiling(elem, designMode) {
    this.draw.reset();
    const spec = this.tilingSpec();
    const regularTesselation = new RegularTesselation(spec);
    const t0 = performance.now();
    const tiling = regularTesselation.generateTiling(designMode);
    const t1 = performance.now();
    console.log(`generateTiling took ${(t1 - t0)} milliseconds.`);
    this.addTilingImageToDom(spec, tiling, elem);
    document.querySelector('#image-controls').classList.remove('hide');
  }

  addTilingImageToDom(spec, tiling, elem) {
    const t0 = performance.now();
    this.draw.polygonArray(tiling, spec.textures, 0xffffff, false, elem);
    const t1 = performance.now();
    console.log(`DrawTiling took ${(t1 - t0)} milliseconds.`);
  }

  generateTilingButton() {
    document.querySelector('#generate-tiling').onclick = () => {
      this.generateTiling('#final-image', false);
      //document.querySelector('#tiling-image').scrollIntoView();
    };
  }

  tilingSpec() {
    const spec = {
      wireframe: false,
      p: document.querySelector('#p').value,
      q: document.querySelector('#q').value,
      textures: ['./images/textures/fish-black1.png', './images/textures/fish-white1-flipped.png'],
      edgeAdjacency: [ //array of length p
                      [1, //edge_0 orientation (-1 = reflection, 1 = rotation)
                        5, //edge_0 adjacency (range p - 1)
                      ],
                      [1, 4], //edge_1 orientation, adjacency
                      [1, 3], [1, 2], [1, 1], [1, 0]],
      minPolygonSize: 0.05,
    };
    return spec;
  }

  saveImageButtons() {
    document.querySelector('#save-image').onclick = () => this.draw.saveImage();
    document.querySelector('#download-image').onclick = () => this.draw.downloadImage();
  }
}
