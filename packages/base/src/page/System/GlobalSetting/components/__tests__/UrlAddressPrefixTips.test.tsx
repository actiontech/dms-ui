import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

import UrlAddressPrefixTips, {
  UrlAddressPrefixTipsProps
} from '../UrlAddressPrefixTips';

describe('base/System/GlobalSetting/UrlAddressPrefixTips', () => {
  const showFieldFn = jest.fn();
  const hideFieldFn = jest.fn();
  const submitGlobalConfigFn = jest.fn();

  const customRender = (
    params: Pick<UrlAddressPrefixTipsProps, 'url' | 'fieldVisible'>
  ) => {
    return superRender(
      <UrlAddressPrefixTips
        {...params}
        isAdmin
        showField={showFieldFn}
        hideField={hideFieldFn}
        submitGlobalConfig={submitGlobalConfigFn}
      />
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render snap when has url', () => {
    const { baseElement } = customRender({
      url: '1',
      fieldVisible: false
    });
    expect(screen.getByText('URL地址前缀')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when no url', () => {
    const { baseElement } = customRender({
      url: undefined,
      fieldVisible: false
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when field show', async () => {
    const { baseElement } = customRender({
      url: undefined,
      fieldVisible: true
    });
    expect(baseElement).toMatchSnapshot();

    const inputEle = getBySelector('#editInput', baseElement);
    fireEvent.change(inputEle, { target: { value: '123' } });
    await act(async () => jest.advanceTimersByTime(500));

    fireEvent.keyDown(inputEle, {
      key: 'Enter',
      keyCode: 13
    });
    await act(async () => jest.advanceTimersByTime(500));
    expect(submitGlobalConfigFn).toHaveBeenCalled();
  });
});
