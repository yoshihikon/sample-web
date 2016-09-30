//////////////////////////////
//Chart
//////////////////////////////
/*super class*/
var Chart = function(source, targetId) {
  if(source != undefined){
   this.source = source;
  }
  if(targetId != undefined){
    this.targetId = targetId;
  }
};

Chart.prototype.draw = function(reload){
  if(this.source != undefined && this.targetId != undefined){
    if(reload == true && this.data != undefined){
      this.clear();
      this.drawChart(this.data);
    }else{
      this.clear();
      this.loadData(this.source);
    }
  }else{
    return;
  }
}

Chart.prototype.loadData = function(source){
  var thisChart = this;
  var ext = source.substr(source.length-3);
  switch(ext){
    case "csv":
      d3.csv(source, function(error, data) {
        thisChart.data = data;
        thisChart.drawChart(data);
      });
      break;
    case "tsv":
      d3.tsv(source, function(error, data) {
        thisChart.data = data;
        thisChart.drawChart(data);
      });
      break;
  }
}

Chart.prototype.drawChart = function(){
}

Chart.prototype.clear = function(){
  $(this.targetId).empty();
}

Chart.prototype.resize = function(){
  this.clear();
  this.draw(true);
}

Chart.prototype.reload = function(){
  this.draw(true);
}

//////////////////////////////
//min, ave, max plot Chart
//////////////////////////////
/* static donuts chart
var ResultSpeedChart = function(source, targetId){
  Chart.call(this, source, targetId);
};

ResultSpeedChart.prototype = new Chart();

ResultSpeedChart.prototype.resize = function(){
  this.clear();
  this.draw();
}

ResultSpeedChart.prototype.drawChart = function(data, option){
  var margin = {top: 12, right: 0, bottom: 6, left: 0};
  var width = $(this.targetId).width() - margin.left - margin.right;
  var height = $(this.targetId).height() -margin.top - margin.bottom;
  var radius = Math.min(width, height) / 2;
  
  var resultArc = d3.svg.arc()
    .outerRadius(radius - 0)
    .innerRadius(radius - 13);

  var averageArc = d3.svg.arc()
    .outerRadius(radius - 20)
    .innerRadius(radius - 15);
    
  var baseArc = d3.svg.arc()
    .outerRadius(radius - 0)
    .innerRadius(radius - 20)
    .startAngle(0)
    .endAngle(Math.PI*2);
    
  var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.value; });
    
  var svg = d3.select(this.targetId).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");
    
  var base = svg.append("path")
    .attr("d", baseArc)
    .attr("class", "arc_base fillColorSetEmphasizeColor6");
     
  var averageRate = data[0].average / data[0].max;
  
  averageArc.startAngle(0);
  averageArc.endAngle(Math.PI * 2 * averageRate);
  
  var averagePie = svg.append("path")
    .attr("class", "arc_average fillColorSet1Color3")
    .attr("d", averageArc);
  
  var resultRate = data[0].result / data[0].max;
  
  resultArc.startAngle(0);
  resultArc.endAngle(Math.PI * 2 * resultRate);
  
  var resultPie = svg.append("path")
    .attr("class", "arc_result fillColorSet1Color1")
    .attr("d", resultArc);
    
  $("#result_value").text(data[0].result);
  $("#average_value").text(data[0].average);
  $("#max_value").text(data[0].max);
}
*/

/* animated donuts chart */
var ResultSpeedChart = function(source, targetId){
  Chart.call(this, source, targetId);
};

ResultSpeedChart.prototype = new Chart();

ResultSpeedChart.prototype.animationRate = 0.02;

ResultSpeedChart.prototype.resize = function(){
  this.clear();
  this.drawChart(this.data, {animate:false});
}

