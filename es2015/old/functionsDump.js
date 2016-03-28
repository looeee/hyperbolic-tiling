/* fetchAndAppendHTMLToElement = (url, elem, promise) => {
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
*/
