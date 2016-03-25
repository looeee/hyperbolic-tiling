fetchAndAppendHTMLToElement = (url, elem) => {
  fetch(url).then((response) => {
    return response.text();
  }).then((returnedValue) => {
    elem.innerHTML = returnedValue;
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

  setupLayout() {}

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

  loadEuclideanControls() {
    const controls = document.querySelector('#euclidean-controls');
    if (controls.innerHTML === '') {
      fetchAndAppendHTMLToElement('./ajax_components/euclidean_controls.html', controls);
    }
  }

  destroyEuclideanControls() {
    document.querySelector('#euclidean-controls').innerHTML = '';
  }

  loadHyperbolicControls() {
    const controls = document.querySelector('#hyperbolic-controls');
    if (controls.innerHTML === '') {
      fetchAndAppendHTMLToElement('./ajax_components/hyperbolic_controls.html', controls);
    }
  }

  destroyHyperbolicControls() {
    document.querySelector('#hyperbolic-controls').innerHTML = '';
  }

  loadUniversalControls() {
    const controls = document.querySelector('#universal-controls');
    if (controls.innerHTML === '') {
      fetchAndAppendHTMLToElement('./ajax_components/universal_controls.html', controls);
    }
    //this.radiusSlider();
  }

  destroyUniversalControls() {
    document.querySelector('#universal-controls').innerHTML = '';
  }

}
