import React from 'react';
import { BasicToolTips, BasicTag } from '@actiontech/shared';
import { Space } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { EllipsisModalStyleWrapper } from './style';

interface IEllipsisModalProps {
  data: string[];
}

const EllipsisModal: React.FC<IEllipsisModalProps> = ({ data }) => {
  return (
    <BasicToolTips
      title={
        <Space wrap>
          {data.map((item) => (
            <BasicTag key={item}>{item}</BasicTag>
          ))}
        </Space>
      }
    >
      <EllipsisModalStyleWrapper>
        <EllipsisOutlined />
      </EllipsisModalStyleWrapper>
    </BasicToolTips>
  );
};

export default EllipsisModal;
