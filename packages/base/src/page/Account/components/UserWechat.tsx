import { ConfigItem } from '@actiontech/shared';
import User from '@actiontech/shared/lib/api/base/service/User';
import {
  EditInput,
  LabelContent
} from '@actiontech/shared/lib/components/ConfigItem';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useBoolean } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { UpdateComponentCommonProps } from '../index.type';
import { useMemo } from 'react';

const UserWechat: React.FC<UpdateComponentCommonProps> = ({
  messageApi,
  updateUserInfo,
  userBaseInfo,
  privacyAuthorization
}) => {
  const { t } = useTranslation();
  const [
    wxidFieldVisible,
    { setTrue: showWechatField, setFalse: hideWechatField }
  ] = useBoolean(false);

  const isAuthorized = privacyAuthorization?.isAuthorized ?? false;

  const onSubmit = (value: string) => {
    if (!isAuthorized) {
      messageApi.warning(t('dmsAccount.privacy.unauthorizedTip'));
      return;
    }

    User.UpdateCurrentUser({
      current_user: {
        wxid: value
      }
    }).then(async (res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        messageApi.success(t('dmsAccount.updateWechatSuccess'));
        updateUserInfo();
        hideWechatField();
      }
    });
  };

  const handleShowWechatField = () => {
    if (!isAuthorized) {
      messageApi.warning(t('dmsAccount.privacy.unauthorizedTip'));
      return;
    }
    showWechatField();
  };

  const descNode = useMemo(() => {
    if (isAuthorized) {
      return !!userBaseInfo?.wxid ? userBaseInfo?.wxid : '-';
    }
    return t('dmsAccount.privacy.unauthorizedTip');
  }, [isAuthorized, userBaseInfo?.wxid, t]);

  return (
    <ConfigItem
      label={<LabelContent>{t('dmsAccount.wechat')}</LabelContent>}
      descNode={descNode}
      fieldVisible={wxidFieldVisible}
      showField={handleShowWechatField}
      hideField={hideWechatField}
      needEditButton={isAuthorized}
      inputNode={
        <EditInput
          fieldValue={userBaseInfo?.wxid ?? ''}
          hideField={hideWechatField}
          onSubmit={onSubmit}
        />
      }
    />
  );
};

export default UserWechat;
