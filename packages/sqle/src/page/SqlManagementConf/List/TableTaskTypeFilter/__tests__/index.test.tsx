import TableTaskTypeFilter from '../index';
import { cleanup, fireEvent, screen, act } from '@testing-library/react';
import { sqleSuperRender } from '../../../../../testUtils/superRender';
import { TableTaskTypeFilterProps } from '../index.type';
import { mockAuditPlanTypesData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/instanceAuditPlan/data';
import { queryBySelector } from '@actiontech/shared/lib/testUtil/customQuery';

describe('test sqle/SqlManagementConf/TableTaskTypeFilter', () => {
  const updateParamsSpy = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = (props?: TableTaskTypeFilterProps) =>
    sqleSuperRender(
      <TableTaskTypeFilter
        auditPlanTypes={props?.auditPlanTypes ?? mockAuditPlanTypesData}
        updateParams={props?.updateParams ?? updateParamsSpy}
      />
    );

  it('render init snap shot', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
    expect(queryBySelector('.checked-item')).not.toBeInTheDocument();
  });

  it('render filter by database type', async () => {
    const { baseElement } = customRender();
    fireEvent.click(screen.getByText('MySQL'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('MySQL').closest('button')).toHaveClass(
      'checked-item'
    );
    // Disable instance_type as not a MySQL task type, except for UNKNOWN types
    expect(screen.getByText('Top SQL').closest('button')).toBeDisabled();
    expect(screen.getByText('TiDB审计日志').closest('button')).toBeDisabled();
    expect(screen.getByText('自定义').closest('button')).not.toBeDisabled();
    expect(screen.getByText('库表元数据').closest('button')).not.toBeDisabled();
    expect(updateParamsSpy).toHaveBeenCalledWith({
      dataSourceType: 'MySQL',
      taskType: ''
    });
    expect(baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByText('自定义'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('自定义').closest('button')).toHaveClass(
      'checked-item'
    );
    expect(updateParamsSpy).toHaveBeenCalledWith({
      dataSourceType: 'MySQL',
      taskType: 'default'
    });

    // cancel selected
    fireEvent.click(screen.getByText('MySQL'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('MySQL').closest('button')).not.toHaveClass(
      'checked-item'
    );
    expect(screen.getByText('Top SQL').closest('button')).not.toBeDisabled();
    expect(
      screen.getByText('TiDB审计日志').closest('button')
    ).not.toBeDisabled();
    expect(screen.getByText('自定义').closest('button')).not.toBeDisabled();
    expect(updateParamsSpy).toHaveBeenCalledWith({
      dataSourceType: '',
      taskType: 'default'
    });
  });

  it('render filter by task type', async () => {
    const { baseElement } = customRender();
    fireEvent.click(screen.getByText('TiDB审计日志'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('TiDB审计日志').closest('button')).toHaveClass(
      'checked-item'
    );
    // Disable instance_type as not a TiDB source type
    expect(screen.getByText('TiDB').closest('button')).not.toBeDisabled();
    expect(screen.getByText('MySQL').closest('button')).toBeDisabled();
    expect(screen.getByText('Oracle').closest('button')).toBeDisabled();
    expect(
      screen.getByText('OceanBase For MySQL').closest('button')
    ).toBeDisabled();
    expect(updateParamsSpy).toHaveBeenCalledWith({
      dataSourceType: '',
      taskType: 'tidb_audit_log'
    });

    // cancel selected
    fireEvent.click(screen.getByText('TiDB审计日志'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('MySQL').closest('button')).not.toBeDisabled();
    expect(screen.getByText('Oracle').closest('button')).not.toBeDisabled();
    expect(
      screen.getByText('OceanBase For MySQL').closest('button')
    ).not.toBeDisabled();
    expect(updateParamsSpy).toHaveBeenCalledWith({
      dataSourceType: '',
      taskType: ''
    });

    // select Top SQL
    fireEvent.click(screen.getByText('Top SQL'));
    await act(async () => jest.advanceTimersByTime(100));
    expect(screen.getByText('TiDB').closest('button')).toBeDisabled();
    expect(screen.getByText('MySQL').closest('button')).toBeDisabled();
    expect(screen.getByText('Oracle').closest('button')).not.toBeDisabled();
    expect(
      screen.getByText('OceanBase For MySQL').closest('button')
    ).not.toBeDisabled();

    expect(baseElement).toMatchSnapshot();
  });
});
