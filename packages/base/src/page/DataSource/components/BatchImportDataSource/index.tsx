import {
  BasicButton,
  PageHeader,
  EmptyBox,
  BasicResult,
  TypedLink
} from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import BatchImportDataSourceForm from '../../../Project/BatchImportDataSource/UploadForm';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import useBatchImportDataSource from '../../../Project/BatchImportDataSource/hooks/useBatchImportDataSource';
import { UploadProps } from 'antd';
import { useCallback } from 'react';
import { LeftArrowOutlined } from '@actiontech/icons';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import { DmsApi } from '@actiontech/shared/lib/api';
import ConnectableErrorModal from '../../../Project/BatchImportDataSource/ConnectableErrorModal';
import useBatchCheckConnectable from '../../../Project/BatchImportDataSource/hooks/useBatchCheckConnectable';

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
    DmsApi.DBServiceService.ImportDBServicesOfOneProjectV2({
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
      DmsApi.DBServiceService.ImportDBServicesOfOneProjectCheckV2(
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
              onClick={onCheckConnectableBeforeSubmit}
              loading={importLoading || batchCheckConnectableLoading}
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

export default BatchImportDataSource;
