import {
  BasicButton,
  PageHeader,
  EmptyBox,
  BasicResult
} from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { IconSuccessResult } from '@actiontech/shared/lib/Icon/common';
import BatchImportDataSourceForm from '../../../Project/BatchImportDataSource/UploadForm';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import useBatchImportDataSource from '../../../Project/BatchImportDataSource/hooks/useBatchImportDataSource';
import { UploadProps } from 'antd';
import { useCallback } from 'react';
import { LeftArrowOutlined } from '@actiontech/icons';

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
    importServicesCheck
  } = useBatchImportDataSource();

  const onSubmit = async () => {
    await form.validateFields();
    setImportPending();
    dms
      .ImportDBServicesOfOneProject({
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
      dms
        .ImportDBServicesOfOneProjectCheck(
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
    [importServicesCheck, projectID, setDBservices]
  );

  return (
    <>
      <PageHeader
        title={
          <Link to={`/project/${projectID}/db-services`}>
            <BasicButton icon={<LeftArrowOutlined />}>
              {t('dmsDataSource.backDesc')}
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
              {t('dmsDataSource.batchImportDataSource.importFile')}
            </BasicButton>
          </EmptyBox>
        }
      />
      <EmptyBox
        if={!resultVisible}
        defaultNode={
          <BasicResult
            icon={<IconSuccessResult />}
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
        />
      </EmptyBox>
    </>
  );
};

export default BatchImportDataSource;
