if (!('webkitSpeechRecognition' in window)) {
	alert("Your browser doesn''t support WebSpeech API :-|");
}
else {
	
	//Initializing the Speech Recognition Operator
	var recognition = new webkitSpeechRecognition();
	var recognizing = false;
	var ignore_record = false;
    recognition.continuous = true;
    recognition.interimResults = true;


    var final_transcript = '';
    var interim_transcript = '';


    //On start of the Recognition Operation
    recognition.onstart = function () {
    	recognizing = true;
    	ignore_record = false;    	
    	status_img.src = "../img/mic-animate.gif";
    }

    //When an error occurs
    recognition.onerror = function(error){
    	// during no speech
    	if(event.error == 'no-speech'){
    		jarvis_status.innerHTML = 'No speech input detected. Check settings';
    		status_img.src = '../img/mic-slash.gif';
    	}
    	// When no audio was captured
    	else if(event.error == 'autio-capture'){
    		jarvis_status.innerHTML = 'Do talk something! No audio has been caputured!';
    		status_img.src = '../img/mic-slash.gif';    		
    	}
    	else {
    		jarvis_status.innerHTML = 'Something wrong! Check settings';
    		status_img.src = '../img/mic-slash.gif';
    	}
    	ignore_record = true;
    }

    //When Recognition ends
    recognition.onend = function(){
    	recognizing = false;
    	if (ignore_record){
    		return;
    	}
    	status_img.src = "../img/mic.gif";
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
    	final_transcript_value.innerHTML = final_transcript;
    	interim_transcript_value.innerHTML = interim_transcript;
    }
}


function start_recognition(){
	if(recognizing){
		recognition.stop();
		recognizing = false;
		return;
	}
	else {
		final_transcript='';
		interim_transcript='';
		jarvis_status.innerHTML='You may start talking NOW!';
		recognition.start();
	}
}

