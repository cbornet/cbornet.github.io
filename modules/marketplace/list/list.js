angular.module('marketplace.list', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/list', {
    templateUrl: 'marketplace/list/list.html',
    controller: 'ModuleListCtrl'
  });
}])

marketplaceApp.controller('ModuleListCtrl', function ($scope, $http, $location, $filter) {
  $http.get('marketplace/data/modules.json').success(function(data) {
    $scope.modules = data;
    var modulesList= '';
    var getInfo = function(module) {
        $http.get(module.npmPackagePath).success(function (npminfo) {
            module.npminfo = npminfo;
            if (angular.isString(npminfo.author)) {
                var re = /^([^<(]+?)?[ \t]*(?:<([^>(]+?)>)?[ \t]*(?:\(([^)]+?)\)|$)/gm;
                var author = re.exec(npminfo.author);
                module.npminfo.author = { name: author[1] || '',
                    email: author[2] || '',
                    url: author[3] || ''
                };
            }
        });
    }

    for (var i = 0; i < $scope.modules.length; i++) {
        var module = $scope.modules[i];
        modulesList += module.npmPackageName + ',';
        getInfo(module);
    }
    $http.get('https://api.npmjs.org/downloads/point/last-month/' + modulesList).success(function(data) {
        for (var i = 0; i < $scope.modules.length; i++) {
            var module = $scope.modules[i];
            var npmstats = data[module.npmPackageName];
            if (npmstats != undefined) {
                module.downloads = npmstats.downloads;
            } else {
                module.downloads = 0;
            }
        }
    });
  });

  $scope.details = function(npmPackageName) {
    $location.path('/details/' + npmPackageName);
  };
});
