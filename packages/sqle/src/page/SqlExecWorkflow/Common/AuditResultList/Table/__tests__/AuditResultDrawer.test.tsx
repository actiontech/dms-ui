import AuditResultDrawer from '../AuditResultDrawer';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { fireEvent, act, cleanup, screen } from '@testing-library/react';
import { AuditResultDrawerProps } from '../index.type';
import { superRender } from '../../../../../../testUtils/customRender';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';

describe('sqle/ExecWorkflow/Common/AuditResultList/AuditResultDrawer', () => {
  const onCloseFn = jest.fn();
  const clickAnalyzeFn = jest.fn();
  const handleClickSqlRewrittenFn = jest.fn();

  const customRender = (
    params: Omit<
      AuditResultDrawerProps,
      'onClose' | 'clickAnalyze' | 'handleClickSqlRewritten'
    >
  ) => {
    return superRender(
      <AuditResultDrawer
        onClose={onCloseFn}
        clickAnalyze={clickAnalyzeFn}
        handleClickSqlRewritten={handleClickSqlRewrittenFn}
        {...params}
      />
    );
  };

  beforeEach(() => {
    mockUseCurrentUser();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render snap when open is false', () => {
    const { baseElement } = customRender({
      open: false
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when data is empty and click closed', async () => {
    const { baseElement } = customRender({
      open: true
    });

    const closedIcon = getBySelector('.closed-icon-custom', baseElement);
    fireEvent.click(closedIcon);
    await act(async () => jest.advanceTimersByTime(300));
    expect(onCloseFn).toHaveBeenCalled();
  });

  it('render snap when title has data', () => {
    const { baseElement } = customRender({
      open: true,
      auditResultRecord: {
        audit_level: '',
        audit_result: [],
        audit_status: '',
        description: 'description cont',
        exec_result: '',
        exec_sql: 'exec sql',
        exec_status: '',
        number: 30,
        rollback_sqls: ['rollback sql'],
        sql_source_file: 'sql file'
      }
    });
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('分 析'));
    expect(clickAnalyzeFn).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText('SQL合规重写'));
    expect(handleClickSqlRewrittenFn).toHaveBeenCalledTimes(1);
    expect(handleClickSqlRewrittenFn).toHaveBeenCalledWith({
      audit_level: '',
      audit_result: [],
      audit_status: '',
      description: 'description cont',
      exec_result: '',
      exec_sql: 'exec sql',
      exec_status: '',
      number: 30,
      rollback_sqls: ['rollback sql'],
      sql_source_file: 'sql file'
    });
    expect(onCloseFn).toHaveBeenCalledTimes(1);
  });
});
