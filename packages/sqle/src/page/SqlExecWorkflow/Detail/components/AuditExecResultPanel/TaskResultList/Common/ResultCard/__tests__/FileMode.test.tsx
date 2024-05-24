import { IAuditFileStatistic } from '@actiontech/shared/lib/api/sqle/service/common';
import FileMode from '../FileMode';
import { fireEvent, screen } from '@testing-library/dom';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { act } from '@testing-library/react';
import task from '../../../../../../../../../testUtils/mockApi/task';
import { superRender } from '../../../../../../../../../testUtils/customRender';
import { TaskFileListMockData } from '../../../../../../../../../testUtils/mockApi/task/data';

describe('test TaskResultList/Result/FileMode', () => {
  let getTaskSQLsSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    getTaskSQLsSpy = task.getAuditTaskSQLs();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('should match snapshot', async () => {
    const { container } = superRender(
      <FileMode
        taskId="123"
        projectID="300200"
        {...(TaskFileListMockData[0] as unknown as IAuditFileStatistic)}
      />
    );

    expect(container).toMatchSnapshot();

    fireEvent.click(getBySelector('.file-info-name'));

    await act(async () => jest.advanceTimersByTime(0));

    expect(container).toMatchSnapshot();
    expect(screen.queryByText('序号')).not.toBeInTheDocument();
  });

  it('should render collapse children and called request', async () => {
    const { container } = superRender(
      <FileMode
        taskId="123"
        projectID="300200"
        {...(TaskFileListMockData[0] as unknown as IAuditFileStatistic)}
      />
    );
    expect(getTaskSQLsSpy).toHaveBeenCalledTimes(0);
    fireEvent.click(getBySelector('.number'));

    expect(getTaskSQLsSpy).toHaveBeenCalledTimes(1);
    expect(getTaskSQLsSpy).toHaveBeenCalledWith({
      task_id: '123',
      filter_audit_file_id: Number(TaskFileListMockData[0].file_id),
      page_index: '1',
      page_size: '5'
    });
    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.queryByText('序号')).toBeInTheDocument();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
  });

  it('should render audit result count', () => {
    const { container } = superRender(
      <FileMode
        taskId="123"
        projectID="300200"
        {...{
          ...(TaskFileListMockData[0] as unknown as IAuditFileStatistic),
          audit_result_count: {
            error_sql_count: 2,
            warning_sql_count: 4,
            normal_sql_count: 1,
            notice_sql_count: 5
          }
        }}
      />
    );

    expect(container).toMatchSnapshot();
  });
});
