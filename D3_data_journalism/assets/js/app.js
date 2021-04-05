//set up graph boundaries
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(hairData) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    hairData.forEach(function(data) {

      data.obesity = +data.obesity;
      data.income = +data.income;

    });

    // Step 2: Create scale functions
    // ==============================

  var xLinearScale = d3.scaleLinear()
    .domain([0, d3.max(hairData, d => d.obesity) + 5])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(hairData, d => d.income) + 5])
    .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    chartGroup.append("g")
    .call(leftAxis);

    // Step 5: Create Circles
    // ==============================

    var circlesGroup = chartGroup.selectAll("circle")
    .data(hairData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.obesity))
    .attr("cy", d => yLinearScale(d.income))
    .attr("r","15")
    .attr("fill", "plum");

    //state abbreviations
    var stateGroup = chartGroup.selectAll("text")
    .data(hairData)
    .enter()
    .append("text")
    //append text of state abbreviations
    .text(d => d.abbr)
    .attr("dx", d => xLinearScale(d.obesity))
    .attr("dy", d => yLinearScale(d.income))
    //create class attribute .states with centered text etc.
    .attr("class","states")
    .attr("alignment-baseline", "central")
    ;

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`<strong>${d.state}<strong><hr>Obesity: ${d.obesity}<br>Income: ${d.income}`);
    });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);


    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
      circlesGroup.on("mouseover", function(d) {
        toolTip.show(d, this);
      })
        //on mouseout event
        .on("mouseout", function(d) {
          toolTip.hide(d);
        });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Income");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Obesity");
  }).catch(function(error) {
    console.log(error);
  });

