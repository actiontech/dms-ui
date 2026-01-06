import { renderHook, act } from '@testing-library/react';
import { useExportFormatModal } from '../index';

describe('useExportFormatModal', () => {
  it('should initialize with default format', () => {
    const { result } = renderHook(() => useExportFormatModal('csv'));

    expect(result.current.exportFormatModalVisible).toBe(false);
    expect(result.current.selectedExportFormat).toBe('csv');
  });

  it('should show and hide modal', () => {
    const { result } = renderHook(() => useExportFormatModal('csv'));

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
      useExportFormatModal<'csv' | 'excel'>('csv')
    );

    act(() => {
      result.current.setSelectedExportFormat('excel');
    });
    expect(result.current.selectedExportFormat).toBe('excel');
  });

  it('should reset format to default', () => {
    const { result } = renderHook(() =>
      useExportFormatModal<'csv' | 'excel'>('csv')
    );

    act(() => {
      result.current.setSelectedExportFormat('excel');
    });
    expect(result.current.selectedExportFormat).toBe('excel');

    act(() => {
      result.current.resetFormat();
    });
    expect(result.current.selectedExportFormat).toBe('csv');
  });
});
