import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader, BasicButton, ConfigItem } from '@actiontech/shared';
import useUserInfo from '@actiontech/shared/lib/global/useUserInfo';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import {
  AccountContentStyleWrapper,
  AccountContentTitleStyleWrapper
} from './style';
import { IGetUser } from '@actiontech/shared/lib/api/base/service/common';
import UpdatePassword from './components/UpdatePassword';
import { useBoolean } from 'ahooks';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { Spin, message } from 'antd5';
import { emailValidate } from '@actiontech/shared/lib/utils/Common';
import { CurrentUpdateDataTypeLabel, BaseUpdateDataType } from './types';
import {
  EditInput,
  LabelContent
} from '@actiontech/shared/lib/components/ConfigItem';
import { ConfigFieldMapMeta } from '@actiontech/shared/lib/components/ConfigItem/index.type';
import useHideConfigInputNode from '@actiontech/shared/lib/components/ConfigItem/hooks/useHideConfigInputNode';

const Account: React.FC = () => {
  const { t } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();

  const [
    updatePasswordDrawerVisible,
    { setTrue: showUpdatePasswordDrawer, setFalse: hideUpdatePasswordDrawer }
  ] = useBoolean();

  const { userInfo, getUserInfo, updateUserInfo, getUserInfoLoading } =
    useUserInfo();

  const userBaseInfo: IGetUser | undefined = useMemo(() => {
    return userInfo?.data?.data;
  }, [userInfo]);

  const [
    emailFieldVisible,
    { setTrue: showEmailField, setFalse: hideEmailField }
  ] = useBoolean(false);
  const [
    wxidFieldVisible,
    { setTrue: showWxidField, setFalse: hideWxidField }
  ] = useBoolean(false);
  const [
    phoneFieldVisible,
    { setTrue: showPhoneField, setFalse: hidePhoneField }
  ] = useBoolean(false);

  const hideFieldsAction = () => {
    if (emailFieldVisible) hideEmailField();
    if (wxidFieldVisible) hideWxidField();
    if (phoneFieldVisible) hidePhoneField();
  };
  const hasOneFieldVisible = useMemo(
    () => emailFieldVisible || wxidFieldVisible || phoneFieldVisible,
    [emailFieldVisible, wxidFieldVisible, phoneFieldVisible]
  );

  useHideConfigInputNode(hasOneFieldVisible, hideFieldsAction);

  const fieldMetaMap = new Map<keyof BaseUpdateDataType, ConfigFieldMapMeta>([
    [
      'email',
      {
        hideField: hideEmailField
      }
    ],
    [
      'wxid',
      {
        hideField: hideWxidField
      }
    ],
    [
      'phone',
      {
        hideField: hidePhoneField
      }
    ]
  ]);

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  const onSubmit = (type: keyof BaseUpdateDataType, value: string) => {
    dms
      .UpdateCurrentUser({
        current_user: {
          [type]: value
        }
      })
      .then(async (res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('dmsAccount.updateSuccess', {
              type: CurrentUpdateDataTypeLabel[type]
            })
          );
          updateUserInfo();
          fieldMetaMap.get(type)?.hideField?.();
        }
      });
  };

  const emailValidator = (value: string): boolean => {
    if (!value) return false;

    if (!emailValidate(value)) {
      messageApi.error(t('dmsAccount.emailErrorMessage.type'));
      return false;
    }
    if (value === userBaseInfo?.email) {
      messageApi.error(t('dmsAccount.emailErrorMessage.match'));
      return false;
    }
    return true;
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
    <div>
      {contextHolder}
      <PageHeader title={t('dmsAccount.pageTitle')}></PageHeader>
      <AccountContentStyleWrapper>
        <AccountContentTitleStyleWrapper>
          {t('dmsAccount.accountTitle')}
          <BasicButton type="primary" onClick={showUpdatePasswordDrawer}>
            {t('dmsAccount.modifyPassword.button')}
          </BasicButton>
        </AccountContentTitleStyleWrapper>
        <Spin spinning={getUserInfoLoading}>
          <ConfigItem
            label={
              <LabelContent>
                {t('dmsUserCenter.user.userForm.username')}
              </LabelContent>
            }
            descNode={!!userBaseInfo?.name ? userBaseInfo?.name : '-'}
            fieldVisible={false}
            needEditButton={false}
          />
          <ConfigItem
            label={
              <LabelContent>
                {t('dmsUserCenter.user.userForm.email')}
              </LabelContent>
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
                onSubmit={(v) => {
                  onSubmit('email', v);
                }}
              />
            }
          />
          <ConfigItem
            label={<LabelContent>{t('dmsAccount.wechat')}</LabelContent>}
            descNode={!!userBaseInfo?.wxid ? userBaseInfo?.wxid : '-'}
            fieldVisible={wxidFieldVisible}
            showField={showWxidField}
            hideField={hideWxidField}
            inputNode={
              <EditInput
                fieldValue={userBaseInfo?.wxid ?? ''}
                hideField={hideWxidField}
                onSubmit={(v) => {
                  onSubmit('wxid', v);
                }}
              />
            }
          />
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
                onSubmit={(v) => {
                  onSubmit('phone', v);
                }}
              />
            }
          />
          <UpdatePassword
            open={updatePasswordDrawerVisible}
            onClose={hideUpdatePasswordDrawer}
          />
        </Spin>
      </AccountContentStyleWrapper>
    </div>
  );
};

export default Account;
