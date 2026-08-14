import { useCurrentProject } from '@actiontech/shared/lib/features';
import useCreateDataExportReduxManage from '../../hooks/index.redux';
import { useCallback, useEffect, useState } from 'react';
import UpdateInfoDrawer from './UpdateInfoDrawer';
import { BasicButton, BasicInput, PageHeader } from '@actiontech/dms-kit';
import { useTranslation } from 'react-i18next';
import BackToWorkflowList from '../../../Common/BackToWorkflowList';
import { Alert, Space, message } from 'antd';
import { ModalName } from '../../../../../data/ModalName';
import BasicInfoWrapper from '../../../Common/BasicInfoWrapper';
import AuditResultList from '../../../Common/AuditResultList';
import DataExportWorkflows from '@actiontech/shared/lib/api/base/service/DataExportWorkflows';
import { ResponseCode } from '@actiontech/dms-kit';
import { CreateDataExportPageEnum } from '../../../../../store/dataExport';
import useCheckTaskAuditRuleExceptionStatus from '../../hooks/useCheckTaskAuditRuleExceptionStatus';
import { IListDataExportTaskSQL } from '@actiontech/shared/lib/api/base/service/common';
import SubmitWorkflowButton from './SubmitWorkflowButton';
import Masking from '@actiontech/shared/lib/api/base/service/Masking';
import { CreateUnmaskingWorkflowSourceTypeEnum } from '@actiontech/shared/lib/api/base/service/common.enum';
import { PlaintextSelectionGroup } from '../../../Common/AuditResultList/index.type';
import EventEmitter from '../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../data/EmitterKey';
import { TypedLink } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/dms-kit';

type PlaintextApplyFailureDetail = {
  workflowID: string;
  failedDatasourceKeys: string[];
};

