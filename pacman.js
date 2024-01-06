class Pacman {
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = DIRECTION.RIGHT;
        this.currentFrame = 1; // 현재 sprite 프레임
        this.frameCount = 7; // sprite 프레임 총 갯수
        this.animationSpeed = 50;
        this.nextDirection = this.direction;
        // 100ms마다 프레임 변경
        setInterval(() => {
            this.changeAnimation();
        }, this.animationSpeed);
    }

    moveProcess() {
        this.changeDirectionIfPossible();
        this.moveForward();
        if (this.checkCollision()) {
            this.moveBackward();
        }
    }

    eat() {
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[0].length; j++) {
                if (
                    map[i][j] == 2 &&
                    this.getMapX() == j &&
                    this.getMapY() == i
                ) {
                    map[i][j] = 3;
                    score = score + 10;
                }
                if (
                    map[i][j] == 4 &&
                    this.getMapX() == j &&
                    this.getMapY() == i
                ) {
                    map[i][j] = 3;
                    score = score + 50;
                }
            }
        }
    }

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

    checkCollision() {
        let isCollided = false;
        if (
            map[this.getMapY()][this.getMapX()] == 1 ||
            map[this.getMapYRightSide()][this.getMapX()] == 1 ||
            map[this.getMapY()][this.getMapXRightSide()] == 1 ||
            map[this.getMapYRightSide()][this.getMapXRightSide()] == 1
        ) {
            return true;
        }

        return false;
    }

    checkGhostCollision() {
        let isCollided = false;
        for (let i = 0; i < ghosts.length; i++) {
            let ghost = ghosts[i];
            if (
                ghost.getMapX() == this.getMapX() &&
                ghost.getMapY() == this.getMapY()
            ) {
                isCollided = true;
            }
        }
        return isCollided;
    }

    // 현재 방향과 다른 방향으로 진행 가능하면 방향을 전환한다
    changeDirectionIfPossible() {
        if (this.direction == this.nextDirection) return;

        // 현재 방향 임시 저장
        let tempDirection = this.direction;
        // 현재 방향을 다음 방향으로 전환
        this.direction = this.nextDirection;

        // 앞으로 이동
        this.moveForward();
        // 충돌시
        if (this.checkCollision()) {
            // 뒤로
            this.moveBackward();
            // 이전 방향으로 재설정
            this.direction = tempDirection;
        } else {
            // 진행 가능시
            this.moveBackward();
        }
    }

    changeAnimation() {
        // 스프라이트 프레임을 순환하게
        this.currentFrame =
            this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x + blockSize / 2, this.y + blockSize / 2);
        ctx.rotate((this.direction * 90 * Math.PI) / 180);
        ctx.translate(-this.x - blockSize / 2, -this.y - blockSize / 2);
        ctx.drawImage(
            pacmanFrames,
            (this.currentFrame - 1) * blockSize,
            0,
            blockSize,
            blockSize,
            this.x,
            this.y,
            this.width,
            this.height,
        );
        ctx.restore();
    }

    // 현재 x좌표
    getMapX() {
        return parseInt(this.x / blockSize);
    }

    // 현재 y좌표
    getMapY() {
        return parseInt(this.y / blockSize);
    }

    //
    getMapXRightSide() {
        return parseInt((this.x + 0.9999 * blockSize) / blockSize);
    }

    getMapYRightSide() {
        return parseInt((this.y + 0.9999 * blockSize) / blockSize);
    }
}
