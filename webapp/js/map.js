var heatmapData = [
		            {
		            	name: "dn.se",
						ip: "216.206.30.40",
						country: "US",
						city: "Dallas",
						location: new google.maps.LatLng(32.780140,-96.800451),
						timestamp: 1000,
						weight:1,
						path:[]
		            
		            },
		            {
		            	name:"imgur.com",
		            	ip: "23.23.110.58",
		            	country: "US",
		            	city: "Ashburn",
		            	location: new google.maps.LatLng(39.0436,-77.4878),
		            	timestamp: 1800,
		            	weight:1,
		            	path:[
		            	      {
		            	    	  ip:"130.229.136.246",
		            	    	  country: "SV",
		            	    	  city:"Stockholm",
		            	    	  location: new google.maps.LatLng(	59.3333,18.05),
		            	    	  weight:1
		            	      },
		            	      {
		            	    	  ip:"130.229.128.3",
		            	    	  country:"SV",
		            	    	  city:"Stockholm",
		            	    	  location: new google.maps.LatLng(59.3667,17.9667),
		            	    	  weight:1
		            	      },
		            	      {
		            	    	  ip:"130.237.211.102",
		            	    	  country:"SV",
		            	    	  city:"Stockholm",
		            	    	  location: new google.maps.LatLng(	59.33,18.05),
		            	    	  weight:1
		            	      },
		            	      {
		            	    	  ip:"130.237.211.118",
		            	    	  country:"SV",
		            	    	  city:"Stockholm",
		            	    	  location: new google.maps.LatLng(59.33,18.05),
		            	    	  weight:1
		            	      },
		            	      {
		            	    	  ip:"130.242.84.71",
		            	    	  country:"SV",
		            	    	  city:"Göteborg",
		            	    	  location: new google.maps.LatLng(62.0,15.0),
		            	    	  weight:1
		            	      },
		            	      {
		            	    	  ip:"109.105.96.2",
		            	    	  country:"SV",
		            	    	  city:"Stockholm",
		            	    	  location: new google.maps.LatLng(59.33,18.05),
		            	    	  weight:1
		            	      },
		            	      {
		            	    	  ip:"72.21.221.60",
		            	    	  country:"US",
		            	    	  city:"Seattle",
		            	    	  location: new google.maps.LatLng(47.6103,-122.3341),
		            	    	  weight:1
		            	      },
		            	      {
		            	    	  ip:"205.251.245.11",
		            	    	  country:"US",
		            	    	  city:"Seattle",
		            	    	  location: new google.maps.LatLng(47.6103,-122.3341),
		            	    	  weight:1
		            	      }
		            	      
		            	      
		            	      ]
		            },
		            {
		            	name: "outlook.com",
		            	ip: "157.56.253.86",
		            	country:"US",
		            	city:"Redmond",
		            	location: new google.maps.LatLng(47.6742,-122.1206),
		            	timestamp: 1900,
		            	weight:1,
		            	path:[]
		            },
		            {
		            	name: "aftonbladet.se",
						ip: "144.63.250.5",
						country: "SV",
						city: "Stockholm",
						location: new google.maps.LatLng( 59.3333 , 18.05 ),
						timestamp: 2000,
						weight:1,
						path:[]
		            },
		            {
		            	name: "expressen.se",
						ip: "66.171.224.114",
						country: "US",
						city: "Cambridge",
						location: new google.maps.LatLng( 42.3626 , -71.0843 ),
						timestamp: 5000,
						weight:1,
						path:[]
		            },
		            {
		            	name: "svd.se",
						ip: "144.63.252.10",
						country: "SV",
						city: "Stockholm",
						location: new google.maps.LatLng( 59.3333 , 18.05 ),
						timestamp: 5500,
						weight:1,
						path:[]
		            },
		            {
		            	name: "kth.se",
						ip: "130.237.32.143",
						country: "SV",
						city: "Stockholm",
						location: new google.maps.LatLng(59.3,17.9667),
						timestamp: 7000,
						weight:1,
						path:
							[
								{
									ip: "94.255.168.1",
									country: "SV",
									city: "Stockholm",
									location: new google.maps.LatLng( 59.3333 , 18.05 ),
									weight:1
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
									location: new google.maps.LatLng( 55.7 , 13.1833 ),
									weight:1
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
									location: new google.maps.LatLng( 59.3333 , 18.05 ),
									weight:1
								},
								{
									ip: "130.237.211.117",
									country: "SV",
									city: "Stockholm",
									location: new google.maps.LatLng( 62 , 15 ),
									weight:1
								}
							]
		            }
					
];

