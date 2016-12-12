var simpleCoverageAlgorithm = {
  execute: function(nodes, view) {
    // sort nodes
    nodes.sort(function(a,b){
      return a.x - b.x;
    });

    if(!view.isSimulation) {
      view.update(nodes);
    } else {
      simpleCoverageAlgorithm.updateMovements(view, 0);
    }

    // starts the process
  if (!view.isSimulation) {
    setTimeout(function() {
      simpleCoverageAlgorithm.checkLeft(nodes, view);
    }, view.delay);
  } else {
    simpleCoverageAlgorithm.checkLeft(nodes, view);
  }


  },
  moveRight: function(nodes, p, view) {
    var diameter = 2 * nodes[p].radius;
    if (nodes[p].x - nodes[p-1].x > diameter) {
      // shift it to optimally cover the gap the distance between the 2 nodes is = to the diameter
      var movement = ((nodes[p].x - nodes[p-1].x) - diameter);
      nodes[p].x = nodes[p].x - movement;
      if (! view.isSimulation) {
        simpleCoverageAlgorithm.update(view, movement, nodes, p);
      } else {
        simpleCoverageAlgorithm.updateMovements(view, movement);
      }
    }  // else: we overlap or the radius or the gap is perfectly covered.

    if (p < nodes.length - 1) {

      if (!view.isSimulation && movement){
        setTimeout(function() {
          simpleCoverageAlgorithm.moveRight(nodes, p+1, view);
        }, view.delay);
      } else {
        simpleCoverageAlgorithm.moveRight(nodes, p+1, view);
      }
    } else {
      simpleCoverageAlgorithm.checkRight(nodes, view);
    }
  },
  moveLeft: function (nodes, p, view) {
    var diameter = 2 * nodes[p].radius;
    if (nodes[p+1].x - nodes[p].x  > diameter) {
      // shift it to optimally cover the gap the distance between the 2 nodes is = to the diameter
      var movement = ((nodes[p+1].x - nodes[p].x)- diameter);
      nodes[p].x = nodes[p].x + movement;
      if (!view.isSimulation) {
        simpleCoverageAlgorithm.update(view, movement, nodes, p);
      } else {
        simpleCoverageAlgorithm.updateMovements(view, movement);
      }
      if (p > 0) {
        if (!view.isSimulation && movement){
          setTimeout(function() {
            simpleCoverageAlgorithm.moveLeft(nodes, --p, view);
          }, view.delay);
        } else {
          simpleCoverageAlgorithm.moveLeft(nodes, --p, view);
        }
      }
      // as soon as there is no gap, we are good as the first pass covered everything
    }
  },
  checkRight: function(nodes, view){
    var radius = nodes[0].radius;
    if (1 - nodes[nodes.length - 1].x > radius) {
      // shift the right most node
      var movement = ((1 - nodes[nodes.length - 1].x) - radius);
      nodes[nodes.length -1].x =  nodes[nodes.length -1].x + movement;
      if (!view.isSimulation) {
        simpleCoverageAlgorithm.update(view, movement, nodes, nodes.length - 1);
      } else {
        simpleCoverageAlgorithm.updateMovements(view, movement);
      }
      if (!view.isSimulation && movement) {
        setTimeout(function() {
          simpleCoverageAlgorithm.moveLeft(nodes, nodes.length - 2, view);
        }, view.delay);
      } else {
        simpleCoverageAlgorithm.moveLeft(nodes, nodes.length - 2, view);
      }
    } // we only move left if the need to shift to cover the right bound
  },
  checkLeft: function(nodes, view){
    var radius = nodes[0].radius;
    if (nodes[0].x - radius > 0) {
      var movement = (nodes[0].x - radius);
      nodes[0].x = nodes[0].x - movement; // allign it with 0
      if (!view.isSimulation || movement){
      simpleCoverageAlgorithm.update(view, movement, nodes, 0);
    } else {
      simpleCoverageAlgorithm.updateMovements(view, movement);
    }
      // update the view
    }
    if (!view.isSimulation && movement){
      setTimeout(function() {
        simpleCoverageAlgorithm.moveRight(nodes, 1, view);
      }, view.delay);
    } else {
        simpleCoverageAlgorithm.moveRight(nodes, 1, view);
    }

  },
  update: function(view, movement, nodes, pos) {
    var originalTotal = parseFloat(view.movement.innerHTML);
    simpleCoverageAlgorithm.updateMovements(view, movement);
    var logInfo = "\n Node Id: " + nodes[pos].id
    + "\n moved to position: " + nodes[pos].x + "\n"
    + "The node displaced a distance of " + movement + "\n"
    + "Total distance moved = " + (originalTotal + movement) + "\n";
    var entry = document.createElement('li');
    entry.appendChild(document.createTextNode(logInfo));
    view.log.appendChild(entry);
    view.update(nodes);
  },
  updateMovements: function(view, movement) {
    var originalTotal = parseFloat(view.movement.innerHTML);
    view.movement.innerHTML = originalTotal + movement;
  }
};
