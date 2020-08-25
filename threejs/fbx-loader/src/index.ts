import * as THREE from 'three/src/Three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

var camera: THREE.PerspectiveCamera, controls: OrbitControls, scene: THREE.Scene, renderer: THREE.WebGLRenderer;

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xcccccc);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(400, 200, 100);

  // controls

  controls = new OrbitControls(camera, renderer.domElement);

  //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05;

  controls.autoRotateSpeed = .2;
  controls.autoRotate = true;

  controls.screenSpacePanning = false;

  controls.minDistance = 100;
  controls.maxDistance = 500;

  controls.maxPolarAngle = Math.PI / 2;

  // helpers

  const gX = new THREE.GridHelper(200, 20, "#aaa", "#666");
  const gY = new THREE.GridHelper(200, 20, "#aaa", "#666");
  const gZ = new THREE.GridHelper(200, 20, "#aaa", "#666");

  gX.rotateZ(Math.PI / 2);
  gY.rotateY(Math.PI / 2);
  gZ.rotateX(Math.PI / 2);

  scene.add(gX);
  scene.add(gY);
  scene.add(gZ);

  scene.add(new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 240, 0xff0000));
  scene.add(new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 240, 0x00ff00));
  scene.add(new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 240, 0x0000ff));

  // lights

  let light: THREE.Light;

  light = new THREE.DirectionalLight(0xffffff, 0.8);
  light.position.set(30, 50, 10);
  scene.add(light);

  light = new THREE.DirectionalLight(0xffffff, 0.3);
  light.position.set(-30, -50, -10);
  scene.add(light);

  light = new THREE.AmbientLight(0x222222, .4);
  scene.add(light);

  // events

  window.addEventListener('resize', onWindowResize, false);

  // code

  const loader = new FBXLoader();

  loader.load('http://localhost:9000/static/GoldBlock.fbx', obj => {
    obj.traverse(child => {
      if (child.isObject3D) {
        const mesh = child as THREE.Mesh;

        mesh.material = new THREE.MeshStandardMaterial({ color: new THREE.Color("#f00") });

        scene.add(child);
      }
    })
  });
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

  render();
}

function render() {
  renderer.render(scene, camera);
}