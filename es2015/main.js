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
const PI2 = Math.PI * 2;

// * ***********************************************************************
// *
// *   HELPER FUNCTIONS
// *   define any global helper functions here
// *
// *************************************************************************

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
  let c1, c2, x, y;
  //CODE TO DEAL WITH m1 or m2 == inf (or very large number due to rounding error)
  if(m1 > 5000 || m1 === Infinity){
    x = p1.x;
    y = (m2)*(p1.x-p2.x) + p2.y;
  }
  else if(m2 > 5000 || m1 === Infinity){
    x = p2.x;
    y = (m1*(p2.x-p1.x)) + p1.y;
  }
  else{
    //y intercept of first line
    c1 = p1.y - m1 * p1.x;
    //y intercept of second line
    c2 = p2.y - m2 * p2.x;

    x = (c2 - c1) / (m1 - m2);
    y = m1 * x + c1;
  }
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
//two points in the hyperbolic plane defined by the disk (r, c)
const greatCircle = (p1, p2, r, c) => {
  //console.log(p1, p2, r, c);
  let p1Inverse = inverse(p1, r, c);
  let p2Inverse = inverse(p2, r, c);

  let m = midpoint(p1, p1Inverse);
  let n = midpoint(p2, p2Inverse);

  let m1 = perpendicularSlope(m, p1Inverse);
  let m2 = perpendicularSlope(n, p2Inverse);

  //centre is the centrepoint of the circle out of which the arc is made
  let centre = intersection(m, m1, n, m2);
  let radius = distance(centre, p1);
  return {
    centre: centre,
    radius: radius
  };
}

//intersection of two circles with equations:
//(x-a)^2 +(y-a)^2 = r0^2
//(x-b)^2 +(y-c)^2 = r1^2
//NOTE assumes the two circles DO intersect!
const circleIntersect = (c0, c1, r0, r1) => {
  let a = c0.x;
  let b = c0.y;
  let c = c1.x;
  let d = c1.y;
  let dist = Math.sqrt((c - a) * (c - a) + (d - b) * (d - b));

  let del = Math.sqrt((dist + r0 + r1) * (dist + r0 - r1) * (dist - r0 + r1) * (-dist + r0 + r1)) / 4;

  let xPartial = (a + c) / 2 + ((c - a) * (r0 * r0 - r1 * r1)) / (2 * dist * dist);
  let x1 = xPartial - 2 * del * (b - d) / (dist * dist);
  let x2 = xPartial + 2 * del * (b - d) / (dist * dist);

  let yPartial = (b + d) / 2 + ((d - b) * (r0 * r0 - r1 * r1)) / (2 * dist * dist);
  let y1 = yPartial + 2 * del * (a - c) / (dist * dist);
  let y2 = yPartial - 2 * del * (a - c) / (dist * dist);

  let p1 = {
    x: x1,
    y: y1
  }

  let p2 = {
    x: x2,
    y: y2
  }

  return {
    p1: p1,
    p2: p2
  };
}

//angle at centre of circle radius r give two points on circumferece
const arcLength = (p1, p2, r) => 2 * Math.asin(0.5 * distance(p1, p2) / r);

//calculate the normal vector given 2 points
const normalVector = (p1, p2) => {
  let d = Math.sqrt(Math.pow(p2.x-p1.x,2) + Math.pow(p2.y-p1.y,2));
  let u = {
    x: (p2.x-p1.x)/d,
    y: (p2.y-p1.y)/d
  }
  return u;
}

//does the line connecting p1, p2 go through the centre?
const throughOrigin = (p1, p2) => {
  if(p1.x === 0 && p2.x === 0){
    //vertical line through centre
    return true;
  }
  let test = (-p1.x*p2.y + p1.x*p1.y)/(p2.x-p1.x) + p1.y;
  if(test === 0) return true;
  else return false;
}

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
// *   CANVAS UTILITY FUNCTIONS
// *
// *************************************************************************

