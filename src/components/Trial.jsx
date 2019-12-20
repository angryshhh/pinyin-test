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
    SpeakControl.forceSpeak(props.trial.targetString);
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
  }, [props.trial.targetString, props.index]);

  return (
    <div>
      <Card title={`Target string: ${props.trial.targetString}`}>
        <Input
          id={'input' + props.index}
          placeholder="在此输入"
          disabled={!isEntering}
          onKeyPress={e => {
            if (e.charCode === 13) {
              // do the analyse
              SpeakControl.forceSpeak('输入结束，回车进行下一个');
              setIsEntering(false);
              dispatch({ type: 'COMPLETE_TRIAL', index: props.index });

              let handleNextEnter;
              if (props.isLastTrial) {
                handleNextEnter = e => {
                  // if (e.charCode === 13 && e.path.length === 4) {
                  if (e.charCode === 13) {
                    SpeakControl.forceSpeak('实验结束');
                    document.removeEventListener('keypress', handleNextEnter);
                  }
                };
              } else {
                handleNextEnter = e => {
                  // if (e.charCode === 13 && e.path.length === 4) {
                  if (e.charCode === 13) {
                    props.setActiveKey(props.index + 1);
                    document.removeEventListener('keypress', handleNextEnter);
                  }
                };
              }
              document.addEventListener('keypress', handleNextEnter);
            }
          }}
        />
      </Card>
      {
        props.trial.analysisResult ?
        <AnalysisResult></AnalysisResult> :
        null
      }
    </div>
  )
};

export default Trial;
