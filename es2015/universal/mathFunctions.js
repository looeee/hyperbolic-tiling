/* mathFunctions.js */

import {
  Circle, Point,
}
from './universalElements';
// * ***********************************************************************
// *
// *   MATH FUNCTIONS
// *
// *************************************************************************

//.toFixed returns a string for some no doubt very good reason.
//apply to fixed with default value of 10 and return as a float
export const toFixed = (number, places = 10) => parseFloat(number.toFixed(places));

export const distance = (point1, point2) =>
  Math.sqrt(Math.pow((point2.x - point1.x), 2) + Math.pow((point2.y - point1.y), 2));

//does the line connecting p1, p2 go through the point (0,0)?
export const throughOrigin = (point1, point2) => {
  //vertical line through centre
  if ((toFixed(point1.x) === toFixed(0)) && (toFixed(point2.x) === toFixed(0))) {
    return true;
  }
  const test = (-point1.x * point2.y + point1.x * point1.y) / (point2.x - point1.x) + point1.y;

  if (toFixed(test) === toFixed(0)) return true;
  return false;
};

//Find the length of the smaller arc between two angles on a given circle
export const arcLength = (circle, startAngle, endAngle) => {
  return (Math.abs(startAngle - endAngle) > Math.PI)
    ? circle.radius * (2 * Math.PI - Math.abs(startAngle - endAngle))
    : circle.radius * (Math.abs(startAngle - endAngle));
};

//find the two points a distance from a point on the circumference of a circle
//in the direction of point2
export const directedSpacedPointOnArc = (circle, point1, point2, spacing) => {
  const cosTheta = -((spacing * spacing) / (2 * circle.radius * circle.radius) - 1);
  const sinThetaPos = Math.sqrt(1 - Math.pow(cosTheta, 2));
  const sinThetaNeg = -sinThetaPos;

  const xPos = circle.centre.x + cosTheta
    * (point1.x - circle.centre.x) - sinThetaPos
    * (point1.y - circle.centre.y);
  const xNeg = circle.centre.x + cosTheta
    * (point1.x - circle.centre.x) - sinThetaNeg
    * (point1.y - circle.centre.y);
  const yPos = circle.centre.y + sinThetaPos
    * (point1.x - circle.centre.x) + cosTheta
    * (point1.y - circle.centre.y);
  const yNeg = circle.centre.y + sinThetaNeg
    * (point1.x - circle.centre.x) + cosTheta
    * (point1.y - circle.centre.y);

  const p1 = new Point(xPos, yPos);
  const p2 = new Point(xNeg, yNeg);

  const a = distance(p1, point2);
  const b = distance(p2, point2);
  return (a < b) ? p1 : p2;
};

//calculate the normal vector given 2 points
export const normalVector = (p1, p2) => {
  const d = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  return new Point((p2.x - p1.x) / d, (p2.y - p1.y) / d);
};

//find the point at a distance from point1 along line defined by point1, point2,
//in the direction of point2
export const directedSpacedPointOnLine = (point1, point2, spacing) => {
  const dv = normalVector(point1, point2);
  return new Point(point1.x + spacing * dv.x, point1.y + spacing * dv.y);
};

export const randomFloat = (min, max) => Math.random() * (max - min) + min;

export const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

//are the angles alpha, beta in clockwise order on unit disk?
export const clockwise = (alpha, beta) => {
  //let cw = true;
  const a = (beta > 3 * Math.PI / 2 && alpha < Math.PI / 2);
  const b = (beta - alpha > Math.PI);
  const c = ((alpha > beta) && !(alpha - beta > Math.PI));
  //if (a || b || c) {
    //cw = false;
  //}
  //return (a || b || c) ? false : true;
  return !(a || b || c);
};

export const multiplyMatrices = (m1, m2) => {
  const result = [];
  for (let i = 0; i < m1.length; i++) {
    result[i] = [];
    for (let j = 0; j < m2[0].length; j++) {
      let sum = 0;
      for (let k = 0; k < m1[0].length; k++) {
        sum += m1[i][k] * m2[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
};

//create nxn identityMatrix
export const identityMatrix = (n) =>
  Array.apply(null, new Array(n)).map((x, i, a) =>
    a.map((y, k) => {
      return (i === k) ? 1 : 0;
    })
  );
  
