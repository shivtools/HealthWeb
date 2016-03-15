//The majority of this code is written by Michael Dombrowski and Matt Santa! 
//Thanks guys :)!

var latlon;
var lat;
var lon;
var directionsService;
var directionsDisplay;
var map;
var prev_infowindow =false;

//Initialize map given user's coordinate - fetch using HTML5's geolocation API
function initMap() {

  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;

  map = new google.maps.Map(document.getElementById('mapholder'), {
    zoom: 12,
    center: {lat: lat, lng: lon},
    scrollwheel:  false
  });

  directionsDisplay.setMap(map);
  directionsDisplay.setOptions( { suppressMarkers: true } );

  displayMarkers(); //display all the markers of listings
  enableSearch(); //enable search feauture once markers have been placed

}

//Display route between locations with a blue line.

function calculateAndDisplayRoute(directionsService, directionsDisplay, destination) {
  // console.log("destination: " + destination);
  // console.log("latlon: " + latlon);
  //NASHEYA
  var distance = 0;

  directionsService.route({
    origin: latlon,
    destination: destination,
    travelMode: google.maps.TravelMode.DRIVING
  }, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      //NASHEYA
      //WHY DOESN'T DISTANCE WORK?
      //IF WE FIGURE THIS OUT, COULD GET TIME SIMILARLY
      distance = response.rows[0].elements[0].distance.value;
    } else {
      window.alert('We could not find this address, sorry!');
    }
  });

  //NASHEYA
  //DISTANCE IS 0 HERE
  alert(distance);
  // return response.rows[0].elements[0];
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

//If any of the listings on page are clicked, then show the route between the home location and that listing

$(document).on("click", ".collapse-button", function(){

  //Toggle window when clicked to open/close
  $(this).parent().find('.panel-collapse').collapse('toggle');

  //Get address (location) from HTML
  var address = $(this).parent().find('.location').text();

  //Display route from origin till this listing's location
  calculateAndDisplayRoute(directionsService, directionsDisplay, address);

});

var geocoder = new google.maps.Geocoder();

//Display markers of all locations on map.
//This was mostly Matt Santa's code, shoutout to him for this :) 

function displayMarkers(){
  //Go through each listing with ID 'listing' and add markers yo!
  $('*[id*=listing]').each(function() {

        //Get address for listing
        var address = $(this).find('.location').text();
        var name = $(this).find('.name').text();

        var geocoder = new google.maps.Geocoder();

        geocoder.geocode({
          address: address,
        }, function(results, status) {

          if (status === google.maps.GeocoderStatus.OK) {

            var result = results[0];

            //If address hasn't been provided for some reason, then don't add marker

            if(result != undefined && result != null){

              //Add marker to location
              var marker = new google.maps.Marker({
                map: map,
                animation: google.maps.Animation.DROP,
                position: {
                  lat: result.geometry.location.lat(),
                  lng: result.geometry.location.lng(),
                }
              }); 

              //Add info window for location name and distance from home (client's house)

              var infowindow = new google.maps.InfoWindow();

              //When marker is clicked, show box containing name and distance from home
              google.maps.event.addListener(marker, 'click', function() {
                //fix this - name not appearing in infowindow!

                //If previous_info window is open, then close it
                if( prev_infowindow ) {
                   prev_infowindow.close();
                }

                //Keep track of previous info window. Update it to the most current info-window
                prev_infowindow = infowindow;

                //display route from origin to marker location!
                // var elements = 
                calculateAndDisplayRoute(directionsService, directionsDisplay, address);

                //Set the contents of the info-window
                //NASHEYA
                infowindow.setContent(name + "<br> Distance: " + "<br> Time: ");
                infowindow.open(map, marker);
              });

            }

          }

          else{
            console.log(result);
          }

        });
    });

}

//More of Matt's kickass code. 
//Allows user to search up a location to make this the home location
function enableSearch(){

    var input = document.getElementById('search');
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
            icon: "images/mapping/home.png",
            animation: google.maps.Animation.DROP
        }));

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }

        //Update lat and long of home location
        lat = place.geometry.location.lat();
        lng = place.geometry.location.lng();

        //recenter map
        var center = new google.maps.LatLng(lat, lng);
        map.panTo(center);
        directionsDisplay.setMap(map);

        //update origin for updating origin of route (blue line)
        latlon = lat + "," + lng;

      });

    });
}
