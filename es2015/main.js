// * ***********************************************************************
// *
// *   PRE-SETUP
// *
// *************************************************************************


// * ***********************************************************************
// *
// *   CONSTANTS
// *   define any global constants here
// *
// *************************************************************************


// * ***********************************************************************
// *
// *   IMPORTS
// *
// *************************************************************************

import * as E from './euclid';
import * as C from './canvas';



// * ***********************************************************************
// *
// *   HELPER FUNCTIONS
// *   define any global helper functions here
// *
// *************************************************************************

//compare two points taking rounding errors into account
const comparePoints = (p1, p2) => {
  if(typeof p1 === 'undefined' || typeof p2 === 'undefined'){
    return true;
  }
  p1 = pointToFixed(p1, 6);
  p2 = pointToFixed(p2, 6);
  if(p1.x === p2.x && p1.y === p2.y) return true;
  else return false;
}

const pointToFixed = (p, places) => {
  return {
    x: p.x.toFixed(places),
    y: p.y.toFixed(places)
  };
}

//flip a set of points over a hyperoblic line defined by two points
const transform = (pointsArray, p1, p2) => {
  let newPointsArray = [];
  let c = E.greatCircle(p1, p2, disk.radius, disk.centre);

  for(let p of pointsArray){
    let newP = E.inverse(p, c.radius, c.centre);
    newPointsArray.push(newP);
  }
  return newPointsArray;
}

// * ***********************************************************************
// *
// *   DOCUMENT READY
// *
// *************************************************************************
$(document).ready(() => {
  const c = new C.Canvas();
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

      if(E.throughOrigin(p1,p2)){
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
        c = E.greatCircle(p1, p2, this.radius, this.centre);
        points = circleIntersect(this.centre, c.centre, this.radius, c.radius);

        //angle subtended by the arc
        let alpha = E.centralAngle(points.p1, points.p2, c.radius);

        let offset = this.alphaOffset(points.p2, points.p2, c, 'line');
        c.drawSegment(c, alpha, offset, col);
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
        offset = 2*Math.PI - E.centralAngle(p1, p, c.radius);
      }
      else{
        offset = E.centralAngle(p1, p, c.radius);
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

      let alpha1 = E.centralAngle(p, p1, c.radius);
      alpha1 = (p1.y < c.centre.y) ? 2*Math.PI - alpha1 : alpha1;
      let alpha2 = E.centralAngle(p, p2, c.radius);
      alpha2 = (p2.y < c.centre.y) ? 2*Math.PI - alpha2 : alpha2;

      //if the points are not in clockwise order flip them
      if(alpha1 > alpha2) return {p1: p2, p2: p1};
      else return {p1: p1, p2: p2};

    }

    //Draw an arc (hyperbolic line segment) between two points on the disk
    arc(p1, p2, colour) {
      if(E.throughOrigin(p1,p2)){
        euclideanLine(p1,p2, colour);
        return;
      }
      let col = colour || 'black';
      let c = E.greatCircle(p1, p2, this.radius, this.centre);
      let pts = this.prepPoints(p1, p2, c);
      p1 = pts.p1;
      p2 = pts.p2;

      //length of the arc
      let alpha = E.centralAngle(p1, p2, c.radius);

      //how far around the greatCircle to start drawing the arc
      let offset = this.alphaOffset(p1, p2, c, 'arc');
      c.drawSegment(c, alpha, offset, colour);
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
      if (E.distance(point, this.centre) > r) {
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

      this.disk = disk;
      this.p = p;
      this.q = q;
      this.minExp = p-3;
      this.maxExp = p-2;
      this.colour = colour || 'black';
      this.rotation = rotation || 0;

      if(this.checkParams()){ return false;}

      this.q = q;
      this.maxLayers = 3;
      this.limit = 10000;

      //array of all lines that have been reflected over
      this.reflectedLines = [];

      //array of centroids for all polygons drawn so far
      this.polygonCentroids = [];

      this.tesselation();
    }

    tesselation(){
      const vertices = this.fundamentalPolygon();
      this.disk.polygon(vertices, this.colour);

      let p = E.centroidOfPolygon(vertices);
      p = pointToFixed(p, 6);
      this.polygonCentroids.push(p);

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
        //if(!this.polygonExists(vertices) ){//&& !this.alreadyReflected(p1, p2)){
          let newVertices = this.reflectPolygon(vertices, p1, p2);
          this.disk.polygon(newVertices, this.colour);
          window.setTimeout(() => {
            this.recursivePolyGen(newVertices, p1, p2, layer++);
          }, 500);
        }
        //}
      }
    }

    //check if the polygon has already been drawn
    polygonExists(vertices){
      let p = E.centroidOfPolygon(vertices);
      p = pointToFixed(p, 6);


      let i =  $.inArray(p.x, this.polygonCentroids);
      //case 1, centroid is not in array
      if(i === -1){
        this.polygonCentroids.push(p.x, p.y);
        drawPoint(p);
        return false;
      }
      //case 2: centroid is not in array
      else if(this.polygonCentroids[i+1] !== p.y){
        this.polygonCentroids.push(p.x, p.y);
        drawPoint(p);
        return false;
      }
      //case 3: centroid is in array
      else{
        return true;
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
      let p = E.circleLineIntersect(centre, r, this.disk.centre, b).p1;

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
      const c = E.greatCircle(p1, p2, this.disk.radius, this.disk.centre);
      for(let i = 0; i< l; i++){
        let p = E.inverse(vertices[i], c.radius, c.centre);
        newVertices.push(p);
      }

      return newVertices;
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
  }

  const tesselation = new Tesselation(disk, 5, 4, 3*Math.PI/6*0, 'red');

});
