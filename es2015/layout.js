// * ***********************************************************************
// *
// *  LAYOUT CLASS
// *
// *  controls position/loading/hiding etc but NOT functionality
// *  of screen elements
// *************************************************************************

export class Layout {
  constructor() {
    this.getElements();
    this.setupLayout();
  }

  //any calls to document.querySelector() go here
  getElements() {
    this.leftControlsDiv = document.querySelector('#left-controls');
    this.rightControlsDiv = document.querySelector('#right-controls');
    this.imageControlsDiv = document.querySelector('#image-controls');
    this.saveImageBtn = document.querySelector('#save-image');
    this.downloadImageBtn = document.querySelector('#download-image');
    this.pValueDropdown = document.querySelector('#p');
    this.qValueDropdown = document.querySelector('#q');
    this.generateTilingBtn = document.querySelector('#generate-tiling');
    this.showControlsCheckbox = document.querySelector('#show-controls');
    this.designModeCheckbox = document.querySelector('#design-mode');
  }

  setupLayout() {
    this.tilingImage();
    this.radiusSlider();
  }

  radiusSlider() {
    const slider = document.querySelector('#tiling-radius');
    const maxRadius = (window.innerWidth < window.innerHeight)
      ? (window.innerWidth / 2) - 5
      : (window.innerHeight / 2) - 5;

    slider.setAttribute('max', maxRadius);
    slider.value = maxRadius;
    document.querySelector('#selected-radius').innerHTML = slider.value;
  }

  tilingImage() {
    const image = document.querySelector('#tiling-image');
    image.style.height = `${window.innerHeight}px`;
    image.style.width = `${window.innerWidth}px`;
  }


}
