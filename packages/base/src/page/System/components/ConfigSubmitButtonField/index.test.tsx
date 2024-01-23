import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import { renderWithTheme } from '@actiontech/shared/lib/testUtil/customRender';

import ConfigSubmitButtonField from '.';

describe('base/System/components/ConfigSubmitButtonField', () => {
  const handleClickCancelFn = jest.fn();
  const customRender = (submitLoading: boolean) => {
    return renderWithTheme(
      <ConfigSubmitButtonField
        submitLoading={submitLoading}
        handleClickCancel={handleClickCancelFn}
      />
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render snap when submit is true', () => {
    const { baseElement } = customRender(true);
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when submit is false', () => {
    const { baseElement } = customRender(false);
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when click cancel', async () => {
    customRender(false);

    expect(screen.getByText('取 消')).toBeInTheDocument();
    fireEvent.click(screen.getByText('取 消'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(handleClickCancelFn).toBeCalled();
  });
});
