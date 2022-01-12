/**
 * @solbiatialessandro
 */
class Player {
  constructor(moneyText, moneyPMText, goalText) {
	  this.money = 300;
	  this.coal_earned = [];
	  this.moneyText = moneyText;
	  this.moneyPMText = moneyPMText;
	  this.moneyText.setText("$" + this.money.toFixed(1));
	  this.moneyText.visible = false;
	  this.moneyPMText.visible = false;
	  this.victoryFactory = false;
	  this.victoryMPM = false;
	  this.goalText = goalText;
  }

  earn_coal(coal){
	  this.coal_earned.push({coal: coal, time: Date.now()});
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

  update(){
	  var mpm = this.coal_per_minute().toFixed(1) ;
	  this.moneyPMText.setText("" + mpm + " coal/minute");
	  if (mpm > 200 && this.victoryFactory == true && this.victoryMPM == false){
		  alert("Wowowow! Your railway is earning $"+mpm+"/minute! You are a great railway engineer. \n\n You now have a solid revenue stream! The factory is impressed and decides to offer you a loan of $50.000k to further improve your railway. What will you build next?");
		  this.victoryMPM = true;
		  this.money += 50000;
		  this._scene.player.goalText.setText("Next Achievement (#3): the railway MUST GROW");
	  }
  }
}

export {Player};
