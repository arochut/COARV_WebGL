import * as THREE from 'three'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import {CameraGUIHelper} from './CameraGUIHelper.js';
import {PlanetInfoRetriever} from './PlanetInfoRetriever.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import { distanceToSun, rotateVec3 } from './helper.js';
import { randInt } from './helper.js';


import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';



function main() {
    
    
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
    };

    const canvas = document.querySelector( '#c' );
    const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // ##############################     SCENE
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // ##############################     CAMERA
    const fov = 70;
    const aspect = 2; 
    const near = 0.1;
    const far = 320000;
    const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.x = 0;
    camera.position.y = 12;
    camera.position.z = 0;
    camera.rotation.x = -Math.PI/2;
    camera.rotation.y = 0;
    camera.rotation.z = 0;
    const gui = new GUI();
    
    const cameraGUIHelper = new CameraGUIHelper(camera);
    gui.add(cameraGUIHelper, 'fov', 1, 180).name('fov').listen();
    gui.add(cameraGUIHelper, 'near', 0.1, 10, 0.1).name('near').listen();
    gui.add(cameraGUIHelper, 'far', 0.1, 50, 0.1).name('far').listen();
    gui.add(cameraGUIHelper, 'positionX', -10, 10).listen();
    gui.add(cameraGUIHelper, 'positionY', -10, 50).listen();
    gui.add(cameraGUIHelper, 'positionZ', -10, 10).listen();
    gui.add(cameraGUIHelper, 'rotationX', -Math.PI, Math.PI).name('rotationX').listen();
    gui.add(cameraGUIHelper, 'rotationY', -Math.PI, Math.PI).name('rotationY').listen();
    gui.add(cameraGUIHelper, 'rotationZ', -Math.PI, Math.PI).name('rotationZ').listen();
    
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;

    

    // ##############################     POST PROCESSING
    const postProcessing = new EffectComposer(renderer);

    const renderScene = new RenderPass( scene, camera );
    
    const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
    bloomPass.threshold = 0.5;
    bloomPass.strength = 0.5;
    bloomPass.radius = 0.4;

    const outputPass = new OutputPass();

    let composer = new EffectComposer( renderer );
    composer.addPass( renderScene );
    composer.addPass( bloomPass );
    composer.addPass( outputPass );

    
    // ##############################     PLANETS 
    const SCALE = 1e-6;
    const planetInfoRetriever = new PlanetInfoRetriever();
    const planets = [];
    // Based on the data retrieved from the API, we create a sphere for each planet
    // Position it according to the semimajor, perihelion, aphelion, eccentricity and inclination
    // Add it to the scene
    planetInfoRetriever.retrieveData().then(data => {
        data.forEach(planet => {
            const geometry = new THREE.SphereGeometry(planet.meanRadius*SCALE*500, 32, 32);

            const textures = planetInfoRetriever.loadTexturesForPlanet(planet.englishName);
            const material = new THREE.MeshBasicMaterial({map: textures.base});
            if (textures.bumpMap) {
                material.bumpMap = textures.bumpMap;
                material.bumpScale = 1;
            }
            if (textures.specularMap) {
                material.specularMap = textures.specularMap;
                material.specular = new THREE.Color(0x262626);
            }

            
            const sphere = new THREE.Mesh(geometry, material);
            const position = planetInfoRetriever.getOrbitalPosition(SCALE, planet.semimajorAxis, planet.eccentricity, planet.inclination, 0);
            const startingAngle = randInt(0, 360);
            const rotatedPosition = rotateVec3(startingAngle, position.x, position.y, position.z);
            sphere.position.x = rotatedPosition.x;
            sphere.position.y = rotatedPosition.y;
            sphere.position.z = rotatedPosition.z;
            scene.add(sphere);
            planets.push(sphere)
        });
    });

    // ##############################     SUN
    const sunGeometry = new THREE.SphereGeometry(696340*SCALE*10, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("/textures/sun.jpg"), emissive: 0xffff00, emissiveIntensity: 1});
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    // Make the sun transparent for light to pass through
    sun.material.transparent = true;
    scene.add(sun);


    /// LIGHTS 
      // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);

    // Point light
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 4096;
    pointLight.shadow.mapSize.height = 4096;
    pointLight.shadow.camera.near = 1.5;
    pointLight.shadow.camera.far = 30;
    pointLight.shadow.radius = 16;
    scene.add(pointLight);




    // ##############################     RENDER
    function resizeRendererToDisplaySize(renderer) {
        const pixelRatio = window.devicePixelRatio;
        const width  = Math.floor( canvas.clientWidth  * pixelRatio );
        const height = Math.floor( canvas.clientHeight * pixelRatio );
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function render(time) {
        time *= 0.001;
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        // Rotate the planets around the sun
        planets.forEach((planet, ndx) => {
            
            // The further the planet, the slower it rotates
            const planetDistance = distanceToSun(planet.position.x, planet.position.y, planet.position.z);
            const additionalAngle = 0.5 / planetDistance;

            const rotatedPosition = rotateVec3(additionalAngle, planet.position.x, planet.position.y, planet.position.z);
            planet.position.x = rotatedPosition.x;
            planet.position.y = rotatedPosition.y;
            planet.position.z = rotatedPosition.z;

        });
        // Rotate the sun
        sun.rotation.y = time * 0.1;
        controls.update();

        composer.render();
        requestAnimationFrame(render);
    }
    composer.render();
    requestAnimationFrame(render);
}


main();