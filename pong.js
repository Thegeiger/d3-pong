const width = window.innerWidth - 20;
const height = window.innerHeight - 20;

// step1
let svgContainer = d3.select("#pong").append("svg").attr("width", width).attr("height", height).style("margin-top",  10).style("margin-left",  10).append("g");
var defs = svgContainer.append('svg:defs');

defs.append("svg:pattern")
    .attr("id", "grump_avatar")
    .attr("width", 30)
    .attr("height", 30)
    .append("svg:image")
    .attr("xlink:href", 'http://gmmdistribution.com/wp-content/uploads/2017/01/Bavaria-8.6.jpg')
    .attr("width", 30)
    .attr("height", 30)
    .attr("x", 0)
    .attr("y", 0);

let Ball = class {
	constructor() {
		this.x = width/2;
		this.y = height/2;
		this.r = 15;
		this.shape = svgContainer.append("circle").attr("cx", this.x).attr("cy", this.y).attr("r", this.r).attr("class", "ball").style("fill", "url(#grump_avatar)");;
		this.speed = 2;
		this.speedUp = 0.4;
		this.vector = {
			x: Math.random() * (0.9 - -0.9) + -0.9,
			y: Math.random() * (0.9 - -0.9) + -0.9
		};
		this.vector.x = (this.vector.x > -0.4 && this.vector.x <= 0 ? -0.4 : (this.vector.x < 0.4 && this.vector.x >= 0 ? 0.4 : this.vector.x));
		this.vector.y = (this.vector.y > -0.4 && this.vector.y <= 0 ? -0.4 : (this.vector.y < 0.4 && this.vector.y >= 0 ? 0.4 : this.vector.y));
	}
	move(player1, player2) {
		const xmove = this.x + this.speed * this.vector.x;
		const ymove = this.y + this.speed * this.vector.y;
		console.log(player2.y + player2.height <= ymove + this.r);
		if (xmove - this.r < 0 || xmove + this.r > width) {
			this.vector.x = -this.vector.x;
			this.speed += this.speedUp;
		} else if (player1.y + player1.height >= ymove - this.r && player1.x <= xmove && player1.x + player1.width >= xmove) {
			this.vector.y = -this.vector.y;
			this.speed += this.speedUp;
		} else if (player2.y + player2.height <= ymove + this.r + 20 && player2.x <= xmove && player2.x + player2.width >= xmove) {
			this.vector.y = -this.vector.y;
			this.speed += this.speedUp;
		} else if (ymove - this.r < 0) {
			return ("player2")
		} else if (ymove + this.r > height) {
			return ("player1");
		}
		this.x += this.speed * this.vector.x;
		this.y += this.speed * this.vector.y;
		this.shape.attr("cx", this.x).attr("cy", this.y);
		return (null);
	}

	remove() {
		this.shape.remove();
	}
}

let Player = class {
	constructor(x, y, w, h) {
		this.width = w;
		this.height = h;
		this.x = x;
		this.y = y;
		this.shape = svgContainer.append("rect").attr("x", this.x).attr("y", this.y).attr("height", this.height).attr("width", this.width);
		this.score = 0;
		this.shape.call(d3.drag()
        .on("drag", ()=> {
        	this.x = d3.event.x - (this.width/2);
        	this.shape.attr("x", this.x)
        }));
    }
}

let Game = class {
	constructor() {
		// step2
		this.player1 = new Player(0, 0, 300, 20);
		this.player2 = new Player(0, height - 20, 300, 20);
		this.scoreDiv = d3.select("#pong").append("div").style("position", "fixed").style("height", 50 + "px").style("width", 100 + "px").style("top", ((height/2)-50) + "px").text(this.player1.score + " : " + this.player2.score).style("font-size", "40px").style("font-family", "Noto Sans");
		this.ballButton = d3.select("#pong").append("button").style("position", "fixed").style("height", 50 + "px").style("top", ((height/2)-50) + "px").style("right", "0").on("click", ()=>{
			this.addBall();
		}).text("Add Ball");
		//step3
		const leftArrow = 37;
		const rightArrow = 39;
		const q = 81;
		const d = 68;
		const playerSpeed = 10;

		document.addEventListener('keydown', (event) => {
			if (event.keyCode === leftArrow || event.keyCode === rightArrow || event.keyCode === q || event.keyCode === d) {
				const player = (event.keyCode === leftArrow || event.keyCode === rightArrow ? this.player1 : this.player2); 
				let nextMove = (leftArrow === event.keyCode || event.keyCode === q ? Number(player.shape.attr("x")) - playerSpeed : Number(player.shape.attr("x")) + playerSpeed);
				nextMove = (nextMove < 0 ? 0 : (nextMove > width - 10 ? width - 10 : nextMove))
				player.shape.attr("x", nextMove);
				player.x = nextMove;
			}
		});
		this.balls = [];
		this.addBall();
		this.update();
	}
	addBall () {
		this.balls.push(new Ball());
	}
	updateScore () {
		this.scoreDiv.text(this.player1.score + " : " + this.player2.score);
	}
	update() {
		setTimeout(()=>{
			for (let i = 0; i != this.balls.length; i++) {
				let ball = this.balls[i];
				let win = ball.move(this.player1, this.player2);
				if (win === "player2" || win === "player1") {
					ball.remove();
					this.balls.splice(i, 1);
					this.addBall();
					if (win === "player2") {
						this.player2.score++;
					} else {
						this.player1.score++;
					}
					this.updateScore();
					i--;
				}
			}
			this.update();
		}, 10); // 60 fps
	}
}

let game = new Game();