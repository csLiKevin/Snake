import { Apple } from "./apple.js";
import { Snake } from "./snake.js";


export class Game {
    /**
     * Initialize a game instance.
     * 
     * @param {Element} gameArea A canvas element for the game to be rendered in.
     * @param {number} scale Enlarge the game's 1x1 cells.
     */
    constructor(gameArea, scale=1) {
        this.gameArea = gameArea;
        this.gameOver = false;
        this.scale = scale;
        this.maxX = this.gameArea.width / this.scale - 1;
        this.maxY = this.gameArea.height / this.scale - 1;
        this.handleKeyPush = this.handleKeyPush.bind(this);

        // Add handler for user input.
        document.addEventListener("keydown", this.handleKeyPush);

        this.setUp();
    }

    /**
     * Get a random coordinate not occupied by a snake or apple.
     * 
     * @return {number[]} A coordinate pair.
     */
    getRandomAvailableCoordinate() {
        // Build the list of unavailable coordinates.
        let unavailableCoordinates = [];
        if (this.apple) {
            unavailableCoordinates.push(this.apple.coordinate);
        }
        if (this.snake) {
            unavailableCoordinates = unavailableCoordinates.concat(this.snake.coordinates);
        }
        unavailableCoordinates = JSON.stringify(unavailableCoordinates);

        // Build the list of available coordinates.
        const coordinates = [];
        for (let xCor = 0; xCor <= this.maxX; xCor++) {
            for (let yCor = 0; yCor <= this.maxY; yCor++) {
                const coordinate = [xCor, yCor];
                if (!unavailableCoordinates.includes(JSON.stringify(coordinate))) {
                    coordinates.push([xCor, yCor]);
                }
            }
        }

        // Select a random index in the list of available coordinates.
        return coordinates[Math.floor(Math.random() * coordinates.length)];
    }

    /**
     * Handle user interaction with the game.
     * 
     * @param {Object} event Key down event.
     */
    handleKeyPush(event) {
        this.snake.setDirection(event.key);

        if (this.gameOver) { // Start a new game.
            this.setUp();
        } else if (this.gameLoop === null) { // Start a game loop if there isn't already one in progress.
            this.run();
        }
    }

    /**
     * Paint the game objects onto the game area.
     */
    paint() {
        const context = this.gameArea.getContext("2d");

        if (this.gameOver) {
            // Show the game over screen.
            context.font = `${this.scale * 2}px monospace`;
            context.fillStyle = "white";
            context.textAlign = "center";
            context.fillText(
                "Game Over. Press any key.",
                this.maxX / 2 * this.scale,
                this.maxY / 2 * this.scale
            );
        } else {
            // Paint the background.
            context.fillStyle = "black";
            context.fillRect(0, 0, this.gameArea.clientWidth, this.gameArea.height);

            // Paint the snake.
            this.snake.paint(context, this.scale);

            // Paint the apple.
            this.apple.paint(context, this.scale);
        }
    }

    /**
     * Start the game loop.
     */
    run() {
        // Update the game state ten times a second.
        this.gameLoop = setInterval(() => this.step(), 1000 / 10);
    }

    /**
     * Place the game elements for a new game.
     */
    setUp() {
        // Add an apple.
        const [appleX, appleY] = this.getRandomAvailableCoordinate();
        this.apple = new Apple(appleX, appleY);
        
        // Add a snake.
        const [snakeX, snakeY] = this.getRandomAvailableCoordinate();
        this.snake = new Snake(snakeX, snakeY);

        // Keeps track of the game loop.
        this.gameLoop = null;
        this.gameOver = false;

        this.paint();
    }

    /**
     * Advance the game state.
     */
    step() {
        const [nextHeadX, nextHeadY] = this.snake.nextHead;
        const [appleX, appleY] = this.apple.coordinate;

        // Check to see if the snake is still in bounds in the next state.
        if (nextHeadX < 0 || nextHeadX > this.maxX || nextHeadY < 0 || nextHeadY > this.maxY) {
            this.gameOver = true;
        } else if (this.snake.contains(nextHeadX, nextHeadY)) { // Check to see if the snake ate itself.
            this.gameOver = true;
        } else if (nextHeadX === appleX && nextHeadY === appleY) { // Check to see if the snake ate an apple.
            this.snake.move(true);

            // Change the apple location.
            const [nextAppleX, nextAppleY] = this.getRandomAvailableCoordinate();
            this.apple.xCor = nextAppleX;
            this.apple.yCor = nextAppleY;
        } else {
            this.snake.move();
        }

        this.paint();

        if (this.gameOver) {
            this.stop();
        }
    }

    /**
     * Stop the game loop.
     */
    stop() {
        clearInterval(this.gameLoop);
        this.gameLoop = null;
    }
}

export default Game;
