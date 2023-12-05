import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useBoolean, useRequest } from 'ahooks';
import { Form, message, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import InputPassword from '~/components/PasswordWithGenerate';
import { EventEmitterKey, ModalName } from '~/data/enum';
import useModalStatus from '~/hooks/useModalStatus';
import UserSelect from '~/page/Auth/AddAuth/UserSelect';
import { AuthListModalStatus, AuthListSelectData } from '~/store/auth/list';
import EventEmitter from '~/utils/EventEmitter';
import Password from '~/utils/Password';
import {
  BasicDrawer,
  BasicInput,
  BasicButton,
  BasicSwitch,
  BasicToolTips
} from '@actiontech/shared';
import { IUpdateUserInAuthFormFields } from '../List/index.type';
import { ResponseCode } from '@actiontech/shared/lib/enum';

const UpdateUserInAuth = () => {
  const { t } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();

  const { toggleModal, visible } = useModalStatus(
    AuthListModalStatus,
    ModalName.UpdateUserInAuth
  );
  const { projectID } = useCurrentProject();

  const [selectData, updateSelectData] = useRecoilState(AuthListSelectData);

  const [form] = Form.useForm<IUpdateUserInAuthFormFields>();

  const isModifyPassword = Form.useWatch('isModifyPassword', form);

  const [updateLoading, { setTrue: startUpdate, setFalse: updateFinish }] =
    useBoolean();

  const closeModal = () => {
    toggleModal(ModalName.UpdateUserInAuth, false);
    updateSelectData(null);
  };

  const closeAndReset = () => {
    closeModal();
    const timeId = setTimeout(() => {
      form.resetFields();
      clearTimeout(timeId);
    }, 300);
  };

  const submit = async () => {
    const values = await form.validateFields();
    startUpdate();
    try {
      const res = await auth.AuthUpdateAuthorization({
        authorization_uid: selectData?.uid ?? '',
        authorization: {
          update_authorization_user: {
            permission_user_uid: values.permission_user_uid,
            db_account_password: values.db_account_password
          }
        }
      });
      if (res.data.code === ResponseCode.SUCCESS) {
        messageApi.success(t('auth.updateTemplateSuccess'));
        closeAndReset();
        EventEmitter.emit(EventEmitterKey.Refresh_Auth_List_Table);
      }
    } finally {
      updateFinish();
    }
  };

  useRequest(
    () =>
      auth
        .AuthListUser({
          page_index: 1,
          page_size: 999,
          namespace_uid: projectID
        })
        .then((res) => {
          const cur = res.data.data?.find((item) => {
            return item.name === selectData?.permission_user;
          });
          if (cur) {
            form.setFieldValue('permission_user_uid', cur.user_uid);
          }
        }),
    {
      ready: !!selectData
    }
  );

  const generatePassword = () => {
    const password = Password.generateMySQLPassword(16);
    form.setFieldsValue({
      db_account_password: password,
      confirm_db_account_password: password
    });
    return password;
  };

  return (
    <BasicDrawer
      title={t('auth.updateUserTitle')}
      open={visible}
      footer={
        <Space>
          <BasicButton disabled={updateLoading} onClick={closeAndReset}>
            {t('common.close')}
          </BasicButton>
          <BasicButton type="primary" loading={updateLoading} onClick={submit}>
            {t('common.submit')}
          </BasicButton>
        </Space>
      }
      onClose={closeAndReset}
    >
      {contextHolder}
      <Form layout="vertical" form={form}>
        <UserSelect />
        <Form.Item
          name="isModifyPassword"
          valuePropName="checked"
          label={
            <BasicToolTips
              suffixIcon
              title={t('auth.updateUser.modifyPasswordTip')}
            >
              {t('auth.updateUser.modifyPassword')}
            </BasicToolTips>
          }
        >
          <BasicSwitch />
        </Form.Item>
        {isModifyPassword && (
          <>
            <Form.Item
              name="db_account_password"
              label={t('auth.updateUser.password')}
              rules={[{ required: true }]}
            >
              <InputPassword clickGeneratePassword={generatePassword} />
            </Form.Item>
            <Form.Item
              name="confirm_db_account_password"
              label={t('auth.updateUser.confirmPassword')}
              rules={[{ required: true }]}
            >
              <BasicInput.Password />
            </Form.Item>
          </>
        )}
      </Form>
    </BasicDrawer>
  );
};

export default UpdateUserInAuth;
