var nodeObject = {
  id: 0,
  radius: 0,
  x: 0,
  y: 0,

  leftBoundary: function() { return this.x - this.radius; },

  rightBoundary: function() { return this.x + this.radius; },

  isOverlapping: function(otherNode) {
    // Nodes overlap if their sensor boundaries overlap
    if (otherNode.leftBoundary() < this.rightBoundary()
        || otherNode.rightBoundary() > this.leftBoundary()) {
          return true;
    }

    return false;
  }
};
