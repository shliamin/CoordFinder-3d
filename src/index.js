
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

cube.position.x = 2.5;
cube.position.y = 2.5;
cube.position.z = 2.5;
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

function animate(){
  requestAnimationFrame( animate);
  controls.update();
}

function render(){
  renderer.render(scene, camera);
}


// Find obj coordinates:
scene.updateMatrixWorld(true);
var position = new THREE.Vector3();
position.getPositionFromMatrix( cube.matrixWorld );
console.log(position.x + ',' + position.y + ',' + position.z);

};
