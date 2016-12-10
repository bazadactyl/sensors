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

    doCoverage(nodeList, view);
  }

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
    this.placeFirstNode(nodeList[0]);
    this.coverageIteration(nodeList, view, 1);
  }

  coverageIteration : function(nodeList, view, currentNode) {
    var previousNode = nodeList[currentNode - 1];
    var endOfUnitInterval = 1;

    // Case: the previous node covers to the end of the unit interval
    if (previousNode.rightBoundary() >= endOfUnitInterval) {
      view.movement.value += (1 - currentNode.x);

      // We stack remaining nodes at the end of the unit interval
      currentNode.x = endOfUnitInterval;
    } else {
      var newPosition = previousNode.rightBoundary() + currentNode.radius;
      view.movement.value += Math.abs(newPosition - currentNode.x);

      // Move node to edge of the previous node's sensor
      currentNode.x = newPosition;
    }
    // Update graph
    view.update(nodeList);

    if (currentNode < nodeList.length) {
      setTimeout(function() {
        this.coverageIteration(nodeList, view, currentNode++);
      }, 1000);
    }
  }

  /**
   * Places the first node at radius distance away from
   * the start of the unit interval.
   *
   * @param  {NodeObject} node The first node in the unit interval.
   * @return {Void}
   */
  placeFirstNode : function(node) {
    node.x = node.radius;
  }
}
