import { BasicTag } from '@actiontech/shared';
import {
  IconProjectFlag,
  IconClock,
  IconUser
} from '@actiontech/shared/lib/Icon/common';
import { Space } from 'antd';
import dayjs from 'dayjs';
import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/global';

const BaseInfoTag: React.FC = () => {
  const { projectName } = useCurrentProject();
  const { username } = useCurrentUser();
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
