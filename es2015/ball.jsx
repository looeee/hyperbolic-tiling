// * ***********************************************************************
// *
// *   PRE-SETUP
// *
// *************************************************************************

document.write('<canvas id="canvas" width="' + (window.innerWidth) + '" height="' + (window.innerHeight) + '"> \
  <h1> Canvas doesn\'t seem to be working! </h1> \
</canvas>');

// * ***********************************************************************
// *
// *   CONSTANTS
// *   define any global constants here
// *
// *************************************************************************


// * ***********************************************************************
// *
// *   HELPER FUNCTIONS
// *   define any global helper functions here
// *
// *************************************************************************

const radians = (degrees) => (Math.PI / 180) * degrees;

// * ***********************************************************************
// *
// *   DOCUMENT READY
// *
// *************************************************************************

$(document).ready(() => {


  // * ***********************************************************************
  // *
  // *  ELEMENTS CLASS
  // *  Holds references to any elements used
  // *
  // *************************************************************************
  class Elements {
    constructor() {
      this.canvas = $('#canvas')[0];
      this.ctx = this.canvas.getContext('2d');
    }
  }

  const elems = new Elements();

  // * ***********************************************************************
  // *
  // *  DIMENSIONS CLASS
  // *  Hold references to any dimensions used in calculations and
  // *  recalculate as needed (e.g. on window resize)
  // *
  // *************************************************************************
  class Dimensions {
    constructor() {
      //set the dimensions on load
      this.setDims();

      $(window).resize(() => {
        //reset the dimensions on window resize
        this.setDims();
      });
    }

    setDims() {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
    }

  }

  const dims = new Dimensions();

  // * ***********************************************************************
  // *
  // *   LAYOUT CLASS
  // *   overall layout set up goes here
  // *
  // *************************************************************************
  class Layout {
    constructor() {

      $(window).resize(() => {

      });
    }
  }

  const layout = new Layout();

  // * ***********************************************************************
  // *
  // *   BALL CLASS
  // *
  // *
  // *************************************************************************
  class Ball {
    constructor() {
      this.x = 100;
      this.y = 100;
      this.radius = 25;
      this.vx = 5;
      this.vy = 1;
      this.color = 'blue';
    }

    draw() {
      let ctx = elems.ctx;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  // * ***********************************************************************
  // *
  // *   CANVAS CLASS
  // *
  // *
  // *************************************************************************
  class Canvas {
    constructor() {
      this.raf;
      this.running = false;
      this.ball = new Ball();

      this.control();
    }

    control() {
      let ball = this.ball;
      elems.canvas.addEventListener('mousemove', (e) => {
        if (!this.running) {
          this.clear();
          ball.x = e.clientX - 15;
          ball.y = e.clientY - 80;
          ball.draw();
        }
      });

      elems.canvas.addEventListener('mouseout', (e) => {
        window.cancelAnimationFrame(this.raf);
        this.running = false;
      });

      elems.canvas.addEventListener('click', (e) => {
        if (!this.running) {
          this.raf = window.requestAnimationFrame(() => {
            this.draw();
          });
          this.running = true;
        }
      });
    }

    draw() {
      let ball = this.ball;
      this.clear();
      ball.draw();
      ball.x += ball.vx;
      ball.y += ball.vy;

      ball.vy *= .99;
      ball.vy += .55;

      if (ball.y + ball.vy > elems.canvas.height || ball.y + ball.vy < 0) {
        ball.vy = -ball.vy;
      }
      if (ball.x + ball.vx > elems.canvas.width || ball.x + ball.vx < 0) {
        ball.vx = -ball.vx;
      }

      this.raf = window.requestAnimationFrame(() => {
        this.draw();
      });
    }

    clear() {
      elems.ctx.fillStyle = 'rgba(255,255,255,0.3)';
      elems.ctx.fillRect(0, 0, elems.canvas.width, elems.canvas.height);
    }
  }

  const canvas = new Canvas();

});
