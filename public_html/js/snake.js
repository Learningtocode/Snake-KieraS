/* ------------------------------------------------------------------------- 
 * Varibles
 * -------------------------------------------------------------------------
 */

var snake;
var snakeLength;
var snakeSize;
var snakeDirection;

var food;

var context;
var screenWidth;
var screenHeight;

var gameState; 
var gameOverMenu; 
var restartButton; 
var playHUD; 
var scoreboard;
var startScreenMenu; 
var playButton;
var score; 



/*-------------------------------------------------------------------------- 
 * Executing Game Code 
 * -------------------------------------------------------------------------
 */

gameInitialize();
snakeInitialize();
foodInitialize();
setInterval(gameLoop, 1000 / 30);

/*------------------------------------------------------------------------- 
 * Game Functions 
 * ------------------------------------------------------------------------
 */

function gameInitialize() {
    var canvas = document.getElementById("game-screen");
    context = canvas.getContext("2d");

    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;

    canvas.width = screenWidth;
    canvas.height = screenHeight;

    document.addEventListener("keydown", keyboardHandler); 
     
    gameOverMenu = document.getElementById("gameOver"); 
    centerMenuPosition(gameOverMenu); 
     
    restartButton = document.getElementById("restartButton"); 
    restartButton.addEventListener("click", gameRestart);  
     
    playButton = document.getElementById("playButton"); 
    playButton.addEventListener("click", gameRestart);
         
    startScreenMenu = document.getElementById("playHUD");
    centerMenuPosition(startScreenMenu); 
    
    scoreboard = document.getElementById("score");
      
    setState("PLAY GAME"); 
    
}
  
// Once the game is over, it causes it to reset.   
 
function gameLoop() {
    gameDraw(); 
    drawScoreboard();
    if (gameState == "PLAY") {
        snakeUpdate();
        snakeDraw();
        foodDraw();      
    }
}
 
//Function gameDraw makes the entire screen design, background and all.
  
function gameDraw() {
    context.fillStyle = "rgb(0, 255, 166)";
    context.fillRect(0, 0, screenWidth, screenHeight);
} 
 
 function gameRestart() {
     snakeInitialize(); 
     foodInitialize();  
     hideMenu(gameOverMenu); 
     hideMenu(startScreenMenu); 
     displayMenu(scoreboard);
     setState("PLAY");   
 }

/* ---------------------------------------------------------------------------
 * Snake Functions
 * --------------------------------------------------------------------------
 */

function snakeInitialize() {
    snake = [];
    snakeLength = 3;
    snakeSize = 20;
    snakeDirection = "down"; 
     
    for (var index = snakeLength - 1; index >= 0; index--) {
        snake.push({
            x: index,
            y: 0
        });
    } 
}
  
//This function draws the snake onto the web browser.
 
function snakeDraw() {
    for (var index = 0; index < snake.length; index++) {
        context.fillStyle = "white"; 
        context.strokeStyle = "black"; 
        context.strokeRect(snake[index].x * snakeSize, snake[index].y * snakeSize, snakeSize, snakeSize);
        context.fillRect(snake[index].x * snakeSize, snake[index].y * snakeSize, snakeSize, snakeSize); 
    }
}

function snakeUpdate() {
    var snakeHeadX = snake[0].x;
    var snakeHeadY = snake[0].y;

    if (snakeDirection == "down") {
        snakeHeadY++;
    }
    else if (snakeDirection == "right") {
        snakeHeadX++;
    }
    else if (snakeDirection == "up") {
        snakeHeadY--;
    }
    else if (snakeDirection == "left") {
        snakeHeadX--;
    }

    checkFoodCollisions(snakeHeadX, snakeHeadY);
    checkWallCollisions(snakeHeadX, snakeHeadY); 
    checkSnakeCollisions(snakeHeadX, snakeHeadY); 
    

    var snakeTail = snake.pop();
    snakeTail.x = snakeHeadX;
    snakeTail.y = snakeHeadY;
    snake.unshift(snakeTail);
}

