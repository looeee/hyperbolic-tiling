import * as E from './euclid';
import {
  Polygon, Arc, Circle, Point
}
from './elements';

// * ***********************************************************************
// *
// *   HYPERBOLIC FUNCTIONS
// *   a place to stash all the functions that are hyperbolic gemeometrical
// *   operations
// *
// *************************************************************************

/*

export const weierstrassCrossProduct = (point3D_1, point3D_2) => {
  if(point3D_1.z === 'undefined' || point3D_2.z === 'undefined'){
    console.error('weierstrassCrossProduct: 3D points required');
  }
  let r = {
    x: point3D_1.y * point3D_2.z - point3D_1.z * point3D_2.y,
    y: point3D_1.z * point3D_2.x - point3D_1.x * point3D_2.z,
    z: -point3D_1.x * point3D_2.y + point3D_1.y * point3D_2.x
  };

  const norm = Math.sqrt(r.x * r.x + r.y * r.y - r.z * r.z);
  if (E.toFixed(norm) == 0) {
    console.error('weierstrassCrossProduct: division by zero error');
  }
  r.x = r.x / norm;
  r.y = r.y / norm;
  r.z = r.z / norm;
  return r;
}


//when the point p1 is translated to the origin, the point p2
//is translated according to this formula
//https://en.wikipedia.org/wiki/Poincar%C3%A9_disk_model#Isometric_Transformations
export const translatePoincare = (p1, p2) => {
  const dot = p1.x * p2.x + p1.y * p2.y;
  const normSquaredP1 = Math.pow(Math.sqrt(p1.x * p1.x + p1.y * p1.y), 2);
  const normSquaredP2 = Math.pow(Math.sqrt(p2.x * p2.x + p2.y * p2.y), 2);
  const denominator = 1 + 2 * dot + normSquaredP1 * normSquaredP2;

  const p1Factor = (1 + 2 * dot + normSquaredP2) / denominator;
  const p2Factor = (1 - normSquaredP1) / denominator;

  const x = p1Factor * p1.x + p2Factor * p2.x;
  const y = p1Factor * p1.y + p2Factor * p2.y;

  return new Point(x, y);
}

//Hyperbolic distance between two points
export const distance = (p, q, circle0) => {
  const circle1 = new Arc(p, q, circle0).circle;
  const boundaryPoints = E.circleIntersect(circle0, circle1);
  const a = boundaryPoints.p1;
  const b = boundaryPoints.p2;
  let ap = E.distance(a,p);
  let aq = E.distance(a,q);
  let bp = E.distance(b,p);
  let bq = E.distance(b,q);
  //order the points
  if(aq < ap){
    const temp = aq;
    aq = ap;
    ap = temp;
  }
  if(bp < bq){
    const temp = bp;
    bp = bq;
    bq = temp;
  }
  return Math.log((aq*bp)/(ap*bq));
}

//calculate greatCircle, startAngle and endAngle for hyperbolic arc
NOTE: Old version, new version is in Arc class
export const arcV1 = (p1, p2, circle) => {
  if (E.throughOrigin(p1, p2)) {
    return {
      circle: circle,
      startAngle: 0,
      endAngle: 0,
      clockwise: false,
      straightLine: true,
    }
  }
  let clockwise = false;
  let alpha, beta, startAngle, endAngle;
  const c = E.greatCircle(p1, p2, circle);
  const oy = E.toFixed(c.centre.y);
  const ox = E.toFixed(c.centre.x);

  //point at 0 radians on c
  const p3 = new Point(ox + c.radius, oy);

  //calculate the position of each point in the circle
  alpha = E.centralAngle(p3, p1, c.radius);
  beta = E.centralAngle(p3, p2, c.radius);

  //for comparison to avoid round off errors
  const p1X = E.toFixed(p1.x);
  const p1Y = E.toFixed(p1.y);
  const p2X = E.toFixed(p2.x);
  const p2Y = E.toFixed(p2.y);

  alpha = (p1Y < oy) ? 2 * Math.PI - alpha : alpha;
  beta = (p2Y < oy) ? 2 * Math.PI - beta : beta;

  //points are above and below the line (0,0)->(0,1) on unit disk
  //clockwise order
  if(alpha > 3*Math.PI/2 && beta < Math.PI/2){
    startAngle = alpha;
    endAngle = beta;
  }
  //points are above and below the line (0,0)->(0,1) on unit disk
  //anticlockwise order
  else if(beta > 3*Math.PI/2 && alpha < Math.PI/2){
    startAngle = beta;
    endAngle = alpha;
  }
  //other case where we are drawing the wrong way around the circle
  else if(beta - alpha > Math.PI){
    startAngle = beta;
    endAngle = alpha;
  }
  else if(alpha - beta > Math.PI){
    startAngle = alpha;
    endAngle = beta;
  }
  else if(alpha > beta){
    startAngle = beta;
    endAngle = alpha;
  }
  else{
    startAngle = alpha;
    endAngle = beta;
  }

  return {
    circle: c,
    startAngle: startAngle,
    endAngle: endAngle,
    clockwise: clockwise,
    straightLine: false,
  }
}

//translate a set of points along the x axis
//UNTEST AND NEEDS TO BE UPDATED FOR UNIT DISK
export const translateX = (pointsArray, distance) => {
  const l = pointsArray.length;
  const newPoints = [];
  const e = Math.pow(Math.E, distance);
  const pos = e + 1;
  const neg = e - 1;
  for (let i = 0; i < l; i++) {
    const x = pos * pointsArray[i].x + neg * pointsArray[i].y;
    const y = neg * pointsArray[i].x + pos * pointsArray[i].y;
    newPoints.push(new Point(x, y));
  }
  return newPoints;
}
*/
