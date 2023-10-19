import { AxiosResponse } from 'axios';
import { useBoolean } from 'ahooks';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { IGenericResp } from '@actiontech/shared/lib/api/base/service/common';

interface IUseConfigSwitchProps {
  isInitialForm: boolean;
  modifyFlag: boolean;
  startModify: () => void;
  handleUpdateConfig: () => Promise<AxiosResponse<IGenericResp, any>>;
  handleClickCancel: () => void;
  refreshConfig: () => void;
  handleOpenSwitch: () => void;
}

const useConfigSwitch = (props: IUseConfigSwitchProps) => {
  const {
    isInitialForm,
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
    if (isInitialForm && open) {
      startModify();
    }

    if (!open) {
      !modifyFlag ? showConfigSwitchPopover() : handleClickCancel();
    }
  };

  return {
    configSwitchPopoverVisible,
    onConfigSwitchPopoverConfirm,
    onConfigSwitchPopoverCancel,
    onConfigSwitchChange
  };
};

export default useConfigSwitch;
