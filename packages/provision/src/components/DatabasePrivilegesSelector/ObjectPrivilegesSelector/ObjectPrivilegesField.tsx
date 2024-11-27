import { Typography, Space, Popconfirm } from 'antd';
import { ActiontechTable } from '@actiontech/shared/lib/components/ActiontechTable';
import { useTranslation } from 'react-i18next';
import { BasicButton } from '@actiontech/shared';
import BasicEmpty from '@actiontech/shared/lib/components/BasicEmpty';
import ObjectPrivilegesModal from './ObjectPrivilegesModal';
import { useState } from 'react';
import { cloneDeep } from 'lodash';
import {
  PrivilegesFieldStyleWrapper,
  PrivilegesFieldTitleStyleWrapper
} from './style';
import {
  ObjectPrivilegeTableFieldProps,
  ObjectPrivilegeValues
} from './index.type';
import {
  ObjectPrivilegesTableActions,
  ObjectPrivilegesTableColumn
} from './ObjectPrivilegesTableColumn';

const ObjectPrivilegesField: React.FC<ObjectPrivilegeTableFieldProps> = ({
  value = [],
  onChange,
  selectedDBServiceID,
  objectPrivilegeOptions,
  getOperationPermissionPending
}) => {
  const [visible, setVisible] = useState<boolean>(false);

  const [editId, setEditIndex] = useState<string>();

  const { t } = useTranslation();

  const onSubmit = (param: ObjectPrivilegeValues[]) => {
    onChange?.(param);
  };

  const onCancel = () => {
    setEditIndex(undefined);
    setVisible(false);
  };

  const onClear = () => {
    setEditIndex(undefined);
    onChange?.([]);
  };

  const onAdd = () => {
    setVisible(true);
  };

  const onEdit = (id: string) => {
    setEditIndex(id);
    setVisible(true);
  };

  const onRemove = (id: string) => {
    const data = cloneDeep(value);
    const index = data.findIndex((i) => i.id === id);
    data.splice(index, 1);
    onChange?.(data);
  };

  return (
    <PrivilegesFieldStyleWrapper>
      <PrivilegesFieldTitleStyleWrapper>
        <span className="privileges-field-title">
          {t('databaseAccount.create.objectPrivilegesOverview')}
        </span>
        <Space>
          <Popconfirm
            title={t('databaseAccount.create.form.clearConfirmTips')}
            onConfirm={onClear}
            okText={t('common.ok')}
          >
            <BasicButton danger disabled={!value?.length}>
              {t('databaseAccount.create.form.resetObjectPrivileges')}
            </BasicButton>
          </Popconfirm>
          <BasicButton
            onClick={onAdd}
            type="primary"
            disabled={!selectedDBServiceID}
          >
            {t('databaseAccount.create.form.addObjectPrivileges')}
          </BasicButton>
        </Space>
      </PrivilegesFieldTitleStyleWrapper>
      <ActiontechTable
        rowKey={(record) => `${record.id}`}
        dataSource={value}
        columns={ObjectPrivilegesTableColumn()}
        actions={ObjectPrivilegesTableActions(onEdit, onRemove)}
        locale={{
          emptyText: (
            <BasicEmpty
              emptyCont={
                <Typography.Paragraph type="secondary">
                  {t('databaseAccount.create.form.extraEmptyTips')}
                </Typography.Paragraph>
              }
            />
          )
        }}
        pagination={false}
      />
      <ObjectPrivilegesModal
        visible={visible}
        onCancel={onCancel}
        service={selectedDBServiceID}
        onSubmit={onSubmit}
        data={value}
        editId={editId}
        objectPrivilegeOptions={objectPrivilegeOptions}
        getOperationPermissionPending={getOperationPermissionPending}
      />
    </PrivilegesFieldStyleWrapper>
  );
};

export default ObjectPrivilegesField;
