import {
  Point
}
from './point';
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
//NOT WORKING FOR VERTICAL LINES!!!
export const intersection = (p1, m1, p2, m2) => {
  let c1, c2, x, y;
  //case where first line is vertical
  //if(m1 > 5000 || m1 < -5000 || m1 === Infinity){
  if (p1.y < 0.000001 && p1.y > -0.000001) {
    x = p1.x;
    y = (m2) * (p1.x - p2.x) + p2.y;
  }
  //case where second line is vertical
  //else if(m2 > 5000 || m2 < -5000 || m1 === Infinity){
  else if (p2.y < 0.000001 && p2.y > -0.000001) {
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
export const inverse = (p, r, c) => {
  let alpha = (r * r) / (Math.pow(p.x - c.x, 2) + Math.pow(p.y - c.y, 2));
  return new Point(alpha * (p.x - c.x) + c.x, alpha * (p.y - c.y) + c.y);
}

//reflect p3 across the line defined by p1,p2
export const lineReflection = (p1, p2, p3) => {
  const m = slope(p1, p2);
  //reflection in y axis
  if (m > 999999) {
    return {
      x: p3.x,
      y: -p3.y
    };
  }
  //reflection in x axis
  else if (m.toFixed(6) == 0) {
    return {
      x: -p3.x,
      y: p3.y
    };
  }
  //reflection in arbitrary line
  else {
    const c = p1.y - m * p1.x;
    const d = (p3.x + (p3.y - c) * m) / (1 + m * m);
    const x = 2 * d - p3.x;
    const y = 2 * d * m - p3.y + 2 * c;
    return {
      x: x,
      y: y
    };
  }
}

//calculate the radius and centre of the circle required to draw a line between
//two points in the hyperbolic plane defined by the disk (r, c)
export const greatCircle = (p1, p2, r, c) => {
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
export const greatCircleV2 = (p1, p2, r) => {
  let x = (p2.y * (p1.x * p1.x + r) + p1.y * p1.y * p2.y - p1.y * (p2.x * p2.x + p2.y * p2.y + r)) / (2 * p1.x * p2.y - p1.y * p2.x);
  let y = (p1.x * p1.x * p2.x - p1.x * (p2.x * p2.x + p2.y * p2.y + r) + p2.x * (p1.y * p1.y + r)) / (2 * p1.y * p2.x + 2 * p1.x * p2.y);
  let radius = Math.sqrt(x * x + y * y - r);
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
export const circleIntersect = (c0, c1, r0, r1) => {
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

export const circleLineIntersect = (c, r, p1, p2) => {

  const d = distance(p1, p2);
  //unit vector p1 p2
  const dx = (p2.x - p1.x) / d;
  const dy = (p2.y - p1.y) / d;

  //point on line closest to circle centre
  const t = dx * (c.x - p1.x) + dy * (c.y - p1.y);
  const p = {
    x: t * dx + p1.x,
    y: t * dy + p1.y
  };

  //distance from this point to centre
  const d2 = distance(p, c);

  //line intersects circle
  if (d2 < r) {
    const dt = Math.sqrt(r * r - d2 * d2);
    //point 1
    const q1 = {
      x: (t - dt) * dx + p1.x,
      y: (t - dt) * dy + p1.y
    }
    //point 2
    const q2 = {
      x: (t + dt) * dx + p1.x,
      y: (t + dt) * dy + p1.y
    }

    return {
      p1: q1,
      p2: q2
    };
  } else if (d2 === r) {
    return p;
  } else {
    console.error('Error: line does not intersect circle!');
  }
}

//angle in radians between two points on circle of radius r
export const centralAngle = (p1, p2, r) => {
  return 2 * Math.asin(0.5 * distance(p1, p2) / r);
}

//calculate the normal vector given 2 points
export const normalVector = (p1, p2) => {
  let d = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  return {
    x: (p2.x - p1.x) / d,
    y: (p2.y - p1.y) / d
  }
}

//does the line connecting p1, p2 go through the point (0,0)?
//needs to take into account roundoff errors so returns true if
//test is close to 0
export const throughOrigin = (p1, p2) => {
  if (p1.x === 0 && p2.x === 0) {
    //vertical line through centre
    return true;
  }
  const test = (-p1.x * p2.y + p1.x * p1.y) / (p2.x - p1.x) + p1.y;

  if (test.toFixed(6) == 0) return true;
  else return false;
}

//find the centroid of a non-self-intersecting polygon
export const centroidOfPolygon = (points) => {
  let first = points[0],
    last = points[points.length - 1];
  if (first.x != last.x || first.y != last.y) points.push(first);
  let twicearea = 0,
    x = 0,
    y = 0,
    nPts = points.length,
    p1, p2, f;
  for (var i = 0, j = nPts - 1; i < nPts; j = i++) {
    p1 = points[i];
    p2 = points[j];
    f = p1.x * p2.y - p2.x * p1.y;
    twicearea += f;
    x += (p1.x + p2.x) * f;
    y += (p1.y + p2.y) * f;
  }
  f = twicearea * 3;
  return {
    x: x / f,
    y: y / f
  };
}

//compare two points taking rounding errors into account
export const comparePoints = (p1, p2) => {
  if (typeof p1 === 'undefined' || typeof p2 === 'undefined') {
    return true;
  }
  p1 = pointToFixed(p1, 6);
  p2 = pointToFixed(p2, 6);
  if (p1.x === p2.x && p1.y === p2.y) return true;
  else return false;
}

export const pointToFixed = (p, places) => {
  return {
    x: p.x.toFixed(places),
    y: p.y.toFixed(places)
  };
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

  const p1 = {
    x: xPos,
    y: yPos
  };
  const p2 = {
    x: xNeg,
    y: yNeg
  };
  return {
    p1: p1,
    p2: p2
  }
}

export const randomFloat = (min, max) => {
  return Math.random() * (max - min) + min;
}

export const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
