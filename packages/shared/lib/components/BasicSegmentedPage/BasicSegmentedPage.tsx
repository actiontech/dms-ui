import BasicSegmented from '../BasicSegmented';
import { BasicSegmentedPageProps } from './index.type';
import { SegmentedPageStyleWrapper } from './style';

const BasicSegmentedPage: React.FC<BasicSegmentedPageProps> = ({
  renderContent,
  ...otherProps
}) => {
  return (
    <>
      <SegmentedPageStyleWrapper>
        <BasicSegmented {...otherProps} />
      </SegmentedPageStyleWrapper>
      {renderContent()}
    </>
  );
};

export default BasicSegmentedPage;
