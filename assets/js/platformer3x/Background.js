import GameEnv from './GameEnv.js';
import GameObject from './GameObject.js';
import GameControl from './GameControl.js';


export class Background extends GameObject {
    constructor(canvas, image, data) {
        super(canvas, image, data);

        if (isNaN(GameEnv.innerWidth) || isNaN(GameEnv.innerHeight)) {
            GameEnv.initialize();
        }

        console.log(`width:${this.canvasWidth}, height:${this.canvasHeight}`)
    }

    /* Update uses modulo math to cycle to start at width extent
    *  x is position in cycle 
    *  speed can be used to scroll faster
    *  width is extent of background image
    */
    update() {
        this.x = (this.x - this.speed) % this.width;
        // console.log(this.x)
        if (GameControl.randomEventId === 1 && GameControl.randomEventState === 1) {
            this.canvas.style.filter = "invert(100)";
            GameControl.endRandomEvent();
        }
    }

    /* To draws are used to capture primary frame and wrap around ot next frame
     * x to y is primary draw
     * x + width to y is wrap around draw
    */
    draw() {
        const canvasWidth = this.canvasWidth;
    
        // Normalize the x position for seamless wrapping
        let xWrapped = this.x % this.width;
        if (xWrapped > 0) {
            xWrapped -= this.width;
        }
    
        // Calculate how many times to potentially draw the image to cover wide viewports
        let numDraws = Math.ceil(canvasWidth / this.width) + 1; // +1 to ensure overlap coverage
    
        // Draw the image multiple times to cover the entire canvas
        for (let i = 0; i < numDraws; i++) {
            this.ctx.drawImage(this.image, 0, this.y, this.width, this.height, xWrapped + i * this.width, this.y, this.width, this.height);
        }
    }
    
    
    
    

    /* Background camvas is set to screen sizes
    */ 
    size() {
        this.canvasWidth = GameEnv.innerWidth
        this.canvasHeight = GameEnv.innerHeight * (GameEnv.funFact ? 0.8 : 0.9);

        // Update canvas size
        const canvasLeft = 0;
        GameEnv.backgroundHeight = this.canvasHeight;

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.width = `${this.canvasWidth}px`;
        this.canvas.style.height = `${GameEnv.backgroundHeight}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${canvasLeft}px`;
        this.canvas.style.top = `${GameEnv.top}px`;

        // set bottom of game to new background height
        GameEnv.setBottom(); 
        this.draw()
    }
}

export default Background;