import * as useActionButtonState from '../components/PageHeaderAction/useActionButtonState';

export const mockActionButtonStateData = {
  closeWorkflowButtonMeta: {
    action: jest.fn(),
    loading: false,
    hidden: false
  },
  approveWorkflowButtonMeta: {
    action: jest.fn(),
    loading: false,
    hidden: false
  },
  rejectWorkflowButtonMeta: {
    action: jest.fn(),
    loading: false,
    hidden: false
  },
  executeExportButtonMeta: {
    action: jest.fn(),
    loading: false,
    hidden: false
  }
};

export const mockUseActionButtonState = (
  data?: Partial<typeof mockActionButtonStateData>
) => {
  const spy = jest.spyOn(useActionButtonState, 'default');
  spy.mockImplementation(() => ({ ...mockActionButtonStateData, ...data }));
  return spy;
};
