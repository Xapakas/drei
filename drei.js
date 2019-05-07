var data2015 = d3.csv("2015.csv")
var data2016 = d3.csv("2016.csv")
var data2017 = d3.csv("2017.csv")

var bigData = d3.csv("Chapter2OnlineData.csv")

var width = 700;

var height = 600;

var padding = {
  left: 30,
  right: 30,
  top: 20,
  bottom: 20
};

var values = ["HappinessScore","Economy","Family","Health","Freedom","Generosity","TrustIng"]

Promise.all([data2015,data2016,data2017]).then(function(data){
  var xVariable = "Economy"
  var yVariable = "HappinessScore"
  var colorVariable = "Health"
  var sizeVariable = "Freedom"
  drawScatter(data[0],xVariable,yVariable,colorVariable,sizeVariable);
  buttonUpdate(data,data[0],xVariable,yVariable,colorVariable,sizeVariable);
},
function(err){
  console.log(err);
});

var drawScatter = function(data,xVariable,yVariable,colorVariable,sizeVariable){
  console.log(data);

  var svg = d3.select("svg")
          .attr("width", width)
          .attr("height", height);

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
    return d[yVariable];
  }));

  var yMax = d3.max(data.map(function(d){
    return d[yVariable];
  }));

  // console.log(yMin, yMax)

  var yScale = d3.scaleLinear()
                 .domain([yMin,yMax])
                 .range([height - padding.bottom, padding.top]);

  var colorMin = d3.min(data.map(function(d){
    return d[colorVariable];
  }));

  var colorMax = d3.max(data.map(function(d){
    return d[colorVariable];
  }));

  // console.log(colorMin,colorMax);

  var colorScale = d3.scaleLinear()
                     .domain([colorMin,colorMax])
                     .range(["red","green"]);

  var sizeMin = d3.min(data.map(function(d){
    return d[sizeVariable];
  }));

  var sizeMax = d3.max(data.map(function(d){
    return d[sizeVariable];
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
    .attr("cx",function(d){return xScale(d[xVariable]);})
    .attr("cy",function(d){return yScale(d[yVariable]);})
    .attr("r",function(d){return sizeScale(d[sizeVariable])})
    .attr("fill",function(d){return colorScale(d[colorVariable])})
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
        .attr("r",function(d){return 1.5 * sizeScale(d[sizeVariable])})
        .attr("opacity", 1);

      div.html("<b>" + d.Country + "</b>" +
               "<br> Happiness Score: " + d.HappinessScore +
               "<br> GDP Per Capita: " + d.Economy +
               "<br> Health (Life Expectancy): " + d.Health +
               "<br> Freedom: " + d.Freedom +
               "<br> Generosity: " + d.Generosity +
               "<br> Trust In Gov't: " + d.TrustInGovernment)
         .style("display","inline-block");
    })
    .on("mouseout",function(d){
      d3.selectAll("circle")
        .transition()
        .duration(200)
        .attr("r",function(d){return sizeScale(d[sizeVariable])})
        .attr("opacity", 0.7);
    })

  var xAxis = d3.axisBottom()
                .scale(xScale);

  var yAxis = d3.axisLeft()
                .scale(yScale);

  svg.append("g")
     .attr("id","xAxisGroup")
     .attr("class","axis")
     .attr("transform", "translate(0," + (height - padding.bottom) + ")")
     .call(xAxis);

  svg.append("g")
     .attr("id","yAxisGroup")
     .attr("class","axis")
     .attr("transform", "translate(" + padding.left + ",0)")
     .call(yAxis);
}