/* -------------------------------------------------------------------------- 
 *  Food Functions
 *  -------------------------------------------------------------------------
 */

function foodInitialize() {
    food = {
        x: 0,
        y: 0
    };
    setFoodPosition();
} 
 
//This function creates the ddesiign of the food.

function foodDraw() {
    context.fillStyle = "white";
    context.fillRect(food.x * snakeSize, food.y * snakeSize, snakeSize, snakeSize);

}
 
  
//The function below causes the positioin of the food to be random.
  
function setFoodPosition() {
    var randomX = Math.floor(Math.random() * screenWidth);
    var randomY = Math.floor(Math.random() * screenHeight);

    food.x = Math.floor(randomX / snakeSize);
    food.y = Math.floor(randomY / snakeSize); 
     

}

/* -------------------------------------------------------------------------
 *  Input Functions
 *  ------------------------------------------------------------------------
 */
 
 //When you click the direction arrows on the keyboard the code reacts moving the snake. 
 
function keyboardHandler(event) {

    if (event.keyCode == "39" && snakeDirection != "left") {
        snakeDirection = "right";
    }
    else if (event.keyCode == "40" && snakeDirection != "up") {
        snakeDirection = "down";
    }
    else if (event.keyCode == "37" && snakeDirection != "right") {
        snakeDirection = "left";
    }
    else if (event.keyCode == "38" && snakeDirection != "down") {
        snakeDirection = "up";
    }

}

/* ---------------------------------------------------------------------------
 *  Collision Handling
 *  --------------------------------------------------------------------------
 */
 
 //This makes sure that the snake runs into the food and the food changes position when hit. 
 
function checkFoodCollisions(snakeHeadX, snakeHeadY) {
    if (snakeHeadX == food.x && snakeHeadY == food.y) {
        snake.push({
            x: 0,
            y: 0
         });
        playEffectSound(); 
        snakeLength++;
        setFoodPosition();    
    }
}
 
 // When snake hits wall, this function makes sure the game is over and you die.
 
function checkWallCollisions(snakeHeadX, snakeHeadY) {
    if (snakeHeadX * snakeSize >= screenWidth || snakeHeadX * snakeSize < 0) {
        setState("GAME OVER");
    } 
    else if (snakeHeadY * snakeSize >= screenHeight || snakeHeadY * snakeSize < 0) {
        setState("GAME OVER");
    }
} 
 
function checkSnakeCollisions(snakeHeadX, snakeHeadY) {
    for(var index = 1; index < snake.length; index++) {
       if(snakeHeadX == snake[index].x && snakeHeadY ==snake[index].y) {
           setState("GAME OVER"); 
           return;
       }
    } 
}

/*-------------------------------------------------------------------------
 *  Game State Handling
 *  -----------------------------------------------------------------------
 */

function setState(state) {
    gameState = state; 
    showMenu(state);
} 
 
 function displayMenu(menu) {
    menu.style.visibility = "visible"; 
    scoreboard.style.visibility = "visible";
 }  
  
 function hideMenu(menu) {
     menu.style.visibility = "hidden"; 
     scoreboard.style.visibility = "hidden";
 }
  
//When the game is over or it's in play game state this function makes sures the certain menu shows. 

 function showMenu(state) {
     if(state == "GAME OVER") {
         displayMenu(gameOverMenu);
     } 
     if(state == "PLAY GAME") {
         displayMenu(startScreenMenu);  
     }
 } 
  
 function centerMenuPosition(menu) {
      menu.style.top = (screenHeight / 2) - (menu.offsetHeight / 2) + "px"; 
      menu.style.left = (screenWidth / 2) - (menu.offsetWidth / 2) + "px";
  }  
    
//This shows the scoreboard on the web browers. 

 function drawScoreboard() {
      scoreboard.innerHTML = "Length: " + snakeLength; 
  } 
  
/* @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 *  Sound Effects Varibles
 *  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
 */
    
 var Powerup = new Audio();   

 
function playEffectSound() {
   Powerup = document.getElementById('effects'); 
   Powerup.currentTime = 10; 
   Powerup.play();   
 } 
    
