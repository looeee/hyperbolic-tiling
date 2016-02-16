import * as E from './euclid';

// * ***********************************************************************
// * ***********************************************************************
// * ***********************************************************************
// *
// *   HYPERBOLIC ELEMENT CLASSES
// *
// *************************************************************************
// * ***********************************************************************
// * ***********************************************************************

// * ***********************************************************************
// *
// *   POINT CLASS
// *   2D point class
// *
// *************************************************************************

export class Point {
  constructor(x, y, isOnUnitDisk = true) {
    this.isOnUnitDisk = isOnUnitDisk;
    if (E.toFixed(x) == 0) {
      x = 0;
    }
    if (E.toFixed(y) == 0) {
      y = 0;
    }
    this.x = x;
    this.y = y;

    //start with z = 0; this will used to transform to/from Weierstrass form
    this.z = 0;
  }

  toFixed(places) {
    this.x = E.toFixed(this.x, places);
    this.y = E.toFixed(this.y, places);
  }

  //compare two points taking rounding errors into account
  compare(p2) {
    if (typeof p2 === 'undefined') {
      console.warn('Warning: point not defined.')
      return false;
    }
    const t1 = this.toFixed(12);
    const t2 = p2.toFixed(12);

    if (p1.x === p2.x && p1.y === p2.y) return true;
    else return false;
  }

  transform(transform) {
    const mat = transform.matrix;
    const p = this.poincareToWeierstrass();

    const x = p.x * mat[0][0] + p.y * mat[0][1] + p.z * mat[0][2];
    const y = p.x * mat[1][0] + p.y * mat[1][1] + p.z * mat[1][2];
    const z = p.x * mat[2][0] + p.y * mat[2][1] + p.z * mat[2][2];
    const q =  new Point(x, y, this.isOnUnitDisk);
    q.z = z;
    return q.weierstrassToPoincare();

  }

  poincareToWeierstrass() {
    const factor = 1 / (1 - this.x * this.x - this.y * this.y);
    const x = 2 * factor * this.x;
    const y = 2 * factor * this.y;
    const z = factor * (1 + this.x * this.x + this.y * this.y);
    const p = new Point(x, y, this.isOnUnitDisk);
    p.z = z;
    return p;
  }

  weierstrassToPoincare() {
    const factor = 1 / (1 + this.z);
    const x = factor * this.x;
    const y = factor * this.y;
    return new Point(x, y, this.isOnUnitDisk);
  }

  //map from disk of window.radius to unit disk
  toUnitDisk() {
    if (this.isOnUnitDisk === true) {
      console.warn('Point ' + this.x + ', ' + this.y + ' already on unit disk!');
      return this;
    }
    return new Point(this.x / window.radius, this.y / window.radius, true);
  }

  //map from unit disk to disk of window.radius
  fromUnitDisk() {
    if (this.isOnUnitDisk === false) {
      console.warn('Point ' + this.x + ', ' + this.y + ' not on unit disk!');
      return this;
    }

    return new Point(this.x * window.radius, this.y * window.radius, false);
  }
}

// * ***********************************************************************
// *
// *   CIRCLE CLASS
// *
// *************************************************************************

export class Circle {
  constructor(centreX, centreY, radius, isOnUnitDisk = true) {
    this.isOnUnitDisk = isOnUnitDisk;
    if (E.toFixed(radius) == 0) {
      radius = 0;
    }
    this.centre = new Point(centreX, centreY, this.isOnUnitDisk);
    this.radius = radius;
  }

  //map from disk of window.radius to unit disk
  toUnitDisk() {
    if (this.isOnUnitDisk === true) {
      console.warn('Circle ' + this + 'already on unit disk!');
      return this;
    }
    return new Circle(this.centre.x / window.radius, this.centre.y / window.radius, this.radius / window.radius);
  }

  //map from unit disk to disk of window.radius
  fromUnitDisk() {
    if (this.isOnUnitDisk === false) {
      console.warn('Circle ' + this + 'not on unit disk!');
      return this;
    }
    return new Circle(this.centre.x * window.radius, this.centre.y * window.radius, this.radius * window.radius);
  }
}

