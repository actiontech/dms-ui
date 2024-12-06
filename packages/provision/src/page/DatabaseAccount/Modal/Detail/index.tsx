import {
  BasicButton,
  TokenCom,
  Copy,
  BasicTag,
  AvatarCom,
  EmptyBox,
  BasicToolTips,
  BasicTypographyEllipsis
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
import { IDBAccountDataPermission } from '@actiontech/shared/lib/api/provision/service/common';

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
      if (item.type === 'p' && item.key === 'auth_users') {
        const val = data?.auth_users?.join(',') ?? '';
        jsonData.push({ blockquote: `${item.prefix}: ${val}` });
      } else if (item.type === 'table') {
        let rows: string[][];
        jsonData.push({ blockquote: `${item.prefix}:` });
        if (item.key === 'data_permissions') {
          rows = [
            [
              data?.db_service?.name ?? '',
              data?.db_roles?.map((role) => role.name ?? '').join('，') ?? '',
              data?.data_permissions
                ?.flatMap((permission) => generatePermissionLabel(permission)!)
                .join('，') ?? ''
            ]
          ];
        } else {
          rows = [
            [
              data?.account_info?.address ?? '',
              data?.account_info?.user ?? '',
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

  const generatePermissionLabel = (permission: IDBAccountDataPermission) => {
    if (permission.data_objects) {
      return `${permission.data_operations
        ?.map((v) => v.name)
        .join(',')} ON ${permission.data_objects.map((v) => v.name).join(',')}`;
    }

    return permission.data_operations?.map((v) => v.name).join(',');
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
      destroyOnClose
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
            {data?.account_info?.additional_params?.map((item) => {
              return (
                <AccountInfoItem
                  key={item.key}
                  value={item.value ?? '-'}
                  label={item.desc}
                />
              );
            })}

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
            {t('databaseAccount.create.privilegeInfo')}
          </div>
          <div className="audit-card">
            <AccountInfoItem label={t('databaseAccount.detail.role')}>
              {data?.db_roles?.map((item) => (
                <BasicToolTips
                  key={item.uid}
                  title={item.DBAccountDataPermission?.map(
                    (dataPermission, index) => (
                      <BasicTag key={index} style={{ maxWidth: 190 }}>
                        <BasicTypographyEllipsis
                          copyable={false}
                          tooltipsMaxWidth={220}
                          textCont={
                            generatePermissionLabel(dataPermission) ?? ''
                          }
                        />
                      </BasicTag>
                    )
                  )}
                >
                  <BasicTag>{item.name}</BasicTag>
                </BasicToolTips>
              ))}
            </AccountInfoItem>
            <AccountInfoItem label={t('databaseAccount.detail.privilege')}>
              {data?.data_permissions?.map((item, index) => {
                return (
                  <EmptyBox
                    key={index}
                    if={
                      !!item &&
                      item.data_operations &&
                      item.data_operations.length > 0
                    }
                  >
                    <BasicTag style={{ maxWidth: 190 }}>
                      <BasicTypographyEllipsis
                        copyable={false}
                        tooltipsMaxWidth={220}
                        textCont={generatePermissionLabel(item) ?? ''}
                      />
                    </BasicTag>
                  </EmptyBox>
                );
              })}
            </AccountInfoItem>
          </div>
        </div>
        <div className="audit-info-wrapper">
          <div className="audit-info-title">
            {t('databaseAccount.detail.authInfo')}
          </div>
          <div className="audit-card">
            <AccountInfoItem label={t('databaseAccount.detail.authUser')}>
              <EmptyBox if={!!data?.auth_users?.length} defaultNode="-">
                <div className="flex-display">
                  {data?.auth_users?.map((user, index) => {
                    return (
                      <AvatarCom
                        style={{ display: 'inline-block', marginRight: 12 }}
                        key={index}
                        size="small"
                        name={user ?? ''}
                      />
                    );
                  })}
                </div>
              </EmptyBox>
            </AccountInfoItem>
          </div>
        </div>
      </Spin>
    </AccountDetailDrawerStyleWrapper>
  );
};

export default DatabaseAccountDetailModal;
