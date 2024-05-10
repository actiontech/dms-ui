import { useBoolean } from 'ahooks';
import { message, Form, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import EventEmitter from '../../../../utils/EventEmitter';
import { BasicButton, BasicDrawer } from '@actiontech/shared';
import PolicyForm from './PolicyForm';
import useModalStatus from '~/hooks/useModalStatus';
import {
  PasswordSecurityPolicyModalStatus,
  PasswordSecurityPolicySelectData
} from '~/store/passwordManagement';
import { EventEmitterKey, ModalName } from '~/data/enum';
import { PolicyFormValues } from '../../index.type';
import passwordSecurityPolicy from '@actiontech/shared/lib/api/provision/service/password_secury_policy/index';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';

const UpdatePolicy: React.FC = () => {
  const { t } = useTranslation();

  const [form] = Form.useForm<PolicyFormValues>();

  const [messageApi, contextHolder] = message.useMessage();

  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();

  const { toggleModal, visible } = useModalStatus(
    PasswordSecurityPolicyModalStatus,
    ModalName.UpdatePasswordSecurityPolicyModal
  );

  const [selectData, updateSelectData] = useRecoilState(
    PasswordSecurityPolicySelectData
  );

  const { projectID } = useCurrentProject();

  const submit = async () => {
    const values = await form.validateFields();
    startSubmit();
    passwordSecurityPolicy
      .AuthUpdatePasswordSecurityPolicy({
        project_uid: projectID,
        uid: selectData?.uid ?? '',
        password_security_policy: {
          name: values.name,
          password_expiration_period: Number(values.passwordExpirationPeriod)
        }
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          onClose();
          EventEmitter.emit(
            EventEmitterKey.Refresh_Password_Management_list_Table
          );
          messageApi.success(t('password.policy.modal.updateSuccess'));
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  const onClose = () => {
    form.resetFields();
    toggleModal(ModalName.UpdatePasswordSecurityPolicyModal, false);
    updateSelectData(null);
  };

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        name: selectData?.name,
        passwordExpirationPeriod: `${selectData?.password_expiration_period}`
      });
    }
  }, [form, visible, selectData]);

  return (
    <BasicDrawer
      open={visible}
      placement="right"
      title={t('password.policy.modal.update')}
      onClose={onClose}
      footer={
        <Space>
          <BasicButton onClick={onClose} disabled={submitLoading}>
            {t('common.close')}
          </BasicButton>
          <BasicButton type="primary" onClick={submit} loading={submitLoading}>
            {t('common.submit')}
          </BasicButton>
        </Space>
      }
    >
      {contextHolder}
      <PolicyForm form={form} disabled={selectData?.is_default} />
    </BasicDrawer>
  );
};

export default UpdatePolicy;
