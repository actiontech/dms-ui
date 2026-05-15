import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BasicButton, BasicModal } from '@actiontech/dms-kit';
import { useCurrentUser } from '@actiontech/shared/lib/features';
import { UserGuideModalButtonContainer } from './style';
import {
  GetUserSystemEnum,
  UpdateCurrentUserSystemEnum
} from '@actiontech/shared/lib/api/base/service/common.enum';
import { DmsApi } from '@actiontech/shared/lib/api';
import { ResponseCode } from '@actiontech/dms-kit';
import { useRequest } from 'ahooks';
import { useDispatch } from 'react-redux';
import { updateSystemPreference } from '../../../store/user';
import UserGuideContent from './UserGuideContent';
import { Typography } from 'antd';
import useNavigateToWorkbench from '../../../hooks/useNavigateToWorkbench';

const UserGuideModal: React.FC = () => {
  const { t } = useTranslation();

  const { systemPreference } = useCurrentUser();

  const dispatch = useDispatch();

  const [system, setSystem] = useState(GetUserSystemEnum.MANAGEMENT);

  const { navigateToWorkbenchLoading, navigateToWorkbenchAsync } =
    useNavigateToWorkbench();

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
          if (system === GetUserSystemEnum.WORKBENCH) {
            navigateToWorkbenchAsync();
          }
        }
      }),
    {
      manual: true,
      onFinally: () => {
        dispatch(updateSystemPreference({ systemPreference: system }));
      }
    }
  );

  return (
    <BasicModal
      title={t('dmsMenu.userGuide.title')}
      open={!systemPreference}
      footer={null}
      centered
      closable={false}
    >
      <UserGuideContent
        system={system}
        onSystemChange={(e) => setSystem(e.target.value)}
        onConfirm={updateCurrentUserSystem}
        loading={updateCurrentUserSystemLoading || navigateToWorkbenchLoading}
      />
      <Typography.Text type="secondary">
        {t('dmsMenu.userGuide.description')}
      </Typography.Text>
      <UserGuideModalButtonContainer>
        <BasicButton
          type="primary"
          size="large"
          onClick={updateCurrentUserSystem}
          className="primary-button"
          loading={updateCurrentUserSystemLoading || navigateToWorkbenchLoading}
        >
          {t('dmsMenu.userGuide.confirmButton')}
        </BasicButton>
      </UserGuideModalButtonContainer>
    </BasicModal>
  );
};

export default UserGuideModal;
