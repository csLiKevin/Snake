import { DOWN, LEFT, RIGHT, UP } from "./constants.js";


export class Snake {
    /**
     * Initialize a snake instance.
     * 
     * @param {number} xCor Initial x coordinate.
     * @param {number} yCor Initial y coordinate.
     */
    constructor(xCor, yCor) {
        this.coordinates = [[xCor, yCor]]; // Keeps track of all the cells the snake occupies.
        this.direction = null; // Keeps track of the direction the snake is currently going.
    }

    /**
     * The coordinates of the snake's head.
     * @returns {number[]} A coordinate pair.
     */
    get head() {
        // Note that the head is represented by the last element of the array.
        return this.coordinates[this.coordinates.length - 1];
    }

    /**
     * The coordinates the snake is headed towards.
     * @returns {number[]} A coordinate pair.
     */
    get nextHead() {
        const [headX, headY] = this.head;

        switch(this.direction) {
            case DOWN:
                return [headX, headY + 1];
            case LEFT:
                return [headX -1, headY];
            case RIGHT:
                return [headX + 1, headY];
            case UP:
                return [headX, headY - 1];
            default:
                return [headX, headY];
        }
    }

    /**
     * Check if the snake occupies a coordinate.
     * 
     * @param {number} xCor X coordinate.
     * @param {number} yCor Y coordinate.
     */
    contains(xCor, yCor) {
        return JSON.stringify(this.coordinates).includes(JSON.stringify([xCor, yCor]));
    }

    /**
     * Move the snake forward.
     */
    move(eat=false) {
        const [headX, headY] = this.head;
        const [nextHeadX, nextHeadY] = this.nextHead;

        if (nextHeadX !== headX || nextHeadY !== headY) {
            this.coordinates.push(this.nextHead);

            if (!eat) {
                // If the snake did not eat we remove the oldest position.
                this.coordinates.shift();
            }
        }
    }

    /**
     * Paint the snake.
     * 
     * @param {Object} context 2D rendering context of a canvas element.
     * @param {number} scale Number of times to enlarge the snake.
     */
    paint(context, scale=1) {
        context.fillStyle = "springgreen";

        this.coordinates.forEach(([xCor, yCor]) => {
            const scaledXCor = xCor * scale;
            const scaledYCor = yCor * scale;
            context.fillRect(scaledXCor, scaledYCor, scale, scale);
        });
    }

    /**
     * Set the direction of the snake.
     *
     * @param {string} direction New movement direction.
     */
    setDirection(direction) {
        // Prevent the snake from doing a 180.
        if (
            (this.direction === DOWN && direction !== UP) ||
            (this.direction === LEFT && direction !== RIGHT) ||
            (this.direction === RIGHT && direction !== LEFT) ||
            (this.direction === UP && direction !== DOWN) ||
            (!this.direction)
        ) {
            this.direction = direction;
        }
    }
}

export default Snake;
