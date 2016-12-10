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
   * @return {Void}
   */
  execute : (nodeList) => {
    // Sort nodes in ascending order
    nodeList.sort(function(a,b){
      return a.x - b.x;
    });

    doCoverage(nodeList);
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
   * @return {Void}
   */
  doCoverage : (nodeList) => {
    var endOfUnitInterval = 1;
    placeFirstNode(nodeList[0]);

    // Walk left to right for each sensor
    for (var currentNode = 1; currentNode < nodeList.length; currentNode++) {
      var previousNode = currentNode - 1;

      // Case: the previous node covers to the end of the unit interval
      if (previousNode.rightBoundary() >= endOfUnitInterval) {
        // We stack remaining nodes at the end of the unit interval
        currentNode.x = endOfUnitInterval;
      } else {
        // Move node to edge of the previous node's sensor
        currentNode.x = previousNode.rightBoundary() + currentNode.radius;
      }
    }
  }

  /**
   * Places the first node at radius distance away from
   * the start of the unit interval.
   *
   * @param  {NodeObject} node The first node in the unit interval.
   * @return {Void}
   */
  placeFirstNode : (node) => {
    node.x = node.radius;
  }
}