// * ***********************************************************************
// *
// *   ARC CLASS
// *
// *************************************************************************

export class Arc {
  constructor(p1, p2, isOnUnitDisk = false) {
    this.isOnUnitDisk = isOnUnitDisk;
    this.p1 = p1;
    this.p2 = p2;

    if (E.throughOrigin(p1, p2)) {
      this.circle = new Circle(0, 0, 1, true);
      this.startAngle = 0;
      this.endAngle = 0;
      this.clockwise = false;
      this.straightLine = true;
    }

    else {
      let q1, q2;
      if (this.isOnUnitDisk) {
        q1 = p2;
        q2 = p2;
      }
      else {
        q1 = p1.toUnitDisk();
        q2 = p2.toUnitDisk();
      }

      const wq1 = q1.poincareToWeierstrass();
      const wq2 = q2.poincareToWeierstrass();

      const wcp = this.weierstrassCrossProduct(wq1, wq2);

      //calculate centre of arcCircle relative to unit disk
      const arcCentre = new Point(wcp.x / wcp.z, wcp.y / wcp.z, true);

      //translate points to origin before calculating arctan
      q1.x = q1.x - arcCentre.x;
      q1.y = q1.y - arcCentre.y;
      q2.x = q2.x - arcCentre.x;
      q2.y = q2.y - arcCentre.y;

      const r = Math.sqrt((q1.x * q1.x) + (q1.y * q1.y));

      let arcCircle;
      if (this.isOnUnitDisk) {
        arcCircle = new Circle(arcCentre.x, arcCentre.y, r, true);
      } else {
        arcCircle = new Circle(arcCentre.x * window.radius, arcCentre.y * window.radius, r * window.radius, false);
      }

      let alpha = Math.atan2(q1.y, q1.x);

      let beta = Math.atan2(q2.y, q2.x);

      //angles are in (-pi, pi), transform to (0,2pi)
      alpha = (alpha < 0) ? 2 * Math.PI + alpha : alpha;
      beta = (beta < 0) ? 2 * Math.PI + beta : beta;

      //check whether points are in clockwise order and assign angles accordingly
      const cw = E.clockwise(alpha, beta);
      if (cw) {
        this.startAngle = alpha;
        this.endAngle = beta;
      } else {
        this.startAngle = beta;
        this.endAngle = alpha;
      }

      this.circle = arcCircle;
      this.clockwise = cw;
      this.straightLine = false;
    }
  }

  weierstrassCrossProduct(point3D_1, point3D_2){
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

  //map from disk of window.radius to unit disk
  toUnitDisk() {
    if (this.isOnUnitDisk === true) {
      console.warn('Arc ' + this + 'already on unit disk!');
      return this;
    } else {
      let p1 = this.p1.toUnitDisk();
      let p2 = this.p2.toUnitDisk();
      return new Arc(p1, p2, true);
    }
  }

  //map from unit disk to disk of window.radius
  fromUnitDisk() {
    if (this.isOnUnitDisk === false) {
      console.warn('Arc ' + this + 'not on unit disk!');
      return this;
    } else {
      let p1 = this.p1.fromUnitDisk();
      let p2 = this.p2.fromUnitDisk();
      return new Arc(p1, p2, false);
    }
  }
}

// * ***********************************************************************
// *
// *   POLYGON CLASS
// *
// *************************************************************************

//@param vertices: array of Points
//@param circle: Circle representing current Poincare Disk dimensions
export class Polygon {
  constructor(vertices, isOnUnitDisk = true) {
    this.isOnUnitDisk = isOnUnitDisk;
    this.vertices = vertices;
  }

