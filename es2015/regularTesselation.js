import * as E from './euclid';
import { Disk } from './disk';
// * ***********************************************************************
// *    TESSELATION CLASS
// *    Creates a regular Tesselation of the Poincare Disk
// *    q: number of p-gons meeting at each vertex
// *    p: number of sides of p-gon
// *    using the techniques created by Coxeter and Dunham
// *
// *************************************************************************
export class RegularTesselation extends Disk {
  constructor(p, q, rotation, colour, drawClass) {
    super(drawClass);
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
    this.polygon(vertices, this.colour);

    let p = E.centroidOfPolygon(vertices);
    p = E.pointToFixed(p, 6);
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
      if(!E.comparePoints(p1, prevP1) && !E.comparePoints(p2, prevP2)){
      //if(!this.polygonExists(vertices) ){//&& !this.alreadyReflected(p1, p2)){
        let newVertices = this.reflectPolygon(vertices, p1, p2);
        this.polygon(newVertices, this.colour);
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
    p = E.pointToFixed(p, 6);


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
    const r = 1/Math.sqrt((t*t)/(s*s) -1)*this.radius;
    const d = 1/Math.sqrt(1- (s*s)/(t*t))*this.radius;
    const b = {
      x: this.radius*Math.cos(Math.PI/this.p),
      y: -this.radius*Math.sin(Math.PI/this.p)
    }

    const centre = {x: d, y: 0};

    //there will be two points of intersection, of which we want the first
    let p = E.circleLineIntersect(centre, r, this.centre, b).p1;

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
    const c = E.greatCircle(p1, p2, this.radius, this.centre);
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
