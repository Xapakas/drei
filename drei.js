dataP = d3.csv("2017.csv");

dataP.then(function(data){
  drawScatter(data);
},
function(err){
  console.log(err);
});

var drawScatter = function(data){
  console.log(data);

  var width = 1000

  var height = 700

  var svg = d3.select("svg")
          .attr("width", width)
          .attr("height", height);

  var padding = {
    left: 30,
    right: 30,
    top: 20,
    bottom: 20
  };

  var xMin = d3.min(data.map(function(d){
    // console.log(d)
    return d.Economy;
  }));

  console.log(xMin)

  var xMax = d3.max(data.map(function(d){
    return d.Economy;
  }));

  console.log(xMax)

  var xScale = d3.scaleLinear() // GDP Per Capita
                 .domain([xMin,xMax])
                 .range([padding.left, width - padding.right]);

  var yMin = d3.min(data.map(function(d){
    // console.log(d)
    return d.HappinessScore;
  }));

  var yMax = d3.max(data.map(function(d){
    return d.HappinessScore;
  }));

  // console.log(yMin, yMax)

  var yScale = d3.scaleLinear()
                 .domain([yMin,yMax])
                 .range([height - padding.bottom, padding.top]);

  var colorMin = d3.min(data.map(function(d){
    return d.Health;
  }))

  var colorMax = d3.max(data.map(function(d){
    return d.Health;
  }))

  console.log(colorMin,colorMax)

  var colorScale = d3.scaleLinear()
                     .domain([colorMin,colorMax])
                     .range(["red","green"])

  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx",function(d){console.log(xScale(d.Economy)); return xScale(d.Economy);})
    .attr("cy",function(d){return yScale(d.HappinessScore);})
    .attr("r",5)
    .attr("fill",function(d){return colorScale(d.Health)});

  var xAxis = d3.axisBottom()
                .scale(xScale);

  var yAxis = d3.axisLeft()
                .scale(yScale);

  svg.append("g")
     .attr("class","axis")
     .attr("transform", "translate(0," + (height - padding.bottom) + ")")
     .call(xAxis);

  svg.append("g")
     .attr("class","axis")
     .attr("transform", "translate(" + padding.left + ",0)")
     .call(yAxis);

}
