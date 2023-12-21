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

const UserWechat: React.FC<UpdateComponentCommonProps> = ({
  messageApi,
  updateUserInfo,
  userBaseInfo
}) => {
  const { t } = useTranslation();
  const [
    wxidFieldVisible,
    { setTrue: showWechatField, setFalse: hideWechatField }
  ] = useBoolean(false);

  const onSubmit = (value: string) => {
    dms
      .UpdateCurrentUser({
        current_user: {
          wxid: value
        }
      })
      .then(async (res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('dmsAccount.updateWechatSuccess'));
          updateUserInfo();
          hideWechatField();
        }
      });
  };

  return (
    <ConfigItem
      label={<LabelContent>{t('dmsAccount.wechat')}</LabelContent>}
      descNode={!!userBaseInfo?.wxid ? userBaseInfo?.wxid : '-'}
      fieldVisible={wxidFieldVisible}
      showField={showWechatField}
      hideField={hideWechatField}
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
