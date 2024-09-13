import { act, fireEvent, renderHook, screen } from '@testing-library/react';
import ExportRuleTemplate from '.';
import { superRender } from '../../../testUtils/customRender';
import { useForm } from 'antd/es/form/Form';

describe('test ExportRuleTemplate', () => {
  const onCloseSpy = jest.fn();
  const onSubmitSpy = jest.fn();

  const customRender = (open = true, submitPending = false) => {
    const { result } = renderHook(() => useForm());
    return superRender(
      <ExportRuleTemplate
        open={open}
        form={result.current[0]}
        onClose={onCloseSpy}
        onSubmit={onSubmitSpy}
        submitPending={submitPending}
      />
    );
  };
  it('should match snapshot', () => {
    expect(customRender().baseElement).toMatchSnapshot();
  });

  it('should call onClose prop function when the cancel button is clicked', () => {
    customRender();

    fireEvent.click(screen.getByText('取 消'));

    expect(onCloseSpy).toHaveBeenCalledTimes(1);
  });

  it('should disable the submit button when submitPending prop is true', () => {
    customRender(true, true);

    expect(screen.getByText('取 消').closest('button')).toBeDisabled();
    expect(screen.getByText('导 出').closest('button')).toBeDisabled();
  });

  it('should call onSubmit with the correct form values when the submit button is clicked', async () => {
    jest.useFakeTimers();
    customRender();

    fireEvent.click(screen.getByText('导 出'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(onSubmitSpy).toHaveBeenCalledTimes(1);
    expect(onSubmitSpy).toHaveBeenCalledWith({ exportFileType: 'csv' });

    fireEvent.click(screen.getByText('json'));

    fireEvent.click(screen.getByText('导 出'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(onSubmitSpy).toHaveBeenCalledTimes(2);
    expect(onSubmitSpy).toHaveBeenCalledWith({ exportFileType: 'json' });

    jest.useRealTimers();
  });
});
