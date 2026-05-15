import { ConfigItem } from '@actiontech/dms-kit';
import User from '@actiontech/shared/lib/api/base/service/User';
import { EditInput, LabelContent } from '@actiontech/dms-kit';
import { ResponseCode } from '@actiontech/dms-kit';
import { useBoolean } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { UpdateComponentCommonProps } from '../index.type';
const UserPhone: React.FC<UpdateComponentCommonProps> = ({
  messageApi,
  updateUserInfo,
  userBaseInfo
}) => {
  const { t } = useTranslation();
  const [
    phoneFieldVisible,
    { setTrue: showPhoneField, setFalse: hidePhoneField }
  ] = useBoolean(false);
  const onSubmit = (value: string) => {
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
  return (
    <ConfigItem
      label={<LabelContent>{t('dmsAccount.phone')}</LabelContent>}
      descNode={!!userBaseInfo?.phone ? userBaseInfo?.phone : '-'}
      fieldVisible={phoneFieldVisible}
      showField={showPhoneField}
      hideField={hidePhoneField}
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
