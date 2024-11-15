import {
  BasicButton,
  PageHeader,
  EmptyBox,
  BasicResult,
  TypedLink
} from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import BatchImportDataSourceForm from './UploadForm';
import Project from '@actiontech/shared/lib/api/base/service/Project';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import useBatchImportDataSource from './hooks/useBatchImportDataSource';
import { UploadProps } from 'antd';
import { useCallback } from 'react';
import { LeftArrowOutlined } from '@actiontech/icons';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

const BatchImportDataSource = () => {
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
          <TypedLink to={ROUTE_PATHS.BASE.PROJECT.index}>
            <BasicButton icon={<LeftArrowOutlined />}>
              {t('dmsProject.backToList')}
            </BasicButton>
          </TypedLink>
        }
        extra={
          <EmptyBox if={!resultVisible}>
            <BasicButton
              type="primary"
              onClick={onSubmit}
              loading={importLoading}
              disabled={!dbServices?.length}
            >
              {t('dmsProject.importProject.buttonText')}
            </BasicButton>
          </EmptyBox>
        }
      />
      <EmptyBox
        if={!resultVisible}
        defaultNode={
          <BasicResult
            status="success"
            title={t('dmsProject.batchImportDataSource.successTitle')}
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
          uploadCheckStatus={uploadCheckStatus}
          clearUploadCheckStatus={clearUploadCheckStatus}
        />
      </EmptyBox>
    </>
  );
};

export default BatchImportDataSource;
