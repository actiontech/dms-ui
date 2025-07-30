/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2024 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */
import { observer } from 'mobx-react-lite';
import type React from 'react';

import { AppRefreshButton } from '../AppRefreshButton/AppRefreshButton';
import {
  DetailsStyleWrapper,
  ErrorInnerBlockStyleWrapper,
  ErrorStyleWrapper,
  NotificationMarkStyleWrapper
} from './style';

interface Props {
  root?: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  className?: string;
  children?: React.ReactNode;
}

enum ENotificationType {
  Info = 'Info',
  Error = 'Error',
  Success = 'Success',
  Loading = 'Loading',
  Custom = ' Custom'
}

export const DisplayError = observer<Props>(function DisplayError({
  root,
  children,
  error,
  errorInfo,
  className
}) {
  const stack = errorInfo?.componentStack || error?.stack;

  return (
    <ErrorStyleWrapper
      role="alert"
      tabIndex={0}
      $root={root}
      className={className}
    >
      <ErrorInnerBlockStyleWrapper>
        <NotificationMarkStyleWrapper type={ENotificationType.Error} />
        <p>Something went wrong.</p>
        {root && <AppRefreshButton />}
        {children}
        {error && (
          <DetailsStyleWrapper>
            {error.toString()}
            {stack && <br />}
            {stack}
          </DetailsStyleWrapper>
        )}
      </ErrorInnerBlockStyleWrapper>
    </ErrorStyleWrapper>
  );
});