var buttonUpdate = function(data,currentData,xVariable,yVariable,colorVariable,sizeVariable,currentRegion){
  d3.select("#colorblindButton")
    .on("click",function(d){
      d3.select("#colorblindButton")
        .attr("id","unblindButton")
        .html("Never Mind")
      recolorFunction(data,currentData,xVariable,yVariable,colorVariable,sizeVariable,"orange","blue");
    });

  d3.select("#unblindButton")
    .on("click",function(d){
      d3.select("#unblindButton")
        .attr("id","colorblindButton")
        .html("I'm color blind")

      recolorFunction(data,currentData,xVariable,yVariable,colorVariable,sizeVariable,"red","green")
    })

  d3.selectAll(".region")
    .on("click",function(d){
      showRegion(data,this.id,currentData,xVariable,yVariable,colorVariable,sizeVariable,currentRegion)});

  d3.select("#Button2015")
    .on("click",function(d){
      drawUpdate(data,data[0],xVariable,yVariable,colorVariable,sizeVariable)
    })

  d3.select("#Button2016")
    .on("click",function(d){
      drawUpdate(data,data[1],xVariable,yVariable,colorVariable,sizeVariable)
    })

  d3.select("#Button2017")
    .on("click",function(d){
      drawUpdate(data,data[2],xVariable,yVariable,colorVariable,sizeVariable)
    })

  d3.select(".xValueForm")
    .on("change",function(d){
      var selectX = document.getElementById("xValueSelect")
      var newX = selectX.options[selectX.selectedIndex].value;
      console.log(newX)
      changeValue(data,currentData,newX,yVariable,colorVariable,sizeVariable)
    })

  d3.select(".yValueForm")
    .on("change",function(d){
      var selectY = document.getElementById("yValueSelect")
      var newY = selectY.options[selectY.selectedIndex].value;
      console.log(newY)
      changeValue(data,currentData,xVariable,newY,colorVariable,sizeVariable)
    })

  d3.select(".sizeValueForm")
    .on("change",function(d){
      var selectSize = document.getElementById("sizeValueSelect")
      var newSize = selectSize.options[selectSize.selectedIndex].value;
      console.log(newSize)
      changeValue(data,currentData,xVariable,yVariable,colorVariable,newSize)
    })

  d3.select(".colorValueForm")
    .on("change",function(d){
      var selectColor = document.getElementById("colorValueSelect")
      var newColor = selectColor.options[selectColor.selectedIndex].value;
      console.log(newColor)
      changeValue(data,currentData,xVariable,yVariable,newColor,sizeVariable)
    })
}

var changeValue = function(data,currentData,xVariable,yVariable,colorVariable,sizeVariable){
  var svg = d3.select("svg");

  var xMin = d3.min(currentData.map(function(d){
    return d[xVariable];
  }));

  var xMax = d3.max(currentData.map(function(d){
    return d[xVariable];
  }));

  var xScale = d3.scaleLinear() // GDP Per Capita
                 .domain([xMin,xMax])
                 .range([padding.left, width - padding.right]);

  var yMin = d3.min(currentData.map(function(d){
    return d[yVariable];
  }));

  var yMax = d3.max(currentData.map(function(d){
    return d[yVariable];
  }));

  var yScale = d3.scaleLinear()
                 .domain([yMin,yMax])
                 .range([height - padding.bottom, padding.top]);

  var colorMin = d3.min(currentData.map(function(d){
    return d[colorVariable];
  }));

  var colorMax = d3.max(currentData.map(function(d){
    return d[colorVariable];
  }));

  var colorScale = d3.scaleLinear()
                     .domain([colorMin,colorMax])
                     .range(["red","green"]);

  var sizeMin = d3.min(currentData.map(function(d){
    return d[sizeVariable];
  }));

  var sizeMax = d3.max(currentData.map(function(d){
    return d[sizeVariable];
  }));

  var sizeScale = d3.scaleLinear()
                    .domain([sizeMin,sizeMax])
                    .range([5,15]);

  var div = d3.select("div.info");

  var circles = d3.selectAll("circle")
                  .data(currentData,function(d){return d.Country})

  circles.on("mouseover",function(d){
            d3.selectAll("circle")
              .transition()
              .duration(400)
              .attr("opacity", 0.2);

            d3.select(this)
              .transition()
              .duration(400)
              .attr("r",function(d){return 1.5 * sizeScale(d[sizeVariable])})
              .attr("opacity", 1);

            div.html("<b>" + d.Country + "</b>" +
                     "<br> Happiness Score: " + d.HappinessScore +
                     "<br> GDP Per Capita: " + d.Economy +
                     "<br> Health (Life Expectancy): " + d.Health +
                     "<br> Freedom: " + d.Freedom +
                     "<br> Generosity: " + d.Generosity +
                     "<br> Trust In Gov't: " + d.TrustInGovernment)
               .style("display","inline-block");
            })
         .on("mouseout",function(d){
             d3.selectAll("circle")
               .transition()
               .duration(200)
               .attr("r",function(d){return sizeScale(d[sizeVariable])})
               .attr("opacity", 0.7);
        })

  circles.transition()
         .duration(600)
         .ease(d3.easeCubicInOut)
         .attr("cx",function(d){return xScale(d[xVariable]);})
         .attr("cy",function(d){return yScale(d[yVariable]);})
         .attr("r",function(d){return sizeScale(d[sizeVariable])})
         .attr("fill",function(d){return colorScale(d[colorVariable])});

   var xAxis = d3.axisBottom()
                 .scale(xScale);

   var yAxis = d3.axisLeft()
                 .scale(yScale);

  svg.select("#xAxisGroup")
     .transition()
     .duration(600)
     .ease(d3.easeCubicInOut)
     .call(xAxis);

  svg.select("#yAxisGroup")
     .transition()
     .duration(600)
     .ease(d3.easeCubicInOut)
     .call(yAxis);
     
  buttonUpdate(data,currentData,xVariable,yVariable,colorVariable,sizeVariable);

}

