import { BasicTag } from '@actiontech/shared';
import {
  IconProjectFlag,
  IconClock,
  IconUser
} from '@actiontech/shared/lib/Icon/common';
import { Space } from 'antd5';
import { BaseInfoTagProps } from './index.type';
import dayjs from 'dayjs';

const BaseInfoTag: React.FC<BaseInfoTagProps> = ({ projectName, username }) => {
  return (
    <Space className="base-info-form-item-slot">
      <BasicTag icon={<IconProjectFlag width={12} height={12} />}>
        {projectName}
      </BasicTag>
      <BasicTag icon={<IconClock width={12} height={12} />}>
        {dayjs().format('YYYY-MM-DD')}
      </BasicTag>
      <BasicTag icon={<IconUser width={12} height={12} />}>{username}</BasicTag>
    </Space>
  );
};

export default BaseInfoTag;
