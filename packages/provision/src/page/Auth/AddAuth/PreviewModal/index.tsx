import { useRequest, useBoolean } from 'ahooks';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { MonacoEditor } from '@actiontech/shared/lib/components/MonacoEditor';
import { IAuthGetStatementByDataPermissionTemplatesParams } from '@actiontech/shared/lib/api/provision/service/auth/index.d';
import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { BasicModal, BasicButton } from '@actiontech/shared';
import { PreviewModalProps } from '../index.type';

const PreviewModal: React.FC<PreviewModalProps> = ({
  params,
  setParams,
  onSuccess
}) => {
  const { t } = useTranslation();

  const previewParams: IAuthGetStatementByDataPermissionTemplatesParams =
    useMemo(() => {
      return {
        data_permission_template_uid:
          params?.data_permission_template_uid ?? '',
        db_account_hostname: params?.db_account?.hostname ?? '',
        db_account_username: params?.db_account?.username ?? '',
        db_account_password: params?.db_account?.password ?? ''
      };
    }, [params]);

  const { data: sql } = useRequest(
    () =>
      auth
        .AuthGetStatementByDataPermissionTemplates(previewParams)
        .then((res) => {
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
      auth
        .AuthAddAuthorization({
          authorization: params
        })
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
      title={t('auth.addAuth.previewModal.title')}
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
