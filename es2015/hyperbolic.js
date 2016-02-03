import * as E from './euclid';
// * ***********************************************************************
// *
// *   HYPERBOLIC FUNCTIONS
// *   a place to stash all the functions that are hyperbolic gemeometrical
// *   operations
// *
// *************************************************************************

//calculate greatCircle, startAngle and endAngle for hyperbolic arc
//TODO deal with case of staight lines through centre
export const arc = (p1, p2, circle) => {
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
  let alpha1, alpha2, startAngle, endAngle;
  const c = E.greatCircle(p1, p2, circle.radius, circle.centre);

  const oy = c.centre.y;
  const ox = c.centre.x;

  //point at 0 radians on c
  const p3 = {
    x: ox + c.radius,
    y: oy
  }

  //calculate the position of each point in the circle
  alpha1 = E.centralAngle(p3, p1, c.radius);
  alpha1 = (p1.y < oy) ? 2 * Math.PI - alpha1 : alpha1;
  alpha2 = E.centralAngle(p3, p2, c.radius);
  alpha2 = (p2.y < oy) ? 2 * Math.PI - alpha2 : alpha2;

  //case where p1 above and p2 below the line c.centre -> p3
  if ((p1.x > ox && p2.x > ox) && (p1.y < oy && p2.y > oy)) {
    startAngle = alpha1;
    endAngle = alpha2;
  }
  //case where p2 above and p1 below the line c.centre -> p3
  else if ((p1.x > ox && p2.x > ox) && (p1.y > oy && p2.y < oy)) {
    startAngle = alpha2;
    endAngle = alpha1;
    clockwise = true;
  }
  //points in clockwise order
  else if (alpha1 > alpha2) {
    startAngle = alpha2;
    endAngle = alpha1;
    clockwise = true;
  }
  //points in anticlockwise order
  else {
    startAngle = alpha1;
    endAngle = alpha2;
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
export const translateX = (pointsArray, distance) => {
  const l = pointsArray.length;
  const newPoints = [];
  const e = Math.pow(Math.E, distance);
  const pos = e + 1;
  const neg = e - 1;
  for (let i = 0; i < l; i++) {
    const x = pos * pointsArray[i].x + neg * pointsArray[i].y;
    const y = neg * pointsArray[i].x + pos * pointsArray[i].y;
    newPoints.push({
      x: x,
      y: y
    })
  }
  return newPoints;
}

//rotate a set of points about a point by a given angle
//clockwise defaults to false
export const rotation = (pointsArray, point, angle, clockwise) => {

}

//reflect a set of points across a hyperbolic arc
//TODO add case where reflection is across straight line
export const reflect = (pointsArray, p1, p2, circle) => {
  const l = pointsArray.length;
  const a = arc(p1, p2, circle);
  const newPoints = [];

  if (!a.straightLine) {
    for (let i = 0; i < l; i++) {
      newPoints.push(E.inverse(pointsArray[i], a.circle.radius, a.circle.centre));
    }
  } else {
    for (let i = 0; i < l; i++) {
      //console.error('reflection across straight line not implemented! ')
      newPoints.push(E.lineReflection(p1,p2,pointsArray[i]));
    }
  }
  console.log(newPoints);
  return newPoints;
}

export const poincareToWeierstrass = (point2D) => {
  const factor = 1 / (1 - point2D.x * point2D.x - point2D.y * point2D.y);
  return {
    x: 2 * factor * point2D.x,
    y: 2 * factor * point2D.y,
    z: factor * (1 + point2D.x * point2D.x + point2D.y * point2D.y)
  }
}

export const weierstrassToPoincare = (point3D) => {
  const factor = 1 / (1 + point3D.z);
  return {
    x: factor * point3D.x,
    y: factor * point3D.y
  }
}

export const rotateAboutOriginWeierstrass = (point3D, angle) => {
  return {
    x: Math.cos(angle) * point3D.x - Math.sin(angle) * point3D.y,
    y: Math.sin(angle) * point3D.x + Math.cos(angle) * point3D.y,
    z: point3D.z
  }
}

export const rotateAboutOriginPoincare = (point2D, angle) => {
  return {
    x: Math.cos(angle) * point2D.x - Math.sin(angle) * point2D.y,
    y: Math.sin(angle) * point2D.x + Math.cos(angle) * point2D.y,
  }
}

export const rotatePgonAboutOrigin = (points2DArray, angle) => {
  const l = points2DArray.length;
  const rotatedPoints2DArray = [];
  for (let i = 0; i < l; i++) {
    let point = rotateAboutOriginPoincare(points2DArray[i], angle);
    rotatedPoints2DArray.push(point);
  }
  return rotatedPoints2DArray;
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

  return {
    x: x,
    y: y
  }
}

export const inverseTranslatePoincare = (p1, p2) => {

}
