class Cell {
	constructor({ rowIndex, colIndex, x, y, width, height, cx, cy }) {
		this._rowIndex = rowIndex;
		this._colIndex = colIndex;
		this._x = x;
		this._y = y;
		this._width = width;
		this._height = height;
		this._cx = cx;
		this._cy = cy;
		this._isInserted = false;
	}

	draw(ctx, image) {
		ctx.beginPath();
		ctx.drawImage(
			image,
			this._cx,
			this._cy,
			this._width,
			this._height,
			this._x,
			this._y,
			this._width,
			this._height,
		);

		if (!this._isInserted) {
			ctx.strokeStyle = "#fff";
			ctx.rect(this._x, this._y, this._width, this._height);
		}

		ctx.stroke();
	}

	set x(x) {
		this._x = x;
	}
	set y(y) {
		this._y = y;
	}
	set isInserted(isInserted) {
		this._isInserted = isInserted;
	}
	get x() {
		return this._x;
	}
	get y() {
		return this._y;
	}
	get rowIndex() {
		return this._rowIndex;
	}
	get colIndex() {
		return this._colIndex;
	}
	get width() {
		return this._width;
	}
	get height() {
		return this._height;
	}
	get isInserted() {
		return this._isInserted;
	}
}

export default Cell;
