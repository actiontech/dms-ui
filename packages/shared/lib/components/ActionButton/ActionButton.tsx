import { Link } from 'react-router-dom';
import { ActionButtonProps } from './index.type';
import BasicButton from '../BasicButton';
import { useTranslation } from 'react-i18next';
import { PopconfirmMessageStyleWrapper } from '../../styleWrapper/element';
import { Popconfirm } from 'antd';
import BasicToolTips from '../BasicToolTips';

const ActionButton: React.FC<ActionButtonProps> = (props) => {
  const { t } = useTranslation();

  if (props.actionType === 'navigate-link') {
    const { actionType, text, link, ...buttonProps } = props;

    return (
      <Link {...props.link}>
        <BasicButton {...buttonProps}>{text}</BasicButton>
      </Link>
    );
  }

  if (props.actionType === 'confirm') {
    const { actionType, text, confirm, ...buttonProps } = props;
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
        <BasicButton {...buttonProps}>{text}</BasicButton>
      </Popconfirm>
    );
  }

  if (props.actionType === 'tooltip') {
    const { actionType, text, tooltip, ...buttonProps } = props;

    return (
      <BasicToolTips {...tooltip}>
        <BasicButton {...buttonProps}>{text}</BasicButton>
      </BasicToolTips>
    );
  }

  const { actionType, text, ...buttonProps } = props;

  return <BasicButton {...buttonProps}>{text}</BasicButton>;
};

ActionButton.displayName = 'ActionButton';

export default ActionButton;
