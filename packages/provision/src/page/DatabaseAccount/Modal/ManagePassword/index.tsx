import { useBoolean } from 'ahooks';
import { message, Form, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import {
  BasicButton,
  BasicDrawer,
  BasicInput,
  BasicToolTips
} from '@actiontech/shared';
import useModalStatus from '../../../../hooks/useModalStatus';
import {
  DatabaseAccountModalStatus,
  DatabaseAccountSelectData
} from '../../../../store/databaseAccount';
import { ModifyPasswordFormType } from '../../index.type';
import dbAccountService from '@actiontech/shared/lib/api/provision/service/db_account/';
import { NORMAL_POLICY_VALUE } from '../../../../hooks/useSecurityPolicy';
import { useRecoilState } from 'recoil';
import EventEmitter from '../../../../utils/EventEmitter';
import { EventEmitterKey, ModalName } from '../../../../data/enum';
import PasswordPolicyField from '../ModifyPassword/PasswordPolicyField';

const ManagePasswordModal: React.FC = () => {
  const { t } = useTranslation();

  const [form] = Form.useForm<ModifyPasswordFormType>();

  const [messageApi, contextHolder] = message.useMessage();

  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();

  const { toggleModal, visible } = useModalStatus(
    DatabaseAccountModalStatus,
    ModalName.DatabaseAccountManagePasswordModal
  );

  const [selectData, updateSelectData] = useRecoilState(
    DatabaseAccountSelectData
  );

  const { projectID } = useCurrentProject();

  const onClose = () => {
    form.resetFields();
    updateSelectData({});
    toggleModal(ModalName.DatabaseAccountManagePasswordModal, false);
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    startSubmit();
    dbAccountService
      .AuthUpdateDBAccount({
        project_uid: projectID,
        db_account_uid: selectData?.db_account_uid ?? '',
        db_account: {
          platform_managed: {
            platform_managed: true,
            password_expired_day: values.effective_time_day,
            manage_password: values.password,
            password_security_policy:
              values.policy === NORMAL_POLICY_VALUE ? '' : values.policy
          }
        }
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('databaseAccount.manageAccount.successTip'));
          onClose();
          EventEmitter.emit(
            EventEmitterKey.Refresh_Account_Management_List_Table
          );
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  return (
    <BasicDrawer
      open={visible}
      placement="right"
      title={t('databaseAccount.list.action.manage')}
      onClose={onClose}
      footer={
        <Space>
          <BasicButton onClick={onClose} disabled={submitLoading}>
            {t('common.close')}
          </BasicButton>
          <BasicButton
            type="primary"
            onClick={onSubmit}
            loading={submitLoading}
          >
            {t('common.ok')}
          </BasicButton>
        </Space>
      }
    >
      {contextHolder}
      <Form layout="vertical" form={form}>
        <PasswordPolicyField visible={visible} />
        <Form.Item
          name="password"
          label={
            <BasicToolTips
              suffixIcon
              title={t('databaseAccount.manageAccount.passwordTip')}
            >
              {t('databaseAccount.create.form.password')}
            </BasicToolTips>
          }
          rules={[{ required: true }]}
        >
          <BasicInput.Password />
        </Form.Item>
      </Form>
    </BasicDrawer>
  );
};

export default ManagePasswordModal;
