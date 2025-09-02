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
import { emailValidate } from '@actiontech/shared/lib/utils/Common';
import { useMemo } from 'react';

const UserEmail: React.FC<UpdateComponentCommonProps> = ({
  messageApi,
  updateUserInfo,
  userBaseInfo,
  privacyAuthorization
}) => {
  const { t } = useTranslation();
  const [
    emailFieldVisible,
    { setTrue: showEmailField, setFalse: hideEmailField }
  ] = useBoolean(false);

  const isAuthorized = privacyAuthorization?.isAuthorized ?? false;

  const onSubmit = (value: string) => {
    if (!isAuthorized) {
      messageApi.warning(t('dmsAccount.privacy.unauthorizedTip'));
      return;
    }

    User.UpdateCurrentUser({
      current_user: {
        email: value
      }
    }).then(async (res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        messageApi.success(t('dmsAccount.updateEmailSuccess'));
        updateUserInfo();
        hideEmailField();
      }
    });
  };

  const handleShowEmailField = () => {
    if (!isAuthorized) {
      messageApi.warning(t('dmsAccount.privacy.unauthorizedTip'));
      return;
    }
    showEmailField();
  };
  const emailValidator = (value: string): boolean => {
    if (value && !emailValidate(value)) {
      messageApi.error(t('dmsAccount.emailErrorMessage.type'));
      return false;
    }
    if (value === userBaseInfo?.email) {
      messageApi.error(t('dmsAccount.emailErrorMessage.match'));
      return false;
    }
    return true;
  };

  const descNode = useMemo(() => {
    if (isAuthorized) {
      return !!userBaseInfo?.email ? userBaseInfo?.email : '-';
    }
    return t('dmsAccount.privacy.unauthorizedTip');
  }, [isAuthorized, userBaseInfo?.email, t]);

  return (
    <ConfigItem
      label={
        <LabelContent>{t('dmsUserCenter.user.userForm.email')}</LabelContent>
      }
      descNode={descNode}
      fieldVisible={emailFieldVisible}
      showField={handleShowEmailField}
      hideField={hideEmailField}
      needEditButton={isAuthorized}
      inputNode={
        <EditInput
          fieldValue={userBaseInfo?.email ?? ''}
          hideField={hideEmailField}
          validator={emailValidator}
          onSubmit={onSubmit}
        />
      }
    />
  );
};

export default UserEmail;
