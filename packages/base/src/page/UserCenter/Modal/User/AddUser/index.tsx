import { useCallback, useMemo } from 'react';
import { useBoolean } from 'ahooks';
import { Form, message, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../../../../data/ModalName';
import { IReduxState } from '../../../../../store';
import { updateUserManageModalStatus } from '../../../../../store/userCenter';
import { OpPermissionTypeUid, ResponseCode } from '@actiontech/shared/lib/enum';
import EmitterKey from '../../../../../data/EmitterKey';
import UserForm from '../UserForm';
import { IUserFormFields } from '../UserForm/index.type';
import EventEmitter from '../../../../../utils/EventEmitter';
import { BasicDrawer, BasicButton } from '@actiontech/shared';
import User from '@actiontech/shared/lib/api/base/service/User';
import { useCurrentUser } from '@actiontech/shared/lib/global';
import { canEditGlobalManagement } from '../../../utils/systemAdminBoundary';

const AddUser = () => {
  const [form] = Form.useForm<IUserFormFields>();

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [createLoading, { setTrue, setFalse }] = useBoolean();

  const visible = useSelector<IReduxState, boolean>(
    (state) => !!state.userCenter.modalStatus[ModalName.DMS_Add_User]
  );

  const { username, uid } = useCurrentUser();
  const allowEditGlobalManagement = useMemo(
    () => canEditGlobalManagement({ name: username, uid }),
    [username, uid]
  );

  const [messageApi, contextHolder] = message.useMessage();

  const onClose = useCallback(() => {
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
    const opPermissionUids = values.opPermissionUids ?? [];
    if (
      !allowEditGlobalManagement &&
      opPermissionUids.includes(OpPermissionTypeUid.global_management)
    ) {
      messageApi.error(
        t('dmsUserCenter.user.userForm.globalManagementLockedTips')
      );
      return;
    }
    setTrue();
    User.AddUser({
      user: {
        name: values.username,
        password: values.passwordConfirm,
        email: values.email ?? '',
        phone: values.phone ?? '',
        wxid: values.wxid ?? '',
        op_permission_uids: opPermissionUids
      }
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          onClose();
          messageApi.success(
            t('dmsUserCenter.user.createUser.createSuccessTips', {
              name: values.username
            })
          );
          EventEmitter.emit(EmitterKey.DMS_Refresh_User_Center_List);
        }
      })
      .finally(() => {
        setFalse();
      });
  }, [
    allowEditGlobalManagement,
    onClose,
    form,
    setFalse,
    setTrue,
    t,
    messageApi
  ]);

  return (
    <BasicDrawer
      title={t('dmsUserCenter.user.userList.addUserButton')}
      placement="right"
      open={visible}
      onClose={onClose}
      footer={
        <Space>
          <BasicButton onClick={onClose} disabled={createLoading}>
            {t('common.close')}
          </BasicButton>
          <BasicButton type="primary" onClick={addUser} loading={createLoading}>
            {t('common.submit')}
          </BasicButton>
        </Space>
      }
    >
      {contextHolder}
      <UserForm
        form={form}
        visible={visible}
        canEditGlobalManagement={allowEditGlobalManagement}
      />
    </BasicDrawer>
  );
};

export default AddUser;
