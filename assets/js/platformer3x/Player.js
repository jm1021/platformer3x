import GameEnv from './GameEnv.js';
import Character from './Character.js';
import GameControl from './GameControl.js';

/**
 * @class Player class
 * @description Player.js key objective is to eent the user-controlled character in the game.   
 * 
 * The Player class extends the Character class, which in turn extends the GameObject class.
 * Animations and events are activated by key presses, collisions, and gravity.
 * WASD keys are used by user to control The Player object.  
 * 
 * @extends Character
 */
export class Player extends Character {

    // Default floor state
    floorState = {
        base: 'floor',
        idle: true,
        gravity: true,
        movement: {up: true, down: true, left: true, right: true},
        object: null,
    };
    
    h// Default jump platform state
    jumpPlatformState = {
        base: 'jumpPlatform',
        idle: true,
        gravity: false,
        movement: {up: true, down: false, left: true, right: true},
        object: null,
    };

    // instantiation: constructor sets up player object 
    constructor(canvas, image, data) {
        super(canvas, image, data);
        // Player Data is required for Animations
        this.playerData = data;
        GameEnv.invincible = false; 

        // Player control data
        this.moveSpeed = this.speed * 3;
        this.pressedKeys = {};
        this.directionKey = "d"; // initially facing right

        // Player state data
        this.state = {...this.floorState}; // Start with the floor state

        // Store a reference to the event listener function
        this.keydownListener = this.handleKeyDown.bind(this);
        this.keyupListener = this.handleKeyUp.bind(this);

        // Add event listeners
        document.addEventListener('keydown', this.keydownListener);
        document.addEventListener('keyup', this.keyupListener);

        GameEnv.player = this;
        this.transitionHide = false;
        this.shouldBeSynced = true;
        this.isDying = false;
        this.isDyingR = false;
        this.timer = false;

        this.name = GameEnv.userID;
    }

    /**
     * Helper methods for checking the state of the player.
     * Each method checks a specific condition and returns a boolean indicating whether that condition is met.
     */

    // helper: player facing left
    isFaceLeft() { return this.directionKey === "a"; }
    // helper: left action key is pressed
    isKeyActionLeft(key) { return key === "a"; }
    // helper: player facing right  
    isFaceRight() { return this.directionKey === "d"; }
    // helper: right action key is pressed
    isKeyActionRight(key) { return key === "d"; }
    // helper: dash key is pressed
    isKeyActionDash(key) { return key === "s"; }

    // helper: action key is in queue 
    isActiveAnimation(key) { return (key in this.pressedKeys) && !this.state.idle; }
    // helper: gravity action key is in queue
    isActiveGravityAnimation(key) {
        var result = this.isActiveAnimation(key) && (this.bottom <= this.y || this.state.movement.down === false);
    
        // return to directional animation (direction?)
        if (this.bottom <= this.y || this.state.movement.down === false) {
            this.setAnimation(this.directionKey);
        }
    
        return result;
    }

    goombaCollision() {
        if (this.timer === false) {
            this.timer = true;
            if (GameEnv.difficulty === "normal" || GameEnv.difficulty === "hard") {
                this.canvas.style.transition = "transform 0.5s";
                this.canvas.style.transform = "rotate(-90deg) translate(-26px, 0%)";
                GameEnv.playSound("PlayerDeath");

                if (this.isDying == false) {
                    this.isDying = true;
                    setTimeout(async() => {
                        await GameControl.transitionToLevel(GameEnv.levels[GameEnv.levels.indexOf(GameEnv.currentLevel)]);
                        console.log("level restart")
                        this.isDying = false;
                    }, 900); 
                }
            } else if (GameEnv.difficulty === "easy") {
                this.x += 10;
            }
        }
    }
    /**
     * This helper method that acts like an animation manager. Frames are set according to player events.
     *  - Sets the animation of the player based on the provided key.
     *  - The key is used to look up the animation frame and idle in the objects playerData.
     * If the key corresponds to a left or right movement, the directionKey is updated.
     * 
     * @param {string} key - The key representing the animation to set.
     */
    setAnimation(key) {
        // direction setup
        if (this.isKeyActionLeft(key)) {
            this.directionKey = key;
            this.playerData.w = this.playerData.wa;
        } else if (this.isKeyActionRight(key)) {
            this.directionKey = key;
            this.playerData.w = this.playerData.wd;
        }
        // animation comes from playerData
        var animation = this.playerData[key]
        // set frame and idle frame
        this.setFrameY(animation.row);
        this.setMinFrame(animation.min ? animation.min : 0);
        this.setMaxFrame(animation.frames);
        if (this.state.idle && animation.idleFrame) {
            this.setFrameX(animation.idleFrame.column)
            this.setMinFrame(animation.idleFrame.frames);
        }
    }

