import { renderWithTheme } from '../../../../../../testUtils/customRender';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { act, cleanup, fireEvent, screen } from '@testing-library/react';

import task from '../../../../../../testUtils/mockApi/task';
import rule_template from '../../../../../../testUtils/mockApi/rule_template';
import { getAuditTaskSQLsV2FilterExecStatusEnum } from '@actiontech/shared/lib/api/sqle/service/task/index.enum';
import { Copy } from '@actiontech/shared';

import ResultCard, { ResultCardProps } from '../ResultCard';

const projectName = 'default';
const taskId = 'task_id_1234';

describe('sqle/Order/AuditDetail/ResultCard', () => {
  let requestUpdateSqlDesc: jest.SpyInstance;
  const onUpdateDescriptionFn = jest.fn();

  const customRender = (
    params: Omit<
      ResultCardProps,
      'projectName' | 'taskId' | 'onUpdateDescription'
    >
  ) => {
    const someParams: Pick<
      ResultCardProps,
      'projectName' | 'taskId' | 'onUpdateDescription'
    > = {
      projectName,
      taskId,
      onUpdateDescription: onUpdateDescriptionFn
    };
    return renderWithTheme(<ResultCard {...someParams} {...params} />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    requestUpdateSqlDesc = task.updateAuditTaskSQLs();
    rule_template.getRuleList();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render snap when data is empty', () => {
    const { baseElement } = customRender({
      number: 1,
      exec_status: '',
      audit_result: []
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('render click add desc', async () => {
    const { baseElement } = customRender({
      number: 1,
      description: 'into desc params'
    });
    expect(baseElement).toMatchSnapshot();
    const descInput = getBySelector('input[placeholder="添加说明"]');
    fireEvent.change(descInput, {
      target: {
        value: 'desc text'
      }
    });
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.blur(descInput);
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(2800));
    expect(requestUpdateSqlDesc).toHaveBeenCalled();
    expect(requestUpdateSqlDesc).toHaveBeenCalledWith({
      number: '1',
      description: 'desc text',
      task_id: taskId
    });
    expect(onUpdateDescriptionFn).toHaveBeenCalled();
  });

  it('render click icon arrow when has result cont', async () => {
    const { baseElement } = customRender({
      number: 1,
      exec_result: 'exec_result cont',
      audit_result: [
        {
          rule_name: 'rule_name a'
        }
      ]
    });

    const iconArrows = getAllBySelector('.custom-icon-arrow-down', baseElement);
    expect(iconArrows.length).toBe(2);

    fireEvent.click(iconArrows[0]);
    await act(async () => jest.advanceTimersByTime(500));

    fireEvent.click(iconArrows[1]);
    await act(async () => jest.advanceTimersByTime(500));

    expect(baseElement).toMatchSnapshot();
  });

  it('render click icon arrow when no cont', async () => {
    const { baseElement } = customRender({
      number: 1
    });

    const iconArrows = getAllBySelector('.custom-icon-arrow-down', baseElement);
    expect(iconArrows.length).toBe(2);

    fireEvent.click(iconArrows[0]);
    await act(async () => jest.advanceTimersByTime(500));

    fireEvent.click(iconArrows[1]);
    await act(async () => jest.advanceTimersByTime(500));

    expect(baseElement).toMatchSnapshot();
  });

  it('render change exec_sql & rollback_sql', async () => {
    const { baseElement } = customRender({
      number: 1,
      exec_sql: 'exec_sql cont',
      rollback_sql: 'rollback_sql cont'
    });

    expect(screen.getByText('执行语句')).toBeInTheDocument();
    expect(screen.getByText('回滚语句')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('回滚语句'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('执行语句'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(baseElement).toMatchSnapshot();
  });

  it('render skip analyze page', async () => {
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null);
    customRender({
      number: 2
    });
    expect(screen.getByText('分 析')).toBeInTheDocument();
    fireEvent.click(screen.getByText('分 析'));
    await act(async () => jest.advanceTimersByTime(500));
    expect(openSpy).toHaveBeenCalled();
    expect(openSpy).toHaveBeenCalledWith(
      `/sqle/project/${projectName}/order/${taskId}/2/analyze`
    );
    openSpy.mockRestore();
  });

  it('render copy exec_sql', async () => {
    const mockCopyTextByTextarea = jest.fn();
    jest
      .spyOn(Copy, 'copyTextByTextarea')
      .mockImplementation(mockCopyTextByTextarea);
    customRender({
      number: 1,
      exec_status: getAuditTaskSQLsV2FilterExecStatusEnum.succeeded,
      exec_sql: 'exec_sql cont'
    });
    expect(screen.getByText('复制执行语句')).toBeInTheDocument();
    fireEvent.click(screen.getByText('复制执行语句'));
    expect(mockCopyTextByTextarea).toHaveBeenCalled();
    expect(screen.getByText('复制成功')).toBeInTheDocument();
  });
});
