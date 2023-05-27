//need to be hidden and not exposed in a client code !

//old
//const API_KEY = "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";
const API_KEY = "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";
var myTimeout;


async function getGPTmessage(input) {

  var result1 = null;
  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
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





function myTimer() {
    window.speechSynthesis.pause();
    window.speechSynthesis.resume();
    myTimeout = setTimeout(myTimer, 10000);
}