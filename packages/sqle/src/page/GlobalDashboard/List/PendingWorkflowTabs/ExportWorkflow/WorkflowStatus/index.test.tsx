import { WorkflowDetailResV1StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import WorkflowStatus from '.';
import { sqleSuperRender } from '../../../../../../testUtils/superRender';

describe('test base/DataExport/WOrkflowStatus', () => {
  it('should match snapshot', () => {
    expect(sqleSuperRender(<WorkflowStatus />).container).toMatchSnapshot();
    expect(
      sqleSuperRender(
        <WorkflowStatus status={WorkflowDetailResV1StatusEnum.cancel} />
      ).container
    ).toMatchSnapshot();
    expect(
      sqleSuperRender(
        <WorkflowStatus status={WorkflowDetailResV1StatusEnum.exporting} />
      ).container
    ).toMatchSnapshot();
    expect(
      sqleSuperRender(
        <WorkflowStatus status={WorkflowDetailResV1StatusEnum.finish} />
      ).container
    ).toMatchSnapshot();
    expect(
      sqleSuperRender(
        <WorkflowStatus
          status={WorkflowDetailResV1StatusEnum.wait_for_export}
        />
      ).container
    ).toMatchSnapshot();
    expect(
      sqleSuperRender(
        <WorkflowStatus status={WorkflowDetailResV1StatusEnum.failed} />
      ).container
    ).toMatchSnapshot();
    expect(
      sqleSuperRender(
        <WorkflowStatus
          status={WorkflowDetailResV1StatusEnum.wait_for_approve}
        />
      ).container
    ).toMatchSnapshot();
    expect(
      sqleSuperRender(
        <WorkflowStatus status={WorkflowDetailResV1StatusEnum.rejected} />
      ).container
    ).toMatchSnapshot();
  });
});
