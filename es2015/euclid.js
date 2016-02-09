import {
  Arc, Circle, Point
}
from './elements';
// * ***********************************************************************
// *
// *   EUCLIDEAN FUNCTIONS
// *   a place to stash all the functions that are euclidean geometrical
// *   operations
// *   All functions are 2D unless otherwise specified!
// *
// *************************************************************************

//distance between two points
export const distance = (p1, p2) => {
  return Math.sqrt(Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2));
}

//midpoint of the line segment connecting two points
export const midpoint = (p1, p2) => {
  return new Point((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
}

//slope of line through p1, p2
export const slope = (p1, p2) => {
  return (p2.x - p1.x) / (p2.y - p1.y);
}

//slope of line perpendicular to a line defined by p1,p2
export const perpendicularSlope = (p1, p2) => {
  return -1 / (Math.pow(slope(p1, p2), -1));
}

//intersection point of two lines defined by p1,m1 and q1,m2
export const intersection = (p1, m1, p2, m2) => {
  let c1, c2, x, y;
  if ( toFixed(p1.y, 10) == 0) {
    x = p1.x;
    y = (m2) * (p1.x - p2.x) + p2.y;
  }
  else if ( toFixed(p2.y, 10) == 0) {
    x = p2.x;
    y = (m1 * (p2.x - p1.x)) + p1.y;
  } else {
    //y intercept of first line
    c1 = p1.y - m1 * p1.x;
    //y intercept of second line
    c2 = p2.y - m2 * p2.x;

    x = (c2 - c1) / (m1 - m2);
    y = m1 * x + c1;
  }

  return new Point(x, y);
}

export const radians = (degrees) => {
  return (Math.PI / 180) * degrees;
}

//get the circle inverse of a point p with respect a circle radius r centre c
export const inverse = (point, circle) => {
  const c = circle.centre;
  const r = circle.radius;
  const alpha = (r * r) / (Math.pow(point.x - c.x, 2) + Math.pow(point.y - c.y, 2));
  return new Point(alpha * (point.x - c.x) + c.x, alpha * (point.y - c.y) + c.y);
}

//reflect p3 across the line defined by p1,p2
export const lineReflection = (p1, p2, p3) => {
  const m = slope(p1, p2);
  //reflection in y axis
  if (m > 999999 || m < -999999) {
    return new Point( p3.x, -p3.y);
  }
  //reflection in x axis
  else if ( toFixed(m, 10) == 0) {
    return new Point( -p3.x, p3.y);
  }
  //reflection in arbitrary line
  else {
    const c = p1.y - m * p1.x;
    const d = (p3.x + (p3.y - c) * m) / (1 + m * m);
    const x = 2 * d - p3.x;
    const y = 2 * d * m - p3.y + 2 * c;
    return new Point(x,y);
  }
}

//calculate the radius and centre of the circle required to draw a line between
//two points in the hyperbolic plane defined by the disk (r, c)
export const greatCircle = (p1, p2, circle) => {
  const p1Inverse = inverse(p1, circle);
  const p2Inverse = inverse(p2, circle);

  const m = midpoint(p1, p1Inverse);
  const n = midpoint(p2, p2Inverse);

  const m1 = perpendicularSlope(m, p1Inverse);
  const m2 = perpendicularSlope(n, p2Inverse);


  //centre is the centrepoint of the circle out of which the arc is made
  const centre = intersection(m, m1, n, m2);
  const radius = distance(centre, p1);

  return new Circle(centre.x, centre.y, radius);
}

//intersection of two circles with equations:
//(x-a)^2 +(y-a)^2 = r0^2
//(x-b)^2 +(y-c)^2 = r1^2
//NOTE assumes the two circles DO intersect!
export const circleIntersect = (circle0, circle1) => {
  const a = circle0.centre.x;
  const b = circle0.centre.y;
  const c = circle1.centre.x;
  const d = circle1.centre.y;
  const r0 = circle0.radius;
  const r1 = circle1.radius;

  const dist = Math.sqrt((c - a) * (c - a) + (d - b) * (d - b));

  const del = Math.sqrt((dist + r0 + r1) * (dist + r0 - r1) * (dist - r0 + r1) * (-dist + r0 + r1)) / 4;

  const xPartial = (a + c) / 2 + ((c - a) * (r0 * r0 - r1 * r1)) / (2 * dist * dist);
  const x1 = xPartial - 2 * del * (b - d) / (dist * dist);
  const x2 = xPartial + 2 * del * (b - d) / (dist * dist);

  const yPartial = (b + d) / 2 + ((d - b) * (r0 * r0 - r1 * r1)) / (2 * dist * dist);
  const y1 = yPartial + 2 * del * (a - c) / (dist * dist);
  const y2 = yPartial - 2 * del * (a - c) / (dist * dist);

  const p1 = new Point(x1,y1);

  const p2 = new Point(x2,y2);

  return {
    p1: p1,
    p2: p2
  };
}

export const circleLineIntersect = (circle, p1, p2) => {
  const cx = circle.centre.x;
  const cy = circle.centre.y;
  const r = circle.radius;

  const d = distance(p1, p2);
  //unit vector p1 p2
  const dx = (p2.x - p1.x) / d;
  const dy = (p2.y - p1.y) / d;

  //point on line closest to circle centre
  const t = dx * (cx - p1.x) + dy * (cy - p1.y);
  const p = new Point(t * dx + p1.x, t * dy + p1.y);

  //distance from this point to centre
  const d2 = distance(p, circle.centre);

  //line intersects circle
  if (d2 < r) {
    const dt = Math.sqrt(r * r - d2 * d2);
    //point 1
    const q1 = new Point((t - dt) * dx + p1.x, (t - dt) * dy + p1.y);
    //point 2
    const q2 = new Point((t + dt) * dx + p1.x,(t + dt) * dy + p1.y);

    return {
      p1: q1,
      p2: q2
    };
  } else if (d2 === r) {
    return p;
  } else {
    console.warn('Warning: line does not intersect circle!');
    return false;
  }
}

//angle in radians between two points on circle of radius r
export const centralAngle = (p1, p2, r) => {
  //round off error can result in this being very slightly greater than 1
  let temp = (0.5 * distance(p1, p2) / r);
  temp = toFixed(temp,10);
  let res = 2 * Math.asin(temp);
  if(isNaN(res)) res = 0;
  return res;
}

//calculate the normal vector given 2 points
export const normalVector = (p1, p2) => {
  let d = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  return new Point((p2.x - p1.x) / d,(p2.y - p1.y) / d);
}

//does the line connecting p1, p2 go through the point (0,0)?
//needs to take into account roundoff errors so returns true if
//test is close to 0
export const throughOrigin = (p1, p2) => {
  if ( toFixed(p1.x, 10) == 0 && toFixed(p2.x, 10) === 0) {
    //vertical line through centre
    return true;
  }
  const test = (-p1.x * p2.y + p1.x * p1.y) / (p2.x - p1.x) + p1.y;

  if ( toFixed(test, 10) == 0) return true;
  else return false;
}

//find a point at a distance d along the circumference of
//a circle of radius r, centre c from a point also
//on the circumference
export const spacedPointOnArc = (circle, point, spacing) => {
  const cosTheta = -((spacing * spacing) / (2 * circle.radius * circle.radius) - 1);
  const sinThetaPos = Math.sqrt(1 - Math.pow(cosTheta, 2));
  const sinThetaNeg = -sinThetaPos;

  const xPos = circle.centre.x + cosTheta * (point.x - circle.centre.x) - sinThetaPos * (point.y - circle.centre.y);
  const xNeg = circle.centre.x + cosTheta * (point.x - circle.centre.x) - sinThetaNeg * (point.y - circle.centre.y);
  const yPos = circle.centre.y + sinThetaPos * (point.x - circle.centre.x) + cosTheta * (point.y - circle.centre.y);
  const yNeg = circle.centre.y + sinThetaNeg * (point.x - circle.centre.x) + cosTheta * (point.y - circle.centre.y);

  return {
    p1: new Point(xPos, yPos),
    p2: new Point(xNeg,yNeg)
  }
}

export const spacedPointOnLine = (point1, point2, spacing) => {
  const circle = new Circle(point1.x, point1.y, spacing);
  return points = circleLineIntersect(circle, point1, point2);
}

export const randomFloat = (min, max) => {
  return Math.random() * (max - min) + min;
}

export const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

//.toFixed returns a string for some no doubt very good reason.
//Change it back to a float
export const toFixed = (number, places) => {
  return parseFloat(number.toFixed(places));
}

//are the angles alpha, beta in clockwise order on unit disk?
export const clockwise = (alpha, beta) => {
  let cw = true;
  const a = (beta > 3*Math.PI/2 && alpha < Math.PI/2);
  const b = (beta - alpha > Math.PI);
  const c = ((alpha > beta) && !(alpha - beta > Math.PI));
  if(a || b || c){
    cw = false;
  }
  return cw;
}

export const rotatePointAboutOrigin = (point2D, angle) => {
  return new Point(Math.cos(angle) * point2D.x - Math.sin(angle) * point2D.y,
    Math.sin(angle) * point2D.x + Math.cos(angle) * point2D.y);
}
