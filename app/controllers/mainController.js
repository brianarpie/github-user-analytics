(function() {

  "use strict";

  var app = angular.module("GithubUserAnalyticsApp");

  app.controller("MainController", [
    "$scope",
    "GithubApiResource",
    function($scope, GithubApiResource) {

      function generateAlphabetMap() {
        var alphabetMap = [];
        for ( var i = 'a'.charCodeAt(0), end = 'z'.charCodeAt(0); i <= end; ++i ) {
          alphabetMap.push({ letter:String.fromCharCode(i), count:0 });
        }
        // add the 'other' object
        alphabetMap.push({ letter:"other", count:0 });

        return alphabetMap;
      }

      function populateMapByLetterCount(map, data) {
        _.each(data, function(datum) {
          _.each(datum.toLowerCase(), function(character) {
            if (_.isEmpty(_.findWhere(map, { letter: character }))) {
              character = "other"
            }
            _.findWhere(map, { letter: character }).count++; 
          });
        });

        return map;
      }

      $scope.submitQuery = function(queryString) {
        GithubApiResource.query({
          query: queryString
        }).$promise.then(function(response) {
          // handle the response
          var topFiveLogins = _.chain(response.items)
                               .sortBy("login")
                               .pluck("login")
                               .value()
                               .slice(0, 5);

          var alphabetMap = generateAlphabetMap();
          $scope.chartData = populateMapByLetterCount(alphabetMap, topFiveLogins);
          $scope.selectedQueryString = queryString;

          // reset the query string after processing response
          $scope.queryString = "";
        });
      };
    
      function init() {

      }

      init();
    }
  ]);

})();
