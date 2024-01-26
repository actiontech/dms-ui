import { useTranslation } from 'react-i18next';
import { useBoolean, useRequest } from 'ahooks';
import { useCallback, useMemo } from 'react';
import { Form, Spin, Typography } from 'antd';
import { FormFields } from './index.type';

import useConfigSwitch from '../../hooks/useConfigSwitch';
import useConfigRender, {
  ReadOnlyConfigColumnsType
} from '../../hooks/useConfigRender';
import ConfigSwitch from '../../components/ConfigSwitch';

import ConfigSubmitButtonField from '../../components/ConfigSubmitButtonField';
import ConfigExtraButtons from './conponents/ConfigExtraButtons';
import ConfigField from './conponents/ConfigField';

import dms from '@actiontech/shared/lib/api/base/service/dms';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { IFeishuConfigurationResData } from '@actiontech/shared/lib/api/base/service/common';
import { switchFieldName } from './index.data';

const LarkSetting: React.FC = () => {
  const { t } = useTranslation();

  const {
    form,
    renderConfigForm,
    startModify,
    modifyFinish,
    modifyFlag,
    extraButtonsVisible,
    enabled
  } = useConfigRender<FormFields>({
    switchFieldName,
    switchFieldLabel: t('dmsSystem.lark.enable')
  });

  const [submitLoading, { setTrue: startSubmit, setFalse: submitFinish }] =
    useBoolean();

  const {
    data: larkInfo,
    loading,
    refresh: refreshLarkInfo
  } = useRequest(
    () => dms.GetFeishuConfiguration().then((res) => res.data?.data ?? {}),
    {
      onSuccess(res) {
        if (res) {
          form.setFieldsValue({
            enabled: !!res.is_feishu_notification_enabled
          });
        }
      }
    }
  );
  const isConfigClosed = useMemo(() => {
    return !larkInfo?.is_feishu_notification_enabled;
  }, [larkInfo]);

  const setFormDefaultValue = useCallback(() => {
    form.setFieldsValue({
      appKey: larkInfo?.app_id,
      appSecret: undefined
    });
  }, [form, larkInfo]);

  const handleClickModify = () => {
    setFormDefaultValue();
    startModify();
  };
  const handleClickCancel = () => {
    if (isConfigClosed) form.setFieldsValue({ [switchFieldName]: false });
    setFormDefaultValue();
    modifyFinish();
  };
  const handleToggleSwitch = (open: boolean) => {
    form.setFieldValue(switchFieldName, open);
  };

  const submitLarkConfig = (values: FormFields) => {
    startSubmit();
    dms
      .UpdateFeishuConfiguration({
        update_feishu_configuration: {
          is_feishu_notification_enabled: values.enabled,
          app_id: values.appKey,
          app_secret: values.appSecret
        }
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          modifyFinish();
          refreshLarkInfo();
          form.resetFields();
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  const switchOpen = Form.useWatch(switchFieldName, form);

  const {
    configSwitchPopoverVisible,
    onConfigSwitchPopoverOpen,
    onConfigSwitchPopoverConfirm,
    onConfigSwitchChange
  } = useConfigSwitch({
    isConfigClosed,
    switchOpen,
    modifyFlag,
    startSubmit,
    submitFinish,
    handleClickModify,
    handleUpdateConfig: () =>
      dms.UpdateFeishuConfiguration({
        update_feishu_configuration: {
          ...larkInfo,
          is_feishu_notification_enabled: false
        }
      }),
    handleClickCancel,
    refreshConfig: refreshLarkInfo,
    handleToggleSwitch
  });

  const readonlyColumnsConfig: ReadOnlyConfigColumnsType<IFeishuConfigurationResData> =
    useMemo(() => {
      return [
        {
          label: 'App ID',
          span: 3,
          dataIndex: 'app_id',
          hidden: !larkInfo?.is_feishu_notification_enabled,
          render: (val) => (
            <Typography.Paragraph>{val || '--'}</Typography.Paragraph>
          )
        }
      ];
    }, [larkInfo]);

  return (
    <div className="config-form-wrapper">
      <Spin spinning={loading || submitLoading}>
        {renderConfigForm({
          data: larkInfo ?? {},
          columns: readonlyColumnsConfig,
          configExtraButtons: (
            <ConfigExtraButtons
              enabled={enabled}
              isConfigClosed={isConfigClosed}
              extraButtonsVisible={extraButtonsVisible}
              handleClickModify={handleClickModify}
            />
          ),
          configSwitchNode: (
            <ConfigSwitch
              switchFieldName={switchFieldName}
              switchOpen={switchOpen}
              modifyFlag={modifyFlag}
              submitLoading={submitLoading}
              popoverVisible={configSwitchPopoverVisible}
              onConfirm={onConfigSwitchPopoverConfirm}
              onSwitchChange={onConfigSwitchChange}
              onSwitchPopoverOpen={onConfigSwitchPopoverOpen}
            />
          ),
          configField: <ConfigField />,
          submitButtonField: (
            <ConfigSubmitButtonField
              submitLoading={submitLoading}
              handleClickCancel={handleClickCancel}
            />
          ),
          submit: submitLarkConfig
        })}
      </Spin>
    </div>
  );
};

export default LarkSetting;
