// FIXME : 버벅이는 움직임 해결하기
class Ghost {
    /**
     *
     * @param {number} x canvas상의 x좌표
     * @param {number} y canvas상의 x좌표
     * @param {number} width 오브젝트의 너비
     * @param {number} height 오브젝트의 높이
     * @param {number} speed 오브젝트의 속도
     * @param {number} imageX 오브젝트 이미지의 X좌표
     * @param {number} imageY 오브젝트 이미지의 Y좌표
     * @param {number} imageWidth 오브젝트 이미지의 너비
     * @param {number} imageHeight 오브젝트 이미지의 높이
     * @param {number} range 인식범위
     */
    constructor(
        x,
        y,
        width,
        height,
        speed,
        imageX,
        imageY,
        imageWidth,
        imageHeight,
        range,
    ) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = DIRECTION.RIGHT;
        this.imageX = imageX;
        this.imageY = imageY;
        this.imageWidth = imageWidth;
        this.imageHeight = imageHeight;
        this.range = range;
        this.randomTargetIndex = parseInt(
            Math.random() * RandomTargetsForGhosts.length,
        );
        this.target = RandomTargetsForGhosts[this.randomTargetIndex];

        setInterval(() => {
            this.changeRandomDirection();
        }, 10000);
    }

    changeRandomDirection() {
        let addtion = 1;
        this.randomTargetIndex += addtion;
        this.randomTargetIndex =
            this.randomTargetIndex % RandomTargetsForGhosts.length;
    }

    moveProcess() {
        // 범위 안 팩맨 유무 검사
        if (this.isInRange()) {
            this.target = pacman;
        } else {
            this.target = RandomTargetsForGhosts[this.randomTargetIndex];
        }

        this.changeDirectionIfPossible();
        this.moveForward();
        if (this.checkCollision()) {
            this.moveBackward();
            return;
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

    // 충돌 검사
    checkCollision() {
        let collided = false;
        if (
            map[parseInt(this.y / blockSize)][parseInt(this.x / blockSize)] ==
                1 ||
            map[parseInt(this.y / blockSize + 0.9999)][
                parseInt(this.x / blockSize)
            ] == 1 ||
            map[parseInt(this.y / blockSize)][
                parseInt(this.x / blockSize + 0.9999)
            ] == 1 ||
            map[parseInt(this.y / blockSize + 0.9999)][
                parseInt(this.x / blockSize + 0.9999)
            ] == 1
        ) {
            collided = true;
        }

        return collided;
    }

    // 인식범위 안에 팩맨이 있는지 확인
    isInRange() {
        // 팩맨까지 x 거리
        let xDistance = Math.abs(pacman.getMapX() - this.getMapX());
        // 팩맨까지 y 거리
        let yDistance = Math.abs(pacman.getMapX() - this.getMapY());

        // 직선 거리
        // distance = sqrt(dx^2 + dy^2)
        // 직선 거리로 인식범위 내에 있을 시
        if (
            Math.sqrt(xDistance * xDistance + yDistance * yDistance) <=
            this.range
        ) {
            return true;
        }
        return false;
    }

    // 현재 방향과 다른 방향으로 진행 가능하면 방향을 전환한다
    changeDirectionIfPossible() {
        // 현재 진행 방향을 임시로 저장
        let tempDirection = this.direction;

        // 새로운 방향을 계산한다
        this.direction = this.calculateNewDirection(
            map,
            parseInt(this.target.x / blockSize),
            parseInt(this.target.y / blockSize),
        );

        // 예외처리
        if (typeof this.direction == "undefined") {
            this.direction = tempDirection;
            return;
        }

        if (
            this.getMapY() != this.getMapYRightSide() &&
            (this.direction == DIRECTION.LEFT ||
                this.direction == DIRECTION.RIGHT)
        ) {
            this.direction = DIRECTION.UP;
        }
        if (
            this.getMapX() != this.getMapXRightSide() &&
            this.direction == DIRECTION.UP
        ) {
            this.direction = DIRECTION.LEFT;
        }

        this.moveForward();
        if (this.checkCollision()) {
            this.moveBackward();
            this.direction = tempDirection;
        } else {
            this.moveBackward();
        }

        console.log("this.direction :>> ", this.direction);
    }

    /**
     *
     * @param {Array} map 게임 맵
     * @param {number} destX 목적 X좌표
     * @param {number} destY 목적 Y좌표
     * @returns
     */
    calculateNewDirection(map, destX, destY) {
        let mp = []; // 맵 배열 복사
        for (let i = 0; i < map.length; i++) {
            mp[i] = map[i].slice();
        }

        // 큐 생성
        let queue = [
            {
                x: this.getMapX(),
                y: this.getMapY(),
                rightX: this.getMapXRightSide(),
                rightY: this.getMapYRightSide(),
                moves: [],
            },
        ];

        // 큐에서 하나씩 꺼내며
        while (queue.length > 0) {
            let poped = queue.shift();
            if (poped.x == destX && poped.y == destY) {
                return poped.moves[0];
            } else {
                mp[poped.y][poped.x] = 1;
                let neighborList = this.addNeighbors(poped, mp);
                for (let i = 0; i < neighborList.length; i++) {
                    queue.push(neighborList[i]);
                }
            }
        }

        return 1; // direction
    }

    addNeighbors(poped, mp) {
        let queue = [];
        let numOfRows = mp.length;
        let numOfColumns = mp[0].length;

        if (
            poped.x - 1 >= 0 &&
            poped.x - 1 < numOfRows &&
            mp[poped.y][poped.x - 1] != 1
        ) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION.LEFT);
            queue.push({ x: poped.x - 1, y: poped.y, moves: tempMoves });
        }
        if (
            poped.x + 1 >= 0 &&
            poped.x + 1 < numOfRows &&
            mp[poped.y][poped.x + 1] != 1
        ) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION.RIGHT);
            queue.push({ x: poped.x + 1, y: poped.y, moves: tempMoves });
        }
        if (
            poped.y - 1 >= 0 &&
            poped.y - 1 < numOfColumns &&
            mp[poped.y - 1][poped.x] != 1
        ) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION.UP);
            queue.push({ x: poped.x, y: poped.y - 1, moves: tempMoves });
        }
        if (
            poped.y + 1 >= 0 &&
            poped.y + 1 < numOfColumns &&
            mp[poped.y + 1][poped.x] != 1
        ) {
            let tempMoves = poped.moves.slice();
            tempMoves.push(DIRECTION.BOTTOM);
            queue.push({ x: poped.x, y: poped.y + 1, moves: tempMoves });
        }
        return queue;
    }

    draw() {
        ctx.save();
        ctx.drawImage(
            ghostFrames,
            this.imageX,
            this.imageY,
            this.imageWidth,
            this.imageHeight,
            this.x,
            this.y,
            this.width,
            this.height,
        );
        ctx.restore();
        // check the range
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.arc(
            this.x + blockSize / 2,
            this.y + blockSize / 2,
            this.range * blockSize,
            0,
            2 * Math.PI,
        );
        ctx.stroke();
    }

    getMapX() {
        let mapX = parseInt(this.x / blockSize);
        return mapX;
    }

    getMapY() {
        let mapY = parseInt(this.y / blockSize);
        return mapY;
    }

    getMapXRightSide() {
        let mapX = parseInt((this.x * 0.99 + blockSize) / blockSize);
        return mapX;
    }

    getMapYRightSide() {
        let mapY = parseInt((this.y * 0.99 + blockSize) / blockSize);
        return mapY;
    }
}

let updateGhosts = () => {
    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].moveProcess();
    }
};

let drawGhosts = () => {
    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].draw();
    }
};
