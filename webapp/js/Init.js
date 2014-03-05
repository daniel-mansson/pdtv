
function initialize() {
	var map = init_map();
	var model = new DataModel();
	
	model.requestAllFromDB();
	
	var overlay = new MapOverlay(map, model);
	var slider = new Slider(model);
	var filter = new Filter(model);
};

