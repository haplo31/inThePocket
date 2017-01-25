angular.module('starter')
.controller('settingsCtrl', function ($scope,$ionicPlatform,$state,$rootScope,$localstorage) {

	$ionicPlatform.ready(function() {
		$scope.languages={}
		$scope.languages.originLang=$rootScope.originLang;
		// console.log(JSON.stringify($rootScope.originLang))
		if($rootScope.originLang){
		 $scope.defaultOriginLang=$rootScope.originLang.lang;
		}
		else{
			$scope.originLangModified=true;
		}
		if($rootScope.destLang){
			$scope.languages.destLang=$rootScope.destLang;
		}
		else{
			$scope.destLangModified=true;
		}
		$scope.spell={}
		if($rootScope.spellSentences === 'true')
		$scope.spell.checked=true;
		// console.log(typeof $scope.spell.checked)
		$scope.languages.speed=$rootScope.ttsSpeed*10;
			// $scope.spellSentences={checked:true}

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
			$scope.languages.speed=$localstorage.get("ttsspeed")*10||10
		// },function(){})
	})
	$scope.changeOriginLang = function(){
		// $scope.languages.originLang=undefined;
		$scope.originLangModified=true;
	}
	$scope.changeDestLang = function(){
		// $scope.languages.destLang=undefined;
		$scope.destLangModified=true;
	}
	$scope.spellToggle={};
	$scope.save = function(){
		 console.log(JSON.stringify($scope.spell))
		 console.log("save")
		// console.log(typeof $scope.languages.originLang)
		// console.log(typeof $scope.languages.destLang)
		// console.log($scope.languages.speed)
		if ($scope.originLangModified){
			$localstorage.setObject("originlang", JSON.parse($scope.languages.originLang) );
			$rootScope.originLang=$scope.languages.originLang
			$rootScope.displayLang=$rootScope.originLang.lang
		}
		if($scope.destLangModified){
			$localstorage.setObject( "destlang", JSON.parse($scope.languages.destLang) );
			$rootScope.destLang=$scope.languages.destLang
		}
		if(($scope.spell)&&($scope.spell.checked === true)){
			$localstorage.set( "spell", 'true' );
			$rootScope.spellSentences=true;
		}
		else{
			$localstorage.set( "spell", 'false' );
			$rootScope.spellSentences=false;	
		}
		$localstorage.set( "ttsspeed", $scope.languages.speed/10 );
		$rootScope.ttsSpeed=$scope.languages.speed/10
		$state.go("home", {}, { reload: true })
	}
}) 	