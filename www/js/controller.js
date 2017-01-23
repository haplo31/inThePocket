angular.module('starter.controllers', [])
.controller('quickCtrl', function ($scope,$timeout) {
	$scope.difficulty="medium";
	$scope.duration=0;
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
	  		var tempResult= result[0].toLowerCase();
	  		var tempText= text.toLowerCase();
	  		$scope.$apply()
	  		if (tempResult.indexOf("skip")>=0){
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
	  		else if(tempResult.indexOf("stop")>=0){
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
		  		if(tempResult.indexOf(tempText)>=0){
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
	$scope.trainingLaunching=false;
	// $scope.verifyingPermissions=true;
	//$scope.launchingTTS=true;
	$scope.launch = function(){
		$scope.restartOnError=false;
		$scope.trainingLaunching=true;
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
		$scope.verifyingPermission=false;
		$scope.launchingTTS=false;
		if (window.cordova) {
			window.plugins.speechRecognition.requestPermission(function(){
					console.log("permission granted")
					options = {
						language:"en-US",
						showPopup:false
					}
					$scope.verifyingPermission=true;
					window.plugins.speechRecognition.isRecognitionAvailable(function(){
						console.log("recognition available")
						$scope.currentSentence=sentences[Math.floor(Math.random()*sentences.length)].english;
						$scope.$apply();
						$scope.launchingTTS=true;
						TTS.speak({
			        text: "Pour passer une phrase, dites",
			        locale: 'fr-FR',
			        rate: 1
    				},function(){TTS.speak({
			        text: "Skip",
			        locale: 'en-US',
			        rate: 1
    				},function(){TTS.speak({
			        text: "Pour entendre la traduction d'une phrase, dites",
			        locale: 'fr-FR',
			        rate: 1
    				},function(){TTS.speak({
			        text: "Translate",
			        locale: 'en-US',
			        rate: 1
    				},function(){
    					TTS.speak({
			        text: "Lancement de l'entrainement",
			        locale: 'fr-FR',
			        rate: 1
    				},function(){
    					$scope.trainingLaunched=true;
    					$scope.trainingLaunching=false;
    					textToSpeech($scope.currentSentence)
    				},function(){
    					$scope.restartOnError=true;
    				})
    				},function(){})},function(){})},function(){})},function(){})
					},
					function(){
						$scope.restartOnError=true;
						console.log("recognition not available")
					})
				},
				function(error){
					$scope.restartOnError=true;
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
		{english:"A few"},
		{english:"A little"},
		{english:"A long time ago"},
		{english:"A one way ticket"},
		{english:"A round trip ticket"},
		{english:"About 300 kilometers"},
		{english:"Across from the post office"},
		{english:"All day"},
		{english:"Am I pronouncing it correctly"},
		{english:"And you"},
		{english:"Anything else"},
		{english:"Are there any concerts"},
		{english:"Are they coming this evening"},
		{english:"Are they the same"},
		{english:"Are you afraid"},
		{english:"Are you allergic to anything"},
		{english:"Are you American"},
		{english:"Are you busy"},
		{english:"Are you comfortable"},
		{english:"Are you coming this evening"},
		{english:"Are you free tonight"},
		{english:"Are you going to attend their wedding"},
		{english:"Are you going to help her"},
		{english:"Are you going to take a plane or train"},
		{english:"Are you here alone"},
		{english:"Are you hungry"},
		{english:"Are you married"},
		{english:"Are you okay"},
		{english:"Are you ready"},
		{english:"Are you sick"},
		{english:"Are you sure"},
		{english:"Are you waiting for someone"},
		{english:"Are you working today"},
		{english:"Are you working Tomorrow"},
		{english:"Are your children with you"},
		{english:"As soon as possible"},
		{english:"At what time did it happen"},
		{english:"At what time"},
		{english:"Be careful driving"},
		{english:"Be careful"},
		{english:"Be quiet"},
		{english:"Behind the bank"},
		{english:"Bring me my shirt please"},
		{english:"Business is good"},
		{english:"Call me"},
		{english:"Call the police"},
		{english:"Can I access the Internet here"},
		{english:"Can I borrow some money"},
		{english:"Can I bring my friend"},
		{english:"Can I have a glass of water please"},
		{english:"Can I have a receipt please"},
		{english:"Can I have the bill please"},
		{english:"Can I help you"},
		{english:"Can I make an appointment for next Wednesday"},
		{english:"Can I see your passport please"},
		{english:"Can I take a message"},
		{english:"Can I try it on"},
		{english:"Can I use your phone"},
		{english:"Can it be cheaper"},
		{english:"Can we have a menu please"},
		{english:"Can we have some more bread please"},
		{english:"Can we sit over there"},
		{english:"Can you call back later"},
		{english:"Can you call me back later"},
		{english:"Can you carry this for me"},
		{english:"Can you do me a favor"},
		{english:"Can you fix this"},
		{english:"Can you give me an example"},
		{english:"Can you help me"},
		{english:"Can you hold this for me"},
		{english:"Can you please say that again"},
		{english:"Can you recommend a good restaurant"},
		{english:"Can you show me"},
		{english:"Can you speak louder please"},
		{english:"Can you swim"},
		{english:"Can you throw that away for me"},
		{english:"Can you translate this for me"},
		{english:"Certainly"},
		{english:"Cheers"},
		{english:"Chicago is very different from Boston"},
		{english:"Come here"},
		{english:"Did it snow yesterday"},
		{english:"Did you come with your family"},
		{english:"Did you get my email"},
		{english:"Did you send me flowers"},
		{english:"Did you take your medicine"},
		{english:"Did your wife like California"},
		{english:"Do you accept US Dollars"},
		{english:"Do you believe that"},
		{english:"Do you feel better"},
		{english:"Do you go to Florida often"},
		{english:"Do you have a boyfriend"},
		{english:"Do you have a girlfriend"},
		{english:"Do you have a pencil"},
		{english:"Do you have a problem"},
		{english:"Do you have a swimming pool"},
		{english:"Do you have an appointment"},
		{english:"Do you have another one"},
		{english:"Do you have any children"},
		{english:"Do you have any coffee"},
		{english:"Do you have any money"},
		{english:"Do you have any vacancies"},
		{english:"Do you have anything cheaper"},
		{english:"Do you have enough money"},
		{english:"Do you have the number for a taxi"},
		{english:"Do you have this in size 11"},
		{english:"Do you hear that"},
		{english:"Do you know her"},
		{english:"Do you know how much it costs"},
		{english:"Do you know how to cook"},
		{english:"Do you know how to get to the Marriott Hotel"},
		{english:"Do you know what this means"},
		{english:"Do you know what this says"},
		{english:"Do you know where I can get a taxi"},
		{english:"Do you know where my glasses are"},
		{english:"Do you know where she is"},
		{english:"Do you like it here"},
		{english:"Do you like the book"},
		{english:"Do you like to watch TV"},
		{english:"Do you like your boss"},
		{english:"Do you like your co-workers"},
		{english:"Do you need anything else"},
		{english:"Do you need anything"},
		{english:"Do you play any sports"},
		{english:"Do you play basketball"},
		{english:"Do you sell batteries"},
		{english:"Do you sell medicine"},
		{english:"Do you smoke"},
		{english:"Do you speak English"},
		{english:"Do you study English"},
		{english:"Do you take credit cards"},
		{english:"Do you understand"},
		{english:"Do you want me to come and pick you up"},
		{english:"Do you want to come with me"},
		{english:"Do you want to go to the movies"},
		{english:"Do you want to go with me"},
		{english:"Does anyone here speak English"},
		{english:"Does he like the school"},
		{english:"Does it often snow in the winter in Massachusetts"},
		{english:"Does this road go to New York"},
		{english:"Waiter"},
		{english:"Waitress"},
		{english:"We can eat Italian or Chinese food"},
		{english:"We have two boys and one girl"},
		{english:"We like it very much"},
		{english:"Were there any problems"},
		{english:"Were you at the library last night"},
		{english:"What are you doing"},
		{english:"What are you going to do tonight"},
		{english:"What are you going to have"},
		{english:"What are you thinking about"},
		{english:"What are you two talking about"},
		{english:"What are your hobbies"},
		{english:"What can I do for you"},
		{english:"What color is that car"},
		{english:"What day are they coming over"},
		{english:"What day of the week is it"},
		{english:"What did you do last night"},
		{english:"What did you do yesterday"},
		{english:"What did you think"},
		{english:"What do people usually do in the summer in Los Angeles"},
		{english:"What do they study"},
		{english:"What do you do for work"},
		{english:"What do you have"},
		{english:"What do you recommend"},
		{english:"What do you study"},
		{english:"What do you think of these shoes"},
		{english:"What do you think"},
		{english:"What do you want to buy"},
		{english:"What do you want to do"},
		{english:"What do your parents do for work"},
		{english:"What does he do for work"},
		{english:"What does this mean"},
		{english:"What does this say"},
		{english:"What does this word mean"},
		{english:"What does your father do for work"},
		{english:"What happened"},
		{english:"What is it"},
		{english:"What is that"},
		{english:"What is the area code"},
		{english:"What kind of music do you like"},
		{english:"What school did you go to"},
		{english:"What should I wear"},
		{english:"What size"},
		{english:"What time are they arriving"},
		{english:"What time are you going to the bus station"},
		{english:"What time did you get up"},
		{english:"What time did you go to sleep"},
		{english:"What time did you wake up"},
		{english:"What time do you go to work everyday"},
		{english:"What time does it start"},
		{english:"What time does the movie start"},
		{english:"What time does the store open"},
		{english:"What time is check out"},
		{english:"What time is it"},
		{english:"What will the weather be like tomorrow"},
		{english:"What would you like to drink"},
		{english:"What would you like to eat"},
		{english:"When are they coming"},
		{english:"When are you coming back"},
		{english:"When are you going to pick up your friend"},
		{english:"When are you leaving"},
		{english:"When are you moving"},
		{english:"When did this happen"},
		{english:"When did you arrive in Boston"},
		{english:"When do we arrive"},
		{english:"When do we leave"},
		{english:"When do you arrive in the US"},
		{english:"When do you get off work"},
		{english:"When do you start work"},
		{english:"When does he arrive"},
		{english:"When does it arrive"},
		{english:"When does the bank open"},
		{english:"When does the bus leave"},
		{english:"When does the plane arrive"},
		{english:"When is the next bus to Philidalphia"},
		{english:"When is your birthday"},
		{english:"When was the last time you talked to your mother"},
		{english:"When will he be back"},
		{english:"When will it be ready"},
		{english:"When would you like to meet"},
		{english:"Where are the t-shirts"},
		{english:"Where are you from"},
		{english:"Where are you going to go"},
		{english:"Where are you going"},
		{english:"Where are you"},
		{english:"Where can I buy tickets"},
		{english:"Where can I exchange US dollars"},
		{english:"Where can I find a hospital"},
		{english:"Where can I mail this"},
		{english:"Where can I rent a car"},
		{english:"Where did it happen"},
		{english:"Where did you go"},
		{english:"Where did you learn English"},
		{english:"Where did you learn it"},
		{english:"Where did you put it"},
		{english:"Where did you work before you worked here"},
		{english:"Where do you live"},
		{english:"Where do you want to go"},
		{english:"Where do you work"},
		{english:"Where does it hurt"},
		{english:"Where does your wife work"},
		{english:"Where is an ATM"},
		{english:"Where is he from"},
		{english:"Where is he"},
		{english:"Where is it"},
		{english:"Where is Main Street"},
		{english:"Where is my shirt"},
		{english:"Where is she from"},
		{english:"Where is the airport"},
		{english:"Where is the bathroom"},
		{english:"Where is the bus station"},
		{english:"Where is there a doctor who speaks English"},
		{english:"Where is there an ATM"},
		{english:"Where were you"},
		{english:"Where would you like to go"},
		{english:"Where would you like to meet"},
		{english:"Which is better, the spaghetti or chicken salad"},
		{english:"Which is better"},
		{english:"Which is the best"},
		{english:"Which one do you want"},
		{english:"Which one is better"},
		{english:"Which one is cheaper"},
		{english:"Which one is the best"},
		{english:"Which one"},
		{english:"Which road should I take"},
		{english:"Which school does he go to"},
		{english:"Who are they"},
		{english:"Who are you looking for"},
		{english:"Who are you"},
		{english:"Who is it"},
		{english:"Who is that"},
		{english:"Who sent this letter"},
		{english:"Who taught you that"},
		{english:"Who taught you"},
		{english:"Who was that"},
		{english:"Who was your teacher"},
		{english:"Who won"},
		{english:"Who would you like to speak to"},
		{english:"Whose book is that"},
		{english:"Why are you laughing"},
		{english:"Why did you do that"},
		{english:"Why did you say that"},
		{english:"Why not"},
		{english:"Will you call me a taxi please"},
		{english:"Will you hand me a towel please"},
		{english:"Will you pass me the salt please"},
		{english:"Will you put this in the car for me"},
		{english:"Will you remind me"},
		{english:"Will you take me home"},
		{english:"Would you ask him to call me back please"},
		{english:"Would you ask him to come here"},
		{english:"Would you like a glass of water"},
		{english:"Would you like coffee or tea"},
		{english:"Would you like some water"},
		{english:"Would you like some wine"},
		{english:"Would you like something to drink"},
		{english:"Would you like something to eat"},
		{english:"Would you like to buy this"},
		{english:"Would you like to go for a walk"},
		{english:"Would you like to have dinner with me"},
		{english:"Would you like to rent a movie"},
		{english:"Would you like to watch TV"},
		{english:"Would you like water or milk"},
		{english:"Would you take a message please"},
		{english:"Yes, really"},
		{english:"Yes"},
		{english:"You have a very nice car"},
		{english:"You look like my sister"},
		{english:"You look tired"},
		{english:"Your children are very well behaved"},
		{english:"Your daughter"},
		{english:"Your house is very nice"},
		{english:"Your things are all here"},
		{english:"Take a chance"},
		{english:"Take it outside"},
		{english:"Take me downtown"},
		{english:"Take this medicine"},
		{english:"Tell him that I need to talk to him"},
		{english:"Tell me"},
		{english:"Thank you miss"},
		{english:"Thank you sir"},
		{english:"Thank you very much"},
		{english:"Thank you"},
		{english:"Thanks for everything"},
		{english:"Thanks for your help"},
		{english:"Thanks"},
		{english:"That car is similar to my car"},
		{english:"That car over there is mine"},
		{english:"That looks great"},
		{english:"That looks old"},
		{english:"That means friend"},
		{english:"That restaurant is not expensive"},
		{english:"That smells bad"},
		{english:"That way"},
		{english:"The accident happened at the intersection"},
		{english:"The big one or the small one"},
		{english:"The book is behind the table"},
		{english:"The book is in front of the table"},
		{english:"The book is near the table"},
		{english:"The book is next to the table"},
		{english:"The book is on the table"},
		{english:"The book is on top of the table"},
		{english:"The book is under the table"},
		{english:"The books are expensive"},
		{english:"The car is fixed"},
		{english:"The food was delicious"},
		{english:"The roads are slippery"},
		{english:"The whole day"},
		{english:"There are many people here"},
		{english:"There are some apples in the refrigerator"},
		{english:"There are some books on the table"},
		{english:"There has been a car accident"},
		{english:"These books are ours"},
		{english:"They arrived yesterday"},
		{english:"They charge 26 dollars per day"},
		{english:"This house is very big"},
		{english:"This is my mother"},
		{english:"This is very difficult"},
		{english:"This is very important"},
		{english:"This room is a mess"},
		{english:"Try it on"},
		{english:"Try it"},
		{english:"Try to say it"},
		{english:"Turn around"},
		{english:"Turn left"},
		{english:"Turn right"},
		{english:"See you later"},
		{english:"See you tomorrow"},
		{english:"See you tonight"},
		{english:"Should I wait"},
		{english:"Some books"},
		{english:"Someone does that for me"},
		{english:"Someone is coming"},
		{english:"Sorry to bother you"},
		{english:"Sorry, I think I have the wrong number"},
		{english:"Start the car"},
		{english:"Stop"},
		{english:"I agree"},
		{english:"I ate already"},
		{english:"I believe you"},
		{english:"I bought a shirt yesterday"},
		{english:"I came with my family"},
		{english:"I can swim"},
		{english:"I feel good"},
		{english:"I forget"},
		{english:"I get off of work at 6"},
		{english:"I give up"},
		{english:"I got in an accident"},
		{english:"I have a cold"},
		{english:"I have a headache"},
		{english:"I have a lot of things to do"},
		{english:"I have a question I want to ask you"},
		{english:"I want to ask you a question"},
		{english:"I have a reservation"},
		{english:"I have money"},
		{english:"I have one in my car"},
		{english:"I have pain in my arm"},
		{english:"I have three children, two girls and one boy"},
		{english:"I have to go to the post office"},
		{english:"I have to wash my clothes"},
		{english:"I have two sisters"},
		{english:"I hope you and your wife have a nice trip"},
		{english:"I know"},
		{english:"I like her"},
		{english:"I like it"},
		{english:"I like to watch TV"},
		{english:"I lost my watch"},
		{english:"I love you"},
		{english:"I made a mistake"},
		{english:"I made this cake"},
		{english:"I need a doctor"},
		{english:"I need another key"},
		{english:"I need some tissues"},
		{english:"I need this to get there by tomorrow"},
		{english:"I need to change clothes"},
		{english:"I need to go home"},
		{english:"I need to go now"},
		{english:"I only have 5 dollars"},
		{english:"I only want a snack"},
		{english:"I remember"},
		{english:"I speak two languages"},
		{english:"I still have a lot of things to buy"},
		{english:"I still have a lot to do"},
		{english:"I still have to brush my teeth and take a shower"},
		{english:"I think I need to see a doctor"},
		{english:"I think it tastes good"},
		{english:"I think so"},
		{english:"I think those shoes are very good looking"},
		{english:"I think you have too many clothes"},
		{english:"I thought he said something else"},
		{english:"I thought the clothes were cheaper"},
		{english:"I trust you"},
		{english:"I understand now"},
		{english:"I understand"},
		{english:"I usually drink coffee at breakfast"},
		{english:"I want to buy something"},
		{english:"I want to contact our embassy"},
		{english:"I want to give you a gift"},
		{english:"I want to show you something"},
		{english:"I was about to leave the restaurant when my friends arrived"},
		{english:"I was going to the library"},
		{english:"I was in the library"},
		{english:"I went to the supermarket, and then to the computer store"},
		{english:"I wish I had one"},
		{english:"If you like it I can buy more"},
		{english:"If you need my help, please let me know"},
		{english:"In 30 minutes"},
		{english:"Is anyone else coming"},
		{english:"Is everything ok"},
		{english:"Is it close"},
		{english:"Is it cold outside"},
		{english:"Is it far from here"},
		{english:"Is it hot"},
		{english:"Is it nearby"},
		{english:"Is it possible"},
		{english:"Is it raining"},
		{english:"Is it ready"},
		{english:"Is it suppose to rain tomorrow"},
		{english:"Is that enough"},
		{english:"Is that ok"},
		{english:"Is the bank far"},
		{english:"Is there a movie theater nearby"},
		{english:"Is there a nightclub in town"},
		{english:"Is there a restaurant in the hotel"},
		{english:"Is there a store near here"},
		{english:"Is there air conditioning in the room"},
		{english:"Is there any mail for me"},
		{english:"Is there anything cheaper"},
		{english:"Is this a safe area"},
		{english:"Is this pen yours"},
		{english:"Is this your book"},
		{english:"Is your father home"},
		{english:"Is your house like this one"},
		{english:"Is your son here"},
		{english:"It costs 20 dollars per hour"},
		{english:"It depends on the weather"},
		{english:"It hurts here"},
		{english:"It rained very hard today"},
		{english:"It takes 2 hours by car"},
		{english:"It will arrive shortly"},
		{english:"Happy Birthday"},
		{english:"Have a good trip"},
		{english:"Have they met her yet"},
		{english:"Have you arrived"},
		{english:"Have you been waiting long"},
		{english:"Have you done this before"},
		{english:"Have you eaten at that restaurant"},
		{english:"Have you eaten yet"},
		{english:"Have you finished studying"},
		{english:"Have you seen this movie"},
		{english:"He always does that for me"},
		{english:"He broke the window"},
		{english:"He has a nice car"},
		{english:"He likes it very much"},
		{english:"He needs some new clothes"},
		{english:"He never gives me anything"},
		{english:"He said this is a nice place"},
		{english:"He said you like to watch movies"},
		{english:"Hello"},
		{english:"Help"},
		{english:"Here is your salad"},
		{english:"Here it is"},
		{english:"Here you are"},
		{english:"His family is coming tomorrow"},
		{english:"His room is very small"},
		{english:"His son"},
		{english:"How are you paying"},
		{english:"How are you"},
		{english:"How are your parents"},
		{english:"How do I get there"},
		{english:"How do I use this"},
		{english:"How do you know"},
		{english:"How do you pronounce that"},
		{english:"How do you spell it"},
		{english:"How does it taste"},
		{english:"How far is it"},
		{english:"How is she"},
		{english:"How long are you going to stay"},
		{english:"How long does it take by car"},
		{english:"How long have you been here"},
		{english:"How long have you lived here"},
		{english:"How long have you worked here"},
		{english:"How long is it"},
		{english:"How long is the flight"},
		{english:"How long will it take"},
		{english:"How long will you be staying"},
		{english:"How many children do you have"},
		{english:"How many hours a week do you work"},
		{english:"How many languages do you speak"},
		{english:"How many people do you have in your family"},
		{english:"How many people"},
		{english:"How many"},
		{english:"How much altogether"},
		{english:"How much are these earrings"},
		{english:"How much do I owe you"},
		{english:"How much does it cost per day"},
		{english:"How much does this cost"},
		{english:"How much is it"},
		{english:"How much is that"},
		{english:"How much is this"},
		{english:"How much money do you have"},
		{english:"How much money do you make"},
		{english:"How much will it cost"},
		{english:"How much would you like"},
		{english:"How old are you"},
		{english:"How tall are you"},
		{english:"How was the movie"},
		{english:"How was the trip"},
		{english:"Hurry"},	
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