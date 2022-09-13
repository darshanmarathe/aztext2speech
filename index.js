const express = require('express')
const app = express()
const port = 3000

const bodyParser = require('body-parser');  
// Create application/x-www-form-urlencoded parser  
const urlencodedParser = bodyParser.json({ extended: false })  

app.get('/', (req, res) => {
  res.send('Hello World!')
})



app.post('/audio', urlencodedParser, function (req, res) {  
    // Prepare output in JSON format  
    const text = req.body.text;
    var sdk = require("microsoft-cognitiveservices-speech-sdk");
    var key = "b7ebe511b0984cb8988a14d58bf3ad91";
    var region = "EastUS2";
    var audioFile = "YourAudioFile.wav";

    console.log(text, req.body)

    const speechConfig = sdk.SpeechConfig.fromSubscription(key, region);
   // const audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioFile);

    // The language of the voice that speaks.
    speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural"; 
    speechConfig.speechSynthesisOutputFormat =
    sdk.SpeechSynthesisOutputFormat.Ogg24Khz16BitMonoOpus;
    // Create the speech synthesizer.
    var synthesizer = new sdk.SpeechSynthesizer(speechConfig );

      synthesizer.speakTextAsync(text,
          function (result) {
 

        const audio = result.audioData;
        synthesizer.close();
        const buffer = Buffer.from(audio);
        res.set('Content-Type', 'audio/ogg; codecs=opus; rate=24000');
        res.send(buffer);

        synthesizer.close();
        synthesizer = null;
      },
          function (err) {
        console.trace("err - " + err);
        synthesizer.close();
        synthesizer = null;
      });
 })  


 app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
  


// (function() {

//     "use strict";

//     var sdk = require("microsoft-cognitiveservices-speech-sdk");
//     var readline = require("readline");

//     // const speechConfig = SpeechConfig.fromSubscription(
//     //     "b7ebe511b0984cb8988a14d58bf3ad91",
//     //     "EastUS2"
//     //   );

//     var key = "b7ebe511b0984cb8988a14d58bf3ad91";
//     var region = "EastUS2";
//     var audioFile = "YourAudioFile.wav";

//     const speechConfig = sdk.SpeechConfig.fromSubscription(key, region);
//     const audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioFile);

//     // The language of the voice that speaks.
//     speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural"; 

//     // Create the speech synthesizer.
//     var synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

//     var rl = readline.createInterface({
//       input: process.stdin,
//       output: process.stdout
//     });

//     rl.question("Enter some text that you want to speak >\n> ", function (text) {
//       rl.close();
//       // Start the synthesizer and wait for a result.
//       synthesizer.speakTextAsync(text,
//           function (result) {
//         if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
//           console.log("synthesis finished.");
//         } else {
//           console.error("Speech synthesis canceled, " + result.errorDetails +
//               "\nDid you set the speech resource key and region values?");
//         }

//         synthesizer.close();
//         synthesizer = null;
//       },
//           function (err) {
//         console.trace("err - " + err);
//         synthesizer.close();
//         synthesizer = null;
//       });
//       console.log("Now synthesizing to: " + audioFile);
//     });
// }());