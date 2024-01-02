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

  checkGhostCollision() {}

  changeDirectionIfPossible() {}

  changeAnimation() {}

  draw() {}

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
