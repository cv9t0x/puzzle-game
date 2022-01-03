class Puzzle {
	constructor({ elem, x, y, width, height, rows, cols }) {
		this.canvas = elem;
		this.ctx = this.canvas.getContext("2d");
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.rows = rows;
		this.cols = cols;
		this.selectedCell = null;
		this.image = null;
		this.cells = [];
		this.onMouseDown = this.onMouseDown.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
	}

	init() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.addEventListeners();

		this.image = new Image();
		this.image.src = "../img/mountains.jpg";
		this.image.onload = function () {};
	}

	addEventListeners() {
		this.canvas.addEventListener("mousedown", this.onMouseDown);
		this.canvas.addEventListener("mousedown", this.onMouseMove);
		this.canvas.addEventListener("mouseup", this.onMouseUp);
		this.canvas.addEventListener("dragstart", () => {
			return false;
		});
	}

	onMouseDown(event) {
		this.selectedCell = this.getCell(event);

		if (this.selectedCell === null) return;

		this.selectedCell.offset = {
			x: event.x - this.selectedCell.x,
			y: event.y - this.selectedCell.y,
		};
	}

	onMouseMove(event) {
		this.selectedCell.x = event.x - this.selectedCell.offset.x;
		this.selectedCell.y = event.y - this.selectedCell.offset.y;
	}

	onMouseUp(event) {
		this.canvas.removeEventListener("mousemove", this.onMouseMove);
		this.canvas.onmouseup = null;
		this.selectedCell = null;
	}

	getCell(coordinates) {
		const { x, y } = coordinates;

		for (let i = cells.length - 1; i >= 0; i--) {
			let cell = cells[i];
			if (
				x > cell.x &&
				x < cell.x + cell.width &&
				y > cell.y &&
				y < cell.y + cell.height
			) {
				return cell;
			}
		}
		return null;
	}
}

export default Puzzle;
