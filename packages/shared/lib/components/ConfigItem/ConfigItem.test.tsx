import { fireEvent, act, cleanup } from '@testing-library/react';
import { renderWithTheme } from '../../testUtil/customRender';

import { ConfigItemProps } from './index.type';
import ConfigItem from './ConfigItem';
import { getBySelector } from '../../testUtil/customQuery';

describe('lib/ConfigItem', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });

  const customRender = (params: ConfigItemProps) => {
    return renderWithTheme(<ConfigItem {...params} />);
  };

  it('only render input no desc', () => {
    const { baseElement } = customRender({
      label: 'label',
      descNode: ''
    });
    expect(baseElement).toMatchSnapshot();

    const { baseElement: baseElement1 } = customRender({
      label: 'label',
      fieldVisible: false
    });
    expect(baseElement1).toMatchSnapshot();
  });

  it('only render desc no button', () => {
    const { baseElement } = customRender({
      label: 'label',
      descNode: 'descNode',
      needEditButton: false
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render button when mouse move', async () => {
    const { baseElement } = customRender({
      label: 'label',
      descNode: 'descNode'
    });
    const configItemWrapper = getBySelector(
      '.ant-row,.ant-row-space-between.ant-row-middle',
      baseElement
    );
    await act(async () => {
      fireEvent.mouseEnter(configItemWrapper);
      await jest.advanceTimersByTime(300);
    });
    expect(baseElement).toMatchSnapshot();
    await act(async () => {
      fireEvent.mouseLeave(configItemWrapper);
      await jest.advanceTimersByTime(300);
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render show field', async () => {
    const showFieldFn = jest.fn();
    const { baseElement } = customRender({
      label: 'label',
      descNode: 'descNode',
      showField: showFieldFn
    });
    const configItemWrapper = getBySelector(
      '.ant-row,.ant-row-space-between.ant-row-middle',
      baseElement
    );
    await act(async () => {
      fireEvent.mouseEnter(configItemWrapper);
      await jest.advanceTimersByTime(300);
    });
    const btnEle = getBySelector('.config-item-filed-edit-button', baseElement);
    await act(async () => {
      fireEvent.click(btnEle);
      await jest.advanceTimersByTime(300);
    });
    expect(showFieldFn).toBeCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
  });
});