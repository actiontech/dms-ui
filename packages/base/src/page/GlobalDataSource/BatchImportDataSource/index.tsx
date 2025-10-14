import {
  BasicButton,
  PageHeader,
  EmptyBox,
  BasicResult
} from '@actiontech/dms-kit';
import { BackButton } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import BatchImportDataSourceForm from '../../Project/BatchImportDataSource/UploadForm';
import { ResponseCode } from '@actiontech/dms-kit';
import useBatchImportDataSource from '../../Project/BatchImportDataSource/hooks/useBatchImportDataSource';
import { UploadProps } from 'antd';
import { useCallback } from 'react';
import { LeftArrowOutlined } from '@actiontech/icons';
import { DmsApi } from '@actiontech/shared/lib/api';
import ConnectableErrorModal from '../../Project/BatchImportDataSource/ConnectableErrorModal';
import useBatchCheckConnectable from '../../Project/BatchImportDataSource/hooks/useBatchCheckConnectable';
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
  const {
    batchCheckConnectable,
    batchCheckConnectableLoading,
    connectErrorModalVisible,
    showConnectErrorModal,
    hideConnectErrorModal,
    connectableInfo
  } = useBatchCheckConnectable();
  const onSubmit = async () => {
    setImportPending();
    DmsApi.ProjectService.ImportDBServicesOfProjectsV2({
      db_services: dbServices
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          showResult();
        }
      })
      .finally(() => {
        setImportDone();
        hideConnectErrorModal();
      });
  };
  const onCheckConnectableBeforeSubmit = async () => {
    await form.validateFields();
    await batchCheckConnectable(dbServices ?? []).then((res) => {
      if (res?.isConnectable) {
        onSubmit();
      } else {
        showConnectErrorModal();
      }
    });
  };
  const onUploadCustomRequest = useCallback<
    Required<UploadProps>['customRequest']
  >(
    (option) => {
      setDBservices([]);
      clearUploadCheckStatus();
      DmsApi.ProjectService.ImportDBServicesOfProjectsCheckV2(
        {
          db_services_file: option.file
        },
        {
          responseType: 'blob'
        }
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
          <BackButton icon={<LeftArrowOutlined />}>
            {t('dmsGlobalDataSource.backToList')}
          </BackButton>
        }
        extra={
          <EmptyBox if={!resultVisible}>
            <BasicButton
              type="primary"
              onClick={onCheckConnectableBeforeSubmit}
              loading={importLoading || batchCheckConnectableLoading}
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
          uploadCheckStatus={uploadCheckStatus}
          clearUploadCheckStatus={clearUploadCheckStatus}
        />
      </EmptyBox>
      <ConnectableErrorModal
        modalOpen={connectErrorModalVisible}
        closeModal={hideConnectErrorModal}
        onSubmit={onSubmit}
        loading={importLoading}
        connectErrorList={connectableInfo?.connectErrorList}
      />
    </>
  );
};
export default GlobalBatchImportDataSource;
