const canvasSketch = require("canvas-sketch");
const { lerp } = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random"); // to make randomness reproducible
const palettes = require("nice-color-palettes");

const settings = {
  suffix: random.getSeed(), // to save the random seed in the file name
  dimensions: [2048, 2048],
  pixelsPerInch: 300, // common for print design
};

const sketch = () => {
  const createGrid = () => {
    const points = [];
    const count = 80;
    const colorCount = random.rangeFloor(4, 6);
    const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount); // second number is how many colours you will have
    console.log(palette);
    //for columns
    for (let x = 0; x < count; x++) {
      //for rows
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        // const radius = Math.abs(random.noise2D(u, v));
        const radius = Math.abs(random.noise2D(u, v)) * 0.1; // to make the circles smaller
        // to give different radius or other properties to each circle we store in an object
        points.push({
          position: [u, v],
          radius: radius,
          color: random.pick(palette),
          rotation: random.noise2D(u, v),
        });
      }
    }
    return points;
  };

  // const points = createGrid();

  // random.setSeed(15); // to help create a reproducible randomness for colour and circles
  const points = createGrid().filter(() => random.value() > 0.4);

  // randomly take some of the circles out
  // const points = createGrid().filter(() => Math.random() > 0.5); // without random seed

  const margin = 400;
  return ({ context, width, height }) => {
    context.fillStyle = "white"; // otherwise when saved, background is transparent
    context.fillRect(0, 0, width, height); // fill the whole canvas with white

    points.forEach((data) => {
      const { position, radius, color, rotation } = data;
      const [u, v] = position;

      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      // context.beginPath();

      // context.arc(x, y, radius * width, Math.PI * 2, false); // Math.PI * 1 is a semi-circle // x, y, radius, startAngle, endAngle, drawCounterClockwise
      // context.fillStyle = color;
      // context.fill();
      // context.strokeStyle = color;
      // context.lineWidth = width * 0.002;
      // context.stroke();

      // text in the grid instead of circles
      context.save();
      context.fillStyle = color;
      context.font = `${radius * width}px "Open Sans"`;
      context.translate(x, y);
      context.rotate(rotation); // rotates from the top left corner
      context.fillText("|", 0, 0); // 0,0 is the center

      context.restore();
    });
  };
};

canvasSketch(sketch, settings);
