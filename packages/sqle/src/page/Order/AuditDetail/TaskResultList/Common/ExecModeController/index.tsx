import { WorkflowResV2ExecModeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { ExecModeControllerProps } from './index.type';

const ExecModeController: React.FC<ExecModeControllerProps> = ({
  executeMode,
  sqlFileComponent,
  sqlComponent
}) => {
  // #if [ee]
  const renderEE = () => {
    if (executeMode === WorkflowResV2ExecModeEnum.sqls) {
      return sqlComponent;
    }

    return sqlFileComponent;
  };

  // #elif [ce]
  const renderCE = () => {
    return sqlComponent;
  };

  // #endif

  return (
    <>
      {/* #if [ee] */}
      {renderEE()}
      {/* #elif [ce] */}
      {renderCE()}
      {/* #endif */}
    </>
  );
};

export default ExecModeController;
