import React, { useState, useEffect } from 'react';
import SpeakControl from './utils/SpeakControl';

const { ipcRenderer } = window.require('electron');

function App() {
  const [candidate, setCandidate] = useState('a');

  useEffect(() => {
    ipcRenderer.on('receive-candidate-list', (event, data) => {
      console.log('web page receive:' + data);
      setCandidate(data);
      SpeakControl.forceSpeak(data);
    });
  }, []);

  return <div>
    {candidate}
  </div>;
}

export default App;
