const canvas = document.getElementById("canvams");
const ctx = canvas.getContext("2d");
const img = document.getElementById("playerguy");
const ast = document.getElementById("asteroid1");
const ast2 = document.getElementById("asteroid2");
const ast3 = document.getElementById("asteroid3");
const player_speed = 10;
let gamerunning = true;
function random_man(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
ctx.scale(0.3, 0.3);
const keys_pressed = {};
if (img.complete) { ctx.drawImage(img, 0, 0); } else { img.onload = function() { ctx.drawImage(img, 0, 0); }; }
document.addEventListener('keydown', (event) => {
keys_pressed[event.key] = true;
if (keys_pressed['d']) { speed_x = player_speed; }
if (keys_pressed['a']) { speed_x = 0 - player_speed; }
if (keys_pressed['s']) { speed_y = player_speed; }
if (keys_pressed['w']) { speed_y = 0 - player_speed; }
});
document.addEventListener('keyup', (event) => {
keys_pressed[event.key] = false; 
if (!keys_pressed['d'] && !keys_pressed['a']) {if (speed_x > 0) {speed_x = speed_x - 3;}}
if (!keys_pressed['w'] && !keys_pressed['s']) {if (speed_y > 0) {speed_y = speed_y - 3;}}
});
window.addEventListener('blur', () => {
for (let key in keys_pressed) { keys_pressed[key] = false; }
speed_x = 0;
speed_y = 0;
});
let player_x = 0;
let player_y = 850;
let speed_x = 0;
let speed_y = 0;
let met_x = 0;
let met_y = -30;
let random_dn = 1;
let change_x = 0
met_x = random_man(0, canvas.width/0.3);
function check_collision(img1, x1, y1, img2, x2, y2) {
let w1 = img1.naturalWidth || img1.width;
let h1 = img1.naturalHeight || img1.height;
let w2 = img2.naturalWidth || img2.width;
let h2 = img2.naturalHeight || img2.height;
if (x1 + w1 < x2 || x2 + w2 < x1 || y1 + h1 < y2 || y2 + h2 < y1) return false;
let o_x = Math.max(x1, x2);
let o_y = Math.max(y1, y2);
let o_w = Math.min(x1 + w1, x2 + w2) - o_x;
let o_h = Math.min(y1 + h1, y2 + h2) - o_y;
if (o_w <= 0 || o_h <= 0) return false;
let off_canvas = document.createElement('canvas');
off_canvas.width = o_w;
off_canvas.height = o_h;
let off_ctx = off_canvas.getContext('2d');
off_ctx.drawImage(img1, o_x - x1, o_y - y1, o_w, o_h, 0, 0, o_w, o_h);
let data1 = off_ctx.getImageData(0, 0, o_w, o_h).data;
off_ctx.clearRect(0, 0, o_w, o_h);
off_ctx.drawImage(img2, o_x - x2, o_y - y2, o_w, o_h, 0, 0, o_w, o_h);
let data2 = off_ctx.getImageData(0, 0, o_w, o_h).data;
for (let i = 3; i < data1.length; i += 4) {
if (data1[i] > 0 && data2[i] > 0) return true;
}
return false;
}
function animate() {
ctx.clearRect(0, 0, canvas.width / 0.3, canvas.height / 0.3);
player_x += speed_x;
player_y += speed_y;
ctx.drawImage(img, player_x, player_y);
let current_ast = ast;
if (random_dn == 1) { ctx.drawImage(ast, met_x, met_y); current_ast = ast; }
if (random_dn == 2) { ctx.drawImage(ast2, met_x, met_y); current_ast = ast2; }
if (random_dn == 3) { ctx.drawImage(ast3, met_x, met_y); current_ast = ast3; }
if (check_collision(img, player_x, player_y, current_ast, met_x, met_y)) {
console.log("collision poo poo");
gamerunning = false;
}
if (met_y < canvas.height / 0.3) { met_y = met_y + 10; met_x = met_x + change_x; } else { met_y = -500; met_x = random_man(0, canvas.width/0.3); random_dn = random_man(1, 3); change_x = random_man(-2,2);}
if (gamerunning){requestAnimationFrame(animate);}
}
animate();
