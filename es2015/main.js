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
const canvas = $('#canvas')[0];
const ctx = canvas.getContext('2d');

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
//NOT WORKING FOR VERTICAL LINES!!!
const intersection = (p1, m1, p2, m2) => {
  let c1, c2, x, y;
  //case where first line is vertical
  //if(m1 > 5000 || m1 < -5000 || m1 === Infinity){
  if(p1.y < 0.000001 && p1.y > -0.000001 ){
    x = p1.x;
    y = (m2)*(p1.x-p2.x) + p2.y;
  }
  //case where second line is vertical
  //else if(m2 > 5000 || m2 < -5000 || m1 === Infinity){
  else if(p2.y < 0.000001 && p2.y > -0.000001 ){
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

//get the circle inverse of a point p with respect a circle radius r centre c
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

//an attempt at calculating the circle algebraically
const greatCircleV2 = (p1,p2, r) =>{
  let x = (p2.y*(p1.x*p1.x + r)+ p1.y*p1.y*p2.y-p1.y*(p2.x*p2.x+ p2.y*p2.y + r))/(2*p1.x*p2.y - p1.y*p2.x);
  let y = (p1.x*p1.x*p2.x - p1.x*(p2.x*p2.x+p2.y*p2.y+r)+p2.x*(p1.y*p1.y+r))/(2*p1.y*p2.x + 2*p1.x*p2.y);
  let radius =   Math.sqrt(x*x+y*y-r);
  return {
    centre: {
      x: x,
      y: y
    },
    radius: radius
  }
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

const circleLineIntersect = (c, r, p1, p2) => {

  const d = distance(p1, p2);
  //unit vector p1 p2
  const dx = (p2.x - p1.x)/d;
  const dy = (p2.y - p1.y)/d;

  //point on line closest to circle centre
  const t = dx*(c.x -p1.x) + dy*(c.y-p1.y);
  const p =  {x: t* dx + p1.x, y: t* dy + p1.y};

  //distance from this point to centre
  const d2 = distance(p, c);

  //line intersects circle
  if(d2 < r){
    const dt = Math.sqrt( r*r - d2*d2);
    //point 1
    const q1 = {
      x: (t-dt)*dx + p1.x,
      y: (t-dt)*dy + p1.y
    }
    //point 2
    const q2 = {
      x: (t+dt)*dx + p1.x,
      y: (t+dt)*dy + p1.y
    }

    return {p1: q1, p2: q2};
  }
  else if( d2 === r){
    return p;
  }
  else{
    console.error('Error: line does not intersect circle!');
  }
}

//angle in radians between two points on circle of radius r
const centralAngle = (p1, p2, r) => {
  return 2 * Math.asin(0.5 * distance(p1, p2) / r);
}

//calculate the normal vector given 2 points
const normalVector = (p1, p2) => {
  let d = Math.sqrt(Math.pow(p2.x-p1.x,2) + Math.pow(p2.y-p1.y,2));
  return {
    x: (p2.x-p1.x)/d,
    y: (p2.y-p1.y)/d
  }
}

//does the line connecting p1, p2 go through the point (0,0)?
const throughOrigin = (p1, p2) => {
  if(p1.x === 0 && p2.x === 0){
    //vertical line through centre
    return true;
  }
  let test = (-p1.x*p2.y + p1.x*p1.y)/(p2.x-p1.x) + p1.y;
  if(test === 0) return true;
  else return false;
}

//flip a set of points over a hyperoblic line defined by two points
const transform = (pointsArray, p1, p2) => {
  let newPointsArray = [];
  let c = greatCircle(p1, p2, disk.radius, disk.centre);

  for(let p of pointsArray){
    let newP = inverse(p, c.radius, c.centre);
    newPointsArray.push(newP);
  }
  return newPointsArray;
}
// * ***********************************************************************
// *
// *   CANVAS UTILITY FUNCTIONS
// *
// *************************************************************************

//draw a hyperbolic line segment using calculations from line() or arc()
const drawSegment = (c, alpha, alphaOffset, colour, width) => {
  ctx.beginPath();
  ctx.arc(c.centre.x, c.centre.y, c.radius, alphaOffset, alpha + alphaOffset);
  ctx.strokeStyle = colour || 'black';
  ctx.lineWidth = width || 1;
  ctx.stroke();
}

//draw a (euclidean) line between two points
const euclideanLine = (p1, p2, colour, width) => {
  let c = colour || 'black';
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.strokeStyle = c;
  ctx.lineWidth = width || 1;
  ctx.stroke()
}

//draw a point on the disk, optional radius and colour
const drawPoint = (point, radius, colour) => {
  let col = colour || 'black';
  let r = radius || 2;
  ctx.beginPath();
  ctx.arc(point.x, point.y, r, 0, Math.PI * 2, true);
  ctx.fillStyle = col;
  ctx.fill();
}

//draw a circle of radius r centre c and optional colour
const drawCircle = (c, r, colour, width) => {
  let col = colour || 'black';
  ctx.beginPath();
  ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
  ctx.strokeStyle = col;
  ctx.lineWidth = width || 1;
  ctx.stroke();
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
  // *   DISK CLASS
  // *   Poincare Disk representation of the hyperbolic plane
  // *
  // *************************************************************************
  class Disk {
    constructor() {
      this.x = dims.windowWidth / 2;
      this.y = dims.windowHeight / 2;

      //transform the canvas so the origin is at the centre of the disk
      ctx.translate(this.x, this.y);

      this.centre = {
        x: 0,
        y: 0
      }

      //draw largest circle possible given window dims
      this.radius = (dims.windowWidth < dims.windowHeight) ? (dims.windowWidth / 2) - 5 : (dims.windowHeight / 2) - 5;

      //smaller circle for testing
      // /this.radius = this.radius / 3;

      this.color = 'black';
    }

    //draw the boundary circle
    outerCircle() {
      drawCircle({x: this.centre.x, y: this.centre.y}, this.radius);
    }

    //draw a hyperbolic line between two points on the boundary circle
    line(p1, p2, colour) {
      //let pts = this.prepPoints(p1, p2);
      //p1 = pts.p1;
      //p2 = pts.p2;
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

        //angle subtended by the arc
        let alpha = centralAngle(points.p1, points.p2, c.radius);

        let offset = this.alphaOffset(points.p2, points.p2, c, 'line');
        drawSegment(c, alpha, offset, col);
      }
    }

    //calculate the offset (position around the circle from which to start the
    //line or arc). As canvas draws arcs clockwise by default this will change
    //depending on where the arc is relative to the origin
    //specificall whether it lies on the x axis, or above or below it
    //type = 'line' or 'arc'
    alphaOffset(p1, p2, c, type) {
      let offset;

      //points at 0 radians on greatCircle
      let p = {
        x: c.centre.x + c.radius,
        y: c.centre.y
      }

      if(p1.y < c.centre.y){
        offset = 2*Math.PI - centralAngle(p1, p, c.radius);
      }
      else{
        offset = centralAngle(p1, p, c.radius);
      }

      return offset;
    }

    //put points in clockwise order
    prepPoints(p1, p2, c){
      const p = {x: c.centre.x + c.radius, y: c.centre.y};

      //case where points are above and below the line c.centre -> p
      //in this case just return points
      const oy = c.centre.y;
      const ox = c.centre.x;
      if(p1.y < oy && p2.y > oy && p1.x > ox && p2.x > ox){
        return {p1: p1, p2: p2};
      }

      let alpha1 = centralAngle(p, p1, c.radius);
      alpha1 = (p1.y < c.centre.y) ? 2*Math.PI - alpha1 : alpha1;
      let alpha2 = centralAngle(p, p2, c.radius);
      alpha2 = (p2.y < c.centre.y) ? 2*Math.PI - alpha2 : alpha2;

      //if the points are not in clockwise order flip them
      if(alpha1 > alpha2) return {p1: p2, p2: p1};
      else return {p1: p1, p2: p2};

    }

    //Draw an arc (hyperbolic line segment) between two points on the disk
    arc(p1, p2, colour) {
      if(throughOrigin(p1,p2)){
        euclideanLine(p1,p2, colour);
        return;
      }
      let col = colour || 'black';
      let c = greatCircle(p1, p2, this.radius, this.centre);
      let pts = this.prepPoints(p1, p2, c);
      p1 = pts.p1;
      p2 = pts.p2;

      //TESTING
      // /drawCircle(c.centre, c.radius);

      //length of the arc
      let alpha = centralAngle(p1, p2, c.radius);

      //how far around the greatCircle to start drawing the arc
      let offset = this.alphaOffset(p1, p2, c, 'arc');
      drawSegment(c, alpha, offset, 'red');
    }

    polygon(pointsArray, colour) {
      let l = pointsArray.length;

      for (let i = 0; i < l-1; i++) {
        //this.line(pointsArray[i], pointsArray[i + 1], colour);
        this.arc(pointsArray[i], pointsArray[i + 1]);
      }

      //close the polygon
      //this.line(pointsArray[0], pointsArray[l - 1], colour);
      this.arc(pointsArray[0], pointsArray[l - 1]);
    }

    //return true if the point is not in the disk
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
  // *    TESSELATION CLASS
  // *    Creates a regular Tesselation of the Poincare Disk
  // *    q: number of p-gons meeting at each vertex
  // *    p: number of sides of p-gon
  // *    using the techniques created by Coxeter and Dunham
  // *
  // *************************************************************************
  class Tesselation {
    constructor(disk, p, q) {
      this.disk = disk;
      this.p = p;
      this.q = q;

      if(this.checkParams()){ return false;}

      //an array which will hold coordinates of pairs of points that have been
      //drawn so far to prevent duplication
      this.drawnArray = [];

      this.p = p;
      if(this.p < 3){
        console.error('Tesselation error: polygon needs at least 3 sides!');
        return;
      }
      this.q = q;
      if(this.q < 3){
        console.error('Tesselation error: at least 3 p-gons must meet \
                      at each vertex!');
        return;
      }

      this.tesselation();
    }

    //The tesselation requires that (p-2)(q-2) > 4 to work (otherwise it is
    // either an elliptical or euclidean tesselation);
    checkParams(){
      if((this.p -2)*(this.q-2) <= 4){
        console.error('Hyperbolic tesselations require that (p-1)(q-2) < 4!');
        return true;
      }
      else { return false; }
    }

    tesselation(){
      const vertices = this.fundamentalPolygon();
      const l = vertices.length;

      this.disk.polygon(vertices);

      for(let i = 0; i< l-1; i++){
        let newVertices = this.reflectPolygon(vertices, vertices[i], vertices[i+1]);
        this.disk.polygon(newVertices);
      }

      let newVertices = this.reflectPolygon(vertices, vertices[l-1], vertices[0]);
      this.disk.polygon(newVertices);
    }

    //rotate the first points around the disk to generate the fundamental polygon
    fundamentalPolygon(){
      const p = this.firstPoint();
      let alpha = 2*Math.PI/this.p;
      const vertices = [p];

      for(let i = 1; i < this.p; i++){
        //rotate around the disk by alpha radians for next points
        let q = {
          x: Math.cos(alpha*i)*p.x + Math.sin(alpha*i)*p.y,
          y: -Math.sin(alpha*i)*p.x + Math.cos(alpha*i)*p.y
        }

        vertices.push(q);
      }
      return vertices;
    }

    //calculate first point of fundamental polygon using Coxeter's method
    firstPoint(){
      const s = Math.sin(Math.PI/this.p);
      const t = Math.cos(Math.PI/this.q);
      //multiply these by the disks radius (Coxeter used unit disk);
      const r = 1/Math.sqrt((t*t)/(s*s) -1)*this.disk.radius;
      const d = 1/Math.sqrt(1- (s*s)/(t*t))*this.disk.radius;
      const b = {
        x: this.disk.radius*Math.cos(Math.PI/this.p),
        y: -this.disk.radius*Math.sin(Math.PI/this.p)
      }

      const centre = {x: d, y: 0};

      //there will be two points of intersection, of which we want the first
      return circleLineIntersect(centre, r, this.disk.centre, b).p1;
    }

    //reflect the polygon defined by it's vertices across the line p1, p2
    reflectPolygon(vertices, p1, p2){
      const l = vertices.length;
      const newVertices = [];
      const c = greatCircle(p1, p2, this.disk.radius, this.disk.centre);
      for(let i = 0; i< l; i++){
        let p = inverse(vertices[i], c.radius, c.centre);
        drawPoint(p);
        newVertices.push(p);
      }

      return newVertices;
    }
  }

  const tesselation = new Tesselation(disk, 5, 5);

  // * ***********************************************************************
  // *
  // *   CANVAS CLASS
  // *
  // *
  // *************************************************************************
  class Canvas {
    constructor() {
      //this.tesellations();
      this.draw();
      $(window).resize(() => {
        //this.clear();
        //this.draw();
      });

      //this.saveImage();
      //this.clear();
    }

    draw() {
      disk.outerCircle();
      drawPoint(disk.centre);

      /*
      //TESTING
      let p1 = {
        x: -53.395036426959535,
        y: -3.552713678800501e-15
      }

      let p2 = {
        x: -16.49997367119987,
        y: 50.78169733167696
      }


      //disk.line(p1,p2, 'black');
      disk.arc(p1,p2, 'red');

      drawPoint(p1, 5, 'green');
      drawPoint(p2, 5, 'blue');

      p1 = {
        x: 104.7936594333809,
        y: 5.936864064325499e-14
      }

      p2 = {
        x: 91.08228051326563,
        y: 29.59442691657064
      }


      //disk.line(p1,p2, 'black');
      disk.arc(p1,p2, 'red');

      drawPoint(p1, 5, 'green');
      drawPoint(p2, 5, 'blue');
      */

    }

    tesellations(){
      for(let i = 3; i< 11; i++){
        this.draw();

        new Tesselation(disk, i, 3, 50, 0);

        this.saveImage();
        this.clear();
      }
    }

    //the canvas has been translated to the centre of the disk so need to
    //use an offset to clear it. NOT WORKING WHEN SCREEN IS RESIZED
    clear() {
      ctx.clearRect(-window.innerWidth/2,-window.innerHeight/2,
                          window.innerWidth, window.innerHeight);
    }

    //convert the canvas to a base64URL and send to saveImage.php
    saveImage(){
      let data = canvas.toDataURL();
      $.ajax({
        type: 'POST',
        url: 'saveImage.php',
        data: { img: data }
      });
    }
  }

  const canvas = new Canvas();
});
