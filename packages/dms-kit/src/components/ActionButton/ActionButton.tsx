/* eslint-disable @typescript-eslint/no-unused-vars */
import { ActionButtonProps } from './ActionButton.types';
import { useTranslation } from 'react-i18next';
import { Popconfirm } from 'antd';
import { PopconfirmMessageStyleWrapper } from '../../styleWrapper/element';
import { BasicButton } from '../BasicButton';
import { BasicToolTip } from '../BasicToolTip';

const ActionButton = (props: ActionButtonProps) => {
  const { t } = useTranslation();

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
      <BasicToolTip {...tooltip}>
        <BasicButton {...buttonProps}>{text}</BasicButton>
      </BasicToolTip>
    );
  }

  const { actionType, text, ...buttonProps } = props;

  return <BasicButton {...buttonProps}>{text}</BasicButton>;
};

ActionButton.displayName = 'ActionButton';

export default ActionButton;
