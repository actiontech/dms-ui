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

const UserPhone: React.FC<UpdateComponentCommonProps> = ({
  messageApi,
  updateUserInfo,
  userBaseInfo,
  privacyAuthorization
}) => {
  const { t } = useTranslation();
  const [
    phoneFieldVisible,
    { setTrue: showPhoneField, setFalse: hidePhoneField }
  ] = useBoolean(false);

  const isAuthorized = privacyAuthorization?.isAuthorized ?? false;

  const onSubmit = (value: string) => {
    if (!isAuthorized) {
      messageApi.warning(t('dmsAccount.privacy.unauthorizedTip'));
      return;
    }

    User.UpdateCurrentUser({
      current_user: {
        phone: value
      }
    }).then(async (res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        messageApi.success(t('dmsAccount.updatePhoneSuccess'));
        updateUserInfo();
        hidePhoneField();
      }
    });
  };

  const handleShowPhoneField = () => {
    if (!isAuthorized) {
      messageApi.warning(t('dmsAccount.privacy.unauthorizedTip'));
      return;
    }
    showPhoneField();
  };

  const phoneValidator = (value: string): boolean => {
    const reg = /^1\d{10}$/;
    if (value && !reg.test(value)) {
      messageApi.error(t('dmsAccount.phoneErrorMessage.type'));
      return false;
    } else if (value && value === userBaseInfo?.phone) {
      messageApi.error(t('dmsAccount.phoneErrorMessage.match'));
      return false;
    }
    return true;
  };

  const descNode = useMemo(() => {
    if (isAuthorized) {
      return !!userBaseInfo?.phone ? userBaseInfo?.phone : '-';
    }
    return t('dmsAccount.privacy.unauthorizedTip');
  }, [isAuthorized, userBaseInfo?.phone, t]);

  return (
    <ConfigItem
      label={<LabelContent>{t('dmsAccount.phone')}</LabelContent>}
      descNode={descNode}
      fieldVisible={phoneFieldVisible}
      showField={handleShowPhoneField}
      hideField={hidePhoneField}
      needEditButton={isAuthorized}
      inputNode={
        <EditInput
          fieldValue={userBaseInfo?.phone ?? ''}
          hideField={hidePhoneField}
          validator={phoneValidator}
          onSubmit={onSubmit}
        />
      }
    />
  );
};

export default UserPhone;
