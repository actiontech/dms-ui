import classnames from 'classnames';
import { BasicButtonStyleWrapper } from './style';
import { BasicButtonProps } from './BasicButton.types';

const BasicButton: React.FC<BasicButtonProps> = (props) => {
  const { children, className, noBorderIcon, ...otherParams } = props;

  return (
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
  );
};

export default BasicButton;
