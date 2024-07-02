// Function to handle collisions between the ball and the maze walls
// - The ball is considered to be a point object
// - The maze walls are considered to be solid and should be wider than the ball
// - The ball's velocity is set to 0 when it collides with a wall (no bouncing)
function handleMazeCollision(ball, maze) {
    // Ensure ball coordinates are valid numbers
    if (isNaN(ball.x) || isNaN(ball.y) || isNaN(ball.radius)) {
        console.error("Invalid ball coordinates or radius");
        return;
    }

    // Getting the coordinates of the ball's edges
    const ballTopCoords = [Math.floor(ball.x), Math.floor(ball.y - ball.radius)];
    const ballBottomCoords = [Math.floor(ball.x), Math.floor(ball.y + ball.radius)];
    const ballLeftCoords = [Math.floor(ball.x - ball.radius), Math.floor(ball.y)];
    const ballRightCoords = [Math.floor(ball.x + ball.radius), Math.floor(ball.y)];

    // Check if the coordinates are within the bounds of the maze
    const isWithinBounds = (coords) => 
        coords[0] >= 0 && coords[0] < maze.length && 
        coords[1] >= 0 && coords[1] < maze[0].length;

	let newBallX = ball.x;
	let newBallY = ball.y;
	let newBallVelocityX = ball.velocityX;
	let newBallVelocityY = ball.velocityY;

    // Handling collisions with the maze walls (1 == wall, 0 == path)
    if (isWithinBounds(ballTopCoords) && maze[ballTopCoords[1]][ballTopCoords[0]] === 1) {
		newBallVelocityY = 0;
        newBallY = ball.y + ball.radius;
		console.log("Collision detected at top edge - setting y velocity to 0");
    }
    if (isWithinBounds(ballBottomCoords) && maze[ballBottomCoords[1]][ballBottomCoords[0]] === 1) {
        newBallVelocityY = 0;
        newBallY = ball.y - ball.radius;
		console.log("Collision detected at bottom edge - setting y velocity to 0");
    }
    if (isWithinBounds(ballLeftCoords) && maze[ballLeftCoords[1]][ballLeftCoords[0]] === 1) {
        newBallVelocityX = 0;
        newBallX = ball.x + ball.radius;
		console.log("Collision detected at left edge - setting x velocity to 0");

    }
    if (isWithinBounds(ballRightCoords) && maze[ballRightCoords[1]][ballRightCoords[0]] === 1) {
        newBallVelocityX = 0;
        newBallX = ball.x - ball.radius;
		console.log("Collision detected at right edge - setting x velocity to 0");

    }

	return { x: newBallX, y: newBallY, velocityX: newBallVelocityX, velocityY: newBallVelocityY };
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
