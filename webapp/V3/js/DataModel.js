function DataModel() {
	this.listeners = [];
	this.data = {
			info:"nothing",
			data:[
			]
	};
	
	this.minDate=new Date().toISOString().substring(0, 21).replace('T', ' ');
	this.maxDate="";
	this.protocols = [1,2,3,4];
	
	var model = this;
	setInterval(function(){
		model.requestRangeFromDB();
	}, 3000);
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
DataModel.prototype.requestCallback = function(result, data) {
	this.minDate = this.maxDate;
	if(result == true) {
		this.setData(data);
	}
};

DataModel.prototype.setData = function(data) {
	//console.log("DataModel.prototype.setData");
	this.data = data;
	this.notify();
};

DataModel.prototype.addListener = function(l) {
	this.listeners.push(l);
};

DataModel.prototype.requestRangeFromDB = function() {
	//console.log("DataModel.prototype.requestRangeFromDB");
	this.maxDate = new Date(new Date() - 10000+3600000).toISOString().substring(0, 21).replace('T', ' ');
	var model = this;
	//console.log("minDate: "+model.minDate+" maxDate: "+model.maxDate+" procotols: "+model.protocols);
	
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
