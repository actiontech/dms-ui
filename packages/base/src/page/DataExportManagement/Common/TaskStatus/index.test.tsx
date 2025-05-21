import { GetDataExportTaskStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { baseSuperRender } from '../../../../testUtils/superRender';
import ExportTaskStatus from '.';

describe('test base/DataExport/WOrkflowStatus', () => {
  it('should match snapshot', () => {
    expect(baseSuperRender(<ExportTaskStatus />).container).toMatchSnapshot();
    expect(
      baseSuperRender(
        <ExportTaskStatus status={GetDataExportTaskStatusEnum.exporting} />
      ).container
    ).toMatchSnapshot();
    expect(
      baseSuperRender(
        <ExportTaskStatus status={GetDataExportTaskStatusEnum.failed} />
      ).container
    ).toMatchSnapshot();
    expect(
      baseSuperRender(
        <ExportTaskStatus status={GetDataExportTaskStatusEnum.finish} />
      ).container
    ).toMatchSnapshot();
    expect(
      baseSuperRender(
        <ExportTaskStatus status={GetDataExportTaskStatusEnum.init} />
      ).container
    ).toMatchSnapshot();
    expect(
      baseSuperRender(
        <ExportTaskStatus status={GetDataExportTaskStatusEnum.file_deleted} />
      ).container
    ).toMatchSnapshot();
  });
});