  spacedPointsOnEdges() {
    let spacing = 5; //Math.ceil((2000 / window.radius));
    //if(spacing < 5) spacing = 5;
    const l = this.vertices.length;
    const points = [];

    //push the first vertex
    points.push(this.vertices[0]);

    //loop over the edges
    for (let i = 0; i < l; i++) {
       //tiny pgons near the edges of the disk don't need to be subdivided
      if(E.distance(this.vertices[i], this.vertices[(i + 1) % l]) > spacing){
        let p;
        const arc = new Arc(this.vertices[i], this.vertices[(i + 1) % l], this.isOnUnitDisk);

        //line not through the origin (hyperbolic arc)
        if (!arc.straightLine) {
          if (arc.clockwise) p = E.spacedPointOnArc(arc.circle, this.vertices[i], spacing).p1;
          else p = E.spacedPointOnArc(arc.circle, this.vertices[i], spacing).p2;

          points.push(p);

          while (E.distance(p, this.vertices[(i + 1) % l]) > spacing) {
            if (arc.clockwise) p = E.spacedPointOnArc(arc.circle, p, spacing).p1;
            else p = E.spacedPointOnArc(arc.circle, p, spacing).p2;
            points.push(p);
          }
        }

        //line through origin (straight line)
        else {
          p = E.spacedPointOnLine(this.vertices[i], this.vertices[(i + 1) % l], spacing).p2;
          points.push(p);
          while (E.distance(p, this.vertices[(i + 1) % l]) > spacing) {
            p = E.spacedPointOnLine(p, this.vertices[i], spacing).p1;
            points.push(p);
          }
        }
      }

      //push the last vertex on each edge (but don't push first vertex again)
      if ((i + 1) % l !== 0) {
        points.push(this.vertices[(i + 1) % l]);
      }
    }
    return points;
  }

  //Apply a Transform to the polygon
  transform(transform) {
    const newVertices = [];
    for (v of this.vertices) {
      newVertices.push(v.transform(transform));
    }

    return new Polygon(newVertices, this.isOnUnitDisk);
  }

  //find the barycentre of a non-self-intersecting polygon
  barycentre() {
    const l = this.vertices.length;
    const first = this.vertices[0];
    const last = this.vertices[l - 1];

    let twicearea = 0,
      x = 0,
      y = 0,
      p1, p2, f;
    for (let i = 0, j = l - 1; i < l; j = i++) {
      p1 = this.vertices[i];
      p2 = this.vertices[j];
      f = p1.x * p2.y - p2.x * p1.y;
      twicearea += f;
      x += (p1.x + p2.x) * f;
      y += (p1.y + p2.y) * f;
    }
    f = twicearea * 3;
    return new Point(x / f, y / f, this.isOnUnitDisk);
  }

  //map from disk of window.radius to unit disk
  toUnitDisk() {
    if (this.isOnUnitDisk === true) {
      console.warn('Polygon ' + this + 'already on unit disk!');
      return this;
    } else {
      const newVertices = [];
      for (let v of this.vertices) {
        newVertices.push(v.toUnitDisk());
      }
      return new Polygon(newVertices, true);
    }
  }

  //map from unit disk to disk of window.radius
  fromUnitDisk() {
    if (this.isOnUnitDisk === false) {
      console.warn('Polygon ' + this + 'not on unit disk!');
      return this;
    } else {
      const newVertices = [];
      for (let v of this.vertices) {
        newVertices.push(v.fromUnitDisk());
      }
      return new Polygon(newVertices, false);
    }
  }
}

/*
//reflect vertices of the polygon over the arc defined by p1, p1
//and create a new polygon from the reflected vertices
//NOTE: now done using transforms
reflect(p1, p2){
  const a = new Arc(p1, p2, this.circle, this.isOnUnitDisk);
  const vertices = [];

  if (!a.straightLine) {
    for (let v of this.vertices) {
      vertices.push(E.inverse(v, a.circle));
    }
  } else {
    for (let v of this.vertices) {
      vertices.push(E.lineReflection(p1, p2, v));
    }
  }
  return new Polygon(vertices, this.isOnUnitDisk);
}

//NOTE: now done using transforms
rotateAboutOrigin(angle){
  const vertices = [];
  for (let v of this.vertices) {
    let point = E.rotatePointAboutOrigin(v, angle);
    vertices.push(point);
  }
  return new Polygon(vertices, this.isOnUnitDisk);
}

*/
