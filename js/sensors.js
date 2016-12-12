/*
Sensors.
*/

var sensorBar;
var trialGraph;

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

function initializeNodeList(numberOfNodes, nodes, radius) {
  for (i = 0; i < numberOfNodes; i++) {
    var randomStartPosition = Math.random();
    nodes.push(createNode(radius, randomStartPosition, i));
  }
}

var resetSimulation = function() {
  console.log("reset");
  document.getElementById("radius").value = 0;
  document.getElementById("num_of_sensors").value = 0;
  document.getElementById("count").innerHTML = 0;
  document.getElementById("start_button").disabled = false;
  document.getElementById("log_list").innerHTML = "";

  // clear the graphics
  sensorBar([]);
  trialGraph([]);
}

var runGraphSimulation = function() {
  console.log("Running 20 trials at various radius's");
  var numberOfSensors = document.getElementById("num_of_sensors").value;
  var movementCounter = document.getElementById("count");
  var radiusData = [];
  var view = {
      movement: movementCounter,
      delay: 0,
      update: function(){},
      isSimulation: true
    };

  if (trialGraph === undefined) {
    trialGraph = drawLineChart(radiusData);
  }
  view.update = trialGraph;

  setTimeout(function() {
    graphIteration(0.01, view, 0, radiusData, numberOfSensors);
  }, 0);
}

function graphIteration(currentRadius, view, currentLoop, radiusData, numberOfSensors) {
  var maxRadius = 1;
  var trials = 20;
  var radiusIteration = 0.01;

  if (currentRadius <= maxRadius) {
      var radiusSample = { "radius": 0, "movement": 0}
      var totalDistance = 0;
      radiusSample.radius = currentRadius;

      // Execute each radius 20 times
      for (var i = 0; i < trials; i++) {
        var nodes = [];
        initializeNodeList(numberOfSensors, nodes, currentRadius);
        view.movement.innerHTML = 0;
        runAlgorithm(nodes, view);
        totalDistance += parseFloat(view.movement.innerHTML);
      }

      radiusSample.movement = totalDistance / trials;
      radiusData[currentLoop] = radiusSample;

      view.update(radiusData);
      currentLoop += 1;

      setTimeout(function() {
        graphIteration(currentRadius + radiusIteration, view, currentLoop,
          radiusData, numberOfSensors);
      }, 0);
  }
}

var runSimulation = function() {
  console.log("run simulation");
  var radius = parseFloat(document.getElementById("radius").value);
  var numberOfSensors = document.getElementById("num_of_sensors").value;
  document.getElementById("start_button").disabled = true;
  console.log(radius + " " + numberOfSensors);
  var nodes = [];
  var movementCounter = document.getElementById("count");
  var logList = document.getElementById("log_list");
  var view = {
      movement: movementCounter,
      delay: 1000,
      update: function(){},
      log: logList,
      isSimulation: false
    };

  initializeNodeList(numberOfSensors, nodes, radius);

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

function drawSensorBar(nodes) {
    var updateSensorBar = createSensorBar({
        chartid: "sensor-bar",
        chartTitle: "Sensor Bar",
        yAxisLabel: "",
        colors: ["#389B34", "#381234", "#A41267"]
    });

    return updateSensorBar;
}

function drawLineChart(radiusData) {
    var updateLineChart = createLineChart({
        chartid: "line-chart",
        chartTitle: "Sensor Statistics Station",
        yAxisLabel: "Total Movement",
        colors: ["#389B34", "#381234", "#A41267"]
    });

    return updateLineChart;
}
