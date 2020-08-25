import * as THREE from 'three/src/Three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 0, 0);

    // controls

    controls = new OrbitControls(camera, renderer.domElement);

    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.07;

    controls.autoRotate = false;

    controls.screenSpacePanning = false;

    controls.minDistance = 0.01;
    controls.maxDistance = 0.01;

    controls.enableZoom = false;

    controls.maxPolarAngle = Math.PI;

    controls.target.set(0, 200, 0);

    // helpers

    const GRID_SIZE = 300;
    type UNIT = -1 | 0 | 1;
    function addGrid(x: UNIT, y: UNIT, z: UNIT, plane: 'x' | 'y' | 'z') {
        let color: string;

        switch (plane) {
            case 'x': color = '#800'; break;
            case 'y': color = '#080'; break;
            case 'z': color = '#008'; break;
        }

        const grid = new THREE.GridHelper(GRID_SIZE, 16, color, '#666');

        switch (plane) {
            case 'x': grid.rotateZ(Math.PI / 2); break;
            case 'y': grid.rotateY(Math.PI / 2); break;
            case 'z': grid.rotateX(Math.PI / 2); break;
        }

        grid.position.set(x * GRID_SIZE / 2, y * GRID_SIZE / 2, z * GRID_SIZE / 2);

        scene.add(grid);
    }

    addGrid(1, 0, 0, 'x');
    addGrid(-1, 0, 0, 'x');
    addGrid(0, 1, 0, 'y');
    addGrid(0, -1, 0, 'y');
    addGrid(0, 0, 1, 'z');
    addGrid(0, 0, -1, 'z');

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

    function setPoint(x: number, y: number, z: number, color: string) {
        const geo = new THREE.SphereBufferGeometry(5, 18, 12);
        const mat = new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness: 1, metalness: 0 });
        const sph = new THREE.Mesh(geo, mat);

        sph.position.set(x, y, z);

        scene.add(sph);
    }

    function setVector(v: THREE.Vector3, color: string) {
        setPoint(v.x, v.y, v.z, color);
    }

    const v1 = new THREE.Vector3(100, 0, 0);
    const v2 = new THREE.Vector3(0, 100, 0);

    setVector(v1.clone().add(v2), '#ff0');
    setVector(v2, "#0f0");
    setVector(v1, "#f00");
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