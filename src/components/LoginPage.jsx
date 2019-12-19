import {
  Button,
  Modal,
  Input,
} from 'antd';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const { confirm, info } = Modal;

const infoContent = '本次实验的步骤是 bla bla bla。实验即将开始，按回车开始。';

const LoginPage = (props) => {
  let { forceSpeak } = props.speakControl;
  let history = useHistory();

  const [subjectCode, setSubjectCode] = useState();

  useEffect(() => {
    forceSpeak('请输入编号');
  }, []);

  return (
    <div style={{ textAlign: 'center' }}>
      <Input autoFocus placeholder="请输入编号" type="number" value={subjectCode} onChange={e => setSubjectCode(e.target.value)} ></Input>
      <Button
        type="primary"
        onClick={() => {
          let confirmContent = `你是${subjectCode}号同学吗`;
          forceSpeak(confirmContent)
          confirm({
            title: '信息确认',
            content: confirmContent,
            onOk() {
              forceSpeak(infoContent);
              info({
                title: '重要提示',
                content: infoContent,
                onOk() {
                  history.push('/block');
                }
              });
            },
          });
        }}
      >开始测试</Button>
    </div>
  );
};

export default LoginPage;
