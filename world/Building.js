/**
 * @solbiatialessandro
 */

class Building extends Phaser.GameObjects.Sprite {
  // inventory is {coal: 24, money: 15}
  constructor(scene, x, y, name, inventory, buildingText) {
    super(scene, x, y, name);
	this.setName(name);
	this.inventory = inventory
	this.hasText = false;
	this.timer = 0;
	// TODO: make subclass mine
	this.coalGenerationFactor = Math.random() * 3;
	if (typeof buildingText != 'undefined') {
		this.hasText = true;
		this.buildingText = buildingText;
		this._setText();
	}
  }

  trainPassing(train){
	  switch(this.name){
		  case "mine":
			  train.stopMine(this);
			  break;
		  case "factory":
			  train.stopFactory(this);
			  break;
	  }
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
		  switch(this.name){
			  case "mine":
				  this.inventory.coal += this.coalGenerationFactor;
				  break;
		  }
		  this._setText();
		  this.timer = 0;
	  }

  }
}

export {Building};
