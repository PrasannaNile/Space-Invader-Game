const canvas = document.querySelector('#canvas');
const c = canvas.getContext('2d');
const playerShoot = new Audio('img/playerShoot.wav');
const bulletCollect = new Audio('img/bullet.wav')

var pause = false;
var play = true;



function gamePause(){
  if(play) play = false;
  else play = true;
}



canvas.width = 1024;
canvas.height = 576;

class Player{
  constructor(){
    this.velocity = {leftx: 0, rightx: 0};
    this.position = {
      x: 0,
      y: 0
    };
    this.opacity = 1;
    this.rotation = 0;
    const image = new Image();
    image.src = 'img/spaceship3.png';
    image.onload = ()=>{
      const scale = .07;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;

      this.position = {
        x: canvas.width/2 - this.width/2,
        y: canvas.height - this.height - 40
      };

    }
  }

  playerPos(){
    return this.position;
  }

  draw(){
    c.save();
    c.globalAlpha = this.opacity;
    c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    c.restore();
  }

  update(){
    if(this.image) {
      this.draw();
    }
  }

}

class HealthBar extends Player{
  constructor(){
    super()
    var pos = this.playerPos();
    this.position = {x : pos.x, y : pos.y};
    this.velocity = 0;
    this.width = 80;
  }

  draw(){
    c.fillStyle = 'green';
    c.fillRect(this.position.x - 5, this.position.y + this.height, this.width, 6);
    c.fillStyle = 'white';
    c.strokeRect(this.position.x - 5, this.position.y + this.height, 50, 6);
  }

  removeHealth(){
    c.fillStyle = 'black'
  }

  update(){
    this.position.x += this.velocity;
    this.draw();
  }

}

class Bullets{
  constructor(){
    this.velocity = {x : 0, y : 3};
    this.position = {
      x: Math.random() * canvas.width,
      y: -250
    };
    this.opacity = 1;
    const image = new Image();
    image.src = 'img/bullet.png';
    image.onload = ()=>{
      const scale = .04;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;

    }
  }

  draw(){
    c.save();
    c.globalAlpha = this.opacity;
    c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    c.restore();
  }

  update(){
    this.position.y += this.velocity.y;
    if(this.image) {
      this.draw();
    }
  }

}




class Invader{
  constructor({ position }){
    this.position = {x: 0, y: 0};
    this.velocity = {x: 0, y: 0};
    const image = new Image();
    image.src = 'img/enemy1.png';
    image.onload = ()=>{
      const scale = .13;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;

      this.position = {
        x: position.x,
        y: position.y
      };

    }
  }

  draw(){
    c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
  }

  update({velocity}){
    if(this.image) {
      this.draw();
      this.position.x += velocity.x;
      this.position.y += velocity.y;
    }
  }

  shoot(invaderProjectiles){
    invaderProjectiles.push(new InvaderProjectile({
      position: {x : this.position.x + this.width/2, y : this.position.y + this.height},
      velocity: {x : 0, y : 3}
    }))

  }

}



class Grid {
  constructor(){
    this.position = {
      x: 0, y: 0
    };
    this.velocity = {
      x: 3, y: 0.1
    }
    this.invaders = [];

    this.columns = Math.floor(Math.random() * 10 + 5);
    this.rows = Math.floor(Math.random() * 3 + 3)
    this.width = this.columns * 60;

    for (var i = 0; i < this.columns; i++) {
      for (var j = 0; j < this.rows; j++) {
        this.invaders.push(
          new Invader({
            position:{
              x: i*60,
              y: j*40
            }
          })
        );
      }
    }
  }

  update(){
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if(this.position.x + this.width >= canvas.width) this.velocity.x = -3;
    else if(this.position.x <= 0) this.velocity.x = 3;
  }
}




class Projectile{
  constructor( {position, velocity} ){
    this.position = position;
    this.velocity = velocity;
    this.radius = 3;
  }

