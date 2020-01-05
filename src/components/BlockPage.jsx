import { Collapse } from 'antd';
import React, { useState, useEffect } from 'react';
import Trial from './Trial';

const { Panel } = Collapse;

const BlockPage = (props) => {
  const [activeKey, setActiveKey] = useState(0);

  useEffect(() => {
    setActiveKey(props.currentTrial - 1);
  }, [props.currentTrial])

  return (
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
        props.trials.map((trial, index) =>
          <Panel
            header={`Trial ${index + 1}`}
            key={index}
          >
            <Trial
              trial={trial}
              isCurrentTrial={index === props.currentTrial - 1}
              result={props.results[index]}
              isLastTrial={index === props.trials.length - 1}
            />
          </Panel>
        )
      }
    </Collapse>
  );
};

export default BlockPage;
