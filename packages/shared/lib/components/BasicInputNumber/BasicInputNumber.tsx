import classnames from 'classnames';
import { BasicInputNumberStyleWrapper } from './style';
import { ComponentControlHeight } from '../../data/common';
import { BasicInputNumberProps } from './BasicInputNumber.types';
import { ConfigProvider } from 'antd';

const BasicInputNumber: React.FC<BasicInputNumberProps> = (props) => {
  const { className, ...params } = props;

  return (
    <ConfigProvider
      theme={{
        components: {
          InputNumber: {
            controlHeight: ComponentControlHeight.default,
            controlHeightLG: ComponentControlHeight.lg,
            controlHeightSM: ComponentControlHeight.sm
          }
        }
      }}
    >
      <BasicInputNumberStyleWrapper
        size="large"
        className={classnames('basic-inputNumber-wrapper', className)}
        {...params}
      />
    </ConfigProvider>
  );
};

export default BasicInputNumber;
