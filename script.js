const canvas = document.getElementById("canvams");
const ctx = canvas.getContext("2d");
const img = document.getElementById("playerguy");
ctx.scale(0.1, 0.1);
if (img.complete) {
  ctx.drawImage(img, 0, 0);
} else {
  img.onload = function() {
    ctx.drawImage(img, 0, 0);
    
  };
}
