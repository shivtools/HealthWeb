//Map options
var latAndLng = new google.maps.LatLng(37.5260016, -77.438847);
var mapOptions = {
	zoom: 11,
	center: latAndLng,
	scrollwheel:  false
};

//Create map
var element = document.getElementById('map-canvas');
var map = new google.maps.Map(element, mapOptions);

// Create the search box and link it to the UI element.
var input = document.getElementById('pac-input');
var searchBox = new google.maps.places.SearchBox(input);
map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

var markers = [];
// Listen for the event fired when the user selects a prediction and retrieve
// more details for that place.
searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length === 0) {
    	return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
    	marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {

      // Create a marker for each place.
     	markers.push(new google.maps.Marker({
      		map: map,
        	title: place.name,
        	position: place.geometry.location,
        	icon: "../public/images/mapping/home.png",
        	animation: google.maps.Animation.DROP
      	}));

      	if (place.geometry.viewport) {
        	// Only geocodes have viewport.
       		bounds.union(place.geometry.viewport);
      	} else {
        	bounds.extend(place.geometry.location);
      	}
   	});
});
	

//Grabs location of user if geolocation is available and places marker at current location
var currentLocationMarker = new google.maps.Marker({
	map: map,
	icon: "../public/images/mapping/currentlocation.png"
});
if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(function(position){
		var pos = {
			lat: position.coords.latitude,
			lng: position.coords.longitude,
		};
		currentLocationMarker.setPosition(pos);

		var locationInfoWindow = new google.maps.InfoWindow();
		google.maps.event.addListener(currentLocationMarker, 'click', function() {
			locationInfoWindow.setContent("Current Location");
			locationInfoWindow.open(map, currentLocationMarker);
		});
	});
}

// createMarker("108 Cowardin Avenue, Richmond, VA 23224", "one");
// createMarker("8600 Quioccasin Road, Suite 105, Richmond, VA 23229", "one");


//Create markers given address
//className is provided to place innerHTML into info window
function createMarker(address, className) {
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({
		address: address,
	}, function(results, status) {
		if (status === google.maps.GeocoderStatus.OK) {
			var result = results[0];
			var marker = new google.maps.Marker({
				map: map,
				position: {
					lat: result.geometry.location.lat(),
					lng: result.geometry.location.lng(),
				}
			}); 
			var infowindow = new google.maps.InfoWindow();
			google.maps.event.addListener(marker, 'click', function() {
				infowindow.setContent(document.getElementsByClassName(className)[0].innerHTML);
				infowindow.open(map, marker);
			});
		}
	});
}