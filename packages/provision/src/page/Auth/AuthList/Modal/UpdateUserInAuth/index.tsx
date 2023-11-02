import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useBoolean, useRequest } from 'ahooks';
import { Button, Form, Input, message, Modal, Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import InputPassword from '~/components/PasswordWithGenerate';
import { ModalFormLayout, ModalSize, ResponseCode } from '~/data/common';
import { EventEmitterKey, ModalName } from '~/data/enum';
import useModalStatus from '~/hooks/useModalStatus';
import UserSelect from '~/page/Auth/AddAuth/UserSelect';
import { AuthListModalStatus, AuthListSelectData } from '~/store/auth/list';
import EventEmitter from '~/utils/EventEmitter';
import Password from '~/utils/Password';

interface IUpdateUserInAuthFormFields {
  permission_user_uid: string;
  userValue: string;
  db_account_password: string;
  confirm_db_account_password: string;
}

const UpdateUserInAuth = () => {
  const { t } = useTranslation();

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
    form.resetFields();
    closeModal();
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
        message.success(t('auth.updateTemplateSuccess'));
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
    <Modal
      closable={false}
      title={t('auth.updateUserTitle')}
      open={visible}
      width={ModalSize.mid}
      footer={
        <>
          <Button disabled={updateLoading} onClick={closeAndReset}>
            {t('common.close')}
          </Button>
          <Button type="primary" loading={updateLoading} onClick={submit}>
            {t('common.submit')}
          </Button>
        </>
      }
    >
      <Form {...ModalFormLayout} form={form}>
        <UserSelect form={form} />
        <Form.Item
          name="isModifyPassword"
          label={t('auth.updateUser.modifyPassword')}
          valuePropName="checked"
          tooltip={t('auth.updateUser.modifyPasswordTip')}
        >
          <Switch />
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
              <Input.Password />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default UpdateUserInAuth;
