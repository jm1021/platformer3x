import Background from './Background.js';
import GameEnv from './GameEnv.js';

export class BackgroundStart extends Background {
    constructor(canvas, image, data) {
        super(canvas, image, data);

        // take up whole screen
        this.canvasHeight = GameEnv.innerHeight;
    }
}

export default BackgroundStart;