let mouse_x = 0;
let mouse_y = 0;

const canvas = document.getElementById("canvams");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const img = document.getElementById("playerguy");
const ast = document.getElementById("asteroid1");
const ast2 = document.getElementById("asteroid2");
const ast3 = document.getElementById("asteroid3");
const player_speed = 10;
let gamerunning = true;
const Music1 = new Audio('Game sounds/Music/Music1.ogg');
Music1.play();

function random_man(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

ctx.scale(0.3, 0.3);

const keys_pressed = {};

let player_x = 0;
let player_y = 850;
let speed_x = 0;
let speed_y = 0;
let met_x = 0;
let met_y = -30;
let random_dn = 1;
let change_x = 0;

met_x = random_man(0, canvas.width / 0.3);

function get_drawn_size(image) {
    return {
        w: image.naturalWidth || image.width,
        h: image.naturalHeight || image.height
    };
}

function check_collision(img1, x1, y1, img2, x2, y2) {
    const s1 = get_drawn_size(img1);
    const s2 = get_drawn_size(img2);

    const w1 = s1.w, h1 = s1.h;
    const w2 = s2.w, h2 = s2.h;

    if (x1 + w1 < x2 || x2 + w2 < x1 || y1 + h1 < y2 || y2 + h2 < y1) return false;

    const o_x = Math.max(x1, x2);
    const o_y = Math.max(y1, y2);
    const o_w = Math.min(x1 + w1, x2 + w2) - o_x;
    const o_h = Math.min(y1 + h1, y2 + h2) - o_y;

    if (o_w <= 0 || o_h <= 0) return false;

    const off_canvas = document.createElement('canvas');
    off_canvas.width = o_w;
    off_canvas.height = o_h;
    const off_ctx = off_canvas.getContext('2d');

    off_ctx.clearRect(0, 0, o_w, o_h);
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

document.addEventListener('keydown', (event) => {
    keys_pressed[event.key] = true;
    if (keys_pressed['d'] || keys_pressed['D']) { speed_x = player_speed; }
    if (keys_pressed['a'] || keys_pressed['A']) { speed_x = -player_speed; }
    if (keys_pressed['s'] || keys_pressed['S']) { speed_y = player_speed; }
    if (keys_pressed['w'] || keys_pressed['W']) { speed_y = -player_speed; }
});
canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const css_x = event.clientX - rect.left;
    const css_y = event.clientY - rect.top;
    mouse_x = css_x / 0.3;
    mouse_y = css_y / 0.3;
});
document.addEventListener('keyup', (event) => {
    keys_pressed[event.key] = false;
    if (!keys_pressed['d'] && !keys_pressed['a'] && !keys_pressed['D'] && !keys_pressed['A']) { speed_x = 0; }
    if (!keys_pressed['w'] && !keys_pressed['s'] && !keys_pressed['W'] && !keys_pressed['S']) { speed_y = 0; }
});

window.addEventListener('blur', () => {
    for (let key in keys_pressed) { keys_pressed[key] = false; }
    speed_x = 0;
    speed_y = 0;
});

function animate() {
    if (!gamerunning) return;

    ctx.clearRect(0, 0, canvas.width / 0.3, canvas.height / 0.3);

    let next_x = player_x + speed_x;
    let next_y = player_y + speed_y;

    const s = get_drawn_size(img);
    if (next_x >= 0 && next_x + s.w <= canvas.width / 0.3) { player_x = next_x; }
    if (next_y >= 0 && next_y + s.h <= canvas.height / 0.3) { player_y = next_y; }

    ctx.drawImage(img, player_x, player_y);

    let current_ast = ast;
    if (random_dn == 1) { ctx.drawImage(ast, met_x, met_y); current_ast = ast; }
    if (random_dn == 2) { ctx.drawImage(ast2, met_x, met_y); current_ast = ast2; }
    if (random_dn == 3) { ctx.drawImage(ast3, met_x, met_y); current_ast = ast3; }

    if (check_collision(img, player_x, player_y, current_ast, met_x, met_y)) {
        console.log("collision poo poo");
        gamerunning = false;
        return;
    }

    if (met_y < canvas.height / 0.3) {
        met_y = met_y + 10;
        met_x = met_x + change_x;
    } else {
        met_y = -500;
        met_x = random_man(0, canvas.width / 0.3);
        random_dn = random_man(1, 3);
        change_x = random_man(-2, 2);
    }

    requestAnimationFrame(animate);
}

let images_loaded = 0;
const total_images = 4;
function on_image_load() {
    images_loaded++;
    if (images_loaded >= total_images) {
        animate();
    }
}

if (img.complete) on_image_load(); else img.onload = on_image_load;
if (ast.complete) on_image_load(); else ast.onload = on_image_load;
if (ast2.complete) on_image_load(); else ast2.onload = on_image_load;
if (ast3.complete) on_image_load(); else ast3.onload = on_image_load;
