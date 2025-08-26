import { useTranslation } from 'react-i18next';
import React from 'react';
import { CheckOutlined, CopyOutlined } from '@ant-design/icons';
import Copy from '../../utils/Copy';
import { CopyIconStyleWrapper } from './style';
import classNames from 'classnames';
import { BasicToolTip } from '../BasicToolTip';
import { CopyIconProps } from './CopyIcon.types';

const CopyIcon: React.FC<CopyIconProps> = ({
  text,
  children,
  tooltips = true,
  onCopyComplete,
  className,
  onCustomCopy
}) => {
  const { t } = useTranslation();
  const [copied, setCopied] = React.useState(false);
  const copyIdRef = React.useRef<number>();

  const cleanCopyId = () => {
    window.clearTimeout(copyIdRef.current!);
  };

  React.useEffect(() => cleanCopyId, []);

  const onCopyClick = async (e?: React.MouseEvent<HTMLDivElement>) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (!!onCustomCopy) {
      await onCustomCopy();
    } else {
      Copy.copyTextByTextarea(text || (children && String(children)) || '');
    }
    setCopied(true);

    cleanCopyId();
    copyIdRef.current = window.setTimeout(() => {
      setCopied(false);
    }, 3000);

    onCopyComplete?.(e);
  };

  const tooltipsTitle = React.useMemo(() => {
    if (!tooltips) {
      return '';
    }
    if (tooltips === true) {
      return copied ? t('common.copied') : '';
    }

    return copied ? tooltips : '';
  }, [copied, t, tooltips]);

  return (
    <BasicToolTip key="copy" title={tooltipsTitle}>
      <CopyIconStyleWrapper
        onClick={onCopyClick}
        copied={copied}
        className={classNames('actiontech-copy-icon', className)}
      >
        {copied ? <CheckOutlined /> : <CopyOutlined />}
      </CopyIconStyleWrapper>
    </BasicToolTip>
  );
};

export default CopyIcon;
