import { fireEvent, screen } from '@testing-library/dom';
import SubmitWorkflowButton from '..';
import { superRender } from '../../../../../testUtils/customRender';
import { act } from '@testing-library/react';

describe('test SubmitWorkflowButton', () => {
  it('handles button click', () => {
    const onClick = jest.fn();

    const { container } = superRender(
      <SubmitWorkflowButton
        disabled={false}
        loading={false}
        onClick={onClick}
      />
    );
    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('提交工单'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('displays the tooltip when disabled', async () => {
    jest.useFakeTimers();
    const onClick = jest.fn();

    superRender(
      <SubmitWorkflowButton
        disabled
        disabledTips="Disabled Reason"
        loading={false}
        onClick={onClick}
      />
    );
    fireEvent.click(screen.getByText('提交工单'));
    expect(onClick).not.toHaveBeenCalled();

    await act(async () => {
      fireEvent.mouseOver(screen.getByText('提交工单'));
      await jest.advanceTimersByTime(300);
    });

    expect(screen.getByText('Disabled Reason')).toBeInTheDocument();

    jest.useRealTimers();
  });

  it('disables the button when loading prop is true', () => {
    const onClick = jest.fn();

    superRender(
      <SubmitWorkflowButton disabled={false} loading={true} onClick={onClick} />
    );
    fireEvent.click(screen.getByText('提交工单'));
    expect(onClick).not.toHaveBeenCalled();
  });
});
