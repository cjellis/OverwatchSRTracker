var owsr = angular.module('owsr', [])
    .controller('mainController', ['$scope', '$http', function ($scope, $http) {
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
              alert("Success!")
            }, function error(response){
              alert('Error!')
            })
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
                      .call(d3.axisBottom(x))
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
        }
    }]);