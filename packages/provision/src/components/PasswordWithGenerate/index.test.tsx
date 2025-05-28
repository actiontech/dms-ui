import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import InputPassword from '.';
import { act, fireEvent, screen } from '@testing-library/react';
import {
  getBySelector,
  queryBySelector
} from '@actiontech/shared/lib/testUtil';

describe('InputPassword', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should Match Snapshot', () => {
    const generateFn = jest.fn();
    const { baseElement } = superRender(
      <InputPassword clickGeneratePassword={generateFn} />
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('should generate password when user click generate button', async () => {
    const generateFn = jest.fn().mockReturnValue('123');
    document.execCommand = jest.fn();
    superRender(<InputPassword clickGeneratePassword={generateFn} />);
    fireEvent.click(getBySelector('.ant-btn'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(generateFn).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(0));
    expect(
      screen.queryByText('已生成16位密码并复制在剪贴板中')
    ).toBeInTheDocument();
  });

  it('should generate password when minLength is not undefined', async () => {
    const generateFn = jest.fn().mockReturnValue('123');
    document.execCommand = jest.fn();
    superRender(
      <InputPassword clickGeneratePassword={generateFn} minLength={12} />
    );
    fireEvent.click(getBySelector('.ant-btn'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(generateFn).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(0));
    expect(
      screen.queryByText('已生成12位密码并复制在剪贴板中')
    ).toBeInTheDocument();
  });

  it('should display password when user click EyeInvisibleOutlined icon', async () => {
    const generateFn = jest.fn().mockReturnValue('123');
    const { baseElement } = superRender(
      <InputPassword clickGeneratePassword={generateFn} />
    );

    await act(() => fireEvent.click(getBySelector('.anticon-eye-invisible')));
    expect(queryBySelector('.anticon-eye-invisible')).toBeNull();
    expect(queryBySelector('.anticon-eye')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    await act(() => fireEvent.click(getBySelector('.anticon-eye')));
    expect(baseElement).toMatchSnapshot();
  });
});
