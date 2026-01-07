import { renderHook, act } from '@testing-library/react';
import { useExportFormatModal } from '../index';
import { GetAuditPlanSQLExportReqV1ExportFormatEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

describe('useExportFormatModal', () => {
  it('should initialize with default format', () => {
    const { result } = renderHook(() =>
      useExportFormatModal(GetAuditPlanSQLExportReqV1ExportFormatEnum.csv)
    );

    expect(result.current.exportFormatModalVisible).toBe(false);
    expect(result.current.selectedExportFormat).toBe(
      GetAuditPlanSQLExportReqV1ExportFormatEnum.csv
    );
  });

  it('should show and hide modal', () => {
    const { result } = renderHook(() =>
      useExportFormatModal(GetAuditPlanSQLExportReqV1ExportFormatEnum.csv)
    );

    act(() => {
      result.current.showExportFormatModal();
    });
    expect(result.current.exportFormatModalVisible).toBe(true);

    act(() => {
      result.current.hideExportFormatModal();
    });
    expect(result.current.exportFormatModalVisible).toBe(false);
  });

  it('should change selected format', () => {
    const { result } = renderHook(() =>
      useExportFormatModal(GetAuditPlanSQLExportReqV1ExportFormatEnum.csv)
    );

    act(() => {
      result.current.setSelectedExportFormat(
        GetAuditPlanSQLExportReqV1ExportFormatEnum.excel
      );
    });
    expect(result.current.selectedExportFormat).toBe(
      GetAuditPlanSQLExportReqV1ExportFormatEnum.excel
    );
  });

  it('should reset format to default', () => {
    const { result } = renderHook(() =>
      useExportFormatModal(GetAuditPlanSQLExportReqV1ExportFormatEnum.csv)
    );

    act(() => {
      result.current.setSelectedExportFormat(
        GetAuditPlanSQLExportReqV1ExportFormatEnum.excel
      );
    });
    expect(result.current.selectedExportFormat).toBe(
      GetAuditPlanSQLExportReqV1ExportFormatEnum.excel
    );

    act(() => {
      result.current.resetFormat();
    });
    expect(result.current.selectedExportFormat).toBe(
      GetAuditPlanSQLExportReqV1ExportFormatEnum.csv
    );
  });
});
