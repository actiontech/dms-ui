import React from 'react';
import { BasicToolTips, BasicTag } from '@actiontech/shared';
import { Space } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { EllipsisModalStyleWrapper } from './style';
import { IScopeReply } from '../../../../../../api/common';

interface IEllipsisModalProps {
  data: IScopeReply[];
}

const EllipsisModal: React.FC<IEllipsisModalProps> = ({ data }) => {
  return (
    <BasicToolTips
      title={
        <Space wrap>
          {data.map((item) => (
            <BasicTag key={item.scope_name}>{item.scope_desc}</BasicTag>
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
