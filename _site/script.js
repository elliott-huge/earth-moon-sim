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

// Rings
function addRing(radius, innerRadiusFactor, color) {
    const ringGeometry = new THREE.RingGeometry(radius * innerRadiusFactor, radius, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });
    // ringMaterial.uniforms.transparent = true;
    // ringMaterial.uniforms.opacity.value = 0.3;
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);
}

const numberOfRings = 3;
const baseRadius = 5;
for (let i = 0; i < numberOfRings; i++) {
    addRing(baseRadius + i * 15, 0.9, 0x222277);
}

// Orbit Configuration
const orbitRadius = 30; // Moon's orbit radius
const daysPerOrbit = 27.3;
const orbitSpeed = (2 * Math.PI) / (daysPerOrbit * 24 * 60 * 60 * 1000); // radians per millisecond

// Starry Background with Twinkling Stars
function createTwinklingStars() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 0.1,
        transparent: true,
        opacity: 0.8
    });

    const starsCount = 10000;
    const positionArray = new Float32Array(starsCount * 3); // x, y, z for each star
    const opacityArray = new Float32Array(starsCount); // opacity for each star

    for (let i = 0; i < starsCount; i++) {
        positionArray[i * 3 + 0] = (Math.random() - 0.5) * 2000; // x
        positionArray[i * 3 + 1] = (Math.random() - 0.5) * 2000; // y
        positionArray[i * 3 + 2] = (Math.random() - 0.5) * 2000; // z
        opacityArray[i] = Math.random();
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
    starsGeometry.setAttribute('opacity', new THREE.BufferAttribute(opacityArray, 1));

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    return stars;
}

const twinklingStars = createTwinklingStars();


// Start Time
const startTime = Date.now();

// Camera pos
camera.position.set(0, 10, 60); // Position the camera further away

// Create a directional light (simulating sunlight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // White light
directionalLight.position.set(5, 3, 5); // Position the light source
scene.add(directionalLight);

// Orbit Speed Control
let speedMultiplier = 1;

// Set up event listeners for buttons
document.getElementById('speed1x').addEventListener('click', () => { speedMultiplier = 1; });
document.getElementById('speed10x').addEventListener('click', () => { speedMultiplier = 10; });
document.getElementById('speed100x').addEventListener('click', () => { speedMultiplier = 100; });
document.getElementById('speed1000x').addEventListener('click', () => { speedMultiplier = 1000; });
document.getElementById('speed10000x').addEventListener('click', () => { speedMultiplier = 10000; });


// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Twinkling effect
    const opacity = twinklingStars.geometry.attributes.opacity;
    for (let i = 0; i < opacity.count; i++) {
        opacity.array[i] = Math.random();
    }
    opacity.needsUpdate = true;

    // Calculate elapsed time since the start, then apply the speed multiplier
    const currentTime = Date.now();
    const elapsedTime = (currentTime - startTime) * speedMultiplier;

    // Update Moon Position based on the adjusted elapsed time
    const moonAngle = orbitSpeed * elapsedTime;
    moon.position.set(orbitRadius * Math.cos(moonAngle), 0, orbitRadius * Math.sin(moonAngle));

    // Update camera and controls (if using controls)
    controls.update();

    renderer.render(scene, camera);
}

animate();