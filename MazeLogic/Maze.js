// Class that generates a maze object (a 2D array of cells with walls and paths)
class Maze {
	constructor(sizeX, sizeY) {
		// Generate a maze
		// Create a 2D array of cells (1 = wall, 0 = path)
		this.map = this.generateMaze(sizeX, sizeY, 0, 0, sizeX - 1, sizeY - 1);
	}

	// Generate a 2D array of cells with walls and paths (1 = wall, 0 = path)
	// - Coordinates work as follows: (0, 0) is the top-left corner of the maze
	// - Moving down increases the x-coordinate, moving right increases the y-coordinate
    generateMaze(rows, cols, startX, startY, finishX, finishY) {
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
                if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && grid[nx][ny]) {
                    // Remove the wall between current cell and the neighbor
                    grid[x + neighbor.dx / 2][y + neighbor.dy / 2] = 0;
                    dfs(nx, ny); // Recursively visit the neighbor
                }
            }
        }

        // Start DFS from the specified start position
        dfs(startX, startY);

        // Optionally mark the finish position (if needed)
        if (finishX >= 0 && finishX < rows && finishY >= 0 && finishY < cols) {
            grid[finishX][finishY] = 2; // Mark finish cell (2 represents finish)
        }

        return grid;
    }


}

module.exports = Maze; // Export using CommonJS syntax
