/**
 * ELEMENTEVERSE ENGINE FOR CARGO
 * Host this file on GitHub
 */

// 1. WAIT FOR LIBRARIES & DOM
document.addEventListener("DOMContentLoaded", () => {
    initThreeJS();
    initGSAP();
});

function initThreeJS() {
    // --- CONFIGURATION ---
    const config = {
        bg: 0x1c1c1e, // Silvery Grey / Gunmetal
        fogDensity: 0.02,
        camZ: 5
    };

    // --- SETUP ---
    const container = document.getElementById('webgl-target');
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(config.bg);
    scene.fog = new THREE.FogExp2(config.bg, config.fogDensity);

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = config.camZ;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // --- SEASONAL LIGHTING LOGIC ---
    const month = new Date().getMonth() + 1;
    let seasonColor = 0xffffff; // Default
    if (month >= 2 && month <= 4) seasonColor = 0x4a5d23; // Wood (Spring)
    else if (month >= 5 && month <= 6) seasonColor = 0xff4500; // Fire (Summer)
    else if (month >= 7 && month <= 8) seasonColor = 0x8b7e66; // Earth (Late Summer)
    else if (month >= 9 && month <= 10) seasonColor = 0xa0a0a0; // Metal (Autumn)
    else seasonColor = 0x1a3c5a; // Water (Winter)

    // --- LIGHTS ---
    const ambient = new THREE.AmbientLight(0x404040, 2); // Soft white
    scene.add(ambient);

    const spot = new THREE.SpotLight(0xffffff, 2);
    spot.position.set(10, 20, 10);
    spot.castShadow = true;
    scene.add(spot);

    // The Seasonal Accent Light
    const seasonLight = new THREE.PointLight(seasonColor, 3, 20);
    seasonLight.position.set(-5, -2, 5);
    scene.add(seasonLight);

    // --- OBJECT (THE TALISMAN) ---
    // Using a twisted Torus Knot for "Future Nomad" complexity
    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 16);
    
    // Tech-Zen Material: Brushed Metal/Glass
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xeeeeee,
        metalness: 0.9,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        transmission: 0, // Set to 0.2 if you want glass, 0 for metal
        flatShading: false
    });

    const talisman = new THREE.Mesh(geometry, material);
    scene.add(talisman);

    // Wireframe Overlay (Bauhaus Structure)
    const wireGeo = new THREE.WireframeGeometry(geometry);
    const wireMat = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.05, transparent: true });
    const wireframe = new THREE.LineSegments(wireGeo, wireMat);
    talisman.add(wireframe);

    // --- MOUSE INTERACTION ---
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) / 400;
        mouseY = (event.clientY - windowHalfY) / 400;
    });

    // --- ANIMATION LOOP ---
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        targetX = mouseX * 0.5;
        targetY = mouseY * 0.5;

        // Smooth "Lerp" Rotation (Tech-Zen Calmness)
        talisman.rotation.y += 0.05 * (targetX - talisman.rotation.y);
        talisman.rotation.x += 0.05 * (targetY - talisman.rotation.x);

        // Always slowly rotate
        talisman.rotation.z += 0.002;

        // Floating effect
        talisman.position.y = Math.sin(elapsedTime * 0.5) * 0.1;

        renderer.render(scene, camera);
    }
    animate();

    // --- RESIZE ---
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function initGSAP() {
    // Animate the text Elements
    gsap.from(".element-hero h1", {
        duration: 1.5,
        y: 100,
        opacity: 0,
        ease: "power3.out",
        delay: 0.5
    });

    gsap.from(".element-hero p", {
        duration: 1.5,
        y: 50,
        opacity: 0,
        ease: "power3.out",
        delay: 0.8
    });

    gsap.from(".cta-button", {
        duration: 1.5,
        scale: 0.8,
        opacity: 0,
        ease: "elastic.out(1, 0.5)",
        delay: 1.2
    });
    
    // Animate the HUD lines
    gsap.from(".hud-line", {
        scaleX: 0,
        transformOrigin: "left",
        duration: 2,
        ease: "expo.out",
        delay: 1
    });
}