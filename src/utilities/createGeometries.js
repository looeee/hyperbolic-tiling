import * as THREE from 'three';
import { directedSpacedPointOnArc, directedSpacedPointOnLine, distance } from '../utilities/mathFunctions.js';

// The longest edge with radius > 0 should be used to calculate how finely
// the polygon gets subdivided
function findSubdivisionEdge( polygon ) {
  // curvature === 0 means this edge goes through origin
  // in which case subdivide based on next longest edge
  const a = ( polygon.edges[0].curvature === 0 )
    ? 0
    : polygon.edges[0].arcLength;
  const b = ( polygon.edges[1].curvature === 0 )
    ? 0
    : polygon.edges[1].arcLength;
  const c = ( polygon.edges[2].curvature === 0 )
    ? 0
    : polygon.edges[2].arcLength;
  if ( a > b && a > c ) return 0;
  else if ( b > c ) return 1;
  return 2;
}

// Subdivide the edge into lengths calculated by calculateSpacing()
function subdivideHyperbolicArc( arc, numDivisions ) {
  // calculate the spacing for subdividing the edge into an even number of pieces.
  // For the first ( longest ) edge this will be calculated based on spacing
  // then for the rest of the edges it will be calculated based on the number of
  // subdivisions of the first edge ( so that all edges are divided into an equal
  // number of pieces)

  // calculate the number of subdivisions required to break the arc into an
  // even number of pieces (or 1 in case of tiny polygons)

  numDivisions = numDivisions || ( arc.arcLength > 0.001 )
    ? 2 * Math.ceil( arc.arcLength ) // currently always = 2
    : 1;

  // calculate spacing based on number of points
  const spacing = arc.arcLength / numDivisions;

  const points = [arc.startPoint];

  // tiny pgons near the edges of the disk don't need to be subdivided
  if ( arc.arcLength > spacing ) {
    let p = ( !arc.straightLine )
      ? directedSpacedPointOnArc( arc, spacing )
      : directedSpacedPointOnLine( arc.startPoint.x, arc.startPoint.y, arc.endPoint.x, arc.endPoint.y, spacing );
    points.push( p );

    for ( let i = 0; i < numDivisions - 2; i++ ) {
      p = ( !arc.straightLine )
        ? directedSpacedPointOnArc( arc, spacing )
        : directedSpacedPointOnLine( p.x, p.y, arc.endPoint.x, arc.endPoint.y, spacing );
      points.push( p );
    }
  }
  // push the final vertex
  points.push( arc.endPoint );

  return points;
}

// subdivide the subdivision edge, then subdivide the other two edges with the
// same number of points as the subdivision
function subdivideHyperbolicPolygonEdges( polygon ) {
  const subdivisionEdge = findSubdivisionEdge( polygon );

  const edge1Points = subdivideHyperbolicArc( polygon.edges[subdivisionEdge] );

  const numDivisions = edge1Points.length - 1;

  polygon.numDivisions = numDivisions;

  const edge2Points = subdivideHyperbolicArc( polygon.edges[( subdivisionEdge + 1 ) % 3], numDivisions );
  const edge3Points = subdivideHyperbolicArc( polygon.edges[( subdivisionEdge + 2 ) % 3], numDivisions );

  const edges = [];

  edges[subdivisionEdge] = edge1Points;
  edges[( subdivisionEdge + 1 ) % 3] = edge2Points;
  edges[( subdivisionEdge + 2 ) % 3] = edge3Points;

  return edges;
}

// Alternative to subdivideInteriorArc using lines instead of arcs
// ( quality seems the same and may be faster )
function subdivideLine( startPoint, endPoint, numDivisions, arcIndex ) {
  const points = [startPoint];

  const divisions = numDivisions - arcIndex;

  // if the line get divided add points along line to mesh
  if ( divisions > 1 ) {
    const spacing = distance( startPoint.x, startPoint.y, endPoint.x, endPoint.y ) / ( divisions );
    let nextPoint = directedSpacedPointOnLine( startPoint.x, startPoint.y, endPoint.x, endPoint.y, spacing );
    for ( let j = 0; j < divisions - 1; j++ ) {
      points.push( nextPoint );
      nextPoint = directedSpacedPointOnLine( nextPoint.x, nextPoint.y, endPoint.x, endPoint.y, spacing );
    }
  }

  points.push( endPoint );

  return points;
}

