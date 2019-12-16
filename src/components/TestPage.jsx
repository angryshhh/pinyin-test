import {
  Card,
  Collapse,
  Input,
  Layout,
} from 'antd';
import PropTypes from 'prop-types';
import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import AnalysisResult from './AnalysisResult';

const { Panel } = Collapse;
const { Header, Footer, Content } = Layout;

const TestPage = (props) => {
  let { forceSpeak } = props.speakControl;
  const [activeKey, setActiveKey] = useState(0);
  const [analysisResults, setAnalysisResults] = useState(new Array(props.targetStrings.length).fill(false));

  useEffect(() => {
    forceSpeak(props.targetStrings[activeKey]);
    document.querySelectorAll('#input' + activeKey)[0].focus();
  }, [activeKey]);

  return (
    <div>
      <Layout style={{ height: '100vh' }}>
        <Header style={{ textAlign: 'center', color: 'white' }}>测试页面</Header>

        <Content style={{ padding: '0 50px' }}>
          <div style={{ background: '#fff', padding: 24, height: '100%', overflowY: 'scroll' }}>
            <Collapse
              accordion
              activeKey={[activeKey]}
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
                        placeholder="在此输入"
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
                                  // setActiveKey(index);
                                  forceSpeak('实验结束');
                                  document.removeEventListener('keypress', fun);
                                }
                              }
                            }
                            document.addEventListener('keypress', fun);
                          }
                        }}
                      ></Input>
                    </Card>
                    {
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

        <Footer style={{ textAlign: 'center' }}>
          <Link to="/">返回登录</Link>
        </Footer>
      </Layout>
    </div>
  );
};

TestPage.propTypes = {
  targetStrings: PropTypes.array,
  speakControl: PropTypes.object,
};

export default TestPage;
