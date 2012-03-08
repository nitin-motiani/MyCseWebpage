var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
//document.body.appendChild(canvas);
var container = document.getElementById("container");
container.appendChild(canvas);

var bgReady = false;
var bgImage = new Image();
bgImage.onload = function() {
    bgReady = true;
};
bgImage.src = "background.png";

var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "hero.png";

var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
    monsterReady = true;
};
monsterImage.src = "monster.png"

var hero = 
{
    speed : 256, 
    x : 0, 
    y : 0
};
var monster = {
    x : 0, 
    y : 0
};
var monstersCaught = 0;
var noOfLives = 5;
var newMonstersKilled = 0;
var collided = false;
var out = false;
var waitTime = 0;

var keysDown = {};
addEventListener ("keydown", function (e) {
        keysDown[e.keyCode] = true;
        }, false);
addEventListener ("keyup", function (e) {
        delete keysDown[e.keyCode];
        }, false);



var reset = function() {
    hero.x = canvas.width/2;
    hero.y = canvas.height/2;

    monster.x = 32 + (Math.random() * (canvas.width - 64));
    monster.y = 32 + (Math.random() * (canvas.height - 64));
};

var update = function (modifier) {
    if (collided || out ) {
        if (waitTime < 20) {
            ++waitTime;
            return;
        }
        reset();
        waitTime = 0;
        collided = false;
        out = false;
        return;
    }
    if (38 in keysDown) {
        hero.y -= hero.speed*modifier;
    }
    if (40 in keysDown) {
        hero.y += hero.speed*modifier;
    }
    if (37 in keysDown) {
        hero.x -= hero.speed*modifier;
    }
    if (39 in keysDown) {
        hero.x += hero.speed*modifier;
    }

    if ( hero.x <= (monster.x + 32) 
            && monster.x <= (hero.x + 32)
            && hero.y <= (monster.y + 32) 
            && monster.y <= (hero.y + 32)
	) {
        ++monstersCaught;
        ++newMonstersKilled;
        if (newMonstersKilled  == 10) {
            newMonstersKilled = 0;
            hero.speed += 256;
        }
        //reset();
        collided = true;
        if (hero.x > monster.x) {
            hero.x = monster.x + 16;
        }
        else {
            hero.x = monster.x -16;
        }
        if (hero.y > monster.y) {
            hero.y = monster.y + 16;
        }
        else {
            hero.y = monster.y -16;
        }
    }
    if (hero.x > canvas.width 
        || hero.y > canvas.height
        || hero.x < 0 
        || hero.y < 0) 
    {
        noOfLives -= 1;
        if (noOfLives == 0) {
            noOfLives = 5;
            monstersCaught =  0;
        }
        hero.speed = 256;
        newMonstersKilled = 0;
        //reset();
        out = true;
        if (hero.x < 0) {
            hero.x = 32;
        }
        if (hero.y < 0) {
            hero.y = 32;
        }
        if (hero.x > canvas.width) {
            hero.x = canvas.width - 32;
        }
        if (hero.y > canvas.height) {
            hero.y = canvas.height - 32;
        }
    }
};

var render = function() {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }
    if (heroReady) {
        ctx.drawImage(heroImage, hero.x, hero.y);
    }
    if (monsterReady) {
        ctx.drawImage(monsterImage, monster.x, monster.y);
    }

    ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
	ctx.fillText("Lives Remaining : " + noOfLives, 64, 64);
};

var main = function() {
    var now = Date.now();
    var delta = now - then;

    update (delta/1000);
    render();

    then = now;
};

reset();
then = Date.now(); 
setInterval(main, 1);
