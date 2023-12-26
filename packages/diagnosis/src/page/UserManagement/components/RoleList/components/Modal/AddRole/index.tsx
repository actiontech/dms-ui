import { useBoolean } from 'ahooks';
import { BasicButton, BasicDrawer } from '@actiontech/shared';
import { Form, Space, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { ModalName } from '../../../../../../../data/ModalName';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import EventEmitter from '../../../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../../../data/EmitterKey';
import useUserManagementRedux from '../../../../../hooks/useUserManagementRedux';
import RoleForm from '../RoleForm';
import { IRoleFormFieldProps } from '../RoleForm/index.type';
import auth from '../../../../../../../api/auth';
import { IV1CreateRoleParams } from '../../../../../../../api/auth/index.d';

const AddRole = () => {
  const { t } = useTranslation();

  const modalName = ModalName.Add_Role;

  const { visible, setModalStatus } = useUserManagementRedux(modalName);

  const [form] = Form.useForm<IRoleFormFieldProps>();

  const [messageApi, contextHolder] = message.useMessage();

  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();

  const submit = async () => {
    const values = await form.validateFields();
    const params: IV1CreateRoleParams = {
      ...values
    };
    startSubmit();
    auth
      .V1CreateRole(params)
      .then((res) => {
        console.log(res.data.code === ResponseCode.SUCCESS);
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('userManagement.role.createRole.createSuccessTips', {
              name: values.role_name
            })
          );
          closeModal();
          EventEmitter.emit(EmitterKey.Refresh_User_Management);
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
        title={t('userManagement.role.createRole.modalTitle')}
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
        <RoleForm form={form} visible={visible} />
      </BasicDrawer>
    </>
  );
};

export default AddRole;
