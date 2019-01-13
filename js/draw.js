// 绘制类
export default class Draw {
  constructor () {
    this.radius = ''
    this.canvas = ''
    this.ctx = ''
    this.center = { x: 0, y: 0 }
    this.base = 1 // 整体canvas扩大倍数，结合css，解决手机模糊
    this.scale = 1 // 缩放基数
    this.width = 2 // 画笔宽度
    this.dx = 0 // 移动 x
    this.dz = 0 // 移动 y
  }
  getCtx(dom) {
    this.canvas = dom
    this.ctx = canvas.getContext('2d')
  }
  setCanvas(base, width) {
    this.base = base
    this.width = width * this.base
    this.canvas.width = document.body.clientWidth * this.base
    this.canvas.height = document.body.clientHeight * this.base
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2) // 设置中心点
  }
  setRadius(r) {
    this.radius = r
  }
  setScale(scale) {
    this.scale = scale * this.base
  }
  moveCenter(center) {
    this.center = center
  }
  moveCanvas(dx, dz) {
    this.dx = dx * this.base
    this.dz = dz * this.base
  }
  recanvas() {
    this.ctx.clearRect(
      -this.canvas.width / 2,
      -this.canvas.height / 2,
      this.canvas.width,
      this.canvas.height
    )
  }
  bg (color) {
    this.ctx.fillStyle = color
    this.ctx.fillRect(
      -this.canvas.width / 2,
      -this.canvas.height / 2,
      this.canvas.width,
      this.canvas.height
    )
  }
  line(color, width, points, type) {
    if (type === 'dotted') {
      this.ctx.setLineDash([10, 15])
    }
    this.ctx.lineWidth = width
    this.ctx.strokeStyle = color
    this.ctx.lineJoin = 'round'
    this.ctx.lineCap = 'round'
    this.ctx.beginPath()
    // 画线
    for (let i = 0; i < points.length; i++) {
      const element = points[i]
      if (i === 0) {
        this.ctx.moveTo(
          (element.x - this.center.x) * this.scale + this.dx, 
          (element.z - this.center.z) * this.scale + this.dz
        )
      } else {
        // 绘制曲线
        if (element.type) {
          let before = points[i - 1] 
          switch (element.type) {
            case 't-l':
              this.ctx.quadraticCurveTo(
                ((element.ex || (before.x > element.x ? element.x : before.x)) - this.center.x) * this.scale + this.dx,
                ((element.ez || (before.z > element.z ? element.z : before.z)) - this.center.z) * this.scale + this.dz,
                (element.x - this.center.x) * this.scale + this.dx,
                (element.z - this.center.z) * this.scale + this.dz
              )
              break
            case 't-r':
              this.ctx.quadraticCurveTo(
                ((element.ex || (before.x > element.x ? before.x : element.x)) - this.center.x) * this.scale + this.dx,
                ((element.ez || (before.z > element.z ? element.z : before.z)) - this.center.z) * this.scale + this.dz,
                (element.x - this.center.x) * this.scale + this.dx,
                (element.z - this.center.z) * this.scale + this.dz
              )
              break
            case 'b-l':
              this.ctx.quadraticCurveTo(
                ((element.ex || (before.x > element.x ? element.x : before.x)) - this.center.x) * this.scale + this.dx,
                ((element.ez || (before.z > element.z ? before.z : element.z)) - this.center.z) * this.scale + this.dz,
                (element.x - this.center.x) * this.scale + this.dx,
                (element.z - this.center.z) * this.scale + this.dz
              )
              break
            case "b-r":
              this.ctx.quadraticCurveTo(
                ((element.ex || (before.x > element.x ? before.x : element.x)) - this.center.x) * this.scale + this.dx,
                ((element.ez || (before.z > element.z ? before.z : element.z)) - this.center.z) * this.scale + this.dz,
                (element.x - this.center.x) * this.scale + this.dx,
                (element.z - this.center.z) * this.scale + this.dz
              )
              break
            default:
              if (element.ex && element.ez) {
                this.ctx.quadraticCurveTo(
                  (element.ex - this.center.x) * this.scale + this.dx,
                  (element.ez - this.center.z) * this.scale + this.dz,
                  (element.x -this.center.x) * this.scale + this.dx,
                  (element.z -this.center.z) * this.scale + this.dz
                )
              } else {
                console.error("curve-{type or ex or ez}-eorro")
                console.error(element)
              }
              break
          }
        } else {
          this.ctx.lineTo(
            (element.x - this.center.x) * this.scale + this.dx, 
            (element.z - this.center.z) * this.scale + this.dz
          )
        }
      }
    }
    this.ctx.stroke()
    this.ctx.closePath()
  }
  text(color, point, text) {
    this.ctx.beginPath()
    this.ctx.fillStyle = color
    this.ctx.font = `bold ${10 * this.base}px Arial`
    this.ctx.textBaseline = "middle"
    this.ctx.textAlign = "center"
    this.ctx.fillText(
      text, 
      (point.x - this.center.x) * this.scale + this.dx, 
      (point.z - this.center.z) * this.scale + this.dz
    )
    this.ctx.stroke()
    this.ctx.closePath()
  }
  round (color, width, points) {
    this.ctx.beginPath()
    this.ctx.arc(
      (points[points.length - 1].x - this.center.x) * this.scale + this.dx,
      (points[points.length - 1].z - this.center.z) * this.scale + this.dz,
      width,
      0,
      360,
      false
    )
    this.ctx.fillStyle = color
    this.ctx.fill()
    this.ctx.closePath()
  }
  circles (color, bgColor) {
    this.ctx.beginPath()
    this.ctx.arc(this.dx, this.dz, this.radius * this.scale, 0, 360, false)
    this.ctx.lineWidth = this.width
    this.ctx.strokeStyle = color
    this.ctx.stroke()
    // 变成虚线
    const step = 1 / 180 * Math.PI * 2
    for (let b = 0, e = step / 2; e <= 360; b += step, e += step) {
      this.ctx.beginPath()
      this.ctx.arc(this.dx, this.dz, this.radius * this.scale, b, e)
      this.ctx.strokeStyle = bgColor
      this.ctx.stroke()
    }
    this.ctx.closePath() 
  }
  border (value, color, bgColor) {
    this.ctx.save()
    if (value instanceof Array) {
      this.line(color, this.width, value, "dotted")
    } else if (value === "circles") {
      this.circles(color, bgColor)
    } else if (value === "square") {
      const _value = [
        { x: -this.radius, z: -this.radius },
        { x: this.radius, z: -this.radius },
        { x: this.radius, z: this.radius },
        { x: -this.radius, z: this.radius },
        { x: -this.radius, z: -this.radius }
      ]
      this.line(color, this.width, _value, "dotted")
    } else {
      console.error("borderstyle-eorro")
      console.error(value)
      return
    }
    this.ctx.restore()
  }
  item(item, base) {
    item.forEach(element => {
      this.ctx.save()
      switch (element.type) {
        case "ice":
          this.line(base.ice, this.width * 2, element.points)
          break
        case "rail":
          this.line(base.rail, this.width, element.points)
          break
        case "walk":
          this.line(base.walk, this.width, element.points)
          break
        case "green":
          this.round(base.green, this.width * 1.5, element.points)
          break
        case "frame":
          this.line(base.frame, this.width, element.points)
          break
        default:
          console.error("data-type-eorro")
          console.error(element)
          break
      }
      this.ctx.restore()
    })
    // 防止文字被覆盖
    item.forEach(element => {
      this.ctx.save()
      element.name && this.text(base.text, element.points[element.points.length - 1], element.name)
      element.namelist && element.namelist.forEach(list => {
        this.text(base.text, list.point, list.name)
      })
      this.ctx.restore()
    })
  }
}
