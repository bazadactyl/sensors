var simpleCoverageAlgorithm = {

  algorithm: function(nodes) {

    var radius = nodes[0].radius;
    var diameter = radius * 2;
    // sort nodes
    nodes.sort(function(a,b){
      return a.x - b.x; 
    });

    // adjust the nodes left
    // ajust the first node
    if (nodes[0].x - radius > 0) {
      nodes[0].x = nodes[0].x - (nodes[0].x - radius) // allign it with 0
    }

    for (i = 1, i < nodes.length; i++) {
      if (nodes[i].x - nodes[i-1].x > diameter) {
        // shift it to optimally cover the gap the distance between the 2 nodes is = to the diameter
        nodes[i].x = nodes[i].x - ((nodes[i].x - nodes[i-1].x) - diameter);
      }  // else: we overlap or the radius or the gap is perfectly covered.

    }

    // check the right bound of the interval
    // if gap to the right bound, we need to shift everything right
    if (1 - nodes[nodes.length - 1].x > radius) {
      // shift the right most node
      nodes[nodes.length -1].x =  nodes[nodes.length -1].x + ((1 - nodes[nodes.length - 1].x) - radius);
      // check to make sure no other gaps formed
      for (j = nodes.length - 2; j >= 0; j--) {
        if (nodes[j+1].x - nodes[j].x > diameter) {
          // shift it to optimally cover the gap the distance between the 2 nodes is = to the diameter
          nodes[j].x = nodes[i].x + ((nodes[i].x - nodes[i-1].x) - diameter);
        } else {
          // as soon as there is no gap, we are good as the first pass covered everything
          break;
        }
      }
    } // else the area is covered.

  }


};
