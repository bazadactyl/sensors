var simpleCoverageAlgorithm = {

  execute: function(nodes, view) {

    var radius = nodes[0].radius;
    var diameter = radius * 2;
    // sort nodes
    nodes.sort(function(a,b){
      return a.x - b.x;
    });
    // starts the process
    checkLeft(nodes, view);

  }, // else the area is covered.
  moveRight: function(nodes, p, view) {
    if (nodes[p].x - nodes[p-1].x > diameter) {
      // shift it to optimally cover the gap the distance between the 2 nodes is = to the diameter
      var movement = ((nodes[p].x - nodes[p-1].x) - diameter);
      nodes[p].x = nodes[p].x - movement;
      update(view, movement, nodes);
    }  // else: we overlap or the radius or the gap is perfectly covered.

    if (position < nodes.lenght) {
      setTimeout(function() {
        moveRight(nodes, p++, view);
      }, view.delay);
    } else {
      checkRight(nodes);
    }
  },
  moveLeft: function (nodes, p, view) {
    if (nodes[p+1].x - nodes[p].x > diameter) {
      // shift it to optimally cover the gap the distance between the 2 nodes is = to the diameter
      var movement = ((nodes[p].x - nodes[p-1].x) - diameter);
      nodes[p].x = nodes[p].x + movement;
      update(view, movement, nodes);

      if (p > 0) {
        setTimeout(function() {
          moveLeft(nodes, p--, view);
        }, view.delay);
      }
      // as soon as there is no gap, we are good as the first pass covered everything
  }
  },
  checkRight: function(nodes, view){
    if (1 - nodes[nodes.length - 1].x > radius) {
      // shift the right most node
      var movement = ((1 - nodes[nodes.length - 1].x) - radius);
      nodes[nodes.length -1].x =  nodes[nodes.length -1].x + movement;
      update(view, movement, nodes);

      setTimeout(function() {
        moveLeft(nodes, nodes.length - 2, view);
      }, view.delay);
    } // we only move left if the need to shift to cover the right bound
  },
  checkLeft: function(nodes, view){
    if (nodes[0].x - radius > 0) {
      var movement = (nodes[0].x - radius);
      nodes[0].x = nodes[0].x - movement; // allign it with 0
      update(view, movement, nodes);
      // update the view
    }
    setTimeout(function() {
      moveRight(nodes, 1, view);
    }, view.delay);

  },
  update: function(view, movement, nodes) {
    view.movement.value += movement;
    view.update(nodes);
  }

};
