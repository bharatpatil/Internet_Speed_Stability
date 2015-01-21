var express = require("express");
var mongoose = require("mongoose");
var cors = require("cors");
var bodyParser = require('body-parser');
var path = require('path');

mongoose.connect('mongodb://<SERVER IP>/mydb')

var dataSchema = {
    code:String,
	ip :String,
	review:String,
	host:String,
	google:String,
	date:Date,
	gmail:String
}

var Data = mongoose.model('Data', dataSchema, 'internetdata')

var app = express();
app.use( bodyParser.json(), cors(), express.static(__dirname + '/ChartPlottingApp') );

app.get('/data', function (req, res) {
    Data.find({}).sort({date: 'desc'}).exec(function (err, doc) {
        res.send(doc);
    })
})

app.get('/chartDataLastHour', function (req, res) {
    Data.find({date: {$gt: new Date((new Date())-1000*1*60*60)}}).sort({date: 'asc'}).exec(function (err, doc) {
        res.send(doc);
    })
})

app.post('/hostData', function (req, res) {
	var jsonData = req.body;
	var host =jsonData.host;
	var duration = jsonData.time;

	if (duration === "1") {
		if (host === "ALL") {
			Data.where('date').gt(new Date((new Date())-1000*1*60*60)).exec(function (err, doc) {
	        	res.send(doc);
	    	})	
		} else {
			Data.where('host').in([host]).where('date').gt(new Date((new Date())-1000*1*60*60)).exec(function (err, doc) {
		        res.send(doc);
		    })	
		}		
	} else if (duration === "2") {
		if (host === "ALL") {
			Data.where('date').gt(new Date(new Date().getFullYear()+'/'+(new Date().getMonth()+1)+'/'+ new Date().getDate())).exec(function (err, doc) {
	        	res.send(doc);
	    	})	
		} else {
			Data.where('host').in([host]).where('date').gt(new Date(new Date().getFullYear()+'/'+(new Date().getMonth()+1)+'/'+ new Date().getDate())).exec(function (err, doc) {
	        	res.send(doc);
	    	})
		}	
	} else if (duration === "3") {
		if (host === "ALL") {
			Data.where('date').gt(new Date((new Date())-1000*3*24*60*60)).exec(function (err, doc) {
		        res.send(doc);
		    })	
		} else {
			Data.where('host').in([host]).where('date').gt(new Date((new Date())-1000*3*24*60*60)).exec(function (err, doc) {
		        res.send(doc);
		    })
		}
	} else if (duration === "4") {
		if (host === "ALL") {
			Data.where('date').gt(new Date((new Date())-1000*7*24*60*60)).exec(function (err, doc) {
		        res.send(doc);
		    })	
		} else {
			Data.where('host').in([host]).where('date').gt(new Date((new Date())-1000*7*24*60*60)).exec(function (err, doc) {
		        res.send(doc);
		    })
		}
	} else if (duration === "5") {
		if (host === "ALL") {
			Data.where('date').gt(new Date((new Date())-1000*30*24*60*60)).exec(function (err, doc) {
		        res.send(doc);
		    })	
		} else {
			Data.where('host').in([host]).where('date').gt(new Date((new Date())-1000*30*24*60*60)).exec(function (err, doc) {
		        res.send(doc);
		    })
		}
	} else if (duration === "6") {
		if (host === "ALL") {
			Data.where('date').gt(new Date((new Date())-1000*60*24*60*60)).exec(function (err, doc) {
		        res.send(doc);
		    })		
		} else {
			Data.where('host').in([host]).where('date').gt(new Date((new Date())-1000*60*24*60*60)).exec(function (err, doc) {
		        res.send(doc);
		    })
		}
	} else if (duration === "7") {
		if (host === "ALL") {
			Data.where('date').gt(new Date((new Date())-1000*90*24*60*60)).exec(function (err, doc) {
		        res.send(doc);
		    })	
		} else {
			Data.where('host').in([host]).where('date').gt(new Date((new Date())-1000*90*24*60*60)).exec(function (err, doc) {
		        res.send(doc);
		    })
		}
	}
})

app.listen(3000);