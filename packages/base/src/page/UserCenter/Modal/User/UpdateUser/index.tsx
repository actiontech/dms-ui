import { useEffect, useCallback } from 'react';
import { Form, message, Space } from 'antd5';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { IReduxState } from '../../../../../store';
import { useBoolean } from 'ahooks';
import EmitterKey from '../../../../../data/EmitterKey';
import UserForm from '../UserForm';
import { IUserFormFields } from '../UserForm/index.type';
import { ModalName } from '../../../../../data/ModalName';
import { updateUserManageModalStatus } from '../../../../../store/userCenter';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import EventEmitter from '../../../../../utils/EventEmitter';
import {
  IListUser,
  IUpdateUser
} from '@actiontech/shared/lib/api/base/service/common';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { ListUserStatEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { BasicDrawer, BasicButton } from '@actiontech/shared';

const UpdateUser = () => {
  const [form] = Form.useForm<IUserFormFields>();

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [updateLoading, { setTrue, setFalse }] = useBoolean();

  const visible = useSelector<IReduxState, boolean>(
    (state) => !!state.userCenter.modalStatus[ModalName.DMS_Update_User]
  );

  const currentUser = useSelector<IReduxState, IListUser | null>(
    (state) => state.userCenter.selectUser
  );

  const [messageApi, contextHolder] = message.useMessage();

  const close = useCallback(() => {
    form.resetFields();
    dispatch(
      updateUserManageModalStatus({
        modalName: ModalName.DMS_Update_User,
        status: false
      })
    );
  }, [dispatch, form]);

  const updateUser = async () => {
    const values = await form.validateFields();

    const userParams: IUpdateUser = {
      password: values.passwordConfirm,
      email: values.email ?? '',
      phone: values.phone ?? '',
      wxid: values.wxid ?? '',
      op_permission_uids: values.opPermissionUids ?? [],
      user_group_uids: values.userGroupUids ?? [],
      is_disabled: values.username !== 'admin' ? !!values.isDisabled : false
    };
    setTrue();

    dms
      .UpdateUser({
        user_uid: currentUser?.uid ?? '',
        user: userParams
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          close();
          messageApi.open({
            type: 'success',
            content: t('dmsUserCenter.user.updateUser.updateSuccessTips', {
              name: values.username
            })
          });
          EventEmitter.emit(EmitterKey.DMS_Refresh_User_List);
        }
      })
      .finally(() => {
        setFalse();
      });
  };

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        username: currentUser?.name,
        email: currentUser?.email,
        phone: currentUser?.phone,
        wxid: currentUser?.wxid,
        userGroupUids: currentUser?.user_groups?.map((v) => v.uid ?? ''),
        opPermissionUids: currentUser?.op_permissions?.map((v) => v.uid ?? ''),
        isDisabled:
          (currentUser?.stat ?? ListUserStatEnum.未知) ===
          ListUserStatEnum.被禁用
      });
    }
  }, [visible, currentUser, form]);

  return (
    <BasicDrawer
      title={t('dmsUserCenter.user.updateUser.title')}
      open={visible}
      placement="right"
      onClose={close}
      footer={
        <Space>
          <BasicButton onClick={close} disabled={updateLoading}>
            {t('common.close')}
          </BasicButton>
          <BasicButton
            type="primary"
            onClick={updateUser}
            loading={updateLoading}
          >
            {t('common.submit')}
          </BasicButton>
        </Space>
      }
    >
      {contextHolder}
      <UserForm
        form={form}
        visible={visible}
        isUpdate={true}
        isAdmin={currentUser?.name === 'admin'}
      />
    </BasicDrawer>
  );
};

export default UpdateUser;
