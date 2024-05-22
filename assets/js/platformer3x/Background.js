import GameEnv from './GameEnv.js';
import GameObject from './GameObject.js';
import GameControl from './GameControl.js';


export class Background extends GameObject {
    constructor(canvas, image, data) {
        super(canvas, image, data);

        this.canvasWidth = GameEnv.innerWidth;

        // New inner height accounts for navbar height and gives some space for platform
        this.canvasHeight = GameEnv.innerHeight * 0.9;
        // this.canvasHeight = this.canvasWidth / (16/9) - 120 // force 16:9 and account for bottom and nav

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
    
    
    
    

    /* Background camvas is set to screen
     * the ADJUST contant elements portions of image that don't wrap well
     * the GameEnv.top is a getter used to set canvas under Menu
     * the GameEnv.bottom is setter used to establish game bottom at offsetHeight of canvas 
    */ 
    size() {
        // Update canvas size
        const ADJUST = 1 // visual layer adjust; alien_planet.jpg: 1.42, try 1 for others

        // const canvasHeight = canvasWidth / this.aspect_ratio
        const canvasHeight = this.canvasHeight;
        const canvasWidth = this.canvasWidth;
        GameEnv.backgroundHeight = canvasHeight;
        const canvasLeft = 0;

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.width = `${canvasWidth}px`;
        this.canvas.style.height = `${GameEnv.backgroundHeight}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${canvasLeft}px`;
        this.canvas.style.top = `${GameEnv.top}px`;

        // set bottom of game to new background height
        GameEnv.setBottom(); 
    }
}

export default Background;