const configList = ["craftV2Nether115"];
// 基础配置
var base = {
  type: "craftV2Nether115",
  blue: "#7FDBFF",
  yellow: "#FFDC00",
  red: "#85144b",
  green: "#2ECC40",
  white: "#fff",
  gray: "#AAAAAA",
  black: "#001f3f",
  width: 2,
  config: {},
  scale: 1,
  dx: 0,
  dz: 0
};

window.onload = () => {
  $draw.getCtx("canvas");
  $draw.setCanvas(isPhone() ? 3 : 1);
  get(base.type);

  mouseWheel("canvas", () => {
    base.scale = 0.95;
    $draw.setScale(base.scale);
    drawCanvse();
  }, () => {
    base.scale = 1.05;
    $draw.setScale(base.scale);
    drawCanvse();
  });
  mouseMove("canvas", () => {
    $draw.moveCanvas(base.dx, base.dz);
    drawCanvse();
  });
}
// 画图
function drawCanvse(scale = base.scale, dx = base.dx, dz = base.dz, value = base.config) {
  $draw.bg(base.white);
  $draw.recanvas();
  $draw.setRadius(value.radius);
  $draw.circles(base.gray, base.width);
  $draw.item(value.data);
}
// 初始化map大小
function initSize(r) {
  let w = document.body.clientWidth;
  let h = document.body.clientHeight;
  base.scale = (w - h ? h : w) / (2 * r) * 0.9;
  $draw.setScale(base.scale);
}
// 获取json文件
function get(type) {
  const xhr = new XMLHttpRequest();
  xhr.open("get", `../config/${type}.json`, true);
  xhr.send();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
      if (xhr.status >= 200 && xhr.status < 300) {
        base.config = JSON.parse(xhr.responseText);
        $("title").innerText = base.config.title;
        $(".title-text").innerText = base.config.title;
        initSize(base.config.radius);
        drawCanvse();
      };
    };
  }
}
// 判断设备
function isPhone(state, i) {
  if (!window.location.hash.match('fromapp')) {
    return navigator.userAgent.match(/(iPhone|Android|ios|Windows Phone)/i);
  }
}
function $(id) {
  return document.querySelector(id);
}
// 绘制主方法
let $draw = {
  radius: "",
  canvas: "",
  ctx: "",
  dx: 0,
  dz: 0,

  getCtx(id) {
    this.canvas = $(id);
    this.ctx = canvas.getContext("2d");
  },
  setCanvas(n = 1) {
    this.canvas.width = document.body.clientWidth * n;
    this.canvas.height = document.body.clientHeight * n;
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2); // 设置中心点
  },
  setRadius(r) {
    this.radius = r;
  },
  setScale(scale) {
    this.ctx.scale(scale, scale);
  },
  moveCanvas(dx, dz) {
    this.dx = dx;
    this.dz = dz;
  },
  recanvas() {
    this.ctx.clearRect(-this.canvas.width, -this.canvas.height, this.canvas.width * 2, this.canvas.height * 2);
  },
  bg (color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(-this.canvas.width / 2, -this.canvas.height / 2, this.canvas.width, this.canvas.height);
  },
  line(color, width, points) {
    this.ctx.lineWidth = width;
    this.ctx.strokeStyle = color;
    this.ctx.beginPath();
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = "round";
    // 画线
    for (let i = 0; i < points.length; i++) {
      const element = points[i];
      if (i === 0) {
        this.ctx.moveTo(element.x + this.dx, element.z + this.dz);
      } else {
        this.ctx.lineTo(element.x + this.dx, element.z + this.dz);
      }
    }
    this.ctx.stroke();
    this.ctx.closePath();
  },
  text(color, point, text) {
    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    this.ctx.font = "bold 28px";
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "center";
    this.ctx.fillText(text, point.x + this.dx, point.z + this.dz);
    this.ctx.stroke();
    this.ctx.closePath();
  },
  circles (color, width) {
    this.ctx.beginPath();
    this.ctx.arc(0 + this.dx, 0 + this.dz, this.radius, 0, 360, false);
    this.ctx.lineWidth = width;
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
    this.ctx.closePath();
    // 变成虚线
    const step = 1 / 180 * Math.PI * 2;
    for (let b = 0, e = step / 2; e <= 360; b += step, e += step) {
      this.ctx.beginPath()
      this.ctx.arc(0 + this.dx, 0 + this.dz, this.radius, b, e);
      this.ctx.strokeStyle = base.white;
      this.ctx.stroke();
    }
  },

  item(item) {
    item.forEach(element => {
      switch (element.type) {
        case "ice":
          this.line(base.blue, base.width * 2, element.points);
          break;
        case "rail":
          this.line(base.yellow, base.width, element.points);
          break;
        case "walk":
          this.line(base.red, base.width, element.points);
          break;
        default:
          break;
      }
    });
    // 防止文字被覆盖
    item.forEach(element => {
      this.text(base.black, element.points[element.points.length - 1], element.name);
    });
  }
}
// 鼠标滚轮
function mouseWheel(id, downFn, upFn) {
  const obj = $(id);
  obj.onmousewheel = fn;
  if (obj.addEventListener) {
    obj.addEventListener('DOMMouseScroll', fn, false);
  }
  function fn(ev) {
    var ev = ev || event;
    var b = true;
    if (ev.wheelDelta) {
      b = ev.wheelDelta > 0 ? true : false;
    } else {
      b = ev.detail < 0 ? true : false;
    }
    if(b) {
      upFn && upFn();
    } else {
      downFn && downFn();
    }
    if (ev.preventDefault) {
      ev.preventDefault();
    }
    return false;
  }
}
// 鼠标移动
function mouseMove(id, moveFn) {
  const obj = $(id);
  obj.onmousedown = ev => {
    var e = window.event || ev;
    var fX = e.clientX - base.dx;
    var fY = e.clientY - base.dz;
    document.onmousemove = ev => {
      var e = window.event|| ev;
      base.dx = e.clientX - fX;
      base.dz = e.clientY - fY;
      moveFn && moveFn();
    }
    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
    }
  }
}