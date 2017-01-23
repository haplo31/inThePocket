angular.module('starter')
.controller('statsCtrl', function ($ionicPlatform,$scope,$rootScope,$http,$state,$localstorage) {
	$ionicPlatform.ready(function() {
		// $rootScope.displayLang="Français";
		// $http.get('appdata/displayText.json')
  // 	.success(function (data) {
  //     // The json data will now be in scope.
  //     $rootScope.dT = data;
  // 	});
  	$scope.bestScore=$localstorage.getObject("quickscore");
  	console.log("bestScore")
  	console.log(JSON.stringify($scope.bestScore))
  	$scope.utilisationTime=$localstorage.get( "utilisationtime");
  	$scope.pronouncedSentences=$localstorage.get("pronouncedsentences")
  	$scope.trainingsEnded=$localstorage.get("trainingsended")
  	})
})