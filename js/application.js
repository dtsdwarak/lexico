//Initializing the Speech Recognition Operator
var recognition; 
var recognizing;
var ignore_record;
var webspeech_availability=false;

//Transcript values
var final_transcript = '';
var interim_transcript = '';

function getData(word){
	$.getJSON("http://api.wordnik.com/v4/word.json/"+word.toLowerCase()+"/definitions?limit=200&includeRelated=true&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5", function(result){
		if (result.length == 0){
			$('.noMeaning').modal('show');
			meaningForWord.value="";
			return;
		}
		$('.givenWord').text(result[0].word);
		$('.wordMeaning').text(result[0].text);
		$('.speech').text(result[0].partOfSpeech);
		$('.credits').text(result[0].attributionText);
	});
}

function start_recognition(){
	if (webspeech_availability){
		if(recognizing){
			recognition.stop();
			recognizing = false;
			jarvis_status.innerHTML='';
			return;
		}
		else {
			meaningForWord.value="";
			final_transcript='';
			interim_transcript='';
			jarvis_status.innerHTML='You may start talking now. Click mike again to stop.';
			recognition.start();
		}
	}
}


$(document).ready(function(){

	if (!('webkitSpeechRecognition' in window)) {
		$('.webspeechAPIModal').modal('show');
		$('#microphoneButton').addClass('btn-danger');
		$('#microphoneIcon').addClass('fa-microphone-slash');
	}
	else{
		webspeech_availability=true;
		$('#microphoneButton').addClass('btn-success');
		$('#microphoneIcon').addClass('fa-microphone');

		//Initialize to parameters
		recognition = new webkitSpeechRecognition();
		recognizing = false;
		ignore_record = false;
		recognition.continuous = true;
		recognition.interimResults = true;


		final_transcript = '';
		interim_transcript = '';

	    //On start of the Recognition Operation
	    recognition.onstart = function () {
	    	recognizing = true;
	    	ignore_record = false;
	    	$('#microphoneButton').removeClass('btn-success').addClass('btn-warning');    	
	    }

	    //When an error occurs
	    recognition.onerror = function(error){
	    	// during no speech
	    	if(event.error == 'no-speech'){
	    		jarvis_status.innerHTML = 'No speech input detected. Check settings';
	    		$('#microphoneIcon').removeClass('fa-microphone').addClass('fa-microphone-slash');
	    		$('#microphoneButton').removeClass('btn-warning').addClass('btn-danger');
	    	}
	    	// When no audio was captured
	    	else if(event.error == 'autio-capture'){
	    		jarvis_status.innerHTML = 'Do talk something. No audio stream caputured!';
	    		$('#microphoneIcon').removeClass('fa-microphone').addClass('fa-microphone-slash');
	    		$('#microphoneButton').removeClass('btn-warning').addClass('btn-danger');    		
	    	}
	    	else {
	    		jarvis_status.innerHTML = 'Something wrong. Check settings';
	    		$('#microphoneIcon').removeClass('fa-microphone').addClass('fa-microphone-slash');
	    		$('#microphoneButton').removeClass('btn-warning').addClass('btn-danger');	    	
	    	}
	    	ignore_record = true;
	    }

	    //When Recognition ends
	    recognition.onend = function(){
	    	recognizing = false;
	    	if (ignore_record){
	    		return;
	    	}
	    	$('#microphoneButton').removeClass('btn-danger btn-warning').addClass('btn-success');
	    	$('#microphoneIcon').removeClass('fa-microphone-slash').addClass('fa-microphone');
	    	meaningForWord.value = final_transcript;
	    }

	    // When results occur
	    recognition.onresult = function(){
	    	interim_transcript = '';
	    	if(typeof(event.results)=='undefined'){
	    		recognition.onend = null;
	    		recognition.stop();
	    		return;
	    	}
	    	for(var i = event.resultIndex;i<event.results.length;i++){
	    		if(event.results[i].isFinal){
	    			final_transcript += event.results[i][0].transcript;
	    		}
	    		else {
	    			interim_transcript+= event.results[i][0].transcript;
	    		}
	    	}
	    	meaningForWord.value = final_transcript;
	    }
	}

	/* Empty word check function */
	$('#fetchValueButton').click(function(){
		if (meaningForWord.value != "")
			getData(meaningForWord.value);
		else
			$('.messageModal').modal('show');
	});

});

