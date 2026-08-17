import { EditableSelect } from '@actiontech/dms-kit';
import type {
  EditableSelectProps,
  EditableSelectOption,
  EditableSelectValue
} from '@actiontech/dms-kit/es/components/EditableSelect/EditableSelect.types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import useOpsType, {
  useOpsTypeEditablePermissions
} from 'sqle/src/hooks/useOpsType';

interface OpsTypeFieldProps
  extends Omit<
    EditableSelectProps,
    | 'options'
    | 'onAdd'
    | 'onUpdate'
    | 'onDelete'
    | 'addable'
    | 'updatable'
    | 'deletable'
  > {}

/**
 * 数据导出创建基础信息区 · 运维类型（对齐 SQL 上线 OpsTypeField / EnvironmentField，无色标）
 */
const OpsTypeField: React.FC<OpsTypeFieldProps> = ({
  value,
  onChange,
  ...rest
}) => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const { projectID, projectName } = useCurrentProject();
  const [fetchStarted, setFetchStarted] = useState(false);
  const {
    opsTypeOptions,
    loading,
    operationLoading,
    updateOpsTypeList,
    createOpsType,
    updateOpsType,
    deleteOpsType,
    deleteErrorMessage,
    clearDeleteError
  } = useOpsType();
  const { addable, updatable, deletable } =
    useOpsTypeEditablePermissions(projectName);

  useEffect(() => {
    if (projectID) {
      setFetchStarted(false);
      updateOpsTypeList(projectID);
    }
  }, [projectID, updateOpsTypeList]);

  useEffect(() => {
    if (loading) {
      setFetchStarted(true);
    }
  }, [loading]);

  const dictionaryReady = fetchStarted && !loading;

  // 继承的 uid 若不在当前字典中，视为已删 → 留空
  // 须等字典请求经历 loading 后再判定，避免空选项误清空
  useEffect(() => {
    if (!dictionaryReady) {
      return;
    }
    if (value === undefined || value === null || value === '') {
      return;
    }
    const exists = opsTypeOptions.some(
      (item) => String(item.value) === String(value)
    );
    if (!exists) {
      onChange?.(undefined as unknown as EditableSelectValue);
    }
  }, [dictionaryReady, opsTypeOptions, value, onChange]);

  const onAdd = async (name: string) => {
    clearDeleteError();
    const ok = await createOpsType(projectID, name);
    if (ok) {
      messageApi.success(t('dmsDataExport.create.form.base.addOpsTypeSuccess'));
    }
  };

  const onUpdate = async (item: EditableSelectOption) => {
    clearDeleteError();
    const ok = await updateOpsType(projectID, String(item.value), item.label);
    if (ok) {
      messageApi.success(
        t('dmsDataExport.create.form.base.updateOpsTypeSuccess')
      );
    }
  };

  const onDelete = async (item: EditableSelectOption): Promise<boolean> => {
    clearDeleteError();
    const result = await deleteOpsType(
      projectID,
      projectName,
      String(item.value)
    );
    if (result.ok) {
      messageApi.success(
        t('dmsDataExport.create.form.base.deleteOpsTypeSuccess')
      );
      if (String(value) === String(item.value)) {
        onChange?.(undefined as unknown as EditableSelectValue);
      }
      return true;
    }
    return false;
  };

  return (
    <>
      {contextHolder}
      <EditableSelect
        {...rest}
        value={value}
        onChange={onChange}
        searchable
        options={opsTypeOptions}
        addable={addable}
        updatable={updatable}
        deletable={deletable}
        addButtonText={t('dmsDataExport.create.form.base.addOpsType')}
        deletionConfirmTitle={t(
          'dmsDataExport.create.form.base.deleteOpsTypeConfirm'
        )}
        placeholder={t('common.form.placeholder.select', {
          name: t('dmsDataExport.list.column.opsType')
        })}
        onAdd={onAdd}
        onUpdate={onUpdate}
        onDelete={onDelete}
        loading={operationLoading || loading}
        errorMessage={deleteErrorMessage}
      />
      {dictionaryReady && !addable && opsTypeOptions.length === 0 ? (
        <div className="workflow-ops-type-empty-member-tip">
          {t('dmsDataExport.create.form.base.emptyOpsTypeMemberTip')}
        </div>
      ) : null}
    </>
  );
};

export default OpsTypeField;
