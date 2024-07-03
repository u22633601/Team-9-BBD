const MazeObject = require('./MazeObject.js');

// Class that generates a ball object (a ball with a position and velocity)
// - Simulates constant acceleration movement of the ball through them maze
class Ball extends MazeObject {
	constructor(x, y, radius) {
		super(x, y, radius);

		this.velocity = { x: 0, y: 0 };
		this.acceleration = { x: 0, y: 0 };

		this.velocity.x = 0;
		this.velocity.y = 0;
		this.acceleration.x = 0;
		this.acceleration.y = 0;		
	}

// applyForce(forceX, forceY) {
// 		// Null/NaN check for forceX and forceY
// 		if (isNaN(forceX) || isNaN(forceY)) {
// 			console.log('Invalid force values: ', forceX, forceY, " / Retaining ball velocity state.");
// 		}
// 		else {
// 			this.velocityX.x = 0;
// 			this.velocityX.y = 0;
// 			this.acceleration.x = 0;

// 		}
// 	}

	updatePosition(deltaTime) {
		this.x += this.velocity.x * deltaTime + 0.5 * this.acceleration.x * deltaTime * deltaTime;
		this.y += this.velocity.y * deltaTime + 0.5 * this.acceleration.y * deltaTime * deltaTime;

		this.velocityX += this.acceleration.x * deltaTime;
		this.velocityY += this.acceleration.y * deltaTime;
	}

	setVelocity(velocityX, velocityY) {
		this.velocityX = velocityX;
		this.velocityY = velocityY;
	}

	getFuturePosition(deltaTime) {
		return { 
			x: this.x + this.velocity.x * deltaTime + 0.5 * this.acceleration.x * deltaTime * deltaTime,
			y: this.y + this.velocity.y * deltaTime + 0.5 * this.acceleration.y * deltaTime * deltaTime,
		};
	}
}

module.exports = Ball; // Export using CommonJS syntax
