/**
 * RigidCoverageAlgorithm
 * ----------------------
 *
 * Scan sensors left-to-right and a) covering gaps (by moving sensors
 * left or right as needed), and b) removing overlaps by shifting
 * sensors to the right.
 *
 * @type {Object}
 * @author Chris Ermel
 */
var rigidCoverageAlgorithm = {

  /**
   * Executes the rigidCoverageAlgorithm on the input nodeList.
   *
   * @param  {[NodeObject]} nodeList The list of nodes.
   * @param  {Object}       view The D3 graph object
   * @return {Void}
   */
  execute : function(nodeList, view) {
    // Sort nodes in ascending order
    nodeList.sort(function(a,b){
      return a.x - b.x;
    });

    this.doCoverage(nodeList, view);
  },

  /**
   * Performs the rigid coverage placement on the
   * input node list.
   *
   * Scans sensors from left to right, placing them
   * at max proximity from each other. Remaining sensors
   * are stacked at the right side of the unit interval.
   *
   * @param  {[NodeObject]} nodeList The list of nodes.
   * @param  {Object}       view The D3 graph object
   * @return {Void}
   */
  doCoverage : function (nodeList, view) {
    if (nodeList.length > 0) {
      // Only set timeout for the sensorbar animation
      if (!view.isSimulation) {
        view.update(nodeList);
        setTimeout(function() {
          rigidCoverageAlgorithm.coverageIteration(nodeList, view, 0);
        }, view.delay);
      } else {
        this.coverageIteration(nodeList, view, 0);
      }
    }
  },

  /**
   * A single iteration of the Rigid Coverage algorithm.
   * Places nodes at the maximum sensor proximity of the
   * previous node. If the entire unit interval is already
   * covered, places the rest of the nodes at the end of the
   * unit interval to minimize sensor overlap.
   *
   * @param  {[Object]} nodeList          The list of NodeObjects.
   * @param  {Object}   view              The view object containing the graph.
   * @param  {Integer}  currentNodeIndex  The current iteration of the recursion.
   * @return {Void}
   */
  coverageIteration : function(nodeList, view, currentNodeIndex) {
    var previousNode = nodeList[currentNodeIndex - 1];
    var currentNode = nodeList[currentNodeIndex];
    var endOfUnitInterval = 1;
    var movement;

    if (currentNodeIndex === 0) {
      // Sets the position of the first sensor
      var node = nodeList[0];
      movement = Math.abs(node.radius - node.x);
      view.movement.innerHTML = parseFloat(view.movement.innerHTML) + movement;
      node.x = node.radius;
    } else {
      // Case: the previous node covers to the end of the unit interval
      if (previousNode.rightBoundary() >= endOfUnitInterval) {
        movement = (1 - currentNode.x);
        view.movement.innerHTML = parseFloat(view.movement.innerHTML) + movement;
        // We stack remaining nodes at the end of the unit interval
        currentNode.x = endOfUnitInterval;
      } else {
        var newPosition = previousNode.rightBoundary() + currentNode.radius;

        // Case: This sensor will finish covering the interval, so place at end
        if (newPosition > endOfUnitInterval) { newPosition = endOfUnitInterval;}

        movement = Math.abs(newPosition - currentNode.x);
        view.movement.innerHTML = parseFloat(view.movement.innerHTML) + movement;

        // Move node to edge of the previous node's sensor
        currentNode.x = newPosition;
      }
    }
    // Update graph only if not a simulation
    if (!view.isSimulation) {
      rigidCoverageAlgorithm.updateLog(view, movement, nodeList, currentNodeIndex);
      view.update(nodeList);
    }

    currentNodeIndex += 1;

    if (currentNodeIndex < nodeList.length) {
      if (!view.isSimulation) {
        // Time the iteration if not a simulation
        setTimeout(function() {
          rigidCoverageAlgorithm.coverageIteration(nodeList, view, currentNodeIndex);
        }, view.delay);
      } else{
        // Execute next iteration right away
        this.coverageIteration(nodeList, view, currentNodeIndex);
      }
    }
  },

  /**
   * Adds a log entry to the UI
   *
   * @param  {Object} view     The view object
   * @param  {Float} movement The distance of a sensor to be logged
   * @param  {[Object]} nodes    The list of sensor nodes
   * @param  {Integer} pos      The array index of the sensor node we moved
   * @return {Void}
   */
  updateLog : function (view, movement, nodes, pos) {
    var originalTotal = parseFloat(view.movement.innerHTML);
    view.movement.innerHTML = originalTotal + movement;
    var logInfo = "\n Node Id: " + nodes[pos].id
    + "\n moved to position: " + nodes[pos].x + "\n"
    + "The node displaced a distance of " + movement + "\n"
    + "Total distance moved = " + (originalTotal + movement) + "\n";
    var entry = document.createElement('li');
    entry.appendChild(document.createTextNode(logInfo));
    view.log.appendChild(entry);
  }
}
