function Slider(model) {
	this.model = model;
	this.model.addListener(this);

	//this.update(this.model);
	
	this.minTime = Date.parse("2014-01-01");
	this.maxTime = new Date().getTime();
	this.rangeSlider = $("#slider").slider({
		range:true,
		min: this.minTime,
		max: this.maxTime,
		values: [this.minTime,this.maxTime]
	});
	this.rangeSlider.width($(window).width()*0.8).position({
		my:"center center",
		at:"center bottom-50",
		of: window
	});
}

Slider.prototype.update = function(model) {
	console.log("Slider.prototype.update");
	if(model.data.data.length == 0)
		return;
	
	//TODO: make sure this actually works. Everything might not need to be updated when the model changes.
	 
	var model = this.model;
	this.rangeSlider.slider({
		change:function(event,input) {
			console.log("Slider change");
			var d_min=new Date(input.values[0]).toISOString().substring(0, 21).replace('T', ' ');
			var d_max=new Date(input.values[1]).toISOString().substring(0, 21).replace('T', ' ');
			console.log("Min: "+d_min+" Max: "+d_max);
			model.requestRangeFromDB(d_min,d_max);
		}
	});	 
};