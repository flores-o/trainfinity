/**
 * Created by Filip on 2018-11-05.
 */

import {TILESIZE} from "./world/constants.js"

/** Class representing a locomotive */
class Locomotive extends Phaser.GameObjects.Sprite {
  /**
   * Create a locomotive.
   * @param scene
   * @param grid
   * @param x
   * @param y
   * @param The direction the locomotive is heading, e.g. "N"
   */
  constructor(scene, grid, x, y, direction, locomotiveText, player) {
    super(scene, x, y, 'locomotive');
    this.grid = grid;
    this.pathProgress = 0;
    this.graphics = scene.add.graphics();
    this.path = null;
    this.previousX = x;
    this.previousY = y;
    this.direction = direction;
    this._setAngle();
    this.depth = 1;
	this.stoppedTime = 0;

	// @SolbiatiAlessandro
	this.fuel = 10;
	this.fuel_capacity = 100;
	this.hasText = false;
	if (typeof locomotiveText != 'undefined') {
		this.hasText = true;
		this.locomotiveText = locomotiveText;
	}
	this.lost = false;
	this.owner = player;

    this._addPathOfCurrentRail();
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    //   console.log('Train entering ' + approachDirection + ' side of building at (' +
    //     this.currentBuilding.x + ',' + this.currentBuilding.y + '). Turn ' + turn);

    // Calculate pathProgress
    var speedPerMs = 0.05;
	if (this.stoppedTime > 0){
		speedPerMs = 0;
		this.stoppedTime -= delta;
		return;
	}
    let length = this.path.getLength();
    let pixelsSinceLast = speedPerMs * delta;
    let pathProgressDelta = pixelsSinceLast / length;
    this.pathProgress += pathProgressDelta;

	if (this.fuel <= 0 && this.lost == false){
		this.lost == true;
		location.reload();
	}


    if (this.pathProgress < 1 && this.fuel > 0) {

	  this.fuel -= pathProgressDelta;
	  if(this.hasText){
		  if (this.fuel > 0){
			  this.locomotiveText.setText("Fuel: " + Math.floor(this.fuel));
		  } else {
			  this.locomotiveText.setText("OUT OF FUEL!");
		  }

	  }


      let vector = this.path.getPoint(this.pathProgress);
      this.previousX = this.x;
      this.previousY = this.y;
      this.setPosition(vector.x, vector.y);
	  //console.log(vector.x, vector.y);
	  if (this.hasText){
		  this.locomotiveText.setPosition(vector.x, vector.y);
	  }
	  if (this.grid.isBuildingAdjacent(vector)) {
		  //TODO: ugly bug here, based on the speed is going to stop
		  // or not stop at a station. I.E. slow is going to stop 5 times, 
		  // fast is not going to stop. Looks like with 0.05 speed
		  // on alex computer is going to stop always once at all stations
		  let adjacentBuildings = this.grid.adjacentBuildings(
			  {x: Math.floor(vector.x), y: Math.floor(vector.y)});
			  //vector );
		  adjacentBuildings.forEach(building => building.trainPassing(this))
	  }
      this._calculateDirection();
      this._setAngle();
    } else {
      this._addPathOfCurrentRail();
    }
  }

  _setAngle() {
    this.angle = {'N': 0, 'E': 90, 'S': 180, 'W': 270}[this.direction];
  }

  _addPathOfCurrentRail() {
    let position = this.grid.getPositionClosestTo(this.x, this.y);
    if (!this.grid.hasRail(position)) {
      return
    }
    let railSegment = this.grid.get(position);
    //console.log(this._direction());
    let newDirection = railSegment.newDirection(this.direction);

    //correct the current position since we might have overshot a bit
    this.x = position.x;
    this.y = position.y;

    this._addPath(newDirection);

  }

  _addPath(direction) {
    let deltas = {
      N: {dx: 0, dy: -TILESIZE},
      S: {dx: 0, dy: TILESIZE},
      W: {dx: -TILESIZE, dy: 0},
      E: {dx: TILESIZE, dy: 0}
    };
    let delta = deltas[direction];
    if (!delta) {
      throw '_addPath called with non-direction argument "' + direction + '"'
    }
    let path = new Phaser.Curves.Path(this.x, this.y);
    path.lineTo(this.x + delta.dx, this.y + delta.dy);
    //console.log('new path: dx=' + dx +', dy=' + dy);
    this.setPath(path)
  }

  _calculateDirection() {
    if (Math.abs(this.x - this.previousX) < Math.abs(this.y - this.previousY)) {
      this.direction = this.y > this.previousY ? 'S' : 'N';
    } else {
      this.direction = this.x > this.previousX ? 'E' : 'W';
    }
  }

  setPath(path) {
    this.path = path;
    this.pathProgress = 0;
    this.showPath();
  }

  showPath() {
    this.graphics.clear();
    this.graphics.lineStyle(2, 0xffffff, 1);
    //this.path.draw(this.graphics);
  }

  tradeWithStation(station, coal){
	  if (coal < 0) {
		  ;debugger
		  throw new Error('You are trading negative coal (' + coal + ' coal units) with station '+station.name) ;
	  }
	  if(station.name.includes('mine')){
		  coal = Math.min(coal, station.inventory.coal, this.fuel_capacity - this.fuel);
		  station.inventory.coal -= coal;
		  this.fuel = Math.min(this.fuel + coal, this.fuel_capacity);
		  this.owner.earn_money(-1 * coal * station.coalTradePrice);
	  }
	  if(station.name.includes('factory')){
		  coal = Math.min(coal, this.fuel);
		  station.inventory.coal += coal;
		  this.fuel -= coal;
		  this.owner.earn_coal(coal);
		  this.owner.earn_money(coal * station.coalTradePrice);
	  }
  }

  waitAtStation(milliseconds){
	  this.stoppedTime = milliseconds;
  }

  stopAt(station){
	  this.stoppedTime = 1000;
	  // THIS IS THE GAME EDITABLE CODE

	  try{
		  var newSavedCode = document.getElementById("saved-code").innerHTML;
		  eval(
			  newSavedCode
		  );
		document.getElementById("working-code").innerHTML = newSavedCode;
	  } catch(err) {
		  ;debugger
		  alert("WARNING! the new code you write is breaking. Running previously working code. Error is: \n\n" + err.message + "\n\n"+err.stack);
		  eval(
			document.getElementById("working-code").innerHTML
		  );
	  }
	  // FINISH GAME EDITABLE CODE

  }

}

export {Locomotive};
