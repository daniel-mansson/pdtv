function DataModel() {
	this.listeners = [];
	this.realtimeListeners = [];
	this.data = {
			info:"nothing",
			data:[
			]
	};
	
	this.minDate=new Date().toISOString().substring(0, 21).replace('T', ' ');
	this.maxDate="";
	this.protocols = [1,2,3,4];
	this.nrOfPackets = [0,0,0,0,0,0,0,0,0,0];
	
	/*var model = this;
	setInterval(function(){
		model.requestRangeFromDB();
	}, 2000);*/
	/*
	setInterval(function(){
		var data = {data:[
			{
				from:{
					country: "SWE"
				},
				to:{
					country: "NOR"
				}
			}		
		]};
		model.requestCallback(true, data);
	}, 5000);*/
};

//Internal
DataModel.prototype.notify = function() {
	var model = this;
	this.listeners.forEach(function(l) {
		l.update(model);
	});
};

//Internal
DataModel.prototype.notifyRealtime = function(data) {
	this.realtimeListeners.forEach(function(l) {
		l.onRealtimeUpdate(data);
	});
};

//Internal
DataModel.prototype.requestCallback = function(result, data) {
	this.minDate = this.maxDate;
	if(result == true) {
		this.setData(data);
	}
};

DataModel.prototype.setData = function(data) {
	this.data = data;
	this.notify();
};

DataModel.prototype.onRealtimeData = function(data) {
	var parsedData = JSON.parse(data);
	if(parsedData !== undefined)
		this.notifyRealtime(parsedData);
};

DataModel.prototype.addListener = function(l) {
	this.listeners.push(l);
};

DataModel.prototype.addRealtimeListener = function(l) {
	this.realtimeListeners.push(l);
};

DataModel.prototype.requestRangeFromDB = function() {
	this.maxDate = new Date(new Date() - 3000+3600000).toISOString().substring(0, 21).replace('T', ' ');
	var model = this;
	
	$.ajax({
	    type: "GET",
	    url: "../test",
	    contentType: "application/json; charset=utf-8",
	    dataType: "json",
	    data: {
                min: model.minDate,
                max: model.maxDate,
                proto: model.protocols
        },    
	    success: function(data) {
	    	model.requestCallback(true, data);
	    },
	    failure: function(errMsg) {
	    	model.requestCallback(false, errMsg);
	    }
	});
};
