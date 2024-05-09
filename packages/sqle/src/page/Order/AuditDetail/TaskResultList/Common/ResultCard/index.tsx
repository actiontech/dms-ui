import { ResultCardProps } from './index.type';
import { WorkflowResV2ExecModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import SQLMode from './SQLMode';

const ResultCard: React.FC<ResultCardProps> = ({ executeMode, ...props }) => {
  return executeMode === WorkflowResV2ExecModeEnum.sqls ? (
    <SQLMode {...props} />
  ) : null;
};

export default ResultCard;
