class Cell {
	constructor({ rowIndex, colIndex, x, y, width, height, dx, dy }) {
		this.rowIndex = rowIndex;
		this.colIndex = colIndex;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.dx = dx;
		this.dy = dy;
	}

	draw(ctx, image) {
		ctx.beginPath();

		ctx.drawImage(
			image,
			this.x,
			this.y,
			this.width,
			this.height,
			this.dx,
			this.dy,
			this.width,
			this.height,
		);

		ctx.strokeStyle = "white";
		ctx.rect(this.dx, this.dy, this.width, this.height);
		ctx.stroke();
	}
}

export default Cell;
