import { useBoolean } from 'ahooks';
import { message, Form, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { BasicButton, BasicModal, BasicInputNumber } from '@actiontech/shared';
import useModalStatus from '../../../../hooks/useModalStatus';
import {
  DatabaseAccountModalStatus,
  DatabaseAccountSelectData
} from '../../../../store/databaseAccount';
import dbAccountService from '@actiontech/shared/lib/api/provision/service/db_account/';
import { useRecoilState } from 'recoil';
import EventEmitter from '../../../../utils/EventEmitter';
import { EventEmitterKey, ModalName } from '../../../../data/enum';

const RenewalPasswordModal: React.FC = () => {
  const { t } = useTranslation();

  const [form] = Form.useForm<{ renewalTime: number }>();

  const [messageApi, contextHolder] = message.useMessage();

  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();

  const { toggleModal, visible } = useModalStatus(
    DatabaseAccountModalStatus,
    ModalName.DatabaseAccountRenewalPasswordModal
  );

  const [selectData, updateSelectData] = useRecoilState(
    DatabaseAccountSelectData
  );

  const { projectID } = useCurrentProject();

  const onClose = () => {
    form.resetFields();
    updateSelectData({});
    toggleModal(ModalName.DatabaseAccountRenewalPasswordModal, false);
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    startSubmit();
    dbAccountService
      .AuthUpdateDBAccount({
        project_uid: projectID,
        db_account_uid: selectData?.db_account_uid ?? '',
        db_account: {
          renewal_effective_time_day: values.renewalTime
        }
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('databaseAccount.renewalPassword.successTip'));
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
    <BasicModal
      open={visible}
      title={t('databaseAccount.renewalPassword.title')}
      onCancel={onClose}
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
            {t('common.submit')}
          </BasicButton>
        </Space>
      }
    >
      {contextHolder}
      <Form layout="vertical" form={form}>
        <Form.Item
          name="renewalTime"
          label={t('databaseAccount.renewalPassword.dateTime')}
          rules={[{ required: true }]}
        >
          <BasicInputNumber min={0} />
        </Form.Item>
      </Form>
    </BasicModal>
  );
};

export default RenewalPasswordModal;
