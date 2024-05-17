import { PermissionTableFieldProps, PermissionsType } from '../../index.type';
import { Form, Typography, Space, Popconfirm } from 'antd';
import { ActiontechTable } from '@actiontech/shared/lib/components/ActiontechTable';
import { useTranslation } from 'react-i18next';
import {
  PermissionFieldTitleStyleWrapper,
  PermissionFieldStyleWrapper
} from '../../style';
import { BasicButton, EmptyBox } from '@actiontech/shared';
import {
  PermissionTableColumn,
  PermissionTableActions
} from './PermissionTableColumn';
import BasicEmpty from '@actiontech/shared/lib/components/BasicEmpty';
import PermissionModal from './PermissionModal';
import { useState } from 'react';
import { cloneDeep } from 'lodash';

const PermissionsField: React.FC<PermissionTableFieldProps> = ({
  value = [],
  onChange
}) => {
  const form = Form.useFormInstance();

  const [visible, setVisible] = useState<boolean>(false);

  const [editId, setEditIndex] = useState<string>();

  const { t } = useTranslation();

  const service = Form.useWatch('service', form);

  const onSubmit = (param: PermissionsType[]) => {
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
    <PermissionFieldStyleWrapper>
      <PermissionFieldTitleStyleWrapper>
        <span className="permission-field-title">
          {t('databaseAccount.create.permissionInfoOverview')}
        </span>
        <EmptyBox if={!!value?.length}>
          <Space>
            <Popconfirm
              title={t('databaseAccount.create.form.clearConfirmTips')}
              onConfirm={onClear}
              okText={t('common.ok')}
            >
              <BasicButton danger>
                {t('databaseAccount.create.form.resetPermission')}
              </BasicButton>
            </Popconfirm>
            <BasicButton onClick={onAdd}>
              {t('databaseAccount.create.form.addDataPermission')}
            </BasicButton>
          </Space>
        </EmptyBox>
      </PermissionFieldTitleStyleWrapper>
      <ActiontechTable
        rowKey={(record) => `${record.id}`}
        dataSource={value}
        columns={PermissionTableColumn()}
        actions={PermissionTableActions(onEdit, onRemove)}
        locale={{
          emptyText: (
            <BasicEmpty>
              <>
                <Typography.Paragraph type="secondary">
                  {t('databaseAccount.create.form.extraEmptyTips')}
                </Typography.Paragraph>
                <BasicButton type="primary" onClick={onAdd}>
                  {t('databaseAccount.create.form.addDataPermission')}
                </BasicButton>
              </>
            </BasicEmpty>
          )
        }}
        pagination={false}
      />
      <PermissionModal
        visible={visible}
        onCancel={onCancel}
        service={service}
        onSubmit={onSubmit}
        data={value}
        editId={editId}
      />
    </PermissionFieldStyleWrapper>
  );
};

export default PermissionsField;
