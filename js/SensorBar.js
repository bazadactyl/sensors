function createSensorBar(config) {
	// set chart settings
	var barPadding = 0.9; // 90% bar, 10% padding
	// var tickFormat = d3.format("d");
	var minDotRadius = 3.0;
	var maxDotRadius = 5.0;

	// set animation settings
	var duration = 800;

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
	var width = document.getElementById(config.chartid).offsetWidth - margin.left - margin.right;
	var height = document.getElementById(config.chartid).offsetHeight - margin.top - margin.bottom;
	width = 600;
	height = 600;

	// set X-scale
	var x = d3.scaleLinear()
		.range([0, width]);

	// set Y-scale
	var y = d3.scaleLinear()
		.rangeRound([height, 0]);

	// create X-axis
	var xAxis = d3.axisBottom(x);

	// create Y-axis
	var yAxis = d3.axisLeft(y);

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

	// draw chart title
	chart.append('text')
		.attr('class', 'chart-title')
		.text(config.chartTitle || 'My Beautiful Chart');

	// add tooltips to the chart
	chart.call(tip);

	// draw the X-axis on the bottom of the chart
	chart.append("g")
		.attr("class", "x axis");

	// draw the Y-axis on the left of the chart (with a label)
	chart.append("g")
		.attr("class", "y axis")
	  .append("text")
		.attr('class', 'label');

	var update = function(data) {

		// update dimensions for the chart container in the DOM
		width = document.getElementById(config.chartid).offsetWidth - margin.left - margin.right;
		height = document.getElementById(config.chartid).offsetHeight - margin.top - margin.bottom;

		// update chart size based changes to size of browser window
		d3.select('#' + config.chartid + ' svg')
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom);

		// deep copy the data array
		var originalData = JSON.parse(JSON.stringify(data));

		// sensor radius size
		var sensorRadius = 5

		// update the color scale
		// color.domain(d3.keys(data[0]).filter(function(key) {
		//     return key !== "date";
		// }));

		// add information used for binding and visualizing the data
		// data.forEach(function(datapoint) {
		//     datapoint.keys = color.domain().filter(function(key) {
		//         if (hidden.indexOf(key) > -1) return false;
		//         else return true;
		//     }).map(function(key) {
		//         return {
		//             date: datapoint.date,
		//             key: key,
		//             y: datapoint[key]
		//         };
		//     });
		// });

		// update scale domains based on the data
		// x.domain(d3.extent(data, function(d) { return d.xpos; }));
		x.domain([0, 1]);
		y.domain([0, 0]);

		// calculate width of each bar on the chart
		var extraDays = 2; // compensate for the extra days added in the X domain
		var barWidth = (width / (data.length + extraDays)) * barPadding;

		// update scales (this allows for chart resizing when the window is resized)
		x.range([0, width]);
		y.rangeRound([height, 0]);

		// decide on how many ticks to place on x-axis based data size
		// if (dates.length < 12) {
		//     xAxis.ticks(d3.time.day, 1); // ticks for each day
		//     xAxis.tickFormat(d3.time.format('%a %-d'));
		// } else if (dates.length < 150) {
		//     xAxis.ticks(d3.time.sunday, 1); // ticks only for sundays
		//     xAxis.tickFormat(d3.time.format('%m/%d'));
		// } else {
		//     xAxis.ticks(d3.time.month, 1); // ticks only for 1st of every month
		//     xAxis.tickFormat(d3.time.format('%b'));
		// }

		// update chart title
		chart.select('.chart-title')
			.attr('transform', 'translate(' + (width / 2) + ',' + (margin.top / -2.25) + ')');

		// update x-axis
		chart.select(".x.axis")
			.transition()
			.duration(duration)
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

		// update y-axis
		chart.select(".y.axis")
			.transition()
			.duration(duration)
			.call(yAxis);

		// update y-axis label
		// FIXME This will never change across updates
		chart.select(".y.axis .label")
			// .attr('transform', d3.transform('translate(' + (-margin.left + 18) + ',' + height / 2 + ') rotate(-90)').toString())
			.text(config.yAxisLabel);

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
			.attr('cy', function(d) { return y(d.y); })
			.attr('r',  function(d) { return x(d.radius); });

		sensors.selectAll(".dot")
			.data(data, function(d) { return d.id; })
		  .transition()
			.duration(duration)
			.attr('cx', function(d) { return x(d.x); })
			.attr('cy', function(d) { console.log("UPDATE DOT" + " " + d.id); return y(d.y); })
			.attr('r',  function(d) { return 5; });

		// ENTER new elements present in the data
		sensors.enter().append("g")
			.attr('class', 'sensor new');

		chart.selectAll(".sensor.new").append('circle')
			.attr('class', 'radius')
			.attr("cx", function(d) { return x(d.x); })
			.attr("cy", function(d) { return y(d.y); })
			.attr("r",  function(d) { return x(d.radius); })
			.style('fill', "red")
			.style("opacity", 0.3);

		chart.selectAll(".sensor.new").append('circle')
			.attr('class', 'dot')
			.attr("cx", function(d) { return x(d.x); })
			.attr("cy", function(d) { console.log("ENTER DOT" + " " + d.id); return y(d.y); })
			.attr("r",  function(d) { return 5; })
			.style('fill', "steelblue")
			.style("opacity", 1.0);

		/**********************
		 * INTERACTIVITY HERE *
		 **********************/

	}

	return update;
}
