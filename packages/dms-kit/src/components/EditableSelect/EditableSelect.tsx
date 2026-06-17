import { useState, useMemo } from 'react';
import { Dropdown, Menu, Space, Popconfirm, Spin, ColorPicker } from 'antd';
import { BasicButton } from '../BasicButton';
import { BasicInput } from '../BasicInput';
import { useTranslation } from 'react-i18next';
import {
  EditableSelectStyleWrapper,
  EditableSelectTriggerStyleWrapper
} from './style';
import {
  EditableSelectProps,
  EditableSelectOption
} from './EditableSelect.types';
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
import { BasicEmpty } from '../BasicEmpty';

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
  errorMessage,
  searchable = true,
  searchPlaceholder,
  contentMaxHeight = 320,
  colorable = false,
  presetColors = []
}) => {
  const { t } = useTranslation();
  const [newItemName, setNewItemName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<EditableSelectOption | null>(
    null
  );
  const [editName, setEditName] = useState('');
  const [newItemColor, setNewItemColor] = useState<string>();
  const [editColor, setEditColor] = useState<string>();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState<EditableSelectOption | null>(
    null
  );
  const [searchValue, setSearchValue] = useState('');

  const handleAdd = () => {
    onAdd?.(newItemName, newItemColor);
    setNewItemName('');
    setNewItemColor(undefined);
    setIsAdding(false);
  };

  const handleUpdate = () => {
    onUpdate?.({
      value: editingItem?.value ?? '',
      label: editName.trim(),
      color: editColor
    });
    setEditingItem(null);
    setEditName('');
    setEditColor(undefined);
  };

  const startEditing = (item: EditableSelectOption) => {
    setEditingItem(item);
    setEditName(item.label);
    setEditColor(item.color);
    setDeletingItem(null);
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setEditName('');
    setEditColor(undefined);
  };

  const startAdding = () => {
    setIsAdding(true);
    setDeletingItem(null);
  };

  const resetState = () => {
    setNewItemName('');
    setNewItemColor(undefined);
    setIsAdding(false);
    setEditingItem(null);
    setEditName('');
    setEditColor(undefined);
    setDeletingItem(null);
    setSearchValue('');
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      resetState();
    }
    setDropdownOpen(open);
  };

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchValue.trim()) {
      return options;
    }

    const searchTerm = searchValue.toLowerCase().trim();
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm)
    );
  }, [searchable, searchValue, options]);

  const colorPresets = presetColors.length
    ? [
        {
          label: '',
          colors: presetColors
        }
      ]
    : undefined;

  const generateMenuItems = (): MenuProps['items'] => {
    const optionItems: MenuProps['items'] = filteredOptions.map((option) => ({
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
                <EmptyBox if={colorable}>
                  <div className="editable-select-color-row">
                    <span>{t('common.color')}</span>
                    <ColorPicker
                      value={editColor}
                      presets={colorPresets}
                      onChangeComplete={(color) =>
                        setEditColor(color.toHexString())
                      }
                      allowClear
                      onClear={() => setEditColor(undefined)}
                    />
                  </div>
                </EmptyBox>
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
                <span className="editable-select-option-label">
                  <EmptyBox if={colorable && !!option.color}>
                    <span
                      className="editable-select-color-dot"
                      style={{ background: option.color }}
                    />
                  </EmptyBox>
                  {option.label}
                </span>
                <Space>
                  <EmptyBox if={updatable}>
                    <BasicButton
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

    return optionItems;
  };

  const dropdownContentRender = (
    <EditableSelectStyleWrapper height={contentMaxHeight}>
      <Spin spinning={loading}>
        <EmptyBox if={searchable}>
          <div className="editable-select-search">
            <BasicInput
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={
                searchPlaceholder ??
                t('common.actiontechTable.searchInput.placeholder')
              }
              allowClear
              bordered={false}
            />
          </div>
        </EmptyBox>

        <EmptyBox if={!!filteredOptions.length} defaultNode={<BasicEmpty />}>
          <Menu
            className="editable-select-menu"
            items={generateMenuItems()}
            selectedKeys={value ? [value.toString()] : []}
          />
        </EmptyBox>

        <EmptyBox if={addable}>
          <div className="editable-select-add-section">
            {isAdding ? (
              <div className="edit-mode" onClick={(e) => e.stopPropagation()}>
                <BasicInput
                  value={newItemName}
                  autoFocus
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder={t('common.form.placeholder.input')}
                />
                <EmptyBox if={colorable}>
                  <div className="editable-select-color-row">
                    <span>{t('common.color')}</span>
                    <ColorPicker
                      value={newItemColor}
                      presets={colorPresets}
                      onChangeComplete={(color) =>
                        setNewItemColor(color.toHexString())
                      }
                      allowClear
                      onClear={() => setNewItemColor(undefined)}
                    />
                  </div>
                </EmptyBox>
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
            ) : (
              <Space
                className="add-button-wraper"
                onClick={() => startAdding()}
              >
                <PlusOutlined width={14} height={14} />
                {addButtonText ?? t('common.add')}
              </Space>
            )}
          </div>
        </EmptyBox>
      </Spin>
    </EditableSelectStyleWrapper>
  );
  const selectedLabel = options.find((o) => o.value === value)?.label;
  const selectedColor = options.find((o) => o.value === value)?.color;

  return (
    <Dropdown
      dropdownRender={() => dropdownContentRender}
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
          <span className="editable-select-option-label">
            <EmptyBox if={colorable && !!selectedColor}>
              <span
                className="editable-select-color-dot"
                style={{ background: selectedColor }}
              />
            </EmptyBox>
            {selectedLabel}
          </span>
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
