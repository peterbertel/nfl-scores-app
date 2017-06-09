$("#search-query").val("");
$(".game").click( function() {
	gameElement = $(this)
		// if the checkbox is unchecked then show the quarter-points
	if (!gameElement.find('input').prop("checked")) {
		gameElement.find('input').prop('checked', true);
		away_team = gameElement.find('.away_team').text();
		home_team = gameElement.find('.home_team').text();
		week = $(".current-week").find("h4").text().split(" ")[1]
		$.ajax({
			url: '/get_quarter_points',
			type: 'get',
			dataType: 'json',
			data: {'away_team': away_team, 'home_team': home_team, 'week': week},
			success: function(data) {
				data = data.points_per_quarter
				gameElement.find('.away_q1').text(data.away_q1)
				gameElement.find('.away_q2').text(data.away_q2)
				gameElement.find('.away_q3').text(data.away_q3)
				gameElement.find('.away_q4').text(data.away_q4)
				gameElement.find('.home_q1').text(data.home_q1)
				gameElement.find('.home_q2').text(data.home_q2)
				gameElement.find('.home_q3').text(data.home_q3)
				gameElement.find('.home_q4').text(data.home_q4)
			},
			failure: function(data) {
				alert('Error, try again');
			}
		});
		} 
	else {
		gameElement.find('input').prop('checked', false);
		gameElement.find('.away_q1').text("")
		gameElement.find('.away_q2').text("")
		gameElement.find('.away_q3').text("")
		gameElement.find('.away_q4').text("")
		gameElement.find('.home_q1').text("")
		gameElement.find('.home_q2').text("")
		gameElement.find('.home_q3').text("")
		gameElement.find('.home_q4').text("")
		}
	});

var dataList = document.getElementById('json-datalist');
var teamSet = new Set();

// The following code came from https://github.com/thgreasi/datalist-polyfill
var browserSupportsDatalist = !!('list' in document.createElement('input')) && !!(document.createElement('datalist') && window.HTMLDataListElement);

// autocomplete code found from https://jqueryui.com/autocomplete/
if (!browserSupportsDatalist) {
	teamList = []
	$("#search-query").attr('autocomplete','on');
	$.ajax({
		url: '/get_teams',
		type: 'get',
		dataType: 'json',
		data: {'searchString': ""},
		success: function(data) {
			teams = data.teams;
			for (var i = 0; i < teams.length; i++) {
				teamList.push(teams[i].name);
			}
			$("#search-query").autocomplete({ source: teamList });
		},
		failure: function(data) {
			alert('Error, try again');
		}
	});
}
$("#search-team").on('input',function(e){
	if (browserSupportsDatalist) {
		var searchString = $("#search-query").val();

		// Referenced the following link to create the ajax call:
		//    https://simpleisbetterthancomplex.com/tutorial/2016/08/29/how-to-work-with-ajax-request-with-django.html
		// Referenced the following link to create the dropdown form:
		//    http://blog.teamtreehouse.com/creating-autocomplete-dropdowns-datalist-element
		$.ajax({
			url: '/get_teams',
			type: 'get',
			dataType: 'json',
			data: {'searchString': searchString},
			success: function(data) {
				teams = data.teams;
				for (var i = 0; i < teams.length; i++) {
					teamName = teams[i].name;
					if (!teamSet.has(teamName)) {
						teamSet.add(teamName);
						var option = document.createElement('option');
						option.value = teamName;
						dataList.appendChild(option);
					}
					else {
						continue;
					}
				}
			},
			failure: function(data) {
				alert('Error, try again');
			}
		});
	}
});