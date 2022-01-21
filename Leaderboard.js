var GET_URL = "https://www.meeiot.org/get/";
var PUT_URL = "https://www.meeiot.org/put/";
var APIKEY = "6f13e698ef69cdaf87f00aba23924f88645c3039167fa574fe983e";
var KEY = "trainfinity-leaderboard";

class LeaderboardPlayer {
	constructor(key, value){
		this.name = key;
		this.level = value[0];
		this.score = value[1];
	}

	_currentRanking(leaderboard){
		return leaderboard[this.name]
	}

	addRanking(leaderboard){
		if (typeof this._currentRanking(leaderboard) === 'undefined'){
			leaderboard[this.name] = [this.level, this.score]
		} else {
			var prev = leaderboard[this.name]
			leaderboard[this.name] = [Math.max(this.level, prev[0]), Math.max(this.score, prev[1])]
		}
	}

	leaderboardSort(otherPlayer){
		return otherPlayer.score - this.score 
	}

	getLeaderboardString(){
		return  "<p>"+ this.name + " (Railway Engineer "+ this.level +"): " + this.score  + "</p>";

	}
}

class Leaderboard {
	constructor(){
		this.leaderboard = {}
		this._leaderboard = "";
		this.getLeaderboard()
	}

	setLeaderboardHTML(leaderboard){
		// can't believe i needed this https://stackoverflow.com/questions/25500316/sort-a-dictionary-by-value-in-javascript
		var items = Object.keys(leaderboard).map(function(key) {
		  return [key, new LeaderboardPlayer(key, leaderboard[key])];
		});
		// Sort the array based on the second element
		items.sort(function(first, second) {
		  return first[1].leaderboardSort(second[1])
		});


		var _leaderboardString = "";
		items.forEach(key_player => { _leaderboardString += key_player[1].getLeaderboardString()
		})

		
		document.getElementById('leaderboard-content').innerHTML = _leaderboardString
	}

	getLeaderboard(){
		$.ajax({
			url: GET_URL + APIKEY + "/" + KEY,
			type: 'GET',
			dataType: 'json', // added data type
			success: function(res) {
				console.log(res)
				console.log("Leaderboard:success")
				this._leaderboard = decodeURIComponent(res.responseText);
				this.leaderboard = JSON.parse(this._leaderboard)
				this.setLeaderboardHTML(this.leaderboard)
			}.bind(this),
			error: function(err){
				console.log(err);
				console.log("Leaderboard:err - "+err.statusText)
				this._leaderboard = decodeURIComponent(err.responseText);
				this.leaderboard = JSON.parse(this._leaderboard)
				this.setLeaderboardHTML(this.leaderboard)
			}.bind(this)
		});
	}

	addScore(name, level, score){
		// level (Railway Engineer 2)
		// score (2125 coal brought to factories)
		var player = new LeaderboardPlayer(name, [level, score])
		player.addRanking(this.leaderboard)
		this.saveScore()
		this.setLeaderboardHTML(this.leaderboard)
	}

	saveScore(){
		$.ajax({
			url: PUT_URL + APIKEY + "/" + KEY + "=" + JSON.stringify(this.leaderboard) ,
			type: 'GET',
			dataType: 'json', // added data type
			success: function(res) {
				console.log(res)
				console.log("Leaderboard:success")
				if (err.status != 200){
					alert("Couldn't save leaderboard score! "+err);
				}
			}.bind(this),
			error: function(err){
				console.log(err);
				console.log("Leaderboard:err - "+err.statusText)
				if (err.status != 200){
					alert("Couldn't save leaderboard score! "+err);
				}
			}.bind(this)
		});

	}
}

export {Leaderboard}
