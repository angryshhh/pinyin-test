import {
  Collapse,
} from 'antd';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useReducer } from 'react';
import Trial from './Trial';
import { initialState, reducer } from './store';
import TrialsDispatch from './TrialsDispatch';

const { Panel } = Collapse;

const BlockPage = (props) => {
  let { forceSpeak } = props.speakControl;
  const [activeKey, setActiveKey] = useState(0);
  // const [analysisResults, setAnalysisResults] = useState(new Array(props.targetStrings.length).fill(false));
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    forceSpeak(props.targetStrings[activeKey]);
    document.querySelectorAll('#input' + activeKey)[0].focus();
  }, [activeKey]);

  return (
    <TrialsDispatch.Provider value={dispatch}>
      <Collapse
        accordion
        activeKey={[activeKey]}
        onChange={clickedKey => {
          if (clickedKey) {
            setActiveKey(clickedKey);
          }
        }}
      >
        {
          state.trials.map((trial, index) =>
            <Panel
              header={`Trial ${index + 1}`}
              key={index}
            >
              <Trial
                targetString={trial.targetString}
                analysisResult={trial.analysisResult}
                index={index}
              />
            </Panel>
          )
        }
      {/* {
        props.targetStrings.map((targetString, index, targetStrings) =>
          <Panel
          header={`Test ${index +　1}`}
          key={index}
          >
          <Card title={`Target string: ${targetString}`}>
          <Input
                id={'input' + index}
                placeholder="在此输入"
                disabled={analysisResults[index]}
                onKeyPress={e => {
                  if (e.charCode === 13) {
                    setAnalysisResults([...analysisResults].map((value, i) => {
                      if (index === i) return true;
                      else return value;
                    }));
                    let fun;
                    if (index < targetStrings.length - 1) {
                      fun = e => {
                        if (e.charCode === 13 && e.path.length === 4) {
                          setActiveKey(index + 1);
                          document.removeEventListener('keypress', fun);
                        }
                      }
                    } else {
                      fun = e => {
                        if (e.charCode === 13 && e.path.length === 4) {
                          forceSpeak('实验结束');
                          document.removeEventListener('keypress', fun);
                        }
                      }
                    }
                    document.addEventListener('keypress', fun);
                  }
                }}
              ></Input>
              </Card>
            {
              analysisResults[index] ?
              <AnalysisResult></AnalysisResult> :
              null
            }
            </Panel>
            )
          } */}
      </Collapse>
    </TrialsDispatch.Provider>
  );
};

BlockPage.propTypes = {
  targetStrings: PropTypes.array,
  speakControl: PropTypes.object,
};

export default BlockPage;
