(function(){
  var sampleApp = angular.module("sampleApp", ["highcharts-ng"]);
  
  sampleApp.controller('DataController', function($scope, $http){
  	var app = this;
    
  	$http.get("http://<SERVER IP>:3000/chartDataLastHour").success(function (result){
      app.data = result;

      $scope.tab = "1";

      $scope.gmailSeries = [];
      $scope.googleSeries = [];
      $scope.codeSeries = [];
      $scope.reviewSeries = [];
      $scope.date = [];
      $scope.total = [];
      $scope.ip = [];
      $scope.hostAdd = [];

      $scope.gmailData = {};
      $scope.googleData = {};
      $scope.codeData = {};
      $scope.reviewData = {};
      $scope.totalData = {};
      
      for(var i=0; i < app.data.length; i++) {
        $scope.googleSeries.push(parseInt(app.data[i].google));
        $scope.gmailSeries.push(parseInt(app.data[i].gmail));
        $scope.codeSeries.push(parseInt(app.data[i].code)); 
        $scope.reviewSeries.push(parseInt(app.data[i].review));
        $scope.total.push(parseInt(app.data[i].google) + parseInt(app.data[i].gmail) +
          parseInt(app.data[i].review) + parseInt(app.data[i].code));

        var myDate = new Date(app.data[i].date);
        var temp = myDate.getDate() + "/" + (myDate.getMonth() + 1) + "/" + myDate.getFullYear() + "  " + myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds() + 
                    ":" + myDate.getMilliseconds()

        $scope.date.push(temp);
        $scope.ip.push(app.data[i].ip);
        $scope.hostAdd.push(app.data[i].host);
      }
      
      $scope.unique_hostAdd = $scope.hostAdd.unique();
      $scope.unique_hostAdd.push("ALL");
      $scope.dropDown = $scope.unique_hostAdd[$scope.unique_hostAdd.length - 1];

     $scope.gmailData['max'] = Math.max.apply(null, $scope.gmailSeries);
      $scope.gmailData['min'] = Math.min.apply(null, $scope.gmailSeries);
      $scope.gmailData['avg'] = ($scope.gmailSeries.reduce(function(a,b) {return a + b;}) / $scope.gmailSeries.length).toFixed(2);
      
      $scope.googleData['max'] = Math.max.apply(null, $scope.googleSeries);
      $scope.googleData['min'] = Math.min.apply(null, $scope.googleSeries);
      $scope.googleData['avg'] = ($scope.googleSeries.reduce(function(a,b) {return a + b;}) / $scope.googleSeries.length).toFixed(2);
      
      $scope.codeData['max'] = Math.max.apply(null, $scope.codeSeries);
      $scope.codeData['min'] = Math.min.apply(null, $scope.codeSeries);
      $scope.codeData['avg'] = ($scope.gmailSeries.reduce(function(a,b) {return a + b;}) / $scope.gmailSeries.length).toFixed(2);
      
      $scope.reviewData['max'] = Math.max.apply(null, $scope.reviewSeries);
      $scope.reviewData['min'] = Math.min.apply(null, $scope.reviewSeries);
      $scope.reviewData['avg'] = ($scope.codeSeries.reduce(function(a,b) {return a + b;}) / $scope.codeSeries.length).toFixed(2);

      $scope.totalData['max'] = Math.max.apply(null, $scope.total);
      $scope.totalData['min'] = Math.min.apply(null, $scope.total);
      $scope.totalData['avg'] = ($scope.total.reduce(function(a,b) {return a + b;}) / $scope.total.length).toFixed(2);

      $scope.chartSeries = [
        {"name": "Gmail", "color": "#E77471", "data": $scope.gmailSeries},
        {"name": "Google", "color": "#3EA055", "data": $scope.googleSeries},
        {"name": "Code", "color": "#1589FF", "data": $scope.codeSeries},
        {"name": "Review", "color": "#7D0541", "data": $scope.reviewSeries},
        {"name": "Total", "color": "#657383", "data": $scope.total, type: "line"}
      ];

      $scope.chartConfig = {
        options: {
          chart: {
            type: 'column'
          },
          events: {
            redraw: function() {
                alert ('The chart is being redrawn');
            }
          },
          plotOptions: {
            series: {
              stacking: ''
            }
          }
        },
        series: $scope.chartSeries,
        title: {
          text: 'Internet Speed and Stability Monitoring - ALL'
        },
        credits: {
          enabled: true
        },
        xAxis: {
          title: {text: 'Time - Last 1 Hour'},
          categories: $scope.date,
          labels: {
              enabled: false
          },
          tickColor: '#FFFFFF',
        },
        yAxis: {
          currentMin: 0,
          currentMax: 15000,
          title: {text: 'Load Time (milliseconds)'}
        },
        useHighStocks: false,
        loading: false,
        size: {}
      }

      $scope.reflow = function () {
        $scope.$broadcast('highchartsng.reflow');
      };

      $scope.selectAction = function() {
        $scope.chartConfig.loading = true;
        $scope.chartConfig.title.text = "Internet Speed and Stability Monitoring - " + $scope.dropDown;
        $http.post("http://<SERVER IP>:3000/hostData", {"host" : $scope.dropDown, "time" : $scope.tab}).success(function(result) {
          app.data = result;
          switch ($scope.tab) {
            case "1":
              updateData(true, "Last 1 Hour");
              break;
            case "2":
              updateData(false, "Today");
              break;
            case "3":
              updateData(false, "Last 3 Days");
              break;
            case "4":
              updateData(false, "Last 7 Days");
              break;
            case "5":
              updateData(false, "Last 30 Days");
              break;
            case "6":
              updateData(false, "Last 60 Days");
              break;
            case "7":
              updateData(false, "Last 90 Days");
              break;
          } 
        })
      };

      $scope.selectTab = function(setTab) {
        $scope.chartConfig.loading = true;
        $scope.chartConfig.title.text = "Internet Speed and Stability Monitoring - " + $scope.dropDown;
        $http.post("http://<SERVER IP>:3000/hostData", {"host" : $scope.dropDown, "time" : setTab}).success(function(result) {
          app.data = result;
          switch (setTab) {
            case "1":
              updateData(true, "Last 1 Hour");
              break;
            case "2":
              updateData(false, "Today");
              break;
            case "3":
              updateData(false, "Last 3 Days");
              break;
            case "4":
              updateData(false, "Last 7 Days");
              break;
            case "5":
              updateData(false, "Last 30 Days");
              break;
            case "6":
              updateData(false, "Last 60 Days");
              break;
            case "7":
              updateData(false, "Last 90 Days");
              break;
          }
        })
        $scope.tab = setTab;
      };

      $scope.isSelected = function(checkTab) {
        return $scope.tab === checkTab;
      };

    });

    Array.prototype.unique = function()
    {
        var tmp = {}, out = [];
        for(var i = 0, n = this.length; i < n; ++i)
        {
            if(!tmp[this[i]]) { tmp[this[i]] = true; out.push(this[i]); }
        }
        return out;
    }

    function updateData(seriesFlag, xAxisText) {
      $scope.gmailSeries = [];
      $scope.googleSeries = [];
      $scope.codeSeries = [];
      $scope.reviewSeries = [];
      $scope.date = [];
      $scope.total = [];

      $scope.gmailData = {};
      $scope.googleData = {};
      $scope.codeData = {};
      $scope.reviewData = {};
      $scope.totalData = {};

      for(var i=0; i < app.data.length; i++) {
        $scope.googleSeries.push(parseInt(app.data[i].google));
        $scope.gmailSeries.push(parseInt(app.data[i].gmail));
        $scope.codeSeries.push(parseInt(app.data[i].code)); 
        $scope.reviewSeries.push(parseInt(app.data[i].review));
        $scope.total.push(parseInt(app.data[i].google) + parseInt(app.data[i].gmail) +
          parseInt(app.data[i].review) + parseInt(app.data[i].code));
        
        var myDate = new Date(app.data[i].date);
        var temp = myDate.getDate() + "/" + (myDate.getMonth()+1) + "/" + myDate.getFullYear() + "  " + myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds() + 
                    ":" + myDate.getMilliseconds()
        $scope.date.push(temp);
        $scope.ip.push(app.data[i].ip);
      }

      $scope.unique_ip = $scope.ip.unique();

      $scope.gmailData['max'] = Math.max.apply(null, $scope.gmailSeries);
      $scope.gmailData['min'] = Math.min.apply(null, $scope.gmailSeries);
      $scope.gmailData['avg'] = ($scope.gmailSeries.reduce(function(a,b) {return a + b;}) / $scope.gmailSeries.length).toFixed(2);
      
      $scope.googleData['max'] = Math.max.apply(null, $scope.googleSeries);
      $scope.googleData['min'] = Math.min.apply(null, $scope.googleSeries);
      $scope.googleData['avg'] = ($scope.googleSeries.reduce(function(a,b) {return a + b;}) / $scope.googleSeries.length).toFixed(2);
      
      $scope.codeData['max'] = Math.max.apply(null, $scope.codeSeries);
      $scope.codeData['min'] = Math.min.apply(null, $scope.codeSeries);
      $scope.codeData['avg'] = ($scope.gmailSeries.reduce(function(a,b) {return a + b;}) / $scope.gmailSeries.length).toFixed(2);
      
      $scope.reviewData['max'] = Math.max.apply(null, $scope.reviewSeries);
      $scope.reviewData['min'] = Math.min.apply(null, $scope.reviewSeries);
      $scope.reviewData['avg'] = ($scope.codeSeries.reduce(function(a,b) {return a + b;}) / $scope.codeSeries.length).toFixed(2);

      $scope.totalData['max'] = Math.max.apply(null, $scope.total);
      $scope.totalData['min'] = Math.min.apply(null, $scope.total);
      $scope.totalData['avg'] = ($scope.total.reduce(function(a,b) {return a + b;}) / $scope.total.length).toFixed(2);

      if(seriesFlag) {
        $scope.chartSeries = [
          {"name": "Gmail", "color": "#E77471", "data": $scope.gmailSeries},
          {"name": "Google", "color": "#3EA055", "data": $scope.googleSeries},
          {"name": "Code", "color": "#1589FF", "data": $scope.codeSeries},
          {"name": "Review", "color": "#7D0541", "data": $scope.reviewSeries},
          {"name": "Total", "color": "#657383", "data": $scope.total, type: "line"}
        ];  
      } else {
        $scope.chartSeries = [
          {"name": "Total", "color": "#657383", "data": $scope.total, type: "line"}
        ];
      }
      
      $scope.chartConfig.xAxis.title.text = "Time - " + xAxisText;
      $scope.chartConfig.series = $scope.chartSeries;
      $scope.chartConfig.xAxis.categories = $scope.date;
      $scope.chartConfig.loading = false;
    }
  }) 
})();
