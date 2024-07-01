import {
  BasicButton,
  PageHeader,
  EmptyBox,
  BasicResult
} from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import BatchImportDataSourceForm from './UploadForm';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import useBatchImportDataSource from './hooks/useBatchImportDataSource';
import { UploadProps } from 'antd';
import { useCallback } from 'react';
import { LeftArrowOutlined } from '@actiontech/icons';

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
    setDBservices
  } = useBatchImportDataSource();

  const onSubmit = async () => {
    await form.validateFields();
    setImportPending();
    dms
      .ImportDBServicesOfProjects({
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
      dms
        .ImportDBServicesOfProjectsCheck(
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
    [importServicesCheck, setDBservices]
  );

  return (
    <>
      <PageHeader
        title={
          <Link to={`/project`}>
            <BasicButton icon={<LeftArrowOutlined />}>
              {t('dmsProject.backToList')}
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
          dbServices={dbServices}
        />
      </EmptyBox>
    </>
  );
};

export default BatchImportDataSource;