    commonUpdate() {
        // Player moving right 
        if (this.isActiveAnimation("a")) {
            if (this.state.movement.left) this.x -= this.isActiveAnimation("s") ? this.moveSpeed : this.speed;  // Move to left
        }
        // Player moving left
        if (this.isActiveAnimation("d")) {
            if (this.state.movement.right) this.x += this.isActiveAnimation("s") ? this.moveSpeed : this.speed;  // Move to right
        }
        // Player moving at dash speed left or right 
        if (this.isActiveAnimation("s")) {}

        // Player jumping
        if (this.isActiveGravityAnimation("w")) {
            GameEnv.playSound("PlayerJump");
            if (this.gravityEnabled) {
                if (GameEnv.difficulty === "easy") {
                    this.y -= (this.bottom * .50);  // bottom jump height
                } else if (GameEnv.difficulty === "normal") {
                    this.y -= (this.bottom * .40);
                } else {
                    this.y -= (this.bottom * .30);
                }
            } else if (this.state.movement.down === false) {
                this.y -= (this.bottom * .15);  // platform jump height
            }
            this.state = {...this.floorState}; // back to floor state 
            this.gravityEnabled = true;
        }
    }
 
    /**
     * gameloop: updates the player's position on the "jumpplatform" platform.
     */
    platformUpdate() {
        // Check if the player has moved off the edge of the jump platform
        if (this.x < this.state.object.x || this.x > this.state.object.x + this.state.object.width) {
            // Return to floor state
            this.state = {...this.floorState};
        }

        this.commonUpdate();
    }

    /**
     * gameloop: updates the player's position on the "floor" platform.
     */
    floorUpdate() {
        //Update the Player Position Variables to match the position of the player
        GameEnv.PlayerPosition.playerX = this.x;
        GameEnv.PlayerPosition.playerY = this.y;

        // GoombaBounce deals with player.js and goomba.js
        if (GameEnv.goombaBounce === true) {
            GameEnv.goombaBounce = false;
            this.y = this.y - 100;
        }

        if (GameEnv.goombaBounce1 === true) {
            GameEnv.goombaBounce1 = false; 
            this.y = this.y - 250
        } 

        this.commonUpdate();

        //Prevent Player from Dashing Through Tube
        let tubeX = (.80 * GameEnv.innerWidth)
        if (this.x >= tubeX && this.x <= GameEnv.innerWidth) {
            this.x = tubeX - 1;

            GameEnv.backgroundHillsSpeed = 0;
            GameEnv.backgroundMountainsSpeed = 0;
        }

        //Prevent Player from Leaving from Screen
        if (this.x < 0) {
            this.x = 1;

            GameEnv.backgroundHillsSpeed = 0;
            GameEnv.backgroundMountainsSpeed = 0;
        }

        // To put mario in the air after stepping on the goomba
        if (GameEnv.goombaBoost === true) {
            GameEnv.goombaBoost = false;
            this.y = this.y - 150;
        }
    }

    /**
     * gameloop: updates the player's state and position.
     * In each refresh cycle of the game loop, the player-specific movement is updated.
     * - If the player is moving left or right, the player's x position is updated.
     * - If the player is dashing, the player's x position is updated at twice the speed.
     * This method overrides Character.update, which overrides GameObject.update. 
     * @override
     */
    update() {
        // Player state update
        if (this.state.base === 'floor') {
            this.floorUpdate();
        } else if (this.state.base === 'jumpplatform') {
            this.platformUpdate();
        }
        // Perform super update actions
        super.update();
    }

