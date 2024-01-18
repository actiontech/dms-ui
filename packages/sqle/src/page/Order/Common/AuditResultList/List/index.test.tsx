import AuditResultForCreateList from '.';
import { AuditResultForCreateListProps } from './index.type';

import { superRender } from '../../../../../testUtils/customRender';
import { fireEvent, act, cleanup, screen } from '@testing-library/react';
import order from '../../../../../testUtils/mockApi/order';
import { getAuditTaskSQLsV2FilterAuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';
import { createSpyFailResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('sqle/Order/Common/AuditResultList/List', () => {
  let requestUpdateAuditTaskSQLs: jest.SpyInstance;
  let requestGetAuditTaskSQLs: jest.SpyInstance;

  const customRender = (params: AuditResultForCreateListProps) => {
    return superRender(<AuditResultForCreateList {...params} />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    requestUpdateAuditTaskSQLs = order.updateAuditTaskSQLs();
    requestGetAuditTaskSQLs = order.getAuditTaskSQLs();
    order.mockAllApi();
    //  MUI: the styled(component)(...args) API requires all its args to be defined.
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    (console.error as jest.Mock).mockRestore();
    cleanup();
  });

  it('render snap when data is empty', () => {
    const { baseElement } = customRender({
      duplicate: true,
      projectID: 'projectID',
      auditLevelFilterValue: 'all'
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when get table data', async () => {
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
    const { baseElement } = customRender({
      duplicate: true,
      taskID: 'taskID',
      projectID: 'projectID',
      auditLevelFilterValue: getAuditTaskSQLsV2FilterAuditLevelEnum.normal
    });

    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(2600));
    expect(baseElement).toMatchSnapshot();
    expect(requestGetAuditTaskSQLs).toBeCalled();
    expect(requestGetAuditTaskSQLs).toBeCalledWith({
      filter_audit_level: 'normal',
      no_duplicate: true,
      page_index: '1',
      page_size: '20',
      task_id: 'taskID'
    });

    const analyzeBtn = screen.getAllByText('分 析');
    expect(analyzeBtn.length).toBe(1);
    fireEvent.click(screen.getByText('分 析'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(openSpy).toBeCalled();
    expect(openSpy).toBeCalledWith(
      `/sqle/project/projectID/order/taskID/1/analyze`
    );
    openSpy.mockRestore();
  });

  it('render snap when get table error', async () => {
    requestGetAuditTaskSQLs.mockImplementation(() =>
      createSpyFailResponse({ message: 'error' })
    );
    const { baseElement } = customRender({
      duplicate: true,
      taskID: 'taskID',
      projectID: 'projectID',
      auditLevelFilterValue: getAuditTaskSQLsV2FilterAuditLevelEnum.normal
    });

    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();
    expect(requestGetAuditTaskSQLs).toBeCalled();
    expect(requestGetAuditTaskSQLs).toBeCalledWith({
      filter_audit_level: 'normal',
      no_duplicate: true,
      page_index: '1',
      page_size: '20',
      task_id: 'taskID'
    });
  });

  it('render snap when add note', async () => {
    const { baseElement } = customRender({
      duplicate: true,
      taskID: 'taskID',
      projectID: 'projectID',
      auditLevelFilterValue: getAuditTaskSQLsV2FilterAuditLevelEnum.normal
    });

    await act(async () => jest.advanceTimersByTime(3300));
    expect(screen.getByText('添加说明')).toBeInTheDocument();
    fireEvent.click(screen.getByText('添加说明'));
    await act(async () => jest.advanceTimersByTime(500));
    const descInput = getBySelector('textarea.ant-input', baseElement);
    fireEvent.change(descInput, {
      target: {
        value: 'desc text'
      }
    });
    await act(async () => jest.advanceTimersByTime(200));
    fireEvent.keyDown(descInput, {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13
    });
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(2600));
    expect(baseElement).toMatchSnapshot();
  });
});
