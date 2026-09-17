---
name: threejs
description: >
  Comprehensive Three.js knowledge capability for 3D scene architecture, WebGL/WebGPU rendering,
  cameras, geometry, materials, lighting, textures, GLTF loading, animation mixers, and performance optimization.
---

# Three.js Mastery & Best Practices

Expert guidance for architecting, building, and optimizing modern 3D applications with Three.js.

## 1. Core Scene Architecture

### A. Minimal Initialization Pattern

```javascript
import * as THREE from 'three';

// 1. Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0f);

// 2. Camera
const camera = new THREE.PerspectiveCamera(
  60, // Field of view (FOV)
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1, // Near clipping plane
  1000 // Far clipping plane
);
camera.position.set(0, 2, 5);
camera.lookAt(0, 0, 0);

// 3. WebGLRenderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#webgl-canvas') || undefined,
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance',
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Color space & Tone mapping (Modern Three.js r150+)
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

// Enable shadow maps
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
```

### B. Responsive Resize Handling

```javascript
function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}
window.addEventListener('resize', onWindowResize);
```

---

## 2. Coordinate System & Math

Three.js uses a **right-handed coordinate system**:
- **+X** points right
- **+Y** points up
- **+Z** points towards the viewer (out of screen)

### Math Utilities

```javascript
// Vector3 operations
const v1 = new THREE.Vector3(1, 2, 3);
const v2 = new THREE.Vector3(0, 1, 0);
v1.add(v2);
v1.normalize();
const distance = v1.distanceTo(v2);

// Quaternion rotation (gimbal-lock free)
const quaternion = new THREE.Quaternion();
quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 4);
mesh.quaternion.copy(quaternion);

// Math helpers
const clamped = THREE.MathUtils.clamp(val, 0, 1);
const lerped = THREE.MathUtils.lerp(start, end, alpha);
const rad = THREE.MathUtils.degToRad(45);
```

---

## 3. Geometry, Materials & Lighting

### A. Geometries & Meshes

```javascript
// Standard BufferGeometries
const geometry = new THREE.BoxGeometry(1, 1, 1);
const sphereGeo = new THREE.SphereGeometry(0.5, 32, 32);

// Efficient InstancedMesh for thousands of duplicate objects
const count = 1000;
const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
const dummy = new THREE.Object3D();

for (let i = 0; i < count; i++) {
  dummy.position.set(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5);
  dummy.updateMatrix();
  instancedMesh.setMatrixAt(i, dummy.matrix);
}
instancedMesh.instanceMatrix.needsUpdate = true;
scene.add(instancedMesh);
```

### B. PBR Materials

```javascript
const material = new THREE.MeshStandardMaterial({
  color: 0xdfba73,
  metalness: 0.8,
  roughness: 0.2,
  envMapIntensity: 1.0,
});

// Advanced physical material (transmission, clearcoat, sheen)
const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  transmission: 0.9,
  opacity: 1,
  transparent: true,
  roughness: 0.1,
  ior: 1.5,
  thickness: 0.5,
});
```

### C. Lighting & Shadows

```javascript
// Ambient light for base illumination
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// Directional light with shadows
const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
dirLight.position.set(5, 10, 7);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.near = 0.5;
dirLight.shadow.camera.far = 25;
scene.add(dirLight);
```

---

## 4. Asset Loading & Animation

### A. GLTF Loading with LoadingManager

```javascript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const manager = new THREE.LoadingManager();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

const gltfLoader = new GLTFLoader(manager);
gltfLoader.setDRACOLoader(dracoLoader);

let mixer;

gltfLoader.load(
  '/models/hero-model.glb',
  (gltf) => {
    const model = gltf.scene;
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    scene.add(model);

    // Animation playback
    if (gltf.animations.length > 0) {
      mixer = new THREE.AnimationMixer(model);
      const action = mixer.clipAction(gltf.animations[0]);
      action.play();
    }
  },
  (progress) => console.log((progress.loaded / progress.total) * 100 + '% loaded'),
  (error) => console.error('Error loading GLTF:', error)
);
```

### B. Render Loop with Clock

```javascript
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);

  renderer.render(scene, camera);
}
animate();
```

---

## 5. Performance & Resource Cleanup

### Proper Disposal Pattern

Always dispose unused resources to prevent WebGL memory leaks:

```javascript
function cleanUpThreeScene(scene, renderer) {
  scene.traverse((object) => {
    if (object.isMesh) {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((mat) => disposeMaterial(mat));
        } else {
          disposeMaterial(object.material);
        }
      }
    }
  });

  renderer.dispose();
}

function disposeMaterial(mat) {
  mat.dispose();
  for (const key of Object.keys(mat)) {
    const value = mat[key];
    if (value && typeof value === 'object' && 'minFilter' in value) {
      value.dispose(); // Dispose textures (map, normalMap, roughnessMap)
    }
  }
}
```