

    // ##############################     PLANETS
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



    // In renderer
    planets.forEach((planetInfo, ndx) => {
        planetInfo.planet.rotation.y = time * planetInfo.rotationSpeed;
        planetInfo.orbit.angle = planetInfo.orbit.speed * time;
        planetInfo.planet.position.x = planetInfo.orbit.radius * Math.cos(planetInfo.orbit.angle);
        planetInfo.planet.position.z = planetInfo.orbit.radius * Math.sin(planetInfo.orbit.angle);

        
    });