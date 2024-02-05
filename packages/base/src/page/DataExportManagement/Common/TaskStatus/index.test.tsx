import { GetDataExportTaskStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { superRender } from '../../../../testUtils/customRender';
import ExportTaskStatus from '.';

describe('test base/DataExport/WOrkflowStatus', () => {
  it('should match snapshot', () => {
    expect(superRender(<ExportTaskStatus />).container).toMatchSnapshot();
    expect(
      superRender(
        <ExportTaskStatus status={GetDataExportTaskStatusEnum.exporting} />
      ).container
    ).toMatchSnapshot();
    expect(
      superRender(
        <ExportTaskStatus status={GetDataExportTaskStatusEnum.failed} />
      ).container
    ).toMatchSnapshot();
    expect(
      superRender(
        <ExportTaskStatus status={GetDataExportTaskStatusEnum.finish} />
      ).container
    ).toMatchSnapshot();
    expect(
      superRender(
        <ExportTaskStatus status={GetDataExportTaskStatusEnum.init} />
      ).container
    ).toMatchSnapshot();
    expect(
      superRender(
        <ExportTaskStatus status={GetDataExportTaskStatusEnum.file_deleted} />
      ).container
    ).toMatchSnapshot();
  });
});
