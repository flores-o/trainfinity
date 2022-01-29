/**
 * Created by Filip on 2018-12-01.
 */

//these are now trees
class Water extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'water');
	this.setName('water');
  }

  kill(){
	try{
	var killTree = this;
	  this.scene.player.log("> due to pollution a tree dies ("+killTree.x+", "+killTree.y+")");
	  delete this.scene.grid._buildings['x' + killTree.x + 'y' + killTree.y];
	  killTree.destroy(true);
	} catch(err){
	  console.log(err);
	}

  }
}

export {Water};
