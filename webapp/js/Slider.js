function Slider(model) {
	this.model = model;
	this.model.addListener(this);

	//this.update(this.model);
	
	this.minTime = Date.parse("2014-01-20");
	this.maxTime = new Date().getTime();
	this.rangeSlider = $("#slider").slider({
		range:true,
		min: this.minTime,
		max: this.maxTime,
		values: [this.minTime,this.maxTime]
	});
	$("#sliderContainer").width($(window).width()*0.85).height(60).position({
		my:"center bottom",
		at:"center bottom-10",
		of: window
	});
	this.rangeSlider.width($(window).width()*0.8).position({
		my:"center center",
		at:"center bottom-30",
		of: "#sliderContainer"
	});
	$('#min').html("2014-01-20").position({
	    my: 'center bottom',
	    at: 'center top',
	    of: $('#slider a:eq(0)'),
	    offset: "0, 10"
	});

	$('#max').html(new Date(this.rangeSlider.slider('values', 1)).toISOString().substring(0, 10)).position({
	    my: 'center top',
	    at: 'center bottom',
	    of: $('#slider a:eq(1)'),
	    offset: "0, 10"
	});
}

Slider.prototype.update = function(model) {
	console.log("Slider.prototype.update");
	console.log("Rows: "+model.data.data.length);
	if(model.data.data.length == 0)
		return;
	
	
	this.rangeSlider.slider({
		slide:function(event,ui) {
	        var delay = function() {
	            var handleIndex = $(ui.handle).data('uiSliderHandleIndex');
	            var date= new Date(ui.values[handleIndex]).toISOString().substring(0, 10);
	            var label = handleIndex == 0 ? '#min' : '#max';
	            var myPos = handleIndex == 0 ? 'center bottom' : 'center top';
	            var atPos = handleIndex == 0 ? 'center top' : 'center bottom';
	            $(label).html(date).position({
	                my: myPos,
	                at: atPos,
	                of: ui.handle,
	                offset: "0, 10"
	            });
	        };

	        // wait for the ui.handle to set its position
	        setTimeout(delay, 5);
		}
	});
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