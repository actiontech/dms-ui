import { fireEvent, screen } from '@testing-library/react';
import ExportResultCard from '..';
import { baseSuperRender } from '../../../../../../../../testUtils/superRender';
import { ListDataExportTaskSQLsResponseData } from '../../../../../../../../testUtils/mockApi/dataExport/data';
import { mockDataExportDetailRedux } from '../../../../../testUtils/mockUseDataExportDetailReduxManage';
import { Copy } from '@actiontech/shared';

describe('test base/DataExport/Detail/ExportTaskList/ResultCard', () => {
  it('should match snapshot', () => {
    const mockCopyTextByTextareaSpy = jest.fn();
    jest
      .spyOn(Copy, 'copyTextByTextarea')
      .mockImplementation(mockCopyTextByTextareaSpy);

    const { container } = baseSuperRender(
      <ExportResultCard
        taskID={mockDataExportDetailRedux.curTaskID}
        {...ListDataExportTaskSQLsResponseData[1]}
      />
    );

    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getAllByText('复制SQL语句')[0]);
    expect(mockCopyTextByTextareaSpy).toHaveBeenCalledTimes(1);
    expect(mockCopyTextByTextareaSpy).toHaveBeenCalledWith(
      ListDataExportTaskSQLsResponseData[1].sql
    );
  });
});
