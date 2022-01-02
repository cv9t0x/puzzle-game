import Cell from "./Cell.js";

const IMAGE_WIDTH = 450;
const IMAGE_HEIGHT = 300;
const SIZE = {
	x: window.innerWidth - IMAGE_WIDTH - window.innerWidth / 8,
	y: window.innerHeight / 2 - IMAGE_HEIGHT / 2,
	width: IMAGE_WIDTH,
	height: IMAGE_HEIGHT,
	rows: 4,
	cols: 6,
};
let cells = [];
let grid = [];
let canvas = null;
let ctx = null;
let image = null;
let selected = null;

function init() {
	canvas = document.getElementById("puzzle");
	ctx = canvas.getContext("2d");

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	canvas.onmousedown = onMouseDown;
	canvas.ondragstart = () => false;

	image = new Image();
	image.src = "../img/mountains.jpg";
	image.onload = () => {
		setCells();
		cropImage();
		updateCanvas();
	};
}

function onMouseDown(event) {
	selected = getCell(event.x, event.y);

	if (selected === null) return;

	selected.offset = {
		x: event.x - selected.dx,
		y: event.y - selected.dy,
	};

	function moveTo({ x, y }) {
		selected.dx = x - selected.offset.x;
		selected.dy = y - selected.offset.y;
	}

	function onMouseMove(event) {
		moveTo(event);
	}

	canvas.addEventListener("mousemove", onMouseMove);

	canvas.onmouseup = function (event) {
		canvas.removeEventListener("mousemove", onMouseMove);

		insertCell(selected, event);

		canvas.onmouseup = null;
		selected = null;
	};
}

function getCell(x, y) {
	for (let i = cells.length - 1; i >= 0; i--) {
		let cell = cells[i];

		if (
			x > cell.dx &&
			x < cell.dx + cell.width &&
			y > cell.dy &&
			y < cell.dy + cell.height
		) {
			return cell;
		}
	}

	return null;
}

function insertCell(cell, event) {
	for (let i = 0; i < grid.length; i++) {
		if (
			event.x > grid[i].x &&
			event.x < grid[i].x + grid[i].width &&
			event.y > grid[i].y &&
			event.y < grid[i].y + grid[i].height &&
			cell.rowIndex === grid[i].rowIndex &&
			cell.colIndex === grid[i].colIndex
		) {
			cell.dx = grid[i].x;
			cell.dy = grid[i].y;
			return;
		}
	}
}

function setCells() {
	cells = [];
	grid = [];

	for (let i = 0; i < SIZE.rows; i++) {
		for (let j = 0; j < SIZE.cols; j++) {
			const cell = {
				rowIndex: i,
				colIndex: j,
				x: (SIZE.width * j) / SIZE.cols,
				y: (SIZE.height * i) / SIZE.rows,
				width: SIZE.width / SIZE.cols,
				height: SIZE.height / SIZE.rows,
				dx: SIZE.x + (SIZE.width * j) / SIZE.cols,
				dy: SIZE.y + (SIZE.height * i) / SIZE.rows,
			};
			const gridItem = {
				rowIndex: i,
				colIndex: j,
				x: cell.dx,
				y: cell.dy,
				width: cell.width,
				height: cell.height,
			};

			grid.push(gridItem);
			cells.push(new Cell(cell));
		}
	}
}

function cropImage() {
	for (let cell of cells) {
		let coordinates = {
			x:
				Math.random() * (window.innerWidth / 2 - cell.width) * 0.75 +
				window.innerWidth / 16,
			y:
				Math.random() * (window.innerHeight - cell.height) * 0.75 +
				window.innerHeight / 8,
		};

		cell.dx = coordinates.x;
		cell.dy = coordinates.y;
	}
}

function updateCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.globalAlpha = 0.25;
	ctx.drawImage(image, SIZE.x, SIZE.y, IMAGE_WIDTH, IMAGE_HEIGHT);
	ctx.globalAlpha = 1;

	draw();

	window.requestAnimationFrame(updateCanvas);
}

function draw() {
	for (let i = 0; i < cells.length; i++) {
		const cell = cells[i];
		const gridItem = grid[i];

		ctx.beginPath();
		ctx.strokeStyle = "#d2e9ee";
		ctx.rect(gridItem.x, gridItem.y, gridItem.width, gridItem.height);
		ctx.stroke();

		cell.draw(ctx, image);
	}
}

document.addEventListener("DOMContentLoaded", () => {
	init();
});
