import { useBoolean } from 'ahooks';
import { message, Form, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import EventEmitter from '../../../../utils/EventEmitter';
import { BasicButton, BasicDrawer } from '@actiontech/shared';
import useModalStatus from '../../../../hooks/useModalStatus';
import { DatabaseAccountModalStatus } from '../../../../store/databaseAccount';
import { EventEmitterKey, ModalName } from '../../../../data/enum';
import DataBaseInfoField from './DataBaseInfoField';
import { AccountDiscoveryFormType } from '../../index.type';
import dbAccountService from '@actiontech/shared/lib/api/provision/service/db_account/';
import { omit } from 'lodash';

const AccountDiscoveryModal: React.FC = () => {
  const { t } = useTranslation();

  const [form] = Form.useForm<AccountDiscoveryFormType>();

  const [messageApi, contextHolder] = message.useMessage();

  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();

  const { toggleModal, visible } = useModalStatus(
    DatabaseAccountModalStatus,
    ModalName.DatabaseAccountDiscoveryModal
  );

  const { projectID } = useCurrentProject();

  const onClose = () => {
    form.resetFields();
    toggleModal(ModalName.DatabaseAccountDiscoveryModal, false);
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    startSubmit();
    dbAccountService
      .AuthSyncDBAccount({
        project_uid: projectID,
        db_service_uid: values.service,
        accounts: values.account.map((i) => omit(i, ['id']))
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('databaseAccount.discovery.syncSuccess'));
          onClose();
          EventEmitter.emit(
            EventEmitterKey.Refresh_Account_Management_List_Table,
            'filter_by_db_service',
            values.service
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
      size="large"
      placement="right"
      title={t('databaseAccount.discovery.title')}
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
            {t('databaseAccount.discovery.syncAccount')}
          </BasicButton>
        </Space>
      }
    >
      {contextHolder}
      <DataBaseInfoField form={form} visible={visible} />
    </BasicDrawer>
  );
};

export default AccountDiscoveryModal;
