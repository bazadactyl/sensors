/*
Sensors.
*/

// Create a new sensor node for use in the simulation
function createNode(radius, xStartPos) {
    var newNode = new Node();
    newNode.radius = radius;
    newNode.x = xStartPos;
    newNode.y = 0;

    return newNode;
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
  console.log(unitInterval +" " + radius + " " + numberOfSensors);
  var nodes = [];

  for (i = 0; i < numberOfSensors; i++) {
    var randomStartPosition = Math.random() * unitInterval;
    nodes[i] = new node(radius, randomStartPosition);
  }


  runAlgorithm(nodes, unitInterval);
}


var runAlgorithm = function(nodes, interval) {
  // render graphic
  //start the algo

}
