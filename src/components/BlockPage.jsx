import {
  Collapse,
} from 'antd';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { TrialsDispatch } from './Contexts';
import { initialState, reducer } from './store';
import Trial from './Trial';

const { Panel } = Collapse;

const BlockPage = (props) => {
  const [activeKey, setActiveKey] = useState(0);
  const [state, dispatch] = useReducer(reducer, initialState);
  let { blockNum } = useParams();

  useEffect(() => {
    dispatch({ type: 'RESET_TRIALS' });
    setActiveKey(0);
    props.setTitle(`Block ${blockNum}`);
    console.log(state)
  }, [blockNum, props]);

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
                blockNum={parseInt(blockNum)}
                trial={trial}
                index={index}
                isLastTrial={index === state.trials.length - 1}
                isLastBlock={parseInt(blockNum) === state.blockCount}
                setActiveKey={setActiveKey}
              />
            </Panel>
          )
        }
      </Collapse>
    </TrialsDispatch.Provider>
  );
};

BlockPage.propTypes = {
  targetStrings: PropTypes.array,
  speakControl: PropTypes.object,
};

export default BlockPage;
