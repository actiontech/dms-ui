import { useRequest } from 'ahooks';
import { message, Space, Spin } from 'antd';
import json2md, { DataObject } from 'json2md';
import { useTranslation } from 'react-i18next';
import { ModalName } from '~/data/enum';
import useModalStatus from '~/hooks/useModalStatus';
import { AuthListModalStatus, AuthListSelectData } from '~/store/auth/list';
import { useRecoilState } from 'recoil';
import { useEffect } from 'react';
import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { BasicButton, BasicTag, Copy, TokenCom } from '@actiontech/shared';
import { AuthAuditDetailDrawerStyleWrapper } from '../../../Audit/components/style';
import AuditDetailItem from '../../../Audit/components/AuditDetailItem';
import { authDetailCustomConfig } from './authDetailCustomConfig';

const AuthDetailDrawer: React.FC = () => {
  const { t } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();

  const [selectData, updateSelectData] = useRecoilState(AuthListSelectData);

  const {
    data: authDetails,
    loading,
    run: getConnection,
    mutate
  } = useRequest(
    () =>
      auth
        .AuthGetAuthorization({
          authorization_uid: selectData?.uid ?? ''
        })
        .then((res) => {
          return res.data.data;
        }),
    {
      manual: true
    }
  );

  const { toggleModal, visible } = useModalStatus(
    AuthListModalStatus,
    ModalName.GetConnection
  );

  useEffect(() => {
    if (visible && selectData?.uid) {
      getConnection();
    }
  }, [getConnection, selectData?.uid, visible]);

  const closeModal = () => {
    toggleModal(ModalName.GetConnection, false);
    updateSelectData({});
    mutate();
  };

  const handleCopy = () => {
    const jsonData: DataObject = [];
    authDetailCustomConfig.forEach((item) => {
      if (item.type === 'p') {
        const val = authDetails?.[item.key];
        jsonData.push({ blockquote: `${item.prefix}: ${val}` });
      } else if (item.type === 'table') {
        let rows: string[][];
        jsonData.push({ blockquote: `${item.prefix}:` });
        if (item.key === 'data_permissions') {
          rows =
            authDetails?.data_permissions?.map((data) => {
              return [
                data.service_name ?? '',
                data.data_objects?.map((obj) => obj.name).join('，') ?? '',
                data.data_operation_sets
                  ?.map((operation) => operation.name)
                  .join('，') ?? ''
              ];
            }) ?? [];
        } else {
          rows =
            authDetails?.db_accounts?.map((data) => {
              return [
                data.data_object_service_dns ?? '',
                data.user ?? '',
                data.hostname ?? '',
                data.password ?? '',
                data.explanation ?? ''
              ];
            }) ?? [];
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
    <AuthAuditDetailDrawerStyleWrapper
      title={t('auth.connectionDetails.title')}
      open={visible}
      onClose={closeModal}
      footer={
        <Space>
          <BasicButton onClick={closeModal}>{t('common.close')}</BasicButton>
          <BasicButton type="primary" onClick={handleCopy}>
            {t('auth.button.copy')}
          </BasicButton>
        </Space>
      }
    >
      {contextHolder}
      <Spin spinning={loading}>
        <div className="audit-info-wrapper">
          <div className="audit-info-title">
            {t('auth.authDetail.baseInfo')}
          </div>
          <AuditDetailItem
            label={t('auth.addAuth.steps.purpose')}
            value={authDetails?.purpose}
          />
          <AuditDetailItem
            label={t('auth.connectionDetails.business')}
            value={authDetails?.businesses}
          />
          <AuditDetailItem
            label={t('auth.columns.permissionUser')}
            value={authDetails?.permission_user}
          />
        </div>
        <div className="audit-info-wrapper">
          <div className="audit-info-title">
            {t('auth.template.columns.template_details')}
          </div>
          {authDetails?.data_permissions?.map((i) => (
            <div className="audit-card" key={i.service_uid}>
              <AuditDetailItem
                label={t('auth.addAuth.baseForm.baseFormTable.service')}
                value={i.service_name}
              />
              <AuditDetailItem
                label={t('auth.addAuth.baseForm.baseFormTable.objects')}
              >
                {i.data_objects?.map((obj) => {
                  return (
                    <BasicTag key={`${obj.database_uid}${obj.table_uid}`}>
                      {obj.name}
                    </BasicTag>
                  );
                })}
              </AuditDetailItem>
              <AuditDetailItem
                label={t('auth.addAuth.baseForm.baseFormTable.operation')}
              >
                {i.data_operation_sets?.map((operation) => {
                  return (
                    <BasicTag key={operation.uid}>{operation.name}</BasicTag>
                  );
                })}
              </AuditDetailItem>
            </div>
          ))}
        </div>
        <div className="audit-info-wrapper">
          <div className="audit-info-title">
            {t('auth.connectionDetails.accountInfo')}
          </div>
          {authDetails?.db_accounts?.map((i) => (
            <div className="audit-card" key={i.uid}>
              <AuditDetailItem
                label={t('auth.connectionDetails.dns')}
                value={i.data_object_service_dns}
              />
              <AuditDetailItem
                label={t('auth.addAuth.accountForm.username')}
                value={i?.user}
              />
              <AuditDetailItem
                label={t('auth.addAuth.accountForm.hostname')}
                value={i.hostname}
              />
              <AuditDetailItem label={t('auth.addAuth.accountForm.password')}>
                <TokenCom text={i.password ?? ''} />
              </AuditDetailItem>
              <AuditDetailItem
                label={t('auth.connectionDetails.explanation')}
                value={i.explanation}
              />
              <AuditDetailItem>
                <BasicButton
                  type="primary"
                  size="small"
                  onClick={() => {
                    Copy.copyTextByTextarea(i.connection_cmd ?? '');
                    messageApi.success(t('common.copySuccess'));
                  }}
                >
                  {t('auth.connectionDetails.copyString')}
                </BasicButton>
              </AuditDetailItem>
            </div>
          ))}
        </div>
      </Spin>
    </AuthAuditDetailDrawerStyleWrapper>
  );
};

export default AuthDetailDrawer;
