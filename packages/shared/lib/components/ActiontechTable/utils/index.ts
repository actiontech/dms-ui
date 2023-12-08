import React from 'react';
import { ActiontechTableColumn } from '../index.type';

export const extractTextFromReactNode = (node: React.ReactNode): string => {
  if (typeof node === 'string') {
    return node;
  }

  if (React.isValidElement(node)) {
    const { children } = node.props;
    if (children) {
      if (Array.isArray(children)) {
        return children.map(extractTextFromReactNode).join('');
      } else {
        return extractTextFromReactNode(children);
      }
    }
  }

  return '';
};

export const getColumnsLabel = <
  T extends Record<string, any>,
  F extends Record<string, any>
>(
  labelInColumns: ActiontechTableColumn<T, F>[0]['title']
): string => {
  if (typeof labelInColumns === 'string') {
    return labelInColumns;
  }

  if (typeof labelInColumns === 'object') {
    return extractTextFromReactNode(labelInColumns);
  }

  if (typeof labelInColumns === 'function') {
    const value = labelInColumns({});

    return extractTextFromReactNode(value);
  }

  return '';
};

export const checkButtonPermissions = <T extends Record<string, any>>(
  permissions: ((record?: T) => boolean) | boolean | undefined,
  record?: T
): boolean => {
  if (typeof permissions === 'function') {
    return permissions(record);
  }

  if (typeof permissions === 'boolean') {
    return permissions;
  }

  // 当没有 permissions 时, 默认显示按钮
  return true;
};

export const checkButtonDisabled = <T extends Record<string, any>>(
  disabled: ((record?: T) => boolean) | boolean | undefined,
  record?: T
): boolean => {
  if (typeof disabled === 'function') {
    return disabled(record);
  }

  if (typeof disabled === 'boolean') {
    return disabled;
  }

  return false;
};

export const setClassNameForColumns = <
  T,
  F,
  OtherColumnKeys extends string = ''
>(
  columns: ActiontechTableColumn<T, F, OtherColumnKeys>
) => {
  return columns.map((column, i) => {
    if (i === 0) {
      return { ...column, className: 'first-col' };
    }
    if (i === columns.length - 1) {
      return { ...column, className: 'last-col' };
    }
    return column;
  });
};