    /**
     * gameloop:  responds to level change and game over destroy player object
     * This method is used to remove the event listeners for keydown and keyup events.
     * After removing the event listeners, it calls the parent class's destroy player object. 
     * This method overrides GameObject.destroy.
     * @override
     */
    destroy() {
        // Remove event listeners
        document.removeEventListener('keydown', this.keydownListener);
        document.removeEventListener('keyup', this.keyupListener);

        // Call the parent class's destroy method
        super.destroy();
    }

    /**
     * gameloop: performs action on jump platform
     * Handles idle, gravity, and movement flags.
     * Handles the player's actions when a collision occurs with other game objects. 
     */ 
    jumpPlatformAction() {
        // Stay in Platform state
        const isJumpPlatform = this.collisionData.touchPoints.other.id === "jumpPlatform";
        const isCurrentPlatform = isJumpPlatform && this.collisionData.touchPoints.this.top;
        const isNewJumpPlatform = isJumpPlatform && this.state.object !== this.collisionData.other;

        if (isCurrentPlatform) { // stay on jump platform state 
            this.y -= GameEnv.gravity; // allows movemnt on platform, but climbs walls       
        } else if (isNewJumpPlatform) { // transition to new jump platform
            this.state.object = this.collisionData.other;
            this.y -= GameEnv.gravity; // allows movemnt on platform, but climbs walls       
        }
    }

    /**
     * gameloop: performs action on floor
     * Handles idle, gravity, and movement flags.
     * Handles the player's actions when a collision occurs with other game objects.
     */
    floorAction() {
        // Tube collision check
        if (this.collisionData.touchPoints.other.id === "tube" 
            || this.collisionData.touchPoints.other.id === "tree") {

            // Collision with the left side of the Tube
            if (this.collisionData.touchPoints.other.left) {
                this.state.movement.right = false;
            }
            // Collision with the right side of the Tube
            if (this.collisionData.touchPoints.other.right) {
                this.state.movement.left = false;
            }
            // Collision with the top of the player
            if (this.collisionData.touchPoints.other.bottom) {
                this.x = this.collisionData.newX;
                this.gravityEnabled = false; // stop gravity
                // Pause for two seconds
                setTimeout(() => {   // animation in tube for 1 seconds
                    this.gravityEnabled = true;
                    setTimeout(() => { // move to end of screen for end of game detection
                        this.x = GameEnv.innerWidth + 1;
                    }, 1000);
                }, 1000);
            }
        } else {
            // Reset movement flags if not colliding with a tube
            this.state.movement.left = true;
            this.state.movement.right = true;
        }

        // Goomba collision check
        // Checks if collision touchpoint id is either "goomba" or "flyingGoomba"
        if (this.collisionData.touchPoints.other.id === "goomba" || this.collisionData.touchPoints.other.id === "flyingGoomba") {
            if (GameEnv.invincible === false) {
                GameEnv.goombaInvincible = true;
                // Collision with the left side of the Enemy
                if (this.collisionData.touchPoints.other.left && !this.collisionData.touchPoints.other.bottom && !this.collisionData.touchPoints.other.top && GameEnv.invincible === false && this.timer === false) {
                    setTimeout(this.goombaCollision.bind(this), 50);
                } else if (this.collisionData.touchPoints.other.right && !this.collisionData.touchPoints.other.bottom && !this.collisionData.touchPoints.other.top && GameEnv.invincible === false && this.timer === false) {
                    setTimeout(this.goombaCollision.bind(this), 50);
                }

                // Collision with the right side of the Enemy
            }
        } 

        if (this.collisionData.touchPoints.other.id === "mushroom") {
            GameEnv.destroyedMushroom = true;
            this.canvas.style.filter = 'invert(1)';
        
            setTimeout(() => {
                this.canvas.style.filter = 'invert(0)';
            }, 2000); // 2000 milliseconds = 2 seconds
        }

        if (this.collisionData.touchPoints.other.id === "jumpPlatform") {
            if (this.collisionData.touchPoints.other.left) {
                this.state.movement.right = false;
                this.gravityEnabled = true;
                this.y -= GameEnv.gravity; // allows movemnt on platform, but climbs walls

                // this.x -= this.isActiveAnimation("s") ? this.moveSpeed : this.speed;  // Move to left

            }
            if (this.collisionData.touchPoints.other.right) {
                this.state.movement.left = false;
                this.gravityEnabled = true;
                this.y -= GameEnv.gravity; // allows movemnt on platform, but climbs walls
 
                // this.x += this.isActiveAnimation("s") ? this.moveSpeed : this.speed;  // Move to right
            }
            if (this.collisionData.touchPoints.this.top) {
                //this.state = {...this.jumpPlatformState, object: this.collisionData.other}; 
                this.state.base = 'jumpplatform';
                this.state.gravity = false;
                this.state.movement.down = false;
                this.state.movement.right = true;
                this.state.movement.left = true;
                this.state.object = this.collisionData.other;
            }
        }
        
    }

