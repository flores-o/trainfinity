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

class TrainBuilder {
  constructor(grid, physicsGroup, scene, level) {
    this.grid = grid
	this.physicsGroup  = physicsGroup
	this.scene = scene
	this.level = level
	this.gameObjects = []
	this.trainCreated = false;
	this.trainBuilderText = new Phaser.GameObjects.Text(
		this.scene,
		0,0,
		"lvl "+this.level);
	this.trainBuilderText.depth = 1004
	this.trainBuilderText.visible = false
	this.scene.add.existing(this.trainBuilderText);
	this.hasCreatedTrain = false;

  }



  newTrain(level){
	  this.scene._locomotiveBuilder.visible = true
	  this.trainBuilderText.setPosition(this.scene._locomotiveBuilder.x + 20,
	  this.scene._locomotiveBuilder.y)
	  this.trainBuilderText.visible = true
	  this.trainBuilderText.setText("lvl "+level)
	  this.trainCreated = false;
	  this.level = level
  }

  pointerDown(position){
	  for(const [key, value] of Object.entries(this.scene.grid._buildings)){
		  if(value.name == "RailSegment" && !this.trainCreated){
			var trainCapacity = this.level + 1
			let locomotivePosition = {x: value.x, y: value.y}
			let wagonPositions = Array(this.level + 1).fill(locomotivePosition)
			let locomotiveText = new Phaser.GameObjects.Text(this.scene, locomotivePosition.x, locomotivePosition.y, "Locomotive Created");
			  locomotiveText.depth=1001;
			let direction = Array.from(value.directions)[0]
			let leader = new Locomotive(this.scene, this.grid, locomotivePosition.x, locomotivePosition.y, direction, locomotiveText, this.scene.player, trainCapacity);
			this.scene.locomotiveGroup.add(leader, true)
			this.scene.locomotiveGroup.add(locomotiveText, true)
			for (let position of wagonPositions) {
			  let wagon = new Wagon(this.scene, position.x, position.y, leader);
			  this.scene.locomotiveGroup.add(wagon, true)
			  leader = wagon
			}

			this.trainCreated = true;
		    this.scene._locomotiveBuilder.visible = false;
		    this.trainBuilderText.visible = false;
		  }
	  }
  }

  pointerUp(){}

  pointerMove(position){
	  return []
  }

  tokill_createGameObjects() {
  }

}

export {TrainBuilder};
