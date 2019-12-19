import {
  Card,
  Input,
} from 'antd';
import React, { useContext } from 'react';
import AnalysisResult from './AnalysisResult';
import TrialsDispatch from './TrialsDispatch';

const Trial = (props) => {
  const dispatch = useContext(TrialsDispatch);

  return (
    <div>
      <Card title={`Target string: ${props.targetString}`}>
        <Input
          id={'input' + props.index}
          placeholder="在此输入"
          disabled={props.analysisResult}
          onKeyPress={e => {
            if (e.charCode === 13) {
              dispatch({ type: 'COMPLETE_TRIAL', index: props.index });
            }
          }}
        />
      </Card>
      {
        props.analysisResult ?
        <AnalysisResult></AnalysisResult> :
        null
      }
    </div>
  )
};

export default Trial;
