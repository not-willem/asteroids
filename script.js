const canvas = document.getElementById("canvams");
const ctx = canvas.getContext("2d");
const img = document.getElementById("playerguy");
const ast = document.getElementById("asteroid1");
const ast2 = document.getElementById("asteroid2");
const ast3 = document.getElementById("asteroid3");
const playerspeed = 10;

function randomman(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

ctx.scale(0.3, 0.3);
const keysPressed = {};

if (img.complete) {
    ctx.drawImage(img, 0, 0);
} else {
    img.onload = function() {
        ctx.drawImage(img, 0, 0);
    };
}

document.addEventListener('keydown', (event) => {
    keysPressed[event.key] = true;
    if (keysPressed['d']) { speedx = playerspeed; }
    if (keysPressed['a']) { speedx = 0 - playerspeed; }
    if (keysPressed['s']) { speedy = playerspeed; }
    if (keysPressed['w']) { speedy = 0 - playerspeed; }
});

document.addEventListener('keyup', (event) => {
    keysPressed[event.key] = false;
    if (!keysPressed['d'] && !keysPressed['a']) speedx = 0;
    if (!keysPressed['w'] && !keysPressed['s']) speedy = 0;
});

window.addEventListener('blur', () => {
    for (let key in keysPressed) {
        keysPressed[key] = false;
    }
    speedx = 0;
    speedy = 0;
});

let playerx = 0;
let playery = 850;
let speedx = 0;
let speedy = 0;
let metx = 0;
let mety = -30;
let randomdn = 1;
metx = randomman(0, canvas.width/0.3);
function animate() {
    ctx.clearRect(0, 0, canvas.width / 0.3, canvas.height / 0.3);
    
    playerx += speedx;
    playery += speedy;
    
    ctx.drawImage(img, playerx, playery);
    
    if (randomdn == 1) {
      ctx.drawImage(ast, metx, mety);
    }
    if (randomdn == 2) {
      ctx.drawImage(ast2, metx, mety);
    }
    if (randomdn == 3) {
      ctx.drawImage(ast3, metx, mety);
    }
    
    if (mety < canvas.height / 0.3) {
      mety = mety + 10
    } else {
      mety = -30
      metx = randomman(0, canvas.width/0.3);
      randomdn = randomman(1, 3)
    }
    
    requestAnimationFrame(animate);
}
animate();
