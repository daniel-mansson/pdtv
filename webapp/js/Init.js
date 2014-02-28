
function initialize() {
	var map = init_map();
	var model = new DataModel();
	
	var overlay = new MapOverlay(map, model);
	var slider = new Slider(model);
	
	model.requestAllFromDB();
};

