import { act, fireEvent, screen } from '@testing-library/react';
import SqlFileStatementOverview from '..';
import { useNavigate, useParams } from 'react-router-dom';
import task from '../../../../../../../../testUtils/mockApi/task';
import { sqleSuperRender } from '../../../../../../../../testUtils/superRender';
import {
  UtilsConsoleErrorStringsEnum,
  ignoreConsoleErrors
} from '@actiontech/shared/lib/testUtil/common';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
    useNavigate: jest.fn()
  };
});

describe('test AuditDetail/SqlFileStatementOverview', () => {
  let getTaskSQLsSpy: jest.SpyInstance;
  let getAuditFileExecStatistic: jest.SpyInstance;
  const useParamsMock: jest.Mock = useParams as jest.Mock;
  const navigateSpy = jest.fn();

  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNIQUE_KEY_REQUIRED]);

  beforeEach(() => {
    mockUseCurrentUser();
    jest.useFakeTimers();
    getTaskSQLsSpy = task.getAuditTaskSQLs();
    getAuditFileExecStatistic = task.getAuditFileExecStatistic();
    useParamsMock.mockReturnValue({ taskId: '15', fileId: '434' });
    (useNavigate as jest.Mock).mockImplementation(() => navigateSpy);
  });
  afterEach(() => {
    jest.useRealTimers();
  });
  it('should match snapshot', async () => {
    const { container } = sqleSuperRender(<SqlFileStatementOverview />);

    expect(getAuditFileExecStatistic).toHaveBeenCalledTimes(1);
    expect(getAuditFileExecStatistic).toHaveBeenCalledWith({
      task_id: '15',
      file_id: '434'
    });

    expect(getTaskSQLsSpy).toHaveBeenCalledTimes(1);
    expect(getTaskSQLsSpy).toHaveBeenCalledWith({
      task_id: '15',
      filter_audit_file_id: 434,
      page_index: '1',
      page_size: '20',
      filter_audit_level: undefined,
      filter_exec_status: undefined,
      no_duplicate: false
    });
    expect(container).toMatchSnapshot();

    await act(async () => jest.advanceTimersByTime(3000));
    expect(container).toMatchSnapshot();
  });

  it('should call navigate when clicked back to detail button', async () => {
    sqleSuperRender(<SqlFileStatementOverview />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('返回工单详情'));
    expect(navigateSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(-1);
  });

  it('render table filter', async () => {
    sqleSuperRender(<SqlFileStatementOverview />);
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getAllByText('准备执行')[0]);
    expect(getTaskSQLsSpy).toHaveBeenCalledTimes(2);
    expect(getTaskSQLsSpy).toHaveBeenNthCalledWith(2, {
      task_id: '15',
      filter_audit_file_id: 434,
      page_index: '1',
      page_size: '20',
      filter_audit_level: undefined,
      filter_exec_status: 'initialized',
      no_duplicate: false
    });
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.click(screen.getByText('数据去重'));
    expect(getTaskSQLsSpy).toHaveBeenCalledTimes(3);
    expect(getTaskSQLsSpy).toHaveBeenNthCalledWith(3, {
      task_id: '15',
      filter_audit_file_id: 434,
      page_index: '1',
      page_size: '20',
      filter_audit_level: undefined,
      filter_exec_status: 'initialized',
      no_duplicate: true
    });
  });
});
