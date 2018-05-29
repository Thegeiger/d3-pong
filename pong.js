const width = window.innerWidth - 20;
const height = window.innerHeight - 20;

// step1
let svgContainer = d3.select("#pong").append("svg").attr("width", width).attr("height", height).style("margin-top",  10).style("margin-left",  10).append("g");

let Ball = class {
	constructor() {
		this.x = width/2;
		this.y = height/2;
		this.r = 10;
		this.draw = svgContainer.append("circle").attr("cx", this.x).attr("cy", this.y).attr("r", this.r);
		this.speed = 1.5;
		this.vector = {
			x: Math.random() * (0.9 - -0.9) + -0.9,
			y: Math.random() * (0.9 - -0.9) + -0.9
		};
		this.vector.x = (this.vector.x > -0.4 && this.vector.x <= 0 ? -0.4 : (this.vector.x < 0.4 && this.vector.x >= 0 ? 0.4 : this.vector.x));
		this.vector.y = (this.vector.y > -0.4 && this.vector.y <= 0 ? -0.4 : (this.vector.y < 0.4 && this.vector.y >= 0 ? 0.4 : this.vector.y));
	}
	move() {
		console.log("a");
			let x = this.x + this.speed * this.vector.x;
			let y = this.y + this.speed * this.vector.y;
			if (x - this.r < 0 || x + this.r > width) {
				this.vector.x = -this.vector.x;
				x = this.x + this.speed * this.vector.x;
			} else if (y - this.r < 0) {
				return ("player1")
			} else if (y + this.r > height) {
				return ("player2");
			}
			this.x = x;
			this.y = y;
			this.draw.attr("cx", this.x).attr("cy", this.y);
			return (null);
	}
	remove() {
		this.draw.remove();
	}
}

let Game = class {
	constructor() {
		// step2
		let player1 = svgContainer.append("rect").attr("x", 0).attr("y", 0).attr("height", "10px").attr("width", "20%");
		let player2 = svgContainer.append("rect").attr("x", 0).attr("y", height - 10).attr("height", "10px").attr("width", "20%");
		this.score = {
			player1: 0,
			player2: 0
		}
		this.scoreDiv = d3.select("#pong").append("div").style("position", "fixed").style("height", 50 + "px").style("width", 100 + "px").style("top", ((height/2)-50) + "px").text(this.score.player1 + " : " + this.score.player2).style("font-family", "Noto Sans").style("font-size", "80");
		//step3
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
		this.ball = new Ball();
		this.update();
	}
	updateScore () {

	}
	update() {
		setTimeout(()=>{
			let lose = this.ball.move();
			if (lose === "player1") {
				this.ball.remove();
				this.ball = new Ball();
				this.updateScore();
				this.score.player2++;
			} else if (lose === "player2") {
				this.ball.remove();
				this.ball = new Ball();
				this.updateScore();
				this.score.player1++;
			}
			this.update();
		}, 10); // 60 fps
	}
}

let game = new Game();