import {
  FileExecuteResultCardProps,
  ResultCardProps,
  SQLExecuteResultCardProps
} from './index.type';
import SQLMode from './SQLMode';
import FileMode from './FileMode';
import ExecModeController from '../ExecModeController';

const ResultCard: React.FC<ResultCardProps> = ({ executeMode, ...props }) => {
  return (
    <ExecModeController
      sqlComponent={<SQLMode {...(props as SQLExecuteResultCardProps)} />}
      sqlFileComponent={<FileMode {...(props as FileExecuteResultCardProps)} />}
      executeMode={executeMode}
    />
  );
};

export default ResultCard;
