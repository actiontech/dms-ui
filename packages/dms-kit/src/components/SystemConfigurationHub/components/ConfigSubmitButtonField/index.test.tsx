import { cleanup, fireEvent, act, screen } from '@testing-library/react';
import ConfigSubmitButtonField from '.';
import { superRender } from '../../../../testUtil/superRender';

describe('base/System/components/ConfigSubmitButtonField', () => {
  const handleClickCancelFn = jest.fn();
  const customRender = (submitLoading: boolean) => {
    return superRender(
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
    customRender(true);

    expect(screen.getByText('取 消').closest('button')).toBeDisabled();
    expect(screen.getByText('提 交').closest('button')).toBeDisabled();
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
    expect(handleClickCancelFn).toHaveBeenCalled();
  });
});
