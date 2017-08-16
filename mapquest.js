
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
    console.log (result.route.formattedTime);
    console.log (result.route.legs[0].maneuvers.length);
    // console.log (result.route.legs[0].maneuvers[0].narrative + " In " + result.route.legs[0].maneuvers[0].distance + " miles, turn " + result.route.legs[0].maneuvers[0].turnType + " onto " + result.route.legs[0].maneuvers[1].streets[0]);

    // $("#h3Compare").show();
    // $(".h2header").show();
    $("#mapquest").append("<div><p><b>Trip time: </b>" + result.route.formattedTime + "<br /><b>Total distance: </b>" + result.route.distance + " mi</p><hr></div>");


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



}).fail(function(err) {
  throw err;
});

});


