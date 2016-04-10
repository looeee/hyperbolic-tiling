/* controller.js */

import {
  EuclideanTesselation,
}
from './euclidean/euclideanTesselation';
import {
  RegularHyperbolicTesselation,
}
from './hyperbolic/regularHyperbolicTesselation';
import {
  Drawing,
}
from './drawing';
import {
  LayoutController as Layout,
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
    this.setupControls();
    this.updateLowQualityTiling();
    this.throttledUpdateLowQualityTiling = _.throttle(() => {
      this.updateLowQualityTiling();
    }, 100);
    this.selectedTilingType = null;
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
    this.polygonSidesDropdown();
    this.polygonsPerVertexDropdown();
  }

  tesselationTypeSelectButtons() {
    const euclidean = document.querySelector('#select-euclidean');
    const hyperbolic = document.querySelector('#select-hyperbolic');
    const controls = () => {
      this.layout.hideElements('#image-controls');
      this.layout.topPanel.expand();
      this.throttledUpdateLowQualityTiling();
    };
    euclidean.onclick = () => {
      controls();
      this.selectedTilingType = 'euclidean';
      euclidean.classList.add('selected');
      hyperbolic.classList.remove('selected');
      this.layout.showElements('#euclidean-controls', '#universal-controls');
      this.layout.hideElements('#hyperbolic-controls', '#title');
    };
    hyperbolic.onclick = () => {
      controls();
      this.selectedTilingType = 'hyperbolic';
      hyperbolic.classList.add('selected');
      euclidean.classList.remove('selected');
      this.layout.showElements('#hyperbolic-controls', '#universal-controls');
      this.layout.hideElements('#euclidean-controls', '#title');
    };
  }

  polygonSidesDropdown() {
    document.querySelector('#p').onchange = () => {
      this.throttledUpdateLowQualityTiling();
    };
  }

  polygonsPerVertexDropdown() {
    document.querySelector('#q').onchange = () => {
      this.throttledUpdateLowQualityTiling();
    };
  }

  radiusSlider() {
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
    if (this.selectedTilingType === 'euclidean') {
      this.generateEuclideanTiling('#tiling-image', true);
    }
    else if (this.selectedTilingType === 'hyperbolic') {
      this.generateRegularHyperbolicTiling('#tiling-image', true);
    }
  }

  addTilingImageToDom(spec, tiling, elem) {
    const t0 = performance.now();
    this.draw.polygonArray(tiling, spec.textures, 0xffffff, false, elem);
    const t1 = performance.now();
    console.log(`DrawTiling took ${(t1 - t0)} milliseconds.`);
  }

  generateTilingButton() {
    document.querySelector('#generate-tiling').onclick = () => {
      this.layout.showElements('#image-controls');
      this.layout.hideElements('#euclidean-controls', '#hyperbolic-controls');
      if (this.selectedTilingType === 'euclidean') {
        this.generateEuclideanTiling('#tiling-image', false);
      }
      else if (this.selectedTilingType === 'hyperbolic') {
        this.generateRegularHyperbolicTiling('#tiling-image', false);
      }
    };
  }

  generateEuclideanTiling(elem, designMode) {
    this.draw.reset();
    const spec = this.euclideanTilingSpec();
    const tesselation = new EuclideanTesselation(spec);
    const tiling = tesselation.generateTiling(designMode);
    this.addTilingImageToDom(spec, tiling, elem);
  }

  euclideanTilingSpec() {
    return {
      wireframe: false,
      p: 4,
      q: 4,
      textures: ['./images/textures/fish-black1.png', './images/textures/fish-white1-flipped.png'],
    };
  }

  generateRegularHyperbolicTiling(elem, designMode) {
    this.draw.reset();
    const spec = this.regularHyperbolicTilingSpec();
    const tesselation = new RegularHyperbolicTesselation(spec);
    const t0 = performance.now();
    const tiling = tesselation.generateTiling(designMode);
    const t1 = performance.now();
    console.log(`generateTiling took ${(t1 - t0)} milliseconds.`);
    this.addTilingImageToDom(spec, tiling, elem);
  }

  regularHyperbolicTilingSpec() {
    return {
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
  }

  saveImageButtons() {
    document.querySelector('#save-image').onclick = () => this.draw.saveImage();
    document.querySelector('#download-image').onclick = () => this.draw.downloadImage();
  }
}
