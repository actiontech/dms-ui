import { useTranslation } from 'react-i18next';
import { useBoolean } from 'ahooks';
import { useMemo, useEffect } from 'react';
import { Spin, message } from 'antd';
import { CustomLabelContent } from '@actiontech/shared/lib/components/CustomForm';
import ConfigField from './components/ConfigField';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { FormFields } from './index.type';
import { switchFieldName } from './index.data';
import {
  useConfigRender,
  ConfigSwitch,
  ConfigSubmitButtonField,
  useConfigSwitchControls
} from '@actiontech/shared';
import { PersonalSMSProps } from './index.type';
import User from '@actiontech/shared/lib/api/base/service/User';
import SMS from '@actiontech/shared/lib/api/base/service/SMS';

const PersonalSMS: React.FC<PersonalSMSProps> = ({
  userBaseInfo,
  getUserInfo,
  loading
}) => {
  const { t } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();

  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();

  const {
    form,
    renderConfigForm,
    startModify,
    modifyFinish,
    modifyFlag,
    enabled
  } = useConfigRender<FormFields>({
    switchFieldName,
    switchFieldLabel: (
      <CustomLabelContent title={t('dmsAccount.sms.title')} tips="" />
    )
  });

  useEffect(() => {
    if (!!userBaseInfo) {
      form.setFieldsValue({
        [switchFieldName]: !!userBaseInfo.two_factor_enabled
      });
    }
  }, [userBaseInfo, form]);

  const isConfigClosed = useMemo(() => {
    return !userBaseInfo?.two_factor_enabled;
  }, [userBaseInfo]);

  const handleClickModify = () => {
    startModify();
  };
  const handleClickCancel = () => {
    if (isConfigClosed) form.setFieldValue(switchFieldName, false);
    modifyFinish();
  };

  const onSubmit = async (isCodingEnabled: boolean, values?: FormFields) => {
    startSubmit();
    if (isCodingEnabled) {
      const verificationRes = await SMS.VerifySmsCode({
        code: values?.code,
        username: userBaseInfo?.name
      });
      if (verificationRes.data.data?.verify_error_message) {
        messageApi.error(verificationRes.data.data?.verify_error_message);
      }
      if (
        verificationRes.data.code !== ResponseCode.SUCCESS ||
        !verificationRes.data.data?.is_verify_sent_normally
      ) {
        submitFinish();
        return;
      }
    }
    User.UpdateCurrentUser({
      current_user: {
        two_factor_enabled: isCodingEnabled
      }
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('dmsAccount.sms.updateSuccessTips'));
          modifyFinish();
          form.resetFields();
          getUserInfo();
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  const onConfigSwitchPopoverConfirm = () => {
    if (!userBaseInfo?.two_factor_enabled && modifyFlag) {
      handleClickCancel();
      hiddenConfigSwitchPopover();
    } else {
      onSubmit(false);
    }
  };

  const {
    configSwitchPopoverOpenState,
    generateConfigSwitchPopoverTitle,
    onConfigSwitchPopoverOpen,
    handleConfigSwitchChange,
    hiddenConfigSwitchPopover
  } = useConfigSwitchControls(form, switchFieldName);

  return (
    <div>
      {contextHolder}
      <Spin spinning={loading}>
        {renderConfigForm({
          data: userBaseInfo ?? {},
          columns: [],
          configExtraButtons: null,
          configSwitchNode: (
            <ConfigSwitch
              title={generateConfigSwitchPopoverTitle(modifyFlag)}
              switchFieldName={switchFieldName}
              submitLoading={submitLoading}
              popoverVisible={configSwitchPopoverOpenState}
              onConfirm={onConfigSwitchPopoverConfirm}
              onSwitchChange={(open) => {
                if (open && !userBaseInfo?.phone) {
                  messageApi.error(t('dmsAccount.sms.noPhoneNumbersTips'));
                  form.setFieldValue(switchFieldName, false);
                  return;
                }
                handleConfigSwitchChange(open, handleClickModify);
              }}
              onSwitchPopoverOpen={onConfigSwitchPopoverOpen}
            />
          ),
          configField: (
            <ConfigField
              userPhone={userBaseInfo?.phone}
              username={userBaseInfo?.name}
            />
          ),
          submitButtonField: (
            <ConfigSubmitButtonField
              submitLoading={submitLoading}
              handleClickCancel={handleClickCancel}
            />
          ),
          onSubmit: (values) => {
            onSubmit(enabled, values);
          }
        })}
      </Spin>
    </div>
  );
};

export default PersonalSMS;
