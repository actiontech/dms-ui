import classNames from 'classnames';
import { TasksResultListStyleWrapper } from '../../style';
import SQLExecuteMode from './SQLExecuteMode';
import { PaginationListProps } from './index.type';
import { WorkflowResV2ExecModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

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
      {executeMode === WorkflowResV2ExecModeEnum.sqls ? (
        <SQLExecuteMode {...props} />
      ) : null}
    </TasksResultListStyleWrapper>
  );
};

export default PaginationList;