  draw(){
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2);
    c.fillStyle = 'lightblue';
    c.fill();
    c.closePath();
  }

  update(){
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

}


class Explosion{
  constructor( {position, velocity, radius, color, fades} ){
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
    this.color = color;
    this.opacity = 1;
    this.fades = fades;
  }

  draw(){
    c.save();
    c.globalAlpha = this.opacity;
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
    c.restore();
  }

  update(){
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if(this.fades) this.opacity -= 0.01;
  }

}





class InvaderProjectile{
  constructor( {position, velocity} ){
    this.position = position;
    this.velocity = velocity;
    this.width = 3;
    this.height = 10;
  }

  draw(){
    c.fillStyle = 'yellow';
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update(){
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

}



function createParticles({object, color}){
  for (var x = 0; x < 10; x++) {
    particles.push(new Explosion({
      position:{x : object.position.x + object.width/2, y : object.position.y + object.height/2},
      velocity: {x : Math.random()*2, y : Math.random()*2},
      radius: Math.floor(Math.random() * 2 + 2),
      color: color || 'rgba(255,255,255,0.5)',
      fades: true
    }))
  }
}




const player = new Player();
const health = new HealthBar();
const projectiles = [];
const enemy = new Invader({position:{
  x: 0, y: 0
}})

var game = {
  over: false,
  active: true
}

const bullet = new Bullets();

const particles = [];

for (var x = 0; x < 200; x++) {
  particles.push(new Explosion({
    position:{x : Math.random() * canvas.width, y : Math.random() * canvas.height},
    velocity: {x : 0, y : 1},
    radius: Math.random(),
    color: 'white',
    fades: false
  }))
}


const invaderProjectiles = [];

const grids = [];
var frame = 0;
var frameInterval = Math.floor(Math.random() * 500 + 500);
let score = 0;
let bulletCount = 40;

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  space: {
    pressed: false
  }
}

function animation(){
  if(!game.active) return
  if(play){
    window.requestAnimationFrame(animation);
    c.fillStyle = 'rgba(5, 2, 28)';
    c.fillRect(0,0,canvas.width, canvas.height);
    player.update();
    health.update()

    if(bullet.position.y >= canvas.height) {
      bullet.position.y = -Math.random() * 1000 + 500;
      bullet.position.x = Math.random() * canvas.width;
      bullet.update();
    }

    if(bulletCount <= 10) bullet.update();
    if(bullet.position.y + bullet.height >= player.position.y &&
       bullet.position.x <= player.position.x + player.width &&
       bullet.position.x + bullet.width >= player.position.x){
         // bulletCollect.play();
         bulletCount += 40;
         bulletsNum.style.opacity = "1";
         bulletsNum.style.innerHTML = bulletCount;
         bullet.position.y = -500;
         bullet.position.x = Math.random() * canvas.width;
    }


    particles.forEach((particle, index)=>{
      if(particle.position.y - particle.radius >= canvas.height)  {
        setTimeout(()=>{
          particle.position.x = Math.random() * canvas.width;
          particle.position.y = -5;
        }, 0)
      }

      if(particle.opacity <= 0){
        setTimeout(()=>{
          particles.splice(index, 1);
        }, 0)
      }else particle.update();
    })

    invaderProjectiles.forEach((invaderProjectile, index)=>{
      invaderProjectile.update();
      if(invaderProjectile.position.y + invaderProjectile.height >= canvas.height){
        setTimeout(()=>{
          invaderProjectiles.splice(index, 1)
        }, 0)
      }else invaderProjectile.update()

      if(invaderProjectile.position.y + invaderProjectile.height >= player.position.y &&
          invaderProjectile.position.x + invaderProjectile.width >= player.position.x &&
          invaderProjectile.position.x + invaderProjectile.width <= player.position.x + player.width){
        fullScore.style.display = 'none';
        createParticles({
          object: player,
          color: 'red'
        })

        setTimeout(()=>{
          invaderProjectiles.splice(index, 1);
          game.over = true;
          player.opacity = 0;
          text.style.display = 'block';
          textScore.style.display =  'block';
          textScore.innerHTML = 'Score : ' + score;
          let highscore = score;

        }, 0)

        setTimeout(()=>{
          game.active = false;
        },2000)
      }

    })

    projectiles.forEach((projectile, index)=>{
      if(projectile.position.y === 0) projectiles.splice(index, 1);
      else projectile.update();
    })

    grids.forEach((grid, gridIndex)=>{
      grid.update();
      if(frame % 100 === 0 && grid.invaders.length > 0){
        for (var x = 0; x < Math.floor(Math.random() * 4 + 2); x++) {
          grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)
        }
      }
      grid.invaders.forEach((invader, i)=>{
          invader.update({velocity:grid.velocity});

          projectiles.forEach((projectile, j)=>{
            if(projectile.position.y - projectile.radius <= invader.position.y + invader.width &&
               projectile.position.y + projectile.radius >= invader.position.y &&
               projectile.position.x - projectile.radius <= invader.position.x + invader.width &&
               projectile.position.x + projectile.radius >= invader.position.x){
                 score += 10;
                 displayScore.textContent = score;
                 createParticles({
                   object: invader
                 });
                 setTimeout(()=>{
                   const invaderFound = grid.invaders.find((invader2)=>{
                     return invader2 === invader;
                   })
                   const projectileFound = projectiles.find((projectile2)=>{
                     return projectile2 === projectile;
                   })
                   grid.invaders.splice(i, 1);
                   projectiles.splice(j, 1);

                   if(grid.invaders.length > 0){
                     const firstInvader = grid.invaders[0];
                     const lastInvader = grid.invaders[grid.invaders.length-1];
                     grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width;
                     grid.position.x = firstInvader.position.x
                   }
                   else{
                     grids.splice(gridIndex, 1);
                   }
                 }, 0)
               }
          })
      })
    })


    if(keys.d.pressed){
      if(player.position.x <= canvas.width - player.width/2 - 50 ){
        player.rotation = .15;
        health.position.x = player.position.x;
        player.velocity.rightx += .2;
        player.position.x += player.velocity.rightx;
      }
    }else{
      player.rotation = 0;
      player.velocity.rightx = 0;
      health.velocity = 0;
    }

    if(keys.a.pressed ){
      if(player.position.x >= 5){
        player.rotation = -.15;
        health.position.x = player.position.x;
        player.velocity.leftx -= .2;
        player.position.x += player.velocity.leftx;

      }
    }else{
      player.rotation = 0;
      player.velocity.leftx = 0;
      health.velocity = 0;
    }

    if(frame % frameInterval === 0) {
      grids.push(new Grid());
      frame = 0;
      frameInterval = Math.floor(Math.random() * 500 + 600);
    }

    frame ++;
    bulletCollect.currentTime = 0;

  }

}

animation();

window.addEventListener('keydown', ({ key })=>{
  if(game.over) return
  switch (key){
    case 'ArrowLeft':
      keys.a.pressed = true;
      break;
    case 'ArrowRight':
      keys.d.pressed = true;
      break;
    case ' ':
      keys.space.pressed = true;
      if(bulletCount > 0){
        // bulletsNum.style.opacity = '.' + bulletCount;
        // if(bulletCount > 0) {
          bulletCount -= 1;
          playerShoot.play();
        // }
        bulletsNum.innerHTML = bulletCount;
        projectiles.push(new Projectile({
          position:{
            x: player.position.x + player.width/2,
            y: player.position.y
          },
          velocity:{
            x:0,
            y:-10
          }
        }))
      }else
      break;
  }
})


window.addEventListener('keyup', ({ key })=>{
  switch (key){
    case 'ArrowLeft':
      keys.a.pressed = false;
      break;
    case 'ArrowRight':
      keys.d.pressed = false;
      break;
    case ' ':
      keys.space.pressed = false;
      playerShoot.currentTime =  0;
      break;
  }
})
