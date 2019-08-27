
init();
animate();

function init() {
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(55,window.innerWidth/window.innerHeight, .1, 500);
var renderer = new THREE.WebGLRenderer();
var controls = new THREE.OrbitControls( camera);
controls.addEventListener('change',render);

renderer.setClearColor(0xdddddd);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMapSoft = true;

var axis = new THREE.AxesHelper(10);
scene.add(axis);

var grid = new THREE.GridHelper(50, 15);
var color = new THREE.Color("rgb(255,0,0)");
// grid.setColors(color,0x000000);
// var colorfulGrid = new THREE.Mesh(grid, color);


scene.add(grid);


var cubeGeometry = new THREE.BoxGeometry(5,5,5);
var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff3300});
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

var planeGeometry = new THREE.PlaneGeometry(30,30,30);
var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);

plane.rotation.x = -.5*Math.PI;
plane.receiveShadow = true;

scene.add(plane);

cube.position.x = 0;
cube.position.y = 2.5;
cube.position.z = 0;
cube.castShadow = true;

scene.add(cube);

var spotLight = new THREE.SpotLight(0xffffff);
spotLight.castShadow = true;
spotLight.position.set (15,30,50);

scene.add(spotLight);

camera.position.x = 40;
camera.position.y = 40;
camera.position.z = 40;

camera.lookAt(scene.position);

let test = document.getElementById("webGL-container");
test.appendChild( renderer.domElement);


renderer.render(scene,camera);

// Camera control functions:
function animate(){
  requestAnimationFrame( animate);
  controls.update();
  renderer.render(scene, camera);
}

function render(){
  renderer.render(scene, camera);
}

// Find obj coordinates:
// scene.updateMatrixWorld(true);
// var position = new THREE.Vector3();
// position.setFromMatrixPosition( cube.matrixWorld );
// console.log(position.x + ',' + position.y + ',' + position.z);


window.addEventListener('mousemove', function(e){
  document.getElementById('x-value').textContent = e.x;
  document.getElementById('y-value').textContent = e.y;

  var vec = new THREE.Vector3();
  var pos = new THREE.Vector3();

  vec.set(
    (event.clientX/window.innerWidth)*2-1,
    - (event.clientY/window.innerHeight)*2+1,
    0,5);

  vec.unproject(camera);

  vec.sub(camera.position);

  var distance = camera.position.y/vec.y;

  pos.copy(camera.position).add(vec.multiplyScalar(distance));

  // console.log(vec.x);

  document.getElementById('x-cam-to-cursor').textContent = vec.x;
  // document.getElementById('y-cam-to-cursor').textContent = vec.y;
  document.getElementById('z-cam-to-cursor').textContent = vec.z;

  document.getElementById('x-camera').textContent = camera.position.x;
  // document.getElementById('y-camera').textContent = camera.position.y;
  document.getElementById('z-camera').textContent = camera.position.z;

  document.getElementById('x-obj').textContent = camera.position.x - vec.x;
  // document.getElementById('y-obj').textContent = camera.position.y - vec.y;
  document.getElementById('z-obj').textContent = camera.position.z - vec.z;

  });





};

