/* layout.js */

// * ***********************************************************************
// *
// *  LAYOUT CLASS
// *
// *  controls position/loading/hiding etc. Also controls ajax (fetch via polyfill)
// *************************************************************************
//TODO: memoize all calls to document.querySelector
export class Layout {
  constructor() {
    this.setupLayout();
  }

  setupLayout() {
    this.topPanel();
    this.radiusSlider();
  }

  onResize() {
    this.topPanel();
    this.radiusSlider();
  }

  topPanel() {
    const panel = document.querySelector('#top-panel');
    const panelLeft = document.querySelector('#top-panel-left');
    const panelCentre = document.querySelector('#top-panel-centre');
    const panelRight = document.querySelector('#top-panel-right');
    panelCentre.style.width =
      `${panel.offsetWidth - panelLeft.offsetWidth - panelRight.offsetWidth}px`;
    //panel.classList.remove('hide');
  }

  bottomPanel() {
    const panel = document.querySelector('#bottom-panel');
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

  hideElements(...elements) {
    for (const element of elements) {
      document.querySelector(element).classList.add('hide');
    }
  }

  showElements(...elements) {
    for (const element of elements) {
      document.querySelector(element).classList.remove('hide');
    }
  }


}
