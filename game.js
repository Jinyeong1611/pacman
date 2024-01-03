/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// 팩맨, 고스트 이미지
const pacmanFrames = document.getElementById("animation");
const ghostFrames = document.getElementById("ghost");
const fps = 30; // game fps
const blockSize = 20; // One block size is 20 by 20 pixels
const wallSpaceWidth = blockSize / 1.5;
const wallOffset = (blockSize - wallSpaceWidth) / 2;
const DIRECTION = {
    RIGHT: 4,
    UP: 3,
    LEFT: 2,
    BOTTOM: 1,
};

const colors = {
    wallColor: "#342dca",
    wallInnerColor: "#000000", // black
    foodColor: "#feb897",
};

let score = 0;

let pacman;
let ghosts = [];
// ghost sprite의 vertex 좌표
let ghostLocations = [
    { x: 0, y: 0 },
    { x: 176, y: 0 },
    { x: 0, y: 121 },
    { x: 176, y: 121 },
];
let ghostCount = 4;
// we now create the map of the walls,
// if 1 wall, if 0 not wall
// 21 columns // 23 rows
let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

canvas.width = map[0].length * blockSize;
canvas.height = 500;

let createRect = (x, y, width, height, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
};

let gameLoop = () => {
    update();
    draw();
};

let update = () => {
    pacman.moveProcess();
    pacman.eat();
};

let drawFoods = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 2) {
                createRect(
                    j * blockSize + blockSize / 3,
                    i * blockSize + blockSize / 3,
                    blockSize / 3,
                    blockSize / 3,
                    colors.foodColor,
                );
            }
        }
    }
};

let drawScore = () => {
    ctx.font = "20px Emulogic";
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + score, 0, blockSize * (map.length + 1));
};

let drawGhosts = () => {
    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].draw();
    }
};

let draw = () => {
    createRect(0, 0, canvas.width, canvas.height, "black");
    drawWalls();
    drawFoods();
    pacman.draw();
    drawScore();
    drawGhosts();
};

let gameInterval = setInterval(gameLoop, 1000 / fps);

let drawWalls = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 1) {
                // then it is wall
                createRect(
                    j * blockSize,
                    i * blockSize,
                    blockSize,
                    blockSize,
                    colors.wallColor,
                );

                if (j > 0 && map[i][j - 1] == 1) {
                    createRect(
                        j * blockSize,
                        i * blockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        colors.wallInnerColor,
                    );
                }

                if (j < map[0].length - 1 && map[i][j + 1] == 1) {
                    createRect(
                        j * blockSize + wallOffset,
                        i * blockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        colors.wallInnerColor,
                    );
                }

                if (i > 0 && map[i - 1][j] == 1) {
                    createRect(
                        j * blockSize + wallOffset,
                        i * blockSize,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        colors.wallInnerColor,
                    );
                }

                if (i < map.length - 1 && map[i + 1][j] == 1) {
                    createRect(
                        j * blockSize + wallOffset,
                        i * blockSize + wallOffset,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        colors.wallInnerColor,
                    );
                }
            }
        }
    }
};

let createNewPacman = () => {
    pacman = new Pacman(
        blockSize,
        blockSize,
        blockSize,
        blockSize,
        blockSize / 5,
    );
};

let createGhost = () => {
    ghosts = [];

    for (let i = 0; i < ghostCount; i++) {
        let newGhost = new Ghost(
            9 * blockSize + (i % 2 == 0 ? 0 : 1) * blockSize,
            10 * blockSize + (i % 2 == 0 ? 0 : 1) * blockSize,
            blockSize,
            blockSize,
            pacman.speed / 2,
            ghostLocations[i % 4].x,
            ghostLocations[i % 4].y,
            124,
            116,
            6 + i,
        );
        ghosts.push(newGhost);
    }
};

createNewPacman();
createGhost();
gameLoop();
window.addEventListener("keydown", (e) => {
    let key = e.key;

    setTimeout(() => {
        if (key == "ArrowLeft" || key == "a") {
            pacman.nextDirection = DIRECTION.LEFT;
        } else if (key == "ArrowRight" || key == "d") {
            pacman.nextDirection = DIRECTION.RIGHT;
        } else if (key == "ArrowUp" || key == "w") {
            pacman.nextDirection = DIRECTION.UP;
        } else if (key == "ArrowDown" || key == "s") {
            pacman.nextDirection = DIRECTION.BOTTOM;
        }
    }, 1);
});
