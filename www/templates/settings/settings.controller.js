angular.module('starter')
.controller('settingsCtrl', function ($scope,$ionicPlatform,$state,$rootScope) {
	var originLangModified=false;
	var destLangModified=false;
	$ionicPlatform.ready(function() {
		$scope.languages={}
		$scope.languages.originLang=$rootScope.originLang;
		console.log(JSON.stringify($rootScope.originLang))
		if($rootScope.originLang){
		 $scope.defaultOriginLang=$rootScope.originLang.lang;
		}
		else{
			originLangModified=true;
		}
		if($rootScope.destLang){
			$scope.languages.destLang=$rootScope.destLang;
		}
		else{
			destLangModified=true;
		}
		$scope.languages.speed=$rootScope.ttsSpeed*10;
		// console.log(JSON.stringify($scope.languages.originLang.lang))
		// window.plugins.speechRecognition.getSupportedLanguages(function(result){
			$scope.availableLang=[];
			$scope.availableLangOrigin=[]
			// if (result.indexOf('en-US')){
				$scope.availableLang.push({lang:"English",code:"en-US"})	
				$scope.availableLangOrigin.push({lang:"English",code:"en-US"})	
			// }
			// if (result.indexOf('es-ES')){
			// 	$scope.availableLang.push({lang:"Spanish",code:"es-ES"})	
			// }
			// if (result.indexOf('fr-FR')){
				$scope.availableLang.push({lang:"Français",code:"fr-FR"})
				$scope.availableLangOrigin.push({lang:"Français",code:"fr-FR"})	
			// }
			// if (result.indexOf('de-DE')){
			// 	$scope.availableLang.push({lang:"Deutsch",code:"de-DE"})	
			// }
			// if (result.indexOf('pt-PT')){
			// 	$scope.availableLang.push({lang:"Portugese",code:"pt-PT"})	
			// }
			// console.log(JSON.stringify($scope.availableLang))
			$scope.languages.speed=window.localStorage.getItem("ttsspeed")*10||10
		// },function(){})
	})
	$scope.changeOriginLang = function(){
		$scope.languages.originLang=undefined;
		originLangModified=true;
	}
	$scope.changeDestLang = function(){
		$scope.languages.destLang=undefined;
		destLangModified=true;
	}
	$scope.save = function(){
		console.log("save")
		console.log($scope.languages.originLang)
		console.log($scope.languages.destLang)
		console.log($scope.languages.speed)
		if (originLangModified){
			window.localStorage.setItem( "originlang", $scope.languages.originLang );
			$rootScope.originLang=$scope.languages.originLang
			$rootScope.displayLang=$rootScope.originLang.lang
		}
		if(destLangModified){
			window.localStorage.setItem( "destlang", $scope.languages.destLang );
			$rootScope.destLang=$scope.languages.destLang
		}
		window.localStorage.setItem( "ttsspeed", $scope.languages.speed/10 );
		$rootScope.ttsSpeed=$scope.languages.speed/10
		$state.go("home", {}, { reload: true })
	}
}) 	