function getAllData(callback) {
	
	$.ajax({
	    type: "GET",
	    url: "test",
	    contentType: "application/json; charset=utf-8",
	    dataType: "json",
	    success: function(data) {
	    	callback(true, data);
	    },
	    failure: function(errMsg) {
	    	callback(false, errMsg);
	    }
	});
	
}