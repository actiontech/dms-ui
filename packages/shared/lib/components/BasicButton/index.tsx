import classnames from 'classnames';
import { ButtonProps, ConfigProvider } from 'antd5';
import { BasicButtonStyleWrapper } from './style';

interface IBasicButton extends ButtonProps {
  noBorderIcon?: boolean;
}

const BasicButton = (props: IBasicButton) => {
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
