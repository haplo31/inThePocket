angular.module('starter')
.controller('quickCtrl', function ($scope,$timeout,$http,$rootScope,$interval,$localstorage) {


	// 	$http.get('appdata/displayText.json')
 //  .success(function (data) {
 //      // The json data will now be in scope.
 //      $rootScope.dT = data;
 //  });
	//   var originLang=$localstorage.get( "originlang");
 //  var destLang=$localstorage.get( "destlang");
 //  var ttsSpeed=$localstorage.get( "ttsspeed");
 //  // console.log(JSON.parseoriginLang)
 //  // console.log(destLang)
 //  if ((originLang) && (destLang) && (ttsSpeed)){
 //  	$rootScope.originLang=JSON.parse(originLang)
 //  	$rootScope.displayLang=$rootScope.originLang.lang;	
 //  	$rootScope.destLang=JSON.parse(destLang)
 //  	$rootScope.ttsSpeed=ttsSpeed
 //  }
	// $rootScope.displayLang="English"



	$scope.topicsAvailable=["house","transports","nature","body","health","clothing","computers","sports","food","animals"]
	var sentences;
  $http.get('appdata/sentences.json')
  .success(function (data) {
      sentences = data.sentences;
      $scope.sentencesAvailable=0;
			for (var i = 0; i < $scope.topics.selected.length; i++) {
				// console.log(JSON.stringify($scope.topics.selected[i]))
				// console.log(sentences[$scope.topics.selected[i]])
				$scope.sentencesAvailable+=sentences[$scope.topics.selected[i]].length;
			};
			$scope.totalSentencesAvailable=0;
			console.log(sentences)
			for (var i = 0; i < $scope.topicsAvailable.length; i++) {
				$scope.totalSentencesAvailable+=sentences[$scope.topicsAvailable[i]].length;
			};
  });
	$scope.topics=$localstorage.getObject("topics");
	if(!$scope.topics.selected){
		$scope.topics.selected=["house","transports","nature","body","health","clothing","computers","sports","food","animals"]
	}
	$scope.changeTopic = function(topic){
		if($scope.topics.selected.indexOf(topic)>=0){
			$scope.topics.selected.splice($scope.topics.selected.indexOf(topic),1)
			$scope.sentencesAvailable-=sentences[topic].length;
		}
		else{
			$scope.topics.selected.push(topic)	
			$scope.sentencesAvailable+=sentences[topic].length;
		}
		$localstorage.setObject("topics",$scope.topics)
	}

	$scope.difficulty="easy";
	$scope.training={
		duration:0
	}
	var permissionGranted=false;
	var options = {
		language:$rootScope.destLang.code,
		showPopup:true
	}
	var elapsedTime;
	var saveTrainingTime = function(){
		elapsedTime = $interval(function(){
			if($scope.trainingLaunched === true){
				var newTime=$localstorage.get( "utilisationtime");
				newTime++;
				$localstorage.set( "utilisationtime", newTime );
			}
			else{
				$interval.cancel(elapsedTime);
				elapsedTime=undefined;
			}
		},60000)
	}
	var textToSpeech= function(text){
		console.log(text)
		if ($scope.timeElapsed === false){
			TTS.speak({
	        text: text[$rootScope.destLang.lang],
	        locale: $rootScope.destLang.code,
	        rate: $rootScope.ttsSpeed
	    },
	    function(){
	    	if ($rootScope.spellSentences === 'true'){
		    	$timeout(function(){
			    	var spell=text[$rootScope.destLang.lang].replace(' ','|').split('').join(' ; ').replace('|',$rootScope.dT.quick.space[$rootScope.originLang.lang])
						TTS.speak({
				        text: spell,
				        locale: $rootScope.originLang.code,
				        rate: $rootScope.ttsSpeed
				    },
				    function(){
				    	launchSpeechReco(text);
				    },function(){})	    	
		    	},800)
	    	}
	    	else{
	    		launchSpeechReco(text);
	    	}
	    },
	    function(){
	    	console.log("error on tts:"+text)
	    })
		}
		else{
			console.log("Training ended")
			endOfTraining();
		}
	}
	var launchSpeechReco= function(text){
		$timeout(function(){
			window.plugins.speechRecognition.startListening(
	  	function(result){
	  		console.log("reco launched")
	  		$scope.recognizedText=result[0].toLowerCase();
	  		var tempResult= result[0].toLowerCase();
	  		var tempText= text[$rootScope.destLang.lang].toLowerCase();
	  		console.log(JSON.stringify(result))
	  		$scope.$apply()

	  		if(tempResult.indexOf($rootScope.dT.quick.skip[$rootScope.destLang.lang].toLowerCase())>=0){   			
	  			$scope.skip++;
	  			TTS.speak({
		        text: $rootScope.dT.quick.vocalSentences.skip[$rootScope.displayLang],
		        locale: $rootScope.originLang.code,
		        rate: $rootScope.ttsSpeed
			    },
			    function(){
			    	var selectedTopic=$scope.topics.selected[Math.floor(Math.random()*$scope.topics.selected.length)];
			    	$scope.currentSentence=sentences[selectedTopic][Math.floor(Math.random()*sentences[selectedTopic].length)];
			    	$scope.recognizedText=undefined;
			    	$scope.$apply()
						textToSpeech($scope.currentSentence)
			    },function(){})
			  }
			  else if(tempResult.indexOf($rootScope.dT.quick.translate[$rootScope.destLang.lang].toLowerCase())>=0){    			
	  			TTS.speak({
		        text: $rootScope.dT.quick.vocalSentences.translate[$rootScope.displayLang]+text[$rootScope.originLang.lang],
		        locale: $rootScope.originLang.code,
		        rate: $rootScope.ttsSpeed
			    },
			    function(){
			    	// $scope.currentSentence=sentences[Math.floor(Math.random()*sentences.length)];
			    	$scope.recognizedText=undefined;
			    	$scope.$apply()
						textToSpeech($scope.currentSentence)
			    },function(){})
			  }
			  else if(result.indexOf(tempText)>=0){
			  	$scope.good++;
	  			console.log("Good")
	  			$scope.recognizedText=undefined;
	  			$scope.$apply()
	  			var newPronouncedSentences= $localstorage.get("pronouncedsentences");
	  			newPronouncedSentences++;
	  			$localstorage.set("pronouncedsentences",newPronouncedSentences)
	  			TTS.speak({
			        text: $rootScope.dT.quick.vocalSentences.good[$rootScope.originLang.lang],
			        locale: $rootScope.originLang.code,
			        rate: $rootScope.ttsSpeed
			    },
			    function(){
			    	var selectedTopic=$scope.topics.selected[Math.floor(Math.random()*$scope.topics.selected.length)];
			    	$scope.currentSentence=sentences[selectedTopic][Math.floor(Math.random()*sentences[selectedTopic].length)];
			    	// $scope.recognizedText=undefined;
			    	$scope.$apply()
						textToSpeech($scope.currentSentence)
			    },function(){})
			  }
			  else{
			  	console.log("Bad")
	  			$scope.bad++;
	  			$scope.$apply()
	  			TTS.speak({
			        text: $rootScope.dT.quick.vocalSentences.bad1[$rootScope.originLang.lang],
			        locale: $rootScope.originLang.code,
			        rate: $rootScope.ttsSpeed
			    },function(){
						TTS.speak({
				        text: result[0],
				        locale: $rootScope.destLang.code,
				        rate: $rootScope.ttsSpeed
				    },function(){
				    	TTS.speak({
			        	text: $rootScope.dT.quick.vocalSentences.bad2[$rootScope.originLang.lang],
			        	locale: $rootScope.originLang.code,
			        	rate: $rootScope.ttsSpeed
			    		},function(){
			    			textToSpeech(text)
			    		},function(){})
				    },function(){})
			    },function(){})
	  		}
	  	},
	  	function(error){
	  		console.log("error on Speech reco"+error)
	  		TTS.speak({
        	text: $rootScope.dT.quick.vocalSentences.errorReco[$rootScope.originLang.lang],
        	locale: $rootScope.originLang.code,
        	rate: $rootScope.ttsSpeed
    		},function(){
    			$timeout(function(){if($scope.trainingLaunched){textToSpeech($scope.currentSentence)}},1000)
    		},function(){})
	  	},
	  	options)
		},200)		
	}
	var endOfTraining = function(){
		var currentScore=$scope.good*5+($scope.good+$scope.bad/2)
	  var quickScore=$localstorage.getObject("quickscore");
		if ((quickScore.score)&&(quickScore.score<currentScore)){
			$localstorage.setObject( "quickscore", {date:Date.now(),score:currentScore,good:$scope.good,skip:$scope.skip,bad:$scope.bad});
			$scope.bestScore=true;
		}
		else if(!quickScore.score){
			$localstorage.setObject( "quickscore", {date:Date.now(),score:currentScore,good:$scope.good,skip:$scope.skip,bad:$scope.bad});
			$scope.bestScore=true;	
		}
		var newTrainingsEnded= $localstorage.get("trainingsended");
		newTrainingsEnded++;
		$localstorage.set( "trainingsended", newTrainingsEnded);
		var trainingHistory= $localstorage.getObject("traininghistory")
		if(trainingHistory.trainings){
			trainingHistory.trainings.push({date:Date.now(),score:currentScore,good:$scope.good,skip:$scope.skip,bad:$scope.bad})
		}
		else{
			trainingHistory.trainings=[];
			trainingHistory.trainings.push({date:Date.now(),score:currentScore,good:$scope.good,skip:$scope.skip,bad:$scope.bad})
		}
		$localstorage.setObject("traininghistory",trainingHistory);
		$scope.trainingLaunched=false;
		$scope.trainingLaunching=false;
		$scope.trainingEnded=true;
		$scope.$apply()
		if(($scope.good > 1)&&($scope.bad>1)){
			TTS.speak({
	      text: $rootScope.dT.quick.vocalSentences.endedTraining1[$rootScope.displayLang]+$scope.good+$rootScope.dT.quick.vocalSentences.endedTraining2[$rootScope.displayLang]+$scope.bad+$rootScope.dT.quick.vocalSentences.endedTraining3[$rootScope.displayLang],
	      locale: $rootScope.originLang.code,
	      rate: 1
			},function(){
			},function(){})
		}
	}
	$scope.trainingLaunched=false;
	$scope.bestScore=false;
	$scope.trainingLaunching=false;
	$scope.trainingEnded=false;

// $scope.recognizedText="Blablalbal"
// $scope.currentSentence={Français:"Blklakakla"}
// $scope.skip=5;
// $scope.good=25;

	$scope.launch = function(){
		console.log($scope.training.duration)
		console.log(typeof $scope.training.duration)
		if ($scope.training.duration>0){
			$scope.timeElapsed=false;
			console.log($scope.training.duration)
			$timeout(function(){
				console.log("End of Training Detected")
				$scope.timeElapsed=true;
			},($scope.training.duration*60000))
		}
		saveTrainingTime();
		$scope.bestScore=false;
		$scope.trainingEnded=false;
		$scope.restartOnError=false;
		$scope.trainingLaunching=true;
		$scope.skip=0;
		$scope.good=0;
		$scope.bad=0;
		$scope.timeElapsed=false;
		$scope.verifyingPermissions=false;
		$scope.launchingTTS=false;
		if (window.cordova) {
			window.plugins.speechRecognition.requestPermission(function(){
					console.log("permission granted")
					options = {
						language:$rootScope.destLang.code,
						showPopup:false
					}
					$scope.verifyingPermissions=true;
					$scope.$apply()
					window.plugins.speechRecognition.isRecognitionAvailable(function(){
						console.log("recognition available")
						var selectedTopic=$scope.topics.selected[Math.floor(Math.random()*$scope.topics.selected.length)];
						$scope.currentSentence=sentences[selectedTopic][Math.floor(Math.random()*sentences[selectedTopic].length)];
						$scope.$apply();
						$scope.launchingTTS=true;
						$scope.$apply()
						// console.log($rootScope.displayLang)
						// console.log($rootScope.destLang)
						TTS.speak({
			        text: $rootScope.dT.quick.skipInstructions[$rootScope.displayLang],
			        locale: $rootScope.originLang.code,
			        rate: 1
    				},function(){TTS.speak({
			        text: $rootScope.dT.quick.skip[$rootScope.destLang.lang],
			        locale: $rootScope.destLang.code,
			        rate: $rootScope.ttsSpeed*0.8
    				},function(){TTS.speak({
			        text: $rootScope.dT.quick.translateInstructions[$rootScope.displayLang],
			        locale: $rootScope.originLang.code,
			        rate: 1
    				},function(){TTS.speak({
			        text: $rootScope.dT.quick.translate[$rootScope.destLang.lang],
			        locale: $rootScope.destLang.code,
			        rate: $rootScope.ttsSpeed*0.8
    				},function(){
    					$timeout(function(){
    						TTS.speak({
					        text: $rootScope.dT.quick.vocalSentences.instructions[$rootScope.displayLang],
					        locale: $rootScope.originLang.code,
					        rate: 1
		    				},function(){
		    					$scope.trainingLaunched=true;
		    					$scope.trainingLaunching=false;
		    					$scope.$apply()
		    					textToSpeech($scope.currentSentence)
		    				},function(){
		    					$scope.restartOnError=true;
		    					$scope.$apply()
		    				})
    					},500)
    				},function(){})},function(){})},function(){})},function(){})
					},
					function(){
						$scope.restartOnError=true;
						$scope.$apply()
						console.log("recognition not available")
					})
				},
				function(error){
					$scope.restartOnError=true;
					$scope.$apply()
					console.log(error)
					console.log("permission denied")
			})
    }
	}
	$scope.stop = function(){
		$scope.timeElapsed=true;
		var currentScore=$scope.good*5+($scope.good+$scope.bad/2)
		var quickScore=$localstorage.getObject("quickscore");
		console.log("quickscore")
		console.log(JSON.stringify(quickScore))
		if ((quickScore.score)&&(quickScore.score<currentScore)){
			$localstorage.setObject( "quickscore", {date:Date.now(),score:currentScore,good:$scope.good,skip:$scope.skip,bad:$scope.bad});
			$scope.bestScore=true;
		}
		else if(!quickScore.score){
			$localstorage.setObject( "quickscore", {date:Date.now(),score:currentScore,good:$scope.good,skip:$scope.skip,bad:$scope.bad});
			$scope.bestScore=true;	
		}
		var newTrainingsEnded= $localstorage.get("trainingsended");
		newTrainingsEnded++;
		$localstorage.set( "trainingsended", newTrainingsEnded);
		var trainingHistory= $localstorage.getObject("traininghistory")
				if(trainingHistory.trainings){
			trainingHistory.trainings.push({date:Date.now(),score:currentScore,good:$scope.good,skip:$scope.skip,bad:$scope.bad})
		}
		else{
			trainingHistory.trainings=[];
			trainingHistory.trainings.push({date:Date.now(),score:currentScore,good:$scope.good,skip:$scope.skip,bad:$scope.bad})
		}
		$localstorage.setObject("traininghistory",trainingHistory);
		$scope.trainingLaunched=false;
		$scope.trainingLaunching=false;
		$scope.trainingEnded=true;
		if(($scope.good > 1)&&($scope.bad>1)){
			TTS.speak({
	      text: $rootScope.dT.quick.vocalSentences.endedTraining1[$rootScope.displayLang]+$scope.good+$rootScope.dT.quick.vocalSentences.endedTraining2[$rootScope.displayLang]+$scope.bad+$rootScope.dT.quick.vocalSentences.endedTraining3[$rootScope.displayLang],
	      locale: $rootScope.originLang.code,
	      rate: 1
			},function(){
			},function(){})	
		}
		// $scope.$apply()
	}
	$scope.goHome = function(){
		if(($scope.trainingLaunching === true)||($scope.trainingLaunched ===true)){
			$scope.stop();
		}
	}
	
});