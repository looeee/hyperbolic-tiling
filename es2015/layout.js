/* layout.js */
class Title {
  constructor() {
    this.title = document.querySelector('#title');
  }
}


class TopPanel {
  constructor() {
    this.panel = document.querySelector('#top-panel');
    this.panelLeft = document.querySelector('#top-panel-left');
    this.panelCentre = document.querySelector('#top-panel-centre');
    this.panelRight = document.querySelector('#top-panel-right');

    this.init();
  }

  init() {
    const centrePanelWidth = (window.innerWidth / 100) * 96
      - this.panelLeft.offsetWidth - this.panelRight.offsetWidth;

    this.panelCentreTween = new TweenMax(this.panelCentre, 1, { width: centrePanelWidth });
    this.panelRightTween = new TweenMax(this.panelRight, 1, {
      left: centrePanelWidth + this.panelLeft.offsetWidth });

    this.expandTimeline = new TimelineMax({ paused: true });
    this.expandTimeline.add(this.panelCentreTween, 0).add(this.panelRightTween, 0);
  }

  expand() {
    this.expandTimeline.play();
  }

  contract() {
    this.expandTimeline.reverse(0);
  }
}

// * ***********************************************************************
// *
// *  LAYOUT CONTROLLER CLASS
// *
// *  controls position/loading/hiding etc.
// *************************************************************************
export class LayoutController {
  constructor() {
    this.topPanel = new TopPanel();
    this.setupLayout();
  }

  setupLayout() {
    //this.topPanel();
    this.radiusSlider();
  }

  onResize() {
    this.topPanel();
    this.radiusSlider();
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
