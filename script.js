let mouse_x = 0;
let mouse_y = 0;
let score = 0;
const scoreman = document.getElementById("score");
scoreman.textContent = "Score: "+score;
const canvas = document.getElementById("canvams");
const ctx = canvas.getContext("2d", { willReadFrequently: true });
const img = document.getElementById("playerguy");
const ast = document.getElementById("asteroid1");
const ast2 = document.getElementById("asteroid2");
const ast3 = document.getElementById("asteroid3");
const player_speed = 10;
let gamerunning = true;
const Music1 = new Audio('Game sounds/Music/Music1.ogg');

let current_ast = ast;

const mask_cache = new Map();

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
let proj_x = 0;
let proj_y = 0;

met_x = random_man(0, canvas.width / 0.3);

function shootpewpew(mx,my) {
    const proj_x = current.x + Math.sign(target.x - current.x);
    const proj_y = current.y + Math.sign(target.y - current.y);
    return { x, y };
}

function get_drawn_size(image) {
    return {
        w: image.naturalWidth || image.width,
        h: image.naturalHeight || image.height
    };
}

function get_mask(image) {
    if (mask_cache.has(image)) return mask_cache.get(image);
    const w = image.naturalWidth || image.width;
    const h = image.naturalHeight || image.height;
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const cx = c.getContext('2d', { willReadFrequently: true });
    cx.drawImage(image, 0, 0);
    const mask = cx.getImageData(0, 0, w, h).data;
    const entry = { mask, w, h };
    mask_cache.set(image, entry);
    return entry;
}

function check_collision(img1, x1, y1, img2, x2, y2) {
    const m1 = get_mask(img1);
    const m2 = get_mask(img2);

    const o_x = Math.max(x1, x2);
    const o_y = Math.max(y1, y2);
    const o_w = Math.min(x1 + m1.w, x2 + m2.w) - o_x;
    const o_h = Math.min(y1 + m1.h, y2 + m2.h) - o_y;

    if (o_w <= 0 || o_h <= 0) return false;

    for (let row = 0; row < o_h; row++) {
        for (let col = 0; col < o_w; col++) {
            const ix1 = (o_x - x1) + col;
            const iy1 = (o_y - y1) + row;
            const ix2 = (o_x - x2) + col;
            const iy2 = (o_y - y2) + row;
            const a1 = m1.mask[(iy1 * m1.w + ix1) * 4 + 3];
            const a2 = m2.mask[(iy2 * m2.w + ix2) * 4 + 3];
            if (a1 > 0 && a2 > 0) return true;
        }
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
document.addEventListener('click', (event) => {
    const s = get_drawn_size(current_ast);
    const hit = mouse_x >= met_x && mouse_x <= met_x + s.w &&
                mouse_y >= met_y && mouse_y <= met_y + s.h;
    if (hit) {
        met_y = -500;
        met_x = random_man(0, canvas.width / 0.3);
        random_dn = random_man(1, 3);
        change_x = random_man(-2, 2);
        score = score + 1;
        const scoreman = document.getElementById("score");
        scoreman.textContent = "Score: "+score;
        return;
    }
    Music1.play();
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

    if (random_dn == 1) { ctx.drawImage(ast, met_x, met_y); current_ast = ast; }
    if (random_dn == 2) { ctx.drawImage(ast2, met_x, met_y); current_ast = ast2; }
    if (random_dn == 3) { ctx.drawImage(ast3, met_x, met_y); current_ast = ast3; }

    if (check_collision(img, player_x, player_y, current_ast, met_x, met_y)) {
        console.log("collision poo poo");
        gamerunning = false;
        const scoreman = document.getElementById("score");
        scoreman.textContent = "Game Over!";
        document.body.innerHTML += '<button id="restart">Play Again?</button>';
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
        score = score - 2;
        const scoreman = document.getElementById("score");
        scoreman.textContent = "Score: "+score;
    }
    ctx.fillStyle = "red";
    ctx.fillRect(mouse_x, mouse_y, 10, 10);
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
