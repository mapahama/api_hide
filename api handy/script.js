const mic = document.getElementById('mic');
const messages_area = document.querySelector('.messages_area');
const chats = document.querySelector('.chats');
const notchat = document.getElementById('notchat');

const femaleBtn = document.querySelector(".female");
const maleBtn = document.querySelector(".male");
const speech = new SpeechSynthesisUtterance();
let iteration = 0;
var gptResponse = false;
let recognition = null;

let paperBoolean = false;
let fetchPromise = null;
let askedWikiInformation = false;
let wordUrl1 = null;
let wikiSummary = null;


// semantic scholar


var paperIDnumber = 0;
var paperNumber = null;
var paperTitle = "";


//works
//fetch(url)
//  .then(response => response.json())
 // .then(data => console.log(data));




//fetch(url)
  //.then(response => response.json())
  //.then(data => {
   // const papers = data.results.map(result => ({
    //  title: result.title,
    //  authors: result.authors.map(author => author.name)
   // }));
  //  console.log(papers);
 // })
 // .catch(error => console.error(error));

// semantic scholar end



try {
    if (('webkitSpeechRecognition' in window) || ('SpeechRecognition' in window)){
       var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;

        // to stop recognition
        //recognition.continuous = false;
        console.log(`browser supported`);
        //console.log(recognition);
    
    } else {
        console.log(`browser NOT supported`);
        alert("change your browser!");
    
    }
} catch (error) {
    console.error(error);
    alert("Speech Recognition is not supported! Please open the app in Chrome browser!");
}


function userMSg(msg){

    
    let output = '';
    output += `<p class="message right">${msg}</p>`;
    chats.innerHTML += output;

    //messages_area.scrollTop = messages_area.scrollHeight;
    return chats;
    

}
function assistantSpeak(msg){
    let output = '';
    output += `<p class="message left">${msg}</p>`;
    chats.innerHTML +=  output;

    messages_area.scrollTop = messages_area.scrollHeight;
    return chats;
}




