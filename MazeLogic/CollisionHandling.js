// Function to handle collisions between the ball and the maze walls
// - The ball is considered to be a point object
// - The maze walls are considered to be solid and should be wider than the ball
// - The ball's velocity is set to 0 when it collides with a wall (no bouncing)
function handleMazeCollision(ball, maze) {
	// Getting the coordinates of the ball's edges
	const ballTopCoords = [ball.x, ball.y - ball.radius];
	const ballBottomCoords = [ball.x, ball.y + ball.radius];
	const ballLeftCoords = [ball.x - ball.radius, ball.y];
	const ballRightCoords = [ball.x + ball.radius, ball.y];

	// Getting the cell values of the maze at the ball's edges
	const mazeAbove = maze[ballTopCoords[0]][ballTopCoords[1]];
	const mazeBelow = maze[ballBottomCoords[0]][ballBottomCoords[1]];
	const mazeLeft = maze[ballLeftCoords[0]][ballLeftCoords[1]];
	const mazeRight = maze[ballRightCoords[0]][ballRightCoords[1]];

	// Handling collisions with the maze walls (1 == wall, 0 == path)
	// - For this collision handling, walls are considered to be solid and should be wider than the ball
	if (mazeAbove === 1) {
		ball.velocityY = 0;
		ball.y = ball.y + ball.radius;
	}
	if (mazeBelow === 1) {
		ball.velocityY = 0;
		ball.y = ball.y - ball.radius;
	}
	if (mazeLeft === 1) {
		ball.velocityX = 0;
		ball.x = ball.x + ball.radius;
	}
	if (mazeRight === 1) {
		ball.velocityX = 0;
		ball.x = ball.x - ball.radius;
	}
}

// Function to check if two maze objects (markers) overlap
//	- Used to check if the ball has reached the hole
function checkMarkerCollision(marker1, marker2) {
	// Getting the distance between the two markers
	const distance = Math.sqrt(
		(marker1.x - marker2.x) ** 2 + (marker1.y - marker2.y) ** 2
	);

	// Handling collisions between the two markers
	// - For this collision handling, markers are considered to be solid and should be wider than the ball
	if (distance < marker1.radius + marker2.radius) {
		// Collision detected
		return true;
	} else {
		// No collision detected
		return false;
	}
}

module.exports = { handleMazeCollision, checkMarkerCollision };
