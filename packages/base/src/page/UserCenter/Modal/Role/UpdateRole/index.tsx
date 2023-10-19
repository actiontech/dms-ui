import React from 'react';
import { message, Space, Form } from 'antd5';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../../../../data/ModalName';
import { IReduxState } from '../../../../../store';
import RoleForm from '../RoleForm';
import { IRoleFormFields } from '../RoleForm/index.type';
import { useBoolean } from 'ahooks';
import EmitterKey from '../../../../../data/EmitterKey';
import EventEmitter from '../../../../../utils/EventEmitter';
import useOpPermission from '../../../../../hooks/useOpPermission';
import { updateUserManageModalStatus } from '../../../../../store/userCenter';
import { ListOpPermissionsFilterByTargetEnum } from '@actiontech/shared/lib/api/base/service/dms/index.enum';
import { IListRole } from '@actiontech/shared/lib/api/base/service/common';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { ListRoleStatEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { BasicDrawer, BasicButton } from '@actiontech/shared';

const UpdateRole = () => {
  const [form] = Form.useForm<IRoleFormFields>();

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [messageApi, contextHolder] = message.useMessage();

  const { opPermissionList, updateOpPermissionList } = useOpPermission(
    ListOpPermissionsFilterByTargetEnum.member
  );

  const [updateLoading, { setTrue, setFalse }] = useBoolean();

  const visible = useSelector<IReduxState, boolean>(
    (state) => !!state.userCenter.modalStatus[ModalName.DMS_Update_Role]
  );

  const currentRole = useSelector<IReduxState, IListRole | null>(
    (state) => state.userCenter.selectRole
  );

  const close = React.useCallback(() => {
    form.resetFields();
    dispatch(
      updateUserManageModalStatus({
        modalName: ModalName.DMS_Update_Role,
        status: false
      })
    );
  }, [dispatch, form]);

  const updateRole = React.useCallback(async () => {
    const values = await form.validateFields();
    setTrue();
    dms
      .UpdateRole({
        role_uid: currentRole?.uid ?? '',
        role: {
          desc: values.desc ?? '',
          op_permission_uids: values.opPermissions ?? [],
          is_disabled: values.isDisabled
        }
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          close();
          messageApi.open({
            type: 'success',
            content: t('dmsUserCenter.role.updateRole.updateSuccessTips', {
              name: values.name
            })
          });
          EventEmitter.emit(EmitterKey.DMS_Refresh_Role_List);
        }
      })
      .finally(() => {
        setFalse();
      });
  }, [close, currentRole?.uid, form, setFalse, setTrue, t, messageApi]);

  React.useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        name: currentRole?.name ?? '',
        desc: currentRole?.desc ?? '',
        opPermissions: currentRole?.op_permissions?.map((e) => e.uid ?? ''),
        isDisabled: currentRole?.stat === ListRoleStatEnum.被禁用
      });
    }
  }, [visible, currentRole, form]);

  React.useEffect(() => {
    if (visible) {
      updateOpPermissionList();
    }
  }, [updateOpPermissionList, visible]);

  return (
    <BasicDrawer
      title={t('dmsUserCenter.role.updateRole.modalTitle')}
      open={visible}
      onClose={close}
      footer={
        <Space>
          <BasicButton onClick={close} disabled={updateLoading}>
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
      <RoleForm isUpdate={true} form={form} operationList={opPermissionList} />
    </BasicDrawer>
  );
};

export default UpdateRole;
