import { fireEvent, screen } from '@testing-library/dom';
import SubmitWorkflowButton from '..';
import { superRender } from '../../../../../testUtils/customRender';

describe('test SubmitWorkflowButton', () => {
  it('handles button click', () => {
    const onClick = jest.fn();

    const { container } = superRender(
      <SubmitWorkflowButton
        isConfirmationRequiredForSubmission={false}
        loading={false}
        onClick={onClick}
      />
    );
    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('提交工单'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('displays the confirmation message when isConfirmationRequiredForSubmission is true', async () => {
    const onClick = jest.fn();

    superRender(
      <SubmitWorkflowButton
        isConfirmationRequiredForSubmission
        submitWorkflowConfirmationMessage="Confirmation Message"
        loading={false}
        onClick={onClick}
      />
    );
    fireEvent.click(screen.getByText('提交工单'));
    expect(onClick).not.toHaveBeenCalled();

    await screen.findByText('Confirmation Message');

    expect(screen.getByText('仍要创建')).toBeInTheDocument();
    fireEvent.click(screen.getByText('仍要创建'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('disables the button when loading prop is true', () => {
    const onClick = jest.fn();

    superRender(
      <SubmitWorkflowButton
        isConfirmationRequiredForSubmission={false}
        loading={true}
        onClick={onClick}
      />
    );
    fireEvent.click(screen.getByText('提交工单'));
    expect(onClick).not.toHaveBeenCalled();
  });
});