var mapStyle = [
                {
                  "featureType": "water",
                  "elementType": "geometry.fill",
                  "stylers": [
                    { "saturation": -78 },
                    { "lightness": -31 },
                    { "gamma": 0.54 }
                  ]
                },{
                  "featureType": "landscape",
                  "stylers": [
                    { "saturation": -78 },
                    { "lightness": -31 },
                    { "gamma": 0.54 }
                  ]
                },{
                  "elementType": "labels",
                  "stylers": [
                    { "visibility": "off" }
                  ]
                },{
                  "featureType": "administrative.country",
                  "elementType": "labels",
                  "stylers": [
                    { "visibility": "on" }
                  ]
                },{
                	"featureType":"administrative.country",
                	"elementType":"geometry",
                	"stylers":[
                	{
                		"weight":0.5,
                		"color":"#000000"
                	}]
                },{
                	"featureType":"administrative",
                	"elementType":"labels.text.stroke",
                	"stylers": [
                	  {"visibility":"off"}
                	 ]
                },{
                	"featureType":"administrative",
                	"elementType":"labels.text.fill",
                	"stylers":[
                	  {
                		  "color":"#FFFFFF",
                		  "weight":0.1
                	  }
                	 ]
                },{
                  "featureType": "landscape.man_made",
                  "stylers": [
                    { "visibility": "off" }
                  ]
                },{
                  "featureType": "road",
                  "stylers": [
                    { "visibility": "off" }
                  ]
                },{
                	"featureType": "transit",
                	"stylers": [
                	{ "visibility": "off"}
                  ]
                },{
                  "featureType": "poi",
                  "stylers": [
                    { "visibility": "off" }
                  ]
                },{
                  "featureType": "administrative.country",
                  "elementType": "labels.text.fill"  
                },{
                    "featureType": "landscape",
                    "elementType": "geometry",
                    "stylers": [
                      { "color": "#403ea2" },
                      { "saturation": -32 },
                      { "lightness": -64 }
                    ]
                  }
               ];


// FUNKAR INTE 
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
	});
	

}

function draw_paths(map,dest, heatmapArray) {
				var prev_node = dest.path[0];
				var strokeColor = "green";
				for (var i = 1; i < dest.path.length; i++) {
					var node = dest.path[i];
					if (node.location) {
						heatmapArray.push(node); // Kan kommenteras bort om man inte vill ha noder i heatmapen 
						// random_coord används för att förskjuta linjerna lite slumpmässigt för att få till "tjockare linjer" :)
						var random_coord = Math.random()*0.01-0.005;
						var prev_loc = new google.maps.LatLng(prev_node.location.lat()+random_coord,prev_node.location.lng()+random_coord);
						var loc = new google.maps.LatLng(node.location.lat()+random_coord,node.location.lng()+random_coord);
						var line = new google.maps.Polyline({
							map : map,
							geodesic : true,
							strokeOpacity : 0.4,
							strokeWeight: 1, 
							strokeColor : strokeColor,
							path : [ prev_loc,loc ]
						});
						prev_node = node;
						strokeColor = "green";
					} else {
						strokeColor = "red";
					}	
				}
}

// Funkar inte riktigt.
function filter(data,timerange)
{
	console.log("length: "+data.length);
	console.log("timerange: " +timerange);
	var i=0;
	for (i;i<data.length;i++)
	{	
		console.log("i:" + i);
		if (data[i].timestamp>=timerange[0]) break;
	}
	var j=data.length-1;
	for (j;j==0;j--)
	{
		console.log("j:" + j);
		if (data[j].timestamp<=timerange[1]) break;
	}
	console.log(i,j);
	return data.splice(i,j);
}

function draw(map,data,playbackSpeedFactor)
{
	var heatmapArray = new google.maps.MVCArray();
	var heatmap = new google.maps.visualization.HeatmapLayer({
		data : heatmapArray,
		opacity : 0.8,
		map : map
	});
	
	var i = 0;
	var timediff=0;
	function setChangingTimeout()
	{
		if(i!=0) 
		{
			timediff=data[i].timestamp-data[i-1].timestamp;
		} 
		setTimeout(function(){
			heatmapArray.push(data[i]);
			draw_paths(map,data[i],heatmapArray);
			i++;
			if(i<data.length)
			{
				setChangingTimeout();
			}
		},timediff/playbackSpeedFactor);
	}
	setChangingTimeout();
	
}

function initialize() {

	var mapOptions = {
		center : new google.maps.LatLng(59.325803,18.071507),
		styles: mapStyle,
		zoom : 2,
		disableDefaultUI: true,
		minZoom: 2,
		maxZoom:10
	};
	
	
	var playbackSpeedFactor = 0.1; // 0 -> visar allt direkt, ger dock error
	var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	
	var mintime = heatmapData[0].timestamp;
	var maxtime = heatmapData[heatmapData.length-1].timestamp; 
	var timerange = [mintime,maxtime];
	
	var range = $("#slider").slider({
		range:true,
		min: mintime, 
		max: maxtime,
		values:timerange,
	});
	range.width($(window).width()*0.8).position({
		my:"center center",
		at:"center bottom-50",
		of: window
	});
	/*range.slider({
		change:function(event,ui) {
			var data = filter(heatmapData,ui.values); // funkar inte riktigt
			console.log(data.length);
			draw(map,data,playbackSpeedFactor)
		}
	})*/
	
	draw(map,heatmapData,playbackSpeedFactor);

	
	// FUNKAR INTE
	//navigator.geolocation.getCurrentPosition(center_map);

	//set_markers(map, heatmapData);
	//draw_paths(map, heatmapArray);
};