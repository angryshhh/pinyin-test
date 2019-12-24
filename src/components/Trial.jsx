import {
  Card,
  Input,
} from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import AnalysisResult from './AnalysisResult';
import SpeakControl from '../utils/SpeakControl';
import { TrialsDispatch } from './Contexts';

const { ipcRenderer } = window.require('electron');

const Trial = (props) => {
  const [isEntering, setIsEntering] = useState(false);
  const [resultString, setResultString] = useState('');
  const dispatch = useContext(TrialsDispatch);
  const [startEnterTime, setStartEnterTime] = useState(new Date());
  const [charStartTime, setCharStartTime] = useState(new Date());
  const [charEnterTimes, setCharEnterTimes] = useState([]);

  useEffect(() => {
    if (props.isCurrentTrial) {
      SpeakControl.forceSpeak(props.trial.targetString);
      setResultString('');
      setIsEntering(false);
      setCharStartTime(new Date());
      setCharEnterTimes([]);
      let handleSpaceAndEnter = e => {
        if (e.charCode === 32) {
          e.preventDefault();
          SpeakControl.forceSpeak(props.trial.targetString);
        } else if (e.charCode === 13) {
          setStartEnterTime(new Date());
          setIsEntering(true);
          ipcRenderer.send('is-entering-char', true);
          document.querySelector(`#input${props.index}`).focus();
          document.removeEventListener('keypress', handleSpaceAndEnter);
        }
      }
      document.addEventListener('keypress', handleSpaceAndEnter);
    }
  }, [props.isCurrentTrial, props.index, props.trial.targetString]);

  return (
    <div>
      <Card title={`Target string: ${props.trial.targetString}`}>
        <Input
          id={'input' + props.index}
          placeholder="在此输入"
          disabled={!isEntering}
          value={resultString}
          onChange={e => {
            let str = e.target.value;
            setResultString(str);
            if (str[str.length - 1] === ' ') {
              setCharStartTime(e.timeStamp);
            } else {
              charEnterTimes.push(e.timeStamp - charStartTime);
              setCharEnterTimes(charEnterTimes);
              console.log(charEnterTimes)
            }
          }}
          onKeyPress={e => {
            if (e.charCode === 13) {
              let trialTime = new Date() - startEnterTime;
              setIsEntering(false);
              dispatch({
                type: 'COMPLETE_TRIAL',
                result: {
                  trialTime,
                  wordFrequencyLevel: props.trial.wordFrequencyLevel,
                  referenceStructureLevel: props.trial.referenceStructureLevel,
                  charEnterTimes,
                },
              });

              if (props.isLastTrial) {
                if (props.isLastBlock) {
                  SpeakControl.forceSpeak('实验结束');
                } else {
                  SpeakControl.forceSpeak('该block结束，回车进行下一block');
                  let handleNextEnter = e => {
                    if (e.charCode === 13) {
                      dispatch({ type: 'NEXT_BLOCK' });
                      document.removeEventListener('keypress', handleNextEnter);
                    }
                  }
                  document.addEventListener('keypress', handleNextEnter);
                }
              } else {
                SpeakControl.forceSpeak('输入结束，回车进行下一个');
                let handleNextEnter = e => {
                  dispatch({ type: 'NEXT_TRIAL' });
                  document.removeEventListener('keypress', handleNextEnter);
                }
                document.addEventListener('keypress', handleNextEnter);
              }
            } else if (e.charCode === 32) { // ban space key
              e.preventDefault();
              console.log('用户输入空格');
            }
          }}
        />
      </Card>
      {
        props.result ?
        <AnalysisResult result={props.result}></AnalysisResult> :
        null
      }
    </div>
  )
};

export default Trial;
