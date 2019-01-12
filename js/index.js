import { mapList, getBase } from './config.js'
import {
  $,
  isPhone,
  get,
  getSize,
  getMousePos,
  mouseWheel,
  configHtml,
  changeHtml,
  setLocal
} from './public.js'
import Draw from './draw.js'

const $draw = new Draw
const hammer = new Hammer($("#canvas"))
let mapConfig
let base = getBase() // 引入基础配置

configHtml(mapList) // 初始地图下拉选择框
$draw.getCtx($('#canvas')) // 初始 canvas
$draw.setCanvas(isPhone() ? 3 : 1, base.width) // 初始 canvas 大小（解决手机模糊）
londMap(base.type) // 加载默认地图数据


// 获取地图数据
function londMap(item) {
  get(item).then(res => {
    mapConfig = res
    base.scale = getSize(mapConfig.radius) // 初始地图缩放大小数据
    changeHtml(mapConfig, base.type) // 修改网页中的地图信息数据
    $draw.setScale(base.scale) // 初始 canvas 缩放
    $draw.setRadius(mapConfig.radius) // 初始 canvas 半径
    $draw.moveCenter(mapConfig.center) // 移动 canvas 至地图数据中点
    drawCanvse() // 绘制 canvas 地图
  })
}

// 画图
function drawCanvse() {
  $draw.recanvas() // 清空画布
  $draw.bg(base.white) // 绘制背景
  $draw.setScale(base.scale) // 设置缩放
  $draw.border(mapConfig.borderstyle, base.frame) // 绘制边界
  $draw.item(mapConfig.data, base) // 绘制地图
}


console.log(base)


 // 手机缩放
hammer.get("pinch").set({
  enable: true
});
hammer.on("pinchmove", ev => {
  $("canvas").style.transform = `scale3d(${ev.scale}, ${ev.scale}, 1)`;
});
hammer.on("pinchend", ev => {
  let cW = $("canvas").offsetWidth;
  let cH = $("canvas").offsetHeight;

  $("canvas").style.transform = "scale3d(1, 1, 1)";
  base.scale = base.scale * ev.scale;
  base.dx += (ev.center.x - cW / 2) * (1 - base.scale);
  base.dz += (ev.center.y - cH / 2) * (1 - base.scale);
  $draw.moveCanvas(base.dx, base.dz);
  drawCanvse();
});
 // 鼠标缩放
 mouseWheel("canvas", () => {
  let m = getMousePos();
  let cW = $("canvas").offsetWidth;
  let cH = $("canvas").offsetHeight;
  
  base.scale = 0.9 * base.scale;
  base.dx += (m.x - cW / 2) * (1 - base.scale) - base.dx;
  base.dz += (m.y - cH / 2) * (1 - base.scale) - base.dz;
  $("canvas").style.transform = `scale3d(${base.scale}, ${base.scale}, 1)`;
  $draw.moveCanvas(base.dx, base.dz);
  drawCanvse();
  $("canvas").style.transform = `scale3d(1, 1, 1)`;
}, () => {
  let m = getMousePos();
  let cW = $("canvas").offsetWidth;
  let cH = $("canvas").offsetHeight;

  base.scale = 1.1 * base.scale;
  base.dx += (m.x - cW / 2) * (1 - base.scale) - base.dx;
  base.dz += (m.y - cH / 2) * (1 - base.scale) - base.dz;
  $("canvas").style.transform = `scale3d(${base.scale}, ${base.scale}, 1)`;
  $draw.moveCanvas(base.dx, base.dz);
  drawCanvse();
  $("canvas").style.transform = `scale3d(1, 1, 1)`;
});


// 监听数据源更改
$(".select-data").onchange = function() {
base.type = this.value;
londMap(base.type);
setLocal("base");
}
// 监听颜色更改
$("#ice").onchange = function() {
this.click();
base.ice = this.value;
drawCanvse();
setLocal("base");
};
$("#rail").onchange = function() {
this.click();
base.rail = this.value;
drawCanvse();
setLocal("base");
};
$("#walk").onchange = function() {
this.click();
base.walk = this.value;
drawCanvse();
setLocal("base");
};
$("#green").onchange = function() {
this.click();
base.green = this.value;
drawCanvse();
setLocal("base");
};
$("#frame").onchange = function() {
this.click();
base.frame = this.value;
drawCanvse();
setLocal("base");
};
$("#text").onchange = function() {
this.click();
base.text = this.value;
drawCanvse();
setLocal("base");
};
// 恢复初始颜色
$(".ice").onclick = () => {
changeColor("#ice", "#7FDBFF");
base.ice = "#7FDBFF";
drawCanvse();
setLocal("base");
}
$(".rail").onclick = () => {
changeColor("#rail", "#FFDC00");
base.rail = "#FFDC00";
drawCanvse();
setLocal("base");
}
$(".walk").onclick = () => {
changeColor("#walk", "#85144b");
base.walk = "#85144b";
drawCanvse();
setLocal("base");
}
$(".green").onclick = () => {
changeColor("#green", "#2ECC40");
base.green = "#2ECC40";
drawCanvse();
setLocal("base");
}
$(".frame").onclick = () => {
changeColor("#frame", "#AAAAAA");
base.frame = "#AAAAAA";
drawCanvse();
setLocal("base");
}
$(".text").onclick = () => {
changeColor("#text", "#001f3f");
base.text = "#001f3f";
drawCanvse();
setLocal("base");
}
// 关闭弹窗
$(".tip-btn").onclick = () => {
$("#canvas").className = null;
$(".tip").style.display = "none";
setLocal(base.type);
}
