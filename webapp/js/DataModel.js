function DataModel() {
	this.listeners = [];
	this.data = {
			info:"nothing",
			data:[
			]
	};
	this.minDate="2014-03-01 00:00:00.0";
	this.maxDate=new Date().toISOString().substring(0, 10)+86400000;
	this.protocols = [1,2,3,4];
	
	var model = this;
	setInterval(function(){
		model.requestRangeFromDB();
	}, 2000);
};

//Internal
DataModel.prototype.notify = function() {
	var model = this;
	this.listeners.forEach(function(l) {
		l.update(model);
	});
};

//Internal
DataModel.prototype.requestCallback = function(result, data) {
	if(result == true) {
		this.setData(data);
	}
};

DataModel.prototype.setData = function(data) {
	console.log("DataModel.prototype.setData");
	this.data = data;
	this.notify();
};

DataModel.prototype.addListener = function(l) {
	this.listeners.push(l);
};

DataModel.prototype.requestAllFromDB = function() {
	console.log("DataModel.prototype.requestAllFromDB");
	var model = this;
	$.ajax({
	    type: "GET",
	    url: "test",
	    contentType: "application/json; charset=utf-8",
	    dataType: "json",
	    success: function(data) {
	    	model.requestCallback(true, data);
	    },
	    failure: function(errMsg) {
	    	model.requestCallback(false, errMsg);
	    }
	});

};

DataModel.prototype.requestRangeFromDB = function() {
	console.log("DataModel.prototype.requestRangeFromDB");
	var model = this;
	console.log("minDate: "+model.minDate+" maxDate: "+model.maxDate+" procotols: "+model.protocols);

	$.ajax({
	    type: "GET",
	    url: "test",
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
