function init_map() {

	var mapStyle = [ {
		"featureType" : "water",
		"elementType" : "geometry.fill",
		"stylers" : [ {
			"saturation" : -78
		}, {
			"lightness" : -31
		}, {
			"gamma" : 0.54
		} ]
	}, {
		"featureType" : "landscape",
		"stylers" : [ {
			"saturation" : -78
		}, {
			"lightness" : -31
		}, {
			"gamma" : 0.54
		} ]
	}, {
		"elementType" : "labels",
		"stylers" : [ {
			"visibility" : "off"
		} ]
	}, {
		"featureType" : "administrative.country",
		"elementType" : "labels",
		"stylers" : [ {
			"visibility" : "on"
		} ]
	}, {
		"featureType" : "landscape.man_made",
		"stylers" : [ {
			"visibility" : "off"
		} ]
	}, {
		"featureType" : "road",
		"stylers" : [ {
			"visibility" : "off"
		} ]
	}, {
		"featureType" : "transit",
		"stylers" : [ {
			"visibility" : "off"
		} ]
	}, {
		"featureType" : "poi",
		"stylers" : [ {
			"visibility" : "off"
		} ]
	}, {
		"featureType" : "administrative.country",
		"elementType" : "labels.text.stroke",
		"stylers":	[ {
			"visibility" : "off"
		} ]
	}, {
		"featureType" : "administrative.country",
		"elementType" : "labels.text.fill",
		"stylers":	[ {
			"color" : "#FFFFFF"
		} ]
	}, {
		"featureType" : "landscape",
		"elementType" : "geometry",
		"stylers" : [ {
			"color" : "#403ea2"
		}, {
			"saturation" : -32
		}, {
			"lightness" : -64
		} ]
	} ];

	var mapOptions = {
		center : new google.maps.LatLng(59.325803, 18.071507),
		styles : mapStyle,
		zoom : 2,
		disableDefaultUI : true,
		minZoom : 2,
		maxZoom : 10
	};

	var map = new google.maps.Map(document.getElementById("map-canvas"),
			mapOptions);

	return map;
}