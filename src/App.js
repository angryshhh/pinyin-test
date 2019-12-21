import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { Layout } from 'antd';
import BlockPage from './components/BlockPage';
import LoginPage from './components/LoginPage';
import SpeakControl from './utils/SpeakControl';

const { Header, Content, Footer } = Layout;

const { ipcRenderer } = window.require('electron');

function App() {
  const [title, setTitle] = useState('登录');

  useEffect(() => {
    ipcRenderer.on('receive-candidate-list', (event, data) => {
      console.log('web page receive:' + data);
      SpeakControl.forceSpeak(data);
    });
  }, []);

  return (
    <BrowserRouter>
      <Layout style={{ height: '100vh' }}>
        <Header style={{ color: 'white', textAlign: 'center' }}>{ title }</Header>
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
                <LoginPage />
              </Route>
              <Route path="/block/:blockNum">
                <BlockPage setTitle={setTitle} />
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
