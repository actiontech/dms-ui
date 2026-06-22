import React from 'react';

export type EditableSelectValue = string | number;

export interface EditableSelectOption {
  value: EditableSelectValue;
  label: string;
  color?: string;
}

export interface EditableSelectProps {
  value?: EditableSelectValue;
  onChange?: (value: EditableSelectValue) => void;
  loading?: boolean;
  onAdd?: (value: string, color?: string) => void;
  addable?: boolean;
  onUpdate?: (newData: EditableSelectOption) => void;
  updatable?: boolean;
  onDelete?: (item: EditableSelectOption) => Promise<boolean> | void;
  deletable?: boolean;
  deletionConfirmTitle?: React.ReactNode;
  options: EditableSelectOption[];
  addButtonText?: string;
  placeholder?: string;
  disabled?: boolean;
  errorMessage?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  contentMaxHeight?: number;
  colorable?: boolean;
  presetColors?: string[];
  renderColorTag?: (
    option: Pick<EditableSelectOption, 'label' | 'color'>
  ) => React.ReactNode;
}
