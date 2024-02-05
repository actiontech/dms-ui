import { ListDataExportWorkflowStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import WorkflowStatus from '.';
import { superRender } from '../../../../testUtils/customRender';

describe('test base/DataExport/WOrkflowStatus', () => {
  it('should match snapshot', () => {
    expect(superRender(<WorkflowStatus />).container).toMatchSnapshot();
    expect(
      superRender(
        <WorkflowStatus status={ListDataExportWorkflowStatusEnum.cancel} />
      ).container
    ).toMatchSnapshot();
    expect(
      superRender(
        <WorkflowStatus status={ListDataExportWorkflowStatusEnum.exporting} />
      ).container
    ).toMatchSnapshot();
    expect(
      superRender(
        <WorkflowStatus status={ListDataExportWorkflowStatusEnum.finish} />
      ).container
    ).toMatchSnapshot();
    expect(
      superRender(
        <WorkflowStatus
          status={ListDataExportWorkflowStatusEnum.wait_for_export}
        />
      ).container
    ).toMatchSnapshot();
    expect(
      superRender(
        <WorkflowStatus status={ListDataExportWorkflowStatusEnum.failed} />
      ).container
    ).toMatchSnapshot();
    expect(
      superRender(
        <WorkflowStatus
          status={ListDataExportWorkflowStatusEnum.wait_for_approve}
        />
      ).container
    ).toMatchSnapshot();
    expect(
      superRender(
        <WorkflowStatus status={ListDataExportWorkflowStatusEnum.rejected} />
      ).container
    ).toMatchSnapshot();
  });
});
