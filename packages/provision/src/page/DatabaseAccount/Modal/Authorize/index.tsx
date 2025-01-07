import { BasicButton, BasicModal, BasicSelect } from '@actiontech/shared';
import { Space, message, Form, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import useModalStatus from '../../../../hooks/useModalStatus';
import {
  DatabaseAccountModalStatus,
  DatabaseAccountSelectData
} from '../../../../store/databaseAccount';
import EventEmitter from '../../../../utils/EventEmitter';
import { EventEmitterKey, ModalName } from '../../../../data/enum';
import { useBoolean } from 'ahooks';
import { useRecoilState } from 'recoil';
import useProvisionUser from '../../../../hooks/useProvisionUser';
import { useEffect } from 'react';
import dbAccountService from '@actiontech/shared/lib/api/provision/service/db_account/';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { filterOptionByLabel } from '@actiontech/shared/lib/components/BasicSelect/utils';
import { accountNameRender } from '../../index.utils';

const AccountAuthorizeModal = () => {
  const { t } = useTranslation();

  const { projectID } = useCurrentProject();

  const [form] = Form.useForm<{ userId: string[] }>();

  const { updateUserList, userIDOptions } = useProvisionUser();

  const [messageApi, contextHolder] = message.useMessage();

  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();

  const { toggleModal, visible } = useModalStatus(
    DatabaseAccountModalStatus,
    ModalName.DatabaseAccountAuthorizeModal
  );

  const [selectData, updateSelectData] = useRecoilState(
    DatabaseAccountSelectData
  );

  const onSubmit = async () => {
    const values = await form.validateFields();
    startSubmit();
    dbAccountService
      .AuthUpdateDBAccount({
        project_uid: projectID,
        db_account_uid: selectData?.db_account_uid ?? '',
        db_account: {
          permission_users: {
            permission_user_uids: values.userId ?? []
          }
        }
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(t('databaseAccount.authorize.successTip'));
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

  const onClose = () => {
    form.resetFields();
    toggleModal(ModalName.DatabaseAccountAuthorizeModal, false);
    updateSelectData({});
  };

  useEffect(() => {
    updateUserList();
  }, [updateUserList]);

  useEffect(() => {
    if (selectData?.auth_users?.length) {
      form.setFieldValue(
        'userId',
        selectData.auth_users.map((v) => v.uid)
      );
    }
  }, [selectData, form]);

  return (
    <BasicModal
      open={visible}
      title={t('databaseAccount.authorize.title')}
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
        <Form.Item>
          <Typography.Text type="secondary">
            {t('databaseAccount.authorize.currentAccount')}:{' '}
            {accountNameRender(selectData?.account_info)}
          </Typography.Text>
        </Form.Item>
        <Form.Item
          name="userId"
          label={t('databaseAccount.authorize.selectUser')}
        >
          <BasicSelect
            mode="multiple"
            options={userIDOptions}
            showSearch
            optionFilterProp="label"
            filterOption={filterOptionByLabel}
            allowClear
          />
        </Form.Item>
      </Form>
    </BasicModal>
  );
};

export default AccountAuthorizeModal;
