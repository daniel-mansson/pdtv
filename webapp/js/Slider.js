function Slider(model) {
	this.model = model;
	this.model.addListener(this);

	this.update(this.model);
}

Slider.prototype.update = function(model) {
	if(model.data.data.length == 0)
		return;
	
	//TODO: make sure this actually works. Everything might not need to be updated when the model changes.
	console.log(model.data.data[0].Time); // Date String 
	var mintime = Date.parse(model.data.data[0].Time); // Time String
	var maxtime = Date.parse(model.data.data[model.data.data.length - 1].Time); 
	var timerange = [mintime,maxtime];
	console.log(mintime);
	
	this.range = $("#slider").slider({
		range:true,
		min: mintime, 
		max: maxtime,
		values:timerange,
	});
	this.range.width($(window).width()*0.8).position({
		my:"center center",
		at:"center bottom-50",
		of: window
	});
	
	var model = this.model;
	this.range.slider({
		change:function(event,ui) {
			d_to=new Date(ui.values[0]);
			d_from = new Date(ui.values[1]);
			model.requestRangeFromDB(d_from.getTime(),d_to.getTime());
		}
	});	 
};