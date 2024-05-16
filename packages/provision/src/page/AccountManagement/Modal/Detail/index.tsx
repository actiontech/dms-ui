import {
  BasicButton,
  TokenCom,
  Copy,
  BasicTag,
  AvatarCom,
  EmptyBox
} from '@actiontech/shared';
import useModalStatus from '../../../../hooks/useModalStatus';
import { useTranslation } from 'react-i18next';
import {
  DatabaseAccountModalStatus,
  DatabaseAccountSelectData
} from '../../../../store/databaseAccount';
import { ModalName } from '../../../../data/enum';
import { useRecoilState } from 'recoil';
import dbAccountService from '@actiontech/shared/lib/api/provision/service/db_account/';
import { useRequest } from 'ahooks';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { Space, Spin, message } from 'antd';
import { AccountDetailDrawerStyleWrapper } from '../../style';
import { formatTime } from '@actiontech/shared/lib/utils/Common';
import AccountInfoItem from '../../components/AccountInfoItem';
import json2md, { DataObject } from 'json2md';
import { accountDetailCustomConfig } from './accountDetailCustomConfig';

const DatabaseAccountDetailModal = () => {
  const { t } = useTranslation();

  const { projectID } = useCurrentProject();

  const [messageApi, contextHolder] = message.useMessage();

  const { toggleModal, visible } = useModalStatus(
    DatabaseAccountModalStatus,
    ModalName.DatabaseAccountDetailModal
  );

  const [selectData, updateSelectData] = useRecoilState(
    DatabaseAccountSelectData
  );

  const { data, loading } = useRequest(
    () => {
      return dbAccountService
        .AuthGetDBAccount({
          project_uid: projectID,
          db_account_uid: selectData?.db_account_uid ?? ''
        })
        .then((res) => res.data.data);
    },
    { ready: visible && !!selectData?.db_account_uid }
  );

  const onClose = () => {
    toggleModal(ModalName.DatabaseAccountDetailModal, false);
    updateSelectData({});
  };

  const handleCopy = () => {
    const jsonData: DataObject = [];
    accountDetailCustomConfig.forEach((item) => {
      if (item.type === 'p') {
        if (item.key === 'auth_users') {
          const val =
            data?.auth_users?.reduce((prev, next) => `${prev},${next}`, '') ??
            '';
          jsonData.push({ blockquote: `${item.prefix}: ${val}` });
        } else {
          const val = data?.[item.key];
          jsonData.push({ blockquote: `${item.prefix}: ${val}` });
        }
      } else if (item.type === 'table') {
        let rows: string[][];
        jsonData.push({ blockquote: `${item.prefix}:` });
        if (item.key === 'data_permissions') {
          rows =
            data?.data_permissions?.map((permission) => {
              return [
                data.db_service?.name ?? '',
                permission.data_objects?.map((obj) => obj.name).join('，') ??
                  '',
                permission.data_operation_sets
                  ?.map((operation) => operation.name)
                  .join('，') ?? ''
              ];
            }) ?? [];
        } else {
          rows = [
            [
              data?.account_info?.address ?? '',
              data?.account_info?.user ?? '',
              data?.account_info?.hostname ?? '',
              data?.account_info?.password ?? '',
              data?.account_info?.explanation ?? ''
            ]
          ];
        }
        jsonData.push({
          table: {
            headers: item.headers,
            rows
          }
        });
      }
    });
    Copy.copyTextByTextarea(json2md(jsonData));
    messageApi.success(t('common.copySuccess'));
  };

  return (
    <AccountDetailDrawerStyleWrapper
      open={visible}
      size="large"
      placement="right"
      title={t('databaseAccount.detail.title')}
      onClose={onClose}
      footer={
        <Space>
          <BasicButton onClick={onClose}>{t('common.close')}</BasicButton>
          <BasicButton type="primary" onClick={handleCopy}>
            {t('databaseAccount.detail.copyAll')}
          </BasicButton>
        </Space>
      }
    >
      {contextHolder}
      <Spin spinning={loading}>
        <div className="audit-info-wrapper">
          <div className="audit-info-title">
            {t('databaseAccount.detail.accountInfo')}
          </div>
          <div className="audit-card">
            <AccountInfoItem
              label={t('databaseAccount.create.form.username')}
              value={data?.account_info?.user}
            />
            <AccountInfoItem
              label={t('databaseAccount.create.form.hostname')}
              value={data?.account_info?.hostname}
            />
            <AccountInfoItem label={t('databaseAccount.create.form.password')}>
              <EmptyBox if={!!data?.account_info?.password} defaultNode="-">
                <TokenCom text={data?.account_info?.password ?? ''} />
              </EmptyBox>
            </AccountInfoItem>
            <AccountInfoItem
              label={t('databaseAccount.detail.createTime')}
              value={
                data?.account_info?.password_create_time
                  ? formatTime(`${data?.account_info?.password_create_time}`)
                  : '-'
              }
            ></AccountInfoItem>
            <AccountInfoItem
              label={t('databaseAccount.detail.expireTime')}
              value={
                data?.account_info?.expired_time
                  ? formatTime(`${data?.account_info?.expired_time}`)
                  : '-'
              }
            ></AccountInfoItem>
            <AccountInfoItem>
              <BasicButton
                type="primary"
                size="small"
                onClick={() => {
                  Copy.copyTextByTextarea(
                    data?.account_info?.connect_string ?? ''
                  );
                  messageApi.success(t('common.copySuccess'));
                }}
              >
                {t('databaseAccount.detail.copyString')}
              </BasicButton>
            </AccountInfoItem>
          </div>
        </div>
        <div className="audit-info-wrapper">
          <div className="audit-info-title">
            {t('databaseAccount.create.permissionInfo')}
          </div>
          {data?.data_permissions?.map((permission, index) => (
            <div className="audit-card" key={index}>
              <AccountInfoItem
                label={t('databaseAccount.discovery.service')}
                value={data.db_service?.name}
              />
              <AccountInfoItem label={t('databaseAccount.create.form.objects')}>
                {permission.data_objects?.map((obj) => {
                  return (
                    <BasicTag key={`${obj.database_uid}${obj.table_uid}`}>
                      {obj.name}
                    </BasicTag>
                  );
                })}
              </AccountInfoItem>
              <AccountInfoItem
                label={t('databaseAccount.create.form.operation')}
              >
                {permission.data_operation_sets?.map((operation) => {
                  return (
                    <BasicTag key={operation.uid}>{operation.name}</BasicTag>
                  );
                })}
              </AccountInfoItem>
            </div>
          ))}
        </div>
        <div className="audit-info-wrapper">
          <div className="audit-info-title">
            {t('databaseAccount.detail.authInfo')}
          </div>
          <div className="audit-card">
            <AccountInfoItem label={t('databaseAccount.detail.authUser')}>
              <EmptyBox if={!!data?.auth_users?.length} defaultNode="-">
                {data?.auth_users?.map((user, index) => {
                  return (
                    <AvatarCom key={index} size="small" name={user ?? ''} />
                  );
                })}
              </EmptyBox>
            </AccountInfoItem>
          </div>
        </div>
      </Spin>
    </AccountDetailDrawerStyleWrapper>
  );
};

export default DatabaseAccountDetailModal;
