import { Link } from 'react-router-dom';
import { PermissionControlProps } from './index.type';
import BasicButton from '../../components/BasicButton';
import usePermission from '../usePermission/usePermission';
import { useTranslation } from 'react-i18next';
import { PopconfirmMessageStyleWrapper } from '../../styleWrapper/element';
import { Popconfirm, Tooltip } from 'antd';
import classnames from 'classnames';
import { tooltipsCommonProps } from '../../components/BasicToolTips';

const PermissionControl: React.FC<PermissionControlProps> = (props) => {
  const { t } = useTranslation();
  const { actionType, text, permission, className, ...buttonProps } = props;

  const { checkActionPermission } = usePermission();

  if (!checkActionPermission(permission)) {
    return null;
  }

  const cls = classnames('actiontech-permission-actions-button', className);

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

PermissionControl.displayName = 'PermissionControl';

export default PermissionControl;
