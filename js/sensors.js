/*
Sensors.
*/
var startSimulation = function() {
  var form = document.getElementById("num_of_sensor_form");
  var num_of_sensors = form.elements[0].value;
  console.log("number of sensors: " + num_of_sensors);
  runSimulation(num_of_sensors);
}

var resetSimulation = function() {
  console.log("reset");
  // clear the graphic
}


var runSimulation = function() {
// Render the D3 nodes, and run the algo.

}
