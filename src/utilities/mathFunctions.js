// * ***********************************************************************
// *
// *   MATH FUNCTIONS
// *
// *************************************************************************

export const distance = ( x1, y1, x2, y2 ) =>
  Math.sqrt( ( x2 - x1 ) * ( x2 - x1 ) + ( y2 - y1 ) * ( y2 - y1 ) );

// does the line connecting p1, p2 go through the point (0,0)?
export const throughOrigin = ( x1, y1, x2, y2 ) => {
  // vertical line through centre
  if ( ( Math.abs( x1 ) <= 0.00001 ) && ( Math.abs( x2 ) <= 0.00001 ) ) {
    return true;
  }
  const test = ( -x1 * y2 + x1 * y1 ) / ( x2 - x1 ) + y1;

  if ( Math.abs( test ) <= 0.00001 ) return true;
  return false;
};


// Find the length of the smaller arc between two angles on a given circle
export const arcLength = ( radius, startAngle, endAngle ) => {
  return ( Math.abs( startAngle - endAngle ) > Math.PI )
    ? radius * ( 2 * Math.PI - Math.abs( startAngle - endAngle ) )
    : radius * ( Math.abs( startAngle - endAngle ) );
};

// find the two points a distance from a point on the circumference of a circle
// in the direction of point2
export const directedSpacedPointOnArc = ( arc, spacing ) => {
  const cosTheta = -( ( spacing * spacing ) / ( 2 * arc.radius * arc.radius ) - 1 );
  const sinThetaPos = Math.sqrt( 1 - ( cosTheta * cosTheta ) );
  const sinThetaNeg = -sinThetaPos;

  const xPos = arc.centre.x + cosTheta
    * ( arc.startPoint.x - arc.centre.x ) - sinThetaPos
    * ( arc.startPoint.y - arc.centre.y );
  const xNeg = arc.centre.x + cosTheta
    * ( arc.startPoint.x - arc.centre.x ) - sinThetaNeg
    * ( arc.startPoint.y - arc.centre.y );
  const yPos = arc.centre.y + sinThetaPos
    * ( arc.startPoint.x - arc.centre.x ) + cosTheta
    * ( arc.startPoint.y - arc.centre.y );
  const yNeg = arc.centre.y + sinThetaNeg
    * ( arc.startPoint.x - arc.centre.x ) + cosTheta
    * ( arc.startPoint.y - arc.centre.y );

  const a = distance( xPos, yPos, arc.endPoint.x, arc.endPoint.y );
  const b = distance( xNeg, yNeg, arc.endPoint.x, arc.endPoint.y );

  return ( a < b ) ? { x: xPos, y: yPos, z: 0 } : { x: xNeg, y: yNeg, z: 0 };
};

// calculate the normal vector given 2 points
// export const normalVector = ( x1, y1, x2, y2 ) => {
//   const d = distance( x1, y1, x2, y2 );
//   v1.set( ( x2 - x1 ) / d, ( y2 - y1 ) / d, 0 );
//   return v1;
//   // { x: ( x2 - x1 ) / d, y: ( y2 - y1 ) / d, z: 0 };
// };

// find the point at a distance from point1 along line defined by point1, point2,
// in the direction of point2
export const directedSpacedPointOnLine = ( x1, y1, x2, y2, spacing ) => {
  const d = distance( x1, y1, x2, y2 );
  // const dv = normalVector( x1, y1, x2, y2 );
  return {
    x: x1 + spacing * ( x2 - x1 ) / d,
    y: y1 + spacing * ( y2 - y1 ) / d,
    z: 0,
  };
};

export const multiplyMatrices = ( m1, m2 ) => {
  const result = [];
  for ( let i = 0; i < m1.length; i++ ) {
    result[i] = [];
    for ( let j = 0; j < m2[0].length; j++ ) {
      let sum = 0;
      for ( let k = 0; k < m1[0].length; k++ ) {
        sum += m1[i][k] * m2[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
};

// create nxn identityMatrix
export const identityMatrix = n =>
  Array( ...new Array( n ) ).map( ( x, i, a ) =>
    a.map( ( y, k ) => {
      return ( i === k ) ? 1 : 0;
    } ),
  );

export const hyperboloidCrossProduct = ( x1, y1, z1, x2, y2, z2 ) => {
  return {
    x: y1 * z2 - z1 * y2,
    y: z1 * x2 - x1 * z2,
    z: -x1 * y2 + y1 * x2,
  };
}

export const poincareToHyperboloid = ( x, y ) => {
  const factor = 1 / ( 1 - x * x - y * y );
  return { 
    x: 2 * factor * x,
    y: 2 * factor * y,
    z: factor * ( 1 + x * x + y * y ),
  };
};

export const hyperboloidToPoincare = ( x, y, z ) => {
  const factor = 1 / ( 1 + z );
  return { 
    x: factor * x,
    y: factor * y,
    z: 0,
  };
};

// move the point to hyperboloid (Weierstrass) space, apply the transform, then move back
export const transformPoint = ( transform, x, y ) => {
  const mat = transform.matrix;
  const p = poincareToHyperboloid( x, y );
  const xT = p.x * mat[0][0] + p.y * mat[0][1] + p.z * mat[0][2];
  const yT = p.x * mat[1][0] + p.y * mat[1][1] + p.z * mat[1][2];
  const zT = p.x * mat[2][0] + p.y * mat[2][1] + p.z * mat[2][2];

  return hyperboloidToPoincare( xT, yT, zT );
};

// are the angles alpha, beta in clockwise order on unit disk?
// export const clockwise = ( alpha, beta ) => {
//   // let cw = true;
//   const a = ( beta > 3 * Math.PI / 2 && alpha < Math.PI / 2 );
//   const b = ( beta - alpha > Math.PI );
//   const c = ( ( alpha > beta ) && !( alpha - beta > Math.PI ) );
//   // if (a || b || c) {
//     // cw = false;
//   // }
//   // return (a || b || c) ? false : true;
//   return !( a || b || c );
// };

// export const randomFloat = ( min, max ) => Math.random() * ( max - min ) + min;

// export const randomInt = ( min, max ) => Math.floor( Math.random() * ( max - min + 1 ) + min );
