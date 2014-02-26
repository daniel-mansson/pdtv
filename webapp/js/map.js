var heatmapData = [
		            {
		            	name: "dn.se",
						ip: "216.206.30.40",
						country: "US",
						city: "Dallas",
						location: new google.maps.LatLng(32.780140,-96.800451),
						weight:1,
						path:[]
		            
		            },
		            {
		            	name: "aftonbladet.se",
						ip: "144.63.250.5",
						country: "SV",
						city: "Stockholm",
						location: new google.maps.LatLng( 59.3333 , 18.05 ),
						weight:1,
						path:[]
		            },
		            {
		            	name: "expressen.se",
						ip: "66.171.224.114",
						country: "US",
						city: "Cambridge",
						location: new google.maps.LatLng( 42.3626 , -71.0843 ),
						weight:1,
						path:[]
		            },
		            {
		            	name: "svd.se",
						ip: "144.63.252.10",
						country: "SV",
						city: "Stockholm",
						location: new google.maps.LatLng( 59.3333 , 18.05 ),
						weight:1,
						path:[]
		            },
		            {
		            	name: "kth.se",
						ip: "130.237.32.143",
						country: "SV",
						city: "Stockholm",
						location: new google.maps.LatLng(59.3,17.9667),
						weight:1,
						path:
							[
								{
									ip: "94.255.168.1",
									country: "SV",
									city: "Stockholm",
									location: new google.maps.LatLng( 59.3333 , 18.05 )
								},
								{
									ip: "172.16.208.13",
								},
								{
									ip: "172.16.208.9",
								},
								{
									ip: "172.16.208.21",
								},
								{
									ip: "host-62-116-228-113.rivermen.se",
								},
								{
									ip: "82.209.170.73",
									country: "SV",
									city: "Lund",
									location: new google.maps.LatLng( 55.7 , 13.1833 )
								},
								{
									ip: "cr-se-sto-tc-1-be1.bredband2.net"
								},
								{
									ip: "netnod-ix-ge-a-sth.sunet.se"
								},
								{
									ip: "m1fre-ae1-v1.sunet.se"	
								},
								{
									ip: "ls-kth-br1.sunet.se"
								},
								{
									ip: "130.237.0.2",
									country: "SV",
									city: "Stockholm",
									location: new google.maps.LatLng( 59.3333 , 18.05 )
								},
								{
									ip: "130.237.211.117",
									country: "SV",
									city: "Stockholm",
									location: new google.maps.LatLng( 62 , 15 )
								}
							]
		            }
					
];

function center_map(map, loc) {
	var lat = loc.coords.latitude;
	var lon = loc.coords.longitude;
	map.setCenter(new google.maps.LatLng(lat, lon));
}

function set_markers(map, data) {
	data.forEach(function(element) {
		marker = new google.maps.Marker({
			position : element.location,
			title : element.name,
			map : map
		})
	})

}

function draw_paths(map, data) {
	data.forEach(function(dest) {
		console.log(dest.name);
		prev_node = dest.path[0];
		var strokeColor = "green";
		for (var i = 1; i < dest.path.length; i++) {
			var node = dest.path[i];
			console.log(node.ip);
			if (node.location) {
				console.log(node.location.toString());
				var line = new google.maps.Polyline({
					map : map,
					geodesic : true,
					strokeOpacity : 0.5,
					strokeColor : strokeColor,
					path : [ prev_node.location, node.location ]
				});
				prev_node = node;
				strokeColor = "green";
			} else {
				strokeColor = "red";
			}
		}
	})
}

function initialize() {

	var mapOptions = {
		center : new google.maps.LatLng(-34.397, 150.644),
		zoom : 3
	};

	var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

	navigator.geolocation.getCurrentPosition(center_map);

	set_markers(map, heatmapData);
	draw_paths(map, heatmapData);

	var heatmap = new google.maps.visualization.HeatmapLayer({
		data : heatmapData,
		opacity : 0.8,
		map : map
	});
}