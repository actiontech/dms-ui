import { fireEvent, screen } from '@testing-library/react';
import ExportResultCard from '..';
import { baseSuperRender } from '../../../../../../../../testUtils/superRender';
import { ListDataExportTaskSQLsResponseData } from '@actiontech/shared/lib/testUtil/mockApi/base/dataExport/data';
import { mockDataExportDetailRedux } from '../../../../../testUtils/mockUseDataExportDetailReduxManage';
import { Copy } from '@actiontech/dms-kit';
import { ListDataExportTaskSQLExportStatusEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { resolveExportResultDisplayText } from '../../../../../utils/exportFailDisplay';

/** Ant Tree 默认折叠，「导出结果」子节点不在 DOM；与 Playwright expandExportResultTrees 对齐 */
const expandExportResultTrees = () => {
  document
    .querySelectorAll(
      '.result-card-content .ant-tree-switcher:not(.ant-tree-switcher-noop)'
    )
    .forEach((el) => {
      fireEvent.click(el);
    });
};

describe('test base/DataExport/Detail/ExportTaskList/ResultCard', () => {
  it('should match snapshot', () => {
    const mockCopyTextByTextareaSpy = jest.fn();
    jest
      .spyOn(Copy, 'copyTextByTextarea')
      .mockImplementation(mockCopyTextByTextareaSpy);

    const { container } = baseSuperRender(
      <ExportResultCard
        taskID={mockDataExportDetailRedux.curTaskID}
        {...ListDataExportTaskSQLsResponseData[1]}
      />
    );

    expect(container).toMatchSnapshot();

    fireEvent.click(screen.getAllByText('复制SQL语句')[0]);
    expect(mockCopyTextByTextareaSpy).toHaveBeenCalledTimes(1);
    expect(mockCopyTextByTextareaSpy).toHaveBeenCalledWith(
      ListDataExportTaskSQLsResponseData[1].sql
    );
  });

  it('should render success / failed / not_executed exec tags from export_status', () => {
    const { rerender } = baseSuperRender(
      <ExportResultCard
        taskID={mockDataExportDetailRedux.curTaskID}
        uid={1}
        sql="SELECT 1"
        export_status={ListDataExportTaskSQLExportStatusEnum.success}
        export_result="ok"
      />
    );
    expect(screen.getByText('成功')).toBeInTheDocument();
    expect(screen.queryByText('失败')).not.toBeInTheDocument();

    rerender(
      <ExportResultCard
        taskID={mockDataExportDetailRedux.curTaskID}
        uid={2}
        sql="SELECT missing"
        export_status={ListDataExportTaskSQLExportStatusEnum.failed}
        export_result="Table 'db.t' doesn't exist"
      />
    );
    expect(screen.getByText('失败')).toBeInTheDocument();
    expandExportResultTrees();
    expect(screen.getByText("Table 'db.t' doesn't exist")).toBeInTheDocument();

    rerender(
      <ExportResultCard
        taskID={mockDataExportDetailRedux.curTaskID}
        uid={3}
        sql="SELECT 3"
        export_status={ListDataExportTaskSQLExportStatusEnum.not_executed}
        export_result=""
      />
    );
    expect(screen.getByText('未执行')).toBeInTheDocument();
    expandExportResultTrees();
    expect(
      screen.getByText('导出任务已失败，本条 SQL 未执行')
    ).toBeInTheDocument();
  });

  it('should not replace business export_result with fallback when failed', () => {
    baseSuperRender(
      <ExportResultCard
        taskID={mockDataExportDetailRedux.curTaskID}
        uid={4}
        sql="SELECT x"
        export_status={ListDataExportTaskSQLExportStatusEnum.failed}
        export_result="Access denied for user"
      />
    );
    expandExportResultTrees();
    expect(screen.getByText('Access denied for user')).toBeInTheDocument();
    expect(
      screen.queryByText(
        '导出失败，暂未获取到具体原因，请联系管理员查看服务日志'
      )
    ).not.toBeInTheDocument();
  });

  it('should use fallback only when failed and export_result empty', () => {
    baseSuperRender(
      <ExportResultCard
        taskID={mockDataExportDetailRedux.curTaskID}
        uid={5}
        sql="SELECT x"
        export_status={ListDataExportTaskSQLExportStatusEnum.failed}
        export_result=""
      />
    );
    expandExportResultTrees();
    expect(
      screen.getByText('导出失败，暂未获取到具体原因，请联系管理员查看服务日志')
    ).toBeInTheDocument();
  });
});

describe('resolveExportResultDisplayText', () => {
  const fallback = 'FALLBACK';
  const notExecutedHint = 'NOT_EXECUTED_HINT';

  it('must not treat export_result==="ok" as success criterion', () => {
    expect(
      resolveExportResultDisplayText({
        exportStatus: '',
        exportResult: 'ok',
        failedFallback: fallback,
        notExecutedHint
      })
    ).toBe('ok');

    expect(
      resolveExportResultDisplayText({
        exportStatus: ListDataExportTaskSQLExportStatusEnum.failed,
        exportResult: 'ok',
        failedFallback: fallback,
        notExecutedHint
      })
    ).toBe('ok');

    expect(
      resolveExportResultDisplayText({
        exportStatus: ListDataExportTaskSQLExportStatusEnum.success,
        exportResult: '',
        failedFallback: fallback,
        notExecutedHint
      })
    ).toBe('-');
  });
});
