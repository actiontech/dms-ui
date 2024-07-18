import {
  BasicButton,
  PageHeader,
  EmptyBox,
  BasicResult
} from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import BatchImportDataSourceForm from '../../Project/BatchImportDataSource/UploadForm';
import Project from '@actiontech/shared/lib/api/base/service/Project';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import useBatchImportDataSource from '../../Project/BatchImportDataSource/hooks/useBatchImportDataSource';
import { UploadProps } from 'antd';
import { useCallback } from 'react';
import { LeftArrowOutlined } from '@actiontech/icons';

const GlobalBatchImportDataSource = () => {
  const { t } = useTranslation();

  const {
    importLoading,
    setImportPending,
    setImportDone,
    resultVisible,
    showResult,
    form,
    resetAndHideResult,
    dbServices,
    importServicesCheck,
    setDBservices,
    uploadCheckStatus,
    clearUploadCheckStatus
  } = useBatchImportDataSource();

  const onSubmit = async () => {
    await form.validateFields();
    setImportPending();
    Project.ImportDBServicesOfProjects({
      db_services: dbServices
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          showResult();
        }
      })
      .finally(() => {
        setImportDone();
      });
  };

  const onUploadCustomRequest = useCallback<
    Required<UploadProps>['customRequest']
  >(
    (option) => {
      setDBservices([]);
      clearUploadCheckStatus();
      Project.ImportDBServicesOfProjectsCheck(
        { db_services_file: option.file },
        { responseType: 'blob' }
      )
        .then((res) => {
          importServicesCheck(res);
          option?.onSuccess?.(option?.file);
        })
        .catch((error) => {
          option?.onError?.(error);
        });
    },
    [importServicesCheck, setDBservices, clearUploadCheckStatus]
  );

  return (
    <>
      <PageHeader
        title={
          <Link to={`/global-data-source`}>
            <BasicButton icon={<LeftArrowOutlined />}>
              {t('dmsGlobalDataSource.backToList')}
            </BasicButton>
          </Link>
        }
        extra={
          <EmptyBox if={!resultVisible}>
            <BasicButton
              type="primary"
              onClick={onSubmit}
              loading={importLoading}
              disabled={!dbServices?.length}
            >
              {t('dmsGlobalDataSource.batchImportDataSource.submitButton')}
            </BasicButton>
          </EmptyBox>
        }
      />
      <EmptyBox
        if={!resultVisible}
        defaultNode={
          <BasicResult
            status="success"
            title={t('dmsGlobalDataSource.batchImportDataSource.successTitle')}
            extra={[
              <BasicButton
                type="primary"
                key="resetAndClose"
                onClick={resetAndHideResult}
              >
                {t('common.resetAndClose')}
              </BasicButton>
            ]}
          />
        }
      >
        <BatchImportDataSourceForm
          form={form}
          customRequest={onUploadCustomRequest}
          dbServices={dbServices}
          uploadCheckStatus={uploadCheckStatus}
          clearUploadCheckStatus={clearUploadCheckStatus}
        />
      </EmptyBox>
    </>
  );
};

export default GlobalBatchImportDataSource;
