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
                    $("#glt").html("<p>" + duration + "</p>");
                    console.log(duration);

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
            directionsManager.setRenderOptions({ itineraryContainer: '#bing2' });
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
        var msurl = "https://dev.virtualearth.net/REST/V1/Routes/Driving?";

var msstart = $("#start-input").val();
        console.log ("Starting point is " + msstart);

        var msend = $("#end-input").val();
        console.log ("Destination is " + msend);

        msurl += '&' + $.param({
          'wp.0': msstart,
          'wp.1': msend,
          'avoid': "minimizeTolls",
          'key': "ArLnZO4jLSf3BIvO0JlizUym8NuyXsEfcdEta6Gbe2amXM0L73Dv6J8N6XPj1nUf",
        });

        console.log(msurl);

        $.getJSON({
          url: msurl,
          method: 'GET',
          dataType: 'jsonp',
          success: function() { console.log('Success!'); },                              
          error: function() { console.log('Uh Oh!'); },
        jsonp: 'jsonp'  
        }).done(function(answer) {
           var distance = answer.resourceSets[0].resources[0].travelDistance;
           var distance = Math.floor(distance * 0.621371);
           var duration = answer.resourceSets[0].resources[0].travelDuration;
           var hours = Math.floor((duration/60)/60) + " hours "
           var minutes = Math.floor((duration/60) % 60) + " mins"
           var duration = hours + minutes

                $("#bing").append("<p><b>Trip Time:</b> " + duration + "<br />" + "<b>Total distance:</b> " + distance + " mi <br/></p><hr>");
                $("#bmt").html("<p>" + answer.resourceSets[0].resources[0].travelDuration + "</p>");

            for (var i=0; i<answer.resourceSets[0].resources[0].routeLegs[0].itineraryItems.length;i++){
              $("#bing").append("<div><p>" + answer.resourceSets[0].resources[0].routeLegs[0].itineraryItems[i].instruction.text + ". Drive " + answer.resourceSets[0].resources[0].routeLegs[0].itineraryItems[i].travelDistance + " miles.</p><hr></div>" );
          }
             $("#bing").append("<p><b>" + msend + "</b>. You have arrived. </p><hr>")


        })

    }

// End Bing

// // New bing

// var msurl = "https://dev.virtualearth.net/REST/V1/Routes/Driving?";

//     function GetDirections2() {

//         var msstart = $("#start-input").val();
//         console.log ("Starting point is " + msstart);

//         var msend = $("#end-input").val();
//         console.log ("Destination is " + msend);

//         msurl += '&' + $.param({
//           'wp.0': msstart,
//           'wp.1': msend,
//           'avoid': "minimizeTolls",
//           'key': "ArLnZO4jLSf3BIvO0JlizUym8NuyXsEfcdEta6Gbe2amXM0L73Dv6J8N6XPj1nUf",
//         });

//         console.log(msurl);

//         $.getJSON({
//           url: msurl,
//           method: 'GET',
//           dataType: 'jsonp',
//           success: function() { console.log('Success!'); },                              
//           error: function() { console.log('Uh Oh!'); },
//         jsonp: 'jsonp'  
//         }).done(function(answer) {
//            var distance = answer.resourceSets[0].resources[0].travelDistance;
//            var duration = answer.resourceSets[0].resources[0].travelDuration;
//            var hours = Math.floor((duration/60)/60) + " hours"
//            var minutes = Math.floor((duration/60) % 60) + " mins"
//            var duration = hours + minutes

//                 $("#bing").append("<p><b>Trip Time:</b> " + duration + "<br />" + "<b>Total distance:</b> " + distance + " mi <br/></p><hr>");

//             for (var i=0; i<answer.resourceSets[0].resources[0].routeLegs[0].itineraryItems.length;i++){
//               $("#bing").append("<div><p>" + answer.resourceSets[0].resources[0].routeLegs[0].itineraryItems[i].instruction.text + ". Drive " + answer.resourceSets[0].resources[0].routeLegs[0].itineraryItems[i].travelDistance + " miles.</p><hr></div>" );
//           }
//              $("#bing").append("<p><b>" + msend + "</b>. You have arrived. </p><hr>")


//         }).fail(function(err) {
//           throw err;
//     });

// };

// end of new bing

function gb () {
GetRoute();
GetDirections();
   $(".h2header").show();
   document.getElementById("here").scrollIntoView()

}
// Combo Bing Google

// End BG combo

//MapQuest


var mqurl = "https://www.mapquestapi.com/directions/v2/route?key=kQospImBwPkP5GemswE0Orklf9xi1hqR";

$("#btnsubmit").on("click", function(event) {
      event.preventDefault();
$("#mapquest").empty();
$("#mapquest-title").empty();

$(".maps").css({"opacity": "1"});
$(".h2header").css({"opacity": "1"});
// $("#h3Compare").css({"opacity": "1"});





var mqstart = $("#start-input").val();
console.log ("Starting point is " + mqstart);

var mqend = $("#end-input").val();
console.log ("Destination is " + mqend);



mqurl += '&' + $.param({
  'from': mqstart,
  'to': mqend,
  'outFormat': "json&ambiguities=ignore&routeType=fastest&doReverseGeocode=false&enhancedNarrative=false&avoidTimedConditions=false",
});
$.ajax({
  url: mqurl,
  method: 'GET',
}).done(function(result) {
    console.log(result);
    console.log(mqurl);
    // console.log (result.route.realTime);
    console.log (result.route.legs[0].maneuvers.length);
        console.log (result.route.realTime);

  var mqduration = result.route.realTime;
           var mqhours = Math.floor((mqduration/60)/60) + " hours "
           var mqminutes = Math.floor((mqduration/60) % 60) + " mins"
           var mqduration = mqhours + mqminutes

    // console.log (result.route.legs[0].maneuvers[0].narrative + " In " + result.route.legs[0].maneuvers[0].distance + " miles, turn " + result.route.legs[0].maneuvers[0].turnType + " onto " + result.route.legs[0].maneuvers[1].streets[0]);

    // $("#h3Compare").show();
    // $(".h2header").show();

    $("#mqt").html("<p>" + mqduration + "</p>");

    $("#mapquest").append("<div><p><b>Trip time: </b>" + mqduration + "<br /><b>Total distance: </b>" + result.route.distance + " mi</p><hr></div>");


  for (var i=0; i<result.route.legs[0].maneuvers.length-1;i++){
      $("#mapquest").append("<div class='steps'><p>" + result.route.legs[0].maneuvers[i].narrative + " Drive " + result.route.legs[0].maneuvers[i].distance + " miles.</p><hr></div>" );
  }

        $("#mapquest").append("<div><p><b>" + mqend + "</b>. You have arrived.</p><hr></div>");
    $("#mapquest").append("<div></div>");



//Map

function mqmap () {
        L.mapquest.key = 'kQospImBwPkP5GemswE0Orklf9xi1hqR';

        var mqmap = L.mapquest.map('map', {
          center: [0, 0],
          layers: L.mapquest.tileLayer('map'),
          zoom: 1
        });

        L.mapquest.directions().route({
          start: mqstart,
          end: mqend,
        });

        // L.mapquest.directions().route({
        //   start: '350 5th Ave, New York, NY 10118',
        //   end: 'One Liberty Plaza, New York, NY 10006'
        // });

      }
mqmap ();

// function () {
  
//     $("#myMap").css({"height": "200px", "width": "100%"});
// }

}).fail(function(err) {
  throw err;
});

});


// function () {
//   if (mqTrip > duration && mqTrip > )
//     $("#myMap").css({"height": "200px", "width": "100%"});
// }
        