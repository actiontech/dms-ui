import {
  FileExecuteResultCardProps,
  ResultCardProps,
  SqlExecuteResultCardProps
} from './index.type';
import SqlMode from './SqlMode';
import FileMode from './FileMode';
import ExecModeController from '../ExecModeController';

const ResultCard: React.FC<ResultCardProps> = ({ executeMode, ...props }) => {
  return (
    <ExecModeController
      sqlComponent={<SqlMode {...(props as SqlExecuteResultCardProps)} />}
      sqlFileComponent={<FileMode {...(props as FileExecuteResultCardProps)} />}
      executeMode={executeMode}
    />
  );
};

export default ResultCard;
