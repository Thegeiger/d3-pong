const width = window.innerWidth - 20;
const height = window.innerHeight - 20;

// step1
let svgContainer = d3.select("#pong").append("svg").attr("width", width).attr("height", height).style("margin-top",  10).style("margin-left",  10).append("g");
let player1 = svgContainer.append("rect").attr("x", 0).attr("y", 0).attr("height", "10px").attr("width", "20%");
let player2 = svgContainer.append("rect").attr("x", 0).attr("y", height - 10).attr("height", "10px").attr("width", "20%");

let Ball = class {
	constructor() {
		this.draw = svgContainer.append("circle").attr("cx", width/2).attr("cy", height/2).attr("r", "10");
		this.speed = 10;
		this.vector = {
			x: scale(Math.random()),
			y: scale(Math.random())
		};
	}
}

const ball = new Ball();


//step2 player1.attr("x")
const leftArrow = 37;
const rightArrow = 39;
const q = 81;
const d = 68;
const playerSpeed = 7;

document.addEventListener('keydown', function(event) {
	if (event.keyCode === leftArrow || event.keyCode === rightArrow || event.keyCode === q || event.keyCode === d) {
		const player = (event.keyCode === leftArrow || event.keyCode === rightArrow ? player1 : player2); 
		let nextMove = (leftArrow === event.keyCode || event.keyCode === q ? Number(player.attr("x")) - playerSpeed : Number(player.attr("x")) + playerSpeed);
		nextMove = (nextMove < 0 ? 0 : (nextMove > width - 10 ? width - 10 : nextMove))
		player.attr("x", nextMove);
	}
});