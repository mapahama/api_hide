

// need to be hidden and not exposed in a client code !
//const API_KEY = "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";
//process.env.API_KEY
const apikey =  process.env.API_KEY;
var myTimeout;

/*
*Using OpenAI API to send user questions to gpt-3.5-turbo model and return answers.
*@param input:  user question
*@return result1: answer from gpt model
*/
async function getGPTmessage(input) {

  var result1 = null;
  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apikey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{role: "user", content: input}],
      max_tokens: 300
    })
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', options);
    const data = await response.json();
    console.log(data);

    result1 = data.choices[0].message.content;
  
  } catch (error){
    console.log(error);
  }
  return result1;

}




// pause and resume speech-synthesis every 10 sec to avoid speech-synthesis errors in long texts
function myTimer() {
    window.speechSynthesis.pause();
    window.speechSynthesis.resume();
    myTimeout = setTimeout(myTimer, 10000);
}
