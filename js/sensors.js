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

/**
 * Initializes a list of sensor nodes
 * placing them randomly in the [0, 1)
 * unit interval.
 *
 * @param  {Integer numberOfNodes The number of sensors to place
 * @param  {[Object]} nodes       The list of sensor nodes
 * @param  {Float} radius         The radius of the sensor nodes
 * @return {Void}
 */
function initializeNodeList(numberOfNodes, nodes, radius) {
  for (i = 0; i < numberOfNodes; i++) {
    var randomStartPosition = Math.random();
    nodes.push(createNode(radius, randomStartPosition, i));
  }
}

/**
 * Clears the data in the UI form fields, log output
 * and in the UI graphs
 */
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

/**
 * Runs the algorithm simulations over 20 trials
 * at various radius lengths.
 *
 * Radius lengths go from 0.01->1, incremented by
 * 0.01 at each iteration.
 *
 * Places the data in a graph on the UI.
 *
 * @return {Void}
 */
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

  // Create the graph if not done already
  if (trialGraph === undefined) {
    trialGraph = drawLineChart(radiusData);
  }
  view.update = trialGraph;

  // Begin running simulations
  setTimeout(function() {
    graphIteration(0.01, view, 0, radiusData, numberOfSensors);
  }, 0);
}

/**
 * An iteration of the graph simulation.
 * At each call, does 20 trials of an algorithm
 * run on a set of nodes with a particular sensor
 * radius. Averages the sum of distances travelled
 * by the number of trials, then places the data in
 * an array to be given as graph input data.
 *
 * @param  {Float}    currentRadius   The current sensor radius
 * @param  {Object}   view            The view object we are looking at
 * @param  {Integer}  currentLoop     The current recursive iteration
 * @param  {Array}    radiusData      The list of graph input data
 * @param  {Integer}  numberOfSensors The number of sensors in our simulation
 * @return {Void}
 */
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

/**
 * Runs the node sensor bar simulation.
 * Generates a number of sensors randomly placed
 * in the unit interval [0.1), and runs a certain
 * algorithm on them in order to fully cover the
 * unit interval by the range of the sensors.
 *
 * @return {Void}
 */
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

/**
 * Pulls the algorithm selection
 * from the radio buttons on the UI
 * and executes the selected algorithm.
 *
 * @param  {Array}  nodes  The array of nodes.
 * @param  {Object} view   The view object.
 * @return {Void}
 */
var runAlgorithm = function(nodes, view) {
  // render graphic
  // start the algo
  var algorithm = selectAlgorithm();

  algorithm.execute(nodes, view);
}

/**
 * Draws the sensor bar for use with the
 * sensor bar animation.
 *
 * @param  {Array}  nodes The list of nodes we are animating.
 * @return {Function}     A function that updates the node data.
 */
function drawSensorBar(nodes) {
    var updateSensorBar = createSensorBar({
        chartid: "sensor-bar",
        chartTitle: "Sensor Bar",
        yAxisLabel: "",
        colors: ["#389B34", "#381234", "#A41267"]
    });

    return updateSensorBar;
}

/**
 * Draws the graph for use with the sensor
 * trial simulation.
 *
 * @param  {Array}  radiusData The array of radius data.
 * @return {Function}          A function that updates the radius data.
 */
function drawLineChart(radiusData) {
    var updateLineChart = createLineChart({
        chartid: "line-chart",
        chartTitle: "Sensor Statistics Station",
        yAxisLabel: "Total Movement",
        colors: ["#389B34", "#381234", "#A41267"]
    });

    return updateLineChart;
}
