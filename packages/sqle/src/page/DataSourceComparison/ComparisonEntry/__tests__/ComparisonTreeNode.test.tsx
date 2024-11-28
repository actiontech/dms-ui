import { act, fireEvent, renderHook, screen } from '@testing-library/react';
import { superRender } from '../../../../testUtils/customRender';
import ComparisonDetailDrawer from '../component/ComparisonTreeNode/ComparisonDetailDrawer';
import useComparisonResultTree from '../hooks/useComparisonResultTree';
import {
  executeDatabaseComparisonMockData,
  genDatabaseDiffModifySQLsMockData
} from '../../../../testUtils/mockApi/database_comparison/data';
import { generateTreeNodeKey } from '../utils/TreeNode';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import DatabaseComparisonMockService from '../../../../testUtils/mockApi/database_comparison';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { Copy, Download } from '@actiontech/shared';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import dayjs from 'dayjs';
import MockDate from 'mockdate';
import ComparisonTreeNode from '../component/ComparisonTreeNode';

describe('ComparisonTreeNode', () => {
  describe('ComparisonDetailDrawer', () => {
    const onCloseSpy = jest.fn();
    let genDatabaseDiffModifySQLSpy: jest.SpyInstance;
    let getComparisonStatementSpy: jest.SpyInstance;
    const customRender = (open = true) => {
      const { result } = renderHook(() =>
        useComparisonResultTree(executeDatabaseComparisonMockData)
      );
      const getDetailParams = result.current.generateGetComparisonDetailParams(
        generateTreeNodeKey('2', 'TABLE', 'task'),
        'baseline-id',
        'comparison-id',
        'baseline-name',
        'comparison-name'
      );
      const genModifiedSqlParams = result.current.generateModifiedSqlParams(
        generateTreeNodeKey('2', 'TABLE', 'task'),
        'baseline-id',
        'comparison-id',
        'baseline-name',
        'comparison-name'
      );
      return superRender(
        <ComparisonDetailDrawer
          open={open}
          onClose={onCloseSpy}
          getDetailParams={getDetailParams}
          genModifiedSqlParams={genModifiedSqlParams}
          comparisonResults={executeDatabaseComparisonMockData}
          selectedBaselineInstanceInfo={{
            instanceId: 'baseline-id',
            instanceName: 'baseline-name',
            instanceType: 'MySQL'
          }}
          selectedComparisonInstanceInfo={{
            instanceId: 'comparison-id',
            instanceName: 'comparison-name',
            instanceType: 'MySQL'
          }}
          selectedObjectNodeKey={generateTreeNodeKey('2', 'TABLE', 'task')}
        />
      );
    };

    beforeEach(() => {
      mockUseCurrentProject();
      mockUseCurrentUser();
      mockUsePermission(
        {
          checkActionPermission: jest.fn().mockReturnValue(true)
        },
        { useSpyOnMockHooks: true }
      );
      jest.useFakeTimers();
      MockDate.set(dayjs('2023-12-18 12:00:00').valueOf());

      genDatabaseDiffModifySQLSpy =
        DatabaseComparisonMockService.mockGenDatabaseDiffModifySQLsV1();
      getComparisonStatementSpy =
        DatabaseComparisonMockService.mockGetComparisonStatementV1();
    });
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
      jest.useRealTimers();
      MockDate.reset();
    });

    it('should render the drawer when open is true', async () => {
      const { baseElement } = customRender();
      expect(getComparisonStatementSpy).toHaveBeenCalledTimes(1);
      expect(getComparisonStatementSpy).toHaveBeenCalledWith({
        database_comparison_object: {
          base_db_object: {
            instance_id: 'baseline-id',
            schema_name: 'baseline-name'
          }
        },
        database_object: {
          object_name: 'task',
          object_type: 'TABLE'
        },
        project_name: mockProjectInfo.projectName
      });
      expect(screen.getByText('查看对比详情')).toBeInTheDocument();
      expect(baseElement).toMatchSnapshot();

      await act(async () => jest.advanceTimersByTime(3000));
      expect(baseElement).toMatchSnapshot();
    });

    it('should close the drawer and reset state when onClose is called', () => {
      customRender();

      fireEvent.click(getBySelector('.closed-icon-custom'));
      expect(onCloseSpy).toHaveBeenCalled();
    });

    it('should call genModifiedSqlAsyncApi when generate SQL button is clicked', async () => {
      customRender();

      await act(async () => jest.advanceTimersByTime(3000));
      fireEvent.click(screen.getByText('生成变更SQL'));
      expect(genDatabaseDiffModifySQLSpy).toHaveBeenCalledTimes(1);
      expect(genDatabaseDiffModifySQLSpy).toHaveBeenCalledWith({
        base_instance_id: 'baseline-id',
        comparison_instance_id: 'comparison-id',
        database_schema_objects: [
          {
            base_schema_name: 'baseline-name',
            comparison_schema_name: 'comparison-name',
            database_objects: [
              {
                object_name: 'task',
                object_type: 'TABLE'
              }
            ]
          }
        ],
        project_name: mockProjectInfo.projectName
      });
    });

    it('should copy modified SQL to clipboard when copy button is clicked', async () => {
      const copyTextByTextarea = jest.fn();
      jest
        .spyOn(Copy, 'copyTextByTextarea')
        .mockImplementation(copyTextByTextarea);

      customRender();
      await act(async () => jest.advanceTimersByTime(3000));
      fireEvent.click(screen.getByText('生成变更SQL'));
      await act(async () => jest.advanceTimersByTime(3000));

      fireEvent.click(screen.getByText('复制变更SQL语句'));
      expect(copyTextByTextarea).toHaveBeenCalledWith(
        genDatabaseDiffModifySQLsMockData[0].modify_sqls
          ?.map((v) => v.sql_statement)
          ?.join('\n')
      );
    });

    it('should download modified SQL when download button is clicked', async () => {
      const downloadByCreateElementA = jest.fn();
      jest
        .spyOn(Download, 'downloadByCreateElementA')
        .mockImplementation(downloadByCreateElementA);

      customRender();
      await act(async () => jest.advanceTimersByTime(3000));
      fireEvent.click(screen.getByText('生成变更SQL'));
      await act(async () => jest.advanceTimersByTime(3000));

      fireEvent.click(screen.getByText('下载变更SQL语句'));
      expect(downloadByCreateElementA).toHaveBeenCalledWith(
        genDatabaseDiffModifySQLsMockData[0].modify_sqls
          ?.map((v) => v.sql_statement)
          ?.join('\n'),
        'comparison-name-modified-sql-20231218120000.sql'
      );
    });
  });

  describe('ComparisonTreeNode', () => {
    const comparisonObjectTreeOnCheckSpy = jest.fn();
    const customRender = () => {
      return superRender(
        <ComparisonTreeNode
          comparisonResults={executeDatabaseComparisonMockData}
          selectedBaselineInstanceInfo={{
            instanceId: 'baseline-id',
            instanceName: 'baseline-name',
            instanceType: 'MySQL'
          }}
          selectedComparisonInstanceInfo={{
            instanceId: 'comparison-id',
            instanceName: 'comparison-name',
            instanceType: 'MySQL'
          }}
          comparisonObjectCheckKeys={[]}
          comparisonObjectTreeOnCheck={comparisonObjectTreeOnCheckSpy}
        />
      );
    };

    beforeEach(() => {
      mockUseCurrentProject();
      mockUseCurrentUser();
    });
    afterEach(() => {
      jest.clearAllMocks();
      jest.clearAllTimers();
    });

    it('should render the baseline and comparison trees', () => {
      const { container } = customRender();

      expect(container).toMatchSnapshot();
    });
  });
});
