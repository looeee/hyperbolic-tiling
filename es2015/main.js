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

//find the centroid of a non-self-intersecting polygon
const centroidOfPolygon = (points) => {
  const first = pts[0], last = pts[pts.length-1];
  if (first.x != last.x || first.y != last.y) pts.push(first);
  let twicearea=0,
    x=0, y=0,
    nPts = pts.length,
    p1, p2, f;
  for ( var i=0, j=nPts-1 ; i<nPts ; j=i++ ) {
    p1 = pts[i]; p2 = pts[j];
    f = p1.x*p2.y - p2.x*p1.y;
    twicearea += f;
    x += ( p1.x + p2.x ) * f;
    y += ( p1.y + p2.y ) * f;
  }
  f = twicearea * 3;
  return { x:x/f, y:y/f };
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
  // *   DISK CLASS
  // *   Poincare Disk representation of the hyperbolic plane
  // *
  // *************************************************************************
  class Disk {
    constructor() {
      this.x = window.innerWidth / 2;
      this.y = window.innerHeight / 2;

      //transform the canvas so the origin is at the centre of the disk
      ctx.translate(this.x, this.y);

      this.centre = {
        x: 0,
        y: 0
      }

      //draw largest circle possible given window dims
      this.radius = (window.innerWidth < window.innerHeight) ? (window.innerWidth / 2) - 5 : (window.innerHeight / 2) - 5;

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

      if(p1.x > ox && p2.x > ox){
        if(p1.y > oy && p2.y < oy) return {p1: p2, p2: p1};
        else if(p1.y < oy && p2.y > oy) return {p1: p1, p2: p2};
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

      //length of the arc
      let alpha = centralAngle(p1, p2, c.radius);

      //how far around the greatCircle to start drawing the arc
      let offset = this.alphaOffset(p1, p2, c, 'arc');
      drawSegment(c, alpha, offset, colour);
    }

    polygon(vertices, colour) {
      let l = vertices.length;
      for (let i = 0; i < l; i++) {
        this.arc(vertices[i], vertices[(i + 1)%l], colour);
      }
    }

    //return true if the point is not in the disk
    checkPoint(point) {
      let r = this.radius;
      if (distance(point, this.centre) > r) {
        console.error('Error! Point (' + point.x + ', ' + point.y + ') lies outside the plane!');
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
    constructor(disk, p, q, rotation, colour) {
      this.rotation = rotation || 0;
      this.disk = disk;
      this.p = p;
      this.q = q;
      this.colour = colour || 'black';

      if(this.checkParams()){ return false;}

      this.q = q;
      this.maxLayers = 3;
      this.limit = 1800;

      //array of all lines that have been reflected over
      this.reflectedLines = [];

      this.tesselation();
    }

    //The tesselation requires that (p-2)(q-2) > 4 to work (otherwise it is
    // either an elliptical or euclidean tesselation);
    checkParams(){
      if((this.p -2)*(this.q-2) <= 4){
        console.error('Hyperbolic tesselations require that (p-1)(q-2) < 4!');
        return true;
      }
      else if(this.q < 3){
        console.error('Tesselation error: at least 3 p-gons must meet \
                      at each vertex!');
        return true;
      }
      else if(this.p < 3){
        console.error('Tesselation error: polygon needs at least 3 sides!');
        return true;
      }
      else { return false; }
    }

    tesselation(){
      const vertices = this.fundamentalPolygon();
      this.disk.polygon(vertices, this.colour);
      this.recursivePolyGen(vertices, {x: 0, y: 0}, {x: 0, y: 0}, 2);
    }

    //recursively reflect each polygon over each edge, draw the new polygons
    //and repeat for each of their edges
    //TODO make sure no line is drawn more than once
    recursivePolyGen(vertices, prevP1, prevP2, layer){
      //TESTING
      if(this.limit <= 0){ return ;}
      this.limit --;

      //console.log('Layer: ', layer);
      //if(layer > this.maxLayers){ return; }

      const l = vertices.length;

      for(let i = 0; i < l; i++){
        let p1 = vertices[i];
        let p2 = vertices[(i + 1)%l];
        //don't reflect back over the line we've just reflected across as this
        //causes a loop
        if(!comparePoints(p1, prevP1) && !comparePoints(p2, prevP2)){
          if(!this.alreadyReflected(p1, p2)){
            let newVertices = this.reflectPolygon(vertices, p1, p2);
            this.disk.polygon(newVertices, this.colour);
            window.setTimeout(() => {
              this.recursivePolyGen(newVertices, p1, p2, layer++);
            }, 500);
          }
        }
      }
    }

    //check if a particular line has already been to do a reflection and if not
    //add the current line to the array
    alreadyReflected(p1, p2){
      let x1 = p1.x.toFixed(6);
      let y1 = p1.y.toFixed(6);
      let x2 = p2.x.toFixed(6);
      let y2 = p2.y.toFixed(6);

      let i =  $.inArray(x1, this.reflectedLines);
      //case1: first point not in array, line has not been used to reflect
      if(i === -1){
        this.reflectedLines.push(x1);
        this.reflectedLines.push(y1);
        this.reflectedLines.push(x2);
        this.reflectedLines.push(y2);
        return false
      }
      //case 2: first point is in array
      else if(this.reflectedLines[i +1] === y1){
        //case 2a: second point is in the array adjacent to first point;
        // => lines has alraedy been used
        let a = (this.reflectedLines[i+2] === x2 && this.reflectedLines[i+3] === y2);
        let b = (this.reflectedLines[i-2] === x2 && this.reflectedLines[i-1] === y2);
        if(a || b){
          return true;
        }
        //case 2b: 1st point was in array but as part of different line
        else{
          this.reflectedLines.push(x1);
          this.reflectedLines.push(y1);
          this.reflectedLines.push(x2);
          this.reflectedLines.push(y2);
          return false
        }
      }
    }

    //rotate the first points around the disk to generate the fundamental polygon
    //TODO: use Dunham's method of reflecting a fundamental triangle which will
    //contain a motif eventually
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
      let p = circleLineIntersect(centre, r, this.disk.centre, b).p1;

      //apply the rotation
      p = {
        x: Math.cos(this.rotation)*p.x - Math.sin(this.rotation)*p.y,
        y: Math.sin(this.rotation)*p.x + Math.cos(this.rotation)*p.y
      }

      return p;
    }

    //reflect the polygon defined by vertices across the line p1, p2
    reflectPolygon(vertices, p1, p2){
      const l = vertices.length;
      const newVertices = [];
      const c = greatCircle(p1, p2, this.disk.radius, this.disk.centre);
      for(let i = 0; i< l; i++){
        let p = inverse(vertices[i], c.radius, c.centre);
        newVertices.push(p);
      }

      return newVertices;
    }
  }

  const tesselation = new Tesselation(disk, 5, 4, 3*Math.PI/6*0, 'red');

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
