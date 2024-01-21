// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const controls = new THREE.OrbitControls(camera, renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Earth Sphere
const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
const earthMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// Moon Sphere
const moonGeometry = new THREE.SphereGeometry(0.27, 32, 32); // Moon is about 0.27 times the size of Earth
const moonMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
scene.add(moon);

// Orbit Configuration
const orbitRadius = 30; // Moon's orbit radius
const daysPerOrbit = 27.3;
const orbitSpeed = (2 * Math.PI) / (daysPerOrbit * 24 * 60 * 60 * 1000); // radians per millisecond

// Start Time
const startTime = Date.now();

// Camera pos
camera.position.set(0, 0, 100); // Position the camera further away

// Create a directional light (simulating sunlight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // White light
directionalLight.position.set(5, 3, 5); // Position the light source
scene.add(directionalLight);

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Calculate elapsed time
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;

    // Update Moon Position based on real time elapsed
    const moonAngle = orbitSpeed * elapsedTime;
    moon.position.set(orbitRadius * Math.cos(moonAngle), 0, orbitRadius * Math.sin(moonAngle));

    // Update camera and controls (if using controls)
    controls.update();

    renderer.render(scene, camera);
}

animate();