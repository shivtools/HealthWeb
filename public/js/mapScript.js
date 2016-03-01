var latlon;
var lat;
var lon;
var directionsService;
var directionsDisplay;

function initMap() {
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  console.log(document.getElementById('mapholder'));
  var map = new google.maps.Map(document.getElementById('mapholder'), {
    zoom: 14,
    center: {lat: lat, lng: lon}
  });
  directionsDisplay.setMap(map);
}

function calculateAndDisplayRoute(directionsService, directionsDisplay, destination) {
  console.log("destination: " + destination);
  console.log("latlon: " + latlon);

  directionsService.route({
    origin: latlon,
    destination: destination,
    travelMode: google.maps.TravelMode.DRIVING
  }, function(response, status) {
    console.log(response);
    if (status === google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

var map;

var x = document.getElementById("mapholder");
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
  console.log("calling getLocaiton");
}

function showPosition(position) {
  latlon = position.coords.latitude + "," + position.coords.longitude;
  lat=position.coords.latitude;
  lon=position.coords.longitude;
  initMap();
}

function showError(error) {
  switch(error.code) {
  case error.PERMISSION_DENIED:
  x.innerHTML = "User denied the request for Geolocation."
  break;
  case error.POSITION_UNAVAILABLE:
  x.innerHTML = "Location information is unavailable."
  break;
  case error.TIMEOUT:
  x.innerHTML = "The request to get user location timed out."
  break;
  case error.UNKNOWN_ERROR:
  x.innerHTML = "An unknown error occurred."
  break;
  }
}

window.onload = getLocation;

$(document).on("click", ".collapse-button", function(){
  $(this).parent().find('.panel-collapse').collapse('toggle');

  var address = $(this).parent().find('.location').text();

  console.log(address);

  var geocoder = new google.maps.Geocoder();

  geocoder.geocode({
    "address": address
    }, function(results, status){
      console.log(results);

    calculateAndDisplayRoute(directionsService, directionsDisplay, address);
  });

});