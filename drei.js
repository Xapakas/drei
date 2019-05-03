var data2015 = d3.csv("2015.csv")
var data2016 = d3.csv("2016.csv")
var data2017 = d3.csv("2017.csv")

var width = 700;

var height = 600;

Promise.all([data2015,data2016,data2017]).then(function(data){
  drawScatter(data[0]);
  buttonUpdate(data,data[0]);
},
function(err){
  console.log(err);
});

var drawScatter = function(data){
  console.log(data);

  var svg = d3.select("svg")
          .attr("width", width)
          .attr("height", height);

  var padding = {
    left: 30,
    right: 30,
    top: 20,
    bottom: 20
  };

  var xVariable = "Economy"

  var xMin = d3.min(data.map(function(d){
    // console.log(d)
    return d[xVariable];
  }));

  // console.log(xMin)

  var xMax = d3.max(data.map(function(d){
    return d[xVariable];
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
    .attr("id",function(d){return d.Country})
    .attr("classed",function(d){return d.Region})
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
}

var buttonUpdate = function(data,currentData,currentRegion){
  d3.select("#colorblindButton")
    .on("click",function(d){
      d3.select("#colorblindButton")
        .attr("id","unblindButton")
        .html("Never Mind")
      recolorFunction(data,currentData,"orange","blue");
    });

  d3.select("#unblindButton")
    .on("click",function(d){
      d3.select("#unblindButton")
        .attr("id","colorblindButton")
        .html("I'm color blind")

      recolorFunction(data,currentData,"red","green")
    })

  d3.selectAll(".region")
    .on("click",function(d){
      showRegion(data,this.id,currentData,currentRegion)});

  d3.select("#Button2015")
    .on("click",function(d){
      drawUpdate(data,data[0])
    })

  d3.select("#Button2016")
    .on("click",function(d){
      drawUpdate(data,data[1])
    })

  d3.select("#Button2017")
    .on("click",function(d){
      drawUpdate(data,data[2])
    })
}

var showRegion = function(data,id,currentData,currentRegion){
  console.log(currentRegion)
  console.log(id)

  // if (currentRegion == undefined){
  //   console.log("it was undefined")
  //   var currentRegion = "none"
  // }

  console.log("currentRegion is" + currentRegion)

  var sizeMin = d3.min(currentData.map(function(d){
    return d.Freedom;
  }));

  var sizeMax = d3.max(currentData.map(function(d){
    return d.Freedom;
  }));

  var sizeScale = d3.scaleLinear()
                    .domain([sizeMin,sizeMax])
                    .range([5,15]);

  d3.selectAll("circle")
    .data(currentData)
    .transition()
    .duration(400)
    .attr("opacity",function(d){
      if (id == currentRegion){
        console.log("hello");
        return 0.7
        }
      else if (d.Region == id){
        // var currentRegion = id;
        console.log("hi")
        currentRegion = id;
        console.log(currentRegion);
        return 1
        }
      else{
        return 0.2
        }})
    .attr("r",function(d){
      if (d.Region == currentRegion){return sizeScale(d.Freedom)}
      else if (d.Region == id){return sizeScale(d.Freedom) * 1.5}
      else{return sizeScale(d.Freedom)}});

  console.log("final:" + currentRegion)

  buttonUpdate(data,currentData,currentRegion)
}

var recolorFunction = function(data,currentData,color1,color2){

  var colorMin = d3.min(currentData.map(function(d){
    return d.Health;
  }));

  var colorMax = d3.max(currentData.map(function(d){
    return d.Health;
  }));

  var colorblindScale = d3.scaleLinear()
                     .domain([colorMin,colorMax])
                     .range([color1,color2]);

  d3.selectAll("circle")
    .data(currentData)
    .transition()
    .duration(500)
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

  buttonUpdate(data,currentData);
}

var drawUpdate = function(data,currentData){
  // console.log(currentData)

  var svg = d3.select("svg");

  var padding = {
    left: 30,
    right: 30,
    top: 20,
    bottom: 20
  };

  var xMin = d3.min(currentData.map(function(d){
    // console.log(d)
    return d.Economy;
  }));

  // console.log(xMin)

  var xMax = d3.max(currentData.map(function(d){
    return d.Economy;
  }));

  // console.log(xMax)

  var xScale = d3.scaleLinear() // GDP Per Capita
                 .domain([xMin,xMax])
                 .range([padding.left, width - padding.right]);

  var yMin = d3.min(currentData.map(function(d){
    // console.log(d)
    return d.HappinessScore;
  }));

  var yMax = d3.max(currentData.map(function(d){
    return d.HappinessScore;
  }));

  // console.log(yMin, yMax)

  var yScale = d3.scaleLinear()
                 .domain([yMin,yMax])
                 .range([height - padding.bottom, padding.top]);

  var colorMin = d3.min(currentData.map(function(d){
    return d.Health;
  }));

  var colorMax = d3.max(currentData.map(function(d){
    return d.Health;
  }));

  // console.log(colorMin,colorMax);

  var colorScale = d3.scaleLinear()
                     .domain([colorMin,colorMax])
                     .range(["red","green"]);

  var sizeMin = d3.min(currentData.map(function(d){
    return d.Freedom;
  }));

  var sizeMax = d3.max(currentData.map(function(d){
    return d.Freedom;
  }));

  var sizeScale = d3.scaleLinear()
                    .domain([sizeMin,sizeMax])
                    .range([5,15]);

  var div = d3.select("div.info");

  svg.selectAll("circle")
     .data(currentData,function(d){console.log(d.Country); return d.Country})
     // .enter()
     // .append("circle")
     .transition()
     .duration(600)
     .ease(d3.easeCubicInOut)
     .attr("cx",function(d){return xScale(d.Economy);})
     .attr("cy",function(d){return yScale(d.HappinessScore);})
     .attr("r",function(d){return sizeScale(d.Freedom)})
     .attr("fill",function(d){return colorScale(d.Health)});

  svg.selectAll("circle")
     .data(currentData,function(d){console.log(d.Country); return d.Country})
     .enter()
     .append("circle")
     .attr("cx",function(d){return xScale(d.Economy);})
     .attr("cy",function(d){return yScale(d.HappinessScore);})
     .attr("r",function(d){return sizeScale(d.Freedom)})
     .attr("fill",function(d){return colorScale(d.Health)})
     .attr("opacity",0.7)
     .attr("id",function(d){return d.Country})
     .attr("classed",function(d){return d.Region})
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
     .transition()
     .duration(600)
     .ease(d3.easeCubicInOut);

  buttonUpdate(data,currentData);
}
