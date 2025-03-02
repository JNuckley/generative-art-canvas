const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: "A4", // [ width, height ] or A4, A3, A2, A1, A0
  units: "cm", // cm, in, px
  orientation: "landscape", // portrait or landscape
  pixelsPerInch: 300, // common for print design
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = "teal";
    context.fillRect(0, 0, width, height);

    context.beginPath();
    context.arc(width / 2, height / 2, width * 0.2, 0, Math.PI * 2, false); // Math.PI * 1 is a semi-circle
    context.fillStyle = "red";
    context.fill();

    context.lineWidth = width * 0.01;
    context.strokeStyle = "black";
    context.stroke();
  };
};

canvasSketch(sketch, settings);
