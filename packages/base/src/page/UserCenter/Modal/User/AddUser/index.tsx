import { useCallback } from 'react';
import { useBoolean } from 'ahooks';
import { Form, message, Space } from 'antd5';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../../../../data/ModalName';
import { IReduxState } from '../../../../../store';
import { updateUserManageModalStatus } from '../../../../../store/userCenter';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import EmitterKey from '../../../../../data/EmitterKey';
import UserForm from '../UserForm';
import { IUserFormFields } from '../UserForm/index.type';
import EventEmitter from '../../../../../utils/EventEmitter';
import { BasicDrawer, BasicButton } from '@actiontech/shared';
import dms from '@actiontech/shared/lib/api/base/service/dms';

const AddUser = () => {
  const [form] = Form.useForm<IUserFormFields>();

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [createLoading, { setTrue, setFalse }] = useBoolean();

  const visible = useSelector<IReduxState, boolean>(
    (state) => !!state.userCenter.modalStatus[ModalName.DMS_Add_User]
  );

  const [messageApi, contextHolder] = message.useMessage();

  const close = useCallback(() => {
    form.resetFields();
    dispatch(
      updateUserManageModalStatus({
        modalName: ModalName.DMS_Add_User,
        status: false
      })
    );
  }, [dispatch, form]);

  const addUser = useCallback(async () => {
    const values = await form.validateFields();
    setTrue();
    dms
      .AddUser({
        user: {
          name: values.username,
          password: values.passwordConfirm,
          email: values.email ?? '',
          phone: values.phone ?? '',
          wxid: values.wxid ?? '',
          op_permission_uids: values.opPermissionUids ?? [],
          user_group_uids: values.userGroupUids ?? []
        }
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          close();
          messageApi.open({
            type: 'success',
            content: t('dmsUserCenter.user.createUser.createSuccessTips', {
              name: values.username
            })
          });
          EventEmitter.emit(EmitterKey.DMS_Refresh_User_List);
        }
      })
      .finally(() => {
        setFalse();
      });
  }, [close, form, setFalse, setTrue, t, messageApi]);

  return (
    <BasicDrawer
      title={t('dmsUserCenter.user.userList.addUserButton')}
      placement="right"
      open={visible}
      onClose={close}
      footer={
        <Space>
          <BasicButton onClick={close} disabled={createLoading}>
            {t('common.close')}
          </BasicButton>
          <BasicButton type="primary" onClick={addUser} loading={createLoading}>
            {t('common.submit')}
          </BasicButton>
        </Space>
      }
    >
      {contextHolder}
      <UserForm form={form} visible={visible} />
    </BasicDrawer>
  );
};

export default AddUser;
