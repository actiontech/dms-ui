import { fireEvent, screen } from '@testing-library/dom';
import SubmitWorkflowButton from '..';
import { sqleSuperRender } from '../../../../../testUtils/superRender';

describe('test SubmitWorkflowButton', () => {
  it('handles button click', () => {
    const onClick = jest.fn();

    const { container } = sqleSuperRender(
      <SubmitWorkflowButton
        isConfirmationRequiredForSubmission={false}
        loading={false}
        onClick={onClick}
        hasExceptionAuditRule={false}
      />
    );
    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getByText('提交工单'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('displays the confirmation message when isConfirmationRequiredForSubmission is true', async () => {
    const onClick = jest.fn();

    sqleSuperRender(
      <SubmitWorkflowButton
        isConfirmationRequiredForSubmission
        submitWorkflowConfirmationMessage="Confirmation Message"
        loading={false}
        onClick={onClick}
        hasExceptionAuditRule={false}
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

    sqleSuperRender(
      <SubmitWorkflowButton
        isConfirmationRequiredForSubmission={false}
        loading={true}
        onClick={onClick}
        hasExceptionAuditRule={false}
      />
    );
    fireEvent.click(screen.getByText('提交工单'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('displays the confirm message when hasExceptionAuditRule is equal true', async () => {
    const onClick = jest.fn();

    sqleSuperRender(
      <SubmitWorkflowButton
        isConfirmationRequiredForSubmission
        submitWorkflowConfirmationMessage="Confirmation Message"
        loading={false}
        onClick={onClick}
        hasExceptionAuditRule
      />
    );
    fireEvent.click(screen.getByText('提交工单'));
    expect(onClick).not.toHaveBeenCalled();

    fireEvent.mouseOver(screen.getByText('提交工单'));

    await screen.findByText(
      '当前存在审核规则未被校验，请排除问题后重新触发审核'
    );

    fireEvent.click(screen.getByText('仍要创建'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
