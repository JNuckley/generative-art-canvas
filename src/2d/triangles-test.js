const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const { lerp } = require("canvas-sketch-util/math");
const palettes = require("nice-color-palettes");

const settings = {
  dimensions: [1024, 1024],
};

const sketch = ({ width, height }) => {
  // define an overall margin so nothing is cut off
  const margin = 100;
  // define grid dimensions
  const cols = 10;
  const rows = 10;

  // cell width and height based on available area
  const cellW = (width - margin * 2) / cols;
  const cellH = (height - margin * 2) / rows;

  // pick and shuffle a palette
  const palette = random.pick(palettes);

  // helper function to create a tube path inside a cell
  // We're drawing a closed path that curves along each edge.
  const createShapePath = (context, x, y, w, h) => {
    // begin a new path
    context.beginPath();
    // start at bottom left
    context.moveTo(x, y + h);
    // left edge: curve from bottom left to top left with a random control point offset
    const offsetLeft = random.range(-w * 0.2, w * 0.2);
    // context.quadraticCurveTo(x + offsetLeft, y + h / 2, x, y); // remove this to leave triangles

    // top edge: curve from top left to top right
    const offsetTop = random.range(-h * 0.2, h * 0.2);
    context.quadraticCurveTo(x + w / 2, y + offsetTop, x + w, y);

    // right edge: curve from top right to bottom right
    const offsetRight = random.range(-w * 0.2, w * 0.2);
    context.quadraticCurveTo(x + w - offsetRight, y + h / 2, x + w, y + h);

    // bottom edge: curve from bottom right to bottom left
    const offsetBottom = random.range(-h * 0.2, h * 0.2);
    context.quadraticCurveTo(x + w / 2, y + h - offsetBottom, x, y + h);

    context.closePath();
  };

  return ({ context, width, height }) => {
    // fill the background
    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = margin + i * cellW;
        const y = margin + j * cellH;

        // create a tube path within the current cell
        createShapePath(context, x, y, cellW, cellH);

        // fill with a random color from the palette
        context.fillStyle = random.pick(palette);
        context.fill();

        // stroke with a light border
        context.strokeStyle = "rgba(255,255,255,0.5)";
        context.lineWidth = 4;
        context.stroke();
      }
    }
  };
};

canvasSketch(sketch, settings);
