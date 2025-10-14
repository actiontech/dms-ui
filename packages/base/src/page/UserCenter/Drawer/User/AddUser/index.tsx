import { useCallback } from 'react';
import { useBoolean } from 'ahooks';
import { Form, message, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../../../../data/ModalName';
import { IReduxState } from '../../../../../store';
import { updateUserManageModalStatus } from '../../../../../store/userCenter';
import { ResponseCode } from '@actiontech/dms-kit';
import EmitterKey from '../../../../../data/EmitterKey';
import UserForm from '../UserForm';
import { IUserFormFields } from '../UserForm/index.type';
import EventEmitter from '../../../../../utils/EventEmitter';
import { BasicDrawer, BasicButton } from '@actiontech/dms-kit';
import User from '@actiontech/shared/lib/api/base/service/User';
import dayjs from 'dayjs';
const AddUser = () => {
  const [form] = Form.useForm<IUserFormFields>();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [createLoading, { setTrue, setFalse }] = useBoolean();
  const visible = useSelector<IReduxState, boolean>(
    (state) => !!state.userCenter.modalStatus[ModalName.DMS_Add_User]
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
    setTrue();
    User.AddUser({
      user: {
        name: values.username,
        password: values.passwordConfirm,
        email: values.email ?? '',
        phone: values.phone ?? '',
        wxid: values.wxid ?? '',
        op_permission_uids: values.opPermissionUid
          ? [values.opPermissionUid]
          : [],
        uid: dayjs().format('YYYYMMDDHHmmssSSS')
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
  }, [onClose, form, setFalse, setTrue, t, messageApi]);
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
      <UserForm form={form} visible={visible} />
    </BasicDrawer>
  );
};
export default AddUser;
