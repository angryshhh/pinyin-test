import React, { useEffect } from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  useLocation,
} from 'react-router-dom';
import { Layout } from 'antd';
import BlockPage from './components/BlockPage';
import LoginPage from './components/LoginPage';

const { Header, Content, Footer } = Layout;

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
    <BrowserRouter>
      <Layout style={{ height: '100vh' }}>
        <Header style={{ color: 'white', textAlign: 'center' }}></Header>
        <Content style={{ padding: '0 50px' }}>
          <div style={{
            background: 'white',
            padding: 24,
            height: '100%',
            overflowY: 'scroll',
          }}>
            <Switch>
              <Route exact path="/">
                <Redirect to="/login"></Redirect>
              </Route>
              <Route path="/login">
                <LoginPage speakControl={speakControl} ></LoginPage>
              </Route>
              <Route path="/block">
                <BlockPage targetStrings={targetStrings} speakControl={speakControl} ></BlockPage>
              </Route>
            </Switch>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>

        </Footer>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
