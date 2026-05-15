import * as useActionButtonState from '../components/PageHeaderAction/useActionButtonState';

export const mockActionButtonStateData = {
  closeWorkflowButtonMeta: {
    action: jest.fn(),
    loading: false,
    hidden: false,
    disabled: false
  },
  approveWorkflowButtonMeta: {
    action: jest.fn(),
    loading: false,
    hidden: false,
    disabled: false
  },
  rejectWorkflowButtonMeta: {
    action: jest.fn(),
    loading: false,
    hidden: false,
    disabled: false
  },
  executeExportButtonMeta: {
    action: jest.fn(),
    loading: false,
    hidden: false,
    disabled: false
  }
};

export const mockUseActionButtonState = (
  data?: Partial<typeof mockActionButtonStateData>
) => {
  const spy = jest.spyOn(useActionButtonState, 'default');
  spy.mockImplementation(() => ({ ...mockActionButtonStateData, ...data }));
  return spy;
};
