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
  $draw.setCanvas(isPhone() ? 3 : 1, base.width);
  get(base.type);
  // 鼠标缩放
  mouseWheel("canvas", () => {
    // console.log("缩小");
    // console.log(getMousePos());
    
    base.scale = 0.9 * base.scale;
    drawCanvse();
  }, () => {
    // console.log("放大");
    // console.log(getMousePos());

    base.scale = 1.1 * base.scale;
    drawCanvse();
  });
  // mouseMove("canvas", () => {
  //   $draw.moveCanvas(base.dx, base.dz);
  //   drawCanvse();
  // });

  var hammer = new Hammer(document.getElementById("canvas"));
  // 手机移动
  hammer.on("panmove", ev => {
    // 通过 transform 优化拖动性能
    $("canvas").style.transform = `translate(${ev.deltaX}px, ${ev.deltaY}px)`
  });
  hammer.on("panend", ev => {
    base.dx += ev.deltaX;
    base.dz += ev.deltaY;
    $draw.moveCanvas(base.dx, base.dz);
    $("canvas").style.transform = `translate(0px, 0px)`;
    drawCanvse();
  });
  // 手机缩放
  hammer.get("pinch").set({
    enable: true
  });
  hammer.on("pinchmove", ev => {
    // console.log("缩放中");
    // console.log(ev.scale);
    
    $("canvas").style.transform = `scale(${ev.scale})`;
  });
  hammer.on("pinchend", ev => {
    // console.log("缩放结束");
    // console.log(ev.scale);

    $("canvas").style.transform = `scale(1)`;
    base.scale = base.scale * ev.scale;
    drawCanvse();
  });
}

// 画图
function drawCanvse(scale = base.scale, dx = base.dx, dz = base.dz, value = base.config) {
  console.log("draw-canvas");
  
  $draw.recanvas();
  $draw.bg(base.white);
  $draw.setRadius(value.radius);
  $draw.setScale(base.scale);
  $draw.circles(base.gray);
  $draw.item(value.data);
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
        changeHtml();
        initSize(base.config.radius);
        drawCanvse();
      };
    };
  }
}
// 修改html数据
function changeHtml() {
  $("title").innerText = base.config.title;
  $(".title-text").innerText = base.config.title;
  $(".version-data .version").innerText = base.config.version;
  $(".version-data .uptime").innerText = base.config.uptime;
  $(".version-data .author").innerText = base.config.author;
}
// 初始化map大小
function initSize(r) {
  let w = document.body.clientWidth;
  let h = document.body.clientHeight;
  base.scale = (w - h ? h : w) / (2 * r) * 0.9;
  $draw.setScale(base.scale);
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
  base: 1, // 整体canva广大倍数，解决手机模糊
  scale: 1, // 缩放基数
  width: 2, // 画笔宽度
  dx: 0, // 移动 x
  dz: 0, // 移动 y

  getCtx(id) {
    this.canvas = $(id);
    this.ctx = canvas.getContext("2d");
  },
  setCanvas(base, width) {
    this.base = base;
    this.width = width * this.base;
    this.canvas.width = document.body.clientWidth * this.base;
    this.canvas.height = document.body.clientHeight * this.base;
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2); // 设置中心点
  },
  setRadius(r) {
    this.radius = r;
  },
  setScale(scale) {
    this.scale = scale * this.base;
  },
  moveCanvas(dx, dz) {
    this.dx = dx * this.base;
    this.dz = dz * this.base;
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
        this.ctx.moveTo(element.x * this.scale + this.dx, element.z * this.scale + this.dz);
      } else {
        this.ctx.lineTo(element.x * this.scale + this.dx, element.z * this.scale + this.dz);
      }
    }
    this.ctx.stroke();
    this.ctx.closePath();
  },
  text(color, point, text) {
    this.ctx.beginPath();
    this.ctx.fillStyle = color;
    this.ctx.font = `bold ${10 * this.base}px Arial`;
    this.ctx.textBaseline = "middle";
    this.ctx.textAlign = "center";
    this.ctx.fillText(text, point.x * this.scale + this.dx, point.z * this.scale + this.dz);
    this.ctx.stroke();
    this.ctx.closePath();
  },
  circles (color) {
    this.ctx.beginPath();
    this.ctx.arc(0 + this.dx, 0 + this.dz, this.radius * this.scale, 0, 360, false);
    this.ctx.lineWidth = this.width;
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
    // 变成虚线
    const step = 1 / 180 * Math.PI * 2;
    for (let b = 0, e = step / 2; e <= 360; b += step, e += step) {
      this.ctx.beginPath()
      this.ctx.arc(0 + this.dx, 0 + this.dz, this.radius * this.scale, b, e);
      this.ctx.strokeStyle = base.white;
      this.ctx.stroke();
    }
    this.ctx.closePath();
  },
  round (color, width, points) {
    this.ctx.beginPath();
    this.ctx.arc(points[points.length - 1].x * this.scale + this.dx, points[points.length - 1].z * this.scale + this.dz, width, 0, 360, false);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.closePath();
  },
  item(item) {
    item.forEach(element => {
      switch (element.type) {
        case "ice":
          this.line(base.blue, this.width * 2, element.points);
          break;
        case "rail":
          this.line(base.yellow, this.width, element.points);
          break;
        case "walk":
          this.line(base.red, this.width, element.points);
          break;
        case "green":
          this.round(base.green, this.width * 1.5, element.points);
          break;
        default:
          break;
      }
    });
    // 防止文字被覆盖
    item.forEach(element => {
      element.name && this.text(base.black, element.points[element.points.length - 1], element.name);
      element.namelist && element.namelist.forEach(list => {
        this.text(base.black, list.point, list.name);
      });
    });
  }
}

// 鼠标坐标
function getMousePos(event) {
  var e = event || window.event;
  return {"x": e.clientX, "y": e.clientY}
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
// function mouseMove(id, moveFn) {
//   const obj = $(id);
//   obj.onmousedown = ev => {
//     var e = window.event || ev;
//     var fX = e.clientX - base.dx;
//     var fY = e.clientY - base.dz;
//     document.onmousemove = ev => {
//       var e = window.event|| ev;
//       base.dx = e.clientX - fX;
//       base.dz = e.clientY - fY;
//       moveFn && moveFn();
//     }
//     document.onmouseup = () => {
//       document.onmousemove = null;
//       document.onmouseup = null;
//     }
//   }
// }