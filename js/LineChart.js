function createLineChart(config) {

	// set animation settings
	var dotRadius = 4;
	var duration = 50;

	// set chart dimensions
	var margin = { top: 50, right: 30, bottom: 60, left: 55	};
	var width = 1000;
	var height = 600;

	// set scales and axes
	var x = d3.scaleLinear().range([0, width]);
	var y = d3.scaleLinear().rangeRound([height, 0]);
	var xAxis = d3.axisBottom(x);
	var yAxis = d3.axisLeft(y);

	// configure the tooltip based on the data
	var tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function(datapoint) {
			return '<table><thead><tr><td colspan="3">' + 'Algorithm' +
				'</td></tr></thead><tbody><tr>' + '<td class="tip-radius">' + 'Radius: ' +
				datapoint.radius.toFixed(2) + '</td></tr><tr><td class="tip-movement">' +
				'Avg. Movement ' + datapoint.movement.toFixed(5) + '</td></tr></tbody></table>';
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

	// draw the Y-axis on the left of the chart (with a label)
	chart.append("g")
		.attr("class", "y axis")
	  .append("text")
	  	.attr('class', 'label')
	  	.attr('id', 'y-axis-label')
      	.attr("transform", "rotate(-90)")
      	.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Average Movement");

	// draw the line that goes through each datapoint on the chart
	chart.append("path")
		.attr("class", "line")
		.attr("id", "the-line")
		.style('opacity', 0.0);

	var update = function(data) {

		// update scales and axes
		x.domain([0, 1]);
		y.domain(d3.extent(data, function(d) { return d.movement; }));
		x.range([0, width]);
		y.rangeRound([height, 0]);
		xAxis.tickValues([0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0])

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

		// create the line that goes through each datapoint on the chart
		var line = d3.line()
			.x(function(d) { return x(d.radius); })
			.y(function(d) { return y(d.movement); });

		// update the line path
		chart.selectAll("#the-line")
			.datum(data)
		  .transition()
			.duration(duration)
			.style('opacity', 1.0)
			.attr("d", line)
			.style("stroke", function(d) { return "steelblue"; });

		// DATA JOIN
		var points = chart.selectAll(".point")
			.data(data);

		// EXIT old elements not present in new data
		points.exit().attr('class', 'point exit')
		  .transition()
		  	.duration(duration)
			.style('opacity', 0)
			.remove();

		// UPDATE old elements present in new data
		points.attr('class', 'point update');

		chart.selectAll('#' + config.chartid + ' .point .dot')
			.data(data)
		  .transition()
		  	.duration(duration)
			.attr('cx', function(d) { return x(d.radius);   })
			.attr('cy', function(d) { return y(d.movement); })
			.attr('r',  function(d) { return dotRadius;     })

		// ENTER new elements present in the data
		points.enter().append('g')
			.attr('class', 'point new');

		chart.selectAll('.point.new').append('circle')
			.attr('class', 'dot')
			.attr('cx', function(d) { return x(d.radius);   })
			.attr('cy', function(d) { return y(d.movement); })
			.attr('r',  function(d) { return dotRadius;     })
			.style('fill', 'steelblue')
			.style('opacity', 1.0);

		// refresh mouse event listeners on sensor dots
		chart.selectAll(".point .dot").on('mouseover', function(datapoint) {
			d3.select(this)
				.style("fill", d3.rgb("steelblue").darker())
			    .attr('r', dotRadius * 1.50);
			return tip.show(datapoint);
		}).on('mouseout', function(datapoint) {
			d3.select(this)
				.style("fill", "steelblue")
			    .attr('r', dotRadius);
			return tip.hide(datapoint);
		});
	}

	return update;
}
