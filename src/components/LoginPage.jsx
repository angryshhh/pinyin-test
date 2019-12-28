import {
  Modal,
  Input,
} from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import SpeakControl from '../utils/SpeakControl';
import { TrialsDispatch } from '../utils/Contexts.js';

const { confirm, info } = Modal;

const LoginPage = (props) => {
  const history = useHistory();
  const [subjectCode, setSubjectCode] = useState();
  const dispatch = useContext(TrialsDispatch);
  let infoContent = `
    实验步骤：\n
    1、程序朗读目标字符串，可按空格键重复朗读\n
    2、确认记住目标字符串后，按回车开始输入\n
    3、开始输入拼音前，可按空格朗读目标字符串与输入进度\n
    4、拼音输入过程中，请平衡准确度与输入速度\n
    5、每次请输入单个汉字的拼音\n
    6、输入过程中，禁止按空格，否则会选择第一个候选字，除非该字是你想要的\n
    7、单个汉字的拼音输入后，根据声音提示，使用数字键，在当前候选页进行选择\n
    8、可使用加号、减号进行换页操作\n
    9、单个汉字选择后，不允许修改\n
    10、当已输入的长度与目标字符串相等，则视为完成当前字符串\n
    11、完成后，可按回车开始下一个字符串\n
    现在，请戴上眼罩，按回车开始实验
  `;

  useEffect(() => {
    SpeakControl.forceSpeak('请输入编号');
  }, []);

  return (
    <Input
      autoFocus
      placeholder="请输入编号"
      type="number"
      value={subjectCode}
      onChange={e => setSubjectCode(parseInt(e.target.value))}
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
                  dispatch({
                    type: 'SUBJECT_LOGIN',
                    subjectCode,
                  })
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
