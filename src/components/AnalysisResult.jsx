import React from 'react';
import { Descriptions, Divider } from 'antd';

const AnalysisResult = () => {
  return (
    <div>
      <Divider>分析结果</Divider>
      <Descriptions
        bordered
        >
        <Descriptions.Item label="输入时长">00:04:23</Descriptions.Item>
        <Descriptions.Item label="Billing">Prepaid</Descriptions.Item>
        <Descriptions.Item label="time">18:00:00</Descriptions.Item>
        <Descriptions.Item label="Amount">$80.00</Descriptions.Item>
        <Descriptions.Item label="Discount">$20.00</Descriptions.Item>
        <Descriptions.Item label="Official">$60.00</Descriptions.Item>
        <Descriptions.Item label="Config Info">
          Data disk type: MongoDB
          <br />
          Database version: 3.4
          <br />
          Package: dds.mongo.mid
          <br />
          Storage space: 10 GB
          <br />
          Replication factor: 3
          <br />
          Region: East China 1
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default AnalysisResult;
