const c = document.getElementById("game");
const draw = c.getContext("2d");
const palette = {
  background: "#111",
  foreground: "#fff"
}
const date = new Date();
let mousex = 0;
let mousey = 0;
let hover = [undefined, undefined];
let selected;
if (localStorage.getItem("data")) {
  selected = JSON.parse(localStorage.getItem("data"));
  if (selected[0] !== date.getFullYear()) {
    selected = [date.getFullYear()];
  }
} else {
  selected = [date.getFullYear()]
}
const circle = {
  position: [0, 0],
  stage: 0,
  enabled: false
}

let marginNum = 30;
let scaleNum = 30;
let r = c.height / 10;

function setup() {
  adjustSize();
  requestAnimationFrame(drawLoop);
}

function drawLoop() {
  setTimeout(() => {
    requestAnimationFrame(drawLoop);
  }, 1000 / 60);

  draw.fillStyle = palette.background;
  draw.fillRect(0, 0, c.width, c.height);

  draw.fillStyle = palette.foreground;
  let doeshover = false;
  for (let i = 0; i < 12; i++) {
    for (let j = 0; j < daysInMonth(i, date.getFullYear()); j++) {
      let color = palette.foreground;
      let today = date.getDate() - 1 == j && date.getMonth() == i;
      let hovering = dist(mousex, mousey, marginNum + scaleNum * j, marginNum + scaleNum * i) <= r;
      let checked = includes([i, j]);
      if (today) {
        color = "#4d4dff";
      }

      if (hovering) {
        color = "#ff4d4d";
        hover = [i, j];
        doeshover = true;
      }

      if (today && hovering) {
        color = "#ff4dff"
      }

      if (checked) {
        color = "#ffc524";
      }

      if (checked && today) {
        color = "#25fa00";
      }

      if (circle.position[0] == i && circle.position[1] == j && circle.enabled) {
        draw.strokeStyle = "#4d4dff";
        draw.lineWidth = 5 * (100 - circle.stage) / 100
        draw.beginPath();
        draw.arc(marginNum + scaleNum * j, marginNum + scaleNum * i, r * (circle.stage / 50 + 1), 0, Math.PI * 2);
        draw.stroke()
        if (circle.stage >= 100) {
          circle.enabled = false;
          circle.stage = 0;
        }
        circle.stage += 6;
      }

      draw.fillStyle = color;
      draw.beginPath();
      draw.arc(marginNum + scaleNum * j, marginNum + scaleNum * i, r, 0, Math.PI * 2);
      draw.fill()
      draw.fillStyle = palette.foreground;
    }
  }
  if (!doeshover) {
    hover = [undefined, undefined];
  }
}

function adjustSize() {
  c.width = window.innerWidth;
  c.height = window.innerHeight;
  marginNum = 30;
  if (marginNum * 2 + (c.height - marginNum * 2) / 11 * 30 <= c.width) {
    scaleNum = (c.height - marginNum * 2) / 11;
  } else {
    scaleNum = (c.width - marginNum * 2) / 30;
  }
  r = scaleNum / (31 / 9);
}

function daysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

function dist(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

window.onresize = adjustSize;
window.onload = setup;
document.onmousemove = (e) => {
  mousex = e.clientX;
  mousey = e.clientY;
}
document.onmousedown = (e) => {
  if (hover[0]) {
    console.log(hover)
    if (includes(hover)) {
      selected.splice(includes(hover), 1);
    } else {
      selected.push([hover[0], hover[1]]);
      circle.enabled = true;
      circle.position = hover;
      localStorage.setItem("data", JSON.stringify(selected));
    }
  }
}

function includes(arr) {
  for (let i = 0; i < selected.length; i++) {
    if (JSON.stringify(selected[i]) == JSON.stringify(arr)) {
      return i;
    }
  }
  return false;
}