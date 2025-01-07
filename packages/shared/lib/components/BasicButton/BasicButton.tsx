import classnames from 'classnames';
import { ConfigProvider } from 'antd';
import { BasicButtonStyleWrapper } from './style';
import { BasicButtonProps } from './BasicButton.types';

const BasicButton: React.FC<BasicButtonProps> = (props) => {
  const { children, className, noBorderIcon, ...otherParams } = props;

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            controlHeight: 32,
            controlHeightLG: 36,
            controlHeightSM: 28
          }
        }
      }}
    >
      <BasicButtonStyleWrapper
        className={classnames(
          {
            'btn-icon-no-border': noBorderIcon
          },
          className,
          'basic-button-wrapper'
        )}
        {...otherParams}
      >
        {children}
      </BasicButtonStyleWrapper>
    </ConfigProvider>
  );
};

export default BasicButton;
