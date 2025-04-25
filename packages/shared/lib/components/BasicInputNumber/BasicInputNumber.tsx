import classnames from 'classnames';
import { BasicInputNumberStyleWrapper } from './style';
import { ComponentControlHeight } from '../../data/common';
import { BasicInputNumberProps } from './BasicInputNumber.types';
import { ConfigProvider } from 'antd';
import { useMemo } from 'react';
import { InputNumberProps } from 'antd';

const BasicInputNumber: React.FC<BasicInputNumberProps> = (props) => {
  const { className, integer, ...params } = props;

  const inputNumberProps: InputNumberProps = useMemo(() => {
    if (integer) {
      return {
        formatter: (value) => {
          if (!value) {
            return '';
          }

          return `${Math.floor(value as number)}`;
        },
        ...params
      };
    }
    return params;
  }, [integer, params]);

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
        {...inputNumberProps}
      />
    </ConfigProvider>
  );
};

export default BasicInputNumber;