//draw a hyperbolic line segment using calculations from line() or arc()
const drawSegment = (c, alpha, alphaOffset, colour) => {
  elems.ctx.beginPath();
  elems.ctx.arc(c.centre.x, c.centre.y, c.radius, alphaOffset, alpha + alphaOffset);
  elems.ctx.strokeStyle = colour || 'black';
  elems.ctx.stroke();
}

//draw a (euclidean) line between two points
const euclideanLine = (p1, p2, colour) => {
  let c = colour || 'black';
  elems.ctx.beginPath();
  elems.ctx.moveTo(p1.x, p1.y);
  elems.ctx.lineTo(p2.x, p2.y);
  elems.ctx.strokeStyle = c;
  elems.ctx.stroke()
}

//draw a point on the disk, optional radius and colour
const drawPoint = (point, radius, colour) => {
  let col = colour || 'black';
  let r = radius || 2;
  elems.ctx.beginPath();
  elems.ctx.arc(point.x, point.y, r, 0, Math.PI * 2, true);
  elems.ctx.fillStyle = col;
  elems.ctx.fill();
}

const drawCircle = (c, r, colour) => {
  let col = colour || 'black';
  elems.ctx.beginPath();
  elems.ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
  elems.ctx.strokeStyle = col;
  elems.ctx.stroke();
}

