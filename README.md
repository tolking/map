# map

> 基于 `solid-js` `@egjs/hammerjs` `svg` 制作

[在线地址](https://map.ououe.com)

## 说明：

## 路线数据说明：

- 路线数据采用 json 格式储存
- 文件储存在 public -> config 下

### 线路数据名称

- 使用驼峰命名
- 根据数据，使用合适的名称
- 主要命名规则：服务器 + 版本 + 记录世界 + 其它自定义（根据实际情况增减）
- 使用：kedama 表示毛线、nyaa 表示喵窝...
- 使用：World 表示主世界、Nether 表示下界、End 表示末地
- 例如：kedamaV2Nether115.json（kedama —— 毛线、V2 —— 当前版本、Nether —— 下界、115 —— 所在层数 y值）

### 线路数据参数

- 可以参考 config 文件夹下的文件
- 以下值特别注明为（可选），如果为空时可以省略

#### 大致结构

```json
{
  "title": "",
  "author": "",
  "version": 1.0,
  "uptime": "2018-2-18",
  "introduce": "",
  "center": {"x": 0, "z": 0},
  "radius": 600,
  "borderstyle": "circles",
  "data": []
}
```
- title —— 数据名称，用于在页面顶部显示
- author —— 数据维护人员，用于在页面底部显示（可选，多名成员在名字中间加空格）
- version —— 当前版本号（可选，如果省略将不显示当前版本说明）
- uptime —— 数据更新时间，由于在页面底部显示（可选）
- introduce —— 当前版本说明（可选，如果想显示内容需要指定 version 值且大于之前值才可以显示更新内容），用于初次打开数据页面显示内容
- center —— 修正地图的中心点为统计数据的中心点
- radius —— 当前数据边界，用于初次缩放计算和边界大小计算
- borderstyle —— 边界形状（可选，circles -- 正圆形、square -- 正方形、points数组 -- 自定义任意形状，需手动闭合路径）
- data —— 所有的线路数据

#### data 结构

```json
{
  "name": "",
  "type": "",
  "notes": "",
  "namelist": [
    {
      "name": "",
      "point": {"x": 0, "y": 115, "z": 0}
    }
  ],
  "points": [
    {"x": -3, "y": 115, "z": -4},
    {"x": -0, "y": 115, "z": 0}
  ]
}
```
- name —— 线路通往/终点的名称（可选），文字将显示在 points 的最后一个坐标处
- type —— 路线类型（ice —— 冰道、rail —— 铁路、walk —— 步道、green —— 下界与基岩顶互通、frame —— 线框）如果有其它需求请联系、有能力也可以自己加
- notes —— 路线说明（可选），用于线路说明，当鼠标移动到路径上将被显示
- namelist —— 指定线路上路过的名称或者修正路线终点不是显示名字的地方（可选）就是大量名称的集合，可以灵活使用
- namelist -> name —— 记录名称
- namelist -> point —— 记录名称所需要显示的坐标
- points —— 记录整条线路坐标变化

#### points 的详细说明

- 只需直接记录游戏（F3）中的坐标值即可
- points 记录线路坐标的变化（主要是 x 与 z 值）
- x、z 的值用于线路显示及走向
- y 值目前对于显示毫无作用
- 如果线路的 y 值浮动太大，则没有必要记录每一个 y 值的变化
- 如果是斜线直接记录起点与终点坐标即可
- points 支持曲线记录

```json
{"x": 99, "y": 129, "z": 388},
{"x": 125, "y": 129, "z": 414, "type": "n-e"},
{"x": 125, "y": 129, "z": 464},
{"x": 154, "y": 129, "z": 493, "type": "s-w", "ex": 125, "ez": 493},
{"x": 202, "y": 129, "z": 493}
```
- 曲线的开始的第一个点参数同正常，不需要加其它参数
- 记录之后每一个曲线的拐点，并且加入 type 或 ex ez
- *记录曲线的拐点 type 值不能为空，否则将显示为斜线*
- type 的值为曲线弯曲所指的方向
- type 可选方向值："n-w" —> 西北、"n-e" —> 东北、"s-w" —> 西南、"s-e" —> 东南
- 当 type 为上面的某一个值时，不需要 ex ez 即可显示曲线
- 但当 ex ez 有值时，type 的类型将失效，曲线的弯曲将由 ex ez 的值决定（建议将此时的 type 值设置为 "r"）
- 这个点将决定前面这段曲线的走向
- *曲线采用的是二次贝塞尔曲线实现，ex ez 是当前坐标点的节点

#### 关于 data 内排序

由于 data 内的数据会被逐一绘制，所以后面的数据覆盖在前面的数据上，容易引起颜色换乱

所以规定数据记录的顺序为 （`walk` -> `rail` -> `ice` -> `frame` -> `green`）

### 上线数据

-  上线需要在 src 目录下的 config.ts 文件中 mapList 中加入以下参数
```ts
{
  name: "",
  type: ""
}
```
- name —— 用于在右上角的下拉列表中显示
- type —— 线路数据名称，与 config 下面的文件同名

### 分享地图

- 通过 url 传参实现分享地图
- 在域名后面加入 type 参数（?type=需要分享的文件名）
- 如：https://map.ououe.com?type=nyaaWorld
- 这样也可预览一些还没有正式公开的地图

## 开发

``` sh
1. 初始化
yarn
# or
npm run install

2. 开发
yarn dev
# or
npm run dev

3. 打包
yarn build
# or
npm run build

4. 预览
yarn serve
# or
npm run serve
```
