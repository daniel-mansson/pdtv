function Filter(model) {
	this.model = model;
	var model = this.model;
	
	/*this.filterContainer = $("#filterContainer");
	this.filterContainer.width(150).height($(window).height()*0.5).position({
		my:"right center",
		at:"right-10 center",
		of: window
	});
	var unknown = $("<input checked>").attr("type","checkbox").attr("value","0");
	var tcp = $("<input checked>").attr("type","checkbox").attr("value","1");
	var udp = $("<input checked>").attr("type","checkbox").attr("value","2");
	var icmp = $("<input checked>").attr("type","checkbox").attr("value","3");
	this.filterForm = $("#filterForm");
	this.filterForm.append(unknown,"Unknown </br>",tcp,"TCP </br>",udp,"UDP </br>",icmp,"ICMP </br>");
	*/	
	
	
	// SLIDER
	if (this.model.data.data[0]) { // Funkar ej
		this.minTime = Date.parse(model.data.data[0].Time.substring(0,10));
	} else	{
		this.minTime = Date.parse("2014-03-01");
	}
	this.maxTime = Date.parse(new Date().toISOString().substring(0, 10))+86400000;	
	var sliderContainer = $("#sliderContainer");
	var sliderTitle = $("#sliderTitle");
	sliderTitle.height(15).html("Filter by timestamp").position({
		my: "center bottom",
		at: "center top-30",
		of: "#slider"
	});
	
	sliderContainer.width($(window).width()*0.6).height(80).position({
		my:"center bottom",
		at:"center bottom-20",
		of: window
	}).append(sliderTitle);
	this.rangeSlider = $("#slider").slider({
		range:true,
		min: this.minTime,
		max: this.maxTime,
		values: [this.minTime,this.maxTime]/*,
		step: 86400000*/
	});
	this.rangeSlider.width($(window).width()*0.5).position({
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

	$('#max').html(new Date(this.rangeSlider.slider('values', 1)-86400000).toISOString().substring(0, 10)).position({
	    my: 'center top',
	    at: 'center bottom',
	    of: $('#slider a:eq(1)'),
	    offset: "0, 10"
	});

	this.rangeSlider.slider({
		slide:function(event,ui) {
	        var delay = function() {
	            var handleIndex = $(ui.handle).data('uiSliderHandleIndex');
	            var offset = handleIndex == 0 ? 0 : -1;
	            var date= new Date(ui.values[handleIndex]+offset).toISOString().substring(0, 10);
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
	        setTimeout(delay, 5);
		}
	});

	this.rangeSlider.slider({
		change:function(event,input) {	
			var d_min=new Date(input.values[0]).toISOString().substring(0, 21).replace('T', ' ');
			var d_max=new Date(input.values[1]-1).toISOString().substring(0, 21).replace('T', ' ');
			model.minDate = d_min;
			model.maxDate = d_max;
			model.requestRangeFromDB();
		}
	});
	
	this.filterForm.change(function(){
		var protocolArray = [];
		$("input:checked").each(function(){
			protocolArray.push($(this).val());
		});
		model.protocols = protocolArray;
		model.requestRangeFromDB();
	});
}
