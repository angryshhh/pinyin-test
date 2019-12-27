import { Descriptions, Divider } from 'antd';
import React from 'react';
import { wordFrequencyLevels, referenceStructureLevels } from '../utils/data';

const AnalysisResult = (props) => {
  const { result } = props;
  return (
    <div>
      <Divider>分析结果</Divider>
      <Descriptions
        bordered
      >
        <Descriptions.Item label="输入时长">{result.trialTime}毫秒</Descriptions.Item>
        <Descriptions.Item label="提示用词次品">{wordFrequencyLevels[result.wordFrequencyLevel]}</Descriptions.Item>
        <Descriptions.Item label="提示内容结构">{referenceStructureLevels[result.referenceStructureLevel]}</Descriptions.Item>
        <Descriptions.Item label="subject code">{result.subjectCode}</Descriptions.Item>
        <Descriptions.Item label="block num">{result.blockNum}</Descriptions.Item>
        <Descriptions.Item label="trial num">{result.trialNum}</Descriptions.Item>
        <Descriptions.Item label="各字输入时间">
          {
            result.charEnterTimes.map(time =>
              <p key={time}>{time}毫秒</p>
            )
          }
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default AnalysisResult;