// Given a hyperbolic polygon, return an array representing a subdivided  triangular
// mesh across it's surface
function subdivideHyperbolicPolygon( polygon ) {
  const subdividedEdges = subdivideHyperbolicPolygonEdges( polygon );

  const numDivisions = polygon.numDivisions;

  const points = [].concat( subdividedEdges[0] );

  // TODO: Switch to using flat array and eventually just immediately populate the Float32Array
  // const flatPoints = [];

  // for ( let i = 0; i < subdividedEdges[0].length; i++ ) {
  //   flatPoints.push(
  //     subdividedEdges[0][i].x,
  //     subdividedEdges[0][i].y,
  //     subdividedEdges[0][i].z,
  //   );
  // }

  for ( let i = 1; i < numDivisions; i++ ) {
    const startPoint = subdividedEdges[2][( numDivisions - i )];
    const endPoint = subdividedEdges[1][i];
    // this.subdivideInteriorArc( startPoint, endPoint, i );
    const newPoints = subdivideLine( startPoint, endPoint, i );

    // for ( let j = 0; j < newPoints.length; j++) {
    //   flatPoints.push(
    //     newPoints[j].x,
    //     newPoints[j].y,
    //     newPoints[j].z,
    //   );
    // }

    points.push( ...newPoints );

  }

  // push the final vertex
  points.push( subdividedEdges[2][0] );

  // flatPoints.push(
  //   subdividedEdges[2][0].x,
  //   subdividedEdges[2][0].y,
  //   subdividedEdges[2][0].z,
  // );

  return points;
}

