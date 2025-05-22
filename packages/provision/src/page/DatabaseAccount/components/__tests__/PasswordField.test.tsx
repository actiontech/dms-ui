import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { act, fireEvent, screen, cleanup } from '@testing-library/react';
import { Form } from 'antd';
import PasswordField from '../PasswordField';
import customDBPasswordRule from '../../../../testUtil/mockApi/customDBPasswordRule';
import { mockGeneratedDBPasswordByCustomRule } from '../../../../testUtil/mockApi/customDBPasswordRule/data';
import Password from '../../../../utils/Password';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('DatabaseAccount/components/PasswordField', () => {
  const mockForm = {
    setFieldsValue: jest.fn(),
    resetFields: jest.fn(),
    validateFields: jest.fn()
  };

  beforeEach(() => {
    jest.useFakeTimers();
    customDBPasswordRule.mockAllApi();
    jest.spyOn(Form, 'useFormInstance').mockReturnValue(mockForm as any);
    jest.spyOn(Form, 'useWatch').mockReturnValue('');
    jest
      .spyOn(Password, 'generateDBPasswordByCustomCharType')
      .mockReturnValue(mockGeneratedDBPasswordByCustomRule);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    cleanup();
  });

  const customRender = (disabled?: boolean, showLabelTips?: boolean) => {
    return superRender(
      <Form>
        <PasswordField disabled={disabled} showLabelTips={showLabelTips} />
      </Form>
    );
  };

  it('renders password field component correctly', async () => {
    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('连接密码')).toBeInTheDocument();
    expect(screen.getByText('确认连接密码')).toBeInTheDocument();
    expect(screen.getByText('生 成')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('renders without label tips when showLabelTips is false', async () => {
    const { baseElement } = customRender(false, false);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('连接密码')).toBeInTheDocument();
    expect(screen.getByText('确认连接密码')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('should be disabled when disabled prop is true', async () => {
    customRender(true);

    await act(async () => jest.advanceTimersByTime(3000));

    const passwordInput = getBySelector('#password');
    const confirmPasswordInput = getBySelector('#confirm_password');

    expect(passwordInput).toBeDisabled();
    expect(confirmPasswordInput).toBeDisabled();
    expect(screen.getByText('生 成').closest('button')).toBeDisabled();
  });

  it('generates password and fills both fields when clicking generate button', async () => {
    document.execCommand = jest.fn();
    customRender();

    await act(async () => jest.advanceTimersByTime(3000));

    const generateButton = screen.getByText('生 成');
    fireEvent.click(generateButton);

    expect(Password.generateDBPasswordByCustomCharType).toHaveBeenCalled();
    expect(mockForm.setFieldsValue).toHaveBeenCalledWith({
      password: mockGeneratedDBPasswordByCustomRule,
      confirm_password: mockGeneratedDBPasswordByCustomRule
    });
  });

  it('displays password validation rules and updates status based on input', async () => {
    jest.spyOn(Form, 'useWatch').mockReturnValue('Abc123!@#');

    const { baseElement } = customRender();

    await act(async () => jest.advanceTimersByTime(3000));

    expect(baseElement).toMatchSnapshot();
  });
});
