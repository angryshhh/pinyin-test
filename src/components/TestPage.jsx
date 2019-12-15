import React, { useState, useEffect} from 'react';
import {
  Card,
  Collapse,
  Input,
  Layout,
} from 'antd';
import PropTypes from 'prop-types';
import AnalysisResult from './AnalysisResult';

const { Panel } = Collapse;
const { Header, Footer, Content } = Layout;

const { ipcRenderer } = window.require('electron');
const synth = window.speechSynthesis;
const utterance = new SpeechSynthesisUtterance();

const TestPage = (props) => {
  const [activeKey, setActiveKey] = useState(0);
  const [analysisResults, setAnalysisResults] = useState(new Array(props.targetStrings.length).fill(false));
  // const [speakContent, setSpeakContent] = useState('');
  useEffect(() => {
    ipcRenderer.on('receive-candidate-list', (event, data) => {
      console.log('web page receive:' + data);
      synth.cancel();
      utterance.text = data;
      synth.speak(utterance);
    });
  }, []);

  useEffect(() => {
    document.querySelectorAll('#input' + activeKey)[0].focus();
  }, [activeKey]);


  return (
    <div>
      <Layout style={{ height: '100vh' }}>
        <Header style={{ textAlign: 'center', color: 'white' }}>{'测试页面'}</Header>

        <Content style={{ padding: '0 50px' }}>
          <div style={{ background: '#fff', padding: 24, height: '100%', overflowY: 'scroll' }}>
            <Collapse
              accordion
              activeKey={[activeKey]}
              // activeKey={props.targetStrings.map((value, index) => index)}
              onChange={clickedKey => {
                if (clickedKey) {
                  setActiveKey(clickedKey);
                }
              }}
            >
              {
                props.targetStrings.map((targetString, index, targetStrings) =>
                  <Panel
                    header={`Test ${index +　1}`}
                    key={index}
                  >
                    <Card title={`Target string: ${targetString}`}>
                      <Input
                        id={'input' + index}
                        placeholder={'在此输入' + index}
                        disabled={analysisResults[index]}
                        onKeyPress={e => {
                          if (e.charCode === 13) {
                            setAnalysisResults([...analysisResults].map((value, i) => {
                              if (index === i) return true;
                              else return value;
                            }));

                            let fun;
                            if (index < targetStrings.length - 1) {
                              fun = e => {
                                if (e.charCode === 13 && e.path.length === 4) {
                                  setActiveKey(index + 1);
                                  document.removeEventListener('keypress', fun);
                                }
                              }
                            } else {
                              fun = e => {
                                if (e.charCode === 13 && e.path.length === 4) {
                                  setActiveKey(index);
                                  document.removeEventListener('keypress', fun);
                                }
                              }
                            }
                            document.addEventListener('keypress', fun);
                          }
                        }}
                      ></Input>
                    </Card>
                    {/* <Button onClick={() => setActiveKey(index + 1)}></Button> */}
                    {
                      // index === 3 ?
                      analysisResults[index] ?
                      <AnalysisResult></AnalysisResult> :
                      null
                    }
                  </Panel>
                )
              }
            </Collapse>
          </div>
        </Content>

        <Footer style={{ textAlign: 'center' }}>Footer</Footer>
      </Layout>
    </div>
  );
};

TestPage.propTypes = {
  targetStrings: PropTypes.array,
};

export default TestPage;
