var Node = {
  radius: 0,
  x: 0,
  y: 0,

  leftBoundary: () => { return x - radius; },

  rightBoundary: () => { return x + radius; },

  isOverlapping: (otherNode) => {
    // Nodes overlap if their sensor boundaries overlap
    if (otherNode.leftBoundary() < this.rightBoundary()
        || otherNode.rightBoundary() > this.leftBoundary()) {
          return true;
    }

    return false;
  }
};
