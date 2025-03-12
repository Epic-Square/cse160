import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const width = window.innerWidth, height = window.innerHeight;

// init

const camera = new THREE.PerspectiveCamera( 90, width / height, 0.01, 10 );
camera.position.z = 2;

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshPhongMaterial({
    color: 0x00ff00,
    specular: 0x555555,
    shininess: 30,
    transparent: true
});

const ambientLight = new THREE.AmbientLight(0x00ff00);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 75, 100);
pointLight.position.set(2, 2, 2);
scene.add(pointLight);

const mesh = new THREE.Mesh( geometry, material );
scene.add( mesh );

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setSize( width, height );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;

const movement = {
    forward: false,
    backward: false,
    left: false,
    right: false
};

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'w':
            movement.forward = true;
            break;
        case 's':
            movement.backward = true;
            break;
        case 'a':
            movement.left = true;
            break;
        case 'd':
            movement.right = true;
            break;
    }
    
    //mesh.rotation.y = time / 1000;
});
document.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'w':
            movement.forward = false;
            break;
        case 's':
            movement.backward = false;
            break;
        case 'a':
            movement.left = false;
            break;
        case 'd':
            movement.right = false;
            break;
    }
});

// animation

function animate( time ) {

	//mesh.rotation.x = time / 2000;
	//mesh.rotation.y = time / 1000;

	renderer.render( scene, camera );

}

function update() {
    requestAnimationFrame(update);

    const speed = .005;
    if (movement.forward) {
        camera.translateZ(-speed);
    }
    if (movement.backward) {
        camera.translateZ(speed);
    }
    if (movement.left) {
        camera.translateX(-speed);
    }
    if (movement.right) {
        camera.translateX(speed);
    }

    controls.update();
    renderer.render(scene, camera);
}

update();