import { WorkflowRecordStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import BasicInfoWrapper from '.';
import { superRender } from '../../../../testUtils/customRender';

describe('test base/DataExport/Common/BasicInfoWrapper', () => {
  it('should match snapshot', () => {
    expect(
      superRender(<BasicInfoWrapper title="export-task-1" />).container
    ).toMatchSnapshot();

    expect(
      superRender(
        <BasicInfoWrapper
          title="export-task-1"
          desc="desc"
          className="test-cls"
          gap={10}
        />
      ).container
    ).toMatchSnapshot();

    expect(
      superRender(
        <BasicInfoWrapper
          title="export-task-1"
          desc="desc"
          status={WorkflowRecordStatusEnum.cancel}
        />
      ).container
    ).toMatchSnapshot();

    expect(
      superRender(
        <BasicInfoWrapper
          title="export-task-1"
          desc="desc"
          status={WorkflowRecordStatusEnum.exporting}
        />
      ).container
    ).toMatchSnapshot();

    expect(
      superRender(
        <BasicInfoWrapper
          title="export-task-1"
          desc="desc"
          status={WorkflowRecordStatusEnum.wait_for_approve}
        />
      ).container
    ).toMatchSnapshot();

    expect(
      superRender(
        <BasicInfoWrapper
          title="export-task-1"
          desc="desc"
          status={WorkflowRecordStatusEnum.wait_for_export}
        />
      ).container
    ).toMatchSnapshot();

    expect(
      superRender(
        <BasicInfoWrapper
          title="export-task-1"
          desc="desc"
          status={WorkflowRecordStatusEnum.rejected}
        />
      ).container
    ).toMatchSnapshot();

    expect(
      superRender(
        <BasicInfoWrapper
          title="export-task-1"
          desc="desc"
          status={WorkflowRecordStatusEnum.failed}
        />
      ).container
    ).toMatchSnapshot();

    expect(
      superRender(
        <BasicInfoWrapper
          title="export-task-1"
          desc="desc"
          status={WorkflowRecordStatusEnum.finish}
        />
      ).container
    ).toMatchSnapshot();
  });
});
