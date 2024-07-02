const MazeObject = require('./MazeObject.js');

// Class that generates a ball object (a ball with a position and velocity)
// - Simulates constant acceleration movement of the ball through them maze
class Ball extends MazeObject {
	constructor(x, y, radius) {
		super(x, y, radius);
		this.velocityX = 0;
		this.velocityY = 0;
	}

	applyForce(forceX, forceY) {
		// Null/NaN check for forceX and forceY
		if (isNaN(forceX) || isNaN(forceY)) {
			console.log('Invalid force values: ', forceX, forceY, " / Retaining ball velocity state.");
		}
		else {
			this.velocityX += forceX;
			this.velocityY += forceY;
		}
	}

	updatePosition() {
		this.x += this.velocityX;
		this.y += this.velocityY;
	}
}

module.exports = Ball; // Export using CommonJS syntax
