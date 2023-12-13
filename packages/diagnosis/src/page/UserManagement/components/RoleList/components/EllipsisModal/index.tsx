import React from 'react';
import { BasicToolTips, BasicTag } from '@actiontech/shared';
import { Space } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
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
      <span>
        <EllipsisOutlined />
      </span>
    </BasicToolTips>
  );
};

export default EllipsisModal;
