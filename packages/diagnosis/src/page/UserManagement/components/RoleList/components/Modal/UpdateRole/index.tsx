import { useBoolean } from 'ahooks';
import { BasicButton, BasicDrawer } from '@actiontech/shared';
import { Form, Space, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { ModalName } from '../../../../../../../data/ModalName';
import { useEffect } from 'react';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import EventEmitter from '../../../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../../../data/EmitterKey';
import useUserManagementRedux from '../../../../../hooks/useUserManagementRedux';
import RoleForm from '../RoleForm';
import auth from '../../../../../../../api/auth';
import { IV1UpdateRoleParams } from '../../../../../../../api/auth/index.d';
import { IRoleFormFieldProps } from '../RoleForm/index.type';

const UpdateRole = () => {
  const { t } = useTranslation();

  const [form] = Form.useForm<IRoleFormFieldProps>();

  const [messageApi, contextHolder] = message.useMessage();

  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();

  const modalName = ModalName.Update_Role;

  const { visible, selectRoleData, setModalStatus } =
    useUserManagementRedux(modalName);

  useEffect(() => {
    if (visible && selectRoleData) {
      const scopeNames = (selectRoleData?.scopes ?? []).map(
        (item) => item?.scope_name ?? ''
      );
      form.setFieldsValue({
        role_name: selectRoleData?.role_name,
        role_desc: selectRoleData?.role_desc,
        scopes: scopeNames
      });
    }
  }, [visible, selectRoleData, form]);

  const submit = async () => {
    const values = await form.validateFields();
    const params: IV1UpdateRoleParams = {
      role_desc: values.role_desc,
      role_id: selectRoleData?.id,
      scopes: values.scopes
    };
    startSubmit();
    auth
      .V1UpdateRole(params)
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('userManagement.role.updateRole.updateSuccessTips', {
              name: values.role_name
            })
          );
          closeModal();
          EventEmitter.emit(EmitterKey.Refresh_Role_List);
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
        title={t('userManagement.role.updateRole.modalTitle')}
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
        <RoleForm form={form} isUpdate={true} visible={visible} />
      </BasicDrawer>
    </>
  );
};

export default UpdateRole;
