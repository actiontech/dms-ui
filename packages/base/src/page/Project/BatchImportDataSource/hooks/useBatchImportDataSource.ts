import { useBoolean } from 'ahooks';
import { Form } from 'antd';
import { BatchImportDataSourceFormValueType } from '../index.type';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { jsonParse } from '@actiontech/shared/lib/utils/Common';
import {
  MIMETypeEnum,
  ResponseBlobJsonType
} from '@actiontech/shared/lib/enum';
import { eventEmitter } from '@actiontech/shared/lib/utils/EventEmitter';
import EmitterKey from '@actiontech/shared/lib/data/EmitterKey';
import { isExportFileResponse } from '@actiontech/shared/lib/utils/Common';
import { AxiosResponse } from 'axios';
import { useTranslation } from 'react-i18next';
import { IDBService } from '@actiontech/shared/lib/api/base/service/common';
import { useState, useCallback } from 'react';

const useBatchImportDataSource = () => {
  const { t } = useTranslation();

  const [dbServices, setDBservices] = useState<IDBService[]>();

  const [
    importLoading,
    { setTrue: setImportPending, setFalse: setImportDone }
  ] = useBoolean();

  const [resultVisible, { setTrue: showResult, setFalse: hideResult }] =
    useBoolean(false);

  const [form] = Form.useForm<BatchImportDataSourceFormValueType>();

  const resetAndHideResult = () => {
    form.resetFields();
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
          const json = jsonParse<ResponseBlobJsonType & { data: IDBService[] }>(
            text
          );
          if (json.code === ResponseCode.SUCCESS) {
            setDBservices(json.data);
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
    },
    [t]
  );

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
    setDBservices
  };
};

export default useBatchImportDataSource;
