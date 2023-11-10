import { useRequest } from 'ahooks';
import { Button, Modal } from 'antd';
import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalSize, ResponseCode } from '~/data/common';
import { MonacoEditor } from '@actiontech/shared/lib/components/MonacoEditor';
import { IAuthGetStatementByDataPermissionTemplatesParams } from '@actiontech/shared/lib/api/provision/service/auth/index.d';
import { IAddAuthorization } from '@actiontech/shared/lib/api/provision/service/common';
import auth from '@actiontech/shared/lib/api/provision/service/auth';
export interface IPreviewModal {
  params?: IAddAuthorization;
  onSuccess: () => void;
  setParams: (params?: IAddAuthorization) => void;
}

const PreviewModal: FC<IPreviewModal> = ({ params, setParams, onSuccess }) => {
  const { t } = useTranslation();

  const previewParams: IAuthGetStatementByDataPermissionTemplatesParams =
    useMemo(() => {
      return {
        data_permission_template_uid:
          params?.data_permission_template_uid ?? '',
        db_account_hostname: params?.db_account.hostname ?? '',
        db_account_username: params?.db_account.username ?? '',
        db_account_password: params?.db_account.password ?? ''
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

  const [createLoading, setCreateLoading] = useState(false);

  const closeModal = () => {
    setParams();
  };
  const create = () => {
    if (params) {
      setCreateLoading(true);
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
          setCreateLoading(false);
        });
    }
  };

  return (
    <Modal
      closable={false}
      width={ModalSize.mid}
      open={!!params}
      title={t('auth.addAuth.previewModal.title')}
      footer={
        <>
          <Button disabled={createLoading} onClick={closeModal}>
            {t('common.close')}
          </Button>
          <Button type="primary" loading={createLoading} onClick={create}>
            {t('common.submit')}
          </Button>
        </>
      }
    >
      <MonacoEditor height="300px" value={sql} language="sql" />
    </Modal>
  );
};
export default PreviewModal;
