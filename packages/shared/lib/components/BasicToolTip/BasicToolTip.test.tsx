import { getBySelector } from '../../testUtil/customQuery';
import { renderWithTheme } from '../../testUtil/customRender';
import { fireEvent, act, cleanup } from '@testing-library/react';
import { BasicTooltipProps } from './BasicToolTip.types';
import BasicToolTip from './BasicToolTip';

describe('lib/BasicToolTip', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    cleanup();
  });
  const customRender = (params: BasicTooltipProps) => {
    return renderWithTheme(<BasicToolTip {...params} />);
  };

  it('render custom class name', async () => {
    const { baseElement } = customRender({
      children: <span className="custom-children-name">tool tip</span>,
      className: 'custom-tool-tip-name',
      title: 'this is a tip'
    });
    await act(async () => {
      fireEvent.mouseOver(getBySelector('.custom-children-name', baseElement));
      await jest.advanceTimersByTime(300);
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render icon for tool', async () => {
    const { baseElement } = customRender({
      prefixIcon: true,
      title: 'this is a tip',
      titleWidth: 300,
      suffixIcon: false,
      children: <span className="custom-children-name">tool tip</span>
    });
    await act(async () => {
      fireEvent.mouseOver(getBySelector('.custom-children-name', baseElement));
      await jest.advanceTimersByTime(300);
    });
    expect(baseElement).toMatchSnapshot();
  });
});
