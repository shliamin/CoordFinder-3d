
init();
animate();

function init() {
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(55,window.innerWidth/window.innerHeight, .1, 500);
var renderer = new THREE.WebGLRenderer();
var controls = new THREE.OrbitControls( camera);
controls.addEventListener('change',render);

renderer.setClearColor(0x000000);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMapSoft = true;

var axis = new THREE.AxesHelper(30);
scene.add(axis);

var grid = new THREE.GridHelper(50, 500);
var color = new THREE.Color("rgb(255,0,0)");
// grid.setColors(color,0x000000);
// var colorfulGrid = new THREE.Mesh(grid, color);

scene.add(grid);


var cubeGeometry = new THREE.BoxGeometry(6,6,6);
var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff3300});
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

var planeGeometry = new THREE.PlaneGeometry(50,50,50);
var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);

plane.rotation.x = -.5*Math.PI;
plane.receiveShadow = true;

scene.add(plane);

cube.position.x = 0;
cube.position.y = 3;
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
  // document.getElementById('x-value').textContent = e.x;
  // document.getElementById('y-value').textContent = e.y;

  var vec = new THREE.Vector3();
  var pos = new THREE.Vector3();

  vec.set(
    (event.clientX/window.innerWidth)*2-1,
    - (event.clientY/window.innerHeight)*2+1,
    0);

  vec.unproject(camera);

  vec.sub(camera.position);

  var distance = camera.position.y/vec.y;

  pos.copy(camera.position).add(vec.multiplyScalar(distance));

  // console.log(vec.x);

  // document.getElementById('x-cam-to-cursor').textContent = vec.x.toFixed(1);
  // document.getElementById('y-cam-to-cursor').textContent = vec.y;
  // document.getElementById('z-cam-to-cursor').textContent = vec.z.toFixed(1);

  // document.getElementById('x-camera').textContent = camera.position.x.toFixed(1);
  // document.getElementById('y-camera').textContent = camera.position.y;
  // document.getElementById('z-camera').textContent = camera.position.z.toFixed(1);

  let objX = camera.position.x - vec.x;
  let objZ = camera.position.z - vec.z;
  document.getElementById('x-obj').textContent = objX.toFixed(1);
  // document.getElementById('y-obj').textContent = camera.position.y - vec.y;
  document.getElementById('z-obj').textContent = objZ.toFixed(1);






  });

  window.addEventListener('click', function(e){
  if (e.altKey){

  var vec1 = new THREE.Vector3();
  var pos1 = new THREE.Vector3();

  vec1.set(
    (event.clientX/window.innerWidth)*2-1,
    - (event.clientY/window.innerHeight)*2+1,
    0,5);

  vec1.unproject(camera);

  vec1.sub(camera.position);

  var distance1 = camera.position.y/vec1.y;

  pos1.copy(camera.position).add(vec1.multiplyScalar(distance1));

  let objX1 = camera.position.x - vec1.x;
  let objZ1 = camera.position.z - vec1.z;

  // var cubeGeometry1 = new THREE.BoxGeometry(0.1,0.1,0.1);
  // var cubeMaterial1 = new THREE.MeshLambertMaterial({color: 0xff3300});
  // var cube1 = new THREE.Mesh(cubeGeometry1, cubeMaterial1);

  const radius = 0.05;
  const widthSegments = 12;
  const heightSegments = 8;
  var sphereMaterial = new THREE.MeshLambertMaterial({color: 0xff3300});
  const sphereGeometry = new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments);
  var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

  var lineGeometry = new THREE.Geometry();


  sphere.position.x = objX1;
  sphere.position.y = 0.01;
  sphere.position.z = objZ1;

  if (!(coord === undefined || coord.length == 0)) {
  lineGeometry.vertices.push(new THREE.Vector3( objX1, 0.01, objZ1) );
  lineGeometry.vertices.push(new THREE.Vector3( coord[coord.length-1].X, 0.01, coord[coord.length-1].Z) );
  var line = new THREE.Line( lineGeometry, sphereMaterial );

  let length = Math.sqrt(Math.pow(coord[coord.length-1].X - objX1,2) + Math.pow(coord[coord.length-1].Z - objZ1,2));

  if (lengthArray === undefined || lengthArray.length == 0) {
    document.getElementById('line').textContent = length.toFixed(1);
  }
  else{
    function lengthArraySum(lengthArray){
      let sum = 0;
      for(let i =0; i < lengthArray.length; i++){
        sum += lengthArray[i];
      }
    return sum;
    }

    let wholeLine = lengthArraySum(lengthArray) + parseFloat(length.toFixed(1));
    document.getElementById('line').textContent = wholeLine.toFixed(1);
  // console.log(lengthArray);
  }

  lengthArray.push(parseFloat(length.toFixed(1)));

  scene.add( line );
  }

  scene.add(sphere);
  renderer.render(scene, camera);
  coord.push({X:objX1, Z:objZ1});
  }

  //coordinatesX.push(objX1);
  //coordinatesY.push(objZ1);
  // console.log(coord);

  });

  // let coordinatesX = [];
  // let coordinatesY = [];

  let coord = [];
  let lengthArray = [];

  // var material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
  // var geometry = new THREE.Geometry();
  // geometry.vertices.push(new THREE.Vector3( -10, 0, 0) );
  // geometry.vertices.push(new THREE.Vector3( 0, 10, 0) );
  // geometry.vertices.push(new THREE.Vector3( 10, 0, 0) );

  // var line = new THREE.Line( geometry, material );

  // scene.add( line );
  // renderer.render( scene, camera );

};
