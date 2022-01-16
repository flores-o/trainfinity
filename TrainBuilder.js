/**
 * Controller for placing trains
 *
 * Can only place trains on rail.
 * Does not write to the grid.
 *
 * Created by Filip on 2018-08-10.
 */

import {ActionController} from "./ActionController.js"
import {Locomotive} from "./Locomotive.js"
import {Wagon} from "./Wagon.js"

class TrainBuilder extends ActionController {
  constructor(grid, physicsGroup, scene) {
    super(grid, physicsGroup, scene);
  }

  _positionsToMarkInvalid() {
    return this.positions.filter((x) => !this.grid.hasRail(x));
  }

  pointerUp(){
	  if(this._scene.availableTrains.length == 0){
		  return false
	  } else {
		  this._scene.availableTrains.pop();
		  return super.pointerUp();
	  }
  }

  _createGameObjects() {
	var trainCapacity;
	if(this._scene.availableTrains.length == 0){
		  trainCapacity = 0;
	  } else {
		  trainCapacity = this._scene.availableTrains[this._scene.availableTrains.length - 1];
	  }
    let locomotivePosition = this.positions[0];
    let wagonPositions = this.positions.slice(1);
	let locomotiveText = new Phaser.GameObjects.Text(this._scene, locomotivePosition.x, locomotivePosition.y, "Locomotive Created");
    let leader = new Locomotive(this._scene, this.grid, locomotivePosition.x, locomotivePosition.y, this._direction(), locomotiveText, this._scene.player, trainCapacity);
    this.gameObjects = [leader, locomotiveText];
    for (let position of wagonPositions) {
      let wagon = new Wagon(this._scene, position.x, position.y, leader);
      this.gameObjects.push(wagon);
      leader = wagon
	}
  }

  _writeToGrid(position, building) {
  }

  _direction() {
    let firstPosition = this.positions[0];
    let lastPosition = this.positions[this.positions.length - 1];
    if (firstPosition.x == lastPosition.x) {
      return firstPosition.y < lastPosition.y ? 'N' : 'S';
    } else {
      return firstPosition.x < lastPosition.x ? 'W' : 'E';
    }
  }
}

export {TrainBuilder};
