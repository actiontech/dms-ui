import { SegmentedProps } from 'antd5';
import classnames from 'classnames';
import { SegmentedStyleWrapper } from './style';

const BasicSegmented = (props: SegmentedProps) => {
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
