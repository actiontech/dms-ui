import { WorkflowDetailResV1StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { sqleSuperRender } from '../../../../../testUtils/superRender';
import WorkflowStatus from '../WorkflowStatus';
import { cleanup } from '@testing-library/react';

describe('test WorkflowStatus', () => {
  it('should match snapshot', () => {
    expect(sqleSuperRender(<WorkflowStatus />).container).toMatchSnapshot();
    expect(
      sqleSuperRender(
        <WorkflowStatus status={WorkflowDetailResV1StatusEnum.canceled} />
      ).container
    ).toMatchSnapshot();
    expect(
      sqleSuperRender(
        <WorkflowStatus status={WorkflowDetailResV1StatusEnum.exec_failed} />
      ).container
    ).toMatchSnapshot();
    expect(
      sqleSuperRender(
        <WorkflowStatus status={WorkflowDetailResV1StatusEnum.executing} />
      ).container
    ).toMatchSnapshot();
    expect(
      sqleSuperRender(
        <WorkflowStatus status={WorkflowDetailResV1StatusEnum.finished} />
      ).container
    ).toMatchSnapshot();
    expect(
      sqleSuperRender(
        <WorkflowStatus status={WorkflowDetailResV1StatusEnum.rejected} />
      ).container
    ).toMatchSnapshot();
    expect(
      sqleSuperRender(
        <WorkflowStatus status={WorkflowDetailResV1StatusEnum.wait_for_audit} />
      ).container
    ).toMatchSnapshot();
    expect(
      sqleSuperRender(
        <WorkflowStatus
          status={WorkflowDetailResV1StatusEnum.wait_for_execution}
        />
      ).container
    ).toMatchSnapshot();

    cleanup();
  });
});
