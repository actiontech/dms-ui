import BasicSegmented from '../BasicSegmented';
import { BasicSegmentedPageProps } from './index.d';
import { TableToolbar } from '../ActiontechTable';

const BasicSegmentedPage: React.FC<BasicSegmentedPageProps> = ({
  renderContent,
  ...otherProps
}) => {
  return (
    <div>
      <TableToolbar>
        <BasicSegmented {...otherProps} />
      </TableToolbar>
      {renderContent()}
    </div>
  );
};

export default BasicSegmentedPage;
