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
  constructor(scene, grid, x, y, direction, locomotiveText, player, capacity) {
    super(scene, x, y, 'locomotive');
	console.log(capacity);
	this.scene = scene
    this.grid = grid;
    this.pathProgress = 0;
    this.graphics = scene.add.graphics();
    this.path = null;
    this.previousX = x;
    this.previousY = y;
    this.direction = direction;
    this._setAngle();
    this.depth = 2;
	this.stoppedTime = 0;

	// @SolbiatiAlessandro
	this.fuel_capacity = 100 * capacity;
	this.fuel = 50;
	this.hasText = false;
	if (typeof locomotiveText != 'undefined') {
		this.hasText = true;
		this.locomotiveText = locomotiveText;
	}
	this.lost = false;
	this.owner = player;
	this.playerMemory = {};
	this.owner.ownedTrains += 1 // TODO: bug, this get called on ghost train
	this.name = 'locomotive' + this.owner.ownedTrains
	//this.owner.log("new locomotive ("+this.name+", capacity "+this.capacity+") created")

    this._addPathOfCurrentRail();
  }

  preUpdate(time, delta) {

	try{
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
		  this.owner.log(">["+this.name+"] run out of fuel")
		  this.owner.log("YOU LOST THE GAME!")
		  //this.owner.saveLeaderboardScore():
		  throw "YOU LOST THE GAME!"
		  //location.reload();
	  }


	  if (this.pathProgress < 1 && this.fuel > 0) {

		this.fuel -= pathProgressDelta;
		if(this.hasText){
			if (this.fuel > 0){
				this.locomotiveText.setText( Math.floor(this.fuel) + "/"+ this.fuel_capacity);
			} else {
				this.locomotiveText.setText("OUT OF FUEL: YOU LOST THE GAME!");
			}
			if (this.fuel < 10){
				this.locomotiveText.setStyle({ fontSize: '30px', backgroundColor: 'red' })

			} else {
				this.locomotiveText.setStyle({ fontSize: '14px'})

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

		// does the rail  has a mine
		let railSegment = this.grid.get({x: Math.floor(vector.x) , y: Math.floor(vector.y) })
		if(typeof railSegment != 'undefined' && railSegment.building){
			//TODO: ugly bug here, based on the speed is going to stop
			// or not stop at a station. I.E. slow is going to stop 5 times,
			// fast is not going to stop. Looks like with 0.05 speed
			// on alex computer is going to stop always once at all stations
		  //
		  railSegment.building.trainPassing(this)
		}
		this._calculateDirection();
		this._setAngle();
	  } else {
		this._addPathOfCurrentRail();
	  }
	} catch(err) {
	  console.log(err);
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

  giveCoalToStation(station, coal){
	  if (coal < 0) {
		  coal = 0
	  }
	  coal = Math.min(coal, this.fuel);
	  station.inventory.coal += coal;
	  var prevFuel = this.fuel
	  this.fuel -= coal;
	  this.owner.earn_coal(coal);
	  this.owner.earn_money(coal * station.coalTradePrice);
	  this.owner.log(">["+this.name+"] enters "+station.name+" with "+prevFuel.toFixed(2)+" fuel. Gives  "+coal.toFixed(2)+" coal. Leaves the station with "+this.fuel.toFixed(2)+" fuel")
  }

  getCoalFromStation(station, coal){
	  if (coal < 0) {
		  coal = 0
	  }
	  var prevFuel = this.fuel
	  coal = Math.min(coal, station.inventory.coal, this.fuel_capacity - this.fuel);
	  station.inventory.coal -= coal;
	  this.fuel = Math.min(this.fuel + coal, this.fuel_capacity);
	  this.owner.earn_money(-1 * coal * station.coalTradePrice);
	  this.owner.log(">["+this.name+"] enters "+station.name+" with "+prevFuel.toFixed(2)+" fuel. Gets "+coal.toFixed(2)+" coal. Leaves the station with "+this.fuel.toFixed(2)+" fuel")
  }

  waitAtStation(milliseconds){
	  this.stoppedTime = milliseconds;
  }

  getAvailableFuel(){
	  return this.fuel;
  }

  getFuelCapacity(){
	  return this.fuel_capacity;
  }

  _replacesWorkingCode(station){
	;debugger
	if (station.isMine()) {
		// buy all the coal the train can carry
		;debugger
		let coal = station.getAvailableCoal();
		this.getCoalFromStation(station, coal);

		// after trading wait one second before leaving
		this.waitAtStation(1000);
	 }
	 if (station.isFactory()) {
		 ;debugger
		// sell half the coal the train is carrying
		let coal = this.getAvailableFuel() / 2;
		this.giveCoalToStation(station, coal);

		// after trading wait half second before leaving
		this.waitAtStation(500);
		this.print("test")
	 }
  }

  stopAt(station){
	  this.stoppedTime = 1000;
	  // THIS IS THE GAME EDITABLE CODE
      ;debugger
	   this._replacesWorkingCode(station)
	  // FINISH GAME EDITABLE CODE

  }

  setMemory(key, value){
	  this.playerMemory[key] = value;
  }

  getMemory(key){
	  return this.playerMemory[key];
  }

  print(text){
	  this.owner.log("["+this.name+"] "+text)
  }

}

export {Locomotive};
