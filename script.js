const canvas = document.getElementById("canvams");
const ctx = canvas.getContext("2d");
const img = document.getElementById("playerguy");
const playerspeed = 20;
ctx.scale(0.1, 0.1);
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
    if (keysPressed['a']) { angle -= 0.05; }
    if (keysPressed['d']) { angle += 0.05; }
    if (keysPressed['w']) { speed = playerspeed; }
    if (keysPressed['s']) { speed = -playerspeed; }
});
document.addEventListener('keyup', (event) => {
  keysPressed[event.key] = false;
  if (keysPressed != true) {
    speedx=0
    speedy=0
  }

});
window.addEventListener('blur', () => {
  for (let key in keysPressed) {
    keysPressed[key] = false;
  }
});

let playerx = 0
let playery = 0
let angle = 0;
let speed = 0;


function animate() {
    ctx.clearRect(0, 0, canvas.width * 10, canvas.height * 10);
    ctx.drawImage(img, playerx, playery);
    playerx += speedx;
    playery += speedy;
    requestAnimationFrame(animate);
}
animate()