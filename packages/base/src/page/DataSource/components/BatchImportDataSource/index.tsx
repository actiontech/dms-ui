import {
  BasicButton,
  PageHeader,
  EmptyBox,
  BasicResult,
  TypedLink
} from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import BatchImportDataSourceForm from '../../../Project/BatchImportDataSource/UploadForm';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import DBService from '@actiontech/shared/lib/api/base/service/DBService';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import useBatchImportDataSource from '../../../Project/BatchImportDataSource/hooks/useBatchImportDataSource';
import { UploadProps } from 'antd';
import { useCallback } from 'react';
import { LeftArrowOutlined } from '@actiontech/icons';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

const BatchImportDataSource = () => {
  const { t } = useTranslation();

  const { projectID } = useCurrentProject();

  const {
    importLoading,
    setImportPending,
    setImportDone,
    resultVisible,
    showResult,
    form,
    resetAndHideResult,
    setDBservices,
    dbServices,
    importServicesCheck,
    uploadCheckStatus,
    clearUploadCheckStatus
  } = useBatchImportDataSource();

  const onSubmit = async () => {
    await form.validateFields();
    setImportPending();
    DBService.ImportDBServicesOfOneProject({
      db_services: dbServices,
      project_uid: projectID
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
      DBService.ImportDBServicesOfOneProjectCheck(
        {
          project_uid: projectID,
          db_services_file: option.file
        },
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
    [importServicesCheck, projectID, setDBservices, clearUploadCheckStatus]
  );

  return (
    <>
      <PageHeader
        title={
          <TypedLink
            to={ROUTE_PATHS.BASE.DATA_SOURCE.index}
            params={{ projectID }}
          >
            <BasicButton icon={<LeftArrowOutlined />}>
              {t('dmsDataSource.backDesc')}
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
              {t('dmsDataSource.batchImportDataSource.importFile')}
            </BasicButton>
          </EmptyBox>
        }
      />
      <EmptyBox
        if={!resultVisible}
        defaultNode={
          <BasicResult
            status="success"
            title={t('dmsDataSource.batchImportDataSource.successTitle')}
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

export default BatchImportDataSource;
