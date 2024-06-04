import { WorkflowResV2ExecModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { ExecModeControllerProps } from './index.type';

const ExecModeController: React.FC<ExecModeControllerProps> = ({
  executeMode,
  sqlFileComponent,
  sqlComponent
}) => {
  const render = () => {
    if (executeMode === WorkflowResV2ExecModeEnum.sqls) {
      return sqlComponent;
    }

    return sqlFileComponent;
  };

  return <>{render()}</>;
};

export default ExecModeController;
