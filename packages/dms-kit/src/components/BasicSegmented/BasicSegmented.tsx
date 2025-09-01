import classnames from 'classnames';
import { SegmentedStyleWrapper } from './style';
import { BasicSegmentedProps } from './BasicSegmented.types';

const BasicSegmented: React.FC<BasicSegmentedProps> = (props) => {
  const { className, ...otherParams } = props;

  return (
    <SegmentedStyleWrapper
      className={classnames('basic-segmented-wrapper', className)}
      //todo
      {...(otherParams as any)}
    />
  );
};

export default BasicSegmented;
