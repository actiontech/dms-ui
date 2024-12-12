import { useBoolean } from 'ahooks';
import { Form, FormInstance } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const useConfigSwitchControls = <T extends Record<string, any>>(
  form: FormInstance<T>,
  switchFieldName: keyof T
) => {
  const { t } = useTranslation();
  const configEnabled = Form.useWatch(switchFieldName, form);

  const [
    configSwitchPopoverOpenState,
    { setTrue: showConfigSwitchPopover, setFalse: hiddenConfigSwitchPopover }
  ] = useBoolean(false);

  const generateConfigSwitchPopoverTitle = useCallback(
    (
      modifyFlag: boolean,
      customTitle?: string | ((flag: boolean) => string)
    ) => {
      if (typeof customTitle === 'function') {
        return customTitle(modifyFlag);
      }
      if (!!customTitle) {
        return customTitle;
      }

      return modifyFlag
        ? t('dmsSystem.confirmResetConfigTips')
        : t('dmsSystem.confirmCloseConfigTips');
    },
    [t]
  );

  const onConfigSwitchPopoverOpen = useCallback(
    (open: boolean) => {
      if (!configEnabled) {
        return;
      }
      // 每次点击都需要重新设置为true 不然多次点击会导致Switch值异常
      form.setFieldValue(switchFieldName as string, true);
      if (open) {
        showConfigSwitchPopover();
      } else {
        hiddenConfigSwitchPopover();
      }
    },
    [
      configEnabled,
      form,
      hiddenConfigSwitchPopover,
      showConfigSwitchPopover,
      switchFieldName
    ]
  );

  const handleConfigSwitchChange = useCallback(
    (open: boolean, startModify: () => void) => {
      if (open) {
        startModify();
      }
    },
    []
  );

  return {
    configSwitchPopoverOpenState,
    generateConfigSwitchPopoverTitle,
    onConfigSwitchPopoverOpen,
    handleConfigSwitchChange,
    hiddenConfigSwitchPopover
  };
};

export default useConfigSwitchControls;
