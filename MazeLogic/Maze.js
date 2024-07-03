// Class that generates a maze object (a 2D array of cells with walls and paths)
class Maze {
	constructor(sizeX, sizeY, teamAX, teamAY, teamBX, teamBY, finishX, finishY) {
		// Generate a maze
		// Create a 2D array of cells (1 = wall, 0 = path)
		this.map = this.generateMaze(sizeX, sizeY, teamAX, teamAY, teamBX, teamBY, finishX, finishY);
		this.wallSize = 100/sizeX;

        this.redStart = { x: teamAX, y: teamAY };
        this.blueStart = { x: teamBX, y: teamBY };
        this.finish = { x: finishX, y: finishY };
	}

	getMazeData(){
		return {
			map: this.map,
			wallSize: this.wallSize,
		};
	}

	// Generate a 2D array of cells with walls and paths (1 = wall, 0 = path)
	// - Coordinates work as follows: (0, 0) is the top-left corner of the maze
	// - Moving down increases the x-coordinate, moving right increases the y-coordinate
  generateMaze(rows, cols, teamAX, teamAY, teamBX, teamBY, finishX, finishY) {
    // Initialize the maze grid with all walls
    let grid = new Array(rows);
    for (let i = 0; i < rows; i++) {
        grid[i] = new Array(cols).fill(1); // 1 represents walls
    }

    // Depth-First Search (DFS) algorithm to create maze
    function dfs(x, y) {
        grid[x][y] = 0; // Mark the current cell as visited (0 represents path)

        // Define random order for visiting neighbors
        let neighbors = [
            { dx: 0, dy: -2 }, // top
            { dx: 0, dy: 2 },  // bottom
            { dx: -2, dy: 0 }, // left
            { dx: 2, dy: 0 }   // right
        ];

        neighbors.sort(() => Math.random() - 0.5); // Shuffle neighbors

        for (let neighbor of neighbors) {
            let nx = x + neighbor.dx;
            let ny = y + neighbor.dy;

            // Check if the neighbor is within bounds and is a wall
            if (nx >= 1 && nx < rows - 1 && ny >= 1 && ny < cols - 1 && grid[nx][ny] === 1) {
                // Remove the wall between current cell and the neighbor
                grid[x + neighbor.dx / 2][y + neighbor.dy / 2] = 0;
                dfs(nx, ny); // Recursively visit the neighbor
            }
        }
    }

    // Perform DFS to create the maze structure starting from the start point
    dfs(teamAX, teamAY);

    // Connect start to Team B, then Team B to finish
    function connectPoints(x1, y1, x2, y2) {
        let dx = x2 - x1;
        let dy = y2 - y1;

        let stepX = dx === 0 ? 0 : dx / Math.abs(dx);
        let stepY = dy === 0 ? 0 : dy / Math.abs(dy);

        let x = x1, y = y1;
        while (x !== x2 || y !== y2) {
            grid[x][y] = 0; // Create a path
            if (x !== x2) x += stepX;
            if (y !== y2) y += stepY;
        }
        grid[x2][y2] = 0; // Ensure the endpoint is a path
    }

    // Create direct paths between the points to ensure connectivity
    connectPoints(teamAX, teamAY, finishX, finishY);
    connectPoints(finishX, finishY, teamBX, teamBY);

    return grid;
}


 expandMatrix(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const expandedMatrix = [];

    for (let i = 0; i < rows * 2; i++) {
        expandedMatrix[i] = [];
        for (let j = 0; j < cols * 2; j++) {
            const originalValue = matrix[Math.floor(i / 2)][Math.floor(j / 2)];
            expandedMatrix[i][j] = originalValue;
        }
    }

    return expandedMatrix;
}
}

module.exports = Maze; // Export using CommonJS syntax

// class Maze {
// 	constructor(sizeX, sizeY) {
// 		// Generate a maze
// 		// Create a 2D array of cells (1 = wall, 0 = path)
// 		this.map = this.generateMaze(sizeX, sizeY);
// 		this.wallSize = Math.round(100/sizeX);
// 	}

// 	getMazeData(){
// 		return {
// 			map: this.map,
// 			wallSize: this.wallSize,
// 		};
// 	}

// 	// Generate a 2D array of cells with walls and paths (1 = wall, 0 = path)
// 	// - Coordinates work as follows: (0, 0) is the top-left corner of the maze
// 	// - Moving down increases the x-coordinate, moving right increases the y-coordinate
// 	generateMaze(sizeX, sizeY) {
// 		// Stub: returns box maze (walls on the perimeter, path in the middle)
// 		const maze = [];
// 		for (let i = 0; i < sizeX; i++) {
// 			maze.push([]);
// 			for (let j = 0; j < sizeY; j++) {
// 				if (i === 0 || i === sizeX - 1 || j === 0 || j === sizeY - 1) {
// 					maze[i].push(1);
// 				} else {
// 					maze[i].push(0);
// 				}
// 			}
// 		}
// 		return maze;
// 	}
// }

// module.exports = Maze; // Export using CommonJS syntax
