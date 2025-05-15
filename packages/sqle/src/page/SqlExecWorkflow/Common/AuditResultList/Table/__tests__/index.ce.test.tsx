/**
 * @test_version ce
 */

import AuditResultTable from '..';
import { AuditResultTableProps } from '../index.type';
import { sqleSuperRender } from '../../../../../../testUtils/superRender';
import { fireEvent, act, cleanup, screen } from '@testing-library/react';
import { getAuditTaskSQLsV2FilterAuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';
import { createSpyFailResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import execWorkflow from '../../../../../../testUtils/mockApi/execWorkflow';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { useSelector } from 'react-redux';
import { ModalName } from '../../../../../../data/ModalName';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn()
  };
});

describe('sqle/ExecWorkflow/Common/AuditResultList', () => {
  let requestUpdateAuditTaskSQLs: jest.SpyInstance;
  let requestGetAuditTaskSQLs: jest.SpyInstance;

  const customRender = (params: AuditResultTableProps) => {
    return sqleSuperRender(<AuditResultTable {...params} />);
  };

  beforeEach(() => {
    mockUseCurrentUser();
    jest.useFakeTimers();
    requestUpdateAuditTaskSQLs = execWorkflow.updateAuditTaskSQLs();
    requestGetAuditTaskSQLs = execWorkflow.getAuditTaskSQLs();
    execWorkflow.mockAllApi();
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        whitelist: { modalStatus: { [ModalName.Add_Whitelist]: false } },
        permission: {
          moduleFeatureSupport: { sqlOptimization: false },
          userOperationPermissions: null
        }
      })
    );
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render snap when data is empty', () => {
    const { baseElement } = customRender({
      noDuplicate: true,
      projectID: 'projectID',
      auditLevelFilterValue: null
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when get table error', async () => {
    requestGetAuditTaskSQLs.mockImplementation(() =>
      createSpyFailResponse({ message: 'error' })
    );
    const { baseElement } = customRender({
      noDuplicate: true,
      taskID: 'taskID',
      projectID: 'projectID',
      auditLevelFilterValue: getAuditTaskSQLsV2FilterAuditLevelEnum.normal
    });

    await act(async () => jest.advanceTimersByTime(3300));
    expect(baseElement).toMatchSnapshot();
    expect(requestGetAuditTaskSQLs).toHaveBeenCalled();
    expect(requestGetAuditTaskSQLs).toHaveBeenCalledWith({
      filter_audit_level: 'normal',
      no_duplicate: true,
      page_index: '1',
      page_size: '20',
      task_id: 'taskID'
    });
  });

  it('render snap when add note', async () => {
    const { baseElement } = customRender({
      noDuplicate: true,
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
