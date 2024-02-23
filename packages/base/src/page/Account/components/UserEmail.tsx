import { ConfigItem } from '@actiontech/shared';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import {
  EditInput,
  LabelContent
} from '@actiontech/shared/lib/components/ConfigItem';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useBoolean } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { UpdateComponentCommonProps } from '../index.type';
import { emailValidate } from '@actiontech/shared/lib/utils/Common';

const UserEmail: React.FC<UpdateComponentCommonProps> = ({
  messageApi,
  updateUserInfo,
  userBaseInfo
}) => {
  const { t } = useTranslation();
  const [
    emailFieldVisible,
    { setTrue: showEmailField, setFalse: hideEmailField }
  ] = useBoolean(false);

  const onSubmit = (value: string) => {
    dms
      .UpdateCurrentUser({
        current_user: {
          email: value
        }
      })
      .then(async (res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('dmsAccount.updateEmailSuccess'));
          updateUserInfo();
          hideEmailField();
        }
      });
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

  return (
    <ConfigItem
      label={
        <LabelContent>{t('dmsUserCenter.user.userForm.email')}</LabelContent>
      }
      descNode={!!userBaseInfo?.email ? userBaseInfo?.email : '-'}
      fieldVisible={emailFieldVisible}
      showField={showEmailField}
      hideField={hideEmailField}
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
