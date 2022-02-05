/**
 * Created by Filip on 2018-05-08.
 */
import {RailSegmentFactory} from "./RailSegment.js";
import {Image} from "./Image.js";
import {ActionController} from "./ActionController.js"
import {Building} from "./world/Building.js"

class RailBuilder extends ActionController{
  constructor(grid, physicsGroup, scene) {
    super(grid, physicsGroup, scene);
    this.invalidPositions = [];
	this.road = null
  this.hasSelectedRailwayBefore = false;
  this.hasCreatedRailway = false;
  this.game = scene;
  }

  onObjectCreatedCallback(rail){
    // get called all the time  rail is created succesfully
    // YOUR CODE HERE
    if ((this.hasCreatedRailway==false) && (this.hasSelectedRailwayBefore==true))
     {
        this.game.player.tutorial.completeStep();
        this.game.player.tutorial.nextStep();
        this.hasCreatedRailway = true;
      }


    return true;
  }

  pointerDown(position){

    super.pointerDown(position);
    console.log("click");
  }

  _positionsToMarkInvalid() {
    // This depends on this.invalidPositions have been previously created.
    return this.invalidPositions;
  }

  _createGameObjects() {
    this.invalidPositions = [];
    var rails = (new RailSegmentFactory(this._scene)).fromPositionList(this.positions);
	this.gameObjects = rails;
    for (let i = 0; i < this.gameObjects.length; i++) {
	  let position = this.positions[i];
	  let existingBuilding = this.grid.get(position);
	  // TODO: Why is there no error raised when trying to build on another type of building?
	  if (this.gameObjects[i].canBuildOn(existingBuilding)) {
		if (!(existingBuilding instanceof Building)){ // if a factory/mine don't combine it
		  this.gameObjects[i] = this.gameObjects[i].combine(existingBuilding);
		}
	  } else {
		this.invalidPositions.push(position);
	  }
    }


  }

}

export {RailBuilder};
