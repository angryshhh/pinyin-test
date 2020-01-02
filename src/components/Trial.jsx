import {
  Card,
  Input,
} from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AnalysisResult from './AnalysisResult';
import SpeakControl from '../utils/SpeakControl';
import { TrialsDispatch } from '../utils/Contexts';

const { ipcRenderer } = window.require('electron');

const Trial = (props) => {
  const [isEntering, setIsEntering] = useState(false);
  const [resultString, setResultString] = useState('');
  const [startEnterTime, setStartEnterTime] = useState(new Date());
  const [charStartTime, setCharStartTime] = useState(new Date());
  const [charEnterTimes, setCharEnterTimes] = useState([]);
  const dispatch = useContext(TrialsDispatch);
  const history = useHistory();

  useEffect(() => {
    if (props.isCurrentTrial) {
      SpeakControl.forceSpeak(props.trial.targetString);
      ipcRenderer.send('set-levels', {
        wordFrequencyLevel: props.trial.wordFrequencyLevel,
        referenceStructureLevel: props.trial.referenceStructureLevel
      });
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
          document.querySelector(`#input${props.index}`).focus();
          document.removeEventListener('keypress', handleSpaceAndEnter);
        }
      }
      document.addEventListener('keypress', handleSpaceAndEnter);
    }
  }, [props.isCurrentTrial, props.index, props.trial]);

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
            if (str[str.length - 1] === ' ') {
              // handle the blank from the input method
              // take this blank as the begin of
              // the enter of the chinese character
              setResultString(str);
              setCharStartTime(e.timeStamp);
            } else if (/.*[\u4e00-\u9fa5]+.*$/.test(str[str.length - 1])) {
              // only handle chinese character
              // not some symbols returned from input method
              setResultString(str);
              SpeakControl.cancelFormerSpeak();
              charEnterTimes.push(e.timeStamp - charStartTime);
              setCharEnterTimes(charEnterTimes);

              if (str.length === props.trial.targetString.length) {
                // finish trial
                let trialTime = new Date() - startEnterTime;
                let errorRate = 0;
                for (let i = 0; i < str.length; i++) {
                  if (str[i] !== props.trial.targetString[i]) errorRate++;
                }
                errorRate /= str.length;
                setIsEntering(false);
                dispatch({
                  type: 'COMPLETE_TRIAL',
                  result: {
                    trialTime,
                    wordFrequencyLevel: props.trial.wordFrequencyLevel,
                    referenceStructureLevel: props.trial.referenceStructureLevel,
                    charEnterTimes,
                    errorRate,
                  },
                });
  
                if (props.isLastTrial) {
                  // last trial not in last block
                  SpeakControl.forceSpeak('该block结束，回车退出');
                  let handleNextEnter = e => {
                    if (e.charCode === 13) {
                      dispatch({ type: 'COMPLETE_ALL' });
                      history.push('/login');
                      document.removeEventListener('keypress', handleNextEnter);
                    }
                  }
                  document.addEventListener('keypress', handleNextEnter);
                } else {
                  // not last trial
                  SpeakControl.forceSpeak('输入结束，回车进行下一个');
                  let handleNextEnter = e => {
                    dispatch({ type: 'NEXT_TRIAL' });
                    document.removeEventListener('keypress', handleNextEnter);
                  }
                  document.addEventListener('keypress', handleNextEnter);
                }
              }
            }
          }}
          onKeyDown={e => {
            if (e.keyCode === 8) {
              // ban backspace key
              e.preventDefault();
            }
          }}
          onKeyPress={e => {
            // ban data inputed by keys
            e.preventDefault();
            if (e.charCode === 32) {
              // backspace to report target string and result string
              // while entering
              SpeakControl.forceSpeak(
                props.trial.targetString + '，' +
                '已输入' + props.trial.targetString.slice(0, resultString.length)
              );
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
