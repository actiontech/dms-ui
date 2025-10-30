import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrentUser } from '@actiontech/shared/lib/features';
import {
  GetUserSystemEnum,
  UpdateCurrentUserSystemEnum
} from '@actiontech/shared/lib/api/base/service/common.enum';
import { DmsApi } from '@actiontech/shared/lib/api';
import { useRequest } from 'ahooks';
import UserGuideContent from '../../../Nav/UserGuideModal/UserGuideContent';
import { Space } from 'antd';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { BasicDrawer, BasicButton } from '@actiontech/shared';

type ModifyLoginPageModalProps = {
  open: boolean;
  onClose: () => void;
  updateUserInfo: () => void;
};

const ModifyLoginPageModal: React.FC<ModifyLoginPageModalProps> = ({
  open,
  onClose,
  updateUserInfo
}) => {
  const { t } = useTranslation();

  const { systemPreference } = useCurrentUser();

  const [system, setSystem] = useState(
    systemPreference ?? GetUserSystemEnum.MANAGEMENT
  );

  const {
    loading: updateCurrentUserSystemLoading,
    run: updateCurrentUserSystem
  } = useRequest(
    () =>
      DmsApi.UserService.UpdateCurrentUser({
        current_user: {
          system: system as unknown as UpdateCurrentUserSystemEnum
        }
      }).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          updateUserInfo();
          onClose();
        }
      }),
    {
      manual: true
    }
  );

  return (
    <BasicDrawer
      title={t('dmsAccount.loginConfiguration.title')}
      open={open}
      onClose={onClose}
      footer={
        <Space>
          <BasicButton
            onClick={onClose}
            disabled={updateCurrentUserSystemLoading}
          >
            {t('common.close')}
          </BasicButton>
          <BasicButton
            type="primary"
            onClick={updateCurrentUserSystem}
            loading={updateCurrentUserSystemLoading}
          >
            {t('common.ok')}
          </BasicButton>
        </Space>
      }
    >
      <UserGuideContent
        system={system}
        onSystemChange={(e) => setSystem(e.target.value)}
        onConfirm={updateCurrentUserSystem}
        loading={updateCurrentUserSystemLoading}
      />
    </BasicDrawer>
  );
};

export default ModifyLoginPageModal;
