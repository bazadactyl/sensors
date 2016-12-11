function createSensorBar(config) {
	// constants
	var duration = 800;
	var sensorRadius = 5

	// track hidden data
	var hidden = [];

	// set color scale, and map each key to a color
	var color = d3.scaleOrdinal()
		.range(config.colors);

	// set chart dimensions
	var margin = {
			top: 50,
			right: 30,
			bottom: 60,
			left: 55
		};
//	var width = document.getElementById(config.chartid).offsetWidth - margin.left - margin.right;
//	var height = document.getElementById(config.chartid).offsetHeight - margin.top - margin.bottom;
	width = 800;
	height = 400;

	// set X-scale
	var x = d3.scaleLinear().range([0, width]);
	var xAxis = d3.axisBottom(x);

	// configure the tooltip based on the data
	var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(datapoint) {
			return '<table><thead><tr><td colspan="3">' + dateFormat(new Date(datapoint.xpos)) +
				'</td></tr></thead><tbody><tr><td class="legend-color-guide"><div class="icon" style="background:' +
				color(datapoint.key) + ';"  ></div></td><td class="key">' + datapoint.key + '</td><td class="value">' +
				datapoint.y + '</td></tr></tbody></table>';
		});

	// add an svg element to contain the chart
	var chart = d3.select('#' + config.chartid)
	  .append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// add tooltips to the chart
	chart.call(tip);

	// draw the X-axis on the bottom of the chart
	chart.append("g")
		.attr("class", "x axis");

	var update = function(data) {

		// update dimensions for the chart container in the DOM
		// width = document.getElementById(config.chartid).offsetWidth - margin.left - margin.right;
		// height = document.getElementById(config.chartid).offsetHeight - margin.top - margin.bottom;

		// update chart size based changes to size of browser window
		d3.select('#' + config.chartid + ' svg')
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom);

		// update the color scale
		// color.domain(d3.keys(data[0]).filter(function(key) {
		//     return key !== "date";
		// }));

		// update scale domains based on the data
		// x.domain(d3.extent(data, function(d) { return d.xpos; }));
		x.domain([0, 1]);

		// update scales (this allows for chart resizing when the window is resized)
		x.range([0, width]);

		// update chart title
		chart.select('.chart-title')
			.attr('transform', 'translate(' + (width / 2) + ',' + (margin.top / -2.25) + ')');

		// update x-axis
		chart.select(".x.axis")
			.transition()
			.duration(duration)
			.attr("transform", "translate(0," + (height/2) + ")")
			.call(xAxis);

		// DATA JOIN
		var sensors = chart.selectAll(".sensor")
			.data(data, function(d) { return d.id; });

		// EXIT old elements not present in new data
		sensors.exit().attr("class", "sensor exit")
		  .transition()
			.duration(duration)
			.style("opacity", 0)
			.remove();

		// UPDATE old elements present in new data
		sensors.attr("class", "sensor update");

		sensors.selectAll(".radius")
			.data(data, function(d) { return d.id; })
		  .transition()
			.duration(duration)
			.attr("cx", function(d) { return x(d.x); })
			.attr('cy', function(d) { return (height/2); })
			.attr('r',  function(d) { return x(d.radius); });

		sensors.selectAll(".dot")
			.data(data, function(d) { return d.id; })
		  .transition()
			.duration(duration)
			.attr('cx', function(d) { return x(d.x); })
			.attr('cy', function(d) { console.log("UPDATE DOT" + " " + d.id); return (height/2); })
			.attr('r',  function(d) { return sensorRadius; });

		// ENTER new elements present in the data
		sensors.enter().append("g")
			.attr('class', 'sensor new');

		chart.selectAll(".sensor.new").append('circle')
			.attr('class', 'radius')
			.attr("cx", function(d) { return x(d.x); })
			.attr("cy", function(d) { return (height/2); })
			.attr("r",  function(d) { return x(d.radius); })
			.style('fill', "red")
			.style("opacity", 0.3);

		chart.selectAll(".sensor.new").append('circle')
			.attr('class', 'dot')
			.attr("cx", function(d) { return x(d.x); })
			.attr("cy", function(d) { console.log("ENTER DOT" + " " + d.id); return (height/2); })
			.attr("r",  function(d) { return sensorRadius; })
			.style('fill', "steelblue")
			.style("opacity", 1.0);

		// // refresh mouse event listeners
		// dot.on('mouseover', function(datapoint) {
		// 	d3.select(this)
		// 		.style("fill", d3.rgb(color(datapoint.key)).darker())
		// 	    .attr('r', dotRadius * 1.50);
		// 	return tip.show(datapoint);
		// }).on('mouseout', function(datapoint) {
		// 	d3.select(this)
		// 		.style("fill", color(datapoint.key))
		// 	    .attr('r', dotRadius);
		// 	return tip.hide(datapoint);
		// });
		//
		// // refresh mouse event listeners
		// dot.on('mouseover', function(datapoint) {
		// 	d3.select(this)
		// 		.style("fill", d3.rgb(color(datapoint.key)).darker())
		// 	    .attr('r', dotRadius * 1.50);
		// 	return tip.show(datapoint);
		// }).on('mouseout', function(datapoint) {
		// 	d3.select(this)
		// 		.style("fill", color(datapoint.key))
		// 	    .attr('r', dotRadius);
		// 	return tip.hide(datapoint);
		// });
	}

	return update;
}
