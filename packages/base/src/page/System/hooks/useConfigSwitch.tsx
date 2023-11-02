import { AxiosResponse } from 'axios';
import { useBoolean } from 'ahooks';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { IGenericResp } from '@actiontech/shared/lib/api/base/service/common';
import { switchFieldName } from '../LoginConnection/Oauth/index.data';

interface IUseConfigSwitchProps {
  switchOpen: boolean;
  modifyFlag: boolean;
  startModify: () => void;
  handleUpdateConfig: () => Promise<AxiosResponse<IGenericResp, any>>;
  handleClickCancel: () => void;
  refreshConfig: () => void;
  handleOpenSwitch: () => void;
}

const useConfigSwitch = (props: IUseConfigSwitchProps) => {
  const {
    switchOpen,
    modifyFlag,
    startModify,
    handleUpdateConfig,
    handleClickCancel,
    refreshConfig,
    handleOpenSwitch
  } = props;
  const [
    configSwitchPopoverVisible,
    { setTrue: showConfigSwitchPopover, setFalse: hideConfigSwitchPopover }
  ] = useBoolean(false);

  // const switchOpen = Form.useWatch(switchFieldName, form);

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
    handleOpenSwitch();
    hideConfigSwitchPopover();
  };

  const onConfigSwitchChange = (open: boolean) => {
    if (open) {
      startModify();
    }
  };

  const onConfigSwitchPopoverOpen = () => {
    if (!switchOpen) return;

    !modifyFlag ? showConfigSwitchPopover() : handleClickCancel();
  };

  return {
    configSwitchPopoverVisible,
    onConfigSwitchPopoverOpen,
    onConfigSwitchPopoverConfirm,
    onConfigSwitchPopoverCancel,
    onConfigSwitchChange
  };
};

export default useConfigSwitch;
