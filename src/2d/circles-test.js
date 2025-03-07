const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");

const settings = {
  dimensions: [1024, 1024],
};

const sketch = () => {
  const createGrid = () => {
    const points = [];
    const count = 20; // how many rows and columns
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        points.push([u, v]);
      }
    }
    return points;
  };

  // Use a filtered grid for a sparser layout
  const points = createGrid().filter(() => random.value() > 0.6);

  const margin = 200;

  const nColors = random.rangeFloor(1, 6);
  const palette = random.shuffle(random.pick(palettes)).slice(0, nColors);

  return ({ context, width, height }) => {
    context.fillStyle = "black";

    context.fillRect(0, 0, width, height);
    context.globalAlpha = 0.7;
    points.forEach(([u, v]) => {
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      context.beginPath();
      context.arc(x, y, 40, 0, Math.PI * 2, false);

      // Pick a random fill colour for each circle
      context.fillStyle = random.pick(palette);
      context.fill();

      // Optionally stroke the circle
      context.strokeStyle = "black";
      context.lineWidth = width * 0.002;

      context.stroke();
    });
  };
};

canvasSketch(sketch, settings);
