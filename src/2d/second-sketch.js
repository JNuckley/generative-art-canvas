const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random"); // to make randomness reproducible

const settings = {
  dimensions: [2048, 2048],
};

const sketch = () => {
  const createGrid = () => {
    const points = [];
    const count = 20; // how many rows and columns // increase for overlapping patterns
    //for columns
    for (let x = 0; x < count; x++) {
      //for rows
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1); // 0.5 puts it in the center if only 1 circle
        const v = count <= 1 ? 0.5 : y / (count - 1); // -1 because coordinates don't go to 1 so offset
        points.push([u, v]);
      }
    }
    return points;
  };

  // const points = createGrid();

  random.setSeed(801); // to help create a reproducible randomness
  const points = createGrid().filter(() => random.value() > 0.5);

  // randomly take some of the circles out
  // const points = createGrid().filter(() => Math.random() > 0.5); // without random seed

  const margin = 200;
  return ({ context, width, height }) => {
    context.fillStyle = "white"; // otherwise when saved, background is transparent
    context.fillRect(0, 0, width, height); // fill the whole canvas with white

    points.forEach(([u, v]) => {
      // const x = u * width;
      // const y = v * height;

      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      context.beginPath();
      context.arc(x, y, 100, Math.PI * 2, false); // Math.PI * 1 is a semi-circle // x, y, radius, startAngle, endAngle, drawCounterClockwise
      context.strokeStyle = "black";
      context.lineWidth = width * 0.001;
      context.stroke();
    });
  };
};

canvasSketch(sketch, settings);
