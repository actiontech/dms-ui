import { AxiosResponse } from 'axios';
import { useBoolean } from 'ahooks';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { IGenericResp } from '@actiontech/shared/lib/api/base/service/common';
import { useCallback } from 'react';

interface IUseConfigSwitchProps {
  isConfigClosed: boolean;
  switchOpen: boolean;
  modifyFlag: boolean;
  handleClickModify: () => void;
  startSubmit: () => void;
  submitFinish: () => void;
  handleUpdateConfig: () => Promise<AxiosResponse<IGenericResp, any>>;
  handleClickCancel: () => void;
  refreshConfig: () => void;
  handleToggleSwitch: (open: boolean) => void;
}

/**
 * @deprecated
 * 使用 useSwitchControls 替换
 */
const useConfigSwitch = (props: IUseConfigSwitchProps) => {
  const {
    isConfigClosed,
    switchOpen,
    modifyFlag,
    handleClickModify,
    startSubmit,
    submitFinish,
    handleUpdateConfig,
    handleClickCancel,
    refreshConfig,
    handleToggleSwitch
  } = props;
  const [
    configSwitchPopoverVisible,
    { setTrue: showConfigSwitchPopover, setFalse: hideConfigSwitchPopover }
  ] = useBoolean(false);

  const onConfigSwitchPopoverConfirm = async () => {
    if (isConfigClosed && modifyFlag) {
      handleClickCancel();
      refreshConfig();
      hideConfigSwitchPopover();
    } else {
      startSubmit();
      handleUpdateConfig()
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            handleClickCancel();
            refreshConfig();
          }
        })
        .finally(() => {
          submitFinish();
          hideConfigSwitchPopover();
        });
    }
  };

  const onConfigSwitchPopoverCancel = () => {
    hideConfigSwitchPopover();
    if (modifyFlag) {
      handleToggleSwitch(true);
    }
  };

  const onConfigSwitchChange = (open: boolean) => {
    if (open) {
      handleClickModify();
    }
  };

  const onConfigSwitchPopoverOpen = useCallback(
    (open: boolean) => {
      if (!switchOpen) return;

      handleToggleSwitch(true);

      if (open) {
        showConfigSwitchPopover();
      } else {
        hideConfigSwitchPopover();
      }
    },
    [
      handleToggleSwitch,
      hideConfigSwitchPopover,
      showConfigSwitchPopover,
      switchOpen
    ]
  );

  return {
    configSwitchPopoverVisible,
    onConfigSwitchPopoverOpen,
    onConfigSwitchPopoverConfirm,
    onConfigSwitchPopoverCancel,
    onConfigSwitchChange
  };
};

export default useConfigSwitch;
