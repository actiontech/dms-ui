import { WorkflowDetailResV1StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { superRender } from '../../../../../testUtils/customRender';
import WorkflowStatus from '../WorkflowStatus';
import { cleanup } from '@testing-library/react';

describe('test WorkflowStatus', () => {
  it('should match snapshot', () => {
    expect(superRender(<WorkflowStatus />).container).toMatchSnapshot();
    expect(
      superRender(
        <WorkflowStatus status={WorkflowDetailResV1StatusEnum.canceled} />
      ).container
    ).toMatchSnapshot();
    expect(
      superRender(
        <WorkflowStatus status={WorkflowDetailResV1StatusEnum.exec_failed} />
      ).container
    ).toMatchSnapshot();
    expect(
      superRender(
        <WorkflowStatus status={WorkflowDetailResV1StatusEnum.executing} />
      ).container
    ).toMatchSnapshot();
    expect(
      superRender(
        <WorkflowStatus status={WorkflowDetailResV1StatusEnum.finished} />
      ).container
    ).toMatchSnapshot();
    expect(
      superRender(
        <WorkflowStatus status={WorkflowDetailResV1StatusEnum.rejected} />
      ).container
    ).toMatchSnapshot();
    expect(
      superRender(
        <WorkflowStatus status={WorkflowDetailResV1StatusEnum.wait_for_audit} />
      ).container
    ).toMatchSnapshot();
    expect(
      superRender(
        <WorkflowStatus
          status={WorkflowDetailResV1StatusEnum.wait_for_execution}
        />
      ).container
    ).toMatchSnapshot();

    cleanup();
  });
});
