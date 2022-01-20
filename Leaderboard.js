var GET_URL = "https://www.meeiot.org/get/";
var PUT_URL = "https://www.meeiot.org/put/";
var APIKEY = "6f13e698ef69cdaf87f00aba23924f88645c3039167fa574fe983e";
var KEY = "trainfinity-leaderboard";

class Leaderboard {
	constructor(){
		this.leaderboard = {}
		this._leaderboard = "";
		this.getLeaderboard()
	}

	setLeaderboardHTML(leaderboard){
		// can't believe i needed this https://stackoverflow.com/questions/25500316/sort-a-dictionary-by-value-in-javascript
		var items = Object.keys(leaderboard).map(function(key) {
		  return [key, leaderboard[key]];
		});
		// Sort the array based on the second element
		items.sort(function(first, second) {
		  return second[1] - first[1];
		});

		;debugger

		var _leaderboardString = "";
		items.forEach(m => {
			_leaderboardString += "<p>"+ m[0] + ": " + m[1] + "</p>";
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

	addScore(player, score){
		var prev = typeof this.leaderboard[player] === 'undefined' ? -1 : this.leaderboard[player]
		this.leaderboard[player] = Math.max(score, prev)
		this.saveScore()
		this.setLeaderboardHTML(this.leaderboard	)
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
