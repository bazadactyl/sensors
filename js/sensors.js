/*
Sensors.
*/

var sensorBar;

// Create a new sensor node for use in the simulation
function createNode(radius, xStartPos, id) {
    var newNode = Object.create(nodeObject);
    newNode.radius = radius;
    newNode.x = xStartPos;
    newNode.y = 0;
    newNode.id = id;

    return newNode;
}

/**
 * Selects the algorithm to use from the
 * radio buttons in the UI.
 *
 * @return {Object} The algorithm object selected.
 */
function selectAlgorithm() {
  var algorithm;

  if (document.getElementById("rigid").checked) {
    algorithm = Object.create(rigidCoverageAlgorithm);
  } else if (document.getElementById("simple").checked) {
    algorithm = Object.create(simpleCoverageAlgorithm);
  }

  return algorithm;
}

var resetSimulation = function() {
  console.log("reset");
  document.getElementById("radius").value = 0;
  document.getElementById("num_of_sensors").value = 0;
  document.getElementById("count").innerHTML = 0;
  document.getElementById("start_button").disabled = false;
  // clear the graphic
  sensorBar([]);
}

var runSimulation = function() {
  console.log("run simulation");
  var radius = parseFloat(document.getElementById("radius").value);
  var numberOfSensors = document.getElementById("num_of_sensors").value;
  document.getElementById("start_button").disabled = true;
  console.log(radius + " " + numberOfSensors);
  var nodes = [];
  var movementCounter = document.getElementById("count");
  var view = {
      movement: movementCounter,
      delay: 1000
    };
  for (i = 0; i < numberOfSensors; i++) {
    var randomStartPosition = Math.random();
    nodes.push(createNode(radius, randomStartPosition, i));
  }
  if (sensorBar === undefined) {
    sensorBar = drawSensorBar(nodes);
  }
  view.update = sensorBar;

  runAlgorithm(nodes, view);
}


var runAlgorithm = function(nodes, view) {
  // render graphic
  // start the algo
  var algorithm = selectAlgorithm();

  algorithm.execute(nodes, view);
}

// SENSOR BAR DEMO CODE
function drawSensorBar(nodes) {
    var updateSensorBar = createSensorBar({
        chartid: "sensor-bar",
        chartTitle: "Sensor Bar",
        yAxisLabel: "",
        colors: ["#389B34", "#381234", "#A41267"]
    });

    return updateSensorBar;
}
