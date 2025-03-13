import { bootstrapMeshScene } from './util/standard-scene'
import { VOXLoader } from 'three/examples/jsm/loaders/VOXLoader'
import { VOXMesh } from 'three/examples/jsm/loaders/VOXLoader'
import * as THREE from 'three'

// Add Light
//const color = new THREE.Color(0xffffff);
//const light = new THREE.DirectionalLight(color);
//scene.add(light);



const loadModel = () => {
  return new VOXLoader().loadAsync('/assets/models/vox/biome.vox').then((chunks) => {
    const group = new THREE.Group()
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i]
      const mesh = new VOXMesh(chunk)
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
    }

    group.scale.setScalar(0.1);
    return group;
  })
}

bootstrapMeshScene({
  loadMesh: loadModel,
  hidefloor: true,
  disableLights: false,
  fogEnabled: true,
  hasClouds: true
}).then()
