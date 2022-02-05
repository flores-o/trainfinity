import * as constants from "./world/constants.js"

import  {TrainBuilder}  from "./TrainBuilder.js";

/**
 * @solbiatialessandro
 */
class Tutorial{
	constructor(game, player){
		this.game = game;
		this.player = player;
		this.step1 = false;
		this.arrowStep = 0;
		this.modal_onboarding_instructions_select_railway = null;
		this.modal_onboarding_instructions_build_railway = null;
		this.onboarding_images = ['instructions_railway', 'instructions_bomb', 'instructions_train', 'instructions_first_goal']
		this.arrow = null;
		this.arrow_coordinates = [
			[Math.floor(constants.WIDTH / 2) - (3.5 * constants.TILESIZE), constants.HEIGHT - (1.5 * constants.TILESIZE)],
			[Math.floor(constants.WIDTH / 2) - (1.5 * constants.TILESIZE), constants.HEIGHT - (1.5 * constants.TILESIZE)],
			[Math.floor(constants.WIDTH / 2) - (-1.5 * constants.TILESIZE), constants.HEIGHT - (1.5 * constants.TILESIZE)],
			[null, null]
		]


		//this._showOnboarding();
		this._showOnboardingInstructionsSelectRailway()
		//this._showOnboardingInstructionsCreateRailway()

	}

	_showOnboardingInstructionsSelectRailway()
	{
		console.log('this are instructions on how to create railway')
		if (this.game.railBuilder.hasSelectedRailway)
		{
			return;
		}
		let arrow_x = Math.floor(constants.WIDTH / 2)  - (3.5 * constants.TILESIZE);
		let arrow_y = constants.HEIGHT - (3.5 * constants.TILESIZE);
		// this._showOnboardingHelper(this.game, this.onboarding_images, 0, true, arrow_x, arrow_y)

		let game = this.game
		let onboarding_images = this.onboarding_images
		let onboarding_step = 0
		let use_arrow = true
		//let arrow_x = arrow_x
		//let arrow_y = arrow_y

		let onboarding_steps =  onboarding_images.length
		if (onboarding_step >= onboarding_steps){
			return;
		}
		var button = game.add.image(550, 150, onboarding_images[onboarding_step])

		var model = game.plugins.get('rexmodalplugin').add(button, {
			cover: false,
			manualClose: true,
			duration: {
				in: 1000,
				out: 200
			},
		})
		button.depth = 1000;
		// Manual close Modal

		button
			.setInteractive()
			.on('pointerup', function () {
				//model.requestClose()
				//this._showOnboardingHelper(game, onboarding_images, onboarding_step+1, true, arrow_x + 2 * constants.TILESIZE, arrow_y)
			})
		this.modal_onboarding_instructions_select_railway = model;
		// modal code ends
		if (this.arrow_coordinates[onboarding_step][0]==null && this.arrow_coordinates[onboarding_step][1] == null){
			return
		}

		let arrow_railway_onboarding = game.add.image(arrow_x, arrow_y, 'arrow_down');
		this.arrow = arrow_railway_onboarding;
		this.step1 = true;
		arrow_railway_onboarding.depth = 1100;

		button
		.setInteractive()
		.on('pointerup', function () {
			arrow_railway_onboarding.destroy()
			this.step1 = false;
			})



	}

	_showOnboardingInstructionsCreateRailway()
	{
		console.log('this are instructions on how to create railway')
		if (this.game.railBuilder.hasCreatedRailway)
		{
			return;
		}
		if (!this.game.railBuilder.hasSelectedRailwayBefore)
		{
			return;
		}

		// this._showOnboardingHelper(this.game, this.onboarding_images, 1, true, arrow_x, arrow_y)

		let game = this.game
		let onboarding_images = this.onboarding_images
		let onboarding_step = 1
		let use_arrow = true
		//let arrow_x = arrow_x
		//let arrow_y = arrow_y

		let onboarding_steps =  onboarding_images.length
		if (onboarding_step >= onboarding_steps){
		return
		}
		var button = game.add.image(550, 150, onboarding_images[onboarding_step])

		var model = game.plugins.get('rexmodalplugin').add(button, {
			cover: false,
			manualClose: true,
			duration: {
				in: 1000,
				out: 200
			},
		})
		button.depth = 1000;
		// Manual close Modal

		button
			.setInteractive()
			.on('pointerup', function () {
				//model.requestClose()
				//this._showOnboardingHelper(game, onboarding_images, onboarding_step+1, true, arrow_x + 2 * constants.TILESIZE, arrow_y)
			})
		this.modal_onboarding_instructions_build_railway = model;
		// modal code ends
		if (this.arrow_coordinates[onboarding_step][0]==null && this.arrow_coordinates[onboarding_step][1] == null){
			return
		}

		let arrow_x = Math.floor(constants.WIDTH / 2)  - (3.5 * constants.TILESIZE);
		let arrow_y = constants.HEIGHT - (3.5 * constants.TILESIZE);
		let arrow_railway_onboarding = game.add.image(arrow_x, arrow_y, 'arrow_down');
		this.arrow = arrow_railway_onboarding;
		this.step1 = true;
		arrow_railway_onboarding.depth = 1100;

		button
		.setInteractive()
		.on('pointerup', function () {
			arrow_railway_onboarding.destroy()
			this.step1 = false;
			})


	}

    // TODO moves only on first step
	update(){


		// move arrow
		if(this.step1){
			let range = 40;
			if (this.arrowStep < range){
			    this.arrow.y -= 0.5;
			}
			else{
				this.arrow.y += 0.5;
			}
			this.arrowStep += 1;
			if (this.arrowStep == range * 2){
				this.arrowStep = 0;
			}
		}

	}
}


