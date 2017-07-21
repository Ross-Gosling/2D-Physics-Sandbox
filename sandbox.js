
// Initialise variables

var canvas = document.getElementById("sandbox");
var context = canvas.getContext("2d");

var previous;
var isPaused;


// Stores keys that are being pressed down"
var keysDown = {};

// Initialises game object variables
var balls = [];

// BALL CLASS
// Defines the ball constructor
function Ball (radius, mass, colour, position, velocity) 
{
	this.radius = radius;
	this.mass = mass;
	this.colour = colour;
	this.position = { x: position.x, y: position.y };
	this.velocity = { x: velocity.x, y: velocity.y };
}

// Updates the ball
Ball.prototype.updatePos = function (elapsed) 
{
	// Updates position
	this.position.x += this.velocity.x * elapsed;
	this.position.y += this.velocity.y * elapsed;
}

// Processes collision detection with walls
Ball.prototype.processCollisions_Walls = function (elapsed) 
{
	// Checks if the ball has reached an edge (Left or Right)
	if (((this.position.x - this.radius) <= 0) || ((this.position.x + this.radius) >= canvas.width)) 
	{
		// Inverts the speed on the x axis

		//this.xSpeed = invertNum(this.xSpeed);		
		this.velocity.x = invertNum(this.velocity.x);

		// If the ball is off the left of the canvas
		if ((this.position.x - this.radius) <= 0)
 		{
			// Adjusts position
			this.position.x = 0 + this.radius;
		}
		
		// If the ball is off the right of the canvas
		if ((this.position.x + this.radius) >= canvas.width) 
		{
			// Adjusts position
			this.position.x = canvas.width - this.radius;
		}
	}

	// Checks if the ball has reached an edge (Top or Bottom)
	if (((this.position.y - this.radius) <= 0) || (this.position.y + this.radius >= canvas.height))
	{
		// Inverts the speed on the y axis
		this.velocity.y = invertNum(this.velocity.y);

		// If the ball is off the top of the canvas
		if ((this.position.y - this.radius) <= 0)
 		{
			// Adjusts position
			this.position.y = 0 + this.radius;
		}
		
		// If the ball is off the bottom of the canvas
		if ((this.position.y + this.radius) >= canvas.height) 
		{
			// Adjusts position
			this.position.y = canvas.height - this.radius;
		}
	}
}

// Processes collision detection with other balls
Ball.prototype.processCollisions_Balls = function (elapsed, otherBall) 
{
	var distVec = { x: otherBall.position.x - this.position.x, y: otherBall.position.y - this.position.y }
	var distScalar = magnitude(distVec.x, distVec.y);

	// If distance between balls is less than the radiae of them
	if (distScalar < this.radius + otherBall.radius )
	{
		// TEMPORARY
		this.velocity = { x: invertNum(this.velocity.x), y: invertNum(this.velocity.y) };
		otherBall.velocity = { x: invertNum(otherBall.velocity.x), y: invertNum(otherBall.velocity.y) };
		
		// resolve intersection
    	// inverse mass quantities
		imthis = invertNum(this.mass);
		imother = invertNum(otherBall.mass);

    	// push-pull them apart based off their mass
    	//position = position.add(mtd.multiply(im1 / (im1 + im2)));
    	//ball.position = ball.position.subtract(mtd.multiply(im2 / (im1 + im2)));
		this.position = 
		{
			x: this.position.x + (/*distVec.x*/ distScalar * (imthis / (imthis + imother))),
			y: this.position.y + (/*distVec.y*/ distScalar * (imthis / (imthis + imother))) 
		};
		
		otherBall.position = 
		{ 
			x: otherBall.position.x - (/*distVec.x*/ distScalar * (imother / (imthis + imother))), 
			y: otherBall.position.y - (/*distVec.y*/ distScalar * (imother / (imthis + imother))) 
		};
		
		// impact speed
		//v = { x: this.velocity.x - otherBall.velocity.x, y: this.velocity.y - otherBall.velocity.y };			
    	//float vn = v.dot(mtd.normalize());
		//normal = { x: Math.sin(distVec), y: } ;
		//vn = a.x * b.x + a.y * b.y;

    		// sphere intersecting but moving away from each other already
    		//if (vn > 0.0f) return; 

    		// collision impulse
    		//float i = (-(1.0f + Constants.restitution) * vn) / (im1 + im2);
    		//Vector2d impulse = mtd.multiply(i);

    		// change in momentum
    		//this.velocity = this.velocity.add(impulse.multiply(im1));
    		//ball.velocity = ball.velocity.subtract(impulse.multiply(im2));

		/*
    		// resolve intersection --
    		// inverse mass quantities
    		float im1 = 1 / getMass(); 
    		float im2 = 1 / ball.getMass();
	
    		// push-pull them apart based off their mass
    		position = position.add(mtd.multiply(im1 / (im1 + im2)));
    		ball.position = ball.position.subtract(mtd.multiply(im2 / (im1 + im2)));

    		// impact speed
    		Vector2d v = (this.velocity.subtract(ball.velocity));
    		float vn = v.dot(mtd.normalize());

    		// sphere intersecting but moving away from each other already
    		if (vn > 0.0f) return;

    		// collision impulse
    		float i = (-(1.0f + Constants.restitution) * vn) / (im1 + im2);
    		Vector2d impulse = mtd.multiply(i);

    		// change in momentum
    		this.velocity = this.velocity.add(impulse.multiply(im1));
    		ball.velocity = ball.velocity.subtract(impulse.multiply(im2));
		*/
	}
}

