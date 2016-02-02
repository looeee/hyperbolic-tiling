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
    c: c,
    startAngle: startAngle,
    endAngle: endAngle,
    clockwise: clockwise
  }
}

//translate a set of points along the x axis
export const translateX = ( pointsArray, distance ) => {
  const l = pointsArray.length;
  const newPoints = [];
  const e = Math.pow( Math.E, distance );
  const pos = e + 1;
  const neg = e - 1;
  for ( let i = 0; i < l; i++ ) {
    const x = pos * pointsArray[ i ].x + neg * pointsArray[ i ].y;
    const y = neg * pointsArray[ i ].x + pos * pointsArray[ i ].y;
    newPoints.push( {
      x: x,
      y: y
    } )
  }
  return newPoints;
}

//rotate a set of points about a point by a given angle
//clockwise defaults to false
export const rotation =( pointsArray, point, angle, clockwise ) => {

}

//reflect a set of points across a hyperbolic arc
//TODO add case where reflection is across straight line
export const reflect = ( pointsArray, p1, p2, circle ) => {
  const l = pointsArray.length;
  const a = arc( p1, p2, circle );
  const newPoints = [];
  for ( let i = 0; i < l; i++ ) {
    newPoints.push( E.inverse( pointsArray[ i ], a.c.radius, a.c.centre ) );
  }
  return newPoints;
}