var showRegion = function(data,id,currentData,xVariable,yVariable,colorVariable,sizeVariable,currentRegion){

  var xMin = d3.min(currentData.map(function(d){
    return d[xVariable];
  }));

  var xMax = d3.max(currentData.map(function(d){
    return d[xVariable];
  }));

  var xScale = d3.scaleLinear() // GDP Per Capita
                 .domain([xMin,xMax])
                 .range([padding.left, width - padding.right]);

  var yMin = d3.min(currentData.map(function(d){
    return d[yVariable];
  }));

  var yMax = d3.max(currentData.map(function(d){
    return d[yVariable];
  }));

  var yScale = d3.scaleLinear()
                 .domain([yMin,yMax])
                 .range([height - padding.bottom, padding.top]);

  var colorMin = d3.min(currentData.map(function(d){
    return d[colorVariable];
  }));

  var colorMax = d3.max(currentData.map(function(d){
    return d[colorVariable];
  }));

  var colorScale = d3.scaleLinear()
                     .domain([colorMin,colorMax])
                     .range(["red","green"]);

  var sizeMin = d3.min(currentData.map(function(d){
    return d[sizeVariable];
  }));

  var sizeMax = d3.max(currentData.map(function(d){
    return d[sizeVariable];
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
        return 0.7
        }
      else if (d.Region == id){
        return 1
        }
      else{
        return 0.2
        }})
    .attr("r",function(d){
      if (d.Region == currentRegion){return sizeScale(d[sizeVariable])}
      else if (d.Region == id){return sizeScale(d[sizeVariable]) * 1.5}
      else{return sizeScale(d[sizeVariable])}})

  d3.selectAll("circle")
    .data(currentData)
    .append("text")
    .attr("x",function(d){
      if (d.Region == id && d.Region != currentRegion){return xScale(d[xVariable])}
    })
    .attr("y",function(d){
      if (d.Region == id && d.Region != currentRegion){return yScale(d[yVariable])}
    })
    .text(function(d){return d.Country});

  if (id == currentRegion){
    var currentRegion = "none";
  }
  else{
    var currentRegion = id;
  }

  buttonUpdate(data,currentData,xVariable,yVariable,colorVariable,sizeVariable,currentRegion)
}

var recolorFunction = function(data,currentData,xVariable,yVariable,colorVariable,sizeVariable,color1,color2){

  var colorMin = d3.min(currentData.map(function(d){
    return d[colorVariable];
  }));

  var colorMax = d3.max(currentData.map(function(d){
    return d[colorVariable];
  }));

  var colorblindScale = d3.scaleLinear()
                     .domain([colorMin,colorMax])
                     .range([color1,color2]);

  d3.selectAll("circle")
    .data(currentData)
    .transition()
    .duration(500)
    .attr("fill",function(d){return colorblindScale(d[colorVariable]);});

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

  buttonUpdate(data,currentData,xVariable,yVariable,colorVariable,sizeVariable);
}

