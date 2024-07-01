// Class that generates a maze object (a 2D array of cells with walls and paths)
class Maze {
	constructor(sizeX, sizeY) {
		// Generate a maze
		// Create a 2D array of cells (1 = wall, 0 = path)
		this.map = this.generateMaze(sizeX, sizeY);
	}

	// Generate a 2D array of cells with walls and paths (1 = wall, 0 = path)
	// - Coordinates work as follows: (0, 0) is the top-left corner of the maze
	// - Moving down increases the x-coordinate, moving right increases the y-coordinate
	generateMaze(sizeX, sizeY) {
		// Stub: returns box maze (walls on the perimeter, path in the middle)
		const maze = [];

		for (let i = 0; i < sizeX; i++) {
			maze.push([]);
			for (let j = 0; j < sizeY; j++) {
				if (i === 0 || i === sizeX - 1 || j === 0 || j === sizeY - 1) {
					maze[i].push(1);
				} else {
					maze[i].push(0);
				}
			}
		}
	}
}
