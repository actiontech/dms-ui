import { screen, fireEvent, act } from '@testing-library/react';
import VerificationCodeInput from '../VerificationCodeInput';
import { superRender } from '../../../testUtil/customRender';

describe('VerificationCodeInput', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders correctly with default props', () => {
    const { baseElement } = superRender(<VerificationCodeInput />);

    expect(screen.getByPlaceholderText('请输入验证码')).toBeInTheDocument();
    expect(screen.getByText('发送验证码')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('calls onSendCode when button is clicked', async () => {
    const onSendCode = jest.fn().mockResolvedValue('test');

    superRender(<VerificationCodeInput onSendCode={onSendCode} />);

    fireEvent.click(screen.getByText('发送验证码'));
    await act(async () => jest.advanceTimersByTime(1000));
    expect(onSendCode).toHaveBeenCalledTimes(1);
  });

  it('shows countdown after clicking send button', async () => {
    const onSendCode = jest.fn().mockResolvedValue('test');

    superRender(
      <VerificationCodeInput onSendCode={onSendCode} interval={60} />
    );

    fireEvent.click(screen.getByText('发送验证码'));
    await act(async () => jest.advanceTimersByTime(1000));

    // Initial state after click
    expect(screen.getByText('60秒后重试')).toBeInTheDocument();

    // After 1 second
    await act(async () => jest.advanceTimersByTime(1000));
    expect(screen.getByText('59秒后重试')).toBeInTheDocument();

    // After 59 more seconds
    await act(async () => jest.advanceTimersByTime(59000));
    expect(screen.getByText('发送验证码')).toBeInTheDocument();
  });

  it('disables button during countdown', async () => {
    const onSendCode = jest.fn().mockResolvedValue('test');
    superRender(<VerificationCodeInput onSendCode={onSendCode} />);

    const button = screen.getByText('发送验证码').closest('button')!;
    expect(button).not.toBeDisabled();

    fireEvent.click(button);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(button).toBeDisabled();

    // After countdown completes
    await act(async () => jest.advanceTimersByTime(60000));
    expect(button).not.toBeDisabled();
  });

  it('accepts and passes through additional input props', () => {
    superRender(
      <VerificationCodeInput
        className="custom-class"
        data-testid="verification-input"
      />
    );

    const input = screen.getByTestId('verification-input');
    expect(input).toHaveClass('custom-class');
  });
});
