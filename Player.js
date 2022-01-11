/**
 * @solbiatialessandro
 */
class Player {
  constructor(moneyText, moneyPMText) {
	  this.money = 300;
	  this.money_earned = [];
	  this.moneyText = moneyText;
	  this.moneyPMText = moneyPMText;
	  this.moneyText.setText("$" + this.money.toFixed(1));
	  this.moneyText.visible = false;
	  this.moneyPMText.visible = false;
	  this.victoryFactory = false;
	  this.victoryMPM = false;
  }

  earn_money(money){
	  this.money += money;
	  this.money_earned.push({money: money, time: Date.now()});
	  this.moneyText.setText("$" + this.money.toFixed(1));
  }

  money_per_minute(){
	  return this.money_earned
		  .filter(mt => Date.now() - mt.time < 60 * 1000)
		  .map(mt => mt.money)
		  .reduce((a, b) => a + b, 0)
  }

  update(){
	  var mpm = this.money_per_minute().toFixed(1) ;
	  this.moneyPMText.setText("$" + mpm + "/minute");
	  if (mpm > 1000 && this.victoryFactory == true && this.victoryMPM == false){
		  alert("Wowowow! Your railway is earning $"+mpm+"/minute! You are a great railway engineer. \n\n You now have a solid revenue stream! The factory is impressed and decides to offer you a loan of $50.000k to further improve your railway. What will you build next?");
		  this.victoryMPM = true;
		  this.money += 50000;
	  }
  }
}

export {Player};
