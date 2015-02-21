//SEARCH SCREEN FUNCTIONS
function streetSearch() {
	$("#search-result-panel").remove();
	var streetName = $('#street-input').val();
	callAPI("findRoutesByStopName",{ stopName: "%"+streetName+"%" }, "streetSearchCallback");
	return false;
}

function streetSearchCallback(result){
	var names = [];
	for (index = 0; index < result.length; ++index) {
		var aux = {name: result[index]["longName"], id: result[index]["id"]};
		names.push(aux);
	}
	var input = {results:names};
	var template = $('#streetSearchTMPL').html();
	var output = Mustache.render(template, input);


	localSave("searchResult", output);
	searchAppendOutput(output);
}

function searchAppendOutput(output){
	$("#search-result-wrapper").append(output);

	//save ride name upon click
	$(".ridelink").click(function (){
		localSave("rideName", $(this).html());
	});
}


//DETAILS SCREEN FUNCTIONS
function getDetails(idStr){
	var id = parseInt(idStr);
	if(isNaN(id) || id < 0){
		$("#ride-title").append(idStr+" isn't a valid id");
		return false;
	}

	callAPI("findStopsByRouteId",{ routeId: id }, "getDetailsStopsCallback");
	callAPI("findDeparturesByRouteId",{ routeId: id }, "getDetailsDeparturesCallback");
}

function getDetailsStopsCallback(result){
	var streets = [];
	for (index = 0; index < result.length; ++index) {
		streets.push(result[index]["name"]);
	}
	var input = {results:streets};

	var template = $('#stopsTMPL').html();
	var output = Mustache.render(template, input);
	$("#stops-result-wrapper").append(output);
}

function getDetailsDeparturesCallback(result){
	var departuresWeekdays = "";
	var departuresSat = "";
	var departuresSun = "";
	for (index = 0; index < result.length; ++index) {
		if(result[index]["calendar"] == "WEEKDAY"){
			departuresWeekdays += result[index]["time"]+", ";
		} else if(result[index]["calendar"] == "SATURDAY"){
			departuresSat += result[index]["time"]+", ";
		} else {
			departuresSun += result[index]["time"]+", ";
		}
	}

	departuresWeekdays = departuresWeekdays.substring(0, departuresWeekdays.length-2);
	departuresSat = departuresSat.substring(0, departuresSat.length-2);
	departuresSun = departuresSun.substring(0, departuresSun.length-2);

	var input = {depsWeekdays: departuresWeekdays, depsSat: departuresSat, depsSun: departuresSun};

	var template = $('#departuresTMPL').html();
	var output = Mustache.render(template, input);
	$("#ride-title").html(localRetrieve("rideName"));
	$("#departures-result-wrapper").append(output);
}

//API FUNCTION
function callAPI(serviceName, parameters, callbackFunction) {
	$.ajax({
		url: "https://api.appglu.com/v1/queries/"+serviceName+"/run",
		contentType: "application/json",
		type: "POST",
		headers: {"Authorization": "Basic V0tENE43WU1BMXVpTThWOkR0ZFR0ek1MUWxBMGhrMkMxWWk1cEx5VklsQVE2OA==", "X-AppGlu-Environment": "staging"},
		data: JSON.stringify({"params":parameters})
	}).done(function(response) {
		window[callbackFunction](response["rows"]);
	}).fail(function() {
		window[callbackFunction]("error");
	});
}

//LOCAL STORAGE FUCNTIONS
function localSave(key, value){
	if(typeof(Storage) !== "undefined") {
		 sessionStorage[key] = value;
	} else {
		console.log("No web storage support")
	}
}

function localRetrieve(key){
	if(typeof(Storage) !== "undefined") {
		return sessionStorage[key];
	} else {
		return false;
		console.log("No web storage support")
	}
}

//MAPS
var gMarker, geocoder, map;
function initializeGMaps() {
	geocoder = new google.maps.Geocoder();
	var mapOptions = {
		center: { lat: -27.5964798, lng: -48.5204894},
		zoom: 17
	};
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			map.setCenter(initialLocation);
		});
	}

	google.maps.event.addListener(map, 'click', function(event) {
		if(gMarker)
			gMarker.setMap(null);
		gMarker = new google.maps.Marker({position: event.latLng, map: map, draggable:true, animation: google.maps.Animation.DROP});
		google.maps.event.addListener(gMarker, 'dragend', codeLatLng);
		codeLatLng();
	});

}

function codeLatLng() { //latlong to street name
	$("#map-canvas").popover('hide')
	if(gMarker){
		geocoder.geocode({'latLng': gMarker.position}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[0]) { //loop trough address_components until find type route
					var component;
					for (var i = results[0]["address_components"].length - 1; i >= 0; i--) {
						component = results[0]["address_components"][i];
						if(component.types[0] == "route"){
							$("#street-input").val(component.long_name);
							$(".input-group").addClass("has-success");
							$("#street-input").focus();
							break;
						}
					};
				}
			} else {
				alert("Geocoder failed due to: " + status);
			}
		});
	}
}

$(document).ready(function() {

	//get ride id in details page
	var pathname = window.location.pathname;
	var detailPath = "/details/";
	if(pathname.indexOf(detailPath) > -1){ //details page
		//get the id after /details/
		getDetails(pathname.substring(pathname.indexOf(detailPath)+detailPath.length, pathname.length));
	} else if(pathname == "/" && $('#street-input').val() !== ""){
		var searchResult = localRetrieve("searchResult");
		if(searchResult){
			searchAppendOutput(searchResult);
		}
	}

	$("#street-input").keyup(function(event){
		if(event.keyCode == 13){
			$("#search-btn").click();
		}
	});

	$("#maps-link").click(function(){
		$(".maps-row").removeClass("hidden");
		$(".map-link-row").addClass("hidden");
		google.maps.event.trigger(map, "resize");
		$("#map-canvas").popover('show')
		return false;
	});

	//initializeGMaps
	google.maps.event.addDomListener(window, 'load', initializeGMaps);

});
