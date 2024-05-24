import { useRequest, useBoolean } from 'ahooks';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { MonacoEditor } from '@actiontech/shared/lib/components/MonacoEditor';
import { BasicModal, BasicButton } from '@actiontech/shared';
import { PreviewModalProps } from '../../index.type';
import dbAccountService from '@actiontech/shared/lib/api/provision/service/db_account/';
import { IAuthGetStatementParams } from '@actiontech/shared/lib/api/provision/service/db_account/index.d';

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
        db_service_uid: params?.db_account?.db_service_uid ?? '',
        db_accounts: params?.db_account?.db_account
          ? [params?.db_account?.db_account]
          : [],
        data_permissions: params?.db_account?.data_permissions ?? []
      }
    };
  }, [params]);

  const { data: sql } = useRequest(
    () =>
      dbAccountService.AuthGetStatement(previewParams).then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          return res.data.data
            ?.map(
              (item) =>
                `${item.comment}\n${
                  item.create_statement
                }\n\t${item.grant_statements?.join('\n\t')}`
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
          <BasicButton disabled={createLoading} onClick={closeModal}>
            {t('common.close')}
          </BasicButton>
          <BasicButton
            type="primary"
            loading={createLoading}
            onClick={onCreate}
          >
            {t('common.submit')}
          </BasicButton>
        </>
      }
    >
      <MonacoEditor height="300px" value={sql} language="sql" />
    </BasicModal>
  );
};
export default PreviewModal;
