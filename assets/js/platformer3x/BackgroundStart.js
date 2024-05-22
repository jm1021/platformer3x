import Background from './Background.js';
import GameEnv from './GameEnv.js';

export class BackgroundStart extends Background {
    constructor(canvas, image, data) {
        super(canvas, image, data);

        this.canvasHeight = GameEnv.innerHeight;
    }

    // Draw method to render the background image vertically
}

export default BackgroundStart;