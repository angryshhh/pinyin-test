import React, { useState } from 'react';
const { ipcRenderer } = window.require('electron');


function App() {
  const [candidateListStr, setCandidateListStr] = useState('');
  ipcRenderer.on('receive-candidate-list', (event, data) => {
    console.log('web page receive: ' + data);
    setCandidateListStr(data);
  });

  return (
    <div className="App">
      <div>
        inputh here:<br />
        <input></input>
      </div>
      <div style={{ paddingTop: '50px', }}>
        candidate:<br />
        { candidateListStr }
      </div>
    </div>
  );
}

export default App;
