'use strict';

let Game = {};

// 스테이지 객체
Game.Stage = {
  'el': document.querySelector('.stage'),
  'width': 0,
  'height': 0,
  'pixelSize': 0,
  'isPlaying': false,
  'minPosX': 0,
  'minPosY': 0,
  'maxPosX': 0,
  'maxPosY': 0,
};

// 스테이지 픽셀 베이스
Game.pixelBase = function(element, position){
  this.el = element;
  this.pos = position;
};

// 뱀 객체
Game.Snake = {
  'el': '',
  'head': '',
  'body': [],
  'vector': [0,0],
};

// 먹이 객체 (스테이지에서 매번 먹이는 하나)
Game.Food = {};

// 스테이지 세팅
Game.initStage = function(w, h, pS){
  const thisStage = this.Stage;
  // 스테이지 설정값 지정
  thisStage.width = w;
  thisStage.height = h;
  thisStage.maxPosX = w - pS;
  thisStage.maxPosY = h - pS;
  thisStage.pixelSize = pS;
  // 스테이지 사이즈 지정
  thisStage.el.style.width = w + 'px';
  thisStage.el.style.height = h + 'px';
  // 스테이지css 세팅
  const snakeStyle = document.createElement('style');
  snakeStyle.innerHTML = '.stage div{width:'+ pS +'px;height:'+ pS +'px}';
  document.head.appendChild(snakeStyle);
  // 뱀 그리기
  this.drawSnake(pS);

  document.body.addEventListener('keyup', event => {
    this.setDirection(event.keyCode);
  });
};

// 뱀 그리기
Game.drawSnake = function(pS){
  const thisStage = this.Stage,
  thisSnake = this.Snake;
  // 뱀 전체 DOM 만들기
  const snake = document.createElement('div');
  snake.className = 'snake';
  thisSnake.el = snake;
  // 뱀 머리 DOM 만들기
  const head = document.createElement('div');
  head.className = 'head right';
  // 뱀 기본값 세팅
  const thisX = Math.floor(thisStage.width / 2) - pS,
  thisY = Math.floor(thisStage.height / 2) - pS;
  head.style.top = thisY + 'px';
  head.style.left = thisX + 'px';
  thisSnake.vector = [1,0];
  // 뱀 객체에 머리 추가
  thisSnake.head = new this.pixelBase(head, [thisX, thisY]);
  // 뱀 DOM 그리기
  thisSnake.el.appendChild(head);
  thisStage.el.appendChild(snake);
  // 뱀 몸통 추가
  this.addSnakeBody();
  // 먹이 그리기
  this.drawFood();
};

// 먹이 그리기
Game.drawFood = function(){
  const thisStage = this.Stage,
  thisSnake = this.Snake;
  // 먹이 DOM 만들기
  const food = document.createElement('div');
  food.className = 'food';
  // 먹이 위치 잡기 메소드
  const setFoodPosition = function(maxW, maxH){
    let isEmpty = true;
    // 랜덤값 계산
    const randX = Math.random() * (maxW - 1),
    randY = Math.random() * (maxH - 1),
    posX = 30 * Math.floor(randX),
    posY = 30 * Math.floor(randY);
    // 반복문 - 개선사항 : false 가 한번이라도 감지되면 루프를 그만돌게
    if ((thisSnake.head.pos[0] === posX) && (thisSnake.head.pos[1]) === posY) {
      isEmpty = false;
    } else {
      thisSnake.body.forEach (bodyItem => {
        if ((bodyItem.pos[0] === posX) && (bodyItem.pos[1]) === posY) {
          isEmpty = false;
        }
      });
    }
    if (isEmpty) {
      return [posX, posY];
    } else {
      return setFoodPosition(maxW, maxH);
    }
  };
  
  let pos = setFoodPosition(thisStage.width/thisStage.pixelSize, thisStage.height/thisStage.pixelSize);

  // 먹이 세팅
  this.Food = new this.pixelBase(food, pos);
  food.style.top =  pos[1] + 'px';
  food.style.left = pos[0] + 'px';
  // 먹이 DOM 그리기
  thisStage.el.appendChild(food);
};

// 몸통 추가
Game.addSnakeBody = function(){
  const snakeHead= this.Snake.head,
  snakeBody = this.Snake.body;
  let posX, posY = 0;
  // 뱀 길이 체크
  if (snakeBody.length > 0) {
    // 몸통이 1개라도 있는 경우
    posX = snakeBody[snakeBody.length-1].pos[0] + (this.Snake.vector[0] * -30);
    posY = snakeBody[snakeBody.length-1].pos[1] + (this.Snake.vector[1] * -30);
  } else {
    // 현재 머리만 있는 경우
    posX = snakeHead.pos[0] + (this.Snake.vector[0] * -30);
    posY = snakeHead.pos[1] + (this.Snake.vector[1] * -30);
  }
  // 새로운 몸통 DOM 만들기
  const body = document.createElement('div');
  body.className = 'body';
  body.style.top = posY + 'px';
  body.style.left = posX + 'px';
  // 뱀 객체에 몸통 추가
  this.Snake.body.push(new this.pixelBase(body, [posX, posY]));
  // 뱀 몸통 DOM 그리기
  this.Snake.el.appendChild(body);
};

