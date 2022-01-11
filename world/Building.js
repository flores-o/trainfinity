/**
 * @solbiatialessandro
 */

class Building extends Phaser.GameObjects.Sprite {
  // inventory is {coal: 24, money: 15}
  constructor(scene, x, y, name, inventory, buildingText) {
    super(scene, x, y, name);
	
	this._scene = scene;
	this.setName(name);
	this.hasText = false;
	this.timer = 0;
	this.victory = false;
	switch(this.name){
		  case "mine":
			  this.coalTradePrice = Math.random() * 3 + 1;
			  this.coalGenerationFactor = Math.random() * 3 + 1;
			  this.inventory = {coal: 0}
			  break;
		  case "factory":
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

  trainPassing(train){
	  train.stopAt(this);
	  this._setText();
  }

  _setText(){
	  // breaks if buildingText is undefined
	  var _text = this.name + "\n";
	  /*
	  for (const [key, value] of Object.entries(this.inventory)) {
		 _text += key + ": " + Math.floor(value) + "\n"; 
	  }*/
	  _text += "coal: " + Math.floor(this.inventory.coal) + "\n" + 
		  this.coalTradePrice.toFixed(1) + "$/unit \n"; 
	
	  this.buildingText.setText(_text);
  }

  preUpdate(time, delta){
	  super.preUpdate(time, delta);
	  this.timer += delta;
	  if (this.timer > 5000){
		  this.inventory.coal += this.coalGenerationFactor;
		  this._setText();
		  this.timer = 0;
		  if (this.inventory.coal >= 100 && this.name == "factory" && 
			  this.victory == false){
			  this.victory = true;
			  this._scene.player.victoryFactory = true;
			  this._scene.player.moneyText.visible = true;
			  this._scene.player.moneyPMText.visible = true;
			  alert("Wow! You moved 100 unites of coal to this factory. Your earned the factory's and you can now sell them carbon at $"+this.coalTradePrice.toFixed(2)+"/unit!\n\nNow, can you build a better railway that earns $1000/minute?");
		  }
	  }
	  

  }
}

export {Building};
