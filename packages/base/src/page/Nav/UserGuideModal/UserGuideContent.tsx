import { Radio } from 'antd';
import type { RadioGroupProps } from 'antd';
import { GetUserSystemEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import React from 'react';
import { UserGuideModalStyleWrapper } from './style';
import { useTranslation } from 'react-i18next';

type UserGuideContentProps = {
  system: GetUserSystemEnum;
  onSystemChange: RadioGroupProps['onChange'];
  onConfirm: () => void;
  loading: boolean;
};

const UserGuideContent: React.FC<UserGuideContentProps> = ({
  system,
  onSystemChange
}) => {
  const { t } = useTranslation();
  const systemOptions = [
    {
      value: GetUserSystemEnum.WORKBENCH,
      label: t('dmsMenu.userGuide.sqlWorkbench.label'),
      description: t('dmsMenu.userGuide.sqlWorkbench.description')
    },
    {
      value: GetUserSystemEnum.MANAGEMENT,
      label: t('dmsMenu.userGuide.adminPanel.label'),
      description: t('dmsMenu.userGuide.adminPanel.description')
    }
  ];
  return (
    <UserGuideModalStyleWrapper>
      <Radio.Group
        value={system}
        onChange={onSystemChange}
        className="radio-group"
      >
        {systemOptions.map((option) => (
          <Radio
            key={option.value}
            value={option.value}
            className="radio-option"
          >
            <div className="option-content">
              <div className="option-label">{option.label}</div>
              <div className="option-description">{option.description}</div>
            </div>
          </Radio>
        ))}
      </Radio.Group>
    </UserGuideModalStyleWrapper>
  );
};

export default UserGuideContent;
