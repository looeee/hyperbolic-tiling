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
//solve quadratic eq based -b^2... formula
const quadratic = (a, b, c) => {
  if(c === 0) return 0;
  let body = b*b -4*a*c;
  if( body < 0 ) return 0;

  let pos = (-b + Math.sqrt(body))/(2*c);
  let neg = (-b - Math.sqrt(body))/(2*c);

  return {
    pos: pos,
    neg: neg
  }
}

//distance between two points
const distance = (p1, p2) => Math.sqrt(Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2));

//midpoint of the line segment connecting two points
const midpoint = (p1, p2) => {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  }
}

//slope of line through p1, p2
const slope = (p1, p2) => (p2.x - p1.x) / (p2.y - p1.y);

//slope of line perpendicular to a line defined by p1,p2
const perpendicularSlope = (p1, p2) => -1 / (Math.pow(slope(p1, p2), -1));

//intersection point of two lines defined by p1,m1 and q1,m2
const intersection = (p1, m1, p2, m2) => {
  //y intercept of first line
  let c1 = p1.y - m1 * p1.x;
  //y intercept of second line
  let c2 = p2.y - m2 * p2.x;

  let x = (c2 - c1) / (m1 - m2);
  let y = m1 * x + c1;
  return {
    x: x,
    y: y
  }
}

const radians = (degrees) => (Math.PI / 180) * degrees;

//get the inverse of a point p with respect a circle radius r centre c
const inverse = (p, r, c) => {
  let alpha = (r * r) / (Math.pow(p.x - c.x, 2) + Math.pow(p.y - c.y, 2));
  return {
    x: alpha * (p.x - c.x) + c.x,
    y: alpha * (p.y - c.y) + c.y
  };
}

//calculate the radius and centre of the circle required to draw a line between
//two points in the hyperbolic plane defined by the circle r, c
const greatCircle = (p1, p2, r, c) => {
  let p1Inverse = inverse(p1, r, c);
  let p2Inverse = inverse(p2, r, c);

  let m = midpoint(p1, p1Inverse);
  let n = midpoint(p2, p2Inverse);

  let m1 = perpendicularSlope(m, p1Inverse);
  let m2 = perpendicularSlope(n, p2Inverse);

  //centre is the centrepoint of the circle out of which the arc is made
  let centre = intersection(m, m1, n, m2);
  let radius = distance(centre, p1);

  return { centre: centre, radius: radius };
}

//intersection of two circles with equations:
//(x-a)^2 +(y-a)^2 = r0^2
//(x-b)^2 +(y-c)^2 = r1^2
const circleIntersect = (c0, c1, r0, r1) => {
  let a = c0.x;
  let b = c0.y;
  let c = c1.x;
  let d = c1.y;
  let dist = Math.sqrt((c-a)*(c-a) +(d-b)*(d-b));

  let del = Math.sqrt((dist+r0+r1)*(dist+r0-r1)*(dist-r0+r1)*(-dist+r0+r1)) / 4;

  let xPartial = (a+c)/2 +((c-a)*(r0*r0-r1*r1))/(2*dist*dist);
  let x1 = xPartial + 2*del*(b-d)/(dist*dist);
  let x2 = xPartial - 2*del*(b-d)/(dist*dist);

  let yPartial = (b+d)/2 +((d-b)*(r0*r0-r1*r1))/(2*dist*dist);
  let y1 = yPartial + 2*del*(a-c)/(dist*dist);
  let y2 = yPartial - 2*del*(a-c)/(dist*dist);

  let p1 = {
    x: x1,
    y: y1
  }

  let p2 = {
    x: x2,
    y:y2
  }

  return {p1:p1, p2:p2};
}



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
      this.radius = this.radius / 2;

      this.color = 'black';
    }

    drawOuterCircle() {
      elems.ctx.beginPath();
      elems.ctx.arc(this.centre.x, this.centre.y, this.radius, 0, Math.PI * 2);
      elems.ctx.strokeStyle = this.color;
      elems.ctx.stroke();
    }

    drawCircle(c, r) {
      elems.ctx.beginPath();
      elems.ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
      elems.ctx.strokeStyle = this.color;
      elems.ctx.stroke();
    }

    //draw a point on the disk, optional radius and colour
    drawPoint(point, radius, colour) {
      let c = colour || 'black';
      let r = radius || 2;
      elems.ctx.beginPath();
      elems.ctx.arc(point.x, point.y, r, 0, Math.PI * 2, true);
      elems.ctx.fillStyle = c;
      elems.ctx.fill();
    }

    //draw a hyperbolic line between two points
    drawLine(p1, p2) {
      let c = greatCircle(p1, p2, this.radius, this.centre);
      this.drawCircle(c.centre, c.radius);
      let points = circleIntersect(this.centre, c.centre, this.radius, c.radius);
      this.drawPoint(points.p1);
      this.drawPoint(points.p2);
      this.drawPoint(c.centre);

      this.drawArc(points.p2, points.p1);
    }

    //Draw an arc (hyperbolic line segment) between two points on the disk
    drawArc(p1, p2) {
      let arcLength = ( p1, p2, r ) => 2 * Math.asin(0.5 * distance(p1, p2) / r);
      let c = greatCircle(p1, p2, this.radius, this.centre);
      let alpha = arcLength(p1, p2, c.radius);

      //a point at 0 radians on the circle
      let point = {
        x: c.centre.x + c.radius,
        y: c.centre.y
      }
      //how far around the circle that start of the arc is
      let alphaOffset = arcLength(p1, point, c.radius);

      //draw the arc
      elems.ctx.beginPath();
      elems.ctx.arc(c.centre.x, c.centre.y, c.radius, -alphaOffset, alpha - alphaOffset);
      elems.ctx.strokeStyle = this.color;
      elems.ctx.stroke();
    }
  }

  const disk = new Disk();

  // * ***********************************************************************
  // *
  // *   CANVAS CLASS
  // *
  // *
  // *************************************************************************
  class Canvas {
    constructor() {
      this.draw();
      $(window).resize(() => {
        //this.clear();
        //this.draw();
      });
    }

    draw() {
      disk.drawOuterCircle();
      disk.drawPoint(disk.centre);

      let p1 = {
        x: -60,
        y: -40
      }

      let p2 = {
        x: -60,
        y: 100
      }
      disk.drawPoint(p1);
      disk.drawPoint(p2);

      disk.drawLine(p1, p2);
    }

    //the canvas has been translated to the centre of the disk so need to
  //use an offset to clear it. NOT WORKING
    clear() {
      elems.ctx.clearRect(-dims.windowWidth / 2, -dims.windowHeight / 2, dims.windowWidth, dims.windowHeight);
    }

    //draw a (euclidean) line between two points
    drawEuclideanLine(p1, p2, colour) {
      let c = colour || 'black';
      elems.ctx.beginPath();
      elems.ctx.moveTo(p1.x, p1.y);
      elems.ctx.lineTo(p2.x, p2.y);
      elems.ctx.strokeStyle = c;
      elems.ctx.stroke()
    }
  }

  const canvas = new Canvas();
});
