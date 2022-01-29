/**
 * Created by Filip on 2018-12-02.
 */

import * as constants from "./constants.js"
import {Water} from "./Water.js"
import {Player} from "../Player.js"
import {Building} from "./Building.js"

class Creator {

  constructor(game) {
    console.log(game);
    this._game = game;
	this._game.stations = [];
    // TODO: move this to constants
    this._tileSize = constants.TILESIZE
  }

  create() {

	this._createPlayer();

    this._createGrass();
    this._createFactories(constants.FACTORIES);
    this._createMines(constants.MINES);
    this._createWater()

	this._game.player.log(">[TUTORIAL][1/4] click on the railway (bottom left), drag and drop it anywhere on the map")
	  this._game.player.log(">[TUTORIAL][2/4] make your railway pass next to a coal mine")
	  this._game.player.log(">[TUTORIAL][3/4] double click on the train ")
	  this._game.player.log(">[TUTORIAL][4/4] bring 100 coal to the factories to become a Railway Engineer 1")
	  this._game.player.log(">[TUTORIAL][5/4] bonus: re-program the train in the code tab")
  }

  _createPlayer(){
	  /*
        var onboardingInstructions = new Phaser.GameObjects.Text(this._game, constants.TILESIZE * 4, constants.TILESIZE * 24, "Click on the railway asset on the left and drag on drop to create", {fontSize: '20px', backgroundColor: 'black'});
        this._game.add.existing(onboardingInstructions);
*/
	var moneyText = new Phaser.GameObjects.Text(this._game, constants.TILESIZE, constants.TILESIZE * 3, "$0", {fontSize: '30px'});
	var moneyPMText = new Phaser.GameObjects.Text(this._game, 0, 0, "0 coal/minute", {fontSize: '17px'});
	var goalText = new Phaser.GameObjects.Text(this._game, moneyPMText.width, 0, "⭐ Bring 100 units of coal to the factories ⭐", {fontSize: '17px', backgroundColor: 'black'});
	goalText.depth = 1001
	moneyPMText.depth = 1001
	this._game.add.existing(moneyText);
	this._game.add.existing(moneyPMText);
	this._game.add.existing(goalText);
	this._game.player = new Player(moneyText, moneyPMText, goalText, this._game);
  }

  _createGrass() {
    for (let x = constants.GRID_MIN_X; x < constants.GRID_MAX_X; x += this._tileSize) {
      for (let y = constants.GRID_MIN_Y; y < constants.GRID_MAX_Y; y += this._tileSize) {
        this._game.add.image(x, y, 'grass');
      }
    }
  }

  _createFactories(number, level) {
    this._game.stations.push(this._createBuildings( 'factory', number, {coal: 0}, level));
  }

  _createMines(number, level) {
    this._game.stations.push(this._createBuildings( 'mine', number, {coal: 0}, level));
  }

  _createBuildings(name, count, initial_inventory, level) {
    let roundToNearestTile = x => this._tileSize * Math.round(x / this._tileSize);
	var buildings = [];
    for (let i = 0; i < count; i++) {
	  let isBusySpace = true;
	  var x;
	  var y;
	  var gameVictoryCounter = 0;
	  var maxCounter = 1000000;
	  while (isBusySpace && gameVictoryCounter < maxCounter) {
		  x = roundToNearestTile(Phaser.Math.RND.between(constants.GRID_MIN_X + 100, constants.GRID_MAX_X - 100));
		  y = roundToNearestTile(Phaser.Math.RND.between(constants.GRID_MIN_Y + 100, constants.GRID_MAX_Y - 100));
		  let currentBlock = this._game.grid.get({x: x, y: y});
		  if (typeof currentBlock != 'undefined'){
			  isBusySpace = true;
		  } else {
			  isBusySpace = false;
		  }
		  gameVictoryCounter += 1;
		  if (gameVictoryCounter == maxCounter){
			  alert("wait.. I think.. you just won the game?????!!!!! YOU FILLED THE ENTIRE MAP!! YOU ARE THE BEST RAILWAY ENGINEER!!!!! YOU JUST WON THE INTERNET");
			  gameVictoryCounter += 1;
		  }
	  }
	  
	  buildings.push(this._createBuilding(name, x, y, initial_inventory, level));
    }
	return buildings;
  }

  _createWater() {
    let baseWaterProbability = 0.03;
    let increasedProbabilityPerNeighbor = 0.45;
    let roundToNearestTile = x => this._tileSize * Math.round(x / this._tileSize);
    for (let x = roundToNearestTile(constants.GRID_MIN_X); x < constants.GRID_MAX_X; x += this._tileSize) {
      for (let y = roundToNearestTile(constants.GRID_MIN_Y); y < constants.GRID_MAX_Y; y += this._tileSize) {
        let probability = baseWaterProbability +
          increasedProbabilityPerNeighbor * this._game.grid.countAdjacentWater({x: x, y: y});
        if (Phaser.Math.RND.frac() < probability && !this._game.grid.isBuildingAdjacent({x: x, y: y}) && !this._game.grid.isOnBuilding({x: x, y: y}) ) {
          let building = new Water(this._game, x, y);
          this._game.add.existing(building);
          this._game.grid.set({x, y}, building)
        }
      }
    }
  }

  _createBuilding(name, x, y, inventory, level) {
	let buildingText = new Phaser.GameObjects.Text(this._game, x + constants.TILESIZE / 2, y - constants.TILESIZE / 2, name, { fontSize: '14px'});
	buildingText.setDepth(10);
    let building = new Building(this._game, x, y, name, inventory, buildingText, level) ;
    this._game.add.existing(building);
    this._game.add.existing(buildingText);
    this._game.grid.set({x, y}, building)
	return building;
  }

}

export {Creator};
