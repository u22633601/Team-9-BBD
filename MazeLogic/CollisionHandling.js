function handleCollision(ball, maze) {
	// Getting the coordinates of the ball's edges
	const ballTopCoords = ball.y - ball.radius;
	const ballBottomCoords = ball.y + ball.radius;
	const ballLeftCoords = ball.x - ball.radius;
	const ballRightCoords = ball.x + ball.radius;

	// Getting the cell values of the maze at the ball's edges
	const mazeAbove = maze[ballTopCoords[0]][ballTopCoords[1]];
	const mazeBelow = maze[ballBottomCoords[0]][ballBottomCoords[1]];
	const mazeLeft = maze[ballLeftCoords[0]][ballLeftCoords[1]];
	const mazeRight = maze[ballRightCoords[0]][ballRightCoords[1]];

	// Handling collisions with the maze walls (1 == wall, 0 == path)
	// - For this collision handling, walls are considered to be solid and should be wider than the ball
	if (mazeAbove === 1) {
		ball.velocityY = 0;
		ball.y = ball.radius;
	}
	if (mazeBelow === 1) {
		ball.velocityY = 0;
		ball.y = maze.length - ball.radius;
	}
	if (mazeLeft === 1) {
		ball.velocityX = 0;
		ball.x = ball.radius;
	}
	if (mazeRight === 1) {
		ball.velocityX = 0;
		ball.x = maze[0].length - ball.radius;
	}
}
