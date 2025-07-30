/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2025 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */
import { observer } from 'mobx-react-lite';
import { Icon } from '../Icon';
import { IconOrImage } from '../IconOrImage';
import { useErrorDetails } from '../hooks/useErrorDetails';
import { useT } from '@cloudbeaver/core-localization';
import { BasicButton } from '@actiontech/shared';

interface Props {
  exception?: Error | null;
  icon?: boolean;
  inline?: boolean;
  className?: string;
  onRetry?: () => void;
  onClose?: () => void;
}

export const ExceptionMessage = observer<Props>(function ExceptionMessage({
  exception = null,
  icon,
  inline,
  className,
  onRetry,
  onClose
}) {
  const t = useT();
  const error = useErrorDetails(exception);

  if (error.refresh) {
    const retry = onRetry;
    const refresh = error.refresh;
    onRetry = () => {
      retry?.();
      refresh();
    };
  }

  if (!exception) {
    return null;
  }

  return (
    <div className={s(styles, { error: true, icon, inline }, className)}>
      <div className={s(styles, { errorIcon: true })} title={error.message}>
        <IconOrImage
          className={s(styles, { iconOrImage: true })}
          icon={
            inline || icon
              ? '/icons/error_icon_sm.svg'
              : '/icons/error_icon.svg'
          }
        />
      </div>
      {!icon && (
        <>
          <div className={s(styles, { errorData: true })}>
            <h2 className={s(styles, { errorName: true })}>
              <span>{t('core_blocks_exception_message_error_title')}</span>
            </h2>
            <div className={s(styles, { errorMessage: true })}>
              {(error.hasDetails && error.message) ||
                t('core_blocks_exception_message_error_message')}{' '}
              {onRetry && t('ui_please_retry')}
            </div>
            <div className={s(styles, { errorActions: true })}>
              <BasicButton disabled={error.isOpen} onClick={error.open}>
                {t('ui_errors_details')}
              </BasicButton>
              {onRetry && (
                <Button type="button" onClick={onRetry}>
                  {t('ui_processing_retry')}
                </Button>
              )}
            </div>
          </div>
          {onClose && (
            <div className={s(styles, { errorActionClose: true })}>
              <Icon name="cross" viewBox="0 0 16 16" onClick={onClose} />
            </div>
          )}
        </>
      )}
    </div>
  );
});
