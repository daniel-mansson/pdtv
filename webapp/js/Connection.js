var Connection = function(host, model) {
	
	this.model = model;
	this.status = "Connecting"; 
	console.log(this.status);
	this.socket = new WebSocket(host);
	
	var self = this;
	
    this.socket.onmessage = function(event) {
    	self.model.onRealtimeData(event.data);
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