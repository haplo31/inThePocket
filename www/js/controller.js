angular.module('starter.controllers', [])
.controller('homeCtrl', function ($scope) {

})
.controller('quickCtrl', function ($scope,$timeout) {
	$scope.difficulty="medium";
	$scope.duration="5min";
	$scope.topics="allTopics";
	$scope.availableTopics=[
	"Maison",
	"Transports",
	"Voyages",
	"Cuisine",
	"Proverbes",
	"Citations",
	"Nouvelles technologies",
	"Santé",
	"Sentiments"
	]
	var permissionGranted=false;
	var options = {
				language:"en-US",
				showPopup:true
			}
	var textToSpeech= function(text){
		if ($scope.timeElapsed === false){
		TTS.speak({
        text: text,
        locale: 'en-US',
        rate: 1
    },
    function(){
    	launchSpeechReco(text);
    },
    function(){
    	console.log("error on tts:"+text)
    })
		}
		else{
			console.log("Training ended")
		}
	}
	var launchSpeechReco= function(text){
		$timeout(function(){
			window.plugins.speechRecognition.startListening(
	  	function(result){
	  		console.log(result)
	  		console.log(text)
	  		$scope.recognizedText=result[0];
	  		$scope.$apply()
	  		if (result[0].indexOf("skip")>=0){
	  			$scope.skip++;
	  			TTS.speak({
			        text: "Sentence passed",
			        locale: 'en-US',
			        rate: 1
			    },
			    function(){
			    	$scope.currentSentence=sentences[Math.floor(Math.random()*sentences.length)].english;
			    	$scope.recognizedText=undefined;
			    	$scope.$apply()
						textToSpeech($scope.currentSentence)
			    },function(){

			    })
	  		}
	  		else if(result[0].indexOf("stop")>=0){
					console.log("")
	  			TTS.speak({
			        text: "Training stopped",
			        locale: 'en-US',
			        rate: 1
			    },
			    function(){
			    	$scope.trainingLaunched=false;
			    },function(){

			    })
	  		}
	  		else{
		  		if(result[0].indexOf(text)>=0){
		  			$scope.good++;
		  			console.log("Good")
		  			TTS.speak({
				        text: "Good",
				        locale: 'en-US',
				        rate: 1
				    },
				    function(){
				    	$scope.currentSentence=sentences[Math.floor(Math.random()*sentences.length)].english;
				    	$scope.recognizedText=undefined;
				    	$scope.$apply()
							textToSpeech($scope.currentSentence)
				    },function(){

				    })
		  		}
		  		else{
		  			console.log("Bad")
		  			$scope.bad++;
		  			$scope.$apply()
		  			TTS.speak({
				        text: "I heard "+result[0]+".Try again",
				        locale: 'en-US',
				        rate: 1
				    },function(){
				    	textToSpeech(text)
				    },function(){})
		  		// 	var resultComp=result[0].split(' ').length;
		  		// 	var textComp=text.split(' ').length;
		  		// 	if (resultComp.length === textComp.length){

						// }
		  		}	
	  		}
	  	},
	  	function(error){
	  		console.log("error on Speech reco"+error)
	  		$timeout(function(){if($scope.trainingLaunched){launchSpeechReco(text)}},2000)
	  	},
	  	options)
		},500)		
	}
	$scope.trainingLaunched=false;
	$scope.launch = function(){
		// console.log(window.plugins)
		$scope.skip=0;
		$scope.good=0;
		$scope.bad=0;
		if ($scope.duration!== 0){
			$scope.timeElapsed=false;
			console.log($scope.duration)
			// $timeout(function(){
			// 	console.log("End of Training Detected")
			// 	$scope.timeElapsed=true;
			// },($scope.duration*60000))
		}
		if (window.cordova) {
			window.plugins.speechRecognition.requestPermission(function(){
					console.log("permission granted")
					options = {
						language:"en-US",
						showPopup:false
					}
					window.plugins.speechRecognition.isRecognitionAvailable(function(){
						console.log("recognition available")
						$scope.trainingLaunched=true;
						$scope.currentSentence=sentences[Math.floor(Math.random()*sentences.length)].english;
						$scope.$apply();
						textToSpeech($scope.currentSentence)	
					},
					function(){
						console.log("recognition not available")
					})
				},
				function(error){
					console.log(error)
					console.log("permission denied")
			})
    }
	}
	$scope.stop = function(){
		$scope.timeElapsed=true;
		$scope.trainingLaunched=false;
	}
	var sentences=[
		{english:"this is a book"},
{english:"this is not a book"},
{english:"what is it"},
{english:"that is a pencil"},
{english:"what is that"},
{english:"these are books"},
{english:"what is this in the picture"},
{english:"one is strong the other is weak"},
{english:"that is a good idea"},
{english:"that iss very kind of you"},
{english:"to do as you suggest would be out of the question"},
{english:"that is exactly what we want to learn"},
{english:"I'm glad you like it"},
{english:"I'm ready for breakfast"},
{english:"I'm good at tennis"},
{english:"what time is it"},
{english:"it's two sharp"},
{english:"the car is near the tree"},
{english:"your hat looks very nice"},
{english:"I have a lot of thing to eat"},
{english:"I have no time to see you"},
{english:"we have a car waiting outside"},
{english:"I will have some soup"},
{english:"there is book on the table"},
{english:"there are seven days in a week"},
{english:"there won't be many teachers going to the party"},
{english:"he opens the door"},
{english:"I opened the door"},
{english:"when did you open the door"},
{english:"will you open the door"},
{english:"the door is opened"},
{english:"what are you thinking about"},
{english:"what do you need it for"},
{english:"what are you looking for"},
{english:"where do you come from"},
{english:"has he come"},
{english:"when did you come"},
{english:"have you seen him"},
{english:"where did you see him"},
{english:"have you spoken to him"},
{english:"what did he tell you"},
{english:"I must get myself a new pair of glasses"},
{english:"get me two pounds of tomatoes"},
{english:"it's getting dark"},
{english:"she promised she would reserve a room for me"},
{english:"he assured me he would keep his promise"},
{english:"this vase is made of glass"},
{english:"I work for bank"},
{english:"I brush my teeth"},
{english:"I close the window"},
{english:"I turn off the light"},
{english:"I leave my house to go to the school"},
{english:"do you understand"},
{english:"could you come to dinner"},
{english:"what are you doing"},
{english:"perhaps you've heard of him"},
{english:"the sooner I get to bed the better"},
{english:"I want you to tell me this"},
{english:"you have to share it with other tenants"},
{english:"we should be able to resolve our difference"},
{english:"most scientists tend to agree with me"},
{english:"it's likely to rain"},
{english:"today we are going to hear report"},
{english:"I need to look at your car"},
{english:"she hopes to get a job"},
{english:"it makes me forget all my problems"},
{english:"this should help you to remember it"},
{english:"he continued talking"},
{english:"don't be nervous"},
{english:"thank you for helping me"},
{english:"he is younger than i"},
{english:"he has more brothers than i"},
{english:"I have fewer brothers than you"},
{english:"he is as well as you"},
{english:"your car is as fast as mine"},
{english:"I prefer to go rather than to stay"},
{english:"I've got a taxi waiting outside"},
{english:"I wish I could talk to you about art"},
{english:"I take ten minutes to get there"},
{english:"I won't say anything until you tell him"},
{english:"I won't phone my friend till Bob arrived"},
{english:"I haven't heard anything about him since you wrote to me last month"},
{english:"read as many books as you possibly can"}
	]
});