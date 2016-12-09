/*
Sensors.
*/

function node(radius, xStartPos) {
    this.radius = radius;
    this.x = xStartPos;
}

var resetSimulation = function() {
  console.log("reset");
  document.getElementById("unit_interval").value = 0;
  document.getElementById("radius").value = 0;
  document.getElementById("num_of_sensors").value = 0;
    // clear the graphic
}

var runSimulation = function() {
  console.log("run simulation");
  var unitInterval = document.getElementById("unit_interval").value;
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
