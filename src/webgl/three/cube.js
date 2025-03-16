// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");
// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const { attribute } = require("three");

const settings = {
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
  attributes: { antialias: true }, // removes jagged edges
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  // WebGL background color
  renderer.setClearColor("#fff", 1); // colour and alpha (alpha is opacity)

  // Setup a camera
  const camera = new THREE.OrthographicCamera(); // field of view, aspect ratio, near, far

  // Setup camera controller
  // const controls = new THREE.OrbitControls(camera, context.canvas);

  // Setup your scene
  const scene = new THREE.Scene();
  const palette = random.pick(palettes);
  console.log(palette);

  const box = new THREE.BoxGeometry(
    Math.random(),
    Math.random(),
    Math.random()
  );
  for (let i = 0; i < 60; i++) {
    const mesh = new THREE.Mesh(
      box,
      new THREE.MeshBasicMaterial({
        color: palette[Math.floor(Math.random() * palette.length)],
      })
    );
    mesh.position.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    );
    mesh.scale.set(
      random.range(-1, 1),
      random.range(-1, 1),
      random.range(-1, 1)
    );
    mesh.scale.multiplyScalar(1);

    scene.add(mesh);
  }

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      const aspect = viewportWidth / viewportHeight;
      // orthographic zoom
      const zoom = 2;
      //bounds
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;
      // near and far planes
      camera.near = -100;
      camera.far = 100;
      // set position
      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());
      // update the camera
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
      // controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      // controls.dispose();
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);