// 먹이 먹기
Game.eatFood = function(){
  console.log('Eat!');
  // 먹이 지우고 그리기
  this.Stage.el.removeChild(this.Food.el);
  this.drawFood();
  // 뱀 몸통 추가
  this.addSnakeBody();
};

// 충돌 체크
Game.checkCollision = function(headX, headY){
  const thisStage = this.Stage,
  thisSnake = this.Snake;
  let isCollision = false;
  if ((headX > thisStage.maxPosX) || (headY > thisStage.maxPosY) || (headX < 0) || (headY < 0)) {
    // next값이 스테이지를 넘어가는지 체크
    isCollision = true;
  } else {
    // 머리가 몸통과 충돌하는지 체크
    thisSnake.body.forEach(bodyItem => {
      if ((headX === bodyItem.pos[0]) && (headY === bodyItem.pos[1])) {
        isCollision = true;
      }
    });
  }
  return isCollision;
};

// 뱀 움직임
Game.snakeMoving = function(){
  const thisStage = this.Stage,
  thisSnake = this.Snake;
  let moveKey = '';

  moveKey = setInterval(()=>{
    let nextX, nextY = 0,
    tempX, tempY = 0,
    movingTarget = "";
    // 움직이는 타겟 지정 - 처음엔 머리
    movingTarget = thisSnake.head;
    // temp에 기존값 저장
    tempX = thisSnake.head.pos[0];
    tempY = thisSnake.head.pos[1];
    // next에 다음값 계산해서 저장
    nextX = tempX + (thisStage.pixelSize * thisSnake.vector[0]);
    nextY = tempY + (thisStage.pixelSize * thisSnake.vector[1]);
    // 뱀머리의 충돌 체크
    if (this.checkCollision(nextX, nextY)) {
      // 충돌 시
      alert('END');
      clearInterval(moveKey);
    } else {
      // 기본 상황
      // 움직이는 타겟 DOM에 위치값 지정
      movingTarget.el.style.left = nextX + 'px';
      movingTarget.el.style.top = nextY + 'px';
      // 그 위치값 저장
      thisSnake.head.pos[0] = nextX;
      thisSnake.head.pos[1] = nextY;
      // 머리가 먹이에 닿는지 체크
      if ((nextX === this.Food.pos[0]) && (nextY === this.Food.pos[1])) {
        // 먹이 먹기
        this.eatFood();
      }
      // 움직이는 타겟 변경 - 몸통
      movingTarget = thisSnake.body;
      if (movingTarget.length > 0) {
        // 몸통 전체 순환하며 위치값 지정
        movingTarget.forEach(bodyItem => {
          // 다음 이동값에 temp값(이전 헤드/몸통 위치값) 지정
          nextX = tempX;
          nextY = tempY;
          // temp에 현재 타겟의 기존값 저장
          tempX = bodyItem.pos[0];
          tempY = bodyItem.pos[1];
          // 현재 타겟 몸통 DON에 위치값 지정
          bodyItem.el.style.left = nextX + 'px';
          bodyItem.el.style.top = nextY + 'px';
          // 그 위치값 저장
          bodyItem.pos[0] = nextX;
          bodyItem.pos[1] = nextY;
        });
      }
    }
  }, 200);
};

// 키보드로 방향 지정
Game.setDirection = function(keyCode){
  const thisKeyCode = keyCode;
  // 방향 지정 : spance바는 게임 시작
  switch (thisKeyCode) {
    case 32 :
      // spacebar
      if (!this.Stage.isPlaying) {
        this.Stage.isPlaying = true;
        console.log('START');
        this.snakeMoving();
      }
      break;
    case 37 :
      if (this.Snake.vector[0] !== 1) {
        console.log('left');
        this.Snake.vector = [-1,0];
        this.Snake.head.el.className = 'head left';
      }
      break;
    case 38 :
      if (this.Snake.vector[1] !== 1) {
        console.log('up');
        this.Snake.vector = [0,-1];
        this.Snake.head.el.className = 'head up';
      }
      break;
    case 39 :
      if (this.Snake.vector[0] !== -1) {
        console.log('right');
        this.Snake.vector = [1,0];
        this.Snake.head.el.className = 'head right';
      }
      break;
    case 40 :
      if (this.Snake.vector[1] !== -1) {
        console.log('down');
        this.Snake.vector = [0,1];
        this.Snake.head.el.className = 'head down';
      }
      break;
  }
};

Game.init = function(){
  // 게임 기본값
  const pixelSize = 30,
        width = pixelSize * 22,
        height = pixelSize * 22;

  // 게임 세팅
  this.initStage(width, height, pixelSize);
};

Game.init();