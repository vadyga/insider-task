//This is raw WebGL example

export class TeeterTotterGame {
    fallingSpeed = 3;
    velocity = 1;
    canvas;
    ctx;
    width;
    height;
    pause = false;
    itemsTeeterTotter = [];
    fallingItemIsExist;
    fallingItemX = 0;
    constructor(props) {
        this.canvas = props.canvas;
        this.ctx = this.canvas.getContext('2d');
        this.width = props.width;
        this.height = props.height;
        this.listen()
    }

    listen() {
        document.addEventListener("keydown", this.keyDownHandler.bind(this), false);
        document.addEventListener("keyup", this.keyUpHandler.bind(this), false);
    }

    keyDownHandler(e) {
        if (e.code === "ArrowRight") {
            this.rightPressed = true;
        } else if (e.code === 'ArrowLeft') {
            this.leftPressed = true;
        }
    }

    keyUpHandler(e) {
        if (e.code === "ArrowRight") {
            this.rightPressed = false;
        } else if (e.code === 'ArrowLeft') {
            this.leftPressed = false;
        }
    }

    init() {
        this.canvas.height = this.height;
        this.canvas.width = this.width;
        this.teeterTotter = new TeeterTotter({ctx: this.ctx, items: this.itemsTeeterTotter})
        const itemsCount = Math.floor(Math.random() * 3) + 1
        for (let i = 0; i < itemsCount; i++) {
            let xCordOnRightSide = Math.floor(Math.random() * this.width / 2) + this.width / 2
            this.teeterTotter.items.push(this.getRandomFigure({
                x: xCordOnRightSide,
                y: this.teeterTotter.getYByX(xCordOnRightSide),
                weight: Math.floor(Math.random() * 9),
                ctx: this.ctx
            }))
        }
    }

    getRandomFigure(params){
        let figure = Math.floor(Math.random() * 3)
        switch (figure) {
            case 0:
                return new Rectangle(params)
            case 1:
                return new Circle(params)
            case 2:
                return new Triangle(params)
        }
    }

    render() {
        if (this.pause) return;
        if(Math.abs(this.teeterTotter.angle) > 30) return;
        this.clear();
        if (this.fallingItem) {
            if (this.rightPressed && this.fallingItemX < this.width / 2 - this.fallingItem.width) {
                this.fallingItemX += 2
            }
            if (this.leftPressed && this.fallingItemX > 1 + this.fallingItem.width) {
                this.fallingItemX -= 2
            }
        }

        this.teeterTotter.create()
        this.itemsTeeterTotter.forEach(item => {
            item.create(this.teeterTotter.getYByX(item.x))
            item.angle = this.teeterTotter.angle
        })
        if (!this.fallingItemIsExist) {
            this.fallingItem = this.getRandomFigure({
                x: 0,
                y: 50,
                weight: Math.floor(Math.random() * 10),
                ctx: this.ctx
            })
            this.fallingItemIsExist = true;
        } else {
            if (this.fallingItem.y < this.teeterTotter.getYByX(this.fallingItemX) - this.fallingItem.height * 1.5) {
                this.fallingItem.y = this.fallingItem.y + this.velocity;
                this.fallingItem.x = this.fallingItemX;
                this.teeterTotter.calc()
            } else {
                this.fallingItemIsExist = false
                this.itemsTeeterTotter.push(this.fallingItem)
            }
            this.fallingItem.create();
        }
    }

    checkFiguresTouchEachOther() {

    }

    clear() {
        const {width, height} = this;
        this.ctx.clearRect(0, 0, width, height);
    }
}

class Figure {
    ctx;
    x;
    y;
    weight;
    angle = 10;

    constructor(props) {
        Object.assign(this, props);
    }

    set y(y) {
        this.y = y;
    }

    set x(x) {
        this.x = x;
    }

    set angle(angle) {
        this.angle = angle
    }
}

class TeeterTotter {
    maxCount = 3
    leftForce = 0
    rightForce = 0
    items
    angle
    falling
    itemsCount

