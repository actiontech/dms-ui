import { useState, useMemo, type ReactNode } from 'react';
import type { CSSProperties } from 'react';
import GlobalStyles from '@mui/material/GlobalStyles';
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

const COLOR_PICKER_POPUP_CLASS_NAME = 'editable-select-color-picker-popup';

const COLOR_PICKER_POPUP_STYLE: CSSProperties = {
  zIndex: 1070
};

const COLOR_PICKER_POPUP_INNER_STYLE: CSSProperties = {
  zIndex: 1071
};

interface EditableSelectColorControlProps {
  color?: string;
  onColorChange: (color?: string) => void;
}

const EditableSelectColorControl: React.FC<EditableSelectColorControlProps> = ({
  color,
  onColorChange
}) => {
  const { t } = useTranslation();
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="editable-select-color-control">
      <span
        className="editable-select-color-swatch"
        style={{ background: color ?? undefined }}
      />
      <span className="editable-select-color-value">
        {color?.toUpperCase() ?? '-'}
      </span>
      <div className="editable-select-color-actions">
        <EmptyBox if={!!color}>
          <BasicButton
            type="link"
            size="small"
            className="editable-select-color-action"
            onClick={() => onColorChange(undefined)}
          >
            {t('common.clear')}
          </BasicButton>
        </EmptyBox>
        <ColorPicker
          value={color}
          open={pickerOpen}
          onOpenChange={setPickerOpen}
          rootClassName={COLOR_PICKER_POPUP_CLASS_NAME}
          styles={{
            popup: COLOR_PICKER_POPUP_STYLE,
            popupOverlayInner: COLOR_PICKER_POPUP_INNER_STYLE
          }}
          onChange={(nextColor) => onColorChange(nextColor.toHexString())}
          allowClear={false}
        >
          <BasicButton
            type="link"
            size="small"
            className="editable-select-color-action"
          >
            {t('common.editableSelect.select')}
          </BasicButton>
        </ColorPicker>
      </div>
    </div>
  );
};

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
  presetColors = [],
  renderColorTag
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

  const isColorFormOpen = colorable && (isAdding || !!editingItem);
  const effectiveContentMaxHeight = isColorFormOpen
    ? Math.max(contentMaxHeight, 420)
    : contentMaxHeight;

  const renderPresetColors = (
    selectedColor: string | undefined,
    onSelect: (color: string) => void
  ) => {
    if (!presetColors.length) {
      return null;
    }

    return (
      <div className="editable-select-preset-colors">
        {presetColors.map((color) => (
          <button
            key={color}
            type="button"
            aria-label={color}
            className={classNames('editable-select-preset-color', {
              'editable-select-preset-color-active': selectedColor === color
            })}
            style={{ background: color }}
            onClick={() => onSelect(color)}
          />
        ))}
      </div>
    );
  };

  const renderColorControl = (
    color: string | undefined,
    onColorChange: (color?: string) => void
  ) => (
    <EditableSelectColorControl color={color} onColorChange={onColorChange} />
  );

  const renderColorEditForm = ({
    name,
    onNameChange,
    namePlaceholder,
    color,
    onColorChange,
    previewLabel,
    autoFocus,
    footer
  }: {
    name: string;
    onNameChange: (value: string) => void;
    namePlaceholder?: string;
    color: string | undefined;
    onColorChange: (color?: string) => void;
    previewLabel: string;
    autoFocus?: boolean;
    footer: ReactNode;
  }) => (
    <div
      className="edit-mode editable-select-color-form"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="editable-select-form-section">
        <div className="editable-select-form-label">
          {t('common.editableSelect.tagName')}
        </div>
        <BasicInput
          value={name}
          autoFocus={autoFocus}
          placeholder={namePlaceholder}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </div>

      <EmptyBox if={colorable}>
        <div className="editable-select-form-section">
          <div className="editable-select-form-label">
            {t('common.editableSelect.tagColor')}
          </div>
          {renderColorControl(color, onColorChange)}
        </div>

        <EmptyBox if={!!presetColors.length}>
          <div className="editable-select-form-section">
            <div className="editable-select-form-label">
              {t('common.editableSelect.presetColors')}
            </div>
            {renderPresetColors(color, (nextColor) => onColorChange(nextColor))}
          </div>
        </EmptyBox>

        <EmptyBox if={!!renderColorTag}>
          <div className="editable-select-form-section">
            <div className="editable-select-form-label">
              {t('common.preview')}
            </div>
            <div className="editable-select-color-preview">
              {renderColorTag?.({
                label: previewLabel,
                color
              })}
            </div>
          </div>
        </EmptyBox>
      </EmptyBox>

      <div className="button-group">{footer}</div>
    </div>
  );

  const renderColorLabel = (option: Pick<EditableSelectOption, 'label' | 'color'>) => {
    if (renderColorTag) {
      return renderColorTag(option);
    }

    if (!colorable || !option.color) {
      return null;
    }

    return (
      <span
        className="editable-select-color-dot"
        style={{ background: option.color }}
      />
    );
  };

  const renderOptionLabel = (option: Pick<EditableSelectOption, 'label' | 'color'>) => {
    const colorLabel = renderColorLabel(option);

    if (renderColorTag) {
      return colorLabel ?? option.label;
    }

    return (
      <span className="editable-select-option-label">
        <EmptyBox if={!!colorLabel}>{colorLabel}</EmptyBox>
        {option.label}
      </span>
    );
  };

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
              renderColorEditForm({
                name: editName,
                onNameChange: setEditName,
                color: editColor,
                onColorChange: setEditColor,
                previewLabel: editName.trim() || option.label,
                autoFocus: true,
                footer: (
                  <>
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
                  </>
                )
              })
            ) : (
              <>
                {renderOptionLabel(option)}
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
    <EditableSelectStyleWrapper height={effectiveContentMaxHeight}>
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
              renderColorEditForm({
                name: newItemName,
                onNameChange: setNewItemName,
                namePlaceholder: t('common.form.placeholder.input'),
                color: newItemColor,
                onColorChange: setNewItemColor,
                previewLabel: newItemName.trim(),
                autoFocus: true,
                footer: (
                  <>
                    <BasicButton
                      size="small"
                      onClick={() => {
                        setIsAdding(false);
                        setNewItemName('');
                        setNewItemColor(undefined);
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
                  </>
                )
              })
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
  const selectedOption = options.find((o) => o.value === value);

  return (
    <>
      <GlobalStyles
        styles={{
          [`.${COLOR_PICKER_POPUP_CLASS_NAME}`]: {
            zIndex: `${COLOR_PICKER_POPUP_STYLE.zIndex} !important`
          },
          [`.${COLOR_PICKER_POPUP_CLASS_NAME} .ant-popover-inner`]: {
            zIndex: `${COLOR_PICKER_POPUP_INNER_STYLE.zIndex} !important`
          }
        }}
      />
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
          {selectedOption ? (
            renderColorTag ? (
              renderOptionLabel(selectedOption)
            ) : (
              <span className="editable-select-option-label">
                <EmptyBox if={colorable && !!selectedOption.color}>
                  <span
                    className="editable-select-color-dot"
                    style={{ background: selectedOption.color }}
                  />
                </EmptyBox>
                {selectedOption.label}
              </span>
            )
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
    </>
  );
};

export default EditableSelect;
