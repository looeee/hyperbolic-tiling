// * ***********************************************************************
// *
// *  CANVAS CLASS
// *
// *************************************************************************
export class Canvas {
  constructor() {
    this.canvas = document.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');

    //fullscreen
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    //transform the canvas so the origin is at the centre of the disk
    this.ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
  }


  //draw a hyperbolic line segment using calculations from line() or arc()
  segment(c, alpha, alphaOffset, colour, width) {
    this.ctx.beginPath();
    this.ctx.arc(c.centre.x, c.centre.y, c.radius, alphaOffset, alpha + alphaOffset);
    this.ctx.strokeStyle = colour || 'black';
    this.ctx.lineWidth = width || 1;
    this.ctx.stroke();
  }

  //draw a (euclidean) line between two points
  euclideanLine(p1, p2, colour, width) {
    const c = colour || 'black';
    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.lineTo(p2.x, p2.y);
    this.ctx.strokeStyle = c;
    this.ctx.lineWidth = width || 1;
    this.ctx.stroke();
  }

  //draw a point on the disk, optional radius and colour
  point(point, radius, colour) {
    const col = colour || 'black';
    const r = radius || 2;
    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, r, 0, Math.PI * 2, true);
    this.ctx.fillStyle = col;
    this.ctx.fill();
  }

  //draw a circle of radius r centre c and optional colour
  circle(c, r, colour, width) {
    const col = colour || 'black';
    this.ctx.beginPath();
    this.ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
    this.ctx.strokeStyle = col;
    this.ctx.lineWidth = width || 1;
    this.ctx.stroke();
  }

  //convert the canvas to a base64URL and send to saveImage.php
  saveImage() {
    const data = this.canvas.toDataURL();
    $.ajax({
      type: 'POST',
      url: 'saveImage.php',
      data: {
        img: data,
      },
    });
  }

  //the canvas has been translated to the centre of the disk so need to
  //use an offset to clear it. NOT WORKING WHEN SCREEN IS RESIZED
  clearScreen() {
    this.ctx.clearRect(-window.innerWidth / 2, -window.innerHeight / 2,
      window.innerWidth, window.innerHeight);
  }

}
