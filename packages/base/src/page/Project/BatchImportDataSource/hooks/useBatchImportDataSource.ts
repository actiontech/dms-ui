import { useBoolean } from 'ahooks';
import { Form } from 'antd';
import {
  BatchImportDataSourceFormValueType,
  FileUploadCheckStatusType
} from '../index.type';
import { ResponseCode } from '@actiontech/dms-kit';
import { jsonParse } from '@actiontech/dms-kit';
import { MIMETypeEnum, ResponseBlobJsonType } from '@actiontech/dms-kit';
import { isExportFileResponse } from '@actiontech/dms-kit';
import { AxiosResponse } from 'axios';
import { useTranslation } from 'react-i18next';
import { IImportDBServiceV2 } from '@actiontech/shared/lib/api/base/service/common';
import { useState, useCallback } from 'react';

const useBatchImportDataSource = <T extends IImportDBServiceV2>() => {
  const { t } = useTranslation();

  const [dbServices, setDBservices] = useState<T[]>();

  const [
    importLoading,
    { setTrue: setImportPending, setFalse: setImportDone }
  ] = useBoolean();

  const [resultVisible, { setTrue: showResult, setFalse: hideResult }] =
    useBoolean(false);

  const [uploadCheckStatus, setUploadCheckStatus] =
    useState<FileUploadCheckStatusType>({
      success: false
    });

  const [form] = Form.useForm<BatchImportDataSourceFormValueType>();

  const resetAndHideResult = () => {
    form.resetFields();
    clearUploadCheckStatus();
    hideResult();
    setDBservices([]);
  };

  const importServicesCheck = useCallback(
    (res: AxiosResponse<unknown>) => {
      if (
        res.data instanceof Blob &&
        res.data.type === MIMETypeEnum.Application_Json
      ) {
        res.data.text().then((text) => {
          const json = jsonParse<ResponseBlobJsonType & { data: T[] }>(text);
          if (json.code === ResponseCode.SUCCESS) {
            setDBservices(json.data);
            setUploadCheckStatus({
              success: true
            });
          } else {
            setUploadCheckStatus({
              success: false,
              errorMessage: json.message
            });
          }
        });
      } else if (isExportFileResponse(res)) {
        setUploadCheckStatus({
          success: false,
          errorMessage: t(
            'dmsProject.batchImportDataSource.requestAuditErrorMessage'
          )
        });
      }
    },
    [t]
  );

  const clearUploadCheckStatus = useCallback(() => {
    setUploadCheckStatus({
      success: false
    });
  }, []);

  return {
    importLoading,
    setImportPending,
    setImportDone,
    resultVisible,
    showResult,
    hideResult,
    form,
    resetAndHideResult,
    dbServices,
    importServicesCheck,
    setDBservices,
    uploadCheckStatus,
    setUploadCheckStatus,
    clearUploadCheckStatus
  };
};

export default useBatchImportDataSource;
