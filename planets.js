import * as THREE from 'three'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
class CameraGUIHelper {
    constructor(camera) {
        this.camera = camera;
    }
    set fov(fov) {
        this.camera.fov = fov;
        this.camera.updateProjectionMatrix();
    }
    get fov() {
        return this.camera.fov;
    }
    set near(near) {
        this.camera.near = near;
        this.camera.updateProjectionMatrix();
    }
    get near() {
        return this.camera.near;
    }
    set far(far) {
        this.camera.far = far;
        this.camera.updateProjectionMatrix();
    }
    get far() {
        return this.camera.far;
    }

    set positionX(x) {
        this.camera.position.x = x;
    }
    get positionX() {
        return this.camera.position.x;
    }
    set positionY(y) {
        this.camera.position.y = y;
    }
    get positionY() {
        return this.camera.position.y;
    }
    set positionZ(z) {
        this.camera.position.z = z;
    }
    get positionZ() {
        return this.camera.position.z;
    }

    set rotationX(x) {
        this.camera.rotation.x = x;
    }
    get rotationX() {
        return this.camera.rotation.x;
    }

    set rotationY(y) {
        this.camera.rotation.y = y;
    }
    get rotationY() {
        return this.camera.rotation.y;
    }

    set rotationZ(z) {
        this.camera.rotation.z = z;
    }
    get rotationZ() {
        return this.camera.rotation.z;
    }


}




function main() {
        
    const canvas = document.querySelector( '#c' );
    const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

    const fov = 70;
    const aspect = 2; 
    const near = 0.1;
    const far = 50;
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
    const scene = new THREE.Scene();

    const color = 0xffffff;
    const intensity = 3;
    // add ambient light
    const light = new THREE.AmbientLight(color, intensity);


    scene.add(light);
    scene.background = new THREE.Color(0x000000);



    
    function createPlanet(textureName, orbitRadius, rotationSpeed, planetSphereRadius) {
        const texture = new THREE.TextureLoader().load("/textures/"+textureName+".jpg");
        const geometry = new THREE.SphereGeometry(planetSphereRadius, 32, 32);
        const planet = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({map: texture}));
        // Check if textureName+"-bump.jpg" exists
        const bumpTexture = new THREE.TextureLoader().load("/textures/"+textureName+"-bump.jpg");
        if (bumpTexture) {
            planet.material.bumpMap = bumpTexture;
            planet.material.bumpScale = 1;
        }
        // Check if textureName+"-specular.jpg" exists
        const specularTexture = new THREE.TextureLoader().load("/textures/"+textureName+"-specular.jpg");
        if (specularTexture) {
            planet.material.specularMap = specularTexture;
            planet.material.specular = new THREE.Color(0x262626);
        }

        // Add clouds (if they exist), included with textureName+"-clouds.jpg" and textureName+"-clouds-alpha.jpg"
        const cloudTexture = new THREE.TextureLoader().load("/textures/"+textureName+"-clouds.jpg");
        const cloudAlphaTexture = new THREE.TextureLoader().load("/textures/"+textureName+"-clouds-alpha.jpg");
        if (cloudTexture && cloudAlphaTexture) {
            const cloudGeometry = new THREE.SphereGeometry(planetSphereRadius+0.01, 32, 32);
            const cloudMaterial = new THREE.MeshPhongMaterial({
                map: cloudTexture,
                transparent: true,
                opacity: 0.8,
                alphaMap: cloudAlphaTexture
            });
            const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
            planet.add(clouds);
        }

        scene.add(planet);
        return {
            'planet': planet,
            'rotationSpeed': rotationSpeed,
            'orbit' : {
                'radius': orbitRadius,
                'angle': 0,
                'speed': 0.01
            }
        }
    }

    const planets = [
        createPlanet("sun", 0, 0.01, 1),
        createPlanet("earth", 3, 0.1, 0.5),
        createPlanet("mars", 5, 0.05, 0.3),
    ]

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
        time *= 0.01;  // convert time to seconds
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        planets.forEach((planetInfo, ndx) => {
            planetInfo.planet.rotation.y = time * planetInfo.rotationSpeed;
            planetInfo.orbit.angle = planetInfo.orbit.speed * time;
            planetInfo.planet.position.x = planetInfo.orbit.radius * Math.cos(planetInfo.orbit.angle);
            planetInfo.planet.position.z = planetInfo.orbit.radius * Math.sin(planetInfo.orbit.angle);

            
        });
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}


main();