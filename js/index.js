import Puzzle from "./Puzzle.js";

document.addEventListener("DOMContentLoaded", init);

const IMAGE_WIDTH = 450;
const IMAGE_HEIGHT = 300;

function init() {
	const PUZZLE_OPTIONS = {
		element: document.getElementById("puzzle"),
		image: {
			x: window.innerWidth - IMAGE_WIDTH - window.innerWidth / 8,
			y: window.innerHeight / 2 - IMAGE_HEIGHT / 2,
			width: IMAGE_WIDTH,
			height: IMAGE_HEIGHT,
		},
		grid: { rows: 6, cols: 9 },
	};
	const puzzle = new Puzzle(PUZZLE_OPTIONS);
	const result = document.querySelector(".result");
	const restartBtn = document.querySelector(".restart-btn");
	setTimeout(() => {
		let timerId = setInterval(() => {
			if (puzzle.isEnded()) {
				result.classList.add("active");
			} else {
				result.classList.remove("active");
			}
		}, 5);
	}, 50);

	restartBtn.addEventListener("click", () => {
		puzzle.restart();
	});
}
