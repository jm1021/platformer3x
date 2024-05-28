
// GameSehup.js Key objective is to define GameLevel objects and their assets.
import GameEnv from './GameEnv.js';
import GameLevel from './GameLevel.js';
// To build GameLevels, each contains GameObjects from below imports
import Background from './Background.js'
import BackgroundStart from './BackgroundStart.js';
import GameControl from './GameControl.js';
import GameSet from './GameSet.js';
import GameSetterStart from './GameSetterStart.js';
import GameSetterHills from './GameSetterHills.js';
import GameSetterWater from './GameSetterWater.js';
import GameSetterGreece from './GameSetterGreece.js';
import GameSetterGreeceMini from './GameSetterGreeceMini.js';
import GameSetterQuidditch from './GameSetterQuidditch.js';
import GameSetterHogwarts from './GameSetterHogwarts.js';
import GameSetterWinter from './GameSetterWinter.js';
import GameSetterWinterIce from './GameSetterWinterIce.js';
import GameSetterBoss from './GameSetterBoss.js';
import GameSetterSkibidi from './GameSetterSkibidi.js';
import GameSetterEnd from './GameSetterEnd.js';
//test comment

/* Coding Style Notes
 *
 * GameSetup is defined as an object literal in in Name Function Expression (NFE) style
 * * const GameSetup = function() { ... } is an NFE
 * * NFEs are a common pattern in JavaScript, reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function 
 *
 * * Informerly, inside of GameSetup it looks like defining keys and values that are functions.
 * * * GameSetup is a singleton object, object literal, without a constructor.
 * * * This coding style ensures one instance, thus the term object literal.
 * * * Inside of GameSetup, the keys are functions, and the values are references to the functions.
 * * * * The keys are the names of the functions.
 * * * * The values are the functions themselves.
 *
 * * Observe, encapulation of this.assets and sharing data between methods.
 * * * this.assets is defined in the object literal scope.
 * * * this.assets is shared between methods.
 * * * this.assets is not accessible outside of the object literal scope.
 * * * this.assets is not a global variable.
 * 
 * * Observe, the use of bind() to bind methods to the GameSetup object.
 * * * * bind() ensures "this" inside of methods binds to "GameSetup"
 * * * * this avoids "Temporal Dead Zone (TDZ)" error...
 * 
 * 
 * Usage Notes
 * * call GameSetup.initLevels() to setup the game levels and assets.
 * * * the remainder of GameSetup supports initLevels()
 * 
*/

