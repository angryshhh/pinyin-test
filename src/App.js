import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import TestPage from './components/TestPage';
import Login from './components/Login';

const { ipcRenderer } = window.require('electron');
const synth = window.speechSynthesis;
const utterance = new SpeechSynthesisUtterance();

const cancelFormerSpeak = () => {
  synth.cancel();
}
const speak = (content) => {
  utterance.text = content;
  synth.speak(utterance);
}
const forceSpeak = (content) => {
  cancelFormerSpeak();
  speak(content);
}
const speakControl = { cancelFormerSpeak, speak, forceSpeak };

const targetStrings = [
  '您吃了吗',
  '天气不错',
  '很高兴认识你',
  '打篮球还是踢足球',
  '新闻播送结束',
];

function App() {
  useEffect(() => {
    ipcRenderer.on('receive-candidate-list', (event, data) => {
      console.log('web page receive:' + data);
      forceSpeak(data);
    });
  }, []);

  return (
    <Router>
      <Switch>
        <Route path='/test'>
          <TestPage targetStrings={targetStrings} speakControl={speakControl} ></TestPage>
        </Route>
        <Route path='/'>
          <Login speakControl={speakControl} ></Login>
        </Route>
      </Switch>
    </Router>
    
  );
}

export default App;