ResultSpeedChart.prototype.drawChart = function(data, option){
  /*set animation time*/
  var animationRate = this.animationRate;
  if(option != undefined){
    if(option.animate == true || option.animate == undefined){
      animationRate = this.animationRate;
    }else if(option.animate == false){
      animationRate = 1;
    }
  }
  
  var margin = {top: 12, right: 0, bottom: 6, left: 0};
  var width = $(this.targetId).width() - margin.left - margin.right;
  var height = $(this.targetId).height() -margin.top - margin.bottom;
  var radius = Math.min(width, height) / 2;
  
  var resultArc = d3.svg.arc()
    .outerRadius(radius - 0)
    .innerRadius(radius - 13);

  var averageArc = d3.svg.arc()
    .outerRadius(radius - 20)
    .innerRadius(radius - 15);
    
  var baseArc = d3.svg.arc()
    .outerRadius(radius - 0)
    .innerRadius(radius - 20)
    .startAngle(0)
    .endAngle(Math.PI*2);
    
  var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.value; });
    
  var svg = d3.select(this.targetId).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");
    
  var base = svg.append("path")
    .attr("d", baseArc)
    .attr("class", "arc_base fillColorSetEmphasizeColor6");

  //average
  var averageRate = data[0].average / data[0].max;
  
  averageArc.startAngle(0);
  averageArc.endAngle(0);
  //averageArc.endAngle(Math.PI * 2 * averageRate);
  
  var averagePie = svg.append("path")
    .attr("class", "arc_average fillColorSet1Color3")
    .attr("d", averageArc);
  
  this.animate(averagePie, averageArc, $("#average_value"), data[0].average, data[0].max, animationRate);
  
  var resultRate = data[0].result / data[0].max;
  
  resultArc.startAngle(0);
  resultArc.endAngle(0);
  //resultArc.endAngle(Math.PI * 2 * resultRate);
  
  //result
  var resultPie = svg.append("path")
    .attr("class", "arc_result fillColorSet1Color1")
    .attr("d", resultArc);
  
  this.animate(resultPie, resultArc, $("#result_value"), data[0].result, data[0].max, animationRate);
  
  $("#max_value").text(data[0].max);
}

ResultSpeedChart.prototype.animate = function(pie, arc, label, value, max, animationRate){
  var progress = 0;
  var rate = value / max;
  
  arc.startAngle(Math.PI * 2 * progress);
  arc.endAngle(Math.PI * 2 * progress);
  
  var interval = setInterval(function(){
    
    progress += animationRate;
    
    if(progress >= rate){
      progress = rate;
      clearInterval(interval);
    }
    
    var i = d3.interpolate(progress, progress);
    
    pie.transition().tween("progress", function() {
      return function(t) {
        //progress = i(t);
        //rate
        pie.attr("d", arc.endAngle(Math.PI * 2 * progress));
        //label
        label.text((progress * max).toFixed(1));
      };
    });
   
  }, 20);
}

//////////////////////////////
//char resize timer
//////////////////////////////
var ChartResizer = function(interval) {
  this.resizeInterval = 1000;
  this.resizeCharts = [];
  this.resizeTimer = null;
  this.currentWindowWidth;
  this.currentWindowHeight;
  
  if(interval != undefined){
    this.resizeInterval = interval;
  }
};

ChartResizer.prototype.add = function(chart){
  this.resizeCharts.push(chart);
}
ChartResizer.prototype.start = function(){
  if(this.resizeTimer == null || this.resizeTimer == undefined){
    this.currentWindowWidth = $(window).width();
    this.currentWindowHeight = $(window).height();
    
    var resizer = this;
    this.resizeTimer = setInterval(function(){
      if(resizer.currentWindowWidth != 0 || resizer.currentWindowHeight != 0){
        if(resizer.currentWindowWidth != $(window).width() || resizer.currentWindowHeight != $(window).height()){
          var i = 0;
          var length = resizer.resizeCharts.length;
          for(i = 0; i < length; i++){
            if(resizer.resizeCharts[i] != undefined){
              resizer.resizeCharts[i].resize();
            }
          }
        }
      }
      
      resizer.currentWindowWidth = $(window).width();
      resizer.currentWindowHeight = $(window).height();
    }, this.resizeInterval); 
  }
}

ChartResizer.prototype.stop = function(){
 clearInterval(this.resizeTimer);
 this.resizeTimer = null;
}
