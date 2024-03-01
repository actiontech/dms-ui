import { act, renderHook } from '@testing-library/react-hooks';
import useSqlReviewTemplateToggle from '.';
import { Form } from 'antd';

jest.mock('antd', () => {
  const actualAntd = jest.requireActual('antd');
  return {
    ...actualAntd,
    Form: {
      ...actualAntd.Form,
      useForm: jest.fn(),
      useWatch: jest.fn()
    }
  };
});

describe('test base/hooks/useSqlReviewTemplateToggle', () => {
  const mockSetFieldsForm = jest.fn();

  const customRenderHook = () => {
    const mockedForm = {
      setFieldsValue: mockSetFieldsForm
    };
    (Form.useForm as jest.Mock).mockReturnValue([mockedForm]);
    (Form.useWatch as jest.Mock).mockReturnValue(false);

    return renderHook(() => useSqlReviewTemplateToggle(mockedForm as any));
  };

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('match default value', async () => {
    const { result } = customRenderHook();
    expect(result.current.auditRequired).toBeFalsy();
    expect(result.current.auditRequiredPopupVisible).toBeFalsy();
  });

  it('execute changeAuditRequired', async () => {
    const { result } = customRenderHook();

    await act(() => {
      result.current.changeAuditRequired(false);
    });
    expect(mockSetFieldsForm).not.toHaveBeenCalled();

    await act(() => {
      result.current.changeAuditRequired(true);
    });

    expect(mockSetFieldsForm).toHaveBeenCalledTimes(1);
    expect(mockSetFieldsForm).toHaveBeenCalledWith({
      needSqlAuditService: true
    });
  });

  it('execute clearRuleTemplate', async () => {
    const { result } = customRenderHook();

    await act(() => {
      result.current.clearRuleTemplate();
    });
    expect(mockSetFieldsForm).toHaveBeenCalledTimes(1);

    expect(mockSetFieldsForm).toHaveBeenCalledWith({
      needSqlAuditService: false,
      ruleTemplateId: undefined,
      ruleTemplateName: undefined
    });
  });

  it('execute onAuditRequiredPopupOpenChange', async () => {
    const { result, rerender } = customRenderHook();

    await act(() => {
      result.current.onAuditRequiredPopupOpenChange(true);
    });
    expect(result.current.auditRequiredPopupVisible).toBeFalsy();

    (Form.useWatch as jest.Mock).mockReturnValue(true);

    rerender();

    await act(() => {
      result.current.onAuditRequiredPopupOpenChange(true);
    });
    expect(result.current.auditRequiredPopupVisible).toBeTruthy();
  });
});
