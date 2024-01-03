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
        this.target;
        this.randomTargetIndex = parseInt(
            Math.random() * RandomTargetsForGhosts.length,
        );

        setInterval(() => {
            this.changeRandomDirection();
        }, 10000);
    }

    changeRandomDirection() {
        this.randomTargetIndex += 1;
        this.randomTargetIndex =
            this.randomTargetIndex % RandomTargetsForGhosts.length;
    }

    moveProcess() {
        if (this.isInRangeOfPacman()) {
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

    checkCollision() {
        let collided = false;
        if (
            map[this.getMapY()][this.getMapX()] == 1 ||
            map[this.getMapYRightSide()][this.getMapX()] == 1 ||
            map[this.getMapY()][this.getMapXRightSide()] == 1 ||
            map[this.getMapYRightSide()][this.getMapXRightSide()] == 1
        ) {
            collided = true;
        }

        return collided;
    }

    // 인식범위 안에 팩맨이 있는지 확인
    isInRangeOfPacman() {
        // 팩맨까지 x 거리
        let xDistance = Math.abs(pacman.getMapX() - this.getMapX());
        // 팩맨까지 y 거리
        let yDistance = Math.abs(pacman.getMapX() - this.getMapY());

        // 직선 거리
        let distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance); // distance = sqrt(dx^2 + dy^2)

        // 직선 거리로 인식범위 내에 있을 시
        if (distance <= this.range) {
            return true;
        }
        return false;
    }

    // 현재 방향과 다른 방향으로 진행 가능하면 방향을 전환한다
    changeDirectionIfPossible() {
        let tempDirection = this.direction;

        this.direction = this.calculateNewDirection(
            map,
            parseInt(this.target.x / blockSize),
            parseInt(this.target.y / blockSize),
        );

        if (typeof this.direction == "undefined") {
            this.direction = tempDirection;
            return;
        }

        this.moveForward();
        if (this.checkCollision()) {
            this.moveBackward();
            this.direction = tempDirection;
        } else {
            this.moveBackward();
        }
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
                moves: [],
            },
        ];

        // 큐에서 하나씩 꺼내며
        while (queue.length > 0) {
            let poped = queue.shift();
            // ㅇ
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

        return DIRECTION.UP; //default
    }

    addNeighbors(poped, mp) {
        let queue = [];
        let numOfRows = mp.length;
        let numOfCols = mp[0].length;

        // 상하좌우 각각 네 방향으로 길이 막혀있지 않으면 큐에 추가한다
        if (
            // 왼쪽
            poped.x - 1 >= 0 &&
            poped.x - 1 < numOfCols &&
            mp[poped.y][poped.x - 1] != 1
        ) {
            let tempMoves = poped.moves.slice(); // 인자값 없이 slice를 사용하면 배열을 복제하는 효과를 낸다
            tempMoves.push(DIRECTION.LEFT); // 방향 추가
            queue.push({ x: poped.x - 1, y: poped.y, moves: tempMoves }); // 추가한 방향을 담아 queue로 보낸다
        }

        if (
            // 오른쪽
            poped.x + 1 >= 0 &&
            poped.x + 1 < numOfCols &&
            mp[poped.y][poped.x + 1] != 1
        ) {
            let tempMoves = poped.moves.slice(); // 인자값 없이 slice를 사용하면 배열을 복제하는 효과를 낸다
            tempMoves.push(DIRECTION.RIGHT); // 방향 추가
            queue.push({ x: poped.x - 1, y: poped.y, moves: tempMoves }); // 추가한 방향을 담아 queue로 보낸다
        }

        if (
            // 위
            poped.y - 1 >= 0 &&
            poped.y - 1 < numOfRows &&
            mp[poped.y - 1][poped.x] != 1
        ) {
            let tempMoves = poped.moves.slice(); // 인자값 없이 slice를 사용하면 배열을 복제하는 효과를 낸다
            tempMoves.push(DIRECTION.UP); // 방향 추가
            queue.push({ x: poped.x, y: poped.y - 1, moves: tempMoves }); // 추가한 방향을 담아 queue로 보낸다
        }

        if (
            // 아래
            poped.y + 1 >= 0 &&
            poped.y + 1 < numOfRows &&
            mp[poped.y + 1][poped.x] != 1
        ) {
            let tempMoves = poped.moves.slice(); // 인자값 없이 slice를 사용하면 배열을 복제하는 효과를 낸다
            tempMoves.push(DIRECTION.BOTTOM); // 방향 추가
            queue.push({ x: poped.x, y: poped.y + 1, moves: tempMoves }); // 추가한 방향을 담아 queue로 보낸다
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
