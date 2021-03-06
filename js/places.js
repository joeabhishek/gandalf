$(function(){
	$('#directions').on("click", function(){
		calcRoute();
	});

	$('#transit-mode').on('click', 'li', function() {
		$('#transit-mode li.active').removeClass('active');
		$(this).addClass('active');
		if(!$('#destination-input').is('empty')) {
			var mode = $('#transit-mode li.active').data('value');
			calcRoute(mode);
			getDistanceMatrix(mode);
			return true;
		}
	});

	$('#destination-input').on("keypress", function(e) {
		if (e.keyCode == 13) {
			var mode = $('#transit-mode li.active').data('value');
			calcRoute(mode);
			getDistanceMatrix(mode);
			return true;
        }
    });

    $('.places-nearby-card').on('click', function(e) {
    });
});

var directionsDisplay;
var directionsService = new google.maps.DirectionsService();


function initialize() {
	directionsDisplay = new google.maps.DirectionsRenderer();
	var mapOptions = {
		center: new google.maps.LatLng(17.726217, 83.315470),
		zoom: 16
	};
	map = new google.maps.Map(document.getElementById("map-canvas"),
		mapOptions);
	directionsDisplay.setMap(map);
/*	searchPlacesNearby(map);*/
};

function searchPlacesNearby(map) {
	var service = new google.maps.places.PlacesService(map),
		request = {
			location: new google.maps.LatLng(17.726217, 83.315470),
			radius: '500',
			types: ['amusement_park', 'aquarium', 'art_gallery', 'bowling_alley', 
				    'museum', 'library', 'clothing_store', 'jewelry_store',
				    'pet_store', 'restaurant', 'place_of_worship', 'electronics_store'],
			rankBy: google.maps.places.RankBy.PROMINENCE
		}


	service.nearbySearch(request, displayPlacesNearby);
}

function displayPlacesNearby(results, status) {
	if (status == google.maps.places.PlacesServiceStatus.OK) {
		var count = 4;
		for (var i = 0; i < count; i++) {
			var place = results[i];
			debugger
			var marker = new google.maps.Marker({
		      	map: map,
		      	position: place.geometry.location
		    });
			var location = place.geometry.location.k + ',' + place.geometry.location.B;
			var card = $('#places-list-div');
			$('.rating').raty({
				score: function() {
					return $(this).attr('data-score');
				},
				readOnly: true,
				path: 'images/',
			});
			card.append('<span class="places-list-2" data-ordinates="' + location + '"> '
						 + place['name'] + '</span><div class="rating" data-score="' + place.rating + '"></div><br>' + 
						 '<span>' + place.vicinity + '</span><hr>');
			if(i<count-1){
				card.append('<br>');
			}
		}
	}
	
}

function calcRoute(mode) {
	var start = new google.maps.LatLng(17.726217, 83.315470);
	var end = $('#destination-input').val(),
		travelMode = google.maps.TravelMode.DRIVING;
	if(mode == 'WALKING'){
		travelMode = google.maps.TravelMode.WALKING;
	}
	var request = {
		origin:start,
		destination:end,
		travelMode: travelMode
	};
	directionsService.route(request, function(response, status) {
		if (status == google.maps.DirectionsStatus.OK) {
			directionsDisplay.setDirections(response);
		}
	});
};

function getDistanceMatrix(mode) {
	var service = new google.maps.DistanceMatrixService(),
		origin = new google.maps.LatLng(17.726217, 83.315470),
		destination = $('#destination-input').val(),
		travelMode = google.maps.TravelMode.DRIVING;
	if(mode == 'WALKING'){
		travelMode = google.maps.TravelMode.WALKING;
	}

	service.getDistanceMatrix(
	{
		origins: [origin],
		destinations: [destination],
		travelMode: travelMode,
		unitSystem: google.maps.UnitSystem.METRIC,
		durationInTraffic: false,
		avoidHighways: false,
		avoidTolls: false
	}, displayDirectionDetails);
};

function displayDirectionDetails(response, status){
	if (status == google.maps.DistanceMatrixStatus.OK) {
		var origins = response.originAddresses;
		var destinations = response.destinationAddresses;

		for (var i = 0; i < origins.length; i++) {
			var results = response.rows[i].elements;
			$('#distance-value').html(results[0].distance.text);
			$('#duration-value').html(results[0].duration.text);
			for (var j = 0; j < results.length; j++) {
				var element = results[j];
				var distance = element.distance.text;
				var duration = element.duration.text;
				var from = origins[i];
				var to = destinations[j];
				console.log(distance, duration);
			}
		}
	}
	$('#direction-details-card').css("display", "block");
};




google.maps.event.addDomListener(window, 'load', initialize);