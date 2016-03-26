<!DOCTYPE html>
<html>

  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <meta name="description" content="EscherSketch - Create Hyperbolic Tilings">

    <title>EscherSketch - Create Hyperbolic Tilings</title>

    <link rel="icon" type="image/png" href="favicon.png" />
    <link href='https://fonts.googleapis.com/css?family=Roboto:400,700,900' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" type="text/css" href="styles/main.css" />

    <script src="node_modules/three/three.js"></script>
    <script src="node_modules/whatwg-fetch/fetch.js"></script>
  </head>

  <body>

    <h1 id="title" class="full-width">Hyperbolic Tiling</h1>

    <div id="controls" class="flex-container">

      <div id="tesselation-selector" class="flex-item full-width">
        <h3>Step 1: Select Tesselation Type</h3>
        <button id="euclidean">Euclidean</button>
        <button id="hyperbolic">Hyperbolic</button>
        <span>Design Mode</span><input type="checkbox" id="design-mode" />
      </div>

      <div id="hyperbolic-controls" class="flex-item full-width hide">
        <?php require_once('html_components/hyperbolic_controls.html'); ?>
      </div>
      <div id="euclidean-controls" class="flex-item full-width hide">
        <?php require_once('html_components/euclidean_controls.html'); ?>
      </div>
      <div id="universal-controls" class="flex-item full-width hide">
        <?php require_once('html_components/universal_controls.html'); ?>
      </div>

    </div>

    <div class="flex-container">
      <div class="flex-item">
        <img id="tiling-image" ></img>
      </div>
    </div>
  </body>

  <script src="scripts/main.js"></script>

  <script>
    !function(E,s,c,h,e,r){E.GoogleAnalyticsObject=c;E[c]||(E[c]=function(){
    (E[c].q=E[c].q||[]).push(arguments)});E[c].l=+new Date;e=s.createElement(h);
    r=s.getElementsByTagName(h)[0];e.src='//www.google-analytics.com/analytics.js';
    r.parentNode.insertBefore(e,r)}(window,document,'ga','script');

    ga('create', 'UA-74515319-1', 'auto');
    ga('send', 'pageview');
  </script>

</html>
