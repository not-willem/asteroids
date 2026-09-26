const canvas = document.getElementById("canvams");
const ctx = canvas.getContext("2d");
const img = document.getElementById("playerguy");
const playerspeed = 10;
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
    if (keysPressed['d']) {
        speedx = playerspeed;
    }
    if (keysPressed['a']) {
        speedx = 0 - playerspeed;
    }
    if (keysPressed['s']) {
        speedy = playerspeed;
    }
    if (keysPressed['w']) {
        speedy = 0 - playerspeed;
    }
});

document.addEventListener('keyup', (event) => {
    keysPressed[event.key] = false;
    if (keysPressed != true) {
        speedx = 0
        speedy = 0
    }
});

window.addEventListener('blur', () => {
    for (let key in keysPressed) {
        keysPressed[key] = false;
    }
});

let playerx = 0
let playery = 0
let speedx = 0
let speedy = 0

function animate() {
    ctx.clearRect(0, 0, canvas.width * 30, canvas.height * 30);
    ctx.drawImage(img, playerx, playery);
    playerx += speedx;
    playery += speedy;
    requestAnimationFrame(animate);
}

animate()
