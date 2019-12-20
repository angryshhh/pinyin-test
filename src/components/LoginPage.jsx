import {
  Modal,
  Input,
} from 'antd';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import SpeakControl from '../utils/SpeakControl';

const { confirm, info } = Modal;

const infoContent = '本次实验的步骤是 bla bla bla。实验即将开始，按回车开始。';

const LoginPage = (props) => {
  const history = useHistory();
  const [subjectCode, setSubjectCode] = useState();

  useEffect(() => {
    SpeakControl.forceSpeak('请输入编号');
  }, []);

  return (
    <Input
      autoFocus
      placeholder="请输入编号"
      type="number"
      value={subjectCode}
      onChange={e => setSubjectCode(e.target.value)}
      onKeyPress={e => {
        if (e.charCode === 13) {
          let confirmContent = `你是${subjectCode}号同学吗`;
          SpeakControl.forceSpeak(confirmContent);
          confirm({
            title: '信息确认',
            content: confirmContent,
            onOk() {
              SpeakControl.forceSpeak(infoContent);
              info({
                title: '重要提示',
                content: infoContent,
                onOk() {
                  history.push('/block');
                }
              });
            },
          });
        }
      }}
    />
  );
};

export default LoginPage;
