'use strict';
const canvas = $('canvas')[0],
    ctx = canvas.getContext('2d'),
    all = [];
let toKill = [],
    sprites = [],
    sources = [],
    clefairy = 0
function Sprite(opts) {
    let out = new Image()
    out.src = opts.source;
    out.label = opts.label
    if (!out.src) {
        throw Error('No src')
    }
    out.crop = {
        x: opts.crop.x,
        y: opts.crop.y
    }
    out.w = opts.width ?? 1
    out.h = opts.height ?? 1
    out.onload = () => { sprites.push(out); }
    return out
}
Sprite({
    source: './sprites/Jirachi.png', label: 'Jirachi', width: 9, height: 8,
    crop: {
        x: 35,
        y: 40,
    }
})
Sprite({
    source: './sprites/Deoxys.png', label: 'Deoxys', width: 8, height: 8,
    crop: {
        x: 50,
        y: 70,
    }
})
Sprite({
    source: './sprites/Arceus.png', label: 'Arceus', width: 8, height: 8,
    crop: {
        x: 110,
        y: 140,
    }
})
Sprite({
    source: './sprites/Mew.png', label: 'Mew', width: 6, height: 8,
    crop: {
        x: 40,
        y: 50,
    }
})
let cleffa = Sprite({
    source: './sprites/Cleffa.png', label: 'Cleffa', width: 10, height: 8,
    crop: {
        x: 40,
        y: 120,
    }
})
function Update() {
    frame = requestAnimationFrame(Update)
    canvas.height = window.innerHeight
    canvas.width = window.innerWidth

    if (!(frame % Star.spawnInterval)) {
        let x = new Star({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 1,
            opacity: 0
        })

    }
    if (!(frame % 300) && sprites.length) {
        if (choose(1, 2, 2, 2) === 2) {
            let poke = new Anim({ x: choose(-100, canvas.width + 100), y: 300, shape: choose(...sprites) })
            poke.velocity.x = choose(-Math.sign(poke.x))
            poke.velocity.y = choose(-1, 1, 0)
        }
        else {
            let poke = new Anim({ x: Math.random() * canvas.width, y: -100, shape: choose(...sprites) })
            poke.velocity.y = choose(1)
        }
    }


    for (let o of toKill) {
        all.splice(all.indexOf(o), 1)
    }
    toKill = []
    for (let o of all) {
        if (!(frame % 8)) {
            o.frame++
        }
        o.draw()

    }

    ctx.beginPath()
    let coords = {
        x: canvas.width / 2,
        y: canvas.height+ 100
    }
    ctx.save()
    ctx.translate(coords.x, coords.y)
    ctx.rotate(frame / 1000)
    ctx.translate(-coords.x, -coords.y)
    ctx.arc(coords.x, coords.y, 300, 0, Math.PI * 2)
    ctx.fillStyle = ctx.strokeStyle = '#1265c9'
    ctx.lineWidth = 10
    ctx.shadowBlur = Math.abs(10 + (Math.cos(frame / 100) * 5));
    ctx.shadowColor = ctx.fillStyle
    ctx.stroke()
    ctx.fill()
    ctx.clip()
    ctx.beginPath()
    ctx.shadowBlur = 0
    ctx.arc(coords.x, coords.y - 400, 200, 0, Math.PI * 2)
    ctx.fillStyle = 'green'
    ctx.fill()
    for (let [x, y, size] of [
        [200, -220, 60],
        [-250, 100, 70],
        [70, 70, 20],
        [90, 100, 10],
        [50, 110, 15],
        [210, 40, 50]
    ]) {
        ctx.beginPath()
        ctx.arc(coords.x - x, coords.y - y, size, 0, Math.PI * 2)
        ctx.fill()
    }
    ctx.beginPath()
    ctx.arc(coords.x, coords.y + 300, 80, 0, Math.PI * 2)
    ctx.fillStyle = 'white'
    ctx.fill()
    ctx.beginPath()
    ctx.arc(coords.x + 30, coords.y + 30, 20, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
    ctx.save()
    ctx.translate(coords.x, coords.y)
    ctx.rotate(frame / 1000)
    ctx.translate(-coords.x, -coords.y)

    ctx.beginPath()
    let moonSize = 50
    ctx.shadowColor = 'grey'
    ctx.shadowBlur = 15
    ctx.arc(coords.x, coords.y + 500, moonSize, 0, Math.PI * 2)
    ctx.fillStyle = 'grey'
    ctx.fill()
    ctx.clip()
    ctx.fillStyle = '#474747'
    ctx.beginPath()
    ctx.shadowBlur = 0
    ctx.arc(coords.x, coords.y + 540, moonSize / 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(coords.x + 30, coords.y + 460, moonSize / 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(coords.x - 15, coords.y + 490, moonSize / 4, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
    ctx.save()

    ctx.translate(coords.x,coords.y)
    ctx.rotate(frame / 1000)

    ctx.scale(1,-1)
    
    if (cleffa) {
        ctx.drawImage(cleffa,
            (cleffa.width / cleffa.w) * clefairy,
            (cleffa.height / cleffa.h) * 0,
            cleffa.width / cleffa.w,
            cleffa.height / cleffa.h,
            -20,
            -600,
            cleffa.crop.x,
            cleffa.crop.y)
            if (!(frame % 8)) {
                clefairy++
            }
            if (clefairy > cleffa.w-1) {
                clefairy=0
            }
    }
    
        
ctx.restore()
}

let frame = 0,
    choose = (...a) => a[Math.floor(Math.random() * a.length)],
    getRandomHexColor = () => `#${[1, 1, 1].map(() => Math.floor(Math.random() * 0xff).toString(16).padStart(2, '0')).join('')}`;

const shapes = new Map([
    [0, function () {
        ctx.strokeStyle = ctx.fillStyle = ctx.shadowColor = this.color
        // ctx.shadowBlur = 10
        ctx.beginPath()
        ctx.rect(0, 0, this.size, this.size)
        ctx.fill()
        ctx.stroke()

    }],
    ['Jirachi', function () {
        if (this.velocity.y > 0 && this.velocity.x) {
            this.index = 1
            //Down Right
        }
        if (this.velocity.y < 0 && this.velocity.x) {
            this.index = 3
            //Top Right
        }
        if (this.velocity.y > 0 && !this.velocity.x) {
            this.index = 0
            //Down
        }
        if (this.velocity.y < 0 && !this.velocity.x) {
            this.index = 4
            //Top
        }
        if (!this.velocity.y && this.velocity.x) {
            this.index = 2
            //Right
        }
        ctx.drawImage(this.shape,
            (this.shape.width / this.shape.w) * this.frame,
            (this.shape.height / this.shape.h) * this.index,
            this.shape.width / this.shape.w,
            this.shape.height / this.shape.h,
            0,
            0,
            this.shape.crop.x,
            this.shape.crop.y)

    }],

])
shapes.set('Deoxys', shapes.get('Jirachi'))
shapes.set('Arceus', shapes.get('Jirachi'))
shapes.set('Mew', shapes.get('Jirachi'))

function Anim(opts) {
    let { x, y, shape, size, color, opacity } = opts
    this.x = x ?? 0
    this.y = y ?? 0
    this.shape = shape ?? 0
    this.rotation = 0
    this.size = size ?? 1
    this.frame = 1
    this.opacity = opacity ?? 1
    this.index = 0
    this.age = frame
    this.velocity = {
        x: 0,
        y: 0,
        a: 0
    }
    this.color = color ?? getRandomHexColor()

    //Funcs










    all.push(this)
}
Anim.prototype.kill = function () {
    toKill.push(this)
}

Anim.prototype.draw = function () {
    if (this.y < -300 || this.y > canvas.height * 2) {
        this.kill()
    }
    this.x += this.velocity.x
    this.y += this.velocity.y
    this.rotation += this.velocity.a
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rotation)
    ctx.globalAlpha = this.opacity
    ctx.imageSmoothingQuality = 'high'
    ctx.imageSmoothingEnabled = true
    if (this.velocity.x < 0) {
        ctx.scale(-1, 1)
    }

    if (this.shape.label) {
        if (this.frame > this.shape.w - 1) {
            this.frame = 0
        }
    }
    shapes.get(this.shape.label ?? this.shape)?.call?.(this)

    ctx.restore()

}
class Star extends Anim {
    static spawnInterval = 2
    constructor(opts) {
        super(opts)
        this.shined = false
    }
    draw() {
        super.draw()
        let inc = 0.03
        if (!this.shined) {
            this.opacity += inc
            this.size += inc
        }
        else {
            this.opacity -= inc / 2
            this.size -= inc / 2
        }

        if (this.opacity >= 1) {
            this.shined = true;
            this.opacity = 1
        }
        else if (this.opacity <= 0) {
            this.opacity = 0
            this.kill()
        }
    }
}

Update()
