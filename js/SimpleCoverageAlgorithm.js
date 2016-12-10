var simpleCoverageAlgorithm = {

  algorithm: function(nodes) {

    var radius = nodes[0].radius;
    var diameter = radius * 2;
    // sort nodes
    nodes.sort(function(a,b){
      return a.x-corr - b.x-corr; 
    });

    // adjust the nodes left
    // ajust the first node
    if (nodes[0].x-corr - radius > 0) {
      nodes[0].x-corr = nodes[0].x-corr - (nodes[0].x-corr - radius) // allign it with 0
    }

    for (i = 1, i < nodes.length; i++) {
      if (nodes[i].x-corr - nodes[i-1].x-corr > diameter) {
        // shift it to optimally cover the gap the distance between the 2 nodes is = to the diameter
        nodes[i].x-corr = nodes[i].x-corr - ((nodes[i].x-corr - nodes[i-1].x-corr) - diameter);
      }  // else: we overlap or the radius or the gap is perfectly covered.

    }

    // check the right bound of the interval
    // if gap to the right bound, we need to shift everything right
    if (1 - nodes[nodes.length - 1].x-corr > radius) {
      // shift the right most node
      nodes[nodes.length -1].x-corr =  nodes[nodes.length -1].x-corr + ((1 - nodes[nodes.length - 1].x-corr) - radius);
      // check to make sure no other gaps formed
      for (j = nodes.length - 2; j >= 0; j--) {
        if (nodes[j+1].x-corr - nodes[j].x-corr > diameter) {
          // shift it to optimally cover the gap the distance between the 2 nodes is = to the diameter
          nodes[j].x-corr = nodes[i].x-corr + ((nodes[i].x-corr - nodes[i-1].x-corr) - diameter);
        } else {
          // as soon as there is no gap, we are good as the first pass covered everything
          break;
        }
      }
    } // else the area is covered.

  }


};
