/**
 * Created by Filip on 2018-05-08.
 */
import {RailSegmentFactory} from "./RailSegment.js";
import {Image} from "./Image.js";
import {ActionController} from "./ActionController.js"

class RailBuilder extends ActionController{
  constructor(grid, physicsGroup, scene) {
    super(grid, physicsGroup, scene);
    this.invalidPositions = [];
	this.road = null
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
		this.gameObjects[i] = this.gameObjects[i].combine(existingBuilding);
	  } else {
		this.invalidPositions.push(position);
	  }
    }
	
	
  }

}

export {RailBuilder};
