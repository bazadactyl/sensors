/*
Sensors.
*/

// Create a new sensor node for use in the simulation
function createNode(radius, xStartPos) {
    var newNode = Object.create(nodeObject);
    newNode.radius = radius;
    newNode.x = xStartPos;
    newNode.y = 0;

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
    // clear the graphic
}

var runSimulation = function() {
  console.log("run simulation");
  var radius = document.getElementById("radius").value;
  var numberOfSensors = document.getElementById("num_of_sensors").value;
  console.log(radius + " " + numberOfSensors);
  var nodes = [];
  var view = {
      movement: document.getElementById("count"),
      delay: 1000,
      update: function(){}
    };

  for (i = 0; i < numberOfSensors; i++) {
    var randomStartPosition = Math.random();
    nodes.push(createNode(radius, randomStartPosition));
  }

  runAlgorithm(nodes, view);
}


var runAlgorithm = function(nodes, view) {
  // render graphic
  // start the algo

  var algorithm = selectAlgorithm();

  algorithm.execute(nodes, view);

}
