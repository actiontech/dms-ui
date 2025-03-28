import React from 'react';

export interface EditableSelectOption {
  value: string;
  label: string;
  [key: string]: any;
}

export interface EditableSelectProps {
  value?: string;
  onChange?: (value: string) => void;
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
