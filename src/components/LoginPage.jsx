import {
  Modal,
  Input,
  Button,
} from 'antd';
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import SpeakControl from '../utils/SpeakControl';
import { TrialsDispatch } from '../utils/Contexts.js';

const { confirm } = Modal;
const { ipcRenderer } = window.require('electron');

const LoginPage = (props) => {
  const history = useHistory();
  const [subjectCode, setSubjectCode] = useState(props.subjectCode);
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useContext(TrialsDispatch);
  const inputRef = useRef(null);
  let infoContent = `
    实验步骤：
    1、程序朗读目标字符串，可按空格键重复朗读
    2、确认记住目标字符串后，按回车开始输入
    3、开始输入拼音前，可按空格朗读目标字符串与输入进度
    4、拼音输入过程中，请平衡准确度与输入速度
    5、每次请输入单个汉字的拼音
    6、输入过程中，禁止按空格，否则会选择第一个候选字，除非该字是你想要的
    7、单个汉字的拼音输入后，根据声音提示，使用数字键，在当前候选页进行选择
    8、可使用加号、减号进行换页操作
    9、单个汉字选择后，不允许修改
    10、当已输入的长度与目标字符串相等，则视为完成当前字符串
    11、完成后，可按回车开始下一个字符串
    现在，请戴上眼罩，按回车开始实验
  `;

  useEffect(() => {
    SpeakControl.forceSpeak('请输入编号');
    inputRef.current.focus();
    inputRef.current.select();
  }, []);

  return (
    <div>
      <Input
        autoFocus
        placeholder="请输入编号"
        type="number"
        ref={inputRef}
        value={subjectCode}
        onChange={e => {
          if (e.target.value) {
            setSubjectCode(parseInt(e.target.value))
          }
        }}
        onKeyPress={e => {
          if (e.charCode === 13) {
            let finishedBlock = ipcRenderer.sendSync('get-block', subjectCode);
            let confirmContent = `${subjectCode}号同学已完成${finishedBlock >= 0 ? finishedBlock + '个' : '所有'}block`;
            SpeakControl.forceSpeak(confirmContent);
            confirm({
              title: '信息确认',
              content: confirmContent,
              onOk() {
                if (finishedBlock >= 0) {
                  dispatch({
                    type: 'SUBJECT_LOGIN',
                    subjectCode,
                    block: finishedBlock + 1,
                  });
                  SpeakControl.forceSpeak(infoContent);
                  setModalVisible(true);
                }
              },
            });
          }
        }}
      />
      <Modal
        visible={modalVisible}
        title="重要提示"
        onCancel={e => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={e => setModalVisible(false)}>
            取消
          </Button>,
          <Button key="warm" onClick={e => history.push('/warm-up')}>
            开始练习
          </Button>,
          <Button type="primary" key="block" onClick={e => history.push('/block')}>
            开始实验
          </Button>,
        ]}
      >
        <p>实验步骤：</p>
        <p>1、程序朗读目标字符串，可按空格键重复朗读</p>
        <p>2、确认记住目标字符串后，按回车开始输入</p>
        <p>3、开始输入拼音前，可按空格朗读目标字符串与输入进度</p>
        <p>4、拼音输入过程中，请平衡准确度与输入速度</p>
        <p>5、每次请输入单个汉字的拼音</p>
        <p>6、输入过程中，禁止按空格，否则会选择第一个候选字，除非该字是你想要的</p>
        <p>7、单个汉字的拼音输入后，根据声音提示，使用数字键，在当前候选页进行选择</p>
        <p>8、可使用加号、减号进行换页操作</p>
        <p>9、单个汉字选择后，不允许修改</p>
        <p>10、当已输入的长度与目标字符串相等，则视为完成当前字符串</p>
        <p>11、完成后，可按回车开始下一个字符串</p>
        <p>现在，请戴上眼罩，按回车开始实验</p>
      </Modal>
    </div>
  );
};

export default LoginPage;
