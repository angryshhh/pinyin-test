import React, { useState, useEffect} from 'react';
import {
  Card,
  Collapse,
  Descriptions,
  Input,
  Layout,
} from 'antd';
import PropTypes from 'prop-types';

const { Panel } = Collapse;
const { Header, Footer, Content } = Layout;

const { ipcRenderer } = window.require('electron');
const synth = window.speechSynthesis;
const utterance = new SpeechSynthesisUtterance();

const TestPage = (props) => {
  const [speakContent, setSpeakContent] = useState('');
  useEffect(() => {
    ipcRenderer.on('receive-candidate-list', (event, data) => {
      setSpeakContent(data);
    });
    // document.querySelectorAll('.focusClass')[0].focus();
  }, []);
  useEffect(() => {
    synth.cancel();
    utterance.text = speakContent;
    synth.speak(utterance);
    console.log(utterance);
    console.log('web page receive: ' + speakContent);
  }, [speakContent]);

  return (
    // <div>
    //   <div>
    //     inputh here:<br />
    //     <input className="focusClass"></input>
    //   </div>
    //   <div style={{ paddingTop: '50px', }}>
    //     speakContent:<br />
    //     { speakContent }
    //   </div>
    //   {props.targetStr}
    // </div>
    <div>
      <Layout style={{ height: '100vh' }}>
        <Header style={{ textAlign: 'center', color: 'white' }}>{props.targetStr}</Header>
        <Content style={{ padding: '0 50px' }}>
          <div style={{ background: '#fff', padding: 24, height: '100%', overflowY: 'scroll' }}>
          <Collapse accordion>
              <Panel header="Test 1" key='1'>

                <Card title="Target string: 今天天气不错">
                  <Input placeholder="在此输入"></Input>
                </Card>

                <Descriptions
                  title="分析结果"
                  bordered
                >
                  <Descriptions.Item label="输入时长">00:04:23</Descriptions.Item>
                  <Descriptions.Item label="Billing">Prepaid</Descriptions.Item>
                  <Descriptions.Item label="time">18:00:00</Descriptions.Item>
                  <Descriptions.Item label="Amount">$80.00</Descriptions.Item>
                  <Descriptions.Item label="Discount">$20.00</Descriptions.Item>
                  <Descriptions.Item label="Config Info">
                    Data disk type: MongoDB
                    <br />
                    Database version: 3.4
                    <br />
                    Package: dds.mongo.mid
                    <br />
                    Storage space: 10 GB
                    <br />
                    Replication factor: 3
                    <br />
                    Region: East China 1
                  </Descriptions.Item>
                  <Descriptions.Item label="Official">$60.00</Descriptions.Item>
                </Descriptions>
                
              </Panel>
              <Panel header="Test 2" key='2'>
                <Card title="Target string: 见到你很高兴">
                  <p>aaa</p>
                </Card>
              </Panel>
              <Panel header="Test 3" key='3'>
                <Card title="Target string: 我们去散步">
                  <p>aaa</p>
                </Card>
              </Panel>
            </Collapse>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Footer</Footer>
      </Layout>
    </div>
  );
};

TestPage.propTypes = {
  targetStr: PropTypes.string,
};

export default TestPage;
