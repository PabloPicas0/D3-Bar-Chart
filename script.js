"use strict";

import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

//SVG dimdimensions
const w = 900;
const h = 600;
const padding = 60;

const barWidth = w / 315;
const innerHeight = h - padding;

const svg = d3.select("body").append("svg").attr("width", w).attr("height", h);

const formatDate = (date) => {
  const fullDate = date.split("-");
  const regex = /^[0]/;
  //Month variable holds month as number and replace all 0
  const year = fullDate[0];
  const month = Number(fullDate[1].replace(regex, ""));
  if (month === 1) {
    return `${year} Q1`;
  }
  if (month === 4) {
    return `${year} Q2`;
  }
  if (month === 7) {
    return `${year} Q3`;
  }
  if (month === 10) {
    return `${year} Q4`;
  }
};

const onMouseOver = (event) => {
  const tooltip = d3.select("#tooltip");
  const date = event.target.__data__.oldDataFormat;
  const gdp = event.target.__data__.value;

  tooltip
    .style("top", `${event.clientY - 30}px`)
    .style("left", `${event.clientX + 20}px`)
    .style("opacity", "0.9")
    .attr("data-date", date)
    .attr("data-gdp", gdp)
    .html(`${formatDate(date)} <br>  $${gdp} Billions`);
};

const onMouseOut = (event) => {
  const tooltip = d3.select("#tooltip");

  tooltip.style("opacity", "0");
};

const drawChart = (fetchData) => {
  //Create new array of objects with date value and GDP value
  const dataset = fetchData.data.map((element) => {
    return { year: new Date(element[0]), value: element[1], oldDataFormat: element[0] };
  });

  //Obtain lowest and highest year
  const xMin = d3.min(dataset, (data) => data.year);
  const xMax = d3.max(dataset, (data) => data.year);

  //Obtain highest GDP
  const yMax = d3.max(dataset, (data) => data.value);

  //x scale and axis
  const xScale = d3
    .scaleTime()
    .domain([xMin, xMax])
    .range([padding, w - padding]);
  const xAxis = d3.axisBottom(xScale).tickFormat((data) => data.getFullYear());

  //y scale and axis
  const yScale = d3
    .scaleLinear()
    .domain([0, yMax])
    .range([h - padding, padding]);
  const yAxis = d3.axisLeft(yScale).tickSize(-w + padding * 2);

  //Add main text of graph
  svg
    .append("text")
    .attr("x", w / 2 - 110)
    .attr("y", 30)
    .attr("id", "title")
    .text("GDP in United States");

  //Add text for yAxis
  svg
    .append("text")
    .attr("x", -h / 2 - 60)
    .attr("y", 15)
    .attr("id", "yAxisLabel")
    .attr("transform", "rotate(-90)")
    .text("Gross Domestic Product in Billions");

  //Adds source info
  svg
    .append("text")
    .attr("x", padding * 6.7)
    .attr("y", h - 10)
    .attr("id", "xAxisLabel")
    .text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf");

  //Appends xAxis
  svg
    .append("g")
    .attr("transform", `translate(0, ${h - padding})`)
    .attr("id", "x-axis")
    .call(xAxis);

  //Adds customize yAxis
  svg
    .append("g")
    .attr("transform", `translate(${padding}, 0)`)
    .attr("id", "y-axis")
    .call(yAxis)
    .call((g) => g.select(".domain").remove())
    .call((g) => g.selectAll(".tick text").attr("x", -5));

  //Adds Bars
  svg
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .on("mouseover", onMouseOver)
    .on("mouseout", onMouseOut)
    .attr("class", "bar")
    .attr("data-date", (data) => data.oldDataFormat)
    .attr("data-gdp", (data) => data.value)
    .attr("x", (data) => xScale(data.year))
    .attr("y", (data) => yScale(data.value))
    .attr("width", barWidth)
    .attr("height", (data) => innerHeight - yScale(data.value));
};

d3.json(url).then((fetchedData) => {
  drawChart(fetchedData);
});