// create one buffer geometry per material (tile type)
export default function createGeometries( tiling ) {
  let positionAIndex = 0;
  let uvAIndex = 0;

  let positionBIndex = 0;
  let uvBIndex = 0;

  const positionsA = [];
  const uvsA = [];

  const positionsB = [];
  const uvsB = [];

  function createGeometry( polygon ) {

    const vertices = subdivideHyperbolicPolygon( polygon );

    const divisions = polygon.numDivisions || 1;

    function addPositionsAndUvs( positions, positionIndex, uvs, uvIndex ) {

      const p = 1 / divisions;

      let edgeStartingVertex = 0;
      // loop over each interior edge of the polygon's subdivion mesh and create faces and uvs
      for ( let i = 0; i < divisions; i++ ) {
        // edge divisions reduce by one for each interior edge
        const m = divisions - i + 1;

        positions[ positionIndex++ ] = vertices[edgeStartingVertex].x;
        positions[ positionIndex++ ] = vertices[edgeStartingVertex].y;
        positions[ positionIndex++ ] = vertices[edgeStartingVertex].z;

        positions[ positionIndex++ ] = vertices[edgeStartingVertex + m].x;
        positions[ positionIndex++ ] = vertices[edgeStartingVertex + m].y;
        positions[ positionIndex++ ] = vertices[edgeStartingVertex + m].z;


        positions[ positionIndex++ ] = vertices[edgeStartingVertex + 1].x;
        positions[ positionIndex++ ] = vertices[edgeStartingVertex + 1].y;
        positions[ positionIndex++ ] = vertices[edgeStartingVertex + 1].z;

        uvs[ uvIndex++ ] = i * p;
        uvs[ uvIndex++ ] = 0;
        uvs[ uvIndex++ ] = ( i + 1 ) * p;
        uvs[ uvIndex++ ] = 0;
        uvs[ uvIndex++ ] = ( i + 1 ) * p;
        uvs[ uvIndex++ ] = p;

        // range m-2 because we are ignoring the edges first vertex which was
        // used in the previous positions.push
        // Each loop creates 2 faces
        for ( let j = 0; j < m - 2; j++ ) {

          // Face 1
          positions[ positionIndex++ ] = vertices[edgeStartingVertex + j + 1].x;
          positions[ positionIndex++ ] = vertices[edgeStartingVertex + j + 1].y;
          positions[ positionIndex++ ] = vertices[edgeStartingVertex + j + 1].z;

          positions[ positionIndex++ ] = vertices[edgeStartingVertex + m + j].x;
          positions[ positionIndex++ ] = vertices[edgeStartingVertex + m + j].y;
          positions[ positionIndex++ ] = vertices[edgeStartingVertex + m + j].z;

          positions[ positionIndex++ ] = vertices[edgeStartingVertex + m + 1 + j].x;
          positions[ positionIndex++ ] = vertices[edgeStartingVertex + m + 1 + j].y;
          positions[ positionIndex++ ] = vertices[edgeStartingVertex + m + 1 + j].z;

          // Face 2
          positions[ positionIndex++ ] = vertices[edgeStartingVertex + j + 1].x;
          positions[ positionIndex++ ] = vertices[edgeStartingVertex + j + 1].y;
          positions[ positionIndex++ ] = vertices[edgeStartingVertex + j + 1].z;

          positions[ positionIndex++ ] = vertices[edgeStartingVertex + m + 1 + j].x;
          positions[ positionIndex++ ] = vertices[edgeStartingVertex + m + 1 + j].y;
          positions[ positionIndex++ ] = vertices[edgeStartingVertex + m + 1 + j].z;

          positions[ positionIndex++ ] = vertices[edgeStartingVertex + j + 2].x;
          positions[ positionIndex++ ] = vertices[edgeStartingVertex + j + 2].y;
          positions[ positionIndex++ ] = vertices[edgeStartingVertex + j + 2].z;

          // Face 1 uvs
          uvs[uvIndex++] = ( i + 1 + j ) * p;
          uvs[uvIndex++] = ( 1 + j ) * p;
          uvs[uvIndex++] = ( i + 1 + j ) * p;
          uvs[uvIndex++] = j * p;
          uvs[uvIndex++] = ( i + j + 2 ) * p;
          uvs[uvIndex++] = ( j + 1 ) * p;

          // Face 2 uvs
          uvs[ uvIndex++ ] = ( i + 1 + j ) * p;
          uvs[ uvIndex++ ] = ( 1 + j ) * p;
          uvs[ uvIndex++ ] = ( i + 2 + j ) * p;
          uvs[ uvIndex++ ] = ( j + 1 ) * p;
          uvs[ uvIndex++ ] = ( i + j + 2 ) * p;
          uvs[ uvIndex++ ] = ( j + 2 ) * p;

        }
        edgeStartingVertex += m;
      }

    }

    if ( polygon.materialIndex === 0 ) {
      addPositionsAndUvs( positionsA, positionAIndex, uvsA, uvAIndex );
      if ( divisions === 1 ) {
        positionAIndex += 9;
        uvAIndex += 6;
      } else if ( divisions === 2 ) {
        positionAIndex += 36;
        uvAIndex += 24;
      } else {
        console.error( 'Too many divisions!!' );
      }
    } else {
      addPositionsAndUvs( positionsB, positionBIndex, uvsB, uvBIndex );
      if ( divisions === 1 ) {
        positionBIndex += 9;
        uvBIndex += 6;
      } else if ( divisions === 2 ) {
        positionBIndex += 36;
        uvBIndex += 24;
      } else {
        console.error( 'Too many divisions!!' );
      }
    }

  }

  const bufferGeometryA = new THREE.BufferGeometry();
  const bufferGeometryB = new THREE.BufferGeometry();

  for ( let i = 0; i < tiling.length; i++ ) {
    createGeometry( tiling[i] );
  }

  bufferGeometryA.addAttribute( 'position', new THREE.Float32BufferAttribute( positionsA, 3 ) );
  bufferGeometryA.addAttribute( 'uv', new THREE.Float32BufferAttribute( uvsA, 2 ) );

  bufferGeometryB.addAttribute( 'position', new THREE.Float32BufferAttribute( positionsB, 3 ) );
  bufferGeometryB.addAttribute( 'uv', new THREE.Float32BufferAttribute( uvsB, 2 ) );

  return [bufferGeometryA, bufferGeometryB];
}

// find the points along the arc between opposite subdivions of the second two
// edges of the polygon. Each subsequent arc will have one less subdivision
// function subdivideInteriorArc( startPoint, endPoint, arcIndex ) {
//   const arc = new HyperbolicArc( startPoint, endPoint );
//   this.mesh.push( startPoint );

//   // for each arc, the number of divisions will be reduced by one
//   const divisions = this.numDivisions - arcIndex;

//   // if the line get divided add points along line to mesh
//   if ( divisions > 1 ) {
//     const spacing = distance( startPoint.x, startPoint.y, endPoint.x, endPoint.y ) / ( divisions );
//     let nextPoint = directedSpacedPointOnArc( arc, spacing );
//     for ( let j = 0; j < divisions - 1; j++ ) {
//       this.mesh.push( nextPoint );
//       nextPoint = directedSpacedPointOnArc( arc, spacing );
//     }
//   }

//   this.mesh.push( endPoint );
// }
