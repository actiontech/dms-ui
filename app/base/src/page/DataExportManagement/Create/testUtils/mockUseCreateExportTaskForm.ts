import * as useCreateExportTaskForm from '../hooks/useCreateExportTaskForm';

export const mockUseCreateExportTaskFormReturn = {
  baseForm: null as any,
  sourceForm: null as any,
  methodForm: null as any,
  auditLoading: false,
  formatSQLAction: jest.fn(),
  auditAction: jest.fn(),
  resetAllForms: jest.fn(),
  formatted: false
};

export const mockUseCreateExportTaskForm = (
  data?: Partial<typeof mockUseCreateExportTaskFormReturn>
) => {
  const spy = jest.spyOn(useCreateExportTaskForm, 'default');
  spy.mockImplementation(() => ({
    ...mockUseCreateExportTaskFormReturn,
    ...data
  }));
  return spy;
};
