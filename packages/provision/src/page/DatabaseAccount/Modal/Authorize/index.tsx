import { BasicButton, BasicModal, BasicSelect } from '@actiontech/shared';
import {
  Space,
  message,
  Form,
  Typography,
  Radio,
  RadioChangeEvent
} from 'antd';
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
import { useCallback, useEffect } from 'react';
import dbAccountService from '@actiontech/shared/lib/api/provision/service/db_account/';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { filterOptionByLabel } from '@actiontech/shared/lib/components/BasicSelect/utils';
import { accountNameRender } from '../../index.utils';
import { AuthorizeType } from './index.enum';
import { AuthorizeFormFields } from './index.type';
import useMemberGroup from '../../hooks/useMemberGroup';

const AccountAuthorizeModal = () => {
  const { t } = useTranslation();

  const { projectID } = useCurrentProject();

  const [form] = Form.useForm<AuthorizeFormFields>();

  const selectedAuthorizeType = Form.useWatch('authorizeType', form);

  const {
    updateUserListAsync,
    updateUserList,
    userIDOptions,
    loading: getUserListLoading
  } = useProvisionUser();

  const {
    updateMemberGroupListAsync,
    updateMemberGroupList,
    memberIDOptions,
    loading: getMemberGroupLoading
  } = useMemberGroup();

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
          },
          permission_user_groups: {
            permission_user_group_uids: values.memberGroupUid ?? []
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

  const getMembersAndSetDefaultValues = useCallback(() => {
    updateMemberGroupListAsync().then(() => {
      form.setFieldValue(
        'memberGroupUid',
        selectData?.auth_user_groups?.map((v) => v.uid) ?? []
      );
    });
  }, [updateMemberGroupListAsync, form, selectData?.auth_user_groups]);

  const getUsersAndSetDefaultValues = useCallback(() => {
    updateUserListAsync().then(() => {
      form.setFieldValue(
        'userId',
        selectData?.auth_users?.map((v) => v.uid) ?? []
      );
    });
  }, [updateUserListAsync, form, selectData?.auth_users]);

  const onChangeAuthorizeType = (e: RadioChangeEvent) => {
    if (e.target.value === AuthorizeType.USER) {
      updateUserList();
    } else {
      updateMemberGroupList();
    }
  };

  useEffect(() => {
    if (visible) {
      getUsersAndSetDefaultValues();
      getMembersAndSetDefaultValues();
    }
  }, [getUsersAndSetDefaultValues, getMembersAndSetDefaultValues, visible]);

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

        <Form.Item name="authorizeType" initialValue={AuthorizeType.USER}>
          <Radio.Group onChange={onChangeAuthorizeType}>
            <Radio value={AuthorizeType.USER}>
              {t('databaseAccount.authorize.selectUser')}
            </Radio>
            <Radio value={AuthorizeType.USER_GROUP}>
              {t('databaseAccount.authorize.selectUserGroup')}
            </Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          hidden={selectedAuthorizeType !== AuthorizeType.USER}
          name="userId"
        >
          <BasicSelect
            loading={getUserListLoading}
            mode="multiple"
            options={userIDOptions}
            showSearch
            optionFilterProp="label"
            filterOption={filterOptionByLabel}
            allowClear
          />
        </Form.Item>

        <Form.Item
          hidden={selectedAuthorizeType !== AuthorizeType.USER_GROUP}
          name="memberGroupUid"
        >
          <BasicSelect
            loading={getMemberGroupLoading}
            mode="multiple"
            options={memberIDOptions}
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
