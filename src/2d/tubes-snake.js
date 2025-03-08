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

  // Create a snake path that visits every cell.
  // Even rows go left-to-right; odd rows go right-to-left.
  const createSnakeCenters = () => {
    const centers = [];
    for (let j = 0; j < rows; j++) {
      const rowCenters = [];
      for (let i = 0; i < cols; i++) {
        const x = margin + i * cellW + cellW / 2;
        const y = margin + j * cellH + cellH / 2;
        rowCenters.push([x, y]);
      }
      if (j % 2 === 1) {
        // Reverse the row for a snake effect (U-turn)
        rowCenters.reverse();
      }
      centers.push(...rowCenters);
    }
    return centers;
  };

  // Use the snake ordering so the tube fills every cell.
  let centers = createSnakeCenters();

  // Pick a palette from nice-color-palettes
  const palette = random.pick(palettes);

  // Helper: Draw a tube segment connecting two points with bends.
  // A cubic Bezier curve is used. Two control points are computed at
  // 1/3 and 2/3 along the straight line, then offset perpendicularly
  // by random amounts. Depending on these offsets some segments will
  // appear straight, while others will have pronounced curves or 90° bends.
  const drawTubeSegment = (ctx, p0, p1, fillColor, borderColor) => {
    const dx = p1[0] - p0[0];
    const dy = p1[1] - p0[1];

    // Base control points at 33% and 66% along the line:
    const base1x = p0[0] + dx * 0.33;
    const base1y = p0[1] + dy * 0.33;
    const base2x = p0[0] + dx * 0.66;
    const base2y = p0[1] + dy * 0.66;

    // Create a perpendicular (normalized) vector to the segment
    let nx = -dy;
    let ny = dx;
    const len = Math.sqrt(nx * nx + ny * ny);
    nx = nx / len;
    ny = ny / len;

    // Apply different random offsets to each control point.
    // With an offset range that can produce U-turns or 90° bends.
    const offset1 = random.range(-40, 40);
    const offset2 = random.range(-40, 40);
    const cp1x = base1x + nx * offset1;
    const cp1y = base1y + ny * offset1;
    const cp2x = base2x + nx * offset2;
    const cp2y = base2y + ny * offset2;

    // First draw the thick tube (the fill)
    ctx.beginPath();
    ctx.moveTo(p0[0], p0[1]);
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p1[0], p1[1]);
    ctx.strokeStyle = fillColor;
    ctx.lineWidth = 40;
    ctx.lineCap = "round";
    ctx.stroke();

    // Then draw a lighter inner border
    ctx.beginPath();
    ctx.moveTo(p0[0], p0[1]);
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p1[0], p1[1]);
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 20;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  return ({ context, width, height }) => {
    // Fill background
    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);

    // Draw a tube segment for every pair of consecutive centers.
    // This creates one long, continuously connected tube covering all grid cells.
    for (let i = 0; i < centers.length - 1; i++) {
      const p0 = centers[i];
      const p1 = centers[i + 1];
      // Choose a fill color for this segment (or you could randomize per segment)
      const fillColor = random.pick(palette);
      // A light inner border
      const borderColor = "rgba(255,255,255,0.7)";
      drawTubeSegment(context, p0, p1, fillColor, borderColor);
    }
  };
};

canvasSketch(sketch, settings);
