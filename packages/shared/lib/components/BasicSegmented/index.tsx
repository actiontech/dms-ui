import { SegmentedProps } from 'antd';
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