// * ***********************************************************************
// *
// *   DOCUMENT READY
// *
// *************************************************************************
$(document).ready(() => {


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
      this.radius = this.radius / 3;

      this.color = 'black';
    }

    outerCircle() {
      drawCircle({x: this.centre.x, y: this.centre.y}, this.radius);
    }

    //draw a hyperbolic line between two points
    line(p1, p2, colour) {
      let pts = this.prepPoints(p1, p2);
      p1 = pts.p1;
      p2 = pts.p2;
      let col = colour || 'black';
      let c, points;

      if(throughOrigin(p1,p2)){
        let u = normalVector(p1,p2);
        points = {
          p1: {
            x: u.x * this.radius,
            y: u.y * this.radius
          },
          p2: {
            x: -u.x * this.radius,
            y: -u.y * this.radius
          }
        }
        euclideanLine(points.p1,points.p2, col);
      }
      else{
        c = greatCircle(p1, p2, this.radius, this.centre);
        points = circleIntersect(this.centre, c.centre, this.radius, c.radius);
        //draw points for testing
        drawPoint(points.p1);
        drawPoint(points.p2);

        //angle subtended by the arc
        let alpha = arcLength(points.p1, points.p2, c.radius);

        let offset = this.alphaOffset(points.p2, points.p2, c);
        drawSegment(c, alpha, offset, col);
      }
    }

    //Draw an arc (hyperbolic line segment) between two points on the disk
    arc(p1, p2, colour) {
      let pts = this.prepPoints(p1, p2);
      p1 = pts.p1;
      p2 = pts.p2;
      if(throughOrigin(p1,p2)){
        euclideanLine(p1,p2, colour);
        return;
      }
      let col = colour || 'black';
      let c = greatCircle(p1, p2, this.radius, this.centre);
      //length of the arc
      let alpha = arcLength(p1, p2, c.radius);

      //how far around the greatCircle to start drawing the arc
      let offset = this.alphaOffset(p1, p2, c);
      drawSegment(c, alpha, offset, col);
    }

    polygon(pointsArray, colour) {
      let l = pointsArray.length;
      console.table(pointsArray);
      drawPoint(pointsArray[0], 5, 'red');

      for (let i = 0; i < l-1; i++) {
        this.arc(pointsArray[i], pointsArray[i + 1], colour);
      }

      let r = 3;
      let q = 4;

      //this.line(pointsArray[r], pointsArray[q], colour);
      //this.arc(pointsArray[2], pointsArray[3], 'red');
      //close the polygon
      this.arc(pointsArray[0], pointsArray[l - 1], colour);
    }

    //before drawing a line or arc check the points are on the disk and
    //put them in clockwise order
    prepPoints(p1, p2){
      if (this.checkPoint(p1) || this.checkPoint(p2)) {
        return;
      }
      if(p1.x === p2.x){
        return {p1: p1, p2: p2}
      }
      //swap the points if they are not in clockwise order
      else if(p1.x > p2.x){
        let temp = p1;
        p1 = p2;
        p2 = temp;
      }
      return {p1: p1, p2: p2}
    }

    //calculate the offset (position around the circle from which to start the
    //line or arc). As canvas draws arcs clockwise by default this will change
    //depending on where the arc is relative to the origin
    //specificall whether it lies on the x axis, or above or below it
    alphaOffset(p1, p2, c) {
      let offset;
      //a point at 0 radians on the circle
      let p = {
        x: c.centre.x + c.radius,
        y: c.centre.y
      }
      console.log(c.centre);
      drawPoint(c.centre);

      //distance between disk centre and greatCircle centre
      let d = distance(this.centre, c.centre);
      //point on circle of radius d
      let q = {x: d, y: 0};
      //angle subtended by greatCircle centre from this circle
      let beta = arcLength(q, c.centre, d);
      console.log(beta);

      if(beta > 0 && beta <= Math.PI/3){
        offset = arcLength(p1, p, c.radius);
      }
      /*
      else if(beta > Math.PI/3 && beta <= Math.PI){
        offset = -arcLength(p2, p, c.radius);
      }
      else if(beta > Math.PI && beta <= 3*Math.PI/2 ){
        console.log('TEST');
        offset = arcLength(p2, p, c.radius);
      }
      */
      else{
        offset = arcLength(p2, p, c.radius);
      }

      return offset;
    }

    //is the point in the disk?
    checkPoint(p) {
      let r = this.radius;
      if (distance(p, this.centre) > r) {
        console.error('Error! Point (' + p.x + ', ' + p.y + ') lies outside the plane!');
        return true;
      }
      return false;
    }
  }

  const disk = new Disk();

  // * ***********************************************************************
  // *
  // *    q: number of p-gons meeting at each vertex
  // *    scale: distance from the centre to point on layer 1 p-gon
  // *
  // *************************************************************************
  class Tesselate {
    constructor(disk, p, q, scale, rotation) {
      this.disk = disk;
      this.p = p;
      if(this.p < 3){
        console.error('Tesselation error: polygon needs at least 3 sides!');
        return;
      }
      this.q = q;
      if(this.q < 3){
        console.error('Tesselation error: at least 3 p-gons must meet at each vertex!');
        return;
      }
      this.scale = scale;
      if(this.scale > this.disk.radius){
        console.error('Tesselation error: scale must be less than disks radius!');
        return;
      }

      this.rotation = rotation || 0;

      this.replicate();
    }

    //calculate the vertices of a regular p-gon as an array of points
    //centroid at (0,0)
    //or vertex 1 at centroid NOT IMPLEMENTED
    calculatePoints(centroid){
      let s = this.scale;

      let pointsArray = [];
      let cos = Math.cos(Math.PI/this.p);
      let sin2 = Math.sin(Math.PI/(2*this.p));
      sin2 = sin2*sin2;

      //create one point per edge, the final edge will join back to the first point
      for(let i = 0; i < this.p; i++){
        let angle =  2*(i+1)*Math.PI/this.p;
        let y =  s * Math.sin( angle + this.rotation);
        let x =  s * Math.cos( angle + this.rotation);
        let p = {x: x, y: y};
        drawPoint(p);
        pointsArray.push(p);
      }
      return pointsArray;
    }

    drawPolygon(){
      let pointsArray = this.calculatePoints();
      disk.polygon(pointsArray);
    }

    replicate() {
      this.drawPolygon();
    }
  }

  const tesselation = new Tesselate(disk, 7, 3, 80, 0.53);

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
      disk.outerCircle();
      drawPoint(disk.centre);

      //let pointsArray = [{x:40 , y:-70}, {x:40 , y:-70}, {x:-80 , y:3}]
      //disk.polygon(pointsArray);

      //left of centre, vertical
      //this.testPoints(-60,-100,-60,120, 'green', 'red');
      //right of centre, vertical
      //this.testPoints(60,-100,60,120, 'green', 'red');
      //above centre, horizontal
      //this.testPoints(-90,-100,100,-100, 'green', 'red');
      //below centre, horizontal
      //this.testPoints(-120,100,120,100, 'green', 'red');
      //bottom right to top left
      // /this.testPoints(120,100,-120,-120, 'green', 'red');
      //through centre, horizontal
      //this.testPoints(-60,0,60,0, 'green', 'red');
      //through centre, vertical
      //this.testPoints(-0,-100,0,100, 'green', 'red');

      //bottom left to top right
      //this.testPoints(30,-10,-80,10, 'green', 'red');

      //top left to bottom right
      //this.testPoints(100,60,-60,-60, 'green', 'red');


      //let p1 = {x: -50, y: -69.3}
      //let p2 = {x: 40, y: 69.3}
      //drawPoint(p1);
      //drawPoint(p2);
      //disk.arc(p1,p2)
      /*

      let p3 = {x: -80, y: 2.94};
      //let p4 = {x: -80, y: 2.94};

      drawPoint(p1);
      drawPoint(p2);
      drawPoint(p3);

      let pArray1 =  [p1,p2,p3];
      disk.polygon(pArray1);
      //disk.arc(p2,p3);
      //disk.arc(p3,p1);

      let c = greatCircle(p1, p2, disk.radius, disk.centre);
      let p4 = inverse(p3, c.radius, c.centre);
      drawPoint(p4);
      let pArray2 = [p1,p2,p4];
      disk.polygon(pArray2);

      c = greatCircle(p2, p3, disk.radius, disk.centre);
      let p5 = inverse(p1, c.radius, c.centre);
      drawPoint(p5);
      let pArray3 = [p2,p3,p5];
      disk.polygon(pArray3);

      c = greatCircle(p1, p3, disk.radius, disk.centre);
      let p6 = inverse(p2, c.radius, c.centre);
      drawPoint(p6);
      let pArray4 = [p3,p6,p1];
      disk.polygon(pArray4);

      c = greatCircle(p6, p1, disk.radius, disk.centre);
      let p7 = inverse(p3, c.radius, c.centre);
      drawPoint(p7);
      let pArray5 = [p6,p1,p7];
      disk.polygon(pArray5);

      c = greatCircle(p6, p7, disk.radius, disk.centre);
      let p8 = inverse(p1, c.radius, c.centre);
      drawPoint(p8);
      let pArray6 = [p6,p7,p8];
      disk.polygon(pArray6);
      */

      //let p1 = {x:-50 , y:50};
      //drawPoint(p1);
      //let p2 = {x:50 , y:-50};
      //drawPoint(p2)
      //disk.arc(p1,p2, 'red');
      //disk.line(p1,p2, 'green');
    }

    testPoints(x1, y1, x2, y2, col1, col2) {
      let p1 = {
        x: x1,
        y: y1
      }

      let p2 = {
        x: x2,
        y: y2
      }
      drawPoint(p1);
      drawPoint(p2);

      disk.line(p1, p2, col1);
      disk.arc(p1, p2, col2);
    }

    //the canvas has been translated to the centre of the disk so need to
    //use an offset to clear it. NOT WORKING
    clear() {
      elems.ctx.clearRect(-dims.windowWidth / 2, -dims.windowHeight / 2, dims.windowWidth, dims.windowHeight);
    }
  }

  const canvas = new Canvas();
});
