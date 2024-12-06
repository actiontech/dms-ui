import { useRequest, useBoolean } from 'ahooks';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { BasicModal, BasicButton, SQLRenderer } from '@actiontech/shared';
import { PreviewModalProps } from '../../index.type';
import dbAccountService from '@actiontech/shared/lib/api/provision/service/db_account/';
import { IAuthGetStatementParams } from '@actiontech/shared/lib/api/provision/service/db_account/index.d';
import { Spin } from 'antd';

const PreviewModal: React.FC<PreviewModalProps> = ({
  params,
  setParams,
  onSuccess
}) => {
  const { t } = useTranslation();

  const previewParams: IAuthGetStatementParams = useMemo(() => {
    return {
      project_uid: params?.project_uid ?? '',
      db_accounts: {
        db_roles: params?.db_account?.db_roles,
        db_service_uid: params?.db_account?.db_service_uid ?? '',
        db_accounts: params?.db_account?.db_account
          ? [params?.db_account?.db_account]
          : [],
        data_permissions: params?.db_account?.data_permissions
      }
    };
  }, [params]);

  const { data: sql, loading: genSqlStatementPending } = useRequest(
    () =>
      dbAccountService.AuthGetStatement(previewParams).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          return res.data.data
            ?.map(
              (item) =>
                `${item.comment}\n${item.create_statement}\n\t${
                  item.grant_statements?.join('\n\t') ?? ''
                }`
            )
            .join('\n\n');
        }
      }),
    {
      ready: !!params
    }
  );

  const [createLoading, { setTrue, setFalse }] = useBoolean();

  const closeModal = () => {
    setParams();
  };

  const onCreate = () => {
    if (params) {
      setTrue();
      dbAccountService
        .AuthAddDBAccount(params)
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            onSuccess();
          }
        })
        .finally(() => {
          setFalse();
        });
    }
  };

  return (
    <BasicModal
      closable={false}
      open={!!params}
      title={t('databaseAccount.create.previewModal')}
      size="large"
      footer={
        <>
          <BasicButton
            disabled={createLoading || genSqlStatementPending}
            onClick={closeModal}
            className="close-preview-button"
          >
            {t('common.close')}
          </BasicButton>
          <BasicButton
            type="primary"
            loading={createLoading}
            onClick={onCreate}
            className="submit-preview-button"
            disabled={genSqlStatementPending}
          >
            {t('common.submit')}
          </BasicButton>
        </>
      }
    >
      <Spin delay={500} spinning={genSqlStatementPending}>
        <SQLRenderer.ViewOnlyEditor height="300px" sql={sql} />
      </Spin>
    </BasicModal>
  );
};
export default PreviewModal;
