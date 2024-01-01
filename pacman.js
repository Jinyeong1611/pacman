class Pacman {
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = DIRECTION.RIGHT;
    }

    moveProcess() {
        this.changeDirectionIfPossible();
        this.moveForward();
        if (this.checkCollision()) {
            this.moveBackward();
        }
    }

    eat() {}

    moveBackward() {}

    moveForward() {}

    checkCollision() {}

    checkGhostCollision() {}

    changeDirectionIfPossible() {}

    changeAnimation() {}

    draw() {}
}
