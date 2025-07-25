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
import { ResponseCode } from '@actiontech/shared/lib/enum';
import Role from '@actiontech/shared/lib/api/base/service/Role';
import { BasicDrawer, BasicButton } from '@actiontech/shared';
import { IListRole } from '@actiontech/shared/lib/api/base/service/common';

const CloneRole = () => {
  const [form] = Form.useForm<IRoleFormFields>();

  const [messageApi, contextHolder] = message.useMessage();

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [createLoading, { setTrue, setFalse }] = useBoolean();

  const visible = useSelector<IReduxState, boolean>(
    (state) => !!state.userCenter.modalStatus[ModalName.DMS_Clone_Role]
  );

  const currentRole = useSelector<IReduxState, IListRole | null>(
    (state) => state.userCenter.selectRole
  );

  const onClose = useCallback(() => {
    form.resetFields();
    dispatch(
      updateUserManageModalStatus({
        modalName: ModalName.DMS_Clone_Role,
        status: false
      })
    );
  }, [dispatch, form]);

  const cloneRole = useCallback(async () => {
    const values = await form.validateFields();
    setTrue();
    Role.AddRole({
      role: {
        name: values.name,
        desc: values.desc ?? '',
        op_permission_uids: values?.opPermissions ?? []
      }
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          onClose();
          messageApi.success(
            t('dmsUserCenter.role.cloneRole.createSuccessTips', {
              name: values.name
            })
          );
          EventEmitter.emit(EmitterKey.DMS_Refresh_User_Center_List);
        }
      })
      .finally(() => {
        setFalse();
      });
  }, [onClose, form, setFalse, setTrue, t, messageApi]);

  useEffect(() => {
    if (visible && currentRole) {
      form.setFieldsValue({
        name: currentRole.name,
        desc: currentRole.desc ?? '',
        opPermissions: currentRole.op_permissions?.map((e) => e.uid ?? '')
      });
    }
  }, [visible, currentRole, form]);

  return (
    <BasicDrawer
      title={t('dmsUserCenter.role.cloneRole.modalTitle')}
      open={visible}
      onClose={onClose}
      footer={
        <Space>
          <BasicButton onClick={onClose} disabled={createLoading}>
            {t('common.close')}
          </BasicButton>
          <BasicButton
            type="primary"
            onClick={cloneRole}
            loading={createLoading}
          >
            {t('common.submit')}
          </BasicButton>
        </Space>
      }
    >
      {contextHolder}
      <RoleForm
        form={form}
        visible={visible}
        isClone
        cloneName={currentRole?.name}
      />
    </BasicDrawer>
  );
};

export default CloneRole;
