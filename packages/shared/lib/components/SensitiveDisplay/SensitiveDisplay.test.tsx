import { superRender } from '../../testUtil/customRender';
import { getBySelector } from '../../testUtil/customQuery';
import SensitiveDisplay from './SensitiveDisplay';
import { fireEvent, screen, cleanup, act } from '@testing-library/react';

describe('lib/SensitiveDisplay', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = (text: string) => {
    return superRender(<SensitiveDisplay text={text} />);
  };

  it('render hide token', async () => {
    const { baseElement } = customRender('test token text');
    fireEvent.mouseEnter(getBySelector('.rect-border-wrapper', baseElement));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('已加密，单击查看详情，再次单击隐藏'));
    expect(baseElement).toMatchSnapshot();
  });

  it('render show token', async () => {
    const { baseElement } = customRender('test token text');
    const tokenWrap = getBySelector('.rect-border-wrapper', baseElement);
    fireEvent.click(tokenWrap);
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('test token text')).toBeInTheDocument();
    fireEvent.mouseEnter(tokenWrap);
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('再次单击隐藏'));
    expect(baseElement).toMatchSnapshot();
  });

  it('render copy token', async () => {
    const jsdomPrompt = window.prompt;
    window.prompt = () => null;
    const { baseElement } = customRender('test token text');
    await act(async () => {
      await fireEvent.click(getBySelector('.ant-typography-copy', baseElement));
      await jest.advanceTimersByTime(100);
    });
    expect(
      getBySelector('.ant-typography-copy-success', baseElement)
    ).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    window.prompt = jsdomPrompt;
  });
});
