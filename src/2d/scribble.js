const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const { lerp } = require("canvas-sketch-util/math");

const settings = {
  dimensions: [2048, 2048],
};

const sketch = ({ width, height }) => {
  const background = "white";
  const margin = width * 0.05;

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

  // Now render
  return ({ context, width, height }) => {
    // Make sure our alpha is back to 1.0 before we draw our background color
    context.globalAlpha = 1;
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);

    // Draw the smooth path
    context.beginPath();
    context.lineWidth = 4;
    context.strokeStyle = "black";

    // Move to the first point
    context.moveTo(grid[0][0], grid[0][1]);

    // Draw bezier curves through the points
    for (let i = 1; i < grid.length - 2; i++) {
      const [x0, y0] = grid[i];
      const [x1, y1] = grid[i + 1];
      const [x2, y2] = grid[i + 2];
      const cp1x = (x0 + x1) / 2;
      const cp1y = (y0 + y1) / 2;
      const cp2x = (x1 + x2) / 2;
      const cp2y = (y1 + y2) / 2;
      context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x1, y1);
    }

    // Draw the last segment
    const [xLast1, yLast1] = grid[grid.length - 2];
    const [xLast2, yLast2] = grid[grid.length - 1];
    context.quadraticCurveTo(xLast1, yLast1, xLast2, yLast2);

    context.stroke();
  };
};

canvasSketch(sketch, settings);
