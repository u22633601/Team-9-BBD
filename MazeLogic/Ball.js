// Class that generates a ball object (a ball with a position and velocity)
// - Simulates constant acceleration movement of the ball through them maze
class Ball {
	constructor(x, y, radius) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.velocityX = 0;
		this.velocityY = 0;
	}

	applyForce(forceX, forceY) {
		this.velocityX += forceX;
		this.velocityY += forceY;
	}

	updatePosition() {
		this.x += this.velocityX;
		this.y += this.velocityY;
	}
}

module.exports = Ball; // Export using CommonJS syntax
