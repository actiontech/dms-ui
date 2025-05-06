import { cleanup, fireEvent, act } from '@testing-library/react';
import ConfigTestBtn from '.';
import { superRender } from '../../../../testUtil/customRender';
import { getBySelector } from '../../../../testUtil/customQuery';

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
});
