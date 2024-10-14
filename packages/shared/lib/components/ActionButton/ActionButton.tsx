import { Link } from 'react-router-dom';
import { ActionButtonProps } from './index.type';
import BasicButton from '../BasicButton';
import { useTranslation } from 'react-i18next';
import { PopconfirmMessageStyleWrapper } from '../../styleWrapper/element';
import { Popconfirm, Tooltip } from 'antd';
import classnames from 'classnames';
import { tooltipsCommonProps } from '../BasicToolTips';

const ActionButton: React.FC<ActionButtonProps> = (props) => {
  const { t } = useTranslation();
  const { actionType, text, className, ...buttonProps } = props;

  const cls = classnames('actiontech-config-actions-button', className);

  if (actionType === 'navigate-link') {
    return (
      <Link {...props.link}>
        <BasicButton {...buttonProps} className={cls}>
          {text}
        </BasicButton>
      </Link>
    );
  }

  if (actionType === 'confirm') {
    const { confirm } = props;
    return (
      <Popconfirm
        okText={t('common.ok')}
        cancelText={t('common.cancel')}
        {...confirm}
        title={
          typeof confirm.title === 'string' ? (
            <PopconfirmMessageStyleWrapper>
              {confirm.title}
            </PopconfirmMessageStyleWrapper>
          ) : (
            confirm.title
          )
        }
      >
        <BasicButton {...buttonProps} className={cls}>
          {text}
        </BasicButton>
      </Popconfirm>
    );
  }

  if (actionType === 'tooltip') {
    const { tooltip } = props;

    <Tooltip {...tooltip} {...tooltipsCommonProps(tooltip.title)}>
      <BasicButton {...buttonProps} className={cls}>
        {text}
      </BasicButton>
    </Tooltip>;
  }

  return (
    <BasicButton {...buttonProps} className={cls}>
      {text}
    </BasicButton>
  );
};

ActionButton.displayName = 'ActionButton';

export default ActionButton;