var drawUpdate = function(data,currentData,xVariable,yVariable,colorVariable,sizeVariable){
  // console.log(currentData)

  var svg = d3.select("svg");

  var xMin = d3.min(currentData.map(function(d){
    // console.log(d)
    return d[xVariable];
  }));

  // console.log(xMin)

  var xMax = d3.max(currentData.map(function(d){
    return d[xVariable];
  }));

  // console.log(xMax)

  var xScale = d3.scaleLinear() // GDP Per Capita
                 .domain([xMin,xMax])
                 .range([padding.left, width - padding.right]);

  var yMin = d3.min(currentData.map(function(d){
    // console.log(d)
    return d[yVariable];
  }));

  var yMax = d3.max(currentData.map(function(d){
    return d[yVariable];
  }));

  // console.log(yMin, yMax)

  var yScale = d3.scaleLinear()
                 .domain([yMin,yMax])
                 .range([height - padding.bottom, padding.top]);

  var colorMin = d3.min(currentData.map(function(d){
    return d[colorVariable];
  }));

  var colorMax = d3.max(currentData.map(function(d){
    return d[colorVariable];
  }));

  // console.log(colorMin,colorMax);

  var colorScale = d3.scaleLinear()
                     .domain([colorMin,colorMax])
                     .range(["red","green"]);

  var sizeMin = d3.min(currentData.map(function(d){
    return d[sizeVariable];
  }));

  var sizeMax = d3.max(currentData.map(function(d){
    return d[sizeVariable];
  }));

  var sizeScale = d3.scaleLinear()
                    .domain([sizeMin,sizeMax])
                    .range([5,15]);

  var div = d3.select("div.info");

  svg.selectAll("circle")
     .data(currentData,function(d){return d.Country})
     // .enter()
     // .append("circle")
     .transition()
     .duration(600)
     .ease(d3.easeCubicInOut)
     .attr("cx",function(d){return xScale(d[xVariable]);})
     .attr("cy",function(d){return yScale(d[yVariable]);})
     .attr("r",function(d){return sizeScale(d[sizeVariable])})
     .attr("fill",function(d){return colorScale(d[colorVariable])});

  var newDots = svg.selectAll("circle")
                   .data(currentData,function(d){return d.Country})
                   .enter()
                   .append("circle")
                   .on("mouseover",function(d){
                     console.log(this.id)
                     d3.selectAll("circle")
                       .transition()
                       .duration(400)
                       .attr("opacity", 0.2);

                     d3.select(this)
                       .transition()
                       .duration(400)
                       .attr("r",function(d){return 1.5 * sizeScale(d[sizeVariable])})
                       .attr("opacity", 1);

                     div.html("<b>" + d.Country + "</b>" +
                              "<br> Happiness Score: " + d.HappinessScore +
                              "<br> GDP Per Capita: " + d.Economy +
                              "<br> Health (Life Expectancy): " + d.Health +
                              "<br> Freedom: " + d.Freedom +
                              "<br> Generosity: " + d.Generosity +
                              "<br> Trust In Gov't: " + d.TrustInGovernment)
                        .style("display","inline-block");
                   })
                   .on("mouseout",function(d){
                     d3.selectAll("circle")
                       .transition()
                       .duration(200)
                       .attr("r",function(d){return sizeScale(d[sizeVariable])})
                       .attr("opacity", 0.7);
                   });

  newDots.transition()
         .duration(600)
         .ease(d3.easeCubicInOut)
         .attr("cx",function(d){return xScale(d[xVariable]);})
         .attr("cy",function(d){return yScale(d[yVariable]);})
         .attr("r",function(d){return sizeScale(d[sizeVariable])})
         .attr("fill",function(d){return colorScale(d[colorVariable])})
         .attr("opacity",0.7)
         .attr("id",function(d){return d.Country})
         .attr("classed",function(d){return d.Region});

  svg.selectAll("circle")
     .data(currentData,function(d){return d.Country})
     .exit()
     .transition()
     .duration(600)
     .ease(d3.easeCubicInOut)
     .attr("opacity",0)
     .remove();

  buttonUpdate(data,currentData,xVariable,yVariable,colorVariable,sizeVariable);
}
