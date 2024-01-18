
import AuditResultList from '.';
import { AuditResultListProps } from './index.type';

import { superRender } from '../../../../testUtils/customRender';
import { act, cleanup } from '@testing-library/react';
import order from '../../../../testUtils/mockApi/order';
import { AuditTaskResV1AuditLevelEnum, AuditTaskResV1SqlSourceEnum, AuditTaskResV1StatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

const projectID = 'project ID';
const tasksData = [
  {
    audit_level: AuditTaskResV1AuditLevelEnum.warn,
    exec_end_time: '1970-12-31 00:00:00',
    exec_start_time: '1970-01-01 00:00:00',
    instance_db_type: 'mysql',
    instance_name: 'instance a',
    instance_schema: 'schema a',
    pass_rate: 10,
    score: 30,
    sql_source: AuditTaskResV1SqlSourceEnum.form_data,
    status: AuditTaskResV1StatusEnum.audited,
    task_id: 1
  },
  {
    audit_level: AuditTaskResV1AuditLevelEnum.error,
    exec_end_time: '1970-12-31 00:00:00',
    exec_start_time: '1970-01-01 00:00:00',
    instance_db_type: 'mysql',
    instance_name: 'instance a',
    instance_schema: 'schema a',
    pass_rate: 10,
    score: 30,
    sql_source: AuditTaskResV1SqlSourceEnum.sql_file,
    status: AuditTaskResV1StatusEnum.exec_failed,
    task_id: 2
  }
];

describe('sqle/Order/Common/AuditResultList', () => {
  const updateTaskRecordTotalNumFn = jest.fn()
  const customRender = (params: Pick<AuditResultListProps, 'tasks'| 'mode'>) => {
    return superRender(
      <AuditResultList
        projectID={projectID}
        updateTaskRecordTotalNum={updateTaskRecordTotalNumFn}
        {...params}
      />
    );
  };

  beforeEach(() => {
    jest.useFakeTimers();
order.mockAllApi();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render snap when mode is order', async () => {
    const { baseElement } = customRender({
      tasks:[]
    });
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3200));
    expect(baseElement).toMatchSnapshot();
  })

  it('render snap has task when mode is order', async () => {
    const { baseElement } = customRender({
      tasks: tasksData
    });
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3200));
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when mode is order', async () => {
    const { baseElement } = customRender({
      tasks: [],
      mode: 'sql-audit'
    });
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3200));
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap has task when mode is order', async () => {
    const { baseElement } = customRender({
      tasks: tasksData,
      mode: 'sql-audit'
    });
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(3200));
    expect(baseElement).toMatchSnapshot();
  });
});
