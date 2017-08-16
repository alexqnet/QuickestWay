    $(function(){
      $("#results").hide() // try to hide google navigation bar
   });
// Google
        var goStart, goEnd;
        var directionsDisplay;
        var directionsService = new google.maps.DirectionsService();
        google.maps.event.addDomListener(window, 'load', function () {
            new google.maps.places.SearchBox(document.getElementById('start-input'));
            new google.maps.places.SearchBox(document.getElementById('end-input'));
            directionsDisplay = new google.maps.DirectionsRenderer({ 'draggable': true });
        });

        function GetRoute() {
            var washingtonDC = new google.maps.LatLng(38.9072, -77.0369);
            var mapOptions = {
                zoom: 13,
                center: washingtonDC
            };
            map = new google.maps.Map(document.getElementById('gmap'), mapOptions);
            directionsDisplay.setMap(map);
            // directionsDisplay.setPanel(document.getElementById('google'));


            //*********DIRECTIONS AND ROUTE**********************//
            goStart = document.getElementById("start-input").value;
            goEnd = document.getElementById("end-input").value;

            var request = {
                origin: goStart,
                destination: goEnd,
                travelMode: google.maps.TravelMode.DRIVING
            };
            directionsService.route(request, function (response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setDirections(response);
                        // console.log(response);

                        for(var i=0; i<response.routes[0].legs[0].steps.length-1; i++){
                            // console.log(response.routes[0].legs[0].steps[i].instructions);
                            $("#google").append("<div class='steps'>" + response.routes[0].legs[0].steps[i].instructions + 
                            ". Drive " + response.routes[0].legs[0].steps[i].distance.text + " </p><hr></div>");
                    }
                $("#google").append("<p><b>" + goEnd + "</b>. You have arrived.</p><hr>");
                // $("#google").append("<p><b>Total distance: " + response.routes[0].legs[0].distance.text + " miles</b></p>");
                }
            });

            //*********DISTANCE AND DURATION**********************//
            var service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix({
                origins: [goStart],
                destinations: [goEnd],
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.IMPERIAL,
                avoidHighways: false,
                avoidTolls: false
            }, function (response, status) {
                if (status == google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status != "ZERO_RESULTS") {
                    var distance = response.rows[0].elements[0].distance.text;
                    var duration = response.rows[0].elements[0].duration.text;
                    var dvDistance = $("#google").append("<p><b>Trip Time:</b> " + duration + "<br /><b>Total distance:</b> " + distance + "<br /><hr>");

                } else {
                    alert("Unable to find the distance via road.");
                }
            });

        }

    // End Google 

//Bing

    var bmmap, directionsManager;
    function GetMap()
    {
        bmmap = new Microsoft.Maps.Map('#myMap', {
            credentials: 'iPZAH5q8RBcArP7k7xW1~cYdzD2XewIaX9BZ-4WrzVw~AjW6X_1NGAAvnAuhZycGeoR75XbryLK7KHUYvoRRHRUlfPGNE284txIaZCq3JkuT'
        });
        //Load the directions module.
        Microsoft.Maps.loadModule('Microsoft.Maps.Directions', 
            function () {
            //Create an instance of the directions manager.
            directionsManager = new Microsoft.Maps.Directions.DirectionsManager(bmmap);
            //Specify where to display the route instructions.
            directionsManager.setRenderOptions({ itineraryContainer: '#bing' });
            //Specify the where to display the input panel
            directionsManager.showInputPanel('directionsPanel');
        });
    }
    function GetDirections() {
        if (!directionsManager) {
            //Load the directions module.
            Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () {
                //Create an instance of the directions manager.
                directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);
                //Calculate the directions.
                GetDirections();
            });
        } else {
            //Clear any previously calculated directions.
            directionsManager.clearAll();
            //Create waypoints to route between.
            var bmstart = new Microsoft.Maps.Directions.Waypoint({ address: document.getElementById('start-input').value });
            directionsManager.addWaypoint(bmstart);
            var bmend = new Microsoft.Maps.Directions.Waypoint({ address: document.getElementById('end-input').value });
            directionsManager.addWaypoint(bmend);
            
            //Calculate directions.
            directionsManager.calculateDirections();
        }
    }

// End Bing

function gb () {
GetRoute();
GetDirections();
   $(".h2header").show();
   document.getElementById("here").scrollIntoView()

}
// Combo Bing Google

// End BG combo
        