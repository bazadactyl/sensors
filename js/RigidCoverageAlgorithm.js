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
    this.placeFirstNode(nodeList[0], view);
    this.coverageIteration(nodeList, view, 1);
  },

  coverageIteration : function(nodeList, view, currentNodeIndex) {
    var previousNode = nodeList[currentNodeIndex - 1];
    var currentNode = nodeList[currentNodeIndex];
    var endOfUnitInterval = 1;

    // Case: the previous node covers to the end of the unit interval
    if (previousNode.rightBoundary() >= endOfUnitInterval) {
      view.movement.innerHTML = parseFloat(view.movement.innerHTML) + (1 - currentNode.x);
      // We stack remaining nodes at the end of the unit interval
      currentNode.x = endOfUnitInterval;
    } else {
      var newPosition = previousNode.rightBoundary() + currentNode.radius;
      view.movement.innerHTML = parseFloat(view.movement.innerHTML) + Math.abs(newPosition - currentNode.x);
      // Move node to edge of the previous node's sensor
      currentNode.x = newPosition;
    }
    // Update graph
    //view.update(nodeList);

    currentNodeIndex += 1;

    if (currentNodeIndex < nodeList.length) {
      setTimeout(function(view) {
        rigidCoverageAlgorithm.coverageIteration(nodeList, view, currentNodeIndex);
      }(view), view.delay);
    }
  },

  /**
   * Places the first node at radius distance away from
   * the start of the unit interval.
   *
   * @param  {NodeObject} node The first node in the unit interval.
   * @return {Void}
   */
  placeFirstNode : function(node, view) {
    view.movement.innerHTML = parseFloat(view.movement.innerHTML) + Math.abs(node.radius - node.x);
    node.x = node.radius;
  }
}