function assistantMsg(msg){

    paperBoolean = false;
    //recognition = null;
    //recognition = new SpeechRecognition();

    //recognition.stop();

    speech.text = "";
    speech.volume = 1;
    speech.pitch = 0.9;
    speech.rate = 0.95;

    if (!('speechSynthesis' in window)) {
        alert('change your browser!');

    } else {

        if (msg.trim().length !== 0){

            if (msg.toLowerCase().includes('who are you')) {
                let result = intro[Math.floor(Math.random() * intro.length)]
                speech.text = result;
                gptResponse = false;
            }
    
            else if (msg.toLowerCase().includes('what is my name')) {
                const result = names[Math.floor(Math.random() * names.length)];
                speech.text = result;
                gptResponse = false;
            }
        
            else if (msg.toLowerCase().includes('thank you')) {
                const result = thanks[Math.floor(Math.random() * thanks.length)];
                speech.text = result;
                gptResponse = false;
            }
    
            else if (msg.toLowerCase().includes('calculator') || msg.toLowerCase().includes('calculate')) {
                window.open('Calculator:///');
                const result = "opening Calculator";
                speech.text = result;
                gptResponse = false;
            }
        
            else if (msg.toLowerCase().includes('bye')) {
                const result = closee[Math.floor(Math.random() * closee.length)];
                speech.text = result;  
                gptResponse = false;          
            } 

            else if (msg.toLowerCase().includes('no')) {

                speech.text = "as you wish";  
                gptResponse = false;          
            } 
            else if (msg.toLowerCase().includes('stop')) {

                speech.text = "API is turning off...";  
                gptResponse = false;  
                recognition.stop();        
            } 

            else if (msg.toLowerCase().includes('yes')) {


                //window.speechSynthesis.cancel();
                //myTimeout = setTimeout(myTimer, 10000);
                myTimer();
                speech.text = wikiSummary;  
                gptResponse = false;    
                
                    
            } 
    
            else if (msg.toLowerCase().includes('wikipedia')) {

                askedWikiInformation = true;
                // when i say "wikipedia Paris" ,  the word "wikipedia is REPLACED with empty string and only
                // the word Paris is taken into account
                window.open(`https://en.wikipedia.org/wiki/${msg.toLowerCase().replace("wikipedia", "")}`, "_blank");
                const result = "showing result for " + msg.toLowerCase().replace("wikipedia", "") + " on wikipedia";
                speech.text = result;
                gptResponse = false;

                messages_area.append(assistantSpeak(result));
                window.speechSynthesis.speak(speech);

                // do you want summary of the info?
                let word = msg.toLowerCase().replace("wikipedia", "");
                let url1 = 'https://en.wikipedia.org/w/api.php?format=json&action=query&origin=*&prop=extracts&exintro&explaintext&redirects=1&titles=';
                wordUrl1 = url1 + word;
                console.log(wordUrl1);



              return;
            }
    
            // opening web pages.... 
            else if (msg.toLowerCase().includes('heey')) {
                console.log("ok  command received");
    
                
                let result;
                let url;
                if (msg.toLowerCase().includes('google')) {
                    console.log("open google command received");
    
                    url = "https://www.google.com/";
                    result = "Opening Google!";
                    speech.text = result;
                    window.open(url, "_blank").focus();
                    
                } else if (msg.toLowerCase().includes('wikipedia')){
    
                    url = "https://www.wikipedia.org/";
                    result = "Opening Wikipedia!";
                    speech.text = result;
                    window.open(url, "_blank").focus();
                }
                gptResponse = false;
            }
    
            else if (msg.toLowerCase().includes('google')) {
                
                //remove the word "information" from the query that will be pasted in google search
                msg = msg.toLowerCase().replace("google", "")
    
                result = "I found something about " + msg + " on google!";
                speech.text = result;
                
                window.open(`http://google.com/search?q=${msg}`, "_blank");
                gptResponse = false;
            } 
    
            else if (msg.toLowerCase().includes('stop')) {
                
                //window.speechSynthesis.speak().cancel();
                //speech.cancel();
                gptResponse = false;
            } 

            else if (msg.toLowerCase().includes(('paper')) || msg.toLowerCase().includes(('people')))  {
                
                if(msg.toLowerCase().includes(('paper'))){
                    msg = msg.toLowerCase().replace("paper", "");
                } 
                else {
                    msg = msg.toLowerCase().replace("people", "");
                }
  
    

               let url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${msg}`;

                //math probability
                //paperNumber = Math.floor(Math.random() * 10);


                fetchPromise = new Promise((resolve, reject) =>{

                    fetch(url)
                    .then(response => response.json())
                    .then(body => {

                    paperNumber = Math.floor(Math.random() * 10);
                    console.log("paper array length: " + (body.data.length-1));

                     paperTitle = body.data[paperNumber].title;
                     paperIDnumber = body.data[paperNumber].paperId;

                 
                    //console.log(body.data);
                    console.log(paperTitle);
                    console.log("in " + paperIDnumber);
                    console.log(paperNumber);
                
       

                    })
                    .catch(error => console.error(error));

                    resolve("fetchPromise resolved");
                });
                

                
                gptResponse = false;
                paperBoolean = true;
            } 

    
            else {
                gptResponse = true;
            }
    
    
    
            if(!gptResponse){

                // all functions to be spoken by API, except paper search
                if(!paperBoolean){
                    messages_area.append(assistantSpeak(speech.text));
                    window.speechSynthesis.speak(speech);
                 recognition.start();
                  // readLongText(speech.text);
                // only paper search option to be spoken by API
                } else {
                    Promise.all([fetchPromise])
                    .then((message) =>{

                        //test
                        setTimeout(function() {


                            result = "I found a paper about  " + msg + " with the following title: " + 
                            "<b><span style='color: rgba(15, 14, 14, 0.782);'>" + paperTitle + "</span></b>"
    
        
                            speech.text = result
    
                            setTimeout(function() {
                                window.open(`https://www.semanticscholar.org/paper/${paperIDnumber}`, "_blank")
                               }, 1000) 
    
                            console.log(message)
                            messages_area.append(assistantSpeak(speech.text))
    
    
                            if(result.toLowerCase().includes(("<b><span style='color: rgba(15, 14, 14, 0.782);'>"))){
                                result = result.toLowerCase().replace("<b><span style='color: rgba(15, 14, 14, 0.782);'>", "");
    
                                if(result.toLowerCase().includes(("</span></b>"))){
                                    result = result.toLowerCase().replace("</span></b>", "");         
                                } 
                            } 
                            speech.text = result
                            window.speechSynthesis.speak(speech)



                        }, 2000) 
                        //endtest
 
                    })
                    .catch(error => console.error(error));
                }

            } else {

                async function anotherAsyncFunction() {
                    var result2 =  await getGPTmessage(msg);
                    
                   messages_area.append(assistantSpeak(result2));
                   window.speechSynthesis.cancel();
                   //myTimeout = setTimeout(myTimer, 10000);
    
                
                
                  speech.text = result2;
                

                    window.speechSynthesis.speak(speech);
    
                }

                anotherAsyncFunction();

            }
            
        }        
    }

}




speech.addEventListener('end', (event) => {
//speech.onend =  function(event) { 





        

        console.log("on end speech event" + event);
        //clearTimeout(myTimeout);
    
        if(askedWikiInformation){ 

                // it must be await
                askForWikiSummary(wordUrl1);
                
                
                askedWikiInformation = false; 
                       

        }
        recognition.start();
              

    
//}
});

speech.addEventListener('start', (event) => {
//speech.onstart = function(event){


        console.log("on start speech event" + event);
        myTimeout = setTimeout(myTimer, 10000);
    
    
        //recognition.stop();



// }
});


// speech recognition
//speech in text convertation
//text saved in transcript
//showing the spoken text by the user in a user message
//sending the message to function "assistantMsg" in order the assistant to answer to the user msg


