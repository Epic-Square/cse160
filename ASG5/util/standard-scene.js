import { initScene } from '../bootstrap/bootstrap.js'
import { intializeRendererControls } from '../controls/renderer-control.js';

import { GUI } from 'lil-gui'; 
import { initializeSceneControls } from '../controls/scene-controls.js'
import * as THREE from 'three'
import { floatingFloor } from '../bootstrap/floor.js'
//import { visitChildren } from '../util/modelUtil'

let clouds = [];
let numClouds = 25;

export const bootstrapMeshScene = async ({
  loadMesh,
  provideGui,
  hidefloor,
  floorSize,
  backgroundColor,
  onRender,
  disableLights,
  fogEnabled,
  hasClouds
}) => {
  const props = {
    backgroundColor: backgroundColor ?? 0xffffff,
    disableLights: disableLights ?? false,
    fogEnabled: fogEnabled ?? false,
    hasClouds: hasClouds ?? false
  }

  const mesh = await loadMesh()

  const gui = new GUI()

  const init = async () => {
    initScene(props)(({ scene, camera, renderer, orbitControls }) => {
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      camera.position.x = -3
      camera.position.z = 8
      camera.position.y = 2
      orbitControls.update()

      function animate() {
        requestAnimationFrame(animate)
        renderer.render(scene, camera)

        if(hasClouds) {
          for(var i = 0; i < numClouds; i++) {
            clouds[i].position.x = (clouds[i].position.x + 0.01);
            if(clouds[i].position.x > 10) {
              clouds[i].position.x -= 20;
            }
          }
        }
        orbitControls.update()
        if (onRender) onRender()
      }

      if (!disableLights) {
        const directionalLight = new THREE.DirectionalLight();
        directionalLight.position.set(-5, 10, 0);
        directionalLight.intensity = 5;
        scene.add(directionalLight)

        const ambientLight = new THREE.AmbientLight(0x606060); // soft white light
        ambientLight.position.set(0, 10, 0);
        scene.add(ambientLight);

        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x080820, 1);
        hemisphereLight.position.set(0, 10, 0);
        scene.add(hemisphereLight);
      }

      // Add extra stuff
      if(hasClouds) {
        
          const createCloud = (x, y, z) => {
            const cloudMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.8
            });

            const cloudGroup = new THREE.Group();
        
            const cloud1 = new THREE.Mesh(new THREE.BoxGeometry(2, .75, 1.5), cloudMaterial);
            const cloud2 = new THREE.Mesh(new THREE.BoxGeometry(1, 0.5, 1), cloudMaterial);
            const cloud3 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.25, .5), cloudMaterial);
            
            const height = -6;
            const xOff = x;
            const yOff = y;
            const zOff = z;

            cloud1.position.set(0, height, 0);
            cloud2.position.set(-.25, height - 0.25, -0.75);
            cloud3.position.set(.6, height - 0.15, .85);
        
            cloudGroup.add(cloud1);
            cloudGroup.add(cloud2);
            cloudGroup.add(cloud3);
        
            cloudGroup.position.set(xOff, 10 + yOff, 0 + zOff);
        
            return cloudGroup;
          }
          
          for(var i = 0; i < numClouds; i++) {
            var rx = Math.random() * 40 - 20;
            var ry = Math.random() * 1 - 0.5;
            var rz = Math.random() * 10 - 5;
            clouds.push(createCloud(rx, ry, rz));
            scene.add(clouds[i]);
          }
      }

      animate()
      hidefloor ?? floatingFloor(scene, floorSize ?? 8)

      if (mesh) scene.add(mesh)

      intializeRendererControls(gui, renderer)
      initializeSceneControls(gui, scene, fogEnabled)

      if (provideGui) provideGui(gui, mesh, scene)
    })
  }

  init().then()
}
