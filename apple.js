export class Apple {
    /**
     * Initialize an apple instance.
     * 
     * @param {number} xCor Initial x coordinate.
     * @param {number} yCor Initial y coordinate.
     */
    constructor(xCor, yCor) {
        this.xCor = xCor;
        this.yCor = yCor;
    }

    /**
     * Get the apple's position as a coordinate pair.
     *
     * @return {number[]} The apple's coordinates.
     */
    get coordinate() {
        return [this.xCor, this.yCor];
    }

    /**
     * Paint the apple.
     * 
     * @param {Object} context 2D rendering context of a canvas element.
     * @param {number} scale Number of times to enlarge the apple.
     */
    paint(context, scale=1) {
        const scaledXCor = this.xCor * scale;
        const scaledYCor = this.yCor * scale;

        context.fillStyle = "tomato";
        context.fillRect(scaledXCor, scaledYCor, scale, scale);
    }
}

export default Apple;
