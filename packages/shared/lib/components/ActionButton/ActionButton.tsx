import { ActionButtonProps } from './index.type';
import BasicButton from '../BasicButton';
import { useTranslation } from 'react-i18next';
import { PopconfirmMessageStyleWrapper } from '../../styleWrapper/element';
import { Popconfirm } from 'antd';
import BasicToolTips from '../BasicToolTips';
import { RoutePathValue, TypedLink, TypedLinkProps } from '../TypedRouter';

const ActionButton = <T extends RoutePathValue>(
  props: ActionButtonProps<T>
) => {
  const { t } = useTranslation();

  if (props.actionType === 'navigate-link') {
    const { actionType, text, link, ...buttonProps } = props;

    return (
      <TypedLink {...(link as TypedLinkProps)}>
        <BasicButton {...buttonProps}>{text}</BasicButton>
      </TypedLink>
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