// Define the GameSetup object literal
const GameSetup = {

  /*  ==========================================
   *  ===== Game Level Methods +++==============
   *  ==========================================
   * Game Level methods support Game Play, and Game Over
   * * Helper functions assist the Callback methods
   * * Callback methods are called by the GameLevel objects
   */

  /**
   * Helper function that waits for a button click event.
   * @param {string} id - The HTML id or name of the button.
   * @returns {Promise<boolean>} - A promise that resolves when the button is clicked.
   * References:
   * * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
   * *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve
   */
  waitForButtonStart: function (id) {
    // Returns a promise that resolves when the button is clicked
    return new Promise((resolve) => {
      const waitButton = document.getElementById(id);
      // Listener function to resolve the promise when the button is clicked
      const waitButtonListener = () => {
        resolve(true);
      };
      // Add the listener to the button's click event
      waitButton.addEventListener('click', waitButtonListener);
    });
  },

  waitForButtonRestart: function (id) {
    // Returns a promise that resolves when the button is clicked
    return new Promise((resolve) => {
      const waitButton = document.getElementById(id);
      // Listener function to resolve the promise when the button is clicked
      const waitButtonListener = () => {
        if (document.getElementById('timeScore')) {
          document.getElementById('timeScore').textContent = GameEnv.time
        }
        const userScoreElement = document.getElementById('userScore');

        if (userScoreElement) {
          // Update the displayed time
          userScoreElement.textContent = (GameEnv.coinScore / 1000).toFixed(2);
        }
        resolve(true);
      };
      // Add the listener to the button's click event
      waitButton.addEventListener('click', waitButtonListener);
    });
  },

  /*  ==========================================
   *  ===== Game Level Call Backs ==============
   *  ==========================================
   * Game Level callbacks are functions that return true or false
   */

  /**
   * Start button callback.
   * Unhides the gameBegin button, waits for it to be clicked, then hides it again.
   * @async
   * @returns {Promise<boolean>} Always returns true.
   */
  startGameCallback: async function () {
    const id = document.getElementById("gameBegin");
    // Unhide the gameBegin button
    id.hidden = false;

    // Wait for the startGame button to be clicked
    await this.waitForButtonStart('startGame');
    // Hide the gameBegin button after it is clicked
    id.hidden = true;

    return true;
  },

  /**
   * Home screen exits on the Game Begin button.
   * Checks if the gameBegin button is hidden, which means the game has started.
   * @returns {boolean} Returns true if the gameBegin button is hidden, false otherwise.
   */
  homeScreenCallback: function () {
    // gameBegin hidden means the game has started
    const id = document.getElementById("gameBegin");
    return id.hidden;
  },

  /**
   * Level completion callback, based on Player off screen.
   * Checks if the player's x position is greater than the innerWidth of the game environment.
   * If it is, resets the player for the next level and returns true.
   * If it's not, returns false.
   * @returns {boolean} Returns true if the player's x position is greater than the innerWidth, false otherwise.
   */
  playerOffScreenCallBack: function () {
    // console.log(GameEnv.player?.x)
    if (GameEnv.player?.x > GameEnv.innerWidth) {
      GameEnv.player = null; // reset for next level
      return true;
    } else {
      return false;
    }
  },

  /**
   * Game Over callback.
   * Unhides the gameOver button, waits for it to be clicked, then hides it again.
   * Also sets the currentLevel of the game environment to null.
   * @async
   * @returns {Promise<boolean>} Always returns true.
   */
  gameOverCallBack: async function () {
    const id = document.getElementById("gameOver");
    id.hidden = false;
    GameControl.stopTimer()
    // Wait for the restart button to be clicked
    await this.waitForButtonRestart('restartGame');
    id.hidden = true;

    // Change currentLevel to start/restart value of null
    GameEnv.currentLevel = false;

    return true;
  },

  /*  ==========================================
   *  ========== Game Level Init ===============
   *  ==========================================
  */
  initLevels: function (path) {  
    // ensure valid {{site.baseurl}} for path
    this.path = path;

    var fun_facts = {
      //data structure
      "Fun Fact #1": "Mario's full name is Mario Mario.", //key and value
      "Fun Fact #2": "Mario's least favorite food is shiitake mushrooms.", //single quotes to include the double quotes
      "Fun Fact #3": "Mario, in human years, is 24-25 years old.",
      "Fun Fact #4": "Mario's girlfriend's name is Pauline.",
      "Fun Fact #5": "Call or text 929-55-MARIO (929-556-2746) to get a fun surprise!",
      "Fun Fact #6": "Mario's original name was Jumpman.",
      "Fun Fact #7": "March 10th is known as Mario Day because the abbreviation for March 10th (Mar10) looks like Mario.",
      "Fun Fact #8": "Mario was originally a carpenter, not a plumber.",
      "Fun Fact #9": "There are actually lyrics to the Mario theme song."
    }
    function generate() {
      var nums = Object.keys(fun_facts);
      //console.log(nums);
      var num = nums[Math.floor(Math.random() * nums.length)]
      var fun_fact = fun_facts[num]; //using dictionary
      //access ids
      document.getElementById("fun_fact").innerHTML = fun_fact;
      document.getElementById("num").innerHTML = num;
    }

    let k = 0;
    let interval2 = setInterval(() => {
      generate();
      k++;
      if (k == fun_facts.length) {
        clearInterval(interval2);
      }
    }, 3000);

    // Home screen added to the GameEnv ...
    new GameLevel({ tag: "start", callback: this.startGameCallback });
    const homeGameObjects = [
      { name: 'background', id: 'background', class: BackgroundStart, data: this.assets.backgrounds.start }
    ];
    // Home Screen Background added to the GameEnv, "passive" means complementary, not an interactive level..
    new GameLevel({ tag: "home", callback: this.homeScreenCallback, objects: homeGameObjects, passive: true });

    // Check local storage for the difficulty mode set
    let difficulty = localStorage.getItem("difficulty") || "easy";

    // If difficulty is not set (null or undefined), set it to a default value
    // if (!difficulty) {
    //     difficulty = "normal"; // Set default difficulty to "normal" or any other suitable value
    // }

    // Hills Game Level defintion...
    const allHillsGameObjects = [
      { name: 'mountains', id: 'background', class: BackgroundParallax, data: this.assets.backgrounds.mountains },
      { name: 'clouds', id: 'background', class: BackgroundParallax, data: this.assets.backgrounds.clouds },
      { name: 'hills', id: 'background', class: BackgroundParallax, data: this.assets.backgrounds.hills },
      { name: 'grass', id: 'floor', class: Platform, data: this.assets.platforms.grass },
      { name: 'blocks', id: 'jumpPlatform', class: MovingPlatform, data: this.assets.platforms.block, xPercentage: 0.2, yPercentage: 0.85 },
      { name: 'blocks', id: 'jumpPlatform', class: MovingPlatform, data: this.assets.platforms.block, xPercentage: 0.2368, yPercentage: 0.85 },
      { name: 'blocks', id: 'jumpPlatform', class: MovingPlatform, data: this.assets.platforms.block, xPercentage: 0.2736, yPercentage: 0.85 },
      { name: 'blocks', id: 'wall', class: SpawnPlatform, data: this.assets.platforms.block, xPercentage: 0.6, yPercentage: 1 },
      { name: 'itemBlock', id: 'jumpPlatform', class: JumpPlatform, data: this.assets.platforms.itemBlock, xPercentage: 0.4, yPercentage: 0.65 }, //item block is a platform
      { name: 'goomba', id: 'goomba', class: Goomba, data: this.assets.enemies.goomba, xPercentage: 0.5, yPercentage: 1, minPosition: 0.05 },
      { name: 'goomba', id: 'goomba', class: Goomba, data: this.assets.enemies.goomba, xPercentage: 0.4, yPercentage: 1, minPosition: 0.05, difficulties: ["normal", "hard", "impossible"] },
      { name: 'goomba', id: 'goomba', class: Goomba, data: this.assets.enemies.goomba, xPercentage: 0.3, yPercentage: 1, minPosition: 0.05, difficulties: ["normal", "hard", "impossible"] },
      { name: 'goomba', id: 'goomba', class: Goomba, data: this.assets.enemies.goomba, xPercentage: 0.2, yPercentage: 1, minPosition: 0.05, difficulties: ["hard", "impossible"] },
      { name: 'goomba', id: 'goomba', class: Goomba, data: this.assets.enemies.goomba, xPercentage: 0.1, yPercentage: 1, minPosition: 0.05, difficulties: ["impossible"] },
      { name: 'goombaSpecial', id: 'goomba', class: Goomba, data: this.assets.enemies.goomba, xPercentage: 0.75, yPercentage: 1, minPosition: 0.5 }, //this special name is used for random event 2 to make sure that only one of the Goombas ends the random event
      { name: 'goombaSpecial', id: 'goomba', class: Goomba, data: this.assets.enemies.goomba, xPercentage: 0.95, yPercentage: 1, minPosition: 0.5, difficulties: ["hard", "impossible"] }, //this special name is used for random event 2 to make sure that only one of the Goombas ends the random event
      { name: 'flyingGoomba', id: 'flyingGoomba', class: FlyingGoomba, data: this.assets.enemies.flyingGoomba, xPercentage: 0.9, minPosition: 0.5, difficulties: ["normal", "hard", "impossible"] },
      { name: 'flyingGoomba', id: 'flyingGoomba', class: FlyingGoomba, data: this.assets.enemies.flyingGoomba, xPercentage: 0.9, minPosition: 0.5, difficulties: ["hard", "impossible"] },
      { name: 'flyingGoomba', id: 'flyingGoomba', class: FlyingGoomba, data: this.assets.enemies.flyingGoomba, xPercentage: 0.9, minPosition: 0.5, difficulties: ["impossible"] },
      { name: 'mushroom', id: 'mushroom', class: Mushroom, data: this.assets.enemies.mushroom, xPercentage: 0.49 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.1908, yPercentage: 0.75 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.2242, yPercentage: 0.75 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.2575, yPercentage: 0.75 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.5898, yPercentage: 0.900 },
      { name: 'mario', id: 'player', class: PlayerHills, data: this.assets.players.mario },
      { name: 'tube', id: 'finishline', class: FinishLine, data: this.assets.obstacles.tube, xPercentage: 0.85, yPercentage: 0.65 },
      { name: 'loading', id: 'background', class: BackgroundTransitions, data: this.assets.transitions.loading },
    ];
    let hillsGameObjects = allHillsGameObjects.filter(obj => !obj.difficulties || obj.difficulties.includes(difficulty));
    // Hills Game Level added to the GameEnv ...
    new GameLevel({ tag: "hills", callback: this.playerOffScreenCallBack, objects: hillsGameObjects });


    // Greece Game Level definition...
    const greeceGameObjects = [
      // GameObject(s), the order is important to z-index...
      { name: 'greece', id: 'background', class: Background, data: this.assets.backgrounds.greece },
      { name: 'grass', id: 'platform', class: Platform, data: this.assets.platforms.grass },
      { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.2, yPercentage: 0.82 },
      { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.2368, yPercentage: 0.82 },
      { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.2736, yPercentage: 0.82 },
      { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.3104, yPercentage: 0.82 },
      { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.3472, yPercentage: 0.82 },
      { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.384, yPercentage: 0.76 },
      { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.4208, yPercentage: 0.70 },
      { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.5090, yPercentage: 0.64 },
      //{ name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.5642, yPercentage: 0.34 },
      //{ name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.5274, yPercentage: 0.34 },
      //{ name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.4906, yPercentage: 0.34 },
      { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 1 },
      { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.94 },
      { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.88 },
      { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.82 },
      { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.76 },
      { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.70 },
      //{ name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.64 },
      //{ name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.58 },
      //{ name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.52 },
      //{ name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.46 },
      //{ name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.40 },
      { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.34 },
      { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.28 },
      { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.22 },
      { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.6368, yPercentage: 0.64 },
      //{ name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.16 },
      //{ name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.1 },
      //{ name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.6, yPercentage: 0.06 },
      { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 1 },
      { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.94 },
      { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.88 },
      { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.82 },
      { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.76 },
      { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.70 },
      { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.64 },
      { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.58 },
      { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.52 },
      //{ name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.46 },
      //{ name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.40 },
      //{ name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.34 },
      //{ name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.28 },
      { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.22 },
      //{ name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.16 },
      //{ name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.1 },
      //{ name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.sandstone, xPercentage: 0.75, yPercentage: 0.06 },
      { name: 'cerberus', id: 'cerberus', class: Cerberus, data: this.assets.enemies.cerberus, xPercentage: 0.2, minPosition: 0.09, difficulties: ["normal", "hard", "impossible"] },
      { name: 'cerberus', id: 'cerberus', class: Cerberus, data: this.assets.enemies.cerberus, xPercentage: 0.2, minPosition: 0.09, difficulties: ["normal", "hard", "impossible"] },
      { name: 'cerberus', id: 'cerberus', class: Cerberus, data: this.assets.enemies.cerberus, xPercentage: 0.5, minPosition: 0.3, difficulties: ["normal", "hard", "impossible"] },
      { name: 'cerberus', id: 'cerberus', class: Cerberus, data: this.assets.enemies.cerberus, xPercentage: 0.7, minPosition: 0.1, difficulties: ["normal", "hard", "impossible"] },//this special name is used for random event 2 to make sure that only one of the Goombas ends the random event
      { name: 'dragon', id: 'dragon', class: Dragon, data: this.assets.enemies.dragon, xPercentage: 0.5, minPosition: 0.05 },
      { name: 'knight', id: 'player', class: PlayerGreece, data: this.assets.players.knight },
      { name: 'flyingIsland', id: 'flyingIsland', class: FlyingIsland, data: this.assets.platforms.island, xPercentage: 0.82, yPercentage: 0.55 },
      { name: 'tubeU', id: 'minifinishline', class: FinishLine, data: this.assets.obstacles.tubeU, xPercentage: 0.66, yPercentage: 0.71 },
      { name: 'flag', id: 'finishline', class: FinishLine, data: this.assets.obstacles.flag, xPercentage: 0.875, yPercentage: 0.21 },
      { name: 'flyingIsland', id: 'flyingIsland', class: FlyingIsland, data: this.assets.platforms.island, xPercentage: 0.82, yPercentage: 0.55 },
      { name: 'hillsEnd', id: 'background', class: BackgroundTransitions, data: this.assets.transitions.hillsEnd },
      { name: 'lava', id: 'lava', class: Lava, data: this.assets.platforms.lava, xPercentage: 0, yPercentage: 1 },
      { name: 'lava', id: 'lava', class: Lava, data: this.assets.platforms.lava, xPercentage: 0, yPercentage: 1 },
    ];
    // Greece Game Level added to the GameEnv ...
    new GameLevel({ tag: "ancient greece", callback: this.playerOffScreenCallBack, objects: greeceGameObjects });


    const miniGameObjects = [
      // GameObject(s), the order is important to z-index...
      { name: 'mini', id: 'background', class: Background, data: this.assets.backgrounds.mini },
      // { name: 'rock', id: 'platform', class: Platform, data: this.assets.platforms.rock },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lava, xPercentage: 0.59, yPercentage: 0.35 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lava, xPercentage: 0.6268, yPercentage: 0.35 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lava, xPercentage: 0.3, yPercentage: 0.35 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lava, xPercentage: 0.3368, yPercentage: 0.35 },

      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lava, xPercentage: 0.3, yPercentage: 0.85 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lava, xPercentage: 0.3368, yPercentage: 0.85 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lava, xPercentage: 0.4684, yPercentage: 0.85 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lava, xPercentage: 0.6, yPercentage: 0.85 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lava, xPercentage: 0.6368, yPercentage: 0.85 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lava, xPercentage: 0.3736, yPercentage: 0.35 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lava, xPercentage: 0.3736, yPercentage: 0.4334 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lava, xPercentage: 0.3736, yPercentage: 0.5167 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lava, xPercentage: 0.3736, yPercentage: 0.6 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lava, xPercentage: 0.4104, yPercentage: 0.6 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lava, xPercentage: 0.4472, yPercentage: 0.6 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lava, xPercentage: 0.484, yPercentage: 0.6 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lava, xPercentage: 0.5208, yPercentage: 0.6 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lava, xPercentage: 0.5576, yPercentage: 0.6 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lava, xPercentage: 0.5576, yPercentage: 0.5167 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lava, xPercentage: 0.5576, yPercentage: 0.4334 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lava, xPercentage: 0.5576, yPercentage: 0.35 },

      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lava, xPercentage: 0.8576, yPercentage: 0.6 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lava, xPercentage: 0.8576, yPercentage: 0.5167 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lava, xPercentage: 0.8576, yPercentage: 0.4334 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lava, xPercentage: 0.8576, yPercentage: 0.35 },

      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lava, xPercentage: 0.8576, yPercentage: 0.6 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lava, xPercentage: 0.8208, yPercentage: 0.6 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lava, xPercentage: 0.784, yPercentage: 0.6 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lava, xPercentage: 0.7472, yPercentage: 0.6 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lava, xPercentage: 0.7104, yPercentage: 0.6 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lava, xPercentage: 0.6736, yPercentage: 0.6 },

      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lava, xPercentage: 0.1736, yPercentage: 0.35 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lava, xPercentage: 0.1736, yPercentage: 0.4334 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lava, xPercentage: 0.1736, yPercentage: 0.5167 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lava, xPercentage: 0.1736, yPercentage: 0.6 },

      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.28, yPercentage: 0.25 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.32, yPercentage: 0.25 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.29, yPercentage: 0.75 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.33, yPercentage: 0.75 },
      { name: 'star', id: 'star', class: Star, data: this.assets.obstacles.star, xPercentage: 0.4584, yPercentage: 0.75 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.40, yPercentage: 0.5 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.42, yPercentage: 0.5 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.44, yPercentage: 0.5 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.46, yPercentage: 0.5 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.48, yPercentage: 0.5 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.5, yPercentage: 0.5 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.59, yPercentage: 0.75 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.63, yPercentage: 0.75 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.58, yPercentage: 0.25 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.62, yPercentage: 0.25 },

      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.6475, yPercentage: 0.5 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.6675, yPercentage: 0.5 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.6875, yPercentage: 0.5 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.7075, yPercentage: 0.5 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.7275, yPercentage: 0.5 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.7475, yPercentage: 0.5 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.7675, yPercentage: 0.5 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.7875, yPercentage: 0.5 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.8075, yPercentage: 0.5 },
      { name: 'knight', id: 'player', class: PlayerMini, data: this.assets.players.knight },
      { name: 'tubeD', id: 'finishline', class: FinishLine, data: this.assets.obstacles.tubeD, xPercentage: 0, yPercentage: 0.052 },
      { name: 'tubeU', id: 'finishline', class: FinishLine, data: this.assets.obstacles.tubeU, xPercentage: 0.85, yPercentage: 0.646 },
      { name: 'greeceEnd', id: 'background', class: BackgroundTransitions,  data: this.assets.transitions.greeceEnd },
    ];
    // Space Game Level added to the GameEnv ...
    new GameLevel({ tag: "mini", callback: this.playerOffScreenCallBack, objects: miniGameObjects });


    // Under Water Game Level defintion...
    const allWaterGameObjects = [
      { name: 'water', id: 'background', class: Background, data: this.assets.backgrounds.water },
      { name: 'fish', id: 'background', class: BackgroundParallax, data: this.assets.backgrounds.fish },
      { name: 'reef', id: 'background', class: Background, data: this.assets.backgrounds.reef },
      { name: 'sand', id: 'floor', class: Platform, data: this.assets.platforms.sand },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.block, xPercentage: 0.2, yPercentage: 0.85 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.block, xPercentage: 0.2368, yPercentage: 0.85 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.block, xPercentage: 0.2736, yPercentage: 0.85 },
      { name: 'blocks', id: 'wall', class: BlockPlatform, data: this.assets.platforms.block, xPercentage: 0.6, yPercentage: 1 },
      { name: 'itemBlock', id: 'jumpPlatform', class: JumpPlatform, data: this.assets.platforms.itemBlock, xPercentage: 0.4, yPercentage: 0.65 }, //item block is a platform
      { name: 'goomba', id: 'goomba', class: Goomba, data: this.assets.enemies.goomba, xPercentage: 0.5, yPercentage: 1, minPosition: 0.05 },
      { name: 'goomba', id: 'goomba', class: Goomba, data: this.assets.enemies.goomba, xPercentage: 0.4, yPercentage: 1, minPosition: 0.05, difficulties: ["normal", "hard", "impossible"] },
      { name: 'goomba', id: 'goomba', class: Goomba, data: this.assets.enemies.goomba, xPercentage: 0.3, yPercentage: 1, minPosition: 0.05, difficulties: ["normal", "hard", "impossible"] },
      { name: 'goomba', id: 'goomba', class: Goomba, data: this.assets.enemies.goomba, xPercentage: 0.2, yPercentage: 1, minPosition: 0.05, difficulties: ["hard", "impossible"] },
      { name: 'goomba', id: 'goomba', class: Goomba, data: this.assets.enemies.goomba, xPercentage: 0.1, yPercentage: 1, minPosition: 0.05, difficulties: ["impossible"] },
      { name: 'goombaSpecial', id: 'goomba', class: Goomba, data: this.assets.enemies.goomba, xPercentage: 0.75, yPercentage: 1, minPosition: 0.5 }, //this special name is used for random event 2 to make sure that only one of the Goombas ends the random event
      { name: 'goombaSpecial', id: 'goomba', class: Goomba, data: this.assets.enemies.goomba, xPercentage: 0.95, yPercentage: 1, minPosition: 0.5, difficulties: ["hard", "impossible"] }, //this special name is used for random event 2 to make sure that only one of the Goombas ends the random event
      { name: 'flyingGoomba', id: 'flyingGoomba', class: FlyingGoomba, data: this.assets.enemies.flyingGoomba, xPercentage: 0.9, minPosition: 0.5, difficulties: ["normal", "hard", "impossible"] },
      { name: 'flyingGoomba', id: 'flyingGoomba', class: FlyingGoomba, data: this.assets.enemies.flyingGoomba, xPercentage: 0.9, minPosition: 0.5, difficulties: ["hard", "impossible"] },
      { name: 'flyingGoomba', id: 'flyingGoomba', class: FlyingGoomba, data: this.assets.enemies.flyingGoomba, xPercentage: 0.9, minPosition: 0.5, difficulties: ["impossible"] },
      { name: 'mushroom', id: 'mushroom', class: Mushroom, data: this.assets.enemies.mushroom, xPercentage: 0.49 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.1908, yPercentage: 0.75 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.2242, yPercentage: 0.75 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.2575, yPercentage: 0.75 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.coin, xPercentage: 0.5898, yPercentage: 0.900 },
      { name: 'mario', id: 'player', class: PlayerHills, data: this.assets.players.mario },
      { name: 'Chest', id: 'finishline', class: FinishLine, data: this.assets.obstacles.chest, xPercentage: 0.85, yPercentage: 0.68 },
      { name: 'miniEnd', id: 'background', class: BackgroundTransitions, data: this.assets.transitions.miniEnd },
    ];
    let waterGameObjects = allWaterGameObjects.filter(obj => !obj.difficulties || obj.difficulties.includes(difficulty));
    // Water Game Level added to the GameEnv ...
    new GameLevel({ tag: "water", callback: this.playerOffScreenCallBack, objects: waterGameObjects });

    // Quidditch Game Level definition...
    const quidditchGameObjects = [
      // GameObject(s), the order is important to z-index...
      { name: 'quidditch', id: 'background', class: Background, data: this.assets.backgrounds.quidditch },
      { name: 'turf', id: 'platform', class: Platform, data: this.assets.platforms.turf },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.1, yPercentage: 0.81 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.14, yPercentage: 0.81 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.18, yPercentage: 0.81 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.22, yPercentage: 0.81 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.22, yPercentage: 0.69 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.30, yPercentage: 0.81 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.30, yPercentage: 0.71 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.30, yPercentage: 0.61 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.30, yPercentage: 0.33 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.30, yPercentage: 0.23 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.30, yPercentage: 0.13 },
      { name: 'blocks', id: 'jumpPlatform', class: SpawnPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.34, yPercentage: 0.81 },
      { name: 'blocks', id: 'jumpPlatform', class: SpawnPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.38, yPercentage: 0.81 },
      { name: 'blocks', id: 'jumpPlatform', class: SpawnPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.42, yPercentage: 0.81 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.38, yPercentage: 0.57 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.38, yPercentage: 0.47 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.38, yPercentage: 0.37 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.38, yPercentage: 0.27 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.38, yPercentage: 0.17 },

      { name: 'blocks', id: 'jumpPlatform', class: MovingPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.626, yPercentage: 0.92 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.663, yPercentage: 0.586 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.cobblestone, xPercentage: 0.700, yPercentage: 0.586 },

      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.yellowpattern, xPercentage: 0.456, yPercentage: 1.08 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.yellowredpattern, xPercentage: 0.456, yPercentage: 0.985 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.yellowpattern, xPercentage: 0.456, yPercentage: 0.89 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lionpattern, xPercentage: 0.456, yPercentage: 0.795 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.yellowpattern, xPercentage: 0.456, yPercentage: 0.7 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.yellowredpattern, xPercentage: 0.456, yPercentage: 0.605 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.yellowpattern, xPercentage: 0.456, yPercentage: 0.51 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.lionpattern, xPercentage: 0.456, yPercentage: 0.415 },

      { name: 'draco', id: 'draco', class: Draco, data: this.assets.enemies.draco, xPercentage: 0.3, minPosition: 0.05, difficulties: ["normal", "hard", "impossible"] },
      { name: 'draco', id: 'draco', class: Draco, data: this.assets.enemies.draco, xPercentage: 0.5, minPosition: 0.3, difficulties: ["normal", "hard", "impossible"] },
      /**{ name: 'draco', id: 'draco', class: Draco, data: this.assets.enemies.draco, xPercentage: 0.75, minPosition: 0.5, difficulties: ["normal", "hard", "impossible"] }, //this special name is used for random event 2 to make sure that only one of the Goombas ends the random event */
      { name: 'dementor', id: 'dementor', class: Dementor, data: this.assets.enemies.dementor, xPercentage: 0.5, minPosition: 0.05 },
      { name: 'dementor', id: 'dementor', class: Dementor, data: this.assets.enemies.dementor, xPercentage: 0.9, minPosition: 0.5 },

      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.095, yPercentage: 0.7 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.135, yPercentage: 0.7 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.175, yPercentage: 0.7 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.375, yPercentage: 0.7 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.409, yPercentage: 0.7 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.295, yPercentage: 0.46 },

      { name: 'chocoFrog', id: 'chocoFrog', class: ChocoFrog, data: this.assets.enemies.chocoFrog, xPercentage: 0.25, yPercentage: 0.3 },

      { name: 'magicBeam', id: 'magicBeam', class: MagicBeam, data: this.assets.enemies.magicBeam, xPercentage: 0.623, yPercentage: 0.72 },

      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.656, yPercentage: 0.46 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.611, yPercentage: 0.46 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.700, yPercentage: 0.46 },

      { name: 'harry', id: 'player', class: PlayerQuidditch, data: this.assets.players.harry },
      { name: 'tube', id: 'finishline', class: FinishLine, data: this.assets.obstacles.tube, xPercentage: 0.85, yPercentage: 0.7 },
      { name: 'tubeU', id: 'minifinishline', class: FinishLine, data: this.assets.obstacles.tubeU, xPercentage: 0.69, yPercentage: 0.71 },
      { name: 'waterEnd', id: 'background', class: BackgroundTransitions,  data: this.assets.transitions.waterEnd },
    ];

    // Quidditch Game Level added to the GameEnv ...
    new GameLevel({ tag: "quidditch", callback: this.playerOffScreenCallBack, objects: quidditchGameObjects });

    const miniHogwartsObjects = [
      // GameObject(s), the order is important to z-index...
      { name: 'miniHogwarts', id: 'background', class: Background, data: this.assets.backgrounds.miniHogwarts },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.009, yPercentage: 0.47 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.058, yPercentage: 0.66 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.1, yPercentage: 0.81 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.14, yPercentage: 0.47 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.18, yPercentage: 0.47 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.22, yPercentage: 0.47 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.26, yPercentage: 0.47 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.30, yPercentage: 0.47 },
      
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.14, yPercentage: 0.81 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.18, yPercentage: 0.81 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.22, yPercentage: 0.81 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.26, yPercentage: 0.81 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.30, yPercentage: 0.81 },

      { name: 'blocks', id: 'jumpPlatform', class: MovingPlatform, data: this.assets.platforms.stone, xPercentage: 0.44, yPercentage: 0.92 },
      { name: 'magicBeam', id: 'magicBeam', class: MagicBeam, data: this.assets.enemies.magicBeam, xPercentage: 0.37, yPercentage: 0.61 },

      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.48, yPercentage: 0.64 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.48, yPercentage: 0.54 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.48, yPercentage: 0.44 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.48, yPercentage: 0.34 },
      
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.6, yPercentage: 0.66 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.56, yPercentage: 0.5 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.64, yPercentage: 0.81 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.68, yPercentage: 0.47 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.72, yPercentage: 0.47 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.stone, xPercentage: 0.76, yPercentage: 0.47 },
      
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.55, yPercentage: 0.38 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.636, yPercentage: 0.699 },

      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.672, yPercentage: 0.368 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.71, yPercentage: 0.368 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.75, yPercentage: 0.368 },

      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.056, yPercentage: 0.56 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.15, yPercentage: 0.24 },
      
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.14, yPercentage: 0.7 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.18, yPercentage: 0.7 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.22, yPercentage: 0.7 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.26, yPercentage: 0.7 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.43, yPercentage: 0.82 },
      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.47, yPercentage: 0.24 },

      { name: 'coin', id: 'coin', class: Coin, data: this.assets.obstacles.snitch, xPercentage: 0.85, yPercentage: 0.81 },
      

      { name: 'harry', id: 'player', class: PlayerMiniHogwarts, data: this.assets.players.harry },
      { name: 'tubeD', id: 'finishline', class: FinishLine, data: this.assets.obstacles.tubeD, xPercentage: 0, yPercentage: 0.052 },
      { name: 'tubeU', id: 'minifinishline', class: FinishLine, data: this.assets.obstacles.tubeU, xPercentage: 0.85, yPercentage: 0.7 },
    ];

    // miniHogwarts Game Level added to the GameEnv ...
    new GameLevel({ tag: "mini hogwarts", callback: this.playerOffScreenCallBack, objects: miniHogwartsObjects });

    const winterObjects = [
      // GameObject(s), the order is important to z-index...
      { name: 'winter', id: 'background', class: BackgroundParallax, data: this.assets.backgrounds.winter },
      { name: 'snow', id: 'background', class: BackgroundSnow, data: this.assets.backgrounds.snow },
      { name: 'snowyfloor', id: 'platform', class: Platform, data: this.assets.platforms.snowyfloor },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.2, yPercentage: 0.82 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.2368, yPercentage: 0.82 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.2736, yPercentage: 0.82 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.3104, yPercentage: 0.82 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.3472, yPercentage: 0.82 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.384, yPercentage: 0.74 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.4208, yPercentage: 0.66 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.5090, yPercentage: 0.56 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.5090, yPercentage: 0.48 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.5090, yPercentage: 0.40 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.5090, yPercentage: 0.32 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.69, yPercentage: 0.76 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.655, yPercentage: 0.68 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.62, yPercentage: 0.68 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.72, yPercentage: 0.76 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.755, yPercentage: 1 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.755, yPercentage: 0.92 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.755, yPercentage: 0.84 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.625, yPercentage: 0.92 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.625, yPercentage: 1 },
      { name: 'snowflake', id: 'coin', class: Coin, data: this.assets.obstacles.snowflake, xPercentage: 0.2100, yPercentage: 0.72 },
      { name: 'snowflake', id: 'coin', class: Coin, data: this.assets.obstacles.snowflake, xPercentage: 0.2619, yPercentage: 0.72 },
      { name: 'snowflake', id: 'coin', class: Coin, data: this.assets.obstacles.snowflake, xPercentage: 0.3136, yPercentage: 0.72 },
      { name: 'owl', id: 'owl', class: Owl, data: this.assets.enemies.Owl, xPercentage: 0.3, minPosition: 0.05 },
      { name: 'owl', id: 'owl', class: Owl, data: this.assets.enemies.Owl, xPercentage: 0.8, minPosition: 0.05 },
      { name: 'snowman', id: 'snowman', class: Snowman, data: this.assets.enemies.Snowman, xPercentage: 0.2, minPosition: 0.1, difficulties: ["normal", "hard", "impossible"] },
      { name: 'snowman', id: 'snowman', class: Snowman, data: this.assets.enemies.Snowman, xPercentage: 0.35, minPosition: 0.1, difficulties: ["normal", "hard", "impossible"] },
      { name: 'snowman', id: 'snowman', class: Snowman, data: this.assets.enemies.Snowman, xPercentage: 0.5, minPosition: 0.1, difficulties: ["normal", "hard", "impossible"] },
      { name: 'mario', id: 'player', class: PlayerWinter, data: this.assets.players.whitemario },
      { name: 'cabin', id: 'finishline', class: FinishLine, data: this.assets.obstacles.cabin, xPercentage: 0.85, yPercentage: 0.603 },
      { name: 'tubeU', id: 'minifinishline', class: FinishLine, data: this.assets.obstacles.tubeU, xPercentage: 0.69, yPercentage: 0.71 },
      { name: 'quidditchEnd', id: 'background', class: BackgroundTransitions, data: this.assets.transitions.quidditchEnd },
    ];

    // Winter MiniGame Level added to the GameEnv ...
    new GameLevel({ tag: "winter", callback: this.playerOffScreenCallBack, objects: winterObjects });
    
    const iceminiObjects = [
      // GameObject(s), the order is important to z-index...
      { name: 'icewater', id: 'background', class: BackgroundParallax, data: this.assets.backgrounds.icewater },
      { name: 'narwhal', id: 'background', class: BackgroundParallax, data: this.assets.backgrounds.narwhal },
      { name: 'narwhalfloor', id: 'platform', class: Platform, data: this.assets.platforms.narwhalfloor },
      { name: 'sandstone', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.2, yPercentage: 0.82 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.2368, yPercentage: 0.82 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.2736, yPercentage: 0.82 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.3104, yPercentage: 0.82 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.3472, yPercentage: 0.74 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.59, yPercentage: 0.35 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.6268, yPercentage: 0.35 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.3, yPercentage: 0.35 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.332, yPercentage: 0.35 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.3736, yPercentage: 0.6 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.4104, yPercentage: 0.6 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.4472, yPercentage: 0.6 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.484, yPercentage: 0.6 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.5208, yPercentage: 0.6 },
      { name: 'blocks', id: 'jumpPlatform', class: BlockPlatform, data: this.assets.platforms.snowywood, xPercentage: 0.5576, yPercentage: 0.6 },
      { name: 'Snowflake', id: 'coin', class: Coin, data: this.assets.obstacles.snowflake, xPercentage: 0.325, yPercentage: 0.25 },
      { name: 'Snowflake', id: 'coin', class: Coin, data: this.assets.obstacles.snowflake, xPercentage: 0.29, yPercentage: 0.25 },
      { name: 'Snowflake', id: 'coin', class: Coin, data: this.assets.obstacles.snowflake, xPercentage: 0.40, yPercentage: 0.5 },
      { name: 'Snowflake', id: 'coin', class: Coin, data: this.assets.obstacles.snowflake, xPercentage: 0.42, yPercentage: 0.5 },
      { name: 'Snowflake', id: 'coin', class: Coin, data: this.assets.obstacles.snowflake, xPercentage: 0.44, yPercentage: 0.5 },
      { name: 'Snowflake', id: 'coin', class: Coin, data: this.assets.obstacles.snowflake, xPercentage: 0.46, yPercentage: 0.5 },
      { name: 'Snowflake', id: 'coin', class: Coin, data: this.assets.obstacles.snowflake, xPercentage: 0.48, yPercentage: 0.5 },
      { name: 'Snowflake', id: 'coin', class: Coin, data: this.assets.obstacles.snowflake, xPercentage: 0.5, yPercentage: 0.5 },
      { name: 'Snowflake', id: 'coin', class: Coin, data: this.assets.obstacles.snowflake, xPercentage: 0.58, yPercentage: 0.25 },
      { name: 'Snowflake', id: 'coin', class: Coin, data: this.assets.obstacles.snowflake, xPercentage: 0.62, yPercentage: 0.25 },
      { name: 'jellyfish', id: 'jellyfish', class: Jellyfish, data: this.assets.enemies.Jellyfish, xPercentage: 0.2, minPosition: 0.05 },
      { name: 'jellyfish', id: 'jellyfish', class: Jellyfish, data: this.assets.enemies.Jellyfish, xPercentage: 0.8, minPosition: 0.05 },
      { name: 'penguin', id: 'penguin', class: Penguin, data: this.assets.enemies.Penguin, xPercentage: 0.2, minPosition: 0.1, difficulties: ["normal", "hard", "impossible"] },
      { name: 'penguin', id: 'penguin', class: Penguin, data: this.assets.enemies.Penguin, xPercentage: 0.35, minPosition: 0.1, difficulties: ["normal", "hard", "impossible"] },
      { name: 'penguin', id: 'penguin', class: Penguin, data: this.assets.enemies.Penguin, xPercentage: 0.5, minPosition: 0.1, difficulties: ["normal", "hard", "impossible"] },
      { name: 'mario', id: 'player', class: PlayerIce, data: this.assets.players.whitemario },
      { name: 'tubeD', id: 'finishline', class: FinishLine, data: this.assets.obstacles.tubeD, xPercentage: 0, yPercentage: 0.052 },
      { name: 'iceberg', id: 'finishline', class: FinishLine, data: this.assets.obstacles.iceberg, xPercentage: 0.85, yPercentage: 0.603 },
      { name: 'winterEnd', id: 'background', class: BackgroundTransitions, data: this.assets.transitions.winterEnd },
    ];
    // IceMiniGame Game Level added to the GameEnv ...
    new GameLevel({ tag: "icemini", callback: this.playerOffScreenCallBack, objects: iceminiObjects });

    const bossGameObjects = [
      { name: 'bossbackground', id: 'background', class: BackgroundParallax, data: this.assets.backgrounds.boss },
      { name: 'devil', id: 'devil', class:BackgroundParallax, data: this.assets.backgrounds.devil},
      { name: 'boss', id: 'boss', class: Boss, data: this.assets.enemies.boss, xPercentage: 0.5, minPosition: 0.3 },
      { name: 'boss1', id: 'boss', class: Boss, data: this.assets.enemies.boss, xPercentage: 0.3, minPosition: 0.07 },
      { name: 'mario', id: 'player', class: PlayerBoss, data: this.assets.players.mario },
      { name: 'zombie', id: 'player', class: PlayerZombie, data: this.assets.players.zombie },
      { name: 'tube', id: 'finishline', class: FinishLine, data: this.assets.obstacles.tube, xPercentage: 0.85, yPercentage: 0.65 },
      { name: 'itemBlock', id: 'jumpPlatform', class: BossItem, data: this.assets.platforms.itemBlock, xPercentage: 0.2, yPercentage: 0.65 }, //item block is a platform
      { name: 'mario', id: 'player', class: PlayerBoss, data: this.assets.players.mario },
      { name: 'zombie', id: 'player', class: PlayerZombie, data: this.assets.players.zombie },
      { name: 'grass', id: 'platform', class: Platform, data: this.assets.platforms.grass },
      { name: 'iceminiEnd', id: 'background', class: BackgroundTransitions, data: this.assets.transitions.iceminiEnd },
    ];

    new GameLevel({ tag: "boss", callback: this.playerOffScreenCallBack, objects: bossGameObjects });

    // Game Over Level definition...
    const endGameObjects = [
      { name: 'background', class: Background, id: 'background', data: this.assets.transitions.miniEnd }
    ];
    // Game Over screen added to the GameEnv ...
    new GameLevel({ tag: "end", callback: this.gameOverCallBack, objects: endGameObjects });
  }
}
// Bind the methods to the GameSetup object, ensures "this" inside of methods binds to "GameSetup"
// * * this avoids "Temporal Dead Zone (TDZ)" error... 
// * * * * "Cannot access 'GameSetup' before initialization", light reading TDZ (ha ha)...
// * * * * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#Temporal_Dead_Zone
GameSetup.startGameCallback = GameSetup.startGameCallback.bind(GameSetup);
GameSetup.gameOverCallBack = GameSetup.gameOverCallBack.bind(GameSetup);

export default GameSetup;