(function() {

  "use strict";

  var app = angular.module("GithubUserAnalyticsApp");

  // TODO: remove dependency to these hard coded values using css/less rules
  var CHART_WIDTH = 700;
  var CHART_HEIGHT = 500;

  app.directive("barChart", [
    function() {

      function link($scope, $element, $attrs) {
        var chart = {};

        chart.data = [];

        function prepChart() {
          chart.margin = { top: 10, right: 10, bottom: 50, left: 50 };
          chart.width = CHART_WIDTH - chart.margin.left - chart.margin.right;
          chart.height = CHART_HEIGHT - chart.margin.top - chart.margin.bottom;
          
          chart.xScale = d3.scale.ordinal()
            .rangeRoundBands([0, chart.width], 0.1)
            .domain(_.pluck(chart.data, "letter"));
          
          chart.yScale = d3.scale.linear()
            .range([chart.height, 0])
            .domain([0, d3.max(chart.data, function(d) { return d.count; })]);

          chart.xAxis = d3.svg.axis().scale(chart.xScale).orient("bottom");
          chart.yAxis = d3.svg.axis().scale(chart.yScale).orient("left").tickFormat(d3.format("d")).tickSize(-chart.width, 0, 0);
        }

        function getChartContainer() {
          return d3.select($element.find("svg")[0])
            .attr("width", chart.width + chart.margin.left + chart.margin.right)
            .attr("height", chart.height + chart.margin.top + chart.margin.bottom)
              .append("g")
                .attr("class", "chart-container")
                .attr("transform", "translate(" + chart.margin.left + "," + chart.margin.top + ")");
        }

        function drawXAxis() {      
          chart.container.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + chart.height + ")")
            .call(chart.xAxis);
        }

        function drawYAxis() {
          chart.container.append("g")
            .attr("class", "y axis")
            .call(chart.yAxis);
        }

        function updateXAxis() {
          chart.container.select(".x.axis")
            .transition()
            .duration(500)
            .call(chart.xAxis);
        }

        function updateYAxis() {
          chart.container.select(".y.axis")
            .transition()
            .duration(500)
            .call(chart.yAxis);
        }

        function drawBars() {
          chart.bars = chart.container
            .selectAll(".bar")
            .data(chart.data);

          chart.bars.enter()
            .append("rect")
              .attr("class", "bar")
              .attr("x", function(d, i) { return chart.xScale(d.letter); })
              .attr("width", chart.xScale.rangeBand())
              .attr("y", function(d) { return chart.yScale(d.count); })
              .attr("height", function(d) { return chart.height - chart.yScale(d.count); });

          chart.bars.transition()
            .duration(500)
              .attr("x", function(d, i) { return chart.xScale(d.letter); })
              .attr("width", chart.xScale.rangeBand())
              .attr("y", function(d) { return chart.yScale(d.count); })
              .attr("height", function(d) { return chart.height - chart.yScale(d.count); });

          chart.bars.exit()
            .transition()
            .remove();
        }

        function drawChart(newData) {
          if ( !newData ) return;

          chart.data = newData;

          prepChart();

          chart.container = ($element.find("g.chart-container").length === 0) 
            ? getChartContainer()
            : d3.select($element.find("g.chart-container")[0]);

          if ( $element.find(".x.axis").length === 0 )
            drawXAxis();

          if ( $element.find(".y.axis").length === 0 )
            drawYAxis(); 
    
          updateXAxis();
          updateYAxis();

          drawBars();
        }

        function init() {
          $scope.$watch('data', function(newData, oldData) {
            if ( newData !== oldData ) {
              drawChart(newData);
            }
          });
        }
        init();
      }

      return {
        restrict: "C",
        link: link,
        scope: {
          data: "=",
          title: "="
        },
        templateUrl: "app/pages/_bar_chart_directive.html"
      }

    }
  ]);

})();
