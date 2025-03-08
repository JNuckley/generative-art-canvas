const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const { lerp } = require("canvas-sketch-util/math");
const palettes = require("nice-color-palettes");

const settings = {
  dimensions: [1024, 1024],
};

const sketch = ({ width, height }) => {
  // overall margin so nothing is cut off
  const margin = 100;
  // grid dimensions (for selecting centers)
  const cols = 10;
  const rows = 10;

  // Compute cell dimensions
  const cellW = (width - margin * 2) / cols;
  const cellH = (height - margin * 2) / rows;

  // Create grid centers
  const createGridCenters = () => {
    const centers = [];
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = margin + i * cellW + cellW / 2;
        const y = margin + j * cellH + cellH / 2;
        centers.push([x, y]);
      }
    }
    return centers;
  };

  let centers = createGridCenters();
  // Shuffle centers so the path will jump all over the canvas
  centers = random.shuffle(centers);

  // Pick a palette from nice-color-palettes
  const palette = random.pick(palettes);

  // Helper: Draw a tube segment connecting two points
  // We use a quadratic curve with a random offset for an undulating effect.
  // First we stroke a thick line with the fill color, then overlay a lighter inner border.
  const drawTubeSegment = (ctx, p0, p1, fillColor, borderColor) => {
    // Compute a control point offset.
    const dx = p1[0] - p0[0];
    const dy = p1[1] - p0[1];
    // Midpoint of the segment
    const mx = (p0[0] + p1[0]) / 2;
    const my = (p0[1] + p1[1]) / 2;
    // Perpendicular to the segment
    let nx = -dy;
    let ny = dx;
    const len = Math.sqrt(nx * nx + ny * ny);
    nx = nx / len;
    ny = ny / len;
    // Random offset magnitude (you can adjust the range)
    const offset = random.range(-40, 40);
    const cpX = mx + nx * offset;
    const cpY = my + ny * offset;

    // First, draw the thick tube (the fill)
    ctx.beginPath();
    ctx.moveTo(p0[0], p0[1]);
    ctx.quadraticCurveTo(cpX, cpY, p1[0], p1[1]);
    ctx.strokeStyle = fillColor;
    ctx.lineWidth = 40;
    ctx.lineCap = "round";
    ctx.stroke();

    // Then draw a lighter inner border
    ctx.beginPath();
    ctx.moveTo(p0[0], p0[1]);
    ctx.quadraticCurveTo(cpX, cpY, p1[0], p1[1]);
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 20;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  return ({ context, width, height }) => {
    // Fill background
    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);

    // For each consecutive pair in the shuffled centers, draw a tube segment.
    // This produces one connected, winding tube.
    for (let i = 0; i < centers.length - 1; i++) {
      const p0 = centers[i];
      const p1 = centers[i + 1];
      // Choose a random fill color from the palette for this segment
      const fillColor = random.pick(palette);
      // Use a light, semi-transparent white for the border
      const borderColor = "rgba(255,255,255,0.7)";

      drawTubeSegment(context, p0, p1, fillColor, borderColor);
    }
  };
};

canvasSketch(sketch, settings);
