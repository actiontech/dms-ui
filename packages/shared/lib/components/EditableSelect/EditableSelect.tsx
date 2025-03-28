import { useState } from 'react';
import { Dropdown, Menu, Input, Space, Popconfirm, Spin } from 'antd';
// import { UpOutlined, DownOutlined } from '@ant-design/icons';
import { BasicButton } from '../BasicButton';
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
  deletable = true
}) => {
  const { t } = useTranslation();
  const [newItemName, setNewItemName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<EditableSelectOption | null>(
    null
  );
  const [editName, setEditName] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setEditName('');
  };

  // const confirmDelete = (v: string) => {
  //   Modal.confirm({
  //     title: t('common.deleteConfirm'),
  //     content: t('common.deleteConfirmContent'),
  //     okText: t('common.delete'),
  //     okType: 'danger',
  //     cancelText: t('common.cancel'),
  //     onOk: () => {
  //       onDelete?.(v);
  //       if (v === value) {
  //         onChange?.('');
  //       }
  //       message.success(t('common.deleteSuccess'));
  //     }
  //   });
  // };

  const startAdding = () => {
    setIsAdding(true);
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setNewItemName('');
      setIsAdding(false);
      setEditingItem(null);
      setEditName('');
    }
    setDropdownOpen(open);
  };

  const dropdownContent = (
    <EditableSelectStyleWrapper>
      <Spin spinning={loading}>
        <Menu className="editable-select-menu">
          {options.map((option) => (
            <Menu.Item
              key={option.value}
              onClick={() => {
                onChange?.(option.value);
                setDropdownOpen(false);
              }}
              className={classNames({
                'editable-select-menu-item-active': option?.value === value
              })}
            >
              <div className="menu-item-content">
                {editingItem?.value === option.value ? (
                  <div
                    className="edit-mode"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Input
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
                    <Space className="action-buttons">
                      <EmptyBox if={updatable}>
                        <BasicButton
                          type="text"
                          size="small"
                          icon={<EditFilled />}
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(option);
                          }}
                        />
                      </EmptyBox>

                      <EmptyBox if={deletable}>
                        <Popconfirm
                          title={
                            deletionConfirmTitle ??
                            t('common.deleteConfirmTitle')
                          }
                          onConfirm={(e) => {
                            e?.stopPropagation();
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
                          />
                        </Popconfirm>
                      </EmptyBox>
                    </Space>
                  </>
                )}
              </div>
            </Menu.Item>
          ))}
          <EmptyBox if={addable}>
            <Menu.Divider />
            {isAdding ? (
              <Menu.Item onClick={(e) => e.domEvent.stopPropagation()}>
                <div className="add-mode">
                  <Input
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
              </Menu.Item>
            ) : (
              <Menu.Item
                icon={<PlusOutlined width={14} height={14} />}
                onClick={(e) => {
                  startAdding();
                }}
              >
                {addButtonText ?? t('common.add')}
              </Menu.Item>
            )}
          </EmptyBox>
        </Menu>
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
