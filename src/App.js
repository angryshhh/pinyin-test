import React, { useEffect, useReducer } from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { Layout } from 'antd';
import BlockPage from './components/BlockPage';
import LoginPage from './components/LoginPage';
import WarmUpPage from './components/WarmUpPage';
import SpeakControl from './utils/SpeakControl';
import { TrialsDispatch } from './utils/Contexts';
import { initialState, reducer } from './utils/store';

const { Header, Content, Footer } = Layout;

const { ipcRenderer } = window.require('electron');

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    ipcRenderer.on('receive-candidate-list', (event, data) => {
      console.log('web page receive:' + data);
      SpeakControl.forceSpeak(data);
    });
    ipcRenderer.on('experiment-data', (event, data) => {
      console.log(data);
      dispatch({ type: 'SET_DATA', data });
    });
  }, []);

  useEffect(() => {
    if (state.completed) {
      ipcRenderer.send('complete', state.results);
      dispatch({ type: 'RESET' });
    }
  }, [state.completed, state.results]);

  return (
    <BrowserRouter>
      <Layout style={{ height: '100vh' }}>
        <Header style={{ color: 'white', textAlign: 'center' }}>Block { state.block }</Header>
        <Content style={{ padding: '0 50px' }}>
          <div style={{
            background: 'white',
            padding: 24,
            height: '100%',
            overflowY: 'scroll',
          }}>
            <TrialsDispatch.Provider value={dispatch}>
              <Switch>
                <Route exact path="/">
                  <Redirect to="/login"></Redirect>
                </Route>
                <Route path="/login">
                  <LoginPage subjectCode={state.subjectCode} />
                </Route>
                <Route path="/warm-up">
                  <WarmUpPage
                    warmUpStrings={state.warmUpStrings}
                  />
                </Route>
                <Route path="/block">
                  <BlockPage
                    block={state.block}
                    trials={state.trials}
                    currentTrial={state.currentTrial}
                    results={state.results}
                  />
                </Route>
              </Switch>
            </TrialsDispatch.Provider>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>

        </Footer>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
