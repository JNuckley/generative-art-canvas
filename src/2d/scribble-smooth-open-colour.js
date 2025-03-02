const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const { lerp } = require("canvas-sketch-util/math");
const palettes = require("nice-color-palettes");

const settings = {
  dimensions: [2048, 2048],
};

const sketch = ({ width, height }) => {
  const background = "black";
  const margin = width * 0.1;

  // Create a grid of points (in pixel space) within the margin bounds
  const createGrid = () => {
    const xCount = 6;
    const yCount = 6;
    const points = [];
    for (let x = 0; x < xCount; x++) {
      for (let y = 0; y < yCount; y++) {
        const u = x / (xCount - 1);
        const v = y / (yCount - 1);
        const px = lerp(margin, width - margin, u);
        const py = lerp(margin, height - margin, v);
        points.push([px, py]);
      }
    }
    return points;
  };

  // Create the grid
  let grid = createGrid();

  // Shuffle the grid points to create a random path
  grid = random.shuffle(grid);

  // Generate a random palette
  const palette = random.pick(palettes);

  // Function to draw Catmull-Rom spline
  const drawCatmullRomSpline = (context, points) => {
    for (let i = 0; i < points.length - 1; i++) {
      context.beginPath();
      context.moveTo(points[i][0], points[i][1]);

      const p0 = points[i === 0 ? i : i - 1];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[i + 2 === points.length ? i + 1 : i + 2];

      context.strokeStyle = random.pick(palette);

      for (let t = 0; t < 1; t += 0.005) {
        // Smaller step size for smoother curves - 0.01
        const x =
          0.5 *
          (2 * p1[0] +
            (-p0[0] + p2[0]) * t +
            (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t * t +
            (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t * t * t);
        const y =
          0.5 *
          (2 * p1[1] +
            (-p0[1] + p2[1]) * t +
            (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t * t +
            (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t * t * t);
        context.lineTo(x, y);
      }

      context.lineTo(points[i + 1][0], points[i + 1][1]);
      context.stroke();
    }
  };

  // Now render
  return ({ context, width, height }) => {
    // Make sure our alpha is back to 1.0 before we draw our background color
    context.globalAlpha = 1;
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);

    // Draw the smooth path
    context.lineWidth = 10;

    drawCatmullRomSpline(context, grid);
  };
};

canvasSketch(sketch, settings);
