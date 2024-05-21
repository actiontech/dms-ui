import classNames from 'classnames';
import SqlExecuteMode from './SqlExecuteMode';
import { PaginationListProps } from './index.type';
import { WorkflowResV2ExecModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import FileExecuteMode from './FileExecuteMode';
import ExecModeController from '../Common/ExecModeController';
import { TasksResultListStyleWrapper } from '../style';

const PaginationList: React.FC<PaginationListProps> = ({
  executeMode,
  ...props
}) => {
  return (
    <TasksResultListStyleWrapper
      className={classNames('task-result-pagination-list', {
        'file-mode-task-result-pagination-list':
          executeMode === WorkflowResV2ExecModeEnum.sql_file,
        'sql-mode-task-result-pagination-list':
          executeMode === WorkflowResV2ExecModeEnum.sqls
      })}
    >
      <ExecModeController
        sqlComponent={<SqlExecuteMode {...props} />}
        sqlFileComponent={<FileExecuteMode {...props} />}
        executeMode={executeMode}
      />
    </TasksResultListStyleWrapper>
  );
};

export default PaginationList;
