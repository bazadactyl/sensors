/**
 * SensorBar
 * ---------
 *
 * Provide the ability to create dynamic Sensor Bar elements.
 * Calling this function sets up the Sensor Bar and returns a
 * closure function that allows the user to update the Sensor
 * Bar they've created.
 *
 * @author Basim Ramadhan
 */

function createSensorBar(config) {
	// constants
	var duration = 400;

	// set chart dimensions
	var margin = { top: 50,	right: 30, bottom: 60, left: 55 };
	var width = 800;
	var height = 300;

	// set X-scale
	var x = d3.scaleLinear().range([0, width]);
	var xAxis = d3.axisBottom(x);

	// configure the tooltip based on the data
	var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(datapoint) {
			return '<table><thead><tr><td colspan="3">' + 'Sensor #' + datapoint.id +
				'</td></tr></thead><tbody><tr>' +
				'<td class="key">' + 'Radius ' + datapoint.radius.toFixed(5) + '</td></tr><tr><td class="value">' +
				'X-position ' + datapoint.x.toFixed(5) + '</td></tr></tbody></table>';
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

		// set sensor radius, making sure the sensor is always smaller than its radius
		var normalRadius = 8
		var scaledRadius = x(d3.min(data, function(d) { return d.radius; })) / 4;
		var sensorRadius = Math.min(normalRadius, scaledRadius);

		// update chart size based changes to size of browser window
		d3.select('#' + config.chartid + ' svg')
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom);

		// update scales
		x.domain([0, 1]);
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
			.attr('cy', function(d) { return (height/2); })
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
			.attr("cy", function(d) { return (height/2); })
			.attr("r",  function(d) { return sensorRadius; })
			.attr('stroke', 'black')
			.attr('stroke-width', 2)
			.style('fill', function(d) { return d3.interpolateViridis(d.id / data.length); })
			.style("opacity", 1.0);

		// refresh mouse event listeners on sensor dots
		chart.selectAll(".dot").on('mouseover', function(datapoint) {
			d3.select(this)
			    .attr('r', sensorRadius * 1.50);
			return tip.show(datapoint);
		}).on('mouseout', function(datapoint) {
			d3.select(this)
			    .attr('r', sensorRadius);
			return tip.hide(datapoint);
		});

		// refresh mouse event listeners on sensor radii
		chart.selectAll(".radius").on('mouseover', function(datapoint) {
			d3.select(this)
				.style("fill", d3.rgb("red").darker());
			return tip.show(datapoint);
		}).on('mouseout', function(datapoint) {
			d3.select(this)
				.style("fill", "red");
			return tip.hide(datapoint);
		});
	}

	return update;
}
