import * as THREE from 'three/src/Three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

let camera: THREE.PerspectiveCamera;
let controls: OrbitControls;
let scene: THREE.Scene;
let renderer: THREE.WebGLRenderer;
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const navPoints: NavPoint[] = [];

class NavPoint {
  geometry: THREE.SphereBufferGeometry;
  sphere: THREE.Mesh;

  constructor(x: number, y: number, z: number) {
    this.geometry = new THREE.SphereBufferGeometry(10, 18, 12);
    const material = new THREE.MeshStandardMaterial({ color: new THREE.Color("#FFFF00"), roughness: 1, metalness: 0 });
    this.sphere = new THREE.Mesh(this.geometry, material);

    this.sphere.position.set(x, y, z);

    this.sphere.userData = this;

    scene.add(this.sphere);
  }

  update() {
    const newScale = this.sphere.scale.x - 0.1;
    if (newScale >= 1) this.sphere.scale.set(newScale, newScale, newScale);
  }

  setScale(newScale: number) {
    if (newScale < this.sphere.scale.x) return;

    this.sphere.scale.set(newScale, newScale, newScale);
  }
}

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xcccccc);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.set(10, 20, 30);

  // controls

  controls = new OrbitControls(camera, renderer.domElement);

  //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.07;

  controls.autoRotate = true;
  //controls.rotateSpeed = 1;
  controls.autoRotateSpeed = -.1;

  controls.screenSpacePanning = false;

  controls.minDistance = 800;
  controls.maxDistance = 800;

  controls.enableZoom = false;

  controls.maxPolarAngle = Math.PI;

  //controls.target.set(100, 100, -10);

  // helpers

  const grid = new THREE.GridHelper(1000, 50, '#aaa', '#666');
  scene.add(grid);

  scene.add(new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 40, 0xff0000));
  scene.add(new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 40, 0x00ff00));
  scene.add(new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 40, 0x0000ff));

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

  // code

  navPoints.push(new NavPoint(300, 160, 0));
  navPoints.push(new NavPoint(-300, 160, 0));
  navPoints.push(new NavPoint(0, 160, 300));
  navPoints.push(new NavPoint(0, 160, -300));

  // events

  window.addEventListener('resize', onWindowResize, false);
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  document.addEventListener('click', onMouseClick, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function updateMouse(event: MouseEvent) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

function onDocumentMouseMove(event: MouseEvent) {
  event.preventDefault();

  updateMouse(event);
}

function onMouseClick(event: MouseEvent) {
  updateMouse(event);

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(navPoints.map(m => m.sphere));

  for (const intersect of intersects) {
    const point = intersect.object.userData as NavPoint;

    //point.setScale(3);

    for (const p of navPoints) p.sphere.visible = true;
    point.sphere.visible = false;

    const { x, y, z } = point.sphere.position;

    controls.target.set(x, y, z);
    controls.minDistance = 0.01;
    controls.maxDistance = 0.01;
  }
}

function animate() {
  requestAnimationFrame(animate);

  controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true

  render();
}

function render() {
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(navPoints.map(m => m.sphere));

  for (const intersect of intersects) {
    const point = intersect.object.userData as NavPoint;

    point.setScale(1.6);
  }

  for (const p of navPoints) p.update();

  renderer.render(scene, camera);

  console.log(camera.position.x.toFixed(1), camera.position.y.toFixed(1), camera.position.z.toFixed(1));
}

init();
animate();