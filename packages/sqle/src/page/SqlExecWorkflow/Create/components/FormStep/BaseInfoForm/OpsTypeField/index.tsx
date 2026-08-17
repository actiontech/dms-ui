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
} from '../../../../../../../hooks/useOpsType';

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
 * SQL 上线创建基础信息区 · 运维类型（对齐 EnvironmentField，无色标）
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

  // 克隆/回滚继承的 uid 若不在当前字典中，视为已删 → 留空
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
      messageApi.success(
        t('execWorkflow.create.form.baseInfo.addOpsTypeSuccess')
      );
    }
  };

  const onUpdate = async (item: EditableSelectOption) => {
    clearDeleteError();
    const ok = await updateOpsType(projectID, String(item.value), item.label);
    if (ok) {
      messageApi.success(
        t('execWorkflow.create.form.baseInfo.updateOpsTypeSuccess')
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
        t('execWorkflow.create.form.baseInfo.deleteOpsTypeSuccess')
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
        addButtonText={t('execWorkflow.create.form.baseInfo.addOpsType')}
        deletionConfirmTitle={t(
          'execWorkflow.create.form.baseInfo.deleteOpsTypeConfirm'
        )}
        placeholder={t('common.form.placeholder.select', {
          name: t('execWorkflow.list.opsType')
        })}
        onAdd={onAdd}
        onUpdate={onUpdate}
        onDelete={onDelete}
        loading={operationLoading || loading}
        errorMessage={deleteErrorMessage}
      />
      {dictionaryReady && !addable && opsTypeOptions.length === 0 ? (
        <div className="workflow-ops-type-empty-member-tip">
          {t('execWorkflow.create.form.baseInfo.emptyOpsTypeMemberTip')}
        </div>
      ) : null}
    </>
  );
};

export default OpsTypeField;
