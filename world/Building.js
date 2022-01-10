/**
 * @solbiatialessandro
 */

class Building extends Phaser.GameObjects.Sprite {
  // inventory is {coal: 24, money: 15}
  constructor(scene, x, y, name, inventory, buildingText) {
    super(scene, x, y, name);
	this.setName(name);
	this.hasText = false;
	this.timer = 0;
	this.victory = false;
	switch(this.name){
		  case "mine":
			  this.coalGenerationFactor = Math.random() * 3;
			  this.inventory = {coal: 50}
			  break;
		  case "factory":
			  this.coalGenerationFactor = 0;
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
	  if(typeof this.inventory	!=  'undefined'){
		  for (const [key, value] of Object.entries(this.inventory)) {
			 _text += key + ": " + Math.floor(value) + "\n"; 
		  }
	  } else {
		  _text += '(empty)';
	  }
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
			  alert("Wow! You moved 100 unites of coal to this factory. You are a great railway engineer, everyone can't wait to see what amazing railways you are going to build next!\n\n Now can you move 100 unites of coal to the other factory?");
		  }
	  }
	  

  }
}

export {Building};
