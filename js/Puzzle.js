import Cell from "./Cell.js";
class Puzzle {
	constructor({
		element,
		image: { x, y, width: imgWidth, height: imgHeight },
		grid: { rows, cols },
	}) {
		this._canvas = element;
		this._ctx = this._canvas.getContext("2d");
		this._image = {
			x,
			y,
			width: imgWidth,
			height: imgHeight,
			src: "../img/mountains.jpg",
		};
		this._grid = {
			rows,
			cols,
			elements: [],
		};
		this._cells = [];
		this._selectedCell = null;
		this._hoveredCell = null;

		this.init();
	}

	init() {
		this._canvas.width = window.innerWidth;
		this._canvas.height = window.innerHeight;

		this.addEventListeners();

		const image = new Image();
		image.src = this._image.src;
		image.onload = () => {
			this.set();
			this.updateCanvas(image);
		};
	}

	isEnded() {
		return this._grid.elements.length ? false : true;
	}

	restart() {
		this.set();
	}

	addEventListeners() {
		this._canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
		this._canvas.addEventListener(
			"mousemove",
			this.handleHoverEvent.bind(this),
		);
		this._canvas.addEventListener("dragstart", () => {
			return false;
		});
	}

	handleHoverEvent(event) {
		this._hoveredCell = this.getCell(event.x, event.y);

		if (this._hoveredCell === null || this._hoveredCell.isInserted) {
			document.body.style.cursor = "default";
			return;
		}

		if (document.body.style.cursor === "grabbing") return;

		document.body.style.cursor = "grab";
	}

	onMouseDown(event) {
		this._selectedCell = this.getCell(event.x, event.y);

		if (this._selectedCell === null) return;
		if (this._selectedCell.isInserted) return;

		document.body.style.cursor = "grabbing";

		const index = this._cells.indexOf(this._selectedCell);
		if (index !== -1) {
			this._cells.splice(index, 1);
			this._cells.push(this._selectedCell);
		}

		this._selectedCell.offset = {
			x: event.x - this._selectedCell.x,
			y: event.y - this._selectedCell.y,
		};

		this._canvas.onmousemove = this.onMouseMove.bind(this);
		this._canvas.onmouseup = this.onMouseUp.bind(this);
	}

	onMouseMove(event) {
		this._selectedCell.x = event.x - this._selectedCell.offset.x;
		this._selectedCell.y = event.y - this._selectedCell.offset.y;
	}

	onMouseUp(event) {
		this._canvas.onmousemove = null;
		this._canvas.onmouseup = null;
		this.insertCell(this._selectedCell, event.x, event.y);
		this._selectedCell = null;

		document.body.style.cursor = "grab";
	}

	getCell(x, y) {
		for (let i = this._cells.length - 1; i >= 0; i--) {
			let cell = this._cells[i];

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

	insertCell(cell, x, y) {
		for (let i = 0; i < this._grid.elements.length; i++) {
			const gridItem = this._grid.elements[i];

			if (
				x >= gridItem.x &&
				x <= gridItem.x + cell.width &&
				y >= gridItem.y &&
				y <= gridItem.y + cell.height &&
				cell.rowIndex === gridItem.rowIndex &&
				cell.colIndex === gridItem.colIndex
			) {
				//if (!this.isCellFree(x, y, gridItem.x, gridItem.y)) {
				//	return;
				//}

				cell.x = gridItem.x;
				cell.y = gridItem.y;
				cell.isInserted = true;

				const index = this._grid.elements.indexOf(gridItem);
				if (index !== -1) {
					this._grid.elements.splice(index, 1);
				}

				return;
			}
		}
	}

	//isCellFree(cellX, cellY, gridX, gridY) {
	//	return true;
	//}

	updateCanvas(image) {
		this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
		this._ctx.globalAlpha = 0.25;
		this._ctx.drawImage(
			image,
			this._image.x,
			this._image.y,
			this._image.width,
			this._image.height,
		);
		this._ctx.globalAlpha = 1;

		this.draw(image);

		window.requestAnimationFrame(this.updateCanvas.bind(this, image));
	}

	set() {
		this._cells = [];
		this._grid.elements = [];

		for (let rowIndex = 0; rowIndex < this._grid.rows; rowIndex++) {
			for (let colIndex = 0; colIndex < this._grid.cols; colIndex++) {
				const coordinates = {
					x:
						this._image.x +
						(this._image.width * colIndex) / this._grid.cols,
					y:
						this._image.y +
						(this._image.height * rowIndex) / this._grid.rows,
				};

				const gridItem = {
					rowIndex,
					colIndex,
					x: coordinates.x,
					y: coordinates.y,
				};

				const cell = {
					...gridItem,
					width: this._image.width / this._grid.cols,
					height: this._image.height / this._grid.rows,
					cx: (this._image.width * colIndex) / this._grid.cols,
					cy: (this._image.height * rowIndex) / this._grid.rows,
				};

				this._grid.elements.push(gridItem);
				this._cells.push(new Cell(cell));
			}
		}

		this.scatterCells();
	}

	scatterCells() {
		for (let cell of this._cells) {
			const coordinates = {
				x:
					Math.random() *
						(window.innerWidth / 2 - cell.width) *
						0.75 +
					window.innerWidth / 16,
				y:
					Math.random() * (window.innerHeight - cell.height) * 0.75 +
					window.innerHeight / 8,
			};

			cell.x = coordinates.x;
			cell.y = coordinates.y;
		}
	}

	draw(image) {
		this.drawGrid(image);
		this.drawCells(image);
	}

	drawGrid(image) {
		for (let i = 0; i < this._grid.elements.length; i++) {
			const gridItem = this._grid.elements[i];
			this._ctx.beginPath();
			this._ctx.strokeStyle = "#d2e9ee";
			this._ctx.rect(
				gridItem.x,
				gridItem.y,
				this._cells[0]?.width,
				this._cells[0]?.height,
			);
			this._ctx.stroke();
		}
	}

	drawCells(image) {
		for (let i = 0; i < this._cells.length; i++) {
			const cell = this._cells[i];
			cell.draw(this._ctx, image);
		}
	}
}

export default Puzzle;