/**
 * @solbiatialessandro
 */
class Player {
  constructor(moneyText, moneyPMText, goalText, _game) {
	  this.money = 300;
	  this.coal = 0;
	  this.coal_earned = [];
	  this.ownedTrains = 0;
	this.ownedBuildings  = [];
	  this.moneyText = moneyText;
	  this.moneyPMText = moneyPMText;
	  this.moneyText.setText("$" + this.money.toFixed(1));
	  this.moneyText.visible = false;
	  this.moneyPMText.visible = true;
	  this.moneyPMText.setPadding(16);
	  this.moneyPMText.setBackgroundColor("#1D4336")
	  this.goalText = goalText;
	  this.goalText.setPadding(16);
	  this.goalText.setBackgroundColor("#0E5D93");
	  this._game = _game;
	this.treeFallingCount = 0;
	  this.trainBuilder = new TrainBuilder(
			this._game.grid,
			this._game.locomotiveGroup,
			this._game,
			0),
        this.tutorial = new Tutorial(_game, this);
		//this.tutorial.showOnboarding()
      this.actions = [{
        'image': 'rail',
        'controller': this._game.railBuilder,
		'quantity': -1,
		'level': 0,
      },

		  {
        'image': 'bomb',
        'controller': this._game.deleter,
		'quantity': -1,
		'level': 0,
      },
		  {
        'image': 'locomotive',
		'controller': this.trainBuilder,
		'quantity': 1,
		'level': 0,
      }

	  ];



	  this.level = 0;
	  this.cpm_target = 0;

	  this.create()
  }

  // initial routine to create all player related interfaces
  create(){
    this.createActionSelection();
	this.name = prompt("How should we call you? (for the leaderboard)");
  }

  createActionSelection() {


    let x = Math.floor(constants.WIDTH / 2)  - (3 * constants.TILESIZE);
    let y = constants.HEIGHT - (2 * constants.TILESIZE);
    let background = this._game.add.image(x + 2 * constants.TILESIZE, y, 'black');
	background.depth = 1099;
    for (let action of this.actions) {
      let image = this._game.add.image(x, y, action.image);
      let frame = this._game.add.image(x, y, 'frame_png');
      frame.depth = 1100;
	  if (action['image'] == 'locomotive'){
	  	this._game._locomotiveBuilder = image;
		  this.trainBuilder.newTrain(0)
	  }
      image.setScrollFactor(0);
      image.setInteractive();
      image.depth = 1110; // Always show in front
      image.on('pointerdown', () => {
        this._game.selectedActionController = action.controller;
		// for tutorial purposes
		if(action['image']=='rail' && this._game.railBuilder.hasSelectedRailwayBefore == false)
		{
			this._game.railBuilder.hasSelectedRailwayBefore = true;
			// close the first tutorial image
			this.tutorial.modal_onboarding_instructions_select_railway.requestClose();
			this.tutorial.arrow.visible = false;
			this.tutorial._showOnboardingInstructionsCreateRailway();
		}
      });
      x += 2 * constants.TILESIZE;
    }
  }


  levelUp(){
	  this.level += 1;
	  this.cpm_target += 100;
	  this.goalText.setText("⭐ Bring "+this.cpm_target+" units of coal/minute to the factories ⭐");
	  this.saveLeaderboardScore()
  }

  saveLeaderboardScore(){
	  this._game.leaderboard.addScore(this.name, this.level, this.coal.toFixed(0))
  }

  levelCompleted(cpm){
	  this._game._creator._createFactories(1);
	  this.levelUp();
	  alert("Wow! Your railway is bringing to factories "+cpm+"coal/minute! You attracted new factories to move in the valley! Also.. you are now a level "+this.level+" railway engineer, congrats! \n\n Now, can you build a railway that brings to factories "+(this.cpm_target)+" coal/minute ?");
  }

  earn_coal(coal){
	  this.coal += coal
	  if (this.level > 0){
		  this.coal_earned.push({coal: coal, time: Date.now()});
	  }
  }

  earn_money(money){
	  this.money += money;
	  this.moneyText.setText("$" + this.money.toFixed(1));
  }

  coal_per_minute(){
	  return this.coal_earned
		  .filter(mt => Date.now() - mt.time < 60 * 1000)
		  .map(mt => mt.coal)
		  .reduce((a, b) => a + b, 0)
  }

  update(){ //  called around 50 times per second
	  var cpm = this.coal_per_minute().toFixed(1) ;
	  var statusText = "Railway Engineer " +(this.level)+ " | "+this.coal.toFixed(0)+" coal";
	  if (this.level > 0){
		statusText += " | " + cpm + " coal/minute";
	  }
	  this.moneyPMText.setText(statusText);
	  this.goalText.x = this.moneyPMText.width;
	  if (this.level > 0 && cpm > this.cpm_target){
		  this.levelCompleted(cpm);
	  }


	this.treeFallingCount += 1;
	if (this.treeFallingCount == 500){ // every 10 seconds
	  this.treeFallingCount = 0;
	  if (Math.random() < 0.15){
		var l = this._game.grid.trees.length;
		var killTree = this._game.grid.trees[Math.floor(Math.random() * l)];
		killTree.kill();
	  }
	}

	  this.tutorial.update();

  }

  log(text){
	  var div = this._game._document.getElementById('player-logs');
          if (text.includes('TUTORIAL')){

	  div.innerHTML += '<p class="playerlog tutorial" style="margin-bottom:0px">' + text + '</p>';
		} else {
	  div.innerHTML += '<p class="playerlog" style="margin-bottom:0px">' + text + '</p>';
	}

	  div.scrollTop = div.scrollHeight;
  }
}

export {Player};
