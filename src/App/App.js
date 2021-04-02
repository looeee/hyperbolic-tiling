import * as THREE from 'three';
import Time from '../utilities/Time.js';

/**
 * @author Lewy Blue / https://github.com/looeee
 *
 */

let _canvas;
let _scene;
let _camera;
let _renderer;

let _currentAnimationFrameID;


function App( canvas ) {

  const self = this;

  if ( canvas !== undefined ) _canvas = canvas;

  this.autoRender = true;

  this.autoResize = true;

  this.frameCount = 0;

  this.delta = 0;

  this.isPlaying = false;
  this.isPaused = false;

  this.time = new Time();

  const setRendererSize = function () {

    if ( _renderer ) _renderer.setSize( self.canvas.clientWidth, self.canvas.clientHeight, false );

  };

  const setCameraAspect = function () {

    if ( _camera ) {
      _camera.aspect = _canvas.clientWidth / _canvas.clientHeight;
      _camera.updateProjectionMatrix();
    }

  };

  // note: gets called last when autoResize is on
  this.onWindowResize = function () {};

  const onWindowResize = function () {

    if ( !self.autoResize ) {

      self.onWindowResize();
      return;

    }

    // don't do anything if the camera doesn't exist yet
    if ( !_camera ) return;

    if ( _camera.type !== 'PerspectiveCamera' ) {

      console.warn( 'THREE.App: AutoResize only works with PerspectiveCamera' );
      return;

    }

    setCameraAspect();

    setRendererSize();

    self.onWindowResize();


  };

  window.addEventListener( 'resize', onWindowResize, false );

  Object.defineProperties( this, {

    canvas: {

      get() {

        if ( _canvas === undefined ) {

          _canvas = document.body.appendChild( document.createElement( 'canvas' ) );
          _canvas.style.position = 'absolute';
          _canvas.style.width = _canvas.style.height = '100%';

        }

        return _canvas;

      },

      set( newCanvas ) {

        _canvas = newCanvas;

      },
    },

    camera: {

      get() {

        if ( _camera === undefined ) {

          _camera = new THREE.PerspectiveCamera( 50, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1000 );

        }

        return _camera;

      },

      set( camera ) {

        _camera = camera;
        setCameraAspect();

      },
    },

    scene: {

      get() {

        if ( _scene === undefined ) {

          _scene = new THREE.Scene();

        }

        return _scene;

      },

      set( scene ) {

        _scene = scene;

      },
    },

    renderer: {

      get() {

        if ( _renderer === undefined ) {

          _renderer = new THREE.WebGLRenderer( { canvas: this.canvas, antialias: true } );
          _renderer.setPixelRatio( window.devicePixelRatio );
          _renderer.setSize( this.canvas.clientWidth, this.canvas.clientHeight, false );

        }

        return _renderer;

      },

      set( renderer ) {

        _renderer = renderer;
        setRendererSize();

      },

    },

    averageFrameTime: {

      get() {

        return ( this.frameCount !== 0 ) ? this.time.unscaledTotalTime / this.frameCount : 0;

      },

    },

  } );

  this.play = function () {

    this.time.start();

    this.isPlaying = true;
    this.isPaused = false;

    function animationHandler() {

      self.frameCount ++;
      self.delta = self.time.delta;

      self.onUpdate();

      if ( self.controls && self.controls.enableDamping ) self.controls.update();

      if ( self.autoRender ) self.renderer.render( self.scene, self.camera );

      _currentAnimationFrameID = requestAnimationFrame( () => { animationHandler(); } );

    }

    animationHandler();

  };

  this.pause = function () {

    this.isPaused = true;

    this.time.pause();

    cancelAnimationFrame( _currentAnimationFrameID );

  };

  this.stop = function () {

    this.isPlaying = false;
    this.isPaused = false;

    this.time.stop();
    this.frameCount = 0;

    cancelAnimationFrame( _currentAnimationFrameID );

  };

  this.onUpdate = function () {};

  this.toJSON = function ( object ) {
    if ( typeof object.toJSON === 'function' ) {
      const json = object.toJSON();

      window.open( 'data:application/json;' + ( window.btoa
      ? 'base64,' + btoa( JSON.stringify( json ) )
      : JSON.stringify( json ) ) );
    } else {
      console.error( 'App.toJSON error: object does not have a toJSON function.' );
    }
  };

  this.initControls = function () {

    this.controls = new OrbitControls( this.camera, this.canvas );

    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.2;

  };

  this.fitCameraToObject = function ( object, zoom ) {

    zoom = zoom || 1.25;

    const boundingBox = new THREE.Box3();

    // get bounding box of object - this will be used to setup controls and camera
    boundingBox.setFromObject( object );

    const center = boundingBox.getCenter( new THREE.Vector3() );
    const size = boundingBox.getSize( new THREE.Vector3() );

    // get the max side of the bounding box
    const maxDim = Math.max( size.x, size.y, size.z );
    const fov = this.camera.fov * ( Math.PI / 180 );
    let cameraZ = Math.abs( maxDim / 4 * Math.tan( fov * 2 ) );

    cameraZ *= zoom; // zoom out a little so that objects don't fill the screen

    this.camera.position.z = cameraZ;

    const minZ = boundingBox.min.z;
    const cameraToFarEdge = ( minZ < 0 ) ? -minZ + cameraZ : cameraZ - minZ;

    this.camera.far = cameraToFarEdge * 3;
    this.camera.updateProjectionMatrix();

    if ( this.controls ) {

      // set camera to rotate around center of loaded object
      this.controls.target = center;

      // prevent camera from zooming out far enough to create far plane cutoff
      this.controls.maxDistance = cameraToFarEdge * 2;

      this.controls.saveState();

    }

    return boundingBox;

  };

  // take a screenshot at a given width and height
  // and return an img element
  this.takeScreenshot = function ( width, height ) {

    const img = new Image();

    if ( width > 0 && height > 0 ) {

      // set camera and renderer to screenshot size
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize( width, height, false );

      // render scene
      this.renderer.render( this.scene, this.camera, null, false );

      img.src = this.renderer.domElement.toDataURL();

      // reset the renderer and camera to original size
      this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize( this.canvas.clientWidth, this.canvas.clientHeight, false );

    } else {

      // render scene
      this.renderer.render( this.scene, this.camera, null, false );

      img.src = this.renderer.domElement.toDataURL();

    }

    return img;

  };

}

export default App;
