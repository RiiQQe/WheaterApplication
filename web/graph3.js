var datearray = [];
var colorrange = [];
var smhiDataR = [];
var strokecolor;
var format;

var ifFirst = true;

var tooltip, 
  x, xAxis,
  y, yAxis,
  z;

var stack, nest, area, svg;

var margin, width, height;

var layersSmhi0, layersSmhi1, layersYr0, layersYr1;




  format = d3.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ");
  //TODO:
  //Make these responsive
  margin = {top: 20, right: 40, bottom: 30, left: 30};
  width = document.body.clientWidth - margin.left - margin.right;
  height = document.body.clientHeight - margin.top - margin.bottom;


  //TODO: 
  //When yrData is added, add one color.
  colorrange = ["#B30000", "#E34A33"];
  strokecolor = colorrange[0];

  //TODO: 
  //Uncomment this part, not working right now..
  tooltip = d3.select(".chart")
    .append("div")
    .attr("class", "remove")
    .attr("id", "removeMe")
    .style("position", "absolute")
    .style("z-index", "20")
    .style("visibility", "hidden")
    .style("top", "30px")
    .style("left", "55px");
  
  x = d3.scale.linear()
          .range([0,width]);

  y = d3.time.scale()
          .range([0, height]);
          

  z = d3.scale.ordinal()
          .range(colorrange);

  xAxis = d3.svg.axis()
              .scale(x);

  yAxis = d3.svg.axis()
              .scale(y)
              .ticks(d3.time.days);

  stack = d3.layout.stack()
    .offset("silhouette")
    .values(function(d) { return d.values; })
    .x(function(d) { return d.value; }) // Something skumt .. 
    .y(function(d) { return d.date; });

  nest = d3.nest()
              .key(function(d){ return d.key ; });
  //TODO:
  //Jag tror att x(d.x0) och x(d.x0 + d.x) är de som dummar sig,
  //tror det räcker med att x0 = x0(function(d){return 0;})
  area = d3.svg.area()  
              .interpolate("cardinal")
              .x0(function(d){ console.log("inne i area"); return x(0.0) ; })
              .x1(function(d){ console.log("x(d.value)" + x(d.value)); return x(d.value) ; })
              .y(function(d){ return y(d.date) ; });
  //TODO:
  //Jag är inte 100% på hur  den funkar, men slår vi våra kloka 
  //huvuden ihop kan vi säkert lösa det.. 
  svg = d3.select(".chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



function setParameters(smhiData){
  //TODO: 
  //Denna delen känns lite konstig, översätter från en list med obj
  //till en lista med exakt samma objekt
  var i = 0;
  smhiDataR = [];

  while(smhiData.o[i] != null){
    var singleObj = {};

    var time = smhiData.o[i].date.date.toISOString();
    
    singleObj['temp'] =+ smhiData.o[i].temp;
    singleObj['date'] = time;


    smhiDataR.push(singleObj);
    i++;

  }
  if(ifFirst){
    createGraph(smhiDataR);  
    ifFirst = false;
  }else{
    updateGraph(smhiDataR);
  }

  
}

function createGraph(smhiDataR){

    smhiDataR.forEach(function(d){
      d.date = format.parse(d.date);
      d.value =+ d.temp;
    });

    //TODO:
    //Denna ska fungera, men den gör inte riktigt det än.. Av någon anledning blir antingen d.y0 eller d.y noll
    //Just nu är det hårdkodat nedanför..
    //x.domain([0, d3.extent(smhiDataR, function(d) { return d.y0 + d.y ; })]);

    layersSmhi0 = stack(nest.entries(smhiDataR));
    
    x.domain([-30, 30]);
    y.domain(d3.extent(smhiDataR, function(d){ return d.date; }));

    svg.transition();

    svg.selectAll(".layer")
          .data(layersSmhi0)
          .enter().append("path")
          .attr("class","layer")
          .attr("d", function(d){ return area(d.values); })
          .style("fill", function(d, i){ return z(i); });
  
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + 0 + ")")
      .call(xAxis.orient("top"));

    svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + (width) + ", 0)")
      .call(yAxis.orient("left"));

    console.log("HEJSAN DITT FULE FAN");

    //TODO: 
    //Här kan man lägga till så att tooltippen uppdateras
    //och startas, dock måste man lägga till var tooltip först
    //svg.selectAll(".layer")
    //.attr("opacity", 1) osv..
  }

  function updateGraph(smhiDataR){
      smhiDataR.forEach(function(d){
          d.date = format.parse(d.date);
          d.value =+ d.temp;
    });

      layersSmhi1 = stack(nest.entries(smhiDataR));

      transition();
  }

  function transition(){
        console.log("hello");
        d3.selectAll("path")
        .data(function(){
          var d = layersSmhi1;
          layersSmhi1 = layersSmhi0;
          return layersSmhi0 = d;
        })
        .transition()
        .duration(2500)
        .attr("d", function(d){ return area(d.values); } );

  }


 
