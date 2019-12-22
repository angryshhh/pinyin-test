import {
  Card,
  Input,
} from 'antd';
import React, { useState, useEffect, useContext } from 'react';
import AnalysisResult from './AnalysisResult';
import SpeakControl from '../utils/SpeakControl';
import { TrialsDispatch } from './Contexts';

const Trial = (props) => {
  const [isEntering, setIsEntering] = useState(false);
  const dispatch = useContext(TrialsDispatch);

  useEffect(() => {
    if (props.isCurrentTrial) {
      SpeakControl.forceSpeak(props.trial.targetString);
      setIsEntering(false)
      let handleSpaceAndEnter = e => {
        if (e.charCode === 32) {
          e.preventDefault();
          SpeakControl.forceSpeak(props.trial.targetString);
        } else if (e.charCode === 13) {
          setIsEntering(true);
          document.querySelector(`#input${props.index}`).focus();
          document.removeEventListener('keypress', handleSpaceAndEnter);
        }
      }
      document.addEventListener('keypress', handleSpaceAndEnter);
    }
  }, [props.isCurrentTrial]);

  return (
    <div>
      <Card title={`Target string: ${props.trial.targetString}`}>
        <Input
          id={'input' + props.index}
          placeholder="在此输入"
          disabled={!isEntering}
          onKeyPress={e => {
            if (e.charCode === 13) {
              setIsEntering(false);
              dispatch({ type: 'COMPLETE_TRIAL', index: props.index });

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
            }
          }}
        />
      </Card>
      {
        props.result ?
        <AnalysisResult></AnalysisResult> :
        null
      }
    </div>
  )
};

export default Trial;
