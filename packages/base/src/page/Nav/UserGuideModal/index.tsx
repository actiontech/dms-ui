import { Radio } from 'antd';
import type { RadioGroupProps } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BasicModal, BasicButton } from '@actiontech/dms-kit';
import { useCurrentUser } from '@actiontech/shared/lib/features';
import { UserGuideModalStyleWrapper } from './style';
import {
  GetUserSystemEnum,
  UpdateCurrentUserSystemEnum
} from '@actiontech/shared/lib/api/base/service/common.enum';
import { DmsApi } from '@actiontech/shared/lib/api';
import { ResponseCode } from '@actiontech/dms-kit';
import { useRequest } from 'ahooks';
import { useDispatch } from 'react-redux';
import { updateSystemPreference } from '../../../store/user';

const UserGuideModal: React.FC = () => {
  const { t } = useTranslation();

  const { systemPreference } = useCurrentUser();

  const dispatch = useDispatch();

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

  const options = [
    {
      value: GetUserSystemEnum.WORKBENCH,
      label: t('dmsMenu.userGuide.dataWorkspace.label'),
      description: t('dmsMenu.userGuide.dataWorkspace.description')
    },
    {
      value: GetUserSystemEnum.MANAGEMENT,
      label: t('dmsMenu.userGuide.adminPanel.label'),
      description: t('dmsMenu.userGuide.adminPanel.description')
    }
  ];

  return (
    <BasicModal
      title={t('dmsMenu.userGuide.title')}
      open={!systemPreference}
      footer={null}
      centered
      closable={false}
    >
      <UserGuideModalStyleWrapper>
        <div className="option-container">
          <Radio.Group
            value={system}
            onChange={
              ((e) => setSystem(e.target.value)) as RadioGroupProps['onChange']
            }
            className="radio-group"
          >
            {options.map((option) => (
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
        </div>

        <div className="button-container">
          <BasicButton
            type="primary"
            size="large"
            onClick={updateCurrentUserSystem}
            className="primary-button"
            loading={updateCurrentUserSystemLoading || openCloudBeaverLoading}
          >
            {t('dmsMenu.userGuide.confirmButton')}
          </BasicButton>
        </div>
      </UserGuideModalStyleWrapper>
    </BasicModal>
  );
};

export default UserGuideModal;
