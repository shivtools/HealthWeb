//The majority of this code is written by Michael Dombrowski and Matt Santa! 
//Thanks guys :)!

var latlon;
var lat;
var lon;
var directionsService;
var directionsDisplay;
var map;

//Initialize map given user's coordinate - fetch using HTML5's geolocation API
function initMap() {

  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  console.log(document.getElementById('mapholder'));
  map = new google.maps.Map(document.getElementById('mapholder'), {
    zoom: 14,
    center: {lat: lat, lng: lon},
    scrollwheel:  false
  });
  directionsDisplay.setMap(map);
  displayMarkers();

}

//Display route between locations with a blue line.

function calculateAndDisplayRoute(directionsService, directionsDisplay, destination) {
  // console.log("destination: " + destination);
  // console.log("latlon: " + latlon);

  directionsService.route({
    origin: latlon,
    destination: destination,
    travelMode: google.maps.TravelMode.DRIVING
  }, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      
    } else {
      window.alert('We could not find this address, sorry!');
    }
  });
}

var x = document.getElementById("mapholder");

//Get user's coordinates using HTML5's geolocation API
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
  //console.log("calling getLocaiton");
}

function showPosition(position) {
  latlon = position.coords.latitude + "," + position.coords.longitude;
  lat=position.coords.latitude;
  lon=position.coords.longitude;
  initMap();
}

//Prompt user if error
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

//If any of the listings on page are clicked, then ..

$(document).on("click", ".collapse-button", function(){

  $(this).parent().find('.panel-collapse').collapse('toggle');

  var address = $(this).parent().find('.location').text();

  var geocoder = new google.maps.Geocoder();

  geocoder.geocode({
    "address": address
    }, function(results, status){
      //console.log("geocoder :" + results);

    //calculateAndDisplayRoute(directionsService, directionsDisplay, address);
  });

});

var geocoder = new google.maps.Geocoder();

//Display markers of all locations on map.
//This was mostly Matt Santa's code, shoutout to him for this :) 

function displayMarkers(){

  console.log("calling displayMarkers"); 
  //go through each listing and extract address
  $('*[id*=listing]').each(function() {

        var address = $(this).find('.location').text();
        console.log("Address is: " + address);

        var geocoder = new google.maps.Geocoder();

        geocoder.geocode({
          address: address,
        }, function(results, status) {

          if (status === google.maps.GeocoderStatus.OK) {

            var result = results[0];

            //If address hasn't been provided for some reason!

            if(result != undefined && result != null){

              var marker = new google.maps.Marker({
                map: map,
                animation: google.maps.Animation.DROP,
                position: {
                  lat: result.geometry.location.lat(),
                  lng: result.geometry.location.lng(),
                }
              }); 

              var infowindow = new google.maps.InfoWindow();

              google.maps.event.addListener(marker, 'click', function() {
                var name = document.getElementsByClassName("name")[0].innerHTML
                console.log("Name is: " + name);

                infowindow.setContent(name + ", located at: " + address);
                infowindow.open(map, marker);
                console.log("Adding to map");
              });

            }

          }

          else{
            console.log(result);
          }

        });
    });

}

function toggleBounce() {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}