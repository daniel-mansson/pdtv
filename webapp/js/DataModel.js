function DataModel() {
	this.listeners = [];
	this.data = {
			info:"nothing",
			data:[
			]
	};
}

//Internal
DataModel.prototype.notify = function() {
	var model = this;
	this.listeners.forEach(function(l) {
		l.update(model);
	});
}

//Internal
DataModel.prototype.requestCallback = function(result, data) {
	if(result == true) {
		this.setData(data);
	}
}

DataModel.prototype.setData = function(data) {
	this.data = data;
	this.notify();
}

DataModel.prototype.addListener = function(l) {
	this.listeners.push(l);
}

DataModel.prototype.requestAllFromDB = function() {
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
}

DataModel.prototype.requestRangeFromDB = function(min,max) {
	var model = this;
	
	$.ajax({
	    type: "GET",
	    url: "test",
	    contentType: "application/json; charset=utf-8",
	    dataType: "json",
	    data: {
                min: min,
                max: max,
        },    
	    success: function(data) {
	    	model.requestCallback(true, data);
	    },
	    failure: function(errMsg) {
	    	model.requestCallback(false, errMsg);
	    }
	});
}
