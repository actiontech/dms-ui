import BasicSegmented from '../BasicSegmented';
import { BasicSegmentedPageProps } from './index.d';
import { TableToolbar } from '../ActiontechTable';

const BasicSegmentedPage: React.FC<BasicSegmentedPageProps> = ({
  renderContent,
  ...otherProps
}) => {
  return (
    <>
      <TableToolbar>
        <BasicSegmented {...otherProps} />
      </TableToolbar>
      {renderContent()}
    </>
  );
};

export default BasicSegmentedPage;
