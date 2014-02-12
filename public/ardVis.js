d3.ardVis = function() {
	var vis = {},
		data = [],

		// parameters
		width = 1500,
		height = 720,

		seconds = 60;

	// initial setup
	var legend = d3.select("body").append("div").attr("id", "pin-labels");
	var time = d3.select("body").append("div").attr("id", "time-label").text("time");
	var chart = d3.select("body").append("div").attr("id", "vis")

	vis.addData = function(bucket) {
		if (data.length >= seconds) data.shift();
		data.push(bucket);
		vis.redraw();

		return vis;
	}

	vis.redraw = function() {
		// legend
		var pins = ["IA0~1023", "OD03~255"]

		var labels = legend.selectAll("div").data(pins);

		labels.enter().append("div")
			.attr("class", function(p) { return "pin-label " + p; })
			.style("height", height/pins.length + "px")
			.style("line-height", height/pins.length + "px")
			.text(function(p) { return "Pin " + p; });

		labels.exit().remove()

		// main vis + update
		var columns = chart.selectAll("div").data(data, function(d) { return d["time"]; })
			.style("width", width/data.length + "px")
			.style("height", height/pins.length + "px");

		// add new
		columns.enter().append("div")
			.attr("class", "data-column")
			.attr("id", function(d) { return d["time"]; })
			.style("width", width/data.length + "px")
			.style("height", height + "px")
			.selectAll("div").data(function (d) { return d; } ).enter().append("div")
				.attr("class", "data-box");

		// create box for each pin
		pins.forEach(function(p) {
			columns.append("div")
			.attr("class", "data-box " + p)
			.style("height", height/pins.length + "px")
			.style("width", width/data.length + "px")
			.style("opacity", function(d) { 
				var analog = p.indexOf("~");
				if (analog >= 0) {
					var max = parseInt(p.slice(analog+1));
					return d3.mean(d[p])/max;  // analog in/out pin
				}
				else return d3.mean(d[p]) // digital in/out pin
			});
		});

		columns.append("div")
			.attr("class", "time-box")
			.attr("width", width/data.length + "px")
			.style("-webkit-transform", "rotate(270deg)")
			.text(function(d) {
				var date = new Date(d["time"]);
				var hours = "";
				hours += (date.getHours()%12 == 0) ? 12 : date.getHours()%12;
				var minutes = date.getMinutes() < 10? "0" : "";
				minutes += date.getMinutes();
				var seconds = date.getSeconds() < 10? "0" : "";
				seconds += date.getSeconds();
				return hours + ":" + minutes + ":" + seconds;
			});
			

		columns.exit().remove();
	}

	return vis;
}