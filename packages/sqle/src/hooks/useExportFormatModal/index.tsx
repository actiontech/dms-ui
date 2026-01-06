import { useState } from 'react';
import { useBoolean } from 'ahooks';

export const useExportFormatModal = <T extends 'csv' | 'excel'>(
  defaultFormat: T
) => {
  const [
    exportFormatModalVisible,
    { setTrue: showExportFormatModal, setFalse: hideExportFormatModal }
  ] = useBoolean(false);
  const [selectedExportFormat, setSelectedExportFormat] =
    useState<T>(defaultFormat);

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
