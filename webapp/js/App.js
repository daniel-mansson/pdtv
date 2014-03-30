var App = function() {
	
	this.model = new DataModel();
	
	this.renderer = new Renderer();
	
	
	this.map = new Map();
	this.model.addListener(this.map);
	this.model.addRealtimeListener(this.map);
	this.renderer.addFrameListener(this.map);

	this.ballManager = new BallManager(this.renderer, this.map);
	this.map.ballManager = this.ballManager;
	
	this.pieChart = new Pie();
	this.model.addRealtimeListener(this.pieChart);

	this.barChart = new BarChart(this.map.color);
	this.model.addRealtimeListener(this.barChart);
	
	this.connection = new Connection("ws://localhost:8080/realtime", this.model);
	
};

