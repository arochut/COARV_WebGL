# COARV - WebGL Tutorial

*Anatole ROCHUT, Ruben CHRISTON - ECN - 2025* 

## Bilan du Tutoriel

### Lien du tutoriel

Le tutoriel est trouvable [ici](https://threejs.org/manual/#en/fundamentals)

### Réalisation

Nous avons décidé de réaliser plusieurs parties de la section Fundamentals :

- Primitives
- Cameras
- Textures
- Lights

### Bilan du tutoriel

Le tutoriel de Three.JS est très complet et bien expliqué.
Avec nos connaissances en JavaScript et en rendu 3D, nous avons rapidement compris et maitrisé les implémentations des différentes notions.

### Améliorations proposées

Nous pensons qu'il serait intéressant de rajouter dans le tutoriel d'installation une partie qui n'utilise pas de package manager (style npm) pour les personnes qui ne maitrisent pas ces outils.
Nous avons en effet utilisé un CDN pour include Three.JS dans notre projet sans passer par un serveur Node, ce qui peut être plus simple pour des débutants. 

Nous proposons de fournir un template de projet de base avec 2 fichiers:

- `index.html`
- `script.js`

Le fichier `index.html` contiendrait le code HTML de base pour inclure Three.JS, créer un canvas en plein écran et inclure le script `script.js`:

```html
<html>
    <head>
        <title>Three.js COARV</title>
        <script type="importmap">
        {
            "imports": {
                "three": "https://cdn.jsdelivr.net/npm/three@v0.149.0/build/three.module.js",
                "three/addons/": "https://cdn.jsdelivr.net/npm/three@v0.149.0/examples/jsm/"
            }
        }
    </script>
        <script src="script.js" type="module"></script>
    </html>
    <body>
        <canvas id="c"></canvas></div>
</body>
<style>
    html, body {
        margin: 0;
        height: 100%;
    }
    #c {
        width: 100%;
        height: 100%;
        display: block;
    }
</style>
</html>
```

et le fichier `script.js` contiendrait le code JavaScript de base qui inclue Three.JS et laisse ensuite la place à l'utilisateur pour écrire son code:

```javascript
import * as THREE from 'three/build/three.module.js';

// Insert your code here
```

### Extrapolation

Pour illustrer l'utilisation de Three.JS, nous avons décidé de réaliser un petit projet de système solaire en 3D. Nous avons utilisé une API pour obtenir les planetes (en cherchant aussi une API qui pourrait nous donner la position de chaque astre en temps réel, mais nous n'avons pas trouvé).
Nous avons donc créé un système solaire avec les planètes et le soleil, et nous avons ajouté des meshs et textures pour les planètes, en jouant avec les différents matériaux et lumières.

### Conclusion

En comparaison avec d'autres sujets de classe inversés de COARV, la partie WebGL est relativement simple et rapide à faire.
Nous pensons qu'il peut être intéressant de rajouter des parties plus avancées dans les requis, comme l'importation d'un mesh externe, ou de la VR.
