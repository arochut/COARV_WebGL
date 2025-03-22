// Description: This file contains the PlanetInfoRetriever class which is responsible for retrieving planet information from the api.le-systeme-solaire.net API.

// A lot of functions are not used in the final version of the project, but they are kept here for reference, if we want to improve the project in the future.

import * as THREE from 'three';
export class PlanetInfoRetriever {
    // Polls api.le-systeme-solaire.net to get planet information

    // Constructor
    constructor() {
        // console.log('PlanetInfoRetriever constructor');
    }

    async retrieveData() {
        const url = 'https://api.le-systeme-solaire.net/rest/bodies';
        const params = {
            'data' : 'id,name,englishName,meanRadius,aroundPlanet, semimajorAxis, eccentricity, inclination',
            'filter[]' : 'isPlanet,neq,false',
            'order' : 'semimajorAxis,asc'
        };
        const queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
        const request = new Request(url + '?' + queryString, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        return fetch(request).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network response was not ok.');
        }).then(json => {
            return json.bodies;
        }).catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    }

    getOrbitalPosition(scale, semiMajor, eccentricity, inclination, trueAnomaly) {
        // Convert degrees to radians
        function toRadians(deg) {
            return deg * (Math.PI / 180);
        }
    
        // Calculate semi-minor axis
        let semiMinor = semiMajor * Math.sqrt(1 - eccentricity ** 2);
    
        // Compute the radius vector (distance from the sun)
        let r = (semiMajor * (1 - eccentricity ** 2)) / (1 + eccentricity * Math.cos(toRadians(trueAnomaly)));
    
        // Convert inclination to radians
        let i = toRadians(inclination);
    
        // Compute position in orbital plane
        let xOrbital = r * Math.cos(toRadians(trueAnomaly));
        let yOrbital = r * Math.sin(toRadians(trueAnomaly));
    
        // Convert to 3D space (with scaling)
        let x = xOrbital * Math.cos(i) * scale;
        let y = yOrbital * scale;
        let z = xOrbital * Math.sin(i) * scale;

    
        return { x, y, z};
    }

    loadTexturesForPlanet(planetName) {
        // Search the textures for the planet in the textures folder
        // Return a dictionnary with : bump, specular, and base textures (bump and specular can be null)
        const texture = new THREE.TextureLoader().load("/textures/"+planetName+".jpg");
        let bumpTexture = null;
        let specularTexture = null;
        try {

            const bumpTexture = new THREE.TextureLoader().load("/textures/"+planetName+"-bump.jpg");
        } catch (e) {
            console.log('No bump texture for planet ' + planetName);
        }
        try {
            const specularTexture = new THREE.TextureLoader().load("/textures/"+planetName+"-specular.jpg");
        } catch (e) {
            console.log('No specular texture for planet ' + planetName);
        }
        return {
            'base': texture,
            'bump': bumpTexture,
            'specular': specularTexture
        }
    }
}