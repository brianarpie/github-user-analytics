(function() {

  "use strict";

  var app = angular.module("GithubUserAnalyticsApp");

  app.factory("GithubApiResource", [
    "$resource",
    "$cacheFactory",
    function($resource, $cacheFactory) {
      var githubApiResource;
      var route = "https://api.github.com/search/users?q=:query";
      var cache = $cacheFactory.get("GithubApiResource");

      if ( !cache ) {
        cache = $cacheFactory("GithubApiResource");
      }

      githubApiResource = $resource(route, {}, {
        // override the default action query for $resource
        'query': {
          method: 'GET',
          cache: cache
        }
      });

      return githubApiResource;

    }
  ]);

})();
