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

    moveBackward() {
        switch (this.direction) {
            case DIRECTION.RIGHT:
                this.x -= this.speed;
                break;
            case DIRECTION.UP:
                this.y += this.speed;
                break;
            case DIRECTION.LEFT:
                this.x += this.speed;
                break;
            case DIRECTION.BOTTOM:
                this.y -= this.speed;
                break;
        }
    }

    moveForward() {
        switch (this.direction) {
            case DIRECTION.RIGHT:
                this.x += this.speed;
                break;
            case DIRECTION.UP:
                this.y -= this.speed;
                break;
            case DIRECTION.LEFT:
                this.x -= this.speed;
                break;
            case DIRECTION.BOTTOM:
                this.y += this.speed;
                break;
        }
    }

    checkCollision() {}

    checkGhostCollision() {}

    changeDirectionIfPossible() {}

    changeAnimation() {}

    draw() {}
}
