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
  var logList = document.getElementById("log_list");
  var view = {
      movement: movementCounter,
      delay: 1000,
      update: function(){},
      log: logList
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

function drawSensorBar(nodes) {
    var updateSensorBar = createSensorBar({
        chartid: "sensor-bar",
        chartTitle: "Sensor Bar",
        yAxisLabel: "",
        colors: ["#389B34", "#381234", "#A41267"]
    });

    return updateSensorBar;
}

function drawLineChart() {
    var updateLineChart = createLineChart({
        chartid: "line-chart",
        chartTitle: "Sensor Statistics Station",
        yAxisLabel: "Total Movement",
        colors: ["#389B34", "#381234", "#A41267"]
    });

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    async function demo() {
        // updateLineChart([
        //     {"radius": 0.01, "rigid-movement": 1000, "simple-movement": 1500},
        //     {"radius": 0.02, "rigid-movement": 600, "simple-movement": 800},
        //     {"radius": 0.03, "rigid-movement": 500, "simple-movement": 700},
        //     {"radius": 0.04, "rigid-movement": 300, "simple-movement": 450},
        //     {"radius": 0.05, "rigid-movement": 200, "simple-movement": 350},
        //     {"radius": 0.06, "rigid-movement": 100, "simple-movement": 250},
        //     {"radius": 0.07, "rigid-movement": 50, "simple-movement": 30},
        //     {"radius": 0.08, "rigid-movement": 10, "simple-movement": 5}
        // ]);
        updateLineChart([
            {"radius": 0.01, "movement": 1000},
            {"radius": 0.02, "movement": 600},
            {"radius": 0.03, "movement": 500},
            {"radius": 0.04, "movement": 300},
            {"radius": 0.05, "movement": 200},
            {"radius": 0.06, "movement": 100},
            {"radius": 0.07, "movement": 50},
            {"radius": 0.08, "movement": 10},
        ]);
        await sleep(1000);
        updateLineChart([
            {"radius": 0.01, "movement": 1200},
            {"radius": 0.02, "movement": 1000},
            {"radius": 0.03, "movement": 600},
            {"radius": 0.04, "movement": 200},
            {"radius": 0.05, "movement": 100},
        ]);
        await sleep(1000);
        updateLineChart([
            {"radius": 0.01, "movement": 1200},
            {"radius": 0.02, "movement": 1000},
            {"radius": 0.03, "movement": 600},
            {"radius": 0.04, "movement": 200},
            {"radius": 0.05, "movement": 100},
            {"radius": 0.06, "movement": 50},
            {"radius": 0.07, "movement": 30},
            {"radius": 0.08, "movement": 10}
        ]);
        await sleep(1000);
    }
    demo();
}
