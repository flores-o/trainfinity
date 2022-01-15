/**
 * @solbiatialessandro
 */
import * as constants from "./constants.js"

class Building extends Phaser.GameObjects.Sprite {
  // inventory is {coal: 24, money: 15}
  constructor(scene, x, y, name, inventory, buildingText, level) {
    super(scene, x, y, name);
	
	this._scene = scene;
	this.setName(name + Math.floor(Math.random()*10000));
	this.hasText = false;
	this.timer = 0;
	this.playerMemory = {}
	if (typeof level == 'undefined') {
		this.level = 0;
	} else {
		this.level = level;
	}
	switch(true){
		case this.isMine():
			  this.coalTradePrice = Math.random() * 3 + 1;
			  this.coalGenerationFactor = Math.random() * 3 + 1;
			  this.inventory = {coal: 0}
			  break;
		case this.isFactory():
			  this.coalGenerationFactor = 0;
			  this.coalTradePrice = Math.random() * 3 + 10;
			  this.inventory = {coal: 0}
			  break;
	  }
	if (typeof buildingText != 'undefined') {
		this.hasText = true;
		this.buildingText = buildingText;
		this._setText();
	}


  }

  factory_coalForLevel(level){
	  return 100 * (3 ** level);
  }

  getName(){
	  return this.name;
  }

  setMemory(key, value){
	  this.playerMemory[key] = value;
  }

  getMemory(key){
	  return this.playerMemory[key];
  }

  getAvailableCoal(){
	  return this.inventory.coal;
  }

  trainPassing(train){
	  train.stopAt(this);
	  this._setText();
  }

  isMine(){
	  return this.name.includes('mine');
  }

  isFactory(){
	  return this.name.includes('factory');
  }

  _setText(){
	  // breaks if buildingText is undefined
	  var _text = "("+ this.level+ ")" + this.name + "\n";
	  /*
	  for (const [key, value] of Object.entries(this.inventory)) {
		 _text += key + ": " + Math.floor(value) + "\n"; 
	  }*/

	  if (constants.money_enabled){
		  this.coalTradePrice.toFixed(1) + "$/unit \n"; 
	  }

	  if (this.isFactory()){
		  _text += "coal: " + Math.floor(this.inventory.coal) + "/" + 
			  this.factory_coalForLevel(this.level) +  "\n";
	  } else if (this.isMine()) {
		  _text += "coal: " + Math.floor(this.inventory.coal) + "\n";
	  }
	
	  this.buildingText.setText(_text);
  }

  preUpdate(time, delta){
	  super.preUpdate(time, delta);
	  this.timer += delta;
	  if (this.timer > 5000){
		  this.inventory.coal += this.coalGenerationFactor * (this.level + 1);
		  this._setText();
		  this.timer = 0;

		  // LEVEL 0 -> 1 WALKTHROUGH 
		  if ( this.isFactory() && 
			  this.inventory.coal >= 100 &&
			  this._scene.player.level == 0){
			  this.level += 1;
			  this._scene.player.levelUp();
			  this._scene.player.moneyText.visible = constants.money_enabled;
			  this._scene.player.moneyPMText.visible = true;

			  var success_text = "Wow! You moved 100 unites of coal to the factory. The factory has been using this coal to drill a new coal mine that is now ready for you to use! ";
			  if (constants.money_enabled){
				  success_text += " Your earned the factory's and you can now sell them carbon at $"+this.coalTradePrice.toFixed(2)+"/unit!\n";

			  }
			  alert(success_text + "\nNow, can you build a better railway that brings 100 coal/minute to the factories?");
			  this._scene._creator._createMines(1, 0);
			  return;
		  }

		  // FACTORY LEVEL UP: spawn new mine and increase level 
		  // (coal for next level exponentially higher)
		  if (this.isFactory() &&
			  this.inventory.coal >= this.factory_coalForLevel(this.level)){
			  this._scene._creator._createMines(1, this.level);
			  this.level += 1;
		  }
	  }
	  

  }
}

export {Building};
