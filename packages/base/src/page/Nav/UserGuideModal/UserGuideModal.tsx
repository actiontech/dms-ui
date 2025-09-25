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
import useRecentlySelectedZone from '@actiontech/dms-kit/es/features/useRecentlySelectedZone';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../../store';

const UserGuideModal: React.FC = () => {
  const { t } = useTranslation();

  const { systemPreference } = useCurrentUser();

  const dispatch = useDispatch();

  const availabilityZoneTips = useSelector(
    (state: IReduxState) => state.availabilityZone.availabilityZoneTips
  );

  const { availabilityZone, updateRecentlySelectedZone } =
    useRecentlySelectedZone();

  const [system, setSystem] = useState(GetUserSystemEnum.MANAGEMENT);

  const { loading: openCloudBeaverLoading, run: openCloudBeaver } = useRequest(
    () => {
      return DmsApi.CloudBeaverService.GetSQLQueryConfiguration().then(
        (res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            return res.data.data;
          }
        }
      );
    },
    {
      onSuccess: (res) => {
        if (
          res?.enable_sql_query &&
          res.sql_query_root_uri &&
          res.sql_query_root_uri !== location.pathname
        ) {
          // 如果当前设置了可用区 并且没有最近选择的可用区记录 则设置一个默认的可用区
          if (!!availabilityZoneTips.length && !availabilityZone) {
            updateRecentlySelectedZone(availabilityZoneTips[0]);
          }

          // res.sql_query_root_uri !== location.pathname 防止无限刷新
          // 因为sql_query_root_uri是不携带origin的，只有pathname。所以开发环境localhost不可以直接跳转到CB
          // #if [PROD]
          window.location.href = res.sql_query_root_uri;
          // #endif
        }
      },
      ready: systemPreference === GetUserSystemEnum.WORKBENCH
    }
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
          if (system === GetUserSystemEnum.WORKBENCH) {
            openCloudBeaver();
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
        loading={updateCurrentUserSystemLoading || openCloudBeaverLoading}
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
          loading={updateCurrentUserSystemLoading || openCloudBeaverLoading}
        >
          {t('dmsMenu.userGuide.confirmButton')}
        </BasicButton>
      </UserGuideModalButtonContainer>
    </BasicModal>
  );
};

export default UserGuideModal;
