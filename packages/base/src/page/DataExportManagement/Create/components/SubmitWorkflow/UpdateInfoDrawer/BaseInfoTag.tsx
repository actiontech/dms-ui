import { BasicTag } from '@actiontech/shared';
import { Space } from 'antd';
import dayjs from 'dayjs';
import {
  useCurrentProject,
  useCurrentUser
} from '@actiontech/shared/lib/features';
import { FlagFilled, UserFilled, ClockCircleFilled } from '@actiontech/icons';
import useThemeStyleData from '../../../../../../hooks/useThemeStyleData';

const BaseInfoTag: React.FC = () => {
  const { projectName } = useCurrentProject();
  const { username } = useCurrentUser();
  const { baseTheme } = useThemeStyleData();
  return (
    <Space className="base-info-form-item-slot">
      <BasicTag icon={<FlagFilled width={12} height={12} />}>
        {projectName}
      </BasicTag>
      <BasicTag
        icon={
          <ClockCircleFilled
            width={12}
            height={12}
            fill="none"
            color={baseTheme.icon.dataExport.clock}
          />
        }
      >
        {dayjs().format('YYYY-MM-DD')}
      </BasicTag>
      <BasicTag icon={<UserFilled width={12} height={12} />}>
        {username}
      </BasicTag>
    </Space>
  );
};

export default BaseInfoTag;
