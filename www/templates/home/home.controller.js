angular.module('starter')
.controller('homeCtrl', function ($ionicPlatform,$scope,$rootScope,$http,$state,$localstorage) {
	$ionicPlatform.ready(function() {
		console.log("Home")
		// console.log(JSON.stringify($rootScope.originLang))
  	// console.log(JSON.stringify($rootScope.destLang))
		var originLang=$localstorage.get( "originlang");
	  var destLang=$localstorage.get( "destlang");
	  var ttsSpeed=$localstorage.get( "ttsspeed");
	  // console.log(JSON.parse(originLang))
	  // console.log(originLang)
	  // console.log(destLang)
	  // console.log(ttsSpeed)
	  if ((!originLang) && (!destLang) && (!ttsSpeed)){
	  	console.log("notFound")
	  	var langCode=window.navigator.language;
			switch(langCode){
				case "fr-FR":
					$rootScope.displayLang="Français";
				break;
				case "en-US":
					$rootScope.displayLang="English";
				break;
				// case "pt-PT":
				// 	$rootScope.displayLang="Portugese"
				// break;
				// case "es-ES":
				// 	$rootScope.displayLang="Spanish";
				// break;
				default:
					$rootScope.displayLang="English";
				break;
			}
			$localstorage.set( "utilisationtime", 0 );
			$localstorage.set( "trainingsended", 0 );
			$localstorage.set( "pronouncedsentences", 0 );									
	  	$state.go("settings")
	  }
	  else{
			console.log("found")
	  	console.log(originLang)
	  	$rootScope.originLang=JSON.parse(originLang)
	  	$rootScope.displayLang=$rootScope.originLang.lang;	
	  	$rootScope.destLang=JSON.parse(destLang)
	  	$rootScope.ttsSpeed=ttsSpeed
		}
		$http.get('appdata/displayText.json')
  	.success(function (data) {
      // The json data will now be in scope.
      $rootScope.dT = data;
  	});
	}) 
})