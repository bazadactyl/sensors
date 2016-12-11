// // set the dimensions and margins of the graph
// var margin = {top: 20, right: 20, bottom: 30, left: 50},
// 	width = 960 - margin.left - margin.right,
// 	height = 500 - margin.top - margin.bottom;
//
// // parse the date / time
// var parseTime = d3.timeParse("%d-%b-%y");
//
// // set the ranges
// var x = d3.scaleLinear().range([0, width]);
// var y = d3.scaleLinear().range([height, 0]);
//
// // define the line
// var valueline = d3.line()
// 	.x(function(d) { return x(d.xpos); })
// 	.y(function(d) { return y(d.ypos); });
//
// // append the svg obgect to the body of the page
// // appends a 'group' element to 'svg'
// // moves the 'group' element to the top left margin
// var svg = d3.select("body").append("svg")
// 	.attr("width", width + margin.left + margin.right)
// 	.attr("height", height + margin.top + margin.bottom)
//   .append("g")
// 	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//
// // Get the data
// var data = `xpos,ypos
// 1,58
// 2,53
// 3,67
// 4,89
// 5,99
// 6,130
// 7,166
// 8,234
// 9,345
// 10,443
// 11,543
// 12,580
// 13,605
// 14,622
// 15,626
// 16,628
// 17,636
// 18,633
// 19,624
// 20,629
// 21,618
// 22,599
// 23,609
// 24,617
// 25,614
// 26,606
// `;
//
// console.log(data);
//
// data = d3.csvParse(data);
//
// console.log(JSON.stringify(data));
//
// // format the data
// data.forEach(function(d) {
// 	d.xpos = +d.xpos;
// 	d.ypos = +d.ypos;
// });
//
// // Scale the range of the data
// console.log(d3.extent(data, function(d) { return d.xpos; }));
// console.log([0, d3.max(data, function(d) { return d.ypos; })]);
//
// x.domain(d3.extent(data, function(d) { return d.xpos; }));
// y.domain([0, d3.max(data, function(d) { return d.ypos; })]);
//
// // Add the valueline path.
// svg.append("path")
// 	.data([data])
// 	.attr("class", "line")
// 	.attr("d", valueline)
// 	.style("fill", "none");
//
// // Add the scatterplot
// svg.selectAll("dot")
// 	.data(data)
//   .enter().append("circle")
// 	.attr("r", function(d) { return  0.5 * d.xpos; })
// 	.attr("cx", function(d) { return x(d.xpos); })
// 	.attr("cy", function(d) { return y(d.ypos); });
//
// // Add the X Axis
// svg.append("g")
// 	.attr("transform", "translate(0," + height + ")")
// 	.call(d3.axisBottom(x));
//
// // Add the Y Axis
// svg.append("g")
// 	.call(d3.axisLeft(y));
//
// var createSensorBar(config) {
//
// }
