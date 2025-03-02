const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const { lerp } = require("canvas-sketch-util/math");

const settings = {
  dimensions: [2048, 1024],
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

    // Draw the path
    context.beginPath();
    context.lineWidth = 4;
    context.strokeStyle = "black";
    grid.forEach(([x, y], index) => {
      if (index === 0) {
        context.moveTo(x, y);
      } else {
        context.lineTo(x, y);
      }
    });
    context.closePath();
    context.stroke();
  };
};

canvasSketch(sketch, settings);
