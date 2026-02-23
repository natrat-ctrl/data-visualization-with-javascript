async function drawScatter() {
  // 1. Read data
  const dataset = await d3.json("../data/my_weather_data.json");

  // Accessors
  const xAccessor = (d) => d.dewPoint;
  const yAccessor = (d) => d.humidity;
  const colorAccessor = (d) => d.cloudCover;

  // 2. Define dimensions
  const width = d3.min([window.innerWidth, window.innerHeight]) * 0.9;

  let dimensions = {
    width: width,
    height: width,
    margin: {
      top: 10,
      right: 10,
      bottom: 50,
      left: 50,
    },
  };

  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  // 3. Create SVG container
  const wrapper = d3
    .select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const boundingBox = wrapper
    .append("g")
    .style(
      "transform",
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`,
    );

  // 4. Scales
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice();

  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0])
    .nice();

  // Color scale for cloud cover
  const colorScale = d3
    .scaleSequential()
    .domain(d3.extent(dataset, colorAccessor))
    .interpolator(d3.interpolateYlGnBu);

  // 5. Draw data points
  boundingBox
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(xAccessor(d)))
    .attr("cy", (d) => yScale(yAccessor(d)))
    .attr("r", 5)
    .attr("fill", (d) => colorScale(colorAccessor(d)));

  // 6. Draw axes
  const xAxisGenerator = d3.axisBottom().scale(xScale);
  const xAxis = boundingBox
    .append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${dimensions.boundedHeight}px)`);

  const yAxisGenerator = d3.axisLeft().scale(yScale);
  const yAxis = boundingBox.append("g").call(yAxisGenerator);

  // 7. Axis labels
  xAxis
    .append("text")
    .attr("x", dimensions.boundedWidth / 2)
    .attr("y", dimensions.margin.bottom - 10)
    .attr("fill", "black")
    .style("font-size", "14px")
    .text("Dew Point (°F)");

  yAxis
    .append("text")
    .attr("x", -dimensions.boundedHeight / 2)
    .attr("y", -dimensions.margin.left + 15)
    .attr("fill", "black")
    .style("font-size", "14px")
    .style("transform", "rotate(-90deg)")
    .style("text-anchor", "middle")
    .text("Humidity (Relative)");
}

drawScatter();
