function setup() {
    createCanvas(400, 400);
    Game.addCommonBalloon()
}

function draw() {
    background('skyblue');

    for (let balloon of Game.balloons) {
        balloon.display();
        balloon.move(Game.score);

        if(balloon.y < 25 && balloon.constructor.name != 'AngryBalloon'){

            clearInterval(interval)
            noLoop()
            Game.balloons.length = 0
            background(136, 220, 166);
            let finalScore = Game.score
            Game.score = ''
            textSize(64);
            fill('white');
            textAlign(CENTER, CENTER);
            text('FINISH', 200, 200)
            text('Score: ' + finalScore, 200, 300);
        }
    }

    textSize(32);
    fill('black');
    text(Game.score, 20, 40);


    if (frameCount % 50 === 0) {
        Game.addCommonBalloon()
    } 
    if (frameCount % 100 === 0) {
        Game.addUniqBalloon()
    }
    if (frameCount % 150 === 0){
        Game.addAngryBalloon()
    }
}

function mousePressed() {
    
    if (!isLooping()){
        loop()
        Game.score = 0
        interval = setInterval(()=>{
            Game.sendStatistic()
        }, 5000)

        Game.checkIfBalloonBurst()
    }

    Game.balloons.forEach((balloon, index)=>{
        let distance = dist(balloon.x, balloon.y, mouseX, mouseY);
        if (distance <= balloon.size / 2){
            balloon.burst(index)
        }
    });



}


let interval = setInterval(()=>{
    Game.sendStatistic()
}, 5000)

class Game {
    static balloons = []
    static score = 0
    static commonBalloon = 0
    static uniqBalloon = 0
    static angryBalloon = 0

    static sendStatistic(){
        let statistic = {
            balloons: Game.balloons.length,
            commonBalloon: Game.commonBalloon,
            uniqBalloon: Game.uniqBalloon,
            angryBalloon: Game.angryBalloon,
            score: Game.score
        }

        fetch('/statistics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(statistic)
        })
    }




    static addCommonBalloon() {
        let commonBalloon = new CommonBalloon('pink', 50);
        this.balloons.push(commonBalloon);
    }

    static addUniqBalloon() {
        let uniqBalloon = new UniqBalloon('purple', 50)
        this.balloons.push(uniqBalloon);
    }

    static addAngryBalloon(){
        let angryBalloon = new AngryBalloon('black', 50)
        this.balloons.push(angryBalloon);
    
    }

    static checkIfBalloonBurst() {
        this.balloons.forEach((balloon, index) => {
            let distance = dist(balloon.x, balloon.y, mouseX, mouseY);
            if (distance <= balloon.size / 2) {
                balloon.burst(index)
            }
        });
    }
}

class CommonBalloon {
    constructor(color, size) {
        this.x = random(width);
        this.y = random(height - 10, height + 50);
        this.color = color;
        this.size = size;
    }

    display() {
        fill(this.color);
        ellipse(this.x, this.y, this.size);
        line(this.x, this.y + this.size / 2, this.x, this.y + 2 * this.size);
    }

    move(score) {
        if (score < 100){
            this.y -= 1;
        } else if (score > 100 && score < 200){
            this.y -= 1.5;
        } else this.y -= 2;
    }

    burst(index) {
        Game.balloons.splice(index, 1);
        Game.score += 1
        Game.commonBalloon += 1
    }
}


class UniqBalloon extends CommonBalloon {
    constructor(color, size) {
        super(color, size)
    }

    burst(index) {
        Game.balloons.splice(index, 1);
        Game.score += 10
        Game.uniqBalloon += 1
    }
}

class AngryBalloon extends CommonBalloon{
    constructor(color, size) {
        super(color, size)
    }

    burst(index) {
        Game.balloons.splice(index, 1);
        Game.score -= 10
        Game.angryBalloon += 1
    }
}
