import * as useExportDetailAction from '../hooks/useExportDetailAction';

export const mockExportDetailActionData = {
  refreshWorkflow: jest.fn(),
  closeWorkflowLoading: false,
  closeWorkflow: jest.fn(),
  approveWorkflowLoading: false,
  approveWorkflow: jest.fn(),
  executeExportLoading: false,
  executeExport: jest.fn()
};

export const mockUseExportDetailAction = (
  data?: Partial<typeof mockExportDetailActionData>
) => {
  const spy = jest.spyOn(useExportDetailAction, 'default');
  spy.mockImplementation(() => ({ ...mockExportDetailActionData, ...data }));
  return spy;
};
