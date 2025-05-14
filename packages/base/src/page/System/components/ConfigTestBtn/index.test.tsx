import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import ConfigTestBtn from '.';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('base/System/components/ConfigTestBtn', () => {
  const onPopoverOpenChangeFn = jest.fn();
  const testingRef = jest.fn();

  const customRender = (popoverOpen = false) => {
    return superRender(
      <ConfigTestBtn
        popoverOpen={popoverOpen}
        onPopoverOpenChange={onPopoverOpenChangeFn}
        popoverForm={<span>popoverForm</span>}
        testingRef={testingRef()}
      />
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
    testingRef.mockImplementation(() => ({ current: false }));
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render snap when btn is default', () => {
    const { baseElement } = customRender(false);
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when btn is loading', () => {
    testingRef.mockImplementation(() => ({ current: true }));
    const { baseElement } = customRender(false);
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when btn hover', async () => {
    const { baseElement } = customRender(false);

    const btnEle = getBySelector('.system-config-button');
    fireEvent.mouseOver(btnEle);
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when Popover cont show', async () => {
    const { baseElement } = customRender(true);
    expect(baseElement).toMatchSnapshot();
  });
});