    constructor(props) {
        Object.assign(this, props);
        this.angle = 10
        this.itemsCount = Math.floor(Math.random() * this.maxCount)
        this.calc()
    }

    drawBase() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'black'
        this.ctx.moveTo(250, 300);
        this.ctx.lineTo(350, 450);
        this.ctx.lineTo(150, 450);
        this.ctx.lineTo(250, 300);
        this.ctx.closePath()
        this.ctx.stroke();
    }

    degToRad(deg) {
        return (Math.PI * deg) / 180
    }

    getYByX(x) {
        let delta = (x - this.leftLineX) / (this.rightLineX - x)
        return (this.leftLineY + delta * this.rightLineY) / (1 + delta)
    }

    calc() {
        this.leftForce = 0
        this.rightForce = 0
        this.items.forEach(figure => {
            if(figure.x > 250) { // TODO: Ширина фиксирована
                this.rightForce += figure.weight * (figure.x - 250)
            } else {
                this.leftForce += figure.weight * (250 - figure.x)
            }
        })
        let diff = this.rightForce - this.leftForce
        clearInterval(this.falling)
        this.falling = setInterval(()=>{
            if(diff > 0){
                this.angle += 0.05
            } else if (diff < 0) {
                this.angle -= 0.05
            } else {
                this.angle = 0
            }
        })
        if(Math.abs(this.angle) > 35){
            console.log('you lose')
            //this.angle = 0
        }
    }

    drawTeeterTotter() {
        const {ctx, angle} = this
        this.leftLineX = 500 * Math.cos(this.degToRad(180 + angle))
        this.leftLineY = 500 * Math.sin(this.degToRad(180 + angle)) + 300
        this.rightLineX = 500 * Math.cos(this.degToRad(angle)) + 500
        this.rightLineY = 500 * Math.sin(this.degToRad(angle)) + 300
        ctx.beginPath()
        ctx.moveTo(this.leftLineX, this.leftLineY)
        ctx.lineTo(this.rightLineX, this.rightLineY)
        ctx.stroke()
    }

    create() {
        this.drawBase()
        this.drawTeeterTotter()
    }
}

class Rectangle extends Figure {
    constructor(props) {
        super(props);
        this.width = this.weight * 10
        this.height = this.weight * 10
        this.color = `rgba(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255})`
        Object.assign(this, props);
    }

    create(teeterY) {
        const {x, y, angle, ctx, width, height} = this;
        let yPos = teeterY ? teeterY - height * 1.5 : y
        ctx.save();
        ctx.fillStyle = this.color
        ctx.translate(x + width / 2, yPos + height / 2)
        ctx.rotate(angle * Math.PI / 180);
        ctx.rect(0, 0, width, height);
        ctx.stroke()
        ctx.translate(-1 * x + width / 2, -1 * yPos + height / 2)
        ctx.restore()
    }
}

class Circle extends Figure {
    r

    constructor(props) {
        super(props);
        this.r = Math.sqrt(this.weight / Math.PI) * 10;
        this.color = `rgba(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255})`
        Object.assign(this, props);
        this.height = this.r
        this.width = this.r
    }

    create(teeterY) {
        const {x, y, r, ctx} = this
        let yPos = teeterY ? teeterY - r * 1.5 : y
        ctx.beginPath();
        ctx.fillStyle = this.color
        ctx.arc(x, yPos, r, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.stroke();
    }
}

class Triangle extends Figure {

    constructor(props) {
        super(props);
        this.side = Math.sqrt(this.weight * 4 / Math.sqrt(3)) * 10
        this.height = Math.sqrt(3)/2 * this.side
        this.width = this.side
        this.color = `rgba(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255})`
        Object.assign(this, props);
    }

    create(teeterY) {
        const {x, y, ctx, side} = this
        let yPos = teeterY ? teeterY - side * 1.5 : y
        ctx.beginPath();
        ctx.fillStyle = this.color
        ctx.moveTo(x, yPos);
        ctx.lineTo(x - side, yPos + side);
        ctx.lineTo(x + side, yPos + side);
        ctx.lineTo(x, yPos)
        ctx.stroke();
        ctx.closePath();
    }
}
