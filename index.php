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
    <script src="//cdn.jsdelivr.net/lodash/4.6.1/lodash.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.18.2/TweenMax.min.js"></script>
    <script src="node_modules/three/three.js"></script>
    <!--<script src="node_modules/whatwg-fetch/fetch.js"></script>-->


  </head>

  <body>
    <div id="title">
      <h1>Tesselation Generator</h1>
    </div>

    <div id="top-panel">
      <div id="top-panel-left">
        <button id="select-euclidean">Euclidean</button>
        <button id="select-hyperbolic">Hyperbolic</button>
      </div>

      <div id="top-panel-centre">
        <div id="hyperbolic-controls" class="hide">
          <?php require_once('html_components/hyperbolic_controls.html'); ?>
        </div>
        <div id="euclidean-controls" class="hide">
          <?php require_once('html_components/euclidean_controls.html'); ?>
        </div>
        <div id="universal-controls" class="hide">
          <?php require_once('html_components/universal_controls.html'); ?>
        </div>
      </div>

      <div id="top-panel-right">
        <button id="generate-tiling">Generate Tiling</button>
      </div>

    </div>

    <div id="full-page-centered">
      <img id="tiling-image"></img>
    </div>

    <div id="bottom-panel">
      <div id="textures">
        <h3 id="texture-title">Select Textures</h3>
        <img id="texture1" class="texture" src="./images/textures/fish-black1.png" />
        <img id="texture2" class="texture" src="./images/textures/fish-white1-flipped.png" />
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
