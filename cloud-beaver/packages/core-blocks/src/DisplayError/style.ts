/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2024 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */
import { styled } from '@mui/material/styles';
import { NotificationMark } from '../Snackbars/NotificationMark';

export const ErrorStyleWrapper = styled('div')<{ $root?: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  overflow: auto;

  ${({ $root }) =>
    $root &&
    `
    height: var(--app-height, 100vh);
  `}
`;

export const ErrorInnerBlockStyleWrapper = styled('div')`
  display: flex;
  margin: auto;
  padding: 16px 24px;
  flex-direction: column;
  align-items: center;
`;

export const NotificationMarkStyleWrapper = styled(NotificationMark)`
  width: 40px;
  height: 40px;
`;

export const DetailsStyleWrapper = styled('div')`
  padding: 8px 16px;
  white-space: pre-wrap;
`;
