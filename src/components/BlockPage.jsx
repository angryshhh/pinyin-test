import {
  Collapse,
} from 'antd';
import PropTypes from 'prop-types';
import React, { useState, useReducer } from 'react';
import { TrialsDispatch } from './Contexts';
import { initialState, reducer } from './store';
import Trial from './Trial';

const { Panel } = Collapse;

const BlockPage = (props) => {
  const [activeKey, setActiveKey] = useState(0);
  const [state, dispatch] = useReducer(reducer, initialState);

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
                trial={trial}
                index={index}
                isLastTrial={index === state.trials.length - 1}
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
