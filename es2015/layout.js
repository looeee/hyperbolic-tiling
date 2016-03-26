fetchAndAppendHTMLToElement = (url, elem, promise) => {
  fetch(url).then((response) => {
    return response.text();
  }).then((returnedValue) => {
    elem.innerHTML = returnedValue;
    if (promise) {
      console.log(promise);
      promise.resolve();
    }
  }).catch((err) => {
    console.error(err);
  });
};

// * ***********************************************************************
// *
// *  LAYOUT CLASS
// *
// *  controls position/loading/hiding etc. Also controls ajax (fetch via polyfill)
// *************************************************************************

export class Layout {
  constructor() {
    this.setupLayout();
  }

  setupLayout() {
    this.radiusSlider();
  }

  onResize() {
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

  hideElement(element) {
    document.querySelector(element).classList.add('hide');
  }

  showElement(element) {
    document.querySelector(element).classList.remove('hide');
  }


}
