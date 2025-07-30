/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2025 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */
import { App, useService } from '@cloudbeaver/core-di';
import { BasicButton } from '@actiontech/shared';

interface IProps {
  className?: string;
}

export const AppRefreshButton: React.FC<IProps> = function AppRefreshButton({
  className
}) {
  const app = useService(App);

  function refresh() {
    app.restart();
  }

  return (
    <BasicButton onClick={refresh} className={className}>
      Refresh
    </BasicButton>
  );
};
