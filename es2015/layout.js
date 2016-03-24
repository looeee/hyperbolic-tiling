// * ***********************************************************************
// *
// *  LAYOUT CLASS
// *
// *  controls position/loading/hiding etc but NOT functionality
// *  of screen elements
// *************************************************************************

export class Layout {
  constructor() {
    this.setupLayout();
  }

  setupLayout() {
    this.tilingImage();
    this.radiusSlider();
  }

  resize() {
    //this.tilingImage();
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
    //image.style.height = `${window.innerHeight}px`;
    //image.style.width = `${window.innerWidth}px`;
  }


}