function handleSpeechRecognition(event) {



            // handle speech recognition event
    console.log("recognition event: " + event);

    var isSpeaking = window.speechSynthesis.speaking;
    //check if the assistant is speaking
    if (!isSpeaking){

        console.log(event);
        console.log("result received");

        var transcript = event.results[event.resultIndex][0].transcript;
        if (transcript.trim().length !== 0){

            messages_area.append(userMSg(transcript));
            assistantMsg(transcript);
        }

    } else {

       console.log("!!!!! iteration2: " + event.resultIndex)       
        event.results[event.resultIndex][0].transcript = '';

    }



  }






  recognition.onresult = (event) => {
    console.log(event);
        console.log("result received");

        var transcript = event.results[event.resultIndex][0].transcript;
        if (transcript.trim().length !== 0){

            messages_area.append(userMSg(transcript));
            assistantMsg(transcript);
        }
  };







mic.addEventListener('click', () => {



        notchat.style.display = "none" 
       
        let result = saluteToDaytime();
        speech.text = result;


        notchat.style.display = "none";

        //window.speechSynthesis.speak(speech);
        //messages_area.append(assistantSpeak(speech.text));
        

        //start recognition
        recognition.start(); 
       
    


});

// to continue listening
//recognition.addEventListener('end', () => recognition.start());

recognition.onend = function() { 
    
    //enable mic to be clickable again

    //mic.style.pointerEvents = "auto";

    console.log("ended...");
    iteration = 0;
    //recognition.start();

}

recognition.onstart = function(){
    //mic.style.pointerEvents = "none";

        iteration++;     

  }

  recognition.onspeechend = function(){
    console.log("No Activity...");
    //26 04
    //recognition.stop();

    //speech.text = "can I help You with anything else?";
    //window.speechSynthesis.speak(speech);
    //messages_area.append(assistantSpeak(speech.text));
    
  }

  recognition.onerror = function(){
    console.log("some error happened...");
  }


  function saluteToDaytime(){
    let salute = "";
    let day = new Date();
    let hour = day.getHours();

    if(hour >= 0  && hour < 12){
        salute = "good morning 2!";

    } else if(hour == 12){
        salute = "good noon!";

    } else if(hour > 12  && hour <= 17){
        salute = "good afternoon!";

    } else {
        salute = "good evening!";
    }
    //return result;
    return salute;
  }

  femaleBtn.addEventListener("click", function(e){
    let currentBtn = e.target;
    let nextBtn = e.target.nextElementSibling;
    
    nextBtn.classList.remove("active");
    nextBtn.classList.add("inactive");
    currentBtn.classList.remove("inactive");
    currentBtn.classList.add("active");

    speech.voice = speechSynthesis.getVoices().filter(function(voice){
        return voice.name == 'Google UK English Female';
    })[0];
    
})

maleBtn.addEventListener("click", function(e){
    let currentBtn = e.target;
    let previousBtn = e.target.previousElementSibling;
    
    previousBtn.classList.remove("active");
    previousBtn.classList.add("inactive");
    currentBtn.classList.remove("inactive");
    currentBtn.classList.add("active");

    speech.voice = speechSynthesis.getVoices().filter(function(voice){
        return voice.name == 'Google UK English Male';
    })[0];
})



async function askForWikiSummary(wordUrl1){

        

 
    
        await fetch(wordUrl1)
        .then(response => response.json())
        .then(response =>{
            response = response.query.pages;
            var pageid = Object.keys(response)[0];
            var extract = response[pageid].extract;
        
            if(extract !== undefined){
              console.log(extract);
              
              wikiSummary = extract;
              const ifMoreInfoNeeded = "would you like to read the information for you?";
              speech.text = ifMoreInfoNeeded;
              
    
                messages_area.append(assistantSpeak(ifMoreInfoNeeded));
                window.speechSynthesis.speak(speech);         
    
    
    
    
            } else {
              wikiSummary ="Sorry, I did not find information";
              speech.text = wikiSummary;
              messages_area.append(assistantSpeak(wikiSummary));
              window.speechSynthesis.speak(speech);  

              console.log(wikiSummary);

            }
            
        
            //asking:  do you want the summarized info
            //if undefined
            //then synthesis with apology
        })
        .catch(error => console.error(error));
    
    
    
    
    
            
                //recognition.addEventListener('result', handleSpeechRecognition);           
}







//divide long texts, not used yet
function readLongText(text) {
    // Split the text in two parts
    const middleIndex = Math.ceil(text.length / 2);
    const firstPart = text.slice(0, middleIndex);
    const secondPart = text.slice(middleIndex);
  
    // Create a new SpeechSynthesisUtterance object for each part
    const firstUtterance = new SpeechSynthesisUtterance(firstPart);
    const secondUtterance = new SpeechSynthesisUtterance(secondPart);
  
    // Add an event listener to the first utterance to start the second one when it finishes
    firstUtterance.addEventListener("end", () => {
      window.speechSynthesis.speak(secondUtterance);
    });
  
    // Start reading the first utterance
    window.speechSynthesis.speak(firstUtterance);
  }