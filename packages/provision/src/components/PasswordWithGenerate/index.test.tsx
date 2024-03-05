import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import InputPassword from '.';
import { act, fireEvent, screen } from '@testing-library/react';
import { getBySelector, queryBySelector, sleep } from '~/testUtil/customQuery';

describe.skip('InputPassword', () => {
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
    await act(() => fireEvent.click(screen.getByText('生 成')));
    expect(generateFn).toHaveBeenCalledTimes(1);
    await sleep(300);
    expect(
      screen.queryByText('已生成16位密码并复制在剪贴板中')
    ).toBeInTheDocument();

    await act(() => fireEvent.mouseOver(getBySelector('.ant-input')));
    await sleep(100);
    const hiddenClassName = screen
      .queryByText('已生成16位密码并复制在剪贴板中')
      ?.parentElement?.parentElement?.getAttribute('class');

    expect(hiddenClassName).toBe('ant-tooltip ant-tooltip-hidden');
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
