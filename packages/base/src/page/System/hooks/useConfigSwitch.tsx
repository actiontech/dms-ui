import { AxiosResponse } from 'axios';
import { useBoolean } from 'ahooks';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { IGenericResp } from '@actiontech/shared/lib/api/base/service/common';
import { useCallback } from 'react';

interface IUseConfigSwitchProps {
  switchOpen: boolean;
  modifyFlag: boolean;
  startModify: () => void;
  handleUpdateConfig: () => Promise<AxiosResponse<IGenericResp, any>>;
  handleClickCancel: () => void;
  refreshConfig: () => void;
  handleToggleSwitch: (open: boolean) => void;
}

const useConfigSwitch = (props: IUseConfigSwitchProps) => {
  const {
    switchOpen,
    modifyFlag,
    startModify,
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
    handleUpdateConfig()
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          handleClickCancel();
          refreshConfig();
        }
      })
      .finally(() => {
        hideConfigSwitchPopover();
      });
  };

  const onConfigSwitchPopoverCancel = () => {
    hideConfigSwitchPopover();
    if (modifyFlag) {
      handleToggleSwitch(true);
    }
  };

  const onConfigSwitchChange = (open: boolean) => {
    if (open) {
      startModify();
    }
  };

  const onConfigSwitchPopoverOpen = useCallback(
    (open: boolean) => {
      if (!switchOpen) return;

      handleToggleSwitch(switchOpen);
      showConfigSwitchPopover();

      open ? showConfigSwitchPopover() : hideConfigSwitchPopover();
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
