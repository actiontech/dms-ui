import { WorkflowResV2ExecModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { WaterfallListProps } from './index.type';
import SqlExecuteMode from './SqlExecuteMode';
import classNames from 'classnames';
import FileExecuteMode from './FileExecuteMode';
import ExecModeController from '../Common/ExecModeController';
import { TasksResultListStyleWrapper } from '../style';

const WaterfallList: React.FC<WaterfallListProps> = ({
  executeMode,
  ...props
}) => {
  return (
    <TasksResultListStyleWrapper
      className={classNames('task-result-scroll-infinite-list', {
        'file-mode-task-result-infinite-list':
          executeMode === WorkflowResV2ExecModeEnum.sql_file,
        'sql-mode-task-result-infinite-list':
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

export default WaterfallList;
