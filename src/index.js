
init();
// animate();

function init() {
let scene = new THREE.Scene();
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
  let radius = 0.2;
  const widthSegments = 12;
  const heightSegments = 8;
  var sphereMaterial = new THREE.MeshLambertMaterial({color: 0xff3300});
  const sphereGeometry = new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments);
  let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  spheres_ids.push(sphere.id);

  var lineGeometry = new THREE.Geometry();


  sphere.position.x = objX1;
  sphere.position.y = 0.01;
  sphere.position.z = objZ1;

  if (!(coord === undefined || coord.length == 0)) {
  line_counter++;
  let type = 'line';
  this[type+'_id'] = line_counter;

  lineGeometry.vertices.push(new THREE.Vector3( objX1, 0.01, objZ1) );
  lineGeometry.vertices.push(new THREE.Vector3( coord[coord.length-1].X, 0.01, coord[coord.length-1].Z) );
  let line_id = new THREE.Line( lineGeometry, sphereMaterial );
  lines_ids.push(line_id.id);
  // console.log(lines_ids);
  // console.log(counter);
  let length = Math.sqrt(Math.pow(coord[coord.length-1].X - objX1,2) + Math.pow(coord[coord.length-1].Z - objZ1,2));

  // console.log(line_id);

  if (lengthArray === undefined || lengthArray.length == 0) {
    document.getElementById('line').innerHTML = `sum: <span id = "result_number">${length.toFixed(1)}</span>`;
  }
  else{
    // function lengthArraySum(lengthArray){
    //   let sum = 0;
    //   for(let i =0; i < lengthArray.length; i++){
    //     sum += lengthArray[i];
    //   }
    // return sum;
    // }

    let wholeLine = lengthArraySum(lengthArray) + parseFloat(length.toFixed(1));
    document.getElementById('line').innerHTML = `sum: ${wholeLine.toFixed(1)}`;
  // console.log(lengthArray);
  }

  lengthArray.push(parseFloat(length.toFixed(1)));

  scene.add( line_id );
  document.querySelector("#info-3").innerHTML += `<p id=${line_counter}>line ${line_counter}: <span id="color_line">${lengthArray[lengthArray.length-1]}</span></p>`;
  }

  // let sphereModified = sphere.scale.y = 20;
  scene.add(sphere);

  // scene.add(sphereModified);
  // console.log(sphereModified);
  renderer.render(scene, camera);
  coord.push({X:objX1, Z:objZ1});
  // console.log(coord);
  }
  else if(e.shiftKey){
    if(spheres_ids.length < 2){
    let selectedSphereOne = scene.getObjectById(spheres_ids[spheres_ids.length-1]);
    scene.remove(selectedSphereOne);
    coord.splice(-1,1);
    animate();
  }
  else {
  coord.splice(-1,1);
  lengthArray.splice(-1,1);
  let wholeLineR = lengthArraySum(lengthArray);
  document.getElementById('line').textContent = `sum: ${wholeLineR.toFixed(1)}`;

  // console.log(lines_ids);
  let selectedLine = scene.getObjectById(lines_ids[lines_ids.length-1]);
  let selectedSphere = scene.getObjectById(spheres_ids[spheres_ids.length-1]);
  // console.log(lines_ids.length-1);
  // console.log(lines_ids[lines_ids.length-1]);


  // console.log(selectedObject);
  scene.remove(selectedLine);
  scene.remove(selectedSphere);
  animate();

  lines_ids.pop();
  spheres_ids.pop();



  let elem = document.getElementById(`${line_counter}`);
  elem.remove();
  line_counter --;
}
}

  //coordinatesX.push(objX1);
  //coordinatesY.push(objZ1);
  // console.log(coord);

  });

  // let coordinatesX = [];
  // let coordinatesY = [];
  let spheres_ids = [];
  let lines_ids = [];
  let line_counter = 0;
  let coord = [];
  let lengthArray = [];
  function lengthArraySum(lengthArray){
      let sum = 0;
      for(let i =0; i < lengthArray.length; i++){
        sum += lengthArray[i];
      }
    return sum;
    }

  // var material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
  // var geometry = new THREE.Geometry();
  // geometry.vertices.push(new THREE.Vector3( -10, 0, 0) );
  // geometry.vertices.push(new THREE.Vector3( 0, 10, 0) );
  // geometry.vertices.push(new THREE.Vector3( 10, 0, 0) );

  // var line = new THREE.Line( geometry, material );

  // scene.add( line );
  // renderer.render( scene, camera );
};

