'use strict';

let Game = {};

Game.Stage = {
  'el': document.querySelector('.stage'),
  'width': 0,
  'height': 0,
  'isPlaying': false,
  'minPosX': 0,
  'minPosY': 0,
  'maxPosX': 0,
  'maxPosY': 0,
};

Game.Snake = {
  'el': '',
  'head': {
    'el': '',
    'pos': [0,0],
  },
  'body': [],
  'size': 30,
  'vector': [0,0],
};

Game.foodArray = [];

Game.makeSnake = function(){
  const snake = document.createElement('div');
  snake.className = 'snake';
  this.Snake.el = snake;
  
  const head = document.createElement('div');
  head.className = 'head';
  head.style.top = '120px';
  head.style.left = '120px';
  this.Snake.head.el = head;
  this.Snake.head.pos = [120,120];
  this.Snake.vector = [1,0];
  this.Snake.el.appendChild(head);
  
  this.Stage.el.appendChild(snake);
};

Game.addSnakeBody = function(){
  console.log(this.Snake.vector);
  let bodyObj = {},
  posX, posY = 0;

  const snakeHead= this.Snake.head,
  snakeBody = this.Snake.body;

  if (snakeBody.length > 0) {
    posX = snakeBody[snakeBody.length-1].pos[0] + (this.Snake.vector[0] * -30);
    posY = snakeBody[snakeBody.length-1].pos[1] + (this.Snake.vector[1] * -30);
  } else {
    posX = snakeHead.pos[0] + (this.Snake.vector[0] * -30);
    posY = snakeHead.pos[1] + (this.Snake.vector[1] * -30);
  }
  const body = document.createElement('div');
  body.className = 'body';
  body.style.top = posY + 'px';
  body.style.left = posX + 'px';
  
  bodyObj = {
    'el': body,
    'pos': [posX, posY],
  };
  
  this.Snake.body.push(bodyObj);

  this.Snake.el.appendChild(body);
};

Game.makeStage = function(w, h){
  const thisStage = this.Stage;
  thisStage.width = w;
  thisStage.height = h;
  thisStage.maxPosX = w - 30;
  thisStage.maxPosY = h - 30;
  thisStage.el.style.width = w + 'px';
  thisStage.el.style.height = h + 'px';
};

Game.generateFood = function(){
  const makeFoodPosition = function(){
    let randX = Math.random() * 29,
    randY = Math.random() * 19;
    return [(30 * Math.floor(randX)), (30 * Math.floor(randY))];
  };

  const food = document.createElement('div');
  let pos = [];

  pos = makeFoodPosition();

  food.className = 'food';
  food.style.top =  pos[1] + 'px';
  food.style.left = pos[0] + 'px';

  this.foodArray.push({
    'el': food,
    'pos': pos,
  });
  this.Stage.el.appendChild(food);
};

Game.eatFood = function(target){
  const food = this.foodArray[0];

  if ((target.pos[0] === food.pos[0]) && (target.pos[1] === food.pos[1])) {
    console.log('eat!');

    this.Stage.el.removeChild(this.foodArray[0].el);
    this.foodArray.pop();

    this.addSnakeBody();

    this.generateFood();
  }
};

Game.snakeMoving = function(){
  const thisSnake = this.Snake;
  let moveKey = '';

  moveKey = setInterval(()=>{
    let nextX, nextY = 0,
    tempX, tempY = 0,
    movingTarget = thisSnake.head;

    tempX = thisSnake.head.pos[0];
    tempY = thisSnake.head.pos[1];

    nextX = tempX + (30 * thisSnake.vector[0]);
    nextY = tempY + (30 * thisSnake.vector[1]);

    if ((nextX > this.Stage.maxPosX) || (nextY > this.Stage.maxPosY) || (nextX < 0) || (nextY < 0)) {
      console.log('nope');
      clearInterval(moveKey);
    } else {
      movingTarget.el.style.left = nextX + 'px';
      movingTarget.el.style.top = nextY + 'px';
      thisSnake.head.pos[0] = nextX;
      thisSnake.head.pos[1] = nextY;
      console.log('head_move');
      this.eatFood(thisSnake.head);

      movingTarget = thisSnake.body;
      if (movingTarget.length > 0) {
        movingTarget.forEach(bodyEl => {
          nextX = tempX;
          nextY = tempY;
          tempX = bodyEl.pos[0];
          tempY = bodyEl.pos[1];

          bodyEl.el.style.left = nextX + 'px';
          bodyEl.el.style.top = nextY + 'px';
          bodyEl.pos[0] = nextX;
          bodyEl.pos[1] = nextY;
          console.log('body_move');
        });
      }
    }
  }, 200);
};

Game.setDirection = function(keyCode){
  const thisKeyCode = keyCode;

  switch (thisKeyCode) {
    case 32 :
      if (!this.Stage.isPlaying) {
        this.Stage.isPlaying = true;
        this.snakeMoving();
      }
      break;
    case 37 :
      console.log('left');
      this.Snake.vector = [-1,0];
      break;
    case 38 :
      console.log('up');
      this.Snake.vector = [0,-1];
      break;
    case 39 :
      console.log('right');
      this.Snake.vector = [1,0];
      break;
    case 40 :
      console.log('down');
      this.Snake.vector = [0,1];
      break;
  }
};

Game.init = function(){
  const w = 900,
        h = 600;

  this.makeStage(w, h);
  this.makeSnake();

  this.generateFood();

  document.body.addEventListener('keyup', (event)=>{
    this.setDirection(event.keyCode);
  });
};

Game.init();