const SubmitExportWorkflow: React.FC = () => {
  const { t } = useTranslation();
  const [messageApi, messageContextHolder] = message.useMessage();
  const {
    formValues,
    initModalStatus,
    submitLoading,
    updateModalStatus,
    updateSubmitLoading,
    taskIDs,
    updatePageState,
    updateWorkflowID
  } = useCreateDataExportReduxManage();
  const { projectID } = useCurrentProject();
  const [executeSQLsIsDQL, updateExecuteSQLsTypeIsDQL] = useState(true);
  const [hasSensitiveSql, setHasSensitiveSql] = useState(false);
  const [selectedPlaintextSqlGroups, setSelectedPlaintextSqlGroups] = useState<
    PlaintextSelectionGroup[]
  >([]);
  const [plaintextReason, setPlaintextReason] = useState('');
  const [plaintextApplyFailureDetail, setPlaintextApplyFailureDetail] =
    useState<PlaintextApplyFailureDetail>();
  const {
    hasExceptionAuditRule,
    updateTaskAuditRuleExceptionStatus,
    resetTaskAuditRuleExceptionStatus
  } = useCheckTaskAuditRuleExceptionStatus();
  const onSuccessGetDataExportTaskSqls = useCallback(
    (taskSqls: IListDataExportTaskSQL[]) => {
      updateTaskAuditRuleExceptionStatus(taskSqls);
      updateExecuteSQLsTypeIsDQL?.(
        taskSqls?.every((item) => item.export_sql_type === 'dql')
      );
    },
    [updateTaskAuditRuleExceptionStatus]
  );
  const onErrorGetDataExportTaskSqls = useCallback(() => {
    resetTaskAuditRuleExceptionStatus();
    updateExecuteSQLsTypeIsDQL(true);
  }, [resetTaskAuditRuleExceptionStatus]);
  const onSubmit = async () => {
    const hasSelectedPlaintextSql = selectedPlaintextSqlGroups.length > 0;
    setPlaintextApplyFailureDetail(undefined);
    if (hasSelectedPlaintextSql && !plaintextReason.trim()) {
      messageApi.warning(
        t('dmsDataExport.create.submit.plaintextReasonRequired')
      );
      return;
    }

    updateSubmitLoading(true);
    try {
      const addWorkflowRes = await DataExportWorkflows.AddDataExportWorkflow({
        project_uid: projectID,
        data_export_workflow: {
          name: formValues?.baseValues.workflow_subject ?? '',
          desc: formValues?.baseValues.desc,
          workflow_template_id: formValues?.baseValues.workflow_template_id,
          ops_type_uid: formValues?.baseValues.ops_type_uid,
          tasks:
            taskIDs?.map((v) => ({
              task_uid: v ?? ''
            })) ?? []
        }
      });

      if (addWorkflowRes.data.code !== ResponseCode.SUCCESS) {
        return;
      }

      const exportWorkflowID =
        addWorkflowRes.data.data?.export_data_workflow_uid ?? '';
      if (hasSelectedPlaintextSql && exportWorkflowID) {
        const createUnmaskingResults = await Promise.allSettled(
          selectedPlaintextSqlGroups.map((group) =>
            Masking.CreateUnmaskingWorkflow({
              project_uid: projectID,
              unmasking_workflow: {
                datasource_uid:
                  group.datasourceUid ?? formValues?.sourceValues.dbService,
                default_schema:
                  group.defaultSchema ?? formValues?.sourceValues.schema,
                source_type: CreateUnmaskingWorkflowSourceTypeEnum.data_export,
                source_uid: exportWorkflowID,
                apply_reason: plaintextReason.trim(),
                unmasking_sqls: group.selectedSqls.map((sql) => ({
                  sql_index_id: String(sql.uid ?? ''),
                  sql_content: sql.sql ?? ''
                }))
              }
            })
          )
        );

        const hasCreateUnmaskingFailed = createUnmaskingResults.some((res) => {
          if (res.status === 'rejected') {
            return true;
          }
          return res.value.data.code !== ResponseCode.SUCCESS;
        });
        if (hasCreateUnmaskingFailed) {
          const failedDatasourceKeys = selectedPlaintextSqlGroups
            .map((group, index) => {
              const result = createUnmaskingResults[index];
              if (!result) {
                return undefined;
              }
              const isFailed =
                result.status === 'rejected' ||
                result.value.data.code !== ResponseCode.SUCCESS;
              if (!isFailed) {
                return undefined;
              }
              return (
                group.datasourceUid ??
                group.defaultSchema ??
                formValues?.sourceValues.dbService ??
                ''
              );
            })
            .filter((value): value is string => Boolean(value));
          setPlaintextApplyFailureDetail({
            workflowID: exportWorkflowID,
            failedDatasourceKeys
          });
          updateWorkflowID(exportWorkflowID);
          messageApi.error(
            t(
              'dmsDataExport.create.submit.plaintextApplyCreateFailedWithDetail',
              {
                count: failedDatasourceKeys.length
              }
            )
          );
          EventEmitter.emit(EmitterKey.DMS_Reload_Initial_Data);
          return;
        }
      }

      if (hasSelectedPlaintextSql && !exportWorkflowID) {
        messageApi.error(
          t('dmsDataExport.create.submit.plaintextApplyCreateFailed')
        );
        return;
      }

      EventEmitter.emit(EmitterKey.DMS_Reload_Initial_Data);
      updateWorkflowID(exportWorkflowID);
      updatePageState(CreateDataExportPageEnum.SUBMIT_RESULT);
    } finally {
      updateSubmitLoading(false);
    }
  };
  useEffect(() => {
    initModalStatus();
  }, [initModalStatus]);
  return (
    <>
      {messageContextHolder}
      <PageHeader
        title={<BackToWorkflowList />}
        extra={
          <Space>
            <BasicButton
              onClick={() => {
                updateModalStatus({
                  modalName: ModalName.DMS_UPDATE_EXPORT_TASK_INFO,
                  status: true
                });
              }}
              disabled={submitLoading}
            >
              {t('dmsDataExport.create.update.updateInfoAction')}
            </BasicButton>

            <SubmitWorkflowButton
              loading={submitLoading}
              onClick={onSubmit}
              hasExceptionAuditRule={hasExceptionAuditRule}
              executeSQLsIsDQL={executeSQLsIsDQL}
            />
          </Space>
        }
      />
      <BasicInfoWrapper
        title={formValues?.baseValues?.workflow_subject ?? ''}
        desc={formValues?.baseValues?.desc}
      />

      <AuditResultList
        projectID={projectID}
        taskIDs={taskIDs ?? []}
        onErrorGetDataExportTaskSqls={onErrorGetDataExportTaskSqls}
        onSuccessGetDataExportTaskSqls={onSuccessGetDataExportTaskSqls}
        onPlaintextSelectionChange={({
          selectedSqlGroups,
          hasSensitiveSql: _hasSensitiveSql
        }) => {
          setSelectedPlaintextSqlGroups(selectedSqlGroups);
          setHasSensitiveSql(_hasSensitiveSql);
        }}
      />

      {hasSensitiveSql && (
        <Space direction="vertical" style={{ width: '100%' }} size={8}>
          <Alert
            type="warning"
            showIcon
            message={t('dmsDataExport.create.submit.plaintextWarning')}
          />
          {selectedPlaintextSqlGroups.length > 0 && (
            <BasicInput.TextArea
              rows={4}
              value={plaintextReason}
              onChange={(event) => setPlaintextReason(event.target.value)}
              placeholder={t(
                'dmsDataExport.create.submit.plaintextReasonPlaceholder'
              )}
            />
          )}
          {plaintextApplyFailureDetail && (
            <Alert
              type="error"
              showIcon
              message={t(
                'dmsDataExport.create.submit.plaintextApplyCompensateGuide'
              )}
              description={
                <TypedLink
                  to={ROUTE_PATHS.BASE.DATA_EXPORT.detail}
                  params={{
                    projectID,
                    workflowID: plaintextApplyFailureDetail.workflowID
                  }}
                >
                  <BasicButton type="link">
                    {t(
                      'dmsDataExport.create.submit.plaintextApplyCompensateAction'
                    )}
                  </BasicButton>
                </TypedLink>
              }
            />
          )}
        </Space>
      )}

      <UpdateInfoDrawer />
    </>
  );
};
export default SubmitExportWorkflow;
