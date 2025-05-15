import InstanceTasksStatus from '..';
import { GetWorkflowTasksItemV2StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { sqleSuperRender } from '../../../../../../../../testUtils/superRender';

describe('sqle/ExecWorkflow/AuditDetail/InstanceTasksStatus', () => {
  const customRender = (status?: GetWorkflowTasksItemV2StatusEnum) => {
    return sqleSuperRender(<InstanceTasksStatus status={status} />);
  };

  it('render snap when status is undefined', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when status is wait_for_audit', () => {
    const { baseElement } = customRender(
      GetWorkflowTasksItemV2StatusEnum.wait_for_audit
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when status is wait_for_execution', () => {
    const { baseElement } = customRender(
      GetWorkflowTasksItemV2StatusEnum.wait_for_execution
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when status is exec_scheduled', () => {
    const { baseElement } = customRender(
      GetWorkflowTasksItemV2StatusEnum.exec_scheduled
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when status is exec_succeeded', () => {
    const { baseElement } = customRender(
      GetWorkflowTasksItemV2StatusEnum.exec_succeeded
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when status is executing', () => {
    const { baseElement } = customRender(
      GetWorkflowTasksItemV2StatusEnum.executing
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when status is exec_failed', () => {
    const { baseElement } = customRender(
      GetWorkflowTasksItemV2StatusEnum.exec_failed
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when status is manually_executed', () => {
    const { baseElement } = customRender(
      GetWorkflowTasksItemV2StatusEnum.manually_executed
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when status is terminate_failed', () => {
    const { baseElement } = customRender(
      GetWorkflowTasksItemV2StatusEnum.terminate_failed
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when status is terminate_succeeded', () => {
    const { baseElement } = customRender(
      GetWorkflowTasksItemV2StatusEnum.terminate_succeeded
    );
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when status is terminating', () => {
    const { baseElement } = customRender(
      GetWorkflowTasksItemV2StatusEnum.terminating
    );
    expect(baseElement).toMatchSnapshot();
  });
});
