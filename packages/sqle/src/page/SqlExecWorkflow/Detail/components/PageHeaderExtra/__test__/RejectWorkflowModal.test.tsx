import RejectWorkflowModal from '../RejectWorkflowModal';
import { fireEvent, act, cleanup, screen } from '@testing-library/react';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { RejectWorkflowModalProps } from '../RejectWorkflowModal/index.type';
import { sqleSuperRender } from '../../../../../../testUtils/superRender';

describe('sqle/ExecWorkflow/Detail/RejectWorkflowModal', () => {
  const rejectFn = jest.fn();
  const closeFn = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  const customRender = (
    params?: Pick<RejectWorkflowModalProps, 'open' | 'loading'>
  ) => {
    return sqleSuperRender(
      <RejectWorkflowModal
        open={params?.open || false}
        loading={params?.loading || false}
        reject={rejectFn}
        close={closeFn}
      />
    );
  };

  it('render snap when open is false', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when open & loading', () => {
    const { baseElement } = customRender({
      open: true,
      loading: true
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when open & click btn', async () => {
    const { baseElement } = customRender({
      open: true,
      loading: false
    });

    expect(screen.getByText('驳回')).toBeInTheDocument();
    expect(screen.getByText('取 消')).toBeInTheDocument();

    const reasonInput = getBySelector('#reason', baseElement);
    fireEvent.change(reasonInput, {
      target: {
        value: 'this a reject value'
      }
    });
    await act(async () => jest.advanceTimersByTime(500));
    fireEvent.click(screen.getByText('驳回'));
    await act(async () => jest.advanceTimersByTime(500));

    fireEvent.click(screen.getByText('取 消'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(closeFn).toHaveBeenCalled();
  });
});