// Draws the ball
Ball.prototype.draw = function () 
{
	context.fillStyle = this.colour;
	
	context.beginPath();
	
	context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);

	context.fill();
}

// Creates an event that listens for key presses
window.addEventListener("keydown", function(event)
{
	// Adds keys that are down to an array
	keysDown[event.keyCode] = true;
});

// Creates an event that listens for when a key is up
window.addEventListener("keyup", function(event)
{
	// Deletes keys that are up from the array
	delete keysDown[event.keyCode];

});

// Listens for window focus-in events
window.addEventListener("focusin", function(event)
{
	// Unpauses the balls
	isPaused = false;
}, true);

// Listens for window focus-out events
window.addEventListener("focusout", function(event)
{
	// Pauses the balls
	//isPaused = true;
}, true);

// Returns an inverted number
function invertNum(num)
{
	return num *= -1;
}

// Returns a magnitude
function magnitude(x, y)
{
	return Math.sqrt( Math.pow(x, 2) + Math.pow(y, 2) );
}

// Processes input
function processInput()
{
	// If Spacebar is down
	if  (32 in keysDown) 
	{

		// Random number between 1 and 200
		var randX = Math.floor((Math.random() * 200) + 1); 
		var randY = Math.floor((Math.random() * 200) + 1); 

		var xPostive = Math.random();
		var yPostive = Math.random();

		if(xPostive >= 0.5) { randX = invertNum(randX); }
		if(yPostive >= 0.5) { randY = invertNum(randY); }

		var randRadius = Math.floor((Math.random() * 10) + 5); 

		// Creates ball // fRadius, fMass, colour, fX, fY, fXSpeed, fYSpeed
		balls[balls.length] = new Ball(randRadius , 1, "#FF1500", { x: canvas.width/2, y: canvas.height/2}, { x: randX, y: randY});
	}		
}

// Updates stuff
function update(elapsed) 
{
	// Processes input
	processInput();

	// If is not paused
	if (!isPaused)
	{
		// Updates objects
		for ( i = 0; i < balls.length; i++ )
		{
			balls[i].updatePos(elapsed);
			balls[i].processCollisions_Walls(elapsed);

			//var ballsCloned = balls;

			for ( j = 0; j < balls.length; j++ )
			{
				if ( i != j )
				{
					balls[i].processCollisions_Balls(elapsed, /*ballsCloned[j]*/ balls[j]);
				}
			}
		}
	}

	// Draws objects
	for ( i = 0; i < balls.length; i++ ) { balls[i].draw(); }
}

// Called on every frame request
function run(timestamp) 
{
	// Clears the canvas at the start of the frame
	context.clearRect(0, 0, canvas.width, canvas.height);

	if (!previous) 
	{
		// Start with no elapsed time
		previous = timestamp;
	}
	
	// Work out the elapsed time
	var elapsed = (timestamp - previous) / 1000;

	// Update the game with the elapsed time
	update(elapsed);

	// Set the (globally defined) previous timestamp ready for next time
	previous = timestamp;

	// Ask browser to call this function again, when it's ready
	window.requestAnimationFrame(run);
}

// Triggers the update loop
window.requestAnimationFrame(run);
