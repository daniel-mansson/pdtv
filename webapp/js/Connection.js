var Connection = function(host, model) {
	
	this.model = model;
	this.status = "Connecting"; 
	console.log(this.status);
	this.socket = new WebSocket(host);
	
	var self = this;
	
    this.socket.onmessage = function(event) {
    	
    	var data = JSON.parse(event.data);
    	
    	if(data === undefined) {
    		return;
    	}
    	
    	if(data.localIP !== undefined) {
    		self.model.localIP = data.localIP;
    	}
    	else {
    	   	self.model.onRealtimeData(data);
    	}
    };

    this.socket.onopen = function(event) {
    	self.status = "Connected";
    	console.log(self.status);
    };

    this.socket.onclose = function(event) {
    	self.status = "Closed";
    	console.log(self.status);
    };

};