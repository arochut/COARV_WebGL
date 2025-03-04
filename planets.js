import * as THREE from 'three'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import {CameraGUIHelper} from './CameraGUIHelper.js';
import {PlanetInfoRetriever} from './PlanetInfoRetriever.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import { distanceToSun, rotateVec3 } from './helper.js';
import { randInt } from './helper.js';


function main() {
    
    
    const canvas = document.querySelector( '#c' );
    const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
    

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


    // ##############################     CAMERA
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    // ##############################     LIGHTING 
    const color = 0xffffff;
    const intensity = 3;
    const light = new THREE.AmbientLight(color, intensity);
    scene.add(light);
    
    
    // ##############################     PLANETS 
    const SCALE = 1e-6;
    const planetInfoRetriever = new PlanetInfoRetriever();
    const planets = [];
    // Based on the data retrieved from the API, create a sphere for each planet
    // Position it according to the semimajor, perihelion, aphelion, eccentricity and inclination
    // Add it to the scene
    planetInfoRetriever.retrieveData().then(data => {
        data.forEach(planet => {
            const geometry = new THREE.SphereGeometry(planet.meanRadius*SCALE*500, 32, 32);
            const material = new THREE.MeshPhongMaterial({color: 0xffffff});
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
    const sunMaterial = new THREE.MeshPhongMaterial({color: 0xffff00, emissive: 0xffff00});
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun); 




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

        
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}


main();