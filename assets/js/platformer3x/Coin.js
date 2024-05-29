import GameControl from './GameControl.js';
import GameEnv from './GameEnv.js';
import GameObject from './GameObject.js';

export class Coin extends GameObject {
    constructor(canvas, image, data, xPercentage, yPercentage) {
        super(canvas, image, data, 0.5, 0.5);
        this.xPercentage = xPercentage
        this.yPercentage = yPercentage
        this.coinX = xPercentage * GameEnv.innerWidth;
        this.coinY = yPercentage;
        this.size();
        this.id = this.initiateId()
    }

    initiateId() {
        const currentCoins = GameEnv.gameObjects

        return currentCoins.length //assign id to the coin's position in the gameObject Array (is unique to the coin)
    }

    // Required, but no update action
    update() {
        this.collisionChecks()
    }

    // Draw position is always 0,0
    draw() {
        // Save the current transformation matrix
        this.ctx.save();

        // Rotate the canvas 90 degrees to the left
        this.ctx.rotate(-Math.PI / 2);

        // Draw the image at the rotated position (swap x and y)
        this.ctx.drawImage(this.image, -this.image.height, 0);

        // Restore the original transformation matrix
        this.ctx.restore();
    }

    // Center and set Coin position with adjustable height and width
    // Center and set Coin position with adjustable height and width
    size() {
        if (this.id) {
            if (GameEnv.claimedCoinIds.includes(this.id)) {
                this.hide();
                return;
            }
        }

        // Constants
        const referenceWidth = 400; // Adjust this value to the original width for scaling
        const referenceHeight = 300; // Adjust this value to the original height for scaling

        // Calculate the canvas scale based on innerWidth
        var canvasScaleWidth = GameEnv.innerWidth / referenceWidth;
        var canvasScaleHeight = GameEnv.innerHeight / referenceHeight;
        var canvasScale = Math.min(canvasScaleWidth, canvasScaleHeight); // Use the smaller scale for uniform scaling

        // Set the scaled dimensions
        const scaledWidth = this.image.width * canvasScale * 0.2; // Adjust the 0.2 scaling factor if needed
        const scaledHeight = this.image.height * canvasScale * 0.169; // Adjust the 0.169 scaling factor if needed

        // Set variables used in Display and Collision algorithms
        this.collisionHeight = scaledHeight;
        this.collisionWidth = scaledWidth;
        this.bottom = (GameEnv.bottom - scaledHeight) * this.coinY

        // Set the canvas style dimensions and positions
        this.canvas.style.width = `${scaledWidth}px`;
        this.canvas.style.height = `${scaledHeight}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${this.coinX}px`;
        this.canvas.style.top = `${this.coinY}px`;
    }


    collisionAction() {
        // check player collision
        if (this.collisionData.touchPoints.other.id === "player") {
            if (this.id) {
                GameEnv.claimedCoinIds.push(this.id)
            }
            this.destroy();
            GameControl.gainCoin(5)
            GameEnv.playSound("coin");
        }
    }
    
    // Method to hide the coin
    hide() {
        this.canvas.style.display = 'none';
    }

    // Method to show the coin
    show() {
        this.canvas.style.display = 'block';
    }
}

export default Coin;