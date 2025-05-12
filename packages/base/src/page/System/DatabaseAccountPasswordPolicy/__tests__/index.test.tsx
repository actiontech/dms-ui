import { cleanup, act, fireEvent, screen } from '@testing-library/react';
import { superRender } from '../../../../testUtils/customRender';
import DatabaseAccountPasswordPolicy from '../index';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import customDBPasswordRule from 'provision/src/testUtil/mockApi/customDBPasswordRule';

describe('base/System/DatabaseAccountPasswordPolicy', () => {
  let getCustomDBPasswordRuleSpy: jest.SpyInstance;
  let updateCustomDBPasswordRuleSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    getCustomDBPasswordRuleSpy =
      customDBPasswordRule.authGetCustomDBPasswordRule();
    updateCustomDBPasswordRuleSpy =
      customDBPasswordRule.authUpdateCustomDBPasswordRule();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  const customRender = () => {
    return superRender(<DatabaseAccountPasswordPolicy />);
  };

  it('renders initial state correctly', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(getCustomDBPasswordRuleSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();

    expect(screen.getByText(/≥ 16 位/)).toBeInTheDocument();
    expect(screen.getByText('包含大写字母')).toBeInTheDocument();
    expect(screen.getByText('包含小写字母')).toBeInTheDocument();
    expect(screen.getByText('包含数字')).toBeInTheDocument();
    expect(screen.getByText('包含特殊字符')).toBeInTheDocument();
  });

  it('switches to edit mode when edit button is clicked', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3000));

    const editButton = screen.getByText('编 辑');
    fireEvent.click(editButton);
    await act(async () => jest.advanceTimersByTime(500));

    expect(baseElement).toMatchSnapshot();

    const minLengthInput = getBySelector('#minLength', baseElement);
    expect(minLengthInput).toBeInTheDocument();
    expect(minLengthInput).toHaveValue('16');

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBe(4);
    checkboxes.forEach((checkbox) => {
      expect(checkbox).toBeChecked();
    });
  });

  it('submits form with updated values', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3000));

    const editButton = screen.getByText('编 辑');
    fireEvent.click(editButton);
    await act(async () => jest.advanceTimersByTime(500));

    const minLengthInput = getBySelector('#minLength', baseElement);
    fireEvent.change(minLengthInput, { target: { value: 12 } });

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[3]);

    const submitButton = screen.getByText('提 交');
    fireEvent.click(submitButton);
    await act(async () => jest.advanceTimersByTime(500));

    expect(updateCustomDBPasswordRuleSpy).toHaveBeenCalledTimes(1);
    expect(updateCustomDBPasswordRuleSpy).toHaveBeenCalledWith({
      update_custom_db_password_rule: {
        min_length: 12,
        require_uppercase: true,
        require_lowercase: true,
        require_digit: true,
        require_special: false
      }
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(getCustomDBPasswordRuleSpy).toHaveBeenCalledTimes(2);
  });

  it('cancels editing and resets form', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3000));

    const editButton = screen.getByText('编 辑');
    fireEvent.click(editButton);
    await act(async () => jest.advanceTimersByTime(500));

    const minLengthInput = getBySelector('#minLength', baseElement);
    fireEvent.change(minLengthInput, { target: { value: 10 } });

    const cancelButton = screen.getByText('取 消');
    fireEvent.click(cancelButton);
    await act(async () => jest.advanceTimersByTime(500));

    expect(screen.getByText(/≥ 16 位/)).toBeInTheDocument();
    expect(updateCustomDBPasswordRuleSpy).not.toHaveBeenCalled();
  });

  it('shows error when minLength is less than 8', async () => {
    const rejectSpy = jest.spyOn(Promise, 'reject').mockImplementation(() => {
      return Promise.resolve();
    });
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3000));

    const editButton = screen.getByText('编 辑');
    fireEvent.click(editButton);
    await act(async () => jest.advanceTimersByTime(100));

    const minLengthInput = getBySelector('#minLength', baseElement);
    fireEvent.change(minLengthInput, { target: { value: 7 } });

    await act(async () => jest.advanceTimersByTime(0));
    expect(rejectSpy).toHaveBeenCalledTimes(1);
    expect(rejectSpy).toHaveBeenCalledWith(new Error('最小长度不能小于8'));
  });
});
