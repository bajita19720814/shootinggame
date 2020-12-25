'use strict';
(() => {
  const canvas = document.querySelector("canvas");
  if (typeof canvas.getContext === "undefined") {
    return;
  }
  const container = document.getElementById('container');
  const instruction = document.getElementById('instruction');
  const colors = [{c: "pink", v: 3}, {c: "palegreen", v: 3.5}, {c: "aqua", v: 2}, {c: "yellow", v: 2.5}];
  let isGaming = false;
  container.addEventListener('click', () => {
    if(isGaming) {
      return;
    }
    isGaming = true;
    instruction.classList.add('hide');
    canvas.classList.remove('hide');
    new Game(canvas);
  });
  class BoatBullet {
    constructor(canvas, x, y, game) {
      this.game = game;
      this.canvas = canvas;
      this.ctx = this.canvas.getContext('2d');
      this.x = x;
      this.y = y;
      this.r = 5;
      this.vy = -5;
      this.isHit = false;
    }
    draw() {
      if (this.isHit) {
        return;
      }
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      this.ctx.fillStyle = "#fff";
      this.ctx.fill();
    }
    update(index) {
      if (this.isHit) {
        return;
      }
      this.y += this.vy;
      this.game.checkHit(this.x, this.y, index);
      if (this.y - 5 < 0) {
        this.game.removeBullet(index);
      }
    }
    setIsHit() {
      this.isHit = true;
    }
    
  }
  class E_Bullet {
    constructor(canvas, x, y, game, colorIndex, enemy) {
      this.game = game;
      this.enemy = enemy;
      this.canvas = canvas;
      this.ctx = this.canvas.getContext('2d');
      this.x = x;
      this.y = y;
      this.r = 5;
      this.color = colors[colorIndex].c;
      this.vy = colors[colorIndex].v;
      this.isHit = false;
    }
    draw() {
      if (this.isHit) {
        return;
      }
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      this.ctx.fillStyle = this.color;
      this.ctx.fill();
    }
    update(index) {
      if (this.isHit) {
        return;
      }
      this.y += this.vy;
      if (this.y - 5 > 320) {
        this.enemy.removeBullet(index);
      }
      this.game.checkGameOver(this.x, this.y);
    }
    
  }
  class Boat {
    constructor(canvas, game) {
      this.game = game;
      this.canvas = canvas;
      this.ctx = this.canvas.getContext('2d');
      this.x = this.canvas.width / 2;
      this.mouseX = this.x;
      this.y = 280;
      this.r = 30;
      this.boatBullets = [];
      this.canvas.addEventListener('click', () => {
        this.boatBullets.push(new BoatBullet(this.canvas, this.x, this.y, this.game));
      });
    } 
    checkGameOver(x, y) {
      if (this.y + 15 > y - 5 && this.y < y + 5 && this.x + 15 > x - 5 && this.x - 15 < x + 5 ) {
        this.game.setGameOver();
      }
    }
    removeBullet(index) {
      this.boatBullets[index].setIsHit();
      this.boatBullets.splice(index, 1);
    } 
    getBortX() {
      return this.x;
    }
    draw() {
      this.ctx.beginPath();
      this.ctx.ellipse(this.x - this.r / 2, this.y, this.r / 2, this.r, 0, 0, Math.PI / 2);
      this.ctx.lineTo(this.x + this.r /2, this.y + this.r);
      this.ctx.ellipse(this.x + this.r / 2, this.y, this.r / 2, this.r, 0, Math.PI / 2, Math.PI);
      this.ctx.fillStyle = "#fff";
      this.ctx.fill();
      this.boatBullets.forEach(boatBullet => {
        boatBullet.draw();
      });
     
    }
    update() {
      document.addEventListener('mousemove', e => {
        const rect = this.canvas.getBoundingClientRect();
        this.MouseX = e.clientX - rect.left;
      });
      this.x = this.MouseX;
      if (this.x < this.r / 2) {
        this.x = this.r / 2;
      }
      if (this.x > this.canvas.width - this.r / 2) {
        this.x = this.canvas.width - this.r / 2;
      }
      this.boatBullets.forEach((boatBullet, index)=> {
        boatBullet.update(index);
      });
    }
  }
  class Enemy {
    constructor(canvas, game) {
      this.canvas = canvas;
      this.ctx = this.canvas.getContext('2d');
      this.x = (Math.random() * 200) + 60;
      this.y = (Math.random() * 100) + 50;
      this.colorIndex = Math.floor(Math.random() * 4);
      this.color = colors[this.colorIndex].c;
      this.game = game;
      this.isHit = false;
      this.e_Bullets = [];
      this.adde_bullet();
    }
    removeBullet(index) {
      this.e_Bullets.splice(index, 1);
    }
    adde_bullet() {
      this.e_Bullets.unshift(new E_Bullet(this.canvas,this.x, this.y, this.game, this.colorIndex, this));
      setTimeout(() => {
        this.adde_bullet();
      }, Math.random() * 1000 + 500);
    }
    draw() {
      if (this.isHit) {
        return;
      }
      this.ctx.beginPath();
      this.ctx.moveTo(this.x - 15, this.y - 20);
      this.ctx.lineTo(this.x - 15, this.y - 10);
      this.ctx.lineTo(this.x - 5, this.y - 10);
      this.ctx.lineTo(this.x - 5, this.y);
      this.ctx.lineTo(this.x + 5, this.y);
      this.ctx.lineTo(this.x + 5, this.y - 10);
      this.ctx.lineTo(this.x + 15, this.y - 10);
      this.ctx.lineTo(this.x + 15, this.y - 20);
      this.ctx.lineTo(this.x - 15, this.y - 20);
      this.ctx.fillStyle = this.color;
      this.ctx.fill(); 
      this.e_Bullets.forEach(e_bullet => {
        e_bullet.draw();
      });   
    }
    update() {
      if (this.isHit) {
        return;
      }
      do {
        this.x += (Math.random() * 50) - 25;
      } while (this.x < 15 || this.x > this.canvas.width - 15);
      this.e_Bullets.forEach((e_bullet, index) => {
        e_bullet.update(index);
      });
    }
    checkHit(x, y, index, e_index) {
      if (this.y - 10 > y - 5 && this.y - 20 < y + 5 && this.x + 15 > x - 5 && this.x - 15 < x + 5) {
        this.isHit = true; 
        this.game.removeEnemy(e_index);
        this.game.removeBullet(index);
        this.game.addEnemy();
      }
    }
    
  }
  class Game {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = this.canvas.getContext('2d');
      this.boat = new Boat(this.canvas, this);
      this.enemys = [];
      this.addEnemy();
      this.moreEnemy();
      this.loop();
      this.isGameOver = false;
      this.score = 0;
    }
    checkGameOver(x, y) {
      this.boat.checkGameOver(x, y);
    }
    removeEnemy(e_index) {
      this.enemys.splice(e_index, 1);
      this.score++; 
    }
    removeBullet(index) {
      this.boat.removeBullet(index);
    }
    checkHit(x, y, index) {
      this.enemys.forEach((enemy, e_index) => {
        enemy.checkHit(x, y, index, e_index);
      });
    }
    setGameOver() {
      this.isGameOver = true;
    }
    addEnemy() {
      this.enemys.unshift(new Enemy(this.canvas, this));
    }
    moreEnemy() {
      setTimeout(() => {
        this.enemys.unshift(new Enemy(this.canvas, this));
        this.moreEnemy();
      }, 10000);
    }
    loop() {
      if (this.isGameOver) {
        return;
      }
      this.update();
      this.draw();
      requestAnimationFrame(() => {
        this.loop();
      });
    }
    update() {
      this.boat.update();
      this.enemys.forEach((enemy) => {
        enemy.update();
      });
    }
    draw() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (this.isGameOver) {
        this.drawGameOver();
        return;
      }      
      this.boat.draw();
      this.enemys.forEach(enemy => {
        enemy.draw();
      });
      this.renderScore();
    }
    drawGameOver() {
      this.ctx.font = '28px "Arial Black"';
      this.ctx.fillStyle = 'pink';
      this.ctx.fillText('GAME OVER!', 60, 140);
      this.ctx.fillText(`SCORE : ${String(this.score).padStart(2, " ")}`, 75, 200);
    }
    renderScore() {
      this.ctx.font = '16px Arial';
      this.ctx.fillStyle = "#fff";
      this.ctx.fillText(this.score, 5, 21);
    }
  }
}) ();
