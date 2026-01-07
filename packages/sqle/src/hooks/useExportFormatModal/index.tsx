import { useState } from 'react';
import { useBoolean } from 'ahooks';
import { GetAuditPlanSQLExportReqV1ExportFormatEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

export const useExportFormatModal = (
  defaultFormat: GetAuditPlanSQLExportReqV1ExportFormatEnum
) => {
  const [
    exportFormatModalVisible,
    { setTrue: showExportFormatModal, setFalse: hideExportFormatModal }
  ] = useBoolean(false);
  const [selectedExportFormat, setSelectedExportFormat] =
    useState<GetAuditPlanSQLExportReqV1ExportFormatEnum>(defaultFormat);

  const resetFormat = () => {
    setSelectedExportFormat(defaultFormat);
  };

  return {
    exportFormatModalVisible,
    showExportFormatModal,
    hideExportFormatModal,
    selectedExportFormat,
    setSelectedExportFormat,
    resetFormat
  };
};
