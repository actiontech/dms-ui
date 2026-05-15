import { ListDataExportWorkflowStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import WorkflowStatus from '.';
import { baseSuperRender } from '../../../../testUtils/superRender';

describe('test base/DataExport/WOrkflowStatus', () => {
  it('should match snapshot', () => {
    expect(baseSuperRender(<WorkflowStatus />).container).toMatchSnapshot();
    expect(
      baseSuperRender(
        <WorkflowStatus status={ListDataExportWorkflowStatusEnum.cancel} />
      ).container
    ).toMatchSnapshot();
    expect(
      baseSuperRender(
        <WorkflowStatus status={ListDataExportWorkflowStatusEnum.exporting} />
      ).container
    ).toMatchSnapshot();
    expect(
      baseSuperRender(
        <WorkflowStatus status={ListDataExportWorkflowStatusEnum.finish} />
      ).container
    ).toMatchSnapshot();
    expect(
      baseSuperRender(
        <WorkflowStatus
          status={ListDataExportWorkflowStatusEnum.wait_for_export}
        />
      ).container
    ).toMatchSnapshot();
    expect(
      baseSuperRender(
        <WorkflowStatus status={ListDataExportWorkflowStatusEnum.failed} />
      ).container
    ).toMatchSnapshot();
    expect(
      baseSuperRender(
        <WorkflowStatus
          status={ListDataExportWorkflowStatusEnum.wait_for_approve}
        />
      ).container
    ).toMatchSnapshot();
    expect(
      baseSuperRender(
        <WorkflowStatus status={ListDataExportWorkflowStatusEnum.rejected} />
      ).container
    ).toMatchSnapshot();
  });
});
