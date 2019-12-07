import React, { useState, useEffect } from 'react';
const { ipcRenderer } = window.require('electron');

const synth = window.speechSynthesis;
const utterance = new SpeechSynthesisUtterance();

function App() {
  const [speakContent, setSpeakContent] = useState('');
  useEffect(() => {
    ipcRenderer.on('receive-candidate-list', (event, data) => {
      setSpeakContent(data);
    });
  }, []);
  useEffect(() => {
    synth.cancel();
    utterance.text = speakContent;
    synth.speak(utterance);
    console.log(utterance);
    console.log('web page receive: ' + speakContent);
  }, [speakContent]);

  return (
    <div className="App">
      <div>
        inputh here:<br />
        <input></input>
      </div>
      <div style={{ paddingTop: '50px', }}>
        candidate:<br />
        { speakContent }
      </div>
    </div>
  );
}

export default App;
