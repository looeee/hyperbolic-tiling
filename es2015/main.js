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
  // *   DISK CLASS
  // *   Poincare Disk representation of the hyperbolic plane
  // *
  // *************************************************************************
  class Disk {
    constructor() {
      this.x = dims.windowWidth / 2;
      this.y = dims.windowHeight / 2;

      //transform the canvas so the origin is at the centre of the disk
      elems.ctx.translate(this.x, this.y);

      this.centre = {
        x: 0,
        y: 0
      }

      //draw largest circle possible given window dims
      this.radius = (dims.windowWidth < dims.windowHeight) ? (dims.windowWidth / 2) - 5 : (dims.windowHeight / 2) - 5;

      //smaller circle for testing
      //this.radius = this.radius / 2;

      this.color = 'black';

      this.drawOuterCircle();
      this.drawPoint(this.centre);

      let p1 = {
        x: -60,
        y: -40
      }

      let p2 = {
        x: -60,
        y: 100
      }
      this.drawPoint(p1);
      this.drawPoint(p2);

      this.drawArc(p1, p2);
    }

    drawOuterCircle() {
      elems.ctx.beginPath();
      elems.ctx.arc(this.centre.x, this.centre.y, this.radius, 0, Math.PI * 2);
      elems.ctx.closePath();
      elems.ctx.strokeStyle = this.color;
      elems.ctx.stroke();
    }

    //draw a point on the disk, optional radius and colour
    drawPoint(point, radius, colour) {
      let c = colour || 'black';
      let r = radius || 2;
      elems.ctx.beginPath();
      elems.ctx.arc(point.x, point.y, r, 0, Math.PI * 2, true);
      elems.ctx.closePath();
      elems.ctx.fillStyle = c;
      elems.ctx.fill();
    }

    //Draw an arc (hyperbolic line) between two points on the disk
    drawArc(p1, p2) {
      let p1Inverse = this.inverse(p1);
      let p2Inverse = this.inverse(p2);

      let m = this.midpoint(p1, p1Inverse);
      let n = this.midpoint(p2, p2Inverse);

      let m1 = this.perpendicularSlope(m, p1Inverse);
      let m2 = this.perpendicularSlope(n, p2Inverse);

      //intersect is the centrepoint of the circle out of which the arc is made
      let intersect = this.intersection(m, m1, n, m2);
      let radius = this.distance(intersect, p1);

      //draw the arch
      elems.ctx.beginPath();
      elems.ctx.arc(intersect.x, intersect.y, radius, 0, Math.PI * 2, true);
      elems.ctx.closePath();
      elems.ctx.strokeStyle = this.color;
      elems.ctx.stroke();
    }

    //get the inverse of a point with respect to the circular
    //boundary of the disk
    inverse(point) {
      let alpha = (this.radius * this.radius)
                  / (Math.pow(point.x -this.centre.x, 2)
                  + Math.pow(point.y -this.centre.y, 2)
                );
      let inversePoint = {
        x: alpha * (point.x - this.centre.x) + this.centre.x,
        y: alpha * (point.y - this.centre.y) + this.centre.y
      };
      return inversePoint;
    }

    //distance between two points
    distance(p1, p2) {
      return Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));
    }

    //midpoint of the line segment connecting two points
    midpoint(p1, p2) {
      return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2
      }
    }

    //slope of line through p1, p2
    slope(p1, p2) {
      return (p2.x - p1.x) / (p2.y - p1.y);
    }

    //slope of line perpendicular to a line defined by p1,p2
    perpendicularSlope(p1, p2) {
      return -1/(Math.pow(this.slope(p1, p2), -1));
    }

    //intersection point of two lines defined by p1,m1 and q1,m2
    intersection(p1, m1, p2, m2) {
      //y intercept of first line
      let c1 = p1.y-m1*p1.x;
      //y intercept of second line
      let c2 = p2.y-m2*p2.x;

      let x = (c2-c1)/(m1-m2);
      let y = m1*x+c1;
      return {
        x: x,
        y: y
      }
    }

    //draw a (euclidean) line between two points
    drawLine(p1, p2, colour) {
      let c = colour || 'black';
      elems.ctx.beginPath();
      elems.ctx.moveTo(p1.x, p1.y);
      elems.ctx.lineTo(p2.x, p2.y);
      elems.ctx.strokeStyle = c;
      elems.ctx.stroke()
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
      this.disk = new Disk();
    }

    draw() {

    }

    clear() {

    }
  }

  const canvas = new Canvas();

});
