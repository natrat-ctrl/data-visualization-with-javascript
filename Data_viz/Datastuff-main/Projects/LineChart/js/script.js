async function drawChart() {
  // 1. Reading data
  const dataset = await d3.json("../data/my_weather_data.json");
  const yAccessor = (d) => (d.temperatureMax - 32) * (5 / 9); // Fahrenheit -> Celsius
  const dateParser = d3.timeParse("%Y-%m-%d");
  const xAccessor = (d) => dateParser(d.date);

  // 2. Configure dimensions
  const width = window.innerWidth * 0.9;
  const height = d3.min([window.innerWidth, window.innerHeight]) * 0.9;

  let dimensions = {
    width: width,
    height: height,
    margin: {
      top: 15,
      right: 15,
      bottom: 40,
      left: 60,
    },
  };

  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right;

  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

  // 3. Draw chart base
  const wrapper = d3.select("#wrapper");
  const svg = wrapper
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const boundingBox = svg.append("g").style(
    "transform",
    `translate(
      ${dimensions.margin.left}px, 
      ${dimensions.margin.top}px)`,
  );

  // 4. Create scales
  const yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
    .range([dimensions.boundedHeight, 0]);

  const xScale = d3
    .scaleTime()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth]);

  // 5. Draw data
  const freezingPoint = 0;
  const freezingPointposition = yScale(freezingPoint);
  const freezingTemperatures = boundingBox
    .append("rect")
    .attr("x", 0)
    .attr("width", dimensions.boundedWidth)
    .attr("y", freezingPointposition)
    .attr("height", dimensions.boundedHeight - freezingPointposition)
    .attr("fill", "lightblue");

  const lineGenerator = d3
    .line()
    .x((d) => xScale(xAccessor(d)))
    .y((d) => yScale(yAccessor(d)));

  const line = boundingBox
    .append("path")
    .attr("d", lineGenerator(dataset))
    .attr("fill", "none")
    .attr("stroke", "black");

  // 6. Draw axes and other necessary elements
  const yAxisGenerator = d3.axisLeft().scale(yScale);
  const yAxis = boundingBox.append("g").call(yAxisGenerator);

  const xAxisGenerator = d3.axisBottom().scale(xScale);
  const xAxis = boundingBox
    .append("g")
    .style("transform", `translateY(${dimensions.boundedHeight}px)`)
    .call(xAxisGenerator);

  // (7. Optionally) Add animations or interactions)
}

drawChart();
