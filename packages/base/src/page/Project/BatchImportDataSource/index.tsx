import {
  BasicButton,
  PageHeader,
  EmptyBox,
  BasicResult
} from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  IconLeftArrow,
  IconSuccessResult
} from '@actiontech/shared/lib/Icon/common';
import BatchImportDataSourceForm from './UploadForm';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { jsonParse } from '@actiontech/shared/lib/utils/Common';
import {
  ResponseCode,
  MIMETypeEnum,
  ResponseBlobJsonType
} from '@actiontech/shared/lib/enum';
import useBatchImportDataSource from './hooks/useBatchImportDataSource';
import { eventEmitter } from '@actiontech/shared/lib/utils/EventEmitter';
import EmitterKey from '@actiontech/shared/lib/data/EmitterKey';
import { isExportFileResponse } from '@actiontech/shared/lib/utils/Common';

const BatchImportDataSource = () => {
  const { t } = useTranslation();

  const {
    importLoading,
    setImportPending,
    setImportDone,
    resultVisible,
    showResult,
    form,
    resetAndHideResult
  } = useBatchImportDataSource();

  const onSubmit = async () => {
    const values = await form.validateFields();
    setImportPending();
    dms
      .ImportDBServicesOfProjects(
        {
          db_services_file: values.files[0]
        },
        { responseType: 'blob' }
      )
      .then((res) => {
        // 导入数据源 如果审核失败 会自动导出审核文件 所以这个接口当做导出文件类型处理 并且导出文件时 需要提供错误提示信息
        if (
          res.data instanceof Blob &&
          res.data.type === MIMETypeEnum.Application_Json
        ) {
          res.data.text().then((text) => {
            const json = jsonParse<ResponseBlobJsonType>(text);
            if (json.code === ResponseCode.SUCCESS) {
              showResult();
            }
          });
        } else if (isExportFileResponse(res)) {
          eventEmitter.emit(EmitterKey.OPEN_GLOBAL_NOTIFICATION, 'error', {
            message: t('common.request.noticeFailTitle'),
            description: t(
              'dmsProject.batchImportDataSource.requestAuditErrorMessage'
            )
          });
        }
      })
      .finally(() => {
        setImportDone();
      });
  };

  return (
    <>
      <PageHeader
        title={
          <Link to={`/project`}>
            <BasicButton icon={<IconLeftArrow />}>
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
            icon={<IconSuccessResult />}
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
        <BatchImportDataSourceForm form={form} />
      </EmptyBox>
    </>
  );
};

export default BatchImportDataSource;
