import { InputNumberProps, ConfigProvider } from 'antd';
import classnames from 'classnames';
import { BasicInputNumberStyleWrapper } from './style';
import { ComponentControlHeight } from '../../data/common';

export interface IBasicInputNumber extends InputNumberProps {}

const BasicInputNumber = (props: IBasicInputNumber) => {
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
