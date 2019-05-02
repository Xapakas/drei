dataP = d3.csv("2017.csv");

dataP.then(function(data){
  drawScatter(data);
},
function(err){
  console.log(err);
});

var drawScatter = function(data){
  console.log(data);

  var width = 800;

  var height = 600;

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

  // console.log(xMin)

  var xMax = d3.max(data.map(function(d){
    return d.Economy;
  }));

  // console.log(xMax)

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
  }));

  var colorMax = d3.max(data.map(function(d){
    return d.Health;
  }));

  // console.log(colorMin,colorMax);

  var colorScale = d3.scaleLinear()
                     .domain([colorMin,colorMax])
                     .range(["red","green"]);

  var sizeMin = d3.min(data.map(function(d){
    return d.Freedom;
  }));

  var sizeMax = d3.max(data.map(function(d){
    return d.Freedom;
  }));

  var sizeScale = d3.scaleLinear()
                    .domain([sizeMin,sizeMax])
                    .range([5,15]);

  var div = d3.select(".info")
              .style("display","none")

  svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx",function(d){return xScale(d.Economy);})
    .attr("cy",function(d){return yScale(d.HappinessScore);})
    .attr("r",function(d){return sizeScale(d.Freedom)})
    .attr("fill",function(d){return colorScale(d.Health)})
    .attr("opacity",0.7)
    .on("mouseover",function(d){
      d3.selectAll("circle")
        .transition()
        .duration(400)
        .attr("opacity", 0.2);

      d3.select(this)
        .transition()
        .duration(400)
        .attr("r",function(d){return 1.5 * sizeScale(d.Freedom)})
        .attr("opacity", 1);

      div.html("<b>" + d.Country + "</b>" +
               "<br> Happiness Score: " + d.HappinessScore +
               "<br> GDP Per Capita: " + d.Economy +
               "<br> Health (Life Expectancy): " + d.Health +
               "<br> Freedom: " + d.Freedom)
         .style("display","inline-block");
    })
    .on("mouseout",function(d){
      d3.selectAll("circle")
        .transition()
        .duration(200)
        .attr("r",function(d){return sizeScale(d.Freedom)})
        .attr("opacity", 0.7);
    })

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

  buttonUpdate(data)
}

var buttonUpdate = function(data){
  d3.select("#colorblindButton")
    .on("click",function(d){
      d3.select("#colorblindButton")
        .attr("id","unblindButton")
        .html("Never Mind")
      recolorFunction(data,"orange","blue");
    });

  d3.select("#unblindButton")
    .on("click",function(d){
      d3.select("#unblindButton")
        .attr("id","colorblindButton")
        .html("I'm color blind")

      recolorFunction(data,"red","green")
    })
}

var recolorFunction = function(data,color1,color2){

  var colorMin = d3.min(data.map(function(d){
    return d.Health;
  }));

  var colorMax = d3.max(data.map(function(d){
    return d.Health;
  }));

  var colorblindScale = d3.scaleLinear()
                     .domain([colorMin,colorMax])
                     .range([color1,color2]);

  d3.selectAll("circle")
    .data(data)
    .attr("fill",function(d){return colorblindScale(d.Health);});

  // d3.select("button")
  //   .attr("id",function(d){
  //     if (this.id == "colorblindButton"){
  //       return "unblindbutton";
  //     }
  //     else {
  //       return "colorblindButton";
  //     }
  //   })
  //   .html("Never mind");

  buttonUpdate(data);
}
