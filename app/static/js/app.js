var owsr = angular.module('owsr', ['ngCookies'])
    .config( [
        '$compileProvider',
        function( $compileProvider )
        {
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|data|chrome-extension):/);
            // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
        }
    ])
    .filter('arrayToList', function(){
        return function(arr) {
            return arr.join(', ');
        }
    })
    .controller('mainController', ['$scope', '$http', '$cookies', '$rootScope', '$window', function ($scope, $http, $cookies, $rootScope, $window) {
        $scope.page = 1;
        $scope.users = ['craig', 'josh'];
        $scope.types = ['Assault', 'Escort', 'Hybrid', 'Control'];
        $scope.maps = {
            'Assault':['Hanamura', 'Temple of Anubis', 'Volskaya Industries'],
            'Escort':['Dorado', 'Route 66', 'Watchpoint: Gibraltar'],
            'Hybrid': ['Eichenwalde', 'Hollywood', "King's Row", "Numbani"],
            "Control": ['Illios', 'Lijiang Tower', 'Nepal', 'Oasis'],
            "": []
        };
        $scope.characters = [
            'Genji',
            'McCree',
            'Pharah',
            "Reaper",
            "Soldier: 76",
            "Sombra",
            "Tracer",
            "Bastion",
            "Hanzo",
            "Junkrat",
            "Mei",
            "Torbjorn",
            "Widowmaker",
            "D.Va",
            "Orisa",
            "Reinhardt",
            "Roadhog",
            "Winston",
            "Zarya",
            "Ana",
            "Lucio",
            "Mercy",
            "Symmetra",
            "Zenyatta"
        ];

        $scope.addEntry = function () {
            $scope.time = new Date();
            $http({
              method: 'POST',
              url: '/addEntry',
              data: {
                  "user": $scope.user,
                  "type": $scope.gameType,
                  "map": $scope.gameMap,
                  "characters": $scope.gameCharacters,
                  "result": $scope.gameResult,
                  "sr": $scope.gameSR,
                  "notes": $scope.gameNotes,
                  "time": $scope.time
              }
            }).then(function success(response) {
              alert("Success!");
              $scope.load($scope.user);
            }, function error(response){
              alert('Error!')
            })
        };

        $scope.load = function (user) {
            $scope.user = user;
          $scope.showEntries();
          $scope.showGraph();
        };

        $scope.showGraph = function () {
            $http({
                method: 'POST',
                url: '/getData',
                data: {
                    "user": $scope.user
                }
            }).then(function success(response){
               console.log(response);
               d3.selectAll("svg > *").remove();
               sr = [];
               i = 0;
               response["data"]["results"].forEach(function (res) {
                   console.log(res);
                   sr.push({"x":i, "y":res["sr"]});
                   i += 1;
               });
               console.log(sr);
               /* implementation heavily influenced by http://bl.ocks.org/1166403 */

                    // Add an SVG element with the desired dimensions and margin.
                    var svg = d3.select("svg"),
                        margin = {top: 20, right: 20, bottom: 30, left: 50},
                        width = +svg.attr("width") - margin.left - margin.right,
                        height = +svg.attr("height") - margin.top - margin.bottom,
                        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                   var x = d3.scaleLinear()
                        .rangeRound([0, width]);

                    var y = d3.scaleLinear()
                        .rangeRound([height, 0]);

                    var line = d3.line()
                        .x(function(d) { return x(d.x); })
                        .y(function(d) { return y(d.y); });

                   x.domain(d3.extent(sr, function(d) { return d.x; }));
                  y.domain(d3.extent(sr, function(d) { return d.y; }));

                  g.append("g")
                      .attr("transform", "translate(0," + height + ")")
                      .call(d3.axisBottom(x).ticks(sr.length - 1))
                    .select(".domain")
                      .remove();

                  g.append("g")
                      .call(d3.axisLeft(y))
                    .append("text")
                      .attr("fill", "#000")
                      .attr("transform", "rotate(-90)")
                      .attr("y", 6)
                      .attr("dy", "0.71em")
                      .attr("text-anchor", "end")
                      .text("SR");

                  g.append("path")
                      .datum(sr)
                      .attr("fill", "none")
                      .attr("stroke", "steelblue")
                      .attr("stroke-linejoin", "round")
                      .attr("stroke-linecap", "round")
                      .attr("stroke-width", 1.5)
                      .attr("d", line);


            }, function error(response) {

            });
        };

        $scope.showEntries = function () {
            $http({
                method: 'POST',
                url: '/getData',
                data: {
                    "user": $scope.user
                }
            }).then(function success(response){
                console.log(response);
                $scope.entries = response["data"]["results"]
            }, function error(response) {

            });
        };

        $scope.exportData = function () {
              var jsonData = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({"entries":$scope.entries}));

              $scope.jsonUrl = 'data:' + jsonData;
        };

        $scope.signout = function () {
            $cookies.remove('login');
            $window.location.href = '/';
        };

        $scope.checkLoggedIn = function () {
            $rootScope.login = angular.fromJson($cookies.getObject('login'));
            if(typeof $rootScope.login !== 'undefined') {
                $scope.user = $rootScope.login.user;
                $scope.load($scope.user);
            } else {
                $window.location.href = '/';
            }
        };
        $scope.checkLoggedIn();
    }])
    .controller('loginController', ['$scope', '$http', '$cookies', '$rootScope', '$window', function ($scope, $http, $cookies, $rootScope, $window) {
        $scope.signin = true;

        $scope.signin = function () {
            $http({
                method: 'POST',
                url: '/login',
                data: {
                    "user": $scope.user
                }
            }).then(function successCallback(response) {
                $rootScope.user = $scope.user;
                $cookies.putObject("login",
                    {
                        'user': $scope.user
                    }
                );
                $window.location.href = '/home';
            }, function errorCallback(response) {
                $scope.signin = false;
            });
        };

        $scope.register = function () {
            $http({
                method: 'POST',
                url: '/register',
                data: {
                    "user": $scope.user,
                    "sr": $scope.sr
                }
            }).then(function successCallback(response) {
                $rootScope.user = $scope.user;
                $cookies.putObject("login",
                    {
                        'user': $scope.user
                    }
                );
                $window.location.href = '/home';
            }, function errorCallback(response) {
                $scope.failedRegister = true;
            });
        };

        $scope.checkLoggedIn = function () {
            $rootScope.login = angular.fromJson($cookies.getObject('login'));
            if(typeof $rootScope.login !== 'undefined') {
                $rootScope.user = $rootScope.login['user'];
                $window.location.href = '/home';
            }
        };
        $scope.checkLoggedIn();
    }]);