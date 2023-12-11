import { useEffect } from 'react';
import { useBoolean } from 'ahooks';
import UserForm from '../UserForm';
import { BasicButton, BasicDrawer } from '@actiontech/shared';
import { Form, Space, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { ModalName } from '../../../../../../../data/ModalName';
import { IV1CreateUserParams } from '../../../../../../../api/auth/index.d';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import EventEmitter from '../../../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../../../data/EmitterKey';
import useUserManagementRedux from '../../../../../hooks/useUserManagementRedux';
import { IUserFormField } from '../UserForm/index.type';
import auth from '../../../../../../../api/auth';

const UpdateUser = () => {
  const { t } = useTranslation();

  const modalName = ModalName.Update_User;

  const { visible, setModalStatus, selectUserData } =
    useUserManagementRedux(modalName);

  const [form] = Form.useForm<IUserFormField>();

  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (visible && selectUserData) {
      form.setFieldsValue({
        username: selectUserData.username,
        role_id: selectUserData.role_id,
        isNeedUpdatePassword: false
      });
    }
  }, [visible, selectUserData, form]);

  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();

  const submit = async () => {
    const values = await form.validateFields();
    const params: IV1CreateUserParams = {
      username: values.username,
      password: values.password,
      role_id: values.role_id
    };
    startSubmit();
    auth
      .V1CreateUser(params)
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('userManagement.user.createUser.createSuccessTips', {
              name: values.username
            })
          );
          closeModal();
          EventEmitter.emit(EmitterKey.Refresh_User_List);
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  const closeModal = () => {
    form.resetFields();
    setModalStatus(modalName, false);
  };

  return (
    <>
      <BasicDrawer
        open={visible}
        placement="right"
        title={t('userManagement.user.updateUser.title')}
        onClose={closeModal}
        footer={
          <Space>
            <BasicButton onClick={closeModal} disabled={submitLoading}>
              {t('common.close')}
            </BasicButton>
            <BasicButton
              type="primary"
              onClick={submit}
              loading={submitLoading}
            >
              {t('common.submit')}
            </BasicButton>
          </Space>
        }
      >
        {contextHolder}
        <UserForm form={form} visible={visible} isUpdate={true} />
      </BasicDrawer>
    </>
  );
};

export default UpdateUser;
