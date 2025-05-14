import { act, fireEvent, screen } from '@testing-library/react';
import { sqleSuperRender } from '../../../../testUtils/superRender';
import instance from '../../../../testUtils/mockApi/instance';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockDatabaseType } from '../../../../testUtils/mockHooks/mockDatabaseType';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import ComparisonEntry from '..';
import DatabaseComparisonMockService from '../../../../testUtils/mockApi/database_comparison';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import { createSpySuccessResponse } from '@actiontech/shared/lib/testUtil/mockApi';
import { executeDatabaseComparisonMockData } from '../../../../testUtils/mockApi/database_comparison/data';
import MockDate from 'mockdate';
import dayjs from 'dayjs';

describe('EnvironmentSelector', () => {
  let executeDatabaseComparisonSpy: jest.SpyInstance;
  let genDatabaseDiffModifySQLsSPy: jest.SpyInstance;
  beforeEach(() => {
    jest.clearAllMocks();
    instance.getInstanceTipList();
    instance.getInstanceSchemas();
    jest.useFakeTimers();
    MockDate.set(dayjs('2024-12-18 12:00:00').valueOf());

    mockUseCurrentProject();
    mockDatabaseType();
    mockUseCurrentUser();
    mockUsePermission(
      { checkActionPermission: jest.fn().mockReturnValue(true) },
      { useSpyOnMockHooks: true }
    );
    executeDatabaseComparisonSpy =
      DatabaseComparisonMockService.mockExecuteDatabaseComparisonV1();
    genDatabaseDiffModifySQLsSPy =
      DatabaseComparisonMockService.mockGenDatabaseDiffModifySQLsV1();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
    MockDate.reset();
  });

  it('should render the baseline and comparison environment selectors', () => {
    const { container } = sqleSuperRender(<ComparisonEntry />);

    expect(container).toMatchSnapshot();
  });

  it('should call executeComparison when the button is clicked', async () => {
    sqleSuperRender(<ComparisonEntry />);

    await act(async () => jest.advanceTimersByTime(3000));

    const baselineInstanceSelect = getBySelector('#baselineInstance');
    fireEvent.mouseDown(baselineInstanceSelect);
    fireEvent.click(screen.getAllByText('mysql-1(10.186.62.13:33061)')[0]);

    const comparisonInstanceSelect = getBySelector('#comparisonInstance');
    fireEvent.mouseDown(comparisonInstanceSelect);
    fireEvent.click(
      screen.getAllByText('xin-test-database(10.186.62.15:33063)')[1]
    );
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(screen.getByText('执行对比'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(executeDatabaseComparisonSpy).toHaveBeenCalledTimes(1);
    expect(executeDatabaseComparisonSpy).toHaveBeenCalledWith({
      base_db_object: {
        instance_id: '1739531854064652288'
      },
      comparison_db_object: {
        instance_id: '1739833293479612416'
      },
      project_name: mockProjectInfo.projectName
    });

    await act(async () => jest.advanceTimersByTime(3000));
    expect(screen.getByText('只看差异')).toBeInTheDocument();
    fireEvent.mouseDown(baselineInstanceSelect);
    fireEvent.click(screen.getAllByText('mysql-2(10.186.62.14:33062)')[0]);
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(screen.getByText('执行对比'));
    await act(async () => jest.advanceTimersByTime(0));

    expect(screen.queryByText('只看差异')).not.toBeInTheDocument();
  });

  it('should show an error message when trying to generate SQL without any checked nodes', async () => {
    sqleSuperRender(<ComparisonEntry />);

    await act(async () => jest.advanceTimersByTime(3000));

    const baselineInstanceSelect = getBySelector('#baselineInstance');
    fireEvent.mouseDown(baselineInstanceSelect);
    fireEvent.click(screen.getAllByText('mysql-1(10.186.62.13:33061)')[0]);

    const comparisonInstanceSelect = getBySelector('#comparisonInstance');
    fireEvent.mouseDown(comparisonInstanceSelect);
    fireEvent.click(
      screen.getAllByText('xin-test-database(10.186.62.15:33063)')[1]
    );
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(screen.getByText('执行对比'));
    await act(async () => jest.advanceTimersByTime(0));
    await act(async () => jest.advanceTimersByTime(3000));

    expect(screen.getByText('生成变更SQL').closest('button')).toBeDisabled();
    fireEvent.mouseOver(screen.getByText('生成变更SQL'));

    await screen.findByText('请先选择数据对象');

    fireEvent.click(getAllBySelector('.ant-tree-checkbox-inner')[0]);

    expect(
      screen.getByText('生成变更SQL').closest('button')
    ).not.toBeDisabled();
    fireEvent.click(screen.getByText('生成变更SQL'));

    await screen.findByText(
      '当前选中的节点中包含对比结果一致的对象，请修改选择对象后重试！'
    );

    fireEvent.click(getAllBySelector('.ant-tree-checkbox-inner')[0]);

    fireEvent.click(
      getAllBySelector('.ant-tree-checkbox-inner')[
        getAllBySelector('.ant-tree-checkbox-inner').length - 1
      ]
    );
    fireEvent.click(screen.getByText('生成变更SQL'));

    expect(screen.getByText('变更SQL语句信息')).toBeInTheDocument();
    expect(genDatabaseDiffModifySQLsSPy).toHaveBeenCalledTimes(1);
    expect(genDatabaseDiffModifySQLsSPy).toHaveBeenCalledWith({
      base_instance_id: '1739531854064652288',
      comparison_instance_id: '1739833293479612416',
      database_schema_objects: [
        {
          base_schema_name: 'test3',
          comparison_schema_name: 'test3',
          database_objects: [
            {
              object_name: 'task',
              object_type: 'TABLE'
            },
            {
              object_name: 'task_copy',
              object_type: 'TABLE'
            }
          ]
        }
      ],
      project_name: mockProjectInfo.projectName
    });
  });

  it('should toggle the showDifferencesOnly state and clear checked nodes when the toggle is clicked', async () => {
    sqleSuperRender(<ComparisonEntry />);

    await act(async () => jest.advanceTimersByTime(3000));

    const baselineInstanceSelect = getBySelector('#baselineInstance');
    fireEvent.mouseDown(baselineInstanceSelect);
    fireEvent.click(screen.getAllByText('mysql-1(10.186.62.13:33061)')[0]);

    const comparisonInstanceSelect = getBySelector('#comparisonInstance');
    fireEvent.mouseDown(comparisonInstanceSelect);
    fireEvent.click(
      screen.getAllByText('xin-test-database(10.186.62.15:33063)')[1]
    );
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(screen.getByText('执行对比'));
    await act(async () => jest.advanceTimersByTime(0));
    await act(async () => jest.advanceTimersByTime(3000));

    const toggleButton = screen.getByText('只看差异');
    fireEvent.click(toggleButton);

    fireEvent.click(getAllBySelector('.ant-tree-checkbox-inner')[0]);
    fireEvent.click(screen.getByText('生成变更SQL'));
    expect(screen.getByText('变更SQL语句信息')).toBeInTheDocument();
    expect(genDatabaseDiffModifySQLsSPy).toHaveBeenCalledTimes(1);
    expect(genDatabaseDiffModifySQLsSPy).toHaveBeenCalledWith({
      base_instance_id: '1739531854064652288',
      comparison_instance_id: '1739833293479612416',
      database_schema_objects: [
        {
          base_schema_name: 'test3',
          comparison_schema_name: 'test3',
          database_objects: [
            {
              object_name: 'task',
              object_type: 'TABLE'
            },
            {
              object_name: 'task_copy',
              object_type: 'TABLE'
            }
          ]
        }
      ],
      project_name: mockProjectInfo.projectName
    });
  });

  it('should disabled showDifferencesOnly button when comparison result is not differences', async () => {
    executeDatabaseComparisonSpy.mockImplementation(() =>
      createSpySuccessResponse({
        data: executeDatabaseComparisonMockData.filter(
          (item) => item.comparison_result === 'same'
        )
      })
    );
    sqleSuperRender(<ComparisonEntry />);

    await act(async () => jest.advanceTimersByTime(3000));

    const baselineInstanceSelect = getBySelector('#baselineInstance');
    fireEvent.mouseDown(baselineInstanceSelect);
    fireEvent.click(screen.getAllByText('mysql-1(10.186.62.13:33061)')[0]);

    const comparisonInstanceSelect = getBySelector('#comparisonInstance');
    fireEvent.mouseDown(comparisonInstanceSelect);
    fireEvent.click(
      screen.getAllByText('xin-test-database(10.186.62.15:33063)')[1]
    );
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(screen.getByText('执行对比'));
    await act(async () => jest.advanceTimersByTime(0));
    await act(async () => jest.advanceTimersByTime(3000));

    fireEvent.mouseEnter(screen.getByText('只看差异'));

    await screen.findByText('当前对比结果暂无差异');
  });

  it('should handle card click correctly', async () => {
    const originalScrollTo = window.scrollTo;
    const mockScrollTo = jest.fn();
    Object.defineProperty(window, 'scrollTo', {
      value: mockScrollTo,
      writable: true
    });

    const { container } = sqleSuperRender(<ComparisonEntry />);

    await act(async () => jest.advanceTimersByTime(3000));

    const baselineInstanceSelect = getBySelector('#baselineInstance');
    fireEvent.mouseDown(baselineInstanceSelect);
    fireEvent.click(screen.getAllByText('mysql-1(10.186.62.13:33061)')[0]);

    const comparisonInstanceSelect = getBySelector('#comparisonInstance');
    fireEvent.mouseDown(comparisonInstanceSelect);
    fireEvent.click(
      screen.getAllByText('xin-test-database(10.186.62.15:33063)')[1]
    );
    await act(async () => jest.advanceTimersByTime(0));

    fireEvent.click(screen.getByText('执行对比'));
    await act(async () => jest.advanceTimersByTime(0));
    await act(async () => jest.advanceTimersByTime(3000));

    const inconsistentCard = screen.getByText('定义差异');
    fireEvent.click(inconsistentCard);

    await act(async () => jest.advanceTimersByTime(400));
    expect(screen.getByText('test3')).toBeInTheDocument();

    expect(container).toMatchSnapshot();

    fireEvent.click(inconsistentCard);
    await act(async () => jest.advanceTimersByTime(400));
    await act(async () => jest.advanceTimersByTime(2000));

    expect(container).toMatchSnapshot();

    const missingCard = screen.getByText('缺失对象');
    fireEvent.click(missingCard);
    await act(async () => jest.advanceTimersByTime(400));

    const newCard = screen.getByText('新增对象');
    fireEvent.click(newCard);
    await act(async () => jest.advanceTimersByTime(400));

    const sameCard = screen.getByText('一致对象');
    fireEvent.click(sameCard);
    await act(async () => jest.advanceTimersByTime(400));

    Object.defineProperty(window, 'scrollTo', {
      value: originalScrollTo,
      writable: true
    });
  });
});
