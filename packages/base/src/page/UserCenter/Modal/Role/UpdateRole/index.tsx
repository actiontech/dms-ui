import { useCallback, useEffect } from 'react';
import { message, Space, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../../../../data/ModalName';
import { IReduxState } from '../../../../../store';
import RoleForm from '../RoleForm';
import { IRoleFormFields } from '../RoleForm/index.type';
import { useBoolean } from 'ahooks';
import EmitterKey from '../../../../../data/EmitterKey';
import EventEmitter from '../../../../../utils/EventEmitter';
import { updateUserManageModalStatus } from '../../../../../store/userCenter';
import { IListRole } from '@actiontech/shared/lib/api/base/service/common';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import Role from '@actiontech/shared/lib/api/base/service/Role';
import { ListRoleStatEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { BasicDrawer, BasicButton } from '@actiontech/shared';

const UpdateRole = () => {
  const [form] = Form.useForm<IRoleFormFields>();

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [messageApi, contextHolder] = message.useMessage();

  const [updateLoading, { setTrue, setFalse }] = useBoolean();

  const visible = useSelector<IReduxState, boolean>(
    (state) => !!state.userCenter.modalStatus[ModalName.DMS_Update_Role]
  );

  const currentRole = useSelector<IReduxState, IListRole | null>(
    (state) => state.userCenter.selectRole
  );

  const onClose = useCallback(() => {
    form.resetFields();
    dispatch(
      updateUserManageModalStatus({
        modalName: ModalName.DMS_Update_Role,
        status: false
      })
    );
  }, [dispatch, form]);

  const updateRole = useCallback(async () => {
    const values = await form.validateFields();
    setTrue();
    Role.UpdateRole({
      role_uid: currentRole?.uid ?? '',
      role: {
        desc: values.desc ?? '',
        op_permission_uids: values.opPermissions ?? [],
        is_disabled: values.isDisabled
      }
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          onClose();
          messageApi.success(
            t('dmsUserCenter.role.updateRole.updateSuccessTips', {
              name: values.name
            })
          );
          EventEmitter.emit(EmitterKey.DMS_Refresh_User_Center_List);
        }
      })
      .finally(() => {
        setFalse();
      });
  }, [onClose, currentRole?.uid, form, setFalse, setTrue, t, messageApi]);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        name: currentRole?.name ?? '',
        desc: currentRole?.desc ?? '',
        opPermissions: currentRole?.op_permissions?.map((e) => e.uid ?? ''),
        isDisabled: currentRole?.stat === ListRoleStatEnum.被禁用
      });
    }
  }, [visible, currentRole, form]);

  return (
    <BasicDrawer
      title={t('dmsUserCenter.role.updateRole.modalTitle')}
      open={visible}
      onClose={onClose}
      footer={
        <Space>
          <BasicButton onClick={onClose} disabled={updateLoading}>
            {t('common.close')}
          </BasicButton>
          <BasicButton
            type="primary"
            onClick={updateRole}
            loading={updateLoading}
          >
            {t('common.submit')}
          </BasicButton>
        </Space>
      }
    >
      {contextHolder}
      <RoleForm isUpdate={true} form={form} visible={visible} />
    </BasicDrawer>
  );
};

export default UpdateRole;
