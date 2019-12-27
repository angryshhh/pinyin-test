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
  }, []);

  return (
    <BrowserRouter>
      <Layout style={{ height: '100vh' }}>
        <Header style={{ color: 'white', textAlign: 'center' }}>Block { state.currentBlock }</Header>
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
                  <LoginPage />
                </Route>
                <Route path="/block">
                  <BlockPage
                    currentBlock={state.currentBlock}
                    isLastBlock={state.blockCount === state.currentBlock}
                    trials={state.trials}
                    currentTrial={state.currentTrial}
                    results={
                      state.results.slice(
                        (state.currentBlock - 1) * state.trials.length,
                        (state.currentBlock - 1) * state.trials.length + state.trials.length
                      )
                    }
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
