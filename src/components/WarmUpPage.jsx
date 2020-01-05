import { Input } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import SpeakControl from '../utils/SpeakControl';

const WarmUpPage = (props) => {
  const [isEntering, setIsEntering] = useState(false);
  const [resultString, setResultString] = useState('');
  const [warmUpStringIndex, setWarmUpStringIndex] = useState(0);
  const inputRef = useRef(null);
  const history = useHistory();

  useEffect(() => {
    SpeakControl.forceSpeak(props.warmUpStrings[warmUpStringIndex]);
    setIsEntering(false);
    let handleSpaceAndEnter = e => {
      if (e.charCode === 32) {
        e.preventDefault();
        SpeakControl.forceSpeak(props.warmUpStrings[warmUpStringIndex]);
      } else if (e.charCode === 13) {
        setIsEntering(true);
        inputRef.current.focus();
        document.removeEventListener('keypress', handleSpaceAndEnter);
      }
    }
    document.addEventListener('keypress', handleSpaceAndEnter);
  }, [props.warmUpStrings, warmUpStringIndex]);

  return (
    <div>
      <p>{props.warmUpStrings[warmUpStringIndex]}</p>
      <Input
        disabled={!isEntering}
        ref={inputRef}
        value={resultString}
        onChange={e => {
          let str = e.target.value;
          if (str[str.length - 1] === ' ') {
            setResultString(str);
          } else if (/.*[\u4e00-\u9fa5]+.*$/.test(str[resultString.length - 1])) {  // resultString now ended with a blank, so minus 1
            SpeakControl.cancelFormerSpeak();
            setResultString(str.slice(0, resultString.length));
            if (resultString.length === props.warmUpStrings[warmUpStringIndex].length) {
              setIsEntering(false);
              if (warmUpStringIndex === props.warmUpStrings.length - 1) {
                SpeakControl.forceSpeak('练习结束，回车开始实验');
                let handleNextEnter = e => {
                  if (e.charCode === 13) {
                    history.push('/block');
                  }
                }
                document.addEventListener('keypress', handleNextEnter);
              } else {
                setIsEntering(false);
                setResultString('');
                setWarmUpStringIndex(warmUpStringIndex + 1);
              }
            }
          }
        }}
        onKeyDown={e => {
          if (e.keyCode === 8) {
            e.preventDefault();
          }
        }}
        onKeyPress={e => {
          e.preventDefault();
          if (e.charCode === 32) {
            SpeakControl.forceSpeak(
              props.warmUpStrings[warmUpStringIndex] + '，' +
              '已输入' + props.warmUpStrings[warmUpStringIndex].slice(0, resultString.length)
            );
          }
        }}
      />
    </div>
  );
};

export default WarmUpPage;