    /**
     * gameloop: performs action on collisions
     * Handles the player's actions when a collision occurs.
     * This method checks the collision, type of game object, and then to determine action, e.g game over, animation, etc.
     * Depending on the side of the collision, it performs player action, e.g. stops movement, etc.
     * This method overrides GameObject.collisionAction. 
     * @override
     */
    collisionAction() { 
        if (this.state.base === 'floor') {
           this.floorAction();
        } else if (this.state.base === 'jumpplatform') {
            this.jumpPlatformAction();
        }
    }

    /**
     * Handles the keydown event.
     * This method checks the pressed key, then conditionally:
     * - adds the key to the pressedKeys object
     * - sets the player's animation
     * - adjusts the game environment
     *
     * @param {Event} event - The keydown event.
     */    
    
    handleKeyDown(event) {
        if (this.playerData.hasOwnProperty(event.key)) {
            const key = event.key;
            if (!(event.key in this.pressedKeys)) {
                //If both 'a' and 'd' are pressed, then only 'd' will be inputted
                //Originally if this is deleted, player would stand still. 
                if (this.pressedKeys['a'] && key === 'd') {
                    delete this.pressedKeys['a']; // Remove "a" key from pressedKeys
                    return; //(return) = exit early
                } else if (this.pressedKeys['d'] && key === 'a') {
                    // If "d" is pressed and "a" is pressed afterward, ignore "a" key
                    return;
                }
                this.pressedKeys[event.key] = this.playerData[key];
                this.setAnimation(key);
                // player active
                this.state.idle = false;
                GameEnv.transitionHide = true;
            }

            // dash action on
            if (this.isKeyActionDash(key)) {
                GameEnv.dash = true;
                this.canvas.style.filter = 'invert(1)';
            }
            // parallax background speed starts on player movement
            if (this.isKeyActionLeft(key) && this.x > 2) {
                GameEnv.backgroundHillsSpeed = -0.4;
                GameEnv.backgroundMountainsSpeed = -0.1;
            } else if (this.isKeyActionRight(key)) {
                GameEnv.backgroundHillsSpeed = 0.4;
                GameEnv.backgroundMountainsSpeed = 0.1;
            } 
        }
    }

    /**
     * Handles the keyup event.
     * This method checks the released key, then conditionally stops actions from formerly pressed key
     * *
     * @param {Event} event - The keyup event.
     */
    handleKeyUp(event) {
        if (this.playerData.hasOwnProperty(event.key)) {
            const key = event.key;
            if (event.key in this.pressedKeys) {
                delete this.pressedKeys[event.key];
            }
            // player idle
            this.state.idle = true;
            // dash action off
            if (this.isKeyActionDash(key)) {
                this.canvas.style.filter = 'invert(0)';
                GameEnv.dash = false;
            } 
            // parallax background speed halts on key up
            if (this.isKeyActionLeft(key) || this.isKeyActionRight(key) || this.isKeyActionDash(key)) {
                GameEnv.backgroundHillsSpeed = 0;
                GameEnv.backgroundMountainsSpeed = 0;
            }
        }
    }
}

export default Player;