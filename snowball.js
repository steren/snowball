'use strict';

Physijs.scripts.worker = 'physijs/physijs_worker.js';
Physijs.scripts.ammo = 'examples/js/ammo.js';

var initScene, render, renderer, render_stats, physics_stats, scene, ground_material, ground, light, camera, ball;

initScene = function() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMapEnabled = true;
  renderer.shadowMapSoft = true;
  document.getElementById( 'viewport' ).appendChild( renderer.domElement );

  render_stats = new Stats();
  render_stats.domElement.style.position = 'absolute';
  render_stats.domElement.style.top = '0px';
  render_stats.domElement.style.zIndex = 100;
  document.getElementById( 'viewport' ).appendChild( render_stats.domElement );

  physics_stats = new Stats();
  physics_stats.domElement.style.position = 'absolute';
  physics_stats.domElement.style.top = '50px';
  physics_stats.domElement.style.zIndex = 100;
  document.getElementById( 'viewport' ).appendChild( physics_stats.domElement );

  scene = new Physijs.Scene;
  scene.setGravity(new THREE.Vector3( 0, -30, 0 ));
  scene.addEventListener(
    'update',
    function() {
      scene.simulate( undefined, 1 );
      physics_stats.update();
    }
  );

  camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set( 60, 50, 60 );
  scene.add( camera );

  // Light
  light = new THREE.DirectionalLight( 0xFFFFFF );
  light.position.set( 20, 40, -15 );
  light.target.position.copy( scene.position );
  light.castShadow = true;
  light.shadowCameraLeft = -60;
  light.shadowCameraTop = -60;
  light.shadowCameraRight = 60;
  light.shadowCameraBottom = 60;
  light.shadowCameraNear = 20;
  light.shadowCameraFar = 200;
  light.shadowBias = -.0001
  light.shadowMapWidth = light.shadowMapHeight = 2048;
  light.shadowDarkness = .7;
  scene.add( light );

  // Ground
  ground_material = Physijs.createMaterial(
    new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture( 'physijs/examples/images/rocks.jpg' ) }),
    .8, // high friction
    .3 // low restitution
  );
  ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
  ground_material.map.repeat.set( 3, 3 );

  ground = new Physijs.BoxMesh(
    new THREE.CubeGeometry(1000, 1, 1000),
    ground_material,
    0 // mass
  );

  ground.rotateZ( - Math.PI / 6);

  ground.receiveShadow = true;
  scene.add( ground );



  // BALL

  var ball_geometry = new THREE.SphereGeometry( 4 )
  var material;

  material = Physijs.createMaterial(
    new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture( 'physijs/examples/images/plywood.jpg' ) }),
    .6, // medium friction
    .3 // low restitution
  );
  material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
  material.map.repeat.set( .5, .5 );

  //material = new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture( 'images/rocks.jpg' ) });

  ball = new Physijs.SphereMesh(
    ball_geometry,
    material
  );
  ball.collisions = 0;

  ball.position.set( 20, 20, 20);

  ball.castShadow = true;
  scene.add( ball );




  requestAnimationFrame( render );
  scene.simulate();
};

var cameraDistance = 20;

render = function() {

  camera.position.set( ball.position.x - cameraDistance, camera.position.y, camera.position.z)

  camera.lookAt( ball.position );
  requestAnimationFrame( render );
  renderer.render( scene, camera );
  render_stats.update();
};

window.onload = initScene;
