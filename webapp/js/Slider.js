function Slider(model) {
	this.model = model;
	this.model.addListener(this);

	this.update(this.model);
}

Slider.prototype.update = function(model) {
	if(model.data.data.length == 0)
		return;
	
	//TODO: make sure this actually works. Everything might not need to be updated when the model changes.
	
	var mintime = model.data.data[0].time;
	var maxtime = model.data.data[model.data.data.length - 1].time; 
	var timerange = [mintime,maxtime];
	
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
			//TODO: Change to requestRangeFromDB(from, to), when it exists.
			model.requestAllFromDB();
		}
	});	
}