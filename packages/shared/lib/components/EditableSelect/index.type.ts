import React from 'react';

export type EditableSelectValue = string | number;

export interface EditableSelectOption {
  value: EditableSelectValue;
  label: string;
}

export interface EditableSelectProps {
  value?: EditableSelectValue;
  onChange?: (value: EditableSelectValue) => void;
  loading?: boolean;
  onAdd?: (value: string) => void;
  addable?: boolean;
  onUpdate?: (newData: EditableSelectOption) => void;
  updatable?: boolean;
  onDelete?: (item: EditableSelectOption) => void;
  deletable?: boolean;
  deletionConfirmTitle?: React.ReactNode;
  options: EditableSelectOption[];
  addButtonText?: string;
  placeholder?: string;
  disabled?: boolean;
}
