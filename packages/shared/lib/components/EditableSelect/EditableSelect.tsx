import { useState } from 'react';
import { Dropdown, Menu, Space, Popconfirm, Spin } from 'antd';
import { BasicButton } from '../BasicButton';
import { BasicInput } from '../BasicInput';
import { useTranslation } from 'react-i18next';
import {
  EditableSelectStyleWrapper,
  EditableSelectTriggerStyleWrapper
} from './style';
import { EditableSelectProps, EditableSelectOption } from './index.type';
import classNames from 'classnames';
import { EmptyBox } from '../EmptyBox';
import {
  PlusOutlined,
  MinusCircleFilled,
  EditFilled,
  UpOutlined,
  DownOutlined
} from '@actiontech/icons';
import type { MenuProps } from 'antd';
import { ReminderInformation } from '../ReminderInformation';

const EditableSelect: React.FC<EditableSelectProps> = ({
  value,
  onChange,
  onAdd,
  onUpdate,
  onDelete,
  options = [],
  addButtonText,
  placeholder,
  disabled = false,
  deletionConfirmTitle,
  loading = false,
  addable = true,
  updatable = true,
  deletable = true,
  errorMessage
}) => {
  const { t } = useTranslation();
  const [newItemName, setNewItemName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<EditableSelectOption | null>(
    null
  );
  const [editName, setEditName] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<EditableSelectOption | null>(
    null
  );

  const handleAdd = () => {
    onAdd?.(newItemName);
    setNewItemName('');
    setIsAdding(false);
  };

  const handleUpdate = () => {
    onUpdate?.({
      value: editingItem?.value ?? '',
      label: editName.trim()
    });
    setEditingItem(null);
    setEditName('');
  };

  const startEditing = (item: EditableSelectOption) => {
    setEditingItem(item);
    setEditName(item.label);
    setDeletingItem(null);
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setEditName('');
  };

  const startAdding = () => {
    setIsAdding(true);
    setDeletingItem(null);
  };

  const resetState = () => {
    setNewItemName('');
    setIsAdding(false);
    setEditingItem(null);
    setEditName('');
    setDeletingItem(null);
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      resetState();
    }
    setDropdownOpen(open);
  };

  const generateMenuItems = (): MenuProps['items'] => {
    const optionItems: MenuProps['items'] = options.map((option) => ({
      key: option.value,
      className: classNames({
        'editable-select-menu-item-active': option?.value === value
      }),
      onClick: () => {
        onChange?.(option.value);
        setDropdownOpen(false);
        resetState();
      },
      label: (
        <div>
          <div className="menu-item-content">
            {editingItem?.value === option.value ? (
              <div className="edit-mode" onClick={(e) => e.stopPropagation()}>
                <BasicInput
                  value={editName}
                  autoFocus
                  onChange={(e) => setEditName(e.target.value)}
                />
                <div className="button-group">
                  <BasicButton size="small" onClick={cancelEditing}>
                    {t('common.cancel')}
                  </BasicButton>
                  <BasicButton
                    type="primary"
                    size="small"
                    onClick={handleUpdate}
                    disabled={!editName.trim()}
                  >
                    {t('common.save')}
                  </BasicButton>
                </div>
              </div>
            ) : (
              <>
                <span>{option.label}</span>
                <Space>
                  <EmptyBox if={updatable}>
                    <BasicButton
                      type="text"
                      size="small"
                      icon={<EditFilled />}
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(option);
                      }}
                      className="edit-button"
                    />
                  </EmptyBox>
                  <EmptyBox if={deletable}>
                    <Popconfirm
                      title={
                        deletionConfirmTitle ?? t('common.deleteConfirmTitle')
                      }
                      onConfirm={(e) => {
                        e?.stopPropagation();
                        setDeletingItem(option);
                        onDelete?.(option);
                      }}
                      onCancel={(e) => {
                        e?.stopPropagation();
                      }}
                    >
                      <BasicButton
                        type="text"
                        size="small"
                        danger
                        icon={<MinusCircleFilled width={14} height={14} />}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="delete-button"
                      />
                    </Popconfirm>
                  </EmptyBox>
                </Space>
              </>
            )}
          </div>
          <EmptyBox if={!!errorMessage && deletingItem?.value === option.value}>
            <ReminderInformation status="error" message={errorMessage ?? ''} />
          </EmptyBox>
        </div>
      )
    }));

    if (addable) {
      optionItems.push({
        type: 'divider'
      });

      if (isAdding) {
        optionItems.push({
          key: 'add-new',
          label: (
            <div className="add-mode" onClick={(e) => e.stopPropagation()}>
              <BasicInput
                value={newItemName}
                autoFocus
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder={t('common.form.placeholder.input')}
              />
              <div className="button-group">
                <BasicButton
                  size="small"
                  onClick={() => {
                    setIsAdding(false);
                    setNewItemName('');
                  }}
                >
                  {t('common.cancel')}
                </BasicButton>
                <BasicButton
                  type="primary"
                  size="small"
                  onClick={handleAdd}
                  disabled={!newItemName.trim()}
                >
                  {t('common.add')}
                </BasicButton>
              </div>
            </div>
          )
        });
      } else {
        optionItems.push({
          key: 'add-button',
          icon: <PlusOutlined width={14} height={14} />,
          onClick: () => startAdding(),
          label: addButtonText ?? t('common.add')
        });
      }
    }

    return optionItems;
  };

  const dropdownContent = (
    <EditableSelectStyleWrapper>
      <Spin spinning={loading}>
        <Menu
          className="editable-select-menu"
          items={generateMenuItems()}
          selectedKeys={value ? [value.toString()] : []}
        />
      </Spin>
    </EditableSelectStyleWrapper>
  );

  const selectedLabel = options.find((o) => o.value === value)?.label;

  return (
    <Dropdown
      dropdownRender={() => dropdownContent}
      trigger={['click']}
      open={dropdownOpen}
      onOpenChange={onOpenChange}
      disabled={disabled}
    >
      <EditableSelectTriggerStyleWrapper
        open={dropdownOpen}
        disabled={disabled}
        className={classNames('editable-select-trigger', {
          'editable-select-trigger-disabled': disabled
        })}
      >
        {selectedLabel ? (
          <span>{selectedLabel}</span>
        ) : (
          <span className="placeholder">
            {placeholder ?? t('common.form.placeholder.select')}
          </span>
        )}
        <span className="arrow-icon">
          {dropdownOpen ? (
            <UpOutlined width={20} height={20} />
          ) : (
            <DownOutlined width={20} height={20} />
          )}
        </span>
      </EditableSelectTriggerStyleWrapper>
    </Dropdown>
  );
};

export default EditableSelect;
